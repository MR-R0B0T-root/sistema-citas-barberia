import emailjs from '@emailjs/browser'

const configuracionEmail = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

function validarConfiguracion() {
  const configuracionCompleta = Object.values(configuracionEmail).every(
    (valor) => typeof valor === 'string' && valor.trim() !== '',
  )

  if (!configuracionCompleta) {
    throw new Error(
      'La configuración de EmailJS está incompleta. Revisa las variables de entorno.',
    )
  }
}

export async function enviarConfirmacionCita(cita) {
  validarConfiguracion()

  const parametrosPlantilla = {
    nombre_cliente: cita.cliente.nombre,
    correo_cliente: cita.cliente.correo,
    telefono_cliente: cita.cliente.telefono,
    servicio: cita.servicio.nombre,
    precio: cita.servicio.precio.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }),
    duracion: cita.servicio.duracion,
    fecha: cita.fecha,
    horario: cita.horario,
    folio: cita.id,
  }

  const respuesta = await emailjs.send(
    configuracionEmail.serviceId,
    configuracionEmail.templateId,
    parametrosPlantilla,
    {
      publicKey: configuracionEmail.publicKey,
    },
  )

  return respuesta
}
