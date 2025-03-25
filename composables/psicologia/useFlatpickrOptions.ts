// useFlatpickrOptions.ts

import flatpickr from 'flatpickr'
import { Spanish } from 'flatpickr/dist/l10n/es'
import '@/pages/Psicologia/css/Flatpickr.css'

// Extraemos la función formatDate desde flatpickr (usando "as any" para evitar problemas de tipado)
const { formatDate } = flatpickr
/**
 * Calculates the Hamming distance between two strings of the same length.
 */
function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity
  let dist = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      dist++
    }
  }
  return dist
}

/**
 * Completes the month number from a partial string.
 * Only the first letters (of the same length as the input) are compared.
 * If the Hamming distance is greater than 1, the input is considered unreliable and January (1) is returned.
 * In case of a tie, the month with the lower number (i.e. appearing earlier in the year) is returned.
 *
 * Now includes the case when the input is a single letter:
 * all months starting with that letter are collected and the one with the shortest full name (or lowest value in case of a tie) is returned.
 */
function completeMonthName(
  monthStr: string,
  mapping: { [key: string]: number }
): number {
  const lower = monthStr.toLowerCase()
  // Case for single-letter input
  if (lower.length === 1) {
    const candidates: { key: string; month: number }[] = []
    for (const key in mapping) {
      if (key[0].toLowerCase() === lower[0]) {
        candidates.push({ key, month: mapping[key] })
      }
    }
    if (candidates.length === 1) {
      return candidates[0].month
    } else if (candidates.length > 1) {
      candidates.sort((a, b) => {
        if (a.key.length !== b.key.length) return a.key.length - b.key.length
        return a.month - b.month
      })
      return candidates[0].month
    }
    return 1
  }

  // For inputs of 2 or more letters, use the Hamming distance.
  let bestMonth: number | null = null
  let bestDistance = Infinity
  for (const key in mapping) {
    const keyPart = key.slice(0, lower.length).toLowerCase()
    const distance = hammingDistance(lower, keyPart)
    if (distance < bestDistance) {
      bestDistance = distance
      bestMonth = mapping[key]
    } else if (distance === bestDistance && bestMonth !== null) {
      bestMonth = Math.min(bestMonth, mapping[key])
    }
  }
  return bestDistance > 1 ? 1 : bestMonth || 1
}

/**
 * Function that attempts to parse a date in various formats:
 * - Spanish textual format: "21 de noviembre de 2001" or variant "Febrero 23, 2025"
 * - English textual format: "February 23, 2025" or "23 February 2025"  (CONDITION COMMENTED OUT)
 * - Numeric formats with separators (spaces, dashes or slashes)
 * - Two-parts case: month and year only (e.g., "Febrero 2024" returns day 01)
 * - Mixed case: when there are 3 parts and at least one contains letters (to identify the month)
 * - Other numeric formats of 3 parts.
 * - Single token case: if only a month or only a year is entered.
 *
 * If the year part does not have 4 digits, the current year is used.
 */
