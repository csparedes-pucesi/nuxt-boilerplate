<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="bg-white/80 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-xl"
    >
      <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">
        Bienvenido
      </h2>

      <UForm
        :state="state"
        :schema="schema"
        @submit="onSubmit"
        class="space-y-6"
      >
        <UFormField name="email" label="Correo Electrónico">
          <UInput
            v-model="state.email"
            icon="i-heroicons-envelope"
            placeholder="correo@ejemplo.com"
            size="xl"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UFormField name="password" label="Contraseña">
          <UInput
            v-model="state.password"
            icon="i-heroicons-lock-closed"
            type="password"
            placeholder="******"
            size="xl"
            variant="outline"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          class="w-full flex items-center justify-center p-4"
          :loading="loading"
          label="Ingresar"
        />
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as z from 'zod'
import { useRouter } from 'vue-router'
import { useToast } from '#imports'
import type { FormSubmitEvent } from '@nuxt/ui'

const router = useRouter()
const toast = useToast()

const schema = z.object({
  email: z
    .string()
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9_.-]{3,}$/.test(value),
      {
        message: 'Debe ser un correo válido o un nombre de usuario',
      }
    ),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({
  email: '',
  password: '',
})

const loading = ref(false)

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true

  // Mostrar toast de "procesando"
  const processing = toast.add({
    title: 'Procesando...',
    description: 'Estamos verificando tus credenciales...',
    color: 'info',
    icon: 'i-heroicons-arrow-path',
    duration: 2000, // ⏳ espera 2s antes de redirigir
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.remove(processing.id)

    toast.add({
      title: 'Inicio de sesión exitoso',
      description: `Bienvenido, ${event.data.email}`,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    // ⏳ Espera brevemente antes de redirigir
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (err) {
    toast.remove(processing.id)

    toast.add({
      title: 'Error al iniciar sesión',
      description: 'Revisa tus credenciales e inténtalo de nuevo.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })

    console.error('❌ Error en login:', err)
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'login',
})
</script>
