<template>
  <div
    class="header-calendario flex items-center justify-between h-full p-2.5 bg-[#f8fafd] dark:bg-[#1f2937] rounded-t-lg border-4 border-[#f8fafd] dark:border-[#1f2937]"
  >
    <!-- Sección Izquierda: Navegación y Título -->
    <div class="flex space-x-2 items-center">
      <button
        ref="todayButton"
        class="header-today-button"
        @click="$emit('go-to-today')"
      >
        Hoy
      </button>

      <button
        ref="prevButton"
        class="header-prev-button"
        @click="$emit('prev')"
      >
        <UIcon name="i-lucide-chevron-left" class="svg-size" />
      </button>

      <button
        ref="nextButton"
        class="header-next-button"

        @click="$emit('next')"
      >
        <UIcon name="i-lucide-chevron-right" class="svg-size" />
      </button>

      <span class="header-currentTitle">{{ currentTitle }}</span>
    </div>

    <!-- Sección Derecha: Búsqueda y Dropdown -->
    <div class="flex items-center space-x-2">
      <!-- Botón de búsqueda -->
      <button
        ref="searchButton"
        class="search-icon-button hover:bg-gray-200 dark:hover:bg-gray-600 p-1 rounded"
        @click.stop="$emit('show-search')"
      >
        <UIcon
          name="i-lucide-search"
          class="h-6 w-6 text-gray-600 dark:text-gray-300"
        />
      </button>

      <!-- Dropdown -->
      <div
        ref="dropdownContainer"
        class="relative header-calendario border-4 border-[#f8fafd] dark:border-[#1f2937]"
      >
        <button
        class="header-view-dropdown-button"
          @click="$emit('toggle-dropdown')"
        >
          {{ currentViewLabel }}
          <UIcon name="i-lucide-chevron-down" class="h-4 w-4" />
        </button>

        <div v-if="dropdownOpen" class="header-view-dropdown-menu">
          <button
          class="header-view-dropdown-item"
            @click="$emit('change-view', 'timeGridDay')"
          >
            <span>Día</span>
            <span class="shortcut">D</span>
          </button>
          <button
          class="header-view-dropdown-item"
            @click="$emit('change-view', 'timeGridWeek')"
          >
            <span>Semana</span>
            <span class="shortcut">W</span>
          </button>
          <button
          class="header-view-dropdown-item"
            @click="$emit('change-view', 'dayGridMonth')"
          >
            <span>Mes</span>
            <span class="shortcut">M</span>
          </button>
          <button
          class="header-view-dropdown-item"
            @click="$emit('change-view', 'multiMonthYear')"
          >
            <span>Año</span>
            <span class="shortcut">Y</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const props = defineProps<{
  currentTitle: string
  currentViewLabel: string
  dropdownOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'go-to-today' | 'prev' | 'next' | 'show-search' | 'toggle-dropdown'): void
  (e: 'change-view', view: string): void
}>()

// Refs para elementos
const todayButton = ref<HTMLElement | null>(null)
const prevButton = ref<HTMLElement | null>(null)
const nextButton = ref<HTMLElement | null>(null)
const searchButton = ref<HTMLElement | null>(null)
const dropdownContainer = ref<HTMLElement | null>(null)

// Arrays para días y meses en español (para el tooltip del botón Hoy)
const days = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]
const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

// Función para obtener el tooltip del botón Hoy
function getTodayTooltip(): string {
  const today = new Date()
  const dayName = days[today.getDay()]
  const day = today.getDate()
  const monthName = months[today.getMonth()]
  return `${dayName}, ${day} de ${monthName}`
}

// Función para detectar clics fuera del dropdown y cerrarlo
function handleDropdownOutsideClick(event: MouseEvent) {
  if (props.dropdownOpen && dropdownContainer.value) {
    if (!dropdownContainer.value.contains(event.target as Node)) {
      // Emite el evento para togglear (cerrar) el dropdown
      emit('toggle-dropdown')
    }
  }
}

onMounted(() => {
  // Instanciamos tooltips para los botones
  if (todayButton.value) {
    tippy(todayButton.value, {
      content: getTodayTooltip(),
      appendTo: document.body,
      arrow: false,
    })
  }
  if (prevButton.value) {
    tippy(prevButton.value, {
      content: 'Anterior',
      appendTo: document.body,
      arrow: false,
    })
  }
  if (nextButton.value) {
    tippy(nextButton.value, {
      content: 'Próximo',
      appendTo: document.body,
      arrow: false,
    })
  }
  if (searchButton.value) {
    tippy(searchButton.value, {
      content: 'Buscar',
      appendTo: document.body,
      arrow: false,
    })
  }

  // Agregamos el listener global para detectar clics fuera del dropdown
  document.addEventListener('click', handleDropdownOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDropdownOutsideClick)
})
</script>

<style scoped>
/* Ajusta estilos según tu diseño */
</style>
