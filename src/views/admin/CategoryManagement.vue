<template>
  <div class="category-management p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">分类管理</h1>
      <button @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
        添加分类
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editCategory(category)"
                  class="text-blue-600 hover:text-blue-800 transition-colors">编辑</button>
                <button @click="confirmDelete(category)"
                  class="text-red-600 hover:text-red-800 transition-colors">删除</button>
              </td>
            </tr>
            <tr v-if="categories.length === 0">
              <td colspan="3" class="text-center py-10 text-gray-500">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all"
        :class="showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">{{ isEditing ? '编辑分类' : '添加分类' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
            <input v-model="form.name" type="text"
              class="w-full bg-white text-black border-2 border-gray-300 rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500 transition hover:border-blue-400"
              required>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
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
  await loadCategories()
})

const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories()
    categories.value = categoryStore.categories
  } catch (error) {
    swal.error('加载失败', '无法获取分类列表')
  }
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
    swal.success('操作成功')
  } catch (error) {
    swal.error('操作失败', error.message)
  }
}

const confirmDelete = async (category) => {
  const result = await swal.confirm('确认删除', `确定要删除分类 "${category.name}" 吗？此操作不可恢复。`)
  if (result.isConfirmed) {
    try {
      await categoryStore.deleteCategory(category.id)
      await loadCategories()
      swal.success('删除成功')
    } catch (error) {
      swal.error('删除失败', error.message)
    }
  }
}
</script>