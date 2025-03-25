<template>
  <!-- Se utiliza GlobalSection como contenedor único -->
  <global-section>
    <!-- Contenido sin contenedores adicionales -->
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
      {{ isEditing ? 'Editar Horario' : 'Horario' }}
    </h2>
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            for="horaInicio"
            class="block text-sm font-medium text-gray-600 dark:text-gray-200"
          >
            Hora de Inicio
          </label>
          <input
            id="horaInicio"
            v-model="horario.horaInicio"
            type="time"
            :readonly="!isEditing"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            for="horaFin"
            class="block text-sm font-medium text-gray-600 dark:text-gray-200"
          >
            Hora de Fin
          </label>
          <input
            id="horaFin"
            v-model="horario.horaFin"
            type="time"
            :readonly="!isEditing"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            for="tiempoMaximoCita"
            class="block text-sm font-medium text-gray-600 dark:text-gray-200"
          >
            Tiempo Máximo de Cita (min)
          </label>
          <input
            id="tiempoMaximoCita"
            v-model="horario.tiempoMaximoCita"
            type="number"
            :readonly="!isEditing"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            for="intervaloCita"
            class="block text-sm font-medium text-gray-600 dark:text-gray-200"
          >
            Intervalo entre Citas (min)
          </label>
          <input
            id="intervaloCita"
            v-model="horario.intervaloCita"
            type="number"
            :readonly="!isEditing"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div
        class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3"
      >
        <!-- Botón CANCELAR: usa acción "cancelar" -->
        <BaseButtonModuloPsicopedagogo
          v-if="isEditing"
          text="CANCELAR"
          action="cancelar"
          type="button"
          @click="cancelEdit"
        />
        <!-- Botón EDITAR HORARIO: usa acción "editar" -->
        <BaseButtonModuloPsicopedagogo
          v-if="!isEditing"
          text="EDITAR HORARIO"
          action="editar"
          type="button"
          @click="isEditing = true"
        />
        <!-- Botón ACTUALIZAR HORARIO: usa acción "guardar" -->
        <BaseButtonModuloPsicopedagogo
          v-else
          text="ACTUALIZAR HORARIO"
          action="guardar"
          type="submit"
        />
      </div>
    </form>
  </global-section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import type {
  GetHorarioDTO,
  PutHorarioDTO,
} from '@/types/psicologia/HorarioEstandar.dto'
import { useCitasConfiguracionHorario } from '~/composables/psicologia/useCitasConfiguracionHorario'
import BaseButtonModuloPsicopedagogo from '@/components/global/BaseButtonModuloPsicopedagogo.vue'

const isEditing = ref(false)
const horario = reactive<GetHorarioDTO>({
  citcId: 0,
  tiempoMaximoCita: 0,
  intervaloCita: 0,
  horaInicio: '',
  horaFin: '',
})

const { getHorario, updateHorario } = useCitasConfiguracionHorario()

const handleSubmit = async () => {
  try {
    const updated = await updateHorario({
      citcId: horario.citcId,
      tiempoMaximoCita: horario.tiempoMaximoCita,
      intervaloCita: horario.intervaloCita,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
    } as PutHorarioDTO & { citcId: number })

    Object.assign(horario, updated)
    isEditing.value = false

    // Detectar si el modo oscuro está activo
    const isDarkMode = document.documentElement.classList.contains('dark')

    Swal.fire({
      title: 'Horario Actualizado',
      text: 'El horario se actualizó correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro o claro
      color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })
  } catch (error) {
    console.error('Error al actualizar el horario:', error)

    // Detectar si el modo oscuro está activo
    const isDarkMode = document.documentElement.classList.contains('dark')

    Swal.fire({
      title: 'Error',
      text: 'HA OCURRIDO UN ERROR, INTÉNTELO DE NUEVO MÁS TARDE O COMUNÍQUESE CON EL DEPARTAMENTO DE DESARROLLO DE SOFTWARE',
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

const cancelEdit = async () => {
  try {
    const data = await getHorario()
    if (data && data.length > 0) {
      Object.assign(horario, data[0])
    }
    isEditing.value = false
  } catch (error) {
    console.error('Error al cancelar edición:', error)
  }
}

onMounted(async () => {
  try {
    const data = await getHorario()
    if (data && data.length > 0) {
      Object.assign(horario, data[0])
    }
  } catch (error) {
    console.error('Error al cargar el horario:', error)
  }
})
</script>

<style scoped>
/* Aquí puedes agregar estilos personalizados si es necesario */
</style>
