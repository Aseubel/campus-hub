import Swal from 'sweetalert2'

// 成功提示 小 右上角
const success = (title, text = '') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    title,
    text,
    icon: 'success'
  })
}

// 错误提示 小 右上角
const error = (title, text = '') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    title,
    text,
    icon: 'error'
  })
}

// 警告提示
const warning = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#f59e0b',
    confirmButtonText: '确定',
    customClass: {
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  })
}

// 信息提示
const info = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#6b7280',
    confirmButtonText: '确定',
    customClass: {
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  })
}

// 确认对话框 (样式已优化)
const confirm = (title, text = '', confirmText = '确定', cancelText = '取消') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      confirmButton: 'px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2',
      cancelButton: 'px-4 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
    },
    buttonsStyling: false // 禁用默认样式，让 customClass 完全生效
  })
}

// 加载中状态
const loading = (title = '处理中...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    }
  })
}

export default {
  success,
  error,
  warning,
  info,
  confirm,
  loading
}