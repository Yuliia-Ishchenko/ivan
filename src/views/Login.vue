<template>
  <form @submit.prevent="login">
    <h2>Přihlášení</h2>
    <span class="p-input-icon-left">
      <i class="pi pi-user" />
      <InputText 
        type="text" 
        v-model="username" 
        placeholder="Uživatelské jméno" 
        class="login-input"
      />
    </span>

    <br>

    <span class="p-input-icon-left">
      <i class="pi pi-lock" style="z-index: 1"/>
      <Password 
        v-model="password" 
        placeholder="Heslo" 
        :feedback="false" 
        toggleMask
        v-on:keyup.enter="login"
        class="login-input"
      ></Password>
    </span>

    <br>
    <Button label="Přihlásit se" class="p-button-danger-login" @click="login" />
    
  </form>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {defineProps, watch, defineEmits, ref, computed, reactive} from 'vue'

import Password from 'primevue/password';

const store = GI.useStore()
const router = GI.useRouter()
const route = GI.useRoute()
const username = ref("");
const password = ref("");
const isAuthenticated=computed(()=>store.getters.getAuthStatus)

store.dispatch('logout');

watch(()=>isAuthenticated.value, ()=>{
  if (isAuthenticated.value) {
    const reditectTo = { name: "Home" };
    router.replace(reditectTo);
  }
})
const login = async () => {
  store.commit('setFetchingData', true)
  await store.dispatch('login', {
    UserName: username.value,
    Password: password.value,
  });
  store.commit('setFetchingData', false)
  
}

</script>

<style >
  #app .p-button-danger-login {
    color: #ffffff;
    background: var(--primnav-li-hover);
    border: 1px solid var(--primnav-li-hover);
    width: 216px;
    margin-top: 5px;
  }
  #app .p-button-danger-login:hover {
    background: var(--menu-bg-color);
  }
  #app .p-input-icon-right > .p-inputtext {
    padding-left: 2rem;
    width: inherit;
    /* padding-right: 1.2rem; */
  }
  #app .login-input {
    width: 247px;
  }
  #app .p-input-icon-left{
    margin-bottom: 8px;
  }
</style>