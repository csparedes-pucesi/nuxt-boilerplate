<template>
  <div class="p-4">
    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-blue-600">Datos Inventario: {{ inventario.length }}</h2>

      <!-- Botón Agregar Inventario -->
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
        <i class="fas fa-plus"></i> Agregar Inventario
      </button>
    </div>

    <!-- Botones de selección de vista -->
    <div class="flex items-center mb-4">
      <label class="mr-2 font-bold">Vista:</label>
      <input type="radio" id="basica" value="basica" v-model="vistaSeleccionada" class="mr-1" />
      <label for="basica" class="mr-4">BÁSICA</label>

      <input type="radio" id="completa" value="completa" v-model="vistaSeleccionada" class="mr-1" />
      <label for="completa">COMPLETA</label>
    </div>

    <!-- Botones de acciones -->
    <div class="flex gap-2 mb-4">
      <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Exportar a Excel
      </button>
      <button class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
        Periodo Nuevo
      </button>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="w-full border-collapse border border-gray-300">
        <!-- Encabezado -->
        <thead style="background-color: #f5f5f5">
          <tr>
            <th v-for="columna in columnasSeleccionadas" :key="columna" class="border border-gray-300 px-4 py-2 text-left">
              {{ columna }}
            </th>
            <!-- Columnas de acciones -->
            <th class="border border-gray-300 px-4 py-2"></th>
            <th class="border border-gray-300 px-4 py-2"></th>
            <th class="border border-gray-300 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, index) in filasPaginadas"
            :key="index"
            :style="{ backgroundColor: colorForEstadoMantenimiento(fila['Estado Mantenimiento']) }"
          >
            <td v-for="columna in columnasSeleccionadas" :key="columna" class="border border-gray-300 px-4 py-2">
              {{ fila[columna as keyof InventarioItem] }}
            </td>
            <!-- Botones de acciones -->
            <td class="border border-gray-300 px-4 py-2">
              <button
                @click="abrirModalEditar"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                Mantenimiento
              </button>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-center mt-4 gap-2">
      <button
        v-for="pagina in totalPaginas"
        :key="pagina"
        @click="paginaActual = pagina"
        class="px-3 py-1 border rounded-md"
        :class="pagina === paginaActual ? 'bg-blue-500 text-white' : 'bg-gray-100'"
      >
        {{ pagina }}
      </button>
    </div>

    <!-- Componente Modal: Se abre al hacer clic en Editar -->
    <ActualizarEquipoMantenimientoModal
      :visible="modalVisible"
      @update:visible="modalVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { InventarioItem } from '@/pages/mantenimiento/dto/InventarioItem.dto';
import ActualizarEquipoMantenimientoModal from '@/pages/mantenimiento/components/ActualizarEquipoMantenimientoModal.vue';

// Estado de la paginación
const paginaActual = ref<number>(1);
const filasPorPagina = 4;

// Estado para seleccionar la vista (BÁSICA o COMPLETA)
const vistaSeleccionada = ref<string>('basica');

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
];

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
];

// Computed: Seleccionar columnas según la vista
const columnasSeleccionadas = computed<string[]>(() =>
  vistaSeleccionada.value === 'completa' ? columnasCompleta : columnasBasica
);

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
]);

// Computed: Filtrar filas para la página actual
const filasPaginadas = computed<InventarioItem[]>(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina;
  return inventario.value.slice(inicio, inicio + filasPorPagina);
});

// Computed: Total de páginas
const totalPaginas = computed<number>(() => Math.ceil(inventario.value.length / filasPorPagina));

// Función para asignar color según el estado
function colorForEstadoMantenimiento(estado: string | undefined) {
  if (estado === 'ACEPTADO') return '#a5d0c7';
  if (estado === 'ENVIADO') return '#ffe399';
  if (estado === 'APROBADO AUTOMATICO') return '#e3e3e3';
  return '#FFFFFF';
}

// Variable para controlar la visibilidad del modal
const modalVisible = ref<boolean>(false);

// Función para abrir el modal al hacer clic en "Editar"
function abrirModalEditar() {
  modalVisible.value = true;
}
</script>
