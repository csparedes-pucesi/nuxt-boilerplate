<template>
  <transition name="fade">
    <div
      v-if="advancedSearchOpen"
      class="search-advanced-panel absolute top-full z-50"
      @click.stop
    >
      <!-- Campo: Fecha (Inicio a Fin) -->
      <div class="mb-2 flex items-center">
        <label class="w-1/3 font-semibold">Fecha</label>
        <div class="flex flex-1 items-center space-x-2">
          <input
            ref="dateInicio"
            type="text"
            class="flatpickr-input flex-1 p-1 border dark:border-gray-600 rounded"
            placeholder="Inicio"
          >
          <span class="font-semibold">a</span>
          <input
            ref="dateFin"
            type="text"
            class="flatpickr-input flex-1 p-1 border dark:border-gray-600 rounded"
            placeholder="Fin"
          >
        </div>
      </div>

      <!-- Campo: Hora (Inicio a Fin) -->
      <div class="mb-2 flex items-center">
        <label class="w-1/3 font-semibold">Hora</label>
        <div class="flex flex-1 items-center space-x-2">
          <input
            v-model="searchHoraInicio"
            type="time"
            class="flex-1 p-1 border dark:border-gray-600 rounded"
            placeholder="Hora inicio"
          >
          <span class="font-semibold">a</span>
          <input
            v-model="searchHoraFin"
            type="time"
            class="flex-1 p-1 border dark:border-gray-600 rounded"
            placeholder="Hora fin"
          >
        </div>
      </div>

      <!-- Campo: Paciente -->
      <div class="mb-2 flex items-center">
        <label class="w-1/3 font-semibold">Paciente</label>
        <input
          v-model="searchPaciente"
          type="text"
          class="flex-1 p-1 border dark:border-gray-600 rounded"
          placeholder="Nombre del paciente"
        >
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-2 mt-4">
        <button
          class="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="resetFilters"
        >
          Restablecer
        </button>
        <button
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="executeAdvancedSearch"
        >
          Buscar
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { initFlatpickr } from '~/composables/psicologia/useFlatpickrOptions'
import 'flatpickr/dist/flatpickr.min.css'
import type { Cita } from '@/types/psicologia/psicologia.dto'

// Props y eventos: el componente recibe la bandera para mostrar el panel y el listado de citas a filtrar
const props = defineProps<{
  advancedSearchOpen: boolean
  citas: Cita[]
}>()

const emit = defineEmits<{
  (e: 'reset-advanced-search'): void
  (e: 'search-advanced', filtered: Cita[]): void
}>()

// Interface para los filtros
interface SearchFilters {
  fechaInicio: string
  fechaFin: string
  paciente: string
  estado: string
  horaInicio: string
  horaFin: string
}

// Variables reactivas para los filtros
const searchPaciente = ref('')
const searchEstado = ref('')
const searchHoraInicio = ref('')
const searchHoraFin = ref('')
const dateInicio = ref<HTMLInputElement | null>(null)
const dateFin = ref<HTMLInputElement | null>(null)

// Inicializa Flatpickr en los inputs de fecha al montar el componente
onMounted(() => {
  nextTick(() => {
    if (dateInicio.value && dateFin.value) {
      initFlatpickr(dateInicio.value, dateFin.value)
    }
  })
})

// Limpia listeners si es necesario al desmontar
onUnmounted(() => {
  // Si agregaste listeners personalizados, remuévelos aquí.
})

// Función para resetear los filtros
const resetFilters = () => {
  searchPaciente.value = ''
  searchEstado.value = ''
  searchHoraInicio.value = ''
  searchHoraFin.value = ''
  if (dateInicio.value) dateInicio.value.value = ''
  if (dateFin.value) dateFin.value.value = ''
  emit('reset-advanced-search')
}

// Función para ejecutar la búsqueda avanzada: recopila los filtros y llama a la función de filtrado
const executeAdvancedSearch = () => {
  const filters: SearchFilters = {
    paciente: searchPaciente.value.trim(),
    estado: searchEstado.value,
    horaInicio: searchHoraInicio.value,
    horaFin: searchHoraFin.value,
    // Se espera que el usuario ingrese la fecha en formato D-M-A, que convertiremos
    fechaInicio: dateInicio.value ? dateInicio.value.value : '',
    fechaFin: dateFin.value ? dateFin.value.value : '',
  }
  handleAdvancedSearch(filters)
}

const handleAdvancedSearch = (filters: SearchFilters) => {
  console.log('📌 Filtros avanzados aplicados:', filters)

  // Verificar si al menos un campo está lleno
  const tieneFiltros = Object.values(filters).some(
    (valor) => valor && valor.trim() !== ''
  )
  if (!tieneFiltros) {
    console.warn('⚠️ Debes llenar al menos un campo para realizar la búsqueda.')
    return
  }

  // Función para convertir fechas de formato D-M-A a A-M-D
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [day, month, year] = dateStr.split('-')
    return `${year}-${month}-${day}`
  }

  const fechaInicioFormat = formatDate(filters.fechaInicio)
  const fechaFinFormat = formatDate(filters.fechaFin)

  console.log('📌 Fecha de inicio formateada:', fechaInicioFormat)
  console.log('📌 Fecha de fin formateada:', fechaFinFormat)

  // Normalizar texto para comparación exacta (sin acentos y espacios extra)
  const normalizeString = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()

  // Asegurar que las horas tengan el formato HH:MM:SS (agrega ":00" si viene en HH:MM)
  const formatTime = (time: string) =>
    time && time.length === 5 ? `${time}:00` : time

  const horaInicioFormat = formatTime(filters.horaInicio)
  const horaFinFormat = formatTime(filters.horaFin)

  console.log('📌 Hora de inicio formateada:', horaInicioFormat)
  console.log('📌 Hora de fin formateada:', horaFinFormat)

  // Filtrar las citas usando comparaciones exactas en cada campo
  const filtered = props.citas.filter((cita: Cita) => {
    const cumpleFechaInicio = filters.fechaInicio
      ? cita.dateStart === fechaInicioFormat
      : true
    const cumpleFechaFin = filters.fechaFin
      ? cita.dateEnd === fechaFinFormat
      : true
    const cumplePaciente = filters.paciente
      ? normalizeString(cita.paciente) === normalizeString(filters.paciente)
      : true
    const cumpleEstado = filters.estado
      ? normalizeString(cita.title) === normalizeString(filters.estado)
      : true
    const cumpleHora =
      filters.horaInicio || filters.horaFin
        ? (filters.horaInicio ? cita.timeStart === horaInicioFormat : true) &&
          (filters.horaFin ? cita.timeEnd === horaFinFormat : true)
        : true

    return (
      cumpleFechaInicio &&
      cumpleFechaFin &&
      cumplePaciente &&
      cumpleEstado &&
      cumpleHora
    )
  })

  if (filtered.length === 0) {
    console.warn(
      '⚠️ No se encontraron coincidencias con los filtros aplicados.'
    )
  }

  console.log('📌 Resultados filtrados:', filtered)
  emit('search-advanced', filtered)
}
</script>

<style scoped>
/* Estilos personalizados para el panel de búsqueda avanzada */
</style>
