<script setup lang="ts">
  import type { BedRow, BuildingRow, CorridorRow, RoomRow } from '@yanglao/db';
  import {
    BuildingOne,
    Cube,
    Help,
    Move,
    Redo,
    Rotate,
    TopBar,
    ViewGridCard,
    ZoomIn,
  } from '@icon-park/vue-next';
  import { NButton, NButtonGroup, NSelect, NTooltip } from 'naive-ui';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import type { Component } from 'vue';

  type ViewMode = 'perspective' | 'front' | 'side' | 'top';
  type ControlMode = 'pan' | 'rotate' | 'zoom';

  const props = defineProps<{
    buildings: BuildingRow[];
    corridors?: CorridorRow[];
    rooms: RoomRow[];
    beds: BedRow[];
    modelValue: string | null;
  }>();
  const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>();

  const container = ref<HTMLDivElement | null>(null);
  const renderError = ref(false);
  const activeView = ref<ViewMode>('perspective');
  const activeControl = ref<ControlMode>('rotate');
  const pointerInside = ref(false);
  const iconProps = { theme: 'outline', size: 16, strokeWidth: 3 } as const;
  const viewModes: Array<{ key: ViewMode; label: string; icon: Component }> = [
    { key: 'perspective', label: '鸟瞰', icon: Cube },
    { key: 'front', label: '正面', icon: BuildingOne },
    { key: 'side', label: '侧面', icon: ViewGridCard },
    { key: 'top', label: '俯视', icon: TopBar },
  ];
  const controlModes: Array<{ key: ControlMode; label: string; icon: Component; hint: string }> = [
    { key: 'rotate', label: '旋转', icon: Rotate, hint: '默认模式：左键上下左右拖动旋转视角。快捷键 R。' },
    { key: 'pan', label: '移动', icon: Move, hint: '移动模式：左键拖动画面上下左右平移。快捷键 M。' },
    { key: 'zoom', label: '缩放', icon: ZoomIn, hint: '缩放模式：左键上下拖动或滚轮放大缩小。快捷键 Z。' },
  ];
  const activeControlHint = computed(() =>
    controlModes.find((item) => item.key === activeControl.value)?.hint ?? '',
  );
  const activeControlLabel = computed(() =>
    controlModes.find((item) => item.key === activeControl.value)?.label ?? '',
  );

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
  const selectedCorridors = computed(() =>
    (props.corridors ?? []).filter((item) => item.building_id === selectedBuildingId.value),
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
  const preventContextMenu = (event: Event): void => event.preventDefault();

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

  function roomSort(left: RoomRow, right: RoomRow): number {
    return (left.sort_order ?? 0) - (right.sort_order ?? 0)
      || left.room_no.localeCompare(right.room_no, 'zh-CN');
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
    const roomWidth = 3.2;
    const roomDepth = 2.8;
    const gap = 0.38;
    const corridorGap = 1.08;
    const floorHeight = 2.65;

    const floorLayouts = floorNumbers.map((floor) => {
      const floorRooms = rooms.filter((room) => room.floor === floor);
      const usedCorridorIds = new Set(floorRooms.map((room) => room.corridor_id).filter(Boolean));
      const corridors = [
        ...selectedCorridors.value.filter((corridor) => corridor.floor === floor && usedCorridorIds.has(corridor.id)),
        ...(floorRooms.some((room) => !room.corridor_id)
          ? [{
              id: '__none__',
              building_id: building.id,
              floor,
              name: '未分区',
              direction: 'east_west' as const,
              sort_order: 9999,
              remark: null,
              created_at: 0,
              updated_at: 0,
              deleted_at: null,
            }]
          : []),
      ].sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name, 'zh-CN'));
      return { floor, corridors, rooms: floorRooms };
    });

    const maxRoomsPerSide = Math.max(
      1,
      ...floorLayouts.flatMap((layout) => layout.corridors.map((corridor) => {
        const corridorRooms = layout.rooms.filter((room) => corridor.id === '__none__' ? !room.corridor_id : room.corridor_id === corridor.id);
        const leftCount = corridorRooms.filter((room) => room.layout_side === 'left').length;
        const rightCount = corridorRooms.filter((room) => room.layout_side === 'right').length;
        const noneCount = corridorRooms.filter((room) => room.layout_side === 'none').length;
        return Math.max(leftCount, rightCount, Math.ceil(noneCount / 2));
      })),
    );
    const maxCorridors = Math.max(1, ...floorLayouts.map((layout) => Math.max(1, layout.corridors.length)));
    const modelWidth = maxRoomsPerSide * (roomWidth + gap) + 0.9;
    const modelDepth = maxCorridors * (roomDepth * 2 + corridorGap + gap) + 0.9;

    floorLayouts.forEach(({ floor, corridors, rooms: floorRooms }, floorIndex) => {
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

      corridors.forEach((corridor, corridorIndex) => {
        const corridorZ = (corridorIndex - (corridors.length - 1) / 2) * (roomDepth * 2 + corridorGap + gap);
        const corridorStrip = new THREE.Mesh(
          new THREE.BoxGeometry(modelWidth - 0.45, 0.06, corridorGap),
          new THREE.MeshStandardMaterial({ color: 0xb7c5be, roughness: 0.92 }),
        );
        corridorStrip.position.set(0, floorY + 0.21, corridorZ);
        contentGroup?.add(corridorStrip);

        const corridorLabel = labelSprite(corridor.name, '#52665d');
        corridorLabel.scale.set(1.3, 0.32, 1);
        corridorLabel.position.set(-modelWidth / 2 + 0.72, floorY + 0.45, corridorZ);
        contentGroup?.add(corridorLabel);

        const corridorRooms = floorRooms
          .filter((room) => corridor.id === '__none__' ? !room.corridor_id : room.corridor_id === corridor.id)
          .sort(roomSort);
        const sideCounts: Record<'left' | 'right', number> = { left: 0, right: 0 };

        corridorRooms.forEach((room, roomIndex) => {
          const side = room.layout_side === 'none'
            ? (roomIndex % 2 === 0 ? 'left' : 'right')
            : room.layout_side;
          const sideIndex = sideCounts[side];
          sideCounts[side] += 1;
          const roomX = (sideIndex - (maxRoomsPerSide - 1) / 2) * (roomWidth + gap);
          const roomZ = corridorZ + (side === 'left' ? -1 : 1) * (roomDepth / 2 + corridorGap / 2);
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

  function applyControlMode(mode: ControlMode): void {
    activeControl.value = mode;
    if (!controls) return;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.mouseButtons = {
      LEFT: mode === 'pan'
        ? THREE.MOUSE.PAN
        : mode === 'zoom'
          ? THREE.MOUSE.DOLLY
          : THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: mode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
    };
    controls.touches = {
      ONE: mode === 'pan'
        ? THREE.TOUCH.PAN
        : mode === 'zoom'
          ? THREE.TOUCH.DOLLY_PAN
          : THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    };
    controls.update();
  }

  function resetView(): void {
    setView(activeView.value);
  }

  function handleKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '') || target?.isContentEditable;
    if (isTyping || (!pointerInside.value && document.activeElement !== container.value)) return;
    const key = event.key.toLowerCase();
    if (key === 'r') applyControlMode('rotate');
    else if (key === 'm') applyControlMode('pan');
    else if (key === 'z') applyControlMode('zoom');
    else if (key === '0') resetView();
    else if (key === '1') setView('perspective');
    else if (key === '2') setView('front');
    else if (key === '3') setView('side');
    else if (key === '4') setView('top');
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
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.panSpeed = 1.15;
      controls.screenSpacePanning = true;
      controls.maxPolarAngle = Math.PI * 0.92;
      applyControlMode(activeControl.value);
      renderer.domElement.addEventListener('contextmenu', preventContextMenu);
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
    [() => props.buildings, () => props.corridors, () => props.rooms, () => props.beds, selectedBuildingId],
    () => {
      void nextTick(rebuildModel);
    },
    { deep: true },
  );

  onMounted(() => {
    initialize();
    window.addEventListener('keydown', handleKeydown);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();
    controls?.dispose();
    renderer?.domElement.removeEventListener('contextmenu', preventContextMenu);
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
      <div class="toolbar-groups">
        <div class="operation-tools">
          <span class="toolbar-label">操作</span>
          <NButtonGroup class="tool-modes">
            <NTooltip v-for="tool in controlModes" :key="tool.key">
              <template #trigger>
                <NButton
                  :type="activeControl === tool.key ? 'primary' : 'default'"
                  :secondary="activeControl === tool.key"
                  :aria-label="`${tool.label}操作说明`"
                  @click="applyControlMode(tool.key)"
                >
                  <template #icon><component :is="tool.icon" v-bind="iconProps" /></template>
                  {{ tool.label }}
              </NButton>
            </template>
            {{ tool.hint }}
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton aria-label="查看操作说明">
                <template #icon><Help v-bind="iconProps" /></template>
                ?
              </NButton>
            </template>
            <div class="help-tooltip">
              <div><strong>鼠标</strong></div>
              <div>旋转：默认左键拖动</div>
              <div>移动：点击“移动”后左键拖动，或旋转模式下右键拖动</div>
              <div>缩放：滚轮，或点击“缩放”后上下拖动</div>
              <div class="help-gap"><strong>键盘</strong></div>
              <div>R 旋转，M 移动，Z 缩放，0 复位</div>
              <div>1 鸟瞰，2 正面，3 侧面，4 俯视</div>
            </div>
          </NTooltip>
        </NButtonGroup>
        <div class="current-operation-hint" aria-live="polite">
          <strong>{{ activeControlLabel }}</strong>
          <span>{{ activeControlHint }}</span>
          <span>R 旋转 / M 移动 / Z 缩放 / 0 复位</span>
        </div>
      </div>
        <NButtonGroup class="view-modes">
          <NTooltip v-for="view in viewModes" :key="view.key">
            <template #trigger>
              <NButton
                :type="activeView === view.key ? 'primary' : 'default'"
                :secondary="activeView === view.key"
                :aria-label="`${view.label}视角`"
                @click="setView(view.key)"
              >
                <template #icon><component :is="view.icon" v-bind="iconProps" /></template>
                {{ view.label }}
              </NButton>
            </template>
            切换到{{ view.label }}视角
          </NTooltip>
          <NTooltip>
            <template #trigger>
              <NButton aria-label="复位视图" @click="resetView">
                <template #icon><Redo v-bind="iconProps" /></template>
                复位
              </NButton>
            </template>
            回到当前视角的默认位置
          </NTooltip>
        </NButtonGroup>
      </div>
    </div>

    <div
      ref="container"
      class="three-viewport"
      tabindex="0"
      @mouseenter="pointerInside = true"
      @mouseleave="pointerInside = false"
    >
      <div v-if="!selectedBuilding" class="viewer-state">暂无楼栋数据</div>
      <div v-else-if="renderError" class="viewer-state">当前设备无法创建 3D 渲染环境</div>
      <div v-if="selectedBuilding" class="viewer-summary">
        <span>{{ selectedBuilding.floors }} 层</span>
        <span>{{ selectedCorridors.length }} 个分区</span>
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
    display: grid;
    grid-template-columns: 210px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--n-border-color);
    background: var(--n-color);
  }

  .building-select {
    width: 210px;
  }

  .toolbar-groups {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    flex-wrap: wrap;
  }

  .operation-tools {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tool-modes :deep(.n-button__icon),
  .view-modes :deep(.n-button__icon) {
    margin-right: 5px;
  }

  .tool-modes :deep(svg),
  .view-modes :deep(svg) {
    display: block;
    line-height: 1;
  }

  .toolbar-label {
    color: #66756e;
    font-size: 12px;
    white-space: nowrap;
  }

  .help-tooltip {
    line-height: 1.65;
    max-width: 300px;
  }

  .help-gap {
    margin-top: 6px;
  }

  .current-operation-hint {
    max-width: 620px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #61746b;
    font-size: 12px;
    line-height: 1.4;
  }

  .current-operation-hint strong {
    color: #2f5f4b;
    white-space: nowrap;
  }

  .three-viewport {
    position: relative;
    width: 100%;
    height: 460px;
    min-height: 340px;
    outline: none;
  }

  .three-viewport:focus-visible {
    box-shadow: inset 0 0 0 2px rgba(63, 127, 103, 0.42);
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
      grid-template-columns: 1fr;
    }

    .building-select {
      width: 100%;
    }

    .toolbar-groups {
      justify-content: stretch;
    }

    .operation-tools {
      align-items: stretch;
      flex-direction: column;
      gap: 6px;
    }

    .toolbar-label {
      padding-left: 2px;
    }

    .tool-modes,
    .view-modes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(74px, 1fr));
    }

    .tool-modes .n-button,
    .view-modes .n-button {
      padding: 0 7px;
    }

    .three-viewport {
      height: 360px;
    }

    .current-operation-hint {
      align-items: flex-start;
      flex-direction: column;
      gap: 3px;
    }
  }
</style>
