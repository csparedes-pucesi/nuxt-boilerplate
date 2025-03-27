// import { useMyLoginStore } from '../stores/login/login'
// import type { RutaType } from '../types/login/login.type'

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('🔁 Middleware triggered to:', to.path)

  const token = useCookie('token')
  const rutasPermitidas = useCookie('rutas')
  const rutasPublicas = ['/login', '/dashboard']

  if (!token.value) {
    return to.path !== '/login' ? navigateTo('/login') : undefined
  }

  // Permitir acceso a rutas públicas
  if (rutasPublicas.includes(to.path.toLowerCase())) {
    return
  }

  // Validar existencia de rutas permitidas
  if (!rutasPermitidas.value || !Array.isArray(rutasPermitidas.value)) {
    console.warn('❌ No se encontraron rutas válidas en la cookie')
    return navigateTo('/login')
  }

  // 🧭 Mostrar las rutas en consola de forma legible
  try {
    console.log(
      '🧭 rutasPermitidas.value:',
      JSON.stringify(rutasPermitidas.value, null, 2)
    )
  } catch (error) {
    console.error('❌ Error al mostrar rutasPermitidas:', error)
  }

  const urlsPermitidas = rutasPermitidas.value.map((r) => r.ruta_url)

  // Extraer el último segmento de la ruta actual
  const pathActual = to.path.toLowerCase().split('/').filter(Boolean).pop()
  const urlMatch = urlsPermitidas.some((url) => {
    const permitida = url.toLowerCase().split('/').filter(Boolean).pop()
    return permitida === pathActual
  })

  console.log('📍 Segmento actual:', pathActual)
  console.log(
    '✅ Segmentos permitidos:',
    urlsPermitidas.map((url) => url.split('/').filter(Boolean).pop())
  )

  if (!urlMatch) {
    console.warn('⛔ Acceso denegado a:', to.path)

    const vieneDeRutaValida =
      urlsPermitidas.some((url) =>
        from.path.toLowerCase().includes(url.toLowerCase())
      ) || rutasPublicas.includes(from.path.toLowerCase())

    if (vieneDeRutaValida && from.path !== to.path) {
      console.log('🚫 Abortando navegación y quedándose en:', from.path)
      return abortNavigation()
    }

    console.log('🔁 Redirigiendo al dashboard por acceso directo no permitido')
    return navigateTo('/dashboard')
  }
})

