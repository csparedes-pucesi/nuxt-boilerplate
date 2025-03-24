<template>
  <div>
    <!-- PRIMER CONTENEDOR: BARRA Y MENÚ -->
    <div class="relative z-10">
      <!-- Barra superior azul -->
      <div
        class="mt-3.5 flex flex-wrap items-center bg-sky-400 px-4 py-2 text-white font-bold"
      >
        <!-- Logo o imagen -->
        <div class="flex items-center bg-gray-800 px-3 py-2 rounded-md">
          <NuxtImg src="/logopuce-si1.png" alt="PUCE" class="h-10" />
        </div>
        <div class="flex items-center gap-3 ml-4">
          <UIcon
            name="fa6-solid:screwdriver-wrench"
            class="text-white text-2xl md:text-4xl"
          />
          <span class="text-white text-xl md:text-4xl font-bold">
            Sistema Mantenimiento
          </span>
        </div>
      </div>

      <!-- Menú principal -->
      <div ref="menuRef" class="relative z-10">
        <div
          class="bg-gray-800 text-white py-2 md:py-3 px-4 md:px-6 flex items-center"
        >
          <div
            class="flex items-center cursor-pointer text-sm md:text-lg"
            @click="toggleMenu"
          >
            <UIcon
              name="fa6-solid:briefcase"
              class="mr-2 text-base md:text-2xl"
            />
            <span class="font-bold text-base md:text-xl">
              SISTEMA MANTENIMIENTO
            </span>
            <UIcon
              name="heroicons:chevron-right-16-solid"
              class="ml-2 text-2xl md:text-3xl"
            />
          </div>
        </div>

        <!-- Menú desplegable dinámico -->
        <div
          v-if="menuOpen"
          class="absolute bg-white shadow-lg mt-1 w-52 md:w-64"
        >
          <UButton
            v-for="item in menuItems"
            :key="item.ruta_url"
            :to="item.ruta_url"
            variant="ghost"
            class="flex items-center w-full px-4 py-2 md:py-3 hover:bg-gray-200 cursor-pointer text-xs md:text-sm"
            @mouseover="openSubmenu(item)"
          >
            <UIcon :name="item.icono" class="mr-2 text-sm md:text-base" />
            <span class="font-semibold">{{ item.ruta_nombre }}</span>
            <UIcon
              name="heroicons:chevron-right"
              class="ml-auto text-sm md:text-base"
            />
          </UButton>
        </div>
      </div>
    </div>

    <h2 class="text-xl md:text-2xl font-bold mt-4 pl-4">
      Administración de Catálogos
    </h2>

    <!-- 
      Contenedor principal con grid de 1 columna en pantallas pequeñas
      y 2 columnas a partir de 768px (md:).
      Usamos "md:grid-cols-[300px_1fr]" para que en pantallas grandes los paneles 
      se muestren lado a lado y solo se apilen en móviles.
    -->
    <div class="grid grid-cols-1 md:grid-cols-[390px_1fr] gap-4 px-4">
      <!-- Panel izquierdo: Catálogos disponibles -->
      <!-- Panel izquierdo: Catálogos disponibles -->
      <div>
        <!-- Botón Toggle -->
        <div
          class="flex items-center justify-between bg-white shadow-md rounded-lg mt-4 pl-4 pr-4 py-2"
        >
          <h3 class="text-lg md:text-xl font-bold mr-4" style="color: #5a9bd5">
            Catálogos Disponibles
          </h3>
          <UButton
            variant="ghost"
            class="text-blue-500 focus:outline-none"
            @click="catalogosVisible = !catalogosVisible"
          >
            <UIcon
              :name="
                catalogosVisible
                  ? 'fa6-solid:chevron-up'
                  : 'fa6-solid:chevron-down'
              "
              class="text-lg md:text-xl"
            />
          </UButton>
        </div>

        <!-- Lista de catálogos -->
        <div
          :class="{ hidden: !catalogosVisible, block: catalogosVisible }"
          class="bg-white shadow-md rounded-lg mt-2 pl-4 w-full"
        >
          <!-- Botones de acciones -->
          <div class="flex flex-wrap gap-2 mb-3">
            <UButton
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-xs md:text-sm"
              @click="activarNuevoCatalogo"
            >
              Nuevo
            </UButton>
            <UButton
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 text-xs md:text-sm"
              :disabled="!catalogoSeleccionado"
            >
              Añadir hijo
            </UButton>
            <UButton
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 text-xs md:text-sm"
              :disabled="!catalogoSeleccionado"
            >
              Actualizar
            </UButton>
            <UButton
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 text-xs md:text-sm"
              :disabled="!catalogoSeleccionado"
            >
              Eliminar
            </UButton>
          </div>

          <!-- Lista con scroll -->
          <div class="bg-blue-100 p-2 rounded-md h-64 md:h-96 overflow-y-auto">
            <ul>
              <li
                v-for="(catalogo, index) in catalogos"
                :key="index"
                :class="{
                  'bg-blue-500 text-white font-bold':
                    catalogoSeleccionado &&
                    catalogoSeleccionado.codigo === catalogo.codigo,
                  'hover:bg-blue-200':
                    !catalogoSeleccionado ||
                    catalogoSeleccionado.codigo !== catalogo.codigo,
                }"
                class="p-2 border-b cursor-pointer text-xs md:text-sm"
                @click="seleccionarCatalogo(catalogo)"
              >
                {{ catalogo.nombre }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Información del catálogo -->
      <div class="bg-white shadow-md rounded-lg p-5 overflow-auto max-h-[90vh]">
        <h3 class="text-lg md:text-xl font-bold mb-3" style="color: #5a9bd5">
          Información Catálogo
        </h3>

        <!-- Contenedor principal: 2 columnas (lado izquierdo y lado derecho) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Columna izquierda -->
          <div class="grid grid-cols-[max-content,1fr] items-center gap-4">
            <label class="font-bold text-xs md:text-sm">Código:</label>
            <UInput
              v-model="infoCatalogo.codigo"
              type="text"
              placeholder="Ingrese el Código"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="w-full p-2 text-xs md:text-sm"
              :class="{ 'bg-gray-100': !catalogoSeleccionado && !modoNuevo }"
            />

            <label class="font-bold text-xs md:text-sm">Nombre:</label>
            <UInput
              v-model="infoCatalogo.nombre"
              type="text"
              placeholder="Ingrese el Nombre"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="w-full p-2 text-xs md:text-sm"
              :class="{ 'bg-gray-100': !catalogoSeleccionado && !modoNuevo }"
            />

            <label class="font-bold text-xs md:text-sm">Editable:</label>
            <URadioGroup
              v-model="infoCatalogo.editable"
              :items="['SI', 'NO']"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="flex flex-row gap-4 text-xs md:text-sm"
            />
          </div>

          <!-- Columna derecha -->
          <div class="grid grid-cols-[max-content,1fr] items-center gap-4">
            <label class="font-bold text-xs md:text-sm">
              Tiempo de expirar Cache:
            </label>
            <UInput
              type="text"
              placeholder="Ingrese el Tiempo"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="w-full p-2 text-xs md:text-sm"
              :class="{ 'bg-gray-100': !catalogoSeleccionado && !modoNuevo }"
            />

            <label class="font-bold text-xs md:text-sm">Descripción:</label>
            <UInput
              v-model="infoCatalogo.descripcion"
              type="text"
              placeholder="Ingrese Descripción"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="w-full p-2 text-xs md:text-sm"
              :class="{ 'bg-gray-100': !catalogoSeleccionado && !modoNuevo }"
            />

            <label class="font-bold text-xs md:text-sm">Estado:</label>
            <URadioGroup
              v-model="infoCatalogo.estado"
              :items="['Vigente', 'No Vigente']"
              :disabled="!catalogoSeleccionado && !modoNuevo"
              class="flex flex-row gap-4 text-xs md:text-sm"
            />
          </div>
        </div>

        <div v-if="modoNuevo" class="flex flex-wrap gap-2 mt-4">
          <UButton
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-xs md:text-sm"
            @click="guardarNuevoCatalogo"
          >
            Añadir
          </UButton>
          <UButton
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-xs md:text-sm"
            @click="cancelarNuevoCatalogo"
          >
            Cancelar
          </UButton>
        </div>

        <!-- Sección de la Tabla -->
        <div v-if="catalogoSeleccionado" class="mt-10">
          <h3 class="text-lg md:text-xl font-bold pl-5" style="color: #5a9bd5">
            Items del Catálogo
          </h3>
          <MantenimientoItemsCatalogoTable :items="itemsFiltrados" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Catalogo } from '~/types/mantenimiento/Catalogo.dto'

