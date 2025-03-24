import { useMutation } from '@tanstack/vue-query'
import useApi from '../api/api'

//
const postLogin = async (data: { username: string; password: string }) => {
  const response = await useApi.post('/auth/login', data)
  console.log(response.data)
  return response.data
}

export const usePostLogin = () => {
  const toast = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      // Extraer nombre completo y rol
      const nombre = `${data.usuario?.usu_nombre ?? ''} ${
        data.usuario?.usu_apellido ?? ''
      }`.trim()
      const rol = data.rol?.rol_nombre ?? 'Sin rol'

      toast.add({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido, ${nombre} - Rol: ${rol}`,
        color: 'success',
      })

      router.push('/dashboard')
    },
    onError: (error: {
      response?: { data?: { message?: string } }
      message?: string
    }) => {
      console.error('Login error', error)
      toast.add({
        title: 'Error al iniciar sesión',
        description:
          error?.response?.data?.message ||
          error.message ||
          'Error desconocido',
        color: 'error',
      })
    },
  })
}
