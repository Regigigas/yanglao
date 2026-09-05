<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NAlert, NButton, NButtonGroup, NCard, NCheckbox, NDivider, NGrid, NGi, NList,
  NListItem, NSlider, NSpace, NTabPane, NTabs, NTag,
} from 'naive-ui';
import BasePage from '@ui/components/BasePage.vue';
import HumanMeridian3D from '../../components/HumanMeridian3D.vue';
import type { Human3DSelection } from '../../components/HumanMeridian3D.vue';

interface MeridianInfo {
  id: string
  name: string
  pinyin: string
  category: string
  overview: string
  route: string
  reference: string
  acupoints: string[]
}

interface AnatomyInfo {
  id: string
  name: string
  system: string
  description: string
}

const meridianData: MeridianInfo[] = [
  { id: 'lung', name: '手太阴肺经', pinyin: 'Shǒu Tài Yīn Fèi Jīng', category: '十二正经', overview: '属阴经，与手阳明大肠经相表里，是十二经脉气血流注的起始经脉之一。', route: '起于中焦，下络大肠，返循胃口，上膈属肺；体表支脉从胸部出发，沿上肢内侧前缘至拇指桡侧。', reference: '传统经络理论中主要联系肺系、胸部、咽喉以及上肢内侧前缘。', acupoints: ['中府', '尺泽', '列缺', '太渊', '少商'] },
  { id: 'large-intestine', name: '手阳明大肠经', pinyin: 'Shǒu Yáng Míng Dà Cháng Jīng', category: '十二正经', overview: '属阳经，与手太阴肺经相表里，从手走头，循行于上肢外侧前缘。', route: '起于食指桡侧，沿上肢外侧前缘上行，经过肩部、颈部进入面颊，止于对侧鼻旁。', reference: '传统经络理论中主要联系头面、鼻、口齿、咽喉和上肢外侧。', acupoints: ['商阳', '合谷', '曲池', '肩髃', '迎香'] },
  { id: 'stomach', name: '足阳明胃经', pinyin: 'Zú Yáng Míng Wèi Jīng', category: '十二正经', overview: '属阳经，与足太阴脾经相表里，从头走足，循行范围覆盖面部、胸腹和下肢前侧。', route: '起于鼻旁，上行至鼻根并联系目周，随后下行经过面颊、颈胸、腹部及下肢前外侧，止于第二趾外侧。', reference: '传统经络理论中主要联系胃腑、口齿、面部、胸腹和下肢前侧。', acupoints: ['承泣', '颊车', '天枢', '足三里', '丰隆', '内庭'] },
  { id: 'spleen', name: '足太阴脾经', pinyin: 'Zú Tài Yīn Pí Jīng', category: '十二正经', overview: '属阴经，与足阳明胃经相表里，从足走腹，循行于下肢内侧前缘。', route: '起于足大趾内侧，沿足内侧和下肢内侧上行，进入腹部属脾络胃，再上行至胸胁。', reference: '传统经络理论中主要联系脾胃、腹部、胸胁及下肢内侧。', acupoints: ['隐白', '太白', '三阴交', '阴陵泉', '血海'] },
  { id: 'heart', name: '手少阴心经', pinyin: 'Shǒu Shào Yīn Xīn Jīng', category: '十二正经', overview: '属阴经，与手太阳小肠经相表里，从胸走手，循行于上肢内侧后缘。', route: '起于心中，出属心系并下络小肠；体表支脉从腋下出发，沿上肢内侧后缘下行至小指桡侧。', reference: '传统经络理论中主要联系心胸、舌、目系以及上肢内侧。', acupoints: ['极泉', '少海', '通里', '神门', '少冲'] },
  { id: 'small-intestine', name: '手太阳小肠经', pinyin: 'Shǒu Tài Yáng Xiǎo Cháng Jīng', category: '十二正经', overview: '属阳经，与手少阴心经相表里，从手走头，循行于上肢外侧后缘。', route: '起于小指尺侧，沿手臂外侧后缘上行，经肩胛、颈部到达面颊和耳前。', reference: '传统经络理论中主要联系肩胛、颈项、耳、目和上肢外侧后缘。', acupoints: ['少泽', '后溪', '养老', '天宗', '听宫'] },
  { id: 'bladder', name: '足太阳膀胱经', pinyin: 'Zú Tài Yáng Páng Guāng Jīng', category: '十二正经', overview: '属阳经，与足少阴肾经相表里，是十二正经中体表循行最长、穴位较多的一条经脉。', route: '起于内眼角，上额越过头顶，沿背部脊柱两侧分支下行，经臀部和下肢后侧至小趾外侧。', reference: '传统经络理论中主要联系头项、眼、背腰、脏腑背俞部和下肢后侧。', acupoints: ['睛明', '肺俞', '肾俞', '委中', '昆仑', '至阴'] },
  { id: 'kidney', name: '足少阴肾经', pinyin: 'Zú Shào Yīn Shèn Jīng', category: '十二正经', overview: '属阴经，与足太阳膀胱经相表里，从足走胸，循行于下肢内侧后缘。', route: '起于足底，绕过内踝后方，沿下肢内侧上行，经过脊柱、肾和膀胱，再沿腹胸抵达锁骨下。', reference: '传统经络理论中主要联系肾系、腰脊、咽喉、胸腹和下肢内侧。', acupoints: ['涌泉', '太溪', '照海', '复溜', '俞府'] },
  { id: 'pericardium', name: '手厥阴心包经', pinyin: 'Shǒu Jué Yīn Xīn Bāo Jīng', category: '十二正经', overview: '属阴经，与手少阳三焦经相表里，从胸走手，循行于上肢内侧中线。', route: '起于胸中，属心包并下行联系三焦；体表支脉从胸胁出发，经腋下沿上肢内侧中线至中指尖。', reference: '传统经络理论中主要联系心胸、心包和上肢内侧中线。', acupoints: ['天池', '曲泽', '内关', '大陵', '劳宫', '中冲'] },
  { id: 'triple-burner', name: '手少阳三焦经', pinyin: 'Shǒu Shào Yáng Sān Jiāo Jīng', category: '十二正经', overview: '属阳经，与手厥阴心包经相表里，从手走头，循行于上肢外侧中线。', route: '起于无名指尺侧，沿手背和上肢外侧中线上行，经肩颈绕耳，止于眉梢外侧。', reference: '传统经络理论中主要联系耳、侧头、目外眦、肩臂和上肢外侧。', acupoints: ['关冲', '阳池', '外关', '支沟', '翳风', '丝竹空'] },
  { id: 'gallbladder', name: '足少阳胆经', pinyin: 'Zú Shào Yáng Dǎn Jīng', category: '十二正经', overview: '属阳经，与足厥阴肝经相表里，从头走足，循行于身体侧面。', route: '起于外眼角，曲折循行于侧头部，经肩、胁肋、髋部和下肢外侧下行，止于第四趾外侧。', reference: '传统经络理论中主要联系侧头、耳、目、胁肋、胆腑和下肢外侧。', acupoints: ['瞳子髎', '风池', '肩井', '环跳', '阳陵泉', '足临泣'] },
  { id: 'liver', name: '足厥阴肝经', pinyin: 'Zú Jué Yīn Gān Jīng', category: '十二正经', overview: '属阴经，与足少阳胆经相表里，从足走腹，循行于下肢内侧。', route: '起于足大趾背侧，沿足背和下肢内侧上行，绕阴器，进入少腹，属肝络胆并上达胁肋。', reference: '传统经络理论中主要联系肝胆、少腹、胁肋、目系和下肢内侧。', acupoints: ['大敦', '行间', '太冲', '曲泉', '期门'] },
  { id: 'ren', name: '任脉', pinyin: 'Rèn Mài', category: '奇经八脉', overview: '奇经八脉之一，行于人体前正中线，传统理论称为“阴脉之海”。', route: '起于胞中，下出会阴，沿腹部、胸部和颈部前正中线上行，到达下唇内，分支环绕口唇并联系目下。', reference: '传统经络理论中具有统任诸阴经、调节阴经气血的概括性作用。', acupoints: ['中极', '关元', '气海', '神阙', '膻中', '承浆'] },
  { id: 'du', name: '督脉', pinyin: 'Dū Mài', category: '奇经八脉', overview: '奇经八脉之一，主干行于人体后正中线，传统理论称为“阳脉之海”。', route: '起于胞中，下出会阴，沿脊柱后正中线上行，经项部进入脑内，再越过头顶沿额面下降至上唇。', reference: '传统经络理论中具有总督诸阳经、调节阳经气血的概括性作用。', acupoints: ['长强', '命门', '大椎', '百会', '水沟'] },
];

