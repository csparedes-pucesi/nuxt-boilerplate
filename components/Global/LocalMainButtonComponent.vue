<template>
  <button
    :type="type"
    class="w-full my-2 flex justify-center items-center align-middle text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
    :class="colorClass"
    :disabled="disabled"
  >
    {{ text }}
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    type?: 'button' | 'submit' | 'reset'
    colorComponent?: string
    disabled?: boolean
  }>(),
  {
    text: '',
    type: 'button',
    colorComponent: 'blue',
    disabled: false,
  }
)

// ✅ Mapa de clases completas por color
const colorClassMap: Record<string, string> = {
  blue: 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700',
  red: 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700',
  green:
    'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700',
  sky: 'bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:ring-sky-300 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-sky-700',
  slate:
    'bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 dark:bg-slate-500 dark:hover:bg-slate-600 dark:focus:ring-slate-700',
  amber:
    'bg-amber-700 hover:bg-amber-800 focus:ring-4 focus:ring-amber-300 dark:bg-amber-500 dark:hover:bg-amber-600 dark:focus:ring-amber-700',
  indigo:
    'bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700',
  yellow:
    'bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-600',
  gray: 'bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-700',
  purple:
    'bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-500 dark:hover:bg-purple-600 dark:focus:ring-purple-700',
  orange:
    'bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-700',
  cyan: 'bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus:ring-cyan-700',
  lime: 'bg-lime-700 hover:bg-lime-800 focus:ring-4 focus:ring-lime-300 dark:bg-lime-500 dark:hover:bg-lime-600 dark:focus:ring-lime-700',
}

// ✅ Clase final computada
const colorClass = computed(() => {
  return colorClassMap[props.colorComponent] ?? colorClassMap['blue']
})
</script>

<style scoped></style>
