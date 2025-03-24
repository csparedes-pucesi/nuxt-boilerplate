<template>
  <div
    class="relative min-h-screen custom-background flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <!-- Contenido de página (slot) -->
    <div class="min-w-[367px] z-10">
      <slot />
    </div>

  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.custom-background {
  background-image: url('/background-img-login.jpg');
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.5);
}
</style>
