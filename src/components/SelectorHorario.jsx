import { useState } from 'react'

function obtenerFechaLocal() {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function SelectorHorario({
  horarios,
  citas,
  fechaSeleccionada,
  horarioSeleccionado,
  onSeleccionarFecha,
  onSeleccionarHorario,
}) {
  const fechaMinima = obtenerFechaLocal()
  const [errorFecha, setErrorFecha] = useState('')
  const horariosOcupados = citas
  .filter((cita) => cita.fecha === fechaSeleccionada)
  .map((cita) => cita.horario)

  function manejarCambioFecha(evento) {
    const nuevaFecha = evento.target.value

    onSeleccionarHorario('')

    if (nuevaFecha && nuevaFecha < fechaMinima) {
      onSeleccionarFecha('')
      setErrorFecha('La fecha de la cita no puede ser anterior al día actual.')
      return
    }

    onSeleccionarFecha(nuevaFecha)
    setErrorFecha('')
  }

  return (
    <section className="horarios" aria-labelledby="titulo-horarios">
      <div className="horarios__encabezado">
        <p className="horarios__etiqueta">Paso 2</p>
        <h2 id="titulo-horarios">Selecciona una fecha y horario</h2>

        <p>
          Elige el día de tu visita y consulta los bloques de atención
          disponibles.
        </p>
      </div>

      <div className="horarios__fecha">
        <label htmlFor="fecha-cita">Fecha de la cita</label>

        <input
          id="fecha-cita"
          name="fecha"
          type="date"
          min={fechaMinima}
          value={fechaSeleccionada}
          onChange={manejarCambioFecha}
          aria-describedby={errorFecha ? 'error-fecha' : undefined}
          aria-invalid={Boolean(errorFecha)}
        />

        {errorFecha && (
          <p className="horarios__error" id="error-fecha" role="alert">
            {errorFecha}
          </p>
        )}
      </div>

      {fechaSeleccionada ? (
        <div className="horarios__bloques">
          <p id="instruccion-horarios">Horarios disponibles</p>

          <div
            className="horarios__lista"
            aria-labelledby="instruccion-horarios"
          >
            {horarios.map((horario) => {
              const estaSeleccionado = horarioSeleccionado === horario
              const estaOcupado = horariosOcupados.includes(horario)

              return (
                <button
                  type="button"
                  className={`horario ${
                    estaSeleccionado ? 'horario--seleccionado' : ''
                  } ${estaOcupado ? 'horario--ocupado' : ''}
                  }`}
                  aria-pressed={estaSeleccionado}
                  disabled={estaOcupado}
                  onClick={() => onSeleccionarHorario(horario)}
                  key={horario}
                >
                  {estaOcupado ? `${horario} · Ocupado` : horario}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="horarios__mensaje">
          Selecciona una fecha para consultar los horarios.
        </p>
      )}
    </section>
  )
}

export default SelectorHorario
