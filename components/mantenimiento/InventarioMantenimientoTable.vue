<template>
  <div class="p-4">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-600">
        Datos Inventario: {{ inventario.length }}
      </h2>
      <!-- Botón Agregar Inventario -->
      <UButton
        variant="solid"
        :class="[
          'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600',
          'flex items-center gap-2',
        ]"
      >
        <UIcon name="fa6-solid:plus" />
        Agregar Inventario
      </UButton>
    </div>

    <div class="flex items-center mb-4">
      <label class="mr-2 font-bold">Vista:</label>
      <URadioGroup v-model="vistaSeleccionada" :items="items" />
    </div>

    <!-- Botones de acciones -->
    <div class="flex gap-2 mb-4">
      <UButton
        variant="solid"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Exportar a Excel
      </UButton>
      <UButton
        variant="solid"
        class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
      >
        Periodo Nuevo
      </UButton>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="w-full border-collapse border border-gray-300">
        <!-- Encabezado -->
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="columna in columnasSeleccionadas"
              :key="columna"
              class="border border-gray-300 px-4 py-2 text-left"
            >
              {{ columna }}
            </th>
            <!-- Columnas de acciones -->
            <th class="border border-gray-300 px-4 py-2" />
            <th class="border border-gray-300 px-4 py-2" />
            <th class="border border-gray-300 px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, index) in filasPaginadas"
            :key="index"
            :style="{
              backgroundColor: colorForEstadoMantenimiento(
                fila['Estado Mantenimiento']
              ),
            }"
          >
            <td
              v-for="columna in columnasSeleccionadas"
              :key="columna"
              class="border border-gray-300 px-4 py-2"
            >
              {{ fila[columna as keyof InventarioItem] }}
            </td>
            <!-- Botones de acciones -->
            <td class="border border-gray-300 px-4 py-2">
              <UButton
                variant="solid"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                @click="abrirModalEditar"
              >
                Editar
              </UButton>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <UButton
                variant="solid"
                class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Mantenimiento
              </UButton>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <UButton
                variant="solid"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-center mt-4 gap-2">
      <UButton
        v-for="pagina in totalPaginas"
        :key="pagina"
        variant="solid"
        :class="
          pagina === paginaActual ? 'bg-blue-500 text-white' : 'bg-gray-100'
        "
        class="px-3 py-1 border rounded-md"
        @click="paginaActual = pagina"
      >
        {{ pagina }}
      </UButton>
    </div>

    <!-- Componente Modal: Se abre al hacer clic en Editar -->
    <MantenimientoActualizarEquipoMantenimientoModal
      :visible="modalVisible"
      @update:visible="modalVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InventarioItem } from '~/types/mantenimiento/InventarioItem.dto'

// Estado de la paginación
const paginaActual = ref<number>(1)
const filasPorPagina = 4

// Estado para seleccionar la vista (BÁSICA o COMPLETA)
const vistaSeleccionada = ref<string>('basica')

// Items for URadioGroup
const items = ref([
  { label: 'Básica', value: 'basica' },
  { label: 'Completa', value: 'completa' },
])

// Definir columnas para ambas vistas
const columnasBasica: string[] = [
  'ID',
  'Ubicacion',
  'Dependencia',
  'NombrePc',
  'Monitor Marca',
  'Monitor Modelo',
  'Monitor Codigo',
  'Marca Cpu',
  'Modelo Cpu',
  'Codigo Cpu',
  'Usuario',
  'Disco Solido',
  'Estado Mantenimiento',
  'Técnico y Fecha Mantenimiento',
  'Observaciones',
]

const columnasCompleta: string[] = [
  ...columnasBasica,
  'Marca Procesador',
  'Capacidad Procesador',
  'Marca Ram',
  'Capacidad Ram',
  'Marca Disco',
  'Capacidad Disco',
  'Estado Disco Antes',
  'Estado Disco Actual',
  'Teclado',
  'Mouse',
  'Fecha Compra',
]

// Computed: Seleccionar columnas según la vista
const columnasSeleccionadas = computed<string[]>(() =>
  vistaSeleccionada.value === 'completa' ? columnasCompleta : columnasBasica
)

const inventario = ref<InventarioItem[]>([
  {
    ID: '425',
    Ubicacion: '3.2.1',
    Dependencia: 'INGENIERIA',
    NombrePc: 'DTCING5',
    'Monitor Marca': 'HP',
    'Monitor Modelo': 'PRODISPLV P201',
    'Monitor Codigo': '121015002689',
    'Marca Cpu': 'HP',
    'Modelo Cpu': 'Z230 Tower Workstation',
    'Codigo Cpu': '121015002693',
    'Marca Procesador': 'Intel',
    'Capacidad Procesador': '3.5 GHz',
    'Marca Ram': 'Kingston',
    'Capacidad Ram': '16 GB',
    'Marca Disco': 'Western Digital',
    'Capacidad Disco': '1 TB',
    'Estado Disco Antes': 'Bueno',
    'Estado Disco Actual': 'Bueno',
    Teclado: 'Logitech K120',
    Mouse: 'Logitech M185',
    Usuario: 'jibarrera@pucesi.edu.ec',
    'Disco Solido': 'SSD 240 GB',
    'Fecha Compra': '2022-08-15',
    'Estado Mantenimiento': 'APROBADO AUTOMATICO',
    'Técnico y Fecha Mantenimiento': 'Lenin Mena 23/06/24',
    Observaciones: 'Revisión periódica completa',
    estado: 'APROBADO AUTOMATICO',
  },
  // ... (otros elementos del inventario)
])

// Computed: Filtrar filas para la página actual
const filasPaginadas = computed<InventarioItem[]>(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina
  return inventario.value.slice(inicio, inicio + filasPorPagina)
})

// Computed: Total de páginas
const totalPaginas = computed<number>(() =>
  Math.ceil(inventario.value.length / filasPorPagina)
)

// Función para asignar color según el estado
function colorForEstadoMantenimiento(estado: string | undefined) {
  if (estado === 'ACEPTADO') return '#a5d0c7'
  if (estado === 'ENVIADO') return '#ffe399'
  if (estado === 'APROBADO AUTOMATICO') return '#e3e3e3'
  return '#FFFFFF'
}

// Variable para controlar la visibilidad del modal
const modalVisible = ref<boolean>(false)

// Función para abrir el modal al hacer clic en "Editar"
function abrirModalEditar() {
  modalVisible.value = true
}
</script>
