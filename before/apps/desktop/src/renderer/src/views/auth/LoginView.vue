<script setup lang="ts">
  /**
   * LoginView - 登录页
   * 独立于 DefaultLayout，不带侧边栏/顶栏
   */
  import { NCard, NForm, NFormItem, NInput, NButton, NModal, NCheckbox, NAlert, useMessage } from 'naive-ui'
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../stores/auth.store'

  const router = useRouter()
  const authStore = useAuthStore()
  const message = useMessage()

  /** 只在本地记住"用户名"，密码从不落盘，出于安全考虑需要用户每次手动输入 */
  const REMEMBER_USERNAME_KEY = 'yanglao:remember-username'

  // 默认预填初始账号密码，方便首次使用的管理员登录；首次登录会强制要求修改密码
  const form = ref({ username: 'admin', password: 'admin123' })
  const loading = ref(false)

  const rememberUsername = ref(false)
  const rememberLogin = ref(false)
  const agreed = ref(false)
  const showAgreementModal = ref(false)

  onMounted(() => {
    const saved = localStorage.getItem(REMEMBER_USERNAME_KEY)
    if (saved) {
      form.value.username = saved
      rememberUsername.value = true
    }
  })

  // 首次登录（must_change_pw=1）强制弹窗要求修改密码，不改完不能进入系统
  const showChangePwModal = ref(false)
  const pwForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const changingPw = ref(false)

  async function handleLogin() {
    if (!form.value.username || !form.value.password) {
      message.error('请输入用户名和密码')
      return
    }
    if (!agreed.value) {
      message.error('请先阅读并勾选同意《用户使用协议》')
      return
    }
    loading.value = true
    try {
      const res = await authStore.login(form.value.username, form.value.password, rememberLogin.value)
      if (!res.ok) {
        message.error(res.error ?? '登录失败')
        return
      }
      if (rememberUsername.value) {
        localStorage.setItem(REMEMBER_USERNAME_KEY, form.value.username)
      } else {
        localStorage.removeItem(REMEMBER_USERNAME_KEY)
      }
      if (res.user.must_change_pw) {
        pwForm.value.oldPassword = form.value.password
        showChangePwModal.value = true
        return
      }
      message.success('登录成功')
      router.replace('/dashboard')
    } finally {
      loading.value = false
    }
  }

  async function handleChangePassword() {
    if (!pwForm.value.newPassword || pwForm.value.newPassword.length < 6) {
      message.error('新密码至少6位')
      return
    }
    if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
      message.error('两次输入的新密码不一致')
      return
    }
    changingPw.value = true
    try {
      const res = await authStore.changePassword(pwForm.value.oldPassword, pwForm.value.newPassword)
      if (!res.ok) {
        message.error(res.error ?? '修改失败')
        return
      }
      message.success('密码修改成功，请重新登录')
      showChangePwModal.value = false
      await authStore.logout()
      form.value.password = ''
    } finally {
      changingPw.value = false
    }
  }
</script>

<template>
  <div class="login-page flex-col-center h-screen">
    <NCard title="养老管理系统" style="width: 380px" class="shadow-lg">
      <NAlert type="info" :show-icon="true" class="mb-4">
        初次使用请用默认账号 <b>admin</b> / 密码 <b>admin123</b> 登录，登录后系统会强制要求修改密码，请设置为只有自己知道的新密码。
      </NAlert>
      <NForm :model="form" label-placement="left" label-width="0">
        <NFormItem>
          <NInput v-model:value="form.username" placeholder="用户名" size="large" @keydown.enter="handleLogin">
            <template #prefix><i class="i-ion:person-outline inline-block" /></template>
          </NInput>
        </NFormItem>
        <NFormItem>
          <NInput
            v-model:value="form.password"
            type="password"
            show-password-on="click"
            placeholder="密码"
            size="large"
            @keydown.enter="handleLogin"
          >
            <template #prefix><i class="i-ion:lock-closed-outline inline-block" /></template>
          </NInput>
        </NFormItem>

        <div class="flex-col gap-2 mb-3">
          <div class="flex items-center justify-between">
            <NCheckbox v-model:checked="rememberUsername">记住用户名</NCheckbox>
            <NCheckbox v-model:checked="rememberLogin">记住登录状态（30天）</NCheckbox>
          </div>
          <NCheckbox v-model:checked="agreed">
            我已阅读并同意
            <a href="javascript:void(0)" @click.stop="showAgreementModal = true">《用户使用协议》</a>
          </NCheckbox>
        </div>

        <NButton type="primary" size="large" block :loading="loading" @click="handleLogin">登录</NButton>
      </NForm>
    </NCard>

    <!-- 用户使用协议弹窗 -->
    <NModal v-model:show="showAgreementModal" title="用户使用协议" preset="card" style="width:520px">
      <div class="agreement-content">
        <p>欢迎使用养老管理系统（以下简称"本系统"）。在您使用本系统前，请仔细阅读以下条款：</p>
        <p>1. 账号安全：请妥善保管您的登录账号与密码，不要将账号密码告知无关人员，因账号泄露造成的数据风险由使用者自行承担。</p>
        <p>2. 数据合规：本系统涉及老人及员工的个人信息，请严格遵守相关法律法规及本机构内部管理制度，仅在工作范围内查阅、使用相关数据。</p>
        <p>3. 操作规范：请按照岗位权限规范操作系统功能，不得利用系统权限进行与工作无关的操作。</p>
        <p>4. 责任说明：因违规操作、账号外借等行为导致的数据丢失、泄露或其他后果，由责任人自行承担。</p>
        <p>本协议内容后续可能根据实际管理需要调整，如有变更将以系统内通知为准。</p>
      </div>
      <template #footer>
        <NButton type="primary" block @click="agreed = true; showAgreementModal = false">我已阅读并同意</NButton>
      </template>
    </NModal>

    <!-- 首次登录强制改密弹窗 -->
    <NModal
      v-model:show="showChangePwModal"
      title="首次登录，请修改密码"
      preset="card"
      style="width:420px"
      :closable="false"
      :mask-closable="false"
    >
      <NForm :model="pwForm" label-placement="left" label-width="90">
        <NFormItem label="新密码" required>
          <NInput v-model:value="pwForm.newPassword" type="password" show-password-on="click" placeholder="至少6位" />
        </NFormItem>
        <NFormItem label="确认密码" required>
          <NInput v-model:value="pwForm.confirmPassword" type="password" show-password-on="click" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NButton type="primary" block :loading="changingPw" @click="handleChangePassword">确认修改</NButton>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
  .login-page {
    background: linear-gradient(135deg, #1a3a5c 0%, #2c5f8a 100%);
  }
</style>
