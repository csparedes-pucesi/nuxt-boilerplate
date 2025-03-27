/* ==================================================
   1) IMPORTACIONES Y DEFINICIONES DE TIPOS
   ================================================== */
import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import esLocale from '@fullcalendar/core/locales/es'
import type {
  FormatterInput,
  CalendarOptions,
  EventClickArg,
  EventContentArg,
  DayCellMountArg,
  DayHeaderMountArg,
} from '@fullcalendar/core'

import tippy from 'tippy.js'
import {
  formatTo12H,
  updateTitle,
} from '@/composables/psicologia/ScriptCalendarioP'
// Importamos el hook para obtener el horario del calendario
import { useHorarioCalendario } from '@/composables/psicologia/useHorarioCalendario'
import type { EventoCalendario } from '@/types/psicologia/EventoCalendario.dto'

export interface CalendarApiRef {
  getApi: () => import('@fullcalendar/core').CalendarApi
}

export interface CalendarHeaderRef {
  setDate: (newDate: Date) => void
  setView: (viewName: string, newTitle: string, baseDate?: Date) => void
}
export interface CalendarDeps {
  eventos: Ref<EventoCalendario[]>
  daysWithAppointments: Ref<string[]>
  mainCalendarRef: Ref<CalendarApiRef | null>
  currentTitle: Ref<string>
  currentViewLabel: Ref<string>
  viewLabels: Record<string, string>
  onEventClick: (event: EventoCalendario) => void
  headerRef?: Ref<CalendarHeaderRef | null>
}

/* ==================================================
      2) FUNCIONES AUXILIARES Y DEFINICIONES DE INTERFACES
      ================================================== */

interface DayCellContentArg {
  date: Date
  isOther: boolean
  // Otras propiedades según sea necesario…
}

/* 2.2. Función para ajustar la hora sumando o restando horas
      Esto compensa el desfase al convertir de UTC a hora local */
function adjustTime(timeStr: string, hourDiff: number): string {
  const [h, m, s] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setHours(h + hourDiff, m, s, 0)
  return date.toTimeString().slice(0, 8) // 'HH:mm:ss'
}

/* ==================================================
      3) FUNCIÓN PRINCIPAL: useCalendarOptions
      ================================================== */
