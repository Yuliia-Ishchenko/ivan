<template>
  <div class="import">
    <div class="import_step1" >
      <h3 v-if="cableGands==null">You don't have any list of cable glands. Please download the list</h3>
      <h4 v-else>List of cable glands was last uploaded on <span>{{lastLoadData}}</span>. If there are changes, download the latest version.</h4>
      <FileUpload mode="basic" :customUpload="true" name="demo[]" accept=".xlsx" :maxFileSize="1000000" @uploader="onUploadGlands($event)" />
    </div>
    <div class="import_step2" v-if="cableGands!=null">
      <h3>Please, download the cable list</h3>
        <FileUpload mode="basic" :customUpload="true" name="demo[]" accept=".xlsx" :maxFileSize="1000000" @uploader="onUploadCable($event)" />
    </div>
    <div class="import_step3 import_cableCheck" v-if="Cable.Errors.length!=0">
      <h3>! You have empty fields or incorrect diameter format. Please fix it and upload the fixed version</h3>
      <DataTable :value="Cable.Errors" :paginator="true" :rows="20"  class="p-datatable-sm" >
          <Column field="RowExcel" header="Row in Excel"></Column>
          <Column field="Cable" header="Cable"></Column>
          <Column  header="Cabinet From">
          <template #body="slotProps">
                <span v-if="slotProps.data.From==undefined"><i class="pi pi-exclamation-circle" style="color:red;"></i></span> 
                <span>{{slotProps.data.From}}</span> 
            </template>
          </Column>
          <Column header="Cabinet To">
            <template #body="slotProps">
                <span v-if="slotProps.data.To==undefined"><i class="pi pi-exclamation-circle" style="color:red;"></i></span> 
                <span>{{slotProps.data.To}}</span> 
            </template>
          </Column>
          <Column header="Diameter">
            <template #body="slotProps">
                <span v-if="slotProps.data.isNotNumber"><i class="pi pi-exclamation-circle" style="color:red;"></i></span> 
                <span>{{slotProps.data.Diameter}}</span> 
            </template>
          </Column>
      </DataTable>
    </div>
    
    <div class="import_step6 p-datatable-sm" v-if="GeneratedGlands.length!=0" >
      <DataTable :value="GeneratedGlands" :paginator="true" :rows="7" :rowClass="(data)=>data.IsEMC?'rowEMC':''" ref="dt">
        <template #header>
            <div style="text-align: right">
                <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
            </div>
        </template>
          <Column field="Box" header="Box"></Column>
          <Column field="Cable" header="Cable" :sortable="true"></Column>
          <Column field="Diametr" header="Diametr"></Column>
          <Column field="Gland" header="Gland"></Column>
          <Column field="GlandNumber" header="GlandNumber"></Column>
          <Column field="Range" header="Range"></Column>
          <Column field="Manufacture" header="Manufacture"></Column>
          <Column field="Material" header="Material" :sortable="true"></Column>
      </DataTable>
    </div>
    <div class="import_step5" v-if="showBtnGenerate">
      <Button :label="btnGenerateLabel" @click="onGenerateResult" />
    </div>
    <div class="import_step4" v-if="Cable.UniqueBoxes.length!=0">
      <SelectList :data="Cable.UniqueBoxes" :selected="selectedBoxes" IsBox="true" :selectedAll="selectedAllBox" @onSelectItem="onSelectBox"  @onSelectedAllChanged="onChangeSelectAllBox" colemnCount="8">
        Select Box
      </SelectList>
      <div class="import_parameters">
          <SelectList :data="Glands.UniqueManufacture" :selected="selectedManufacture"  @onSelectItem="onSelectManufacture"  colemnCount="4">
            Select manufacturer
          </SelectList>
          <SelectList :data="Glands.UniqueMaterial" :selected="selectedMaterial"  @onSelectItem="onSelectMaterial"  colemnCount="1" v-if="selectedManufacture.length!=0">
            Select material
          </SelectList>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {onMounted, reactive, ref, watch,  computed, onUpdated} from 'vue'
