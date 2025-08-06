<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFontStore } from '@/stores/fontStore'
import { useMotion } from '@vueuse/motion'

const fontStore = useFontStore()
const dropZoneRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const isDragOver = ref(false)

const { apply } = useMotion(dropZoneRef, {
  initial: { scale: 1 },
  enter: { scale: 1 },
  hover: { scale: 1.02 },
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
    target.value = '' // Reset input
  }
}

function handleFiles(files: File[]) {
  const addedCount = fontStore.addFiles(files)

  if (addedCount < files.length) {
    const rejectedCount = files.length - addedCount
    console.warn(`${rejectedCount} files rejected. Only TTF and OTF formats are supported.`)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false

  const files = Array.from(event.dataTransfer?.files || [])
  handleFiles(files)
}

onMounted(() => {
  const element = dropZoneRef.value
  if (element) {
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('drop', handleDrop)
  }
})

onUnmounted(() => {
  const element = dropZoneRef.value
  if (element) {
    element.removeEventListener('dragover', handleDragOver)
    element.removeEventListener('dragleave', handleDragLeave)
    element.removeEventListener('drop', handleDrop)
  }
})
</script>

<template>
  <div
    ref="dropZoneRef"
    class="drop-zone bg-white p-4 rounded-3xl"
    :class="{ 'drag-over': isDragOver }"
    @click="triggerFileInput"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept=".ttf,.otf"
      class="hidden"
      @change="handleFileSelect"
    >

    <div class="flex flex-col items-center space-y-4">
      <div class="p-4 bg-gray-100 rounded-full">
        <LucideUpload class="w-8 h-8 text-gray-600" />
      </div>

      <div class="text-center">
        <p class="text-lg font-medium text-gray-900 mb-2">
          Drag fonts here
        </p>
        <p class="text-sm text-gray-500 mb-4">
          or click to select files
        </p>
        <p class="text-xs text-gray-400">
          Supported formats: TTF, OTF
        </p>
      </div>
    </div>
  </div>
</template>
