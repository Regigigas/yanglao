<script setup lang="ts">
  defineOptions({ name: 'FoodTherapy' });

  import {
    NAlert,
    NButton,
    NCard,
    NDescriptions,
    NDescriptionsItem,
    NDrawer,
    NDrawerContent,
    NEmpty,
    NInput,
    NSelect,
    NSpace,
    NStatistic,
    NTag,
  } from 'naive-ui';
  import { computed, ref } from 'vue';
  import { BasePage } from '@yanglao/ui';
  import { useElderlyStore } from '../../stores/elderly.store';
  import { useHealthStore } from '../../stores/health.store';
  import { useMealStore } from '../../stores/meal.store';
  import { usePageRefresh } from '../../composables/usePageRefresh';

  type TherapyGoal =
    'balanced' | 'soft' | 'protein' | 'low_salt' | 'sugar_control';
  type MealPeriod = 'breakfast' | 'lunch' | 'dinner' | 'snack';

  interface FoodTherapyRecipe {
    id: string;
    name: string;
    summary: string;
    goals: TherapyGoal[];
    mealPeriods: MealPeriod[];
    ingredients: string[];
    steps: string[];
    highlights: string[];
    cautions: string[];
  }

  const goalOptions: Array<{ label: string; value: TherapyGoal }> = [
    { label: '均衡膳食', value: 'balanced' },
    { label: '细软易食', value: 'soft' },
    { label: '补充优质蛋白', value: 'protein' },
    { label: '清淡少盐', value: 'low_salt' },
    { label: '控糖搭配', value: 'sugar_control' },
  ];

  const mealPeriodOptions: Array<{ label: string; value: MealPeriod }> = [
    { label: '早餐', value: 'breakfast' },
    { label: '午餐', value: 'lunch' },
    { label: '晚餐', value: 'dinner' },
    { label: '加餐', value: 'snack' },
  ];

  const goalLabels = Object.fromEntries(
    goalOptions.map((item) => [item.value, item.label]),
  ) as Record<TherapyGoal, string>;
  const mealPeriodLabels = Object.fromEntries(
    mealPeriodOptions.map((item) => [item.value, item.label]),
  ) as Record<MealPeriod, string>;
  const dietTypeLabels: Record<string, string> = {
    normal: '普通均衡膳食',
    diabetes: '糖尿病膳食',
    hypertension: '低盐控压膳食',
    low_purine: '低嘌呤膳食',
    soft: '软食/易咀嚼膳食',
    malnutrition: '营养改善膳食',
    other: '其他个性化膳食',
  };

  const recipes: FoodTherapyRecipe[] = [
    {
      id: 'chicken-vegetable-congee',
      name: '香菇鸡肉青菜粥',
      summary: '谷物、禽肉和蔬菜同煮，质地可按咀嚼能力调整。',
      goals: ['balanced', 'soft', 'protein'],
      mealPeriods: ['breakfast', 'dinner'],
      ingredients: [
        '大米 25g',
        '鸡肉 30g',
        '鲜香菇 20g',
        '青菜 50g',
        '植物油 3g',
      ],
      steps: [
        '鸡肉切碎并彻底加热。',
        '大米煮至软烂后加入香菇和鸡肉。',
        '出锅前加入切碎青菜，少油少盐调味。',
      ],
      highlights: ['食物种类较丰富', '质地可调', '含优质蛋白'],
      cautions: [
        '吞咽困难者需由专业人员评估食物稠度。',
        '对香菇或禽肉过敏者不适用。',
      ],
    },
    {
      id: 'fish-tofu-soup',
      name: '鲫鱼豆腐汤',
      summary: '鱼类与豆制品搭配，适合作为正餐中的蛋白质菜品。',
      goals: ['balanced', 'protein', 'low_salt'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: ['鲫鱼 60g', '北豆腐 50g', '姜片 2g', '青菜 50g'],
      steps: [
        '鲫鱼处理干净，煎制时控制用油。',
        '加水和姜片煮熟后放入豆腐。',
        '加入青菜并彻底煮熟，少盐调味。',
      ],
      highlights: ['鱼类蛋白', '搭配豆制品', '清淡烹调'],
      cautions: [
        '供餐前必须仔细去除鱼刺。',
        '肾功能异常者的蛋白质摄入量需遵循医嘱。',
      ],
    },
    {
      id: 'shrimp-steamed-egg',
      name: '虾仁蒸蛋',
      summary: '蒸制后细软，适合咀嚼能力较弱但可安全吞咽的人群。',
      goals: ['soft', 'protein', 'low_salt'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: ['鸡蛋 50g', '虾仁 30g', '温水 80ml', '香葱少量'],
      steps: [
        '鸡蛋与温水搅匀后过滤。',
        '虾仁切碎放入蛋液。',
        '蒸至完全凝固，少盐调味。',
      ],
      highlights: ['细软易咀嚼', '含优质蛋白', '少油烹调'],
      cautions: [
        '对蛋类或甲壳类食物过敏者不适用。',
        '必须确保蛋和虾完全熟透。',
      ],
    },
    {
      id: 'pumpkin-millet-congee',
      name: '南瓜小米粥',
      summary: '口感细软，可与蛋、奶或豆制品搭配形成更完整的一餐。',
      goals: ['soft'],
      mealPeriods: ['breakfast', 'dinner'],
      ingredients: ['小米 35g', '南瓜 80g', '清水适量'],
      steps: [
        '南瓜去皮切小块。',
        '小米与南瓜同煮至软烂。',
        '不额外加糖，按进食能力调整稠度。',
      ],
      highlights: ['质地细软', '制作简单', '不额外加糖'],
      cautions: [
        '不能替代完整正餐，建议搭配蛋白质食物。',
        '控糖人群应将其计入当餐主食总量。',
      ],
    },
    {
      id: 'oat-milk',
      name: '燕麦牛奶羹',
      summary: '全谷物与奶类组合，适合作为早餐或加餐。',
      goals: ['balanced', 'soft', 'protein', 'sugar_control'],
      mealPeriods: ['breakfast', 'snack'],
      ingredients: ['燕麦片 30g', '低脂牛奶 250ml', '核桃碎 5g'],
      steps: [
        '燕麦片加水煮软。',
        '加入牛奶小火加热，不长时间沸煮。',
        '出锅后撒少量核桃碎，不额外加糖。',
      ],
      highlights: ['含全谷物', '含奶类蛋白', '不额外加糖'],
      cautions: [
        '乳糖不耐受者可改用无乳糖奶。',
        '坚果需切碎，吞咽困难者不添加颗粒。',
      ],
    },
    {
      id: 'beef-tomato-stew',
      name: '番茄牛肉软烩',
      summary: '瘦肉与蔬菜慢炖至软烂，可配少量杂粮主食。',
      goals: ['balanced', 'soft', 'protein'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: ['瘦牛肉 60g', '番茄 150g', '胡萝卜 50g', '洋葱 20g'],
      steps: [
        '牛肉切小块焯水。',
        '番茄、胡萝卜和牛肉同炖至软烂。',
        '利用番茄增味，减少盐和含钠调味品。',
      ],
      highlights: ['含瘦肉蛋白', '搭配多种蔬菜', '软烂易咀嚼'],
      cautions: [
        '咀嚼能力弱者需切碎或制成适宜质地。',
        '痛风急性期或需限制肉类者遵循医嘱。',
      ],
    },
    {
      id: 'tofu-broccoli-fungus',
      name: '豆腐西兰花烩木耳',
      summary: '豆制品与多种蔬菜搭配，采用焯水后少油烩制。',
      goals: ['balanced', 'low_salt', 'sugar_control'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: ['北豆腐 80g', '西兰花 100g', '胡萝卜 30g', '干木耳 5g'],
      steps: [
        '木耳充分泡发、清洗并煮熟。',
        '西兰花和胡萝卜焯水。',
        '与豆腐少油烩制，少盐调味。',
      ],
      highlights: ['含豆制品', '蔬菜种类丰富', '清淡少油'],
      cautions: [
        '木耳应现泡现用并彻底加热。',
        '需限制钾或磷者应由营养专业人员调整食材和份量。',
      ],
    },
    {
      id: 'winter-melon-mushroom-soup',
      name: '冬瓜菌菇汤',
      summary: '以蔬菜和菌菇提供鲜味，减少对盐和复合调味料的依赖。',
      goals: ['low_salt', 'balanced'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: ['冬瓜 150g', '鲜香菇 30g', '白玉菇 30g', '瘦肉 20g'],
      steps: [
        '所有食材洗净切成适口大小。',
        '菌菇和瘦肉彻底煮熟后加入冬瓜。',
        '以天然食材增味，少放盐和鸡精。',
      ],
      highlights: ['少盐思路', '增加蔬菜摄入', '食材天然增味'],
      cautions: [
        '不把汤水作为治疗水肿或降压的方法。',
        '需要限水者按医嘱控制汤量。',
      ],
    },
    {
      id: 'multigrain-rice',
      name: '杂粮蔬菜饭',
      summary: '用部分全谷物和杂豆替代精白米，搭配蔬菜和蛋白质菜品。',
      goals: ['balanced', 'sugar_control'],
      mealPeriods: ['lunch', 'dinner'],
      ingredients: [
        '大米 50g',
        '糙米 15g',
        '小米 10g',
        '杂豆 10g',
        '胡萝卜 30g',
      ],
      steps: [
        '杂豆和糙米提前浸泡。',
        '与大米、小米和胡萝卜同煮。',
        '按咀嚼能力延长烹煮时间，并搭配一荤一素。',
      ],
      highlights: ['含全谷物杂豆', '主食粗细搭配', '不额外加糖'],
      cautions: [
        '吞咽或消化能力较弱者应减少粗杂粮比例并煮软。',
        '控糖人群仍需控制当餐主食总量。',
      ],
    },
  ];

  const elderlyStore = useElderlyStore();
  const healthStore = useHealthStore();
  const mealStore = useMealStore();

  const keyword = ref('');
  const selectedGoal = ref<TherapyGoal | null>(null);
  const selectedMealPeriod = ref<MealPeriod | null>(null);
  const selectedElderlyId = ref<string | null>(null);
  const selectedRecipe = ref<FoodTherapyRecipe | null>(null);
  const showRecipeDrawer = ref(false);

  const elderlyOptions = computed(() =>
    elderlyStore.list
      .filter((elderly) => elderly.status === 'active')
      .map((elderly) => ({ label: elderly.name, value: elderly.id })),
  );

  const currentNutritionPlan = computed(
    () =>
      mealStore.nutritionPlans.find((plan) => plan.status === 'active') ?? null,
  );

  const filteredRecipes = computed(() => {
    const normalizedKeyword = keyword.value.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesGoal =
        !selectedGoal.value || recipe.goals.includes(selectedGoal.value);
      const matchesMealPeriod =
        !selectedMealPeriod.value ||
        recipe.mealPeriods.includes(selectedMealPeriod.value);
      const searchableText = [
        recipe.name,
        recipe.summary,
        ...recipe.ingredients,
        ...recipe.highlights,
      ]
        .join(' ')
        .toLowerCase();
      return (
        matchesGoal &&
        matchesMealPeriod &&
        (!normalizedKeyword || searchableText.includes(normalizedKeyword))
      );
    });
  });

  async function loadData() {
    await elderlyStore.fetchList();
    if (selectedElderlyId.value) {
      await Promise.all([
        healthStore.fetchAll(selectedElderlyId.value),
        mealStore.fetchNutritionPlans(selectedElderlyId.value, false),
      ]);
    }
  }

  const { refresh, refreshing } = usePageRefresh(loadData);

  async function onElderlyChange(elderlyId: string | null) {
    selectedElderlyId.value = elderlyId;
    healthStore.profile = null;
    mealStore.nutritionPlans = [];
    if (!elderlyId) {
      return;
    }
    await Promise.all([
      healthStore.fetchAll(elderlyId),
      mealStore.fetchNutritionPlans(elderlyId, false),
    ]);
  }

  function clearFilters() {
    keyword.value = '';
    selectedGoal.value = null;
    selectedMealPeriod.value = null;
  }

  function openRecipe(recipe: FoodTherapyRecipe) {
    selectedRecipe.value = recipe;
    showRecipeDrawer.value = true;
  }
</script>

<template>
  <BasePage
    title="食补"
    description="面向养老照护场景的食养参考，可结合健康档案与营养方案筛选日常食谱"
  >
    <template #actions>
      <NButton
        :loading="refreshing"
        @click="refresh"
      >
        刷新档案
      </NButton>
    </template>

    <NAlert
      type="warning"
      class="mb-4"
    >
      食补内容仅用于日常膳食参考，不能替代诊断、药物或临床营养治疗。涉及糖尿病、肾病、吞咽障碍、食物过敏或药物相互作用时，应由医师、药师或营养专业人员确认。
    </NAlert>

    <div class="summary-grid mb-4">
      <NCard size="small">
        <NStatistic
          label="食补方案"
          :value="recipes.length"
        >
          <template #suffix>
            项
          </template>
        </NStatistic>
      </NCard>
      <NCard size="small">
        <NStatistic
          label="当前筛选"
          :value="filteredRecipes.length"
        >
          <template #suffix>
            项
          </template>
        </NStatistic>
      </NCard>
      <NCard size="small">
        <NStatistic
          label="调养方向"
          :value="goalOptions.length"
        >
          <template #suffix>
            类
          </template>
        </NStatistic>
      </NCard>
    </div>

    <NCard
      title="个人档案参考"
      class="mb-4"
    >
      <NSpace
        align="center"
        class="mb-3"
      >
        <NSelect
          v-model:value="selectedElderlyId"
          :options="elderlyOptions"
          clearable
          filterable
          placeholder="可选：选择老人查看饮食提醒"
          style="width: 280px"
          @update:value="onElderlyChange"
        />
      </NSpace>

      <NDescriptions
        v-if="selectedElderlyId"
        :columns="3"
        bordered
        label-placement="left"
      >
        <NDescriptionsItem label="过敏信息">
          {{ healthStore.profile?.allergy || '未记录' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="慢性病">
          {{ healthStore.profile?.chronic_disease || '未记录' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="饮食要求">
          {{ healthStore.profile?.diet_require || '未记录' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="当前膳食类型">
          {{
            currentNutritionPlan
              ? (dietTypeLabels[currentNutritionPlan.diet_type] ??
                currentNutritionPlan.diet_type)
              : '未配置执行中的营养方案'
          }}
        </NDescriptionsItem>
        <NDescriptionsItem label="忌口食物">
          {{ currentNutritionPlan?.avoid_foods || '未记录' }}
        </NDescriptionsItem>
        <NDescriptionsItem label="营养方案建议">
          {{ currentNutritionPlan?.meal_advice || '未记录' }}
        </NDescriptionsItem>
      </NDescriptions>
      <NAlert
        v-else
        type="info"
        :bordered="false"
      >
        选择老人后，会并列展示健康档案与当前营养方案，便于人工核对过敏、忌口和饮食要求。
      </NAlert>
    </NCard>

    <NCard title="食补方案库">
      <NSpace
        class="filter-bar"
        align="center"
      >
        <NInput
          v-model:value="keyword"
          clearable
          placeholder="搜索食谱、食材或特点"
          style="width: 260px"
        />
        <NSelect
          v-model:value="selectedGoal"
          :options="goalOptions"
          clearable
          placeholder="调养方向"
          style="width: 180px"
        />
        <NSelect
          v-model:value="selectedMealPeriod"
          :options="mealPeriodOptions"
          clearable
          placeholder="适用餐次"
          style="width: 150px"
        />
        <NButton @click="clearFilters">
          重置
        </NButton>
      </NSpace>

      <div
        v-if="filteredRecipes.length"
        class="recipe-grid"
      >
        <NCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          size="small"
          hoverable
          class="recipe-card"
        >
          <template #header>
            <div class="recipe-title">
              {{ recipe.name }}
            </div>
          </template>
          <template #header-extra>
            <NTag
              size="small"
              :bordered="false"
              type="success"
            >
              {{
                recipe.mealPeriods
                  .map((period) => mealPeriodLabels[period])
                  .join(' / ')
              }}
            </NTag>
          </template>
          <p class="recipe-summary">
            {{ recipe.summary }}
          </p>
          <NSpace size="small">
            <NTag
              v-for="goal in recipe.goals"
              :key="goal"
              size="small"
              :bordered="false"
            >
              {{ goalLabels[goal] }}
            </NTag>
          </NSpace>
          <template #footer>
            <NButton
              text
              type="primary"
              @click="openRecipe(recipe)"
            >
              查看食材、做法与慎用提示
            </NButton>
          </template>
        </NCard>
      </div>
      <NEmpty
        v-else
        description="没有符合当前条件的食补方案"
        class="empty-state"
      >
        <template #extra>
          <NButton @click="clearFilters">
            清除筛选
          </NButton>
        </template>
      </NEmpty>
    </NCard>

    <NAlert
      type="info"
      class="mt-4"
      :bordered="false"
    >
      内容编制参考国家卫生健康委《老年人膳食指导》、老年人膳食指南核心推荐及慢性病食养指南，强调食物多样、质地适宜、足量蛋白和个体化调整。
    </NAlert>

    <NDrawer
      v-model:show="showRecipeDrawer"
      :width="520"
    >
      <NDrawerContent
        v-if="selectedRecipe"
        :title="selectedRecipe.name"
        closable
      >
        <p class="drawer-summary">
          {{ selectedRecipe.summary }}
        </p>

        <section class="detail-section">
          <h3>主要食材</h3>
          <ul>
            <li
              v-for="ingredient in selectedRecipe.ingredients"
              :key="ingredient"
            >
              {{ ingredient }}
            </li>
          </ul>
        </section>

        <section class="detail-section">
          <h3>参考做法</h3>
          <ol>
            <li
              v-for="step in selectedRecipe.steps"
              :key="step"
            >
              {{ step }}
            </li>
          </ol>
        </section>

        <section class="detail-section">
          <h3>搭配特点</h3>
          <NSpace>
            <NTag
              v-for="highlight in selectedRecipe.highlights"
              :key="highlight"
              type="success"
            >
              {{ highlight }}
            </NTag>
          </NSpace>
        </section>

        <section class="detail-section">
          <h3>慎用提示</h3>
          <NAlert
            type="warning"
            :bordered="false"
          >
            <ul class="caution-list">
              <li
                v-for="caution in selectedRecipe.cautions"
                :key="caution"
              >
                {{ caution }}
              </li>
            </ul>
          </NAlert>
        </section>
      </NDrawerContent>
    </NDrawer>
  </BasePage>
</template>

<style scoped>
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .filter-bar {
    margin-bottom: 18px;
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .recipe-card {
    min-height: 210px;
  }

  .recipe-title {
    font-size: 16px;
    font-weight: 600;
  }

  .recipe-summary,
  .drawer-summary {
    color: var(--n-text-color-2);
    line-height: 1.7;
  }

  .empty-state {
    padding: 48px 0;
  }

  .detail-section {
    margin-bottom: 24px;
  }

  .detail-section h3 {
    margin: 0 0 10px;
  }

  .detail-section li {
    margin-bottom: 8px;
    line-height: 1.65;
  }

  .caution-list {
    margin: 0;
    padding-left: 18px;
  }

  @media (width <= 1280px) {
    .recipe-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (width <= 900px) {
    .summary-grid,
    .recipe-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
