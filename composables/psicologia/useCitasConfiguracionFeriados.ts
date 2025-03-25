// composables/useCitasConfiguracionFeriados.ts
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
import type {
  GetFeriadosDTO,
  PostFeriadosDTO,
} from '@/types/psicologia/Feriados.dto'

/**
 * Funciones para interactuar con el endpoint de feriados en la configuración de citas.
 */
export function useCitasConfiguracionFeriados() {
  /**
   * GET: /administrador/citas-configuracion/feriados
   * Obtiene la lista de feriados.
   */
  const getFeriados = async (): Promise<GetFeriadosDTO[]> => {
    try {
      const response = await useApi.get(
        '/administrador/citas-configuracion/feriados'
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener feriados:', error)
      throw error
    }
  }

  /**
   * POST /administrador/citas-configuracion/feriados
   * Crea un nuevo feriado.
   * @param payload Los datos del feriado a crear, tipados según PostFeriadosDTO.
   */
  const createFeriado = async (
    payload: PostFeriadosDTO
  ): Promise<GetFeriadosDTO> => {
    try {
      const response = await useApi.post(
        '/administrador/citas-configuracion/feriados',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = response.data
      const normalizedFeriado: GetFeriadosDTO = {
        citdnlId: data.citdnl_id,
        fecha: data.citdnl_fecha,
        descripcion: data.citdnl_descripcion,
        estado: data.estado,
      }
      return normalizedFeriado
    } catch (error) {
      console.error('Error al crear feriado:', error)
      throw error
    }
  }

  /**
   * PUT /administrador/citas-configuracion/feriados/{citdnlId}
   * Actualiza el estado de un feriado existente.
   * @param citdnlId El identificador del feriado a actualizar.
   */
  const updateEstadoFeriado = async (
    citdnlId: number
  ): Promise<GetFeriadosDTO> => {
    try {
      const response = await useApi.put(
        `/administrador/citas-configuracion/feriados/${citdnlId}`,
        {}, // Body vacío para cambiar el estado
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data
      const normalizedFeriado: GetFeriadosDTO = {
        citdnlId: data.citdnl_id,
        fecha: data.citdnl_fecha,
        descripcion: data.citdnl_descripcion,
        estado: data.estado,
      }
      return normalizedFeriado
    } catch (error) {
      console.error('Error al actualizar estado del feriado:', error)
      throw error
    }
  }

  /**
   * PUT /administrador/citas-configuracion/feriados/editar/{citdnlId}
   * Actualiza la fecha y descripción de un feriado existente.
   * @param citdnlId El identificador del feriado a editar.
   * @param payload Los datos a actualizar: { fecha: string, descripcion: string }.
   */
  const updateDetalleFeriado = async (
    citdnlId: number,
    payload: { fecha: string; descripcion: string }
  ): Promise<GetFeriadosDTO> => {
    try {
      const response = await useApi.put(
        `/administrador/citas-configuracion/feriados/editar/${citdnlId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data
      const normalizedFeriado: GetFeriadosDTO = {
        citdnlId: data.citdnl_id,
        fecha: data.citdnl_fecha,
        descripcion: data.citdnl_descripcion,
        estado: data.estado,
      }
      return normalizedFeriado
    } catch (error) {
      console.error('Error al actualizar detalle del feriado:', error)
      throw error
    }
  }

  return {
    getFeriados,
    createFeriado,
    updateEstadoFeriado,
    updateDetalleFeriado,
  }
}
