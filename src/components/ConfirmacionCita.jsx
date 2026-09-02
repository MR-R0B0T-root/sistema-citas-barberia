function ConfirmacionCita({
  cita,
  estadoCorreo,
  onNuevaReserva,
}) {
  if (!cita) {
    return null
  }

  const precioFormateado = cita.servicio.precio.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  })

  return (
    <section
      className="confirmacion"
      aria-labelledby="titulo-confirmacion"
    >
      <div className="confirmacion__icono" aria-hidden="true">
        ✓
      </div>

      <div className="confirmacion__encabezado">
        <p className="confirmacion__etiqueta">
          Reservación completada
        </p>

        <h2 id="titulo-confirmacion">Tu cita fue registrada</h2>

        <p>
          Conserva los siguientes datos como referencia de tu reservación.
        </p>
      </div>

      <dl className="confirmacion__resumen">
        <div>
          <dt>Cliente</dt>
          <dd>{cita.cliente.nombre}</dd>
        </div>

        <div>
          <dt>Servicio</dt>
          <dd>{cita.servicio.nombre}</dd>
        </div>

        <div>
          <dt>Precio</dt>
          <dd>{precioFormateado}</dd>
        </div>

        <div>
          <dt>Duración</dt>
          <dd>{cita.servicio.duracion} minutos</dd>
        </div>

        <div>
          <dt>Fecha</dt>
          <dd>{cita.fecha}</dd>
        </div>

        <div>
          <dt>Horario</dt>
          <dd>{cita.horario}</dd>
        </div>

        <div>
          <dt>Correo</dt>
          <dd>{cita.cliente.correo}</dd>
        </div>

        <div>
          <dt>Folio</dt>
          <dd>{cita.id}</dd>
        </div>
      </dl>

      <div
        className={`confirmacion__correo confirmacion__correo--${estadoCorreo}`}
        role={estadoCorreo === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {estadoCorreo === 'enviando' && (
          <p>Enviando el correo de confirmación...</p>
        )}

        {estadoCorreo === 'enviado' && (
          <p>
            El correo de confirmación fue enviado correctamente a{' '}
            <strong>{cita.cliente.correo}</strong>.
          </p>
        )}

        {estadoCorreo === 'error' && (
          <p>
            No fue posible enviar el correo de confirmación, pero la cita quedó
            registrada correctamente. Conserva el folio mostrado en esta
            pantalla.
          </p>
        )}

        {estadoCorreo === 'inactivo' && (
          <p>La cita fue registrada correctamente.</p>
        )}
      </div>

      <button
        className="confirmacion__boton"
        type="button"
        onClick={onNuevaReserva}
        disabled={estadoCorreo === 'enviando'}
      >
        {estadoCorreo === 'enviando'
          ? 'Enviando confirmación...'
          : 'Realizar otra reservación'}
      </button>
    </section>
  )
}

export default ConfirmacionCita