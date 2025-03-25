export interface Cita {
  id: string
  title: string
  start: string
  end: string
  description: string
  paciente: string
  dateStart: string
  dateEnd: string
  timeStart: string
  timeEnd: string
  timeRange: string
  origen: string // <--- Obligatorio
  descripcion?: string
  estado?: string
}
