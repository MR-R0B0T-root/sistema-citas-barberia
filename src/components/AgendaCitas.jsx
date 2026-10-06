import { useState } from 'react'

function obtenerFechaLocal() {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function convertirFechaLocal(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number)

  return new Date(anio, mes - 1, dia)
}

function convertirFechaISO(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function obtenerInicioSemana(fecha) {
  const fechaLocal = convertirFechaLocal(fecha)
  const diaSemana = fechaLocal.getDay()
  const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana

  fechaLocal.setDate(fechaLocal.getDate() + diferencia)

  return fechaLocal
}

function obtenerFechasSemana(fecha) {
  const inicioSemana = obtenerInicioSemana(fecha)

  return Array.from({ length: 7 }, (_, indice) => {
    const fechaSemana = new Date(inicioSemana)
    fechaSemana.setDate(inicioSemana.getDate() + indice)

    return convertirFechaISO(fechaSemana)
  })
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(convertirFechaLocal(fecha))
}

function formatearPrecio(precio) {
  return precio.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  })
}

function ordenarCitas(citas) {
  return [...citas].sort((primeraCita, segundaCita) => {
    const primeraFecha = `${primeraCita.fecha}T${primeraCita.horario}`
    const segundaFecha = `${segundaCita.fecha}T${segundaCita.horario}`

    return primeraFecha.localeCompare(segundaFecha)
  })
}

function AgendaCitas({ citas }) {
  const [tipoVista, setTipoVista] = useState('dia')
  const [fechaConsulta, setFechaConsulta] = useState(obtenerFechaLocal)

  const fechasSemana = obtenerFechasSemana(fechaConsulta)

  const citasFiltradas = ordenarCitas(citas).filter((cita) => {
    if (tipoVista === 'dia') {
      return cita.fecha === fechaConsulta
    }

    return fechasSemana.includes(cita.fecha)
  })

  return (
    <section className="agenda" aria-labelledby="titulo-agenda">
      <div className="agenda__encabezado">
        <p className="agenda__etiqueta">Administración</p>
        <h2 id="titulo-agenda">Agenda de citas</h2>

        <p>
          Consulta las reservaciones registradas en este navegador por día o
          por semana.
        </p>
      </div>

      <div className="agenda__controles">
        <div
          className="agenda__vistas"
          aria-label="Tipo de vista de la agenda"
        >
          <button
            type="button"
            className={tipoVista === 'dia' ? 'agenda__boton--activo' : ''}
            aria-pressed={tipoVista === 'dia'}
            onClick={() => setTipoVista('dia')}
          >
            Vista diaria
          </button>

          <button
            type="button"
            className={tipoVista === 'semana' ? 'agenda__boton--activo' : ''}
            aria-pressed={tipoVista === 'semana'}
            onClick={() => setTipoVista('semana')}
          >
            Vista semanal
          </button>
        </div>

        <div className="agenda__fecha">
          <label htmlFor="fecha-agenda">Fecha de consulta</label>

          <input
            id="fecha-agenda"
            type="date"
            value={fechaConsulta}
            onChange={(evento) => setFechaConsulta(evento.target.value)}
          />
        </div>
      </div>

      <div className="agenda__periodo" aria-live="polite">
        {tipoVista === 'dia' ? (
          <p>{formatearFecha(fechaConsulta)}</p>
        ) : (
          <p>
            Del {formatearFecha(fechasSemana[0])} al{' '}
            {formatearFecha(fechasSemana[6])}
          </p>
        )}
      </div>

      {citasFiltradas.length === 0 ? (
        <div className="agenda__vacia" role="status">
          <h3>No hay citas registradas</h3>
          <p>
            No se encontraron reservaciones para el periodo seleccionado.
          </p>
        </div>
      ) : (
        <div className="agenda__lista">
          {citasFiltradas.map((cita) => (
            <article className="agenda__cita" key={cita.id}>
              <div className="agenda__cita-encabezado">
                <div>
                  <p className="agenda__cita-fecha">
                    {formatearFecha(cita.fecha)}
                  </p>
                  <h3>{cita.horario}</h3>
                </div>

                <span>{cita.servicio.nombre}</span>
              </div>

              <dl className="agenda__detalles">
                <div>
                  <dt>Cliente</dt>
                  <dd>{cita.cliente.nombre}</dd>
                </div>

                <div>
                  <dt>Teléfono</dt>
                  <dd>{cita.cliente.telefono}</dd>
                </div>

                <div>
                  <dt>Correo</dt>
                  <dd>{cita.cliente.correo}</dd>
                </div>

                <div>
                  <dt>Duración</dt>
                  <dd>{cita.servicio.duracion} minutos</dd>
                </div>

                <div>
                  <dt>Precio</dt>
                  <dd>{formatearPrecio(cita.servicio.precio)}</dd>
                </div>

                <div>
                  <dt>Folio</dt>
                  <dd>{cita.id}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AgendaCitas