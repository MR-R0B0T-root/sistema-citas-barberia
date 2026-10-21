import { describe, expect, it } from 'vitest'
import {
  estaDisponible,
  terminaDentroDelHorario,
} from './disponibilidadCitas.js'

describe('terminaDentroDelHorario', () => {
  it('permite una cita que termina exactamente a las 19:00', () => {
    expect(terminaDentroDelHorario('18:30', 30)).toBe(true)
  })

  it('rechaza una cita que termina después de las 19:00', () => {
    expect(terminaDentroDelHorario('18:45', 30)).toBe(false)
  })
})

describe('estaDisponible: comportamiento esperado actual', () => {
  it('permite citas consecutivas sin traslape', () => {
    const citas = [
      {
        id: 'cita-1',
        fecha: '2026-10-21',
        horario: '10:00',
        servicio: {
          duracion: 30,
        },
      },
    ]

    const resultado = estaDisponible({
      citas,
      fecha: '2026-10-21',
      horario: '10:30',
      duracion: 30,
    })

    expect(resultado).toBe(true)
  })

  it('rechaza una cita que se traslapa con otra', () => {
    const citas = [
      {
        id: 'cita-1',
        fecha: '2026-10-21',
        horario: '10:00',
        servicio: {
          duracion: 60,
        },
      },
    ]

    const resultado = estaDisponible({
      citas,
      fecha: '2026-10-21',
      horario: '10:30',
      duracion: 30,
    })

    expect(resultado).toBe(false)
  })

  it('ignora la cita que se está editando', () => {
    const citas = [
      {
        id: 'cita-1',
        fecha: '2026-10-21',
        horario: '10:00',
        servicio: {
          duracion: 60,
        },
      },
    ]

    const resultado = estaDisponible({
      citas,
      fecha: '2026-10-21',
      horario: '10:00',
      duracion: 60,
      citaIdIgnorada: 'cita-1',
    })

    expect(resultado).toBe(true)
  })
})

describe('VITIUM-03: horarios y duraciones manipuladas', () => {
  it('rechaza una duración negativa', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '10:00',
      duracion: -30,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza una duración igual a cero', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '10:00',
      duracion: 0,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza una duración decimal', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '10:00',
      duracion: 30.5,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza una duración infinita', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '10:00',
      duracion: Infinity,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza minutos fuera del rango válido', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '10:99',
      duracion: 30,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza horas fuera del rango válido', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '25:00',
      duracion: 30,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza horarios negativos', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '-1:30',
      duracion: 30,
    })

    expect(resultado).toBe(false)
  })

  it('rechaza citas anteriores a la hora de apertura', () => {
    const resultado = estaDisponible({
      citas: [],
      fecha: '2026-10-21',
      horario: '02:00',
      duracion: 30,
    })

    expect(resultado).toBe(false)
  })
})

describe('VITIUM-04: datos corruptos en la colección de citas', () => {
  it('no lanza una excepción si citas es null', () => {
    expect(() => {
      estaDisponible({
        citas: null,
        fecha: '2026-10-21',
        horario: '10:00',
        duracion: 30,
      })
    }).not.toThrow()
  })

  it('no lanza una excepción si citas no es un arreglo', () => {
    expect(() => {
      estaDisponible({
        citas: {},
        fecha: '2026-10-21',
        horario: '10:00',
        duracion: 30,
      })
    }).not.toThrow()
  })

  it('no lanza una excepción si una cita es null', () => {
    expect(() => {
      estaDisponible({
        citas: [null],
        fecha: '2026-10-21',
        horario: '10:00',
        duracion: 30,
      })
    }).not.toThrow()
  })

  it('no lanza una excepción si una cita no contiene servicio', () => {
    expect(() => {
      estaDisponible({
        citas: [
          {
            id: 'cita-corrupta-1',
            fecha: '2026-10-21',
            horario: '10:00',
          },
        ],
        fecha: '2026-10-21',
        horario: '11:00',
        duracion: 30,
      })
    }).not.toThrow()
  })

  it('no lanza una excepción si servicio es null', () => {
    expect(() => {
      estaDisponible({
        citas: [
          {
            id: 'cita-corrupta-2',
            fecha: '2026-10-21',
            horario: '10:00',
            servicio: null,
          },
        ],
        fecha: '2026-10-21',
        horario: '11:00',
        duracion: 30,
      })
    }).not.toThrow()
  })
})