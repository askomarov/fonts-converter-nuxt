import JSZip from 'jszip'
import { useFontStore } from '@/stores/fontStore'

export function useFileDownload() {
  const fontStore = useFontStore()

  async function downloadFile(blob: Blob, filename: string) {
    if (process.client) {
      try {
        // Попробуем новый ESM синтаксис
        const fileSaver = await import('file-saver')
        const saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default
        if (typeof saveAs === 'function') {
          saveAs(blob, filename)
        } else {
          // Fallback: создание ссылки для скачивания
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Failed to load file-saver:', error)
        // Fallback метод
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }
  }

  async function downloadAllAsZip() {
    if (!process.client) return

    const convertedFiles = fontStore.convertedFiles
    if (convertedFiles.length === 0) return

    const zip = new JSZip()

    convertedFiles.forEach(fontFile => {
      if (fontFile.convertedFiles) {
        fontFile.convertedFiles.forEach(converted => {
          zip.file(converted.name, converted.blob)
        })
      }
    })

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      await downloadFile(zipBlob, 'converted-fonts.zip')
    } catch (error) {
      console.error('Failed to create zip file:', error)
    }
  }

  return {
    downloadFile,
    downloadAllAsZip
  }
}
