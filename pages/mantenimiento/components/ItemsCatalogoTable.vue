<template>
  <div class="p-6 bg-white shadow-md rounded-lg">
    <!-- Botón Agregar Item -->
    <div class="flex justify-end mb-4">
      <UButton
        variant="solid"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        + Agregar Item
      </UButton>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Código</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Nombre</th>
            <th class="border border-gray-300 px-4 py-2 text-left">
              Descripción
            </th>
            <th class="border border-gray-300 px-4 py-2 text-left">Estado</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in itemsPaginados" :key="index">
            <!-- Columna Código -->
            <td class="border border-gray-300 px-4 py-2">
              <UInput
                v-if="editando[index]"
                v-model="item.codigo"
                type="text"
                class="border rounded px-2 py-1 w-full"
              />
              <span v-else>{{ item.codigo }}</span>
            </td>
            <!-- Columna Nombre -->
            <td class="border border-gray-300 px-4 py-2">
              <UInput
                v-if="editando[index]"
                v-model="item.nombre"
                type="text"
                class="border rounded px-2 py-1 w-full"
              />
              <span v-else>{{ item.nombre }}</span>
            </td>
            <!-- Columna Descripción -->
            <td class="border border-gray-300 px-4 py-2">
              <UInput
                v-if="editando[index]"
                v-model="item.descripcion"
                type="text"
                class="border rounded px-2 py-1 w-full"
              />
              <span v-else>{{ item.descripcion }}</span>
            </td>
            <!-- Columna Estado -->
            <td class="border border-gray-300 px-4 py-2">
              <USelect
                v-model="item.estado"
                :disabled="!editando[index]"
                class="border rounded px-2 py-1 w-full"
              >
                <option value="Vigente">Vigente</option>
                <option value="No Vigente">No Vigente</option>
              </USelect>
            </td>
            <!-- Columna Acciones -->
            <td class="border border-gray-300 px-4 py-2 flex gap-2">
              <UButton
                variant="solid"
                :class="
                  editando[index]
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                "
                class="px-3 py-1 rounded text-white"
                @click="toggleEditar(index)"
              >
                {{ editando[index] ? 'Cancelar' : 'Editar' }}
              </UButton>
              <UButton
                variant="solid"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItemCatalogo } from '@/pages/mantenimiento/dto/ItemCatalogo.dto' // 📌 Importando la interfaz compartida

// Definir `props` con tipado fuerte
const props = defineProps<{ items: ItemCatalogo[] }>()

// Estado de la paginación
const paginaActual = ref<number>(1)
const filasPorPagina = 5

// Estado reactivo para manejar edición en cada fila
const editando = ref<boolean[]>([])

// Computed: Obtener los elementos de la página actual basados en `props.items`
const itemsPaginados = computed<ItemCatalogo[]>(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina
  return props.items.slice(inicio, inicio + filasPorPagina)
})

// Computed: Calcular total de páginas basado en `props.items`
const totalPaginas = computed<number>(() =>
  Math.ceil(props.items.length / filasPorPagina)
)

// Función para alternar edición
const toggleEditar = (index: number) => {
  editando.value[index] = !editando.value[index]
}
</script>
