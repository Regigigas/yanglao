import { S as Scene, C as Color, F as Fog, P as PerspectiveCamera, W as WebGLRenderer, a as SRGBColorSpace, b as PCFSoftShadowMap, H as HemisphereLight, D as DirectionalLight, M as Mesh, c as CircleGeometry, d as MeshStandardMaterial, G as GridHelper, e as Group, O as OrbitControls, B as BoxGeometry, L as LineSegments, E as EdgesGeometry, f as LineBasicMaterial, g as Box3, V as Vector3, h as MOUSE, T as TOUCH, i as CanvasTexture, j as SpriteMaterial, k as Sprite } from "./OrbitControls-D8FOeTdb.js";
import { J as NSelect, V as NButtonGroup, w as NTooltip, B as Button } from "./vendor-naive-BtQtGa5j.js";
import { I as IconWrapper } from "./index-DesrUWA3.js";
import { Y as createVNode, l as defineComponent, w as watch, o as onMounted, b as onBeforeUnmount, W as openBlock, a2 as createElementBlock, a4 as createBaseVNode, u as unref, X as withCtx, F as Fragment, a7 as renderList, k as createTextVNode, af as normalizeProps, ag as guardReactiveProps, aa as toDisplayString, a8 as createCommentVNode, r as ref, c as computed, V as createBlock, ae as resolveDynamicComponent, v as mergeProps, n as nextTick } from "./vendor-vue-2vV4mHq_.js";
import { C as Cube } from "./Cube-CzHPzWuQ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const BuildingOne = IconWrapper("building-one", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M11 14L25 4V44H11V14Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M25 13L39 23V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M4 44H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Help = IconWrapper("help", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 28.6248V24.6248C27.3137 24.6248 30 21.9385 30 18.6248C30 15.3111 27.3137 12.6248 24 12.6248C20.6863 12.6248 18 15.3111 18 18.6248",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 37.6248C25.3807 37.6248 26.5 36.5055 26.5 35.1248C26.5 33.7441 25.3807 32.6248 24 32.6248C22.6193 32.6248 21.5 33.7441 21.5 35.1248C21.5 36.5055 22.6193 37.6248 24 37.6248Z",
    "fill": props.colors[2]
  }, null)]);
});
const Move = IconWrapper("move", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M22 43C17.2742 41.2327 13.3325 35.1851 11.3597 31.6428C10.5079 30.1134 10.9566 28.2347 12.3236 27.1411C13.8473 25.9222 16.0438 26.0438 17.4236 27.4236L19 29V17.5C19 16.1193 20.1193 15 21.5 15C22.8807 15 24 16.1193 24 17.5V23.5C24 22.1193 25.1193 21 26.5 21C27.8807 21 29 22.1193 29 23.5V25.5C29 24.1193 30.1193 23 31.5 23C32.8807 23 34 24.1193 34 25.5V27.5C34 26.1193 35.1193 25 36.5 25C37.8807 25 39 26.1193 39 27.5V35.368C39 36.4383 38.7354 37.496 38.1185 38.3707C37.0949 39.8219 35.255 42.0336 33 43C29.5 44.5 26.3701 44.6343 22 43Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M10 8L32 8",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M14.0003 12L10 8L14 4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M28 4L32 8L28 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Redo = IconWrapper("redo", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M36.7279 36.7279C33.4706 39.9853 28.9706 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C28.9706 6 33.4706 8.01472 36.7279 11.2721C38.3859 12.9301 42 17 42 17",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M42 8V17H33",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Rotate = IconWrapper("rotate", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M12 24H42V42H12V24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M6 8V17H15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M38.4747 13.2985C35.1956 8.87049 29.933 6 24 6C18.1788 6 13.0029 8.76334 9.71272 13.0498L6 17",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const TopBar = IconWrapper("top-bar", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("rect", {
    "x": "6",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M6 16H42",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M6 13V19",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M42 13V19",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const ViewGridCard = IconWrapper("view-grid-card", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("rect", {
    "x": "6",
    "y": "6",
    "width": "36",
    "height": "36",
    "rx": "3",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("rect", {
    "x": "13",
    "y": "13",
    "width": "8",
    "height": "8",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("rect", {
    "x": "27",
    "y": "13",
    "width": "8",
    "height": "8",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("rect", {
    "x": "13",
    "y": "27",
    "width": "8",
    "height": "8",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("rect", {
    "x": "27",
    "y": "27",
    "width": "8",
    "height": "8",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const ZoomIn = IconWrapper("zoom-in", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M21 15L21 27",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M15.0156 21.0156L27 21",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M33.2216 33.2217L41.7069 41.707",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const _hoisted_1 = { class: "viewer-shell" };
const _hoisted_2 = { class: "viewer-toolbar" };
const _hoisted_3 = { class: "toolbar-groups" };
const _hoisted_4 = { class: "operation-tools" };
const _hoisted_5 = {
  class: "current-operation-hint",
  "aria-live": "polite"
};
const _hoisted_6 = {
  key: 0,
  class: "viewer-state"
};
const _hoisted_7 = {
  key: 1,
  class: "viewer-state"
};
const _hoisted_8 = {
  key: 2,
  class: "viewer-summary"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Building3DViewer",
  props: {
    buildings: {},
    corridors: {},
    rooms: {},
    beds: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const container = ref(null);
    const renderError = ref(false);
    const activeView = ref("perspective");
    const activeControl = ref("rotate");
    const pointerInside = ref(false);
    const iconProps = { theme: "outline", size: 16, strokeWidth: 3 };
    const viewModes = [
      { key: "perspective", label: "鸟瞰", icon: Cube },
      { key: "front", label: "正面", icon: BuildingOne },
      { key: "side", label: "侧面", icon: ViewGridCard },
      { key: "top", label: "俯视", icon: TopBar }
    ];
    const controlModes = [
      { key: "rotate", label: "旋转", icon: Rotate, hint: "默认模式：左键上下左右拖动旋转视角。快捷键 R。" },
      { key: "pan", label: "移动", icon: Move, hint: "移动模式：左键拖动画面上下左右平移。快捷键 M。" },
      { key: "zoom", label: "缩放", icon: ZoomIn, hint: "缩放模式：左键上下拖动或滚轮放大缩小。快捷键 Z。" }
    ];
    const activeControlHint = computed(
      () => controlModes.find((item) => item.key === activeControl.value)?.hint ?? ""
    );
    const activeControlLabel = computed(
      () => controlModes.find((item) => item.key === activeControl.value)?.label ?? ""
    );
    const selectedBuildingId = computed({
      get: () => {
        if (props.modelValue && props.buildings.some((item) => item.id === props.modelValue)) {
          return props.modelValue;
        }
        return props.buildings[0]?.id ?? null;
      },
      set: (value) => emit("update:modelValue", value)
    });
    const selectedBuilding = computed(
      () => props.buildings.find((item) => item.id === selectedBuildingId.value)
    );
    const buildingOptions = computed(
      () => props.buildings.map((item) => ({ label: item.name, value: item.id }))
    );
    const selectedRooms = computed(
      () => props.rooms.filter((item) => item.building_id === selectedBuildingId.value)
    );
    const selectedCorridors = computed(
      () => (props.corridors ?? []).filter((item) => item.building_id === selectedBuildingId.value)
    );
    const selectedBeds = computed(() => {
      const roomIds = new Set(selectedRooms.value.map((item) => item.id));
      return props.beds.filter((item) => roomIds.has(item.room_id));
    });
    let scene;
    let camera;
    let renderer;
    let controls;
    let contentGroup;
    let resizeObserver;
    let animationFrame = 0;
    const preventContextMenu = (event) => event.preventDefault();
    function disposeMaterial(material) {
      const textured = material;
      textured.map?.dispose();
      material.dispose();
    }
    function clearContent() {
      if (!contentGroup) return;
      contentGroup.traverse((object) => {
        const drawable = object;
        drawable.geometry?.dispose();
        if (!drawable.material) return;
        if (Array.isArray(drawable.material)) drawable.material.forEach(disposeMaterial);
        else disposeMaterial(drawable.material);
      });
      contentGroup.clear();
    }
    function disposeScene() {
      scene?.traverse((object) => {
        const drawable = object;
        drawable.geometry?.dispose();
        if (Array.isArray(drawable.material)) drawable.material.forEach(disposeMaterial);
        else if (drawable.material) disposeMaterial(drawable.material);
        const light = object;
        light.shadow?.map?.dispose();
        light.shadow?.mapPass?.dispose();
      });
    }
    function labelSprite(text, color = "#31443d") {
      const canvas = document.createElement("canvas");
      canvas.width = 384;
      canvas.height = 96;
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(255, 255, 255, 0.92)";
        context.roundRect(4, 8, 376, 80, 12);
        context.fill();
        context.fillStyle = color;
        context.font = '600 34px "Microsoft YaHei", sans-serif';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text.slice(0, 18), 192, 49);
      }
      const texture = new CanvasTexture(canvas);
      texture.colorSpace = SRGBColorSpace;
      const material = new SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      });
      const sprite = new Sprite(material);
      sprite.scale.set(2.6, 0.65, 1);
      sprite.renderOrder = 10;
      return sprite;
    }
    function roomColor(room, roomBeds) {
      if (room.status === "maintenance" || roomBeds.some((bed) => bed.status === "maintenance")) {
        return 12869461;
      }
      if (roomBeds.some((bed) => bed.status === "occupied")) return 13867838;
      return 5212775;
    }
    function addBed(parent, bed, x, y, z) {
      const colors = {
        available: 5612150,
        occupied: 14000193,
        maintenance: 12934483
      };
      const base = new Mesh(
        new BoxGeometry(0.72, 0.14, 1.45),
        new MeshStandardMaterial({ color: 5858913, roughness: 0.8 })
      );
      base.position.set(x, y, z);
      base.castShadow = true;
      parent.add(base);
      const mattress = new Mesh(
        new BoxGeometry(0.66, 0.18, 1.22),
        new MeshStandardMaterial({
          color: colors[bed.status] ?? 8622475,
          roughness: 0.72
        })
      );
      mattress.position.set(x, y + 0.15, z - 0.04);
      mattress.castShadow = true;
      parent.add(mattress);
      const pillow = new Mesh(
        new BoxGeometry(0.48, 0.09, 0.25),
        new MeshStandardMaterial({ color: 15856625, roughness: 0.9 })
      );
      pillow.position.set(x, y + 0.29, z - 0.46);
      parent.add(pillow);
    }
    function roomSort(left, right) {
      return (left.sort_order ?? 0) - (right.sort_order ?? 0) || left.room_no.localeCompare(right.room_no, "zh-CN");
    }
    function rebuildModel() {
      if (!contentGroup) return;
      clearContent();
      const building = selectedBuilding.value;
      if (!building) return;
      const rooms = selectedRooms.value;
      const floorNumbers = Array.from(
        /* @__PURE__ */ new Set([
          ...Array.from({ length: Math.max(1, building.floors) }, (_, index) => index + 1),
          ...rooms.map((room) => room.floor)
        ])
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
          ...floorRooms.some((room) => !room.corridor_id) ? [{
            id: "__none__",
            building_id: building.id,
            floor,
            name: "未分区",
            direction: "east_west",
            sort_order: 9999,
            remark: null,
            created_at: 0,
            updated_at: 0,
            deleted_at: null
          }] : []
        ].sort((left, right) => left.sort_order - right.sort_order || left.name.localeCompare(right.name, "zh-CN"));
        return { floor, corridors, rooms: floorRooms };
      });
      const maxRoomsPerSide = Math.max(
        1,
        ...floorLayouts.flatMap((layout) => layout.corridors.map((corridor) => {
          const corridorRooms = layout.rooms.filter((room) => corridor.id === "__none__" ? !room.corridor_id : room.corridor_id === corridor.id);
          const leftCount = corridorRooms.filter((room) => room.layout_side === "left").length;
          const rightCount = corridorRooms.filter((room) => room.layout_side === "right").length;
          const noneCount = corridorRooms.filter((room) => room.layout_side === "none").length;
          return Math.max(leftCount, rightCount, Math.ceil(noneCount / 2));
        }))
      );
      const maxCorridors = Math.max(1, ...floorLayouts.map((layout) => Math.max(1, layout.corridors.length)));
      const modelWidth = maxRoomsPerSide * (roomWidth + gap) + 0.9;
      const modelDepth = maxCorridors * (roomDepth * 2 + corridorGap + gap) + 0.9;
      floorLayouts.forEach(({ floor, corridors, rooms: floorRooms }, floorIndex) => {
        const floorY = floorIndex * floorHeight;
        const slab = new Mesh(
          new BoxGeometry(modelWidth, 0.16, modelDepth),
          new MeshStandardMaterial({ color: 14278620, roughness: 0.9 })
        );
        slab.position.y = floorY;
        slab.receiveShadow = true;
        contentGroup?.add(slab);
        const floorLabel = labelSprite(`${floor}F`, "#567166");
        floorLabel.scale.set(1.25, 0.32, 1);
        floorLabel.position.set(-modelWidth / 2 - 0.55, floorY + 0.42, modelDepth / 2);
        contentGroup?.add(floorLabel);
        corridors.forEach((corridor, corridorIndex) => {
          const corridorZ = (corridorIndex - (corridors.length - 1) / 2) * (roomDepth * 2 + corridorGap + gap);
          const corridorStrip = new Mesh(
            new BoxGeometry(modelWidth - 0.45, 0.06, corridorGap),
            new MeshStandardMaterial({ color: 12043710, roughness: 0.92 })
          );
          corridorStrip.position.set(0, floorY + 0.21, corridorZ);
          contentGroup?.add(corridorStrip);
          const corridorLabel = labelSprite(corridor.name, "#52665d");
          corridorLabel.scale.set(1.3, 0.32, 1);
          corridorLabel.position.set(-modelWidth / 2 + 0.72, floorY + 0.45, corridorZ);
          contentGroup?.add(corridorLabel);
          const corridorRooms = floorRooms.filter((room) => corridor.id === "__none__" ? !room.corridor_id : room.corridor_id === corridor.id).sort(roomSort);
          const sideCounts = { left: 0, right: 0 };
          corridorRooms.forEach((room, roomIndex) => {
            const side = room.layout_side === "none" ? roomIndex % 2 === 0 ? "left" : "right" : room.layout_side;
            const sideIndex = sideCounts[side];
            sideCounts[side] += 1;
            const roomX = (sideIndex - (maxRoomsPerSide - 1) / 2) * (roomWidth + gap);
            const roomZ = corridorZ + (side === "left" ? -1 : 1) * (roomDepth / 2 + corridorGap / 2);
            const roomBeds = props.beds.filter((bed) => bed.room_id === room.id);
            const roomFloor = new Mesh(
              new BoxGeometry(roomWidth, 0.11, roomDepth),
              new MeshStandardMaterial({
                color: roomColor(room, roomBeds),
                opacity: 0.3,
                transparent: true,
                roughness: 0.86
              })
            );
            roomFloor.position.set(roomX, floorY + 0.13, roomZ);
            contentGroup?.add(roomFloor);
            const roomOutline = new LineSegments(
              new EdgesGeometry(new BoxGeometry(roomWidth, 1.75, roomDepth)),
              new LineBasicMaterial({ color: 7570044, transparent: true, opacity: 0.7 })
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
                contentGroup,
                bed,
                roomX + (bedColumn - 1) * 0.92,
                floorY + 0.31,
                roomZ + (bedRow - 0.5) * 1.15
              );
            });
          });
        });
      });
      const title = labelSprite(building.name, "#243b32");
      title.scale.set(3.7, 0.92, 1);
      title.position.set(0, floorNumbers.length * floorHeight + 0.3, 0);
      contentGroup.add(title);
      setView(activeView.value);
    }
    function setView(mode) {
      if (!camera || !controls || !contentGroup) return;
      activeView.value = mode;
      const bounds = new Box3().setFromObject(contentGroup);
      if (bounds.isEmpty()) return;
      const center = bounds.getCenter(new Vector3());
      const size = bounds.getSize(new Vector3());
      const distance = Math.max(size.x, size.y, size.z) * 1.55 + 3;
      const positions = {
        perspective: new Vector3(distance, distance * 0.7, distance),
        front: new Vector3(0, size.y * 0.2, distance),
        side: new Vector3(distance, size.y * 0.2, 0),
        top: new Vector3(0, distance, 1e-3)
      };
      camera.up.set(0, mode === "top" ? 0 : 1, mode === "top" ? -1 : 0);
      camera.position.copy(center).add(positions[mode]);
      camera.near = Math.max(0.1, distance / 100);
      camera.far = distance * 12;
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      controls.minDistance = Math.max(2, distance * 0.18);
      controls.maxDistance = distance * 3;
      controls.update();
    }
    function applyControlMode(mode) {
      activeControl.value = mode;
      if (!controls) return;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.mouseButtons = {
        LEFT: mode === "pan" ? MOUSE.PAN : mode === "zoom" ? MOUSE.DOLLY : MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY,
        RIGHT: mode === "rotate" ? MOUSE.PAN : MOUSE.ROTATE
      };
      controls.touches = {
        ONE: mode === "pan" ? TOUCH.PAN : mode === "zoom" ? TOUCH.DOLLY_PAN : TOUCH.ROTATE,
        TWO: TOUCH.DOLLY_ROTATE
      };
      controls.update();
    }
    function resetView() {
      setView(activeView.value);
    }
    function handleKeydown(event) {
      const target = event.target;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "") || target?.isContentEditable;
      if (isTyping || !pointerInside.value && document.activeElement !== container.value) return;
      const key = event.key.toLowerCase();
      if (key === "r") applyControlMode("rotate");
      else if (key === "m") applyControlMode("pan");
      else if (key === "z") applyControlMode("zoom");
      else if (key === "0") resetView();
      else if (key === "1") setView("perspective");
      else if (key === "2") setView("front");
      else if (key === "3") setView("side");
      else if (key === "4") setView("top");
    }
    function resize() {
      if (!container.value || !camera || !renderer) return;
      const width = Math.max(1, container.value.clientWidth);
      const height = Math.max(1, container.value.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    function animate() {
      animationFrame = requestAnimationFrame(animate);
      controls?.update();
      if (scene && camera) renderer?.render(scene, camera);
    }
    function initialize() {
      if (!container.value) return;
      try {
        scene = new Scene();
        scene.background = new Color(15922675);
        scene.fog = new Fog(15922675, 32, 85);
        camera = new PerspectiveCamera(38, 1, 0.1, 500);
        renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;
        renderer.domElement.style.touchAction = "none";
        renderer.domElement.setAttribute("aria-label", "楼栋房间与床位三维视图");
        container.value.appendChild(renderer.domElement);
        scene.add(new HemisphereLight(15660529, 8095618, 2.15));
        const keyLight = new DirectionalLight(16777215, 2.5);
        keyLight.position.set(14, 22, 12);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        scene.add(keyLight);
        const fillLight = new DirectionalLight(13426920, 1.1);
        fillLight.position.set(-12, 8, -10);
        scene.add(fillLight);
        const ground = new Mesh(
          new CircleGeometry(38, 64),
          new MeshStandardMaterial({ color: 15067879, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.14;
        ground.receiveShadow = true;
        scene.add(ground);
        const grid = new GridHelper(48, 48, 11451317, 14015961);
        grid.position.y = -0.05;
        scene.add(grid);
        contentGroup = new Group();
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
        renderer.domElement.addEventListener("contextmenu", preventContextMenu);
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container.value);
        resize();
        rebuildModel();
        animate();
      } catch (error) {
        console.error("初始化 Three.js 楼栋视图失败:", error);
        renderError.value = true;
      }
    }
    watch(
      [() => props.buildings, () => props.corridors, () => props.rooms, () => props.beds, selectedBuildingId],
      () => {
        void nextTick(rebuildModel);
      },
      { deep: true }
    );
    onMounted(() => {
      initialize();
      window.addEventListener("keydown", handleKeydown);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeydown);
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      controls?.dispose();
      renderer?.domElement.removeEventListener("contextmenu", preventContextMenu);
      clearContent();
      disposeScene();
      renderer?.renderLists.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement.remove();
      scene = void 0;
      camera = void 0;
      renderer = void 0;
      controls = void 0;
      contentGroup = void 0;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(unref(NSelect), {
            value: selectedBuildingId.value,
            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => selectedBuildingId.value = $event),
            options: buildingOptions.value,
            placeholder: "选择楼栋",
            class: "building-select"
          }, null, 8, ["value", "options"]),
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              _cache[6] || (_cache[6] = createBaseVNode("span", { class: "toolbar-label" }, "操作", -1)),
              createVNode(unref(NButtonGroup), { class: "tool-modes" }, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(Fragment, null, renderList(controlModes, (tool) => {
                    return createVNode(unref(NTooltip), {
                      key: tool.key
                    }, {
                      trigger: withCtx(() => [
                        createVNode(unref(Button), {
                          type: activeControl.value === tool.key ? "primary" : "default",
                          secondary: activeControl.value === tool.key,
                          "aria-label": `${tool.label}操作说明`,
                          onClick: ($event) => applyControlMode(tool.key)
                        }, {
                          icon: withCtx(() => [
                            (openBlock(), createBlock(resolveDynamicComponent(tool.icon), mergeProps({ ref_for: true }, iconProps), null, 16))
                          ]),
                          default: withCtx(() => [
                            createTextVNode(" " + toDisplayString(tool.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["type", "secondary", "aria-label", "onClick"])
                      ]),
                      default: withCtx(() => [
                        createTextVNode(" " + toDisplayString(tool.hint), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 64)),
                  createVNode(unref(NTooltip), { trigger: "hover" }, {
                    trigger: withCtx(() => [
                      createVNode(unref(Button), { "aria-label": "查看操作说明" }, {
                        icon: withCtx(() => [
                          createVNode(unref(Help), normalizeProps(guardReactiveProps(iconProps)), null, 16)
                        ]),
                        default: withCtx(() => [
                          _cache[3] || (_cache[3] = createTextVNode(" ? ", -1))
                        ]),
                        _: 1
                      })
                    ]),
                    default: withCtx(() => [
                      _cache[4] || (_cache[4] = createBaseVNode("div", { class: "help-tooltip" }, [
                        createBaseVNode("div", null, [
                          createBaseVNode("strong", null, "鼠标")
                        ]),
                        createBaseVNode("div", null, "旋转：默认左键拖动"),
                        createBaseVNode("div", null, "移动：点击“移动”后左键拖动，或旋转模式下右键拖动"),
                        createBaseVNode("div", null, "缩放：滚轮，或点击“缩放”后上下拖动"),
                        createBaseVNode("div", { class: "help-gap" }, [
                          createBaseVNode("strong", null, "键盘")
                        ]),
                        createBaseVNode("div", null, "R 旋转，M 移动，Z 缩放，0 复位"),
                        createBaseVNode("div", null, "1 鸟瞰，2 正面，3 侧面，4 俯视")
                      ], -1))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("strong", null, toDisplayString(activeControlLabel.value), 1),
                createBaseVNode("span", null, toDisplayString(activeControlHint.value), 1),
                _cache[5] || (_cache[5] = createBaseVNode("span", null, "R 旋转 / M 移动 / Z 缩放 / 0 复位", -1))
              ])
            ]),
            createVNode(unref(NButtonGroup), { class: "view-modes" }, {
              default: withCtx(() => [
                (openBlock(), createElementBlock(Fragment, null, renderList(viewModes, (view) => {
                  return createVNode(unref(NTooltip), {
                    key: view.key
                  }, {
                    trigger: withCtx(() => [
                      createVNode(unref(Button), {
                        type: activeView.value === view.key ? "primary" : "default",
                        secondary: activeView.value === view.key,
                        "aria-label": `${view.label}视角`,
                        onClick: ($event) => setView(view.key)
                      }, {
                        icon: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(view.icon), mergeProps({ ref_for: true }, iconProps), null, 16))
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" " + toDisplayString(view.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["type", "secondary", "aria-label", "onClick"])
                    ]),
                    default: withCtx(() => [
                      createTextVNode(" 切换到" + toDisplayString(view.label) + "视角 ", 1)
                    ]),
                    _: 2
                  }, 1024);
                }), 64)),
                createVNode(unref(NTooltip), null, {
                  trigger: withCtx(() => [
                    createVNode(unref(Button), {
                      "aria-label": "复位视图",
                      onClick: resetView
                    }, {
                      icon: withCtx(() => [
                        createVNode(unref(Redo), normalizeProps(guardReactiveProps(iconProps)), null, 16)
                      ]),
                      default: withCtx(() => [
                        _cache[7] || (_cache[7] = createTextVNode(" 复位 ", -1))
                      ]),
                      _: 1
                    })
                  ]),
                  default: withCtx(() => [
                    _cache[8] || (_cache[8] = createTextVNode(" 回到当前视角的默认位置 ", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ])
        ]),
        createBaseVNode("div", {
          ref_key: "container",
          ref: container,
          class: "three-viewport",
          tabindex: "0",
          onMouseenter: _cache[1] || (_cache[1] = ($event) => pointerInside.value = true),
          onMouseleave: _cache[2] || (_cache[2] = ($event) => pointerInside.value = false)
        }, [
          !selectedBuilding.value ? (openBlock(), createElementBlock("div", _hoisted_6, "暂无楼栋数据")) : renderError.value ? (openBlock(), createElementBlock("div", _hoisted_7, "当前设备无法创建 3D 渲染环境")) : createCommentVNode("", true),
          selectedBuilding.value ? (openBlock(), createElementBlock("div", _hoisted_8, [
            createBaseVNode("span", null, toDisplayString(selectedBuilding.value.floors) + " 层", 1),
            createBaseVNode("span", null, toDisplayString(selectedCorridors.value.length) + " 个分区", 1),
            createBaseVNode("span", null, toDisplayString(selectedRooms.value.length) + " 间房", 1),
            createBaseVNode("span", null, toDisplayString(selectedBeds.value.length) + " 张床", 1)
          ])) : createCommentVNode("", true),
          _cache[9] || (_cache[9] = createBaseVNode("div", {
            class: "status-legend",
            "aria-label": "床位状态图例"
          }, [
            createBaseVNode("span", { class: "available" }, "空闲"),
            createBaseVNode("span", { class: "occupied" }, "占用"),
            createBaseVNode("span", { class: "maintenance" }, "维修")
          ], -1))
        ], 544)
      ]);
    };
  }
});
const Building3DViewer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-89d15cc2"]]);
export {
  Building3DViewer as B
};
