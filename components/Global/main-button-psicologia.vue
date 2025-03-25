<template>
  <button
    :type="type"
    :class="computedClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineEmits(['click']);

const props = withDefaults(
  defineProps<{
    text?: string;
    type?: 'button' | 'submit' | 'reset';
    /**
     * Define el color principal del botón (si no se usa la prop "action").
     * Opciones: 'blue', 'red', 'green', 'gray', 'indigo', 'purple', 'yellow' o 'pink'
     */
    color?: 'blue' | 'red' | 'green' | 'gray' | 'indigo' | 'purple' | 'yellow' | 'pink';
    /**
     * Define la acción del botón para aplicar un color específico.
     * Opciones: 'agregar', 'editar', 'cancelar', 'eliminar', 'guardar', 'aceptar',
     * 'rechazar', 'enviar', 'buscar', 'descargar', 'importar', 'compartir',
     * 'imprimir', 'reintentar', 'volver', 'reiniciar', 'verDetalle', 'desactivar', 'activar',
     * 'actualizar'
     */
    action?: 'agregar' | 'editar' | 'cancelar' | 'eliminar' | 'guardar' | 'aceptar' | 'rechazar' | 'enviar' | 'buscar' | 'descargar' | 'importar' | 'compartir' | 'imprimir' | 'reintentar' | 'volver' | 'reiniciar' | 'verDetalle' | 'desactivar' | 'activar' | 'actualizar';
    /**
     * Forzar el modo oscuro.
     */
    darkMode?: boolean;
    disabled?: boolean;
  }>(),
  {
    text: '',
    type: 'button',
    color: 'blue',
    darkMode: false,
    disabled: false,
    action: undefined,
  }
);

// Clases base: aseguran fuente, redondeo, tamaño, color de texto y transición.
const baseClasses =
  'font-medium rounded-lg text-sm px-5 py-2.5 text-white focus:outline-none transition duration-150 ease-in-out';

// Efectos definidos para active y focus (sin depender del hover).
const effectClassesLight = 'active:scale-95 active:shadow-inner focus:ring-2 focus:ring-offset-2';
const effectClassesDark = 'active:scale-95 active:shadow-inner focus:ring-2 focus:ring-offset-2';

// Mapeo de estilos por acción.
const actionColorMapping = {
  agregar: {
    light: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    dark: 'bg-green-600 hover:bg-green-700 focus:ring-green-800',
  },
  editar: {
    light: 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]', // Actualizado: Torea Bay
    dark: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800',
  },
  cancelar: {
    light: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300',
    dark: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-800',
  },
  eliminar: {
    light: 'bg-red-800 hover:bg-red-900 focus:ring-red-500',
    dark: 'bg-red-600 hover:bg-red-700 focus:ring-red-800',
  },
  guardar: {
    light: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    dark: 'bg-green-600 hover:bg-green-700 focus:ring-green-800',
  },
  aceptar: {
    light: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    dark: 'bg-green-600 hover:bg-green-700 focus:ring-green-800',
  },
  rechazar: {
    light: 'bg-red-800 hover:bg-red-900 focus:ring-red-500',
    dark: 'bg-red-600 hover:bg-red-700 focus:ring-red-800',
  },
  enviar: {
    light: 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]', // Actualizado: Torea Bay
    dark: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800',
  },
  buscar: {
    light: 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300',
    dark: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800',
  },
  descargar: {
    light: 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-300',
    dark: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-800',
  },
  importar: {
    light: 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]', // Actualizado: Torea Bay
    dark: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800',
  },
  compartir: {
    light: 'bg-teal-700 hover:bg-teal-800 focus:ring-teal-300',
    dark: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-800',
  },
  imprimir: {
    light: 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]', // Actualizado: Torea Bay
    dark: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800',
  },
  reintentar: {
    light: 'bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300',
    dark: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-700',
  },
  volver: {
    light: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300',
    dark: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-800',
  },
  reiniciar: {
    light: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300',
    dark: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-800',
  },
  verDetalle: {
    light: 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300',
    dark: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800',
  },
  desactivar: {
    light: 'bg-red-800 hover:bg-red-900 focus:ring-red-500',
    dark: 'bg-red-600 hover:bg-red-700 focus:ring-red-800',
  },
  activar: {
    light: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    dark: 'bg-green-600 hover:bg-green-700 focus:ring-green-800',
  },
  actualizar: {
    light: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    dark: 'bg-green-600 hover:bg-green-700 focus:ring-green-800',
  },
};

// Función para obtener el color por nombre si no se utiliza la prop "action".
const computedColorByName = (color: string, isDark: boolean) => {
  let colorClass = '';
  switch (color) {
    case 'blue':
      colorClass = isDark
        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
        : 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]';
      break;
    case 'red':
      colorClass = isDark
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-800'
        : 'bg-red-800 hover:bg-red-900 focus:ring-red-500';
      break;
    case 'green':
      colorClass = isDark
        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-800'
        : 'bg-green-700 hover:bg-green-800 focus:ring-green-300';
      break;
    case 'gray':
      colorClass = isDark
        ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-800'
        : 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300';
      break;
    case 'indigo':
      colorClass = isDark
        ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800'
        : 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300';
      break;
    case 'purple':
      colorClass = isDark
        ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-800'
        : 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-300';
      break;
    case 'yellow':
      colorClass = isDark
        ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-700'
        : 'bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300';
      break;
    case 'pink':
      colorClass = isDark
        ? 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-800'
        : 'bg-pink-700 hover:bg-pink-800 focus:ring-pink-300';
      break;
    default:
      colorClass = isDark
        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
        : 'bg-[#0e4385] hover:bg-[#0d3c78] focus:ring-[#0c3570]';
  }
  return colorClass;
};

const computedClasses = computed(() => {
  const isDark = props.darkMode;
  const effects = isDark ? effectClassesDark : effectClassesLight;
  let colorClass = '';

  if (props.action) {
    // Si se especifica la acción, usar el mapeo por acción.
    const mapping = actionColorMapping[props.action];
    if (mapping) {
      colorClass = isDark ? mapping.dark : mapping.light;
    }
  } else {
    // Sino se usa el mapeo por color.
    colorClass = computedColorByName(props.color || 'blue', isDark);
  }

  return `${baseClasses} ${colorClass} ${effects} disabled:bg-gray-500 disabled:cursor-not-allowed`;
});
</script>

<style scoped>
/* 
  Nota: Si usas Tailwind en modo JIT, asegúrate de incluir en tu safelist
  las clases arbitrarias (por ejemplo, "bg-[#0e4385]", "hover:bg-[#0d3c78]", "focus:ring-[#0c3570]") 
  para que se generen correctamente.
*/
</style>
