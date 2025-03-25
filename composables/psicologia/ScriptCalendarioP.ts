import type { Ref } from 'vue'
import type { CalendarApi } from '@fullcalendar/core'
import type { EventoCalendario } from '@/types/psicologia/EventoCalendario.dto'

// import type { FormatterInput } from '@fullcalendar/core';
interface RawCita {
  id: string
  title: string
  start: string // ISO format
  end: string
  description: string
  paciente: string
  origen?: string
}

/* ========================================================
   CONVERSIÓN DE HORAS Y FORMATOS
======================================================== */
// Convierte una hora a formato 12H
/**
 * Convierte una hora dada (string) al formato 12H.
 */
export function formatTo12H(time: string | Date | null): string {
  if (!time) return 'Hora inválida'

  const date = typeof time === 'string' ? new Date(time) : time

  const hours = date
    .toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    .replace(' ', '')

  const minutes = date.getMinutes()
  if (minutes === 0) {
    return hours
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Formatea un rango de horas
/**
 * Formatea un rango de horas usando la función anterior.
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const startFormatted = formatTo12H(startTime)
  const endFormatted = formatTo12H(endTime)
  return `${startFormatted} - ${endFormatted}`
}

/* ========================================================
   ACTUALIZACIÓN DE TÍTULO DEL CALENDARIO
======================================================== */
// Calcula el título del calendario
/**
 * Calcula el título del calendario según la vista y fechas actuales.
 * Retorna el título en forma de string.
 */
export function updateTitle(calendarApi: CalendarApi): string {
  const viewName = calendarApi.view.type
  const startDate: Date = calendarApi.view.currentStart
  const endDate: Date = calendarApi.view.currentEnd

  if (viewName === 'multiMonthYear') {
    const year = new Intl.DateTimeFormat('es-ES', { year: 'numeric' }).format(
      startDate
    )
    return year
  }
  if (viewName === 'timeGridDay') {
    const fullDate = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(startDate)
    return fullDate.charAt(0).toUpperCase() + fullDate.slice(1)
  }
  if (viewName === 'dayGridMonth') {
    const fullMonth = new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric',
    }).format(startDate)
    return fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1)
  }
  const startMonthFull = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
  }).format(startDate)
  const startYear = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
  }).format(startDate)
  const endYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric' }).format(
    endDate
  )
  let startMonthShort = new Intl.DateTimeFormat('es-ES', { month: 'short' })
    .format(startDate)
    .toLowerCase()
  let endMonthShort = new Intl.DateTimeFormat('es-ES', { month: 'short' })
    .format(endDate)
    .toLowerCase()
  startMonthShort =
    startMonthShort.charAt(0).toUpperCase() + startMonthShort.slice(1)
  endMonthShort = endMonthShort.charAt(0).toLowerCase() + endMonthShort.slice(1)
  if (
    startMonthShort.toLowerCase() === endMonthShort.toLowerCase() &&
    startYear === endYear
  ) {
    return `${
      startMonthFull.charAt(0).toUpperCase() + startMonthFull.slice(1)
    } de ${startYear}`
  } else {
    if (startYear === endYear) {
      return `${startMonthShort} - ${endMonthShort} de ${endYear}`
    } else {
      return `${startMonthShort} de ${startYear} - ${endMonthShort} de ${endYear}`
    }
  }
}
type CalendarRef = { getApi: () => CalendarApi }

/* ========================================================
   NAVEGACIÓN ENTRE FECHAS DEL CALENDARIO
======================================================== */
// Navega a la fecha actual y actualiza calendarios y encabezado
/**
 * Navega a la fecha actual en ambos calendarios y actualiza el título y encabezado.
 * @param mainCalendar Referencia al calendario principal.
 * @param miniCalendar Referencia al mini calendario.
 * @param setEncabezadoDate Callback para actualizar la fecha en el encabezado.
 * @param setCurrentTitle Callback para asignar el nuevo título.
 */
export function goToToday(
  mainCalendar: CalendarRef | null,
  miniCalendar: CalendarRef | null,
  setEncabezadoDate: (date: Date) => void,
  setCurrentTitle: (title: string) => void,
  forceDayView?: boolean
): void {
  const today = new Date()
  if (mainCalendar) {
    const calendarApi = mainCalendar.getApi()
    // Si se requiere forzar la vista de día, se cambia a 'timeGridDay'
    if (forceDayView) {
      calendarApi.changeView('timeGridDay')
    }
    calendarApi.gotoDate(today)
    const newTitle = updateTitle(calendarApi)
    setCurrentTitle(newTitle)
  }
  if (miniCalendar) {
    miniCalendar.getApi().gotoDate(today)
  }
  document
    .querySelectorAll('.mini-calendar-selected')
    .forEach((el) => el.classList.remove('mini-calendar-selected'))
  setEncabezadoDate(today)
}

