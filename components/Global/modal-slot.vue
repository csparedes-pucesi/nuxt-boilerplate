<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay oscuro -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75"
          aria-hidden="true"
          @click="closeModal"
        />

        <!-- Contenedor del modal con clases personalizables -->
        <div
          :class="modalClasses || 'relative w-full h-full overflow-y-auto'"
          @click.stop
        >
          <Transition name="modal-content">
            <div
              v-if="isOpen"
              :class="
                contentClasses ||
                'min-h-full p-6 bg-white dark:bg-gray-800 transition-all transform'
              "
            >
              <!-- Encabezado: título y botón de cierre -->
              <div class="flex items-center justify-between mb-4">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ title }}
                </h3>
                <UIcon
                  name="heroicons-outline:x-mark"
                  class="w-6 h-6 cursor-pointer rounded-lg border border-red-300 text-red-300"
                  @click="closeModal"
                />
              </div>

              <!-- Contenido dinámico del modal -->
              <div>
                <slot />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = defineProps<{
  modelValue: boolean
  title: string
  modalClasses?: string
  contentClasses?: string
}>()

// Emits
const emits = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm' | 'cancel'): void
}>()

// Estado interno que controla la visibilidad del modal
const isOpen = ref(props.modelValue)

// Observa cambios en la prop "modelValue" y sincroniza con "isOpen"
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
  }
)

// Cierra el modal
function closeModal() {
  isOpen.value = false
  emits('update:modelValue', false)
  emits('cancel')
}

// Emite confirmación y cierra
// function confirm() {
//   emits('confirm')
//   closeModal()
// }
</script>

<style scoped>
/* Transiciones de entrada/salida para el overlay */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Transiciones de entrada/salida para el contenido */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.5s ease;
}
.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
