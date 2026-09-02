const HORA_APERTURA = 10
const HORA_CIERRE = 19
const INTERVALO_MINUTOS = 60

function formatearHora(minutosTotales) {
  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}

export function generarHorarios() {
  const horarios = []
  const aperturaEnMinutos = HORA_APERTURA * 60
  const cierreEnMinutos = HORA_CIERRE * 60

  for (
    let minutoActual = aperturaEnMinutos;
    minutoActual < cierreEnMinutos;
    minutoActual += INTERVALO_MINUTOS
  ) {
    horarios.push(formatearHora(minutoActual))
  }

  return horarios
}