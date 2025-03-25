<template>
  <!-- Se utiliza GlobalSection como contenedor único -->
  <GlobalSection>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Listado de Feriados
      </h3>
      <!-- Botón Nuevo Registro usando acción "agregar" -->
      <BaseButtonModuloPsicopedagogo
        text="Nuevo Registro"
        action="agregar"
        type="button"
        @click="handleAgregarRegistro"
      />
    </div>
    <!-- Tabla -->
    <TableBodyComponent
      :data="feriados"
      :columns="columns as ColumnDef<Record<string, unknown>>[]"
      :editing-row-id="editingFeriadoId"
      :edited-row="editedFeriado"
      id-field="citdnlId"
    />
    <!-- Modal para agregar feriado -->
    <AgregarFeriadoModal
      v-model="showModal"
      @created="handleCreated"
      @feriado-agregado-modal="fetchFeriados"
    />
  </GlobalSection>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import Swal from 'sweetalert2'
import type { GetFeriadosDTO } from '@/types/psicologia/Feriados.dto'
import { useCitasConfiguracionFeriados } from '~/composables/psicologia/useCitasConfiguracionFeriados'
import TableBodyComponent from '@/components/table/TableBodyComponent.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import AgregarFeriadoModal from '@/components/psicologia/AgregarFeriadoModal.vue'
import BaseButtonModuloPsicopedagogo from '@/components/Global/BaseButtonModuloPsicopedagogo.vue'
import GlobalSection from '@/components/Global/GlobalSection.vue'
import BaseSwitchButtonModuloPsicopedagogo from '@/components/Global/BaseSwitchButtonModuloPsicopedagogo.vue'

// Definición del type alias ExtendedColumnDef
interface CustomColumnMeta {
  initialVisibility?: boolean
  showInDropdown?: boolean
}
type InputType = 'text' | 'date' | 'select' | 'checkbox'

type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  inputType?: InputType
  meta?: CustomColumnMeta
}
const showModal = ref(false)
const feriados = ref<GetFeriadosDTO[]>([])
const editingFeriadoId = ref<number | null>(null)
const editedFeriado = reactive<{ fecha: string; descripcion: string }>({
  fecha: '',
  descripcion: '',
})

const { getFeriados, updateEstadoFeriado, updateDetalleFeriado } =
  useCitasConfiguracionFeriados()

const fetchFeriados = async () => {
  try {
    const data = await getFeriados()
    if (data) {
      console.log('Datos recibidos:', data)
      feriados.value = data
    }
  } catch (error) {
    console.error('Error al cargar feriados:', error)
  }
}

onMounted(() => {
  fetchFeriados()
})

/**
 * Maneja el cambio de estado de un feriado en tiempo real,
 * y luego llama al servidor para persistirlo.
 */
const handleEstadoFeriado = async (id: number, newVal: boolean) => {
  const index = feriados.value.findIndex((f) => f.citdnlId === id)
  if (index === -1) return

  // Actualizamos localmente para que el tooltip cambie de inmediato.
  feriados.value[index].estado = newVal

  try {
    // Llamamos al servicio sin almacenar el resultado, ya que forzamos newVal.
    await updateEstadoFeriado(id)
    // Forzamos que se mantenga newVal tras la actualización.
    feriados.value[index].estado = newVal
    console.log('Feriado actualizado:', feriados.value[index])
  } catch (error) {
    console.error('Error al actualizar feriados:', error)
    // Si ocurre un error, revertimos el cambio.
    feriados.value[index].estado = !newVal
  }
}

const startEditingFeriado = (feriado: GetFeriadosDTO) => {
  editingFeriadoId.value = feriado.citdnlId
  editedFeriado.fecha = feriado.fecha.substring(0, 10)
  editedFeriado.descripcion = feriado.descripcion
}

const cancelEditing = () => {
  editingFeriadoId.value = null
}

