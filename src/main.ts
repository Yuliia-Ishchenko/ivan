import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Preload from "@/components/Preload.vue"
import ErrorModal from "@/components/ErrorModal.vue"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Chart from 'primevue/chart';
import Calendar from 'primevue/calendar';

import '@/assets/css/variables.css'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'

createApp(App)
   .use(store)
   .use(router)
   .use(PrimeVue)
   .component('Button', Button)
   .component('InputText', InputText)
   .component('ErrorModal', ErrorModal)
   .component('DataTable', DataTable)
   .component('Preload', Preload)
   .component('Column', Column)
   .component('Row', Row)
   .component('Chart', Chart)
   .component('Calendar', Calendar)
   .mount('#app')
