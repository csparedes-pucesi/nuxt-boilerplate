<template>
  <!-- Solo se muestra si visible es true -->
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto p-4">
    <!-- Contenedor del formulario (centrado ) -->
    <div
      class="max-w-9xl mx-auto mt-14 p-4 border border-gray-300 shadow rounded bg-white"
    >
      <!-- Encabezado: título y botón Cerrar -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Actualizar Equipo</h2>
        <button
          @click="closeModal"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 text-sm"
        >
          Cerrar
        </button>
      </div>

      <!-- Formulario en 3 columnas -->
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Columna 1 -->
          <div class="space-y-2">
            <!-- Ubicación -->
            <label
              for="ubicacion"
              class="block text-sm font-medium text-gray-700"
            >
              Ubicación
            </label>
            <input
              id="ubicacion"
              type="text"
              v-model="form.ubicacion"
              placeholder="Ej: BIENESTAR"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Marca Monitor -->
            <label
              for="marcaMonitor"
              class="block text-sm font-medium text-gray-700"
            >
              Marca Monitor
            </label>
            <input
              id="marcaMonitor"
              type="text"
              v-model="form.marcaMonitor"
              placeholder="Ej: SAMSUNG"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Marca CPU -->
            <label
              for="marcaCpu"
              class="block text-sm font-medium text-gray-700"
            >
              Marca CPU
            </label>
            <input
              id="marcaCpu"
              type="text"
              v-model="form.marcaCpu"
              placeholder="Ej: HP"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Procesador Marca -->
            <label
              for="marcaProcesador"
              class="block text-sm font-medium text-gray-700"
            >
              Procesador Marca
            </label>
            <input
              id="marcaProcesador"
              type="text"
              v-model="form.marcaProcesador"
              placeholder="Ej: Intel Core i5-3470"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- RAM Capacidad -->
            <label
              for="ramCapacidad"
              class="block text-sm font-medium text-gray-700"
            >
              RAM Capacidad
            </label>
            <input
              id="ramCapacidad"
              type="text"
              v-model="form.ramCapacidad"
              placeholder="Ej: 8 GB"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Estado Disco Antes -->
            <label
              for="estadoDiscoAntes"
              class="block text-sm font-medium text-gray-700"
            >
              Estado Disco Antes
            </label>
            <input
              id="estadoDiscoAntes"
              type="text"
              v-model="form.estadoDiscoAntes"
              placeholder="Ej: BUENO"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Estado Mantenimiento -->
            <label
              for="estadoMantenimiento"
              class="block text-sm font-medium text-gray-700"
            >
              Estado Mantenimiento
            </label>
            <select
              id="estadoMantenimiento"
              v-model="form.estadoMantenimiento"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="ACEPTADO">ACEPTADO</option>
              <option value="ENVIADO">ENVIADO</option>
              <option value="APROBADO AUTOMATICO">APROBADO AUTOMATICO</option>
            </select>

            <!-- Fecha Compra -->
            <label
              for="fechaCompra"
              class="block text-sm font-medium text-gray-700"
            >
              Fecha Compra
            </label>
            <input
              id="fechaCompra"
              type="date"
              v-model="form.fechaCompra"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          <!-- Columna 2 -->
          <div class="space-y-2">
            <!-- Dependencia -->
            <label
              for="dependencia"
              class="block text-sm font-medium text-gray-700"
            >
              Dependencia
            </label>
            <input
              id="dependencia"
              type="text"
              v-model="form.dependencia"
              placeholder="Ej: INGENIERIA"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Modelo Monitor -->
            <label
              for="modeloMonitor"
              class="block text-sm font-medium text-gray-700"
            >
              Modelo Monitor
            </label>
            <input
              id="modeloMonitor"
              type="text"
              v-model="form.modeloMonitor"
              placeholder="Ej: HP"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Modelo CPU -->
            <label
              for="modeloCpu"
              class="block text-sm font-medium text-gray-700"
            >
              Modelo CPU
            </label>
            <input
              id="modeloCpu"
              type="text"
              v-model="form.modeloCpu"
              placeholder="Ej: Compaq 6300 Pro MT"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- RAM Marca -->
            <label
              for="ramMarca"
              class="block text-sm font-medium text-gray-700"
            >
              RAM Marca
            </label>
            <input
              id="ramMarca"
              type="text"
              v-model="form.ramMarca"
              placeholder="Ej: HYPERX"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Disco Marca -->
            <label
              for="discoMarca"
              class="block text-sm font-medium text-gray-700"
            >
              Disco Marca
            </label>
            <input
              id="discoMarca"
              type="text"
              v-model="form.discoMarca"
              placeholder="Ej: WD"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Estado Disco Actual -->
            <label
              for="estadoDiscoActual"
              class="block text-sm font-medium text-gray-700"
            >
              Estado Disco Actual
            </label>
            <input
              id="estadoDiscoActual"
              type="text"
              v-model="form.estadoDiscoActual"
              placeholder="Ej: BUENO"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Usuario -->
            <label
              for="usuario"
              class="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              v-model="form.usuario"
              placeholder="Ej: jibarra@pucesi.edu.ec"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          <!-- Columna 3 -->
          <div class="space-y-2">
            <!-- Nombre PC -->
            <label
              for="nombrePc"
              class="block text-sm font-medium text-gray-700"
            >
              Nombre PC
            </label>
            <input
              id="nombrePc"
              type="text"
              v-model="form.nombrePc"
              placeholder="Ej: PASANTEING3"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Código Monitor -->
            <label
              for="codigoMonitor"
              class="block text-sm font-medium text-gray-700"
            >
              Código Monitor
            </label>
            <input
              id="codigoMonitor"
              type="text"
              v-model="form.codigoMonitor"
              placeholder="Ej: 121015003066"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Código CPU -->
            <label
              for="codigoCpu"
              class="block text-sm font-medium text-gray-700"
            >
              Código CPU
            </label>
            <input
              id="codigoCpu"
              type="text"
              v-model="form.codigoCpu"
              placeholder="Ej: 121015002536"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />

            <!-- Disco Sólido -->
            <label
              for="discoSolido"
              class="block text-sm font-medium text-gray-700"
            >
              Disco Sólido
            </label>
            <input
              id="discoSolido"
              type="text"
              v-model="form.discoSolido"
              placeholder="Ej: SSD 240 GB"
              class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <!-- Observación (toda la fila) -->
        <div class="mt-4">
          <label
            for="observacion"
            class="block text-sm font-medium text-gray-700"
          >
            Observación
          </label>
          <textarea
            id="observacion"
            v-model="form.observacion"
            class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            rows="2"
            placeholder="Ej: Revisión general de equipo"
          ></textarea>
        </div>
      </form>

      <!-- Botón Actualizar -->
      <div class="flex justify-end mt-4">
        <button
          @click="actualizarEquipo"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Actualizar
        </button>
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
