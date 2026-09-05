<script setup lang="ts">
/* global window, document, URL, ResizeObserver, console, performance, HTMLDivElement, HTMLButtonElement, PointerEvent */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

export interface Human3DSelection {
  id: string
  name: string
  kind: 'meridian' | 'organ' | 'skeleton'
}

interface Props {
  showSkin: boolean
  showMuscles: boolean
  showSkeleton: boolean
  showOrgans: boolean
  showMeridians: boolean
  flowSpeed: number
  selectedId?: string | null
}

type Point = [number, number, number]
type AnatomyLayer = 'muscles' | 'skeleton' | 'organs'
interface MeridianDefinition {
  id: string
  name: string
  color: number
  paths: Point[][]
}
interface ProjectionVertexSet {
  positions: Float32Array
  normals: Float32Array
}
interface SurfaceProjection {
  point: THREE.Vector3
  normal: THREE.Vector3
  isValid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
});
const emit = defineEmits<{
  select: [selection: Human3DSelection | null]
}>();

const container = ref<HTMLDivElement | null>(null);
const renderError = ref(false);
const isModelLoading = ref(true);
const modelLoadError = ref(false);
const surfaceFitError = ref(false);
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;
let renderer: THREE.WebGLRenderer | undefined;
let controls: OrbitControls | undefined;
let resizeObserver: ResizeObserver | undefined;
let animationFrame = 0;
let lastRenderedAt = 0;
let needsRender = true;
let skinGroup: THREE.Group | undefined;
let muscleGroup: THREE.Group | undefined;
let skeletonGroup: THREE.Group | undefined;
let organGroup: THREE.Group | undefined;
let meridianGroup: THREE.Group | undefined;
let projectionSurface: THREE.Group | undefined;
let renderedMeridianId: string | null = null;
let activeFlowGroup: THREE.Group | undefined;
let activeFlowMeridianId: string | null = null;
let bronzeHuman: THREE.Object3D | undefined;
let selectedObject: THREE.Object3D | null = null;
const raycaster = new THREE.Raycaster();
const surfaceProjectionRaycaster = new THREE.Raycaster();
const visibilityRaycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const interactiveObjects: THREE.Object3D[] = [];
const flowingParticles: Array<{ mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; offset: number; meridianId: string }> = [];
const meridianLines: Array<{
  mesh: THREE.Mesh
  meridianId: string
  color: number
  anchor: THREE.Vector3
  normal: THREE.Vector3
}> = [];
const meridianCurves = new Map<string, THREE.Curve<THREE.Vector3>>();
const curveSurfaceSamples = new WeakMap<THREE.Curve<THREE.Vector3>, SurfaceProjection[]>();
const meridianCurvePaths: Array<{ curve: THREE.Curve<THREE.Vector3>; meridianId: string }> = [];
const meridianLabels = new Map<string, { element: HTMLButtonElement; anchor: THREE.Vector3; normal: THREE.Vector3 }>();
const acupointLabels = new Map<string, { element: HTMLButtonElement; anchor: THREE.Vector3; normal: THREE.Vector3; meridianId: string }>();
const acupointMarkers: Array<{ mesh: THREE.Mesh; meridianId: string; normal: THREE.Vector3 }> = [];
const surfaceVisibilityCache = new WeakMap<THREE.Vector3, {
  cameraPosition: THREE.Vector3
  visible: boolean
}>();
let renderedLabelMeridianId: string | null = null;
const SURFACE_LINE_OFFSET = 0.012;
const ACUPOINT_SURFACE_OFFSET = 0.0015;
const ACUPOINT_MARKER_HEIGHT = 0.02;
const LABEL_SURFACE_OFFSET = 0.02;
const SURFACE_NORMAL_AXIS = new THREE.Vector3(0, 1, 0);
const SURFACE_VISIBILITY_TOLERANCE = 0.1;
const MAX_SURFACE_SAMPLE_STEP = 0.32;

const meridians: MeridianDefinition[] = [
  { id: 'ren', name: '任脉', color: 0xffd166, paths: [[[0, -0.72, 0.62], [0, -0.4, 0.88], [0, 0.7, 0.92], [0, 1.8, 0.83], [0, 2.55, 0.56], [0, 3.0, 0.51]]] },
  { id: 'du', name: '督脉', color: 0xff6b6b, paths: [[[0, -0.82, -0.66], [0, -0.1, -0.82], [0, 1.2, -0.84], [0, 2.3, -0.55], [0, 3.55, -0.15], [0, 3.02, 0.48]]] },
  { id: 'lung', name: '手太阴肺经', color: 0xe9f5ff, paths: [[[-0.34, 1.82, 0.82], [-0.68, 1.62, 0.69], [-1.0, 1.28, 0.55], [-1.27, 0.82, 0.42], [-1.48, 0.3, 0.32]], [[0.34, 1.82, 0.82], [0.68, 1.62, 0.69], [1.0, 1.28, 0.55], [1.27, 0.82, 0.42], [1.48, 0.3, 0.32]]] },
  { id: 'large-intestine', name: '手阳明大肠经', color: 0xf4a261, paths: [[[-1.5, 0.3, 0.18], [-1.28, 0.82, 0.14], [-1.02, 1.3, 0.2], [-0.68, 1.78, 0.38], [-0.26, 2.82, 0.49]], [[1.5, 0.3, 0.18], [1.28, 0.82, 0.14], [1.02, 1.3, 0.2], [0.68, 1.78, 0.38], [0.26, 2.82, 0.49]]] },
  { id: 'stomach', name: '足阳明胃经', color: 0xffc857, paths: [[[-0.18, 2.88, 0.53], [-0.42, 2.18, 0.68], [-0.5, 1.05, 0.88], [-0.48, -0.25, 0.74], [-0.52, -1.45, 0.47], [-0.55, -2.75, 0.35], [-0.48, -3.85, 0.25]], [[0.18, 2.88, 0.53], [0.42, 2.18, 0.68], [0.5, 1.05, 0.88], [0.48, -0.25, 0.74], [0.52, -1.45, 0.47], [0.55, -2.75, 0.35], [0.48, -3.85, 0.25]]] },
  { id: 'spleen', name: '足太阴脾经', color: 0xff9f1c, paths: [[[-0.6, -3.84, 0.1], [-0.42, -2.8, 0.12], [-0.32, -1.5, 0.25], [-0.28, -0.28, 0.69], [-0.65, 0.72, 0.75], [-0.8, 1.38, 0.55]], [[0.6, -3.84, 0.1], [0.42, -2.8, 0.12], [0.32, -1.5, 0.25], [0.28, -0.28, 0.69], [0.65, 0.72, 0.75], [0.8, 1.38, 0.55]]] },
  { id: 'heart', name: '手少阴心经', color: 0xff4d6d, paths: [[[-0.22, 1.48, 0.78], [-0.7, 1.36, 0.55], [-1.0, 1.0, 0.4], [-1.28, 0.62, 0.28], [-1.5, 0.27, 0.2]], [[0.22, 1.48, 0.78], [0.7, 1.36, 0.55], [1.0, 1.0, 0.4], [1.28, 0.62, 0.28], [1.5, 0.27, 0.2]]] },
  { id: 'small-intestine', name: '手太阳小肠经', color: 0xff7f51, paths: [[[-1.52, 0.28, -0.02], [-1.3, 0.78, -0.22], [-1.02, 1.3, -0.38], [-0.68, 1.78, -0.55], [-0.46, 3.05, 0.08]], [[1.52, 0.28, -0.02], [1.3, 0.78, -0.22], [1.02, 1.3, -0.38], [0.68, 1.78, -0.55], [0.46, 3.05, 0.08]]] },
  { id: 'bladder', name: '足太阳膀胱经', color: 0x4cc9f0, paths: [[[-0.22, 3.05, 0.42], [-0.24, 2.7, -0.48], [-0.3, 1.45, -0.83], [-0.34, 0.1, -0.78], [-0.45, -1.55, -0.48], [-0.48, -2.85, -0.38], [-0.62, -3.82, -0.18]], [[0.22, 3.05, 0.42], [0.24, 2.7, -0.48], [0.3, 1.45, -0.83], [0.34, 0.1, -0.78], [0.45, -1.55, -0.48], [0.48, -2.85, -0.38], [0.62, -3.82, -0.18]]] },
  { id: 'kidney', name: '足少阴肾经', color: 0x4361ee, paths: [[[-0.3, -3.9, 0.03], [-0.28, -2.8, 0.22], [-0.22, -1.45, 0.34], [-0.16, -0.2, 0.65], [-0.22, 1.25, 0.78]], [[0.3, -3.9, 0.03], [0.28, -2.8, 0.22], [0.22, -1.45, 0.34], [0.16, -0.2, 0.65], [0.22, 1.25, 0.78]]] },
  { id: 'pericardium', name: '手厥阴心包经', color: 0xf72585, paths: [[[-0.12, 1.25, 0.9], [-0.62, 1.42, 0.61], [-1.02, 1.02, 0.46], [-1.43, 0.34, 0.34]], [[0.12, 1.25, 0.9], [0.62, 1.42, 0.61], [1.02, 1.02, 0.46], [1.43, 0.34, 0.34]]] },
  { id: 'triple-burner', name: '手少阳三焦经', color: 0xb5179e, paths: [[[-1.5, 0.3, -0.05], [-1.3, 0.82, -0.25], [-1.0, 1.32, -0.38], [-0.62, 1.78, -0.32], [-0.46, 2.86, 0.28]], [[1.5, 0.3, -0.05], [1.3, 0.82, -0.25], [1.0, 1.32, -0.38], [0.62, 1.78, -0.32], [0.46, 2.86, 0.28]]] },
  { id: 'gallbladder', name: '足少阳胆经', color: 0x80b918, paths: [[[-0.42, 3.06, 0.18], [-0.62, 2.25, 0.05], [-0.88, 1.08, 0.2], [-0.78, -0.15, 0.1], [-0.7, -1.52, 0.02], [-0.72, -2.78, 0.02], [-0.72, -3.82, 0.08]], [[0.42, 3.06, 0.18], [0.62, 2.25, 0.05], [0.88, 1.08, 0.2], [0.78, -0.15, 0.1], [0.7, -1.52, 0.02], [0.72, -2.78, 0.02], [0.72, -3.82, 0.08]]] },
  { id: 'liver', name: '足厥阴肝经', color: 0x55a630, paths: [[[-0.48, -3.85, 0.22], [-0.28, -2.72, 0.28], [-0.18, -1.48, 0.4], [-0.12, -0.28, 0.72], [-0.48, 0.88, 0.82]], [[0.48, -3.85, 0.22], [0.28, -2.72, 0.28], [0.18, -1.48, 0.4], [0.12, -0.28, 0.72], [0.48, 0.88, 0.82]]] },
];

