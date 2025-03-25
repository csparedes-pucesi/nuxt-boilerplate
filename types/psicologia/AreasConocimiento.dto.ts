export interface GetAreasConocimientoDTO {
  citacId: number
  nombre: string
  descripcion: string
}
export interface PostAreasConocimientoDTO {
  citac_nombre: string
  citac_descripcion: string
  // citacId: number // 👈 Añadir esto
}
