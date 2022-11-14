<template>
  <div class="about">
    <div> 
      <h3>Import Excel File:</h3> 
      <FileUpload mode="basic" :customUpload="true" name="demo[]" accept=".xlsx" :maxFileSize="1000000" @uploader="onUpload($event)" />
    </div>
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {onMounted, reactive, ref, watch,  computed, onUpdated} from 'vue'
import FileUpload from 'primevue/fileupload';
import * as XLSX from 'xlsx'

const store = GI.useStore()

onMounted(async()=>{
  await store.dispatch('getWeatherForecast')
})
function onUpload(event){
  const f = event.files[0];
  console.log(f);
  var reader = new FileReader();
  reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      let sheetName = workbook.SheetNames[0]
      console.log(workbook.SheetNames);
      /* DO SOMETHING WITH workbook HERE */
      let worksheet = workbook.Sheets[sheetName];
      console.log(XLSX.utils.sheet_to_json(worksheet));
  };
  reader.readAsArrayBuffer(f);
}

</script>