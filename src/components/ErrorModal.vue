<template>
  <Dialog :header="header" :visible="showError" :style="{width: '60vw'}" :modal="true" :closable="false" class="modalError">
    <p class="p-m-0">
      {{ message }}
    </p>
    <template #footer>
      <Button label="OK" @click="close" class="p-button-danger modalBtn" autofocus />
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core';


  
const store = useStore()
const userInfo = computed(() => store.getters.getUserInfo);
const showError = computed(() => {return store.getters.showError})
const authStatus = computed(() => {return store.getters.getAuthStatus;});
const header = computed(() => { return store.getters.errorHeader })
const message = computed(() => { return store.getters.errorMessage })

const close = () => {
  store.dispatch("closeError");
}

  

</script>

<style>
.modalHeader {
  width: '80vw';
  background-color: #D32F2F;
  color: white;
}
.modalBtn {
  min-width: 100px;
  min-height: 35px;
}

</style>