const updateFeriadoDetalle = async (id: number) => {
  try {
    const index = feriados.value.findIndex((f) => f.citdnlId === id)
    if (index === -1) {
      console.error(`No se encontró el feriado con ID ${id} para actualizar.`)
      return
    }
    const original = feriados.value[index]
    console.log(`Antes de enviar actualización para el feriado con ID ${id}:`)
    console.log('Valores originales:', {
      fecha: original.fecha,
      descripcion: original.descripcion,
    })
    console.log('Valores modificados:', {
      fecha: editedFeriado.fecha,
      descripcion: editedFeriado.descripcion,
    })

    const payload = {
      fecha: editedFeriado.fecha,
      descripcion: editedFeriado.descripcion,
    }
    const updated = await updateDetalleFeriado(id, payload)
    const currentEstado = original.estado
    feriados.value[index] = { ...updated, estado: currentEstado }
    console.log(
      `Actualización exitosa para el feriado con ID ${id}:`,
      feriados.value[index]
    )
    editingFeriadoId.value = null

    // Mostrar alerta de éxito
    const isDarkMode = document.documentElement.classList.contains('dark')
    Swal.fire({
      title: 'Feriado Actualizado',
      text: 'El feriado se actualizó correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })

    setTimeout(async () => {
      const data = await getFeriados()
      console.log('Datos obtenidos en refetch:', data)
      feriados.value = [...data]
      console.log('Refetch completed')
    }, 500)
  } catch (error) {
    console.error(
      `Error al actualizar el feriado con ID ${id}:`,
      error instanceof Error ? error.message : String(error)
    )
    const isDarkMode = document.documentElement.classList.contains('dark')
    Swal.fire({
      title: 'Error al actualizar',
      text: 'No se pudo actualizar el feriado. Por favor, intente de nuevo.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      customClass: {
        popup: isDarkMode ? 'swal-dark' : 'swal-light',
      },
    })
  }
}

const columns: ExtendedColumnDef<GetFeriadosDTO>[] = [
  {
    header: 'N°',
    id: 'rowNumber',
    cell: (info) => info.row.index + 1,
    enableSorting: false,
    meta: { initialVisibility: true, showInDropdown: true },
  },
  {
    header: 'Fecha',
    accessorKey: 'fecha',
    inputType: 'date',
    enableSorting: true,
    meta: { initialVisibility: true },
    cell: (info) => {
      const value = info.getValue() as string
      const date = new Date(value)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },
  },
  {
    header: 'Descripción',
    accessorKey: 'descripcion',
    inputType: 'text',
    enableSorting: true,
    meta: { initialVisibility: true },
  },
  {
    header: 'Estado',
    accessorKey: 'estado',
    enableSorting: false,
    meta: { initialVisibility: true },
    cell: (info) => {
      const rowData = info.row.original as GetFeriadosDTO
      return h(BaseSwitchButtonModuloPsicopedagogo, {
        modelValue: rowData.estado,
        'onUpdate:modelValue': (newVal: boolean) =>
          handleEstadoFeriado(rowData.citdnlId, newVal),
        activeLabel: 'Activo',
        inactiveLabel: 'Inactivo',
        disabled: false,
      })
    },
  },
  {
    header: 'Acciones',
    accessorKey: 'citdnlId',
    enableSorting: false,
    meta: { initialVisibility: true, showInDropdown: true },
    cell: (info) => {
      const rowData = info.row.original as GetFeriadosDTO
      if (rowData.citdnlId === editingFeriadoId.value) {
        return h('div', { class: 'flex space-x-2' }, [
          h(BaseButtonModuloPsicopedagogo, {
            text: 'Actualizar',
            action: 'actualizar',
            type: 'button',
            onClick: () => updateFeriadoDetalle(rowData.citdnlId),
          }),
          h(BaseButtonModuloPsicopedagogo, {
            text: 'Cancelar',
            action: 'cancelar',
            type: 'button',
            onClick: () => cancelEditing(),
          }),
        ])
      }
      return h(BaseButtonModuloPsicopedagogo, {
        text: 'Editar',
        action: 'editar',
        type: 'button',
        onClick: () => startEditingFeriado(rowData),
      })
    },
  },
]

const handleAgregarRegistro = () => {
  console.log('Evento agregarRegistro recibido, abriendo modal...')
  showModal.value = true
}

const handleCreated = (nuevoFeriado: GetFeriadosDTO) => {
  feriados.value.push(nuevoFeriado)
  fetchFeriados()
}
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>
