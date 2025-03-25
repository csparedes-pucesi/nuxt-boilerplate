<template>
  <!-- Se utiliza GlobalSection como contenedor global -->
  <GlobalSection>
    <!-- Contenido interno sin contenedores adicionales -->
    <ul class="space-y-4">
      <li
        v-for="dia in dias"
        :key="dia.citdsId"
        class="p-4 border border-gray-300 dark:border-gray-600 rounded transition hover:shadow-md hover:border-[#1f2937] dark:hover:border-[#0e4385] hover:bg-gray-50 dark:hover:bg-[#1e293b] hover:scale-[1.02]"
      >
        <div class="flex flex-col sm:flex-row justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-200">{{
            dia.nombre
          }}</span>
          <span class="text-gray-600 dark:text-gray-300">{{ dia.codigo }}</span>
        </div>
      </li>
    </ul>
  </GlobalSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GetDiasDTO } from '@/types/psicologia/DiaAtencion.dto'
import { useCitasConfiguracionDiasAtencion } from '~/composables/psicologia/useCitasConfiguracionDiasAtencion'
import GlobalSection from '@/components/Global/GlobalSection.vue'

const dias = ref<GetDiasDTO[]>([])
const { getDiasAtencion } = useCitasConfiguracionDiasAtencion()

const fetchDiasAtencion = async () => {
  try {
    const data = await getDiasAtencion()
    if (data) {
      dias.value = data
    }
  } catch (error) {
    console.error('Error al cargar los días de atención:', error)
  }
}

onMounted(() => {
  fetchDiasAtencion()
})
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
