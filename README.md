# Sistema Web de Gestión de Citas para Barbería

Aplicación web desarrollada con React y Vite para gestionar la reservación y administración de citas en una barbería.

El proyecto fue realizado como parte de una actividad académica enfocada en la aplicación de la metodología Scrum. El desarrollo se organizó en incrementos funcionales, con trazabilidad mediante historias de usuario, pruebas automatizadas, revisión de seguridad, control de versiones con Git y seguimiento del trabajo en Trello.

Durante el Sprint 1 se desarrolló el flujo de reservación, que permite consultar servicios, seleccionar una fecha y horario, registrar una cita, validar su disponibilidad y recibir una confirmación visual y por correo electrónico.

Durante el Sprint 2 se incorporó una agenda administrativa para consultar, editar y cancelar reservaciones. También se ajustó la validación de disponibilidad para considerar la duración completa de los servicios, impedir traslapes y evitar citas que terminen después del cierre.

Durante el Sprint 3 se incorporaron la búsqueda de citas por cliente, el filtro por servicio y el historial de clientes. También se realizaron pruebas de seguridad y robustez sobre dependencias, horarios manipulados, estructuras corruptas, recuperación de datos desde `localStorage` y exposición accidental de secretos.

## Objetivo del proyecto

Desarrollar una aplicación web adaptable que permita al cliente completar el proceso de reservación de una cita y al administrador consultar, buscar, filtrar, editar, cancelar y revisar el historial de reservaciones desde una computadora o un teléfono celular.

## Estado del proyecto

- Sprint 1: terminado.
- Sprint 2: terminado.
- Sprint 3: terminado.
- BAR-09: terminada.
- BAR-10: terminada.
- BAR-11: terminada.
- BAR-12: terminada.
- Ajustes VITIUM-02 a VITIUM-05: corregidos e integrados en `main`.
- Rama estable: `main`.
- Sprint 3 integrado desde `feature/sprint-3`.

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
- Generación automática de horarios de inicio desde las 10:00, respetando el cierre de la jornada a las 19:00.
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

- cálculo del intervalo completo de cada cita;
- consideración de la duración real del servicio;
- detección de traslapes entre reservaciones;
- bloqueo visual de horarios incompatibles;
- permiso para citas consecutivas sin conflicto;
- rechazo de citas que terminen después de las 19:00;
- validación defensiva antes del almacenamiento;
- exclusión de la propia cita durante la edición.

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

### Sprint 3 | Consulta avanzada, historial y seguridad

#### BAR-09 | Búsqueda por cliente

- Búsqueda por nombre completo o parcial.
- Normalización de mayúsculas, minúsculas y acentos.
- Aplicación de la búsqueda sobre la vista diaria o semanal seleccionada.
- Conteo de coincidencias.
- Estado específico cuando no existen resultados.
- Control para limpiar la búsqueda.

#### BAR-10 | Filtro por servicio

- Selector generado a partir del catálogo real de servicios.
- Opción para mostrar todos los servicios.
- Filtrado mediante el identificador estable `servicio.id`.
- Combinación del filtro con la búsqueda por cliente.
- Conservación del filtro al alternar entre vista diaria y semanal.
- Estado específico cuando los filtros no producen coincidencias.
- Estilos coherentes con la agenda administrativa.
- Adaptación de los controles para pantallas pequeñas.

#### BAR-11 | Historial de clientes

- Vista administrativa independiente para consultar el historial.
- Selección de clientes registrados.
- Identificación mediante una clave compuesta por teléfono y correo normalizados.
- Separación de homónimos y registros que comparten teléfono.
- Visualización de nombre, teléfono, correo y cantidad de citas.
- Historial ordenado desde la cita más reciente hasta la más antigua.
- Visualización de servicio, fecha, horario y folio.
- Estado derivado de cada cita: `Programada` o `Atendida`.
- Resumen general de clientes únicos y citas registradas.
- Interfaz adaptable y navegable mediante teclado.

La aplicación no conserva citas canceladas en el historial porque BAR-08 elimina la reservación de `localStorage`. Mantener cancelaciones como registros históricos requeriría cambiar el modelo de datos y la lógica de disponibilidad.

#### BAR-12 | Diseño adaptable

