import { useState } from "react";
import { estaDisponible } from "./utils/disponibilidadCitas";
import AgendaCitas from "./components/AgendaCitas";
import CatalogoServicios from "./components/CatalogoServicios";
import ConfirmacionCita from "./components/ConfirmacionCita";
import FormularioCita from "./components/FormularioCita";
import FormularioEdicionCita from "./components/FormularioEdicionCita";
import SelectorHorario from "./components/SelectorHorario";
import { generarHorarios } from "./data/horarios";
import { servicios } from "./data/servicios";
import { enviarConfirmacionCita } from "./services/emailService";
import { generarFolio } from "./utils/generarFolio";
import "./App.css";

const horarios = generarHorarios();
const CLAVE_CITAS = "barberia-citas";

const PATRON_NOMBRE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]{1,79}$/u;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_TELEFONO = /^\d{10,15}$/;

function obtenerFechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function obtenerCitasGuardadas() {
  try {
    const citasGuardadas = localStorage.getItem(CLAVE_CITAS);

    if (!citasGuardadas) {
      return [];
    }

    const citasConvertidas = JSON.parse(citasGuardadas);

    return Array.isArray(citasConvertidas) ? citasConvertidas : [];
  } catch {
    return [];
  }
}

function App() {
  const [vistaActiva, setVistaActiva] = useState("reserva");
  const [citaEnEdicion, setCitaEnEdicion] = useState(null);
  const [citaPorCancelar, setCitaPorCancelar] = useState(null);
  const [errorEdicion, setErrorEdicion] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [citas, setCitas] = useState(obtenerCitasGuardadas);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState("");
  const [ultimaCita, setUltimaCita] = useState(null);
  const [estadoCorreo, setEstadoCorreo] = useState("inactivo");

  const servicioElegido =
    servicios.find((servicio) => servicio.id === servicioSeleccionado) ?? null;

  function enviarCorreoConfirmacion(cita) {
    setEstadoCorreo("enviando");

    enviarConfirmacionCita(cita)
      .then(() => {
        setEstadoCorreo("enviado");
      })
      .catch((error) => {
        console.error("No se pudo enviar el correo de confirmación:", error);

        setEstadoCorreo("error");
      });
  }

  function registrarCita(nuevaCita) {
    const citasGuardadas = obtenerCitasGuardadas();

    const horarioDisponible = estaDisponible({
      citas: citasGuardadas,
      fecha: nuevaCita.fecha,
      horario: nuevaCita.horario,
      duracion: nuevaCita.servicio.duracion,
    });

    if (!horarioDisponible) {
      setErrorDisponibilidad(
        "El horario seleccionado no está disponible para la duración del servicio. Elige otro horario.",
      );

      setCitas(citasGuardadas);
      setHorarioSeleccionado("");

      return false;
    }

    const citaCompleta = {
      ...nuevaCita,
      id: generarFolio(),
      fechaRegistro: new Date().toISOString(),
    };

    const citasActualizadas = [...citasGuardadas, citaCompleta];

    localStorage.setItem(CLAVE_CITAS, JSON.stringify(citasActualizadas));

    setCitas(citasActualizadas);
    setUltimaCita(citaCompleta);
    setErrorDisponibilidad("");

    setServicioSeleccionado(null);
    setFechaSeleccionada("");
    setHorarioSeleccionado("");

    enviarCorreoConfirmacion(citaCompleta);

    return true;
  }

  function iniciarNuevaReserva() {
    setUltimaCita(null);
    setEstadoCorreo("inactivo");
    setErrorDisponibilidad("");
    setServicioSeleccionado(null);
    setFechaSeleccionada("");
    setHorarioSeleccionado("");
  }

  function iniciarEdicionCita(cita) {
    setCitaEnEdicion(cita);
    setCitaPorCancelar(null);
    setErrorEdicion("");
  }

  function solicitarCancelacionCita(cita) {
  setCitaPorCancelar(cita);
  setCitaEnEdicion(null);
  setErrorEdicion("");
  }

  function confirmarCancelacionCita() {
  if (!citaPorCancelar) {
    return false;
  }

  const citasGuardadas = obtenerCitasGuardadas();

  const citasActualizadas = citasGuardadas.filter(
    (cita) => cita.id !== citaPorCancelar.id,
  );

  try {
    localStorage.setItem(
      CLAVE_CITAS,
      JSON.stringify(citasActualizadas),
    );
  } catch {
    return false;
  }

  setCitas(citasActualizadas);
  setCitaPorCancelar(null);

  if (citaEnEdicion?.id === citaPorCancelar.id) {
    setCitaEnEdicion(null);
    setErrorEdicion("");
  }

  return true;
  }

  function actualizarCita(datosEdicion) {
    if (!citaEnEdicion) {
      return false;
    }

    const nombreNormalizado = datosEdicion.nombre.trim().replace(/\s+/g, " ");
    const correoNormalizado = datosEdicion.correo.trim().toLowerCase();
    const telefonoNormalizado = datosEdicion.telefono.replace(/\D/g, "");

    if (
      !nombreNormalizado ||
      !correoNormalizado ||
      !telefonoNormalizado ||
      !datosEdicion.servicioId ||
      !datosEdicion.fecha ||
      !datosEdicion.horario
    ) {
      setErrorEdicion(
        "Completa todos los campos antes de guardar los cambios.",
      );
      return false;
    }

    if (!PATRON_NOMBRE.test(nombreNormalizado)) {
      setErrorEdicion(
        "El nombre debe tener de 2 a 80 caracteres y contener únicamente letras, espacios, apóstrofes o guiones.",
      );
      return false;
    }

    if (
      correoNormalizado.length > 254 ||
      !PATRON_CORREO.test(correoNormalizado)
    ) {
      setErrorEdicion("Ingresa un correo electrónico válido.");
      return false;
    }

    if (!PATRON_TELEFONO.test(telefonoNormalizado)) {
      setErrorEdicion("Ingresa un teléfono de 10 a 15 dígitos.");
      return false;
    }

    if (datosEdicion.fecha < obtenerFechaLocal()) {
      setErrorEdicion(
        "La fecha de la cita no puede ser anterior al día actual.",
      );
      return false;
    }

    const servicioActualizado = servicios.find(
      (servicio) => servicio.id === datosEdicion.servicioId,
    );

    if (!servicioActualizado) {
      setErrorEdicion("El servicio seleccionado no es válido.");
      return false;
    }

    const citasGuardadas = obtenerCitasGuardadas();

    const horarioDisponible = estaDisponible({
      citas: citasGuardadas,
      fecha: datosEdicion.fecha,
      horario: datosEdicion.horario,
      duracion: servicioActualizado.duracion,
      citaIdIgnorada: citaEnEdicion.id,
    });

    if (!horarioDisponible) {
      setErrorEdicion(
        "El horario seleccionado no está disponible para la duración del servicio.",
      );
      return false;
    }

    const citaActualizada = {
      ...citaEnEdicion,
      cliente: {
        nombre: nombreNormalizado,
        correo: correoNormalizado,
        telefono: telefonoNormalizado,
      },
      servicio: servicioActualizado,
      fecha: datosEdicion.fecha,
      horario: datosEdicion.horario,
      fechaActualizacion: new Date().toISOString(),
    };

    const citasActualizadas = citasGuardadas.map((cita) =>
      cita.id === citaEnEdicion.id ? citaActualizada : cita,
    );

    try {
      localStorage.setItem(CLAVE_CITAS, JSON.stringify(citasActualizadas));
    } catch {
      setErrorEdicion("No fue posible guardar los cambios en este navegador.");
      return false;
    }

    setCitas(citasActualizadas);
    setCitaEnEdicion(null);
    setErrorEdicion("");

    return true;
  }

  return (
    <main className="app">
      <header>
        <p className="app__etiqueta">Reserva en línea</p>

        <h1>Sistema Web de Gestión de Citas</h1>

        <p>
          Consulta nuestros servicios y comienza la reservación de tu próxima
          cita.
        </p>
      </header>

      <nav className="app__navegacion" aria-label="Navegación principal">
        <button
          type="button"
          className={
            vistaActiva === "reserva"
              ? "app__navegacion-boton app__navegacion-boton--activo"
              : "app__navegacion-boton"
          }
          aria-pressed={vistaActiva === "reserva"}
          onClick={() => setVistaActiva("reserva")}
        >
          Reservar cita
        </button>

        <button
          type="button"
          className={
            vistaActiva === "agenda"
              ? "app__navegacion-boton app__navegacion-boton--activo"
              : "app__navegacion-boton"
          }
          aria-pressed={vistaActiva === "agenda"}
          onClick={() => setVistaActiva("agenda")}
        >
          Administrar agenda
        </button>
      </nav>

      {vistaActiva === "agenda" ? (
        <>
          <AgendaCitas
            citas={citas}
            citaEnEdicion={citaEnEdicion}
            onEditarCita={iniciarEdicionCita}
            onSolicitarCancelacion={solicitarCancelacionCita}
          />

          {citaPorCancelar && (
            <section
              className="cancelacion"
              aria-labelledby="titulo-cancelacion"
            >
              <div className="cancelacion__encabezado">
                <p className="cancelacion__etiqueta">Confirmación requerida</p>

                <h2 id="titulo-cancelacion">Cancelar cita</h2>

                <p>
                  Esta acción eliminará la reservación y liberará el horario.
                </p>
              </div>

              <dl className="cancelacion__resumen">
                <div>
                  <dt>Cliente</dt>
                  <dd>{citaPorCancelar.cliente.nombre}</dd>
                </div>

                <div>
                  <dt>Servicio</dt>
                  <dd>{citaPorCancelar.servicio.nombre}</dd>
                </div>

                <div>
                  <dt>Fecha</dt>
                  <dd>{citaPorCancelar.fecha}</dd>
                </div>

                <div>
                  <dt>Horario</dt>
                  <dd>{citaPorCancelar.horario}</dd>
                </div>

                <div>
                  <dt>Folio</dt>
                  <dd>{citaPorCancelar.id}</dd>
                </div>
              </dl>

              <div className="cancelacion__acciones">
                <button
                  type="button"
                  className="cancelacion__boton cancelacion__boton--secundario"
                  onClick={() => setCitaPorCancelar(null)}
                >
                  Conservar cita
                </button>

                <button
                  type="button"
                  className="cancelacion__boton cancelacion__boton--peligro"
                  onClick={confirmarCancelacionCita}
                >
                  Confirmar cancelación
                </button>
              </div>
            </section>
          )}

          {citaEnEdicion && (
            <FormularioEdicionCita
              key={citaEnEdicion.id}
              cita={citaEnEdicion}
              servicios={servicios}
              horarios={horarios}
              error={errorEdicion}
              onCancelar={() => {
                setCitaEnEdicion(null);
                setErrorEdicion("");
              }}
              onGuardar={actualizarCita}
            />
          )}
        </>
      ) : ultimaCita ? (
        <ConfirmacionCita
          cita={ultimaCita}
          estadoCorreo={estadoCorreo}
          onNuevaReserva={iniciarNuevaReserva}
        />
      ) : (
        <>
          <CatalogoServicios
            servicios={servicios}
            servicioSeleccionado={servicioSeleccionado}
            onSeleccionarServicio={setServicioSeleccionado}
          />

          <SelectorHorario
            horarios={horarios}
            citas={citas}
            servicio={servicioElegido}
            fechaSeleccionada={fechaSeleccionada}
            horarioSeleccionado={horarioSeleccionado}
            onSeleccionarFecha={setFechaSeleccionada}
            onSeleccionarHorario={setHorarioSeleccionado}
          />

          {errorDisponibilidad && (
            <p className="app__error-disponibilidad" role="alert">
              {errorDisponibilidad}
            </p>
          )}

          <FormularioCita
            servicio={servicioElegido}
            fechaSeleccionada={fechaSeleccionada}
            horarioSeleccionado={horarioSeleccionado}
            onRegistrarCita={registrarCita}
          />
        </>
      )}

      <p className="app__contador">
        Citas registradas en este navegador: {citas.length}
      </p>
    </main>
  );
}

export default App;
