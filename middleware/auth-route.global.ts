// import { useMyLoginStore } from '../stores/login/login'
// import type { RutaType } from '../types/login/login.type'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Middleware triggered to:', to.path)
  console.log('Middleware triggered from:', from.path)
  const token = useCookie('token')
  console.log('token_value', token.value)

  if (!token.value) {
    return to.path !== '/login' ? navigateTo('/login') : undefined
  }

  const routes = useCookie('rutas')
  console.log('routes_value', routes.value)

  // if (!routes) {
  //   const router = useRouter()
  //   router.push('/login')
  //   localStorage.removeItem('nuxt-auth-store')
  // }

  // const path = to.path
  // console.log('path', path)
  // return true
})
