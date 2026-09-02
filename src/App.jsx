import { useState } from 'react'
import CatalogoServicios from './components/CatalogoServicios'
import ConfirmacionCita from './components/ConfirmacionCita'
import FormularioCita from './components/FormularioCita'
import SelectorHorario from './components/SelectorHorario'
import { generarHorarios } from './data/horarios'
import { servicios } from './data/servicios'
import { enviarConfirmacionCita } from './services/emailService'
import './App.css'

const horarios = generarHorarios()
const CLAVE_CITAS = 'barberia-citas'

function obtenerCitasGuardadas() {
  try {
    const citasGuardadas = localStorage.getItem(CLAVE_CITAS)

    if (!citasGuardadas) {
      return []
    }

    const citasConvertidas = JSON.parse(citasGuardadas)

    return Array.isArray(citasConvertidas) ? citasConvertidas : []
  } catch {
    return []
  }
}

function App() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('')
  const [citas, setCitas] = useState(obtenerCitasGuardadas)
  const [errorDisponibilidad, setErrorDisponibilidad] = useState('')
  const [ultimaCita, setUltimaCita] = useState(null)
  const [estadoCorreo, setEstadoCorreo] = useState('inactivo')

  const servicioElegido =
    servicios.find(
      (servicio) => servicio.id === servicioSeleccionado,
    ) ?? null

  function enviarCorreoConfirmacion(cita) {
    setEstadoCorreo('enviando')

    enviarConfirmacionCita(cita)
      .then(() => {
        setEstadoCorreo('enviado')
      })
      .catch((error) => {
        console.error(
          'No se pudo enviar el correo de confirmación:',
          error,
        )

        setEstadoCorreo('error')
      })
  }

  function registrarCita(nuevaCita) {
    const citasGuardadas = obtenerCitasGuardadas()

    const horarioOcupado = citasGuardadas.some(
      (cita) =>
        cita.fecha === nuevaCita.fecha &&
        cita.horario === nuevaCita.horario,
    )

    if (horarioOcupado) {
      setErrorDisponibilidad(
        'El horario seleccionado acaba de ser ocupado. Elige otro horario.',
      )

      setCitas(citasGuardadas)
      setHorarioSeleccionado('')

      return false
    }

    const citaCompleta = {
      ...nuevaCita,
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
    }

    const citasActualizadas = [...citasGuardadas, citaCompleta]

    localStorage.setItem(
      CLAVE_CITAS,
      JSON.stringify(citasActualizadas),
    )

    setCitas(citasActualizadas)
    setUltimaCita(citaCompleta)
    setErrorDisponibilidad('')

    setServicioSeleccionado(null)
    setFechaSeleccionada('')
    setHorarioSeleccionado('')

    enviarCorreoConfirmacion(citaCompleta)

    return true
  }

  function iniciarNuevaReserva() {
    setUltimaCita(null)
    setEstadoCorreo('inactivo')
    setErrorDisponibilidad('')
    setServicioSeleccionado(null)
    setFechaSeleccionada('')
    setHorarioSeleccionado('')
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

      {ultimaCita ? (
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
  )
}

export default App