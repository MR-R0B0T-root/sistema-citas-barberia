import { useState } from 'react'

const datosIniciales = {
  nombre: '',
  correo: '',
  telefono: '',
}

const PATRON_NOMBRE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]{1,79}$/u
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PATRON_TELEFONO = /^\d{10,15}$/

function FormularioCita({
  servicio,
  fechaSeleccionada,
  horarioSeleccionado,
  onRegistrarCita,
}) {
  const [datosCliente, setDatosCliente] = useState(datosIniciales)
  const [errores, setErrores] = useState({})

  const reservacionCompleta = Boolean(
    servicio && fechaSeleccionada && horarioSeleccionado,
  )

  function manejarCambio(evento) {
    const nombreDelCampo = evento.target.name
    const valorDelCampo = evento.target.value

    setDatosCliente((datosActuales) => {
      const datosActualizados = { ...datosActuales }
      datosActualizados[nombreDelCampo] = valorDelCampo

      return datosActualizados
    })

    setErrores((erroresActuales) => {
      const erroresActualizados = { ...erroresActuales }
      erroresActualizados[nombreDelCampo] = ''

      return erroresActualizados
    })
  }

  function validarFormulario() {
    const nuevosErrores = {}

    const nombreNormalizado = datosCliente.nombre
      .trim()
      .replace(/\s+/g, ' ')

    const correoNormalizado = datosCliente.correo.trim().toLowerCase()

    const telefonoNormalizado = datosCliente.telefono.replace(/\D/g, '')

    if (!nombreNormalizado) {
      nuevosErrores.nombre = 'Ingresa el nombre del cliente.'
    } else if (!PATRON_NOMBRE.test(nombreNormalizado)) {
      nuevosErrores.nombre =
        'Usa de 2 a 80 caracteres: letras, espacios, apóstrofes o guiones.'
    }

    if (!correoNormalizado) {
      nuevosErrores.correo = 'Ingresa un correo electrónico.'
    } else if (
      correoNormalizado.length > 254 ||
      !PATRON_CORREO.test(correoNormalizado)
    ) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.'
    }

    if (!telefonoNormalizado) {
      nuevosErrores.telefono = 'Ingresa un número telefónico.'
    } else if (!PATRON_TELEFONO.test(telefonoNormalizado)) {
      nuevosErrores.telefono = 'Ingresa un teléfono de 10 a 15 dígitos.'
    }

    return nuevosErrores
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const nuevosErrores = validarFormulario()
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0 || !reservacionCompleta) {
      return
    }

    onRegistrarCita({
      cliente: {
        nombre: datosCliente.nombre.trim().replace(/\s+/g, ' '),
        correo: datosCliente.correo.trim().toLowerCase(),
        telefono: datosCliente.telefono.replace(/\D/g, ''),
      },
      servicio,
      fecha: fechaSeleccionada,
      horario: horarioSeleccionado,
    })

    setDatosCliente(datosIniciales)
    setErrores({})
  }

  return (
    <section className="registro" aria-labelledby="titulo-registro">
      <div className="registro__encabezado">
        <p className="registro__etiqueta">Paso 3</p>
        <h2 id="titulo-registro">Registra tus datos</h2>
        <p>Completa la información necesaria para registrar la cita.</p>
      </div>

      {!reservacionCompleta && (
        <p className="registro__aviso" role="status">
          Selecciona un servicio, una fecha y un horario antes de registrar tus
          datos.
        </p>
      )}

      {reservacionCompleta && (
        <div className="registro__resumen" aria-label="Resumen de reservación">
          <h3>Resumen de la cita</h3>

          <dl>
            <div>
              <dt>Servicio</dt>
              <dd>{servicio.nombre}</dd>
            </div>

            <div>
              <dt>Fecha</dt>
              <dd>{fechaSeleccionada}</dd>
            </div>

            <div>
              <dt>Horario</dt>
              <dd>{horarioSeleccionado}</dd>
            </div>
          </dl>
        </div>
      )}

      <form className="registro__formulario" onSubmit={manejarEnvio} noValidate>
        <div className="campo">
          <label htmlFor="nombre">Nombre completo</label>

          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            value={datosCliente.nombre}
            onChange={manejarCambio}
            aria-describedby={errores.nombre ? 'error-nombre' : undefined}
            aria-invalid={Boolean(errores.nombre)}
            disabled={!reservacionCompleta}
          />

          {errores.nombre && (
            <p className="campo__error" id="error-nombre" role="alert">
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo electrónico</label>

          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={datosCliente.correo}
            onChange={manejarCambio}
            aria-describedby={errores.correo ? 'error-correo' : undefined}
            aria-invalid={Boolean(errores.correo)}
            disabled={!reservacionCompleta}
          />

          {errores.correo && (
            <p className="campo__error" id="error-correo" role="alert">
              {errores.correo}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="telefono">Teléfono</label>

          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            minLength={10}
            maxLength={20}
            value={datosCliente.telefono}
            onChange={manejarCambio}
            aria-describedby={errores.telefono ? 'error-telefono' : undefined}
            aria-invalid={Boolean(errores.telefono)}
            disabled={!reservacionCompleta}
          />

          {errores.telefono && (
            <p className="campo__error" id="error-telefono" role="alert">
              {errores.telefono}
            </p>
          )}
        </div>

        <button
          className="registro__boton"
          type="submit"
          disabled={!reservacionCompleta}
        >
          Registrar cita
        </button>
      </form>
    </section>
  )
}

export default FormularioCita