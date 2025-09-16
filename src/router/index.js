import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { computed } from 'vue';

// 用户端路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  // 管理端路由
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: () => import('@/views/admin/CategoryManagement.vue')
      },
      {
        path: 'items',
        name: 'ItemManagement',
        component: () => import('@/views/admin/ItemManagement.vue')
      },
      {
        path: 'reviews',
        name: 'ReviewManagement',
        component: () => import('@/views/admin/ReviewManagement.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken')
  const authStore = useAuthStore();
  const isAdmin = computed(() => authStore.isAdmin);
  
  // 需要认证的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin.value) {
      // 需要管理员权限但用户不是管理员
      next({ name: 'Home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router