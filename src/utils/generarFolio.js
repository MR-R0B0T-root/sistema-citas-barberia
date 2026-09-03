export function generarFolio() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const bytes = new Uint8Array(16)

    crypto.getRandomValues(bytes)

    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80

    const caracteresHexadecimales = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, '0'),
    )

    return [
      caracteresHexadecimales.slice(0, 4).join(''),
      caracteresHexadecimales.slice(4, 6).join(''),
      caracteresHexadecimales.slice(6, 8).join(''),
      caracteresHexadecimales.slice(8, 10).join(''),
      caracteresHexadecimales.slice(10, 16).join(''),
    ].join('-')
  }

  throw new Error(
    'El navegador no cuenta con un generador aleatorio compatible.',
  )
}