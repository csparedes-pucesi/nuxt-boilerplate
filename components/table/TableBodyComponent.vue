<script setup lang="ts">
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type SortingState,
  FlexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Filter from './Filter.vue'
import DebouncedInput from './DebouncedInput.vue'
import LocalMainButtonComponent from '@/components/global/LocalMainButtonComponent.vue'

// Agregamos el nuevo prop opcional: dropdownColumns
const props = withDefaults(
  defineProps<{
    data: Array<Record<string, unknown>>
    columns: Array<ColumnDef<Record<string, unknown>>>
    enableFiltered?: boolean
    editingRowId?: number | string | null
    editedRow?: Record<string, unknown>
    idField?: string
    initialColumnVisibility?: Record<string, boolean>
    dropdownColumns?: string[] // Claves de columnas a mostrar en el dropdown
  }>(),
  {
    enableFiltered: false,
    editingRowId: null,
    editedRow: () => ({}),
    initialColumnVisibility: () => ({}),
    idField: '', // Default value for idField
    dropdownColumns: undefined, // Si no se pasa, se mostrarán todas
  }
)

// Si no se pasa initialColumnVisibility, se construye a partir de las columnas
interface ColumnWithVisibility {
  id: string
  accessorKey?: string
  meta?: { initialVisibility?: boolean }
}

const computedInitialVisibility = computed<Record<string, boolean>>(() => {
  return (props.columns as ColumnWithVisibility[]).reduce<
    Record<string, boolean>
  >((acc, col) => {
    const key = col.accessorKey ?? col.id
    acc[key] =
      props.initialColumnVisibility?.[key] ??
      col.meta?.initialVisibility ??
      true
    return acc
  }, {})
})

// Propiedad computada para filtrar las columnas que se mostrarán en el dropdown
interface ColumnWithDropdown {
  id: string
  accessorKey?: string
  header?: string
  meta?: {
    showInDropdown?: boolean
  }
}

const columnsForDropdown = computed<ColumnWithDropdown[]>(() =>
  (props.columns as ColumnWithDropdown[]).filter(
    (col) => col.meta?.showInDropdown !== false
  )
)

// Emit para actualizar editedRow en el padre
const emit = defineEmits<{
  (e: 'update:editedRow', value: Record<string, unknown>): void
}>()

function updateEditedRow(key: string, value: string) {
  const newEdited = { ...props.editedRow, [key]: value }
  emit('update:editedRow', newEdited)
}

const INITIAL_PAGE_INDEX = 0
const goToPageNumber = ref(INITIAL_PAGE_INDEX + 1)
const pageSizes = [5, 10, 20, 30, 40, 50]

const isColumnDropdownOpen = ref(false)
function toggleColumnDropdown() {
  isColumnDropdownOpen.value = !isColumnDropdownOpen.value
}

const dropdownRef = ref<HTMLElement | null>(null)
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isColumnDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleGoToPage(e: Event) {
  const target = e.target as HTMLInputElement
  let inputPage = Number(target.value)
  const maxPage = table.getPageCount()

  if (isNaN(inputPage) || inputPage < 1) {
    inputPage = 1
  } else if (inputPage > maxPage) {
    inputPage = maxPage
  }

  const page = inputPage - 1
  goToPageNumber.value = inputPage
  table.setPageIndex(page)
}

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLInputElement
  table.setPageSize(Number(target.value))
}

function toggleColumnVisibility(columnKey: string) {
  try {
    const currentState = columnVisibility.value[columnKey]
    const newState =
      currentState === undefined || currentState === true ? false : true

    table.options.onColumnVisibilityChange?.(
      (prev: Record<string, boolean>) => {
        return { ...prev, [columnKey]: newState }
      }
    )

    console.log(
      newState
        ? `MOSTRANDO COLUMNA: ${columnKey}`
        : `OCULTANDO COLUMNA: ${columnKey}`
    )
  } catch (error) {
    console.error(
      `Error al cambiar visibilidad de la columna ${columnKey}`,
      error
    )
  }
}

const columnFilters = ref<ColumnFiltersState>([])
const columnOrder = ref<ColumnOrderState>([])
const sorting = ref<SortingState>([])
const globalFilter = ref('')

const columnVisibility = ref<Record<string, boolean>>({
  ...computedInitialVisibility.value,
})
const effectiveColumns = computed(() => {
  return props.columns.map((col) => ({
    ...col,
    enableSorting: col.enableSorting ?? false, // Si no se define, asigna false
  }))
})

const table = useVueTable({
  data: props.data,
  columns: effectiveColumns.value,
  initialState: {
    pagination: {
      pageSize: 5,
    },
  },
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return globalFilter.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get sorting() {
      return sorting.value
    },
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(globalFilter.value)
        : updaterOrValue
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    columnVisibility.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue
  },
  onColumnOrderChange: (updaterOrValue) => {
    columnOrder.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnOrder.value)
        : updaterOrValue
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue
  },
})

watch(
  () => props.data,
  (newData) => {
    table.setOptions((prev) => ({
      ...prev,
      data: newData,
    }))
  }
)

const paginationInfo = computed(() => {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const total = table.getFilteredRowModel().rows.length
  const start = total === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min(pageIndex * pageSize + pageSize, total)
  return { start, end, total }
})

function goToFirstPage() {
  table.setPageIndex(0)
  goToPageNumber.value = 1
}

function goToLastPage() {
  const lastPage = table.getPageCount() - 1
  table.setPageIndex(lastPage)
  goToPageNumber.value = lastPage + 1
}
function goToPreviousPage() {
  if (table.getCanPreviousPage()) {
    table.previousPage()
    goToPageNumber.value = table.getState().pagination.pageIndex + 1
  }
}

