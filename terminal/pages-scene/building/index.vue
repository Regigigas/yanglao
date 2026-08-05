<template>
  <view :class="['scene-page', settingsStore.pageClass()]">
    <NavBar title="3D楼栋" show-back>
      <template #right>
        <view class="nav-action" @tap="loadScene">
          <text class="iconfont icon-refresh"></text>
        </view>
      </template>
    </NavBar>

    <view class="scene-toolbar">
      <picker
        class="building-picker"
        :range="buildingNames"
        :value="selectedBuildingIndex"
        :disabled="!scene.buildings.length"
        @change="selectBuilding"
      >
        <view class="picker-value">
          <text class="iconfont icon-location"></text>
          <text class="picker-text">{{ selectedBuilding?.name || '选择楼栋' }}</text>
          <text class="iconfont icon-arrow-down"></text>
        </view>
      </picker>

      <view class="view-modes">
        <button
          v-for="item in viewModes"
          :key="item.key"
          :class="['view-button', { active: activeView === item.key }]"
          @tap="setView(item.key)"
        >{{ item.label }}</button>
      </view>
    </view>

    <!-- #ifdef APP-PLUS -->
    <view
      class="scene-viewport"
      :scene-data="renderScene"
      :change:scene-data="sceneRender.updateScene"
      :view-command="viewCommand"
      :change:view-command="sceneRender.changeView"
    >
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <view class="scene-viewport">
    <!-- #endif -->
      <view v-if="loading" class="scene-state">
        <text class="iconfont icon-loading state-icon loading-icon"></text>
        <text>正在加载楼栋数据</text>
      </view>
      <view v-else-if="errorText" class="scene-state">
        <text class="iconfont icon-unlink state-icon"></text>
        <text>{{ errorText }}</text>
        <button class="retry-button" @tap="loadScene">重新连接</button>
      </view>
      <view v-else-if="!scene.buildings.length" class="scene-state">
        <text class="iconfont icon-bed state-icon"></text>
        <text>暂无楼栋数据</text>
      </view>

      <view v-if="selectedBuilding && !loading && !errorText" class="scene-summary">
        <text>{{ selectedBuilding.floors }}层</text>
        <text>{{ summary.rooms }}间房</text>
        <text>{{ summary.beds }}张床</text>
      </view>

      <view v-if="selectedBed" class="bed-detail">
        <text class="bed-title">{{ selectedBed.roomNo }} · {{ selectedBed.bedNo }}床</text>
        <text :class="['bed-status', selectedBed.status]">{{ statusLabel(selectedBed.status) }}</text>
      </view>

      <view v-if="selectedBuilding && !loading && !errorText" class="status-legend">
        <view><text class="legend-dot available"></text><text>空闲</text></view>
        <view><text class="legend-dot occupied"></text><text>占用</text></view>
        <view><text class="legend-dot maintenance"></text><text>维修</text></view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from '../../components/NavBar.vue'
import { getBuildingScene } from '../../api/chat'
import { normalizeSceneData, sceneBuildingSummary } from '../../utils/scene-model'
import { useSettingsStore } from '../../store/settings'
// #ifdef H5
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// #endif

