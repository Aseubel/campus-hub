import { defineStore } from 'pinia'
import api from '@/api'

export const useImageStore = defineStore('images', {
  state: () => ({
    images: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async uploadImage(data) {
      this.loading = true
      try {
        const response = await api.images.upload(data)
        this.error = null
        return response.data.data.imageUrl
      } catch (error) {
        this.error = error.message || '上传图片失败'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})