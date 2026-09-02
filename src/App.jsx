import { useState } from 'react'
import CatalogoServicios from './components/CatalogoServicios'
import SelectorHorario from './components/SelectorHorario'
import { generarHorarios } from './data/horarios'
import { servicios } from './data/servicios'
import './App.css'

const horarios = generarHorarios()

function App() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('')

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
    </main>
  )
}

export default App