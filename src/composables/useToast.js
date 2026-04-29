import { ref } from 'vue'

const message = ref('')
const type = ref('success')
let timer = null

export function showToast(msg, t = 'success', duration = 2800) {
  if (timer) clearTimeout(timer)
  message.value = msg
  type.value = t
  timer = setTimeout(() => { message.value = '' }, duration)
}

export const toastMessage = message
export const toastType = type
