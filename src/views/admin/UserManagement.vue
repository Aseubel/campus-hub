<template>
  <div class="user-management">
    <h1 class="text-2xl font-bold mb-6">用户管理</h1>
    
    <!-- 用户表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                {{ user.role === 'admin' ? '管理员' : '普通用户' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ user.active ? '活跃' : '禁用' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button v-if="user.active" @click="toggleUserStatus(user)" class="text-red-600 hover:text-red-900">禁用</button>
              <button v-else @click="toggleUserStatus(user)" class="text-green-600 hover:text-green-900">启用</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 编辑用户模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">编辑用户</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input v-model="form.username" type="text" class="w-full border rounded-md px-3 py-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input v-model="form.email" type="email" class="w-full border rounded-md px-3 py-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
            <select v-model="form.role" class="w-full border rounded-md px-3 py-2">
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded-md">取消</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模拟用户数据
const users = ref([
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', active: true },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', active: true },
  { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', active: true },
  { id: 4, username: 'user3', email: 'user3@example.com', role: 'user', active: false }
])

const showModal = ref(false)
const editingId = ref(null)
const form = ref({
  username: '',
  email: '',
  role: 'user'
})

onMounted(() => {
  // 在实际项目中，这里会调用API获取用户列表
})

const editUser = (user) => {
  editingId.value = user.id
  form.value = {
    username: user.username,
    email: user.email,
    role: user.role
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveUser = () => {
  // 在实际项目中，这里会调用API更新用户信息
  const index = users.value.findIndex(u => u.id === editingId.value)
  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      username: form.value.username,
      email: form.value.email,
      role: form.value.role
    }
  }
  closeModal()
}

const toggleUserStatus = (user) => {
  // 在实际项目中，这里会调用API更新用户状态
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value[index].active = !users.value[index].active
  }
}
</script>