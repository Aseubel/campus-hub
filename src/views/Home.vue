<template>
  <div class="home-container min-h-screen bg-neutral-50 p-4 md:p-6">
    <!-- 页面标题 -->
    <div class="mb-6 md:mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-display font-bold text-primary-700 mb-2">校园点评平台</h1>
      <p class="text-neutral-600 text-lg">发现校园精彩，分享真实体验</p>
    </div>

    <!-- 搜索框 -->
    <div class="mb-6 max-w-2xl mx-auto">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="搜索点评项..."
          class="w-full px-4 py-3 pl-12 pr-10 border border-neutral-400 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-neutral-900 placeholder-neutral-500 shadow-sm"
          @input="handleSearch">
        <svg class="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button v-if="searchQuery" @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-error-600 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      <!-- 左侧分类列表 -->
      <div class="lg:col-span-3 bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
          <svg class="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
          分类筛选
        </h2>

        <div v-if="categoryStore.loading" class="text-center py-8">
          <div class="animate-pulse">
            <div class="h-4 bg-neutral-200 rounded mb-2 mx-auto w-3/4"></div>
            <div class="h-4 bg-neutral-200 rounded mb-2 mx-auto w-1/2"></div>
          </div>
        </div>

        <ul v-else class="space-y-3">
          <li v-for="category in categoryStore.categories" :key="category.id"
            class="cursor-pointer p-3 rounded-xl transition-all duration-200 group" :class="{
              'bg-primary-50 border-2 border-primary-200': selectedCategoryId === category.id,
              'hover:bg-neutral-50 border border-transparent': selectedCategoryId !== category.id
            }" @click="selectCategory(category.id)">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3 transition-colors" :class="{
                'bg-primary-500': selectedCategoryId === category.id,
                'bg-neutral-300 group-hover:bg-primary-400': selectedCategoryId !== category.id
              }"></div>
              <span class="font-medium transition-colors" :class="{
                'text-primary-700': selectedCategoryId === category.id,
                'text-neutral-700 group-hover:text-primary-600': selectedCategoryId !== category.id
              }">
                {{ category.name }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 中间点评项列表 -->
      <div class="lg:col-span-6 bg-white rounded-2xl shadow-soft p-6 animate-slide-up">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-neutral-800 flex items-center">
            <svg class="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ selectedCategoryName || '所有点评项' }}
          </h2>
          <span class="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            {{ itemStore.items.length }} 个结果
          </span>
        </div>

        <div v-if="itemStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="bg-neutral-200 h-40 rounded-xl mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded mb-2"></div>
            <div class="h-3 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>

        <div v-else-if="itemStore.items.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-neutral-500 text-lg">暂无点评项</p>
          <p class="text-neutral-400 text-sm mt-1">选择其他分类试试看</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in itemStore.items" :key="item.id"
            class="bg-white border border-neutral-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-medium hover:border-primary-100 cursor-pointer group"
            @click="selectItem(item.id)">
            <div class="relative overflow-hidden">
              <img :src="item.imageUrl" :alt="item.name"
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div class="absolute top-3 right-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {{ item.score == null ? '未评分' : item.score }}
              </div>
            </div>

            <div class="p-4">
              <h3 class="font-semibold text-neutral-800 text-lg mb-2 group-hover:text-primary-600 transition-colors">
                {{ item.name }}
              </h3>

            </div>
          </div>
        </div>
      </div>

      <!-- 右侧详情面板 -->
      <div class="lg:col-span-3 bg-white rounded-2xl shadow-soft p-6 animate-scale-in">
        <div v-if="!selectedItemId" class="text-center py-12">
          <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-neutral-600 mb-2">查看详情</h3>
          <p class="text-neutral-400 text-sm">选择一个点评项查看详细信息和评论</p>
        </div>

        <div v-else>
          <div v-if="itemStore.loading" class="animate-pulse">
            <div class="bg-neutral-200 h-48 rounded-xl mb-4"></div>
            <div class="h-6 bg-neutral-200 rounded mb-3 w-3/4"></div>
            <div class="h-4 bg-neutral-200 rounded mb-2 w-full"></div>
            <div class="h-4 bg-neutral-200 rounded mb-2 w-2/3"></div>
          </div>

          <div v-else-if="itemStore.currentItem" class="space-y-6">
            <!-- 图片和基本信息 -->
            <div class="relative">
              <img :src="itemStore.currentItem.imageUrl" :alt="itemStore.currentItem.name"
                class="w-full h-48 object-cover rounded-xl mb-4" />
              <div class="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ itemStore.currentItem.score == null ? '未评分' : itemStore.currentItem.score }}
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-neutral-800 mb-2">{{ itemStore.currentItem.name }}</h2>
              <p class="text-neutral-600 leading-relaxed">{{ itemStore.currentItem.description }}</p>
            </div>

            <!-- 详细信息卡片 -->
            <div v-if="itemStore.currentItem.metadata" class="bg-primary-50 border border-primary-100 rounded-xl p-4">
              <h3 class="font-semibold text-primary-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd" />
                </svg>
                详细信息
              </h3>
              <div class="grid gap-3">
                <div v-for="(value, key) in JSON.parse(itemStore.currentItem.metadata)" :key="key"
                  class="flex justify-between">
                  <span class="text-primary-700 font-medium">{{ key }}:</span>
                  <span class="text-primary-600">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- 评论区 -->
            <div class="border-t border-neutral-200 pt-6">
              <h3 class="font-semibold text-neutral-800 text-lg mb-4 flex items-center">
                <svg class="w-5 h-5 text-primary-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"
                    clip-rule="evenodd" />
                </svg>
                评论 ({{ reviewStore.reviews.length }})
              </h3>

              <!-- 评论表单 -->
              <div v-if="authStore.isLoggedIn" class="bg-white border border-neutral-200 rounded-xl p-4 mb-6">
                <h4 class="font-medium text-neutral-800 mb-3">发表评价</h4>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-neutral-700 mb-2">评分</label>
                  <div class="flex items-center space-x-1">
                    <button v-for="star in 10" :key="star" @click="reviewForm.score = star"
                      class="w-8 h-8 rounded-full transition-colors" :class="{
                        'bg-primary-500 text-white': star <= reviewForm.score,
                        'bg-neutral-100 text-neutral-400 hover:bg-primary-100': star > reviewForm.score
                      }">
                      {{ star }}
                    </button>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-neutral-700 mb-2">评论内容</label>
                  <textarea v-model="reviewForm.content" rows="3" placeholder="分享你的真实体验..."
                    class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"></textarea>
                </div>

                <button @click="submitReview"
                  class="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
                  :disabled="!reviewForm.score || !reviewForm.content">
                  提交评论
                </button>
              </div>

              <!-- 评论列表 -->
              <div v-if="reviewStore.loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                  <div class="flex items-start mb-2">
                    <div class="w-8 h-8 bg-neutral-200 rounded-full mr-3"></div>
                    <div class="flex-1">
                      <div class="h-4 bg-neutral-200 rounded mb-2 w-1/3"></div>
                      <div class="h-3 bg-neutral-200 rounded mb-2 w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="reviewStore.reviews.length === 0" class="text-center py-8">
                <svg class="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-neutral-500">暂无评论</p>
                <p class="text-neutral-400 text-sm mt-1">成为第一个评论者吧！</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="review in reviewStore.reviews" :key="review.id"
                  class="bg-white border border-neutral-200 rounded-xl p-4 transition-colors hover:border-primary-200">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {{ review.user.username || 'U' }}
                      </div>
                      <div class="ml-3">
                        <p class="font-medium text-neutral-800">{{ review.user.username }}</p>
                        <div class="flex items-center mt-1">
                          <div class="flex">
                            <svg v-for="star in 5" :key="star" class="w-4 h-4" :class="{
                              'text-yellow-400': star <= Math.floor(review.score / 2),
                              'text-neutral-300': star > Math.floor(review.score / 2)
                            }" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span class="ml-2 text-sm text-neutral-600">{{ review.score }}/10</span>
                        </div>
                      </div>
                    </div>
                    <span class="text-sm text-neutral-500">{{ formatDate(review.createdAt) }}</span>
                  </div>

                  <p class="text-neutral-700 leading-relaxed">{{ review.content }}</p>

                  <div v-if="authStore.isAdmin" class="mt-3 pt-3 border-t border-neutral-100">
                    <button @click="deleteReview(review.id)"
                      class="text-error-500 text-sm hover:text-error-700 transition-colors flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      删除评论
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoryStore } from '@/store/modules/categories'
import { useItemStore } from '@/store/modules/items'
import { useReviewStore } from '@/store/modules/reviews'
import { useAuthStore } from '@/store/modules/auth'
import swal from '@/utils/swal'

