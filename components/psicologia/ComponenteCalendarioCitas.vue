<template>
  <div
    class="flex-1 h-[calc(100vh-60px)] overflow-hidden flex flex-col md:flex-row bg-[#f8fafd] dark:bg-[#1f2937] border-4 border-[#f8fafd] dark:border-[#1f2937]"
  >
    <!-- Columna Izquierda (Mini Calendario) -->
    <div
      class="mini-calendar-container rounded-lg p-1 flex flex-col border-4 border-[#f8fafd] dark:border-[#1f2937]"
    >
      <div
        class="flex-1 border-4 border-[#f8fafd] dark:border-[#1f2937]"
        style="overflow: hidden"
      >
        <FullCalendar
          ref="miniCalendarRef"
          :options="miniCalendarOptions"
          class="mini-calendar"
        />
      </div>
    </div>

    <!-- Columna Derecha (Calendario Principal) -->
    <div
      class="w-full md:w-3/4 flex flex-col flex-1 overflow-hidden border-4 border-[#f8fafd] dark:border-[#1f2937]"
    >
      <div class="header-calendario-container">
        <!-- Contenedor para la barra de búsqueda y el botón de atrás -->
        <div
          v-if="showSearchBar"
          class="flex items-center justify-center gap-2"
        >
          <!-- ✅ Botón de atrás usando Nuxt UI (Lucide Icon) -->
          <button
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            @click="handleBack"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="w-6 h-6 text-gray-700 dark:text-gray-300"
            />
          </button>

          <!-- Barra de búsqueda -->
          <BusquedaNormal
            ref="busquedaNormalRef"
            :citas="citas"
            :origen="origen!"
            @update-filtered-citas="updateFilteredCitas"
            @hide-search="handleHideSearch"
            @busqueda-avanzada-activada="handleAdvancedSearch"
          />
        </div>

        <!-- HEADER PRINCIPAL SI NO ESTÁ ACTIVA LA BÚSQUEDA -->
        <EncabezadoPrincipalCalendarioPrincipal
          v-else
          :current-title="currentTitle"
          :current-view-label="currentViewLabel"
          :dropdown-open="dropdownOpen"
          @go-to-today="handleGoToToday"
          @prev="handlePrev"
          @next="handleNext"
          @show-search="showSearchBar = true"
          @toggle-dropdown="handleToggleDropdown"
          @change-view="handleChangeView"
        />
      </div>

      <div v-if="showMainCalendar">
        <!-- Encabezado de días -->
        <EncabezadoDiasCalendarioPrincipal
          ref="encabezadoRef"
          @update-current-label="handleUpdateCurrentLabel"
          @update-current-title="handleUpdateCurrentTitle"
          @update-current-view="handleUpdateCurrentView"
        />
      </div>

      <!-- Mostrar el calendario principal solo si showMainCalendar es true -->
      <div v-if="showMainCalendar" class="flex-1 h-full overflow-hidden">
        <FullCalendar
          ref="mainCalendarRef"
          :options="calendarOptions"
          class="main-calendar w-full h-full"
        />
      </div>
      <!-- Resultados de la Búsqueda Avanzada -->
      <div
        v-else
        class="p-4 overflow-auto bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-600"
      >
        <!-- Mostrar BusquedaAvanzadaResults cuando no se muestra el calendario principal -->
        <BusquedaAvanzadaResults
          v-if="!showMainCalendar"
          :filtered-citas="filteredCitas"
          :origen="origen!"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ========================================================
   1. IMPORTACIONES Y ESTILOS
