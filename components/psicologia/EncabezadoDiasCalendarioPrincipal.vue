<template>
  <div class="main-calendar dark:bg-[#1f2937] dark:border-[#1f2937]">
    <!-- Vista semana (cuando currentView es 'timeGridWeek' y showSingleDay es false) -->
    <div
      v-if="currentView === 'timeGridWeek' && !showSingleDay"
      class="fc-col-header rounded-t-2xl dark:bg-[#1f2937] dark:border-[#1f2937]"
    >
      <!-- Columna para la zona horaria -->
      <div class="fc-timezone-col dark:text-white">
        <span class="week-timezone">{{ weekTimeZone }}</span>
      </div>

      <!-- 7 columnas para los días de la semana -->
      <div
        v-for="(day, index) in dayData"
        :key="index"
        :class="[
          'fc-col-header-cell',
          { 'fc-day-today': day.isToday },
          'dark:text-white dark:border-[#1f2937]',
        ]"
        @click="selectDay(day)"
      >
        <div class="fc-col-header-cell-cushion">
          <span class="day-name dark:text-white">{{ day.dayName }}</span>
          <br>
          <span class="day-number dark:text-white">{{ day.dayNumber }}</span>
        </div>
      </div>
    </div>

    <!-- Vista de día único (cuando currentView es 'timeGridDay' o showSingleDay es true) -->
    <div
      v-else-if="showSingleDay"
      class="calendar-single-day-header single-day-header-relative rounded-t-2xl dark:bg-[#1f2937] dark:border-[#1f2937]"
    >
      <div class="calendar-single-day-content single-day-row-line">
        <!-- Zona horaria a la izquierda -->
        <div class="calendar-time-zone dark:text-white">
          {{ singleDayTimeZone }}
        </div>
        <!-- Línea divisoria vertical -->
        <div class="single-day-column-line dark:border-[#1f2937]"/>
        <!-- Contenedor para nombre y número del día -->
        <div class="calendar-day-info">
          <div class="calendar-day-name dark:text-white">
            {{ singleDayName }}
          </div>
          <div class="calendar-day-number dark:text-white">
            {{ singleDayNumber }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ========================================================
   IMPORTACIONES Y CONFIGURACIONES INICIALES
======================================================== */
import { ref, computed } from 'vue'
import '@/pages/Psicologia/css/HeaderDias.css'

// Definición de emit para comunicar al componente padre
const emit = defineEmits<{
  (
    e: 'update-current-label' | 'update-current-title' | 'update-current-view',
    value: string
  ): void
}>()

// Constante con los nombres de los días
const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

/* ========================================================
   FUNCIONES AUXILIARES
======================================================== */

/**
 * Dada una fecha base, genera un array con los 7 días de esa semana (de domingo a sábado).
 */
function createWeekArray(baseDate: Date) {
  const today = new Date()
  const startOfWeek = new Date(baseDate)
  // Si no es domingo, retrocede hasta el domingo de esa semana
  if (startOfWeek.getDay() !== 0) {
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  }
  const array = dayNames.map((dayName, i) => {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + i)
    const isToday = currentDate.toDateString() === today.toDateString()
    return {
      dayName,
      dayNumber: currentDate.getDate().toString(),
      isToday,
      fullDate: currentDate,
    }
  })
  return array
}

/* ========================================================
   ESTADO REACTIVO
======================================================== */
const currentView = ref<string>('timeGridWeek')
const viewTitle = ref<string>('') // Título (puede usarse para mostrar el rango de fechas)
const dayData = ref(createWeekArray(new Date()))
const showSingleDay = ref(false)
const singleDay = ref<Date | null>(null)

// Estado para current label (inicialmente "Semana")
const currentLabel = ref<string>('Semana')

/* ========================================================
   FUNCIONES DE ACTUALIZACIÓN DE LABEL Y TITLE
======================================================== */

/**
 * Actualiza el current label y lo emite al padre.
 */
function updateCurrentLabel(newLabel: string) {
  currentLabel.value = newLabel
  console.log(`ACTUALIZANDO CURRENT LABEL A: ${currentLabel.value}`)
  emit('update-current-label', currentLabel.value)
}

/**
 * Actualiza el current title y lo emite al padre.
 */
function updateCurrentTitle(newTitle: string) {
  console.log(`CAMBIANDO CURRENT TITLE A: ${newTitle}`)
  emit('update-current-title', newTitle)
}
/**
 * Actualiza el current view y lo emite al padre.
 */
