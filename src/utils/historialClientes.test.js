import { describe, expect, it } from "vitest";
import {
  normalizarTelefono,
  obtenerClientesUnicos,
  obtenerEstadoCita,
  obtenerHistorialCliente,
} from "./historialClientes";

const citas = [
  {
    id: "BAR-001",
    cliente: {
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      telefono: "55 1234 5678",
    },
    servicio: {
      id: "corte-clasico",
      nombre: "Corte clásico",
      precio: 180,
      duracion: 45,
    },
    fecha: "2026-10-20",
    horario: "10:00",
  },
  {
    id: "BAR-002",
    cliente: {
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      telefono: "5512345678",
    },
    servicio: {
      id: "arreglo-barba",
      nombre: "Arreglo de barba",
      precio: 140,
      duracion: 30,
    },
    fecha: "2026-11-05",
    horario: "12:00",
  },
  {
    id: "BAR-003",
    cliente: {
      nombre: "Juan Pérez",
      correo: "otro-juan@example.com",
      telefono: "5587654321",
    },
    servicio: {
      id: "corte-barba",
      nombre: "Corte y barba",
      precio: 280,
      duracion: 120,
    },
    fecha: "2026-10-25",
    horario: "14:00",
  },
];

describe("normalizarTelefono", () => {
  it("elimina caracteres que no son dígitos", () => {
    expect(normalizarTelefono("(55) 1234-5678")).toBe("5512345678");
  });

  it("devuelve texto vacío cuando el teléfono no existe", () => {
    expect(normalizarTelefono(null)).toBe("");
  });
});

describe("obtenerClientesUnicos", () => {
  it("agrupa citas del mismo teléfono aunque tengan otro formato", () => {
    const clientes = obtenerClientesUnicos(citas);

    expect(clientes).toHaveLength(2);
    expect(clientes.map((cliente) => cliente.telefono)).toContain("5512345678");
  });

  it("no mezcla clientes con el mismo nombre y teléfonos diferentes", () => {
    const clientes = obtenerClientesUnicos(citas);

    expect(clientes).toHaveLength(2);
    expect(clientes.every((cliente) => cliente.nombre === "Juan Pérez")).toBe(
      true,
    );
  });

  it("devuelve un arreglo vacío cuando las citas no son válidas", () => {
    expect(obtenerClientesUnicos(null)).toEqual([]);
  });

  it("separa clientes que comparten teléfono pero tienen correos distintos", () => {
    const citasConTelefonoCompartido = [
      citas[0],
      {
        ...citas[0],
        id: "BAR-004",
        cliente: {
          nombre: "Máximo Décimo",
          correo: "maximo@example.com",
          telefono: "55 1234 5678",
        },
      },
    ];

    const clientes = obtenerClientesUnicos(citasConTelefonoCompartido);

    expect(clientes).toHaveLength(2);
    expect(clientes.map((cliente) => cliente.nombre)).toContain("Juan Pérez");
    expect(clientes.map((cliente) => cliente.nombre)).toContain(
      "Máximo Décimo",
    );
  });
});

describe("obtenerEstadoCita", () => {
  const fechaReferencia = new Date("2026-10-28T16:00:00");

  it("marca como atendida una cita anterior", () => {
    expect(obtenerEstadoCita(citas[0], fechaReferencia)).toBe("Atendida");
  });

  it("marca como programada una cita posterior", () => {
    expect(obtenerEstadoCita(citas[1], fechaReferencia)).toBe("Programada");
  });
});

describe("obtenerHistorialCliente", () => {
  const fechaReferencia = new Date("2026-10-28T16:00:00");

  const clientePrincipal = obtenerClientesUnicos(citas).find(
    (cliente) => cliente.correo === "juan@example.com",
  );

  it("obtiene únicamente las citas del cliente seleccionado", () => {
    const historial = obtenerHistorialCliente(
      citas,
      clientePrincipal.id,
      fechaReferencia,
    );

    expect(historial).toHaveLength(2);

    expect(
      historial.every(
        (cita) =>
          normalizarTelefono(cita.cliente.telefono) === "5512345678" &&
          cita.cliente.correo === "juan@example.com",
      ),
    ).toBe(true);
  });

  it("ordena el historial desde la cita más reciente", () => {
    const historial = obtenerHistorialCliente(
      citas,
      clientePrincipal.id,
      fechaReferencia,
    );

    expect(historial.map((cita) => cita.id)).toEqual(["BAR-002", "BAR-001"]);
  });

  it("agrega el estado calculado a cada cita", () => {
    const historial = obtenerHistorialCliente(
      citas,
      clientePrincipal.id,
      fechaReferencia,
    );

    expect(historial[0].estado).toBe("Programada");
    expect(historial[1].estado).toBe("Atendida");
  });

  it("devuelve un arreglo vacío sin cliente seleccionado", () => {
    expect(obtenerHistorialCliente(citas, "", fechaReferencia)).toEqual([]);
  });
});
