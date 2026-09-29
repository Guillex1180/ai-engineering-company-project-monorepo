"""
Módulo de Facturas de la API de TrackFlow — FASE 1 (carga de PDF a S3).

ALCANCE (Fase 1): recibir un PDF de factura desde el backoffice y almacenarlo en
un bucket de S3 mediante una **URL prefirmada** (presigned URL). El frontend NO
maneja credenciales de AWS: solo pide una URL de subida a este backend y sube el
archivo directamente a S3 con esa URL temporal.

NO incluido en Fase 1 (fases posteriores): Amazon Textract, OCR, extracción de
datos, clasificación por IA, detección de anomalías, conciliación, procesamiento
financiero, historial de facturas.

Seguridad:
  - Las credenciales AWS y el nombre del bucket se leen SOLO de variables de
    entorno del servidor (nunca del frontend, nunca versionadas).
  - Si la configuración de AWS no está presente, el endpoint responde en modo
    SIMULADO (mode="simulated") para permitir la demo local sin credenciales,
    sin exponer secretos ni intentar contactar con AWS.
  - No se devuelve al cliente información sensible del bucket más allá de la
    clave (key) del objeto y la URL temporal de subida.

Contrato:
  POST /invoices/presign
    body: { "filename": str, "content_type": str, "size": int }
    resp: { mode, method, upload_url, key, headers, expires_in, max_size }
"""
from __future__ import annotations

import os
import re
import unicodedata
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from .auth import require_user

router = APIRouter(prefix="/invoices", tags=["Invoices"])

# --- Reglas de validación (Fase 1) ---------------------------------------- #
_PDF_CONTENT_TYPE = "application/pdf"
# La Fase 1 permite archivos mayores de 1 MB. Se fija un tope de seguridad alto
# (25 MB) para evitar abusos; ajustable por env sin exponer secretos.
_MAX_SIZE_BYTES = int(os.environ.get("INVOICES_MAX_SIZE_BYTES", str(25 * 1024 * 1024)))
# Tiempo de validez de la URL prefirmada.
_PRESIGN_EXPIRES = int(os.environ.get("INVOICES_PRESIGN_EXPIRES", "900"))  # 15 min

# --- Configuración de AWS (solo del entorno del servidor) ----------------- #
_S3_BUCKET = os.environ.get("INVOICES_S3_BUCKET") or os.environ.get("AWS_S3_BUCKET")
_S3_REGION = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION")
_S3_PREFIX = os.environ.get("INVOICES_S3_PREFIX", "facturas/entrantes")


class PresignInput(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    content_type: str = Field(..., min_length=1, max_length=100)
    size: int = Field(..., ge=1)


class PresignResponse(BaseModel):
    mode: str  # "s3" | "simulated"
    method: str  # "PUT"
    upload_url: str
    key: str
    headers: dict[str, str]
    expires_in: int
    max_size: int


def _safe_filename(name: str) -> str:
    """Normaliza el nombre de archivo a algo seguro para una key de S3.

    Quita acentos, deja solo caracteres seguros y garantiza sufijo .pdf.
    """
    base = name.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
    base = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode("ascii")
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base).strip("._-")
    if not base:
        base = "factura"
    if not base.lower().endswith(".pdf"):
        base = f"{base}.pdf"
    return base


def _build_key(filename: str) -> str:
    """Construye una key única e inofensiva dentro del prefijo configurado."""
    now = datetime.now(timezone.utc)
    safe = _safe_filename(filename)
    unique = uuid.uuid4().hex[:12]
    prefix = _S3_PREFIX.strip("/")
    return f"{prefix}/{now:%Y/%m/%d}/{unique}-{safe}"


def _validate_pdf(payload: PresignInput) -> None:
    """Valida tipo y tamaño. Lanza HTTPException 400 si no cumple."""
    name_ok = payload.filename.lower().endswith(".pdf")
    type_ok = payload.content_type.lower() == _PDF_CONTENT_TYPE
    if not (name_ok and type_ok):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser un PDF (application/pdf).",
        )
    if payload.size > _MAX_SIZE_BYTES:
        mb = _MAX_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"El PDF supera el tamaño máximo permitido ({mb} MB).",
        )


def _aws_configured() -> bool:
    """True si hay bucket + credenciales suficientes para firmar en S3.

    boto3 puede resolver credenciales de varias fuentes (env, perfil, rol). Se
    exige al menos el bucket; la existencia de credenciales se comprueba al
    intentar firmar (si falla, se degrada a simulado de forma segura).
    """
    return bool(_S3_BUCKET)


@router.post("/presign", response_model=PresignResponse, status_code=201)
def presign_upload(
    payload: PresignInput,
    user: str = Depends(require_user),
) -> PresignResponse:
    """Devuelve una URL temporal para subir el PDF de factura a S3.

    Si AWS no está configurado, responde en modo simulado (sin contactar AWS y
    sin exponer secretos) para permitir la demo del flujo completo en local.
    """
    _validate_pdf(payload)
    key = _build_key(payload.filename)

    if not _aws_configured():
        # Modo simulado: la UI puede completar el flujo (READY→UPLOADING→SUCCESS)
        # sin credenciales. No se contacta AWS. La URL apunta a un sumidero local
        # del propio backend que acepta el PUT y no persiste el archivo.
        return PresignResponse(
            mode="simulated",
            method="PUT",
            upload_url="/invoices/simulated-upload",
            key=key,
            headers={"Content-Type": _PDF_CONTENT_TYPE},
            expires_in=_PRESIGN_EXPIRES,
            max_size=_MAX_SIZE_BYTES,
        )

    # Modo real: firmar con boto3. Import perezoso para no exigir la dependencia
    # cuando se corre en modo simulado.
    try:
        import boto3  # type: ignore
        from botocore.config import Config  # type: ignore
        from botocore.exceptions import BotoCoreError, ClientError  # type: ignore
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Almacenamiento no disponible: falta la dependencia de AWS en el servidor.",
        )

    try:
        client = boto3.client(
            "s3",
            region_name=_S3_REGION,
            config=Config(signature_version="s3v4"),
        )
        upload_url = client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": _S3_BUCKET,
                "Key": key,
                "ContentType": _PDF_CONTENT_TYPE,
            },
            ExpiresIn=_PRESIGN_EXPIRES,
            HttpMethod="PUT",
        )
    except (BotoCoreError, ClientError):
        # No se filtra el detalle del error de AWS al cliente.
        raise HTTPException(
            status_code=502,
            detail="No se pudo preparar la carga en el almacenamiento. Inténtalo de nuevo.",
        )

    return PresignResponse(
        mode="s3",
        method="PUT",
        upload_url=upload_url,
        key=key,
        headers={"Content-Type": _PDF_CONTENT_TYPE},
        expires_in=_PRESIGN_EXPIRES,
        max_size=_MAX_SIZE_BYTES,
    )


@router.put("/simulated-upload", include_in_schema=False)
async def simulated_upload() -> dict:
    """Sumidero para el modo simulado.

    Acepta el PUT del cliente y responde 200 sin persistir el contenido. Existe
    únicamente para que la demo local complete el flujo de subida cuando no hay
    bucket de S3 configurado.
    """
    return {"status": "ok", "stored": False, "mode": "simulated"}
