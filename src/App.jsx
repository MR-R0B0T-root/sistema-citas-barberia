import { useState } from 'react'
import CatalogoServicios from './components/CatalogoServicios'
import FormularioCita from './components/FormularioCita'
import SelectorHorario from './components/SelectorHorario'
import { generarHorarios } from './data/horarios'
import { servicios } from './data/servicios'
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

  const servicioElegido =
    servicios.find((servicio) => servicio.id === servicioSeleccionado) ?? null

  function registrarCita(nuevaCita) {
    const citaCompleta = {
      ...nuevaCita,
      id: crypto.randomUUID(),
      fechaRegistro: new Date().toISOString(),
    }

    setCitas((citasActuales) => {
      const citasActualizadas = [...citasActuales, citaCompleta]

      localStorage.setItem(CLAVE_CITAS, JSON.stringify(citasActualizadas))

      return citasActualizadas
    })

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

      <CatalogoServicios
        servicios={servicios}
        servicioSeleccionado={servicioSeleccionado}
        onSeleccionarServicio={setServicioSeleccionado}
      />

      <SelectorHorario
        horarios={horarios}
        fechaSeleccionada={fechaSeleccionada}
        horarioSeleccionado={horarioSeleccionado}
        onSeleccionarFecha={setFechaSeleccionada}
        onSeleccionarHorario={setHorarioSeleccionado}
      />

      <FormularioCita
        servicio={servicioElegido}
        fechaSeleccionada={fechaSeleccionada}
        horarioSeleccionado={horarioSeleccionado}
        onRegistrarCita={registrarCita}
      />

      <p className="app__contador">
        Citas registradas en este navegador: {citas.length}
      </p>
    </main>
  )
}

export default App