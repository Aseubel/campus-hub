import { defineStore } from 'pinia'
import api from '../../api'

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
        // 模拟API调用
        // const response = await api.reviews.getByItem(itemId)
        // this.reviews = response.data
        
        // 模拟数据
        this.reviews = [
          {
            id: 1001,
            itemId: parseInt(itemId),
            score: 9,
            content: "内容很棒，作业有点多。",
            user: { id: 1, name: "张三", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
            createdAt: "2025-09-10T10:30:00Z",
            isOwner: true
          },
          {
            id: 1002,
            itemId: parseInt(itemId),
            score: 7,
            content: "老师讲得不错，但是课程难度较大。",
            user: { id: 2, name: "李四", avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
            createdAt: "2025-09-09T14:20:00Z",
            isOwner: false
          },
          {
            id: 1003,
            itemId: parseInt(itemId),
            score: 8,
            content: "整体来说是一门不错的课程，推荐选修。",
            user: { id: 3, name: "王五", avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
            createdAt: "2025-09-08T09:15:00Z",
            isOwner: false
          }
        ]
        
        this.error = null
      } catch (error) {
        this.error = error.message || '获取评论失败'
      } finally {
        this.loading = false
      }
    },
    
    async createReview(review) {
      try {
        // 模拟API调用
        // const response = await api.reviews.create(review)
        // 模拟响应
        const newReview = {
          id: Date.now(),
          ...review,
          user: { id: 1, name: "当前用户", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
          createdAt: new Date().toISOString(),
          isOwner: true
        }
        
        this.reviews.unshift(newReview)
        return newReview
      } catch (error) {
        throw error
      }
    },
    
    async updateReview(id, data) {
      try {
        // 模拟API调用
        // const response = await api.reviews.update(id, data)
        
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
        // 模拟API调用
        // await api.reviews.delete(id)
        
        this.reviews = this.reviews.filter(r => r.id !== id)
      } catch (error) {
        throw error
      }
    },
    
    // 管理员操作
    async fetchAllReviews(params) {
      try {
        const response = await api.reviews.getAll(params)
        return response.data
      } catch (error) {
        throw error
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