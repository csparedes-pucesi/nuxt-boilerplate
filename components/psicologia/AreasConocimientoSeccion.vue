<template>
  <!-- Se utiliza GlobalSection como contenedor único -->
  <global-section>
    <div v-if="areas.length">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-100">
          Áreas de Conocimiento
        </h2>
        <!-- Botón AGREGAR ÁREA reemplazado con BaseButtonModuloPsicopedagogo -->
        <BaseButtonModuloPsicopedagogo
          text="AGREGAR ÁREA"
          color="green"
          type="button"
          @click="handleAgregarArea"
        />
      </div>
      <div v-if="isLoading" class="text-center">
        <span class="text-gray-700 dark:text-gray-300">
          Cargando áreas de conocimiento...
        </span>
      </div>
      <div v-else>
        <!-- Se utiliza TableBodyComponent para mostrar la tabla -->
        <TableBodyComponent
          :data="areas"
          :columns="columns as ColumnDef<Record<string, unknown>>[]"
        />
      </div>
    </div>
    <!-- Modal para agregar área de conocimiento -->
    <AgregarAreaConocimientoModal
      v-model="showModal"
      @created="handleCreated"
    />
  </global-section>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { GetAreasConocimientoDTO } from '@/types/psicologia/AreasConocimiento.dto'
import { useCitasConfiguracionAreasConocimiento } from '~/composables/psicologia/useCitasConfiguracionAreasConocimiento'
import { useEspecialidadStore } from '~/stores/psicologia/especialidadStore'
import AgregarAreaConocimientoModal from '@/components/psicologia/AgregarAreaConocimientoModal.vue'
import TableBodyComponent from '@/components/table/TableBodyComponent.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import BaseButtonModuloPsicopedagogo from '@/components/global/BaseButtonModuloPsicopedagogo.vue'

const { getAreasConocimiento } = useCitasConfiguracionAreasConocimiento()

const areas = ref<GetAreasConocimientoDTO[]>([])
const isLoading = ref(true)
const showModal = ref(false)

// Definir emit para notificar al componente padre (si es necesario)
const emit = defineEmits(['switchToEspecialidades'])

// Función que guarda el citacId y el nombre del área en el store y emite el evento para cambiar de pestaña
const especialidadAreaConocimiento = (citacId: number, areaNombre: string) => {
  const especialidadStore = useEspecialidadStore()
  especialidadStore.setEspecialidad(citacId, areaNombre)
  console.log(
    'Especialidad del área de conocimiento guardada en store:',
    citacId,
    areaNombre
  )
  emit('switchToEspecialidades')
}
interface CustomMeta {
  initialVisibility?: boolean
  showInDropdown?: boolean
}
// Creamos un ColumnDef con metadata extendida
type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: CustomMeta
}

// Definir las columnas para la tabla
const columns = ref<CustomColumnDef<GetAreasConocimientoDTO>[]>([
  {
    id: 'rowNumber',
    header: 'N°',
    cell: (info) => info.row.index + 1,
    enableSorting: false,
    meta: { initialVisibility: true, showInDropdown: true },
  },
  {
    id: 'citacId',
    accessorKey: 'citacId',
    header: 'ID',
    cell: (info) => info.getValue(),
    enableSorting: false,
    meta: { initialVisibility: false, showInDropdown: false },
  },
  {
    id: 'nombre',
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: (info) => info.getValue(),
    enableSorting: true,
    meta: { initialVisibility: true, showInDropdown: true },
  },
  {
    id: 'descripcion',
    accessorKey: 'descripcion',
    header: 'Descripción',
    cell: (info) => info.getValue(),
    enableSorting: true,
    meta: { initialVisibility: true, showInDropdown: true },
  },
  {
    id: 'acciones',
    header: 'Acciones',
    cell: (info) => {
      const rowData = info.row.original as GetAreasConocimientoDTO
      // Se utiliza el componente BaseButtonModuloPsicopedagogo para la acción
      return h(BaseButtonModuloPsicopedagogo, {
        text: 'ESPECIALIDADES',
        color: 'blue',
        type: 'button',
        onClick: () =>
          especialidadAreaConocimiento(rowData.citacId, rowData.nombre),
      })
    },
    enableSorting: false,
    meta: { initialVisibility: true, showInDropdown: true },
  },
])

// Función que se activa al presionar el botón para agregar área y abre el modal
const handleAgregarArea = () => {
  console.log('Botón AGREGAR ÁREA presionado')
  showModal.value = true
}

// Función que se dispara cuando el modal emite el evento 'created'
// Aquí se realiza un refetch para actualizar la tabla completa.
const handleCreated = async (_newArea: GetAreasConocimientoDTO) => {
  try {
    const data = await getAreasConocimiento()
    areas.value = data
    console.log('Refetch de áreas completado', data)
  } catch (error) {
    console.error('Error al refetchear las áreas de conocimiento:', error)
  }
}

onMounted(async () => {
  try {
    const data = await getAreasConocimiento()
    areas.value = data
  } catch (error) {
    console.error('Error al cargar las áreas de conocimiento:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
