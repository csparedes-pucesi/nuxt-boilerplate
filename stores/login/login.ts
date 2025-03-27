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
      rutas.value = data.rutas
      token.value = data.token
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
