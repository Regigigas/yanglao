<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  import type { BedRow, BuildingRow, RoomRow } from '@yanglao/db';
  import { NButton, NButtonGroup, NSelect, NTooltip } from 'naive-ui';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  type ViewMode = 'perspective' | 'front' | 'side' | 'top';

  const props = defineProps<{
    buildings: BuildingRow[];
    rooms: RoomRow[];
    beds: BedRow[];
    modelValue: string | null;
  }>();
  const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>();

  const container = ref<HTMLDivElement | null>(null);
  const renderError = ref(false);
  const activeView = ref<ViewMode>('perspective');
  const viewModes: Array<{ key: ViewMode; label: string; icon: string }> = [
    { key: 'perspective', label: '鸟瞰', icon: 'ion:cube-outline' },
    { key: 'front', label: '正面', icon: 'ion:business-outline' },
    { key: 'side', label: '侧面', icon: 'ion:albums-outline' },
    { key: 'top', label: '俯视', icon: 'ion:grid-outline' },
  ];

  const selectedBuildingId = computed({
    get: () => {
      if (props.modelValue && props.buildings.some((item) => item.id === props.modelValue)) {
        return props.modelValue;
      }
      return props.buildings[0]?.id ?? null;
    },
    set: (value: string | null) => emit('update:modelValue', value),
  });
  const selectedBuilding = computed(() =>
    props.buildings.find((item) => item.id === selectedBuildingId.value),
  );
  const buildingOptions = computed(() =>
    props.buildings.map((item) => ({ label: item.name, value: item.id })),
  );
  const selectedRooms = computed(() =>
    props.rooms.filter((item) => item.building_id === selectedBuildingId.value),
  );
  const selectedBeds = computed(() => {
    const roomIds = new Set(selectedRooms.value.map((item) => item.id));
    return props.beds.filter((item) => roomIds.has(item.room_id));
  });

  let scene: THREE.Scene | undefined;
  let camera: THREE.PerspectiveCamera | undefined;
  let renderer: THREE.WebGLRenderer | undefined;
  let controls: OrbitControls | undefined;
  let contentGroup: THREE.Group | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let animationFrame = 0;

  function disposeMaterial(material: THREE.Material): void {
    const textured = material as THREE.Material & { map?: THREE.Texture | null };
    textured.map?.dispose();
    material.dispose();
  }

  function clearContent(): void {
    if (!contentGroup) return;
    contentGroup.traverse((object) => {
      const drawable = object as THREE.Mesh | THREE.LineSegments | THREE.Sprite;
      drawable.geometry?.dispose();
      if (!drawable.material) return;
      if (Array.isArray(drawable.material)) drawable.material.forEach(disposeMaterial);
      else disposeMaterial(drawable.material);
    });
    contentGroup.clear();
  }

  function disposeScene(): void {
    scene?.traverse((object) => {
      const drawable = object as THREE.Mesh | THREE.LineSegments | THREE.Sprite;
      drawable.geometry?.dispose();
      if (Array.isArray(drawable.material)) drawable.material.forEach(disposeMaterial);
      else if (drawable.material) disposeMaterial(drawable.material);
      const light = object as THREE.DirectionalLight;
      light.shadow?.map?.dispose();
      light.shadow?.mapPass?.dispose();
    });
  }

  function labelSprite(text: string, color = '#31443d'): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(255, 255, 255, 0.92)';
      context.roundRect(4, 8, 376, 80, 12);
      context.fill();
      context.fillStyle = color;
      context.font = '600 34px "Microsoft YaHei", sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text.slice(0, 18), 192, 49);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.6, 0.65, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  function roomColor(room: RoomRow, roomBeds: BedRow[]): number {
    if (room.status === 'maintenance' || roomBeds.some((bed) => bed.status === 'maintenance')) {
      return 0xc45f55;
    }
    if (roomBeds.some((bed) => bed.status === 'occupied')) return 0xd39b3e;
    return 0x4f8a67;
  }

  function addBed(parent: THREE.Group, bed: BedRow, x: number, y: number, z: number): void {
    const colors: Record<string, number> = {
      available: 0x55a276,
      occupied: 0xd5a041,
      maintenance: 0xc55d53,
    };
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.14, 1.45),
      new THREE.MeshStandardMaterial({ color: 0x596661, roughness: 0.8 }),
    );
    base.position.set(x, y, z);
    base.castShadow = true;
    parent.add(base);

    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.18, 1.22),
      new THREE.MeshStandardMaterial({
        color: colors[bed.status] ?? 0x83918b,
        roughness: 0.72,
      }),
    );
    mattress.position.set(x, y + 0.15, z - 0.04);
    mattress.castShadow = true;
    parent.add(mattress);

    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.09, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf1f3f1, roughness: 0.9 }),
    );
    pillow.position.set(x, y + 0.29, z - 0.46);
    parent.add(pillow);
  }

  function rebuildModel(): void {
    if (!contentGroup) return;
    clearContent();
    const building = selectedBuilding.value;
    if (!building) return;

    const rooms = selectedRooms.value;
    const floorNumbers = Array.from(
      new Set([
        ...Array.from({ length: Math.max(1, building.floors) }, (_, index) => index + 1),
        ...rooms.map((room) => room.floor),
      ]),
    ).sort((left, right) => left - right);
    const maxRooms = Math.max(
      1,
      ...floorNumbers.map((floor) => rooms.filter((room) => room.floor === floor).length),
    );
    const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(maxRooms))));
    const rows = Math.max(1, Math.ceil(maxRooms / columns));
    const roomWidth = 3.2;
    const roomDepth = 2.8;
    const gap = 0.38;
    const floorHeight = 2.65;
    const modelWidth = columns * (roomWidth + gap) + 0.7;
    const modelDepth = rows * (roomDepth + gap) + 0.7;

    floorNumbers.forEach((floor, floorIndex) => {
      const floorY = floorIndex * floorHeight;
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(modelWidth, 0.16, modelDepth),
        new THREE.MeshStandardMaterial({ color: 0xd9dfdc, roughness: 0.9 }),
      );
      slab.position.y = floorY;
      slab.receiveShadow = true;
      contentGroup?.add(slab);

      const floorLabel = labelSprite(`${floor}F`, '#567166');
      floorLabel.scale.set(1.25, 0.32, 1);
      floorLabel.position.set(-modelWidth / 2 - 0.55, floorY + 0.42, modelDepth / 2);
      contentGroup?.add(floorLabel);

      const floorRooms = rooms
        .filter((room) => room.floor === floor)
        .sort((left, right) => left.room_no.localeCompare(right.room_no, 'zh-CN'));
      floorRooms.forEach((room, roomIndex) => {
        const column = roomIndex % columns;
        const row = Math.floor(roomIndex / columns);
        const roomX = (column - (columns - 1) / 2) * (roomWidth + gap);
        const roomZ = (row - (rows - 1) / 2) * (roomDepth + gap);
        const roomBeds = props.beds.filter((bed) => bed.room_id === room.id);
        const roomFloor = new THREE.Mesh(
          new THREE.BoxGeometry(roomWidth, 0.11, roomDepth),
          new THREE.MeshStandardMaterial({
            color: roomColor(room, roomBeds),
            opacity: 0.3,
            transparent: true,
            roughness: 0.86,
          }),
        );
        roomFloor.position.set(roomX, floorY + 0.13, roomZ);
        contentGroup?.add(roomFloor);

        const roomOutline = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(roomWidth, 1.75, roomDepth)),
          new THREE.LineBasicMaterial({ color: 0x73827c, transparent: true, opacity: 0.7 }),
        );
        roomOutline.position.set(roomX, floorY + 1, roomZ);
        contentGroup?.add(roomOutline);

        const roomLabel = labelSprite(room.room_no);
        roomLabel.scale.set(1.45, 0.36, 1);
        roomLabel.position.set(roomX, floorY + 1.58, roomZ + roomDepth / 2 + 0.03);
        contentGroup?.add(roomLabel);

        roomBeds.forEach((bed, bedIndex) => {
          const bedColumn = bedIndex % 3;
          const bedRow = Math.floor(bedIndex / 3);
          addBed(
            contentGroup!,
            bed,
            roomX + (bedColumn - 1) * 0.92,
            floorY + 0.31,
            roomZ + (bedRow - 0.5) * 1.15,
          );
        });
      });
    });

    const title = labelSprite(building.name, '#243b32');
    title.scale.set(3.7, 0.92, 1);
    title.position.set(0, floorNumbers.length * floorHeight + 0.3, 0);
    contentGroup.add(title);
    setView(activeView.value);
  }

  function setView(mode: ViewMode): void {
    if (!camera || !controls || !contentGroup) return;
    activeView.value = mode;
    const bounds = new THREE.Box3().setFromObject(contentGroup);
    if (bounds.isEmpty()) return;
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const distance = Math.max(size.x, size.y, size.z) * 1.55 + 3;
    const positions: Record<ViewMode, THREE.Vector3> = {
      perspective: new THREE.Vector3(distance, distance * 0.7, distance),
      front: new THREE.Vector3(0, size.y * 0.2, distance),
      side: new THREE.Vector3(distance, size.y * 0.2, 0),
      top: new THREE.Vector3(0, distance, 0.001),
    };
    camera.up.set(0, mode === 'top' ? 0 : 1, mode === 'top' ? -1 : 0);
    camera.position.copy(center).add(positions[mode]);
    camera.near = Math.max(0.1, distance / 100);
    camera.far = distance * 12;
    camera.updateProjectionMatrix();
    controls.target.copy(center);
    controls.minDistance = Math.max(2, distance * 0.18);
    controls.maxDistance = distance * 3;
    controls.update();
  }

  function resize(): void {
    if (!container.value || !camera || !renderer) return;
    const width = Math.max(1, container.value.clientWidth);
    const height = Math.max(1, container.value.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function animate(): void {
    animationFrame = requestAnimationFrame(animate);
    controls?.update();
    if (scene && camera) renderer?.render(scene, camera);
  }

  function initialize(): void {
    if (!container.value) return;
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf2f5f3);
      scene.fog = new THREE.Fog(0xf2f5f3, 32, 85);
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.touchAction = 'none';
      renderer.domElement.setAttribute('aria-label', '楼栋房间与床位三维视图');
      container.value.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xeef5f1, 0x7b8782, 2.15));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(14, 22, 12);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xcce0e8, 1.1);
      fillLight.position.set(-12, 8, -10);
      scene.add(fillLight);

      const ground = new THREE.Mesh(
        new THREE.CircleGeometry(38, 64),
        new THREE.MeshStandardMaterial({ color: 0xe5eae7, roughness: 1 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.14;
      ground.receiveShadow = true;
      scene.add(ground);
      const grid = new THREE.GridHelper(48, 48, 0xaebbb5, 0xd5ddd9);
      grid.position.y = -0.05;
      scene.add(grid);

      contentGroup = new THREE.Group();
      scene.add(contentGroup);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.enablePan = true;
      controls.screenSpacePanning = true;
      controls.maxPolarAngle = Math.PI * 0.92;
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container.value);
      resize();
      rebuildModel();
      animate();
    } catch (error) {
      console.error('初始化 Three.js 楼栋视图失败:', error);
      renderError.value = true;
    }
  }

  watch(
    [() => props.buildings, () => props.rooms, () => props.beds, selectedBuildingId],
    () => {
      void nextTick(rebuildModel);
    },
    { deep: true },
  );

  onMounted(initialize);
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    controls?.dispose();
    clearContent();
    disposeScene();
    renderer?.renderLists.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    scene = undefined;
    camera = undefined;
    renderer = undefined;
    controls = undefined;
    contentGroup = undefined;
  });
