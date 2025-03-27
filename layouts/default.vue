<template>
  <div class="relative min-h-screen bg-white dark:bg-gray-900">
    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm z-30"
      @click="toggleSidebar"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <!-- 🔹 Iterar sobre rutas principales -->
          <li
            v-for="(padre, index) in [
              {
                ruta_id: 22,
                ruta_padre: 18,
                ruta_nombre: 'Reporte de citas',
                ruta_ruta: 'reporte-citas',
                ruta_url: '/reporte-citas',
                ruta_component:
                  '/modules/Psicologia/pages/ReporteCitasPage.vue',
                ruta_indexed: false,
                roru_privilegio: 1,
              },
              {
                ruta_id: 11,
                ruta_padre: 7,
                ruta_nombre: 'Reporte de inventario',
                ruta_ruta: 'reporte-inventario',
                ruta_url: '/reporte-inventario',
                ruta_component:
                  '/modules/consultoria/pages/ReporteInventarioPage.vue',
                ruta_indexed: false,
                roru_privilegio: 1,
              },
              {
                ruta_id: 2,
                ruta_padre: 1,
                ruta_nombre: 'Empresas',
                ruta_ruta: 'empresas',
                ruta_url: '/empresas',
                ruta_component: '/modules/consultoria/pages/EmpresasPage.vue',
                ruta_indexed: false,
                roru_privilegio: 1,
              },
            ]"
            :key="index"
          >
            <a
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              @click="navigation(padre.ruta_url)"
            >
              <span class="ms-1 font-bold">{{ padre.ruta_nombre }}</span>
            </a>

            <!-- 🔸 Mostrar rutas hijas indentadas -->
            <ul class="ml-2 space-y-1">
              <li>
                <a
                  class="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <span class="ms-4">{{ padre.ruta_nombre }}</span>
                </a>
              </li>
            </ul>
          </li>

          <!-- Botón de Cerrar Sesión -->
          <li class="mt-4">
            <UButton
              type="button"
              icon="heroicons:arrow-right-start-on-rectangle"
              label="Cerrar Sesión"
              @click="logout"
            />
          </li>
        </ul>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <div
      :class="{ 'overflow-hidden': sidebarOpen }"
      class="transition-transform duration-300 bg-white dark:bg-gray-900"
    >
      <nav
        class="fixed top-0 z-40 w-full h-[70px] bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-3.5">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center justify-start rtl:justify-end">
              <UButton
                type="button"
                icon="heroicons:bars-3-bottom-left-20-solid"
                :ui="{ leadingIcon: 'text-xl' }"
                class="mr-4"
                @click="toggleSidebar"
              />

              <NuxtImg
                class="m-0"
                src="/psi.png"
                alt="logo-puce"
                width="170"
                height="38"
                @click="router.push({ name: 'consultoria', replace: true })"
              />
            </div>

            <!-- Usuario -->
            <!-- Icon Profile -->
            <div class="flex items-center">
              <span class="px-2">Hola {{ 'inserte nombre' }}</span>
              <UDropdownMenu
                :items="items"
                :content="{ align: 'end' }"
                :ui="{ content: 'w-40' }"
              >
                <NuxtImg
                  class="rounded-full"
                  src="/user-profile.jpg"
                  alt="user photo"
                  width="40"
                  height="40"
                />
                <template #switcher>
                  <USwitch
                    v-model="switchTheme"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Check me"
                    @change="toggleTheme"
                  />
                </template>
              </UDropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <!-- Contenido dinámico -->
      <div class="py-20 px-4 bg-white dark:bg-gray-900">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const logout = () => {
  // 🧽 Limpiar cookies
  const token = useCookie('token')
  const rutas = useCookie('rutas')
  token.value = null
  rutas.value = null

  // 🧹 Limpiar storage (por si acaso)
  localStorage.clear()
  sessionStorage.clear()

  // 🔁 Redirigir al login
  router.push({ name: 'login', replace: true })
}

const navigation = (routePath?: string) => {
  if (!routePath || routePath === '') return
  router.push(routePath)
}

const switchTheme = ref(false)
const toggleTheme = () => {
  switchTheme.value = !switchTheme.value
  document.documentElement.classList.toggle('dark')
}
const items: DropdownMenuItem[] = [
  {
    label: 'Cambiar tema',
    slot: 'switcher',
  },
  {
    type: 'separator',
  },
  {
    label: 'Logout',
    icon: 'heroicons:arrow-right-start-on-rectangle',
    color: 'error',
  },
]
</script>
