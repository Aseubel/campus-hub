<template>
  <div class="review-management">
    <h1 class="text-2xl font-bold mb-6">评论管理</h1>
    
    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="w-64">
          <label class="block text-sm font-medium text-gray-700 mb-1">点评项</label>
          <select v-model="filters.itemId" class="w-full border rounded-md px-3 py-2">
            <option value="">全部点评项</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="applyFilters" class="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
            应用筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点评项</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="review in filteredReviews" :key="review.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ review.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ review.userId }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ getItemName(review.itemId) }}</td>
            <td class="px-6 py-4">
              <div class="max-w-xs truncate">{{ review.content }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(review.createdAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="viewReview(review)" class="text-blue-600 hover:text-blue-900 mr-3">查看</button>
              <button @click="confirmDelete(review)" class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 查看评论详情模态框 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">评论详情</h2>
        <div v-if="selectedReview">
          <div class="mb-4">
            <div class="text-sm text-gray-500">点评项</div>
            <div class="font-medium">{{ getItemName(selectedReview.itemId) }}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-500">用户</div>
            <div class="font-medium">{{ selectedReview.userId }}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-500">日期</div>
            <div class="font-medium">{{ formatDate(selectedReview.createdAt) }}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-500">内容</div>
            <div class="mt-1 p-3 bg-gray-50 rounded">{{ selectedReview.content }}</div>
          </div>
          <div class="flex justify-end">
            <button @click="closeModal" class="px-4 py-2 border rounded-md">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReviewStore } from '../../store/modules/reviews'
import { useItemStore } from '../../store/modules/items'
import swal from '../../utils/swal'

const reviewStore = useReviewStore()
const itemStore = useItemStore()

const reviews = ref([])
const items = ref([])
const showModal = ref(false)
const selectedReview = ref(null)
const filters = ref({
  itemId: ''
})

onMounted(async () => {
  await Promise.all([
    loadReviews(),
    loadItems()
  ])
})

const loadReviews = async () => {
  await reviewStore.fetchReviews()
  reviews.value = reviewStore.reviews
}

const loadItems = async () => {
  await itemStore.fetchItems()
  items.value = itemStore.items
}

const filteredReviews = computed(() => {
  let result = [...reviews.value]
  
  if (filters.value.itemId) {
    result = result.filter(review => review.itemId === filters.value.itemId)
  }
  
  return result
})

const getItemName = (itemId) => {
  const item = items.value.find(i => i.id === itemId)
  return item ? item.name : '未知点评项'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const applyFilters = () => {
  // 已通过计算属性自动应用
}

const viewReview = (review) => {
  selectedReview.value = review
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedReview.value = null
}

const confirmDelete = async (review) => {
  const result = await swal.confirm('确认删除', '确定要删除这条评论吗？此操作不可恢复。')
  if (result.isConfirmed) {
    try {
      await reviewStore.deleteReview(review.id)
      await loadReviews()
    } catch (error) {
      await swal.error('删除失败', error.message)
    }
  }
}
</script>