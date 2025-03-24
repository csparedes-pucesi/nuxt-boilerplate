import { defineStore } from 'pinia'
import type { RespLoginType } from '../../types/login/login.type'

export const useMyLoginStore = defineStore(
  'auth-store',
  () => {
    const usuario = ref()
    const rol = ref()
    const rutas = ref()

    function setData(data: RespLoginType) {
      usuario.value = data.usuario
      rol.value = data.rol
      rutas.value = data.rutas
    }

    return {
      usuario,
      rol,
      rutas,
      //
      setData,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
)
