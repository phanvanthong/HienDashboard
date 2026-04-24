<template>
  <div class="app-layout">
    <AppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <div class="app-main" :class="{ collapsed: sidebarCollapsed }">
      <DashboardView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import DashboardView from './views/DashboardView.vue'

const sidebarCollapsed = ref(false)
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
