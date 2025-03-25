<template>
  <div>
    <ComponenteCalendarioCitas
      :citas="citasFinalizadas"
      origen="datos-Finalizadas"
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
  console.log('DATOS DESDE CITAS FINALIZADAS:', event)
  selectedEvent.value = event // Ya es un Cita completo
  showModal.value = true
  console.log('Modal abierto con datos:', event)
}

const citasFinalizadas = ref<Cita[]>([])
const origen = ref('datos-Finalizadas')

onMounted(() => {
  citasFinalizadas.value = [
    {
      id: '1',
      title: 'Consulta médica general (Finalizada)',
      start: '2025-02-26T08:00:00',
      end: '2025-02-26T08:30:00',
      dateStart: '2025-02-26',
      timeStart: '08:00:00',
      dateEnd: '2025-02-26',
      timeEnd: '08:30:00',
      description: 'Consulta completada con exámenes de rutina.',
      paciente: 'Andrés Morales',
      timeRange: formatTimeRange('08:00:00', '08:30:00'),
    },
    {
      id: '2',
      title: 'Revisión dental (Finalizada)',
      start: '2025-02-08T09:00:00',
      end: '2025-02-08T09:45:00',
      dateStart: '2025-02-08',
      timeStart: '09:00:00',
      dateEnd: '2025-02-08',
      timeEnd: '09:45:00',
      description: 'Limpieza dental y chequeo completados.',
      paciente: 'Patricia Ramírez',
      timeRange: formatTimeRange('09:00:00', '09:45:00'),
    },
    {
      id: '3',
      title: 'Consulta dermatológica (Finalizada)',
      start: '2025-02-09T10:00:00',
      end: '2025-02-09T10:45:00',
      dateStart: '2025-02-09',
      timeStart: '10:00:00',
      dateEnd: '2025-02-09',
      timeEnd: '10:45:00',
      description: 'Tratamiento para irritaciones cutáneas completado.',
      paciente: 'Carlos Gómez',
      timeRange: formatTimeRange('10:00:00', '10:45:00'),
    },
    {
      id: '4',
      title: 'Sesión de fisioterapia (Finalizada)',
      start: '2025-02-09T11:00:00',
      end: '2025-02-09T11:30:00',
      dateStart: '2025-02-09',
      timeStart: '11:00:00',
      dateEnd: '2025-02-09',
      timeEnd: '11:30:00',
      description: 'Terapia física para rehabilitación completada.',
      paciente: 'Luciana Torres',
      timeRange: formatTimeRange('11:00:00', '11:30:00'),
    },
    {
      id: '5',
      title: 'Consulta nutricional (Finalizada)',
      start: '2025-02-09T12:00:00',
      end: '2025-02-09T12:30:00',
      dateStart: '2025-02-09',
      timeStart: '12:00:00',
      dateEnd: '2025-02-09',
      timeEnd: '12:30:00',
      description: 'Plan de alimentación personalizado finalizado.',
      paciente: 'Miguel Sánchez',
      timeRange: formatTimeRange('12:00:00', '12:30:00'),
    },
    /* Citas finalizadas en marzo (algunos días) */
    {
      id: '6',
      title: 'Evaluación cardiológica (Finalizada)',
      start: '2025-03-10T09:00:00',
      end: '2025-03-10T10:00:00',
      dateStart: '2025-03-10',
      timeStart: '09:00:00',
      dateEnd: '2025-03-10',
      timeEnd: '10:00:00',
      description: 'Electrocardiograma y chequeo cardiovascular completados.',
      paciente: 'Isabel Ruiz',
      timeRange: formatTimeRange('09:00:00', '10:00:00'),
    },
    {
      id: '7',
      title: 'Consulta ginecológica (Finalizada)',
      start: '2025-03-10T10:30:00',
      end: '2025-03-10T11:30:00',
      dateStart: '2025-03-10',
      timeStart: '10:30:00',
      dateEnd: '2025-03-10',
      timeEnd: '11:30:00',
      description: 'Consulta y seguimiento en salud femenina completados.',
      paciente: 'María López',
      timeRange: formatTimeRange('10:30:00', '11:30:00'),
    },
    {
      id: '8',
      title: 'Revisión oftalmológica (Finalizada)',
      start: '2025-03-11T15:00:00',
      end: '2025-03-11T15:45:00',
      dateStart: '2025-03-11',
      timeStart: '15:00:00',
      dateEnd: '2025-03-11',
      timeEnd: '15:45:00',
      description:
        'Examen de la vista y corrección de prescripción completados.',
      paciente: 'Jorge Martínez',
      timeRange: formatTimeRange('15:00:00', '15:45:00'),
    },
    {
      id: '9',
      title: 'Chequeo pediátrico (Finalizada)',
      start: '2025-03-11T08:30:00',
      end: '2025-03-11T09:30:00',
      dateStart: '2025-03-11',
      timeStart: '08:30:00',
      dateEnd: '2025-03-11',
      timeEnd: '09:30:00',
      description: 'Revisión de crecimiento y desarrollo infantil finalizada.',
      paciente: 'Sofía Herrera',
      timeRange: formatTimeRange('08:30:00', '09:30:00'),
    },
    {
      id: '10',
      title: 'Terapia psicológica (Finalizada)',
      start: '2025-03-11T10:00:00',
      end: '2025-03-11T11:30:00',
      dateStart: '2025-03-11',
      timeStart: '10:00:00',
      dateEnd: '2025-03-11',
      timeEnd: '11:30:00',
      description: 'Sesión de apoyo emocional y manejo de estrés finalizada.',
      paciente: 'Daniela Cruz',
      timeRange: formatTimeRange('10:00:00', '11:30:00'),
    },
    {
      id: '11',
      title: 'Consulta de reumatología (Finalizada)',
      start: '2025-03-12T13:30:00',
      end: '2025-03-12T14:30:00',
      dateStart: '2025-03-12',
      timeStart: '13:30:00',
      dateEnd: '2025-03-12',
      timeEnd: '14:30:00',
      description:
        'Evaluación y tratamiento para afecciones articulares finalizados.',
      paciente: 'Verónica Pérez',
      timeRange: formatTimeRange('13:30:00', '14:30:00'),
    },
    {
      id: '12',
      title: 'Revisión postoperatoria (Finalizada)',
      start: '2025-03-12T15:00:00',
      end: '2025-03-12T16:00:00',
      dateStart: '2025-03-12',
      timeStart: '15:00:00',
      dateEnd: '2025-03-12',
      timeEnd: '16:00:00',
      description: 'Seguimiento postoperatorio sin complicaciones completado.',
      paciente: 'Elena Ríos',
      timeRange: formatTimeRange('15:00:00', '16:00:00'),
    },
  ].map((cita) => ({ ...cita, origen: origen.value }))
})
</script>
