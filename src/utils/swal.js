import Swal from 'sweetalert2'

// 成功提示 大居中
// const success = (title, text = '') => {
//   return Swal.fire({
//     title,
//     text,
//     icon: 'success',
//     confirmButtonColor: '#0ea5e9',
//     confirmButtonText: '确定',
//     customClass: {
//       confirmButton: 'px-4 py-2 rounded-lg font-medium'
//     }
//   })
// }

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

// 错误提示
// const error = (title, text = '') => {
//   return Swal.fire({
//     title,
//     text,
//     icon: 'error',
//     confirmButtonColor: '#ef4444',
//     confirmButtonText: '确定',
//     customClass: {
//       confirmButton: 'px-4 py-2 rounded-lg font-medium'
//     }
//   })
// }

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

// 确认对话框
const confirm = (title, text = '', confirmText = '确定', cancelText = '取消') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0ea5e9',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      confirmButton: 'px-4 py-2 rounded-lg font-medium mr-2',
      cancelButton: 'px-4 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200'
    }
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