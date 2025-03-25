<template>
  <div>
    <ComponenteCalendarioCitas
      :citas="citasReportes"
      origen="datos-Reportes"
      @open-modal="openModal"
    />

    <DetallesCitaPendienteModal
      :is-open="showModal"
      :cita="selectedEvent"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ComponenteCalendarioCitas from '@/components/psicologia/ComponenteCalendarioCitas.vue'
import DetallesCitaPendienteModal from '@/components/psicologia/DetallesCitaPendienteModal.vue'
import type { Cita } from '@/types/psicologia/psicologia.dto'

const showModal = ref(false)
const selectedEvent = ref<Cita | undefined>(undefined)

/* Función para convertir "HH:mm:ss" a formato 12H con logs detallados */
function formatTo12H(timeString: string | undefined) {
  if (!timeString) {
    console.log(
      'HORA RECIBIDA: undefined. Error: La cadena de tiempo es undefined o null.'
    )
    return 'Invalid Date'
  }
  console.log('HORA RECIBIDA:', timeString)
  const cleanTime = timeString.trim()
  console.log('Limpieza de tiempo:', cleanTime)

  const parts = cleanTime.split(':')
  console.log('Partes de la cadena:', parts)
  if (parts.length < 2) {
    console.log("Error: La cadena no contiene el formato esperado 'HH:mm:ss'.")
    return 'Invalid Date'
  }

  const hour = parseInt(parts[0], 10)
  const minute = parseInt(parts[1], 10)
  const second = parts.length === 3 ? parseInt(parts[2], 10) : 0
  console.log('Valores parseados:', { hour, minute, second })

  if (isNaN(hour) || isNaN(minute) || (parts.length === 3 && isNaN(second))) {
    console.log('Error: La cadena contiene valores no numéricos.')
    return 'Invalid Date'
  }

  const date = new Date(1970, 0, 1, hour, minute, second)
  console.log('Fecha generada:', date)
  if (isNaN(date.getTime())) {
    console.log('Error: La fecha generada es inválida.')
    return 'Invalid Date'
  }

  const formatted = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  console.log('HORA FORMATEADO:', formatted)
  return formatted
}

function formatTimeRange(
  startTime: string | undefined,
  endTime: string | undefined
) {
  const startFormatted = formatTo12H(startTime)
  const endFormatted = formatTo12H(endTime)
  if (startFormatted === 'Invalid Date' || endFormatted === 'Invalid Date') {
    console.log(
      'HORA ENVIADA AL MODAL: Invalid Date - Invalid Date. Error en alguno de los tiempos de inicio o fin.'
    )
    return 'Invalid Date - Invalid Date'
  }
  // Extraemos el indicador AM/PM de cada string para ajustar la salida
  const startPeriod = startFormatted.slice(-2)
  const endPeriod = endFormatted.slice(-2)
  const timeRange =
    startPeriod === endPeriod
      ? `${startFormatted.slice(0, -2).trim()} - ${endFormatted}`
      : `${startFormatted} - ${endFormatted}`
  console.log('HORA ENVIADA AL MODAL:', timeRange)
  return timeRange
}

const openModal = (event: Cita) => {
  console.log('DATOS DESDE CITAS PENDIENTES:', event)
  selectedEvent.value = event // Ya es un Cita completo
  showModal.value = true
  console.log('Modal abierto con datos:', event)
}

const citasReportes = ref<Cita[]>([])

const origen = ref('datos-Reportes')