export default {
  name: 'BuildingScenePage',
  components: { NavBar },
  setup: () => ({ settingsStore: useSettingsStore() }),
  data() {
    return {
      scene: { buildings: [], rooms: [], beds: [] },
      selectedBuildingId: '',
      selectedBed: null,
      loading: false,
      errorText: '',
      activeView: 'perspective',
      viewRevision: 0,
      viewModes: [
        { key: 'perspective', label: '鸟瞰' },
        { key: 'front', label: '正面' },
        { key: 'side', label: '侧面' },
        { key: 'top', label: '俯视' }
      ]
    }
  },
  computed: {
    selectedBuilding() {
      return this.scene.buildings.find((item) => item.id === this.selectedBuildingId) || null
    },
    selectedBuildingIndex() {
      return Math.max(0, this.scene.buildings.findIndex((item) => item.id === this.selectedBuildingId))
    },
    buildingNames() {
      return this.scene.buildings.map((item) => item.name)
    },
    summary() {
      return sceneBuildingSummary(this.scene, this.selectedBuildingId)
    },
    renderScene() {
      if (!this.selectedBuilding) return null
      const rooms = this.scene.rooms.filter((item) => item.buildingId === this.selectedBuildingId)
      const roomIds = new Set(rooms.map((item) => item.id))
      return {
        building: this.selectedBuilding,
        rooms,
        beds: this.scene.beds.filter((item) => roomIds.has(item.roomId))
      }
    },
    viewCommand() {
      return { mode: this.activeView, revision: this.viewRevision }
    }
  },
  onLoad() {
    this.loadScene()
  },
  onReady() {
    // #ifdef H5
    this.$nextTick(() => this.initializeH5Scene())
    // #endif
  },
  mounted() {
    // #ifdef H5
    this.$nextTick(() => this.initializeH5Scene())
    // #endif
  },
  beforeUnmount() {
    // #ifdef H5
    this.destroyH5Scene()
    // #endif
  },
  watch: {
    renderScene: {
      deep: true,
      handler(data) {
        // #ifdef H5
        this.$nextTick(() => this.rebuildH5Scene(data))
        // #endif
      }
    },
    viewCommand(command) {
      // #ifdef H5
      this.setH5View(command.mode)
      // #endif
    }
  },
  methods: {
    async loadScene() {
      this.loading = true
      this.errorText = ''
      this.selectedBed = null
      try {
        const scene = normalizeSceneData(await getBuildingScene())
        this.scene = scene
        if (!scene.buildings.some((item) => item.id === this.selectedBuildingId)) {
          this.selectedBuildingId = scene.buildings[0]?.id || ''
        }
      } catch (error) {
        this.scene = { buildings: [], rooms: [], beds: [] }
        this.selectedBuildingId = ''
        this.errorText = error?.message || '楼栋数据连接失败'
      } finally {
        this.loading = false
      }
    },
    selectBuilding(event) {
      const building = this.scene.buildings[Number(event.detail.value)]
      if (!building) return
      this.selectedBuildingId = building.id
      this.selectedBed = null
    },
    setView(mode) {
      this.activeView = mode
      this.viewRevision += 1
    },
    onBedInspect(bed) {
      this.selectedBed = bed || null
    },
    onRenderError(message) {
      this.errorText = message || '当前设备无法创建3D渲染环境'
    },
    statusLabel(status) {
      return { available: '空闲', occupied: '占用', maintenance: '维修' }[status] || '未知'
    },
    // #ifdef H5
    initializeH5Scene() {
      if (this._h5Scene || !this.$el) return
      const host = document.querySelector('.scene-page .scene-viewport')
      if (!host) return
      try {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf2f5f3)
        scene.fog = new THREE.Fog(0xf2f5f3, 32, 85)
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500)
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: Boolean(window.__YANGLAO_E2E__)
        })
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.shadowMap.enabled = true
        renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;z-index:0;'
        host.appendChild(renderer.domElement)

        scene.add(new THREE.HemisphereLight(0xeef5f1, 0x7b8782, 2.15))
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
        keyLight.position.set(14, 22, 12)
        keyLight.castShadow = true
        scene.add(keyLight)
        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(38, 64),
          new THREE.MeshStandardMaterial({ color: 0xe5eae7, roughness: 1 })
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -0.14
        scene.add(ground)
        const grid = new THREE.GridHelper(48, 48, 0xaebbb5, 0xd5ddd9)
        grid.position.y = -0.05
        scene.add(grid)
        const content = new THREE.Group()
        scene.add(content)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.075
        controls.enablePan = true
        controls.screenSpacePanning = true
        controls.maxPolarAngle = Math.PI * 0.92

        this._h5Scene = { host, scene, camera, renderer, controls, content, frame: 0, resizeObserver: null }
        this._h5Scene.resizeObserver = new ResizeObserver(() => this.resizeH5Scene())
        this._h5Scene.resizeObserver.observe(host)
        this.resizeH5Scene()
        this.rebuildH5Scene(this.renderScene)
        const animate = () => {
          if (!this._h5Scene) return
          this._h5Scene.frame = requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()
      } catch (error) {
        this.onRenderError(error?.message)
      }
    },
    clearH5Content() {
      const content = this._h5Scene?.content
      if (!content) return
      content.traverse((object) => {
        object.geometry?.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.filter(Boolean).forEach((material) => material.dispose())
      })
      content.clear()
    },
    rebuildH5Scene(data) {
      if (!this._h5Scene) return
      this.clearH5Content()
      if (!data?.building) return
      const { content } = this._h5Scene
      const rooms = data.rooms || []
      const beds = data.beds || []
      const floors = Array.from(new Set([
        ...Array.from({ length: Math.max(1, data.building.floors) }, (_, index) => index + 1),
        ...rooms.map((room) => room.floor)
      ])).sort((left, right) => left - right)
      const maxRooms = Math.max(1, ...floors.map((floor) => rooms.filter((room) => room.floor === floor).length))
      const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(maxRooms))))
      const roomRows = Math.max(1, Math.ceil(maxRooms / columns))
      const roomWidth = 3.2
      const roomDepth = 2.8
      const gap = 0.38
      const floorHeight = 2.65
      const modelWidth = columns * (roomWidth + gap) + 0.7
      const modelDepth = roomRows * (roomDepth + gap) + 0.7
      const bedColors = { available: 0x55a276, occupied: 0xd5a041, maintenance: 0xc55d53, unknown: 0x83918b }

      floors.forEach((floor, floorIndex) => {
        const floorY = floorIndex * floorHeight
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(modelWidth, 0.16, modelDepth),
          new THREE.MeshStandardMaterial({ color: 0xd9dfdc, roughness: 0.9 })
        )
        slab.position.y = floorY
        content.add(slab)
        rooms.filter((room) => room.floor === floor).forEach((room, roomIndex) => {
          const roomX = ((roomIndex % columns) - (columns - 1) / 2) * (roomWidth + gap)
          const roomZ = (Math.floor(roomIndex / columns) - (roomRows - 1) / 2) * (roomDepth + gap)
          const outline = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(roomWidth, 1.75, roomDepth)),
            new THREE.LineBasicMaterial({ color: 0x73827c, transparent: true, opacity: 0.72 })
          )
          outline.position.set(roomX, floorY + 1, roomZ)
          content.add(outline)
          beds.filter((bed) => bed.roomId === room.id).forEach((bed, bedIndex) => {
            const x = roomX + ((bedIndex % 3) - 1) * 0.92
            const z = roomZ + (Math.floor(bedIndex / 3) - 0.5) * 1.15
            const base = new THREE.Mesh(
              new THREE.BoxGeometry(0.72, 0.14, 1.45),
              new THREE.MeshStandardMaterial({ color: 0x596661, roughness: 0.8 })
            )
            base.position.set(x, floorY + 0.31, z)
            content.add(base)
            const mattress = new THREE.Mesh(
              new THREE.BoxGeometry(0.66, 0.18, 1.22),
              new THREE.MeshStandardMaterial({ color: bedColors[bed.status] || bedColors.unknown, roughness: 0.72 })
            )
            mattress.position.set(x, floorY + 0.46, z - 0.04)
            content.add(mattress)
          })
        })
      })
      this.setH5View(this.activeView)
    },
    setH5View(mode) {
      if (!this._h5Scene?.content.children.length) return
      const { camera, controls, content } = this._h5Scene
      const bounds = new THREE.Box3().setFromObject(content)
      if (bounds.isEmpty()) return
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      const distance = Math.max(size.x, size.y, size.z) * 1.55 + 3
      const positions = {
        perspective: new THREE.Vector3(distance, distance * 0.7, distance),
        front: new THREE.Vector3(0, size.y * 0.2, distance),
        side: new THREE.Vector3(distance, size.y * 0.2, 0),
        top: new THREE.Vector3(0, distance, 0.001)
      }
      camera.up.set(0, mode === 'top' ? 0 : 1, mode === 'top' ? -1 : 0)
      camera.position.copy(center).add(positions[mode] || positions.perspective)
      camera.near = Math.max(0.1, distance / 100)
      camera.far = distance * 12
      camera.updateProjectionMatrix()
      controls.target.copy(center)
      controls.minDistance = Math.max(2, distance * 0.18)
      controls.maxDistance = distance * 3
      controls.update()
    },
    resizeH5Scene() {
      if (!this._h5Scene) return
      const { host, camera, renderer } = this._h5Scene
      const width = Math.max(1, host.clientWidth)
      const height = Math.max(1, host.clientHeight)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    },
    destroyH5Scene() {
      if (!this._h5Scene) return
      const viewer = this._h5Scene
      cancelAnimationFrame(viewer.frame)
      viewer.resizeObserver?.disconnect()
      viewer.controls.dispose()
      this.clearH5Content()
      viewer.scene.traverse((object) => {
        object.geometry?.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.filter(Boolean).forEach((material) => material.dispose())
      })
      viewer.renderer.dispose()
      viewer.renderer.forceContextLoss()
      viewer.renderer.domElement.remove()
      this._h5Scene = null
    }
    // #endif
  }
}
</script>

