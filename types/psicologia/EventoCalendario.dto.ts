export interface EventoCalendario {
  id: string
  title: string
  start: string
  end: string
  dateStart: string
  timeStart: string
  dateEnd: string
  timeEnd: string
  description: string
  paciente: string
  extendedProps: {
    timeRange: string
    origen: string
    descripcion?: string
    estado?: string
  }
}
