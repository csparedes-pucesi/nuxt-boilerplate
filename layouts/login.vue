<template>
    <div class="custom-background min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="min-w-[367px]">
            <slot/>
        </div>
    </div>
   
</template>

<script setup lang="ts">

</script>

<style scoped>
.custom-background {
    background-image: url('/background-img-login.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.5);
}
</style>