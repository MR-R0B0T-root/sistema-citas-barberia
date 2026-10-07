import { useState } from "react";

function obtenerFechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function FormularioEdicionCita({
  cita,
  servicios,
  horarios,
  error,
  onCancelar,
  onGuardar,
}) {
  const [datosEdicion, setDatosEdicion] = useState({
    nombre: cita.cliente.nombre,
    correo: cita.cliente.correo,
    telefono: cita.cliente.telefono,
    servicioId: cita.servicio.id,
    fecha: cita.fecha,
    horario: cita.horario,
  });

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatosEdicion((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar(datosEdicion);
  }

  return (
    <section className="edicion" aria-labelledby="titulo-edicion">
      <div className="edicion__encabezado">
        <p className="edicion__etiqueta">Administración</p>

        <h2 id="titulo-edicion">Editar cita</h2>

        <p>Modifica la información de la reservación seleccionada.</p>
      </div>

      {error && (
        <p className="edicion__error" role="alert">
          {error}
        </p>
      )}

      <form className="edicion__formulario" onSubmit={manejarEnvio} noValidate>
        <div className="campo">
          <label htmlFor="edicion-nombre">Nombre completo</label>

          <input
            id="edicion-nombre"
            name="nombre"
            type="text"
            value={datosEdicion.nombre}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo">
          <label htmlFor="edicion-servicio">Servicio</label>

          <select
            id="edicion-servicio"
            name="servicioId"
            value={datosEdicion.servicioId}
            onChange={manejarCambio}
          >
            {servicios.map((servicio) => (
              <option value={servicio.id} key={servicio.id}>
                {servicio.nombre} · ${servicio.precio} · {servicio.duracion}{" "}
                minutos
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="edicion-correo">Correo electrónico</label>

          <input
            id="edicion-correo"
            name="correo"
            type="email"
            value={datosEdicion.correo}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo">
          <label htmlFor="edicion-telefono">Teléfono</label>

          <input
            id="edicion-telefono"
            name="telefono"
            type="tel"
            value={datosEdicion.telefono}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo">
          <label htmlFor="edicion-fecha">Fecha</label>

          <input
            id="edicion-fecha"
            name="fecha"
            type="date"
            min={obtenerFechaLocal()}
            value={datosEdicion.fecha}
            onChange={manejarCambio}
          />
        </div>

        <div className="campo">
          <label htmlFor="edicion-horario">Horario</label>

          <select
            id="edicion-horario"
            name="horario"
            value={datosEdicion.horario}
            onChange={manejarCambio}
          >
            {horarios.map((horario) => (
              <option value={horario} key={horario}>
                {horario}
              </option>
            ))}
          </select>
        </div>

        <div className="edicion__acciones">
          <button
            type="button"
            className="edicion__boton edicion__boton--secundario"
            onClick={onCancelar}
          >
            Cancelar edición
          </button>

          <button
            type="submit"
            className="edicion__boton edicion__boton--principal"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioEdicionCita;
