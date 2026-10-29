import { useState } from "react";
import {
  obtenerClientesUnicos,
  obtenerHistorialCliente,
} from "../utils/historialClientes";

function convertirFechaLocal(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);

  return new Date(anio, mes - 1, dia);
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(convertirFechaLocal(fecha));
}

function HistorialClientes({ citas }) {
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState("");

  const clientes = obtenerClientesUnicos(citas);

  const clienteSeleccionado =
    clientes.find((cliente) => cliente.id === clienteSeleccionadoId) ?? null;

  const historial = obtenerHistorialCliente(citas, clienteSeleccionadoId);

  if (clientes.length === 0) {
    return (
      <section className="historial" aria-labelledby="titulo-historial">
        <div className="historial__encabezado">
          <p className="historial__etiqueta">Administración</p>
          <h2 id="titulo-historial">Historial de clientes</h2>
          <p>
            Consulta los servicios recibidos anteriormente por cada cliente.
          </p>
        </div>

        <div className="historial__vacio" role="status">
          <h3>No hay clientes registrados</h3>
          <p>El historial estará disponible cuando se registre una cita.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="historial" aria-labelledby="titulo-historial">
      <div className="historial__encabezado">
        <p className="historial__etiqueta">Administración</p>
        <h2 id="titulo-historial">Historial de clientes</h2>
        <p>
          Selecciona un cliente para consultar sus citas desde la más reciente.
        </p>
      </div>

      <div className="historial__resumen-general" aria-live="polite">
        <p>
          {clientes.length} clientes únicos · {citas.length} citas registradas
        </p>
      </div>

      <div className="historial__selector">
        <label htmlFor="cliente-historial">Cliente registrado</label>

        <select
          id="cliente-historial"
          value={clienteSeleccionadoId}
          onChange={(evento) => setClienteSeleccionadoId(evento.target.value)}
        >
          <option value="">Selecciona un cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} · {cliente.telefono} · {cliente.correo}
            </option>
          ))}
        </select>
      </div>

      {!clienteSeleccionado ? (
        <div className="historial__vacio" role="status">
          <h3>Selecciona un cliente</h3>
          <p>
            El teléfono y el correo permiten distinguir clientes con datos
            similares.{" "}
          </p>
        </div>
      ) : (
        <>
          <div className="historial__cliente" aria-live="polite">
            <div>
              <span>Cliente</span>
              <strong>{clienteSeleccionado.nombre}</strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>{clienteSeleccionado.telefono}</strong>
            </div>

            <div>
              <span>Correo</span>
              <strong>{clienteSeleccionado.correo}</strong>
            </div>

            <div>
              <span>Citas registradas</span>
              <strong>{historial.length}</strong>
            </div>
          </div>

          <div className="historial__lista">
            {historial.map((cita) => (
              <article className="historial__cita" key={cita.id}>
                <div className="historial__cita-encabezado">
                  <div>
                    <p>{formatearFecha(cita.fecha)}</p>
                    <h3>{cita.horario}</h3>
                  </div>

                  <span
                    className={`historial__estado historial__estado--${cita.estado.toLowerCase()}`}
                  >
                    {cita.estado}
                  </span>
                </div>

                <dl className="historial__detalles">
                  <div>
                    <dt>Servicio</dt>
                    <dd>{cita.servicio.nombre}</dd>
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
                    <dt>Folio</dt>
                    <dd>{cita.id}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HistorialClientes;
