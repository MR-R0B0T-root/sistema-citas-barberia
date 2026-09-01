function CatalogoServicios({
  servicios,
  servicioSeleccionado,
  onSeleccionarServicio,
}) {
  return (
    <section className="catalogo" aria-labelledby="titulo-catalogo">
      <div className="catalogo__encabezado">
        <p className="catalogo__etiqueta">Paso 1</p>
        <h2 id="titulo-catalogo">Elige un servicio</h2>
        <p>Consulta el precio y la duración antes de reservar tu cita.</p>
      </div>

      <div className="catalogo__lista">
        {servicios.map((servicio) => {
          const estaSeleccionado = servicioSeleccionado === servicio.id

          return (
            <article
              className={`servicio ${
                estaSeleccionado ? 'servicio--seleccionado' : ''
              }`}
              key={servicio.id}
            >
              <div className="servicio__contenido">
                <h3>{servicio.nombre}</h3>
                <p>{servicio.descripcion}</p>
              </div>

              <dl className="servicio__detalles">
                <div>
                  <dt>Precio</dt>
                  <dd>
                    {servicio.precio.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                      maximumFractionDigits: 0,
                    })}
                  </dd>
                </div>

                <div>
                  <dt>Duración</dt>
                  <dd>{servicio.duracion} min</dd>
                </div>
              </dl>

              <button
                type="button"
                className="servicio__boton"
                aria-pressed={estaSeleccionado}
                onClick={() => onSeleccionarServicio(servicio.id)}
              >
                {estaSeleccionado ? 'Servicio seleccionado' : 'Seleccionar'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CatalogoServicios