<!-- #ifdef APP-PLUS -->
<script module="sceneRender" lang="renderjs">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const BED_COLORS = { available: 0x55a276, occupied: 0xd5a041, maintenance: 0xc55d53, unknown: 0x83918b }

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      content: null,
      resizeObserver: null,
      frame: 0,
      currentData: null,
      currentView: 'perspective',
      pointerStart: null,
      disposed: false
    }
  },
  mounted() {
    this.initialize()
  },
  beforeUnmount() {
    this.destroy()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    initialize() {
      if (this.renderer || !this.$el) return
      try {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xf2f5f3)
        this.scene.fog = new THREE.Fog(0xf2f5f3, 32, 85)
        this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500)
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: Boolean(window.__YANGLAO_E2E__)
        })
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        const canvas = this.renderer.domElement
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;z-index:0;'
        canvas.addEventListener('pointerdown', this.onPointerDown)
        canvas.addEventListener('pointerup', this.onPointerUp)
        this.$el.appendChild(canvas)

        this.scene.add(new THREE.HemisphereLight(0xeef5f1, 0x7b8782, 2.15))
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
        keyLight.position.set(14, 22, 12)
        keyLight.castShadow = true
        keyLight.shadow.mapSize.set(1024, 1024)
        this.scene.add(keyLight)
        const fillLight = new THREE.DirectionalLight(0xcce0e8, 1.1)
        fillLight.position.set(-12, 8, -10)
        this.scene.add(fillLight)

        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(38, 64),
          new THREE.MeshStandardMaterial({ color: 0xe5eae7, roughness: 1 })
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -0.14
        ground.receiveShadow = true
        this.scene.add(ground)
        const grid = new THREE.GridHelper(48, 48, 0xaebbb5, 0xd5ddd9)
        grid.position.y = -0.05
        this.scene.add(grid)

        this.content = new THREE.Group()
        this.scene.add(this.content)
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.075
        this.controls.enablePan = true
        this.controls.screenSpacePanning = true
        this.controls.maxPolarAngle = Math.PI * 0.92
        this.resizeObserver = new ResizeObserver(this.resize)
        this.resizeObserver.observe(this.$el)
        this.resize()
        if (this.currentData) this.rebuild(this.currentData)
        this.animate()
      } catch (error) {
        this.ownerInstance.callMethod('onRenderError', error?.message || '当前设备无法创建3D渲染环境')
      }
    },
    updateScene(data) {
      this.currentData = data
      if (this.content) this.rebuild(data)
    },
    changeView(command) {
      if (!command?.mode) return
      this.currentView = command.mode
      this.setView(command.mode)
    },
    createLabel(text, color = '#31443d', width = 320) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = 80
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = 'rgba(255,255,255,0.92)'
        context.fillRect(4, 6, width - 8, 68)
        context.fillStyle = color
        context.font = '600 28px Microsoft YaHei, sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(String(text).slice(0, 16), width / 2, 40)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }))
      sprite.renderOrder = 10
      return sprite
    },
    disposeMaterial(material) {
      material.map?.dispose()
      material.dispose()
    },
    disposeObject(root) {
      root?.traverse((object) => {
        object.geometry?.dispose()
        if (Array.isArray(object.material)) object.material.forEach(this.disposeMaterial)
        else if (object.material) this.disposeMaterial(object.material)
      })
    },
    clearContent() {
      if (!this.content) return
      this.disposeObject(this.content)
      this.content.clear()
    },
    roomColor(room, beds) {
      if (room.status === 'maintenance' || beds.some((bed) => bed.status === 'maintenance')) return 0xc45f55
      if (beds.some((bed) => bed.status === 'occupied')) return 0xd39b3e
      return 0x4f8a67
    },
    addBed(parent, bed, roomNo, x, y, z) {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.14, 1.45),
        new THREE.MeshStandardMaterial({ color: 0x596661, roughness: 0.8 })
      )
      base.position.set(x, y, z)
      base.castShadow = true
      parent.add(base)
      const mattress = new THREE.Mesh(
        new THREE.BoxGeometry(0.66, 0.18, 1.22),
        new THREE.MeshStandardMaterial({ color: BED_COLORS[bed.status] || BED_COLORS.unknown, roughness: 0.72 })
      )
      mattress.position.set(x, y + 0.15, z - 0.04)
      mattress.castShadow = true
      mattress.userData.bed = { ...bed, roomNo }
      parent.add(mattress)
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.09, 0.25),
        new THREE.MeshStandardMaterial({ color: 0xf1f3f1, roughness: 0.9 })
      )
      pillow.position.set(x, y + 0.29, z - 0.46)
      parent.add(pillow)
      const label = this.createLabel(bed.bedNo, '#364a42', 180)
      label.scale.set(0.72, 0.32, 1)
      label.position.set(x, y + 0.55, z)
      parent.add(label)
    },
    rebuild(data) {
      this.clearContent()
      if (!data?.building) return
      const rooms = data.rooms || []
      const beds = data.beds || []
      const floors = Array.from(new Set([
        ...Array.from({ length: Math.max(1, data.building.floors) }, (_, index) => index + 1),
        ...rooms.map((room) => room.floor)
      ])).sort((a, b) => a - b)
      const maxRooms = Math.max(1, ...floors.map((floor) => rooms.filter((room) => room.floor === floor).length))
      const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(maxRooms))))
      const rows = Math.max(1, Math.ceil(maxRooms / columns))
      const roomWidth = 3.2
      const roomDepth = 2.8
      const gap = 0.38
      const floorHeight = 2.65
      const modelWidth = columns * (roomWidth + gap) + 0.7
      const modelDepth = rows * (roomDepth + gap) + 0.7

      floors.forEach((floor, floorIndex) => {
        const floorY = floorIndex * floorHeight
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(modelWidth, 0.16, modelDepth),
          new THREE.MeshStandardMaterial({ color: 0xd9dfdc, roughness: 0.9 })
        )
        slab.position.y = floorY
        slab.receiveShadow = true
        this.content.add(slab)
        const floorLabel = this.createLabel(`${floor}F`, '#567166', 180)
        floorLabel.scale.set(0.9, 0.36, 1)
        floorLabel.position.set(-modelWidth / 2 - 0.55, floorY + 0.42, modelDepth / 2)
        this.content.add(floorLabel)

        rooms.filter((room) => room.floor === floor)
          .sort((a, b) => a.roomNo.localeCompare(b.roomNo, 'zh-CN'))
          .forEach((room, roomIndex) => {
            const column = roomIndex % columns
            const row = Math.floor(roomIndex / columns)
            const roomX = (column - (columns - 1) / 2) * (roomWidth + gap)
            const roomZ = (row - (rows - 1) / 2) * (roomDepth + gap)
            const roomBeds = beds.filter((bed) => bed.roomId === room.id)
            const roomFloor = new THREE.Mesh(
              new THREE.BoxGeometry(roomWidth, 0.11, roomDepth),
              new THREE.MeshStandardMaterial({ color: this.roomColor(room, roomBeds), opacity: 0.3, transparent: true, roughness: 0.86 })
            )
            roomFloor.position.set(roomX, floorY + 0.13, roomZ)
            this.content.add(roomFloor)
            const roomOutline = new THREE.LineSegments(
              new THREE.EdgesGeometry(new THREE.BoxGeometry(roomWidth, 1.75, roomDepth)),
              new THREE.LineBasicMaterial({ color: 0x73827c, transparent: true, opacity: 0.7 })
            )
            roomOutline.position.set(roomX, floorY + 1, roomZ)
            this.content.add(roomOutline)
            const roomLabel = this.createLabel(room.roomNo)
            roomLabel.scale.set(1.25, 0.42, 1)
            roomLabel.position.set(roomX, floorY + 1.58, roomZ + roomDepth / 2 + 0.03)
            this.content.add(roomLabel)
            roomBeds.forEach((bed, bedIndex) => {
              this.addBed(
                this.content,
                bed,
                room.roomNo,
                roomX + ((bedIndex % 3) - 1) * 0.92,
                floorY + 0.31,
                roomZ + (Math.floor(bedIndex / 3) - 0.5) * 1.15
              )
            })
          })
      })
      const title = this.createLabel(data.building.name, '#243b32')
      title.scale.set(3.2, 0.8, 1)
      title.position.set(0, floors.length * floorHeight + 0.3, 0)
      this.content.add(title)
      this.setView(this.currentView)
    },
    setView(mode) {
      if (!this.camera || !this.controls || !this.content || !this.content.children.length) return
      const bounds = new THREE.Box3().setFromObject(this.content)
      if (bounds.isEmpty()) return
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      const distance = Math.max(size.x, size.y, size.z) * 1.55 + 3
      const positions = {
        perspective: new THREE.Vector3(distance, distance * 0.7, distance),
        front: new THREE.Vector3(0, size.y * 0.2, distance),
        side: new THREE.Vector3(distance, size.y * 0.2, 0),
        top: new THREE.Vector3(0, distance, 0.001)
      }
      this.camera.up.set(0, mode === 'top' ? 0 : 1, mode === 'top' ? -1 : 0)
      this.camera.position.copy(center).add(positions[mode] || positions.perspective)
      this.camera.near = Math.max(0.1, distance / 100)
      this.camera.far = distance * 12
      this.camera.updateProjectionMatrix()
      this.controls.target.copy(center)
      this.controls.minDistance = Math.max(2, distance * 0.18)
      this.controls.maxDistance = distance * 3
      this.controls.update()
    },
    resize() {
      if (!this.$el || !this.camera || !this.renderer) return
      const width = Math.max(1, this.$el.clientWidth)
      const height = Math.max(1, this.$el.clientHeight)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height, false)
    },
    animate() {
      if (this.disposed) return
      this.frame = requestAnimationFrame(this.animate)
      this.controls?.update()
      if (this.scene && this.camera) this.renderer?.render(this.scene, this.camera)
    },
    onPointerDown(event) {
      this.pointerStart = { x: event.clientX, y: event.clientY }
    },
    onPointerUp(event) {
      if (!this.pointerStart || !this.camera || !this.renderer || !this.content) return
      if (Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y) > 8) return
      const rect = this.renderer.domElement.getBoundingClientRect()
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(pointer, this.camera)
      const hit = raycaster.intersectObjects(this.content.children, true).find((item) => item.object.userData.bed)
      this.ownerInstance.callMethod('onBedInspect', hit?.object.userData.bed || null)
    },
    destroy() {
      if (this.disposed) return
      this.disposed = true
      cancelAnimationFrame(this.frame)
      this.resizeObserver?.disconnect()
      this.controls?.dispose()
      const canvas = this.renderer?.domElement
      canvas?.removeEventListener('pointerdown', this.onPointerDown)
      canvas?.removeEventListener('pointerup', this.onPointerUp)
      this.disposeObject(this.scene)
      this.renderer?.renderLists.dispose()
      this.renderer?.dispose()
      this.renderer?.forceContextLoss()
      canvas?.remove()
    }
  }
}
</script>
<!-- #endif -->

