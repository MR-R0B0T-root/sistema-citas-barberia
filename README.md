# Sistema Web de Gestión de Citas para Barbería

Aplicación web desarrollada con React y Vite para gestionar la reservación y administración de citas en una barbería.

El proyecto fue realizado como parte de una actividad académica enfocada en la aplicación de la metodología Scrum.

Durante el Sprint 1 se desarrolló el flujo de reservación, que permite consultar servicios, seleccionar una fecha y horario, registrar una cita, validar su disponibilidad y recibir una confirmación visual y por correo electrónico.

Durante el Sprint 2 se incorporó una agenda administrativa para consultar, editar y cancelar reservaciones. También se ajustó la validación de disponibilidad para considerar la duración completa de los servicios, impedir traslapes y evitar citas que terminen después del cierre.

## Objetivo del proyecto

Desarrollar una aplicación web adaptable que permita al cliente completar el proceso de reservación de una cita y al administrador consultar, editar y cancelar reservaciones desde una computadora o un teléfono celular.

## Estado del proyecto

- Sprint 1: terminado.
- Sprint 2: terminado.
- Sprint 3: pendiente.
- BAR-12 continúa como requisito transversal para el siguiente incremento.

## Funcionalidades implementadas

### Sprint 1 | Reservación de citas

#### BAR-01 | Catálogo de servicios

- Consulta de servicios disponibles.
- Visualización de nombre, descripción, precio y duración.
- Selección visual de un servicio.
- Distribución adaptable para diferentes tamaños de pantalla.

#### BAR-02 | Consulta de horarios

- Selección de fecha.
- Restricción de fechas anteriores al día actual.
- Validación de fechas introducidas manualmente.
- Generación automática de horarios de 10:00 a 18:00.
- Selección visual de un horario.
- Identificación de horarios no disponibles.

#### BAR-03 | Registro de cita

- Formulario con nombre, correo electrónico y teléfono.
- Validación de campos obligatorios.
- Validación de formato y longitud.
- Normalización de los datos antes del almacenamiento.
- Resumen del servicio, fecha y horario seleccionados.
- Persistencia local mediante `localStorage`.

#### BAR-04 | Validación de disponibilidad

- Consulta de las citas almacenadas.
- Validación de fecha, horario y duración del servicio.
- Desactivación visual de horarios no disponibles.
- Prevención de reservaciones duplicadas.
- Validación defensiva inmediatamente antes del almacenamiento.
- Segunda comprobación de disponibilidad para reducir conflictos dentro del alcance local del prototipo.

#### BAR-05 | Confirmación de reserva

- Confirmación visual después del registro.
- Generación de un folio único para cada reservación.
- Resumen completo de la cita.
- Envío de correo mediante EmailJS.
- Estados de envío, éxito y error.
- Conservación de la cita cuando el servicio de correo no está disponible.

### Sprint 2 | Administración de citas

#### BAR-06 | Consulta de agenda

- Navegación entre reservación y administración.
- Consulta diaria de citas.
- Consulta semanal de lunes a domingo.
- Selección de fecha de consulta.
- Orden cronológico por fecha y horario.
- Visualización de cliente, teléfono, correo, servicio, duración, precio y folio.
- Estado específico cuando no existen citas.
- Persistencia de la agenda después de recargar.

#### VITIUM-01 | Validación de duración y traslapes

Durante la revisión del Sprint 2 se detectó que la disponibilidad solo bloqueaba el horario inicial de una reservación.

La validación fue ajustada para incorporar:

- Cálculo del intervalo completo de cada cita.
- Consideración de la duración real del servicio.
- Detección de traslapes entre reservaciones.
- Bloqueo visual de horarios incompatibles.
- Permiso para citas consecutivas sin conflicto.
- Rechazo de citas que terminen después de las 19:00.
- Validación defensiva antes del almacenamiento.
- Exclusión de la propia cita durante la edición.

Por ejemplo, una cita de 120 minutos iniciada a las 10:00 bloquea el horario de las 11:00, pero permite una nueva reservación a partir de las 12:00.

#### BAR-07 | Edición de citas

- Selección de una cita mediante su identificador.
- Carga de los datos actuales de la reservación.
- Edición de nombre, correo electrónico y teléfono.
- Cambio de servicio, fecha y horario.
- Validación de campos obligatorios.
- Validación de nombre, correo y teléfono.
- Restricción de fechas anteriores al día actual.
- Selección exclusiva de horarios oficiales.
- Reutilización de la validación de disponibilidad.
- Conservación del horario propio sin generar un falso conflicto.
- Rechazo de cambios que provoquen traslapes.
- Conservación del folio original.
- Actualización de la cita sin crear duplicados.
- Persistencia de los cambios después de recargar.
- Cancelación de la edición sin modificar los datos.

#### BAR-08 | Cancelación de citas

