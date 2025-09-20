<template>
  <div class="admin-layout min-h-screen bg-neutral-50">
    <!-- 移动端顶部导航 -->
    <div class="md:hidden bg-primary-600 text-white p-4 flex justify-between items-center shadow-md">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-xl font-display font-semibold">管理后台</h1>
      </div>
      <button @click="toggleSidebar" class="text-white focus:outline-none transition-transform hover:scale-110">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- 侧边栏 -->
    <div
      :class="`bg-white text-neutral-800 min-h-screen fixed z-30 transition-all duration-300 shadow-xl ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0 w-64 border-r border-neutral-200`">
      <!-- 桌面端Logo -->
      <div class="p-6 border-b border-neutral-100 hidden md:block">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-display font-semibold">CampusHub</h1>
            <p class="text-xs text-neutral-500">管理后台</p>
          </div>
        </div>
      </div>

      <!-- 导航菜单 -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <router-link to="/admin"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group" :class="{
              'bg-primary-50 text-primary-700 border-2 border-primary-200': $route.path === '/admin',
              'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-2 border-transparent': $route.path !== '/admin'
            }" @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 transition-colors" :class="{
              'text-primary-500': $route.path === '/admin',
              'text-neutral-400 group-hover:text-primary-400': $route.path !== '/admin'
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
            仪表盘
          </router-link>

          <router-link to="/admin/categories"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group" :class="{
              'bg-primary-50 text-primary-700 border-2 border-primary-200': $route.path === '/admin/categories',
              'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-2 border-transparent': $route.path !== '/admin/categories'
            }" @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 transition-colors" :class="{
              'text-primary-500': $route.path === '/admin/categories',
              'text-neutral-400 group-hover:text-primary-400': $route.path !== '/admin/categories'
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clip-rule="evenodd" />
            </svg>
            分类管理
          </router-link>

          <router-link to="/admin/items"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group" :class="{
              'bg-primary-50 text-primary-700 border-2 border-primary-200': $route.path === '/admin/items',
              'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-2 border-transparent': $route.path !== '/admin/items'
            }" @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 transition-colors" :class="{
              'text-primary-500': $route.path === '/admin/items',
              'text-neutral-400 group-hover:text-primary-400': $route.path !== '/admin/items'
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
            点评项管理
          </router-link>

          <router-link to="/admin/reviews"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group" :class="{
              'bg-primary-50 text-primary-700 border-2 border-primary-200': $route.path === '/admin/reviews',
              'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-2 border-transparent': $route.path !== '/admin/reviews'
            }" @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 transition-colors" :class="{
              'text-primary-500': $route.path === '/admin/reviews',
              'text-neutral-400 group-hover:text-primary-400': $route.path !== '/admin/reviews'
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z"
                clip-rule="evenodd" />
            </svg>
            评论管理
          </router-link>

          <router-link to="/admin/users"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group" :class="{
              'bg-primary-50 text-primary-700 border-2 border-primary-200': $route.path === '/admin/users',
              'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-2 border-transparent': $route.path !== '/admin/users'
            }" @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 transition-colors" :class="{
              'text-primary-500': $route.path === '/admin/users',
              'text-neutral-400 group-hover:text-primary-400': $route.path !== '/admin/users'
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            用户管理
          </router-link>
        </div>

        <!-- 底部操作区 -->
        <div class="mt-8 pt-6 border-t border-neutral-100">
          <router-link to="/"
            class="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200 group"
            @click="closeSidebarOnMobile">
            <svg class="w-5 h-5 mr-3 text-neutral-400 group-hover:text-primary-400 transition-colors"
              fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
            返回前台
          </router-link>

          <div class="mt-4 p-4 bg-neutral-50 rounded-xl">
            <p class="text-xs text-neutral-500">需要帮助？</p>
            <p class="text-xs text-primary-600 font-medium mt-1">联系技术支持</p>
          </div>
        </div>
      </nav>
    </div>

    <!-- 遮罩层 - 仅在移动端显示 -->
    <div v-if="isSidebarOpen" @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300">
    </div>

    <!-- 主内容区 -->
    <div class="md:ml-64 p-4 md:p-6 transition-all duration-300">
      <div class="bg-white rounded-2xl shadow-soft p-6 border border-neutral-100">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 768) {
    closeSidebar();
  }
};
</script>