const anatomyData: AnatomyInfo[] = [
  { id: 'brain', name: '脑', system: '神经系统', description: '位于颅腔内，是中枢神经系统的主要部分。' },
  { id: 'heart', name: '心脏', system: '循环系统', description: '位于胸腔中纵隔，负责推动血液循环。' },
  { id: 'left-lung', name: '左肺', system: '呼吸系统', description: '左肺通常分为两叶，与右肺共同完成气体交换。' },
  { id: 'right-lung', name: '右肺', system: '呼吸系统', description: '右肺通常分为三叶，体积略大于左肺。' },
  { id: 'liver', name: '肝脏', system: '消化系统', description: '位于右上腹，参与代谢、解毒、合成和胆汁分泌。' },
  { id: 'stomach', name: '胃', system: '消化系统', description: '位于上腹部，是食物暂存和初步消化的重要器官。' },
  { id: 'spleen', name: '脾脏', system: '免疫系统', description: '位于左上腹，参与免疫应答和血细胞处理。' },
  { id: 'left-kidney', name: '左肾', system: '泌尿系统', description: '位于腹膜后，过滤血液并参与体液和电解质调节。' },
  { id: 'right-kidney', name: '右肾', system: '泌尿系统', description: '通常因肝脏位置而略低于左肾。' },
  { id: 'intestines', name: '肠道', system: '消化系统', description: '包括小肠和大肠，承担营养吸收和废物形成等功能。' },
  { id: 'skull', name: '颅骨', system: '骨骼系统', description: '保护脑和头部感觉器官，并构成面部支架。' },
  { id: 'skeleton', name: '骨骼', system: '骨骼系统', description: '为人体提供支撑、保护脏器并参与运动和造血。' },
];

