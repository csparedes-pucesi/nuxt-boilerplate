<template>
  <modal-slot
    :model-value="isOpen"
    title="Gestionar la Cita"
    modal-classes="relative w-1/2 h-auto mx-auto my-10 rounded-2xl"
    content-classes="min-h-full p-6 bg-white dark:bg-gray-800 transition-all transform rounded-2xl"
    @update:model-value="closeModal"
  >
    <!-- Contenido del modal -->
    <main class="px-4 py-4 space-y-3">
      <!-- Título de la cita -->
      <section
        class="p-3 bg-gray-50 dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-[#0e4385]"
      >
        <p
          class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white text-center"
        >
          {{ cita?.title || 'Sin título' }}
        </p>
      </section>

      <!-- Fila para Paciente y Hora/Fecha -->
      <section
        class="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-3"
      >
        <div
          class="flex-1 flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-[#0e4385]"
        >
          <UIcon
            name="i-lucide-user"
            class="w-10 h-10 text-gray-700 dark:text-white"
          />
          <p class="text-base sm:text-lg text-gray-700 dark:text-white">
            <strong>Paciente:</strong>
            <span class="ml-2">{{ cita?.paciente || 'No asignado' }}</span>
          </p>
        </div>

        <!-- Contenedor de Hora y Fecha -->
        <div
          class="flex-1 flex flex-col gap-1 p-3 bg-gray-50 dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-[#0e4385]"
        >
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-calendar"
              class="w-7 h-7 text-gray-700 dark:text-white"
            />
            <div>
              <p class="text-base sm:text-lg text-gray-700 dark:text-white">
                <strong>Hora:</strong>
                <span class="ml-2">{{ cita?.timeRange || 'No asignada' }}</span>
              </p>
              <p class="text-base sm:text-lg text-gray-700 dark:text-white">
                <strong>Fecha:</strong>
                <span class="ml-2">
                  {{
                    cita?.dateStart === cita?.dateEnd
                      ? cita?.dateStart
                      : cita?.dateStart + ' a ' + cita?.dateEnd
                  }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Fila para Descripción -->
      <section
        class="p-3 bg-gray-50 dark:bg-[#1f2937] rounded-lg shadow-sm border border-gray-200 dark:border-[#0e4385]"
      >
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-pencil"
            class="w-7 h-7 text-gray-700 dark:text-white"
          />
          <p class="text-base sm:text-lg text-gray-700 dark:text-white">
            <strong>Descripción:</strong>
            <span class="ml-2">{{
              cita?.description || 'Sin descripción'
            }}</span>
          </p>
        </div>
      </section>
    </main>

    <footer>
      <div
        v-if="cita?.origen === 'datos-Pendientes'"
        class="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between"
      >
        <!-- Botón Aceptar -->
        <button
          class="flex-1 flex items-center justify-center gap-2 bg-transparent border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-md py-2 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 text-sm"
          @click="aceptarCita"
        >
          <UIcon name="i-lucide-heart" class="w-6 h-6 text-red-500" />
          Aceptar
        </button>

        <!-- Botón Rechazar -->
        <button
          class="flex-1 flex items-center justify-center gap-2 bg-transparent border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-md py-2 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 text-sm"
          @click="rechazarCita"
        >
          <UIcon
            name="i-lucide-x-circle"
            class="w-6 h-6 text-gray-700 dark:text-white"
          />
          Rechazar
        </button>

        <!-- Botón Reagendar -->
        <button
          class="flex-1 flex items-center justify-center gap-2 bg-transparent border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-md py-2 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 text-sm"
          @click="reagendarCita"
        >
          <UIcon
            name="i-lucide-refresh-cw"
            class="w-6 h-6 text-gray-700 dark:text-white"
          />
          Reagendar
        </button>
      </div>

      <!-- Botón Cerrar -->
      <div class="px-4 py-3 flex justify-end">
        <button
          class="bg-transparent border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-md py-2 px-4 transition focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 text-sm"
          @click="closeModal"
        >
          <UIcon
            name="i-lucide-x"
            class="w-6 h-6 inline-block mr-2 dark:text-gray-100"
          />
          Cerrar
        </button>
      </div>
    </footer>
  </modal-slot>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import type { Cita } from '@/types/psicologia/psicologia.dto'

defineProps({
  isOpen: Boolean,
  cita: {
    type: Object as PropType<Cita | null>,
    required: false,
    default: () => null,
  },
  modalClasses: {
    type: String,
    default: '',
  },
  contentClasses: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const aceptarCita = () => {
  console.log('Botón Aceptar activado')
}

const rechazarCita = () => {
  console.log('Botón Rechazar activado')
}

const reagendarCita = () => {
  console.log('Botón Reagendar activado')
}
</script>
