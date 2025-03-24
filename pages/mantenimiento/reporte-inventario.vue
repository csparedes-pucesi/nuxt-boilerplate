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
            <span class="font-bold text-base md:text-xl"
              >SISTEMA MANTENIMIENTO</span
            >
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

    <!-- SEGUNDO CONTENEDOR: IMAGEN DE FONDO FUNCIONAL -->
    <div
      class="relative mt-8 flex justify-center items-center min-h-[150px] md:min-h-[200px]"
    >
      <NuxtImg
        src="/logo-puce-i.png"
        alt="Logo PUCE-I"
        class="absolute inset-0 w-full h-full object-contain opacity-60 z-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Ejemplo de interfaz para tus ítems de menú
interface Submenu {
  ruta_nombre: string
  ruta_url: string
  icono: string
}

// Refs y datos reactivos
const menuOpen = ref<boolean>(false)
const menuRef = ref<HTMLElement | null>(null)
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

// Métodos
function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}

function openSubmenu(submenu: Submenu): void {
  // Ejemplo: expandir un submenú o cambiar estado
  console.log('Abriendo submenu:', submenu)
}
// Función para cerrar el menú si el clic ocurre fuera
function closeMenuIfClickedOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}
// Agregar y remover el event listener
onMounted(() => {
  document.addEventListener('click', closeMenuIfClickedOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuIfClickedOutside)
})

// function navigateTo(url: string): void {
//   // Ejemplo: usar router push si lo deseas
//   console.log('Navegando a:', url)
// }
</script>