const meridianAcupoints: Record<string, string[]> = {
  lung: ['中府', '尺泽', '列缺', '太渊', '少商'],
  'large-intestine': ['商阳', '合谷', '曲池', '肩髃', '迎香'],
  stomach: ['承泣', '颊车', '天枢', '足三里', '丰隆', '内庭'],
  spleen: ['隐白', '太白', '三阴交', '阴陵泉', '血海'],
  heart: ['极泉', '少海', '通里', '神门', '少冲'],
  'small-intestine': ['少泽', '后溪', '养老', '天宗', '听宫'],
  bladder: ['睛明', '肺俞', '肾俞', '委中', '昆仑', '至阴'],
  kidney: ['涌泉', '太溪', '照海', '复溜', '俞府'],
  pericardium: ['天池', '曲泽', '内关', '大陵', '劳宫', '中冲'],
  'triple-burner': ['关冲', '阳池', '外关', '支沟', '翳风', '丝竹空'],
  gallbladder: ['瞳子髎', '风池', '肩井', '环跳', '阳陵泉', '足临泣'],
  liver: ['大敦', '行间', '太冲', '曲泉', '期门'],
  ren: ['中极', '关元', '气海', '神阙', '膻中', '承浆'],
  du: ['长强', '命门', '大椎', '百会', '水沟'],
};

function material(color: number, opacity = 1): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, roughness: 0.58, metalness: 0.04, depthWrite: opacity > 0.45 });
}

function ellipsoid(parent: THREE.Group, name: string, position: Point, scale: Point, color: number, opacity = 1): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), material(color, opacity));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function capsule(parent: THREE.Group, name: string, position: Point, radius: number, length: number, color: number, rotationZ = 0, opacity = 1): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 10, 20), material(color, opacity));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.z = rotationZ;
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinderBetween(parent: THREE.Group, start: Point, end: Point, radius: number, color: number): THREE.Mesh {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 12), material(color));
  mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function markInteractive(object: THREE.Object3D, selection: Human3DSelection): void {
  object.userData.selection = selection;
  interactiveObjects.push(object);
}

function createSkin(): THREE.Group {
  const group = new THREE.Group();
  group.name = '皮肤轮廓';
  ellipsoid(group, '头部皮肤', [0, 3.05, 0], [0.5, 0.64, 0.46], 0xf1ba9a, 0.28);
  capsule(group, '颈部皮肤', [0, 2.36, 0], 0.27, 0.32, 0xe8aa88, 0, 0.28);
  ellipsoid(group, '躯干皮肤', [0, 0.95, 0], [0.92, 1.48, 0.65], 0xe8aa88, 0.25);
  ellipsoid(group, '骨盆皮肤', [0, -0.56, 0], [0.76, 0.68, 0.58], 0xe8aa88, 0.25);
  capsule(group, '左臂皮肤', [-1.12, 1.05, 0], 0.25, 1.38, 0xe8aa88, -0.22, 0.28);
  capsule(group, '右臂皮肤', [1.12, 1.05, 0], 0.25, 1.38, 0xe8aa88, 0.22, 0.28);
  capsule(group, '左前臂皮肤', [-1.48, -0.25, 0], 0.2, 1.15, 0xe8aa88, -0.12, 0.28);
  capsule(group, '右前臂皮肤', [1.48, -0.25, 0], 0.2, 1.15, 0xe8aa88, 0.12, 0.28);
  capsule(group, '左大腿皮肤', [-0.42, -1.7, 0], 0.36, 1.65, 0xe8aa88, -0.04, 0.28);
  capsule(group, '右大腿皮肤', [0.42, -1.7, 0], 0.36, 1.65, 0xe8aa88, 0.04, 0.28);
  capsule(group, '左小腿皮肤', [-0.47, -3.25, 0], 0.25, 1.28, 0xe8aa88, 0.02, 0.28);
  capsule(group, '右小腿皮肤', [0.47, -3.25, 0], 0.25, 1.28, 0xe8aa88, -0.02, 0.28);
  ellipsoid(group, '左足皮肤', [-0.47, -4.03, 0.18], [0.28, 0.18, 0.52], 0xe8aa88, 0.28);
  ellipsoid(group, '右足皮肤', [0.47, -4.03, 0.18], [0.28, 0.18, 0.52], 0xe8aa88, 0.28);
  return group;
}

