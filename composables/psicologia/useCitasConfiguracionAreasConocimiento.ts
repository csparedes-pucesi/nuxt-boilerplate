// composables/useCitasConfiguracionAreasConocimiento.ts
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
import type {
  GetAreasConocimientoDTO,
  PostAreasConocimientoDTO,
} from '@/types/psicologia/AreasConocimiento.dto'

/**
 * Funciones para interactuar con el endpoint de áreas de conocimiento en la configuración de citas.
 */
export function useCitasConfiguracionAreasConocimiento() {
  /**
   * GET /administrador/citas-configuracion/citas-areas-conocimiento
   * Obtiene la lista de áreas de conocimiento.
   */
  const getAreasConocimiento = async (): Promise<GetAreasConocimientoDTO[]> => {
    try {
      const response = await useApi.get(
        '/administrador/citas-configuracion/citas-areas-conocimiento'
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener áreas de conocimiento:', error)
      throw error
    }
  }

  /**
   * POST /administrador/citas-configuracion/citas-areas-conocimiento
   * Crea un nuevo registro de área de conocimiento.
   * @param data - Datos del área de conocimiento, usando la interfaz PostAreasConocimientoDTO.
   * @returns Los datos creados en el backend.
   */
  const createAreaConocimiento = async (
    data: PostAreasConocimientoDTO
  ): Promise<GetAreasConocimientoDTO> => {
    try {
      const response = await useApi.post(
        '/administrador/citas-configuracion/citas-areas-conocimiento',
        data
      )
      return response.data
    } catch (error) {
      console.error('Error al crear el área de conocimiento:', error)
      throw error
    }
  }

  return {
    getAreasConocimiento,
    createAreaConocimiento,
  }
}
