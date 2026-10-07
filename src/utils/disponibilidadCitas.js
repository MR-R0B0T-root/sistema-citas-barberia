const HORA_CIERRE_EN_MINUTOS = 19 * 60

function convertirHorarioAMinutos(horario) {
  const [horas, minutos] = horario.split(':').map(Number)

  return horas * 60 + minutos
}

function obtenerIntervaloCita(horario, duracion) {
  const inicio = convertirHorarioAMinutos(horario)

  return {
    inicio,
    fin: inicio + duracion,
  }
}

function intervalosSeTraslapan(primerIntervalo, segundoIntervalo) {
  return (
    primerIntervalo.inicio < segundoIntervalo.fin &&
    primerIntervalo.fin > segundoIntervalo.inicio
  )
}

export function terminaDentroDelHorario(horario, duracion) {
  const intervalo = obtenerIntervaloCita(horario, duracion)

  return intervalo.fin <= HORA_CIERRE_EN_MINUTOS
}

export function estaDisponible({
  citas,
  fecha,
  horario,
  duracion,
  citaIdIgnorada = null,
}) {
  if (!fecha || !horario || !duracion) {
    return false
  }

  if (!terminaDentroDelHorario(horario, duracion)) {
    return false
  }

  const nuevoIntervalo = obtenerIntervaloCita(horario, duracion)

  return !citas.some((cita) => {
    if (cita.id === citaIdIgnorada || cita.fecha !== fecha) {
      return false
    }

    const intervaloExistente = obtenerIntervaloCita(
      cita.horario,
      cita.servicio.duracion,
    )

    return intervalosSeTraslapan(nuevoIntervalo, intervaloExistente)
  })
}