function updateBronzeMaterial(): void {
  if (!bronzeHuman) return;
  const showInternalLayers = props.showOrgans || props.showSkeleton || props.showMuscles;
  const opacity = showInternalLayers ? 0.2 : 1;
  bronzeHuman.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((item) => {
      item.transparent = opacity < 1;
      item.opacity = opacity;
      item.depthWrite = opacity > 0.5;
      item.needsUpdate = true;
    });
  });
}

function applyMaleBodyMorphs(model: THREE.Object3D): void {
  const morphWeights: Record<string, number> = {
    bodyMasculine: 1,
    bodyMuscular: 0.18,
    bustSmaller: 0.9,
    shouldersWider: 0.24,
    chestWider: 0.1,
    chestVShape: 0.18,
    chestPectorals: 0.18,
    hipsNarrower: 0.2,
    jawWider: 0.12,
    neckThicker: 0.08,
    armsMuscular: 0.12,
    thighsMuscular: 0.1,
    calvesMuscular: 0.1,
  };
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const dictionary = object.morphTargetDictionary;
    const influences = object.morphTargetInfluences;
    if (!dictionary || !influences) return;
    Object.entries(morphWeights).forEach(([name, weight]) => {
      const index = dictionary[name];
      if (index !== undefined) influences[index] = weight;
    });
  });
}

function updateSkinnedMeshSkeletons(model: THREE.Object3D): void {
  model.updateMatrixWorld(true);
  model.traverse((object) => {
    if (object instanceof THREE.SkinnedMesh) object.skeleton.update();
  });
}

function loadBronzeHuman(target: THREE.Group): void {
  const modelUrl = new URL('./models/acupuncture-bronze-human.glb', window.location.href).href;
  new GLTFLoader().load(modelUrl, (gltf) => {
    const model = gltf.scene;
    applyMaleBodyMorphs(model);
    const leftArm = model.getObjectByName('mixamorig:LeftArm') ?? model.getObjectByName('mixamorigLeftArm');
    const rightArm = model.getObjectByName('mixamorig:RightArm') ?? model.getObjectByName('mixamorigRightArm');
    if (leftArm && rightArm) {
      leftArm.rotation.z -= 0.4;
      rightArm.rotation.z += 0.4;
    }
    updateSkinnedMeshSkeletons(model);
    const initialBounds = new THREE.Box3().setFromObject(model);
    const initialSize = initialBounds.getSize(new THREE.Vector3());
    const scale = initialSize.y > 0 ? 8.05 / initialSize.y : 1;
    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -0.25 - center.y, -center.z);
    updateSkinnedMeshSkeletons(model);
    model.name = '仿真针灸经络铜人';
    const bronzeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbc7a38,
      emissive: 0x241004,
      emissiveIntensity: 0.18,
      metalness: 0.54,
      roughness: 0.38,
      clearcoat: 0.3,
      clearcoatRoughness: 0.42,
      envMapIntensity: 1.25,
    });
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = bronzeMaterial;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    disposeObject(target);
    target.clear();
    target.add(model);
    bronzeHuman = model;
    target.updateMatrixWorld(true);
    try {
      rebuildSurfaceMeridians(props.selectedId ?? null);
    } catch (error) {
      surfaceFitError.value = true;
      console.error('[HumanMeridian3D] 经络贴肤计算失败，已保留基础经络', error);
    } finally {
      isModelLoading.value = false;
    }
    updateBronzeMaterial();
  }, undefined, (error) => {
    isModelLoading.value = false;
    modelLoadError.value = true;
    if (scene && meridianGroup && meridianGroup.children.length === 0) {
      scene.remove(meridianGroup);
      meridianCurvePaths.length = 0;
      meridianCurves.clear();
      const meridianId = meridians.some(item => item.id === props.selectedId) ? props.selectedId : null;
      meridianGroup = meridianId ? createMeridians(undefined, meridianId) : new THREE.Group();
      renderedMeridianId = meridianId;
      meridianGroup.visible = props.showMeridians;
      scene.add(meridianGroup);
      createMeridianLabels(props.selectedId ?? null);
      syncActiveFlowParticles(props.selectedId ?? null);
      highlightSelection(props.selectedId ?? null);
    }
    console.error('[HumanMeridian3D] 铜人人体模型加载失败，已使用简化模型', error);
  });
}

function createMuscles(): THREE.Group {
  const group = new THREE.Group();
  const red = 0x9e3b32;
  ellipsoid(group, '胸大肌', [0, 1.45, 0.34], [0.72, 0.58, 0.28], red, 0.72);
  ellipsoid(group, '腹直肌', [0, 0.22, 0.38], [0.42, 0.86, 0.22], 0xb74f42, 0.74);
  capsule(group, '左上肢肌群', [-1.12, 0.78, 0], 0.19, 1.42, red, -0.22, 0.76);
  capsule(group, '右上肢肌群', [1.12, 0.78, 0], 0.19, 1.42, red, 0.22, 0.76);
  capsule(group, '左股四头肌', [-0.42, -1.78, 0.18], 0.27, 1.58, red, -0.04, 0.76);
  capsule(group, '右股四头肌', [0.42, -1.78, 0.18], 0.27, 1.58, red, 0.04, 0.76);
  capsule(group, '左小腿肌群', [-0.47, -3.22, -0.05], 0.18, 1.2, 0x8d302c, 0.02, 0.76);
  capsule(group, '右小腿肌群', [0.47, -3.22, -0.05], 0.18, 1.2, 0x8d302c, -0.02, 0.76);
  return group;
}

function createSkeleton(): THREE.Group {
  const group = new THREE.Group();
  const bone = 0xeee8d5;
  const skull = ellipsoid(group, '颅骨', [0, 3.08, 0], [0.43, 0.55, 0.4], bone);
  markInteractive(skull, { id: 'skull', name: '颅骨', kind: 'skeleton' });
  cylinderBetween(group, [0, 2.55, 0], [0, -0.75, 0], 0.09, bone).name = '脊柱';
  for (let i = 0; i < 11; i += 1) {
    const y = 2.18 - i * 0.27;
    const width = 0.72 - Math.abs(i - 5) * 0.035;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, y, -0.08), new THREE.Vector3(-width, y, 0), new THREE.Vector3(0, y - 0.1, 0.44),
    ]);
    const left = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.035, 8, false), material(bone));
    const right = left.clone(); right.scale.x = -1;
    group.add(left, right);
  }
  cylinderBetween(group, [-0.72, 2.05, 0], [0.72, 2.05, 0], 0.055, bone).name = '锁骨';
  cylinderBetween(group, [-0.72, 1.95, 0], [-1.5, -0.62, 0], 0.055, bone).name = '左臂骨';
  cylinderBetween(group, [0.72, 1.95, 0], [1.5, -0.62, 0], 0.055, bone).name = '右臂骨';
  cylinderBetween(group, [-0.34, -0.55, 0], [-0.48, -3.92, 0], 0.075, bone).name = '左腿骨';
  cylinderBetween(group, [0.34, -0.55, 0], [0.48, -3.92, 0], 0.075, bone).name = '右腿骨';
  const pelvis = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.11, 10, 32), material(bone));
  pelvis.name = '骨盆'; pelvis.position.y = -0.62; pelvis.rotation.x = Math.PI / 2; group.add(pelvis);
  group.traverse((object) => {
    if (object instanceof THREE.Mesh && !object.userData.selection) {
      markInteractive(object, { id: object.name || 'skeleton', name: object.name || '骨骼', kind: 'skeleton' });
    }
  });
  return group;
}

