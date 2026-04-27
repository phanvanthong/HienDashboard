<template>
  <div class="import-wrap">
    <input
      type="file"
      accept=".xlsx,.xls"
      ref="fileInput"
      style="display:none"
      @change="handleFile"
    />

    <div class="btn-col">
      <!-- Main action: file mode -->
      <button v-if="dataSource === 'file'" class="import-btn" @click="fileInput.click()" :disabled="loading">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v8M5 7l3 3 3-3"/>
          <path d="M2 11v1.5A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5V11"/>
        </svg>
        {{ loading ? 'Đang xử lý...' : 'Nhập dữ liệu' }}
      </button>

      <!-- Main action: gdrive mode — status button -->
      <button v-else class="import-btn gdrive-status-btn" :class="{ refreshing: autoRefreshing }" :disabled="loading || !gdriveUrl.trim()" @click="loadFromGDrive(false)" :title="refreshInterval ? 'Bấm để tải ngay · Tự động ' + intervalLabel : 'Bấm để tải lại'">
        <svg v-if="autoRefreshing" class="btn-icon spinning" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13.5 8A5.5 5.5 0 112.5 5.5"/><path d="M2.5 2v3.5H6"/>
        </svg>
        <svg v-else viewBox="0 0 16 16" fill="none" stroke="#34c759" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="8" cy="8" r="6.5"/>
          <path d="M8 4.5v3.5l2 2"/>
        </svg>
        <template v-if="loading && !autoRefreshing">Đang tải...</template>
        <template v-else-if="lastUpdated">Cập nhật lúc: {{ lastUpdated }}</template>
        <template v-else>Chưa có dữ liệu</template>
      </button>
    </div>

    <!-- Gear settings button -->
    <button class="settings-btn" @click="openSettings" title="Cài đặt nguồn dữ liệu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </button>

    <!-- Settings modal -->
    <Teleport to="body">
      <div v-if="showSettings" class="ie-overlay" @click.self="closeSettings">
        <div class="ie-card ie-settings-card">
          <div class="ie-header">
            <svg class="ie-icon" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            <h3 class="ie-title">Cài đặt nguồn dữ liệu</h3>
          </div>

          <div class="settings-options">
            <label class="source-option" :class="{ active: draftSource === 'file' }">
              <input type="radio" v-model="draftSource" value="file" />
              <div class="source-icon">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
                  <path d="M12 2v4h4M10 10v5M8 13l2 2 2-2"/>
                </svg>
              </div>
              <div class="source-label">
                <span class="source-name">Nhập file Excel</span>
                <span class="source-desc">Chọn file .xlsx từ máy tính</span>
              </div>
            </label>

            <label class="source-option" :class="{ active: draftSource === 'gdrive' }">
              <input type="radio" v-model="draftSource" value="gdrive" />
              <div class="source-icon">
                <svg viewBox="0 0 20 20" fill="none" stroke="#34a853" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 13a4 4 0 00-4-4h-1a5 5 0 10-4.33 7.5"/>
                  <path d="M11 10v6M9 14l2-2 2 2"/>
                </svg>
              </div>
              <div class="source-label">
                <span class="source-name">Google Drive / Google Sheets</span>
                <span class="source-desc">Tự động tải & cập nhật từ link Drive / Sheets</span>
              </div>
            </label>
          </div>

          <!-- GDrive config — only when gdrive selected -->
          <Transition name="slide-down">
            <div v-if="draftSource === 'gdrive'" class="gdrive-config">
              <div class="gdrive-field">
                <label class="field-label">Link Google Drive / Google Sheets</label>
                <input
                  class="gdrive-input"
                  type="text"
                  v-model="draftUrl"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <div class="hint-row">
                  <div class="field-hints">
                    <span class="field-hint">File cần được chia sẻ "Bất kỳ ai có đường link"</span>
                    <span class="field-hint">Hoặc chia sẻ quyền xem với <span class="sa-email-inline">hien-as@gen-lang-client-0286474839.iam.gserviceaccount.com</span> nếu là link private</span>
                  </div>
                  <button class="gdrive-load-btn" :disabled="loading || !draftUrl.trim()" @click="saveAndLoad" type="button">
                    <svg v-if="loading" class="btn-icon spinning" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M13.5 8A5.5 5.5 0 112.5 5.5"/><path d="M2.5 2v3.5H6"/>
                    </svg>
                    <svg v-else viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M13.5 8A5.5 5.5 0 112.5 5.5"/><path d="M2.5 2v3.5H6"/>
                      <circle cx="12.5" cy="12.5" r="2.5" fill="currentColor" stroke="none"/>
                    </svg>
                    {{ loading ? 'Đang tải...' : 'Cập nhật dữ liệu' }}
                  </button>
                </div>
              </div>

              <div class="gdrive-field">
                <label class="field-label">Tự động cập nhật</label>
                <div class="interval-options">
                  <button
                    v-for="opt in INTERVAL_OPTIONS" :key="opt.value"
                    class="interval-chip"
                    :class="{ active: draftInterval === opt.value }"
                    @click="draftInterval = opt.value"
                    type="button"
                  >{{ opt.label }}</button>
                </div>
              </div>

            </div>
          </Transition>

          <div class="ie-footer">
            <button class="ie-btn-close" @click="closeSettings">Huỷ</button>
            <button class="ie-btn-retry" @click="saveSettings">Lưu</button>
          </div>
        </div>
      </div>
    </Teleport>

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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { parseExcel } from '../../utils/excelParser.js'
import { revenueData } from '../../store/dataStore.js'

