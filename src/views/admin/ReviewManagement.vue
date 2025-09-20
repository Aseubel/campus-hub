<template>
  <div class="review-management p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">评论管理</h1>
    </div>

    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">点评项</label>
          <select v-model="filters.itemId"
            class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="0">全部点评项</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
          <input v-model="filters.search" type="text" placeholder="搜索用户或内容..."
            class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点评项</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分数</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="review in filteredReviews" :key="review.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ review.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ review.user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ getItemName(review.itemId) }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <p class="max-w-xs truncate">{{ review.content }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ review.score }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(review.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="viewReview(review)"
                  class="text-blue-600 hover:text-blue-800 transition-colors">查看</button>
                <button @click="confirmDelete(review)"
                  class="text-red-600 hover:text-red-800 transition-colors">删除</button>
              </td>
            </tr>
            <tr v-if="filteredReviews.length === 0">
              <td colspan="6" class="text-center py-10 text-gray-500">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl transform transition-all"
        :class="showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">评论详情</h2>
        <div v-if="selectedReview" class="space-y-4">
          <div>
            <div class="text-sm text-gray-500">点评项</div>
            <div class="font-medium text-gray-800">{{ getItemName(selectedReview.itemId) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">用户</div>
            <div class="font-medium text-gray-800">{{ selectedReview.user.username }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">内容</div>
            <div class="mt-1 p-3 bg-gray-100 rounded-lg text-gray-800">{{ selectedReview.content }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">分数</div>
            <div class="font-medium text-gray-800">{{ selectedReview.score }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">日期</div>
            <div class="font-medium text-gray-800">{{ formatDate(selectedReview.createdAt) }}</div>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReviewStore } from '@/store/modules/reviews'
import { useItemStore } from '@/store/modules/items'
import swal from '@/utils/swal'

const reviewStore = useReviewStore()
const itemStore = useItemStore()

const reviews = ref([])
const items = ref([])
const showModal = ref(false)
const selectedReview = ref(null)
const filters = ref({
  itemId: '0',
  search: ''
})

onMounted(async () => {
  await Promise.all([
    loadAllReviews(),
    loadItems()
  ])
})

const loadReviews = async (itemId = 0) => {
  await reviewStore.fetchReviewsByItem(itemId) // Fetch all reviews for admin
  reviews.value = reviewStore.reviews
  console.log(reviews.value)
}

const loadAllReviews = async () => {
  await reviewStore.fetchAllReviews() // Fetch all reviews for admin
  reviews.value = reviewStore.reviews
}

const loadItems = async () => {
  await itemStore.fetchAllItems() // Fetch all items for filtering
  items.value = itemStore.items
}

const filteredReviews = computed(() => {
  let result = [...reviews.value]

  if (filters.value.itemId !== '0') {
    result = result.filter(review => review.itemId === filters.value.itemId)
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(review =>
      review.user.username.toLowerCase().includes(searchLower) ||
      review.content.toLowerCase().includes(searchLower)
    )
  }

  return result
})

watch(() => filters.value.itemId, (newItemId) => {
  if (newItemId === '0') {
    loadAllReviews()
  } else {
    loadReviews(newItemId === '' ? 0 : newItemId)
  }
})

const getItemName = (itemId) => {
  const item = items.value.find(i => i.id === itemId)
  return item ? item.name : '未知点评项'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString)
  return date.toLocaleDateString()
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
      swal.success('删除成功')
    } catch (error) {
      swal.error('删除失败', error.message)
    }
  }
}
</script>