function organ(parent: THREE.Group, id: string, name: string, position: Point, scale: Point, color: number): void {
  const mesh = ellipsoid(parent, name, position, scale, color, 0.92);
  markInteractive(mesh, { id, name, kind: 'organ' });
}

function createOrgans(): THREE.Group {
  const group = new THREE.Group();
  organ(group, 'brain', '脑', [0, 3.1, 0.02], [0.36, 0.42, 0.34], 0xe79ab1);
  organ(group, 'left-lung', '左肺', [-0.3, 1.45, 0.12], [0.28, 0.62, 0.3], 0xd98f8f);
  organ(group, 'right-lung', '右肺', [0.3, 1.45, 0.12], [0.28, 0.62, 0.3], 0xd98f8f);
  organ(group, 'heart', '心脏', [0.08, 1.25, 0.46], [0.22, 0.32, 0.2], 0xc92c3a);
  organ(group, 'liver', '肝脏', [0.34, 0.62, 0.25], [0.5, 0.28, 0.28], 0x8f3b32);
  organ(group, 'stomach', '胃', [-0.28, 0.45, 0.3], [0.28, 0.38, 0.23], 0xd47f6a);
  organ(group, 'spleen', '脾脏', [-0.55, 0.55, 0.08], [0.14, 0.27, 0.12], 0x7a2948);
  organ(group, 'left-kidney', '左肾', [-0.36, 0.05, -0.22], [0.16, 0.27, 0.13], 0x8b3f4d);
  organ(group, 'right-kidney', '右肾', [0.36, 0.05, -0.22], [0.16, 0.27, 0.13], 0x8b3f4d);
  const intestineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.05, 0.3), new THREE.Vector3(0.38, 0.02, 0.3),
    new THREE.Vector3(0.4, -0.45, 0.32), new THREE.Vector3(-0.38, -0.42, 0.32),
    new THREE.Vector3(-0.3, -0.08, 0.34), new THREE.Vector3(0.26, -0.12, 0.34),
  ]);
  const intestine = new THREE.Mesh(new THREE.TubeGeometry(intestineCurve, 50, 0.09, 12, false), material(0xc9826b));
  intestine.name = '肠道'; group.add(intestine);
  markInteractive(intestine, { id: 'intestines', name: '肠道', kind: 'organ' });
  return group;
}

function findDirectionalSurfaceProjection(
  point: THREE.Vector3,
  surface: THREE.Object3D,
  outwardDirection: THREE.Vector3,
): SurfaceProjection | null {
  const vertexSets = surface.userData.projectionVertexSets as ProjectionVertexSet[] | undefined;
  if (!vertexSets?.length) return null;
  const bestPoint = new THREE.Vector3();
  const bestNormal = outwardDirection.clone();
  const projectsFrontBack = Math.abs(outwardDirection.z) > 0.5;
  let bestSliceDistanceSq = Number.POSITIVE_INFINITY;
  vertexSets.forEach(({ positions, normals }) => {
    for (let index = 0; index < positions.length; index += 3) {
      const deltaY = positions[index + 1] - point.y;
      const lateralDelta = projectsFrontBack
        ? positions[index] - point.x
        : positions[index + 2] - point.z;
      const sliceDistanceSq = lateralDelta * lateralDelta + deltaY * deltaY;
      if (sliceDistanceSq < bestSliceDistanceSq) bestSliceDistanceSq = sliceDistanceSq;
    }
  });
  if (!Number.isFinite(bestSliceDistanceSq)) return null;
  const sliceToleranceSq = bestSliceDistanceSq + 0.008;
  let bestOutwardDistance = Number.NEGATIVE_INFINITY;
  vertexSets.forEach(({ positions, normals }) => {
    for (let index = 0; index < positions.length; index += 3) {
      const deltaY = positions[index + 1] - point.y;
      const lateralDelta = projectsFrontBack
        ? positions[index] - point.x
        : positions[index + 2] - point.z;
      if (lateralDelta * lateralDelta + deltaY * deltaY > sliceToleranceSq) continue;
      const outwardDistance = projectsFrontBack
        ? positions[index + 2] * outwardDirection.z
        : positions[index] * outwardDirection.x;
      if (outwardDistance <= bestOutwardDistance) continue;
      bestOutwardDistance = outwardDistance;
      bestPoint.set(positions[index], positions[index + 1], positions[index + 2]);
      bestNormal.set(normals[index], normals[index + 1], normals[index + 2]);
    }
  });
  if (!Number.isFinite(bestOutwardDistance)) return null;
  if (bestNormal.dot(outwardDirection) < 0) bestNormal.negate();
  return { point: bestPoint, normal: bestNormal.normalize(), isValid: true };
}

function findRaycastSurfaceProjection(
  point: THREE.Vector3,
  surface: THREE.Object3D,
  outwardDirection: THREE.Vector3,
): SurfaceProjection | null {
  let targets = surface.userData.meridianProjectionTargets as THREE.Object3D[] | undefined;
  if (!targets) {
    const bodyTargets: THREE.Object3D[] = [];
    const meshTargets: THREE.Object3D[] = [];
    surface.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      meshTargets.push(object);
      if (object.name.toLowerCase().includes('body')) bodyTargets.push(object);
    });
    targets = bodyTargets.length > 0 ? bodyTargets : meshTargets;
    surface.userData.meridianProjectionTargets = targets;
  }
  const projectsFrontBack = Math.abs(outwardDirection.z) > 0.5;
  const lateralOffsets = [0];
  const verticalOffsets = [0];
  const rayOrigin = new THREE.Vector3();
  const rayDirection = outwardDirection.clone().negate();
  for (const verticalOffset of verticalOffsets) {
    for (const lateralOffset of lateralOffsets) {
      if (projectsFrontBack) {
        rayOrigin.set(point.x + lateralOffset, point.y + verticalOffset, outwardDirection.z * 6);
      }
      else {
        rayOrigin.set(outwardDirection.x * 6, point.y + verticalOffset, point.z + lateralOffset);
      }
      surfaceProjectionRaycaster.set(rayOrigin, rayDirection);
      surfaceProjectionRaycaster.near = 0;
      surfaceProjectionRaycaster.far = 12;
      const hit = surfaceProjectionRaycaster.intersectObjects(targets, false)[0];
      if (!hit) continue;
      return {
        point: hit.point.clone(),
        normal: outwardDirection.clone(),
        isValid: true,
      };
    }
  }
  return null;
}

function projectPointToSurface(
  point: THREE.Vector3,
  surface: THREE.Object3D,
  projectsFrontBack = Math.abs(point.z) >= Math.abs(point.x),
): SurfaceProjection {
  const outwardDirection = projectsFrontBack
    ? new THREE.Vector3(0, 0, point.z < 0 ? -1 : 1)
    : new THREE.Vector3(point.x < 0 ? -1 : 1, 0, 0);
  const staticSurface = surface.userData.projectionVertexSets ? surface : projectionSurface;
  return findRaycastSurfaceProjection(point, staticSurface ?? surface, outwardDirection)
    ?? (staticSurface ? findDirectionalSurfaceProjection(point, staticSurface, outwardDirection) : null)
    ?? {
    point: point.clone(),
    normal: outwardDirection,
    isValid: false,
  };
}

