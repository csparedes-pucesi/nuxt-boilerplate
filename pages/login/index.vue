<template>
	<div class="flex items-center justify-center min-h-screen">
		<div
			class="bg-white/80 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-xl"
		>
			<h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">
				Bienvenido
			</h2>
			<form class="space-y-6">
				<label
					for="username"
					class="block text-gray-800 text-sm font-semibold mb-2"
				>
					Nombre de Usuario
				</label>
				<UInput
					icon="heroicons:user-circle"
					size="xl"
					variant="outline"
					placeholder="Ingrese su usuario"
					class="w-full rounded-lg"
				/>
				<label
					for="password"
					class="block text-gray-800 text-sm font-semibold mb-2"
				>
					Contraseña
				</label>
				<UInput
					icon="heroicons:lock-closed"
					size="xl"
					variant="outline"
					placeholder="Ingrese su usuario"
					class="w-full rounded-lg"
				/>

				<UButton
					type="button"
					class="w-full flex items-center justify-center p-4"
					label="Ingresar"
					@click="$router.push('/dashboard')"
				/>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'login',
});
</script>

<style></style>
