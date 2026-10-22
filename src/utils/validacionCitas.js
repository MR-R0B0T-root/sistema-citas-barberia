const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/
const FORMATO_HORARIO = /^([01]\d|2[0-3]):([0-5]\d)$/

function esObjeto(valor) {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor)
}

function esTextoNoVacio(valor) {
  return typeof valor === 'string' && valor.trim() !== ''
}

function esFechaValida(fecha) {
  if (!esTextoNoVacio(fecha) || !FORMATO_FECHA.test(fecha)) {
    return false
  }

  const [anio, mes, dia] = fecha.split('-').map(Number)
  const fechaConstruida = new Date(anio, mes - 1, dia)

  return (
    fechaConstruida.getFullYear() === anio &&
    fechaConstruida.getMonth() === mes - 1 &&
    fechaConstruida.getDate() === dia
  )
}

function esHorarioValido(horario) {
  return esTextoNoVacio(horario) && FORMATO_HORARIO.test(horario)
}

function esClienteValido(cliente) {
  return (
    esObjeto(cliente) &&
    esTextoNoVacio(cliente.nombre) &&
    esTextoNoVacio(cliente.correo) &&
    esTextoNoVacio(cliente.telefono)
  )
}

function esServicioValido(servicio) {
  return (
    esObjeto(servicio) &&
    esTextoNoVacio(servicio.id) &&
    esTextoNoVacio(servicio.nombre) &&
    Number.isFinite(servicio.precio) &&
    servicio.precio >= 0 &&
    Number.isFinite(servicio.duracion) &&
    Number.isInteger(servicio.duracion) &&
    servicio.duracion > 0
  )
}

export function esCitaValida(cita) {
  return (
    esObjeto(cita) &&
    esTextoNoVacio(cita.id) &&
    esClienteValido(cita.cliente) &&
    esServicioValido(cita.servicio) &&
    esFechaValida(cita.fecha) &&
    esHorarioValido(cita.horario)
  )
}

export function recuperarCitasDesdeTexto(contenido) {
  if (!esTextoNoVacio(contenido)) {
    return []
  }

  try {
    const datosConvertidos = JSON.parse(contenido)

    if (!Array.isArray(datosConvertidos)) {
      return []
    }

    return datosConvertidos.filter(esCitaValida)
  } catch {
    return []
  }
}