function updateCurrentView(newView: string) {
  console.log(`CAMBIANDO CURRENT VIEW A: ${newView}`)
  emit('update-current-view', newView)
}

/* ========================================================
   PROPIEDADES COMPUTADAS
======================================================== */

// Computados para la vista de día único
const singleDayName = computed(() => {
  if (!singleDay.value) return ''
  const index = singleDay.value.getDay()
  return dayNames[index].toUpperCase()
})

const singleDayNumber = computed(() => {
  if (!singleDay.value) return ''
  return singleDay.value.getDate().toString()
})

const singleDayTimeZone = computed(() => {
  if (!singleDay.value) return ''
  const offsetMinutes = singleDay.value.getTimezoneOffset()
  const sign = offsetMinutes > 0 ? '-' : '+'
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
  return `GMT${sign}${hours}`
})

// Computado para la zona horaria en la vista de semana
const weekTimeZone = computed(() => {
  const now = new Date()
  const offsetMinutes = now.getTimezoneOffset()
  const sign = offsetMinutes > 0 ? '-' : '+'
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
  return `GMT${sign}${hours}`
})

/* ========================================================
   FUNCIONES DE INTERACCIÓN / EVENTOS
======================================================== */
interface DiaSeleccionado {
  fullDate: Date
  dayName: string
  dayNumber: number | string
}

/**
 * Al hacer click en un día de la semana se actualiza el encabezado.
 * Cambia a vista "día único" y emite tanto el current label como el current title,
 * formateado según la fecha seleccionada (por ejemplo, "28 de febrero de 2025").
 */
function selectDay(day: DiaSeleccionado) {
  console.log('selectDay llamado con:', day)

  // Cambiar la vista a "día único"
  showSingleDay.value = true
  singleDay.value = day.fullDate
  currentView.value = 'timeGridDay' // Asegura que la vista sea la correcta

  // Actualizar current label a "Día"
  updateCurrentLabel('Día')
  updateCurrentView('timeGridDay') // Notifica el cambio de vista

  // Formatear la fecha para current title
  const formattedTitle = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(day.fullDate)
  updateCurrentTitle(formattedTitle)

  console.log(
    `CAMBIANDO ENCABEZADO A SINGLE DAY: ${day.dayName} (${day.dayNumber})`
  )
}

/**
 * Permite actualizar la fecha base del encabezado.
 * Si estamos en vista semana, actualiza el array de días.
 */
function setDate(newDate: Date) {
  if (showSingleDay.value) {
    singleDay.value = newDate
  } else if (currentView.value === 'timeGridWeek') {
    dayData.value = createWeekArray(newDate)
    const headerMsg =
      'CAMBIANDO ENCABEZADO DE DIAS A: ' +
      dayData.value.map((d) => `${d.dayName} (${d.dayNumber})`).join(' ')
    console.log(headerMsg)
  }
}

/**
 * Cambia la vista del encabezado y actualiza el título.
 * Si se cambia a 'timeGridWeek', se actualiza el array de días.
 * Si se cambia a 'timeGridDay', se actualiza la fecha del día único y se emite el current title formateado.
 */
function setView(viewName: string, newTitle: string, baseDate?: Date) {
  currentView.value = viewName
  viewTitle.value = newTitle

  if (viewName === 'timeGridWeek') {
    showSingleDay.value = false
    dayData.value = createWeekArray(baseDate ? baseDate : new Date())
    console.log(
      'CAMBIANDO ENCABEZADO DE DIAS DESDE setView A: ' +
        dayData.value.map((d) => `${d.dayName} (${d.dayNumber})`).join(' ')
    )
  } else if (viewName === 'timeGridDay') {
    showSingleDay.value = true
    singleDay.value = baseDate ? baseDate : new Date()
    // Actualizar current label a "Día"
    updateCurrentLabel('Día')
    // Formatear la fecha para current title usando singleDay
    if (singleDay.value) {
      const formattedTitle = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(singleDay.value)
      updateCurrentTitle(formattedTitle)
    }
    console.log(
      'CAMBIANDO ENCABEZADO DE DIAS DESDE setView A: ' +
        singleDayName.value +
        ' (' +
        singleDayNumber.value +
        ')'
    )
  } else {
    showSingleDay.value = false
  }
}

/* ========================================================
   EXPOSICIÓN DE MÉTODOS
======================================================== */
defineExpose({
  setDate,
  setView,
})
</script>
