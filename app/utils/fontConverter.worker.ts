// Web Worker для конвертации шрифтов
// Это поможет избежать блокировки UI во время конвертации

import pako from 'pako'

// Тип сообщений для Worker
interface ConvertMessage {
  type: 'convert'
  data: {
    fontBuffer: ArrayBuffer
    format: 'woff' | 'woff2'
    fileName: string
  }
}

interface ConvertResult {
  type: 'success' | 'error'
  data?: {
    buffer: ArrayBuffer
    fileName: string
    format: string
  }
  error?: string
}

self.onmessage = async function(e: MessageEvent<ConvertMessage>) {
  const { type, data } = e.data

  if (type === 'convert') {
    try {
      const result = await convertFont(data.fontBuffer, data.format, data.fileName)

      const response: ConvertResult = {
        type: 'success',
        data: result
      }

      self.postMessage(response)
    } catch (error) {
      const response: ConvertResult = {
        type: 'error',
        error: error instanceof Error ? error.message : 'Conversion failed'
      }

      self.postMessage(response)
    }
  }
}

async function convertFont(
  fontBuffer: ArrayBuffer,
  format: 'woff' | 'woff2',
  fileName: string
): Promise<{ buffer: ArrayBuffer; fileName: string; format: string }> {
  const ttfData = new Uint8Array(fontBuffer)

  if (format === 'woff') {
    const woffBuffer = await convertToWoff(ttfData)
    return {
      buffer: new ArrayBuffer(woffBuffer.byteLength).constructor === ArrayBuffer
        ? woffBuffer.buffer as ArrayBuffer
        : woffBuffer.buffer.slice(0) as ArrayBuffer,
      fileName: fileName.replace(/\.[^/.]+$/, '.woff'),
      format: 'woff'
    }
  } else if (format === 'woff2') {
    const woff2Buffer = await convertToWoff2(ttfData)
    return {
      buffer: new ArrayBuffer(woff2Buffer.byteLength).constructor === ArrayBuffer
        ? woff2Buffer.buffer as ArrayBuffer
        : woff2Buffer.buffer.slice(0) as ArrayBuffer,
      fileName: fileName.replace(/\.[^/.]+$/, '.woff2'),
      format: 'woff2'
    }
  }

  throw new Error(`Unsupported format: ${format}`)
}

async function convertToWoff(ttfData: Uint8Array): Promise<Uint8Array> {
  // Упрощенная WOFF конвертация с zlib сжатием
  const compressed = pako.deflate(ttfData)

  // Создаем WOFF заголовок
  const woffHeader = new ArrayBuffer(44) // Базовый размер WOFF заголовка
  const view = new DataView(woffHeader)

  // WOFF signature
  view.setUint32(0, 0x774F4646, false) // 'wOFF'

  // Flavor (TTF)
  view.setUint32(4, 0x00010000, false)

  // Length (общая длина файла)
  view.setUint32(8, 44 + compressed.length, false)

  // numTables, reserved, totalSfntSize
  view.setUint16(12, 1, false) // Упрощено
  view.setUint16(14, 0, false) // reserved
  view.setUint32(16, ttfData.length, false) // оригинальный размер

  // majorVersion, minorVersion
  view.setUint16(20, 1, false)
  view.setUint16(22, 0, false)

  // Объединяем заголовок и сжатые данные
  const result = new Uint8Array(woffHeader.byteLength + compressed.length)
  result.set(new Uint8Array(woffHeader), 0)
  result.set(compressed, woffHeader.byteLength)

  return result
}

async function convertToWoff2(ttfData: Uint8Array): Promise<Uint8Array> {
  // Упрощенная WOFF2 конвертация
  // В реальности нужно использовать Brotli и сложную структуру WOFF2

  // Для демо просто применяем более агрессивное сжатие
  const compressed = pako.deflate(ttfData, { level: 9 })

  // WOFF2 заголовок (упрощенный)
  const woff2Header = new ArrayBuffer(48)
  const view = new DataView(woff2Header)

  // WOFF2 signature
  view.setUint32(0, 0x774F4632, false) // 'wOF2'

  // Flavor
  view.setUint32(4, 0x00010000, false)

  // Length
  view.setUint32(8, 48 + compressed.length, false)

  // numTables
  view.setUint16(12, 1, false)

  // totalSfntSize
  view.setUint32(16, ttfData.length, false)

  // totalCompressedSize
  view.setUint32(20, compressed.length, false)

  // majorVersion, minorVersion
  view.setUint16(24, 1, false)
  view.setUint16(26, 0, false)

  const result = new Uint8Array(woff2Header.byteLength + compressed.length)
  result.set(new Uint8Array(woff2Header), 0)
  result.set(compressed, woff2Header.byteLength)

  return result
}
