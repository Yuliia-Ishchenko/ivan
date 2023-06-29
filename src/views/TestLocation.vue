<template>
  <div class="test-location">
    <div> 
      <h3>{{userLocation}}</h3> 
      <Button icon="pi pi-external-link" label="Get Location" @click="OnGetLocation($event)" />
    </div>
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {onMounted, reactive, ref, watch,  computed, onUpdated} from 'vue'

const store = GI.useStore()
const userLocation=ref("")
const success = async (position) => {
   const latitude  = position.coords.latitude;
   const longitude = position.coords.longitude;
   const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=25&format=json`
   await fetch(url)
            .then(response=>response.json()).then(data=>{
               console.log(data);
               userLocation.value=`City: ${data.address.city}  Street: ${data.address.road}  House: ${data.address.house_number}`
            })
            .catch(error=>console.log(error));

};

const error = (err) => {
   console.log(err)
};


async function OnGetLocation(event){
   if(!navigator.geolocation){
      console.log("Geolocation API is not supported in your browser.");
   }
   const options = {
      maximumAge:0, timeout:5000, enableHighAccuracy: true
   };
   await navigator.geolocation.getCurrentPosition(await success, error, options);
   
}

</script>