// Navega al intervalo anterior
/**
 * Navega al intervalo anterior y sincroniza calendarios y encabezado.
 */
export function prev(
  mainCalendar: CalendarRef | null,
  miniCalendar: CalendarRef | null,
  setEncabezadoDate: (date: Date) => void,
  setCurrentTitle: (title: string) => void,
  forceDayView?: boolean
): void {
  if (mainCalendar) {
    const calendarApi = mainCalendar.getApi()
    // Si se requiere forzar la vista de día, se cambia a 'timeGridDay'
    if (forceDayView) {
      calendarApi.changeView('timeGridDay')
    }
    calendarApi.prev()
    const newTitle = updateTitle(calendarApi)
    setCurrentTitle(newTitle)
    const newStartDate = new Date(calendarApi.view.currentStart)
    if (miniCalendar) {
      miniCalendar.getApi().gotoDate(newStartDate)
    }
    setEncabezadoDate(newStartDate)
  }
}

// Navega al siguiente intervalo
/**
 * Navega al siguiente intervalo y sincroniza calendarios y encabezado.
 */
export function next(
  mainCalendar: CalendarRef | null,
  miniCalendar: CalendarRef | null,
  setEncabezadoDate: (date: Date) => void,
  setCurrentTitle: (title: string) => void,
  forceDayView?: boolean
): void {
  if (mainCalendar) {
    const calendarApi = mainCalendar.getApi()
    if (forceDayView) {
      calendarApi.changeView('timeGridDay')
    }
    calendarApi.next()
    const newTitle = updateTitle(calendarApi)
    setCurrentTitle(newTitle)
    const newStartDate = new Date(calendarApi.view.currentStart)
    if (miniCalendar) {
      miniCalendar.getApi().gotoDate(newStartDate)
    }
    setEncabezadoDate(newStartDate)
  }
}

/* ========================================================
   CAMBIO DE VISTA DEL CALENDARIO
======================================================== */
// Cambia la vista y actualiza título y encabezado
/**
 * Cambia la vista del calendario y actualiza el título y (opcionalmente) el encabezado.
 * Retorna la etiqueta de la vista según el diccionario.
 */
export function changeView(
  mainCalendar: CalendarRef | null,
  viewName: string,
  viewLabels: Record<string, string>,
  setCurrentTitle: (title: string) => void,
  setEncabezadoView?: (
    viewName: string,
    newTitle: string,
    baseDate?: Date
  ) => void
): string {
  if (mainCalendar) {
    const calendarApi = mainCalendar.getApi()
    calendarApi.changeView(viewName)

    // Obtener la fecha actual después del cambio de vista
    const baseDate = calendarApi.getDate()

    // Actualizar el título con la nueva vista
    const newTitle = updateTitle(calendarApi)
    setCurrentTitle(newTitle)

    // Llamar a la función para actualizar el encabezado
    if (setEncabezadoView) {
      setEncabezadoView(viewName, newTitle, baseDate)
    }

    // ✅ Retornar el label correcto de la vista
    return viewLabels[viewName] || viewName
  }
  return viewLabels['timeGridWeek'] || 'Semana' // Valor por defecto
}

/* ========================================================
   UTILIDADES VARIAS
======================================================== */
// Alterna el estado del dropdown
/**
 * Alterna el valor booleano de una referencia.
 */
export function toggleDropdown(dropdownOpen: Ref<boolean>): void {
  dropdownOpen.value = !dropdownOpen.value
}

// Procesa las citas y retorna eventos y fechas con citas
/**
 * Procesa las citas y retorna tanto los eventos formateados como las fechas con citas.
 */
export function actualizarEventos(
  citas: RawCita[],
  origen: string | undefined
): { eventos: EventoCalendario[]; daysWithAppointments: string[] } {
  const eventos: EventoCalendario[] = citas.map((cita) => {
    const origenValue = cita.origen || origen || 'datos-Pendientes'

    const [dateStart, timeStart] = cita.start.split('T')
    const [dateEnd, timeEnd] = cita.end.split('T')

    return {
      id: cita.id,
      title: cita.title,
      start: cita.start,
      end: cita.end,
      dateStart,
      timeStart,
      dateEnd,
      timeEnd,
      description: cita.description,
      paciente: cita.paciente,
      extendedProps: {
        timeRange: formatTimeRange(timeStart, timeEnd),
        origen: origenValue,
      },
    }
  })

  const daysWithAppointments = eventos.map((evento) => evento.dateStart)

  return { eventos, daysWithAppointments }
}
