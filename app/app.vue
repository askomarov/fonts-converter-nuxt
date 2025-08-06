<script setup lang="ts">
import { useFontStore } from '@/stores/fontStore';
import DropZone from '@/components/DropZone.vue'
import FileList from '@/components/FileList.vue';
import ConversionControls from '@/components/ConversionControls.vue';

const fontStore = useFontStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Конвертер шрифтов</h1>
        <p class="text-gray-600">
          Конвертируйте TTF и OTF шрифты в WOFF и WOFF2 форматы
        </p>
      </div>

      <!-- Main Content -->
      <div class="space-y-8 mb-6">
        <!-- Drop Zone -->
        <div class="card">
          <DropZone />
        </div>

        <!-- File List -->
        <FileList />
      </div>


      <!-- Download All Controls -->
      <ConversionControls />
      <!-- Footer -->
      <footer class="mt-16 text-center text-sm text-gray-500">
        <p>Конвертация происходит локально в вашем браузере</p>
      </footer>
    </div>
  </div>
</template>


