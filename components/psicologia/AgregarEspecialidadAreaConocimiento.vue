<template>
  <!-- Se utiliza v-model para controlar la visibilidad del modal -->
  <ModalSlotComponent
    v-model="localModelValue"
    :title="title || 'Agregar Especialidad'"
    modal-classes="relative w-1/2 h-auto mx-auto my-10"
  >
    <div class="p-4 dark:bg-gray-800">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        Crear Nueva Especialidad
      </h2>
      <form class="space-y-5" @submit.prevent="handleCreateEspecialidad">
        <div>
          <label
            for="especialidadNombre"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Nombre de la Especialidad
          </label>
          <input
            id="especialidadNombre"
            v-model="newEspecialidad.citcat_nombre"
            type="text"
            required
            placeholder="Nombre de la especialidad"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label
            for="especialidadDescripcion"
            class="block text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Descripción
          </label>
          <input
            id="especialidadDescripcion"
            v-model="newEspecialidad.citcat_descripcion"
            type="text"
            placeholder="Descripción de la especialidad"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div class="text-right">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
          >
            Crear Especialidad
          </button>
        </div>
      </form>
    </div>
  </ModalSlotComponent>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import ModalSlotComponent from '@/components/global/ModalSlot.vue'
import { useCitasConfiguracionEspecialidades } from '~/composables/psicologia/useCitasConfiguracionEspecialidades'
import type {
  PostEspecialidadesAreaConocimientoDTO,
  GetListadoEspecialidadesDTO,
} from '@/types/psicologia/EspecialidadesAreaConocimiento.dto'
import { useEspecialidadStore } from '~/stores/psicologia/especialidadStore'

// Props para trabajar con v-model y título opcional
interface Props {
  modelValue: boolean
  title?: string
}
const props = defineProps<Props>()

// Para trabajar con v-model en este componente
const localModelValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

// Definición de eventos emitidos
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', newEspecialidad: GetListadoEspecialidadesDTO): void
}>()

// Variable reactiva para almacenar los datos de la nueva especialidad
const newEspecialidad = reactive<PostEspecialidadesAreaConocimientoDTO>({
  citac_id: 0,
  citcat_nombre: '',
  citcat_descripcion: '',
})

// Extraemos la función para crear la especialidad
const { createEspecialidad } = useCitasConfiguracionEspecialidades()

// Obtenemos el citacId del store (el cual debe estar definido previamente)
const especialidadStore = useEspecialidadStore()
const { citacId } = storeToRefs(especialidadStore)

// Función para crear una nueva especialidad
const handleCreateEspecialidad = async () => {
  // Validamos que citacId no sea null
  if (citacId.value === null) {
    Swal.fire({
      title: 'Error',
      text: 'No se ha seleccionado un área de conocimiento.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    })
    return
  }
  // Asignamos el citac_id del store
  newEspecialidad.citac_id = citacId.value
  try {
    const response = await createEspecialidad(newEspecialidad)
    // Construimos el objeto creado (suponiendo que response contiene el ID asignado)
    const createdEspecialidad: GetListadoEspecialidadesDTO = {
      citcat_id: response.citcat_id,
      ESPECIALIDAD: newEspecialidad.citcat_nombre,
      DESCRIPCIÓN: newEspecialidad.citcat_descripcion,
    }
    // Emitimos el evento 'created'
    emit('created', createdEspecialidad)
    // Mostrar alerta de éxito
    Swal.fire({
      title: 'Especialidad Agregada',
      text: 'La especialidad se agregó correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    })
    // Reiniciamos los campos y cerramos el modal
    newEspecialidad.citcat_nombre = ''
    newEspecialidad.citcat_descripcion = ''
    localModelValue.value = false
  } catch (error) {
    console.error('Error al crear la especialidad:', error)
    Swal.fire({
      title: 'Error',
      text: 'HA OCURRIDO UN ERROR, INTENTELO DE NUEVO MAS TARDE O COMUNIQUESE CON EL DEPARTAMENTO DE DESARROLLO DE SOFTWARE',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    })
  }
}
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
