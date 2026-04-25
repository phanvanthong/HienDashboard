import { ref } from 'vue'

export const revenueData = ref([])

// Tải từ public/revenue.json — file tĩnh, Vite không cache, F5 luôn đọc mới từ disk
fetch('/revenue.json')
  .then(r => r.json())
  .then(rows => { revenueData.value = rows })
  .catch(console.error)