BAR-12 se completó como requisito transversal del proyecto mediante la revisión de las funcionalidades incorporadas durante los tres sprints.

Durante los Sprints 1 y 2 se comprobaron:

- catálogo de servicios;
- selector de fecha y horario;
- formulario de registro;
- confirmación de la reservación;
- navegación administrativa;
- agenda diaria y semanal;
- tarjetas de reservaciones;
- formulario de edición;
- mensajes de validación;
- acciones de edición y cancelación;
- panel de confirmación de cancelación;
- visualización de folios extensos.

Durante el Sprint 3 se incorporaron estilos adaptables para:

- búsqueda por cliente;
- filtro por servicio;
- navegación principal con tres vistas;
- selector del historial;
- resumen del cliente;
- tarjetas del historial;
- estados `Programada` y `Atendida`.

La revisión final de BAR-12 cubrió sistemáticamente los anchos de 320, 375, 768, 1024 y 1440 píxeles, además de una prueba complementaria en un teléfono físico mediante el servidor de desarrollo expuesto en la red local.

En las resoluciones evaluadas se revisaron las vistas de reservación, agenda e historial de clientes. También se comprobó la navegación, los formularios, la búsqueda por cliente, el filtro por servicio, la edición, la cancelación, las tarjetas de citas, los folios extensos y la ausencia de desplazamiento horizontal.

## Seguridad y robustez

### VITIUM-02 | Dependencias vulnerables

- Revisión mediante `npm audit`.
- Actualización preventiva de Zod de `4.5.4` a `4.6.7`.
- Confirmación de que la dependencia afectada pertenecía al entorno de desarrollo.
- Resultado final: 0 vulnerabilidades.

### VITIUM-03 | Horarios y duraciones manipuladas

- Validación estricta del formato `HH:mm`.
- Rechazo de duraciones negativas, decimales, nulas o no finitas.
- Delimitación de la jornada entre las 10:00 y las 19:00.
- Rechazo de intervalos fuera del horario operativo.
- Comportamiento cerrado ante entradas inválidas.

### VITIUM-04 | Estructuras corruptas

- Validación del tipo de la colección de citas.
- Validación estructural de cada cita.
- Rechazo defensivo de registros incompletos o corruptos.
- Prevención de excepciones durante el cálculo de disponibilidad.

### VITIUM-05 | Recuperación defensiva desde `localStorage`

La función `recuperarCitasDesdeTexto`:

- controla errores de análisis JSON;
- devuelve un arreglo vacío ante contenido inexistente o inválido;
- rechaza valores que no sean arreglos;
- filtra citas con estructura incorrecta;
- valida cliente, servicio, fecha y horario;
- conserva únicamente citas utilizables por la aplicación.

### Auditoría de secretos

Se revisó el repositorio y todo su historial mediante Gitleaks `8.30.1`:

```bash
gitleaks git . --redact
```

Resultado de la revisión:

- 24 commits analizados;
- aproximadamente 415.69 KB inspeccionados;
- 0 secretos detectados;
- resultado final: `no leaks found`.

También se confirmó que:

- `.env` está ignorado por Git;
- `.env` nunca fue registrado en el historial;
- `.env.example` contiene únicamente valores de referencia;
- `dist` está ignorado y no está versionado;
- no existen archivos de claves o credenciales rastreados.

La evidencia técnica ampliada se encuentra en [`evidencias-pentest/README.md`](evidencias-pentest/README.md).

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- JSX
- CSS
- `localStorage`
- EmailJS
- Vitest
- ESLint
- npm
- Git
- GitHub
- Gitleaks
- Trello

## Estructura principal

