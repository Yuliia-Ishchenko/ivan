<template>
  <Menubar :model="menuModel" class="menubar">
    <template #end>
      <a href="https://www.ingeteam.cz/">
        <div class="nav-menu-logo"></div>
      </a>
    </template>
  </Menubar>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
  import { ref, computed, watch } from 'vue'
  import Menubar from "primevue/menubar";
  import "@/assets/css/menu-bar.css";
  import {loggedModel, logoutModel} from '@/utils'

  const route = GI.useRoute();
  const router = GI.useRouter();
  const store = GI.useStore()
  const menuModel = ref()

  watch(()=>route.name,()=>{
    menuModel.value = route.name=='Login'?logoutModel:loggedModel
  })
  
  
</script>


<style lang="scss">
.nav-menu-logo {
  width: 10rem;
  height: 3rem;
  background-image: url('../assets/img/IngeteamLogo-white.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 0.6rem;
}
@media (max-width: 500px) {
  .nav-menu-logo {
    width: 8rem;
  }
}
.menubar {
  position: fixed !important;
  top: 0px;
  left: 0px;
  right: 0px;
  border-radius: 0% !important;
  z-index: 4;

  .p-submenu-list{
    width: auto !important;
  }
}
.hideBtn a{
  opacity: 0;
  pointer-events: none;
}
.disconnect {
    background: #a00f2566;
    pointer-events: none;
}

</style>