export function customParseDate(datestr: string): Date {
  const currentYear = new Date().getFullYear()
  const currentDate = new Date()
  let match: RegExpMatchArray | null

  // 1. Spanish textual format: "21 de noviembre de 2001"
  const spanishRegex = /^(\d{1,2})\s*de\s*([a-záéíóúñ]+)\s*de\s*(\d{1,4})$/i
  match = datestr.match(spanishRegex)
  if (match) {
    const day = parseInt(match[1], 10)
    const spanishMonths: { [key: string]: number } = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      setiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
    }
    const month = completeMonthName(match[2], spanishMonths)
    const year = match[3].length === 4 ? parseInt(match[3], 10) : currentYear
    return new Date(year, month - 1, day)
  }

  // 2. Spanish textual variant: "Febrero 23, 2025"
  const spanishRegex2 = /^([A-Za-záéíóúñ]+)\s+(\d{1,2}),\s*(\d{1,4})$/i
  match = datestr.match(spanishRegex2)
  if (match) {
    const day = parseInt(match[2], 10)
    const spanishMonths: { [key: string]: number } = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      setiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
    }
    const month = completeMonthName(match[1], spanishMonths)
    const year = match[3].length === 4 ? parseInt(match[3], 10) : currentYear
    return new Date(year, month - 1, day)
  }

  /*
    // 3. English textual format: "February 23, 2025" (COMMENTED OUT)
    const englishRegex1 = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{1,4})$/;
    match = datestr.match(englishRegex1);
    if (match) {
      const day = parseInt(match[2], 10);
      const englishMonths: { [key: string]: number } = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };
      const month = completeMonthName(match[1], englishMonths);
      const year = match[3].length === 4 ? parseInt(match[3], 10) : currentYear;
      return new Date(year, month - 1, day);
    }
  
    // 4. English textual variant: "23 February 2025" (COMMENTED OUT)
    const englishRegex2 = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{1,4})$/;
    match = datestr.match(englishRegex2);
    if (match) {
      const day = parseInt(match[1], 10);
      const englishMonths: { [key: string]: number } = {
        january: 1,
        february: 2,
        march: 3,
        april: 4,
        may: 5,
        june: 6,
        july: 7,
        august: 8,
        september: 9,
        october: 10,
        november: 11,
        december: 12,
      };
      const month = completeMonthName(match[2], englishMonths);
      const year = match[3].length === 4 ? parseInt(match[3], 10) : currentYear;
      return new Date(year, month - 1, day);
    }
    */

  // Remove connector words ("de", "del") from tokens
  const tokens = datestr
    .split(/[\s-/]+/)
    .filter((token) => !['de', 'del'].includes(token.toLowerCase()))

  // 5. Two-parts case: month and year only (e.g., "Febrero 2024")
  if (tokens.length === 2) {
    let monthStr: string | null = null
    let yearStr: string | null = null
    for (const part of tokens) {
      if (/[A-Za-záéíóúñ]/i.test(part)) {
        monthStr = part
      } else {
        yearStr = part
      }
    }
    if (monthStr && yearStr && yearStr.length === 4) {
      const spanishMonths: { [key: string]: number } = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        setiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
      }
      /*
        // const englishMonths: { [key: string]: number } = {
        //   january: 1,
        //   february: 2,
        //   march: 3,
        //   april: 4,
        //   may: 5,
        //   june: 6,
        //   july: 7,
        //   august: 8,
        //   september: 9,
        //   october: 10,
        //   november: 11,
        //   december: 12,
        // };
        */
      const month = completeMonthName(monthStr, spanishMonths)
      // || completeMonthName(monthStr, englishMonths);
      return new Date(parseInt(yearStr, 10), month - 1, 1)
    }
  }

  // 6. Mixed case: when there are 3 parts and at least one contains letters (to identify the month)
  if (tokens.length === 3) {
    let monthStr: string | null = null
    const numberParts: string[] = []
    for (const part of tokens) {
      if (/[A-Za-záéíóúñ]/i.test(part)) {
        monthStr = part
      } else {
        numberParts.push(part)
      }
    }
    if (monthStr && numberParts.length === 2) {
      let day: number, year: number
      const candidateYear = numberParts.find((p) => p.length === 4)
      if (candidateYear) {
        year = parseInt(candidateYear, 10)
        const other = numberParts.find((p) => p !== candidateYear) || '0'
        day = parseInt(other, 10)
      } else {
        const num1 = parseInt(numberParts[0], 10)
        const num2 = parseInt(numberParts[1], 10)
        if (num1 >= num2) {
          year = num1
          day = num2
        } else {
          year = num2
          day = num1
        }
      }
      const spanishMonths: { [key: string]: number } = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        setiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
      }
      /*
        // const englishMonths: { [key: string]: number } = {
        //   january: 1,
        //   february: 2,
        //   march: 3,
        //   april: 4,
        //   may: 5,
        //   june: 6,
        //   july: 7,
        //   august: 8,
        //   september: 9,
        //   october: 10,
        //   november: 11,
        //   december: 12,
        // };
        */
      const month = completeMonthName(monthStr, spanishMonths)
      // || completeMonthName(monthStr, englishMonths);
      const candidateDate = new Date(year, month - 1, day)
      if (!isNaN(candidateDate.getTime())) {
        return candidateDate
      }
    }
  }

  // 7. Other numeric formats: try splitting by separators (spaces, dashes, or slashes)
  if (tokens.length === 3) {
    let day: number, month: number, year: number
    const candidateIndex = tokens.findIndex((p) => p.length === 4)
    if (candidateIndex !== -1) {
      year = parseInt(tokens[candidateIndex], 10)
      const otherIndices = tokens.filter((_, i) => i !== candidateIndex)
      const num1 = parseInt(otherIndices[0], 10)
      const num2 = parseInt(otherIndices[1], 10)
      if (num1 > 12) {
        day = num1
        month = num2
      } else if (num2 > 12) {
        day = num2
        month = num1
      } else {
        day = num1
        month = num2
      }
      const candidateDate = new Date(year, month - 1, day)
      if (!isNaN(candidateDate.getTime())) {
        return candidateDate
      }
    }
  }

  // 8. Single token case: if only a month or only a year is entered
  const trimmed = datestr.trim()
  const singleTokens = trimmed
    .split(/[\s-/]+/)
    .filter((token) => !['de', 'del'].includes(token.toLowerCase()))
  if (singleTokens.length === 1) {
    // If it contains letters, treat it as a month
    if (/[A-Za-záéíóúñ]/i.test(singleTokens[0])) {
      const spanishMonths: { [key: string]: number } = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        setiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
      }
      /*
        // const englishMonths: { [key: string]: number } = {
        //   january: 1,
        //   february: 2,
        //   march: 3,
        //   april: 4,
        //   may: 5,
        //   june: 6,
        //   july: 7,
        //   august: 8,
        //   september: 9,
        //   october: 10,
        //   november: 11,
        //   december: 12,
        // };
        */
      const month = completeMonthName(singleTokens[0], spanishMonths)
      // || completeMonthName(singleTokens[0], englishMonths);
      return new Date(currentYear, month - 1, 1)
    }
    // If only digits, treat it as a year
    if (/^\d+$/.test(singleTokens[0])) {
      const year = parseInt(singleTokens[0], 10)
      const currentMonth = currentDate.getMonth() + 1
      return new Date(year, currentMonth - 1, 1)
    }
  }

  // 9. Fallback:
  // If none of the above conditions match, return the current date.
  // Fallback for Spanish:
  return new Date()

  // Fallback for English (COMMENTED OUT):
  // return new Date();
}