const categoryStore = useCategoryStore()
const itemStore = useItemStore()
const reviewStore = useReviewStore()
const authStore = useAuthStore()

const selectedCategoryId = ref(null)
const selectedItemId = ref(null)
const searchQuery = ref('')
const reviewForm = ref({
  score: 8,
  content: ''
})

const selectedCategoryName = computed(() => {
  if (!selectedCategoryId.value) return null
  const category = categoryStore.categories.find(c => c.id === selectedCategoryId.value)
  return category ? category.name : null
})

onMounted(async () => {
  await categoryStore.fetchCategories()
  if (categoryStore.categories.length > 0) {
    selectCategory(categoryStore.categories[0].id)
  }
})

const selectCategory = async (categoryId) => {
  selectedCategoryId.value = categoryId
  selectedItemId.value = null
  await itemStore.fetchItemsByCategory(categoryId)
}

const selectItem = async (itemId) => {
  selectedItemId.value = itemId
  await itemStore.fetchItemById(itemId)
  await reviewStore.fetchReviewsByItem(itemId)
}

const submitReview = async () => {
  if (!reviewForm.value.score || !reviewForm.value.content) {
    await swal.warning('提示', '请填写评分和评论内容')
    return
  }

  try {
    await reviewStore.createReview({
      userId: authStore.user.id,
      itemId: selectedItemId.value,
      score: parseInt(reviewForm.value.score),
      content: reviewForm.value.content
    })
    reviewForm.value.content = ''
  } catch (error) {
    await swal.error('提交失败', error.message)
    throw error
  }
}

const deleteReview = async (reviewId) => {
  const result = await swal.confirm('确认删除', '确定要删除这条评论吗？此操作不可恢复。')
  if (result.isConfirmed) {
    try {
      await reviewStore.deleteReview(reviewId)
    } catch (error) {
      await swal.error('删除失败', error.message)
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatMetadataKey = (key) => {
  const mapping = {
    teacher: '教师',
    credits: '学分',
    location: '位置',
    openHours: '营业时间'
  }
  return mapping[key] || key
}

// 搜索相关方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 执行搜索
    itemStore.searchItems(searchQuery.value.trim())
  } else {
    // 如果搜索框为空，恢复显示当前分类的点评项
    if (selectedCategoryId.value) {
      itemStore.fetchItemsByCategory(selectedCategoryId.value)
    }
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  // 恢复显示当前分类的点评项
  if (selectedCategoryId.value) {
    itemStore.fetchItemsByCategory(selectedCategoryId.value)
  }
}
</script>