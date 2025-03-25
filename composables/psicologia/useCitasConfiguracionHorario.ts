// composables/useCitasConfiguracionHorario.ts
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
import type {
  GetHorarioDTO,
  PutHorarioDTO,
} from '@/types/psicologia/HorarioEstandar.dto'

/**
 * Funciones para interactuar con el endpoint de configuración de horario de citas.
 */
export function useCitasConfiguracionHorario() {
  /**
   * GET: /administrador/citas-configuracion/horario
   * Obtiene la configuración del horario.
   */
  const getHorario = async (): Promise<GetHorarioDTO[]> => {
    try {
      const response = await useApi.get(
        '/administrador/citas-configuracion/horario'
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener el horario:', error)
      throw error
    }
  }

  /**
   * PUT: /administrador/citas-configuracion/horario/{citcId}
   * Actualiza la configuración del horario.
   * Se extrae el "citcId" del objeto para usarlo en la URL.
   * @param data - Datos para actualizar la configuración del horario, que deben incluir "citcId".
   */
  const updateHorario = async (
    data: PutHorarioDTO & { citcId: number }
  ): Promise<GetHorarioDTO> => {
    try {
      const { citcId, ...payload } = data // Extraer citcId y preparar el payload
      const response = await useApi.put(
        `/administrador/citas-configuracion/horario/${citcId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error al actualizar el horario:', error)
      throw error
    }
  }

  return {
    getHorario,
    updateHorario,
  }
}
