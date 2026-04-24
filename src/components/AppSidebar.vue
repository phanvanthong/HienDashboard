<template>
  <aside class="sidebar" :class="{ collapsed }">
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-5 4 3 4-6"/>
          <circle cx="19" cy="8" r="1.2" fill="currentColor" stroke="none"/>
        </svg>
      </div>
      <span v-if="!collapsed" class="brand-name">Hien American</span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeId === item.id }"
          @click="activeId = item.id"
        >
          <span class="nav-icon">
            <component :is="item.icon" />
          </span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </li>
      </ul>
    </nav>

    <!-- Collapse toggle -->
    <div class="sidebar-footer">
      <button class="collapse-btn" @click="$emit('toggle')">
        <ChevronLeftIcon class="chevron" :class="{ rotated: collapsed }" />
        <span v-if="!collapsed">Thu gọn</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import {
  HomeIcon,
  ChevronLeftIcon,
} from '@heroicons/vue/24/outline'

defineProps({ collapsed: Boolean })
defineEmits(['toggle'])

const activeId = ref('tonquan')

const menuItems = [
  { id: 'tonquan', icon: HomeIcon, label: 'Tổng quan' },
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.25s ease;
  z-index: 100;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: var(--color-action-blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 8px;
}

.sidebar-nav::-webkit-scrollbar { width: 3px; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

.sidebar-nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--sidebar-text);
  font-size: 13.5px;
  font-weight: 400;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
  user-select: none;
}

.nav-item:hover {
  background: var(--sidebar-hover-bg);
  color: #c0cfeb;
}

.nav-item.active {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
  font-weight: 500;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer */
.sidebar-footer {
  padding: 10px 8px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  background: none;
  border: none;
  color: var(--sidebar-text);
  font-size: 13.5px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.collapse-btn:hover {
  background: var(--sidebar-hover-bg);
  color: #c0cfeb;
}

.chevron {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}
</style>
