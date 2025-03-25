<script lang="ts" setup>
import type { Column, Table } from '@tanstack/vue-table'
import { computed, type PropType } from 'vue'
import DebouncedInput from './DebouncedInput.vue'
type DataRow = Record<string, unknown>

const props = defineProps({
  column: {
    type: Object as PropType<Column<DataRow, unknown>>,
    required: true,
  },
  table: {
    type: Object as PropType<Table<DataRow>>,
    required: true,
  },
})
const firstValue = computed(() =>
  props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id)
)
const columnFilterValue = computed(() => props.column.getFilterValue())
const sortedUniqueValues = computed(() =>
  typeof firstValue.value === 'number'
    ? []
    : Array.from(props.column.getFacetedUniqueValues().keys()).sort()
)
</script>

<template>
  <div v-if="typeof firstValue === 'number'">
    <div class="flex space-x-2">
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        :placeholder="`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
        }`"
        class="border shadow rounded"
        @update:model-value="(value: any) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])"
      />
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[1] ?? ''"
        :placeholder="`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
        }`"
        class="border shadow rounded"
        @update:model-value="(value: any) => column.setFilterValue((old: [number, number]) => [old?.[0], value])"
      />
    </div>
  </div>
  <div v-else>
    <datalist :id="column.id + 'list'">
      <option
        v-for="value in sortedUniqueValues.slice(0, 5000)"
        :key="value"
        :value="value"
      />
    </datalist>
    <DebouncedInput
      type="text"
      :model-value="(columnFilterValue ?? '') as string"
      :placeholder="`Buscar... (${column.getFacetedUniqueValues().size})`"
      class="border shadow rounded w-40"
      :list="column.id + 'list'"
      @update:model-value="(value: any) => column.setFilterValue(value)"
    />
  </div>
</template>
