<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastMessage" class="toast" :class="toastType">
        <svg v-if="toastType === 'success'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { toastMessage, toastType } from '../composables/useToast.js'
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  z-index: 9999;
  white-space: nowrap;
  pointer-events: none;
}

.toast svg { width: 18px; height: 18px; flex-shrink: 0; }

.toast.success { background: #34c759; color: #fff; }
.toast.error   { background: #d9534f; color: #fff; }

.toast-enter-active { transition: opacity 0.2s, transform 0.2s; }
.toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from   { opacity: 0; transform: translateX(-50%) translateY(10px); }
.toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
