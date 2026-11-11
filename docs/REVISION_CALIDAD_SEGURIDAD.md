# Revisión de calidad y seguridad

## 1. Propósito

Este documento registra la revisión técnica realizada al Sistema Web de Gestión de Citas para Barbería después del cierre funcional de las historias de usuario BAR-01 a BAR-12.

La revisión forma parte de las modificaciones de cierre definidas en la Actividad 1 de la Unidad 4. Su propósito es comprobar la estabilidad de la aplicación, automatizar verificaciones repetibles y documentar los hallazgos de calidad y seguridad sin incorporar nuevas funcionalidades ni modificar la arquitectura existente.

## 2. Alcance

La revisión comprende los siguientes elementos:

- Pruebas automatizadas con Vitest.
- Análisis estático mediante ESLint.
- Compilación de producción con Vite.
- Auditoría de dependencias con npm.
- Automatización mediante GitHub Actions.
- Revisión de archivos de configuración y variables de entorno.
- Identificación de limitaciones y riesgos residuales.

Esta revisión no comprende:

- Incorporación de nuevas funciones.
- Cambios en la arquitectura del sistema.
- Modificaciones en los flujos de reservación, administración o consulta.
- Evaluaciones formales de conformidad o certificación.

## 3. Línea base revisada

La revisión se realizó sobre la rama principal del repositorio después de integrar las funcionalidades correspondientes a los tres Sprints del proyecto.

| Elemento | Resultado |
|---|---|
| Framework principal | React |
| Herramienta de construcción | Vite |
| Herramienta de pruebas | Vitest |
| Análisis estático | ESLint |
| Persistencia actual | `localStorage` |
| Servicio de correo | EmailJS |
| Pruebas automatizadas | 52 aprobadas |
| Archivos de prueba | 3 aprobados |
| Compilación de producción | Exitosa |
| Estado inicial de la rama `main` | Limpia y sincronizada |

## 4. Resultados de calidad

### 4.1 Pruebas automatizadas

Se ejecutó el siguiente comando:

```bash
npm test -- --run
```

El resultado fue:

- 3 archivos de prueba aprobados.
- 52 pruebas aprobadas.
- 0 pruebas fallidas.

Las pruebas comprueban principalmente:

- Validación de datos de las citas.
- Disponibilidad de horarios.
- Prevención de traslapes.
- Bloqueo de citas duplicadas.
- Duración de los servicios.
- Construcción del historial de clientes.
- Recuperación defensiva de datos.

### 4.2 Análisis estático

Se ejecutó:

```bash
npm run lint
```

ESLint terminó sin reportar errores. Esto indica que el código revisado cumple las reglas de análisis estático configuradas actualmente en el repositorio.

El resultado no representa una garantía absoluta de ausencia de defectos. ESLint identifica los problemas contemplados por su configuración, pero no sustituye las pruebas funcionales, la revisión manual ni los controles de seguridad.

### 4.3 Compilación de producción

Se ejecutó:

```bash
npm run build
```

Vite generó correctamente la compilación de producción. Durante la verificación local se transformaron 51 módulos y se produjeron los archivos correspondientes en el directorio `dist`.

La compilación satisfactoria confirma que la aplicación puede generar sus recursos de distribución con la configuración actual.

## 5. Integración continua con Vigiles CI

Como parte de AUGEO-01 se incorporó el workflow:

```text
.github/workflows/vigiles-ci.yml
```

El pipeline, denominado **Vigiles CI**, ejecuta automáticamente las siguientes verificaciones:

1. Descarga del repositorio.
2. Configuración de Node.js.
3. Instalación reproducible con `npm ci`.
4. Ejecución de las pruebas automatizadas.
5. Análisis mediante ESLint.
6. Compilación de producción.
7. Auditoría de dependencias de producción.
8. Auditoría general de dependencias.

El entorno final quedó configurado con:

- Ubuntu 24.04.
- Node.js 22.
- `actions/checkout@v5`.
- `actions/setup-node@v5`.

El workflow se activa mediante:

- Envíos a `main`.
- Envíos a la rama de implementación de Vigiles.
- Pull requests dirigidos a `main`.
- Ejecución manual mediante `workflow_dispatch`.

La integración se realizó mediante el Pull Request número 1. Antes del merge, GitHub confirmó que todas las verificaciones habían sido aprobadas y que no existían conflictos con la rama principal.

### 5.1 Trazabilidad de Vigiles CI

| Evidencia | Identificador |
|---|---|
| Incorporación inicial del pipeline | `38eafba` |
| Actualización del entorno de ejecución | `946f489` |
| Integración en `main` | `81c8842` |
| Pull Request | `#1` |
| Resultado | Verificaciones aprobadas |

La primera ejecución permitió identificar advertencias relacionadas con versiones internas de Node.js utilizadas por las acciones y con el alias cambiante `ubuntu-latest`.

Como acción preventiva, se actualizaron las acciones a la versión 5 y se fijó explícitamente Ubuntu 24.04. La ejecución posterior terminó correctamente y sin las advertencias iniciales.

## 6. Auditoría de dependencias

Se ejecutó:

```bash
npm audit
```

La auditoría local reportó cuatro vulnerabilidades de severidad moderada relacionadas con `minimatch`.

La cadena identificada fue:

```text
ESLint
└── @eslint/config-array
    └── minimatch
```

Las versiones observadas fueron:

- `eslint@10.9.1`
- `@eslint/js@10.0.1`
- `@eslint/config-array@0.23.5`
- `minimatch@10.2.6`

La solución automática completa propuesta por npm requería:

```bash
npm audit fix --force
```

