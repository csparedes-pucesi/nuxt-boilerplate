<template>
  <!-- Solo se muestra si visible es true -->
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto p-4">
    <!-- Contenedor del formulario (centrado) -->
    <div
      class="max-w-9xl mx-auto mt-14 p-4 border border-gray-300 shadow rounded bg-white"
    >
      <!-- Encabezado: título y botón Cerrar -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Actualizar Equipo</h2>
        <UButton
          variant="ghost"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm"
          @click="closeModal"
        >
          Cerrar
        </UButton>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Columna 1 -->
          <div class="space-y-2">
            <UInput
              v-model="form.ubicacion"
              label="Ubicación"
              placeholder="Ej: BIENESTAR"
            />
            <UInput
              v-model="form.marcaMonitor"
              label="Marca Monitor"
              placeholder="Ej: SAMSUNG"
            />
            <UInput
              v-model="form.marcaCpu"
              label="Marca CPU"
              placeholder="Ej: HP"
            />
            <UInput
              v-model="form.marcaProcesador"
              label="Procesador Marca"
              placeholder="Ej: Intel Core i5-3470"
            />
            <UInput
              v-model="form.ramCapacidad"
              label="RAM Capacidad"
              placeholder="Ej: 8 GB"
            />
            <UInput
              v-model="form.estadoDiscoAntes"
              label="Estado Disco Antes"
              placeholder="Ej: BUENO"
            />
            <USelect
              v-model="form.estadoMantenimiento"
              label="Estado Mantenimiento"
            >
              <option value="">Seleccionar</option>
              <option value="ACEPTADO">ACEPTADO</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="APROBADO AUTOMATICO">APROBADO AUTOMATICO</option>
            </USelect>
            <UInput
              v-model="form.fechaCompra"
              label="Fecha Compra"
              type="date"
            />
          </div>

          <!-- Columna 2 -->
          <div class="space-y-2">
            <UInput
              v-model="form.dependencia"
              label="Dependencia"
              placeholder="Ej: INGENIERIA"
            />
            <UInput
              v-model="form.modeloMonitor"
              label="Modelo Monitor"
              placeholder="Ej: HP"
            />
            <UInput
              v-model="form.modeloCpu"
              label="Modelo CPU"
              placeholder="Ej: Compaq 6300 Pro MT"
            />
            <UInput
              v-model="form.ramMarca"
              label="RAM Marca"
              placeholder="Ej: HYPERX"
            />
            <UInput
              v-model="form.discoMarca"
              label="Disco Marca"
              placeholder="Ej: WD"
            />
            <UInput
              v-model="form.estadoDiscoActual"
              label="Estado Disco Actual"
              placeholder="Ej: BUENO"
            />
            <UInput
              v-model="form.usuario"
              label="Usuario"
              placeholder="Ej: jibarra@pucesi.edu.ec"
            />
          </div>

          <!-- Columna 3 -->
          <div class="space-y-2">
            <UInput
              v-model="form.nombrePc"
              label="Nombre PC"
              placeholder="Ej: PASANTEING3"
            />
            <UInput
              v-model="form.codigoMonitor"
              label="Código Monitor"
              placeholder="Ej: 121015003066"
            />
            <UInput
              v-model="form.codigoCpu"
              label="Código CPU"
              placeholder="Ej: 121015002536"
            />
            <UInput
              v-model="form.discoSolido"
              label="Disco Sólido"
              placeholder="Ej: SSD 240 GB"
            />
          </div>
        </div>

        <!-- Observación (fila completa) -->
        <div class="mt-4">
          <UTextarea
            v-model="form.observacion"
            label="Observación"
            placeholder="Ej: Revisión general de equipo"
            :rows="2"
          />
        </div>
      </form>

      <!-- Botón Actualizar -->
      <div class="flex justify-end mt-4">
        <UButton
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          @click="actualizarEquipo"
        >
          Actualizar
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Recibe la prop `visible` para mostrar/ocultar el “modal”
const _props = defineProps<{
  visible: boolean
}>()

const emits = defineEmits(['update:visible'])

// Datos del formulario (inicialmente vacíos)
const form = ref({
  ubicacion: '',
  dependencia: '',
  nombrePc: '',
  marcaMonitor: '',
  modeloMonitor: '',
  marcaCpu: '',
  modeloCpu: '',
  marcaProcesador: '',
  ramMarca: '',
  ramCapacidad: '',
  discoMarca: '',
  estadoDiscoAntes: '',
  estadoDiscoActual: '',
  codigoMonitor: '',
  codigoCpu: '',
  usuario: '',
  estadoMantenimiento: '',
  fechaCompra: '',
  discoSolido: '',
  observacion: '',
})

// Cierra el “modal”
function closeModal() {
  emits('update:visible', false)
}

// Lógica al enviar el formulario (si deseas usar <form @submit.prevent="onSubmit">)
function onSubmit() {
  // ...
}

// Lógica del botón "Actualizar"
function actualizarEquipo() {
  console.log('Datos a actualizar:', form.value)
  // Aquí podrías llamar a una API o emitir un evento con la data
  // Ejemplo: emits('equipo-actualizado', form.value)
  closeModal()
}
</script>
