<template>  
  <!-- Se utiliza el padding y margin de las props sin contenedor interno extra -->
  <section :class="sectionClasses">
    <slot/>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: 'w-full',
  },
  bg: {
    type: String,
    default: 'bg-gray-50 dark:bg-[#1f2937]', // Azul grisáceo ultraligero en modo claro, azul gris oscuro en modo oscuro
  },
  rounded: {
    type: String,
    default: 'rounded-xl xl:rounded-2xl'
  },
  shadow: {
    type: String,
    default: 'shadow-sm',
  },
  padding: {
    type: String,
    default: 'p-6', // Padding uniforme en todos los lados
  },
  margin: {
    type: String,
    default: '', // Margen uniforme si se define
  },
});

const sectionClasses = computed(() => {
  return `${props.bg} ${props.rounded} ${props.shadow} ${props.padding} ${props.margin} ${props.className} 
          transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`.trim();
});
</script>

<style scoped>
/* Importar la fuente Poppins, moderna y elegante */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

section {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  overflow: hidden; /* Evita que el contenido se salga de los límites definidos */
}
</style>