function goToNextPage() {
  if (table.getCanNextPage()) {
    table.nextPage()
    goToPageNumber.value = table.getState().pagination.pageIndex + 1
  }
}
</script>

<template>
  <div class="p-2 dark:bg-gray-900">
    <div class="flex">
      <DebouncedInput
        :model-value="globalFilter ?? ''"
        class="w-full md:w-1/2 lg:w-1/3 p-2 font-lg shadow border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        placeholder="Busqueda"
        @update:model-value="(value: any) => (globalFilter = String(value))"
      />
    </div>
    <div class="h-3" />

    <!-- Dropdown de columnas -->
    <div ref="dropdownRef" class="mb-3 relative inline-block text-left">
      <button
        type="button"
        class="inline-flex justify-between rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
        @click="toggleColumnDropdown"
      >
        Columnas de la tabla
        <UIcon name="heroicons-outline:chevron-up" class="ml-2 h-5 w-5 -mr-1" />
      </button>
      <div
        v-if="isColumnDropdownOpen"
        class="origin-top-left absolute left-0 mt-2 min-w-[25rem] w-auto rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[1] max-h-80 overflow-y-auto"
      >
        <ul class="py-1">
          <li
            v-for="column in columnsForDropdown"
            :key="(column as any).accessorKey || column.id"
            class="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center"
            @click="
              toggleColumnVisibility((column as any).accessorKey || column.id)
            "
          >
            <span>
              {{
                typeof column.header === 'string' ? column.header : 'Columna'
              }}
            </span>
            <span
              class="text-sm font-medium"
              :class="{
                'text-green-500':
                  columnVisibility[(column as any).accessorKey || column.id] !== false,
                'text-red-500':
                  columnVisibility[(column as any).accessorKey || column.id] === false,
              }"
            >
              {{
                columnVisibility[(column as any).accessorKey || column.id] ===
                false
                  ? 'Invisible'
                  : 'Visible'
              }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Tabla -->
    <div class="relative overflow-x-auto">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="text-xs text-gray-700 uppercase bg-[#f4f6f9] dark:bg-gray-700 dark:text-gray-400"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              class="px-6 py-3 cursor-pointer"
              @click="
                header.column.getCanSort() && header.column.toggleSorting()
              "
            >
              <div class="flex items-center">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <!-- Si la columna permite ordenar, mostramos el ícono -->
                <span v-if="header.column.getCanSort()" class="ml-1">
                  <UIcon
                    v-if="header.column.getIsSorted() === 'asc'"
                    name="heroicons-outline:chevron-up"
                    class="w-4 h-4"
                  />
                  <UIcon
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    name="heroicons-outline:chevron-down"
                    class="w-4 h-4"
                  />
                  <UIcon
                    v-else
                    name="heroicons-outline:arrows-up-down"
                    class="w-4 h-4"
                  />
                </span>
              </div>
              <!-- Filtro (si aplica) -->
              <div v-if="!header.isPlaceholder && header.column.getCanFilter()">
                <Filter
                  v-if="enableFiltered"
                  :column="header.column"
                  :table="table"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-6 py-4"
            >
              <template
                v-if="
                  props.idField &&
                  props.editingRowId &&
                  row.original[props.idField] === props.editingRowId &&
                  (cell.column.id === 'fecha' ||
                    cell.column.id === 'descripcion')
                "
              >
                <input
                  :value="props.editedRow[cell.column.id] || ''"
                  :type="cell.column.id === 'fecha' ? 'date' : 'text'"
                  class="border p-1 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  @input="
                    updateEditedRow(
                      cell.column.id,
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
              </template>
              <template v-else>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr
            v-for="footerGroup in table.getFooterGroups()"
            :key="footerGroup.id"
          >
            <th
              v-for="header in footerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.footer"
                :props="header.getContext()"
              />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="h-4" />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <LocalMainButtonComponent
          type="button"
          text="Primera"
          :disabled="!table.getCanPreviousPage()"
          @click="goToFirstPage"
        />
        <LocalMainButtonComponent
          type="button"
          :disabled="!table.getCanPreviousPage()"
          @click="goToPreviousPage"
        >
          <UIcon name="heroicons-outline:chevron-left" class="w-6 h-6" />
          <span>Anterior</span>
        </LocalMainButtonComponent>
        <LocalMainButtonComponent
          type="button"
          :disabled="!table.getCanNextPage()"
          @click="goToNextPage"
        >
          <span>Siguiente</span>
          <UIcon name="heroicons-outline:chevron-right" class="w-6 h-6" />
        </LocalMainButtonComponent>
        <LocalMainButtonComponent
          type="button"
          text="Última"
          :disabled="!table.getCanNextPage()"
          @click="goToLastPage"
        />
      </div>
      <div class="text-sm dark:text-gray-200">
        Mostrando {{ paginationInfo.start }} a {{ paginationInfo.end }} de
        {{ paginationInfo.total }} resultados
      </div>
      <div class="flex items-center gap-2">
        <span class="flex items-center gap-1 dark:text-gray-200">
          Ir a pág.:
          <input
            type="number"
            :value="goToPageNumber"
            class="border p-1 rounded w-16 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="handleGoToPage"
          />
        </span>
        <select
          :value="table.getState().pagination.pageSize"
          class="border p-1 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          @change="handlePageSizeChange"
        >
          <option
            v-for="pageSize in pageSizes"
            :key="pageSize"
            :value="pageSize"
          >
            Mostrar {{ pageSize }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
