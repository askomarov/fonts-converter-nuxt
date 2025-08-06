<script setup lang="ts">
import { computed } from 'vue'
import type { FontFile } from '@/stores/fontStore'
import { LucideCheckCircle, LucideClock, LucideLoader2, LucideXCircle } from '#components';

interface Props {
  status: FontFile['status']
}

const props = defineProps<Props>()

const statusConfig = {
  pending: {
    text: 'Pending',
    classes: 'bg-gray-100 text-gray-700',
    icon: LucideClock
  },
  converting: {
    text: 'Converting',
    classes: 'bg-blue-100 text-blue-700',
    icon: LucideLoader2
  },
  converted: {
    text: 'Ready',
    classes: 'bg-green-100 text-green-700',
    icon: LucideCheckCircle
  },
  error: {
    text: 'Error',
    classes: 'bg-red-100 text-red-700',
    icon: LucideXCircle
  }
}

const statusClasses = computed(() => statusConfig[props.status].classes)
const statusText = computed(() => statusConfig[props.status].text)
const statusIcon = computed(() => statusConfig[props.status].icon)
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    <component :is="statusIcon" class="w-3 h-3 mr-1" />
    {{ statusText }}
  </span>
</template>
