<template>
  <!-- Se utiliza GlobalSection como contenedor único -->
  <global-section>
    <!-- Encabezado con título y botón para agregar especialidad -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-100">
        Especialidades Área {{ areaNombre }}
      </h2>
      <!-- Botón AGREGAR ESPECIALIDAD reemplazado -->
      <main-button-psicologia
        text="AGREGAR ESPECIALIDAD"
        action="agregar"
        type="button"
        @click="handleAgregarEspecialidad"
      />
    </div>
    <!-- Se renderiza la tabla con los datos y columnas definidas -->
    <TableBodyComponent
      :data="especialidades"
      :columns="columns as ColumnDef<Record<string, unknown>>[]"
    />
    <!-- Modal para agregar especialidad -->
    <AgregarEspecialidadAreaConocimiento
      v-model="showModal"
      @created="handleCreated"
    />
  </global-section>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia'
import TableBodyComponent from '@/components/table/TableBodyComponent.vue'
import type { GetListadoEspecialidadesDTO } from '@/types/psicologia/EspecialidadesAreaConocimiento.dto'
import { useCitasConfiguracionEspecialidades } from '~/composables/psicologia/useCitasConfiguracionEspecialidades'
import type { ColumnDef } from '@tanstack/vue-table'
import { useEspecialidadStore } from '~/stores/psicologia/especialidadStore'
import AgregarEspecialidadAreaConocimiento from '@/components/psicologia/AgregarEspecialidadAreaConocimiento.vue'

// Extraemos las funciones para obtener y crear especialidades
const { getEspecialidades } = useCitasConfiguracionEspecialidades()

const especialidades = ref<GetListadoEspecialidadesDTO[]>([])
const showModal = ref(false)
interface CustomMeta {
  initialVisibility?: boolean
  showInDropdown?: boolean
}
// Creamos un ColumnDef con metadata extendida
type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: CustomMeta
}

// Definición de las columnas usando la interfaz GetListadoEspecialidadesDTO
const columns = ref<CustomColumnDef<GetListadoEspecialidadesDTO>[]>([
  {
    id: 'rowNumber',
    header: 'N°',
    cell: (info) => info.row.index + 1,
    enableSorting: false,
    meta: { initialVisibility: true, showInDropdown: false },
  },
  {
    id: 'citcat_id',
    accessorKey: 'citcat_id',
    header: 'ID',
    cell: (info) => info.getValue(),
    enableSorting: false,
    meta: { initialVisibility: false, showInDropdown: false },
  },
  {
    id: 'ESPECIALIDAD',
    accessorKey: 'ESPECIALIDAD',
    header: 'Especialidad',
    cell: (info) => info.getValue(),
    enableSorting: true,
    meta: { initialVisibility: true, showInDropdown: true },
  },
  {
    id: 'DESCRIPCIÓN',
    accessorKey: 'DESCRIPCIÓN',
    header: 'Descripción',
    cell: (info) => info.getValue(),
    enableSorting: true,
    meta: { initialVisibility: true, showInDropdown: true },
  },
])

// Obtenemos la instancia del store y extraemos citacId y areaNombre como refs
const especialidadStore = useEspecialidadStore()
const { citacId, areaNombre } = storeToRefs(especialidadStore)

// Refetch de especialidades cada vez que cambie citacId
watchEffect(async () => {
  if (citacId.value !== null) {
    try {
      const data = await getEspecialidades(citacId.value)
      especialidades.value = data

      if (data.length === 0) {
        // Detectar si el modo oscuro está activo
        const isDarkMode = document.documentElement.classList.contains('dark')

        Swal.fire({
          title: 'Sin Especialidades',
          text: `No existen especialidades para la especialidad ${areaNombre.value}`,
          icon: 'warning',
          background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro o claro
          color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
          customClass: {
            popup: isDarkMode ? 'swal-dark' : 'swal-light',
          },
        })
      }
    } catch (error) {
      console.error(
        'Error al cargar las especialidades vía watchEffect:',
        error
      )
    }
  }
})

onMounted(async () => {
  if (citacId.value !== null) {
    try {
      const data = await getEspecialidades(citacId.value)
      especialidades.value = data

      if (data.length === 0) {
        const isDarkMode = document.documentElement.classList.contains('dark') // Detectar modo oscuro

        Swal.fire({
          title: 'Sin Especialidades',
          text: `No existen especialidades para la especialidad ${areaNombre.value}`,
          icon: 'warning',
          background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro si está en modo dark
          color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
          customClass: {
            popup: isDarkMode ? 'swal-dark' : 'swal-light', // Clases personalizadas
          },
        })
      }
    } catch (error) {
      console.error('Error al cargar las especialidades en onMounted:', error)
    }
  }
})

// Función para manejar el clic en "AGREGAR ESPECIALIDAD"
const handleAgregarEspecialidad = () => {
  console.log('Botón AGREGAR ESPECIALIDAD presionado')
  showModal.value = true
}

// Realiza un refetch de la lista de especialidades para actualizar la tabla
const handleCreated = async () => {
  try {
    if (citacId.value !== null) {
      const data = await getEspecialidades(citacId.value)
      especialidades.value = data

      // Detectar si el modo oscuro está activo
      const isDarkMode = document.documentElement.classList.contains('dark')

      Swal.fire({
        title: 'Especialidad Agregada',
        text: 'La especialidad se agregó correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        background: isDarkMode ? '#1e293b' : '#ffffff', // Fondo oscuro o claro
        color: isDarkMode ? '#ffffff' : '#000000', // Texto blanco en dark, negro en light
        customClass: {
          popup: isDarkMode ? 'swal-dark' : 'swal-light',
        },
      })
    }
  } catch (error) {
    console.error('Error al refetchear las especialidades:', error)
  }
}
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
