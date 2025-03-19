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
			<div
				class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800"
			>
				<ul class="space-y-2 font-medium">
					<!-- 🔹 Iterar sobre rutas principales -->
					<li
						v-for="(padre, index) in menuRutas"
						:key="index"
					>
						<a
							class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
							@click="navigation(padre.ruta_url)"
						>
							<span class="ms-1 font-bold">{{
								padre.ruta_nombre
							}}</span>
						</a>

						<!-- 🔸 Mostrar rutas hijas indentadas -->
						<ul
							v-if="padre.rutasHijas.length"
							class="ml-2 space-y-1"
						>
							<li
								v-for="(hija, subIndex) in padre.rutasHijas"
								:key="subIndex"
							>
								<a
									class="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
									@click="navigation(hija.ruta_url)"
								>
									<span class="ms-4">{{
										hija.ruta_nombre
									}}</span>
								</a>
							</li>
						</ul>
					</li>

					<!-- Botón de Cerrar Sesión -->
					<li class="mt-4">
						<!-- <button
            class="w-full flex items-center p-2 text-white bg-blue-700 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-500 dark:hover:bg-gray-600 cursor-pointer"
							@click="logout"
						>
							<i class="fas fa-sign-out-alt mr-2"></i> Cerrar
							Sesión
						</button> -->
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
				class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="px-3 py-3 lg:px-5 lg:pl-3">
					<div class="flex items-center justify-between">
						<!-- Logo -->
						<div
							class="flex items-center justify-start rtl:justify-end"
						>
							<!-- <button
              class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
								@click="toggleSidebar"
							>
								<span class="sr-only">Open sidebar</span>
								<svg
									class="w-6 h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										clip-rule="evenodd"
										fill-rule="evenodd"
										d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
									></path>
								</svg>
							</button> -->
							<UButton
								type="button"
								icon="heroicons:bars-3-bottom-left-20-solid"
								@click="toggleSidebar"
							/>
							<div
								class="flex ms-2 md:me-24 cursor-pointer"
								@click="
									router.push({
										name: 'consultoria',
										replace: true,
									})
								"
							>
								<!-- <img
									src="https://res.cloudinary.com/dx7qfps6d/image/upload/v1689608536/dev-deploys/eqayqo984zyobeq6zzxf.png"
									class="h-11 me-3"
									alt="Puce Ibarra Logo"
								/> -->
								<NuxtImg
									src="/logo-puce-i.png"
									alt="logo-puce"
								/>
							</div>
						</div>

						<!-- Usuario -->
						<!-- Icon Profile -->
						<div class="flex items-center">
							<div class="flex items-center ms-3">
								<div class="flex items-center ms-3">
									<span
										class="text-gray-700 text-sm font-semibold dark:text-gray-300 ml-2 pr-4"
										>Hola, {{ store.nombre }}! ;)</span
									>
									<button
										type="button"
										class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
										aria-expanded="false"
										data-dropdown-toggle="dropdown-user"
									>
										<span class="sr-only"
											>Open user menu</span
										>
										<!-- <img
											class="w-8 h-8 rounded-full"
											src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
											alt="user photo"
										/> -->
										<NuxtImg
											src="/user-profile.jpg"
											alt="user photo"
										/>
									</button>
								</div>
								<div
									id="dropdown-user"
									class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-300 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
								>
									<div
										class="px-4 py-3"
										role="none"
									>
										<p
											class="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
											role="none"
										>
											{{ store.nombre }}
										</p>
									</div>
									<ul
										class="py-1"
										role="none"
									>
										<li>
											<div
												class="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
											>
												<span>Cambiar tema</span>
												<button
													:class="[
														'relative inline-flex h-6 ml-2 w-11 items-center rounded-full transition-colors focus:outline-none',
														themeStore.isDarkMode
															? 'bg-blue-600'
															: 'bg-gray-200',
													]"
													@click="
														themeStore.toggleTheme
													"
												>
													<!-- Icono del Sol -->
													<svg
														xmlns="http://www.w3.org/2000/svg"
														:class="[
															'h-3 w-3 absolute transition-opacity',
															themeStore.isDarkMode
																? 'opacity-0 right-1'
																: 'opacity-100 right-1',
														]"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
														/>
													</svg>

													<!-- Icono de la Luna -->
													<svg
														xmlns="http://www.w3.org/2000/svg"
														:class="[
															'h-3 w-3 absolute transition-opacity',
															themeStore.isDarkMode
																? 'opacity-100 left-1'
																: 'opacity-0 left-1',
														]"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
														/>
													</svg>

													<!-- Círculo del toggle -->
													<span
														:class="[
															'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
															themeStore.isDarkMode
																? 'translate-x-6'
																: 'translate-x-1',
														]"
													/>
												</button>
											</div>
										</li>
										<li>
											<!-- <span
												
												class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
												role="menuitem"
                        @click="logout()"
											>
												<i
													class="fas fa-sign-out-alt mr-2"
												></i>
												Cerrar Sesión</span -->
											<UButton
												type="button"
												icon="heroicons:arrow-right-start-on-rectangle"
												label="Cerrar Sesión"
                        @click="logout"
											/>
											>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<!-- Contenido dinámico -->
			<div class="pt-14 bg-white dark:bg-gray-900">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAutenticacionStore } from '@/stores/use-autenticacion.store';
import { useRouter } from 'vue-router';
import { removeRoutesOnLogout } from '../helpers/parse-object-rutas';
import { initFlowbite } from 'flowbite';
import { useThemeStore } from '@/stores/use-theme.store';

const store = useAutenticacionStore();
const themeStore = useThemeStore();
const router = useRouter();
const sidebarOpen = ref(false);

const toggleSidebar = () => {
	sidebarOpen.value = !sidebarOpen.value;
};

const logout = () => {
	store.onLogout();
	removeRoutesOnLogout(router);
	localStorage.removeItem('token');
	sessionStorage.clear();
	router.push({ name: 'login', replace: true });
};
// 🔹 Construye la estructura de menú agrupando rutas padre e hijas
const menuRutas = computed(() => {
	const rutasMap = new Map();

	// 🔸 Agrupar rutas por ID
	store.rutas.forEach((ruta) => {
		rutasMap.set(ruta.ruta_id, { ...ruta, rutasHijas: [] });
	});

	// 🔹 Asignar rutas hijas a su padre
	store.rutas.forEach((ruta) => {
		if (ruta.ruta_padre !== 0) {
			const padre = rutasMap.get(ruta.ruta_padre);
			if (padre) {
				padre.rutasHijas.push(rutasMap.get(ruta.ruta_id));
			}
		}
	});

	// 🔹 Filtrar solo las rutas padre
	return Array.from(rutasMap.values()).filter(
		(ruta) => ruta.ruta_padre === 0
	);
});

const navigation = (routePath?: string) => {
	if (!routePath || routePath === '') return;
	router.push(routePath);
};

onMounted(() => {
	initFlowbite();
	themeStore.initTheme();
});
</script>
