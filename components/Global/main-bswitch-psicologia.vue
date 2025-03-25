<template>
  <div ref="container" class="relative group inline-block">
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      >
      <div
        class="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0e4385] rounded-full peer-checked:bg-[#0e4385] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:rounded-full after:h-5 after:w-5 after:transition-all"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import '@/pages/Psicologia/css/Tippy.css'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  activeLabel: {
    type: String,
    default: 'Activo',
  },
  inactiveLabel: {
    type: String,
    default: 'Inactivo',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const container = ref<HTMLElement | null>(null)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

onMounted(() => {
  if (container.value) {
    tippy(container.value, {
      content: props.modelValue ? props.activeLabel : props.inactiveLabel,
      placement: 'top',
      arrow: true,
    })
  }
})

// Define un tipo para el elemento que puede tener un tooltip Tippy
interface TippyElement extends HTMLElement {
  _tippy?: { setContent(content: string): void }
}

watch(
  () => props.modelValue,
  (newVal) => {
    const el = container.value as TippyElement | null

    if (el?._tippy) {
      el._tippy.setContent(newVal ? props.activeLabel : props.inactiveLabel)
    }
  }
)
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
