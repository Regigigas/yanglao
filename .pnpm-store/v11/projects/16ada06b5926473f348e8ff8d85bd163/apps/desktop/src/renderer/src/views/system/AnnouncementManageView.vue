<script setup lang="ts">
  defineOptions({ name: 'AnnouncementManage' });

  import {
    NButton,
    NDatePicker,
    NForm,
    NFormItem,
    NInput,
    NModal,
    NSelect,
    NSpace,
    NSwitch,
    NTag,
    useDialog,
    useMessage,
  } from 'naive-ui';
  import {
    computed,
    h,
    onActivated,
    onDeactivated,
    onUnmounted,
    ref,
  } from 'vue';
  import { BasePage, BaseTable } from '@yanglao/ui';
  import { formatDateTime } from '@yanglao/core';
  import type {
    AnnouncementReadStats,
    AnnouncementReadUserRow,
    AnnouncementRow,
  } from '@yanglao/db';
  import { useAnnouncementStore } from '../../stores/announcement.store';
  import { useAuthStore } from '../../stores/auth.store';
  import { usePageRefresh } from '../../composables/usePageRefresh';

  const announcementStore = useAnnouncementStore();
  const authStore = useAuthStore();
  const message = useMessage();
  const dialog = useDialog();

  async function loadData() {
    await announcementStore.fetchAll();
  }
  const { refresh, refreshing } = usePageRefresh(loadData);
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  function startAutoRefresh() {
    if (refreshTimer) return;
    refreshTimer = setInterval(refresh, 60_000);
  }

  function stopAutoRefresh() {
    if (!refreshTimer) return;
    clearInterval(refreshTimer);
    refreshTimer = null;
  }

  onActivated(() => {
    void refresh();
    startAutoRefresh();
  });
  onDeactivated(stopAutoRefresh);
  onUnmounted(stopAutoRefresh);

  const canEdit = computed(() => authStore.canUseButton('announcement:edit'));
  const canPublish = computed(() =>
    authStore.canUseButton('announcement:publish'),
  );
  const canDelete = computed(() =>
    authStore.canUseButton('announcement:delete'),
  );
  const canSaveDraft = computed(() => !editingRow.value || canEdit.value);

  const keyword = ref('');
  const statusFilter = ref<string | null>(null);
  const filteredList = computed(() =>
    announcementStore.list.filter((row) => {
      const status = displayStatus(row).key;
      const matchesKeyword =
        !keyword.value.trim() ||
        `${row.title} ${row.content}`
          .toLowerCase()
          .includes(keyword.value.trim().toLowerCase());
      return (
        matchesKeyword && (!statusFilter.value || status === statusFilter.value)
      );
    }),
  );

  const levelOptions = [
    { label: '普通公告', value: 'normal' },
    { label: '重要公告', value: 'important' },
    { label: '紧急公告', value: 'urgent' },
  ];
  const statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '待发布', value: 'scheduled' },
    { label: '发布中', value: 'published' },
    { label: '已失效', value: 'expired' },
    { label: '已撤回', value: 'withdrawn' },
  ];

  function levelLabel(level: AnnouncementRow['level']) {
    return { normal: '普通', important: '重要', urgent: '紧急' }[level];
  }

  function levelType(level: AnnouncementRow['level']) {
    return { normal: 'default', important: 'warning', urgent: 'error' }[
      level
    ] as 'default' | 'warning' | 'error';
  }

  function displayStatus(row: AnnouncementRow) {
    if (row.status === 'draft')
      return { key: 'draft', label: '草稿', type: 'default' as const };
    if (row.status === 'withdrawn')
      return { key: 'withdrawn', label: '已撤回', type: 'default' as const };
    if (row.publish_at > Date.now())
      return { key: 'scheduled', label: '待发布', type: 'info' as const };
    if (row.expire_at && row.expire_at <= Date.now())
      return { key: 'expired', label: '已失效', type: 'default' as const };
    return { key: 'published', label: '发布中', type: 'success' as const };
  }

  const showEditor = ref(false);
  const saving = ref(false);
  const editingRow = ref<AnnouncementRow | null>(null);
  const form = ref({
    title: '',
    content: '',
    level: 'normal' as AnnouncementRow['level'],
    is_pinned: false,
    publish_at: Date.now(),
    expire_at: null as number | null,
  });

  function resetForm(row?: AnnouncementRow) {
    editingRow.value = row ?? null;
    form.value = row
      ? {
          title: row.title,
          content: row.content,
          level: row.level,
          is_pinned: row.is_pinned === 1,
          publish_at: row.publish_at,
          expire_at: row.expire_at,
        }
      : {
          title: '',
          content: '',
          level: 'normal',
          is_pinned: false,
          publish_at: Date.now(),
          expire_at: null,
        };
    showEditor.value = true;
  }

  async function save(publish: boolean) {
    const title = form.value.title.trim();
    const content = form.value.content.trim();
    if (!title || !content) return message.error('请填写公告标题和正文');
    if (form.value.expire_at && form.value.expire_at <= form.value.publish_at) {
      return message.error('失效时间必须晚于发布时间');
    }
    const userId = authStore.currentUser?.id;
    if (!userId) return message.error('当前登录信息失效，请重新登录');

    saving.value = true;
    try {
      const payload = {
        title,
        content,
        level: form.value.level,
        is_pinned: form.value.is_pinned ? 1 : 0,
        publish_at: form.value.publish_at,
        expire_at: form.value.expire_at,
      };
      if (editingRow.value) {
        await window.api.announcement.update(editingRow.value.id, {
          ...payload,
          status: publish ? 'published' : editingRow.value.status,
        });
      } else {
        await window.api.announcement.create({
          ...payload,
          status: publish ? 'published' : 'draft',
          created_by: userId,
        });
      }
      message.success(
        publish
          ? form.value.publish_at > Date.now()
            ? '公告已定时发布'
            : '公告已发布'
          : '草稿已保存',
      );
      showEditor.value = false;
      await refresh();
    } finally {
      saving.value = false;
    }
  }

  async function publishNow(row: AnnouncementRow) {
    const userId = authStore.currentUser?.id;
    if (!userId) return;
    await window.api.announcement.publish(row.id, userId);
    message.success('公告已立即发布');
    await refresh();
  }

  function withdraw(row: AnnouncementRow) {
    dialog.warning({
      title: '撤回公告',
      content: `撤回后“${row.title}”将立即从全局滚动栏移除，确定继续吗？`,
      positiveText: '撤回',
      negativeText: '取消',
      onPositiveClick: async () => {
        await window.api.announcement.withdraw(row.id);
        message.success('公告已撤回');
        await refresh();
      },
    });
  }

  function remove(row: AnnouncementRow) {
    dialog.error({
      title: '删除公告',
      content: `删除后不可恢复，确定删除“${row.title}”吗？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        await window.api.announcement.delete(row.id);
        message.success('公告已删除');
        await refresh();
      },
    });
  }

  const showReadModal = ref(false);
  const readingRow = ref<AnnouncementRow | null>(null);
  const readStats = ref<AnnouncementReadStats>({
    total: 0,
    read: 0,
    unread: 0,
  });
  const readUsers = ref<AnnouncementReadUserRow[]>([]);

  async function openReadReport(row: AnnouncementRow) {
    readingRow.value = row;
    const [stats, users] = await Promise.all([
      window.api.announcement.readStats(row.id),
      window.api.announcement.readUsers(row.id),
    ]);
    readStats.value = stats;
    readUsers.value = users;
    showReadModal.value = true;
  }

  const columns = [
    {
      title: '公告标题',
      key: 'title',
      width: 220,
      ellipsis: { tooltip: true },
    },
    {
      title: '级别',
      key: 'level',
      width: 90,
      render: (row: AnnouncementRow) =>
        h(NTag, { type: levelType(row.level), size: 'small' }, () =>
          levelLabel(row.level),
        ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (row: AnnouncementRow) => {
        const status = displayStatus(row);
        return h(
          NTag,
          { type: status.type, size: 'small' },
          () => status.label,
        );
      },
    },
    {
      title: '置顶',
      key: 'is_pinned',
      width: 70,
      render: (row: AnnouncementRow) => (row.is_pinned ? '是' : '否'),
    },
    {
      title: '发布时间',
      key: 'publish_at',
      width: 170,
      render: (row: AnnouncementRow) => formatDateTime(row.publish_at),
    },
    {
      title: '有效至',
      key: 'expire_at',
      width: 170,
      render: (row: AnnouncementRow) =>
        row.expire_at ? formatDateTime(row.expire_at) : '长期有效',
    },
    {
      title: '操作',
      key: 'actions',
      width: 300,
      render: (row: AnnouncementRow) =>
        h(
          NSpace,
          { size: 4 },
          {
            default: () => [
              ...(canEdit.value
                ? [
                    h(
                      NButton,
                      { size: 'small', onClick: () => resetForm(row) },
                      () => '编辑',
                    ),
                  ]
                : []),
              h(
                NButton,
                { size: 'small', onClick: () => openReadReport(row) },
                () => '阅读情况',
              ),
              ...(canPublish.value && row.status === 'draft'
                ? [
                    h(
                      NButton,
                      {
                        size: 'small',
                        type: 'primary',
                        onClick: () => publishNow(row),
                      },
                      () => '立即发布',
                    ),
                  ]
                : []),
              ...(canPublish.value && row.status === 'published'
                ? [
                    h(
                      NButton,
                      {
                        size: 'small',
                        type: 'warning',
                        onClick: () => withdraw(row),
                      },
                      () => '撤回',
                    ),
                  ]
                : []),
              ...(canDelete.value
                ? [
                    h(
                      NButton,
                      {
                        size: 'small',
                        type: 'error',
                        onClick: () => remove(row),
                      },
                      () => '删除',
                    ),
                  ]
                : []),
            ],
          },
        ),
    },
  ];

  const readColumns = [
    { title: '姓名', key: 'real_name', width: 130 },
    { title: '账号', key: 'username', width: 140 },
    {
      title: '阅读时间',
      key: 'read_at',
      render: (row: AnnouncementReadUserRow) => formatDateTime(row.read_at),
    },
  ];
</script>

<template>
  <BasePage title="公告管理">
    <template #header-extra>
      <NSpace>
        <NButton :loading="refreshing" size="small" @click="refresh"
          >刷新</NButton
        >
        <NButton type="primary" @click="resetForm()">+ 添加公告</NButton>
      </NSpace>
    </template>

    <div class="flex gap-3 mb-4">
      <NInput
        v-model:value="keyword"
        clearable
        placeholder="搜索标题或正文"
        style="width: 260px"
      />
      <NSelect
        v-model:value="statusFilter"
        :options="statusOptions"
        clearable
        placeholder="全部状态"
        style="width: 150px"
      />
    </div>

    <BaseTable
      :columns="columns"
      :data="filteredList"
      :loading="announcementStore.loading"
      :pagination="{ pageSize: 12 }"
    />

    <NModal
      v-model:show="showEditor"
      preset="card"
      :title="editingRow ? '编辑公告' : '添加公告'"
      style="width: 680px"
    >
      <NForm :model="form" label-placement="left" label-width="90">
        <NFormItem label="公告标题" required>
          <NInput
            v-model:value="form.title"
            maxlength="60"
            show-count
            placeholder="简明描述需传达的事项"
          />
        </NFormItem>
        <NFormItem label="公告级别">
          <NSelect v-model:value="form.level" :options="levelOptions" />
        </NFormItem>
        <NFormItem label="公告正文" required>
          <NInput
            v-model:value="form.content"
            type="textarea"
            :rows="7"
            maxlength="2000"
            show-count
            placeholder="填写公告详情、执行要求或注意事项"
          />
        </NFormItem>
        <NFormItem label="发布时间">
          <NDatePicker
            v-model:value="form.publish_at"
            type="datetime"
            clearable
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem label="失效时间">
          <NDatePicker
            v-model:value="form.expire_at"
            type="datetime"
            clearable
            style="width: 100%"
          />
        </NFormItem>
        <NFormItem label="置顶显示">
          <NSwitch v-model:value="form.is_pinned"
            ><template #checked>置顶</template
            ><template #unchecked>普通</template></NSwitch
          >
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showEditor = false">取消</NButton>
          <NButton v-if="canSaveDraft" :loading="saving" @click="save(false)"
            >保存草稿</NButton
          >
          <NButton
            v-if="!editingRow || canPublish"
            type="primary"
            :loading="saving"
            @click="save(true)"
          >
            {{ form.publish_at > Date.now() ? '定时发布' : '发布' }}
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <NModal
      v-model:show="showReadModal"
      preset="card"
      :title="`${readingRow?.title ?? ''} - 阅读情况`"
      style="width: 680px"
    >
      <div class="read-summary mb-4">
        <span>应读 {{ readStats.total }} 人</span>
        <span class="text-green-600">已读 {{ readStats.read }} 人</span>
        <span class="text-orange-500">未读 {{ readStats.unread }} 人</span>
      </div>
      <BaseTable
        :columns="readColumns"
        :data="readUsers"
        :pagination="{ pageSize: 8 }"
      />
      <template #footer
        ><NButton @click="showReadModal = false">关闭</NButton></template
      >
    </NModal>
  </BasePage>
</template>

<style scoped>
  .read-summary {
    display: flex;
    gap: 28px;
    font-size: 14px;
  }
</style>