- Acción de cancelación en cada reservación.
- Selección de la cita mediante su identificador.
- Confirmación previa antes de eliminar.
- Visualización de cliente, servicio, fecha, horario y folio.
- Opción para conservar la cita y abandonar la operación.
- Eliminación exclusiva de la cita seleccionada.
- Actualización inmediata de la agenda y del contador.
- Persistencia de la cancelación después de recargar.
- Liberación automática del horario cancelado.
- Conservación de las demás reservaciones.
- Separación entre los procesos de edición y cancelación.

#### BAR-12 | Diseño adaptable

BAR-12 se mantiene como requisito transversal del proyecto.

Durante el Sprint 1 se comprobaron desde computadora y teléfono celular:

- Catálogo de servicios.
- Selector de fecha y horario.
- Formulario de registro.
- Confirmación de la reservación.

Durante el Sprint 2 se comprobaron:

- Navegación administrativa.
- Agenda diaria y semanal.
- Tarjetas de reservaciones.
- Formulario de edición.
- Mensajes de validación.
- Acciones de edición y cancelación.
- Panel de confirmación de cancelación.
- Visualización de folios extensos.

Las pruebas móviles del Sprint 2 se realizaron mediante el servidor de desarrollo expuesto en la red local. La interfaz fue validada aproximadamente a 371 px sin desbordamiento horizontal.

BAR-12 queda validada para Sprint 1 y Sprint 2, pero continuará como requisito transversal durante Sprint 3.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- JSX
- CSS
- `localStorage`
- EmailJS
- Git
- GitHub
- ESLint
- npm

## Estructura principal

```text
src/
├── components/
│   ├── AgendaCitas.jsx
│   ├── CatalogoServicios.jsx
│   ├── ConfirmacionCita.jsx
│   ├── FormularioCita.jsx
│   ├── FormularioEdicionCita.jsx
│   └── SelectorHorario.jsx
├── data/
│   ├── horarios.js
│   └── servicios.js
├── services/
│   └── emailService.js
├── utils/
│   ├── disponibilidadCitas.js
│   └── generarFolio.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

## Persistencia

Las reservaciones se almacenan en `localStorage` con la clave:

```text
barberia-citas
```

Esto permite conservar las citas después de recargar la página.

La información permanece únicamente en el navegador donde fue registrada. Las citas no se sincronizan entre navegadores, computadoras o teléfonos.

## Variables de entorno

La integración con EmailJS utiliza las siguientes variables:

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

El archivo `.env.example` documenta las variables requeridas. Las credenciales reales deben permanecer en un archivo `.env` ignorado por Git.

## Verificaciones realizadas

Durante los Sprints 1 y 2 se comprobaron:

- Registro y persistencia de reservaciones.
- Validación de datos del cliente.
- Confirmación visual y envío de correo.
- Detección de horarios ocupados.
- Validación de duración y traslapes.
- Rechazo de citas posteriores al cierre.
- Consulta diaria y semanal.
- Edición sin duplicar reservaciones.
- Conservación del folio.
- Cancelación con confirmación previa.
- Liberación del horario cancelado.
- Persistencia después de recargar.
- Funcionamiento en computadora y teléfono.

Las verificaciones técnicas incluyeron:

```bash
git diff --check
npm run lint
npm run build
```

## Trazabilidad

- `714dcdd` | BAR-01 | Catálogo de servicios.
- `03c4b7d` | BAR-02 | Consulta de horarios.
- `a186f5e` | BAR-03 | Registro de citas.
- `4e3267f` | BAR-04 | Validación de disponibilidad.
- `900a919` | BAR-05 | Confirmación de reserva.
- `e35f5e7` | Corrección para registro desde dispositivos móviles.
- `22f3047` | Actualización de la dependencia `brace-expansion`.
- `24dd88b` | BAR-06 | Consulta diaria y semanal.
- `87e23c7` | VITIUM-01 | Duración y traslapes.
- `1a438e1` | BAR-07 | Edición de citas.
- `1bed580` | BAR-08 | Cancelación de citas.

## Limitaciones conocidas

- No existe backend ni base de datos central.
- Las citas se almacenan únicamente en `localStorage`.
- No existe sincronización entre dispositivos.
- No existe autenticación para las funciones administrativas.
- Los datos locales pueden borrarse o modificarse desde el navegador.
- La concurrencia real entre usuarios o pestañas no está garantizada.
- EmailJS depende de un servicio externo y de variables válidas.
- El proyecto todavía no cuenta con pruebas automatizadas.
- Se trata de un prototipo académico y no de un sistema listo para operación comercial.

## Pendiente para Sprint 3

- BAR-09 | Búsqueda por cliente.
- BAR-10 | Filtro por servicio.
- BAR-11 | Historial de clientes.
- Nueva validación de BAR-12 sobre las funciones del Sprint 3.

## Autoría

Proyecto académico desarrollado por Jorge E. Ledesma Cruz.

Durante el Sprint 2, el autor realizó la planeación operativa, implementación, pruebas, actualización de Trello, documentación y publicación de los incrementos descritos. 
