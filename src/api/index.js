import axios from 'axios'
import swal from '@/utils/swal'

const api = axios.create({
  baseURL: '/api'
})

// 是否正在刷新token的标志
let isRefreshing = false
// 存储等待token刷新的请求
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// 请求拦截器添加accessToken
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 响应拦截器处理token过期
api.interceptors.response.use(
  response => {
    if (!response.data.success) {
      if (response.data.message) {
        swal.error(response.data.message)
      }
    } else {
      if (response.data.message && response.data.message != "操作成功") {
        swal.success(response.data.message)
      }
    }
    return response
  },
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新token，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }
      
      originalRequest._retry = true
      isRefreshing = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        // 调用刷新token接口
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        })
        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
        
        // 存储新的tokens
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        // 更新当前请求的header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        
        // 处理等待队列中的请求
        processQueue(null, newAccessToken)
        
        return api(originalRequest)
      } catch (refreshError) {
        // 刷新token失败，清除本地存储并跳转到登录页
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)

export default {
  // 用户认证
  auth: {
    getMe: () => api.get('/auth/me'),
    register: (params) => api.post('/auth/register', params),
    login: (params) => api.post('/auth/login', params),
    mobileLogin: (params) => api.post('/auth/mobile-login', params),
    logout: () => api.post('/auth/logout'),
    refresh: (params) => api.post('/auth/refresh', params),
    sendSmsCode: (params) => api.post('/auth/send-sms-code', params),
  },
  
  // 分类
  categories: {
    getAll: () => api.get('/category/all'),
    // 管理员接口
    create: (data) => api.post('/category', data),
    update: (id, data) => api.put(`/category/${id}`, data),
    delete: (id) => api.delete(`/category/${id}`)
  },
  
  // 点评项
  items: {
    getByCategory: (categoryId) => api.get(`/item?categoryId=${categoryId}`),
    getById: (id) => api.get(`/item/${id}`),
    // 管理员接口
    getAll: (params) => api.get('/item/all', { params }),
    create: (data) => api.post('/item', data),
    update: (id, data) => api.put(`/item/${id}`, data),
    delete: (id) => api.delete(`/item/${id}`)
  },
  
  // 评论
  reviews: {
    getByItem: (itemId) => api.get(`/review?itemId=${itemId}`),
    create: (data) => api.post('/review', data),
    update: (id, data) => api.put(`/review/${id}`, data),
    delete: (id) => api.delete(`/review/${id}`),
    // 管理员接口
    getAll: (params) => api.get('/review/all', { params }),
    adminDelete: (id) => api.delete(`/review/admin/${id}`)
  },
  
  // 用户管理 (仅管理员)
  users: {
    getAll: () => api.get('/user/all'),
    getById: (id) => api.get(`/user/${id}`),
    create: (data) => api.post('/user', data),
    update: (id, data) => api.put(`/user/${id}`, data),
    delete: (id) => api.delete(`/user/${id}`),

  },
  
  // 仪表盘数据 (仅管理员)
  dashboard: {
    getStats: () => api.get('/stats')
  },
  
  // 图片
  images: {
    upload: (data) => api.post('/common/uploadImage', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
  }
}