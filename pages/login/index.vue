<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'

definePageMeta({
  layout: 'login',
})

const schema = z.object({
  email: z.string({ message: 'Email required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password required' })
    .min(3, 'Must be at least 3 characters'),
})

type Schema = z.infer<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const toast = useToast()
const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 2000))
  toast.add({
    title: 'Success',
    description: 'You have successfully logged in',
  })
  isLoading.value = false
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
            v-model="state.email"
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
          :loading="isLoading"
        />
      </UForm>
    </div>
  </div>
</template>
