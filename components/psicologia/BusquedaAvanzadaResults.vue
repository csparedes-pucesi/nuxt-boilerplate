<template>
  <div class="p-4 overflow-auto">
    <!-- Lista de Resultados de Búsqueda Avanzada -->
    <template v-if="filteredCitas.length">
      <div
        v-for="(cita, index) in filteredCitas"
        :key="index"
        class="grid grid-cols-[50px_150px_auto] gap-4 p-2 border-b border-gray-200 dark:border-gray-600 text-sm"
      >
        <!-- Columna 1: Día del mes -->
        <span
          class="font-bold text-lg text-gray-800 dark:text-white text-right inline-flex items-center justify-center w-8 h-8 leading-none align-middle"
          :class="{
            'bg-[#0b57d0] text-white rounded-full': isToday(cita.dateStart),
          }"
        >
          {{ getLocalDate(cita.dateStart).getDate() }}
        </span>

        <!-- Columna 2: Mes, año y día de la semana -->
        <span
          class="whitespace-nowrap text-gray-600 dark:text-gray-300"
          :class="{
            'text-[#0b57d0]': isToday(cita.dateStart),
          }"
        >
          {{ months[getLocalDate(cita.dateStart).getMonth()] }}
          de
          {{ getLocalDate(cita.dateStart).getFullYear() }},
          {{ days[getLocalDate(cita.dateStart).getDay()] }}
        </span>

        <!-- Columna 3: Rango de horas y Título (clickeable) -->
        <div
          class="grid grid-cols-[120px_1fr] gap-4 cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-gray-700 p-1 rounded-lg"
          @click="openModal(cita)"
        >
          <span class="whitespace-nowrap text-gray-600 dark:text-gray-300">
            {{ formatTimeRange(cita.timeStart, cita.timeEnd) }}
          </span>
          <span class="font-semibold text-gray-800 dark:text-white truncate">
            {{ cita.title || '(Sin título)' }}
          </span>
        </div>
      </div>
    </template>

    <!-- Mensaje cuando No se ha encontrado ningún resultado -->
    <div v-else class="flex items-center justify-center h-64 text-gray-500">
      No se ha encontrado ningún resultado.
    </div>

    <!-- Modal de Detalles de la Cita (única instancia) -->
    <DetallesCitaPendienteModal
      :is-open="showModal"
      :cita="selectedEvent"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetallesCitaPendienteModal from './DetallesCitaPendienteModal.vue'
import type { Cita } from '@/types/psicologia/psicologia.dto'

// Recibimos las citas filtradas y además el origen de la página
const props = defineProps<{
  filteredCitas: Cita[] // o GetCitasDTO[] si ya lo tienes
  origen: string
}>()

// Arrays para formatear fechas
const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const months = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]

// Estado interno para controlar el modal
const showModal = ref(false)
const selectedEvent = ref<Cita | null>(null)

// Función para construir la fecha sin que se interprete como UTC
function getLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Función para verificar si una fecha corresponde al día actual (en local time)
function isToday(dateStr: string) {
  const today = new Date()
  const date = getLocalDate(dateStr)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Funciones auxiliares para formatear el rango de horas
function parseTime24(time24: string) {
  const [hStr, mStr] = time24.split(':')
  let hour24 = parseInt(hStr, 10)
  const minutes = parseInt(mStr, 10)
  const suffix = hour24 >= 12 ? 'p.m.' : 'a.m.'
  if (hour24 === 0) {
    hour24 = 12
  } else if (hour24 > 12) {
    hour24 -= 12
  }
  return { hour: hour24, minutes, suffix }
}

function formatTime12(
  hour: number,
  minutes: number,
  suffix: string,
  omitSuffix = false
) {
  const minutesStr = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`
  return omitSuffix ? `${hour}${minutesStr}` : `${hour}${minutesStr} ${suffix}`
}

function formatTimeRange(start24: string, end24: string) {
  const startObj = parseTime24(start24)
  const endObj = parseTime24(end24)
  if (startObj.suffix === endObj.suffix) {
    return (
      formatTime12(startObj.hour, startObj.minutes, startObj.suffix, true) +
      ' a ' +
      formatTime12(endObj.hour, endObj.minutes, endObj.suffix)
    )
  } else {
    return (
      formatTime12(startObj.hour, startObj.minutes, startObj.suffix) +
      ' a ' +
      formatTime12(endObj.hour, endObj.minutes, endObj.suffix)
    )
  }
}

// Función para abrir el modal con los detalles de la cita seleccionada
function openModal(cita: Cita) {
  selectedEvent.value = {
    ...cita,
    origen: props.origen || 'desconocido',
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}
</script>
