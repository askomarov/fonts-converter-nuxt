import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface FontFile {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'converting' | 'converted' | 'error'
  selectedFormat: 'woff' | 'woff2' // Убираем 'both', каждый файл имеет один формат
  convertedFiles?: { format: string; blob: Blob; name: string }[]
  error?: string
}

export type ConversionFormat = 'woff' | 'woff2' | 'both'

export const useFontStore = defineStore('font', () => {
  const files = ref<FontFile[]>([])
  const selectedFormat = ref<ConversionFormat>('woff2')
  const isConverting = ref(false)

  const pendingFiles = computed(() =>
    files.value.filter(f => f.status === 'pending')
  )

  const convertedFiles = computed(() =>
    files.value.filter(f => f.status === 'converted')
  )

  const hasFiles = computed(() => files.value.length > 0)
  const canConvert = computed(() => pendingFiles.value.length > 0 && !isConverting.value)
  const canDownload = computed(() => convertedFiles.value.length > 0)

  function addFiles(newFiles: File[]) {
    const validFiles = newFiles.filter(file =>
      file.name.toLowerCase().endsWith('.ttf') || file.name.toLowerCase().endsWith('.otf')
    )

    validFiles.forEach(file => {
      const id = Math.random().toString(36).substr(2, 9)
      files.value.push({
        id,
        file,
        name: file.name,
        size: file.size,
        status: 'pending',
        selectedFormat: 'woff2' // По умолчанию WOFF2 как более эффективный формат
      })
    })

    return validFiles.length
  }

  function removeFile(id: string) {
    const index = files.value.findIndex(f => f.id === id)
    if (index > -1) {
      files.value.splice(index, 1)
    }
  }

  function updateFileStatus(id: string, status: FontFile['status'], data?: any) {
    const file = files.value.find(f => f.id === id)
    if (file) {
      file.status = status
      if (data) {
        Object.assign(file, data)
      }
    }
  }

  function updateFileFormat(id: string, format: 'woff' | 'woff2') {
    const file = files.value.find(f => f.id === id)
    if (file) {
      file.selectedFormat = format
      // Сброс статуса конвертации при изменении формата
      if (file.status === 'converted') {
        file.status = 'pending'
        file.convertedFiles = undefined
      }
    }
  }

  function clearAll() {
    files.value = []
  }

  function resetConvertedFiles() {
    files.value.forEach(file => {
      if (file.status === 'converted') {
        file.status = 'pending'
        file.convertedFiles = undefined
      }
    })
  }

  return {
    files,
    selectedFormat,
    isConverting,
    pendingFiles,
    convertedFiles,
    hasFiles,
    canConvert,
    canDownload,
    addFiles,
    removeFile,
    updateFileStatus,
    updateFileFormat,
    clearAll,
    resetConvertedFiles
  }
})