<style scoped lang="scss">
.scene-page {
  min-height: 100vh;
  background: var(--bg-page, #f5f7fa);
}

.nav-action {
  padding: 10rpx;
  color: #fff;
  font-size: 38rpx;
}

.scene-toolbar {
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: var(--bg-card, #fff);
  border-bottom: 1px solid var(--border-color, #e4e7ed);
}

.building-picker { min-width: 220rpx; flex: 1; }
.picker-value {
  height: 72rpx;
  padding: 0 18rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: var(--text-primary, #303133);
  background: var(--bg-page, #f5f7fa);
  border: 1px solid var(--border-color, #dcdfe6);
  border-radius: 8rpx;
}
.picker-text { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.view-modes { display: grid; grid-template-columns: repeat(4, minmax(96rpx, 1fr)); gap: 8rpx; }
.view-button {
  width: 100%;
  height: 64rpx;
  margin: 0;
  padding: 0 12rpx;
  line-height: 62rpx;
  color: var(--text-regular, #606266);
  font-size: 24rpx;
  background: var(--bg-page, #f5f7fa);
  border: 1px solid var(--border-color, #dcdfe6);
  border-radius: 6rpx;
}
.view-button::after { border: 0; }
.view-button.active { color: #fff; background: var(--primary-color, #4a90d9); border-color: var(--primary-color, #4a90d9); }

.scene-viewport {
  position: relative;
  height: calc(100vh - 190rpx);
  min-height: 620rpx;
  overflow: hidden;
  background: #f2f5f3;
}

.scene-state {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22rpx;
  color: #64756e;
  background: #f2f5f3;
}
.state-icon { color: #738a80; font-size: 72rpx; }
.loading-icon { animation: rotate 1s linear infinite; }
.retry-button { margin: 8rpx 0 0; padding: 0 36rpx; color: #fff; background: var(--primary-color, #4a90d9); font-size: 26rpx; border-radius: 6rpx; }
.retry-button::after { border: 0; }

.scene-summary, .status-legend, .bed-detail {
  position: absolute;
  z-index: 2;
  color: #40534b;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(104, 124, 115, 0.22);
  border-radius: 8rpx;
  pointer-events: none;
}
.scene-summary { top: 20rpx; left: 20rpx; padding: 12rpx 16rpx; display: flex; gap: 18rpx; font-size: 22rpx; }
.status-legend { right: 20rpx; bottom: 24rpx; padding: 14rpx 18rpx; display: flex; gap: 18rpx; font-size: 22rpx; }
.status-legend view { display: flex; align-items: center; gap: 7rpx; }
.legend-dot { width: 16rpx; height: 16rpx; border-radius: 3rpx; }
.legend-dot.available { background: #55a276; }
.legend-dot.occupied { background: #d5a041; }
.legend-dot.maintenance { background: #c55d53; }
.bed-detail { left: 20rpx; bottom: 24rpx; padding: 14rpx 18rpx; display: flex; align-items: center; gap: 14rpx; }
.bed-title { color: #31443d; font-size: 24rpx; font-weight: 600; }
.bed-status { font-size: 21rpx; }
.bed-status.available { color: #36825a; }
.bed-status.occupied { color: #a86f0f; }
.bed-status.maintenance { color: #b44840; }

@keyframes rotate { to { transform: rotate(360deg); } }

@media (max-width: 700px) {
  .scene-toolbar { align-items: stretch; flex-direction: column; }
  .building-picker { width: 100%; }
  .scene-viewport { height: calc(100vh - 280rpx); min-height: 560rpx; }
  .view-modes { width: 100%; }
  .bed-detail { bottom: 86rpx; }
}
</style>