const viewer = ref<InstanceType<typeof HumanMeridian3D> | null>(null);
const showSkin = ref(true);
const showMuscles = ref(false);
const showSkeleton = ref(false);
const showOrgans = ref(false);
const showMeridians = ref(true);
const flowSpeed = ref(1);
const activeInfoTab = ref('meridian');
const selected = ref<Human3DSelection>({ id: 'ren', name: '任脉', kind: 'meridian' });

const selectedMeridian = computed(() => meridianData.find(item => item.id === selected.value.id) ?? null);
const selectedAnatomy = computed(() => anatomyData.find(item => item.id === selected.value.id) ?? null);

function selectItem(selection: Human3DSelection | null) {
  if (!selection) return;
  selected.value = selection;
  activeInfoTab.value = selection.kind === 'meridian' ? 'meridian' : 'anatomy';
}

function selectMeridian(item: MeridianInfo) {
  selected.value = { id: item.id, name: item.name, kind: 'meridian' };
  showMeridians.value = true;
  activeInfoTab.value = 'meridian';
}

function selectAnatomy(item: AnatomyInfo) {
  selected.value = { id: item.id, name: item.name, kind: item.system === '骨骼系统' ? 'skeleton' : 'organ' };
  if (item.system === '骨骼系统') showSkeleton.value = true;
  else showOrgans.value = true;
  activeInfoTab.value = 'anatomy';
}

