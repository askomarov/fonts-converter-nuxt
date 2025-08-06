<script setup lang="ts">
import DropZone from '@/components/DropZone.vue'
import FileList from '@/components/FileList.vue';
import ConversionControls from '@/components/ConversionControls.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <p class="text-3xl font-bold text-gray-900 mb-2">Font Converter</p>
        <h1 class="text-gray-600">
          Convert TTF and OTF fonts to WOFF and WOFF2 formats
        </h1>
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
        <p>Conversion happens locally in your browser</p>
      </footer>
    </div>
  </div>
</template>


