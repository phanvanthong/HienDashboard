<template>
  <div class="login-page" :class="{ 'is-modal': modal }">
    <div class="login-card">
      <button v-if="modal" class="btn-close" @click="$emit('close')">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      </button>
      <div class="login-logo-wrap">
        <div class="logo-text">
          <span class="logo-american">American</span><span class="logo-study"> Study</span>
        </div>
        <p class="logo-tagline">Good Teachers, Good Schools</p>
      </div>
      <p class="login-sub">Dashboard phân tích doanh thu</p>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="field">
          <label>Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            autocomplete="username"
            :disabled="loading"
          />
        </div>
        <div class="field">
          <label>Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiLogin } from '../store/authStore.js'

defineProps({ modal: Boolean })
const emit = defineEmits(['login', 'close'])

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const user = await apiLogin(username.value.trim(), password.value)
    emit('login', user)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-pale-gray);
}

.login-page.is-modal {
  min-height: unset;
  background: none;
}

.login-card {
  width: 360px;
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 36px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: var(--color-secondary-gray);
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}
.btn-close:hover { background: #f2f2f5; color: var(--color-near-black); }
.btn-close svg { width: 18px; height: 18px; }

.login-logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}

.logo-text {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-american {
  color: #1a3a6e;
}

.logo-study {
  color: #f5a31c;
}

.logo-tagline {
  font-size: 11.5px;
  color: #8a9ab5;
  font-style: italic;
  letter-spacing: 0.1px;
}

.login-sub {
  font-size: 13px;
  color: var(--color-secondary-gray);
  margin-bottom: 20px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-near-black);
}

.field input {
  height: 40px;
  padding: 0 12px;
  border: 1.5px solid var(--color-soft-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-near-black);
  background: #fafafa;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: var(--color-action-blue);
  background: #fff;
}

.field input:disabled {
  opacity: 0.6;
}

.login-error {
  font-size: 13px;
  color: #d9534f;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.btn-login {
  height: 42px;
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, opacity 0.15s;
  margin-top: 4px;
}

.btn-login:hover:not(:disabled) {
  background: #0062c4;
}

.btn-login:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
