import { ref } from 'vue'
import { useFontStore } from '@/stores/fontStore'
import type { FontFile, ConversionFormat } from '@/stores/fontStore'

// Web Worker для конвертации шрифтов
let fontWorker: Worker | null = null

export function useFontConverter() {
  const fontStore = useFontStore()
  const conversionProgress = ref(0)

  // Инициализация Web Worker
  function initWorker(): Worker {
    if (!fontWorker) {
      // В Nuxt 3 импортируем worker как модуль
      fontWorker = new Worker(new URL('@/utils/fontConverter.worker.ts', import.meta.url), {
        type: 'module'
      })
    }
    return fontWorker
  }

  async function convertFont(file: File, format: 'woff' | 'woff2'): Promise<{ format: string; blob: Blob; name: string }[]> {
    const results: { format: string; blob: Blob; name: string }[] = []

    try {
      const arrayBuffer = await file.arrayBuffer()
      const worker = initWorker()

      const convertedFile = await convertWithWorker(worker, arrayBuffer, format, file.name)

      results.push({
        format: convertedFile.format,
        blob: new Blob([convertedFile.buffer], {
          type: convertedFile.format === 'woff' ? 'font/woff' : 'font/woff2'
        }),
        name: convertedFile.fileName
      })

      return results
    } catch (error) {
      console.error('Font conversion error:', error)
      throw new Error('Failed to convert font')
    }
  }

  // Конвертация отдельного файла
  async function convertSingleFile(fileId: string): Promise<void> {
    const fontFile = fontStore.files.find(f => f.id === fileId)
    if (!fontFile) {
      throw new Error('File not found')
    }

    try {
      fontStore.updateFileStatus(fileId, 'converting')

      const convertedFiles = await convertFont(fontFile.file, fontFile.selectedFormat)

      fontStore.updateFileStatus(fileId, 'converted', {
        convertedFiles
      })
    } catch (error) {
      fontStore.updateFileStatus(fileId, 'error', {
        error: error instanceof Error ? error.message : 'Conversion failed'
      })
      throw error
    }
  }

  // Конвертация через Web Worker
  function convertWithWorker(
    worker: Worker,
    fontBuffer: ArrayBuffer,
    format: 'woff' | 'woff2',
    fileName: string
  ): Promise<{ buffer: ArrayBuffer; fileName: string; format: string }> {
    return new Promise((resolve, reject) => {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'success') {
          worker.removeEventListener('message', handleMessage)
          resolve(e.data.data)
        } else if (e.data.type === 'error') {
          worker.removeEventListener('message', handleMessage)
          reject(new Error(e.data.error))
        }
      }

      worker.addEventListener('message', handleMessage)

      worker.postMessage({
        type: 'convert',
        data: {
          fontBuffer,
          format,
          fileName
        }
      })
    })
  }

  async function convertAllFonts() {
    const pendingFiles = fontStore.pendingFiles
    if (pendingFiles.length === 0) return

    fontStore.isConverting = true
    conversionProgress.value = 0

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const fontFile = pendingFiles[i]

        if (!fontFile) continue // Защита от undefined

        try {
          fontStore.updateFileStatus(fontFile.id, 'converting')

          const convertedFiles = await convertFont(fontFile.file, fontFile.selectedFormat)

          fontStore.updateFileStatus(fontFile.id, 'converted', {
            convertedFiles
          })
        } catch (error) {
          fontStore.updateFileStatus(fontFile.id, 'error', {
            error: error instanceof Error ? error.message : 'Conversion failed'
          })
        }

        conversionProgress.value = ((i + 1) / pendingFiles.length) * 100
      }
    } finally {
      fontStore.isConverting = false
      conversionProgress.value = 0
    }
  }

  // Очистка ресурсов
  function cleanup() {
    if (fontWorker) {
      fontWorker.terminate()
      fontWorker = null
    }
  }

  // Автоматическая очистка при размонтировании компонента
  if (process.client) {
    window.addEventListener('beforeunload', cleanup)
  }

  return {
    convertAllFonts,
    convertSingleFile,
    conversionProgress,
    cleanup
  }
}
