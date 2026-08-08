import { X as createVNode, S as defineStore, r as ref, l as defineComponent, V as openBlock, a1 as createElementBlock, F as Fragment, a6 as renderList, u as unref, a7 as useRoute, a2 as useRouter, c as computed, U as createBlock, W as withCtx, a3 as createBaseVNode, J as normalizeClass, k as createTextVNode, a8 as toDisplayString, a5 as withModifiers, a9 as createCommentVNode, aa as normalizeStyle, ab as RouterLink, o as onMounted, I as onUnmounted, w as watch, Y as RouterView, ac as KeepAlive, ad as resolveDynamicComponent, q as h } from "./vendor-vue-C6_copC_.js";
import { u as useAuthStore, a as useSyncStore, b as useTheme, M as MENU_GROUPS, c as MENU_CATALOG } from "./index-Y_pGVxO7.js";
import { u as useNotificationStore } from "./notification.store-BpxkN0Xr.js";
import { f as formatDateTime } from "./validators-BfKhytEl.js";
import { _ as _sfc_main$3 } from "./AnimFade.vue_vue_type_script_setup_true_lang-BnJ_3lIf.js";
import { n as NDropdown, h as NModal, B as Button, o as NTag, u as useMessage, p as useDialog, q as NLayout, r as NMenu, s as NLayoutSider, t as NLayoutHeader, v as NSpace, w as NTooltip, x as NBadge, y as NText, A as NPopover, C as NSpin, D as NEmpty, E as NList, F as NAvatar, G as NLayoutContent, j as NForm, k as NFormItem, l as NInput, H as NDatePicker, I as NTimePicker, J as NSelect, K as NListItem, L as NThing } from "./vendor-naive-CeveemIE.js";
import { I as IconWrapper } from "./index-C-8AyLEj.js";
import { u as useAnnouncementStore } from "./announcement.store-COyJZ8dM.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { i as initAutoRefresh } from "./useAutoRefresh-BeuDS8Br.js";
import { R as Refresh, C as CheckOne } from "./Refresh-BQrfKev0.js";
import { A as AlarmClock, C as CalendarDot } from "./CalendarDot-B1gA6vml.js";
import { U as User } from "./User-HVFuY0Pp.js";
import { P as Peoples } from "./Peoples-McFWA9ZH.js";
import { C as Cube } from "./Cube-BnGD7jlY.js";
import "./vendor-query-DzdY0EvJ.js";
import "./vendor-echarts-Bn4I93f0.js";
import "./vendor-utils-DD6FGs_H.js";
const Agreement = IconWrapper("agreement", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("rect", {
    "x": "8",
    "y": "4",
    "width": "32",
    "height": "40",
    "rx": "2",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M16 4H25V20L20.5 16L16 20V4Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M16 28H26",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), createVNode("path", {
    "d": "M16 34H32",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const Announcement = IconWrapper("announcement", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("rect", {
    "x": "4",
    "y": "15",
    "width": "40",
    "height": "26",
    "rx": "2",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 7L16 15H32L24 7Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M12 24H30",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M12 32H20",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Caution = IconWrapper("caution", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 5L2 43H46L24 5Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 35V36",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), createVNode("path", {
    "d": "M24 19.0005L24.0083 29",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const ChartHistogram = IconWrapper("chart-histogram", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M6 6V42H42",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M14 30V34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M22 22V34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M30 6V34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M38 14V34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const ChopsticksFork = IconWrapper("chopsticks-fork", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M14 4V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M8 5V15C8 20 14 20 14 20C14 20 20 20 20 15V5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M37 4L40 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M31 4L28 44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const CloseSmall = IconWrapper("close-small", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M14 14L34 34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M14 34L34 14",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Devices = IconWrapper("devices", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M23 43H43V5H14V15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M5 15H23V43H5L5 15Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M13 37H15",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M28 37H30",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Entertainment = IconWrapper("entertainment", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M16 24C21.5228 24 26 19.5228 26 14C26 8.47715 21.5228 4 16 4C10.4772 4 6 8.47715 6 14C6 19.5228 10.4772 24 16 24Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M26 15.202C26.0144 15.2163 30.7229 21.1376 40.1256 32.9656C40.4562 33.363 40.4295 33.9468 40.064 34.3124L35.9805 38.3959C35.615 38.7614 35.0311 38.7881 34.6338 38.4575L17.8222 24",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M26.4702 24.47L29.2986 27.2985",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M17 44.0864C18.9166 41.5881 21.2468 40.3389 23.9906 40.3389C28.1063 40.3389 32.9629 45.5097 37.1063 44.798C41.2496 44.0864 42.4355 40 39.8851 37.7375",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Health = IconWrapper("health", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), createVNode("path", {
    "d": "M27.3 12C25.4775 12 24 13.4347 24 15.2045C24 18.4091 27.9 21.3223 30 22C32.1 21.3223 36 18.4091 36 15.2045C36 13.4347 34.5225 12 32.7 12C31.5839 12 30.5972 12.538 30 13.3616C29.4028 12.538 28.4161 12 27.3 12Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Home = IconWrapper("home", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M9 18V42H39V18L24 6L9 18Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M19 29V42H29V29H19Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M9 42H39",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const HospitalBed = IconWrapper("hospital-bed", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M6 17V39",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M42 25L42 39",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M26 15H38",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M11 22H17",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M6 28L42 28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M6 34L42 34",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M32 9V21",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Key = IconWrapper("key", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M22.8682 24.2982C25.4105 26.7935 26.4138 30.4526 25.4971 33.8863C24.5805 37.32 21.8844 40.0019 18.4325 40.9137C14.9806 41.8256 11.3022 40.8276 8.79375 38.2986C5.02208 34.4141 5.07602 28.2394 8.91499 24.4206C12.754 20.6019 18.9613 20.5482 22.8664 24.3L22.8682 24.2982Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M23 24L40 7",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M30.3052 16.9001L35.7337 22.3001L42.0671 16.0001L36.6385 10.6001L30.3052 16.9001Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const MedicalFiles = IconWrapper("medical-files", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M23 42H19H15H9C7.89543 42 7 41.1046 7 40V8C7 6.89543 7.89543 6 9 6H37C38.1046 6 39 6.89543 39 8V15V19.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M36.6364 27C39.0463 27 41 28.8804 41 31.2C41 34.2196 38.0909 36.8 36.6364 38.2C35.6667 39.1333 34.4545 40.0667 33 41C31.5455 40.0667 30.3333 39.1333 29.3636 38.2C27.9091 36.8 25 34.2196 25 31.2C25 28.8804 26.9537 27 29.3636 27C30.8814 27 32.2182 27.7459 33 28.8775C33.7818 27.7459 35.1186 27 36.6364 27Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M15 14H31",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const Messages = IconWrapper("messages", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth
  }, null), createVNode("path", {
    "d": "M35 23C35 28.5229 30.5229 33 25 33C22.0133 33 15 33 15 33C15 33 15 25.5361 15 23C15 17.4771 19.4771 13 25 13C30.5229 13 35 17.4771 35 23Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M22 21H28",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M22 27H24",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Moon = IconWrapper("moon", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M28.0527 4.41085C22.5828 5.83695 18.5455 10.8106 18.5455 16.7273C18.5455 23.7564 24.2436 29.4545 31.2727 29.4545C37.1894 29.4545 42.1631 25.4172 43.5891 19.9473C43.8585 21.256 44 22.6115 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C25.3885 4 26.744 4.14149 28.0527 4.41085Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const MoveIn = IconWrapper("move-in", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M20 12L24 16L28 12",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 16V4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M20 36L24 32L28 36",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 32V44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M36 20L32 24L36 28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M32 24H44",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M12 20L16 24L12 28",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M16 24H4",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 26C25.1046 26 26 25.1046 26 24C26 22.8954 25.1046 22 24 22C22.8954 22 22 22.8954 22 24C22 25.1046 22.8954 26 24 26Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const NurseCap = IconWrapper("nurse-cap", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M24 10C12.7433 10 5.98524 16.7481 4.37521 18.5579C4.1348 18.8281 4.0869 19.2064 4.22726 19.5397L11.5526 36.9373C11.7887 37.4982 12.4705 37.7313 13.0196 37.4691C14.8237 36.6075 18.876 35 24 35C29.124 35 33.1763 36.6075 34.9804 37.4691C35.5295 37.7313 36.2113 37.4982 36.4474 36.9373L43.7727 19.5397C43.9131 19.2064 43.8652 18.8281 43.6248 18.5579C42.0148 16.7481 35.2568 10 24 10Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M20 24.001L28 24.001",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 20V28",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Nutrition = IconWrapper("nutrition", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M24 42C24.8653 42 26.8503 42 29.9551 42C30.0381 39.2631 30.4393 37.7582 31.1586 37.4852C38.6685 34.6357 44 27.434 44 19H4C4 27.2514 9.10319 34.3234 16.3568 37.2941C17.1151 37.6047 17.6815 39.1733 18.056 42C21.0857 42 23.067 42 24 42Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M14.4434 26.0225C14.803 27.2103 15.2786 28.191 15.8702 28.9646C16.4484 29.7209 17.1619 30.4223 18.0104 31.0688",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null), createVNode("path", {
    "d": "M32.2009 8.01759C30.9409 7.31418 29.5829 6.76784 28.1528 6.40474M22.0507 6C14.9273 6.8226 9.1442 12.0978 7.5 19M40.5 18.9965C39.8296 16.1847 38.4722 13.643 36.6172 11.5626",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const Protect = IconWrapper("protect", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M6 9.25564L24.0086 4L42 9.25564V20.0337C42 31.3622 34.7502 41.4194 24.0026 45.0005C13.2521 41.4195 6 31.36 6 20.0287V9.25564Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M15 23L22 30L34 18",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Report = IconWrapper("report", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M36 35H12V21C12 14.3726 17.3726 9 24 9C30.6274 9 36 14.3726 36 21V35Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M8 42H40",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M4 13L7 14",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M13 3.9999L14 6.9999",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M10.0001 9.99989L7.00009 6.99989",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Setting = IconWrapper("setting", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M36.686 15.171C37.9364 16.9643 38.8163 19.0352 39.2147 21.2727H44V26.7273H39.2147C38.8163 28.9648 37.9364 31.0357 36.686 32.829L40.0706 36.2137L36.2137 40.0706L32.829 36.686C31.0357 37.9364 28.9648 38.8163 26.7273 39.2147V44H21.2727V39.2147C19.0352 38.8163 16.9643 37.9364 15.171 36.686L11.7863 40.0706L7.92939 36.2137L11.314 32.829C10.0636 31.0357 9.18372 28.9648 8.78533 26.7273H4V21.2727H8.78533C9.18372 19.0352 10.0636 16.9643 11.314 15.171L7.92939 11.7863L11.7863 7.92939L15.171 11.314C16.9643 10.0636 19.0352 9.18372 21.2727 8.78533V4H26.7273V8.78533C28.9648 9.18372 31.0357 10.0636 32.829 11.314L36.2137 7.92939L40.0706 11.7863L36.686 15.171Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const ShoppingCart = IconWrapper("shopping-cart", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M39 32H13L8 12H44L39 32Z",
    "fill": props.colors[1]
  }, null), createVNode("path", {
    "d": "M3 6H6.5L8 12M8 12L13 32H39L44 12H8Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("circle", {
    "cx": "13",
    "cy": "39",
    "r": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("circle", {
    "cx": "39",
    "cy": "39",
    "r": "3",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M22 22H30",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M26 26V18",
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Sun = IconWrapper("sun", false, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "d": "M9.15039 9.15088L11.3778 11.3783",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M3 24H6.15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M9.15039 38.8495L11.3778 36.6221",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M38.8495 38.8495L36.6221 36.6221",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M44.9996 24H41.8496",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M38.8495 9.15088L36.6221 11.3783",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 3V6.15",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z",
    "fill": props.colors[2],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M24 45.0001V41.8501",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null)]);
});
const Wallet = IconWrapper("wallet", true, function(props) {
  return createVNode("svg", {
    "width": props.size,
    "height": props.size,
    "viewBox": "0 0 48 48",
    "fill": "none"
  }, [createVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    "d": "M17.982 11.9689L31.7846 4L36.397 11.9889L17.982 11.9689Z",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M4 14C4 12.8954 4.89543 12 6 12H42C43.1046 12 44 12.8954 44 14V42C44 43.1046 43.1046 44 42 44H6C4.89543 44 4 43.1046 4 42V14Z",
    "fill": props.colors[1],
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M35.25 33H44V23H35.25C32.3505 23 30 25.2386 30 28C30 30.7614 32.3505 33 35.25 33Z",
    "fill": props.colors[3],
    "stroke": props.colors[2],
    "stroke-width": props.strokeWidth,
    "stroke-linejoin": props.strokeLinejoin
  }, null), createVNode("path", {
    "d": "M44 16.5V40.5",
    "stroke": props.colors[0],
    "stroke-width": props.strokeWidth,
    "stroke-linecap": props.strokeLinecap
  }, null)]);
});
const useTabsStore = defineStore("tabs", () => {
  const visited = ref([]);
  const cached = ref([]);
  function toTabView(route) {
    const name = route.name;
    if (!name) return null;
    return {
      path: route.path,
      fullPath: route.fullPath,
      name,
      title: route.meta.title ?? name,
      affix: !!route.meta.affix
    };
  }
  function addTab(route) {
    const tab = toTabView(route);
    if (!tab) return;
    if (!visited.value.some((v) => v.path === tab.path)) {
      visited.value.push(tab);
    }
    if (!route.meta.noCache && !cached.value.includes(tab.name)) {
      cached.value.push(tab.name);
    }
  }
  function uncache(name) {
    const idx = cached.value.indexOf(name);
    if (idx > -1) cached.value.splice(idx, 1);
  }
  function closeTab(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    const [removed] = visited.value.splice(idx, 1);
    if (!visited.value.some((v) => v.name === removed.name)) {
      uncache(removed.name);
    }
  }
  function syncCacheWithVisited() {
    cached.value = cached.value.filter((name) => visited.value.some((v) => v.name === name));
  }
  function closeOthers(path) {
    visited.value = visited.value.filter((v) => v.affix || v.path === path);
    syncCacheWithVisited();
  }
  function closeLeft(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    visited.value = visited.value.filter((v, i) => v.affix || i >= idx);
    syncCacheWithVisited();
  }
  function closeRight(path) {
    const idx = visited.value.findIndex((v) => v.path === path);
    if (idx === -1) return;
    visited.value = visited.value.filter((v, i) => v.affix || i <= idx);
    syncCacheWithVisited();
  }
  function closeAll() {
    visited.value = visited.value.filter((v) => v.affix);
    syncCacheWithVisited();
  }
  return {
    visited,
    cached,
    addTab,
    closeTab,
    closeOthers,
    closeLeft,
    closeRight,
    closeAll
  };
});
const _hoisted_1$2 = { class: "tags-view-container flex items-center h-9 px-3 gap-2 overflow-x-auto bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" };
const _hoisted_2$2 = ["onClick"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TagsView",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const tabsStore = useTabsStore();
    const contextMenuVisible = ref(false);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    const contextTab = ref(null);
    function isActive(tab) {
      return tab.path === route.path;
    }
    const dropdownOptions = computed(() => {
      const tab = contextTab.value;
      if (!tab) return [];
      return [
        { label: "关闭当前", key: "close", disabled: tab.affix },
        { label: "关闭其他", key: "closeOthers" },
        { label: "关闭左侧", key: "closeLeft" },
        { label: "关闭右侧", key: "closeRight" },
        { label: "关闭全部", key: "closeAll" }
      ];
    });
    function openContextMenu(tab, e) {
      e.preventDefault();
      contextTab.value = tab;
      contextMenuX.value = e.clientX;
      contextMenuY.value = e.clientY;
      contextMenuVisible.value = true;
    }
    function navigateAfterClose(closedPath) {
      if (route.path !== closedPath) return;
      const last = tabsStore.visited[tabsStore.visited.length - 1];
      router.push(last ? last.fullPath : "/dashboard");
    }
    function handleClose(tab) {
      if (tab.affix) return;
      tabsStore.closeTab(tab.path);
      navigateAfterClose(tab.path);
    }
    function handleSelect(key) {
      const tab = contextTab.value;
      if (!tab) return;
      switch (key) {
        case "close":
          handleClose(tab);
          break;
        case "closeOthers":
          tabsStore.closeOthers(tab.path);
          router.push(tab.fullPath);
          break;
        case "closeLeft":
          tabsStore.closeLeft(tab.path);
          navigateAfterClose(route.path);
          break;
        case "closeRight":
          tabsStore.closeRight(tab.path);
          navigateAfterClose(route.path);
          break;
        case "closeAll":
          tabsStore.closeAll();
          navigateAfterClose(route.path);
          break;
      }
      contextMenuVisible.value = false;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(tabsStore).visited, (tab) => {
          return openBlock(), createBlock(unref(RouterLink), {
            key: tab.path,
            to: tab.fullPath,
            class: normalizeClass(["tags-view-item group flex-center flex-shrink-0 h-6.5 pl-2.5 rounded text-xs border cursor-pointer select-none no-underline transition-colors", isActive(tab) ? "bg-primary/10 text-primary border-primary/40 font-medium" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-primary/50 hover:text-primary"]),
            style: normalizeStyle({ paddingRight: tab.affix ? "10px" : "2px" }),
            onContextmenu: ($event) => openContextMenu(tab, $event),
            onMouseup: withModifiers(($event) => handleClose(tab), ["middle"])
          }, {
            default: withCtx(() => [
              createBaseVNode("span", {
                class: normalizeClass(["w-1.5 h-1.5 mr-1.5 rounded-full flex-shrink-0 transition-colors", isActive(tab) ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"])
              }, null, 2),
              createTextVNode(" " + toDisplayString(tab.title) + " ", 1),
              !tab.affix ? (openBlock(), createElementBlock("span", {
                key: 0,
                class: normalizeClass(["flex-center flex-shrink-0 w-3.5 h-3.5 ml-1.5 rounded-full transition-colors text-gray-400 hover:text-white hover:bg-gray-400 dark:text-gray-500 dark:hover:bg-gray-500 leading-none", isActive(tab) ? "hover:!bg-primary hover:!text-white" : ""]),
                onClick: withModifiers(($event) => handleClose(tab), ["stop", "prevent"])
              }, [
                createVNode(unref(CloseSmall), {
                  theme: "outline",
                  size: 12,
                  "stroke-width": 4
                })
              ], 10, _hoisted_2$2)) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["to", "class", "style", "onContextmenu", "onMouseup"]);
        }), 128)),
        createVNode(unref(NDropdown), {
          placement: "bottom-start",
          trigger: "manual",
          show: contextMenuVisible.value,
          x: contextMenuX.value,
          y: contextMenuY.value,
          options: dropdownOptions.value,
          onSelect: handleSelect,
          onClickoutside: _cache[0] || (_cache[0] = ($event) => contextMenuVisible.value = false)
        }, null, 8, ["show", "x", "y", "options"])
      ]);
    };
  }
});
const _hoisted_1$1 = {
  key: 0,
  class: "announcement-ticker",
  "aria-label": "系统公告"
};
const _hoisted_2$1 = { class: "ticker-viewport" };
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = {
  key: 0,
  class: "ticker-pin"
};
const _hoisted_5$1 = { class: "ticker-title" };
const _hoisted_6$1 = { class: "ticker-content" };
const _hoisted_7$1 = {
  key: 1,
  class: "ticker-unread"
};
const _hoisted_8$1 = {
  key: 0,
  class: "announcement-detail-content"
};
const _hoisted_9$1 = {
  key: 1,
  class: "mt-5 text-xs text-gray-400"
};
const _hoisted_10$1 = { key: 0 };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AnnouncementTicker",
  setup(__props) {
    const announcementStore = useAnnouncementStore();
    const authStore = useAuthStore();
    const activeAnnouncement = ref(null);
    let refreshTimer = null;
    const tickerItems = computed(() => announcementStore.visible);
    async function refreshVisible() {
      const userId = authStore.currentUser?.id;
      if (userId) await announcementStore.fetchVisible(userId);
    }
    async function openAnnouncement(announcement) {
      activeAnnouncement.value = announcement;
      const userId = authStore.currentUser?.id;
      if (userId && announcement.is_read === 0) {
        await announcementStore.markRead(announcement.id, userId);
      }
    }
    function levelLabel(level) {
      return { normal: "公告", important: "重要", urgent: "紧急" }[level];
    }
    function levelType(level) {
      return { normal: "default", important: "warning", urgent: "error" }[level];
    }
    onMounted(async () => {
      await refreshVisible();
      refreshTimer = setInterval(refreshVisible, 6e4);
    });
    onUnmounted(() => {
      if (refreshTimer) clearInterval(refreshTimer);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        tickerItems.value.length ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
          createVNode(unref(Announcement), {
            class: "ticker-icon",
            theme: "outline",
            size: 16,
            "stroke-width": 3
          }),
          createBaseVNode("div", _hoisted_2$1, [
            createBaseVNode("div", {
              class: normalizeClass(["ticker-track", { "ticker-track-static": tickerItems.value.length === 1 }])
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(tickerItems.value.length > 1 ? 2 : 1, (copy) => {
                return openBlock(), createElementBlock("div", {
                  key: copy,
                  class: "ticker-set"
                }, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(tickerItems.value, (announcement) => {
                    return openBlock(), createElementBlock("button", {
                      key: `${copy}-${announcement.id}`,
                      type: "button",
                      class: "ticker-item",
                      onClick: ($event) => openAnnouncement(announcement)
                    }, [
                      announcement.is_pinned ? (openBlock(), createElementBlock("span", _hoisted_4$1, "置顶")) : createCommentVNode("", true),
                      createBaseVNode("span", _hoisted_5$1, toDisplayString(announcement.title), 1),
                      createBaseVNode("span", _hoisted_6$1, toDisplayString(announcement.content), 1),
                      announcement.is_read === 0 ? (openBlock(), createElementBlock("span", _hoisted_7$1, "未读")) : createCommentVNode("", true)
                    ], 8, _hoisted_3$1);
                  }), 128))
                ]);
              }), 128))
            ], 2)
          ])
        ])) : createCommentVNode("", true),
        createVNode(unref(NModal), {
          show: !!activeAnnouncement.value,
          preset: "card",
          style: { "width": "620px" },
          title: activeAnnouncement.value?.title,
          "onUpdate:show": _cache[1] || (_cache[1] = (show) => {
            if (!show) activeAnnouncement.value = null;
          })
        }, {
          "header-extra": withCtx(() => [
            activeAnnouncement.value ? (openBlock(), createBlock(unref(NTag), {
              key: 0,
              type: levelType(activeAnnouncement.value.level),
              size: "small"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(levelLabel(activeAnnouncement.value.level)), 1)
              ]),
              _: 1
            }, 8, ["type"])) : createCommentVNode("", true)
          ]),
          footer: withCtx(() => [
            createVNode(unref(Button), {
              type: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => activeAnnouncement.value = null)
            }, {
              default: withCtx(() => [..._cache[2] || (_cache[2] = [
                createTextVNode("已阅", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            activeAnnouncement.value ? (openBlock(), createElementBlock("div", _hoisted_8$1, toDisplayString(activeAnnouncement.value.content), 1)) : createCommentVNode("", true),
            activeAnnouncement.value ? (openBlock(), createElementBlock("div", _hoisted_9$1, [
              createTextVNode(" 发布时间：" + toDisplayString(unref(formatDateTime)(activeAnnouncement.value.publish_at)) + " ", 1),
              activeAnnouncement.value.expire_at ? (openBlock(), createElementBlock("span", _hoisted_10$1, "　有效至：" + toDisplayString(unref(formatDateTime)(activeAnnouncement.value.expire_at)), 1)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["show", "title"])
      ], 64);
    };
  }
});
const AnnouncementTicker = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4ca3c163"]]);
const _hoisted_1 = { class: "flex-col-center py-4 border-b border-gray-100 dark:border-gray-700" };
const _hoisted_2 = {
  key: 0,
  class: "text-base font-bold text-primary"
};
const _hoisted_3 = { style: { "width": "380px" } };
const _hoisted_4 = { class: "flex-between mb-2" };
const _hoisted_5 = { class: "text-sm text-gray-500 break-words" };
const _hoisted_6 = { class: "flex-between mt-2" };
const _hoisted_7 = { class: "text-xs text-gray-400" };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = {
  key: 0,
  class: "py-2"
};
const _hoisted_10 = { class: "text-lg font-semibold mb-2" };
const _hoisted_11 = {
  key: 0,
  class: "text-sm text-gray-500 mb-3"
};
const _hoisted_12 = { class: "text-xs text-gray-400" };
const _hoisted_13 = {
  key: 0,
  class: "ml-2"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DefaultLayout",
  setup(__props) {
    const { isDark, toggle } = useTheme();
    const route = useRoute();
    const router = useRouter();
    const syncStore = useSyncStore();
    const notifyStore = useNotificationStore();
    const authStore = useAuthStore();
    const tabsStore = useTabsStore();
    const message = useMessage();
    const dialog = useDialog();
    const collapsed = ref(false);
    const iconParkComponents = {
      Agreement,
      AlarmClock,
      Announcement,
      CalendarDot,
      Caution,
      ChartHistogram,
      CheckOne,
      ChopsticksFork,
      Cube,
      Devices,
      Entertainment,
      Health,
      Home,
      HospitalBed,
      Key,
      MedicalFiles,
      Messages,
      MoveIn,
      NurseCap,
      Nutrition,
      Peoples,
      Protect,
      Refresh,
      Report,
      Setting,
      ShoppingCart,
      User,
      Wallet
    };
    function renderIcon(name, className = "layout-icon") {
      const icon = iconParkComponents[name] ?? Home;
      return h(icon, {
        class: className,
        theme: "outline",
        size: 18,
        strokeWidth: 3
      });
    }
    const showNotifications = ref(false);
    const notificationsLoading = ref(false);
    async function handleNotificationPanel(show) {
      showNotifications.value = show;
      if (!show) return;
      notificationsLoading.value = true;
      try {
        await Promise.all([
          notifyStore.fetchAll(),
          notifyStore.fetchUnreadCount()
        ]);
      } finally {
        notificationsLoading.value = false;
      }
    }
    async function markNotificationRead(id) {
      await notifyStore.markRead(id);
    }
    async function markNotificationUnread(id) {
      await notifyStore.markUnread(id);
    }
    onMounted(() => notifyStore.fetchUnreadCount());
    onMounted(async () => {
      try {
        const cfg = await window.api.config.app.get();
        const sec = cfg.autoRefreshSec ?? 0;
        initAutoRefresh(sec);
      } catch {
      }
    });
    const showAlarmModal = ref(false);
    const alarmQueue = ref([]);
    const currentAlarm = computed(() => alarmQueue.value[0] ?? null);
    let offAlarm = null;
    function playAlarmSound() {
      try {
        const ctx = new AudioContext();
        const playBeep = (delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(1e-4, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(
            0.3,
            ctx.currentTime + delay + 0.02
          );
          gain.gain.exponentialRampToValueAtTime(
            1e-4,
            ctx.currentTime + delay + 0.3
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.3);
        };
        playBeep(0);
        playBeep(0.4);
      } catch {
      }
    }
    function handleAlarmEvent(reminder) {
      alarmQueue.value.push(reminder);
      showAlarmModal.value = true;
      playAlarmSound();
    }
    function dismissCurrentAlarm() {
      alarmQueue.value.shift();
      if (alarmQueue.value.length === 0) {
        showAlarmModal.value = false;
      } else {
        playAlarmSound();
      }
    }
    async function markCurrentAlarmDone() {
      if (!currentAlarm.value) return;
      try {
        await window.api.reminder.done(currentAlarm.value.id);
      } catch {
      }
      dismissCurrentAlarm();
    }
    onMounted(() => {
      offAlarm = window.api.reminder.onAlarm(handleAlarmEvent);
    });
    onUnmounted(() => {
      offAlarm?.();
    });
    watch(
      () => route.fullPath,
      () => tabsStore.addTab(route),
      { immediate: true }
    );
    const dashboardItem = {
      label: () => h("span", { onClick: () => router.push("/dashboard") }, "首页概览"),
      key: "/dashboard",
      icon: () => renderIcon("Home")
    };
    const menuOptions = computed(() => {
      const groups = MENU_GROUPS.map((group) => {
        const items = MENU_CATALOG.filter(
          (item) => item.group === group.key && authStore.canAccessMenu(item.permissionKey ?? item.key)
        ).map((item) => ({
          label: () => h("span", { onClick: () => router.push(`/${item.key}`) }, item.label),
          key: `/${item.key}`,
          icon: () => renderIcon(item.icon)
        }));
        return items.length ? {
          type: "group",
          label: group.label,
          key: `group-${group.key}`,
          children: items
        } : null;
      }).filter((g) => g !== null);
      return [dashboardItem, ...groups];
    });
    const activeKey = computed(() => "/" + route.path.split("/")[1]);
    const syncStatusColor = computed(() => {
      switch (syncStore.status) {
        case "syncing":
          return "info";
        case "success":
          return "success";
        case "error":
          return "error";
        case "disabled":
          return "default";
        default:
          return "default";
      }
    });
    const syncStatusText = computed(() => {
      switch (syncStore.status) {
        case "syncing":
          return "同步中...";
        case "success":
          return `上次同步: ${syncStore.lastSyncAt ? formatDateTime(syncStore.lastSyncAt) : "—"}`;
        case "error":
          return `同步失败: ${syncStore.lastError}`;
        case "disabled":
          return "同步已禁用";
        default:
          return "等待同步";
      }
    });
    const userMenuOptions = [
      { label: "修改密码", key: "change-password" },
      { label: "退出登录", key: "logout" }
    ];
    const showChangePwModal = ref(false);
    const pwForm = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const changingPw = ref(false);
    function handleUserMenuSelect(key) {
      if (key === "change-password") {
        pwForm.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
        showChangePwModal.value = true;
      } else if (key === "logout") {
        dialog.warning({
          title: "退出登录",
          content: "确定要退出当前账号吗？",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: async () => {
            await authStore.logout();
            router.replace("/login");
          }
        });
      }
    }
    async function handleChangePassword() {
      if (!pwForm.value.oldPassword || !pwForm.value.newPassword) {
        message.error("请填写完整");
        return;
      }
      if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
        message.error("两次输入的新密码不一致");
        return;
      }
      changingPw.value = true;
      try {
        const res = await authStore.changePassword(
          pwForm.value.oldPassword,
          pwForm.value.newPassword
        );
        if (!res.ok) {
          message.error(res.error ?? "修改失败");
          return;
        }
        message.success("密码已修改");
        showChangePwModal.value = false;
      } finally {
        changingPw.value = false;
      }
    }
    const showQuickReminderModal = ref(false);
    const quickSubmitting = ref(false);
    const canAssignReminder = computed(
      () => authStore.canUseButton("reminder:assign")
    );
    const quickReminderForm = ref({
      title: "",
      remind_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      remind_at: "09:00",
      assignee_id: ""
    });
    const userOptionsForQuick = ref([]);
    async function openQuickReminder() {
      quickReminderForm.value = {
        title: "",
        remind_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        remind_at: "09:00",
        assignee_id: authStore.currentUser?.id ?? ""
      };
      if (canAssignReminder.value && userOptionsForQuick.value.length === 0) {
        const users = await window.api.user.list();
        userOptionsForQuick.value = users.filter((u) => u.status === "active").map((u) => ({
          label: u.real_name,
          value: u.id
        }));
      }
      showQuickReminderModal.value = true;
    }
    async function saveQuickReminder() {
      if (!quickReminderForm.value.title.trim())
        return message.error("请填写任务标题");
      quickSubmitting.value = true;
      try {
        await window.api.reminder.create({
          title: quickReminderForm.value.title.trim(),
          description: null,
          remind_at: quickReminderForm.value.remind_at,
          remind_date: quickReminderForm.value.remind_date,
          repeat_type: "none",
          repeat_days: null,
          creator_id: authStore.currentUser?.id ?? "",
          assignee_id: quickReminderForm.value.assignee_id || (authStore.currentUser?.id ?? ""),
          status: "active"
        });
        message.success("提醒已创建");
        showQuickReminderModal.value = false;
      } catch {
        message.error("创建失败，请稍后重试");
      } finally {
        quickSubmitting.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NLayout), {
        "has-sider": "",
        style: { "height": "100vh" }
      }, {
        default: withCtx(() => [
          createVNode(unref(NLayoutSider), {
            bordered: "",
            "collapse-mode": "width",
            "collapsed-width": 0,
            width: 220,
            collapsed: collapsed.value,
            "show-trigger": "",
            "trigger-class": "layout-sider-toggle",
            "collapsed-trigger-class": "layout-sider-toggle",
            onCollapse: _cache[0] || (_cache[0] = ($event) => collapsed.value = true),
            onExpand: _cache[1] || (_cache[1] = ($event) => collapsed.value = false)
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                !collapsed.value ? (openBlock(), createElementBlock("span", _hoisted_2, "养老管理系统")) : (openBlock(), createBlock(unref(Home), {
                  key: 1,
                  class: "layout-brand-icon text-primary",
                  theme: "filled",
                  size: 22
                }))
              ]),
              createVNode(unref(NMenu), {
                collapsed: collapsed.value,
                "collapsed-width": 0,
                "collapsed-icon-size": 18,
                options: menuOptions.value,
                value: activeKey.value
              }, null, 8, ["collapsed", "options", "value"])
            ]),
            _: 1
          }, 8, ["collapsed"]),
          createVNode(unref(NLayout), null, {
            default: withCtx(() => [
              createVNode(unref(NLayoutHeader), {
                bordered: "",
                class: "flex px-4 py-2",
                style: { "height": "52px", "gap": "24px" }
              }, {
                default: withCtx(() => [
                  createVNode(unref(NSpace), {
                    align: "center",
                    class: "shrink-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTooltip), null, {
                        trigger: withCtx(() => [
                          createVNode(unref(NBadge), {
                            type: syncStatusColor.value,
                            dot: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Refresh), {
                                class: normalizeClass(["header-icon", { "animate-spin": unref(syncStore).status === "syncing" }]),
                                theme: "outline",
                                size: 18,
                                "stroke-width": 3,
                                onClick: _cache[2] || (_cache[2] = ($event) => unref(syncStore).triggerManual())
                              }, null, 8, ["class"])
                            ]),
                            _: 1
                          }, 8, ["type"])
                        ]),
                        default: withCtx(() => [
                          createTextVNode(" " + toDisplayString(syncStatusText.value), 1)
                        ]),
                        _: 1
                      }),
                      unref(syncStore).pendingCount > 0 ? (openBlock(), createBlock(unref(NText), {
                        key: 0,
                        depth: "3",
                        class: "text-xs"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(syncStore).pendingCount) + " 条待同步 ", 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }),
                  createVNode(AnnouncementTicker, { class: "flex-1 min-w-0" }),
                  createVNode(unref(NSpace), {
                    align: "center",
                    class: "shrink-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTooltip), null, {
                        trigger: withCtx(() => [
                          createVNode(unref(AlarmClock), {
                            class: "header-icon",
                            theme: "outline",
                            size: 18,
                            "stroke-width": 3,
                            onClick: openQuickReminder
                          })
                        ]),
                        default: withCtx(() => [
                          _cache[16] || (_cache[16] = createTextVNode(" 快速新建任务提醒 ", -1))
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NPopover), {
                        trigger: "click",
                        placement: "bottom-end",
                        show: showNotifications.value,
                        "onUpdate:show": handleNotificationPanel
                      }, {
                        trigger: withCtx(() => [
                          createVNode(unref(NBadge), {
                            value: unref(notifyStore).unreadCount,
                            max: 99,
                            show: unref(notifyStore).unreadCount > 0
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Announcement), {
                                class: "header-icon",
                                theme: "outline",
                                size: 18,
                                "stroke-width": 3
                              })
                            ]),
                            _: 1
                          }, 8, ["value", "show"])
                        ]),
                        default: withCtx(() => [
                          createBaseVNode("div", _hoisted_3, [
                            createBaseVNode("div", _hoisted_4, [
                              _cache[18] || (_cache[18] = createBaseVNode("span", { class: "font-semibold" }, "通知", -1)),
                              unref(notifyStore).unreadCount > 0 ? (openBlock(), createBlock(unref(Button), {
                                key: 0,
                                text: "",
                                type: "primary",
                                size: "small",
                                onClick: _cache[3] || (_cache[3] = ($event) => unref(notifyStore).markAllRead())
                              }, {
                                default: withCtx(() => [..._cache[17] || (_cache[17] = [
                                  createTextVNode(" 全部标为已读 ", -1)
                                ])]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(NSpin), { show: notificationsLoading.value }, {
                              default: withCtx(() => [
                                unref(notifyStore).list.length === 0 ? (openBlock(), createBlock(unref(NEmpty), {
                                  key: 0,
                                  description: "暂无通知",
                                  size: "small",
                                  class: "py-6"
                                })) : (openBlock(), createBlock(unref(NList), {
                                  key: 1,
                                  hoverable: "",
                                  style: { "max-height": "440px", "overflow": "auto" }
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(notifyStore).list, (notification) => {
                                      return openBlock(), createBlock(unref(NListItem), {
                                        key: notification.id
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(NThing), {
                                            title: notification.title
                                          }, {
                                            "header-extra": withCtx(() => [
                                              notification.is_read === 0 ? (openBlock(), createBlock(unref(NTag), {
                                                key: 0,
                                                type: "error",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [..._cache[19] || (_cache[19] = [
                                                  createTextVNode("未读", -1)
                                                ])]),
                                                _: 1
                                              })) : (openBlock(), createBlock(unref(NTag), {
                                                key: 1,
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [..._cache[20] || (_cache[20] = [
                                                  createTextVNode("已读", -1)
                                                ])]),
                                                _: 1
                                              }))
                                            ]),
                                            description: withCtx(() => [
                                              createBaseVNode("div", _hoisted_5, toDisplayString(notification.content), 1),
                                              createBaseVNode("div", _hoisted_6, [
                                                createBaseVNode("span", _hoisted_7, toDisplayString(unref(formatDateTime)(notification.created_at)), 1),
                                                notification.is_read === 0 ? (openBlock(), createBlock(unref(Button), {
                                                  key: 0,
                                                  text: "",
                                                  type: "primary",
                                                  size: "tiny",
                                                  onClick: ($event) => markNotificationRead(notification.id)
                                                }, {
                                                  default: withCtx(() => [..._cache[21] || (_cache[21] = [
                                                    createTextVNode("标为已读", -1)
                                                  ])]),
                                                  _: 1
                                                }, 8, ["onClick"])) : (openBlock(), createBlock(unref(Button), {
                                                  key: 1,
                                                  text: "",
                                                  size: "tiny",
                                                  onClick: ($event) => markNotificationUnread(notification.id)
                                                }, {
                                                  default: withCtx(() => [..._cache[22] || (_cache[22] = [
                                                    createTextVNode("设为未读", -1)
                                                  ])]),
                                                  _: 1
                                                }, 8, ["onClick"]))
                                              ])
                                            ]),
                                            _: 2
                                          }, 1032, ["title"])
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 1
                                }))
                              ]),
                              _: 1
                            }, 8, ["show"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["show"]),
                      unref(isDark) ? (openBlock(), createBlock(unref(Sun), {
                        key: 0,
                        class: "header-icon ml-2",
                        theme: "outline",
                        size: 18,
                        "stroke-width": 3,
                        onClick: unref(toggle)
                      }, null, 8, ["onClick"])) : (openBlock(), createBlock(unref(Moon), {
                        key: 1,
                        class: "header-icon ml-2",
                        theme: "outline",
                        size: 18,
                        "stroke-width": 3,
                        onClick: unref(toggle)
                      }, null, 8, ["onClick"])),
                      createVNode(unref(NDropdown), {
                        options: userMenuOptions,
                        onSelect: handleUserMenuSelect
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NSpace), {
                            align: "center",
                            class: "cursor-pointer ml-2",
                            size: 6
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NAvatar), {
                                round: "",
                                size: "small",
                                style: { background: "#2c5f8a" }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.real_name?.slice(0, 1) ?? "?"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NText), {
                                depth: "2",
                                class: "text-sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.real_name), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(NText), {
                                depth: "3",
                                class: "text-xs"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(authStore).currentUser?.position ?? unref(authStore).currentRole?.name) + " ", 1),
                                  unref(authStore).currentUser?.department ? (openBlock(), createElementBlock("span", _hoisted_8, "· " + toDisplayString(unref(authStore).currentUser.department), 1)) : createCommentVNode("", true)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_sfc_main$2),
              createVNode(unref(NLayoutContent), {
                "content-style": "padding: 0; overflow: auto;",
                style: { "height": "calc(100vh - 52px - 36px)" }
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$3, null, {
                    default: withCtx(() => [
                      createVNode(unref(RouterView), null, {
                        default: withCtx(({ Component, route: currentRoute }) => [
                          (openBlock(), createBlock(KeepAlive, {
                            include: unref(tabsStore).cached
                          }, [
                            (openBlock(), createBlock(resolveDynamicComponent(Component), {
                              key: currentRoute.path
                            }))
                          ], 1032, ["include"]))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(unref(NModal), {
            show: showChangePwModal.value,
            "onUpdate:show": _cache[8] || (_cache[8] = ($event) => showChangePwModal.value = $event),
            title: "修改密码",
            preset: "card",
            style: { "width": "420px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[7] || (_cache[7] = ($event) => showChangePwModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[23] || (_cache[23] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: changingPw.value,
                    onClick: handleChangePassword
                  }, {
                    default: withCtx(() => [..._cache[24] || (_cache[24] = [
                      createTextVNode("确认修改", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: pwForm.value,
                "label-placement": "left",
                "label-width": "90"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "原密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.oldPassword,
                        "onUpdate:value": _cache[4] || (_cache[4] = ($event) => pwForm.value.oldPassword = $event),
                        type: "password",
                        "show-password-on": "click"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "新密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.newPassword,
                        "onUpdate:value": _cache[5] || (_cache[5] = ($event) => pwForm.value.newPassword = $event),
                        type: "password",
                        "show-password-on": "click",
                        placeholder: "至少6位"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "确认新密码",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: pwForm.value.confirmPassword,
                        "onUpdate:value": _cache[6] || (_cache[6] = ($event) => pwForm.value.confirmPassword = $event),
                        type: "password",
                        "show-password-on": "click"
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showAlarmModal.value,
            "onUpdate:show": _cache[9] || (_cache[9] = ($event) => showAlarmModal.value = $event),
            preset: "card",
            style: { "width": "420px" },
            closable: false,
            "mask-closable": false
          }, {
            header: withCtx(() => [
              createVNode(unref(NSpace), { align: "center" }, {
                default: withCtx(() => [
                  createVNode(unref(AlarmClock), {
                    theme: "outline",
                    size: 22,
                    "stroke-width": 3,
                    style: { "color": "#f0a020" }
                  }),
                  _cache[25] || (_cache[25] = createBaseVNode("span", { class: "font-bold text-base" }, "任务提醒", -1)),
                  alarmQueue.value.length > 1 ? (openBlock(), createBlock(unref(NText), {
                    key: 0,
                    depth: "3",
                    class: "text-xs"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("（还有 " + toDisplayString(alarmQueue.value.length - 1) + " 条待处理）", 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), { onClick: dismissCurrentAlarm }, {
                    default: withCtx(() => [..._cache[26] || (_cache[26] = [
                      createTextVNode("稍后提醒", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    onClick: markCurrentAlarmDone
                  }, {
                    default: withCtx(() => [..._cache[27] || (_cache[27] = [
                      createTextVNode("已完成，不再提醒", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              currentAlarm.value ? (openBlock(), createElementBlock("div", _hoisted_9, [
                createBaseVNode("div", _hoisted_10, toDisplayString(currentAlarm.value.title), 1),
                currentAlarm.value.description ? (openBlock(), createElementBlock("div", _hoisted_11, toDisplayString(currentAlarm.value.description), 1)) : createCommentVNode("", true),
                createBaseVNode("div", _hoisted_12, [
                  createTextVNode(" 提醒时间：" + toDisplayString(currentAlarm.value.remind_date) + " " + toDisplayString(currentAlarm.value.remind_at) + " ", 1),
                  currentAlarm.value.repeat_type !== "none" ? (openBlock(), createElementBlock("span", _hoisted_13, "（重复提醒）")) : createCommentVNode("", true)
                ])
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["show"]),
          createVNode(unref(NModal), {
            show: showQuickReminderModal.value,
            "onUpdate:show": _cache[15] || (_cache[15] = ($event) => showQuickReminderModal.value = $event),
            title: "快速新建提醒",
            preset: "card",
            style: { "width": "420px" }
          }, {
            footer: withCtx(() => [
              createVNode(unref(NSpace), { justify: "end" }, {
                default: withCtx(() => [
                  createVNode(unref(Button), {
                    onClick: _cache[14] || (_cache[14] = ($event) => showQuickReminderModal.value = false)
                  }, {
                    default: withCtx(() => [..._cache[28] || (_cache[28] = [
                      createTextVNode("取消", -1)
                    ])]),
                    _: 1
                  }),
                  createVNode(unref(Button), {
                    type: "primary",
                    loading: quickSubmitting.value,
                    onClick: saveQuickReminder
                  }, {
                    default: withCtx(() => [..._cache[29] || (_cache[29] = [
                      createTextVNode("创建", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              })
            ]),
            default: withCtx(() => [
              createVNode(unref(NForm), {
                model: quickReminderForm.value,
                "label-placement": "left",
                "label-width": "80"
              }, {
                default: withCtx(() => [
                  createVNode(unref(NFormItem), {
                    label: "任务标题",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NInput), {
                        value: quickReminderForm.value.title,
                        "onUpdate:value": _cache[10] || (_cache[10] = ($event) => quickReminderForm.value.title = $event),
                        placeholder: "如：巡查3楼、护理王大爷...",
                        maxlength: "60",
                        "show-count": ""
                      }, null, 8, ["value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒日期",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NDatePicker), {
                        "formatted-value": quickReminderForm.value.remind_date,
                        "onUpdate:formattedValue": _cache[11] || (_cache[11] = ($event) => quickReminderForm.value.remind_date = $event),
                        "value-format": "yyyy-MM-dd",
                        type: "date",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(NFormItem), {
                    label: "提醒时间",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NTimePicker), {
                        "formatted-value": quickReminderForm.value.remind_at,
                        "onUpdate:formattedValue": _cache[12] || (_cache[12] = ($event) => quickReminderForm.value.remind_at = $event),
                        "value-format": "HH:mm",
                        format: "HH:mm",
                        style: { "width": "100%" }
                      }, null, 8, ["formatted-value"])
                    ]),
                    _: 1
                  }),
                  canAssignReminder.value ? (openBlock(), createBlock(unref(NFormItem), {
                    key: 0,
                    label: "提醒谁"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSelect), {
                        value: quickReminderForm.value.assignee_id,
                        "onUpdate:value": _cache[13] || (_cache[13] = ($event) => quickReminderForm.value.assignee_id = $event),
                        options: userOptionsForQuick.value,
                        filterable: "",
                        placeholder: "默认提醒自己"
                      }, null, 8, ["value", "options"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["model"])
            ]),
            _: 1
          }, 8, ["show"])
        ]),
        _: 1
      });
    };
  }
});
const DefaultLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a432b76"]]);
export {
  DefaultLayout as default
};
