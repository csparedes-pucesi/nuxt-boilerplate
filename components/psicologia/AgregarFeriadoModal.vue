<template>
  <!-- Se utiliza v-model para controlar la visibilidad del modal -->
  <modal-slot
    v-model="localModelValue"
    :title="title || 'Agregar Feriado'"
    modal-classes="relative w-1/2 h-1/2 mx-auto my-10"
    content-classes="min-h-full p-6 bg-white dark:bg-gray-800 transition-all transform rounded-2xl"
  >
    <div class="p-4 dark:bg-gray-800">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        Crear Nuevo Feriado
      </h2>
      <form class="space-y-5" @submit.prevent="handleCreateFeriado">
        <div>
          <label
            for="fechaFeriado"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Fecha
          </label>
          <input
            id="fechaFeriado"
            v-model="newFeriado.fecha"
            type="date"
            required
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            for="descFeriado"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Descripción
          </label>
          <input
            id="descFeriado"
            v-model="newFeriado.descripcion"
            type="text"
            placeholder="Motivo o descripción"
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div class="text-right">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
          >
            Crear Feriado
          </button>
        </div>
      </form>
    </div>
  </modal-slot>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import Swal from 'sweetalert2' // Importa SweetAlert2
import { useCitasConfiguracionFeriados } from '~/composables/psicologia/useCitasConfiguracionFeriados'
import type {
  GetFeriadosDTO,
  PostFeriadosDTO,
} from '@/types/psicologia/Feriados.dto'

interface Props {
  modelValue: boolean
  title?: string
}

const props = defineProps<Props>()

// Para trabajar con v-model en este componente, creamos una variable local
const localModelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', newFeriado: GetFeriadosDTO): void
  (e: 'feriadoAgregadoModal'): void
}>()

const newFeriado = reactive<{ fecha: string; descripcion: string }>({
  fecha: '',
  descripcion: '',
})

const { createFeriado } = useCitasConfiguracionFeriados()

// Función para crear un nuevo feriado
const handleCreateFeriado = async () => {
  try {
    const created: GetFeriadosDTO = await createFeriado({
      citdnl_fecha: newFeriado.fecha,
      citdnl_descripcion: newFeriado.descripcion,
      citdnl_usuario_creacion: 'usuario_actual',
    } as PostFeriadosDTO)

    // Emitir evento 'created' para notificar al padre (si lo requieres)
    emit('created', created)

    // Detectar si el modo oscuro está activo
    const isDarkMode = document.documentElement.classList.contains('dark')

    // Mostrar alerta de éxito con colores dinámicos
    Swal.fire({
      title: 'Feriado Agregado',
      text: 'El feriado se agregó correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro o claro
      color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })

    // Emitir evento personalizado para notificar que el feriado fue agregado correctamente desde el modal
    emit('feriadoAgregadoModal')

    // Reiniciar los campos y cerrar el modal
    newFeriado.fecha = ''
    newFeriado.descripcion = ''
    localModelValue.value = false
  } catch (error) {
    console.error('Error al crear feriado:', error)

    // Detectar si el modo oscuro está activo
    const isDarkMode = document.documentElement.classList.contains('dark')

    // Mostrar alerta de error con colores dinámicos
    Swal.fire({
      title: 'Error',
      text: 'Hubo un error al crear el feriado.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro o claro
      color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })
  }
}
</script>
