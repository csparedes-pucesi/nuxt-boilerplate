<template>
  <div>
    <!-- Contenedor exterior con padding top adicional para evitar superposición con el Dashboard -->
    <div
      class="relative z-0 mt-16 w-full bg-[#f4f6f9] dark:bg-gray-900 min-h-screen"
    >
      <!-- Contenedor interno para limitar el ancho y dejar márgenes -->
      <div class="container mx-auto px-4 py-6">
        <!-- Se aplica la clase pageConfgCitas a todo menos a la sección de componentes activos -->
        <div class="pageConfgCitas">
          <header class="mb-8 text-center">
            <h1
              class="text-4xl font-extrabold text-gray-800 dark:text-gray-100"
            >
              Configuración de Citas
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Administra tu horario, días de atención, feriados y áreas de
              conocimiento de forma sencilla
            </p>
          </header>
          <!-- Navegación de Pestañas -->
          <nav class="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="px-4">
              <!-- Se cambia la clase para forzar siempre el display en fila -->
              <ul class="flex flex-row justify-center space-x-4">
                <li>
                  <button
                    :class="
                      activeTab === 'horario'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 dark:text-gray-300'
                    "
                    class="py-2 px-4 focus:outline-none"
                    @click="activeTab = 'horario'"
                  >
                    Horario
                  </button>
                </li>
                <li>
                  <button
                    :class="
                      activeTab === 'dias'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 dark:text-gray-300'
                    "
                    class="py-2 px-4 focus:outline-none"
                    @click="activeTab = 'dias'"
                  >
                    Días de Atención
                  </button>
                </li>
                <li>
                  <button
                    :class="
                      activeTab === 'feriados'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 dark:text-gray-300'
                    "
                    class="py-2 px-4 focus:outline-none"
                    @click="activeTab = 'feriados'"
                  >
                    Feriados
                  </button>
                </li>
                <li>
                  <button
                    :class="
                      activeTab === 'areas'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 dark:text-gray-300'
                    "
                    class="py-2 px-4 focus:outline-none"
                    @click="activeTab = 'areas'"
                  >
                    Áreas de Conocimiento
                  </button>
                </li>
                <!-- La pestaña Especialidades solo se muestra si es relevante -->
                <li v-if="citacId !== null">
                  <button
                    :class="
                      activeTab === 'especialidades'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-600 dark:text-gray-300'
                    "
                    class="py-2 px-4 focus:outline-none"
                    @click="activeTab = 'especialidades'"
                  >
                    Especialidades
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <!-- Mostrar el componente según la pestaña activa -->
        <div>
          <HorarioSeccion v-if="activeTab === 'horario'" />
          <DiasAtencionSeccion v-if="activeTab === 'dias'" />
          <FeriadosSeccion v-if="activeTab === 'feriados'" />
          <AreasConocimientoSeccion
            v-if="activeTab === 'areas'"
            :key="'areas-component'"
            @switch-to-especialidades="activeTab = 'especialidades'"
          />
          <EspecialidadesAreaConocimientoSeccion
            v-if="activeTab === 'especialidades'"
            :key="'especialidades-component'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import HorarioSeccion from '@/components/psicologia/HorarioSeccion.vue'
import DiasAtencionSeccion from '@/components/psicologia/DiasAtencionSeccion.vue'
import FeriadosSeccion from '@/components/psicologia/FeriadosSeccion.vue'
import AreasConocimientoSeccion from '@/components/psicologia/AreasConocimientoSeccion.vue'
import EspecialidadesAreaConocimientoSeccion from '@/components/psicologia/EspecialidadesAreaConocimientoSeccion.vue'
import { useEspecialidadStore } from '~/stores/psicologia/especialidadStore'

const activeTab = ref('horario')

const especialidadStore = useEspecialidadStore()
const { citacId } = storeToRefs(especialidadStore)

watch(activeTab, (newTab) => {
  if (newTab !== 'areas' && newTab !== 'especialidades') {
    especialidadStore.setEspecialidad(null)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

section {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
