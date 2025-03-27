import { useMyLoginStore } from '../stores/login/login'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middle-to', to)
  console.log('middle-from', from)
  const store = useMyLoginStore()
  const token = store.token
  console.log('middle-token', token)
  if (!token) {
    const router = useRouter()
    router.push('/login')
  }
  const routes = routeParsing(store.rutas)
  console.log('middle-routes', routes)
  return true
})
