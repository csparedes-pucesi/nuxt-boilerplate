export interface RespLoginType {
  usuario: UsuarioType
  rol: RolType
  rutas: RutaType[]
  directorioActivo: AdType
  token: string
}

export interface AdType {
  param?: string
}

export interface RolType {
  rol_id: number
  rol_nombre: string
}

export interface RutaType {
  ruta_id: number
  ruta_padre: number
  ruta_nombre: string
  ruta_ruta: string
  ruta_url: string
  ruta_component: string
  ruta_indexed: boolean
  roru_privilegio: number
  ruta_hijas?: RutaType[]
}

export interface UsuarioType {
  usu_id: number
  usu_nombre: string
  usu_apellido: string
  usu_usuario: string
}