function createMeridianCurve(path: Point[], surface?: THREE.Object3D): THREE.Curve<THREE.Vector3> {
  const sourceCurve = new THREE.CatmullRomCurve3(
    path.map(point => new THREE.Vector3(...point)), false, 'catmullrom', 0.35,
  );
  if (!surface) return sourceCurve;
  const sampleCount = Math.max(28, path.length * 5);
  const projectedPoints: THREE.Vector3[] = [];
  const surfaceSamples: SurfaceProjection[] = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const sourcePoint = sourceCurve.getPoint(index / (sampleCount - 1));
    const projection = projectPointToSurface(sourcePoint, surface, true);
    const surfacePoint = projection.point.addScaledVector(projection.normal, SURFACE_LINE_OFFSET);
    projectedPoints.push(surfacePoint);
    surfaceSamples.push({ point: surfacePoint.clone(), normal: projection.normal.clone(), isValid: projection.isValid });
  }
  const surfacePath = new THREE.CurvePath<THREE.Vector3>();
  for (let index = 1; index < projectedPoints.length; index += 1) {
    if (surfaceSamples[index - 1].isValid === false || surfaceSamples[index].isValid === false) continue;
    if (projectedPoints[index - 1].distanceTo(projectedPoints[index]) > MAX_SURFACE_SAMPLE_STEP) continue;
    surfacePath.add(new THREE.LineCurve3(projectedPoints[index - 1], projectedPoints[index]));
  }
  curveSurfaceSamples.set(surfacePath, surfaceSamples);
  return surfacePath;
}

function isMirroredPath(source: Point[], candidate: Point[]): boolean {
  return source.length === candidate.length && source.every((point, index) => (
    Math.abs(point[0] + candidate[index][0]) < 0.0001
    && Math.abs(point[1] - candidate[index][1]) < 0.0001
    && Math.abs(point[2] - candidate[index][2]) < 0.0001
  ));
}

function createMirroredSurfaceCurve(sourceCurve: THREE.Curve<THREE.Vector3>): THREE.Curve<THREE.Vector3> {
  const sourceSamples = curveSurfaceSamples.get(sourceCurve) ?? [];
  const mirroredSamples = sourceSamples.map(({ point, normal, isValid }) => ({
    point: new THREE.Vector3(-point.x, point.y, point.z),
    normal: new THREE.Vector3(-normal.x, normal.y, normal.z),
    isValid,
  }));
  const mirroredPath = new THREE.CurvePath<THREE.Vector3>();
  for (let index = 1; index < mirroredSamples.length; index += 1) {
    if (mirroredSamples[index - 1].isValid === false || mirroredSamples[index].isValid === false) continue;
    if (mirroredSamples[index - 1].point.distanceTo(mirroredSamples[index].point) > MAX_SURFACE_SAMPLE_STEP) continue;
    mirroredPath.add(new THREE.LineCurve3(mirroredSamples[index - 1].point, mirroredSamples[index].point));
  }
  curveSurfaceSamples.set(mirroredPath, mirroredSamples);
  return mirroredPath;
}

function getCurveSurfaceProjection(curve: THREE.Curve<THREE.Vector3>, progress: number): SurfaceProjection {
  const samples = curveSurfaceSamples.get(curve);
  if (samples?.length) {
    const sample = samples[Math.min(samples.length - 1, Math.round(progress * (samples.length - 1)))];
    return { point: sample.point.clone(), normal: sample.normal.clone(), isValid: sample.isValid };
  }
  const point = curve.getPointAt(progress);
  const normal = new THREE.Vector3(point.x, 0, point.z);
  if (normal.lengthSq() < 0.0001) normal.set(0, 0, 1);
  return { point, normal: normal.normalize() };
}

function createStaticProjectionSurface(source: THREE.Object3D): THREE.Group {
  const surface = new THREE.Group();
  const projectionVertexSets: ProjectionVertexSet[] = [];
  source.updateMatrixWorld(true);
  const sourceMeshes: THREE.Mesh[] = [];
  source.traverse((object) => {
    if (object instanceof THREE.Mesh) sourceMeshes.push(object);
  });
  const geometryMeshes = sourceMeshes.filter((object) => {
    const position = object.geometry.getAttribute('position');
    return Boolean(position && position.itemSize >= 3 && position.count > 0);
  });
  const bodyMeshes = geometryMeshes.filter(object => object.name.toLowerCase().includes('body'));
  const projectionMeshes = bodyMeshes.length > 0 ? bodyMeshes : geometryMeshes;
  projectionMeshes.forEach((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const sourcePosition = object.geometry.getAttribute('position');
    if (!sourcePosition || sourcePosition.itemSize < 3 || sourcePosition.count === 0) return;
    const geometry = object.geometry.clone();
    const targetPosition = new THREE.Float32BufferAttribute(new Float32Array(sourcePosition.count * 3), 3);
    geometry.setAttribute('position', targetPosition);
    geometry.morphAttributes = {};
    const vertex = new THREE.Vector3();
    for (let index = 0; index < sourcePosition.count; index += 1) {
      object.getVertexPosition(index, vertex);
      if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y) || !Number.isFinite(vertex.z)) {
        vertex.set(sourcePosition.getX(index), sourcePosition.getY(index), sourcePosition.getZ(index));
      }
      vertex.applyMatrix4(object.matrixWorld);
      if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y) || !Number.isFinite(vertex.z)) continue;
      targetPosition.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
    targetPosition.needsUpdate = true;
    geometry.deleteAttribute('normal');
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const targetNormal = geometry.getAttribute('normal');
    if (targetNormal && !targetNormal.isInterleavedBufferAttribute) {
      projectionVertexSets.push({
        positions: targetPosition.array as Float32Array,
        normals: targetNormal.array as Float32Array,
      });
    }
    surface.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })));
  });
  surface.userData.projectionVertexSets = projectionVertexSets;
  surface.updateMatrixWorld(true);
  return surface;
}

function createMeridians(surface?: THREE.Object3D, onlyMeridianId?: string | null): THREE.Group {
  const group = new THREE.Group();
  meridians.filter(definition => !onlyMeridianId || definition.id === onlyMeridianId).forEach((definition) => {
    let primaryCurve: THREE.Curve<THREE.Vector3> | undefined;
    definition.paths.forEach((path, pathIndex) => {
      const curve = primaryCurve
        && curveSurfaceSamples.has(primaryCurve)
        && isMirroredPath(definition.paths[0], path)
        ? createMirroredSurfaceCurve(primaryCurve)
        : createMeridianCurve(path, surface);
      if (pathIndex === 0) {
        primaryCurve = curve;
        meridianCurves.set(definition.id, curve);
      }
      meridianCurvePaths.push({ curve, meridianId: definition.id });
      const surfaceSamples = curveSurfaceSamples.get(curve);
      const appendLine = (
        line: THREE.Mesh,
        anchor: THREE.Vector3,
        normal: THREE.Vector3,
      ): void => {
        const lineMaterial = new THREE.MeshBasicMaterial({
          color: definition.color,
          transparent: true,
          opacity: 0.74,
          depthTest: true,
        });
        line.material = lineMaterial;
        line.renderOrder = 5;
        markInteractive(line, { id: definition.id, name: definition.name, kind: 'meridian' });
        group.add(line);
        meridianLines.push({
          mesh: line,
          meridianId: definition.id,
          color: definition.color,
          anchor,
          normal,
        });
      };
      if (surfaceSamples?.length) {
        surfaceSamples.slice(1).forEach((end, index) => {
          const start = surfaceSamples[index];
          if (start.isValid === false || end.isValid === false) return;
          const direction = end.point.clone().sub(start.point);
          if (direction.lengthSq() < 0.000001) return;
          if (direction.length() > MAX_SURFACE_SAMPLE_STEP) return;
          const line = new THREE.Mesh(
            new THREE.CylinderGeometry(0.011, 0.011, direction.length(), 6, 1, false),
          );
          const anchor = start.point.clone().add(end.point).multiplyScalar(0.5);
          line.position.copy(anchor);
          line.quaternion.setFromUnitVectors(SURFACE_NORMAL_AXIS, direction.normalize());
          appendLine(
            line,
            anchor,
            start.normal.clone().add(end.normal).normalize(),
          );
        });
      }
      else {
        const lineSurface = getCurveSurfaceProjection(curve, 0.5);
        appendLine(
          new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(36, path.length * 8), 0.011, 6, false)),
          lineSurface.point,
          lineSurface.normal,
        );
      }
      const acupoints = meridianAcupoints[definition.id] ?? [];
      acupoints.forEach((name, pointIndex) => {
        const surfaceProjection = getCurveSurfaceProjection(
          curve,
          (pointIndex + 1) / (acupoints.length + 1),
        );
        const marker = new THREE.Mesh(
          surface
            ? new THREE.CylinderGeometry(0.038, 0.038, ACUPOINT_MARKER_HEIGHT, 18)
            : new THREE.SphereGeometry(0.024, 8, 6),
          new THREE.MeshBasicMaterial({
            color: 0x9f251d,
            transparent: true,
            opacity: 0.82,
            depthTest: true,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
          }),
        );
        marker.name = name;
        marker.position.copy(surfaceProjection.point)
          .addScaledVector(
            surfaceProjection.normal,
            ACUPOINT_SURFACE_OFFSET + ACUPOINT_MARKER_HEIGHT / 2,
          );
        marker.quaternion.setFromUnitVectors(SURFACE_NORMAL_AXIS, surfaceProjection.normal);
        marker.renderOrder = 9;
        markInteractive(marker, { id: definition.id, name: definition.name, kind: 'meridian' });
        group.add(marker);
        acupointMarkers.push({
          mesh: marker,
          meridianId: definition.id,
          normal: surfaceProjection.normal,
        });
      });
    });
  });
  return group;
}