import FileUpload from 'primevue/fileupload';
import DataTable from 'primevue/datatable';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import{format} from 'date-fns'
import * as XLSX from 'xlsx'
import SelectList from '@/components/SelectList.vue'
import formatRelativeWithOptions from 'date-fns/fp/formatRelativeWithOptions/index';

const CableCN = {
  CabinetFrom: 'CabinetFrom',
  CabinetTo: 'CabinetTo',
  CableDesignation: 'CableDesignation',
  OuterDiameter: 'OuterDiameter',
  Shield: 'Shield'
}
const GlandsCN = {
  Range : 'Range',
  Manufacture : "Manufacturer",
  Material : "Product series",
  OrderNumber : "Order number",
  GlandName : "Description",
  EMC_Armoured: "EMC_Armoured"

}
const dt=ref()
const store = GI.useStore()
const selectedManufacture = ref([])
const selectedMaterial = ref([])
const selectedBoxes = ref([])
const selectedAllBox = ref(false)
const GeneratedGlands = ref([])
const showBtnGenerate = computed(()=>{
  return (selectedMaterial.value.length!=0 && selectedBoxes.value.length!=0)
})
const btnGenerateLabel = computed(()=>{return`Generate data for ${selectedBoxes.value.length} boxes`})
const cableGands = ref(JSON.parse(localStorage.getItem('cableGands')))
const lastLoadData = ref(localStorage.getItem('lastLoadCableGands'))
const Glands = ref({GlandsExcelList:cableGands, UniqueManufacture: [], UniqueMaterial:[]})
const Cable = ref({CableExcelList:[], UniqueBoxes:[],Errors:[]})
const columnCabel = ref([])
onMounted(async()=>{
  Glands.value.UniqueManufacture = GetUniqueGlandManufacture();
})
function onUploadGlands(event){
  GeneratedGlands.value=[]
  const f = event.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      let sheetName = workbook.SheetNames[0]
      let worksheet = workbook.Sheets[sheetName];
      var columnName = getColumnHeaders(worksheet);
      if(checkCorrectFile(columnName, GlandsCN)){
        Glands.value.GlandsExcelList = XLSX.utils.sheet_to_json(worksheet);
        addRangeToInt()
        setLocalStorage()
        Glands.value.UniqueManufacture = GetUniqueGlandManufacture();
        Glands.value.UniqueMaterial = GetUniqueGlandMaterial()
      }
      else{
        store.dispatch('showError', {header: "Wrong file", message: "Make sure you have downloaded the correct file"})
      }
     
  };
  reader.readAsArrayBuffer(f);
}
function onUploadCable(event){
  resetData()
  const f = event.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      let sheetName = workbook.SheetNames[0]
      let worksheet = workbook.Sheets[sheetName];
      columnCabel.value = getColumnHeaders(worksheet);
      if(checkCorrectFile(columnCabel.value, CableCN)){
        const Cables = XLSX.utils.sheet_to_json(worksheet);
        if(CheckCableArr(Cables)){
          Cable.value.CableExcelList = Cables.filter(item=>item[CableCN.CabinetFrom]!=item[CableCN.CabinetTo])//without internal cables
          Cable.value.UniqueBoxes = GetUniqueBoxes();
        }
      }
      else{
        store.dispatch('showError', {header: "Wrong file", message: "Make sure you have downloaded the correct file"})
      }
  };
  reader.readAsArrayBuffer(f);
}
function checkCorrectFile(columnNameFile, constColumnName){
  var result = true
  Object.values(constColumnName).forEach(x=>{
    if(!columnNameFile.includes(x)){
      result = false
      return
    }
  })
  return result
}
function addRangeToInt(){
  Glands.value.GlandsExcelList.forEach(item=>{
    var range = []
    if(typeof item[GlandsCN.Range] == 'string'){
      if(item[GlandsCN.Range].includes('-')){
        range = item[GlandsCN.Range].split('-')
      }
      else{
        range[0] = item[GlandsCN.Range]
        range[1] = item[GlandsCN.Range]
      }
    }
    else{
      range[0] = item[GlandsCN.Range]
      range[1] = item[GlandsCN.Range]
    }
    item.RangeFrom = parseFloat(range[0])
    item.RangeTo = parseFloat(range[1])
  })
}
function setLocalStorage(){
      localStorage.setItem('cableGands', JSON.stringify(Glands.value.GlandsExcelList));
      localStorage.setItem('lastLoadCableGands', format(new Date(Date.now()),'dd/MM/yyyy HH:mm'));
      cableGands.value = JSON.parse(localStorage.getItem('cableGands'));
      lastLoadData.value = localStorage.getItem('lastLoadCableGands');
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function GetUniqueBoxes(){
  const tempCabFrom = Cable.value.CableExcelList.map(item=>item[CableCN.CabinetFrom])
  const tempCabTo = Cable.value.CableExcelList.map(item=>item[CableCN.CabinetTo])
  const temp = tempCabFrom.concat(tempCabTo)

  return temp.filter(onlyUnique)
}
function GetUniqueGlandManufacture(){
  const tempArr = Glands.value.GlandsExcelList.map(item=>item[GlandsCN.Manufacture])
  return tempArr.filter(onlyUnique)
}
function GetUniqueGlandMaterial(){
  const glandsByManufacture = Glands.value.GlandsExcelList.filter(x=>selectedManufacture.value.includes(x[GlandsCN.Manufacture]))
  const tempArr = glandsByManufacture.map(item=>item[GlandsCN.Material])
  return tempArr.filter(onlyUnique)
}
function onSelectMaterial(items){
  selectedMaterial.value = items

}
function onSelectBox(items){
  selectedBoxes.value = items
  selectedAllBox.value=selectedBoxes.value.length!=Cable.value.UniqueBoxes.length?false:true
}
function onSelectManufacture(items){
  selectedManufacture.value = items;
  Glands.value.UniqueMaterial = GetUniqueGlandMaterial()
  const tempArr = []
  selectedMaterial.value.forEach(item=>{
    if(Glands.value.UniqueMaterial.includes(item))[
      tempArr.push(item)
    ]
  })
  selectedMaterial.value = tempArr
}
function onChangeSelectAllBox(value){
  selectedAllBox.value=value
  value?selectedBoxes.value = Cable.value.UniqueBoxes:selectedBoxes.value=[]
}
function getColumnHeaders(worksheet){
   const header = []
      const columnCount = XLSX.utils.decode_range(worksheet['!ref']).e.c + 1
      for (let i = 0; i < columnCount; ++i) {
         const colName = worksheet[`${XLSX.utils.encode_col(i)}1`]
         if(colName)
            header[i] = colName.v
      }
      return header;
}
function resetData(){
  Cable.value.UniqueBoxes=[]
  selectedBoxes.value=[]
  // selectedManufacture.value=[]
  // selectedMaterial.value=[]
  GeneratedGlands.value=[]
  columnCabel.value=[]
}
function CheckCableArr(arrCable){
  Cable.value.Errors=[]
  arrCable.forEach(item=>{
    if(item[CableCN.CabinetFrom]==undefined){
      item.isSomeEmpty=true
    }
    if(item[CableCN.CabinetTo]==undefined){
      item.isSomeEmpty=true
    }
    if(item[CableCN.OuterDiameter]==undefined){
      item.isSomeEmpty=true
    }
    if(isNaN(`${item[CableCN.OuterDiameter]}`)){
      item.isNotNumber = true
    }
    if(item.isNotNumber || item.isSomeEmpty){
       Cable.value.Errors.push({
          RowExcel:item["__rowNum__"]+1,
          Cable:item[CableCN.CableDesignation],
          From:item[CableCN.CabinetFrom],
          To:item[CableCN.CabinetTo],
          Diameter:item[CableCN.OuterDiameter],
          isNotNumber: item.isNotNumber
       })
    }
    
  })
  if(Cable.value.Errors.length==0){
      return true
    }
  else{
    return false
  }
}
function exportCSV(){
  dt.value.exportCSV()
}
function onGenerateResult(){
  GeneratedGlands.value=[]
  const cables = Cable.value.CableExcelList.filter(item=>selectedBoxes.value.includes(item[CableCN.CabinetFrom]) || selectedBoxes.value.includes(item[CableCN.CabinetTo]))
  const cablesWiyhoutEMC = cables.filter(item=>item[CableCN.Shield]!="EMC")
  const cableEMC = cables.filter(item=>item[CableCN.Shield]=="EMC")
  const glandsByMaterialAndManufacture = Glands.value.GlandsExcelList.filter(item=>selectedManufacture.value.includes(item[GlandsCN.Manufacture]) && selectedMaterial.value.includes(item[GlandsCN.Material]))
  
  const glandsNotEMC = glandsByMaterialAndManufacture.filter(item=>item[GlandsCN.EMC_Armoured]!="EMC")
  
  const glandsForEMC = Glands.value.GlandsExcelList.filter(item=>item[GlandsCN.EMC_Armoured]=="EMC"&&selectedManufacture.value.includes(item[GlandsCN.Manufacture]))
  Generate(cablesWiyhoutEMC,glandsNotEMC)
  Generate(cableEMC,glandsForEMC)
}
function Generate(cableArr, GlandArr){
  // console.log(cableArr);
  // console.log(GlandArr);
  cableArr.forEach((item)=>{
    const tempMatches = GlandArr.filter(x=>item[CableCN.OuterDiameter]>=x.RangeFrom && item[CableCN.OuterDiameter]< x.RangeTo)
    const GlandWithMin = tempMatches.reduce((min, p) => p.RangeTo < min.RangeTo ? p : min, tempMatches[0])
    GeneratedGlands.value.push({
      Box: selectedBoxes.value.includes(item[CableCN.CabinetFrom])?item[CableCN.CabinetFrom]:item[CableCN.CabinetTo],
      Cable: item[CableCN.CableDesignation],
      Diametr: item[CableCN.OuterDiameter],
      Gland: GlandWithMin==undefined?"":GlandWithMin[GlandsCN.GlandName],
      GlandNumber:GlandWithMin==undefined?"":GlandWithMin[GlandsCN.OrderNumber],
      Range: GlandWithMin==undefined?"":GlandWithMin[GlandsCN.Range],
      Manufacture: GlandWithMin==undefined?"":GlandWithMin[GlandsCN.Manufacture],
      Material:GlandWithMin==undefined?"":GlandWithMin[GlandsCN.Material],
      IsEMC: item[CableCN.Shield]=="EMC"?true:false,
    })
  })
}

</script>
<style lang="scss">
.p-datatable-header{
  padding: 0.3rem 1rem!important;
}
.rowEMC{
  background: rgb(232, 253, 231)!important;
}
.p-datatable-tbody > tr > td{
  padding: 0.5rem 0.5rem!important;
}
.import_cableCheck{
  margin: 3rem 0;
  text-align: left;
  h3{
    color: red;
  }
}
.import_step1{
  span{
    font-size: 18px;
  }
}
.import_step4{
  // margin: 3rem 0;
  display: flex;
  justify-content: space-around;
  .import_parameters{
    width: 500px;
    // margin-left: auto;
    // padding-left: 2rem;
    // border-left: 2px solid rgb(168, 168, 168);
  }
  
}
.import_step5{
    margin: 1rem 0;
  }
.import_step6{
  margin-top: 1rem;
}
</style>