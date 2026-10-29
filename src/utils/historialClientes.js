export function normalizarTelefono(telefono) {
  return String(telefono ?? "").replace(/\D/g, "");
}

function normalizarCorreo(correo) {
  return String(correo ?? "").trim().toLowerCase();
}

function obtenerIdentificadorCliente(cliente) {
  const telefono = normalizarTelefono(cliente?.telefono);
  const correo = normalizarCorreo(cliente?.correo);

  if (!telefono || !correo) {
    return "";
  }

  return `${telefono}::${correo}`;
}

function obtenerMomentoCita(cita) {
  return new Date(`${cita.fecha}T${cita.horario}:00`);
}

export function obtenerEstadoCita(cita, fechaReferencia = new Date()) {
  const momentoCita = obtenerMomentoCita(cita);

  return momentoCita < fechaReferencia ? "Atendida" : "Programada";
}

export function obtenerClientesUnicos(citas) {
  if (!Array.isArray(citas)) {
    return [];
  }

  const clientesPorIdentificador = new Map();

  citas.forEach((cita) => {
    const id = obtenerIdentificadorCliente(cita?.cliente);

    if (!id) {
      return;
    }

    clientesPorIdentificador.set(id, {
      id,
      nombre: cita.cliente.nombre,
      telefono: normalizarTelefono(cita.cliente.telefono),
      correo: normalizarCorreo(cita.cliente.correo),
    });
  });

  return [...clientesPorIdentificador.values()].sort(
    (primerCliente, segundoCliente) =>
      primerCliente.nombre.localeCompare(segundoCliente.nombre, "es-MX", {
        sensitivity: "base",
      }),
  );
}

export function obtenerHistorialCliente(
  citas,
  clienteSeleccionado,
  fechaReferencia = new Date(),
) {
  if (!Array.isArray(citas) || !clienteSeleccionado) {
    return [];
  }

  return citas
    .filter(
      (cita) =>
        obtenerIdentificadorCliente(cita?.cliente) === clienteSeleccionado,
    )
    .sort((primeraCita, segundaCita) => {
      const primerMomento = `${primeraCita.fecha}T${primeraCita.horario}`;
      const segundoMomento = `${segundaCita.fecha}T${segundaCita.horario}`;

      return segundoMomento.localeCompare(primerMomento);
    })
    .map((cita) => ({
      ...cita,
      estado: obtenerEstadoCita(cita, fechaReferencia),
    }));
}
