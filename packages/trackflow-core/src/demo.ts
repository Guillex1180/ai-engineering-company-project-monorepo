/**
 * Demostración en consola de la capa lógica de TrackFlow.
 *
 * Ejecuta: `npm run demo` (usa tsx). Muestra filtros, ordenamientos, búsqueda
 * lineal y binaria, agregaciones y validaciones con los datos de ejemplo.
 */
import { SAMPLE_REQUESTS } from "./data/samples.js";
import type { InformationRequest } from "./types/models.js";
import {
  filterByCountry,
  filterByService,
  filterByVolumeRange,
  sortByCompanyName,
  sortByMonthlyVolume,
  sortByMultipleFields,
  groupByProductType
} from "./utils/collections.js";
import {
  findRequestByCompanyName,
  binarySearchByCompanyName
} from "./utils/search.js";
import { buildRequestsSummary } from "./utils/transformations.js";
import { validateInformationRequest } from "./utils/validations.js";

/** Imprime un título de sección. */
function section(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(title);
  console.log("=".repeat(60));
}

/** Nombres de empresa de una colección, como string legible. */
function names(requests: readonly InformationRequest[]): string {
  return requests.map((request) => request.companyName).join(", ") || "(ninguna)";
}

section("Datos de ejemplo");
console.log("Solicitudes:", names(SAMPLE_REQUESTS));

section("Filtrado");
console.log("País = España:", names(filterByCountry(SAMPLE_REQUESTS, "España")));
console.log("Servicio = Logística inversa:", names(filterByService(SAMPLE_REQUESTS, "Logística inversa")));
console.log("Volumen 101-500 .. 2000+:", names(filterByVolumeRange(SAMPLE_REQUESTS, "101-500", "2000+")));

section("Ordenamiento");
console.log("Empresa ASC:", names(sortByCompanyName(SAMPLE_REQUESTS, "asc")));
console.log("Empresa DESC:", names(sortByCompanyName(SAMPLE_REQUESTS, "desc")));
console.log("Volumen DESC:", names(sortByMonthlyVolume(SAMPLE_REQUESTS, "desc")));
console.log(
  "Multi (país ASC, luego volumen DESC):",
  names(
    sortByMultipleFields(SAMPLE_REQUESTS, [
      { field: "country", direction: "asc" },
      { field: "monthlyVolume", direction: "desc" }
    ])
  )
);

section("Agrupación");
const byProduct = groupByProductType(SAMPLE_REQUESTS);
for (const [product, requests] of Object.entries(byProduct)) {
  console.log(`- ${product}: ${names(requests)}`);
}

section("Búsqueda lineal (colección desordenada)");
const linear = findRequestByCompanyName(SAMPLE_REQUESTS, "BellaSkin");
console.log("Buscar 'BellaSkin':", linear.found ? `índice ${linear.index}` : "no encontrada");
const linearMissing = findRequestByCompanyName(SAMPLE_REQUESTS, "NoExiste");
console.log("Buscar 'NoExiste':", linearMissing.found ? `índice ${linearMissing.index}` : `no encontrada (índice ${linearMissing.index})`);
console.log("Buscar en array vacío:", findRequestByCompanyName([], "ModaViva").index);

section("Búsqueda binaria (requiere orden ASC por nombre)");
const sortedByName = sortByCompanyName(SAMPLE_REQUESTS, "asc");
console.log("Colección ordenada:", names(sortedByName));
console.log("Índice de 'NutriGo':", binarySearchByCompanyName(sortedByName, "NutriGo"));
console.log("Índice de 'GadgetPro':", binarySearchByCompanyName(sortedByName, "GadgetPro"));
console.log("Índice de 'NoExiste' (esperado -1):", binarySearchByCompanyName(sortedByName, "NoExiste"));
console.log("Índice en array vacío (esperado -1):", binarySearchByCompanyName([], "ModaViva"));

section("Agregaciones / reporte");
const summary = buildRequestsSummary(SAMPLE_REQUESTS);
console.log("Total solicitudes:", summary.total);
console.log("Total envíos estimados/mes:", summary.totalEstimatedShipments);
console.log("Promedio envíos/mes:", summary.averageEstimatedShipments.toFixed(1));
console.log("Por país:", summary.byCountry);
console.log("Por producto:", summary.byProductType);
console.log("Por servicio:", summary.byService);
console.log("Mayor volumen:", summary.highestVolumeCompany);
console.log("Menor volumen:", summary.lowestVolumeCompany);
console.log("Reporte sobre colección vacía:", buildRequestsSummary([]));

section("Validaciones de negocio");
const validRequest = SAMPLE_REQUESTS[0];
console.log(`Solicitud válida (${validRequest.companyName}):`, validateInformationRequest(validRequest));

const invalidRequest: InformationRequest = {
  companyName: "A",
  contactPerson: "Juan",
  email: "correo-invalido",
  phone: "213 555 0147",
  website: "empresa.com",
  country: "España",
  productType: "Moda",
  monthlyVolume: "0-100",
  services: [],
  currentThirdPartyLogistics: "No",
  comments: "x".repeat(501),
  privacyAccepted: false
};
const invalidResult = validateInformationRequest(invalidRequest);
console.log("\nSolicitud inválida — válida?:", invalidResult.valid);
console.log("Errores:");
for (const error of invalidResult.errors) {
  console.log(`  - ${String(error.field)}: ${error.message}`);
}
console.log("Advertencias:", invalidResult.warnings);
