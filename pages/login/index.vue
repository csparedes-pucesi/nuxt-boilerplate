<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import { usePostLogin } from '../../composables/login/login'

definePageMeta({
  layout: 'login',
})

const schema = z.object({
  username: z.string({ message: 'El nombre de usuario es requerido' }),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(3, 'Mínimo debe tener 3 caracteres'),
})

type Schema = z.infer<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

const toast = useToast()
const useLogin = usePostLogin()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await useLogin.mutateAsync(event.data)
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  toast.add({
    title: 'Acceso correcto',
    description: `${useLogin.data}`,
  })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="bg-white/80 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-xl"
    >
      <h2 class="text-3xl font-bold mb-8 text-gray-800 text-center">
        Bienvenido
      </h2>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit.prevent="onSubmit"
      >
        <UFormField label="Usuario" name="email">
          <UInput
            v-model="state.username"
            icon="heroicons:user-circle"
            size="xl"
            variant="outline"
            placeholder="Ingrese su usuario"
            class="w-full rounded-lg"
          />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput
            v-model="state.password"
            type="password"
            icon="heroicons:lock-closed"
            size="xl"
            variant="outline"
            placeholder="Ingrese su usuario"
            class="w-full rounded-lg"
          />
        </UFormField>

        <UButton
          type="submit"
          class="w-full flex items-center justify-center p-4"
          label="Ingresar"
        />
      </UForm>
    </div>
  </div>
</template>
