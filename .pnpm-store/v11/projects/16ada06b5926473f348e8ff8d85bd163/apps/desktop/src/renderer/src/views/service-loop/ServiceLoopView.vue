<script setup lang="ts">
  defineOptions({ name: 'ServiceLoop' });

  import {
    NButton,
    NCard,
    NForm,
    NFormItem,
    NGrid,
    NGridItem,
    NInput,
    NModal,
    NSelect,
    NSpace,
    NStatistic,
    NStep,
    NSteps,
    NTabPane,
    NTag,
    NTabs,
    useMessage,
  } from 'naive-ui';
  import { computed, h, onMounted, ref, watch } from 'vue';
  import { BasePage, BaseTable } from '@yanglao/ui';
  import { formatDateTime } from '@yanglao/core';
  import { useElderlyStore } from '../../stores/elderly.store';
  import { useAuthStore } from '../../stores/auth.store';

  type ReceptionStage =
    | 'consult'
    | 'visit'
    | 'trial'
    | 'assessment'
    | 'admitted'
    | 'lost';
  type TicketStatus = 'pending' | 'processing' | 'done' | 'cancelled';
  type TicketPriority = 'normal' | 'urgent' | 'critical';
  type PatrolResult = 'normal' | 'attention' | 'abnormal';
  type RetrofitStatus = 'todo' | 'quoted' | 'scheduled' | 'finished';

  interface ReceptionLead {
    id: string;
    elder_name: string;
    contact_name: string;
    phone: string;
    source: string;
    stage: ReceptionStage;
    next_follow_at: string;
    demand: string;
    owner: string;
    created_at: number;
  }

  interface ServiceTicket {
    id: string;
    elderly_id: string | null;
    category: string;
    priority: TicketPriority;
    content: string;
    assignee: string;
    status: TicketStatus;
    due_at: string;
    created_at: number;
    closed_at: number | null;
  }

  interface PatrolRecord {
    id: string;
    area: string;
    elderly_id: string | null;
    patrol_at: string;
    staff: string;
    result: PatrolResult;
    finding: string;
    action: string;
    created_at: number;
  }

  interface FamilyFollowUp {
    id: string;
    elderly_id: string | null;
    contact_name: string;
    channel: string;
    follow_at: string;
    satisfaction: string;
    feedback: string;
    next_action: string;
    created_at: number;
  }

  interface RetrofitAssessment {
    id: string;
    elderly_id: string | null;
    scene: string;
    risk_points: string;
    suggestion: string;
    budget: string;
    status: RetrofitStatus;
    owner: string;
    created_at: number;
  }

  const STORAGE_KEY = 'yanglao-service-loop-v1';
  const message = useMessage();
  const elderlyStore = useElderlyStore();
  const authStore = useAuthStore();

  const receptions = ref<ReceptionLead[]>([]);
  const tickets = ref<ServiceTicket[]>([]);
  const patrols = ref<PatrolRecord[]>([]);
  const followUps = ref<FamilyFollowUp[]>([]);
  const retrofits = ref<RetrofitAssessment[]>([]);

  const currentStaff = computed(
    () =>
      authStore.currentUser?.real_name ||
      authStore.currentUser?.username ||
      '当前人员',
  );
  const nowText = () => formatDateTime(Date.now());
  const todayText = () => new Date().toISOString().slice(0, 10);
  const makeId = (prefix: string) =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  const elderlyOptions = computed(() =>
    elderlyStore.list
      .filter((elderly) => elderly.status === 'active')
      .map((elderly) => ({ label: elderly.name, value: elderly.id })),
  );
  const elderlyName = (id: string | null) =>
    id
      ? elderlyStore.list.find((elderly) => elderly.id === id)?.name || '已删除老人'
      : '公共/未入住';

  const receptionStageOptions = [
    { label: '咨询登记', value: 'consult' },
    { label: '预约参观', value: 'visit' },
    { label: '试住体验', value: 'trial' },
    { label: '入住评估', value: 'assessment' },
    { label: '已入住', value: 'admitted' },
    { label: '流失', value: 'lost' },
  ];
  const ticketStatusOptions = [
    { label: '待派单', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'done' },
    { label: '已取消', value: 'cancelled' },
  ];
  const priorityOptions = [
    { label: '一般', value: 'normal' },
    { label: '紧急', value: 'urgent' },
    { label: '危急', value: 'critical' },
  ];
  const patrolResultOptions = [
    { label: '正常', value: 'normal' },
    { label: '需关注', value: 'attention' },
    { label: '异常', value: 'abnormal' },
  ];
  const retrofitStatusOptions = [
    { label: '待评估', value: 'todo' },
    { label: '已报价', value: 'quoted' },
    { label: '已排期', value: 'scheduled' },
    { label: '已完成', value: 'finished' },
  ];

  const statusTag = (status: string) =>
    ({
      consult: 'default',
      visit: 'info',
      trial: 'warning',
      assessment: 'warning',
      admitted: 'success',
      lost: 'default',
      pending: 'warning',
      processing: 'info',
      done: 'success',
      cancelled: 'default',
      normal: 'success',
      attention: 'warning',
      abnormal: 'error',
      critical: 'error',
      urgent: 'warning',
      todo: 'warning',
      quoted: 'info',
      scheduled: 'info',
      finished: 'success',
    })[status] ?? 'default';
  const labelOf = (
    options: { label: string; value: string }[],
    value: string | null,
  ) => options.find((item) => item.value === value)?.label ?? value ?? '—';
  const renderTag = (options: { label: string; value: string }[]) => (row: {
    stage?: string;
    status?: string;
    priority?: string;
    result?: string;
  }) => {
    const value = row.stage ?? row.status ?? row.priority ?? row.result ?? '';
    return h(NTag, { type: statusTag(value) as never }, () =>
      labelOf(options, value),
    );
  };

  function loadLocalData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        receptions.value = parsed.receptions ?? [];
        tickets.value = parsed.tickets ?? [];
        patrols.value = parsed.patrols ?? [];
        followUps.value = parsed.followUps ?? [];
        retrofits.value = parsed.retrofits ?? [];
        return;
      } catch {
        // 数据损坏时回落到种子数据，避免页面空白
      }
    }
    seedData();
  }

  function seedData() {
    receptions.value = [
      {
        id: makeId('lead'),
        elder_name: '张桂兰',
        contact_name: '张女士',
        phone: '13800000001',
        source: '电话咨询',
        stage: 'visit',
        next_follow_at: `${todayText()} 15:00`,
        demand: '半自理，重点关注认知训练和慢病用药。',
        owner: currentStaff.value,
        created_at: Date.now(),
      },
      {
        id: makeId('lead'),
        elder_name: '李建国',
        contact_name: '李先生',
        phone: '13800000002',
        source: '社区转介',
        stage: 'assessment',
        next_follow_at: `${todayText()} 10:30`,
        demand: '需评估跌倒风险，家属关心康复护理。',
        owner: currentStaff.value,
        created_at: Date.now(),
      },
    ];
    tickets.value = [
      {
        id: makeId('ticket'),
        elderly_id: null,
        category: '维修',
        priority: 'urgent',
        content: '三楼公共浴室防滑垫翘边，需要尽快处理。',
        assignee: '后勤',
        status: 'processing',
        due_at: `${todayText()} 18:00`,
        created_at: Date.now(),
        closed_at: null,
      },
    ];
    patrols.value = [
      {
        id: makeId('patrol'),
        area: '二楼东区',
        elderly_id: null,
        patrol_at: nowText(),
        staff: currentStaff.value,
        result: 'attention',
        finding: '夜间照明偏暗，203 门口扶手略松。',
        action: '已登记后勤工单，晚班加强巡视。',
        created_at: Date.now(),
      },
    ];
    followUps.value = [];
    retrofits.value = [];
  }

  function persistLocalData() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        receptions: receptions.value,
        tickets: tickets.value,
        patrols: patrols.value,
        followUps: followUps.value,
        retrofits: retrofits.value,
      }),
    );
  }

  onMounted(async () => {
    await elderlyStore.fetchList();
    loadLocalData();
  });
  watch([receptions, tickets, patrols, followUps, retrofits], persistLocalData, {
    deep: true,
  });

  const pendingTickets = computed(
    () => tickets.value.filter((item) => item.status !== 'done').length,
  );
  const abnormalPatrols = computed(
    () => patrols.value.filter((item) => item.result !== 'normal').length,
  );
  const activeLeads = computed(
    () =>
      receptions.value.filter(
        (item) => !['admitted', 'lost'].includes(item.stage),
      ).length,
  );
  const openRetrofits = computed(
    () => retrofits.value.filter((item) => item.status !== 'finished').length,
  );

  const leadModal = ref(false);
  const leadForm = ref({
    elder_name: '',
    contact_name: '',
    phone: '',
    source: '电话咨询',
    stage: 'consult' as ReceptionStage,
    next_follow_at: `${todayText()} 09:00`,
    demand: '',
  });
  function openLead() {
    leadForm.value = {
      elder_name: '',
      contact_name: '',
      phone: '',
      source: '电话咨询',
      stage: 'consult',
      next_follow_at: `${todayText()} 09:00`,
      demand: '',
    };
    leadModal.value = true;
  }
  function saveLead() {
    if (!leadForm.value.elder_name.trim() || !leadForm.value.phone.trim()) {
      message.error('请填写老人姓名和联系电话');
      return;
    }
    receptions.value.unshift({
      id: makeId('lead'),
      ...leadForm.value,
      elder_name: leadForm.value.elder_name.trim(),
      contact_name: leadForm.value.contact_name.trim() || '家属',
      phone: leadForm.value.phone.trim(),
      demand: leadForm.value.demand.trim(),
      owner: currentStaff.value,
      created_at: Date.now(),
    });
    leadModal.value = false;
    message.success('接待线索已登记');
  }

  const ticketModal = ref(false);
  const ticketForm = ref({
    elderly_id: null as string | null,
    category: '生活服务',
    priority: 'normal' as TicketPriority,
    content: '',
    assignee: '',
    due_at: `${todayText()} 18:00`,
  });
  function openTicket() {
    ticketForm.value = {
      elderly_id: null,
      category: '生活服务',
      priority: 'normal',
      content: '',
      assignee: currentStaff.value,
      due_at: `${todayText()} 18:00`,
    };
    ticketModal.value = true;
  }
  function saveTicket() {
    if (!ticketForm.value.content.trim()) {
      message.error('请填写服务内容');
      return;
    }
    tickets.value.unshift({
      id: makeId('ticket'),
      ...ticketForm.value,
      content: ticketForm.value.content.trim(),
      assignee: ticketForm.value.assignee.trim() || currentStaff.value,
      status: 'pending',
      created_at: Date.now(),
      closed_at: null,
    });
    ticketModal.value = false;
    message.success('服务工单已创建');
  }
  function advanceTicket(row: ServiceTicket) {
    if (row.status === 'pending') row.status = 'processing';
    else if (row.status === 'processing') {
      row.status = 'done';
      row.closed_at = Date.now();
    }
    message.success('工单状态已更新');
  }

  const patrolModal = ref(false);
  const patrolForm = ref({
    area: '',
    elderly_id: null as string | null,
    patrol_at: nowText(),
    result: 'normal' as PatrolResult,
    finding: '',
    action: '',
  });
  function openPatrol() {
    patrolForm.value = {
      area: '',
      elderly_id: null,
      patrol_at: nowText(),
      result: 'normal',
      finding: '',
      action: '',
    };
    patrolModal.value = true;
  }
  function savePatrol() {
    if (!patrolForm.value.area.trim()) {
      message.error('请填写巡查区域');
      return;
    }
    patrols.value.unshift({
      id: makeId('patrol'),
      ...patrolForm.value,
      area: patrolForm.value.area.trim(),
      finding: patrolForm.value.finding.trim() || '无异常',
      action: patrolForm.value.action.trim(),
      staff: currentStaff.value,
      created_at: Date.now(),
    });
    patrolModal.value = false;
    message.success('巡房记录已保存');
  }

  const followModal = ref(false);
  const followForm = ref({
    elderly_id: null as string | null,
    contact_name: '',
    channel: '电话',
    follow_at: nowText(),
    satisfaction: '满意',
    feedback: '',
    next_action: '',
  });
  function openFollow() {
    followForm.value = {
      elderly_id: null,
      contact_name: '',
      channel: '电话',
      follow_at: nowText(),
      satisfaction: '满意',
      feedback: '',
      next_action: '',
    };
    followModal.value = true;
  }
  function saveFollow() {
    if (!followForm.value.contact_name.trim() || !followForm.value.feedback.trim()) {
      message.error('请填写联系人和回访内容');
      return;
    }
    followUps.value.unshift({
      id: makeId('follow'),
      ...followForm.value,
      contact_name: followForm.value.contact_name.trim(),
      feedback: followForm.value.feedback.trim(),
      next_action: followForm.value.next_action.trim(),
      created_at: Date.now(),
    });
    followModal.value = false;
    message.success('家属回访已记录');
  }

  const retrofitModal = ref(false);
  const retrofitForm = ref({
    elderly_id: null as string | null,
    scene: '居室',
    risk_points: '',
    suggestion: '',
    budget: '',
    status: 'todo' as RetrofitStatus,
  });
  function openRetrofit() {
    retrofitForm.value = {
      elderly_id: null,
      scene: '居室',
      risk_points: '',
      suggestion: '',
      budget: '',
      status: 'todo',
    };
    retrofitModal.value = true;
  }
  function saveRetrofit() {
    if (!retrofitForm.value.risk_points.trim()) {
      message.error('请填写风险点');
      return;
    }
    retrofits.value.unshift({
      id: makeId('retrofit'),
      ...retrofitForm.value,
      risk_points: retrofitForm.value.risk_points.trim(),
      suggestion: retrofitForm.value.suggestion.trim(),
      budget: retrofitForm.value.budget.trim(),
      owner: currentStaff.value,
      created_at: Date.now(),
    });
    retrofitModal.value = false;
    message.success('适老化评估已记录');
  }

  const receptionColumns = [
    { title: '老人', key: 'elder_name', width: 100 },
    { title: '联系人', key: 'contact_name', width: 100 },
    { title: '电话', key: 'phone', width: 130 },
    { title: '来源', key: 'source', width: 100 },
    {
      title: '阶段',
      key: 'stage',
      width: 100,
      render: renderTag(receptionStageOptions),
    },
    { title: '下次跟进', key: 'next_follow_at', width: 150 },
    { title: '需求摘要', key: 'demand', ellipsis: { tooltip: true } },
    { title: '负责人', key: 'owner', width: 100 },
  ];
  const ticketColumns = [
    {
      title: '老人',
      key: 'elderly_id',
      width: 110,
      render: (row: ServiceTicket) => elderlyName(row.elderly_id),
    },
    { title: '类别', key: 'category', width: 100 },
    {
      title: '级别',
      key: 'priority',
      width: 90,
      render: renderTag(priorityOptions),
    },
    { title: '内容', key: 'content', ellipsis: { tooltip: true } },
    { title: '处理人', key: 'assignee', width: 100 },
    { title: '截止', key: 'due_at', width: 145 },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: renderTag(ticketStatusOptions),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (row: ServiceTicket) =>
        row.status === 'done' || row.status === 'cancelled'
          ? '—'
          : h(
              NButton,
              { size: 'small', type: 'primary', onClick: () => advanceTicket(row) },
              () => (row.status === 'pending' ? '开始处理' : '完成'),
            ),
    },
  ];
  const patrolColumns = [
    { title: '区域', key: 'area', width: 120 },
    {
      title: '关联老人',
      key: 'elderly_id',
      width: 110,
      render: (row: PatrolRecord) => elderlyName(row.elderly_id),
    },
    { title: '巡查时间', key: 'patrol_at', width: 155 },
    { title: '人员', key: 'staff', width: 100 },
    {
      title: '结果',
      key: 'result',
      width: 90,
      render: renderTag(patrolResultOptions),
    },
    { title: '发现问题', key: 'finding', ellipsis: { tooltip: true } },
    { title: '处置', key: 'action', ellipsis: { tooltip: true } },
  ];
  const followColumns = [
    {
      title: '老人',
      key: 'elderly_id',
      width: 110,
      render: (row: FamilyFollowUp) => elderlyName(row.elderly_id),
    },
    { title: '联系人', key: 'contact_name', width: 100 },
    { title: '渠道', key: 'channel', width: 90 },
    { title: '回访时间', key: 'follow_at', width: 155 },
    { title: '满意度', key: 'satisfaction', width: 90 },
    { title: '反馈', key: 'feedback', ellipsis: { tooltip: true } },
    { title: '下一步', key: 'next_action', ellipsis: { tooltip: true } },
  ];
  const retrofitColumns = [
    {
      title: '老人',
      key: 'elderly_id',
      width: 110,
      render: (row: RetrofitAssessment) => elderlyName(row.elderly_id),
    },
    { title: '场景', key: 'scene', width: 90 },
    { title: '风险点', key: 'risk_points', ellipsis: { tooltip: true } },
    { title: '建议', key: 'suggestion', ellipsis: { tooltip: true } },
    { title: '预算', key: 'budget', width: 100 },
    {
      title: '状态',
      key: 'status',
      width: 90,
      render: renderTag(retrofitStatusOptions),
    },
    { title: '负责人', key: 'owner', width: 100 },
  ];

  const benchmarkModules = [
    {
      title: '接待转化',
      desc: '咨询、参观、试住、评估、入住形成一条线，减少前台线索丢失。',
      status: '已补入口',
    },
    {
      title: '服务工单',
      desc: '生活服务、维修、投诉、代办统一派单，并可追踪时效。',
      status: '已补入口',
    },
    {
      title: '巡房闭环',
      desc: '楼层巡查、异常发现、现场处置和后续跟进沉淀为记录。',
      status: '已补入口',
    },
    {
      title: '家属体验',
      desc: '探视、沟通、回访、满意度和投诉建议形成家属端雏形。',
      status: '已补入口',
    },
    {
      title: '适老化评估',
      desc: '居室、卫浴、通道、防跌倒等改造建议与预算先进入台账。',
      status: '已补入口',
    },
    {
      title: '后续可做深',
      desc: '对接真实后台同步、家属小程序、医保/支付、门禁一卡通、AI 预警。',
      status: '待深做',
    },
  ];
