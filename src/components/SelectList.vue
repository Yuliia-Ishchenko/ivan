<template>
   <div class="import_selectList">
   <h4><slot></slot></h4>
      <div class="all_check" v-if="IsBox">
         <Checkbox inputId="binary" v-model="lSelectedAll" :binary="true" @change="emit('onSelectedAllChanged', lSelectedAll)"/>
         <label for="binary">Select All</label>
      </div>
      <div class="import_selectList-check" :style="{ display: 'grid', gridTemplateColumns: 'repeat('+colemnCount+', 1fr)'}">
         <div v-for="item of data" :key="item" class="field-checkbox ">
            <Checkbox :inputId="item" name="item" :value="item" v-model="selectedItem" @change="onChangeItem"/>
            <label :for="item">{{item}}</label>
         </div>
      </div>
   </div>
</template>

<script setup>
import {defineProps, defineEmits, ref, computed, reactive, watch} from 'vue'
import * as GI from '@/utils/GlobalImport'
import Checkbox from 'primevue/checkbox';

const props = defineProps({
  data: Object,
  selected:[],
  selectedAll:Boolean,
  colemnCount: String,
  IsBox:Boolean
})
watch(()=>props.selected, ()=>props.selected!=selectedItem.value?selectedItem.value=props.selected:null)
watch(()=>props.selectedAll, ()=>props.selectedAll!=lSelectedAll.value?lSelectedAll.value=props.selectedAll:null)
const selectedItem = ref(props.selected)
const lSelectedAll = ref(props.selectedAll)
const emit = defineEmits(['onSelectItem', "onSelectedAllChanged"])
function onChangeItem(){
   emit('onSelectItem', selectedItem.value)
}
</script>

<style lang="scss">
.all_check{
   margin-bottom: 2rem;
   text-align: left;
   label{
      margin-left: 0.5rem;
      font-weight: bold;
   }
}
// .import_selectList{
//    display: flex;
//    flex-direction: column;
// }

</style>