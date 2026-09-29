"""
Autenticación de DEMOSTRACIÓN para la API de TrackFlow.

AVISO DE ALCANCE: mecanismo simple para el ejercicio, no apto para producción.
Un usuario fijo de operaciones se autentica con POST /auth/login y recibe un
token opaco (Bearer). Los tokens se guardan en memoria del proceso. No se
almacenan contraseñas reales ni secretos: las credenciales demo están aquí solo
para permitir la prueba local.
"""
from __future__ import annotations

import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

# Credenciales de DEMOSTRACIÓN (no son secretos de producción).
_DEMO_USERNAME = "operaciones"
_DEMO_PASSWORD = "trackflow"
# user_uuid estable para el usuario demo (aparece en las órdenes).
_DEMO_USER_UUID = str(uuid.uuid5(uuid.NAMESPACE_DNS, "operaciones@trackflow.demo"))

# token -> user_uuid (en memoria).
_active_tokens: dict[str, str] = {}

_bearer = HTTPBearer(auto_error=False)


class LoginInput(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user_uuid: str


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginInput) -> LoginResponse:
    if payload.username != _DEMO_USERNAME or payload.password != _DEMO_PASSWORD:
        raise HTTPException(status_code=401, detail="Credenciales inválidas.")
    token = secrets.token_urlsafe(32)
    _active_tokens[token] = _DEMO_USER_UUID
    return LoginResponse(token=token, user_uuid=_DEMO_USER_UUID)


def require_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    """Dependencia: valida el Bearer y devuelve el user_uuid, o 401."""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="No autenticado.")
    user_uuid = _active_tokens.get(credentials.credentials)
    if user_uuid is None:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada.")
    return user_uuid