</script>

<template>
  <BasePage title="服务闭环">
    <template #header-extra>
      <NSpace>
        <NButton size="small" @click="openPatrol">+ 巡房</NButton>
        <NButton size="small" @click="openTicket">+ 工单</NButton>
        <NButton type="primary" size="small" @click="openLead">+ 接待线索</NButton>
      </NSpace>
    </template>

    <NGrid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
      <NGridItem>
        <NCard>
          <NStatistic label="在跟进线索" :value="activeLeads" />
        </NCard>
      </NGridItem>
      <NGridItem>
        <NCard>
          <NStatistic label="未完成工单" :value="pendingTickets" />
        </NCard>
      </NGridItem>
      <NGridItem>
        <NCard>
          <NStatistic label="巡房关注/异常" :value="abnormalPatrols" />
        </NCard>
      </NGridItem>
      <NGridItem>
        <NCard>
          <NStatistic label="适老化待办" :value="openRetrofits" />
        </NCard>
      </NGridItem>
    </NGrid>

    <NCard class="mt-4" title="对标成熟养老系统后的闭环补齐">
      <NSteps size="small" :current="4" status="process">
        <NStep title="接待" description="咨询 / 参观 / 试住" />
        <NStep title="评估" description="能力 / 风险 / 适老化" />
        <NStep title="执行" description="护理 / 工单 / 巡房" />
        <NStep title="反馈" description="家属回访 / 质控改进" />
      </NSteps>
      <NGrid class="mt-4" :cols="3" :x-gap="12" :y-gap="12" responsive="screen">
        <NGridItem v-for="item in benchmarkModules" :key="item.title">
          <NCard size="small">
            <template #header>
              <NSpace align="center">
                <span>{{ item.title }}</span>
                <NTag size="small" :type="item.status === '已补入口' ? 'success' : 'warning'">
                  {{ item.status }}
                </NTag>
              </NSpace>
            </template>
            <div class="text-sm text-gray-500 dark:text-gray-300">
              {{ item.desc }}
            </div>
          </NCard>
        </NGridItem>
      </NGrid>
    </NCard>

    <NTabs class="mt-4" type="line" animated>
      <NTabPane name="reception" tab="预约接待">
        <NCard>
          <template #header-extra>
            <NButton size="small" type="primary" @click="openLead">+ 新增线索</NButton>
          </template>
          <BaseTable :columns="receptionColumns" :data="receptions" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="ticket" tab="服务工单">
        <NCard>
          <template #header-extra>
            <NButton size="small" type="primary" @click="openTicket">+ 新建工单</NButton>
          </template>
          <BaseTable :columns="ticketColumns" :data="tickets" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="patrol" tab="巡房记录">
        <NCard>
          <template #header-extra>
            <NButton size="small" type="primary" @click="openPatrol">+ 记录巡房</NButton>
          </template>
          <BaseTable :columns="patrolColumns" :data="patrols" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="follow" tab="家属回访">
        <NCard>
          <template #header-extra>
            <NButton size="small" type="primary" @click="openFollow">+ 回访记录</NButton>
          </template>
          <BaseTable :columns="followColumns" :data="followUps" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
      <NTabPane name="retrofit" tab="适老化评估">
        <NCard>
          <template #header-extra>
            <NButton size="small" type="primary" @click="openRetrofit">+ 评估记录</NButton>
          </template>
          <BaseTable :columns="retrofitColumns" :data="retrofits" :pagination="{ pageSize: 10 }" />
        </NCard>
      </NTabPane>
    </NTabs>

    <NModal v-model:show="leadModal" preset="card" title="接待线索" style="width: 620px">
      <NForm :model="leadForm" label-placement="left" label-width="90">
        <NFormItem label="老人姓名" required><NInput v-model:value="leadForm.elder_name" /></NFormItem>
        <NFormItem label="联系人"><NInput v-model:value="leadForm.contact_name" /></NFormItem>
        <NFormItem label="联系电话" required><NInput v-model:value="leadForm.phone" /></NFormItem>
        <NFormItem label="线索来源"><NInput v-model:value="leadForm.source" /></NFormItem>
        <NFormItem label="当前阶段"><NSelect v-model:value="leadForm.stage" :options="receptionStageOptions" /></NFormItem>
        <NFormItem label="下次跟进"><NInput v-model:value="leadForm.next_follow_at" /></NFormItem>
        <NFormItem label="需求摘要"><NInput v-model:value="leadForm.demand" type="textarea" :rows="3" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="leadModal = false">取消</NButton><NButton type="primary" @click="saveLead">保存</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="ticketModal" preset="card" title="服务工单" style="width: 620px">
      <NForm :model="ticketForm" label-placement="left" label-width="90">
        <NFormItem label="关联老人"><NSelect v-model:value="ticketForm.elderly_id" :options="elderlyOptions" clearable filterable /></NFormItem>
        <NFormItem label="服务类别"><NInput v-model:value="ticketForm.category" placeholder="生活服务 / 维修 / 投诉 / 代办" /></NFormItem>
        <NFormItem label="优先级"><NSelect v-model:value="ticketForm.priority" :options="priorityOptions" /></NFormItem>
        <NFormItem label="服务内容" required><NInput v-model:value="ticketForm.content" type="textarea" :rows="3" /></NFormItem>
        <NFormItem label="处理人"><NInput v-model:value="ticketForm.assignee" /></NFormItem>
        <NFormItem label="截止时间"><NInput v-model:value="ticketForm.due_at" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="ticketModal = false">取消</NButton><NButton type="primary" @click="saveTicket">创建工单</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="patrolModal" preset="card" title="巡房记录" style="width: 620px">
      <NForm :model="patrolForm" label-placement="left" label-width="90">
        <NFormItem label="巡查区域" required><NInput v-model:value="patrolForm.area" placeholder="如：二楼东区 / 康复室 / 公共卫浴" /></NFormItem>
        <NFormItem label="关联老人"><NSelect v-model:value="patrolForm.elderly_id" :options="elderlyOptions" clearable filterable /></NFormItem>
        <NFormItem label="巡查时间"><NInput v-model:value="patrolForm.patrol_at" /></NFormItem>
        <NFormItem label="巡查结果"><NSelect v-model:value="patrolForm.result" :options="patrolResultOptions" /></NFormItem>
        <NFormItem label="发现问题"><NInput v-model:value="patrolForm.finding" type="textarea" :rows="3" /></NFormItem>
        <NFormItem label="现场处置"><NInput v-model:value="patrolForm.action" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="patrolModal = false">取消</NButton><NButton type="primary" @click="savePatrol">保存巡房</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="followModal" preset="card" title="家属回访" style="width: 620px">
      <NForm :model="followForm" label-placement="left" label-width="90">
        <NFormItem label="关联老人"><NSelect v-model:value="followForm.elderly_id" :options="elderlyOptions" clearable filterable /></NFormItem>
        <NFormItem label="联系人" required><NInput v-model:value="followForm.contact_name" /></NFormItem>
        <NFormItem label="渠道"><NInput v-model:value="followForm.channel" /></NFormItem>
        <NFormItem label="回访时间"><NInput v-model:value="followForm.follow_at" /></NFormItem>
        <NFormItem label="满意度"><NSelect v-model:value="followForm.satisfaction" :options="[{ label: '满意', value: '满意' }, { label: '一般', value: '一般' }, { label: '不满意', value: '不满意' }]" /></NFormItem>
        <NFormItem label="反馈内容" required><NInput v-model:value="followForm.feedback" type="textarea" :rows="3" /></NFormItem>
        <NFormItem label="下一步"><NInput v-model:value="followForm.next_action" type="textarea" :rows="2" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="followModal = false">取消</NButton><NButton type="primary" @click="saveFollow">保存回访</NButton></NSpace></template>
    </NModal>

    <NModal v-model:show="retrofitModal" preset="card" title="适老化评估" style="width: 620px">
      <NForm :model="retrofitForm" label-placement="left" label-width="90">
        <NFormItem label="关联老人"><NSelect v-model:value="retrofitForm.elderly_id" :options="elderlyOptions" clearable filterable /></NFormItem>
        <NFormItem label="评估场景"><NInput v-model:value="retrofitForm.scene" placeholder="居室 / 卫浴 / 通道 / 公共区" /></NFormItem>
        <NFormItem label="风险点" required><NInput v-model:value="retrofitForm.risk_points" type="textarea" :rows="3" /></NFormItem>
        <NFormItem label="改造建议"><NInput v-model:value="retrofitForm.suggestion" type="textarea" :rows="3" /></NFormItem>
        <NFormItem label="预算"><NInput v-model:value="retrofitForm.budget" /></NFormItem>
        <NFormItem label="状态"><NSelect v-model:value="retrofitForm.status" :options="retrofitStatusOptions" /></NFormItem>
      </NForm>
      <template #footer><NSpace justify="end"><NButton @click="retrofitModal = false">取消</NButton><NButton type="primary" @click="saveRetrofit">保存评估</NButton></NSpace></template>
    </NModal>
  </BasePage>
</template>

