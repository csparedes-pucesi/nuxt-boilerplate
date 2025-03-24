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
  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      toast.add({
        title: 'Login successful',
        description: data,
        color: 'success',
      })
    },
    onError: (error) => {
      console.error('Login error', error)
      toast.add({
        title: 'Login error',
        description: 'There was an error logging in',
        color: 'error',
      })
    },
  })
}