onMounted(() => {
  citasReportes.value = [
    {
      id: '1',
      title: 'Consulta de control',
      start: '2025-02-15T08:00:00',
      end: '2025-02-15T08:30:00',
      dateStart: '2025-02-15',
      timeStart: '08:00:00',
      dateEnd: '2025-02-15',
      timeEnd: '08:30:00',
      description: 'Revisión de presión arterial y control de peso.',
      paciente: 'Juan Pérez',
      timeRange: formatTimeRange('08:00:00', '08:30:00'),
    },
    {
      id: '2',
      title: 'Chequeo oftalmológico',
      start: '2025-02-15T09:00:00',
      end: '2025-02-15T09:45:00',
      dateStart: '2025-02-15',
      timeStart: '09:00:00',
      dateEnd: '2025-02-15',
      timeEnd: '09:45:00',
      description: 'Examen de la vista y prescripción de lentes.',
      paciente: 'María López',
      timeRange: formatTimeRange('09:00:00', '09:45:00'),
    },
    {
      id: '3',
      title: 'Consulta dermatológica',
      start: '2025-02-15T10:00:00',
      end: '2025-02-15T10:45:00',
      dateStart: '2025-02-15',
      timeStart: '10:00:00',
      dateEnd: '2025-02-15',
      timeEnd: '10:45:00',
      description: 'Evaluación de manchas en la piel.',
      paciente: 'Carlos Martínez',
      timeRange: formatTimeRange('10:00:00', '10:45:00'),
    },
    {
      id: '4',
      title: 'Sesión de fisioterapia',
      start: '2025-02-15T11:00:00',
      end: '2025-02-15T11:30:00',
      dateStart: '2025-02-15',
      timeStart: '11:00:00',
      dateEnd: '2025-02-15',
      timeEnd: '11:30:00',
      description: 'Rehabilitación de rodilla después de cirugía.',
      paciente: 'Ana Torres',
      timeRange: formatTimeRange('11:00:00', '11:30:00'),
    },
    {
      id: '5',
      title: 'Consulta odontológica',
      start: '2025-02-15T12:00:00',
      end: '2025-02-15T12:45:00',
      dateStart: '2025-02-15',
      timeStart: '12:00:00',
      dateEnd: '2025-02-15',
      timeEnd: '12:45:00',
      description: 'Limpieza dental y control de caries.',
      paciente: 'Pedro Gómez',
      timeRange: formatTimeRange('12:00:00', '12:45:00'),
    },
    {
      id: '6',
      title: 'Evaluación cardiológica',
      start: '2025-02-16T09:00:00',
      end: '2025-02-16T10:00:00',
      dateStart: '2025-02-16',
      timeStart: '09:00:00',
      dateEnd: '2025-02-16',
      timeEnd: '10:00:00',
      description: 'Chequeo de ritmo cardíaco y electrocardiograma.',
      paciente: 'Laura Mendoza',
      timeRange: formatTimeRange('09:00:00', '10:00:00'),
    },
    {
      id: '7',
      title: 'Consulta ginecológica',
      start: '2025-02-17T10:30:00',
      end: '2025-02-17T11:30:00',
      dateStart: '2025-02-17',
      timeStart: '10:30:00',
      dateEnd: '2025-02-17',
      timeEnd: '11:30:00',
      description: 'Control y asesoría sobre planificación familiar.',
      paciente: 'Fernando Castillo',
      timeRange: formatTimeRange('10:30:00', '11:30:00'),
    },
    {
      id: '8',
      title: 'Revisión odontológica',
      start: '2025-02-18T15:00:00',
      end: '2025-02-18T16:00:00',
      dateStart: '2025-02-18',
      timeStart: '15:00:00',
      dateEnd: '2025-02-18',
      timeEnd: '16:00:00',
      description: 'Evaluación de encías y ajuste de ortodoncia.',
      paciente: 'Sofía Herrera',
      timeRange: formatTimeRange('15:00:00', '16:00:00'),
    },
    {
      id: '9',
      title: 'Chequeo pediátrico',
      start: '2025-02-19T08:30:00',
      end: '2025-02-19T09:30:00',
      dateStart: '2025-02-19',
      timeStart: '08:30:00',
      dateEnd: '2025-02-19',
      timeEnd: '09:30:00',
      description: 'Control de crecimiento y alimentación infantil.',
      paciente: 'Luis Ramírez MONTAVLO PEREZ',
      timeRange: formatTimeRange('08:30:00', '09:30:00'),
    },
    {
      id: '10',
      title: 'Terapia psicológica',
      start: '2025-02-20T11:00:00',
      end: '2025-02-20T12:30:00',
      dateStart: '2025-02-20',
      timeStart: '11:00:00',
      dateEnd: '2025-02-20',
      timeEnd: '12:30:00',
      description: 'Manejo del estrés y ansiedad.',
      paciente: 'Gabriela Fernández',
      timeRange: formatTimeRange('11:00:00', '12:30:00'),
    },
    {
      id: '11',
      title: 'Consulta de nutrición',
      start: '2025-02-21T14:00:00',
      end: '2025-02-21T15:00:00',
      dateStart: '2025-02-21',
      timeStart: '14:00:00',
      dateEnd: '2025-02-21',
      timeEnd: '15:00:00',
      description: 'Elaboración de un plan alimenticio personalizado.',
      paciente: 'Alejandro Vargas',
      timeRange: formatTimeRange('14:00:00', '15:00:00'),
    },
    {
      id: '12',
      title: 'Revisión postoperatoria',
      start: '2025-02-22T16:00:00',
      end: '2025-02-22T17:00:00',
      dateStart: '2025-02-22',
      timeStart: '16:00:00',
      dateEnd: '2025-02-22',
      timeEnd: '17:00:00',
      description: 'Seguimiento después de cirugía de cadera.',
      paciente: 'Elena Ríos',
      timeRange: formatTimeRange('16:00:00', '17:00:00'),
    },
  ].map((cita) => ({ ...cita, origen: origen.value }))
})
</script>
