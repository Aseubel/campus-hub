import { defineStore } from 'pinia'
import axios from 'axios'
import api from '../../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') === 'undefined' ? 'null' : localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAdmin: (state) => state.user && state.user.role === 'admin'
  },
  
  actions: {
    async login(credentials) {
      try {
        // 支持用户名+密码和手机号+验证码两种方式
        let response
        if (credentials.password) {
          response = await api.auth.login({
            loginId: credentials.loginId,
            password: credentials.password
          })
        } else {
          response = await api.auth.mobileLogin({
            phone: credentials.phone,
            smsCode: credentials.smsCode
          })
        }
      
        
        this.setUser(response.data.data.user)
        this.setAccessToken(response.data.data.accessToken)
        this.setRefreshToken(response.data.data.refreshToken)
        return response.data.data.user
      } catch (error) {
        throw error
      }
    },
    
    async register(userData) {
      try {
        const response = await api.auth.register({userData})
        
        this.setUser(response.data.data.user)
        this.setAccessToken(response.data.data.accessToken)
        this.setRefreshToken(response.data.data.refreshToken)
        return response.data.data.user
      } catch (error) {
        throw error
      }
    },

    async sendSmsCode(phone) {
      try {
        const response = await api.auth.sendSmsCode({
          phone: phone
        })
        return response.data.message
      } catch (error) {
        throw error
      }
    },
    
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    setAccessToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    
    setRefreshToken(token) {
      this.refreshToken = token
      localStorage.setItem('refreshToken', token)
    }
  }
})