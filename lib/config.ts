/**
 * Configuración global de la aplicación
 */

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  USUARIO: `${BASE_API_URL}/api/usuarios`,
  EMPLEADO: `${BASE_API_URL}/api/personal`,
  PROVEEDOR: `${BASE_API_URL}/api/proveedores`,
  PROYECTO: `${BASE_API_URL}/api/proyectos`,
  AREA: `${BASE_API_URL}/api/areas`,
  CARGO_AREA: `${BASE_API_URL}/api/cargos-areas`,
  CLIENTE: `${BASE_API_URL}/api/clientes`,
  CONTRATO: `${BASE_API_URL}/api/contratos-proveedor`,
  GRADO: `${BASE_API_URL}/api/grados-academicos`,
  ESPECIALIDAD: `${BASE_API_URL}/api/especialidades-personal`,
  EXPERIENCIA: `${BASE_API_URL}/api/experiencia-laboral`,
  PERSONA: `${BASE_API_URL}/api/personas`,
  TAREA_PERSONAL: `${BASE_API_URL}/api/tareas-personal`,
  SERVICIOS: `${BASE_API_URL}/api/servicios-proveedor`,
  PAGO_PERSONAL: `${BASE_API_URL}/api/pagos-personal`,
  ACTIVIDAD_PROVEEDOR: `${BASE_API_URL}/api/actividades-proveedor`
};
