import { useState } from 'react'
import CatalogoServicios from './components/CatalogoServicios'
import { servicios } from './data/servicios'
import './App.css'

function App() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)

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
    </main>
  )
}

export default App