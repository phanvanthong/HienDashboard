import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels,
)

// Disable datalabels globally; enable per-chart as needed
ChartJS.defaults.plugins.datalabels.display = false

window.__BUILD_TIME__ = __BUILD_TIME__

createApp(App).mount('#app')
