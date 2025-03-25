import { ref, onMounted } from 'vue'
import useApi from '@/composables/api/api' // Se importa el composable (no la instancia)
interface HorarioCalendario {
  gcal_hora_inicio: string
  gcal_hora_fin: string
}

/* ========================================================
   HOOK: useHorarioCalendario
   Proporciona acceso al horario del calendario
======================================================== */
export function useHorarioCalendario() {
  // Estado reactivo para el horario, loading y error
  const horario = ref<HorarioCalendario | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Función para obtener el horario del calendario
  const fetchHorario = async () => {
    loading.value = true
    error.value = null

    try {
      // Asegúrate de invocar useApi() para obtener la instancia de Axios
      const response = await useApi.get<HorarioCalendario>(
        '/calendario/horario'
      )
      horario.value = response.data
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          'Error al obtener el horario:',
          (err as { response?: { data?: string } }).response?.data ||
            err.message
        )
      } else {
        console.error('Error al obtener el horario:', err)
      }
      error.value =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Error al obtener el horario del calendario'
    } finally {
      loading.value = false
    }
  }

  // Ejecuta fetchHorario al montar el componente
  onMounted(fetchHorario)

  return {
    horario,
    loading,
    error,
    fetchHorario,
  }
}
