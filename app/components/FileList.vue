<script setup lang="ts">
import { ref } from "vue";
import { LucideFileText, LucideX } from "#components";
import { useFontStore } from "@/stores/fontStore";
import { useFileDownload } from "@/composables/useFileDownload";
import { useFontConverter } from "@/composables/useFontConverter";
import StatusBadge from "./StatusBadge.vue";
import type { FontFile } from "@/stores/fontStore";

const fontStore = useFontStore();
const { downloadFile } = useFileDownload();
const { convertSingleFile } = useFontConverter();

const convertingFileId = ref<string | null>(null);

async function convertFile(fileId: string) {
  try {
    convertingFileId.value = fileId;
    await convertSingleFile(fileId);
  } catch (error) {
    console.error("Conversion error:", error);
  } finally {
    convertingFileId.value = null;
  }
}

async function downloadAndReset(file: FontFile) {
  if (file.convertedFiles && file.convertedFiles[0]) {
    // Скачиваем файл
    downloadFile(file.convertedFiles[0].blob, file.convertedFiles[0].name);

    // Сбрасываем статус обратно в pending для возможности повторной конвертации
    fontStore.updateFileStatus(file.id, "pending");
    file.convertedFiles = undefined;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>

<template>
  <div v-if="fontStore.hasFiles" class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">
      Uploaded Files ({{ fontStore.files.length }})
    </h3>

    <div class="space-y-3">
      <div
        v-for="file in fontStore.files"
        :key="file.id"
        class="p-4 bg-white flex items-center rounded-lg border border-gray-200 animate-slide-up"
      >
        <div class="flex flex-1 items-center flex-wrap gap-4 justify-between">
          <!-- Информация о файле -->
          <div class="flex items-center space-x-3 flex-[1_0_auto] min-w-0">
            <div class="flex-shrink-0">
              <LucideFileText class="w-5 h-5 text-blue-600" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ file.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>

          <!-- Селект формата (только для pending файлов) -->
          <div
            v-if="file.status === 'pending'"
            class="flex items-center space-x-2"
          >
            <select
              :value="file.selectedFormat"
              @change="
                fontStore.updateFileFormat(
                  file.id,
                  ($event.target as HTMLSelectElement).value as 'woff' | 'woff2'
                )
              "
              class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="woff">WOFF</option>
              <option value="woff2">WOFF2</option>
            </select>
          </div>

          <!-- Показать выбранный формат для других статусов -->
          <div v-else class="text-xs text-gray-600">
            Format:
            <span class="font-medium">{{ file.selectedFormat.toUpperCase() }}</span>
          </div>

          <!-- Статус -->
          <div class="flex-shrink-0">
            <StatusBadge :status="file.status" />
          </div>


                    <!-- Кнопки действий -->
          <div class="flex items-center space-x-2 ml-auto">
            <!-- Кнопка конвертации -->
            <button
              v-if="file.status === 'pending'"
              @click="convertFile(file.id)"
              :disabled="convertingFileId === file.id"
              class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{
                convertingFileId === file.id
                  ? 'Converting...'
                  : 'Convert'
              }}
            </button>

            <!-- Кнопка скачивания -->
            <button
              v-else-if="file.status === 'converted' && file.convertedFiles && file.convertedFiles[0]"
              @click="downloadAndReset(file)"
              class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Download {{ file.convertedFiles[0].format.toUpperCase() }}
            </button>

            <!-- Кнопка повтора при ошибке -->
            <button
              v-else-if="file.status === 'error'"
              @click="convertFile(file.id)"
              :disabled="convertingFileId === file.id"
              class="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              Retry
            </button>

            <!-- Кнопка удаления -->
            <button
              v-if="file.status !== 'converting'"
              @click="fontStore.removeFile(file.id)"
              class="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete file"
            >
              <LucideX class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Сообщение об ошибке -->
        <div
          v-if="file.status === 'error' && file.error"
          class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded"
        >
          {{ file.error }}
        </div>
      </div>
    </div>

    <button
      v-if="fontStore.hasFiles"
      @click="fontStore.clearAll"
      class="text-sm text-red-600 hover:text-red-700 transition-colors"
    >
      Clear all files
    </button>
  </div>
</template>

