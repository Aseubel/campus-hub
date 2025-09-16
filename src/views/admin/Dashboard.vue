<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-display font-semibold text-neutral-800 mb-2">仪表盘概览</h1>
      <p class="text-neutral-500">实时监控平台数据动态和用户活动</p>
    </div>
    
    <!-- 统计卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <!-- 总点评项卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft transition-all duration-300 hover:shadow-md hover:border-primary-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-neutral-600">总点评项</h3>
          <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex items-end space-x-2">
          <span class="text-3xl font-display font-bold text-primary-700">24</span>
          <span class="text-sm font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p class="text-xs text-neutral-400 mt-2">较上周增长</p>
      </div>
      
      <!-- 总评论数卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft transition-all duration-300 hover:shadow-md hover:border-secondary-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-neutral-600">总评论数</h3>
          <div class="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex items-end space-x-2">
          <span class="text-3xl font-display font-bold text-secondary-700">142</span>
          <span class="text-sm font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">+8%</span>
        </div>
        <p class="text-xs text-neutral-400 mt-2">较上周增长</p>
      </div>
      
      <!-- 总用户数卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft transition-all duration-300 hover:shadow-md hover:border-accent-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-neutral-600">总用户数</h3>
          <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex items-end space-x-2">
          <span class="text-3xl font-display font-bold text-accent-700">38</span>
          <span class="text-sm font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">+5%</span>
        </div>
        <p class="text-xs text-neutral-400 mt-2">较上周增长</p>
      </div>
      
      <!-- 今日新增评论卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft transition-all duration-300 hover:shadow-md hover:border-info-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-neutral-600">今日新增评论</h3>
          <div class="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-info-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="flex items-end space-x-2">
          <span class="text-3xl font-display font-bold text-info-700">7</span>
          <span class="text-sm font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">+3</span>
        </div>
        <p class="text-xs text-neutral-400 mt-2">较昨日增加</p>
      </div>
    </div>
    
    <!-- 图表和列表区域 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 活动趋势图 -->
      <div class="xl:col-span-2 bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-neutral-800">近期活动趋势</h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-neutral-500">过去7天</span>
            <div class="w-2 h-2 bg-success-500 rounded-full"></div>
          </div>
        </div>
        <div class="h-64 bg-gradient-to-br from-primary-50 to-primary-25 rounded-xl flex items-center justify-center border border-primary-100">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-primary-600 font-medium">数据可视化图表</p>
            <p class="text-primary-400 text-sm mt-1">集成图表库后显示</p>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <div class="text-center">
            <p class="text-sm text-neutral-600">平均日活跃</p>
            <p class="text-lg font-semibold text-primary-700">89</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-neutral-600">峰值活跃</p>
            <p class="text-lg font-semibold text-secondary-700">142</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-neutral-600">增长率</p>
            <p class="text-lg font-semibold text-success-700">+15%</p>
          </div>
        </div>
      </div>
      
      <!-- 最新评论 -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-neutral-800">最新评论动态</h2>
          <button class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
            查看全部
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="p-4 rounded-xl bg-neutral-50 border border-neutral-100 transition-all duration-200 hover:border-primary-200 hover:shadow-sm">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-medium text-white">U{{ i }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-neutral-800 mb-1">
                  用户{{ i }}评论了
                  <span class="text-primary-600 hover:text-primary-700 cursor-pointer">点评项目{{ i }}</span>
                </p>
                <p class="text-sm text-neutral-600 line-clamp-2 mb-2">
                  这是一条非常有价值的评论内容，展示了用户对项目的深入理解和建设性意见...
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-neutral-400">{{ i }}小时前</span>
                  <div class="flex items-center space-x-1">
                    <span class="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">正面</span>
                    <span class="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">详细</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-neutral-100">
          <button class="w-full py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors flex items-center justify-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
            </svg>
            <span>加载更多评论</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 仪表盘组件
</script>