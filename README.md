# Sistema Web de Gestión de Citas para Barbería

Aplicación web desarrollada con React para gestionar el flujo básico de reservación de citas en una barbería.

El proyecto fue realizado como parte de una actividad académica enfocada en la aplicación de la metodología Scrum. Durante el Sprint 1 se desarrolló un incremento funcional que permite consultar servicios, seleccionar una fecha y horario, registrar una cita, evitar reservaciones duplicadas y recibir una confirmación visual y por correo electrónico.

## Objetivo del proyecto

Desarrollar una aplicación web adaptable que permita al cliente completar el proceso básico de reservación de una cita para barbería desde una computadora o un teléfono celular.

## Funcionalidades implementadas

### BAR-01 | Catálogo de servicios

- Consulta de servicios disponibles.
- Visualización de nombre, descripción, precio y duración.
- Selección visual de un servicio.
- Distribución adaptable para diferentes tamaños de pantalla.

### BAR-02 | Consulta de horarios

- Selección de fecha.
- Restricción de fechas anteriores al día actual.
- Validación de fechas introducidas manualmente.
- Generación automática de horarios de 10:00 a 18:00.
- Selección visual de un horario.
- Identificación de horarios previamente ocupados.

### BAR-03 | Registro de cita

- Formulario con nombre, correo electrónico y teléfono.
- Validación de campos obligatorios.
- Validación de formato y longitud.
- Normalización de los datos antes del almacenamiento.
- Resumen del servicio, fecha y horario seleccionados.
- Persistencia local mediante `localStorage`.

### BAR-04 | Validación de disponibilidad

- Consulta de las citas almacenadas.
- Comparación de fecha y horario antes del registro.
- Desactivación visual de horarios ocupados.
- Prevención de reservaciones duplicadas.
- Validación defensiva inmediatamente antes del almacenamiento.
- Manejo de intentos simultáneos desde diferentes pestañas.

### BAR-05 | Confirmación de reserva

- Confirmación visual después del registro.
- Generación de un folio único para cada reservación.
- Resumen completo de la cita.
- Envío de correo mediante EmailJS.
- Estados de envío, éxito y error.
- Conservación de la cita cuando el servicio de correo no está disponible.

### BAR-12 | Diseño adaptable

Durante el Sprint 1 se comprobaron las interfaces desde computadora y teléfono celular. La aplicación adapta el catálogo, los horarios, el formulario y la confirmación al ancho disponible.

BAR-12 permanece como requisito transversal para su validación posterior durante los Sprint 2 y Sprint 3.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- JSX
- CSS
- localStorage
- EmailJS
- Git
- GitHub
- ESLint
- npm

## Estructura principal

```text
src/
├── components/
│   ├── CatalogoServicios.jsx
│   ├── ConfirmacionCita.jsx
│   ├── FormularioCita.jsx
│   └── SelectorHorario.jsx
├── data/
│   ├── horarios.js
│   └── servicios.js
├── services/
│   └── emailService.js
├── utils/
│   └── generarFolio.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

