<template>
  <div class="import-wrap">
    <input
      type="file"
      accept=".xlsx,.xls"
      ref="fileInput"
      style="display:none"
      @change="handleFile"
    />
    <button class="import-btn" @click="fileInput.click()" :disabled="loading">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 2v8M5 7l3 3 3-3"/>
        <path d="M2 11v1.5A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5V11"/>
      </svg>
      {{ loading ? 'Đang xử lý...' : 'Nhập dữ liệu' }}
    </button>

    <!-- Error Modal -->
    <Teleport to="body">
      <div v-if="showError" class="ie-overlay" @click.self="closeError">
        <div class="ie-card">
          <div class="ie-header">
            <svg class="ie-icon" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 class="ie-title">Thiếu cột dữ liệu</h3>
          </div>
          <p class="ie-desc">
            File Excel thiếu <strong>{{ errorData.missing.length }}</strong> cột bắt buộc. Vui lòng bổ sung các cột sau và nhập lại:
          </p>
          <ul class="ie-list">
            <li v-for="col in errorData.missing" :key="col.excel" class="ie-item">
              <span class="ie-col-name">"{{ col.excel }}"</span>
              <span class="ie-col-used">Dùng bởi: {{ col.charts.join(' · ') }}</span>
            </li>
          </ul>
          <div class="ie-footer">
            <button class="ie-btn-retry" @click="retry">Chọn file khác</button>
            <button class="ie-btn-close" @click="closeError">Đóng</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Empty file error -->
    <Teleport to="body">
      <div v-if="showEmpty" class="ie-overlay" @click.self="showEmpty = false">
        <div class="ie-card ie-card-sm">
          <div class="ie-header">
            <svg class="ie-icon" viewBox="0 0 24 24" fill="none" stroke="#ff9500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3 class="ie-title">File trống</h3>
          </div>
          <p class="ie-desc">File Excel không có dữ liệu. Vui lòng kiểm tra lại file.</p>
          <div class="ie-footer">
            <button class="ie-btn-retry" @click="retryEmpty">Chọn file khác</button>
            <button class="ie-btn-close" @click="showEmpty = false">Đóng</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div v-if="showSuccess" class="ie-toast">
          <svg viewBox="0 0 16 16" fill="none" stroke="#34c759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="8" r="7"/>
            <path d="M5 8l2 2 4-4"/>
          </svg>
          {{ successMsg }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { parseExcel } from '../../utils/excelParser.js'
import { revenueData } from '../../store/dataStore.js'

const fileInput  = ref(null)
const loading    = ref(false)
const showError  = ref(false)
const showEmpty  = ref(false)
const showSuccess = ref(false)
const successMsg  = ref('')
const errorData  = reactive({ missing: [] })

async function handleFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''

  loading.value = true
  try {
    const result = await parseExcel(file)
    if (result.empty) {
      showEmpty.value = true
    } else if (!result.success) {
      errorData.missing = result.missing
      showError.value = true
    } else {
      revenueData.value = result.rows
      await saveToFile(result.rows, result.total)
    }
  } catch {
    showToast('Lỗi đọc file. Vui lòng kiểm tra định dạng file Excel.')
  } finally {
    loading.value = false
  }
}

async function saveToFile(rows, total) {
  try {
    const res = await fetch('/api/save-revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    })
    if (res.ok) {
      showToast(`Đã nhập và lưu ${total.toLocaleString('vi-VN')} bản ghi thành công`)
    } else {
      showToast(`Đã nhập ${total.toLocaleString('vi-VN')} bản ghi (lưu file thất bại)`)
    }
  } catch {
    showToast(`Đã nhập ${total.toLocaleString('vi-VN')} bản ghi (lưu file thất bại)`)
  }
}

function showToast(msg) {
  successMsg.value = msg
  showSuccess.value = true
  setTimeout(() => { showSuccess.value = false }, 3500)
}

function closeError() {
  showError.value = false
}

function retry() {
  showError.value = false
  fileInput.value.click()
}

function retryEmpty() {
  showEmpty.value = false
  fileInput.value.click()
}
</script>

<style scoped>
.import-wrap {
  flex-shrink: 0;
}

.import-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font);
  background: var(--color-white);
  color: var(--color-near-black);
  border: 1px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}
.import-btn:hover:not(:disabled) {
  border-color: var(--color-mid-border);
  background: var(--color-pale-gray);
}
.import-btn:disabled {
  opacity: 0.55;
  cursor: default;
}
.import-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>

<style>
/* Overlay + card — non-scoped so Teleport can reach them */
.ie-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10100;
  backdrop-filter: blur(2px);
}

.ie-card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: min(560px, calc(100vw - 32px));
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
}

.ie-card-sm {
  width: min(380px, calc(100vw - 32px));
}

.ie-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.ie-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.ie-title {
  font-size: 17px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

.ie-desc {
  font-size: 13.5px;
  color: #3d3d3f;
  margin: 0 0 16px;
  line-height: 1.5;
}

.ie-list {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
}

.ie-item {
  background: #f5f5f7;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ie-col-name {
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
}

.ie-col-used {
  font-size: 11.5px;
  color: #6e6e73;
}

.ie-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.ie-btn-retry {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.ie-btn-retry:hover { background: #0077ed; }

.ie-btn-close {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: #f5f5f7;
  color: #1d1d1f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.ie-btn-close:hover { background: #e8e8ed; }

/* Success toast */
.ie-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.82);
  color: #fff;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10200;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.ie-toast svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(8px); }
.toast-leave-to   { opacity: 0; transform: translateX(-50%) translateY(4px); }
</style>