/**
 * Inicializa Flatpickr en los inputs de fecha.
 * @param dateInicioInput Elemento HTML para la fecha de inicio.
 * @param dateFinInput Elemento HTML para la fecha de fin.
 * @returns Un objeto con las instancias de Flatpickr para dateInicio y dateFin.
 */
export function initFlatpickr(
  dateInicioInput: HTMLElement | null,
  dateFinInput: HTMLElement | null
): { fpInicio: flatpickr.Instance | null; fpFin: flatpickr.Instance | null } {
  console.log('initFlatpickr called')
  let fpInicio: flatpickr.Instance | null = null
  let fpFin: flatpickr.Instance | null = null

  // Inicializar Flatpickr para dateInicio
  if (dateInicioInput) {
    console.log(
      'Initializing Flatpickr for dateInicio with Spanish locale and custom parseDate'
    )
    try {
      fpInicio = flatpickr(dateInicioInput as Node, {
        dateFormat: 'd-m-Y', // Cambiado para salida en "día-mes-año"
        allowInput: true,
        locale: Spanish,
        parseDate: (datestr: string) => {
          const parsed = customParseDate(datestr)
          if (!parsed) {
            console.error(
              'Could not parse date for dateInicio from input:',
              datestr
            )
            return new Date(NaN)
          }
          console.log(
            'Parsed date for dateInicio:',
            parsed,
            'from input:',
            datestr
          )
          return parsed
        },
        formatDate: (
          date: Date,
          _format: string,
          _locale: flatpickr.Locale
        ) => {
          // Muestra la fecha en formato "día-mes-año"
          return formatDate(date, 'd-m-Y')
        },
      })
      console.log(
        'Flatpickr for dateInicio initialized. Locale:',
        fpInicio.config.locale
      )
    } catch (error) {
      console.error('Error initializing Flatpickr for dateInicio:', error)
    }
  } else {
    console.log('dateInicioInput is null')
  }

  // Inicializar Flatpickr para dateFin
  if (dateFinInput) {
    console.log(
      'Initializing Flatpickr for dateFin with Spanish locale and custom parseDate'
    )
    try {
      fpFin = flatpickr(dateFinInput as Node, {
        dateFormat: 'd-m-Y',
        allowInput: true,
        locale: Spanish,
        parseDate: (datestr: string) => {
          const parsed = customParseDate(datestr)
          if (!parsed) {
            console.error(
              'Could not parse date for dateFin from input:',
              datestr
            )
            return new Date(NaN)
          }
          console.log(
            'Parsed date for dateFin:',
            parsed,
            'from input:',
            datestr
          )
          return parsed
        },
        formatDate: (
          date: Date,
          _format: string,
          _locale: flatpickr.Locale
        ) => {
          return formatDate(date, 'd-m-Y')
        },
      })
      console.log(
        'Flatpickr for dateFin initialized. Locale:',
        fpFin.config.locale
      )
    } catch (error) {
      console.error('Error initializing Flatpickr for dateFin:', error)
    }
  } else {
    console.log('dateFinInput is null')
  }

  return { fpInicio, fpFin }
}
