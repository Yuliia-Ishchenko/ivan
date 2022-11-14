<template>
  <div>
    <Preload v-if="isFetchingData" />
    <ErrorModal/>
    <div id="nav">
      <Menu ref="menuComp" />
    </div>
    <main>
      <router-view />
    </main>
    <!-- <div class="footer">
      <Footer />
    </div> -->
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import { addMinutes } from 'date-fns'
import { ref, computed, onMounted } from 'vue'
import Menu from '@/components/Menu.vue'

const store = GI.useStore()
const menuComp = ref(Menu)
const isFetchingData = computed(()=>store.getters.isFetchingData)
store.dispatch("reload")
onMounted(()=>{
  // checkTokenExpire()
})

function checkTokenExpire(){
  setInterval(()=>{
    const tokenExpire = store.getters.getUserInfo.expires
      if(tokenExpire !== ""){
        // console.log(new Date(tokenExpire*1000), addMinutes(new Date(), 2));
        if(new Date(tokenExpire*1000)<addMinutes(new Date(), 2)){
          const token = localStorage.getItem('user');
          const refreshToken = localStorage.getItem('refresh_token');
          store.dispatch("refreshToken", {
            access_Token: token.replace('"', '').slice(0, -1), 
            refresh_Token: refreshToken==null?"":refreshToken.replace('"', '').slice(0, -1)
            })
        }
      }
  }, 55000);
  
  
}

</script>

<style lang="scss">
main {
  // max-width: 90%;
  position:relative;
  min-width: fit-content;
  margin: auto;
  padding-top: 50px;
  padding-bottom: 20px;
  
}
@media only screen  and (min-width: 960px) and (max-width: 1084px){
    main {
      padding-top: 60px;
    }
  }

 .p-dialog-header{
  background: #d32f2f !important;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem !important;
  span{
    color: white !important;
    font-weight: bold;
  }
  .p-dialog-header-icon:hover {
    border-color: transparent;
      background: #e9ecef;
    span{
      color: #495057 !important;
      
    }
    
}
} 
.p-dialog-content{
  padding-top: 1.2rem !important;
}
</style>
