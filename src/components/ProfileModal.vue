<template>
  <Teleport to="body">
    <div class="modal-overlay" @mousedown.self="$emit('close')">
      <div class="modal-card">

        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">Thông tin cá nhân</h2>
          <button class="btn-close" @click="$emit('close')">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>

        <!-- Avatar upload -->
        <div class="avatar-section">
          <div class="avatar-wrap" @click="fileInput.click()" title="Nhấn để đổi ảnh">
            <img v-if="form.avatarImage" :src="form.avatarImage" class="avatar-img" />
            <div v-else class="avatar-initial" :style="{ background: user.avatarColor || '#0071e3' }">
              {{ form.displayName.charAt(0).toUpperCase() || '?' }}
            </div>
            <div class="avatar-overlay">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
              <span>Đổi ảnh</span>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileChange" />
          <div class="avatar-hint">
            <p class="avatar-name">{{ form.displayName || user.username }}</p>
            <p class="avatar-sub">{{ user.username }}</p>
            <p class="avatar-tip">JPG, PNG — tối đa 2MB</p>
          </div>
        </div>

        <!-- Fields -->
        <div class="fields">
          <div class="field">
            <label>Tên hiển thị</label>
            <input v-model="form.displayName" type="text" placeholder="Nhập tên hiển thị" />
          </div>
          <div class="field">
            <label>Tên đăng nhập</label>
            <input :value="user.username" type="text" disabled />
          </div>
          <div class="field-row">
            <button class="btn-change-pw" @click="showChangePw = true">Đổi mật khẩu</button>
          </div>
        </div>

        <p v-if="error" class="modal-error">{{ error }}</p>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Hủy</button>
          <button class="btn-save" :disabled="saving" @click="handleSave">
            {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Crop modal -->
    <CropModal
      v-if="cropSrc"
      :image-src="cropSrc"
      @confirm="onCropConfirm"
      @cancel="cropSrc = null"
    />

    <!-- Sub-modal đổi mật khẩu -->
    <ChangePasswordModal
      v-if="showChangePw"
      :user="user"
      @close="showChangePw = false"
    />
  </Teleport>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { setUser } from '../store/authStore.js'
import { showToast } from '../composables/useToast.js'
import ChangePasswordModal from './ChangePasswordModal.vue'
import CropModal from './CropModal.vue'

const props = defineProps({ user: Object })
const emit = defineEmits(['close'])

const fileInput = ref(null)
const showChangePw = ref(false)
const cropSrc = ref(null)

const form = reactive({
  displayName: props.user.displayName,
  avatarImage: props.user.avatarImage || null,
})

const saving = ref(false)
const error = ref('')

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  error.value = ''
  if (file.size > 2 * 1024 * 1024) { error.value = 'Ảnh tối đa 2MB'; e.target.value = ''; return }
  const reader = new FileReader()
  reader.onload = (ev) => { cropSrc.value = ev.target.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function onCropConfirm(base64) {
  form.avatarImage = base64
  cropSrc.value = null
}

async function handleSave() {
  error.value = ''
  if (!form.displayName.trim()) { error.value = 'Tên hiển thị không được để trống'; return }

  const unchanged =
    form.displayName.trim() === props.user.displayName &&
    form.avatarImage === (props.user.avatarImage || null)
  if (unchanged) { emit('close'); return }

  saving.value = true
  try {
    const body = {
      displayName: form.displayName.trim(),
      avatarImage: form.avatarImage,
    }
    const res = await fetch(`/api/users/${props.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Lỗi không xác định')
    setUser(data)
    showToast('Lưu thành công!')
    emit('close')
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-near-black);
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: var(--color-secondary-gray);
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.btn-close:hover { background: #f2f2f5; color: var(--color-near-black); }
.btn-close svg { width: 18px; height: 18px; }

/* Avatar upload */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 24px;
  border-bottom: 1px solid #f2f2f5;
}

.avatar-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.14);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.18s;
  font-size: 10.5px;
  font-weight: 600;
}
.avatar-overlay svg { width: 20px; height: 20px; }
.avatar-wrap:hover .avatar-overlay { opacity: 1; }

.avatar-hint { flex: 1; }
.avatar-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-near-black);
  margin-bottom: 1px;
}
.avatar-sub {
  font-size: 12px;
  color: var(--color-secondary-gray);
  margin-bottom: 6px;
}
.avatar-tip {
  font-size: 11px;
  color: #aaa;
}

/* Fields */
.fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px 4px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-near-black);
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0 6px;
}

.field-row label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-near-black);
}

.btn-change-pw {
  height: 30px;
  padding: 0 14px;
  background: none;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  color: var(--color-action-blue);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-change-pw:hover {
  background: #f0f6ff;
  border-color: var(--color-action-blue);
}

.field input {
  height: 38px;
  padding: 0 10px;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  color: var(--color-near-black);
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus { border-color: var(--color-action-blue); background: #fff; }
.field input:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-error {
  margin: 10px 24px 0;
  font-size: 13px;
  color: #d9534f;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.modal-success {
  margin: 10px 24px 0;
  font-size: 13px;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
}

.btn-cancel {
  height: 36px;
  padding: 0 18px;
  background: none;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  color: var(--color-secondary-gray);
  cursor: pointer;
}
.btn-cancel:hover { border-color: var(--color-mid-border); color: var(--color-near-black); }

.btn-save {
  height: 36px;
  padding: 0 20px;
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.btn-save:hover:not(:disabled) { background: #0062c4; }
.btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
