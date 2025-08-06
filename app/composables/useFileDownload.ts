import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { useFontStore } from '@/stores/fontStore'

export function useFileDownload() {
  const fontStore = useFontStore()

  function downloadFile(blob: Blob, filename: string) {
    saveAs(blob, filename)
  }

  async function downloadAllAsZip() {
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
      saveAs(zipBlob, 'converted-fonts.zip')
    } catch (error) {
      console.error('Failed to create zip file:', error)
    }
  }

  return {
    downloadFile,
    downloadAllAsZip
  }
}