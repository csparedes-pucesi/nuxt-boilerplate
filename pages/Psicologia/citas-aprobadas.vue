<template>
  <div>
    <ComponenteCalendarioCitas
      :citas="citasAprobadas"
      origen="datos-Aprobadas"
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
  console.log('DATOS DESDE CITAS APROBADAS:', event)
  selectedEvent.value = event // Ya es un Cita completo
  showModal.value = true
  console.log('Modal abierto con datos:', event)
}

const citasAprobadas = ref<Cita[]>([])
const origen = ref('datos-Aprobadas')

onMounted(() => {
  citasAprobadas.value = [
    {
      id: '1',
      title: 'Consulta de control (APROBADA)',
      start: '2025-02-20T08:00:00',
      end: '2025-02-20T17:30:00',
      dateStart: '2025-02-20',
      timeStart: '08:00:00',
      dateEnd: '2025-02-20',
      timeEnd: '17:30:00',
      description: 'Examen general y revisión de salud aprobada.',
      paciente: 'Sergio Gutiérrez',
      timeRange: formatTimeRange('08:00:00', '17:30:00'),
    },
    {
      id: '2',
      title: 'Consulta oftalmológica (APROBADA)',
      start: '2025-02-10T09:00:00',
      end: '2025-02-10T09:45:00',
      dateStart: '2025-02-10',
      timeStart: '09:00:00',
      dateEnd: '2025-02-10',
      timeEnd: '09:45:00',
      description: 'Evaluación de la vista y prescripción de lentes aprobada.',
      paciente: 'Lucía Fernández',
      timeRange: formatTimeRange('09:00:00', '09:45:00'),
    },
    {
      id: '3',
      title: 'Consulta dermatológica (APROBADA)',
      start: '2025-02-11T10:00:00',
      end: '2025-02-11T10:45:00',
      dateStart: '2025-02-11',
      timeStart: '10:00:00',
      dateEnd: '2025-02-11',
      timeEnd: '10:45:00',
      description: 'Revisión de la piel y tratamiento de acné aprobado.',
      paciente: 'Mario López',
      timeRange: formatTimeRange('10:00:00', '10:45:00'),
    },
    {
      id: '4',
      title: 'Sesión de fisioterapia (APROBADA)',
      start: '2025-02-11T11:00:00',
      end: '2025-02-11T11:30:00',
      dateStart: '2025-02-11',
      timeStart: '11:00:00',
      dateEnd: '2025-02-11',
      timeEnd: '11:30:00',
      description: 'Sesión de rehabilitación post-lesión aprobada.',
      paciente: 'Ana Martínez',
      timeRange: formatTimeRange('11:00:00', '11:30:00'),
    },
    {
      id: '5',
      title: 'Consulta odontológica (APROBADA)',
      start: '2025-02-12T12:00:00',
      end: '2025-02-12T12:45:00',
      dateStart: '2025-02-12',
      timeStart: '12:00:00',
      dateEnd: '2025-02-12',
      timeEnd: '12:45:00',
      description: 'Limpieza dental y revisión de encías aprobada.',
      paciente: 'Pedro Ramírez',
      timeRange: formatTimeRange('12:00:00', '12:45:00'),
    },
    {
      id: '6',
      title: 'Evaluación cardiológica (APROBADA)',
      start: '2025-02-12T09:00:00',
      end: '2025-02-12T10:00:00',
      dateStart: '2025-02-12',
      timeStart: '09:00:00',
      dateEnd: '2025-02-12',
      timeEnd: '10:00:00',
      description: 'Chequeo cardiovascular completo aprobado.',
      paciente: 'Laura González',
      timeRange: formatTimeRange('09:00:00', '10:00:00'),
    },
    /* Citas aprobadas en marzo (algunos días) */
    {
      id: '7',
      title: 'Consulta ginecológica (APROBADA)',
      start: '2025-03-05T10:30:00',
      end: '2025-03-05T11:30:00',
      dateStart: '2025-03-05',
      timeStart: '10:30:00',
      dateEnd: '2025-03-05',
      timeEnd: '11:30:00',
      description: 'Revisión ginecológica y planificación aprobada.',
      paciente: 'Carmen Díaz',
      timeRange: formatTimeRange('10:30:00', '11:30:00'),
    },
    {
      id: '8',
      title: 'Consulta de nutrición (APROBADA)',
      start: '2025-03-05T13:00:00',
      end: '2025-03-05T14:00:00',
      dateStart: '2025-03-05',
      timeStart: '13:00:00',
      dateEnd: '2025-03-05',
      timeEnd: '14:00:00',
      description: 'Plan nutricional personalizado aprobado.',
      paciente: 'Javier Morales',
      timeRange: formatTimeRange('13:00:00', '14:00:00'),
    },
    {
      id: '9',
      title: 'Chequeo pediátrico (APROBADA)',
      start: '2025-03-06T08:30:00',
      end: '2025-03-06T09:30:00',
      dateStart: '2025-03-06',
      timeStart: '08:30:00',
      dateEnd: '2025-03-06',
      timeEnd: '09:30:00',
      description: 'Evaluación de desarrollo infantil aprobada.',
      paciente: 'Sofía Herrera',
      timeRange: formatTimeRange('08:30:00', '09:30:00'),
    },
    {
      id: '10',
      title: 'Terapia psicológica (APROBADA)',
      start: '2025-03-06T10:00:00',
      end: '2025-03-06T11:30:00',
      dateStart: '2025-03-06',
      timeStart: '10:00:00',
      dateEnd: '2025-03-06',
      timeEnd: '11:30:00',
      description: 'Sesión de terapia para manejo de ansiedad aprobada.',
      paciente: 'Roberto Sánchez',
      timeRange: formatTimeRange('10:00:00', '11:30:00'),
    },
    {
      id: '11',
      title: 'Consulta de reumatología (APROBADA)',
      start: '2025-03-06T13:30:00',
      end: '2025-03-06T14:30:00',
      dateStart: '2025-03-06',
      timeStart: '13:30:00',
      dateEnd: '2025-03-06',
      timeEnd: '14:30:00',
      description: 'Evaluación y tratamiento para artritis aprobado.',
      paciente: 'Marta Castro',
      timeRange: formatTimeRange('13:30:00', '14:30:00'),
    },
    {
      id: '12',
      title: 'Revisión postoperatoria (APROBADA)',
      start: '2025-03-06T15:00:00',
      end: '2025-03-06T16:00:00',
      dateStart: '2025-03-06',
      timeStart: '15:00:00',
      dateEnd: '2025-03-06',
      timeEnd: '16:00:00',
      description: 'Seguimiento postoperatorio completo aprobado.',
      paciente: 'Elena Ríos',
      timeRange: formatTimeRange('15:00:00', '16:00:00'),
    },
  ].map((cita) => ({ ...cita, origen: origen.value }))
})
</script>
