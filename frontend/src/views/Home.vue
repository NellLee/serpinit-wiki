<template>
    <div class="home">
      <h1>Welcome to the official Website of Serpinit</h1>
      <ButtonLink label="Go to Wiki" to="/wiki" />
      <ButtonLink label="Go to Timeline" to="/timeline" />
    </div>
  </template>
  
  <script setup lang="ts">
  import ButtonLink from '../components/ButtonLink.vue'; // Update the path
  
  // Add imports related to your router setup
  // import { router } from '../main';
  
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  