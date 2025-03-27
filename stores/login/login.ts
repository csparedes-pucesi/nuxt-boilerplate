import { defineStore } from 'pinia'
import type { RespLoginType } from '../../types/login/login.type'

export const useMyLoginStore = defineStore(
  'auth-store',
  () => {
    const usuario = ref()
    const rol = ref()
    const rutas = ref()
    const token = ref()

    function setData(data: RespLoginType) {
      usuario.value = data.usuario
      rol.value = data.rol
      rutas.value = routeParsing(data.rutas)
      token.value = data.token
      const tokCookie = useCookie('token')
      tokCookie.value = data.token
      const rutasCookie = useCookie('rutas', {})
      rutasCookie.value = JSON.stringify(data.rutas)
    }

    return {
      usuario,
      rol,
      rutas,
      token,
      //
      setData,
    }
  },
  {
    persist: {
      key: 'nuxt-auth-store',
    },
  }
)
