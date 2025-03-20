<template>
  <div>
    <!-- PRIMER CONTENEDOR: BARRA Y MENÚ -->
    <div class="relative z-10">
      <!-- Barra superior azul -->
      <div
        class="mt-3.5 flex flex-wrap items-center bg-sky-400 px-4 py-2 text-white font-bold"
      >
        <!-- Logo o imagen  -->
        <div class="flex items-center bg-gray-800 px-3 py-2 rounded-md">
          <NuxtImg src="/logopuce-si1.png" alt="PUCE" class="h-10" />
        </div>

        <div class="flex items-center gap-3 ml-4">
          <!-- Ícono y texto con tamaños responsivos -->
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
          class="bg-gray-800 text-white py-2 md:py-4 px-4 md:px-6 flex items-center"
        >
          <div
            class="flex items-center cursor-pointer text-sm md:text-xl"
            @click="toggleMenu"
          >
            <UIcon
              name="fa6-solid:briefcase"
              class="mr-2 md:mr-3 text-lg md:text-2xl"
            />
            <span class="font-bold text-lg md:text-2xl">
              SISTEMA MANTENIMIENTO
            </span>
            <UIcon
              name="fa6-solid:chevron-right"
              class="ml-2 md:ml-3 text-lg md:text-2xl"
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

    <!-- CONTENIDO PRINCIPAL -->
    <div class="p-3 md:p-6">
      <!-- TÍTULO -->
      <h1 class="text-xl md:text-3xl font-bold">
        <span class="text-black">Inventario</span>
        <span class="text-gray-500 ml-1">Equipos de computo</span>
      </h1>

      <!-- FORMULARIO -->
      <div class="bg-white shadow-md p-4 md:p-6 mt-4 rounded-md">
        <label
          for="catalogo"
          class="block text-gray-700 font-bold text-sm md:text-base mb-2"
        >
          Catálogo
        </label>
        <select
          id="catalogo"
          class="border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-300 h-10 md:h-12 px-2 md:px-3 text-xs md:text-sm w-full sm:w-64 md:w-72 appearance-none"
        >
          <option>[Seleccione]</option>
        </select>
      </div>

      <!-- TABLA DE INVENTARIO -->
      <div class="mt-4 md:mt-6">
        <InventarioMantenimientoTable />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { useRouter } from 'vue-router'
// import { obtenerRutasConPadre7 } from '@/modules/dashboard/helpers/parse-object-rutas'
import InventarioMantenimientoTable from '@/pages/mantenimiento/components/InventarioMantenimientoTable.vue'

// const router = useRouter()
const menuOpen = ref<boolean>(false)
const menuRef = ref<HTMLElement | null>(null)
interface Submenu {
  ruta_nombre: string
  ruta_url: string
  icono: string
}

const toggleMenu = (): void => {
  menuOpen.value = !menuOpen.value
}

const menuItems = ref<Submenu[]>([
  {
    ruta_nombre: 'Reporte de inventario',
    ruta_url: '/mantenimiento/reporte-inventario',
    icono: 'mdi:clipboard-text', // Ícono de reporte/documento
  },
  {
    ruta_nombre: 'Mantenimiento preventivo',
    ruta_url: '/mantenimiento/mantenimiento-preventivo',
    icono: 'mdi:tools', // Ícono de herramientas/mantenimiento
  },
  {
    ruta_nombre: 'Administración de catálogos',
    ruta_url: '/mantenimiento/administracion-catalogos',
    icono: 'mdi:book-open-variant', // Ícono de gestión de catálogos
  },
  {
    ruta_nombre: 'Inventario',
    ruta_url: '/mantenimiento/inventario',
    icono: 'mdi:archive', // Ícono de almacenamiento/inventario
  },
])
function openSubmenu(submenu: Submenu): void {
  // Ejemplo: expandir un submenú o cambiar estado
  console.log('Abriendo submenu:', submenu)
}

// const navigateTo = (url: string): void => {
//   menuOpen.value = false
//   router.push(url)
// }

const handleClickOutside = (event: Event): void => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted((): void => {
  document.addEventListener('click', handleClickOutside)

  // const rutasMantenimiento = obtenerRutasConPadre7()
  // console.log(
  //   '🛠 Rutas de mantenimiento cargadas en el menú:',
  //   rutasMantenimiento
  // )

  // menuItems.value = rutasMantenimiento.map((ruta: any) => ({
  //   ruta_nombre: ruta.ruta_nombre,
  //   ruta_url: ruta.ruta_url,
  //   open: false,
  // }))
})

onUnmounted((): void => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
