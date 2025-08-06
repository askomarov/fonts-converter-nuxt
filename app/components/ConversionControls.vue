<script setup lang="ts">
import { LucideCheckCircle, LucideDownload } from '#components'
import { useFontStore } from '@/stores/fontStore'
import { useFileDownload } from '@/composables/useFileDownload'

const fontStore = useFontStore()
const { downloadAllAsZip } = useFileDownload()
</script>

<template>
  <div v-if="fontStore.convertedFiles.length > 0" class="card">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <LucideCheckCircle class="w-5 h-5 text-green-600" />
        <span class="text-sm text-gray-700">
          Готово к скачиванию: {{ fontStore.convertedFiles.length }} файл(ов)
        </span>
      </div>

      <button
        @click="downloadAllAsZip"
        class="btn-primary flex items-center space-x-2"
      >
        <LucideDownload class="w-4 h-4" />
        <span>Скачать всё архивом</span>
      </button>
    </div>
  </div>
</template>