interface Submenu {
  ruta_nombre: string
  ruta_url: string
  icono: string
}

const menuOpen = ref<boolean>(false)
const catalogosVisible = ref<boolean>(true)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = (): void => {
  menuOpen.value = !menuOpen.value
}
const menuItems = ref<Submenu[]>([
  {
    ruta_nombre: 'Reporte de inventario',
    ruta_url: '/mantenimiento/reporte-inventario',
    icono: 'mdi:clipboard-text',
  },
  {
    ruta_nombre: 'Mantenimiento preventivo',
    ruta_url: '/mantenimiento/mantenimiento-preventivo',
    icono: 'mdi:tools',
  },
  {
    ruta_nombre: 'Administración de catálogos',
    ruta_url: '/mantenimiento/administracion-catalogos',
    icono: 'mdi:book-open-variant',
  },
  {
    ruta_nombre: 'Inventario',
    ruta_url: '/mantenimiento/inventario',
    icono: 'mdi:archive',
  },
])
function openSubmenu(submenu: Submenu): void {
  console.log('Abriendo submenu:', submenu)
}

const handleClickOutside = (event: Event): void => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

const catalogos = ref<Catalogo[]>([
  {
    nombre: 'TIPO DE PANTALLA',
    codigo: 'TIPPANT',
    editable: 'SI',
    descripcion: 'TIPO DE PANTALLA',
    estado: 'No Vigente',
    items: [
      {
        codigo: 'LCD',
        nombre: 'LCD',
        descripcion: 'Pantalla LCD',
        estado: 'Vigente',
      },
      {
        codigo: 'LED',
        nombre: 'LED',
        descripcion: 'Pantalla LED',
        estado: 'Vigente',
      },
      {
        codigo: 'OLED',
        nombre: 'OLED',
        descripcion: 'Pantalla OLED',
        estado: 'Vigente',
      },
      {
        codigo: 'TOUCHSCREEN',
        nombre: 'Touchscreen',
        descripcion: 'Pantalla táctil',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'RESOLUCIÓN DE PANTALLA',
    codigo: 'RESPANT',
    editable: 'SI',
    descripcion: 'RESOLUCIÓN DE PANTALLA',
    estado: 'Vigente',
    items: [
      {
        codigo: 'HD',
        nombre: 'HD',
        descripcion: '1280x720',
        estado: 'Vigente',
      },
      {
        codigo: 'FULL HD',
        nombre: 'Full HD',
        descripcion: '1920x1080',
        estado: 'Vigente',
      },
      {
        codigo: '2K',
        nombre: '2K',
        descripcion: '2560x1440',
        estado: 'Vigente',
      },
      {
        codigo: '4K',
        nombre: '4K',
        descripcion: '3840x2160',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'TIPO DE PUERTOS',
    codigo: 'TIPPUER',
    editable: 'NO',
    descripcion: 'TIPO DE PUERTOS DISPONIBLES',
    estado: 'Vigente',
    items: [
      {
        codigo: 'USB-A',
        nombre: 'USB-A',
        descripcion: 'Puerto USB tipo A',
        estado: 'Vigente',
      },
      {
        codigo: 'USB-C',
        nombre: 'USB-C',
        descripcion: 'Puerto USB tipo C',
        estado: 'Vigente',
      },
      {
        codigo: 'HDMI',
        nombre: 'HDMI',
        descripcion: 'Puerto HDMI',
        estado: 'Vigente',
      },
      {
        codigo: 'ETHERNET',
        nombre: 'Ethernet',
        descripcion: 'Puerto de red Ethernet',
        estado: 'Vigente',
      },
      {
        codigo: 'AUDIO JACK',
        nombre: 'Audio Jack',
        descripcion: 'Puerto de audio 3.5mm',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'TIPO DE BATERÍA',
    codigo: 'TIPBATT',
    editable: 'SI',
    descripcion: 'TIPO DE BATERÍA',
    estado: 'Vigente',
    items: [
      {
        codigo: 'ION-LITIO',
        nombre: 'Ion de Litio',
        descripcion: 'Batería de Ion-Litio',
        estado: 'Vigente',
      },
      {
        codigo: 'POLIMERO-LITIO',
        nombre: 'Polímero de Litio',
        descripcion: 'Batería de Polímero de Litio',
        estado: 'Vigente',
      },
      {
        codigo: 'REMOVIBLE',
        nombre: 'Removible',
        descripcion: 'Batería Removible',
        estado: 'Vigente',
      },
      {
        codigo: 'NO REMOVIBLE',
        nombre: 'No Removible',
        descripcion: 'Batería No Removible',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'MARCAS DISPONIBLES',
    codigo: 'MARCAS',
    editable: 'SI',
    descripcion: 'MARCAS DISPONIBLES',
    estado: 'Vigente',
    items: [
      {
        codigo: 'DELL',
        nombre: 'Dell',
        descripcion: 'Marca Dell',
        estado: 'Vigente',
      },
      {
        codigo: 'HP',
        nombre: 'HP',
        descripcion: 'Marca HP',
        estado: 'Vigente',
      },
      {
        codigo: 'LENOVO',
        nombre: 'Lenovo',
        descripcion: 'Marca Lenovo',
        estado: 'Vigente',
      },
      {
        codigo: 'ASUS',
        nombre: 'Asus',
        descripcion: 'Marca Asus',
        estado: 'Vigente',
      },
      {
        codigo: 'APPLE',
        nombre: 'Apple',
        descripcion: 'Marca Apple',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'TIPO DE TECLADO',
    codigo: 'TIPTECL',
    editable: 'NO',
    descripcion: 'TIPO DE TECLADO',
    estado: 'Vigente',
    items: [
      {
        codigo: 'MEMBRANA',
        nombre: 'Membrana',
        descripcion: 'Teclado de membrana',
        estado: 'Vigente',
      },
      {
        codigo: 'MECÁNICO',
        nombre: 'Mecánico',
        descripcion: 'Teclado mecánico',
        estado: 'Vigente',
      },
      {
        codigo: 'ERGONÓMICO',
        nombre: 'Ergonómico',
        descripcion: 'Teclado ergonómico',
        estado: 'Vigente',
      },
      {
        codigo: 'RETROILUMINADO',
        nombre: 'Retroiluminado',
        descripcion: 'Teclado con retroiluminación',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'TIPO DE MOUSE',
    codigo: 'TIPMOUSE',
    editable: 'SI',
    descripcion: 'TIPO DE MOUSE',
    estado: 'Vigente',
    items: [
      {
        codigo: 'ÓPTICO',
        nombre: 'Óptico',
        descripcion: 'Mouse óptico',
        estado: 'Vigente',
      },
      {
        codigo: 'LÁSER',
        nombre: 'Láser',
        descripcion: 'Mouse láser',
        estado: 'Vigente',
      },
      {
        codigo: 'INALÁMBRICO',
        nombre: 'Inalámbrico',
        descripcion: 'Mouse inalámbrico',
        estado: 'Vigente',
      },
      {
        codigo: 'ERGONÓMICO',
        nombre: 'Ergonómico',
        descripcion: 'Mouse ergonómico',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'TIPO DE REFRIGERACIÓN',
    codigo: 'TIPREFRIG',
    editable: 'NO',
    descripcion: 'TIPO DE REFRIGERACIÓN',
    estado: 'Vigente',
    items: [
      {
        codigo: 'AIRE',
        nombre: 'Aire',
        descripcion: 'Refrigeración por aire',
        estado: 'Vigente',
      },
      {
        codigo: 'LÍQUIDA',
        nombre: 'Líquida',
        descripcion: 'Refrigeración líquida',
        estado: 'Vigente',
      },
      {
        codigo: 'PASIVA',
        nombre: 'Pasiva',
        descripcion: 'Refrigeración pasiva sin ventilador',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'SISTEMA DE SEGURIDAD',
    codigo: 'TIPSEGUR',
    editable: 'SI',
    descripcion: 'SISTEMA DE SEGURIDAD',
    estado: 'Vigente',
    items: [
      {
        codigo: 'HUELLA',
        nombre: 'Huella',
        descripcion: 'Lector de huellas digitales',
        estado: 'Vigente',
      },
      {
        codigo: 'FACIAL',
        nombre: 'Facial',
        descripcion: 'Reconocimiento facial',
        estado: 'Vigente',
      },
      {
        codigo: 'PIN',
        nombre: 'PIN',
        descripcion: 'Autenticación por PIN',
        estado: 'Vigente',
      },
      {
        codigo: 'TARJETA',
        nombre: 'Tarjeta',
        descripcion: 'Acceso mediante tarjeta RFID',
        estado: 'Vigente',
      },
    ],
  },
  {
    nombre: 'CONECTIVIDAD',
    codigo: 'TIPCONEC',
    editable: 'SI',
    descripcion: 'CONECTIVIDAD DISPONIBLE',
    estado: 'Vigente',
    items: [
      {
        codigo: 'WIFI 5',
        nombre: 'WiFi 5',
        descripcion: 'Conectividad WiFi 5 (802.11ac)',
        estado: 'Vigente',
      },
      {
        codigo: 'WIFI 6',
        nombre: 'WiFi 6',
        descripcion: 'Conectividad WiFi 6 (802.11ax)',
        estado: 'Vigente',
      },
      {
        codigo: 'BLUETOOTH 4.2',
        nombre: 'Bluetooth 4.2',
        descripcion: 'Bluetooth versión 4.2',
        estado: 'Vigente',
      },
      {
        codigo: 'BLUETOOTH 5.0',
        nombre: 'Bluetooth 5.0',
        descripcion: 'Bluetooth versión 5.0',
        estado: 'Vigente',
      },
      {
        codigo: 'NFC',
        nombre: 'NFC',
        descripcion: 'Comunicación de corto alcance NFC',
        estado: 'Vigente',
      },
    ],
  },
])

const infoCatalogo = ref<Catalogo>({
  codigo: '',
  nombre: '',
  editable: '',
  descripcion: '',
  estado: '',
})

const catalogoSeleccionado = ref<Catalogo | null>(null)
const itemsFiltrados = computed(() => catalogoSeleccionado.value?.items ?? [])

const modoNuevo = ref<boolean>(false)
const activarNuevoCatalogo = (): void => {
  modoNuevo.value = true
  catalogoSeleccionado.value = null
  infoCatalogo.value = {
    codigo: '',
    nombre: '',
    editable: '',
    descripcion: '',
    estado: '',
  }
}
const guardarNuevoCatalogo = (): void => {
  if (!infoCatalogo.value.codigo || !infoCatalogo.value.nombre) {
    alert('Debe ingresar código y nombre')
    return
  }
  catalogos.value.push({ ...infoCatalogo.value, items: [] })
  console.log('Nuevo catálogo guardado:', infoCatalogo.value)
  modoNuevo.value = false
}
const cancelarNuevoCatalogo = (): void => {
  modoNuevo.value = false
  infoCatalogo.value = {
    codigo: '',
    nombre: '',
    editable: '',
    descripcion: '',
    estado: '',
  }
}
const seleccionarCatalogo = (catalogo: Catalogo): void => {
  infoCatalogo.value = { ...catalogo }
  catalogoSeleccionado.value = catalogo
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