function applyMode(mode: 'meridian' | 'anatomy' | 'muscle' | 'combined') {
  if (mode === 'meridian') {
    showSkin.value = true; showMuscles.value = false; showSkeleton.value = false; showOrgans.value = false; showMeridians.value = true;
  } else if (mode === 'anatomy') {
    showSkin.value = false; showMuscles.value = false; showSkeleton.value = true; showOrgans.value = true; showMeridians.value = false;
  } else if (mode === 'muscle') {
    showSkin.value = false; showMuscles.value = true; showSkeleton.value = true; showOrgans.value = false; showMeridians.value = false;
  } else {
    showSkin.value = true; showMuscles.value = false; showSkeleton.value = true; showOrgans.value = true; showMeridians.value = true;
  }
}
</script>

<template>
  <BasePage
    title="人体经络与解剖 3D"
    description="仿真针灸经络铜人，可查看经络流向、常用穴位和人体解剖分层"
  >
    <template #actions>
      <NButtonGroup>
        <NButton @click="applyMode('meridian')">
          经络铜人
        </NButton>
        <NButton @click="applyMode('anatomy')">
          解剖模式
        </NButton>
        <NButton @click="applyMode('muscle')">
          肌肉骨骼
        </NButton>
        <NButton
          type="primary"
          @click="applyMode('combined')"
        >
          综合显示
        </NButton>
      </NButtonGroup>
    </template>

    <NGrid
      :cols="24"
      :x-gap="14"
      responsive="screen"
    >
      <NGi :span="5">
        <NCard
          title="显示图层"
          size="small"
          class="side-card"
        >
          <NSpace vertical>
            <NCheckbox v-model:checked="showSkin">
              半透明皮肤
            </NCheckbox>
            <NCheckbox v-model:checked="showMuscles">
              肌肉层
            </NCheckbox>
            <NCheckbox v-model:checked="showSkeleton">
              骨骼层
            </NCheckbox>
            <NCheckbox v-model:checked="showOrgans">
              主要脏器
            </NCheckbox>
            <NCheckbox v-model:checked="showMeridians">
              经络流动
            </NCheckbox>
          </NSpace>
          <NDivider />
          <div class="control-label">
            经络流速
          </div>
          <NSlider
            v-model:value="flowSpeed"
            :min="0.2"
            :max="3"
            :step="0.1"
          />
          <NDivider />
          <div class="control-label">
            观察方向
          </div>
          <NSpace>
            <NButton
              size="small"
              @click="viewer?.setView('front')"
            >
              正面
            </NButton>
            <NButton
              size="small"
              @click="viewer?.setView('back')"
            >
              背面
            </NButton>
            <NButton
              size="small"
              @click="viewer?.setView('left')"
            >
              左侧
            </NButton>
            <NButton
              size="small"
              @click="viewer?.setView('right')"
            >
              右侧
            </NButton>
          </NSpace>
          <NDivider />
          <NTabs
            v-model:value="activeInfoTab"
            size="small"
            type="segment"
          >
            <NTabPane
              name="meridian"
              tab="经络"
            >
              <NList
                hoverable
                clickable
                class="item-list"
              >
                <NListItem
                  v-for="item in meridianData"
                  :key="item.id"
                  :class="{ active: selected.id === item.id }"
                  @click="selectMeridian(item)"
                >
                  <div class="list-name">
                    {{ item.name }}
                  </div>
                  <div class="list-pinyin">
                    {{ item.pinyin }}
                  </div>
                  <NTag
                    size="tiny"
                    :bordered="false"
                  >
                    {{ item.category }}
                  </NTag>
                </NListItem>
              </NList>
            </NTabPane>
            <NTabPane
              name="anatomy"
              tab="解剖"
            >
              <NList
                hoverable
                clickable
                class="item-list"
              >
                <NListItem
                  v-for="item in anatomyData"
                  :key="item.id"
                  :class="{ active: selected.id === item.id }"
                  @click="selectAnatomy(item)"
                >
                  <div class="list-name">
                    {{ item.name }}
                  </div>
                  <NTag
                    size="tiny"
                    :bordered="false"
                  >
                    {{ item.system }}
                  </NTag>
                </NListItem>
              </NList>
            </NTabPane>
          </NTabs>
        </NCard>
      </NGi>

      <NGi :span="14">
        <HumanMeridian3D
          ref="viewer"
          :show-skin="showSkin"
          :show-muscles="showMuscles"
          :show-skeleton="showSkeleton"
          :show-organs="showOrgans"
          :show-meridians="showMeridians"
          :flow-speed="flowSpeed"
          :selected-id="selected.id"
          @select="selectItem"
        />
      </NGi>

      <NGi :span="5">
        <NCard
          title="当前选中"
          size="small"
          class="side-card detail-card"
        >
          <template v-if="selectedMeridian">
            <NSpace
              align="center"
              justify="space-between"
            >
              <div>
                <h3>{{ selectedMeridian.name }}</h3>
                <div class="detail-pinyin">
                  {{ selectedMeridian.pinyin }}
                </div>
              </div>
              <NTag type="success">
                {{ selectedMeridian.category }}
              </NTag>
            </NSpace>
            <NDivider title-placement="left">
              经络简介
            </NDivider>
            <p>{{ selectedMeridian.overview }}</p>
            <NDivider title-placement="left">
              循行路线
            </NDivider>
            <p>{{ selectedMeridian.route }}</p>
            <NDivider title-placement="left">
              常用穴位
            </NDivider>
            <NSpace>
              <NTag
                v-for="acupoint in selectedMeridian.acupoints"
                :key="acupoint"
                size="small"
                type="success"
                :bordered="false"
              >
                {{ acupoint }}
              </NTag>
            </NSpace>
            <NDivider title-placement="left">
              传统理论参考
            </NDivider>
            <p>{{ selectedMeridian.reference }}</p>
            <NAlert
              type="warning"
              :bordered="false"
            >
              经络路径为教学示意，不代表精确穴位定位，不能用于诊断或替代专业医疗意见。
            </NAlert>
          </template>
          <template v-else-if="selectedAnatomy">
            <NSpace align="center">
              <h3>{{ selectedAnatomy.name }}</h3>
              <NTag type="info">
                {{ selectedAnatomy.system }}
              </NTag>
            </NSpace>
            <NDivider title-placement="left">
              结构说明
            </NDivider>
            <p>{{ selectedAnatomy.description }}</p>
            <NAlert
              type="info"
              :bordered="false"
            >
              解剖模型采用简化比例，用于结构认知和照护培训，不作为医学影像或手术定位依据。
            </NAlert>
          </template>
          <template v-else>
            <p>点击人体上的经络、器官或骨骼查看说明。</p>
          </template>
        </NCard>
      </NGi>
    </NGrid>
  </BasePage>
</template>

<style scoped>
.side-card { height: 720px; overflow: hidden; }
.control-label { margin-bottom: 8px; color: var(--n-text-color); font-size: 13px; font-weight: 600; }
.item-list { max-height: 390px; overflow: auto; }
.item-list :deep(.n-list-item) { padding: 9px 10px; border-radius: 8px; transition: background-color 0.18s ease; }
.item-list :deep(.n-list-item.active) { background: rgb(24 160 88 / 12%); }
.list-name { margin-bottom: 4px; font-weight: 600; }
.list-pinyin { margin-bottom: 5px; color: var(--n-text-color-3); font-size: 11px; }
.detail-card :deep(.n-card__content) { overflow-y: auto; }
.detail-pinyin { margin-top: 4px; color: var(--n-text-color-3); font-size: 13px; letter-spacing: 0.02em; }
h3 { margin: 0; }
p { line-height: 1.75; color: var(--n-text-color-2); }

@media (max-width: 1280px) {
  .side-card { height: 620px; }
}
</style>
