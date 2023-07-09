<template>
    <div>
      <p>{{ message }}</p>
      <button @click="incrementCounter">Increment Counter</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, Ref } from 'vue';
  
  // Props
  const props = defineProps({
    helloText: {
      type: String,
      default: 'Hello World',
    },
  });
  
  // Variables
  const counter: Ref<number> = ref(0);
  const message: Ref<string> = computed(() => `${props.helloText}! Counter: ${counter.value}`);
  
  // Functions
  function incrementCounter(): void {
    counter.value++;
  }
  
  // Hooks
  onMounted((): void => {
    // Perform some actions when the component is mounted
  });
  
  </script>
  