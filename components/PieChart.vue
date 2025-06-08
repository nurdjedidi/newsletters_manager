<template>
  <Pie
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
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}
</script>