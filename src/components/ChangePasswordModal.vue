<template>
  <div class="pw-overlay" @mousedown.self="$emit('close')">
    <div class="pw-card">
      <div class="pw-header">
        <h2 class="pw-title">Đổi mật khẩu</h2>
        <button class="btn-close" @click="$emit('close')">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <div class="pw-fields">
        <div class="field">
          <label>Mật khẩu hiện tại</label>
          <div class="input-wrap">
            <input v-model="form.oldPassword" :type="show.old ? 'text' : 'password'" placeholder="Nhập mật khẩu hiện tại" />
            <button class="eye-btn" tabindex="-1" @click="show.old = !show.old">
              <svg v-if="!show.old" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
            </button>
          </div>
        </div>
        <div class="field">
          <label>Mật khẩu mới</label>
          <div class="input-wrap">
            <input v-model="form.newPassword" :type="show.new ? 'text' : 'password'" placeholder="Nhập mật khẩu mới" />
            <button class="eye-btn" tabindex="-1" @click="show.new = !show.new">
              <svg v-if="!show.new" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
            </button>
          </div>
        </div>
        <div class="field">
          <label>Xác nhận mật khẩu mới</label>
          <div class="input-wrap">
            <input v-model="form.confirmPassword" :type="show.confirm ? 'text' : 'password'" placeholder="Nhập lại mật khẩu mới" @keydown.enter="handleSave" />
            <button class="eye-btn" tabindex="-1" @click="show.confirm = !show.confirm">
              <svg v-if="!show.confirm" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <p v-if="error" class="pw-error">{{ error }}</p>

      <div class="pw-footer">
        <button class="btn-cancel" @click="$emit('close')">Hủy</button>
        <button class="btn-save" :disabled="saving" @click="handleSave">
          {{ saving ? 'Đang lưu...' : 'Xác nhận' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { showToast } from '../composables/useToast.js'

const props = defineProps({ user: Object })
const emit = defineEmits(['close'])

const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const show = reactive({ old: false, new: false, confirm: false })
const saving = ref(false)
const error = ref('')


async function handleSave() {
  error.value = ''

  if (!form.oldPassword) { error.value = 'Vui lòng nhập mật khẩu hiện tại'; return }
  if (!form.newPassword) { error.value = 'Vui lòng nhập mật khẩu mới'; return }
  if (form.newPassword.length < 4) { error.value = 'Mật khẩu mới tối thiểu 4 ký tự'; return }
  if (form.newPassword !== form.confirmPassword) { error.value = 'Mật khẩu xác nhận không khớp'; return }

  saving.value = true
  try {
    const res = await fetch(`/api/users/${props.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword: form.oldPassword, password: form.newPassword }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Lỗi không xác định')
    showToast('Đổi mật khẩu thành công!')
    emit('close')
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.pw-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 600;
}

.pw-card {
  background: #fff;
  border-radius: 14px;
  width: 360px;
  box-shadow: 0 16px 56px rgba(0,0,0,0.22);
  overflow: hidden;
}

.pw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 0;
}

.pw-title {
  font-size: 15px;
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
.btn-close svg { width: 17px; height: 17px; }

.pw-fields {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 18px 22px 4px;
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

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap input {
  width: 100%;
  height: 38px;
  padding: 0 38px 0 10px;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  color: var(--color-near-black);
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s;
}
.input-wrap input:focus { border-color: var(--color-action-blue); background: #fff; }

.eye-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--color-secondary-gray);
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.15s;
}
.eye-btn:hover { color: var(--color-near-black); }
.eye-btn :deep(svg), .eye-btn svg { width: 17px; height: 17px; }

.pw-error {
  margin: 10px 22px 0;
  font-size: 13px;
  color: #d9534f;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.pw-success {
  margin: 10px 22px 0;
  font-size: 13px;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.pw-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
}

.btn-cancel {
  height: 34px;
  padding: 0 16px;
  background: none;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-secondary-gray);
  cursor: pointer;
}
.btn-cancel:hover { border-color: var(--color-mid-border); color: var(--color-near-black); }

.btn-save {
  height: 34px;
  padding: 0 18px;
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-save:hover:not(:disabled) { background: #0062c4; }
.btn-save:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