const LS_SOURCE   = 'hd_data_source'
const LS_URL      = 'hd_gdrive_url'
const LS_INTERVAL = 'hd_refresh_interval'

const INTERVAL_OPTIONS = [
  { value: 0,    label: 'Tắt' },
  { value: 60,   label: '1 phút' },
  { value: 300,  label: '5 phút' },
  { value: 900,  label: '15 phút' },
  { value: 1800, label: '30 phút' },
]

const fileInput    = ref(null)
const loading      = ref(false)
const autoRefreshing = ref(false)
const showError    = ref(false)
const showEmpty    = ref(false)
const showSuccess  = ref(false)
const successMsg   = ref('')
const errorData    = reactive({ missing: [] })
const lastUpdated  = ref(localStorage.getItem('hd_last_updated') || '')

// Persistent settings
const dataSource     = ref(localStorage.getItem(LS_SOURCE)   || 'file')
const gdriveUrl      = ref(localStorage.getItem(LS_URL)      || '')
const refreshInterval = ref(parseInt(localStorage.getItem(LS_INTERVAL) || '0'))

// Settings modal drafts
const showSettings  = ref(false)
const draftSource   = ref('file')
const draftUrl      = ref('')
const draftInterval = ref(0)


const intervalLabel = computed(() =>
  INTERVAL_OPTIONS.find(o => o.value === refreshInterval.value)?.label?.toLowerCase() || ''
)

// Polling
let pollTimer = null

function startPolling() {
  stopPolling()
  if (dataSource.value !== 'gdrive' || !gdriveUrl.value.trim() || !refreshInterval.value) return
  pollTimer = setInterval(() => loadFromGDrive(true), refreshInterval.value * 1000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => stopPolling())

// Settings
function openSettings() {
  draftSource.value   = dataSource.value
  draftUrl.value      = gdriveUrl.value
  draftInterval.value = refreshInterval.value
  showSettings.value  = true
}

function closeSettings() { showSettings.value = false }

// Save settings then immediately load — triggered by "Tải dữ liệu" button inside modal
async function saveAndLoad() {
  saveSettings()
  await loadFromGDrive(false)
}

function saveSettings() {
  dataSource.value      = draftSource.value
  gdriveUrl.value       = draftUrl.value.trim()
  refreshInterval.value = draftInterval.value
  localStorage.setItem(LS_SOURCE,   dataSource.value)
  localStorage.setItem(LS_URL,      gdriveUrl.value)
  localStorage.setItem(LS_INTERVAL, String(refreshInterval.value))
  showSettings.value = false
  startPolling()
  // Immediate load when switching to gdrive or saving new URL
  if (dataSource.value === 'gdrive' && gdriveUrl.value) loadFromGDrive(true)
}

// File import
async function handleFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''
  loading.value = true
  try { await processExcel(file, false) }
  finally { loading.value = false }
}

