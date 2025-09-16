<template>
  <div class="flex justify-center items-center min-h-[80vh]">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">登录</h1>

      <!-- 登录方式切换 -->
      <div class="flex mb-6 border-b border-gray-200">
        <button @click="loginType = 'password'" class="flex-1 py-2 px-4 text-center font-medium transition-colors"
          :class="{
            'text-blue-600 border-b-2 border-blue-600': loginType === 'password',
            'text-gray-500 hover:text-gray-700': loginType !== 'password'
          }">
          密码登录
        </button>
        <button @click="loginType = 'sms'" class="flex-1 py-2 px-4 text-center font-medium transition-colors" :class="{
          'text-blue-600 border-b-2 border-blue-600': loginType === 'sms',
          'text-gray-500 hover:text-gray-700': loginType !== 'sms'
        }">
          验证码登录
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 用户名/手机号输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ loginType === 'password' ? '用户名' : '手机号' }}
          </label>
          <input v-model="loginId" :type="loginType === 'password' ? 'text' : 'tel'"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :placeholder="loginType === 'password' ? '请输入用户名' : '请输入手机号'" required />
        </div>

        <!-- 密码输入 -->
        <div v-if="loginType === 'password'" class="relative">
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <input v-model="password" :type="passwordFieldType"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
            placeholder="请输入密码" required />
          <button type="button" @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 pt-6">
            <svg v-if="passwordFieldType === 'password'" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.981 12H12m0 0l-3.981 3.981M12 12l3.981-3.981M21.721 12C21.244 14.423 19.6 16.5 17.604 17.996C15.608 19.492 13.25 20.25 10.875 20.25c-2.376 0-4.734-.758-6.73-2.254Cm11.062-1.496c2.004-1.496 3.64-3.573 4.113-6A8.966 8.966 0 0012 4.5c-2.376 0-4.734.758-6.73 2.254L3.98 12M12 12V2.25" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <!-- 验证码输入 -->
        <div v-else>
          <label class="block text-sm font-medium text-gray-700">验证码</label>
          <div class="flex space-x-2">
            <input v-model="smsCode" type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入验证码" required />
            <button type="button" @click="sendSmsCode" :disabled="isSendingSms"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {{ isSendingSms ? `${countdown}秒后重发` : '发送验证码' }}
            </button>
          </div>
        </div>

        <div class="pt-2">
          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center mt-2">
          {{ error }}
        </div>

        <div class="mt-4 text-sm text-center text-gray-600">
          <p>提示: 使用 "admin" 作为用户名可以登录为管理员</p>
        </div>

        <div class="mt-4 text-sm text-center text-gray-600">
          <p>没有账号？<router-link to="/register" class="text-blue-600 hover:text-blue-700">立即注册</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/auth'
import swal from '@/utils/swal'

const router = useRouter()
const authStore = useAuthStore()

const loginType = ref('password') // 'password' 或 'sms'
const loginId = ref('')
const password = ref('')
const smsCode = ref('')
const loading = ref(false)
const isSendingSms = ref(false)
const countdown = ref(0) // 新增：倒计时变量
const error = ref('')
const passwordFieldType = ref('password') // 控制密码输入框类型

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const validatePhoneNumber = (phone) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

const validateForm = () => {
  error.value = ''
  if (!loginId.value) {
    error.value = loginType.value === 'password' ? '请输入用户名' : '请输入手机号'
    return false
  }

  if (loginType.value === 'sms' && !validatePhoneNumber(loginId.value)) {
    error.value = '请输入有效的手机号'
    return false
  }

  if (loginType.value === 'password' && !password.value) {
    error.value = '请输入密码'
    return false
  }

  if (loginType.value === 'sms' && !smsCode.value) {
    error.value = '请输入验证码'
    return false
  }

  return true
}

const startCountdown = () => {
  countdown.value = 60
  isSendingSms.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSendingSms.value = false
    }
  }, 1000)
}

const sendSmsCode = async () => {
  if (!loginId.value) {
    error.value = '请输入手机号'
    return
  }

  if (!validatePhoneNumber(loginId.value)) {
    error.value = '请输入有效的手机号'
    return
  }

  if (isSendingSms.value) return // 防止重复点击

  isSendingSms.value = true
  error.value = ''

  try {
    await authStore.sendSmsCode(loginId.value)
    console.log('验证码已发送到手机:', loginId.value)
    startCountdown() // 成功后开始倒计时
  } catch (err) {
    error.value = '发送验证码失败，请重试'
    console.error('发送验证码失败:', err)
    isSendingSms.value = false // 失败时重置状态
  } finally {
    // isSendingSms.value = false; // 倒计时结束后再重置
  }
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    let credentials
    if (loginType.value === 'password') {
      credentials = {
        loginId: loginId.value,
        password: password.value
      }
    } else {
      credentials = {
        phone: loginId.value,
        smsCode: smsCode.value
      }
    }

    const user = await authStore.login(credentials)

    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err) {
    error.value = '登录失败，请重试'
    console.log('登录失败:', err)
  } finally {
    loading.value = false
  }
}
</script>