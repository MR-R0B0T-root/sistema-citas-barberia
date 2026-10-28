const HORA_APERTURA_EN_MINUTOS = 10 * 60
const HORA_CIERRE_EN_MINUTOS = 19 * 60
const FORMATO_HORARIO = /^([01]\d|2[0-3]):([0-5]\d)$/

function duracionEsValida(duracion) {
  return (
    Number.isFinite(duracion) &&
    Number.isInteger(duracion) &&
    duracion > 0
  )
}

function horarioEsValido(horario) {
  return typeof horario === 'string' && FORMATO_HORARIO.test(horario)
}

function convertirHorarioAMinutos(horario) {
  if (!horarioEsValido(horario)) {
    return null
  }

  const [horas, minutos] = horario.split(':').map(Number)

  return horas * 60 + minutos
}

function obtenerIntervaloCita(horario, duracion) {
  const inicio = convertirHorarioAMinutos(horario)

  if (inicio === null || !duracionEsValida(duracion)) {
    return null
  }

  return {
    inicio,
    fin: inicio + duracion,
  }
}

function intervaloEstaDentroDeLaJornada(intervalo) {
  return (
    intervalo !== null &&
    intervalo.inicio >= HORA_APERTURA_EN_MINUTOS &&
    intervalo.fin <= HORA_CIERRE_EN_MINUTOS
  )
}

function intervalosSeTraslapan(primerIntervalo, segundoIntervalo) {
  return (
    primerIntervalo.inicio < segundoIntervalo.fin &&
    primerIntervalo.fin > segundoIntervalo.inicio
  )
}

function citaTieneEstructuraValida(cita) {
  return (
    cita !== null &&
    typeof cita === 'object' &&
    typeof cita.id === 'string' &&
    typeof cita.fecha === 'string' &&
    horarioEsValido(cita.horario) &&
    cita.servicio !== null &&
    typeof cita.servicio === 'object' &&
    duracionEsValida(cita.servicio.duracion)
  )
}

export function terminaDentroDelHorario(horario, duracion) {
  const intervalo = obtenerIntervaloCita(horario, duracion)

  return intervaloEstaDentroDeLaJornada(intervalo)
}

export function estaDisponible({
  citas,
  fecha,
  horario,
  duracion,
  citaIdIgnorada = null,
}) {
  if (
    !Array.isArray(citas) ||
    typeof fecha !== 'string' ||
    fecha.trim() === '' ||
    !horarioEsValido(horario) ||
    !duracionEsValida(duracion)
  ) {
    return false
  }

  const nuevoIntervalo = obtenerIntervaloCita(horario, duracion)

  if (!intervaloEstaDentroDeLaJornada(nuevoIntervalo)) {
    return false
  }

  return !citas.some((cita) => {
    /*
     * Un registro corrupto no debe provocar una excepción ni permitir que
     * se confirme una disponibilidad posiblemente incorrecta.
     */
    if (!citaTieneEstructuraValida(cita)) {
      return true
    }

    if (cita.id === citaIdIgnorada || cita.fecha !== fecha) {
      return false
    }

    const intervaloExistente = obtenerIntervaloCita(
      cita.horario,
      cita.servicio.duracion,
    )

    if (!intervaloEstaDentroDeLaJornada(intervaloExistente)) {
      return true
    }

    return intervalosSeTraslapan(nuevoIntervalo, intervaloExistente)
  })
}
