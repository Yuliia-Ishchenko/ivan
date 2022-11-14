<template>
  <div class="preload">
    <ProgressSpinner style="width:80px;height:80px" strokeWidth="4"  animationDuration="4s"/>
  </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';

</script>

<style>
#app .preload{
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.26);
    z-index: 2222222222;
}
#app .p-progress-spinner{
    margin: calc(100vh/2) auto !important;
}
@keyframes p-progress-spinner-color {
    100%,
    0% {
        stroke:var(--menu-bg-color) !important; 
    }
} 

</style>

