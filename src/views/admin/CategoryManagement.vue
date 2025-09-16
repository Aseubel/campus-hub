<template>
  <div class="category-management">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">分类管理</h1>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        添加分类
      </button>
    </div>

    <!-- 分类表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="editCategory(category)" class="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
              <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑分类模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? '编辑分类' : '添加分类' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
            <input v-model="form.name" type="text" class="w-full border rounded-md px-3 py-2" required>
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
import { useCategoryStore } from '@/store/modules/categories'
import swal from '@/utils/swal'

const categoryStore = useCategoryStore()
const categories = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({ name: '' })
const editingId = ref(null)

onMounted(async () => {
  console.log('分类管理页面加载')
  await loadCategories()
})

const loadCategories = async () => {
  await categoryStore.fetchCategories()
  categories.value = categoryStore.categories
  console.log(categories.value)
}

const openAddModal = () => {
  isEditing.value = false
  form.value = { name: '' }
  showModal.value = true
}

const editCategory = (category) => {
  isEditing.value = true
  editingId.value = category.id
  form.value = { name: category.name }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = async () => {
  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(editingId.value, form.value)
    } else {
      await categoryStore.createCategory(form.value)
    }
    await loadCategories()
    closeModal()
  } catch (error) {
    await swal.error('操作失败', error.message)
  }
}

const confirmDelete = async (category) => {
  const result = await swal.confirm('确认删除', `确定要删除分类 "${category.name}" 吗？此操作不可恢复。`)
  if (result.isConfirmed) {
    try {
      await categoryStore.deleteCategory(category.id)
      await loadCategories()
    } catch (error) {
      await swal.error('删除失败', error.message)
    }
  }
}
</script>