// composables/useCitasConfiguracionDiasAtencion.ts
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
import type { GetDiasDTO } from '@/types/psicologia/DiaAtencion.dto'

/**
 * Funciones para interactuar con el endpoint de configuración de días de atención de citas.
 */
export function useCitasConfiguracionDiasAtencion() {
  /**
   * GET: /administrador/citas-configuracion/dias
   * Obtiene la configuración de días de atención.
   */
  const getDiasAtencion = async (): Promise<GetDiasDTO[]> => {
    try {
      // Pasamos un objeto de configuración vacío
      const response = await useApi.get(
        '/administrador/citas-configuracion/dias',
        {}
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener los días de atención:', error)
      throw error
    }
  }

  return {
    getDiasAtencion,
  }
}