</script>

<template>
  <div class="viewer-shell">
    <div class="viewer-toolbar">
      <NSelect
        v-model:value="selectedBuildingId"
        :options="buildingOptions"
        placeholder="选择楼栋"
        class="building-select"
      />
      <NButtonGroup class="view-modes">
        <NTooltip v-for="view in viewModes" :key="view.key">
          <template #trigger>
            <NButton
              :type="activeView === view.key ? 'primary' : 'default'"
              :secondary="activeView === view.key"
              :aria-label="`${view.label}视角`"
              @click="setView(view.key)"
            >
              <template #icon><Icon :icon="view.icon" /></template>
              {{ view.label }}
            </NButton>
          </template>
          切换到{{ view.label }}视角
        </NTooltip>
      </NButtonGroup>
    </div>

    <div ref="container" class="three-viewport">
      <div v-if="!selectedBuilding" class="viewer-state">暂无楼栋数据</div>
      <div v-else-if="renderError" class="viewer-state">当前设备无法创建 3D 渲染环境</div>
      <div v-if="selectedBuilding" class="viewer-summary">
        <span>{{ selectedBuilding.floors }} 层</span>
        <span>{{ selectedRooms.length }} 间房</span>
        <span>{{ selectedBeds.length }} 张床</span>
      </div>
      <div class="status-legend" aria-label="床位状态图例">
        <span class="available">空闲</span>
        <span class="occupied">占用</span>
        <span class="maintenance">维修</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .viewer-shell {
    overflow: hidden;
    border: 1px solid var(--n-border-color);
    border-radius: 6px;
    background: #f2f5f3;
  }

  .viewer-toolbar {
    min-height: 56px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--n-border-color);
    background: var(--n-color);
  }

  .building-select {
    width: 210px;
  }

  .three-viewport {
    position: relative;
    width: 100%;
    height: 460px;
    min-height: 340px;
  }

  .three-viewport :deep(canvas) {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  .three-viewport :deep(canvas:active) {
    cursor: grabbing;
  }

  .viewer-state {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-items: center;
    color: #6e7e77;
    background: #f2f5f3;
  }

  .viewer-summary,
  .status-legend {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #4f6259;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(104, 124, 115, 0.2);
    border-radius: 6px;
    pointer-events: none;
  }

  .viewer-summary {
    top: 12px;
    left: 12px;
    padding: 7px 10px;
  }

  .viewer-summary span + span {
    padding-left: 12px;
    border-left: 1px solid #d6dfda;
  }

  .status-legend {
    right: 12px;
    bottom: 12px;
    padding: 8px 11px;
  }

  .status-legend span::before {
    width: 8px;
    height: 8px;
    margin-right: 5px;
    display: inline-block;
    border-radius: 2px;
    content: '';
  }

  .status-legend .available::before { background: #55a276; }
  .status-legend .occupied::before { background: #d5a041; }
  .status-legend .maintenance::before { background: #c55d53; }

  @media (max-width: 760px) {
    .viewer-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .building-select {
      width: 100%;
    }

    .view-modes {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .view-modes .n-button {
      padding: 0 7px;
    }

    .three-viewport {
      height: 360px;
    }
  }
</style>