======================================================== */
import { ref, onMounted, watch, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import 'tippy.js/dist/tippy.css'
// Componentes propios
import EncabezadoDiasCalendarioPrincipal from './EncabezadoDiasCalendarioPrincipal.vue'
import BusquedaNormal from '@/components/psicologia/BusquedaNormal.vue'
import EncabezadoPrincipalCalendarioPrincipal from '@/components/psicologia/EncabezadoPrincipalCalendarioPrincipal.vue'
import BusquedaAvanzadaResults from './BusquedaAvanzadaResults.vue'
import type { EventoCalendario } from '@/types/psicologia/EventoCalendario.dto'

// Estilos CSS
import '@/pages/Psicologia/css/CalendarioPrincipal.css'
import '@/pages/Psicologia/css/CalendarioMini.css'
import '@/pages/Psicologia/css/HeaderCalendarioP.css'
import '@/pages/Psicologia/css/Tippy.css'

// Funciones generales
import {
  updateTitle,
  goToToday,
  prev,
  next,
  changeView,
  toggleDropdown,
  actualizarEventos,
} from '~/composables/psicologia/ScriptCalendarioP'

// Composable para opciones del calendario
import { useCalendarOptions } from '~/composables/psicologia/useCalendarOptions'

/* ========================================================
   2. PROPS Y EMITS
======================================================== */
import type { Cita } from '@/types/psicologia/psicologia.dto'

const props = defineProps<{
  citas: Cita[]
  origen?: string
}>()

const emit = defineEmits<{
  (e: 'open-modal', event: Cita): void
}>()
/* ========================================================
   3. VARIABLES REACTIVAS LOCALES
======================================================== */
// 3.1 Variables para navegación y vista
const dropdownOpen = ref(false)
const currentViewLabel = ref('Semana')
const currentTitle = ref('')

// 3.2 Referencias a componentes del calendario
const mainCalendarRef = ref<InstanceType<
  typeof import('@fullcalendar/vue3').default
> | null>(null)
const miniCalendarRef = ref<InstanceType<
  typeof import('@fullcalendar/vue3').default
> | null>(null)

// 3.3 Referencia para el encabezado del calendario
const encabezadoRef = ref<{
  setDate: (newDate: Date) => void
  setView: (viewName: string, newTitle: string, baseDate?: Date) => void
} | null>(null)

const eventos = ref<EventoCalendario[]>([])
const daysWithAppointments = ref<string[]>([])
const viewLabels: Record<string, string> = {
  timeGridDay: 'Día',
  timeGridWeek: 'Semana',
  dayGridMonth: 'Mes',
  multiMonthYear: 'Año',
}

// 3.5 Variables para Búsqueda Normal
const filteredCitas = ref(props.citas) // Inicialmente se muestran todas las citas

// 3.6 Variables para Búsqueda Avanzada / Visibilidad de búsqueda
const showSearchBar = ref(false)
// Nueva variable para controlar la visibilidad del calendario principal
const showMainCalendar = ref(true)

/* ========================================================
   4. HANDLERS DE COMUNICACIÓN CON HIJOS
======================================================== */
// 4.1 Actualiza el label desde el componente hijo
const handleUpdateCurrentLabel = (newLabel: string) => {
  currentViewLabel.value = newLabel
  console.log('Actualizado currentViewLabel en parent a:', newLabel)
}

// 4.2 Actualiza el título desde el componente hijo
const handleUpdateCurrentTitle = (newTitle: string) => {
  currentTitle.value = newTitle
  console.log('Actualizado currentTitle en parent a:', newTitle)
}

const handleUpdateCurrentView = (newView: string) => {
  console.log('Vista actualizada en el padre:', newView)
  // Usa el mapping para asignar el label adecuado:
  currentViewLabel.value = viewLabels[newView] || newView
  if (mainCalendarRef.value) {
    const calendarApi = mainCalendarRef.value.getApi()
    calendarApi.changeView(newView)
  }
}

/* ========================================================
   5. CALLBACK DEL CALENDARIO
======================================================== */
// 5.1 Callback para click en evento (envía datos al padre)
const onEventClick = (evento: EventoCalendario) => {
  const cita: Cita = {
    id: evento.id,
    title: evento.title,
    start: evento.start,
    end: evento.end,
    description: evento.description,
    paciente: evento.paciente,
    dateStart: evento.dateStart,
    dateEnd: evento.dateEnd,
    timeStart: evento.timeStart,
    timeEnd: evento.timeEnd,
    timeRange: evento.extendedProps.timeRange,
    origen: evento.extendedProps.origen,
    descripcion: evento.extendedProps.descripcion ?? '',
    estado: evento.extendedProps.estado ?? '',
  }

  console.log('LLEVANDO DATOS:', cita)
  emit('open-modal', cita)
  console.log('ORIGEN DE LA CITA:', cita.origen)
}

/* ========================================================
   6. CONFIGURACIÓN DEL CALENDARIO
======================================================== */
const { calendarOptions, miniCalendarOptions } = useCalendarOptions({
  eventos,
  daysWithAppointments,
  mainCalendarRef,
  currentTitle,
  viewLabels,
  onEventClick,
  headerRef: encabezadoRef, // ¡Importante!
  currentViewLabel,
})

/* ========================================================
   7. OBSERVADORES (WATCH)
======================================================== */
// 7.1 Actualiza eventos al cambiar las citas
watch(
  () => props.citas ?? [],
  (newCitas) => {
    const { eventos: updatedEvents, daysWithAppointments: updatedDays } =
      actualizarEventos(newCitas, props.origen)
    eventos.value = updatedEvents
    daysWithAppointments.value = updatedDays
    calendarOptions.value.events = updatedEvents
  },
  { deep: true }
)

/* ========================================================
   8. CICLOS DE VIDA
======================================================== */
// 8.1 onMounted: inicializa eventos, título y configura el calendario
onMounted(() => {
  const { eventos: updatedEvents, daysWithAppointments: updatedDays } =
    actualizarEventos(props.citas, props.origen)
  eventos.value = updatedEvents
  daysWithAppointments.value = updatedDays
  if (mainCalendarRef.value) {
    const calendarApi = mainCalendarRef.value.getApi()
    currentTitle.value = updateTitle(calendarApi)
    calendarApi.updateSize()
  }
})

// 8.2 onUnmounted: aquí se pueden remover listeners si fuera necesario
onUnmounted(() => {
  // Actualmente no se tiene listener asignado en el padre.
})

/* ========================================================
   9. HANDLERS DE NAVEGACIÓN Y VISTA
======================================================== */
// 9.1 Lleva el calendario a hoy
const handleGoToToday = () => {
  showMainCalendar.value = true
  const forceDayView = currentViewLabel.value === 'Día'
  goToToday(
    mainCalendarRef.value,
    miniCalendarRef.value,
    (date: Date) => {
      if (encabezadoRef.value) encabezadoRef.value.setDate(date)
    },
    (title: string) => {
      currentTitle.value = title
    },
    forceDayView
  )
}

// 9.2 Navega a la fecha previa
const handlePrev = () => {
  showMainCalendar.value = true

  const forceDayView = currentViewLabel.value === 'Día'
  prev(
    mainCalendarRef.value,
    miniCalendarRef.value,
    (date: Date) => {
      if (encabezadoRef.value) encabezadoRef.value.setDate(date)
    },
    (title: string) => {
      currentTitle.value = title
    },
    forceDayView
  )
}

// 9.3 Navega a la siguiente fecha
const handleNext = () => {
  showMainCalendar.value = true

  const forceDayView = currentViewLabel.value === 'Día'
  next(
    mainCalendarRef.value,
    miniCalendarRef.value,
    (date: Date) => {
      if (encabezadoRef.value) encabezadoRef.value.setDate(date)
    },
    (title: string) => {
      currentTitle.value = title
    },
    forceDayView
  )
}

// 9.4 Cambia la vista del calendario
const handleChangeView = (viewName: string) => {
  showMainCalendar.value = true

  currentViewLabel.value = changeView(
    mainCalendarRef.value,
    viewName,
    viewLabels,
    (title: string) => {
      currentTitle.value = title
    },
    encabezadoRef.value?.setView
  )
  console.log(
    'CAMBIANDO VISTA:',
    viewName,
    '| Nuevo label:',
    currentViewLabel.value
  )
  dropdownOpen.value = false
}

/* ========================================================
   10. MANEJO DE EVENTOS DE CLIC FUERA / OTRAS INTERACCIONES
======================================================== */
const busquedaNormalRef = ref<InstanceType<typeof BusquedaNormal> | null>(null)

// 10.1 Alterna el estado del dropdown
const handleToggleDropdown = () => {
  toggleDropdown(dropdownOpen)
  showMainCalendar.value = true
}

// 10.2 Función para ocultar la barra de búsqueda, invocada desde el hijo
function handleHideSearch() {
  if (showMainCalendar.value) {
    showSearchBar.value = false
  }
}

/* ========================================================
   FUNCIONES ADICIONALES
======================================================== */
function updateFilteredCitas(filtered: Cita[]) {
  filteredCitas.value = filtered
  // Se puede agregar lógica adicional si es necesario
}

function handleAdvancedSearch(filtered: Cita[]) {
  filteredCitas.value = filtered
  console.log(
    'Listado filtrado (desde Búsqueda Avanzada):',
    filteredCitas.value
  )
  showMainCalendar.value = false
}

const handleBack = () => {
  showMainCalendar.value = true
  showSearchBar.value = false
}
</script>

<style>
/* Tus estilos adicionales aquí */
</style>
