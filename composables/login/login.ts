import { useMutation } from '@tanstack/vue-query'
import useApi from '../api/api'
import { useMyLoginStore } from '../../stores/login/login'
import type { RespLoginType } from '../../types/login/login.type'

//
const postLogin = async (data: { username: string; password: string }) => {
  const response = await useApi.post<RespLoginType>('/auth/login', data)
  return response.data
}

export const usePostLogin = () => {
  const toast = shallowRef(useToast())
  const store = useMyLoginStore()
  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      store.setData(data)
      toast.value.add({
        title: 'Acceso correcto',
        description: 'Acceso correcto',
        color: 'success',
      })

      const router = useRouter()
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.value.add({
        title: 'Login error',
        description: error.message,
        color: 'error',
      })
    },
  })
}
