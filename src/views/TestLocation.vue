<template>
  <div class="test-location">
    <div> 
      <h4>{{userLocation}}</h4> 
      <p>Latitude: {{latitude}}</p>
      <p>Longitude: {{longitude}}</p>
      <Button icon="pi pi-external-link" label="Get Location" @click="OnGetLocation($event)" />
    </div>
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {onMounted, reactive, ref, watch,  computed, onUpdated} from 'vue'

const store = GI.useStore()
const userLocation=ref("")
const latitude=ref()
const longitude=ref()
const success = async (position) => {
   console.log(position);
   latitude.value  = position.coords.latitude;
   longitude.value = position.coords.longitude;
   // const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude.value}&lon=${longitude.value}&zoom=25&format=json`
   const url = `https://eu1.locationiq.com/v1/reverse?key=pk.41e0158971d0c569db2d51896c22573b&lat=${latitude.value}&lon=${longitude.value}&format=json`
   fetch(url)
            .then(response=>response.json()).then(data=>{
               console.log(data);
               userLocation.value=`${data.display_name}`
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
      // maximumAge:0, 
      // timeout:5000, 
      enableHighAccuracy: true
   };
   navigator.geolocation.getCurrentPosition( success, error, options);
   
}

</script>