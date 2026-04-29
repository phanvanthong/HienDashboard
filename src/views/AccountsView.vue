<template>
  <div class="accounts-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý tài khoản</h1>
        <p class="page-sub">Thêm, sửa, xóa tài khoản đăng nhập hệ thống</p>
      </div>
      <button v-if="currentUser.isAdmin" class="btn-add" @click="openAdd">+ Thêm tài khoản</button>
    </div>

    <div class="table-card">
      <table class="accounts-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên hiển thị</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="td-center">Đang tải...</td>
          </tr>
          <tr v-else-if="!users.length">
            <td colspan="6" class="td-center">Chưa có tài khoản nào</td>
          </tr>
          <tr v-for="(u, i) in users" :key="u.id">
            <td class="td-num">{{ i + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="avatar" :style="{ background: avatarColor(u.username) }">
                  {{ u.displayName.charAt(0).toUpperCase() }}
                </div>
                {{ u.displayName }}
              </div>
            </td>
            <td>{{ u.username }}</td>
            <td>
              <div class="badges">
                <span class="badge" :class="u.role">{{ roleLabel(u.role) }}</span>
                <span v-if="u.isAdmin" class="badge is-admin">Admin quyền</span>
              </div>
            </td>
            <td>{{ fmtDate(u.createdAt) }}</td>
            <td class="td-actions">
              <button v-if="currentUser.isAdmin" class="btn-icon edit" title="Chỉnh sửa" @click="openEdit(u)">
                <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
              </button>
              <button
                class="btn-icon delete"
                title="Xóa"
                :disabled="u.id === currentUser.id"
                @click="confirmDelete(u)"
              >
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm0 2h2l.5 1H8.5L9 4zm-3 3h8v9H6V7zm2 2a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal thêm/sửa -->
    <Teleport to="body">
      <div v-if="modal.open" class="modal-overlay" @mousedown.self="closeModal">
        <div class="modal-card">
          <h2 class="modal-title">{{ modal.mode === 'add' ? 'Thêm tài khoản' : 'Chỉnh sửa tài khoản' }}</h2>

          <div class="modal-body">
            <div class="field">
              <label>Tên hiển thị <span class="req">*</span></label>
              <input v-model="form.displayName" type="text" placeholder="VD: Nguyễn Văn A" />
            </div>
            <div class="field">
              <label>Tên đăng nhập <span class="req">*</span></label>
              <input
                v-model="form.username"
                type="text"
                placeholder="Chữ thường, không dấu"
                :disabled="modal.mode === 'edit'"
              />
            </div>
            <div class="field">
              <label>
                Mật khẩu
                <span v-if="modal.mode === 'edit'" class="hint">(để trống nếu không đổi)</span>
                <span v-else class="req">*</span>
              </label>
              <input v-model="form.password" type="password" placeholder="Tối thiểu 6 ký tự" />
            </div>
            <div class="field">
              <label>Vai trò <span class="req">*</span></label>
              <select v-model="form.role">
                <option value="viewer">Xem (viewer)</option>
                <option value="admin">Quản trị (admin)</option>
              </select>
            </div>
            <div class="field-checkbox">
              <input id="chk-isadmin" v-model="form.isAdmin" type="checkbox" />
              <label for="chk-isadmin">Có quyền thêm / sửa tài khoản (isAdmin)</label>
            </div>
          </div>

          <p v-if="modal.error" class="modal-error">{{ modal.error }}</p>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Hủy</button>
            <button class="btn-save" :disabled="modal.saving" @click="handleSave">
              {{ modal.saving ? 'Đang lưu...' : 'Lưu' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm delete -->
      <div v-if="deleteTarget" class="modal-overlay" @mousedown.self="deleteTarget = null">
        <div class="modal-card confirm-card">
          <h2 class="modal-title">Xóa tài khoản</h2>
          <p class="confirm-msg">
            Bạn có chắc muốn xóa tài khoản <strong>{{ deleteTarget.displayName }}</strong>
            (<code>{{ deleteTarget.username }}</code>)?
          </p>
          <p v-if="deleteError" class="modal-error">{{ deleteError }}</p>
          <div class="modal-footer">
            <button class="btn-cancel" @click="deleteTarget = null">Hủy</button>
            <button class="btn-delete-confirm" :disabled="deleting" @click="doDelete">
              {{ deleting ? 'Đang xóa...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { currentUser } from '../store/authStore.js'

const users = ref([])
const loading = ref(true)
const deleteTarget = ref(null)
const deleteError = ref('')
const deleting = ref(false)

const modal = reactive({
  open: false,
  mode: 'add',
  editId: null,
  error: '',
  saving: false,
})

const form = reactive({
  displayName: '',
  username: '',
  password: '',
  role: 'viewer',
  isAdmin: false,
})

const COLORS = ['#0071e3','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa','#ff2d55','#5856d6']
function avatarColor(str) {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return COLORS[Math.abs(h) % COLORS.length]
}

function roleLabel(role) {
  return role === 'admin' ? 'Admin' : 'Viewer'
}

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

async function loadUsers() {
  loading.value = true
  try {
    const res = await fetch('/api/users')
    users.value = await res.json()
  } finally {
    loading.value = false
  }
}

function openAdd() {
  form.displayName = ''
  form.username = ''
  form.password = ''
  form.role = 'viewer'
  form.isAdmin = false
  modal.error = ''
  modal.mode = 'add'
  modal.editId = null
  modal.open = true
}

function openEdit(u) {
  form.displayName = u.displayName
  form.username = u.username
  form.password = ''
  form.role = u.role
  form.isAdmin = u.isAdmin === true
  modal.error = ''
  modal.mode = 'edit'
  modal.editId = u.id
  modal.open = true
}

function closeModal() {
  modal.open = false
}

async function handleSave() {
  modal.error = ''
  if (!form.displayName.trim()) { modal.error = 'Vui lòng nhập tên hiển thị'; return }
  if (!form.username.trim()) { modal.error = 'Vui lòng nhập tên đăng nhập'; return }
  if (modal.mode === 'add' && !form.password) { modal.error = 'Vui lòng nhập mật khẩu'; return }
  if (form.password && form.password.length < 6) { modal.error = 'Mật khẩu tối thiểu 6 ký tự'; return }

  modal.saving = true
  try {
    let res
    if (modal.mode === 'add') {
      res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: form.displayName.trim(), username: form.username.trim(), password: form.password, role: form.role, isAdmin: form.isAdmin }),
      })
    } else {
      const body = { displayName: form.displayName.trim(), role: form.role, isAdmin: form.isAdmin }
      if (form.password) body.password = form.password
      res = await fetch(`/api/users/${modal.editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Lỗi không xác định')
    await loadUsers()
    closeModal()
  } catch (e) {
    modal.error = e.message
  } finally {
    modal.saving = false
  }
}

function confirmDelete(u) {
  deleteTarget.value = u
  deleteError.value = ''
}

async function doDelete() {
  deleting.value = true
  deleteError.value = ''
  try {
    const res = await fetch(`/api/users/${deleteTarget.value.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Lỗi không xác định')
    deleteTarget.value = null
    await loadUsers()
  } catch (e) {
    deleteError.value = e.message
  } finally {
    deleting.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.accounts-page {
  padding: 28px 32px;
  max-width: 900px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-near-black);
  letter-spacing: -0.3px;
}

.page-sub {
  font-size: 13px;
  color: var(--color-secondary-gray);
  margin-top: 3px;
}

.btn-add {
  height: 36px;
  padding: 0 16px;
  background: var(--color-action-blue);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-add:hover { background: #0062c4; }

.table-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.accounts-table th {
  background: #f8f8fa;
  padding: 11px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-secondary-gray);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid var(--color-soft-border);
}

.accounts-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f2f2f5;
  color: var(--color-near-black);
  vertical-align: middle;
}

.accounts-table tbody tr:last-child td { border-bottom: none; }
.accounts-table tbody tr:hover td { background: #fafafe; }

.td-center { text-align: center; color: var(--color-secondary-gray); }
.td-num { color: var(--color-secondary-gray); font-size: 12.5px; }

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badges { display: flex; gap: 4px; flex-wrap: wrap; }
.badge.admin { background: #e8f0fe; color: #1a56db; }
.badge.viewer { background: #f0fdf4; color: #166534; }
.badge.is-admin { background: #fff7ed; color: #9a3412; }

.td-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-icon svg { width: 16px; height: 16px; }

.btn-icon.edit { background: #e8f0fe; color: #1a56db; }
.btn-icon.edit:hover { background: #c7d9fa; }
.btn-icon.delete { background: #fff0f0; color: #d9534f; }
.btn-icon.delete:hover:not(:disabled) { background: #fcd5d5; }
.btn-icon:disabled { opacity: 0.35; cursor: not-allowed; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  width: 420px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
}

.confirm-card { width: 380px; }

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-near-black);
  margin-bottom: 20px;
}

.modal-body {
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.req { color: #d9534f; }
.hint { color: var(--color-secondary-gray); font-weight: 400; }

.field input,
.field select {
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

.field input:focus,
.field select:focus { border-color: var(--color-action-blue); background: #fff; }
.field input:disabled { opacity: 0.55; cursor: not-allowed; }

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-checkbox input[type="checkbox"] {
  width: 15px;
  height: 15px;
  accent-color: var(--color-action-blue);
  cursor: pointer;
  flex-shrink: 0;
}

.field-checkbox label {
  font-size: 13px;
  color: var(--color-near-black);
  cursor: pointer;
}

.modal-error {
  font-size: 13px;
  color: #d9534f;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  margin-top: 14px;
}

.confirm-msg {
  font-size: 14px;
  color: var(--color-near-black);
  line-height: 1.6;
  margin-bottom: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
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

.btn-delete-confirm {
  height: 36px;
  padding: 0 20px;
  background: #d9534f;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-delete-confirm:hover:not(:disabled) { background: #c9302c; }
.btn-delete-confirm:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
