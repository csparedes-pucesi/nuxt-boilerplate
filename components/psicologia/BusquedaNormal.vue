<template>
  <div
    ref="searchBarRef"
    class="search-bar relative rounded-3xl max-w-xl mx-auto flex items-center"
  >
    <!-- Ícono de búsqueda -->
    <UIcon
      name="i-lucide-search"
      class="w-5 h-5 text-gray-500 mx-2 cursor-pointer"
      @click="handleNormalSearch($event)"
    />

    <!-- Input de búsqueda con @keyup.enter -->
    <input
    v-model="searchQuery"
      type="text"
      placeholder="Buscar"
      class="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 focus:border-0 text-gray-800 dark:text-gray-100"
      @input="handleSearchInput"
      @keyup.enter="handleNormalSearch($event)"
    >

    <!-- Flecha abajo para búsqueda avanzada -->
    <UIcon
      name="i-lucide-chevron-down"
      class="w-5 h-5 text-gray-400 hover:text-gray-600 mx-2 cursor-pointer"
      @click.stop="toggleAdvancedSearch"
    />

    <!-- Panel de Búsqueda Avanzada -->
    <transition name="fade">
      <BusquedaAvanzada
        v-if="advancedSearchOpen"
        :advanced-search-open="advancedSearchOpen"
        :citas="citas"
        @reset-advanced-search="resetAdvancedSearch"
        @search-advanced="handleAdvancedSearch"
      />
    </transition>

    <!-- Lista de resultados debajo de la barra de búsqueda -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Si hay resultados -->
      <div
        v-if="
          !advancedSearchOpen &&
          showSuggestions &&
          searchQuery &&
          filteredCitas.length
        "
        class="absolute top-full left-0 w-full bg-white dark:bg-[#1f2937] border border-transparent dark:border-[#0e4385] shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto"
      >
        <ul class="divide-y divide-gray-200 dark:divide-gray-600">
          <li
            v-for="(cita, index) in filteredCitas"
            :key="index"
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#0e4385] cursor-pointer flex flex-col"
            @click="openModal(cita)"
          >
            <!-- Encabezado para citas pasadas -->
            <template
              v-if="
                isPast(cita.dateStart) &&
                (index === 0 || !isPast(filteredCitas[index - 1].dateStart))
              "
            >
              <div
                class="w-full bg-gray-200 dark:bg-gray-700 text-center text-xs py-1 mb-2"
              >
                CITAS PASADAS
              </div>
            </template>
            <!-- Contenido de la cita -->
            <div class="flex justify-between items-center w-full">
              <!-- Columna izquierda: título y paciente -->
              <div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ cita.title }}
                </div>
                <div class="text-gray-500 text-sm dark:text-white">
                  {{ cita.paciente }}
                </div>
              </div>
              <!-- Columna derecha: fecha y hora -->
              <div class="text-right text-xs text-gray-600 dark:text-white">
                <div>{{ formatDate(cita.dateStart) }}</div>
                <div>{{ formatTimeRange(cita.timeStart, cita.timeEnd) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- Si NO hay resultados -->
      <div
        v-else-if="
          !advancedSearchOpen && showSuggestions && !filteredCitas.length
        "
        class="absolute top-full left-0 w-full bg-white dark:bg-[#1f2937] border border-transparent dark:border-[#0e4385] shadow-lg rounded-md mt-2 z-50 p-4 text-center text-gray-500"
      >
        No se ha encontrado ningún resultado.
      </div>
    </transition>

    <DetallesCitaPendienteModal
      :is-open="showModal"
      :cita="selectedEvent"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import BusquedaAvanzada from '@/components/psicologia/BusquedaAvanzada.vue'
import DetallesCitaPendienteModal from './DetallesCitaPendienteModal.vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type { Cita } from '@/types/psicologia/psicologia.dto'


const props = defineProps<{
  citas: Cita[]
  origen: string
}>()

const searchIconRef = ref<SVGElement | null>(null)
const advancedSearchButtonRef = ref<HTMLButtonElement | null>(null)
const modalJustClosed = ref(false)

const emit = defineEmits<{
  (
    e: 'update-filtered-citas' | 'busqueda-Avanzada-Activada',
    filtered: Cita[]
  ): void
  (e: 'hide-search'): void
}>()

const searchQuery = ref('')
const advancedSearchOpen = ref(false)
const searchBarRef = ref<HTMLElement | null>(null)
const filteredCitas = ref([...props.citas])
const showSuggestions = ref(true)

const normalizeText = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const isPast = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const handleSearchInput = () => {
  if (advancedSearchOpen.value) {
    advancedSearchOpen.value = false
  }
  showSuggestions.value = true
  const searchTerm = normalizeText(searchQuery.value.trim())
  if (!searchTerm) {
    filteredCitas.value = []
    emit('update-filtered-citas', filteredCitas.value)
    return
  }
  filteredCitas.value = props.citas.filter((cita: Cita) =>
    [cita.title, cita.description, cita.paciente]
      .map(normalizeText)
      .some((campoNormalizado) => campoNormalizado.includes(searchTerm))
  )

  filteredCitas.value.sort((a, b) => {
    const aDate = new Date(a.dateStart)
    aDate.setDate(aDate.getDate() + 1)
    aDate.setHours(0, 0, 0, 0)
    const bDate = new Date(b.dateStart)
    bDate.setDate(bDate.getDate() + 1)
    bDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const groupA =
      aDate.getTime() === today.getTime() ? 1 : aDate > today ? 2 : 3
    const groupB =
      bDate.getTime() === today.getTime() ? 1 : bDate > today ? 2 : 3
    if (groupA !== groupB) return groupA - groupB
    return groupA === 2
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime()
  })
  emit('update-filtered-citas', filteredCitas.value)
}

const toggleAdvancedSearch = () => {
  advancedSearchOpen.value = !advancedSearchOpen.value
  if (advancedSearchOpen.value) showSuggestions.value = false
}

const resetAdvancedSearch = () => {
  filteredCitas.value = [...props.citas]
  emit('update-filtered-citas', filteredCitas.value)
}

const handleAdvancedSearch = (filtered: Cita[]) => {
  filteredCitas.value = filtered
  emit('update-filtered-citas', filteredCitas.value)
  emit('busqueda-Avanzada-Activada', filteredCitas.value)
  advancedSearchOpen.value = false
}

watch(
  () => props.citas,
  (newCitas) => {
    filteredCitas.value = [...newCitas]
    searchQuery.value = ''
    emit('update-filtered-citas', filteredCitas.value)
  }
)

const advancedSearchExecuted = ref(false)

const handleClickOutside = (event: MouseEvent) => {
  const flatpickrElements = document.querySelectorAll(
    '.flatpickr-calendar, .flatpickr-monthDropdown-months, .flatpickr-next-month, .flatpickr-prev-month, .cur-year'
  )
  for (const element of flatpickrElements) {
    if (element.contains(event.target as Node)) return
  }
  if (modalJustClosed.value) return
  if (searchBarRef.value && !searchBarRef.value.contains(event.target as Node))
    hideSearchBar()
}

const hideSearchBar = () => {
  emit('hide-search')
  advancedSearchOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (searchIconRef.value) {
    tippy(searchIconRef.value, {
      content: 'Busqueda',
      appendTo: document.body,
      arrow: false,
    })
  }
  if (advancedSearchButtonRef.value) {
    tippy(advancedSearchButtonRef.value, {
      content: 'Opciones de búsqueda',
      appendTo: document.body,
      arrow: false,
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function parseTime24(time24: string) {
  const [hStr, mStr] = time24.split(':')
  let hour24 = parseInt(hStr, 10)
  const minutes = parseInt(mStr, 10)
  const suffix = hour24 >= 12 ? 'p.m.' : 'a.m.'
  if (hour24 === 0) {
    hour24 = 12
  } else if (hour24 > 12) {
    hour24 = hour24 - 12
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  const today = new Date()
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Hoy'
  }
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
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

const showModal = ref(false)
watch(showModal, (newVal) => {
  if (!newVal) {
    modalJustClosed.value = true
    setTimeout(() => {
      modalJustClosed.value = false
    }, 200)
  }
})
const selectedEvent = ref<Cita | null>(null)

const openModal = (cita: Cita) => {
  selectedEvent.value = {
    ...cita,
    origen: props.origen || 'desconocido',
  }
  showModal.value = true
}

const handleNormalSearch = (_event?: Event) => {
  handleSearchInput()
  emit('busqueda-Avanzada-Activada', filteredCitas.value)
  advancedSearchExecuted.value = true
  if (showSuggestions.value) {
    showSuggestions.value = false
  }
}
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí */
</style>
