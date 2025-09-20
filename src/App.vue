<template>
  <div class="app bg-neutral-50 min-h-screen">
    <!-- 导航栏 -->
    <header class="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div
            class="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 000 2h2a1 1 0 100-2H9zm0 4a1 1 0 000 2h6a1 1 0 100-2H9z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xl font-display font-semibold text-primary-700">CampusHub</span>
        </router-link>

        <!-- 移动端菜单按钮 -->
        <button @click="toggleMenu"
          class="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="菜单">
          <svg class="h-6 w-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- 桌面端导航 -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link to="/" class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200" :class="{
            'text-primary-700 bg-primary-50': $route.path === '/',
            'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': $route.path !== '/'
          }">
            首页
          </router-link>

          <router-link v-if="isAdmin" to="/admin"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200" :class="{
              'text-primary-700 bg-primary-50': $route.path.startsWith('/admin'),
              'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': !$route.path.startsWith('/admin')
            }">
            管理后台
          </router-link>

          <template v-if="isLoggedIn">
            <button @click="logout"
              class="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-error-700 hover:bg-error-50 transition-all duration-200">
              退出
            </button>
          </template>

          <template v-else>
            <router-link to="/login" class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="{
                'text-primary-700 bg-primary-50': $route.path === '/login',
                'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': $route.path !== '/login'
              }">
              登录
            </router-link>
          </template>
        </nav>
      </div>

      <!-- 移动端导航菜单 -->
      <div v-if="isMenuOpen"
        class="md:hidden bg-white border-t border-neutral-200 shadow-lg transition-all duration-300">
        <div class="container mx-auto px-4 py-3 flex flex-col space-y-1">
          <router-link @click="closeMenu" to="/" class="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            :class="{
              'text-primary-700 bg-primary-50': $route.path === '/',
              'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': $route.path !== '/'
            }">
            首页
          </router-link>

          <router-link v-if="isAdmin" @click="closeMenu" to="/admin"
            class="px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="{
              'text-primary-700 bg-primary-50': $route.path.startsWith('/admin'),
              'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': !$route.path.startsWith('/admin')
            }">
            管理后台
          </router-link>

          <template v-if="isLoggedIn">
            <button @click="handleLogout"
              class="px-4 py-3 text-left rounded-lg text-sm font-medium text-error-600 hover:text-error-700 hover:bg-error-50 transition-colors">
              退出登录
            </button>
          </template>

          <template v-else>
            <router-link @click="closeMenu" to="/login"
              class="px-4 py-3 rounded-lg text-sm font-medium transition-colors" :class="{
                'text-primary-700 bg-primary-50': $route.path === '/login',
                'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50': $route.path !== '/login'
              }">
              登录
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- 路由视图 -->
    <main class="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-neutral-200 mt-auto">
      <div class="container mx-auto px-4 md:px-6 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center space-x-3 mb-4 md:mb-0">
            <div class="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 6a1 1 0 000 2h2a1 1 0 100-2H9zm0 4a1 1 0 000 2h6a1 1 0 100-2H9z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-neutral-700">CampusHub 校园点评平台</span>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-xs text-neutral-500">© 2025 CampusHub. All rights reserved.</span>
            <span class="text-xs text-neutral-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/modules/auth';

const router = useRouter();
const authStore = useAuthStore();
const isMenuOpen = ref(false);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  closeMenu();
  logout();
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
