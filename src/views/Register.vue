<template>
  <div class="flex justify-center items-center min-h-[80vh]">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">注册账号</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- 用户名 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">用户名</label>
          <input v-model="formData.username" type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <!-- 手机号 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">手机号</label>
          <input v-model="formData.phone" type="tel"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <!-- 验证码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">验证码</label>
          <div class="flex space-x-2">
            <input v-model="formData.verificationCode" type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required />
            <button type="button" @click="sendVerificationCode" :disabled="isSendingCode"
              class="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
              {{ isSendingCode ? `${countdown}秒后重发` : '发送验证码' }}
            </button>
          </div>
        </div>

        <!-- 密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <input v-model="formData.password" type="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <!-- 确认密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">确认密码</label>
          <input v-model="formData.confirmPassword" type="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required />
        </div>

        <div class="pt-2">
          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>

        <div v-if="error" class="text-red-500 text-center mt-2">
          {{ error }}
        </div>

        <div class="mt-4 text-sm text-center text-gray-600">
          <p>已有账号？<router-link to="/login" class="text-blue-600 hover:text-blue-700">立即登录</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/auth'
import swal from '../utils/swal'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const isSendingCode = ref(false)
const countdown = ref(0) // 新增：倒计时变量
const error = ref('')

const startCountdown = () => {
  countdown.value = 60
  isSendingCode.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isSendingCode.value = false
    }
  }, 1000)
}

const validatePhoneNumber = (phone) => {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}

const validateForm = () => {
  if (!formData.value.username || !formData.value.phone || !formData.value.verificationCode ||
    !formData.value.password || !formData.value.confirmPassword) {
    error.value = '请填写所有必填项'
    return false
  }

  // 用户名校验：只能包含字母、数字、下划线，长度4-12位
  const usernameRegex = /^[a-zA-Z0-9_]{4,12}$/
  if (!usernameRegex.test(formData.value.username)) {
    error.value = '用户名只能包含字母、数字、下划线，长度4-12位'
    return false
  }

  if (!validatePhoneNumber(formData.value.phone)) {
    error.value = '请输入有效的手机号'
    return false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return false
  }

  if (formData.value.password.length < 8 || formData.value.password.length > 20) {
    error.value = '密码长度必须在8到20位之间'
    return false
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/
  if (!passwordRegex.test(formData.value.password)) {
    error.value = '密码必须包含大小写字母和数字'
    return false
  }

  return true
}

const sendVerificationCode = async () => {
  if (!formData.value.phone) {
    error.value = '请输入手机号'
    return
  }

  if (!validatePhoneNumber(formData.value.phone)) {
    error.value = '请输入有效的手机号'
    return
  }

  if (isSendingCode.value) return // 防止重复点击

  isSendingCode.value = true
  error.value = ''

  try {
    await authStore.sendSmsCode(formData.value.phone)
    console.log('验证码已发送到手机:', formData.value.phone)
    startCountdown() // 成功后开始倒计时
  } catch (err) {
    error.value = '发送验证码失败，请重试'
    isSendingCode.value = false // 失败时重置状态
  } finally {
    // isSendingCode.value = false; // 倒计时结束后再重置
  }
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    const user = await authStore.register({
      username: formData.value.username,
      phone: formData.value.phone,
      password: formData.value.password,
      confirmPassword: formData.value.confirmPassword,
      smsCode: formData.value.verificationCode
    })

    router.push('/')
  } catch (err) {
    error.value = err.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>