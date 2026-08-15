<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="never" class="overview-card">
          <div slot="header" class="overview-header">
            <div>
              <h2>养老管理系统</h2>
              <p>基于 NestJS 微服务架构的统一管理平台</p>
            </div>
            <el-tag type="success">v{{ version }}</el-tag>
          </div>
          <el-row :gutter="16">
            <el-col
              v-for="service in services"
              :key="service.name"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
            >
              <div class="service-card">
                <i :class="service.icon" />
                <div>
                  <strong>{{ service.title }}</strong>
                  <p>{{ service.name }}</p>
                  <span>端口 {{ service.port }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="architecture-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <div slot="header"><span>技术架构</span></div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="服务端">NestJS 11 + TypeScript</el-descriptions-item>
            <el-descriptions-item label="数据存储">MySQL 8 + Redis 7</el-descriptions-item>
            <el-descriptions-item label="管理端">Vue 2 + Element UI</el-descriptions-item>
            <el-descriptions-item label="部署方式">Docker Compose + Nginx</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover">
          <div slot="header"><span>服务约定</span></div>
          <ul class="convention-list">
            <li>服务和目录统一使用 kebab-case 命名。</li>
            <li>外部请求统一通过 api-gateway 访问。</li>
            <li>Controller、Service、Repository 职责分离。</li>
            <li>生产环境启用 Redis 会话校验和持久化存储。</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      version: '1.0.0',
      services: [
        { title: 'API 网关', name: 'api-gateway', port: 8080, icon: 'el-icon-connection' },
        { title: '认证服务', name: 'auth-service', port: 9200, icon: 'el-icon-lock' },
        { title: '系统服务', name: 'system-service', port: 9201, icon: 'el-icon-setting' },
        { title: '代码生成', name: 'codegen-service', port: 9202, icon: 'el-icon-cpu' },
        { title: '调度服务', name: 'scheduler-service', port: 9203, icon: 'el-icon-time' },
        { title: '文件服务', name: 'file-service', port: 9300, icon: 'el-icon-folder' },
        { title: '监控服务', name: 'monitor-service', port: 9100, icon: 'el-icon-data-analysis' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  h2 { margin: 0 0 8px; color: #303133; }
  p { margin: 0; color: #909399; }
}
.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.service-card {
  display: flex;
  align-items: center;
  min-height: 92px;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  i { margin-right: 14px; color: #409eff; font-size: 30px; }
  strong { color: #303133; }
  p { margin: 5px 0; font-size: 12px; }
  span { color: #67c23a; font-size: 12px; }
}
.architecture-row { margin-top: 20px; }
.convention-list {
  margin: 0;
  padding-left: 22px;
  color: #606266;
  line-height: 2.2;
}
</style>
