<template>
    <button @click="navigateToPage">{{ label }}</button>
</template>
  
<script setup lang="ts">
import { router } from '../main';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
});

const navigateToPage = () => {
    // Use Vue Router to navigate to the specified page
    router.push(props.to);
};
</script>
  