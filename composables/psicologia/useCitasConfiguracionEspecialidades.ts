// composables/useCitasConfiguracionEspecialidades.ts
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
import type {
  GetListadoEspecialidadesDTO,
  PostEspecialidadesAreaConocimientoDTO,
} from '@/types/psicologia/EspecialidadesAreaConocimiento.dto'

/**
 * Funciones para interactuar con el endpoint de especialidades en la configuración de citas.
 */
export function useCitasConfiguracionEspecialidades() {
  /**
   * GET /administrador/citas-configuracion/citas-especialidades?citacId={citacId}
   * Obtiene la lista de especialidades para un área de conocimiento específica.
   * @param citacId - El identificador de la cita o área de conocimiento.
   * @returns Una lista de especialidades con sus respectivos detalles.
   */
  const getEspecialidades = async (
    citacId: number
  ): Promise<GetListadoEspecialidadesDTO[]> => {
    try {
      const response = await useApi.get(
        `/administrador/citas-configuracion/citas-especialidades?citacId=${citacId}`,
        {} // Agregamos el objeto de configuración vacío
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener las especialidades:', error)
      throw error
    }
  }

  /**
   * POST /administrador/citas-configuracion/citas-especialidades
   * Crea una nueva especialidad para un área de conocimiento.
   * @param data - Datos de la especialidad a crear, usando la interfaz PostEspecialidadesAreaConocimientoDTO.
   * @returns La especialidad creada (generalmente se espera un objeto de tipo GetListadoEspecialidadesDTO).
   */
  const createEspecialidad = async (
    data: PostEspecialidadesAreaConocimientoDTO
  ): Promise<GetListadoEspecialidadesDTO> => {
    try {
      const response = await useApi.post(
        '/administrador/citas-configuracion/citas-especialidades',
        data
      )
      return response.data
    } catch (error) {
      console.error('Error al crear la especialidad:', error)
      throw error
    }
  }

  return {
    getEspecialidades,
    createEspecialidad,
  }
}