function clearActiveFlowParticles(): void {
  if (activeFlowGroup) {
    activeFlowGroup.parent?.remove(activeFlowGroup);
    disposeObject(activeFlowGroup);
  }
  activeFlowGroup = undefined;
  activeFlowMeridianId = null;
  flowingParticles.length = 0;
}

function syncActiveFlowParticles(id: string | null): void {
  const definition = meridians.find(item => item.id === id);
  const shouldRender = Boolean(props.showMeridians && meridianGroup && definition);
  if (!shouldRender) {
    clearActiveFlowParticles();
    return;
  }
  if (activeFlowGroup && activeFlowMeridianId === id) return;
  clearActiveFlowParticles();
  const group = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.032, 8, 6);
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: definition?.color ?? 0xffdf72,
    transparent: true,
    opacity: 0.98,
    depthTest: true,
  });
  meridianCurvePaths.filter(item => item.meridianId === id).forEach(({ curve }, pathIndex) => {
    for (let index = 0; index < 2; index += 1) {
      const particle = new THREE.Mesh(geometry, particleMaterial);
      particle.renderOrder = 8;
      group.add(particle);
      flowingParticles.push({
        mesh: particle,
        curve,
        offset: (index / 2 + pathIndex * 0.17) % 1,
        meridianId: id as string,
      });
    }
  });
  activeFlowGroup = group;
  activeFlowMeridianId = id;
  meridianGroup?.add(group);
}

function removeMeridianLabels(): void {
  meridianLabels.forEach(({ element }) => element.remove());
  meridianLabels.clear();
  acupointLabels.forEach(({ element }) => element.remove());
  acupointLabels.clear();
  renderedLabelMeridianId = null;
}

function rebuildSurfaceMeridians(id: string | null): void {
  if (!scene || !bronzeHuman) return;
  selectedObject = null;
  if (meridianGroup) {
    scene.remove(meridianGroup);
    disposeObject(meridianGroup);
  }
  for (let index = interactiveObjects.length - 1; index >= 0; index -= 1) {
    if (interactiveObjects[index].userData.selection?.kind === 'meridian') interactiveObjects.splice(index, 1);
  }
  flowingParticles.length = 0;
  meridianLines.length = 0;
  acupointMarkers.length = 0;
  meridianCurves.clear();
  meridianCurvePaths.length = 0;
  activeFlowGroup = undefined;
  activeFlowMeridianId = null;
  removeMeridianLabels();
  projectionSurface ??= createStaticProjectionSurface(bronzeHuman);
  const meridianId = meridians.some(item => item.id === id) ? id : null;
  meridianGroup = meridianId ? createMeridians(bronzeHuman, meridianId) : new THREE.Group();
  renderedMeridianId = meridianId;
  meridianGroup.visible = props.showMeridians;
  scene.add(meridianGroup);
  createMeridianLabels(meridianId);
  syncActiveFlowParticles(meridianId);
  highlightSelection(id);
}

function createMeridianLabels(id: string | null): void {
  if (renderedLabelMeridianId === id) return;
  removeMeridianLabels();
  if (!container.value || !id) return;
  const definition = meridians.find(item => item.id === id);
  if (!definition) return;
  const mainPath = definition.paths[0];
  const curve = meridianCurves.get(definition.id) ?? createMeridianCurve(mainPath);
  const anchorPoint = createSurfaceLabelAnchor(curve, 0.52);
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'meridian-label';
  element.textContent = definition.name;
  element.style.setProperty('--meridian-color', `#${definition.color.toString(16).padStart(6, '0')}`);
  element.title = `点击查看${definition.name}详细介绍`;
  element.addEventListener('pointerdown', event => event.stopPropagation());
  element.addEventListener('click', () => {
    emit('select', { id: definition.id, name: definition.name, kind: 'meridian' });
  });
  container.value.appendChild(element);
  meridianLabels.set(definition.id, { element, anchor: anchorPoint.point, normal: anchorPoint.normal });
  const acupoints = meridianAcupoints[definition.id] ?? [];
  acupoints.forEach((name, pointIndex) => {
    const pointElement = document.createElement('button');
    pointElement.type = 'button';
    pointElement.className = 'acupoint-label';
    pointElement.textContent = name;
    pointElement.title = `${definition.name} · ${name}`;
    pointElement.addEventListener('pointerdown', event => event.stopPropagation());
    pointElement.addEventListener('click', () => {
      emit('select', { id: definition.id, name: definition.name, kind: 'meridian' });
    });
    container.value?.appendChild(pointElement);
    const pointAnchor = createSurfaceLabelAnchor(curve, (pointIndex + 1) / (acupoints.length + 1));
    acupointLabels.set(`${definition.id}-${pointIndex}`, {
      element: pointElement,
      anchor: pointAnchor.point,
      normal: pointAnchor.normal,
      meridianId: definition.id,
    });
  });
  renderedLabelMeridianId = id;
}

function createSurfaceLabelAnchor(
  curve: THREE.Curve<THREE.Vector3>,
  progress: number,
): SurfaceProjection {
  const projection = getCurveSurfaceProjection(curve, progress);
  return {
    point: projection.point.addScaledVector(
      projection.normal,
      bronzeHuman ? LABEL_SURFACE_OFFSET - SURFACE_LINE_OFFSET : LABEL_SURFACE_OFFSET,
    ),
    normal: projection.normal,
  };
}