export function useCalendarOptions(deps: CalendarDeps): {
  calendarOptions: ComputedRef<CalendarOptions>
  miniCalendarOptions: CalendarOptions
} {
  /* 3.1. Obtener el horario mediante el hook correspondiente */
  const { horario } = useHorarioCalendario()

  /* 3.2. Computed para establecer slotMinTime y slotMaxTime ajustados */
  const computedSlotMinTime = computed(() => {
    return horario.value?.gcal_hora_inicio
      ? adjustTime(horario.value.gcal_hora_inicio, -1) // Resta 1 hora
      : '07:00:00'
  })

  const computedSlotMaxTime = computed(() => {
    return horario.value?.gcal_hora_fin
      ? adjustTime(horario.value.gcal_hora_fin, 1) // Suma 1 hora
      : '20:00:00'
  })

  /* 3.3. Watch para imprimir en consola el horario mostrado en el calendario */
  watch([computedSlotMinTime, computedSlotMaxTime], ([min, max]) => {
    console.log('Horario mostrado en el calendario:', {
      slotMinTime: min,
      slotMaxTime: max,
    })
  })

  /* 3.4. Opciones para el calendario principal (FullCalendar) */
  const calendarOptions = computed(() => ({
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      multiMonthPlugin,
    ],
    initialView: 'timeGridWeek',
    timeZone: 'local',
    locale: esLocale,
    firstDay: 0,
    allDaySlot: false,
    nowIndicator: true,
    // Se usan las horas ajustadas
    slotMinTime: computedSlotMinTime.value,
    slotMaxTime: computedSlotMaxTime.value,
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00:00',
    slotLabelFormat: { hour: 'numeric', hour12: true } as FormatterInput,
    dayHeaders: false,
    slotLabelContent: function (arg: { date: Date; text: string }): {
      html: string
    } {
      const firstHour = Number(computedSlotMinTime.value.split(':')[0])
      if (arg.date.getHours() === firstHour) {
        return { html: '' }
      }
      return { html: arg.text }
    },
    stickyHeaderDates: true,
    headerToolbar: false as const,
    height: 'auto',
    contentHeight: 'auto',
    events: deps.eventos.value,
    /* 3.4.1. Callback al hacer click en un evento */
    eventClick: ({ event }: EventClickArg) => {
      const adaptedEvent: EventoCalendario = {
        id: event.id,
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        dateStart: event.extendedProps.dateStart,
        timeStart: event.extendedProps.timeStart,
        dateEnd: event.extendedProps.dateEnd,
        timeEnd: event.extendedProps.timeEnd,
        description: event.extendedProps.description,
        paciente: event.extendedProps.paciente,
        extendedProps: {
          timeRange: event.extendedProps.timeRange,
          origen: event.extendedProps.origen,
          descripcion: event.extendedProps.descripcion,
          estado: event.extendedProps.estado,
        },
      }

      deps.onEventClick(adaptedEvent)
    },
    

    /* 3.4.2. Renderizado personalizado del contenido de un evento */
    eventContent: function (arg: EventContentArg): { domNodes: HTMLElement[] } {
      let title = arg.event.title || ''
      let startTime = formatTo12H(arg.event.start)
      const endTime = formatTo12H(arg.event.end)

      if (
        (startTime.includes('AM') && endTime.includes('AM')) ||
        (startTime.includes('PM') && endTime.includes('PM'))
      ) {
        startTime = startTime.replace(/AM|PM/g, '').trim()
      }

      const maxTitleLength = 12
      if (title.length > maxTitleLength) {
        title = title.substring(0, maxTitleLength) + '...'
      }

      const container = document.createElement('div')
      container.classList.add('fc-event-title-single')

      const titleElement = document.createElement('span')
      titleElement.textContent = title
      titleElement.style.fontWeight = 'bold'
      titleElement.style.display = 'inline-block'
      titleElement.style.overflow = 'hidden'
      titleElement.style.textOverflow = 'ellipsis'
      titleElement.style.whiteSpace = 'nowrap'
      titleElement.style.maxWidth = '60%'

      const timeElement = document.createElement('span')
      timeElement.textContent = `${startTime} - ${endTime}`
      timeElement.style.display = 'inline-block'
      timeElement.style.fontSize = '0.68rem'
      timeElement.style.marginLeft = '5px'
      timeElement.style.whiteSpace = 'nowrap'

      const titleTimeContainer = document.createElement('div')
      titleTimeContainer.style.display = 'flex'
      titleTimeContainer.style.justifyContent = 'space-between'
      titleTimeContainer.style.alignItems = 'center'
      titleTimeContainer.style.width = '100%'

      titleTimeContainer.appendChild(titleElement)
      titleTimeContainer.appendChild(timeElement)
      container.appendChild(titleTimeContainer)

      container.style.cursor = 'pointer'
      container.style.overflow = 'hidden'
      container.style.textOverflow = 'ellipsis'
      container.style.whiteSpace = 'nowrap'
      container.style.wordBreak = 'break-word'
      container.style.maxWidth = '100%'

      return { domNodes: [container] }
    },

    /* 3.4.3. Configuración de las vistas personalizadas */
    views: {
      timeGridDay: {
        titleFormat: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        } as FormatterInput,
      },
      timeGridWeek: {
        titleFormat: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        } as FormatterInput,
        dayHeaderFormat: { weekday: 'short', day: '2-digit' } as FormatterInput,
      },
      dayGridMonth: {
        fixedWeekCount: false,
        titleFormat: {
          year: 'numeric',
          month: 'long',
        } as const,
        dayCellContent: (arg: {
          date: Date
          isOther: boolean
          view: { activeStart: Date }
        }): { html: string } => {
          // 3.4.3.a. Datos de la fecha
          const date = arg.date
          const dayNumber = date.getDate()
          const dayOfWeek = date.getDay()
          const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][
            dayOfWeek
          ]

          // 3.4.3.b. Nombres cortos de los meses
          const monthNames = [
            'ene',
            'feb',
            'mar',
            'abr',
            'may',
            'jun',
            'jul',
            'ago',
            'sep',
            'oct',
            'nov',
            'dic',
          ]
          const shortMonthName = monthNames[date.getMonth()]

          // 3.4.3.c. Determina si el día pertenece a otro mes
          const isOtherMonth = arg.isOther

          // 3.4.3.d. Cálculo para determinar la fila (primera fila: rowIndex === 0)
          const startOfGrid = arg.view.activeStart
          const diffDays = (date.getTime() - startOfGrid.getTime()) / 86400000
          const rowIndex = Math.floor(diffDays / 7)

          // --- LÓGICA DE VISUALIZACIÓN ---
          // 1) PRIMERA FILA
          if (rowIndex === 0) {
            // a) Si es del mes actual
            if (!isOtherMonth) {
              // Si es el día 1 => "Dom" + "1 de feb"
              if (dayNumber === 1) {
                return {
                  html: `
               <div style="
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 justify-content: center;
               ">
                 <div class="fc-day-name" style="font-size:0.8rem; font-weight:bold;">
                   ${dayName}
                 </div>
                 <div>
                   ${dayNumber} de ${shortMonthName}
                 </div>
               </div>
                     `,
                }
              }
              // Si es otro día del mes => "Dom" + "2"
              else {
                return {
                  html: `
               <div style="
                 width: 100%;
                 display: flex;
                 flex-direction: column;
                 align-items: center;
                 justify-content: center;
               ">
                 <div class="fc-day-name" style="font-size:0.8rem; font-weight:bold;">
                   ${dayName}
                 </div>
                 <div>
                   ${dayNumber}
                 </div>
               </div>
                     `,
                }
              }
            }
            // b) Si es de otro mes => "Dom" + "31" (solo número)
            else {
              return {
                html: `
             <div style="
               width: 100%;
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
             ">
               <div class="fc-day-name" style="font-size:0.8rem; font-weight:bold;">
                 ${dayName}
               </div>
               <div>
                 ${dayNumber}
               </div>
             </div>
                   `,
              }
            }
          }
          // 2) FILAS SIGUIENTES
          else {
            // a) Día del mes actual
            if (!isOtherMonth) {
              // Si es el día 1 => "1 de feb"
              if (dayNumber === 1) {
                return { html: `${dayNumber} de ${shortMonthName}` }
              }
              // De lo contrario => "2", "3", etc.
              else {
                return { html: `${dayNumber}` }
              }
            }
            // b) Día de otro mes => "31"
            else {
              return { html: `${dayNumber}` }
            }
          }
        },
      },

      multiMonthYear: {
        type: 'multiMonthYear',
        buttonText: 'Año',
        titleFormat: { year: 'numeric', month: 'long' } as const,
        dayHeaderFormat: { weekday: 'narrow' } as const,

        showNonCurrentDates: true,
        dayCellContent: (arg: DayCellContentArg) => {
          return { html: String(arg.date.getDate()) }
        },
      },
    },
    /* 3.4.4. Función para determinar clases adicionales en cada celda según la fecha */
    dayCellClassNames: (arg: { date: Date }): string => {
      const dateStr = arg.date.toISOString().split('T')[0]
      const todayStr = new Date().toISOString().split('T')[0]

      const eventosDelDia = (deps.eventos.value as EventoCalendario[]).filter(
        (evento) => {
          const eventoDate = new Date(evento.start).toISOString().split('T')[0]
          return eventoDate === dateStr
        }
      )

      const uniqueOrigins = new Set(
        eventosDelDia.map((evento) => evento.extendedProps?.origen)
      )

      if (uniqueOrigins.size === 1) {
        const origin = uniqueOrigins.values().next().value
        switch (origin) {
          case 'datos-Pendientes':
            return 'main-calendar-has-appointment-pendientes'
          case 'datos-Aprobadas':
            return 'main-calendar-has-appointment-aprobadas'
          case 'datos-Finalizadas':
            return 'main-calendar-has-appointment-finalizadas'
          case 'datos-Reportes':
            return 'main-calendar-has-appointment-reportes'
        }
      }

      if (dateStr === todayStr) {
        return 'main-calendar-no-appointment'
      }

      return ''
    },

    /* 3.4.5. Evento datesSet para configurar interacciones en los encabezados */
    datesSet: function () {
      document.querySelectorAll('.fc-col-header-cell-cushion').forEach((el) => {
        ;(el as HTMLElement).style.cursor = 'pointer'
        el.addEventListener('click', function (this: HTMLElement) {
          const dayNumber = this.innerText.match(/\d+/)
          if (dayNumber && deps.mainCalendarRef.value) {
            const calendarApi = deps.mainCalendarRef.value.getApi()
            const selectedDate = new Date(calendarApi.getDate())
            selectedDate.setDate(parseInt(dayNumber[0]))
            calendarApi.changeView('timeGridDay', selectedDate)
          }
        })
      })
    },
  }))
  const MINI_CALENDAR_TITLE_FORMAT = { year: 'numeric', month: 'long' } as const
  const MINI_CALENDAR_HEADER_FORMAT = { weekday: 'narrow' } as const

  /* 3.5. Opciones para el mini calendario */
  const miniCalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    firstDay: 0,
    headerToolbar: { left: 'title', center: '', right: 'prev,next' },
    titleFormat: MINI_CALENDAR_TITLE_FORMAT,
    dayHeaderFormat: MINI_CALENDAR_HEADER_FORMAT,
    height: '100%',
    selectable: true,
    navLinks: false,
    // Usamos dayCellClassNames para asignar la clase "mini-calendar-today" dinámicamente
    dayCellClassNames(info: { date: Date }): string[] {
      const dateStr = info.date.toISOString().split('T')[0]
      const today = new Date()
      const todayStr = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
        .toISOString()
        .split('T')[0]
      const classes: string[] = []
      if (dateStr === todayStr) {
        classes.push('mini-calendar-today')
      }
      return classes
    },
    // Mantener o ajustar el callback que agrega otras clases y comportamientos
    dayCellDidMount(info: DayCellMountArg) {
      setTimeout(() => {
        info.el.style.cursor = 'pointer'
        const dateStr = info.date.toISOString().split('T')[0]

        // Declaramos todayStr correctamente
        const today = new Date()
        const todayStr = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        )
          .toISOString()
          .split('T')[0]

        // Removemos las clases previas para evitar acumulaciones
        info.el.classList.remove(
          'mini-calendar-selected',
          'day-has-appointment-pendientes',
          'day-has-appointment-aprobadas',
          'day-has-appointment-finalizadas',
          'day-has-appointment-reportes',
          'day-has-appointment',
          'mini-calendar-today' // También removemos esta clase si está presente
        )

        // Volvemos a añadir la clase si es el día actual
        if (dateStr === todayStr) {
          info.el.classList.add('mini-calendar-today')
        }

        // Si el día tiene citas, asignamos clases adicionales
        if (deps.daysWithAppointments.value.includes(dateStr)) {
          const eventosDelDia = deps.eventos.value.filter(
            (evento: EventoCalendario) => {
              const eventoDate = new Date(evento.start)
                .toISOString()
                .split('T')[0]
              return eventoDate === dateStr
            }
          )

          const uniqueOrigins = new Set(
            eventosDelDia.map((evento) => evento.extendedProps?.origen)
          )

          if (uniqueOrigins.size === 1) {
            const origin = uniqueOrigins.values().next().value
            switch (origin) {
              case 'datos-Pendientes':
                info.el.classList.add('day-has-appointment-pendientes')
                break
              case 'datos-Aprobadas':
                info.el.classList.add('day-has-appointment-aprobadas')
                break
              case 'datos-Finalizadas':
                info.el.classList.add('day-has-appointment-finalizadas')
                break
              case 'datos-Reportes':
                info.el.classList.add('day-has-appointment-reportes')
                break
              default:
                info.el.classList.add('day-has-appointment')
                break
            }
          } else {
            info.el.classList.add('day-has-appointment')
          }
        }

        info.el.addEventListener('click', () => {
          document.querySelectorAll('.mini-calendar-selected').forEach((el) => {
            el.classList.remove('mini-calendar-selected')
          })

          if (dateStr !== todayStr) {
            info.el.classList.add('mini-calendar-selected')
          }

          if (deps.mainCalendarRef.value) {
            const calendarApi = deps.mainCalendarRef.value.getApi()
            if (calendarApi) {
              const selectedDate = new Date(info.date)
              calendarApi.changeView('timeGridWeek', selectedDate)
              setTimeout(() => {
                const updatedDate = new Date(calendarApi.getDate())
                deps.currentTitle.value = updateTitle(calendarApi)
                console.log(
                  '📅 Fecha después del cambio de vista:',
                  updatedDate.toISOString()
                )
                console.log(
                  '📅 Current Title actualizado:',
                  deps.currentTitle.value
                )
                if (deps.currentViewLabel) {
                  deps.currentViewLabel.value =
                    deps.viewLabels['timeGridWeek'] || 'Semana'
                }
              }, 10)
            }
          }

          if (
            deps.headerRef &&
            deps.headerRef.value &&
            typeof deps.headerRef.value.setView === 'function'
          ) {
            console.log('Invocando setView en headerRef')
            deps.headerRef.value.setView(
              'timeGridWeek',
              deps.currentTitle.value,
              info.date
            )
          } else {
            console.log('No se encontró setView en headerRef')
          }
        })
      }, 150)
    },
    dayHeaderDidMount(info: DayHeaderMountArg) {
      const correctedDate = new Date(info.date)
      correctedDate.setDate(correctedDate.getDate() + 1)
      const fullDayName = info.view.calendar.formatDate(correctedDate, {
        weekday: 'long',
      })
      const capitalizedDayName =
        fullDayName.charAt(0).toUpperCase() + fullDayName.slice(1)
      tippy(info.el, {
        content: capitalizedDayName,
        placement: 'top',
        theme: 'light',
        arrow: false,
        interactive: false,
      })
    },
  }

  /* 3.6. Retornar las opciones para el calendario principal y el mini calendario */
  return { calendarOptions, miniCalendarOptions }
}
