<template>
  <div class="home" v-show="TestDataList.length!=0">
    <h1>Test Page</h1>
    <div class="timepicker">
      <Calendar v-model="range.dateFrom" :showTime="true"/>
      <Calendar v-model="range.dateTo" :showTime="true"/>
      <Button icon="pi pi-check" @click="changeDateRange" class="p-button-raised"/>
      <div class="timepicker_btn_export">
        <!-- <Button label="Export" class="p-button-raised p-button-success" @click="onExport"/> -->
        <JsonCSV
            :data="TestDataList"
            name="Exort"
            :delimiter="';'"
            :separator-excel="true"
        >
        <Button :label="`Export`"  class="p-button-raised p-button-success"/>
      </JsonCSV>
      </div>
    </div>
    <div class="report">
      <DataTable :value="TestDataList" :paginator="true" class="p-datatable-customers" :rows="10">
          <Column field="time" header="Cas" :sortable="true">
            <template #body="{data}">
                {{format(new Date(data.time), 'yyyy-MM-dd HH:mm')}}
            </template>
          </Column>
          <Column field="value" header="Value"></Column>
      </DataTable>
      <Chart type="bar" :data="basicData" />
    </div>
  </div>
</template>

<script setup>
import * as GI from '@/utils/GlobalImport'
import {onMounted, reactive, ref, watch,  computed, onUpdated} from 'vue'
import {format, addDays} from "date-fns"
import JsonCSV from 'vue-json-csv/src/JsonCSV.vue'


const store = GI.useStore()
const TestDataList = computed(()=>store.getters.getTestData)
const basicData = ref()
const testDate= new Date(2022,9,5)
const range = ref({
    dateFrom: addDays(testDate,-1),
    dateTo: testDate,
})

//!
const controller = new AbortController()
const signal = controller.signal
GI.onBeforeRouteLeave(async ()=>{
  controller.abort()
})//!

onMounted(async()=>{
  // await fetchData()
})
watch(()=>TestDataList.value, ()=>{
  getDataForChart()
})

async function fetchData(){
  store.commit('setFetchingData', true)
  await store.dispatch('getTestDataByRange', { Range: {from: range.value.dateFrom.toISOString(), to: range.value.dateTo.toISOString()}, 
                                               signal: signal})
  store.commit('setFetchingData', false)
}

async function changeDateRange(){
  await fetchData()
}


function getDataForChart(){
  basicData.value = {
				labels: TestDataList.value.map(x=>format(new Date(x.time), 'yyyy-MM-dd HH:mm')),
				datasets: [
					{
						label: 'Test data',
						backgroundColor: '#42A5F5',
						data: TestDataList.value.map(x=>x.value)
					},
				]
			}
}
</script>

<style lang="scss">
.timepicker{
  margin: 2rem 0;
  display:flex;
  &_btn_export{
    margin-left: auto;
  }
}
.timepicker > span{
  margin-right: 1rem;
}
.report{
  display: flex;
  width: 100%;
  justify-content: space-between;
  & .p-chart{
    width:65%;
  }
  & .p-datatable{
    width: inherit;
    max-width: 35%;
  }
}

</style>