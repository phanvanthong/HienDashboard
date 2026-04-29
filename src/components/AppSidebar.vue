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
      <span v-if="!collapsed" class="brand-name">
        <span class="brand-american">American</span><span class="brand-study"> Study</span>
      </span>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul>
        <li
          v-for="item in visibleItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeView === item.id }"
          @click="$emit('navigate', item.id)"
        >
          <span class="nav-icon">
            <component :is="item.icon" />
          </span>
          <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
        </li>
      </ul>
    </nav>

    <!-- User info + logout -->
    <div class="sidebar-footer">
      <!-- Expanded: một hàng ngang -->
      <div v-if="user && !collapsed" class="user-row" @click="$emit('profile')" title="Chỉnh sửa hồ sơ">
        <div class="user-avatar" :style="user.avatarImage ? {} : { background: user.avatarColor || avatarColor(user.username) }">
          <img v-if="user.avatarImage" :src="user.avatarImage" class="avatar-img" />
          <template v-else>{{ user.displayName.charAt(0).toUpperCase() }}</template>
        </div>
        <div class="user-info">
          <span class="user-name">{{ user.displayName }}</span>
          <span class="user-role">{{ user.isAdmin ? 'Admin' : 'Viewer' }}</span>
        </div>
        <button class="btn-logout" title="Đăng xuất" @click.stop="$emit('logout')">
          <ArrowRightStartOnRectangleIcon class="logout-icon" />
        </button>
      </div>
      <!-- Chưa đăng nhập -->
      <template v-if="!user">
        <button v-if="!collapsed" class="btn-signin" @click="$emit('login')">
          <ArrowRightStartOnRectangleIcon style="transform:scaleX(-1)" class="logout-icon" />
          Đăng nhập
        </button>
        <div v-else class="avatar-center">
          <button class="btn-logout" title="Đăng nhập" @click="$emit('login')">
            <ArrowRightStartOnRectangleIcon style="transform:scaleX(-1)" class="logout-icon" />
          </button>
        </div>
      </template>

      <!-- Collapsed: avatar + logout xếp dọc, căn giữa -->
      <template v-if="user && collapsed">
        <div class="avatar-center">
          <div
            class="user-avatar"
            :style="user.avatarImage ? {} : { background: user.avatarColor || avatarColor(user.username) }"
            title="Chỉnh sửa hồ sơ"
            style="cursor:pointer"
            @click="$emit('profile')"
          >
            <img v-if="user.avatarImage" :src="user.avatarImage" class="avatar-img" />
            <template v-else>{{ user.displayName.charAt(0).toUpperCase() }}</template>
          </div>
        </div>
        <div class="avatar-center">
          <button class="btn-logout" title="Đăng xuất" @click="$emit('logout')">
            <ArrowRightStartOnRectangleIcon class="logout-icon" />
          </button>
        </div>
      </template>
      <button class="collapse-btn" @click="$emit('toggle')">
        <ChevronLeftIcon class="chevron" :class="{ rotated: collapsed }" />
        <span v-if="!collapsed">Thu gọn</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import {
  HomeIcon,
  ChevronLeftIcon,
  UserGroupIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  collapsed: Boolean,
  user: Object,
  activeView: { type: String, default: 'dashboard' },
})

defineEmits(['toggle', 'navigate', 'logout', 'profile', 'login'])

const ALL_ITEMS = [
  { id: 'dashboard', icon: HomeIcon, label: 'Tổng quan', roles: ['admin', 'viewer'] },
  { id: 'accounts', icon: UserGroupIcon, label: 'Tài khoản', roles: ['admin'] },
]

const visibleItems = computed(() =>
  ALL_ITEMS.filter(item => {
    if (item.id === 'accounts') return props.user?.isAdmin
    return true
  })
)

const COLORS = ['#0071e3','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa','#ff2d55','#5856d6']
function avatarColor(str) {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return COLORS[Math.abs(h) % COLORS.length]
}
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
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -0.3px;
}

.brand-american {
  color: #ffffff;
}

.brand-study {
  color: #f5a31c;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  min-width: 0;
  cursor: pointer;
  transition: background 0.15s;
}
.user-row:hover { background: var(--sidebar-hover-bg); }

.avatar-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  letter-spacing: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #c0cfeb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: var(--sidebar-text);
}

.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  color: var(--sidebar-text);
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.btn-logout:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.logout-icon {
  width: 17px;
  height: 17px;
}

.btn-signin {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: #c0cfeb;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.btn-signin:hover { background: var(--sidebar-hover-bg); }

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
