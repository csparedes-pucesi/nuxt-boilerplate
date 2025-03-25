<template>
  <!-- Se utiliza v-model para controlar la visibilidad del modal -->
  <modal-slot
    v-model="localModelValue"
    :title="title || 'Agregar Área de Conocimiento'"
    modal-classes="relative w-1/2 h-auto mx-auto my-10 rounded-2xl"
    content-classes="min-h-full p-6 bg-white dark:bg-gray-800 transition-all transform rounded-2xl"
  >
    <div class="p-4 dark:bg-gray-800">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        Crear Nueva Área de Conocimiento
      </h2>
      <form class="space-y-5" @submit.prevent="handleCreateArea">
        <div>
          <label
            for="areaNombre"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Nombre del Área
          </label>
          <input
            id="areaNombre"
            v-model="newArea.citac_nombre"
            type="text"
            required
            placeholder="Nombre del área"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            for="areaDescripcion"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Descripción
          </label>
          <input
            id="areaDescripcion"
            v-model="newArea.citac_descripcion"
            type="text"
            placeholder="Descripción del área"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div class="text-right">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
          >
            Crear Área
          </button>
        </div>
      </form>
    </div>
  </modal-slot>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { useCitasConfiguracionAreasConocimiento } from '~/composables/psicologia/useCitasConfiguracionAreasConocimiento'
import type {
  GetAreasConocimientoDTO,
  PostAreasConocimientoDTO,
} from '@/types/psicologia/AreasConocimiento.dto'

interface Props {
  modelValue: boolean
  title?: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', newArea: GetAreasConocimientoDTO): void
}>()

// Para trabajar con v-model en este componente, usamos un computed
const localModelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// Variable reactiva para almacenar los datos del nuevo área
const newArea = reactive<PostAreasConocimientoDTO>({
  citac_nombre: '',
  citac_descripcion: '',
})

// Extraemos la función para crear el área desde el composable
const { createAreaConocimiento } = useCitasConfiguracionAreasConocimiento()

// Función para crear una nueva área de conocimiento
const handleCreateArea = async () => {
  try {
    const response = await createAreaConocimiento(newArea)
    // Supongamos que la respuesta devuelve { citacId: number }
    const createdArea: GetAreasConocimientoDTO = {
      citacId: response.citacId,
      nombre: newArea.citac_nombre,
      descripcion: newArea.citac_descripcion,
    }
    emit('created', createdArea)

    // Detectar si el modo oscuro está activo
    const isDarkMode = document.documentElement.classList.contains('dark')

    Swal.fire({
      title: 'Área Agregada',
      text: 'El área de conocimiento se ha creado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })

    // Reiniciar formulario y cerrar modal
    newArea.citac_nombre = ''
    newArea.citac_descripcion = ''
    localModelValue.value = false
  } catch (error) {
    console.error('Error al crear el área de conocimiento:', error)

    const isDarkMode = document.documentElement.classList.contains('dark')

    Swal.fire({
      title: 'Error',
      text: 'HA OCURRIDO UN ERROR, INTÉNTELO DE NUEVO MÁS TARDE O COMUNÍQUESE CON EL DEPARTAMENTO DE DESARROLLO DE SOFTWARE',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })
  }
}
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
