import { defineStore } from 'pinia'
import api from '@/api'

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    reviews: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchReviewsByItem(itemId) {
      this.loading = true
      try {
        const response = await api.reviews.getByItem(itemId)
        this.reviews = response.data.data
        this.error = null
      } catch (error) {
        this.error = error.message || '获取评论失败'
      } finally {
        this.loading = false
      }
    },

    async createReview(review) {
      try {
        const response = await api.reviews.create(review)
        const newReview = response.data.data
        newReview.createdAt = new Date().toDateString()
        this.reviews.unshift(newReview)
        return newReview
      } catch (error) {
        throw error
      }
    },
    
    async updateReview(id, data) {
      try {
        const response = await api.reviews.update(id, data)
        
        const index = this.reviews.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reviews[index] = { ...this.reviews[index], ...data }
        }
        
        return this.reviews[index]
      } catch (error) {
        throw error
      }
    },
    
    async deleteReview(id) {
      try {
        await api.reviews.delete(id)
        
        this.reviews = this.reviews.filter(r => r.id !== id)
      } catch (error) {
        throw error
      }
    },
    
    // 管理员操作
    async fetchAllReviews() {
      this.loading = true
      try {
        const response = await api.reviews.getAll()
        this.reviews = response.data.data
        this.error = null
      } catch (error) {
        this.error = error.message || '获取评论失败'
      } finally {
        this.loading = false
      }
    },
    
    async adminDeleteReview(id) {
      try {
        await api.reviews.adminDelete(id)
        this.reviews = this.reviews.filter(r => r.id !== id)
      } catch (error) {
        throw error
      }
    }
  }
})