function updateMeridianLabels(): void {
  if (!camera || !container.value) return;
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  meridianLabels.forEach(({ element, anchor, normal }, id) => {
    const projected = anchor.clone().project(camera as THREE.Camera);
    const isVisible = props.showMeridians && id === props.selectedId
      && projected.z > -1 && projected.z < 1 && isSurfacePointVisible(anchor, normal);
    element.style.display = isVisible ? 'block' : 'none';
    if (!isVisible) return;
    element.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
    element.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
    element.classList.toggle('selected', id === props.selectedId);
  });
  acupointLabels.forEach(({ element, anchor, normal, meridianId }) => {
    const projected = anchor.clone().project(camera as THREE.Camera);
    const isVisible = props.showMeridians && meridianId === props.selectedId
      && projected.z > -1 && projected.z < 1 && isSurfacePointVisible(anchor, normal);
    element.style.display = isVisible ? 'block' : 'none';
    if (!isVisible) return;
    element.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
    element.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
  });
}

function isSurfacePointVisible(point: THREE.Vector3, normal: THREE.Vector3): boolean {
  if (!camera) return true;
  const cached = surfaceVisibilityCache.get(point);
  if (cached?.cameraPosition.distanceToSquared(camera.position) < 0.000001) return cached.visible;
  const directionToCamera = camera.position.clone().sub(point);
  const distanceToCamera = directionToCamera.length();
  const isFacingCamera = normal.dot(directionToCamera.normalize()) > -SURFACE_VISIBILITY_TOLERANCE;
  let visible = isFacingCamera;
  const occlusionSurface = projectionSurface ?? bronzeHuman;
  if (visible && occlusionSurface && distanceToCamera > 0.05) {
    visibilityRaycaster.near = 0.01;
    visibilityRaycaster.far = Math.max(0.01, distanceToCamera - 0.035);
    visibilityRaycaster.set(camera.position, point.clone().sub(camera.position).normalize());
    visible = visibilityRaycaster.intersectObject(occlusionSurface, true).length === 0;
  }
  surfaceVisibilityCache.set(point, { cameraPosition: camera.position.clone(), visible });
  return visible;
}

function isSurfaceNormalFacingCamera(point: THREE.Vector3, normal: THREE.Vector3): boolean {
  if (!camera) return true;
  return normal.dot(camera.position.clone().sub(point).normalize()) > -SURFACE_VISIBILITY_TOLERANCE;
}

function removeInteractiveObjects(root: THREE.Object3D): void {
  const descendants = new Set<THREE.Object3D>();
  root.traverse(object => descendants.add(object));
  if (selectedObject && descendants.has(selectedObject)) selectedObject = null;
  for (let index = interactiveObjects.length - 1; index >= 0; index -= 1) {
    if (descendants.has(interactiveObjects[index])) interactiveObjects.splice(index, 1);
  }
}

function releaseAnatomyLayer(layer: AnatomyLayer): void {
  const group = layer === 'muscles' ? muscleGroup : layer === 'skeleton' ? skeletonGroup : organGroup;
  if (!group) return;
  removeInteractiveObjects(group);
  group.parent?.remove(group);
  disposeObject(group);
  if (layer === 'muscles') muscleGroup = undefined;
  else if (layer === 'skeleton') skeletonGroup = undefined;
  else organGroup = undefined;
}

function syncAnatomyLayer(layer: AnatomyLayer, shouldShow: boolean): void {
  if (!scene) return;
  const current = layer === 'muscles' ? muscleGroup : layer === 'skeleton' ? skeletonGroup : organGroup;
  if (!shouldShow) {
    if (current) releaseAnatomyLayer(layer);
    return;
  }
  if (current) return;
  const group = layer === 'muscles'
    ? createMuscles()
    : layer === 'skeleton' ? createSkeleton() : createOrgans();
  if (layer === 'muscles') muscleGroup = group;
  else if (layer === 'skeleton') skeletonGroup = group;
  else organGroup = group;
  scene.add(group);
}

function createScene(): void {
  if (!container.value) return;
  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07130f);
    scene.fog = new THREE.FogExp2(0x07130f, 0.035);
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 11.5);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    container.value.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 18;
    controls.target.set(0, -0.25, 0);
    controls.addEventListener('change', requestRender);

    scene.add(new THREE.HemisphereLight(0xffead0, 0x1b2b25, 2.15));
    const key = new THREE.DirectionalLight(0xffe1b5, 3.1);
    key.position.set(4, 7, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x59ffc2, 1.7);
    rim.position.set(-5, 2, -6); scene.add(rim);
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x0b211a, roughness: 0.95, transparent: true, opacity: 0.72 }),
    );
    floor.rotation.x = -Math.PI / 2; floor.position.y = -4.28; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(10, 20, 0x265a49, 0x14352b);
    grid.position.y = -4.27; scene.add(grid);

    skinGroup = createSkin();
    meridianGroup = new THREE.Group();
    scene.add(skinGroup, meridianGroup);
    loadBronzeHuman(skinGroup);
    syncVisibility();
    renderer.domElement.addEventListener('pointerdown', handlePointer);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container.value);
    resize();
    animate();
  } catch (error) {
    renderError.value = true;
    console.error('[HumanMeridian3D] 初始化失败', error);
  }
}

function syncVisibility(): void {
  if (skinGroup) skinGroup.visible = props.showSkin;
  syncAnatomyLayer('muscles', props.showMuscles);
  syncAnatomyLayer('skeleton', props.showSkeleton);
  syncAnatomyLayer('organs', props.showOrgans);
  if (meridianGroup) meridianGroup.visible = props.showMeridians;
  updateBronzeMaterial();
  syncActiveFlowParticles(props.selectedId ?? null);
  highlightSelection(props.selectedId ?? null);
  requestRender();
}

function highlightSelection(id: string | null): void {
  if (selectedObject instanceof THREE.Mesh) {
    const selectedMaterial = selectedObject.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
    if ('emissive' in selectedMaterial) selectedMaterial.emissive.setHex(0x000000);
    selectedObject.scale.divideScalar(1.08);
  }
  selectedObject = null;
  const isMeridianSelection = meridians.some(item => item.id === id);
  createMeridianLabels(isMeridianSelection ? id : null);
  syncActiveFlowParticles(isMeridianSelection ? id : null);
  requestRender();
  acupointMarkers.forEach(({ mesh, meridianId, normal }) => {
    const isSelected = meridianId === id;
    mesh.visible = isSelected && isSurfacePointVisible(mesh.position, normal);
    mesh.scale.setScalar(isSelected ? 1.45 : 0.72);
    const pointMaterial = mesh.material as THREE.MeshBasicMaterial;
    pointMaterial.color.setHex(isSelected ? 0xffdf72 : 0x9f251d);
    pointMaterial.opacity = isSelected ? 1 : 0.68;
  });
  meridianLines.forEach(({ mesh, meridianId, color, anchor, normal }) => {
    const isSelected = meridianId === id;
    mesh.visible = isSelected && isSurfacePointVisible(anchor, normal);
    const lineMaterial = mesh.material as THREE.MeshBasicMaterial;
    lineMaterial.color.setHex(isSelected ? 0xffe08a : color);
    lineMaterial.opacity = isSelected ? 0.96 : 0.2;
    mesh.scale.setScalar(1);
  });
  if (!id || isMeridianSelection) return;
  const target = interactiveObjects.find((object) => object.userData.selection?.id === id && object.visible);
  if (!(target instanceof THREE.Mesh)) return;
  selectedObject = target;
  target.scale.multiplyScalar(1.08);
  const selectedMaterial = target.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
  if ('emissive' in selectedMaterial) selectedMaterial.emissive.setHex(0x284d3d);
}