```text
.
├── evidencias-pentest/
│   └── README.md
├── src/
│   ├── components/
│   │   ├── AgendaCitas.jsx
│   │   ├── CatalogoServicios.jsx
│   │   ├── ConfirmacionCita.jsx
│   │   ├── FormularioCita.jsx
│   │   ├── FormularioEdicionCita.jsx
│   │   ├── HistorialClientes.jsx
│   │   └── SelectorHorario.jsx
│   ├── data/
│   │   ├── horarios.js
│   │   └── servicios.js
│   ├── services/
│   │   └── emailService.js
│   ├── utils/
│   │   ├── disponibilidadCitas.js
│   │   ├── disponibilidadCitas.test.js
│   │   ├── generarFolio.js
│   │   ├── historialClientes.js
│   │   ├── historialClientes.test.js
│   │   ├── validacionCitas.js
│   │   └── validacionCitas.test.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Persistencia

Las reservaciones se almacenan en `localStorage` con la clave:

```text
barberia-citas
```

Esto permite conservar las citas después de recargar la página.

La información permanece únicamente en el navegador donde fue registrada. Las citas no se sincronizan entre navegadores, computadoras o teléfonos.

Los datos de `localStorage` pueden ser modificados o eliminados desde las herramientas del navegador. La aplicación filtra registros inválidos al recuperarlos, pero esta medida no sustituye una base de datos ni la validación del lado servidor.

## Requisitos

- Node.js compatible con el proyecto.
- npm.
- Navegador moderno con soporte para módulos de JavaScript y `localStorage`.
- Cuenta y configuración de EmailJS para habilitar el envío de correos.

El entorno utilizado durante la revisión final incluyó:

- Node.js `v24.19.0`;
- npm `11.17.0`;
- Vite `8.3.5`;
- Vitest `5.0.5`.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/MR-R0B0T-root/sistema-citas-barberia.git
```

Entra en la carpeta del proyecto:

