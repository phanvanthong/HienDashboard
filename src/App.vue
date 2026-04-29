<template>
  <ToastNotification />
  <div class="app-layout">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :user="currentUser"
      :active-view="activeView"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @navigate="activeView = $event"
      @logout="handleLogout"
      @profile="showProfile = true"
      @login="showLogin = true"
    />
    <div class="app-main" :class="{ collapsed: sidebarCollapsed }">
      <DashboardView v-if="activeView === 'dashboard'" />
      <AccountsView v-else-if="activeView === 'accounts' && currentUser" />
    </div>

    <ProfileModal
      v-if="showProfile && currentUser"
      :user="currentUser"
      @close="showProfile = false"
    />
  </div>

  <Teleport to="body">
    <Transition name="login-overlay">
      <div v-if="showLogin" class="login-overlay" @mousedown.self="showLogin = false">
        <LoginView modal @login="showLogin = false" @close="showLogin = false" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import DashboardView from './views/DashboardView.vue'
import AccountsView from './views/AccountsView.vue'
import LoginView from './views/LoginView.vue'
import ProfileModal from './components/ProfileModal.vue'
import ToastNotification from './components/ToastNotification.vue'
import { currentUser, clearUser } from './store/authStore.js'

const sidebarCollapsed = ref(true)
const activeView = ref('dashboard')
const showProfile = ref(false)
const showLogin = ref(false)

function handleLogout() {
  clearUser()
  activeView.value = 'dashboard'
  showLogin.value = true
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  background: var(--color-pale-gray);
  margin-left: var(--sidebar-width);
  transition: margin-left 0.25s ease;
  min-width: 0;
}

.app-main.collapsed {
  margin-left: var(--sidebar-collapsed-width);
}
</style>

<style>
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 800;
}

.login-overlay-enter-active,
.login-overlay-leave-active { transition: opacity 0.2s; }
.login-overlay-enter-from,
.login-overlay-leave-to { opacity: 0; }
</style>
