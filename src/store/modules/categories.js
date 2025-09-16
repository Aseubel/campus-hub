import { defineStore } from 'pinia'
import api from '@/api'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        // 模拟API调用
        // const response = await api.categories.getAll()
        // this.categories = response.data
        
        // 模拟数据
        this.categories = [
          { id: 1, name: '课程点评' },
          { id: 2, name: '食堂外卖' },
          { id: 3, name: '校园商铺' },
          { id: 4, name: '教师评价' }
        ]
        this.error = null
      } catch (error) {
        this.error = error.message || '获取分类失败'
      } finally {
        this.loading = false
      }
    },
    
    // 管理员操作
    async createCategory(category) {
      try {
        const response = await api.categories.create(category)
        this.categories.push(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    async updateCategory(id, data) {
      try {
        const response = await api.categories.update(id, data)
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    async deleteCategory(id) {
      try {
        await api.categories.delete(id)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (error) {
        throw error
      }
    }
  }
})