Esta operación proponía instalar una versión distinta de ESLint y fue señalada como un cambio potencialmente incompatible. Por esa razón no se ejecutó durante el cierre.

### 6.1 Decisión adoptada

Se decidió:

- No forzar una modificación potencialmente disruptiva.
- Mantener la versión funcional y probada del proyecto.
- Registrar las vulnerabilidades moderadas como riesgo residual.
- Mantener la auditoría visible dentro de Vigiles CI.
- Bloquear el pipeline si se detectan vulnerabilidades de severidad alta o crítica.

Vigiles utiliza:

```bash
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
```

La primera instrucción revisa las dependencias de producción. La segunda incluye las herramientas de desarrollo. El nivel configurado permite conservar visibles los hallazgos moderados y detiene la verificación ante vulnerabilidades altas o críticas.

Esta decisión no implica que las vulnerabilidades moderadas hayan sido corregidas o puedan ignorarse. El hallazgo permanece documentado para una actualización controlada posterior.

## 7. Revisión de secretos y datos

La revisión considera los siguientes controles:

- El archivo `.env` no debe incorporarse al repositorio.
- El archivo `.env.example` debe incluir únicamente nombres o valores de ejemplo.
- Las credenciales y configuraciones de EmailJS no deben documentarse como información secreta protegida por el frontend.
- Los datos utilizados en pruebas deben ser ficticios.
- No deben almacenarse citas reales dentro de los archivos versionados.
- Los cambios deben revisarse antes del commit para evitar incorporar información sensible.

Las variables con el prefijo `VITE_` pueden quedar disponibles en el bundle generado para el navegador. Por ello, no deben tratarse como secretos equivalentes a una credencial almacenada en un servidor.

La integración con EmailJS cumple la función de confirmación definida para el alcance académico. Al utilizarse desde el navegador, su configuración pública no debe considerarse información secreta y su disponibilidad depende de un servicio externo.

## 8. Riesgos residuales

### 8.1 Persistencia en `localStorage`

La aplicación utiliza `localStorage` como mecanismo de persistencia dentro del alcance académico definido. Los datos permanecen asociados con el navegador utilizado y pueden ser modificados o eliminados localmente. Esta limitación se conserva documentada y no fue modificada durante la actividad.

### 8.2 Control de acceso

La versión revisada no incorpora un mecanismo de autenticación respaldado por un entorno externo al navegador. Este punto se registra como una limitación de la línea base y no fue modificado durante la actividad.

### 8.3 Envío de correo mediante EmailJS

EmailJS permite enviar las confirmaciones previstas en el proyecto. Al tratarse de una integración ejecutada desde el navegador, la configuración utilizada por el cliente puede inspeccionarse y la disponibilidad del envío depende del servicio externo. Estas condiciones se registran como parte del alcance técnico actual.

### 8.4 Dependencias de desarrollo

Las cuatro vulnerabilidades moderadas identificadas pertenecen a la cadena de herramientas de ESLint. No se demostró que afectaran el flujo funcional de la aplicación; sin embargo, permanecen registradas como riesgo residual de la línea base revisada.

## 9. Criterios de calidad considerados

La revisión utiliza como referencia conceptual atributos relacionados con ISO/IEC 25010, principalmente:

- Adecuación funcional.
- Fiabilidad.
- Usabilidad.
- Eficiencia del desempeño.
- Mantenibilidad.
- Portabilidad.
- Seguridad.

La aplicación muestra evidencia favorable en los siguientes aspectos:

- Adecuación funcional mediante la implementación de BAR-01 a BAR-12.
- Fiabilidad mediante 52 pruebas automatizadas.
- Mantenibilidad mediante separación de componentes, utilidades y pruebas.
- Portabilidad mediante compilación y ejecución automatizada en Ubuntu.
- Seguridad básica mediante validación defensiva, auditoría de dependencias y revisión de secretos.

La revisión también considera prácticas generales de OWASP relacionadas con:

- Gestión de dependencias.
- Validación de entradas.
- Protección de información sensible.
- Configuración segura.
- Registro de riesgos conocidos.

Estas referencias se emplean como criterios orientativos. El proyecto no afirma contar con certificación ISO, evaluación formal de conformidad ni validación independiente de seguridad.

## 10. Delimitación de la revisión

Los hallazgos que implicaban modificar funciones o alterar la arquitectura fueron documentados únicamente como limitaciones de la línea base. La actividad se concentró en verificar la versión actual y en incorporar controles reproducibles, sin definir ni publicar una ruta de desarrollo posterior.

## 11. Conclusión

La revisión se enfocó en comprobar lo ya construido, no en agregar funciones de último momento. El resultado fue consistente: las 52 pruebas automatizadas fueron aprobadas, ESLint no reportó errores y Vite generó correctamente la compilación de producción.

Vigiles CI trasladó esas comprobaciones a GitHub Actions y permitió ejecutarlas desde un entorno limpio antes de integrar cambios en `main`. Su configuración también hizo visibles advertencias del entorno, que fueron corregidas al actualizar las acciones utilizadas y fijar Ubuntu 24.04.

La auditoría registró cuatro vulnerabilidades moderadas en dependencias de desarrollo. Se evitó aplicar `npm audit fix --force` porque la corrección propuesta implicaba un cambio potencialmente incompatible. En lugar de presentar un resultado artificialmente limpio, el hallazgo quedó asentado como parte del estado real del proyecto.

Las modificaciones no alteraron los flujos de reservación, administración ni consulta de citas. La línea base conserva su funcionamiento y ahora cuenta con verificaciones automáticas, evidencia trazable y límites técnicos expresados sin confundir una ejecución exitosa con una garantía absoluta de seguridad.