// Google Drive import
// silent = true: background refresh — no error toast on success, spinner only
async function loadFromGDrive(silent = false) {
  if (!gdriveUrl.value.trim()) return
  if (silent) autoRefreshing.value = true
  else loading.value = true

  try {
    const res = await fetch(`/api/fetch-gdrive?url=${encodeURIComponent(gdriveUrl.value)}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    const blob = await res.blob()
    const file = new File([blob], 'gdrive.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    await processExcel(file, silent)
  } catch (e) {
    if (!silent) showToast(`Lỗi tải từ Google Drive: ${e.message}`)
  } finally {
    loading.value      = false
    autoRefreshing.value = false
  }
}

async function processExcel(file, silent) {
  try {
    const result = await parseExcel(file)
    if (result.empty) {
      if (!silent) showEmpty.value = true
    } else if (!result.success) {
      if (!silent) { errorData.missing = result.missing; showError.value = true }
    } else {
      revenueData.value = result.rows
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      lastUpdated.value = now
      localStorage.setItem('hd_last_updated', now)
      await saveToFile(result.rows, result.total, silent)
    }
  } catch {
    if (!silent) showToast('Lỗi đọc file. Vui lòng kiểm tra định dạng file Excel.')
  }
}

async function saveToFile(rows, total, silent) {
  try {
    const res = await fetch('/api/save-revenue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    })
    if (!silent) {
      showToast(res.ok
        ? `Đã nhập ${total.toLocaleString('vi-VN')} bản ghi thành công`
        : `Đã nhập ${total.toLocaleString('vi-VN')} bản ghi (lưu file thất bại)`)
    }
  } catch {
    if (!silent) showToast(`Đã xử lý ${total.toLocaleString('vi-VN')} bản ghi (lưu file thất bại)`)
  }
}

function showToast(msg) {
  successMsg.value  = msg
  showSuccess.value = true
  setTimeout(() => { showSuccess.value = false }, 3500)
}

function closeError() { showError.value = false }
function retry()      { showError.value = false; fileInput.value.click() }
function retryEmpty() { showEmpty.value = false; fileInput.value.click() }
</script>

<style scoped>
.import-wrap {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex-shrink: 0;
}

.btn-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
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
.import-btn:disabled { opacity: 0.55; cursor: default; }
.import-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

.gdrive-status-btn {
  color: #3d3d3f;
  font-variant-numeric: tabular-nums;
}
.gdrive-status-btn:hover:not(:disabled) { color: #0071e3; }
.gdrive-status-btn.refreshing { color: #6e6e73; }

.btn-icon { transition: transform 0.15s; }
.spinning { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.gdrive-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: var(--color-secondary-gray);
  padding-left: 2px;
  white-space: nowrap;
}
.gdrive-status svg { width: 10px; height: 10px; flex-shrink: 0; }
.status-interval { color: #aeaeb2; }

.settings-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  margin-top: 0;
  background: #f0f0f2;
  border: 1px solid #d8d8dc;
  border-radius: 8px;
  cursor: pointer;
  color: #3d3d3f;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.settings-btn:hover {
  background: #e5e5ea;
  border-color: #c7c7cc;
  color: #1d1d1f;
}
.settings-btn svg { width: 14px; height: 14px; }
</style>

<style>
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

.ie-card-sm      { width: min(380px, calc(100vw - 32px)); }
.ie-settings-card { width: min(520px, calc(100vw - 32px)); padding: 24px; }

.ie-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.ie-icon   { width: 28px; height: 28px; flex-shrink: 0; }
.ie-title  { font-size: 17px; font-weight: 700; color: #1d1d1f; margin: 0; }
.ie-desc   { font-size: 13.5px; color: #3d3d3f; margin: 0 0 16px; line-height: 1.5; }

.ie-list {
  list-style: none; margin: 0 0 22px; padding: 0;
  display: flex; flex-direction: column; gap: 10px;
  max-height: 320px; overflow-y: auto;
}
.ie-item     { background: #f5f5f7; border-radius: 8px; padding: 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.ie-col-name { font-size: 13px; font-weight: 600; color: #1d1d1f; }
.ie-col-used { font-size: 11.5px; color: #6e6e73; }

.ie-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

.ie-btn-retry {
  padding: 8px 18px; font-size: 13px; font-weight: 500; font-family: inherit;
  background: #0071e3; color: #fff; border: none; border-radius: 8px;
  cursor: pointer; transition: background 0.15s;
}
.ie-btn-retry:hover { background: #0077ed; }

.ie-btn-close {
  padding: 8px 18px; font-size: 13px; font-weight: 500; font-family: inherit;
  background: #f5f5f7; color: #1d1d1f; border: none; border-radius: 8px;
  cursor: pointer; transition: background 0.15s;
}
.ie-btn-close:hover { background: #e8e8ed; }

/* Source selector */
.settings-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }

.source-option {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 10px;
  border: 1.5px solid #e5e5e7; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.source-option:hover  { border-color: #b3b3b8; background: #fafafa; }
.source-option.active { border-color: #0071e3; background: #f0f6ff; }
.source-option input[type="radio"] { display: none; }

.source-icon {
  width: 34px; height: 34px; border-radius: 8px;
  background: #f5f5f7;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.source-icon svg { width: 18px; height: 18px; }
.source-option.active .source-icon { background: #dceeff; }

.source-label  { display: flex; flex-direction: column; gap: 2px; }
.source-name   { font-size: 13.5px; font-weight: 600; color: #1d1d1f; }
.source-desc   { font-size: 11.5px; color: #6e6e73; }

/* GDrive config block */
.gdrive-config { display: flex; flex-direction: column; gap: 14px; overflow: hidden; }
.gdrive-field  { display: flex; flex-direction: column; gap: 6px; }
.field-label   { font-size: 12px; font-weight: 500; color: #3d3d3f; }
.field-hints   { display: flex; flex-direction: column; gap: 3px; }
.field-hint    { font-size: 11px; color: #aeaeb2; }
.sa-email-inline { font-family: 'Menlo', 'Monaco', monospace; font-size: 10.5px; color: #8e8e93; }

.gdrive-input {
  width: 100%; padding: 8px 10px; font-size: 12.5px; font-family: inherit;
  border: 1.5px solid #d2d2d7; border-radius: 8px;
  color: #1d1d1f; background: #fff; outline: none;
  box-sizing: border-box; transition: border-color 0.15s;
}
.gdrive-input:focus { border-color: #0071e3; }
.gdrive-input::placeholder { color: #aeaeb2; }

/* Interval chips */
.interval-options { display: flex; gap: 6px; flex-wrap: wrap; }

.interval-chip {
  padding: 5px 12px; font-size: 12px; font-family: inherit;
  border: 1.5px solid #e5e5e7; border-radius: 20px;
  background: #fff; color: #3d3d3f;
  cursor: pointer; transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.interval-chip:hover  { border-color: #b3b3b8; background: #f5f5f7; }
.interval-chip.active { border-color: #0071e3; background: #0071e3; color: #fff; }

/* hint + load button on same row */
.hint-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* Load button inside settings modal */
.gdrive-load-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  background: #0071e3;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.gdrive-load-btn:hover:not(:disabled) { background: #0077ed; }
.gdrive-load-btn:disabled { opacity: 0.5; cursor: default; }
.gdrive-load-btn svg { width: 12px; height: 12px; flex-shrink: 0; }

/* Service Account section */
.sa-section { border-top: 1px solid #f0f0f2; padding-top: 12px; }

.sa-toggle {
  display: flex; align-items: center; gap: 6px;
  width: 100%; background: none; border: none;
  font-size: 12.5px; font-family: inherit; color: #3d3d3f;
  cursor: pointer; padding: 0; text-align: left;
}
.sa-toggle svg { width: 12px; height: 12px; flex-shrink: 0; color: #6e6e73; }
.sa-toggle:hover { color: #1d1d1f; }
.sa-badge { color: #aeaeb2; font-size: 11.5px; }
.sa-status-dot { margin-left: auto; font-size: 11px; color: #34c759; font-weight: 500; }

.sa-body { padding-top: 10px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }

.sa-configured {
  display: flex; align-items: center; gap: 10px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 8px; padding: 10px 12px;
}
.sa-configured svg { width: 16px; height: 16px; flex-shrink: 0; }
.sa-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.sa-ok    { font-size: 12.5px; font-weight: 600; color: #166534; }
.sa-email { font-size: 11px; color: #4ade80; word-break: break-all; }

.sa-remove-btn {
  padding: 4px 10px; font-size: 11.5px; font-family: inherit;
  background: #fff; border: 1px solid #d1d5db; border-radius: 6px;
  color: #374151; cursor: pointer; flex-shrink: 0;
  transition: background 0.15s;
}
.sa-remove-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

.sa-paste { display: flex; flex-direction: column; gap: 6px; }

.sa-textarea {
  width: 100%; padding: 8px 10px; font-size: 11.5px;
  font-family: 'Menlo', 'Monaco', monospace;
  border: 1.5px solid #d2d2d7; border-radius: 8px;
  color: #1d1d1f; background: #fafafa; outline: none;
  resize: vertical; box-sizing: border-box;
  transition: border-color 0.15s;
}
.sa-textarea:focus { border-color: #0071e3; background: #fff; }
.sa-textarea::placeholder { color: #aeaeb2; font-family: inherit; }

.sa-error { font-size: 11.5px; color: #ff3b30; }

/* Slide-down transition */
.slide-down-enter-active { transition: max-height 0.24s ease, opacity 0.2s ease; }
.slide-down-leave-active { transition: max-height 0.18s ease, opacity 0.15s ease; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 300px; opacity: 1; }

/* Success toast */
.ie-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  background: rgba(0,0,0,0.82); color: #fff; border-radius: 10px;
  padding: 10px 18px; font-size: 13px; font-family: inherit;
  display: flex; align-items: center; gap: 8px;
  z-index: 10200; white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.ie-toast svg { width: 16px; height: 16px; flex-shrink: 0; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(8px); }
.toast-leave-to   { opacity: 0; transform: translateX(-50%) translateY(4px); }
</style>