function handlePointer(event: PointerEvent): void {
  if (!renderer || !camera) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const visible = interactiveObjects.filter((object) => object.visible && object.parent?.visible !== false);
  const hit = raycaster.intersectObjects(visible, false)[0]?.object;
  const selection = hit?.userData.selection as Human3DSelection | undefined;
  if (selection) emit('select', selection);
}

function resize(): void {
  if (!container.value || !renderer || !camera) return;
  const width = Math.max(1, container.value.clientWidth);
  const height = Math.max(1, container.value.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  requestRender();
}

function requestRender(): void {
  needsRender = true;
}

function animate(now = performance.now()): void {
  animationFrame = window.requestAnimationFrame(animate);
  if (now - lastRenderedAt < 33) return;
  const shouldAnimateFlow = props.showMeridians && flowingParticles.length > 0;
  const controlsChanged = controls?.update() ?? false;
  if (!needsRender && !shouldAnimateFlow && !controlsChanged) return;
  lastRenderedAt = now;
  if (shouldAnimateFlow) {
    const time = now * 0.00012 * props.flowSpeed;
    flowingParticles.forEach((particle) => {
      const progress = (time + particle.offset) % 1;
      const projection = getCurveSurfaceProjection(particle.curve, progress);
      particle.mesh.position.copy(projection.point);
      particle.mesh.visible = particle.meridianId === props.selectedId
        && projection.isValid !== false
        && isSurfaceNormalFacingCamera(projection.point, projection.normal);
      const pulse = 0.82 + Math.sin((time + particle.offset) * Math.PI * 10) * 0.18;
      particle.mesh.scale.setScalar(pulse);
    });
  }
  acupointMarkers.forEach(({ mesh, meridianId, normal }) => {
    mesh.visible = meridianId === props.selectedId && isSurfacePointVisible(mesh.position, normal);
  });
  meridianLines.forEach(({ mesh, meridianId, anchor, normal }) => {
    mesh.visible = meridianId === props.selectedId && isSurfacePointVisible(anchor, normal);
  });
  updateMeridianLabels();
  if (scene && camera && renderer) renderer.render(scene, camera);
  needsRender = false;
}

function setView(view: 'front' | 'back' | 'left' | 'right'): void {
  if (!camera || !controls) return;
  const positions = {
    front: [0, 0.1, 11.5], back: [0, 0.1, -11.5], left: [-11.5, 0.1, 0], right: [11.5, 0.1, 0],
  } as const;
  const position = positions[view];
  camera.position.set(position[0], position[1], position[2]);
  controls.target.set(0, -0.25, 0);
  controls.update();
  requestRender();
}

function resetView(): void {
  if (!camera || !controls) return;
  camera.position.set(0, 0.2, 11.5);
  controls.target.set(0, -0.25, 0);
  controls.reset();
  requestRender();
}

function disposeObject(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Line)) return;
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((item) => item.dispose());
  });
}

watch(() => [props.showSkin, props.showMuscles, props.showSkeleton, props.showOrgans, props.showMeridians], syncVisibility);
watch(() => props.selectedId, (id) => {
  const selectedId = id ?? null;
  const meridianId = meridians.some(item => item.id === selectedId) ? selectedId : null;
  if (bronzeHuman && meridianId !== renderedMeridianId) rebuildSurfaceMeridians(selectedId);
  else highlightSelection(selectedId);
});
onMounted(createScene);
onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  if (renderer) renderer.domElement.removeEventListener('pointerdown', handlePointer);
  controls?.removeEventListener('change', requestRender);
  controls?.dispose();
  if (scene) disposeObject(scene);
  if (projectionSurface) disposeObject(projectionSurface);
  projectionSurface = undefined;
  renderer?.dispose();
  renderer?.domElement.remove();
  meridianLabels.forEach(({ element }) => element.remove());
  meridianLabels.clear();
  acupointLabels.forEach(({ element }) => element.remove());
  acupointLabels.clear();
  interactiveObjects.length = 0;
  flowingParticles.length = 0;
  meridianLines.length = 0;
  acupointMarkers.length = 0;
});

defineExpose({ setView, resetView });
</script>

<template>
  <div
    ref="container"
    class="human-viewport"
  >
    <div class="viewport-hint">
      拖动旋转 · 滚轮缩放 · 点击经络查看经穴
    </div>
    <div
      v-if="isModelLoading"
      class="model-status"
    >
      正在加载仿真经络铜人…
    </div>
    <div
      v-else-if="modelLoadError"
      class="model-status warning"
    >
      铜人模型加载失败，当前使用简化备用模型
    </div>
    <div
      v-else-if="surfaceFitError"
      class="model-status warning"
    >
      经络贴肤计算失败，当前使用基础经络位置
    </div>
    <div
      v-if="renderError"
      class="render-error"
    >
      3D 渲染初始化失败，请检查显卡驱动或关闭硬件加速后重试。
    </div>
  </div>
</template>

<style scoped>
.human-viewport {
  position: relative;
  width: 100%;
  height: 720px;
  min-height: 560px;
  overflow: hidden;
  border-radius: 14px;
  background: radial-gradient(circle at 50% 35%, #17372c 0%, #07130f 68%);
}

.human-viewport :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.human-viewport :deep(canvas:active) { cursor: grabbing; }

.human-viewport :deep(.meridian-label) {
  position: absolute;
  z-index: 3;
  max-width: 118px;
  padding: 4px 8px;
  transform: translate(-50%, -50%);
  border: 1px solid color-mix(in srgb, var(--meridian-color) 75%, white);
  border-left: 4px solid var(--meridian-color);
  border-radius: 6px;
  color: #f2fff9;
  background: rgb(3 19 14 / 82%);
  box-shadow: 0 2px 10px rgb(0 0 0 / 34%);
  font-size: 11px;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.human-viewport :deep(.meridian-label:hover),
.human-viewport :deep(.meridian-label.selected) {
  z-index: 4;
  color: #fff;
  background: color-mix(in srgb, var(--meridian-color) 38%, #061710);
  box-shadow: 0 0 14px color-mix(in srgb, var(--meridian-color) 60%, transparent);
  transform: translate(-50%, -50%) scale(1.08);
}

.human-viewport :deep(.acupoint-label) {
  position: absolute;
  z-index: 5;
  padding: 2px 6px;
  transform: translate(8px, -50%);
  border: 1px solid rgb(255 222 114 / 62%);
  border-radius: 5px;
  color: #fff2b4;
  background: rgb(83 28 18 / 88%);
  box-shadow: 0 2px 9px rgb(0 0 0 / 38%);
  font-size: 11px;
  line-height: 1.3;
  white-space: nowrap;
  cursor: pointer;
}

.model-status {
  position: absolute;
  z-index: 6;
  top: 16px;
  left: 50%;
  padding: 7px 13px;
  transform: translateX(-50%);
  border: 1px solid rgb(255 222 114 / 28%);
  border-radius: 999px;
  color: #ffe59a;
  background: rgb(37 25 12 / 76%);
  font-size: 12px;
  pointer-events: none;
  backdrop-filter: blur(8px);
}

.model-status.warning { color: #ffb4ab; }

.viewport-hint {
  position: absolute;
  z-index: 2;
  left: 16px;
  bottom: 14px;
  padding: 7px 12px;
  border: 1px solid rgb(128 226 188 / 18%);
  border-radius: 999px;
  color: rgb(225 255 242 / 70%);
  background: rgb(4 20 15 / 62%);
  font-size: 12px;
  pointer-events: none;
  backdrop-filter: blur(8px);
}

.render-error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #ffb4ab;
  background: #17110f;
}

@media (max-width: 1200px) {
  .human-viewport { height: 620px; }
}
</style>
