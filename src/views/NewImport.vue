<template>
<div class="p-4">
<h2 class="text-xl font-bold mb-4">IO List Generator</h2>
 
    <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
 
    <div v-if="ioList.length > 0" class="mt-6">
<h3 class="text-lg font-semibold mb-2">Generated IO List</h3>
 
      <button
        @click="downloadExcel"
        class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
        Download as Excel
</button>
 
      <table class="table-auto border border-collapse w-full text-sm">
<thead>
<tr class="bg-gray-100">
<th class="border px-2 py-1">RIO</th>
<th class="border px-2 py-1">Card</th>
<th class="border px-2 py-1">Channel</th>
<th class="border px-2 py-1">Signal Name</th>
<th class="border px-2 py-1">Description</th>
<th class="border px-2 py-1">Type</th>
</tr>
</thead>
<tbody>
<tr v-for="(row, index) in ioList" :key="index">
<td class="border px-2 py-1">{{ row.RIO }}</td>
<td class="border px-2 py-1">{{ row.card_designation }}</td>
<td class="border px-2 py-1">{{ row.channel_number }}</td>
<td class="border px-2 py-1">{{ row.signal_name }}</td>
<td class="border px-2 py-1">{{ row.signal_description }}</td>
<td class="border px-2 py-1">{{ row.signal_type }}</td>
</tr>
</tbody>
</table>
</div>
</div>
</template>
 
<script setup>
import * as XLSX from 'xlsx'
import { utils as XLSXUtils, writeFile } from 'xlsx'
import { ref } from 'vue'
 
const ioList = ref([])
 
const cardCapacity = {
  'DI': 8, 'DO': 8, 'F-DI': 8, 'F-DO': 8,
  'AI_HART': 4, 'AI': 2, 'SAI': 4, 'AO': 4
}
 
const cardStartAddress = {
  'DI': 101, 'DO': 121, 'AI': 141, 'AI_HART': 151,
  'AO': 161, 'F-DI': 171, 'F-DO': 181, 'SAI': 191
}
 
function extractPrefix(name) {
  return name && name.split('_')[0] || ''
}
 
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
 
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
 
  const sensors = XLSX.utils.sheet_to_json(workbook.Sheets['Sensors'])
  const sensorTypes = XLSX.utils.sheet_to_json(workbook.Sheets['Sensors Type'])
 
  const merged = sensors.map(sensor => {
    const sensorType = sensorTypes.find(st => st.Sensors_Type === sensor.Sensors_Type)
    return { ...sensor, ...sensorType }
  })
 
  const flatSignals = []
 
  merged.forEach(row => {
    for (let i = 1; i <= 27; i++) {
      const name = row[`Signal_${i}_name`]
      const desc = row[`Signal_${i}_desc`]
      const type = row[`Signal_${i}_IO_Type`]
 
      if (name && type) {
        flatSignals.push({
          RIO: row.RIO,
          signal_type: type,
          signal_name: `${row.Tag}_${name}`,
          signal_description: `${row.Description}${desc ? ' - ' + desc : ''}`,
          signal_prefix: extractPrefix(`${row.Tag}_${name}`)
        })
      }
    }
  })
 
  // Sort signals
  flatSignals.sort((a, b) => {
    if (a.RIO !== b.RIO) return a.RIO.localeCompare(b.RIO)
    if (a.signal_type !== b.signal_type) return a.signal_type.localeCompare(b.signal_type)
    return a.signal_prefix.localeCompare(b.signal_prefix)
  })
 
  const cardCounters = { ...cardStartAddress }
  const cardTrackers = {}
  const output = []
 
  flatSignals.forEach(signal => {
    const type = signal.signal_type
    const capacity = cardCapacity[type]
    const key = `${signal.RIO}_${type}`
 
    if (!cardTrackers[key]) {
      cardTrackers[key] = {
        cards: [],
        currentCard: null,
        used: 0
      }
    }
 
    const tracker = cardTrackers[key]
 
    if (!tracker.currentCard || tracker.used >= capacity) {
      const cardId = cardCounters[type]++
      const newCard = {
        card_designation: cardId,
        signals: [],
        capacity,
        RIO: signal.RIO,
        type
      }
      tracker.cards.push(newCard)
      tracker.currentCard = newCard
      tracker.used = 0
    }
 
    const current = tracker.currentCard
    current.signals.push(signal)
    tracker.used += 1
  })
 
  // Assign channels & add spares
  Object.values(cardTrackers).forEach(tracker => {
    tracker.cards.forEach(card => {
      card.signals.forEach((sig, idx) => {
        output.push({
          ...sig,
          card_designation: card.card_designation,
          channel_number: idx
        })
      })
 
      const spareCount = card.capacity - card.signals.length
      for (let i = 0; i < spareCount; i++) {
        output.push({
          RIO: card.RIO,
          card_designation: card.card_designation,
          channel_number: card.signals.length + i,
          signal_name: `SPARE_${card.card_designation}_CH${card.signals.length + i}`,
          signal_description: 'SPARE',
          signal_type: card.type
        })
      }
    })
  })
 
  ioList.value = output
}
 
function downloadExcel() {
  const ws = XLSXUtils.json_to_sheet(ioList.value)
  const wb = XLSXUtils.book_new()
  XLSXUtils.book_append_sheet(wb, ws, 'IO LIST')
  writeFile(wb, 'IO_LIST.xlsx')
}
</script>
 
<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
}
</style>