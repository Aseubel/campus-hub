import { defineStore } from 'pinia'
import api from '../../api'

export const useItemStore = defineStore('items', {
  state: () => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchItemsByCategory(categoryId) {
      this.loading = true
      try {
        const response = await api.items.getByCategory(categoryId)
        this.items = response.data.data
        
        // 模拟数据
        // this.items = [
        //   { 
        //     id: 101, 
        //     categoryId: 1, 
        //     name: '高级软件工程', 
        //     imageUrl: 'https://picsum.photos/400/300?random=1', 
        //     description: '一门深入探讨软件开发生命周期的课程。',
        //     metadata: { teacher: '李四教授', credits: 3 }
        //   },
        //   { 
        //     id: 102, 
        //     categoryId: 1, 
        //     name: '数据结构与算法', 
        //     imageUrl: 'https://picsum.photos/400/300?random=2', 
        //     description: '计算机科学的基础课程，讲解各种数据结构和算法。',
        //     metadata: { teacher: '王五教授', credits: 4 }
        //   },
        //   { 
        //     id: 201, 
        //     categoryId: 2, 
        //     name: '第一食堂', 
        //     imageUrl: 'https://picsum.photos/400/300?random=3', 
        //     description: '学校主食堂，提供各种中式快餐。',
        //     metadata: { location: '校区中心', openHours: '7:00-20:00' }
        //   }
        // ].filter(item => !categoryId || item.categoryId === parseInt(categoryId))
        
        this.error = null
      } catch (error) {
        this.error = error.message || '获取点评项失败'
      } finally {
        this.loading = false
      }
    },

    async fetchAllItems() {
      this.loading = true
      try {
        const response = await api.items.getAll()
        this.items = response.data.data

        this.error = null
      } catch (error) {
        this.error = error.message || '获取点评项失败'
      } finally {
        this.loading = false
      }
    },
    
    async fetchItemById(id) {
      this.loading = true
      try {
        const response = await api.items.getById(id)
        this.currentItem = response.data.data
        
        // 模拟数据
        // this.currentItem = this.items.find(item => item.id === parseInt(id)) || {
        //   id: parseInt(id),
        //   categoryId: 1,
        //   name: `点评项 ${id}`,
        //   imageUrl: `https://picsum.photos/400/300?random=${id}`,
        //   description: '这是一个示例点评项的详细描述。',
        //   metadata: { teacher: '示例教授', credits: 3 }
        // }
        
        this.error = null
      } catch (error) {
        this.error = error.message || '获取点评项详情失败'
      } finally {
        this.loading = false
      }
    },
    
    // 管理员操作
    async createItem(item) {
      try {
        const response = await api.items.create(item)
        this.items.push(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    async updateItem(id, data) {
      try {
        const response = await api.items.update(id, data)
        const index = this.items.findIndex(item => item.id === id)
        if (index !== -1) {
          this.items[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },
    
    async deleteItem(id) {
      try {
        await api.items.delete(id)
        this.items = this.items.filter(item => item.id !== id)
      } catch (error) {
        throw error
      }
    },
    
    // 搜索点评项
    async searchItems(query) {
      this.loading = true
      try {
        // 模拟搜索API调用
        // const response = await api.items.search(query)
        // this.items = response.data
        
        // 模拟搜索逻辑
        const allItems = [
          { 
            id: 101, 
            categoryId: 1, 
            name: '高级软件工程', 
            imageUrl: 'https://picsum.photos/400/300?random=1', 
            description: '一门深入探讨软件开发生命周期的课程。',
            metadata: { teacher: '李四教授', credits: 3 }
          },
          { 
            id: 102, 
            categoryId: 1, 
            name: '数据结构与算法', 
            imageUrl: 'https://picsum.photos/400/300?random=2', 
            description: '计算机科学的基础课程，讲解各种数据结构和算法。',
            metadata: { teacher: '王五教授', credits: 4 }
          },
          { 
            id: 201, 
            categoryId: 2, 
            name: '第一食堂', 
            imageUrl: 'https://picsum.photos/400/300?random=3', 
            description: '学校主食堂，提供各种中式快餐。',
            metadata: { location: '校区中心', openHours: '7:00-20:00' }
          },
          { 
            id: 202, 
            categoryId: 2, 
            name: '咖啡厅', 
            imageUrl: 'https://picsum.photos/400/300?random=4', 
            description: '校园内的休闲咖啡厅，提供各种饮品和小吃。',
            metadata: { location: '图书馆旁', openHours: '8:00-22:00' }
          },
          { 
            id: 301, 
            categoryId: 3, 
            name: '图书馆', 
            imageUrl: 'https://picsum.photos/400/300?random=5', 
            description: '学校主图书馆，提供丰富的学习资源和安静的学习环境。',
            metadata: { location: '校区北侧', openHours: '8:00-22:00' }
          }
        ]
        
        // 执行搜索
        const searchTerm = query.toLowerCase()
        this.items = allItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          (item.metadata && (
            (item.metadata.teacher && item.metadata.teacher.toLowerCase().includes(searchTerm)) ||
            (item.metadata.location && item.metadata.location.toLowerCase().includes(searchTerm))
          ))
        )
        
        this.error = null
      } catch (error) {
        this.error = error.message || '搜索失败'
      } finally {
        this.loading = false
      }
    }
  }
})