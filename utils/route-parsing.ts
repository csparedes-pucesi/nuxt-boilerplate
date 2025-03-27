import type { RutaType } from '../types/login/login.type'

export default (routes: RutaType[]) => {
  const routeMap = new Map<number, RutaType>()

  // Map each route by its ID for quick lookup
  routes.forEach((route) => {
    routeMap.set(route.ruta_id, { ...route, ruta_hijas: [] })
  })

  // Build the hierarchical structure
  const result: RutaType[] = []
  routes.forEach((route) => {
    if (route.ruta_padre === 0) {
      result.push(routeMap.get(route.ruta_id)!)
    } else {
      const parent = routeMap.get(route.ruta_padre)
      if (parent) {
        parent.ruta_hijas?.push(routeMap.get(route.ruta_id)!)
      }
    }
  })

  return result
}
