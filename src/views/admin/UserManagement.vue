<template>
  <div class="user-management p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">用户管理</h1>
      <button @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors">
        添加用户
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input v-model="filters.search" type="text" placeholder="搜索用户名、手机号"
          class="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition">
        <select v-model="filters.role"
          class="px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition">
          <option value="all">所有角色</option>
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ user.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                  {{ user.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ user.status === 'active' ? '活跃' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editUser(user)" class="text-blue-600 hover:text-blue-800 transition-colors">编辑</button>
                <button @click="toggleUserStatus(user)"
                  :class="user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                  class="transition-colors">
                  {{ user.status === 'active' ? '禁用' : '启用' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-10 text-gray-500">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all"
        :class="showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">编辑用户</h2>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input v-model="form.username" type="text"
              class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input v-model="form.phone" type="text"
              class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select v-model="form.role"
              class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="0">普通用户</option>
              <option value="1">管理员</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">取消</button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import swal from '@/utils/swal'
import api from '@/api'

// 模拟用户数据
const users = ref([
  { id: 1, username: 'admin', phone: '13800138000', role: 'admin', active: true },
  { id: 2, username: 'user1', phone: '13912345678', role: 'user', active: true },
  { id: 3, username: 'user2', phone: '13787654321', role: 'user', active: true },
  { id: 4, username: 'user3', phone: '13611112222', role: 'user', active: false }
])

const showModal = ref(false)
const editingId = ref(null)
const form = ref({
  username: '',
  phone: '',
  role: 'user'
})

const filters = ref({
  search: '',
  role: 'all'
})

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (filters.value.role !== 'all') {
    result = result.filter(user => user.role === filters.value.role)
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchLower)
    )
  }
  return result
})

onMounted(() => {
  getUsers()
})

const getUsers = async () => {
  try {
    const response = await api.users.getAll()
    users.value = response.data.data
  } catch (error) {
    swal.error('获取用户列表失败')
  }
}

const editUser = (user) => {
  editingId.value = user.id
  form.value = {
    username: user.username,
    phone: user.phone,
    role: user.role === 'admin' ? '1' : '0'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingId.value = null
  form.value = {
    username: '',
    phone: '',
    role: 'user'
  }
}

const saveUser = async () => {
  const index = users.value.findIndex(u => u.id === editingId.value)
  // 找得到说明是更新用户
  if (index !== -1) {
    await updateUser()
  } else {
    // 找不到说明是新增用户
    await createUser()
  }
  closeModal()
}

const createUser = async () => {
  const response = await api.users.create(form.value)
  users.value.push(response.data.data)
  swal.success('新增用户成功')
}

const updateUser = async () => {
  const index = users.value.findIndex(u => u.id === editingId.value)
  if (index !== -1) {
    const updatedUser = {
      ...users.value[index],
      username: form.value.username,
      phone: form.value.phone,
      role: form.value.role === '1' ? 'admin' : 'user' // Convert '0'/'1' to 'user'/'admin'
    }
    await api.users.update(editingId.value, updatedUser)
    users.value[index] = updatedUser
    swal.success('更新用户成功')
  }
}

const toggleUserStatus = async (user) => {
  const actionText = user.status === 'active' ? '禁用' : '启用';
  const result = await swal.confirm('确认操作', `确定要${actionText}用户 "${user.username}" 吗？`);

  if (result.isConfirmed) {
    const response = await api.users.update(user.id, { status: user.status === 'active' ? '0' : '1' })
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = user.status === 'active' ? 'disabled' : 'active'
      swal.success('状态更新成功')
    }
  }
}
</script>