```bash
cd sistema-citas-barberia
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo local de variables de entorno a partir del ejemplo.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Bash:

```bash
cp .env.example .env
```

Configura los valores reales de EmailJS en `.env` y ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local, normalmente:

```text
http://localhost:5173/
```

## Variables de entorno

La integración con EmailJS utiliza:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

El archivo `.env.example` documenta las variables requeridas. Los valores reales deben permanecer en un archivo `.env` ignorado por Git.

Las variables con prefijo `VITE_` pueden incorporarse al bundle del navegador. No deben utilizarse para contraseñas, claves privadas, tokens administrativos ni secretos del lado servidor.

## Scripts disponibles

### Servidor de desarrollo

```bash
npm run dev
```

### Pruebas automatizadas

```bash
npm test -- --run
```

### Análisis estático

```bash
npm run lint
```

### Build de producción

```bash
npm run build
```

### Auditoría de dependencias

```bash
npm audit
```

### Auditoría de secretos

Con Gitleaks instalado:

```bash
gitleaks git . --redact
```

## Pruebas automatizadas

La batería actual contiene 52 pruebas distribuidas de la siguiente manera:

- 18 pruebas de disponibilidad, duración y traslape de citas;
- 22 pruebas de validación y recuperación defensiva;
- 12 pruebas de agrupación e historial de clientes.

Estado actual:

- archivos de prueba: 3 aprobados;
- pruebas ejecutadas: 52;
- pruebas aprobadas: 52;
- pruebas fallidas: 0.

Las pruebas cubren, entre otros casos:

- horarios válidos e inválidos;
- duración completa de los servicios;
- traslapes y citas consecutivas;
- datos corruptos o incompletos;
- recuperación desde texto JSON;
- fechas y horarios inválidos;
- normalización de teléfonos;
- separación de clientes con datos similares;
- orden descendente del historial;
- estados `Programada` y `Atendida`.

## Verificaciones realizadas

Las verificaciones funcionales incluyen:

- registro y persistencia de reservaciones;
- validación de datos del cliente;
- confirmación visual y envío de correo;
- detección de horarios ocupados;
- validación de duración y traslapes;
- rechazo de citas posteriores al cierre;
- consulta diaria y semanal;
- búsqueda por cliente;
- filtrado por servicio;
- combinación de búsqueda y filtro;
- edición sin duplicar reservaciones;
- conservación del folio;
- cancelación con confirmación previa;
- liberación del horario cancelado;
- historial por cliente;
- separación de homónimos y datos reutilizados;
- persistencia después de recargar.

Las verificaciones técnicas incluyen:

```bash
npm test -- --run
npm run lint
npm run build
npm audit
git diff --check
gitleaks git . --redact
```

Última línea base comprobada:

- 52 pruebas aprobadas;
- ESLint limpio;
- build de producción correcto;
- 51 módulos transformados;
- 0 vulnerabilidades detectadas por `npm audit`;
- 0 secretos detectados por Gitleaks.

## Trazabilidad

### Sprint 1

- `714dcdd` | BAR-01 | Catálogo de servicios.
- `03c4b7d` | BAR-02 | Consulta de horarios.
- `a186f5e` | BAR-03 | Registro de citas.
- `4e3267f` | BAR-04 | Validación de disponibilidad.
- `900a919` | BAR-05 | Confirmación de reserva.
- `e35f5e7` | Corrección para registro desde dispositivos móviles.
- `22f3047` | Actualización de la dependencia `brace-expansion`.

### Sprint 2

- `24dd88b` | BAR-06 | Consulta diaria y semanal.
- `87e23c7` | VITIUM-01 | Duración y traslapes.
- `1a438e1` | BAR-07 | Edición de citas.
- `1bed580` | BAR-08 | Cancelación de citas.
- `c20c1a5` | Actualización del README con Sprint 1 y Sprint 2.
- `dfe0d24` | Simplificación de la sección de autoría.

### Sprint 3 y seguridad

- `ef019d8` | BAR-09 | Búsqueda por cliente.
- `de88be1` | VITIUM-02 | Actualización de dependencias vulnerables de desarrollo.
- `3f016b5` | VITIUM-03 y VITIUM-04 | Validación de horarios y datos corruptos.
- `72ed1da` | VITIUM-05 | Validación de citas recuperadas del almacenamiento.
- `2d548c3` | Actualización de Zod vulnerable.
- `66d319b` | Integración de los ajustes de seguridad en `main`.
- `ef7549d` | BAR-10 | Filtro por servicio.
- `89db8d9` | BAR-11 | Historial de clientes.
- `394d349` | Aclaración del conteo de clientes y citas en BAR-11.
- `25fa636` | Actualización integral de la documentación del Sprint 3.
- `bf1a8b2` | Cierre documental de BAR-12 y Sprint 3.
- `0b98344` | Integración final de las funcionalidades del Sprint 3 en `main`.

## Limitaciones conocidas

- No existe backend ni base de datos central.
- Las citas se almacenan únicamente en `localStorage`.
- No existe sincronización entre dispositivos.
- No existe autenticación para las funciones administrativas.
- No existe autorización por roles.
- Los datos locales pueden borrarse o modificarse desde el navegador.
- La concurrencia real entre usuarios o pestañas no está garantizada.
- EmailJS depende de un servicio externo, de variables válidas y de sus límites de uso.
- Las variables `VITE_` utilizadas por el frontend pueden incorporarse al bundle.
- Las citas canceladas se eliminan y no forman parte del historial.
- La identidad de los clientes se aproxima mediante teléfono y correo normalizados porque no existe un `clienteId` persistente.
- Un cambio de teléfono o correo puede producir una identidad separada en el historial.
- Los estados `Programada` y `Atendida` se calculan a partir de la fecha y el horario, no mediante un flujo operativo confirmado por el personal.
- Se trata de un prototipo académico y no de un sistema listo para operación comercial.

## Mejoras futuras

- Incorporar backend y base de datos.
- Crear identificadores persistentes para clientes.
- Conservar cancelaciones mediante estados en lugar de eliminarlas.
- Implementar autenticación y autorización por roles.
- Sincronizar reservaciones entre dispositivos.
- Añadir registro de auditoría.
- Incorporar protección contra abuso y límites de solicitudes.
- Ejecutar pruebas de componentes y flujos completos en el navegador.
- Automatizar pruebas, lint, build, auditoría y revisión de secretos mediante integración continua.
- Implementar respaldo y recuperación de datos.
- Administrar secretos mediante servicios del lado servidor.

## Cierre del Sprint 3

- BAR-09, BAR-10, BAR-11 y BAR-12 terminadas.
- Revisión responsive completada en 320, 375, 768, 1024 y 1440 píxeles.
- Prueba complementaria realizada en un teléfono físico.
- 52 pruebas automatizadas aprobadas.
- ESLint y build de producción aprobados.
- 0 vulnerabilidades detectadas por `npm audit`.
- 0 secretos detectados mediante Gitleaks.

## Autoría

Proyecto académico desarrollado por Jorge E. Ledesma Cruz.

El autor realizó la planeación operativa, implementación, pruebas, actualización de Trello, documentación, revisión de seguridad y publicación de los incrementos descritos.
