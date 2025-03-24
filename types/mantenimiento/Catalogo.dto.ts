// src/pages/mantenimiento/dto/Catalogo.dto.ts
import type { ItemCatalogo } from './ItemCatalogo.dto'

export interface Catalogo {
  codigo: string
  nombre: string
  editable: string
  descripcion: string
  estado: string
  items?: ItemCatalogo[]
}
