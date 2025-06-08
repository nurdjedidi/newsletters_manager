<template>
  <Line
    v-if="chartData"
    :data="chartData"
    :options="chartOptions"
  />
  <div v-else class="d-flex justify-center align-center" style="height: 100%">
    <p>No data available</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Count'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  }
}
</script>