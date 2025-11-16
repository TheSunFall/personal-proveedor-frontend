/**
 * Configuración global de la aplicación
 */

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  EMPLEADO: `${BASE_API_URL}/api/personal`,
  PROVEEDOR: `${BASE_API_URL}/api/proveedores`,
  PROYECTO: `${BASE_API_URL}/api/proyectos`,
  AREA: `${BASE_API_URL}/api/areas`,
  CARGO_AREA: `${BASE_API_URL}/api/cargos-areas`,
  CLIENTE: `${BASE_API_URL}/api/clientes`,
  GRADO: `${BASE_API_URL}/api/grados-academicos`,
  ESPECIALIDAD: `${BASE_API_URL}/api/especialidades-personal`,
  EXPERIENCIA: `${BASE_API_URL}/api/experiencia-laboral`,
};
