import { describe, expect, it } from 'vitest'
import {
  esCitaValida,
  recuperarCitasDesdeTexto,
} from './validacionCitas.js'

const citaValida = {
  id: 'VITIUM-05-PRUEBA',
  cliente: {
    nombre: 'Cliente Prueba',
    correo: 'prueba@example.com',
    telefono: '5500000000',
  },
  servicio: {
    id: 'servicio-prueba',
    nombre: 'Servicio de prueba',
    descripcion: 'Registro ficticio para pruebas automatizadas',
    precio: 100,
    duracion: 60,
  },
  fecha: '2026-10-21',
  horario: '10:00',
  fechaRegistro: '2026-10-21T10:00:00.000Z',
}

describe('esCitaValida', () => {
  it('acepta una cita con la estructura mínima válida', () => {
    expect(esCitaValida(citaValida)).toBe(true)
  })

  it('rechaza un elemento nulo', () => {
    expect(esCitaValida(null)).toBe(false)
  })

  it('rechaza un registro vacío', () => {
    expect(esCitaValida({})).toBe(false)
  })

  it('rechaza una cita sin cliente', () => {
    const citaSinCliente = { ...citaValida }

    delete citaSinCliente.cliente

    expect(esCitaValida(citaSinCliente)).toBe(false)
  })

  it('rechaza una cita sin servicio', () => {
    const citaSinServicio = { ...citaValida }

    delete citaSinServicio.servicio

    expect(esCitaValida(citaSinServicio)).toBe(false)
  })

  it('rechaza un cliente sin nombre', () => {
    const citaSinNombre = {
      ...citaValida,
      cliente: {
        ...citaValida.cliente,
        nombre: '',
      },
    }

    expect(esCitaValida(citaSinNombre)).toBe(false)
  })

  it('rechaza un servicio sin identificador', () => {
    const citaSinServicioId = {
      ...citaValida,
      servicio: {
        ...citaValida.servicio,
        id: '',
      },
    }

    expect(esCitaValida(citaSinServicioId)).toBe(false)
  })

  it('rechaza una fecha inexistente', () => {
    const citaConFechaInvalida = {
      ...citaValida,
      fecha: '2026-02-31',
    }

    expect(esCitaValida(citaConFechaInvalida)).toBe(false)
  })

  it('rechaza un horario malformado', () => {
    const citaConHorarioInvalido = {
      ...citaValida,
      horario: '10:99',
    }

    expect(esCitaValida(citaConHorarioInvalido)).toBe(false)
  })

  it('rechaza una duración negativa', () => {
    const citaConDuracionNegativa = {
      ...citaValida,
      servicio: {
        ...citaValida.servicio,
        duracion: -30,
      },
    }

    expect(esCitaValida(citaConDuracionNegativa)).toBe(false)
  })

  it('rechaza un precio negativo', () => {
    const citaConPrecioNegativo = {
      ...citaValida,
      servicio: {
        ...citaValida.servicio,
        precio: -100,
      },
    }

    expect(esCitaValida(citaConPrecioNegativo)).toBe(false)
  })
})

describe('recuperarCitasDesdeTexto', () => {
  it('devuelve una colección vacía si no existe contenido', () => {
    expect(recuperarCitasDesdeTexto(null)).toEqual([])
  })

  it('devuelve una colección vacía ante una cadena vacía', () => {
    expect(recuperarCitasDesdeTexto('')).toEqual([])
  })

  it('devuelve una colección vacía ante JSON malformado', () => {
    expect(recuperarCitasDesdeTexto('{json roto')).toEqual([])
  })

  it('rechaza un objeto que no sea una colección', () => {
    expect(recuperarCitasDesdeTexto('{}')).toEqual([])
  })

  it('rechaza el valor JSON nulo', () => {
    expect(recuperarCitasDesdeTexto('null')).toEqual([])
  })

  it('conserva una colección vacía válida', () => {
    expect(recuperarCitasDesdeTexto('[]')).toEqual([])
  })

  it('conserva una colección con una cita válida', () => {
    const resultado = recuperarCitasDesdeTexto(
      JSON.stringify([citaValida]),
    )

    expect(resultado).toEqual([citaValida])
  })

  it('descarta un elemento nulo', () => {
    const resultado = recuperarCitasDesdeTexto(
      JSON.stringify([null]),
    )

    expect(resultado).toEqual([])
  })

  it('descarta un registro vacío', () => {
    const resultado = recuperarCitasDesdeTexto(
      JSON.stringify([{}]),
    )

    expect(resultado).toEqual([])
  })

  it('conserva las citas válidas de una colección mixta', () => {
    const resultado = recuperarCitasDesdeTexto(
      JSON.stringify([citaValida, null, {}]),
    )

    expect(resultado).toEqual([citaValida])
  })

  it('no modifica el contenido de una cita válida', () => {
    const resultado = recuperarCitasDesdeTexto(
      JSON.stringify([citaValida]),
    )

    expect(resultado[0]).toStrictEqual(citaValida)
  })
})
