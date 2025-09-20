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
        const response = await api.categories.getAll()
        this.categories = response.data.data
        
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