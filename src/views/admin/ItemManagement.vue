<template>
  <div class="item-management">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">点评项管理</h1>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        添加点评项
      </button>
    </div>
    
    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="w-64">
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select v-model="filters.categoryId" class="w-full border rounded-md px-3 py-2">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="w-64">
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
          <input v-model="filters.search" type="text" placeholder="搜索名称..." class="w-full border rounded-md px-3 py-2">
        </div>
        <div class="flex items-end">
          <button @click="applyFilters" class="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
            应用筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 点评项表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评分</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in filteredItems" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ item.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ getCategoryName(item.categoryId) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.rating }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="editItem(item)" class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button @click="confirmDelete(item)" class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑点评项模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? '编辑点评项' : '添加点评项' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
            <input v-model="form.name" type="text" class="w-full border rounded-md px-3 py-2" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select v-model="form.categoryId" class="w-full border rounded-md px-3 py-2" required>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea v-model="form.description" class="w-full border rounded-md px-3 py-2" rows="3"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input v-model="form.location" type="text" class="w-full border rounded-md px-3 py-2">
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
import { ref, computed, onMounted } from 'vue'
import { useItemStore } from '../../store/modules/items'
import { useCategoryStore } from '../../store/modules/categories'
import swal from '../../utils/swal'

const itemStore = useItemStore()
const categoryStore = useCategoryStore()

const items = ref([])
const categories = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const filters = ref({
  categoryId: '',
  search: ''
})

const form = ref({
  name: '',
  categoryId: '',
  description: '',
  location: '',
  rating: 0
})

onMounted(async () => {
  await Promise.all([
    loadItems(),
    loadCategories()
  ])
})

const loadItems = async () => {
  await itemStore.fetchItems()
  items.value = itemStore.items
}

const loadCategories = async () => {
  await categoryStore.fetchCategories()
  categories.value = categoryStore.categories
}

const filteredItems = computed(() => {
  let result = [...items.value]
  
  if (filters.value.categoryId) {
    result = result.filter(item => item.categoryId === filters.value.categoryId)
  }
  
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.description.toLowerCase().includes(searchLower)
    )
  }
  
  return result
})

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

const applyFilters = () => {
  // 已通过计算属性自动应用
}

const openAddModal = () => {
  isEditing.value = false
  form.value = { 
    name: '',
    categoryId: categories.value.length > 0 ? categories.value[0].id : '',
    description: '',
    location: '',
    rating: 0
  }
  showModal.value = true
}

const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  form.value = { ...item }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveItem = async () => {
  try {
    if (isEditing.value) {
      await itemStore.updateItem(editingId.value, form.value)
    } else {
      await itemStore.createItem(form.value)
    }
    await loadItems()
    closeModal()
  } catch (error) {
    await swal.error('操作失败', error.message)
  }
}

const confirmDelete = async (item) => {
  const result = await swal.confirm('确认删除', `确定要删除点评项 "${item.name}" 吗？此操作不可恢复。`)
  if (result.isConfirmed) {
    try {
      await itemStore.deleteItem(item.id)
      await loadItems()
    } catch (error) {
      await swal.error('删除失败', error.message)
    }
  }
}
</script>