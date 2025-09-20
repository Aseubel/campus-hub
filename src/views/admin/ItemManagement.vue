<template>
  <div class="item-management p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">点评项管理</h1>
      <button @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
        添加点评项
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select v-model="filters.categoryId"
            class="w-full bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="0">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
          <input v-model="filters.search" type="text" placeholder="搜索名称..."
            class="w-full bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition">
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均分</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ getCategoryName(item.categoryId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.score }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800 transition-colors">编辑</button>
                <button @click="confirmDelete(item)"
                  class="text-red-600 hover:text-red-800 transition-colors">删除</button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="5" class="text-center py-10 text-gray-500">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl transform transition-all overflow-y-auto max-h-[90vh]"
        :class="showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
        <h2 class="text-xl font-bold mb-6 text-gray-800">{{ isEditing ? '编辑点评项' : '添加点评项' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input v-model="form.name" type="text"
                  class="w-full bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select v-model="form.categoryId"
                  class="w-full bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea v-model="form.description"
                  class="w-full bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="10"></textarea>
              </div>
            </div>

            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">元数据</label>
              <div class="space-y-2">
                <div v-for="(key, index) in Object.keys(metadataObj)" :key="index" class="flex gap-2">
                  <input :value="key" @input="updateMetaKey(key, $event.target.value)" type="text" placeholder="键"
                    class="w-1/3 bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input v-model="metadataObj[key]" type="text" placeholder="值"
                    class="w-1/3 bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" @click="delete metadataObj[key]"
                    class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    -
                  </button>
                </div>
                <div class="flex gap-2">
                  <input v-model="newKey" type="text" placeholder="键"
                    class="w-1/3 bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input v-model="newVal" type="text" placeholder="值"
                    class="w-1/3 bg-white text-gray-900 p-2 border border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" @click="addMeta"
                    class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">图片</label>
                <input type="file" @change="handleFileUpload" accept="image/*"
                  class="w-full text-sm text-gray-900 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
                <div v-if="form.imageUrl" class="mt-4">
                  <img :src="form.imageUrl" alt="图片预览" class="w-full h-auto rounded-lg shadow-md" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useItemStore } from '@/store/modules/items'
import { useCategoryStore } from '@/store/modules/categories'
import { useImageStore } from '@/store/modules/images' // 引入 useImageStore
import swal from '@/utils/swal'

const itemStore = useItemStore()
const categoryStore = useCategoryStore()
const imageStore = useImageStore() // 实例化 imageStore

const metadataObj = ref({})          // 真正绑定的对象
const newKey = ref('')               // 新增键
const newVal = ref('')               // 新增值

const items = ref([])
const categories = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const filters = ref({
  categoryId: '0',
  search: ''
})

const form = ref({
  name: '',
  categoryId: '',
  description: '',
  imageUrl: '' // 添加 imageUrl 字段
})

const selectedFile = ref(null) // 用于存储用户选择的文件
const isUploadingImage = ref(false) // 新增：图片上传状态
onMounted(async () => {
  await Promise.all([
    loadAllItems(),
    loadCategories()
  ])
})

const loadItems = async (categoryId = 0) => {
  await itemStore.fetchItemsByCategory(categoryId)
  items.value = itemStore.items
}

const loadAllItems = async () => {
  await itemStore.fetchAllItems()
  items.value = itemStore.items
}

const loadCategories = async () => {
  await categoryStore.fetchCategories()
  categories.value = categoryStore.categories
}

// 搜索
const filteredItems = computed(() => {
  let result = [...items.value]

  if (filters.value.categoryId !== '0') {
    result = result.filter(item => item.categoryId === filters.value.categoryId)
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower))
    )
  }

  return result
})

watch(() => filters.value.categoryId, (newCategoryId) => {
  if (newCategoryId === '0') {
    loadAllItems()
  } else {
    loadItems(newCategoryId === '' ? 0 : newCategoryId)
  }
})

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

const openAddModal = () => {
  isEditing.value = false
  metadataObj.value = {}
  form.value = {
    name: '',
    categoryId: categories.value.length ? categories.value[0].id : '',
    description: '',
    metadata: '{}',   // 空元数据
    imageUrl: '' // 清空图片 URL
  }
  selectedFile.value = null // 清空已选择的文件
  showModal.value = true
}


const editItem = (item) => {
  isEditing.value = true
  editingId.value = item.id
  // 把后端字符串解析成对象
  try {
    metadataObj.value = JSON.parse(item.metadata || '{}')
  } catch {
    metadataObj.value = {}
  }
  form.value = { ...item }
  selectedFile.value = null // 编辑时清空已选择的文件
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// 支持修改元数据的键
const updateMetaKey = (oldKey, newKey) => {
  if (oldKey === newKey || !newKey.trim()) return;
  const value = metadataObj.value[oldKey];
  delete metadataObj.value[oldKey];
  metadataObj.value[newKey.trim()] = value;
};


const addMeta = () => {
  const k = newKey.value.trim()
  if (!k || metadataObj.value[k] !== undefined) return
  metadataObj.value[k] = newVal.value.trim()
  newKey.value = ''
  newVal.value = ''
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    form.value.imageUrl = URL.createObjectURL(file); // 本地预览

    isUploadingImage.value = true; // 开始上传，设置上传状态为 true
    try {
      const formData = new FormData();
      formData.append('file', selectedFile.value); // 'file' 是后端接收文件的字段名
      const imageUrl = await imageStore.uploadImage(formData);
      form.value.imageUrl = imageUrl; // 更新表单中的图片 URL
      swal.success('图片上传成功');
    } catch (error) {
      swal.error('图片上传失败', error.message);
      form.value.imageUrl = ''; // 清空图片 URL
      selectedFile.value = null; // 清空已选择的文件
      closeModal(); // 上传失败关闭编辑框
    } finally {
      isUploadingImage.value = false; // 上传结束，设置上传状态为 false
    }
  }
};


const saveItem = async () => {
  if (isUploadingImage.value) {
    swal.info('图片正在上传中，请稍候...');
    return;
  }
  try {
    // 如果有选择文件，则先上传文件
    // if (selectedFile.value) {
    //   const formData = new FormData()
    //   formData.append('file', selectedFile.value) // 'image' 是后端接收文件的字段名
    //   const imageUrl = await imageStore.uploadImage(formData)
    //   form.value.imageUrl = imageUrl // 更新表单中的图片 URL
    // }

    // 把对象转成字符串再提交
    const payload = {
      ...form.value,
      metadata: JSON.stringify(metadataObj.value)
    }
    if (isEditing.value) {
      await itemStore.updateItem(editingId.value, payload)
    } else {
      await itemStore.createItem(payload)
    }
    await loadAllItems() // Refresh all items after saving
    closeModal()
    swal.success('操作成功')
  } catch (error) {
    swal.error('操作失败', error.message)
  }
}

const confirmDelete = async (item) => {
  const result = await swal.confirm('确认删除', `确定要删除点评项 "${item.name}" 吗？此操作不可恢复。`)
  if (result.isConfirmed) {
    try {
      await itemStore.deleteItem(item.id)
      await loadAllItems() // Refresh all items after deleting
      swal.success('删除成功')
    } catch (error) {
      swal.error('删除失败', error.message)
    }
  }
}
</script>