const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./LoginView-D_6jCg77.js","./vendor-vue-Hc3ejqjp.js","./vendor-naive-sdNTCZPI.js","./_plugin-vue_export-helper-1tPrXgE0.js","./vendor-query-CFvMrhIw.js","./vendor-echarts-DEbY5nl3.js","./LoginView-CYvzn3jf.css","./DefaultLayout-DV23jeR6.js","./notification.store-B8v7vQtJ.js","./validators-BfKhytEl.js","./vendor-utils-DD6FGs_H.js","./AnimFade.vue_vue_type_script_setup_true_lang-D8GJYF9W.js","./announcement.store-bGZtKrzW.js","./useAutoRefresh-BeuDS8Br.js","./DefaultLayout-COyndxzz.css","./DashboardView-DRfAGSxy.js","./elderly.store-isfnimJX.js","./building.store-ZepJ20td.js","./contract.store-D4-s-5Zg.js","./BaseChart.vue_vue_type_script_setup_true_lang-CDtSpnW2.js","./BasePage.vue_vue_type_script_setup_true_lang-CoKRdyPV.js","./format-o5PpBUQO.js","./usePageRefresh-Wnx_lW1d.js","./ElderlyListView-lS0f7gL7.js","./BaseTable.vue_vue_type_script_setup_true_lang-Kf6svQhn.js","./BaseEmpty.vue_vue_type_script_setup_true_lang-DsPzI4fz.js","./ElderlyDetailView-H7w5rz5O.js","./BedManageView-Clj1UqH8.js","./AdmissionView-DPQRSSyv.js","./CareView-CcXQSgBR.js","./HealthView-D1Bswdha.js","./health.store-B_Sa4TVa.js","./FeeView-CqjZvrYb.js","./fee.store-hhm9SzRA.js","./MealView-CSvHTTH1.js","./meal.store-8tS4lhc2.js","./NutritionView-DlLhkk_U.js","./ActivityView-CLw60svU.js","./ExamView-Bxhzna9t.js","./ContractView-BPB9gO3R.js","./ReportView-DPChPc88.js","./ClockView-rhPcERnk.js","./attendance.store-Bl1he8rD.js","./ClockView-Cb2qUJy9.css","./ScheduleView-D0Wzl-1G.js","./user.store-CgFXZFBa.js","./role.store-USVCZhNx.js","./ScheduleView-NDHmLZyd.css","./LeaveView-b9C7nhXj.js","./AttendanceReportView-D5BS0x58.js","./DeviceView-CfsHTJU6.js","./PurchaseView-15Y1Mciz.js","./OperationsView-B2peeFgU.js","./UserManageView-BYVdYUQz.js","./RoleManageView-B5lyrW2c.js","./permission-group.store-BQM4KYx1.js","./PermissionGroupManageView-DG8Uqy0v.js","./AnnouncementManageView-CZwij4ey.js","./AnnouncementManageView-TO1uH7JY.css","./SettingsView-bxOmhDv4.js","./SyncView-9ofBWkwL.js","./TaskReminderView-C1EAUiwG.js","./TaskReminderView-CXv1CuJq.css","./NotFoundView-D_-5_-sU.js"])))=>i.map(i=>d[i]);
import { O as getCurrentScope, P as onScopeDispose, I as onUnmounted, w as watch, g as getCurrentInstance, z as shallowRef, c as computed, N as toValue, u as unref, o as onMounted, l as defineComponent, Q as useSlots, q as h$1, F as Fragment, R as toRaw, r as ref, e as reactive, f as inject, S as defineStore, U as createBlock, V as openBlock, W as withCtx, X as createVNode, Y as RouterView, Z as createRouter, _ as createWebHashHistory, $ as createApp, a0 as createPinia } from "./vendor-vue-Hc3ejqjp.js";
import { Q as QueryClient, V as VueQueryPlugin } from "./vendor-query-CFvMrhIw.js";
import "./vendor-echarts-DEbY5nl3.js";
import { d as darkTheme, a as dateZhCN, z as zhCN, N as NConfigProvider, b as NGlobalStyle, c as NMessageProvider, e as NNotificationProvider, f as NDialogProvider } from "./vendor-naive-sdNTCZPI.js";
function isPlainObject(value2) {
  if (value2 === null || typeof value2 !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value2);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value2) {
    return false;
  }
  if (Symbol.toStringTag in value2) {
    return Object.prototype.toString.call(value2) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value2 = baseObject[key];
    if (value2 === null || value2 === void 0) {
      continue;
    }
    if (merger && merger(object, key, value2, namespace)) {
      continue;
    }
    if (Array.isArray(value2) && Array.isArray(object[key])) {
      object[key] = [...value2, ...object[key]];
    } else if (isPlainObject(value2) && isPlainObject(object[key])) {
      object[key] = _defu(
        value2,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value2;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c2) => _defu(p, c2, "", merger), {})
  );
}
const defu = createDefu();
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const notNullish = (val) => val != null;
const toString$1 = Object.prototype.toString;
const isObject$2 = (val) => toString$1.call(val) === "[object Object]";
const noop$3 = () => {
};
function toArray$1(value2) {
  return Array.isArray(value2) ? value2 : [value2];
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
function tryOnUnmounted(fn, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    onUnmounted(fn, target);
}
function watchImmediate(source, cb2, options) {
  return watch(
    source,
    cb2,
    {
      ...options,
      immediate: true
    }
  );
}
const defaultWindow = isClient ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test2 = toArray$1(toValue(args[0])).filter((e) => e != null);
    return test2.every((e) => typeof e !== "string") ? test2 : void 0;
  });
  const stopWatch = watchImmediate(
    () => {
      var _a, _b;
      return [
        (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
        toArray$1(toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray$1(unref(firstParamTargets.value ? args[2] : args[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    },
    ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
        return;
      const optionsClone = isObject$2(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(
        ...raw_targets.flatMap(
          (el) => raw_events.flatMap(
            (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
          )
        )
      );
    },
    { flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(cleanup);
  return stop;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = shallowRef(false);
  const instance = getCurrentInstance();
  if (instance) {
    onMounted(() => {
      isMounted.value = true;
    }, instance);
  }
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = "0px",
    threshold = 0,
    window: window2 = defaultWindow,
    immediate = true
  } = options;
  const isSupported = /* @__PURE__ */ useSupported(() => window2 && "IntersectionObserver" in window2);
  const targets = computed(() => {
    const _target = toValue(target);
    return toArray$1(_target).map(unrefElement).filter(notNullish);
  });
  let cleanup = noop$3;
  const isActive = shallowRef(immediate);
  const stopWatch = isSupported.value ? watch(
    () => [targets.value, unrefElement(root), isActive.value],
    ([targets2, root2]) => {
      cleanup();
      if (!isActive.value)
        return;
      if (!targets2.length)
        return;
      const observer = new IntersectionObserver(
        callback,
        {
          root: unrefElement(root2),
          rootMargin,
          threshold
        }
      );
      targets2.forEach((el) => el && observer.observe(el));
      cleanup = () => {
        observer.disconnect();
        cleanup = noop$3;
      };
    },
    { immediate, flush: "post" }
  ) : noop$3;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop
  };
}
const defaultTimestep = 1 / 60 * 1e3;
const getCurrentTime = typeof performance !== "undefined" ? () => performance.now() : () => Date.now();
const onNextFrame = typeof window !== "undefined" ? (callback) => window.requestAnimationFrame(callback) : (callback) => setTimeout(() => callback(getCurrentTime()), defaultTimestep);
function createRenderStep(runNextFrame2) {
  let toRun = [];
  let toRunNextFrame = [];
  let numToRun = 0;
  let isProcessing2 = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  const step = {
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing2;
      const buffer = addToCurrentFrame ? toRun : toRunNextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (buffer.indexOf(callback) === -1) {
        buffer.push(callback);
        if (addToCurrentFrame && isProcessing2)
          numToRun = toRun.length;
      }
      return callback;
    },
    cancel: (callback) => {
      const index = toRunNextFrame.indexOf(callback);
      if (index !== -1)
        toRunNextFrame.splice(index, 1);
      toKeepAlive.delete(callback);
    },
    process: (frameData) => {
      if (isProcessing2) {
        flushNextFrame = true;
        return;
      }
      isProcessing2 = true;
      [toRun, toRunNextFrame] = [toRunNextFrame, toRun];
      toRunNextFrame.length = 0;
      numToRun = toRun.length;
      if (numToRun) {
        for (let i = 0; i < numToRun; i++) {
          const callback = toRun[i];
          callback(frameData);
          if (toKeepAlive.has(callback)) {
            step.schedule(callback);
            runNextFrame2();
          }
        }
      }
      isProcessing2 = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
let useDefaultElapsed = true;
let runNextFrame = false;
let isProcessing = false;
const frame = {
  delta: 0,
  timestamp: 0
};
const stepsOrder = [
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
];
const steps = stepsOrder.reduce((acc, key) => {
  acc[key] = createRenderStep(() => runNextFrame = true);
  return acc;
}, {});
const sync = stepsOrder.reduce((acc, key) => {
  const step = steps[key];
  acc[key] = (process2, keepAlive = false, immediate = false) => {
    if (!runNextFrame)
      startLoop();
    return step.schedule(process2, keepAlive, immediate);
  };
  return acc;
}, {});
const cancelSync = stepsOrder.reduce((acc, key) => {
  acc[key] = steps[key].cancel;
  return acc;
}, {});
stepsOrder.reduce((acc, key) => {
  acc[key] = () => steps[key].process(frame);
  return acc;
}, {});
const processStep = (stepId) => steps[stepId].process(frame);
const processFrame = (timestamp) => {
  runNextFrame = false;
  frame.delta = useDefaultElapsed ? defaultTimestep : Math.max(Math.min(timestamp - frame.timestamp, maxElapsed), 1);
  frame.timestamp = timestamp;
  isProcessing = true;
  stepsOrder.forEach(processStep);
  isProcessing = false;
  if (runNextFrame) {
    useDefaultElapsed = false;
    onNextFrame(processFrame);
  }
};
const startLoop = () => {
  runNextFrame = true;
  useDefaultElapsed = true;
  if (!isProcessing)
    onNextFrame(processFrame);
};
const getFrameData = () => frame;
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
var invariant = function() {
};
const clamp$1 = (min, max, v) => Math.min(Math.max(v, min), max);
const safeMin = 1e-3;
const minDuration = 0.01;
const maxDuration = 10;
const minDamping = 0.05;
const maxDamping = 1;
function findSpring({ duration: duration2 = 800, bounce = 0.25, velocity = 0, mass = 1 }) {
  let envelope;
  let derivative;
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp$1(minDamping, maxDamping, dampingRatio);
  duration2 = clamp$1(minDuration, maxDuration, duration2 / 1e3);
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration2;
      const a2 = exponentialDecay - velocity;
      const b2 = calcAngularFreq(undampedFreq2, dampingRatio);
      const c2 = Math.exp(-delta);
      return safeMin - a2 / b2 * c2;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration2;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration2;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration2);
      const b2 = (undampedFreq2 - velocity) * duration2 + 1;
      return -safeMin + a2 * b2;
    };
    derivative = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration2);
      const b2 = (velocity - undampedFreq2) * (duration2 * duration2);
      return a2 * b2;
    };
  }
  const initialGuess = 5 / duration2;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration2 = duration2 * 1e3;
  if (isNaN(undampedFreq)) {
    return {
      stiffness: 100,
      damping: 10,
      duration: duration2
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration: duration2
    };
  }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = Object.assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: false }, options);
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    const derived = findSpring(options);
    springOptions = Object.assign(Object.assign(Object.assign({}, springOptions), derived), { velocity: 0, mass: 1 });
    springOptions.isResolvedFromDuration = true;
  }
  return springOptions;
}
function spring(_a) {
  var { from = 0, to = 1, restSpeed = 2, restDelta } = _a, options = __rest(_a, ["from", "to", "restSpeed", "restDelta"]);
  const state = { done: false, value: from };
  let { stiffness, damping, mass, velocity, duration: duration2, isResolvedFromDuration } = getSpringOptions(options);
  let resolveSpring = zero$1;
  let resolveVelocity = zero$1;
  function createSpring() {
    const initialVelocity = velocity ? -(velocity / 1e3) : 0;
    const initialDelta = to - from;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1e3;
    if (restDelta === void 0) {
      restDelta = Math.min(Math.abs(to - from) / 100, 0.4);
    }
    if (dampingRatio < 1) {
      const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      };
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return dampingRatio * undampedAngularFreq * envelope * (Math.sin(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq + initialDelta * Math.cos(angularFreq * t)) - envelope * (Math.cos(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) - angularFreq * initialDelta * Math.sin(angularFreq * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t) => to - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
    }
  }
  createSpring();
  return {
    next: (t) => {
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        const currentVelocity = resolveVelocity(t) * 1e3;
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(to - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state.done = t >= duration2;
      }
      state.value = state.done ? to : current;
      return state;
    },
    flipTarget: () => {
      velocity = -velocity;
      [from, to] = [to, from];
      createSpring();
    }
  };
}
spring.needsInterpolation = (a2, b2) => typeof a2 === "string" || typeof b2 === "string";
const zero$1 = (_t) => 0;
const progress = (from, to, value2) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value2 - from) / toFromDifference;
};
const mix$1 = (from, to, progress2) => -progress2 * from + progress2 * to + from;
const clamp = (min, max) => (v) => Math.max(Math.min(v, max), min);
const sanitize = (v) => v % 1 ? Number(v.toFixed(5)) : v;
const floatRegex = /(-)?([\d]*\.?[\d])+/g;
const colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi;
const singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function isString$1(v) {
  return typeof v === "string";
}
const number$2 = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = Object.assign(Object.assign({}, number$2), { transform: clamp(0, 1) });
const scale = Object.assign(Object.assign({}, number$2), { default: 1 });
const createUnitType = (unit) => ({
  test: (v) => isString$1(v) && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = createUnitType("deg");
const percent$1 = createUnitType("%");
const px$1 = createUnitType("px");
const progressPercentage = Object.assign(Object.assign({}, percent$1), { parse: (v) => percent$1.parse(v) / 100, transform: (v) => percent$1.transform(v * 100) });
const isColorString = (type, testProp) => (v) => {
  return Boolean(isString$1(v) && singleColorRegex.test(v) && v.startsWith(type) || testProp && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (!isString$1(v))
    return v;
  const [a2, b2, c2, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a2),
    [bName]: parseFloat(b2),
    [cName]: parseFloat(c2),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const hsla = {
  test: isColorString("hsl", "hue"),
  parse: splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent$1.transform(sanitize(saturation)) + ", " + percent$1.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const clampRgbUnit = clamp(0, 255);
const rgbUnit = Object.assign(Object.assign({}, number$2), { transform: (v) => Math.round(clampRgbUnit(v)) });
const rgba = {
  test: isColorString("rgb", "red"),
  parse: splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "";
  let g = "";
  let b2 = "";
  let a2 = "";
  if (v.length > 5) {
    r = v.substr(1, 2);
    g = v.substr(3, 2);
    b2 = v.substr(5, 2);
    a2 = v.substr(7, 2);
  } else {
    r = v.substr(1, 1);
    g = v.substr(2, 1);
    b2 = v.substr(3, 1);
    a2 = v.substr(4, 1);
    r += r;
    g += g;
    b2 += b2;
    a2 += a2;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b2, 16),
    alpha: a2 ? parseInt(a2, 16) / 255 : 1
  };
}
const hex = {
  test: isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return isString$1(v) ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  }
};
const colorToken = "${c}";
const numberToken = "${n}";
function test(v) {
  var _a, _b, _c, _d;
  return isNaN(v) && isString$1(v) && ((_b = (_a = v.match(floatRegex)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = v.match(colorRegex)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0;
}
function analyse$1(v) {
  if (typeof v === "number")
    v = `${v}`;
  const values = [];
  let numColors = 0;
  const colors2 = v.match(colorRegex);
  if (colors2) {
    numColors = colors2.length;
    v = v.replace(colorRegex, colorToken);
    values.push(...colors2.map(color.parse));
  }
  const numbers = v.match(floatRegex);
  if (numbers) {
    v = v.replace(floatRegex, numberToken);
    values.push(...numbers.map(number$2.parse));
  }
  return { values, numColors, tokenised: v };
}
function parse$P(v) {
  return analyse$1(v).values;
}
function createTransformer(v) {
  const { values, numColors, tokenised } = analyse$1(v);
  const numValues = values.length;
  return (v2) => {
    let output = tokenised;
    for (let i = 0; i < numValues; i++) {
      output = output.replace(i < numColors ? colorToken : numberToken, i < numColors ? color.transform(v2[i]) : sanitize(v2[i]));
    }
    return output;
  };
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : v;
function getAnimatableNone$1(v) {
  const parsed = parse$P(v);
  const transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}
const complex = { test, parse: parse$P, createTransformer, getAnimatableNone: getAnimatableNone$1 };
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  let [name2, value2] = v.slice(0, -1).split("(");
  if (name2 === "drop-shadow")
    return v;
  const [number2] = value2.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value2.replace(number2, "");
  let defaultValue = maxDefaults.has(name2) ? 1 : 0;
  if (number2 !== value2)
    defaultValue *= 100;
  return name2 + "(" + defaultValue + unit + ")";
}
const functionRegex = /([a-z-]*)\(.*?\)/g;
const filter = Object.assign(Object.assign({}, complex), { getAnimatableNone: (v) => {
  const functions = v.match(functionRegex);
  return functions ? functions.map(applyDefaultFilter).join(" ") : v;
} });
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const toExpo = to * to;
  return Math.sqrt(Math.max(0, v * (toExpo - fromExpo) + fromExpo));
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
const mixColor$1 = (from, to) => {
  let fromColorType = getColorType(from);
  let toColorType = getColorType(to);
  let fromColor = fromColorType.parse(from);
  let toColor = toColorType.parse(to);
  if (fromColorType === hsla) {
    fromColor = hslaToRgba(fromColor);
    fromColorType = rgba;
  }
  if (toColorType === hsla) {
    toColor = hslaToRgba(toColor);
    toColorType = rgba;
  }
  const blended = Object.assign({}, fromColor);
  return (v) => {
    for (const key in blended) {
      if (key !== "alpha") {
        blended[key] = mixLinearColor(fromColor[key], toColor[key], v);
      }
    }
    blended.alpha = mix$1(fromColor.alpha, toColor.alpha, v);
    return fromColorType.transform(blended);
  };
};
const isNum = (v) => typeof v === "number";
const combineFunctions = (a2, b2) => (v) => b2(a2(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
function getMixer(origin, target) {
  if (isNum(origin)) {
    return (v) => mix$1(origin, target, v);
  } else if (color.test(origin)) {
    return mixColor$1(origin, target);
  } else {
    return mixComplex(origin, target);
  }
}
const mixArray = (from, to) => {
  const output = [...from];
  const numValues = output.length;
  const blendValue = from.map((fromThis, i) => getMixer(fromThis, to[i]));
  return (v) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](v);
    }
    return output;
  };
};
const mixObject = (origin, target) => {
  const output = Object.assign(Object.assign({}, origin), target);
  const blendValue = {};
  for (const key in output) {
    if (origin[key] !== void 0 && target[key] !== void 0) {
      blendValue[key] = getMixer(origin[key], target[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
};
function analyse(value2) {
  const parsed = complex.parse(value2);
  const numValues = parsed.length;
  let numNumbers = 0;
  let numRGB = 0;
  let numHSL = 0;
  for (let i = 0; i < numValues; i++) {
    if (numNumbers || typeof parsed[i] === "number") {
      numNumbers++;
    } else {
      if (parsed[i].hue !== void 0) {
        numHSL++;
      } else {
        numRGB++;
      }
    }
  }
  return { parsed, numNumbers, numRGB, numHSL };
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyse(origin);
  const targetStats = analyse(target);
  const canInterpolate = originStats.numHSL === targetStats.numHSL && originStats.numRGB === targetStats.numRGB && originStats.numNumbers >= targetStats.numNumbers;
  if (canInterpolate) {
    return pipe(mixArray(originStats.parsed, targetStats.parsed), template);
  } else {
    return (p) => `${p > 0 ? target : origin}`;
  }
};
const mixNumber = (from, to) => (p) => mix$1(from, to, p);
function detectMixerFactory(v) {
  if (typeof v === "number") {
    return mixNumber;
  } else if (typeof v === "string") {
    if (color.test(v)) {
      return mixColor$1;
    } else {
      return mixComplex;
    }
  } else if (Array.isArray(v)) {
    return mixArray;
  } else if (typeof v === "object") {
    return mixObject;
  }
}
function createMixers(output, ease, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || detectMixerFactory(output[0]);
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease) {
      const easingFunction = Array.isArray(ease) ? ease[i] : ease;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function fastInterpolate([from, to], [mixer]) {
  return (v) => mixer(progress(from, to, v));
}
function slowInterpolate(input, mixers) {
  const inputLength = input.length;
  const lastInputIndex = inputLength - 1;
  return (v) => {
    let mixerIndex = 0;
    let foundMixerIndex = false;
    if (v <= input[0]) {
      foundMixerIndex = true;
    } else if (v >= input[lastInputIndex]) {
      mixerIndex = lastInputIndex - 1;
      foundMixerIndex = true;
    }
    if (!foundMixerIndex) {
      let i = 1;
      for (; i < inputLength; i++) {
        if (input[i] > v || i === lastInputIndex) {
          break;
        }
      }
      mixerIndex = i - 1;
    }
    const progressInRange = progress(input[mixerIndex], input[mixerIndex + 1], v);
    return mixers[mixerIndex](progressInRange);
  };
}
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  invariant(!ease || !Array.isArray(ease) || ease.length === inputLength - 1);
  if (input[0] > input[inputLength - 1]) {
    input = [].concat(input);
    output = [].concat(output);
    input.reverse();
    output.reverse();
  }
  const mixers = createMixers(output, ease, mixer);
  const interpolator = inputLength === 2 ? fastInterpolate(input, mixers) : slowInterpolate(input, mixers);
  return isClamp ? (v) => interpolator(clamp$1(input[0], input[inputLength - 1], v)) : interpolator;
}
const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const createExpoIn = (power) => (p) => Math.pow(p, power);
const createBackIn = (power) => (p) => p * p * ((power + 1) * p - power);
const createAnticipate = (power) => {
  const backEasing = createBackIn(power);
  return (p) => (p *= 2) < 1 ? 0.5 * backEasing(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
};
const DEFAULT_OVERSHOOT_STRENGTH = 1.525;
const BOUNCE_FIRST_THRESHOLD = 4 / 11;
const BOUNCE_SECOND_THRESHOLD = 8 / 11;
const BOUNCE_THIRD_THRESHOLD = 9 / 10;
const linear = (p) => p;
const easeIn = createExpoIn(2);
const easeOut = reverseEasing(easeIn);
const easeInOut = mirrorEasing(easeIn);
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circOut);
const backIn = createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
const backOut = reverseEasing(backIn);
const backInOut = mirrorEasing(backIn);
const anticipate = createAnticipate(DEFAULT_OVERSHOOT_STRENGTH);
const ca = 4356 / 361;
const cb = 35442 / 1805;
const cc = 16061 / 1805;
const bounceOut = (p) => {
  if (p === 1 || p === 0)
    return p;
  const p2 = p * p;
  return p < BOUNCE_FIRST_THRESHOLD ? 7.5625 * p2 : p < BOUNCE_SECOND_THRESHOLD ? 9.075 * p2 - 9.9 * p + 3.4 : p < BOUNCE_THIRD_THRESHOLD ? ca * p2 - cb * p + cc : 10.8 * p * p - 20.52 * p + 10.72;
};
const bounceIn = reverseEasing(bounceOut);
const bounceInOut = (p) => p < 0.5 ? 0.5 * (1 - bounceOut(1 - p * 2)) : 0.5 * bounceOut(p * 2 - 1) + 0.5;
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function defaultOffset(values) {
  const numValues = values.length;
  return values.map((_value, i) => i !== 0 ? i / (numValues - 1) : 0);
}
function convertOffsetToTimes(offset, duration2) {
  return offset.map((o) => o * duration2);
}
function keyframes$1({ from = 0, to = 1, ease, offset, duration: duration2 = 300 }) {
  const state = { done: false, value: from };
  const values = Array.isArray(to) ? to : [from, to];
  const times = convertOffsetToTimes(offset && offset.length === values.length ? offset : defaultOffset(values), duration2);
  function createInterpolator() {
    return interpolate(times, values, {
      ease: Array.isArray(ease) ? ease : defaultEasing(values, ease)
    });
  }
  let interpolator = createInterpolator();
  return {
    next: (t) => {
      state.value = interpolator(t);
      state.done = t >= duration2;
      return state;
    },
    flipTarget: () => {
      values.reverse();
      interpolator = createInterpolator();
    }
  };
}
function decay({ velocity = 0, from = 0, power = 0.8, timeConstant = 350, restDelta = 0.5, modifyTarget }) {
  const state = { done: false, value: from };
  let amplitude = power * velocity;
  const ideal = from + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - from;
  return {
    next: (t) => {
      const delta = -amplitude * Math.exp(-t / timeConstant);
      state.done = !(delta > restDelta || delta < -restDelta);
      state.value = state.done ? target : target + delta;
      return state;
    },
    flipTarget: () => {
    }
  };
}
const types = { keyframes: keyframes$1, spring, decay };
function detectAnimationFromOptions(config) {
  if (Array.isArray(config.to)) {
    return keyframes$1;
  } else if (types[config.type]) {
    return types[config.type];
  }
  const keys = new Set(Object.keys(config));
  if (keys.has("ease") || keys.has("duration") && !keys.has("dampingRatio")) {
    return keyframes$1;
  } else if (keys.has("dampingRatio") || keys.has("stiffness") || keys.has("mass") || keys.has("damping") || keys.has("restSpeed") || keys.has("restDelta")) {
    return spring;
  }
  return keyframes$1;
}
function loopElapsed(elapsed, duration2, delay = 0) {
  return elapsed - duration2 - delay;
}
function reverseElapsed(elapsed, duration2, delay = 0, isForwardPlayback = true) {
  return isForwardPlayback ? loopElapsed(duration2 + -elapsed, duration2, delay) : duration2 - (elapsed - duration2) + delay;
}
function hasRepeatDelayElapsed(elapsed, duration2, delay, isForwardPlayback) {
  return isForwardPlayback ? elapsed >= duration2 + delay : elapsed <= -delay;
}
const framesync = (update) => {
  const passTimestamp = ({ delta }) => update(delta);
  return {
    start: () => sync.update(passTimestamp, true),
    stop: () => cancelSync.update(passTimestamp)
  };
};
function animate(_a) {
  var _b, _c;
  var { from, autoplay = true, driver = framesync, elapsed = 0, repeat: repeatMax = 0, repeatType = "loop", repeatDelay = 0, onPlay, onStop, onComplete, onRepeat, onUpdate } = _a, options = __rest(_a, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  let { to } = options;
  let driverControls;
  let repeatCount = 0;
  let computedDuration = options.duration;
  let latest;
  let isComplete = false;
  let isForwardPlayback = true;
  let interpolateFromNumber;
  const animator = detectAnimationFromOptions(options);
  if ((_c = (_b = animator).needsInterpolation) === null || _c === void 0 ? void 0 : _c.call(_b, from, to)) {
    interpolateFromNumber = interpolate([0, 100], [from, to], {
      clamp: false
    });
    from = 0;
    to = 100;
  }
  const animation = animator(Object.assign(Object.assign({}, options), { from, to }));
  function repeat() {
    repeatCount++;
    if (repeatType === "reverse") {
      isForwardPlayback = repeatCount % 2 === 0;
      elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
    } else {
      elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
      if (repeatType === "mirror")
        animation.flipTarget();
    }
    isComplete = false;
    onRepeat && onRepeat();
  }
  function complete() {
    driverControls.stop();
    onComplete && onComplete();
  }
  function update(delta) {
    if (!isForwardPlayback)
      delta = -delta;
    elapsed += delta;
    if (!isComplete) {
      const state = animation.next(Math.max(0, elapsed));
      latest = state.value;
      if (interpolateFromNumber)
        latest = interpolateFromNumber(latest);
      isComplete = isForwardPlayback ? state.done : elapsed <= 0;
    }
    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(latest);
    if (isComplete) {
      if (repeatCount === 0)
        computedDuration !== null && computedDuration !== void 0 ? computedDuration : computedDuration = elapsed;
      if (repeatCount < repeatMax) {
        hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
      } else {
        complete();
      }
    }
  }
  function play() {
    onPlay === null || onPlay === void 0 ? void 0 : onPlay();
    driverControls = driver(update);
    driverControls.start();
  }
  autoplay && play();
  return {
    stop: () => {
      onStop === null || onStop === void 0 ? void 0 : onStop();
      driverControls.stop();
    }
  };
}
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
function inertia({ from = 0, velocity = 0, min, max, power = 0.8, timeConstant = 750, bounceStiffness = 500, bounceDamping = 10, restDelta = 1, modifyTarget, driver, onUpdate, onComplete, onStop }) {
  let currentAnimation;
  function isOutOfBounds(v) {
    return min !== void 0 && v < min || max !== void 0 && v > max;
  }
  function boundaryNearest(v) {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  }
  function startAnimation(options) {
    currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
    currentAnimation = animate(Object.assign(Object.assign({}, options), {
      driver,
      onUpdate: (v) => {
        var _a;
        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(v);
        (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, v);
      },
      onComplete,
      onStop
    }));
  }
  function startSpring(options) {
    startAnimation(Object.assign({ type: "spring", stiffness: bounceStiffness, damping: bounceDamping, restDelta }, options));
  }
  if (isOutOfBounds(from)) {
    startSpring({ from, velocity, to: boundaryNearest(from) });
  } else {
    let target = power * velocity + from;
    if (typeof modifyTarget !== "undefined")
      target = modifyTarget(target);
    const boundary = boundaryNearest(target);
    const heading = boundary === min ? -1 : 1;
    let prev;
    let current;
    const checkBoundary = (v) => {
      prev = current;
      current = v;
      velocity = velocityPerSecond(v - prev, getFrameData().delta);
      if (heading === 1 && v > boundary || heading === -1 && v < boundary) {
        startSpring({ from: v, to: boundary, velocity });
      }
    };
    startAnimation({
      type: "decay",
      from,
      velocity,
      timeConstant,
      power,
      restDelta,
      modifyTarget,
      onUpdate: isOutOfBounds(target) ? checkBoundary : void 0
    });
  }
  return {
    stop: () => currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop()
  };
}
const a = (a1, a2) => 1 - 3 * a2 + 3 * a1;
const b = (a1, a2) => 3 * a2 - 6 * a1;
const c = (a1) => 3 * a1;
const calcBezier = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
const getSlope = (t, a1, a2) => 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 10;
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
const newtonIterations = 8;
const newtonMinSlope = 1e-3;
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (let i = 0; i < newtonIterations; ++i) {
    const currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0) {
      return aGuessT;
    }
    const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}
const kSplineTableSize = 11;
const kSampleStepSize = 1 / (kSplineTableSize - 1);
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return linear;
  const sampleValues = new Float32Array(kSplineTableSize);
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }
  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= newtonMinSlope) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const __vite_import_meta_env__ = {};
const motionState = {};
class SubscriptionManager {
  subscriptions = /* @__PURE__ */ new Set();
  add(handler2) {
    this.subscriptions.add(handler2);
    return () => this.subscriptions.delete(handler2);
  }
  notify(a2, b2, c2) {
    if (!this.subscriptions.size)
      return;
    for (const handler2 of this.subscriptions) handler2(a2, b2, c2);
  }
  clear() {
    this.subscriptions.clear();
  }
}
function isFloat(value2) {
  return !Number.isNaN(Number.parseFloat(value2));
}
class MotionValue {
  /**
   * The current state of the `MotionValue`.
   */
  current;
  /**
   * The previous state of the `MotionValue`.
   */
  prev;
  /**
   * Duration, in milliseconds, since last updating frame.
   */
  timeDelta = 0;
  /**
   * Timestamp of the last time this `MotionValue` was updated.
   */
  lastUpdated = 0;
  /**
   * Functions to notify when the `MotionValue` updates.
   */
  updateSubscribers = new SubscriptionManager();
  /**
   * A reference to the currently-controlling Popmotion animation
   */
  stopAnimation;
  /**
   * Tracks whether this value can output a velocity.
   */
  canTrackVelocity = false;
  /**
   * init - The initiating value
   * config - Optional configuration options
   */
  constructor(init) {
    this.prev = this.current = init;
    this.canTrackVelocity = isFloat(this.current);
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   */
  onChange(subscription) {
    return this.updateSubscribers.add(subscription);
  }
  clearListeners() {
    this.updateSubscribers.clear();
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @param v
   * @param render
   */
  set(v) {
    this.updateAndNotify(v);
  }
  /**
   * Update and notify `MotionValue` subscribers.
   *
   * @param v
   * @param render
   */
  updateAndNotify = (v) => {
    this.prev = this.current;
    this.current = v;
    const { delta, timestamp } = getFrameData();
    if (this.lastUpdated !== timestamp) {
      this.timeDelta = delta;
      this.lastUpdated = timestamp;
    }
    sync.postRender(this.scheduleVelocityCheck);
    this.updateSubscribers.notify(this.current);
  };
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   */
  get() {
    return this.current;
  }
  /**
   * Get previous value.
   *
   * @returns - The previous latest state of `MotionValue`
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   */
  getVelocity() {
    return this.canTrackVelocity ? velocityPerSecond(Number.parseFloat(this.current) - Number.parseFloat(this.prev), this.timeDelta) : 0;
  }
  /**
   * Schedule a velocity check for the next frame.
   */
  scheduleVelocityCheck = () => sync.postRender(this.velocityCheck);
  /**
   * Updates `prev` with `current` if the value hasn't been updated this frame.
   * This ensures velocity calculations return `0`.
   */
  velocityCheck = ({ timestamp }) => {
    if (!this.canTrackVelocity)
      this.canTrackVelocity = isFloat(this.current);
    if (timestamp !== this.lastUpdated)
      this.prev = this.current;
  };
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   */
  start(animation) {
    this.stop();
    return new Promise((resolve) => {
      const { stop } = animation(resolve);
      this.stopAnimation = stop;
    }).then(() => this.clearAnimation());
  }
  /**
   * Stop the currently active animation.
   */
  stop() {
    if (this.stopAnimation)
      this.stopAnimation();
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   */
  isAnimating() {
    return !!this.stopAnimation;
  }
  /**
   * Clear the current animation reference.
   */
  clearAnimation() {
    this.stopAnimation = null;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   */
  destroy() {
    this.updateSubscribers.clear();
    this.stop();
  }
}
function getMotionValue(init) {
  return new MotionValue(init);
}
const { isArray } = Array;
function useMotionValues() {
  const motionValues = ref({});
  const stop = (keys) => {
    const destroyKey = (key) => {
      if (!motionValues.value[key])
        return;
      motionValues.value[key].stop();
      motionValues.value[key].destroy();
      delete motionValues.value[key];
    };
    if (keys) {
      if (isArray(keys)) {
        keys.forEach(destroyKey);
      } else {
        destroyKey(keys);
      }
    } else {
      Object.keys(motionValues.value).forEach(destroyKey);
    }
  };
  const get = (key, from, target) => {
    if (motionValues.value[key])
      return motionValues.value[key];
    const motionValue = getMotionValue(from);
    motionValue.onChange((v) => target[key] = v);
    motionValues.value[key] = motionValue;
    return motionValue;
  };
  tryOnUnmounted(stop);
  return {
    motionValues,
    get,
    stop
  };
}
function isKeyframesTarget(v) {
  return Array.isArray(v);
}
function underDampedSpring() {
  return {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10
  };
}
function criticallyDampedSpring(to) {
  return {
    type: "spring",
    stiffness: 550,
    damping: to === 0 ? 2 * Math.sqrt(550) : 30,
    restDelta: 0.01,
    restSpeed: 10
  };
}
function overDampedSpring(to) {
  return {
    type: "spring",
    stiffness: 550,
    damping: to === 0 ? 100 : 30,
    restDelta: 0.01,
    restSpeed: 10
  };
}
function linearTween() {
  return {
    type: "keyframes",
    ease: "linear",
    duration: 300
  };
}
function keyframes(values) {
  return {
    type: "keyframes",
    duration: 800,
    values
  };
}
const defaultTransitions = {
  default: overDampedSpring,
  x: underDampedSpring,
  y: underDampedSpring,
  z: underDampedSpring,
  rotate: underDampedSpring,
  rotateX: underDampedSpring,
  rotateY: underDampedSpring,
  rotateZ: underDampedSpring,
  scaleX: criticallyDampedSpring,
  scaleY: criticallyDampedSpring,
  scale: criticallyDampedSpring,
  backgroundColor: linearTween,
  color: linearTween,
  opacity: linearTween
};
function getDefaultTransition(valueKey, to) {
  let transitionFactory;
  if (isKeyframesTarget(to)) {
    transitionFactory = keyframes;
  } else {
    transitionFactory = defaultTransitions[valueKey] || defaultTransitions.default;
  }
  return { to, ...transitionFactory(to) };
}
const int = {
  ...number$2,
  transform: Math.round
};
const valueTypes = {
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  borderWidth: px$1,
  borderTopWidth: px$1,
  borderRightWidth: px$1,
  borderBottomWidth: px$1,
  borderLeftWidth: px$1,
  borderRadius: px$1,
  radius: px$1,
  borderTopLeftRadius: px$1,
  borderTopRightRadius: px$1,
  borderBottomRightRadius: px$1,
  borderBottomLeftRadius: px$1,
  // Positioning props
  width: px$1,
  maxWidth: px$1,
  height: px$1,
  maxHeight: px$1,
  size: px$1,
  top: px$1,
  right: px$1,
  bottom: px$1,
  left: px$1,
  // Spacing props
  padding: px$1,
  paddingTop: px$1,
  paddingRight: px$1,
  paddingBottom: px$1,
  paddingLeft: px$1,
  margin: px$1,
  marginTop: px$1,
  marginRight: px$1,
  marginBottom: px$1,
  marginLeft: px$1,
  // Transform props
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px$1,
  translateX: px$1,
  translateY: px$1,
  translateZ: px$1,
  x: px$1,
  y: px$1,
  z: px$1,
  perspective: px$1,
  transformPerspective: px$1,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px$1,
  // Misc
  zIndex: int,
  filter,
  WebkitFilter: filter,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const getValueType = (key) => valueTypes[key];
function getValueAsType(value2, type) {
  return type && typeof value2 === "number" && type.transform ? type.transform(value2) : value2;
}
function getAnimatableNone(key, value2) {
  let defaultValueType = getValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value2) : void 0;
}
const easingLookup = {
  linear,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate,
  bounceIn,
  bounceInOut,
  bounceOut
};
function easingDefinitionToFunction(definition) {
  if (Array.isArray(definition)) {
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (typeof definition === "string") {
    return easingLookup[definition];
  }
  return definition;
}
function isEasingArray(ease) {
  return Array.isArray(ease) && typeof ease[0] !== "number";
}
function isAnimatable(key, value2) {
  if (key === "zIndex")
    return false;
  if (typeof value2 === "number" || Array.isArray(value2))
    return true;
  if (typeof value2 === "string" && complex.test(value2) && !value2.startsWith("url(")) {
    return true;
  }
  return false;
}
function hydrateKeyframes(options) {
  if (Array.isArray(options.to) && options.to[0] === null) {
    options.to = [...options.to];
    options.to[0] = options.from;
  }
  return options;
}
function convertTransitionToAnimationOptions({ ease, times, delay, ...transition }) {
  const options = { ...transition };
  if (times)
    options.offset = times;
  if (ease) {
    options.ease = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
  }
  if (delay)
    options.elapsed = -delay;
  return options;
}
function getPopmotionAnimationOptions(transition, options, key) {
  if (Array.isArray(options.to)) {
    if (!transition.duration)
      transition.duration = 800;
  }
  hydrateKeyframes(options);
  if (!isTransitionDefined(transition)) {
    transition = {
      ...transition,
      ...getDefaultTransition(key, options.to)
    };
  }
  return {
    ...options,
    ...convertTransitionToAnimationOptions(transition)
  };
}
function isTransitionDefined({ delay, repeat, repeatType, repeatDelay, from, ...transition }) {
  return !!Object.keys(transition).length;
}
function getValueTransition(transition, key) {
  return transition[key] || transition.default || transition;
}
function getAnimation(key, value2, target, transition, onComplete) {
  const valueTransition = getValueTransition(transition, key);
  let origin = valueTransition.from === null || valueTransition.from === void 0 ? value2.get() : valueTransition.from;
  const isTargetAnimatable = isAnimatable(key, target);
  if (origin === "none" && isTargetAnimatable && typeof target === "string")
    origin = getAnimatableNone(key, target);
  const isOriginAnimatable = isAnimatable(key, origin);
  function start(complete) {
    const options = {
      from: origin,
      to: target,
      velocity: transition.velocity ? transition.velocity : value2.getVelocity(),
      onUpdate: (v) => value2.set(v)
    };
    return valueTransition.type === "inertia" || valueTransition.type === "decay" ? inertia({ ...options, ...valueTransition }) : animate({
      ...getPopmotionAnimationOptions(valueTransition, options, key),
      onUpdate: (v) => {
        options.onUpdate(v);
        if (valueTransition.onUpdate)
          valueTransition.onUpdate(v);
      },
      onComplete: () => {
        if (onComplete)
          onComplete();
        if (complete)
          complete();
      }
    });
  }
  function set(complete) {
    value2.set(target);
    if (onComplete)
      onComplete();
    if (complete)
      complete();
    return { stop: () => {
    } };
  }
  return !isOriginAnimatable || !isTargetAnimatable || valueTransition.type === false ? set : start;
}
function useMotionTransitions() {
  const { motionValues, stop, get } = useMotionValues();
  const push = (key, value2, target, transition = {}, onComplete) => {
    const from = target[key];
    const motionValue = get(key, from, target);
    if (transition && transition.immediate) {
      motionValue.set(value2);
      return;
    }
    const animation = getAnimation(key, motionValue, value2, transition, onComplete);
    motionValue.start(animation);
  };
  return { motionValues, stop, push };
}
function useMotionControls(motionProperties, variants2 = {}, { motionValues, push, stop } = useMotionTransitions()) {
  const _variants = unref(variants2);
  const isAnimating = ref(false);
  watch(
    motionValues,
    (newVal) => {
      isAnimating.value = Object.values(newVal).filter((value2) => value2.isAnimating()).length > 0;
    },
    {
      immediate: true,
      deep: true
    }
  );
  const getVariantFromKey = (variant) => {
    if (!_variants || !_variants[variant])
      throw new Error(`The variant ${variant} does not exist.`);
    return _variants[variant];
  };
  const apply = (variant) => {
    if (typeof variant === "string")
      variant = getVariantFromKey(variant);
    const animations2 = Object.entries(variant).map(([key, value2]) => {
      if (key === "transition")
        return void 0;
      return new Promise(
        (resolve) => (
          // @ts-expect-error - Fix errors later for typescript 5
          push(key, value2, motionProperties, variant.transition || getDefaultTransition(key, variant[key]), resolve)
        )
      );
    }).filter(Boolean);
    async function waitForComplete() {
      await Promise.all(animations2);
      variant.transition?.onComplete?.();
    }
    return Promise.all([waitForComplete()]);
  };
  const set = (variant) => {
    const variantData = isObject$2(variant) ? variant : getVariantFromKey(variant);
    Object.entries(variantData).forEach(([key, value2]) => {
      if (key === "transition")
        return;
      push(key, value2, motionProperties, {
        immediate: true
      });
    });
  };
  const leave = async (done) => {
    let leaveVariant;
    if (_variants) {
      if (_variants.leave)
        leaveVariant = _variants.leave;
      if (!_variants.leave && _variants.initial)
        leaveVariant = _variants.initial;
    }
    if (!leaveVariant) {
      done();
      return;
    }
    await apply(leaveVariant);
    done();
  };
  return {
    isAnimating,
    apply,
    set,
    leave,
    stop
  };
}
const isBrowser = typeof window !== "undefined";
const supportsPointerEvents = () => isBrowser && (window.onpointerdown === null || __vite_import_meta_env__?.TEST);
const supportsTouchEvents = () => isBrowser && (window.ontouchstart === null || __vite_import_meta_env__?.TEST);
const supportsMouseEvents = () => isBrowser && (window.onmousedown === null || __vite_import_meta_env__?.TEST);
function registerEventListeners({ target, state, variants: variants2, apply }) {
  const _variants = unref(variants2);
  const hovered = ref(false);
  const tapped = ref(false);
  const focused = ref(false);
  const mutableKeys = computed(() => {
    let result = [...Object.keys(state.value || {})];
    if (!_variants)
      return result;
    if (_variants.hovered)
      result = [...result, ...Object.keys(_variants.hovered)];
    if (_variants.tapped)
      result = [...result, ...Object.keys(_variants.tapped)];
    if (_variants.focused)
      result = [...result, ...Object.keys(_variants.focused)];
    return result;
  });
  const computedProperties = computed(() => {
    const result = {};
    Object.assign(result, state.value);
    if (hovered.value && _variants.hovered)
      Object.assign(result, _variants.hovered);
    if (tapped.value && _variants.tapped)
      Object.assign(result, _variants.tapped);
    if (focused.value && _variants.focused)
      Object.assign(result, _variants.focused);
    for (const key in result) {
      if (!mutableKeys.value.includes(key))
        delete result[key];
    }
    return result;
  });
  if (_variants.hovered) {
    useEventListener(target, "mouseenter", () => hovered.value = true);
    useEventListener(target, "mouseleave", () => {
      hovered.value = false;
      tapped.value = false;
    });
  }
  if (_variants.tapped) {
    if (supportsMouseEvents()) {
      useEventListener(target, "mousedown", () => tapped.value = true);
      useEventListener(target, "mouseup", () => tapped.value = false);
    }
    if (supportsPointerEvents()) {
      useEventListener(target, "pointerdown", () => tapped.value = true);
      useEventListener(target, "pointerup", () => tapped.value = false);
    }
    if (supportsTouchEvents()) {
      useEventListener(target, "touchstart", () => tapped.value = true);
      useEventListener(target, "touchend", () => tapped.value = false);
    }
  }
  if (_variants.focused) {
    useEventListener(target, "focus", () => focused.value = true);
    useEventListener(target, "blur", () => focused.value = false);
  }
  watch([hovered, tapped, focused], () => {
    apply(computedProperties.value);
  });
}
function registerLifeCycleHooks({ set, target, variants: variants2, variant }) {
  const _variants = unref(variants2);
  watch(
    () => target,
    () => {
      if (!_variants)
        return;
      if (_variants.initial) {
        set("initial");
        variant.value = "initial";
      }
      if (_variants.enter)
        variant.value = "enter";
    },
    {
      immediate: true,
      flush: "pre"
    }
  );
}
function registerVariantsSync({ state, apply }) {
  watch(
    state,
    (newVal) => {
      if (newVal)
        apply(newVal);
    },
    {
      immediate: true
    }
  );
}
function registerVisibilityHooks({ target, variants: variants2, variant }) {
  const _variants = unref(variants2);
  if (_variants && (_variants.visible || _variants.visibleOnce)) {
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (_variants.visible) {
        if (isIntersecting)
          variant.value = "visible";
        else variant.value = "initial";
      } else if (_variants.visibleOnce) {
        if (isIntersecting && variant.value !== "visibleOnce")
          variant.value = "visibleOnce";
        else if (!variant.value)
          variant.value = "initial";
      }
    });
  }
}
function useMotionFeatures(instance, options = {
  syncVariants: true,
  lifeCycleHooks: true,
  visibilityHooks: true,
  eventListeners: true
}) {
  if (options.lifeCycleHooks)
    registerLifeCycleHooks(instance);
  if (options.syncVariants)
    registerVariantsSync(instance);
  if (options.visibilityHooks)
    registerVisibilityHooks(instance);
  if (options.eventListeners)
    registerEventListeners(instance);
}
function reactiveStyle(props = {}) {
  const state = reactive({
    ...props
  });
  const style = ref({});
  watch(
    state,
    () => {
      const result = {};
      for (const [key, value2] of Object.entries(state)) {
        const valueType = getValueType(key);
        const valueAsType = getValueAsType(value2, valueType);
        result[key] = valueAsType;
      }
      style.value = result;
    },
    {
      immediate: true,
      deep: true
    }
  );
  return {
    state,
    style
  };
}
function usePermissiveTarget(target, onTarget) {
  watch(
    () => unrefElement(target),
    (el) => {
      if (!el)
        return;
      onTarget(el);
    },
    {
      immediate: true
    }
  );
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ"
};
function reactiveTransform(props = {}, enableHardwareAcceleration = true) {
  const state = reactive({ ...props });
  const transform2 = ref("");
  watch(
    state,
    (newVal) => {
      let result = "";
      let hasHardwareAcceleration = false;
      if (enableHardwareAcceleration && (newVal.x || newVal.y || newVal.z)) {
        const str = [newVal.x || 0, newVal.y || 0, newVal.z || 0].map((val) => getValueAsType(val, px$1)).join(",");
        result += `translate3d(${str}) `;
        hasHardwareAcceleration = true;
      }
      for (const [key, value2] of Object.entries(newVal)) {
        if (enableHardwareAcceleration && (key === "x" || key === "y" || key === "z"))
          continue;
        const valueType = getValueType(key);
        const valueAsType = getValueAsType(value2, valueType);
        result += `${translateAlias[key] || key}(${valueAsType}) `;
      }
      if (enableHardwareAcceleration && !hasHardwareAcceleration)
        result += "translateZ(0px) ";
      transform2.value = result.trim();
    },
    {
      immediate: true,
      deep: true
    }
  );
  return {
    state,
    transform: transform2
  };
}
const transformAxes = ["", "X", "Y", "Z"];
const order = ["perspective", "translate", "scale", "rotate", "skew"];
const transformProps = ["transformPerspective", "x", "y", "z"];
order.forEach((operationKey) => {
  transformAxes.forEach((axesKey) => {
    const key = operationKey + axesKey;
    transformProps.push(key);
  });
});
const transformPropSet = new Set(transformProps);
function isTransformProp(key) {
  return transformPropSet.has(key);
}
const transformOriginProps = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
function isTransformOriginProp(key) {
  return transformOriginProps.has(key);
}
function splitValues(variant) {
  const transform2 = {};
  const style = {};
  Object.entries(variant).forEach(([key, value2]) => {
    if (isTransformProp(key) || isTransformOriginProp(key))
      transform2[key] = value2;
    else style[key] = value2;
  });
  return { transform: transform2, style };
}
function variantToStyle(variant) {
  const { transform: _transform, style: _style } = splitValues(variant);
  const { transform: transform2 } = reactiveTransform(_transform);
  const { style } = reactiveStyle(_style);
  if (transform2.value)
    style.value.transform = transform2.value;
  return style.value;
}
function useElementStyle(target, onInit) {
  let _cache;
  let _target;
  const { state, style } = reactiveStyle();
  usePermissiveTarget(target, (el) => {
    _target = el;
    for (const key of Object.keys(valueTypes)) {
      if (el.style[key] === null || el.style[key] === "" || isTransformProp(key) || isTransformOriginProp(key))
        continue;
      state[key] = el.style[key];
    }
    if (_cache) {
      Object.entries(_cache).forEach(([key, value2]) => el.style[key] = value2);
    }
    if (onInit)
      onInit(state);
  });
  watch(
    style,
    (newVal) => {
      if (!_target) {
        _cache = newVal;
        return;
      }
      for (const key in newVal) _target.style[key] = newVal[key];
    },
    {
      immediate: true
    }
  );
  return {
    style: state
  };
}
function parseTransform(transform2) {
  const transforms2 = transform2.trim().split(/\) |\)/);
  if (transforms2.length === 1)
    return {};
  const parseValues = (value2) => {
    if (value2.endsWith("px") || value2.endsWith("deg"))
      return Number.parseFloat(value2);
    if (Number.isNaN(Number(value2)))
      return Number(value2);
    return value2;
  };
  return transforms2.reduce((acc, transform22) => {
    if (!transform22)
      return acc;
    const [name2, transformValue] = transform22.split("(");
    const valueArray = transformValue.split(",");
    const values = valueArray.map((val) => {
      return parseValues(val.endsWith(")") ? val.replace(")", "") : val.trim());
    });
    const value2 = values.length === 1 ? values[0] : values;
    return {
      ...acc,
      [name2]: value2
    };
  }, {});
}
function stateFromTransform(state, transform2) {
  Object.entries(parseTransform(transform2)).forEach(([key, value2]) => {
    const axes = ["x", "y", "z"];
    if (key === "translate3d") {
      if (value2 === 0) {
        axes.forEach((axis) => state[axis] = 0);
        return;
      }
      value2.forEach((axisValue, index) => state[axes[index]] = axisValue);
      return;
    }
    value2 = Number.parseFloat(`${value2}`);
    if (key === "translateX") {
      state.x = value2;
      return;
    }
    if (key === "translateY") {
      state.y = value2;
      return;
    }
    if (key === "translateZ") {
      state.z = value2;
      return;
    }
    state[key] = value2;
  });
}
function useElementTransform(target, onInit) {
  let _cache;
  let _target;
  const { state, transform: transform2 } = reactiveTransform();
  usePermissiveTarget(target, (el) => {
    _target = el;
    if (el.style.transform)
      stateFromTransform(state, el.style.transform);
    if (_cache)
      el.style.transform = _cache;
    if (onInit)
      onInit(state);
  });
  watch(
    transform2,
    (newValue) => {
      if (!_target) {
        _cache = newValue;
        return;
      }
      _target.style.transform = newValue;
    },
    {
      immediate: true
    }
  );
  return {
    transform: state
  };
}
function objectEntries(obj) {
  return Object.entries(obj);
}
function useMotionProperties(target, defaultValues) {
  const motionProperties = reactive({});
  const apply = (values) => Object.entries(values).forEach(([key, value2]) => motionProperties[key] = value2);
  const { style } = useElementStyle(target, apply);
  const { transform: transform2 } = useElementTransform(target, apply);
  watch(
    motionProperties,
    (newVal) => {
      objectEntries(newVal).forEach(([key, value2]) => {
        const target2 = isTransformProp(key) ? transform2 : style;
        if (target2[key] && target2[key] === value2)
          return;
        target2[key] = value2;
      });
    },
    {
      immediate: true,
      deep: true
    }
  );
  usePermissiveTarget(target, () => defaultValues);
  return {
    motionProperties,
    style,
    transform: transform2
  };
}
function useMotionVariants(variants2 = {}) {
  const _variants = unref(variants2);
  const variant = ref();
  const state = computed(() => {
    if (!variant.value)
      return;
    return _variants[variant.value];
  });
  return {
    state,
    variant
  };
}
function useMotion(target, variants2 = {}, options) {
  const { motionProperties } = useMotionProperties(target);
  const { variant, state } = useMotionVariants(variants2);
  const controls = useMotionControls(motionProperties, variants2);
  const instance = {
    target,
    variant,
    variants: variants2,
    state,
    motionProperties,
    ...controls
  };
  useMotionFeatures(instance, options);
  return instance;
}
const transitionKeys = ["delay", "duration"];
const directivePropsKeys = ["initial", "enter", "leave", "visible", "visible-once", "visibleOnce", "hovered", "tapped", "focused", ...transitionKeys];
function isTransitionKey(val) {
  return transitionKeys.includes(val);
}
function resolveVariants(node2, variantsRef) {
  const target = node2.props ? node2.props : node2.data && node2.data.attrs ? node2.data.attrs : {};
  if (target) {
    if (target.variants && isObject$2(target.variants)) {
      variantsRef.value = {
        ...variantsRef.value,
        ...target.variants
      };
    }
    for (let key of directivePropsKeys) {
      if (!target || !target[key])
        continue;
      if (isTransitionKey(key) && typeof target[key] === "number") {
        for (const variantKey of ["enter", "visible", "visibleOnce"]) {
          const variantConfig = variantsRef.value[variantKey];
          if (variantConfig == null)
            continue;
          variantConfig.transition ??= {};
          variantConfig.transition[key] = target[key];
        }
        continue;
      }
      if (isObject$2(target[key])) {
        const prop = target[key];
        if (key === "visible-once")
          key = "visibleOnce";
        variantsRef.value[key] = prop;
      }
    }
  }
}
function directive(variants2, isPreset = false) {
  const register = (el, binding, node2) => {
    const key = binding.value && typeof binding.value === "string" ? binding.value : node2.key;
    if (key && motionState[key])
      motionState[key].stop();
    const variantsObject = isPreset ? structuredClone(toRaw(variants2) || {}) : variants2 || {};
    const variantsRef = ref(variantsObject);
    if (typeof binding.value === "object")
      variantsRef.value = binding.value;
    resolveVariants(node2, variantsRef);
    const motionOptions = { eventListeners: true, lifeCycleHooks: true, syncVariants: true, visibilityHooks: false };
    const motionInstance = useMotion(
      el,
      variantsRef,
      motionOptions
    );
    el.motionInstance = motionInstance;
    if (key)
      motionState[key] = motionInstance;
  };
  const mounted = (el, _binding, _node) => {
    el.motionInstance && registerVisibilityHooks(el.motionInstance);
  };
  return {
    created: register,
    mounted,
    getSSRProps(binding, node2) {
      let { initial: bindingInitial } = binding.value || node2 && node2?.props || {};
      bindingInitial = unref(bindingInitial);
      const initial = defu({}, variants2?.initial || {}, bindingInitial || {});
      if (!initial || Object.keys(initial).length === 0)
        return;
      const style = variantToStyle(initial);
      return {
        style
      };
    }
  };
}
const fade = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1
  }
};
const fadeVisible = {
  initial: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
};
const fadeVisibleOnce = {
  initial: {
    opacity: 0
  },
  visibleOnce: {
    opacity: 1
  }
};
const pop = {
  initial: {
    scale: 0,
    opacity: 0
  },
  enter: {
    scale: 1,
    opacity: 1
  }
};
const popVisible = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};
const popVisibleOnce = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visibleOnce: {
    scale: 1,
    opacity: 1
  }
};
const rollLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const slideLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleOnceLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
};
const slideRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleOnceRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
};
const slideTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleOnceTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
};
const slideBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleOnceBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
};
const presets = {
  __proto__: null,
  fade,
  fadeVisible,
  fadeVisibleOnce,
  pop,
  popVisible,
  popVisibleOnce,
  rollBottom,
  rollLeft,
  rollRight,
  rollTop,
  rollVisibleBottom,
  rollVisibleLeft,
  rollVisibleOnceBottom,
  rollVisibleOnceLeft,
  rollVisibleOnceRight,
  rollVisibleOnceTop,
  rollVisibleRight,
  rollVisibleTop,
  slideBottom,
  slideLeft,
  slideRight,
  slideTop,
  slideVisibleBottom,
  slideVisibleLeft,
  slideVisibleOnceBottom,
  slideVisibleOnceLeft,
  slideVisibleOnceRight,
  slideVisibleOnceTop,
  slideVisibleRight,
  slideVisibleTop
};
function slugify(str) {
  const a2 = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b2 = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a2.split("").join("|"), "g");
  return str.toString().replace(/[A-Z]/g, (s) => `-${s}`).toLowerCase().replace(/\s+/g, "-").replace(p, (c2) => b2.charAt(a2.indexOf(c2))).replace(/&/g, "-and-").replace(/[^\w\-]+/g, "").replace(/-{2,}/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}
const CUSTOM_PRESETS = /* @__PURE__ */ Symbol(
  ""
);
const MotionComponentProps = {
  // Preset to be loaded
  preset: {
    type: String,
    required: false
  },
  // Instance
  instance: {
    type: Object,
    required: false
  },
  // Variants
  variants: {
    type: Object,
    required: false
  },
  // Initial variant
  initial: {
    type: Object,
    required: false
  },
  // Lifecycle hooks variants
  enter: {
    type: Object,
    required: false
  },
  leave: {
    type: Object,
    required: false
  },
  // Intersection observer variants
  visible: {
    type: Object,
    required: false
  },
  visibleOnce: {
    type: Object,
    required: false
  },
  // Event listeners variants
  hovered: {
    type: Object,
    required: false
  },
  tapped: {
    type: Object,
    required: false
  },
  focused: {
    type: Object,
    required: false
  },
  // Helpers
  delay: {
    type: [Number, String],
    required: false
  },
  duration: {
    type: [Number, String],
    required: false
  }
};
function isObject$1(val) {
  return Object.prototype.toString.call(val) === "[object Object]";
}
function clone$1(v) {
  if (Array.isArray(v)) {
    return v.map(clone$1);
  }
  if (isObject$1(v)) {
    const res = {};
    for (const key in v) {
      res[key] = clone$1(v[key]);
    }
    return res;
  }
  return v;
}
function setupMotionComponent(props) {
  const instances = reactive({});
  const customPresets = inject(CUSTOM_PRESETS, {});
  const preset = computed(() => {
    if (props.preset == null) {
      return {};
    }
    if (customPresets != null && props.preset in customPresets) {
      return structuredClone(toRaw(customPresets)[props.preset]);
    }
    if (props.preset in presets) {
      return structuredClone(presets[props.preset]);
    }
    return {};
  });
  const propsConfig = computed(() => ({
    initial: props.initial,
    enter: props.enter,
    leave: props.leave,
    visible: props.visible,
    visibleOnce: props.visibleOnce,
    hovered: props.hovered,
    tapped: props.tapped,
    focused: props.focused
  }));
  function applyTransitionHelpers(config, values) {
    for (const transitionKey of ["delay", "duration"]) {
      if (values[transitionKey] == null)
        continue;
      const transitionValueParsed = Number.parseInt(
        values[transitionKey]
      );
      for (const variantKey of ["enter", "visible", "visibleOnce"]) {
        const variantConfig = config[variantKey];
        if (variantConfig == null)
          continue;
        variantConfig.transition ??= {};
        variantConfig.transition[transitionKey] = transitionValueParsed;
      }
    }
    return config;
  }
  const motionConfig = computed(() => {
    const config = defu(
      {},
      propsConfig.value,
      preset.value,
      props.variants || {}
    );
    return applyTransitionHelpers({ ...config }, props);
  });
  function setNodeInstance(node2, index, style) {
    node2.props ??= {};
    node2.props.style ??= {};
    node2.props.style = { ...node2.props.style, ...style };
    const elementMotionConfig = applyTransitionHelpers(
      clone$1(motionConfig.value),
      node2.props
    );
    node2.props.onVnodeMounted = ({ el }) => {
      instances[index] = useMotion(
        el,
        elementMotionConfig
      );
    };
    node2.props.onVnodeUpdated = ({ el }) => {
      const styles = variantToStyle(instances[index].state);
      for (const [key, val] of Object.entries(styles)) {
        el.style[key] = val;
      }
    };
    return node2;
  }
  return {
    motionConfig,
    setNodeInstance
  };
}
const MotionComponent = defineComponent({
  name: "Motion",
  props: {
    ...MotionComponentProps,
    is: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(props) {
    const slots = useSlots();
    const { motionConfig, setNodeInstance } = setupMotionComponent(props);
    return () => {
      const style = variantToStyle(motionConfig.value.initial || {});
      const node2 = h$1(props.is, void 0, slots);
      setNodeInstance(node2, 0, style);
      return node2;
    };
  }
});
const MotionGroupComponent = defineComponent({
  name: "MotionGroup",
  props: {
    ...MotionComponentProps,
    is: {
      type: [String, Object],
      required: false
    }
  },
  setup(props) {
    const slots = useSlots();
    const { motionConfig, setNodeInstance } = setupMotionComponent(props);
    return () => {
      const style = variantToStyle(motionConfig.value.initial || {});
      const nodes = slots.default?.() || [];
      for (let i = 0; i < nodes.length; i++) {
        const n2 = nodes[i];
        if (n2.type === Fragment && Array.isArray(n2.children)) {
          n2.children.forEach(function setChildInstance(child, index) {
            if (child == null)
              return;
            if (Array.isArray(child)) {
              setChildInstance(child, index);
              return;
            }
            if (typeof child === "object") {
              setNodeInstance(child, index, style);
            }
          });
        } else {
          setNodeInstance(n2, i, style);
        }
      }
      if (props.is) {
        return h$1(props.is, void 0, nodes);
      }
      return nodes;
    };
  }
});
const MotionPlugin = {
  install(app2, options) {
    app2.directive("motion", directive());
    if (!options || options && !options.excludePresets) {
      for (const key in presets) {
        const preset = presets[key];
        app2.directive(`motion-${slugify(key)}`, directive(preset, true));
      }
    }
    if (options && options.directives) {
      for (const key in options.directives) {
        const variants2 = options.directives[key];
        if (!variants2.initial && false) ;
        app2.directive(`motion-${key}`, directive(variants2, true));
      }
    }
    app2.provide(CUSTOM_PRESETS, options?.directives);
    app2.component("Motion", MotionComponent);
    app2.component("MotionGroup", MotionGroupComponent);
  }
};
const mode = ref(
  (() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("theme") ?? "light";
    }
    return "light";
  })()
);
const systemDark = ref(
  typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
);
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    systemDark.value = e.matches;
  });
}
function useTheme() {
  const isDark = computed(() => {
    if (mode.value === "system") return systemDark.value;
    return mode.value === "dark";
  });
  const naiveTheme = computed(
    () => isDark.value ? darkTheme : null
  );
  const toggle = () => {
    mode.value = isDark.value ? "light" : "dark";
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", mode.value);
    }
  };
  const setMode = (m) => {
    mode.value = m;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", m);
    }
  };
  return { mode, isDark, naiveTheme, toggle, setMode };
}
const defaultSplitRE = /[\\:]?[\s'"`;{}]+/g;
function toArray(value2 = []) {
  return Array.isArray(value2) ? value2 : [value2];
}
function isString(s) {
  return typeof s === "string";
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeSelector(str) {
  const length2 = str.length;
  let index = -1;
  let codeUnit;
  let result = "";
  const firstCodeUnit = str.charCodeAt(0);
  while (++index < length2) {
    codeUnit = str.charCodeAt(index);
    if (codeUnit === 0) {
      result += "�";
      continue;
    }
    if (codeUnit === 37) {
      result += "\\%";
      continue;
    }
    if (codeUnit === 44) {
      result += "\\,";
      continue;
    }
    if (codeUnit >= 1 && codeUnit <= 31 || codeUnit === 127 || index === 0 && codeUnit >= 48 && codeUnit <= 57 || index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }
    if (index === 0 && length2 === 1 && codeUnit === 45) {
      result += `\\${str.charAt(index)}`;
      continue;
    }
    if (codeUnit >= 128 || codeUnit === 45 || codeUnit === 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
      result += str.charAt(index);
      continue;
    }
    result += `\\${str.charAt(index)}`;
  }
  return result;
}
const attributifyRE = /^\[(.+?)~?="(.*)"\]$/;
const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/;
const validateFilterRE = /[\w\u00A0-\uFFFF%-?]/;
function isAttributifySelector(selector2) {
  return selector2.match(attributifyRE);
}
function isValidSelector(selector2 = "") {
  return validateFilterRE.test(selector2);
}
function notNull(value2) {
  return value2 != null;
}
function clearIdenticalEntries(entry) {
  return entry.filter(([k, v], idx) => {
    if (k.startsWith("$$")) return false;
    for (let i = idx - 1; i >= 0; i--) if (entry[i][0] === k && entry[i][1] === v) return false;
    return true;
  });
}
function entriesToCss(arr) {
  if (arr == null) return "";
  return clearIdenticalEntries(arr).map(([key, value2]) => value2 != null && typeof value2 !== "function" ? key !== "__virtual_key__" ? `${key}:${value2};` : value2 : void 0).filter(Boolean).join("");
}
const regexCache = {};
function makeRegexClassGroup(separators = ["-", ":"]) {
  const key = separators.map((s) => escapeRegExp(s)).join("|");
  if (!regexCache[key]) regexCache[key] = new RegExp(`((?:[!@*<~\\w+:_-]|\\[&?>?:?\\S*\\])+?)(${key})\\(((?:[~!<>\\w\\s:/\\\\,%#.$?-]|\\[[^\\]]*?\\])+?)\\)(?!\\s*?=>)`, "gm");
  regexCache[key].lastIndex = 0;
  return regexCache[key];
}
function parseVariantGroup(str, separators = ["-", ":"], depth = 5) {
  const regexClassGroup = makeRegexClassGroup(separators);
  let hasChanged;
  let content = str.toString();
  const prefixes = /* @__PURE__ */ new Set();
  const groupsByOffset = /* @__PURE__ */ new Map();
  do {
    hasChanged = false;
    content = content.replace(regexClassGroup, (from, pre, sep, body, groupOffset) => {
      if (!separators.includes(sep)) return from;
      hasChanged = true;
      prefixes.add(pre + sep);
      const bodyOffset = groupOffset + pre.length + sep.length + 1;
      const group = {
        length: from.length,
        items: []
      };
      groupsByOffset.set(groupOffset, group);
      for (const itemMatch of [...body.matchAll(/\S+/g)]) {
        const itemOffset = bodyOffset + itemMatch.index;
        let innerItems = groupsByOffset.get(itemOffset)?.items;
        if (innerItems) groupsByOffset.delete(itemOffset);
        else innerItems = [{
          offset: itemOffset,
          length: itemMatch[0].length,
          className: itemMatch[0]
        }];
        for (const item of innerItems) {
          item.className = item.className === "~" ? sep === ":" ? `${pre}${sep}~` : pre : item.className.replace(/^(!?)(.*)/, `$1${pre}${sep}$2`);
          group.items.push(item);
        }
      }
      return "$".repeat(from.length);
    });
    depth -= 1;
  } while (hasChanged && depth);
  let expanded;
  if (typeof str === "string") {
    expanded = "";
    let prevOffset = 0;
    for (const [offset, group] of groupsByOffset) {
      expanded += str.slice(prevOffset, offset);
      expanded += group.items.map((item) => item.className).join(" ");
      prevOffset = offset + group.length;
    }
    expanded += str.slice(prevOffset);
  } else {
    expanded = str;
    for (const [offset, group] of groupsByOffset) expanded.overwrite(offset, offset + group.length, group.items.map((item) => item.className).join(" "));
  }
  return {
    prefixes: Array.from(prefixes),
    hasChanged,
    groupsByOffset,
    get expanded() {
      return expanded.toString();
    }
  };
}
function expandVariantGroup(str, separators = ["-", ":"], depth = 5) {
  const res = parseVariantGroup(str, separators, depth);
  return typeof str === "string" ? res.expanded : str;
}
const warned$1 = /* @__PURE__ */ new Set();
function warnOnce(msg) {
  if (warned$1.has(msg)) return;
  console.warn("[unocss]", msg);
  warned$1.add(msg);
}
function definePreset(preset) {
  return preset;
}
const regexScopePlaceholder = /\s\$\$\s+/g;
const variantsRE = /^(?!.*\[[^:]+:.+\]$)((?:.+:)?!?)(.*)$/;
function variantAttributify(options = {}) {
  const prefix = options.prefix ?? "un-";
  const prefixedOnly = options.prefixedOnly ?? false;
  const trueToNonValued = options.trueToNonValued ?? false;
  let variantsValueRE;
  return {
    name: "attributify",
    match(input, { generator }) {
      const match = isAttributifySelector(input);
      if (!match) return;
      let name2 = match[1];
      if (name2.startsWith(prefix)) name2 = name2.slice(prefix.length);
      else if (prefixedOnly) return;
      const content = match[2];
      const [, variants2 = "", body = content] = content.match(variantsRE) || [];
      if (body === "~" || trueToNonValued && body === "true" || !body) return `${variants2}${name2}`;
      if (variantsValueRE == null) {
        const separators = generator?.config?.separators?.join("|");
        if (separators) variantsValueRE = new RegExp(`^(.*\\](?:${separators}))(\\[[^\\]]+?\\])$`);
        else variantsValueRE = false;
      }
      if (variantsValueRE) {
        const [, bodyVariant, bracketValue] = content.match(variantsValueRE) || [];
        if (bracketValue) return `${bodyVariant}${variants2}${name2}-${bracketValue}`;
      }
      if (variants2 && /^[\d.]+$/.test(body)) {
        const variantParts = variants2.split(/([^:]*:)/g).filter(Boolean);
        const _body = variantParts.pop() + body;
        const _variants = variantParts.join("");
        return [{ matcher: `${variants2}${name2}-${body}` }, { matcher: `${_variants}${name2}-${_body}` }];
      }
      return `${variants2}${name2}-${body}`;
    }
  };
}
const elementRE$1 = /(<\w[\w:.$-]*\s)((?:'[^>']*'|"[^>"]*"|`[^>`]*`|\{[^>}]*\}|[^>]*?)*)/g;
const valuedAttributeRE$1 = /(\?|(?!\d|-{2}|-\d)[\w\u00A0-\uFFFF-:%]+)(?:=("[^"]*|'[^']*))?/g;
const splitterRE$1 = /[\s'"`;>]+/;
function autocompleteExtractorAttributify(options) {
  return {
    name: "attributify",
    extract: ({ content, cursor }) => {
      const matchedElements = content.matchAll(elementRE$1);
      let attrs;
      let elPos = 0;
      for (const match of matchedElements) {
        const [, prefix, content2] = match;
        const currentPos2 = match.index + prefix.length;
        if (cursor > currentPos2 && cursor <= currentPos2 + content2.length) {
          elPos = currentPos2;
          attrs = content2;
          break;
        }
      }
      if (!attrs) return null;
      const matchedAttributes = attrs.matchAll(valuedAttributeRE$1);
      let attrsPos = 0;
      let attrName;
      let attrValues;
      for (const match of matchedAttributes) {
        const [matched, name2, rawValues] = match;
        const currentPos2 = elPos + match.index;
        if (cursor > currentPos2 && cursor <= currentPos2 + matched.length) {
          attrsPos = currentPos2;
          attrName = name2;
          attrValues = rawValues?.slice(1);
          break;
        }
      }
      if (!attrName) return null;
      if (attrName === "class" || attrName === "className" || attrName === ":class") return null;
      const hasPrefix = !!options?.prefix && attrName.startsWith(options.prefix);
      if (options?.prefixedOnly && !hasPrefix) return null;
      const attrNameWithoutPrefix = hasPrefix ? attrName.slice(options.prefix.length) : attrName;
      if (attrValues === void 0) return {
        extracted: attrNameWithoutPrefix,
        resolveReplacement(suggestion) {
          const startOffset = hasPrefix ? options.prefix.length : 0;
          return {
            start: attrsPos + startOffset,
            end: attrsPos + attrName.length,
            replacement: suggestion
          };
        }
      };
      const attrValuePos = attrsPos + attrName.length + 2;
      let matchSplit = splitterRE$1.exec(attrValues);
      let currentPos = 0;
      let value2;
      while (matchSplit) {
        const [matched] = matchSplit;
        if (cursor > attrValuePos + currentPos && cursor <= attrValuePos + currentPos + matchSplit.index) {
          value2 = attrValues.slice(currentPos, currentPos + matchSplit.index);
          break;
        }
        currentPos += matchSplit.index + matched.length;
        matchSplit = splitterRE$1.exec(attrValues.slice(currentPos));
      }
      if (value2 === void 0) value2 = attrValues.slice(currentPos);
      const [, variants2 = "", body] = value2.match(variantsRE) || [];
      return {
        extracted: `${variants2}${attrNameWithoutPrefix}-${body}`,
        transformSuggestions(suggestions) {
          return suggestions.filter((v) => v.startsWith(`${variants2}${attrNameWithoutPrefix}-`)).map((v) => variants2 + v.slice(variants2.length + attrNameWithoutPrefix.length + 1));
        },
        resolveReplacement(suggestion) {
          return {
            start: currentPos + attrValuePos,
            end: currentPos + attrValuePos + value2.length,
            replacement: variants2 + suggestion.slice(variants2.length + attrNameWithoutPrefix.length + 1)
          };
        }
      };
    }
  };
}
const strippedPrefixes = ["v-bind:", ":"];
const splitterRE = /[\s'"`;]+/g;
const elementRE = /<[^>\s]*\s((?:'[^']*'|"[^"]*"|`[^`]*`|\{[^}]*\}|=>|[^>]*?)*)/g;
const valuedAttributeRE = /(\?|(?!\d|-{2}|-\d)[\w\u00A0-\uFFFF:!%.~<-]+)=?(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})?/g;
const defaultIgnoreAttributes = [
  "placeholder",
  "fill",
  "opacity",
  "stroke-opacity"
];
function extractorAttributify(options) {
  const ignoreAttributes = options?.ignoreAttributes ?? defaultIgnoreAttributes;
  const nonValuedAttribute = options?.nonValuedAttribute ?? true;
  const trueToNonValued = options?.trueToNonValued ?? false;
  return {
    name: "@unocss/preset-attributify/extractor",
    extract({ code: code2 }) {
      return Array.from(code2.matchAll(elementRE)).flatMap((match) => Array.from((match[1] || "").matchAll(valuedAttributeRE))).flatMap(([, name2, ...contents2]) => {
        const content = contents2.filter(Boolean).join("");
        if (ignoreAttributes.includes(name2)) return [];
        for (const prefix of strippedPrefixes) if (name2.startsWith(prefix)) {
          name2 = name2.slice(prefix.length);
          break;
        }
        if (!content) {
          if (isValidSelector(name2) && nonValuedAttribute !== false) {
            const result = [`[${name2}=""]`];
            if (trueToNonValued) result.push(`[${name2}="true"]`);
            return result;
          }
          return [];
        }
        if (["class", "className"].includes(name2)) return content.split(splitterRE).filter(isValidSelector);
        else if (elementRE.test(content)) {
          elementRE.lastIndex = 0;
          return this.extract({ code: content });
        } else {
          if (options?.prefixedOnly && options.prefix && !name2.startsWith(options.prefix)) return [];
          return content.split(splitterRE).filter((v) => Boolean(v) && v !== ":").map((v) => `[${name2}~="${v}"]`);
        }
      });
    }
  };
}
const presetAttributify = definePreset((options = {}) => {
  options.strict = options.strict ?? false;
  options.prefix = options.prefix ?? "un-";
  options.prefixedOnly = options.prefixedOnly ?? false;
  options.nonValuedAttribute = options.nonValuedAttribute ?? true;
  options.ignoreAttributes = options.ignoreAttributes ?? defaultIgnoreAttributes;
  return {
    name: "@unocss/preset-attributify",
    enforce: "post",
    variants: [variantAttributify(options)],
    extractors: [extractorAttributify(options)],
    options,
    autocomplete: { extractors: [autocompleteExtractorAttributify(options)] },
    extractorDefault: options.strict ? false : void 0
  };
});
function trimSVG(str) {
  return str.replace(/(['"])\s*\n\s*([^>\\/\s])/g, "$1 $2").replace(/(["';{}><])\s*\n\s*/g, "$1").replace(/\s*\n\s*/g, " ").replace(/\s+"/g, '"').replace(/="\s+/g, '="').replace(/(\s)+\/>/g, "/>").trim();
}
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) return size;
  precision = precision || 100;
  if (typeof size === "number") return Math.ceil(size * ratio * precision) / precision;
  if (typeof size !== "string") return size;
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) return size;
  const newParts = [];
  let code2 = oldParts.shift();
  let isNumber = unitsTest.test(code2);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code2);
      if (isNaN(num)) newParts.push(code2);
      else newParts.push(Math.ceil(num * ratio * precision) / precision);
    } else newParts.push(code2);
    code2 = oldParts.shift();
    if (code2 === void 0) return newParts.join("");
    isNumber = !isNumber;
  }
}
const defaultIconDimensions = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16
});
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  ...defaultIconSizeCustomisations,
  ...defaultIconTransformations
});
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) break;
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) break;
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}
const isUnsetKeyword = (value2) => value2 === "unset" || value2 === "undefined" || value2 === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) if (vFlip) rotation += 2;
    else {
      transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
      transformations.push("scale(-1 1)");
      box.top = box.left = 0;
    }
    else if (vFlip) {
      transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) rotation -= Math.floor(rotation / 4) * 4;
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
      case 2:
        transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) body = wrapSVGContent(body, '<g transform="' + transformations.join(" ") + '">', "</g>");
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width2;
  let height2;
  if (customisationsWidth === null) {
    height2 = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width2 = calculateSize(height2, boxWidth / boxHeight);
  } else {
    width2 = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height2 = customisationsHeight === null ? calculateSize(width2, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value2) => {
    if (!isUnsetKeyword(value2)) attributes[prop] = value2.toString();
  };
  setAttr("width", width2);
  setAttr("height", height2);
  const viewBox = [
    box.left,
    box.top,
    boxWidth,
    boxHeight
  ];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}
const svgWidthRegex = /\swidth\s*=\s*["']([^"']+)["']/;
const svgHeightRegex = /\sheight\s*=\s*["']([^"']+)["']/;
const svgViewBoxRegex = /\sviewBox\s*=\s*["']([^"']+)["']/;
const svgTagRegex = /<svg\s+/;
const loaderDefaultWidthProp = "__iconify_loader_width";
const loaderDefaultHeightProp = "__iconify_loader_height";
function stringifySize(value2) {
  return value2 === void 0 ? void 0 : value2.toString();
}
function getConfiguredSize(source, scale2) {
  if (typeof scale2 === "number") return scale2 > 0 ? stringifySize(calculateSize(source ?? "1em", scale2)) : void 0;
  return source;
}
function getSvgAspectRatio(svgNode, props) {
  const viewBox = props.viewBox ?? svgViewBoxRegex.exec(svgNode)?.[1];
  if (!viewBox) return;
  const values = viewBox.trim().split(/[\s,]+/).map((value2) => parseFloat(value2));
  if (values.length !== 4 || values.some((value2) => !Number.isFinite(value2))) return;
  const width2 = values[2];
  const height2 = values[3];
  if (width2 <= 0 || height2 <= 0) return;
  return width2 / height2;
}
function configureSvgSize(svg, props, scale2) {
  const svgNode = svg.slice(0, svg.indexOf(">"));
  const widthOnSvg = svgWidthRegex.test(svgNode);
  const heightOnSvg = svgHeightRegex.test(svgNode);
  const defaultWidth = props["__iconify_loader_width"] ?? svgWidthRegex.exec(svgNode)?.[1];
  const defaultHeight = props["__iconify_loader_height"] ?? svgHeightRegex.exec(svgNode)?.[1];
  const aspectRatio2 = getSvgAspectRatio(svgNode, props);
  delete props[loaderDefaultWidthProp];
  delete props[loaderDefaultHeightProp];
  const customWidth = props.width;
  const customHeight = props.height;
  const hasCustomWidth = !!customWidth || isUnsetKeyword(customWidth);
  const hasCustomHeight = !!customHeight || isUnsetKeyword(customHeight);
  if (hasCustomWidth || hasCustomHeight) {
    if (!hasCustomWidth) if (isUnsetKeyword(customHeight)) {
      delete props.width;
      delete props.height;
    } else if (aspectRatio2) {
      props.width = stringifySize(calculateSize(customHeight, aspectRatio2));
      props.height = customHeight;
    } else delete props.width;
    else if (isUnsetKeyword(customWidth)) {
      delete props.width;
      if (!hasCustomHeight || isUnsetKeyword(customHeight)) delete props.height;
    }
    if (!hasCustomHeight) if (isUnsetKeyword(customWidth)) delete props.height;
    else if (aspectRatio2) {
      props.height = stringifySize(calculateSize(customWidth, 1 / aspectRatio2));
      props.width = customWidth;
    } else delete props.height;
    else if (isUnsetKeyword(customHeight)) delete props.height;
  } else {
    const width2 = getConfiguredSize(defaultWidth, scale2);
    const height2 = getConfiguredSize(defaultHeight, scale2);
    if (width2) props.width = width2;
    if (height2) props.height = height2;
  }
  return [widthOnSvg, heightOnSvg];
}
async function mergeIconProps(svg, collection, icon, options, propsProvider, afterCustomizations) {
  const { scale: scale2, addXmlNs = false } = options ?? {};
  const { additionalProps = {}, iconCustomizer } = options?.customizations ?? {};
  const props = await propsProvider?.() ?? {};
  await iconCustomizer?.(collection, icon, props);
  Object.keys(additionalProps).forEach((p) => {
    const v = additionalProps[p];
    if (v !== void 0 && v !== null) props[p] = v;
  });
  const [widthOnSvg, heightOnSvg] = configureSvgSize(svg, props, scale2);
  if (addXmlNs) {
    if (!svg.includes("xmlns=") && !props["xmlns"]) props["xmlns"] = "http://www.w3.org/2000/svg";
    if (!svg.includes("xmlns:xlink=") && svg.includes("xlink:") && !props["xmlns:xlink"]) props["xmlns:xlink"] = "http://www.w3.org/1999/xlink";
  }
  const propsToAdd = Object.keys(props).map((p) => p === "width" && widthOnSvg || p === "height" && heightOnSvg ? null : `${p}="${props[p]}"`).filter((p) => p != null);
  if (propsToAdd.length) svg = svg.replace(svgTagRegex, `<svg ${propsToAdd.join(" ")} `);
  if (options) {
    const { defaultStyle, defaultClass } = options;
    if (defaultClass && !svg.includes("class=")) svg = svg.replace(svgTagRegex, `<svg class="${defaultClass}" `);
    if (defaultStyle && !svg.includes("style=")) svg = svg.replace(svgTagRegex, `<svg style="${defaultStyle}" `);
  }
  const usedProps = options?.usedProps;
  if (usedProps) {
    Object.keys(additionalProps).forEach((p) => {
      const v = props[p];
      if (v !== void 0 && v !== null) usedProps[p] = v;
    });
    if (typeof props.width !== "undefined" && props.width !== null) usedProps.width = props.width;
    if (typeof props.height !== "undefined" && props.height !== null) usedProps.height = props.height;
  }
  return svg;
}
async function getCustomIcon(custom2, collection, icon, options) {
  let result;
  try {
    if (typeof custom2 === "function") result = await custom2(icon);
    else {
      const inline = custom2[icon];
      result = typeof inline === "function" ? await inline() : inline;
    }
  } catch (err) {
    console.warn(`Failed to load custom icon "${icon}" in "${collection}":`, err);
    return;
  }
  if (result) {
    const cleanupIdx = result.indexOf("<svg");
    if (cleanupIdx > 0) result = result.slice(cleanupIdx);
    const { transform: transform2 } = options?.customizations ?? {};
    result = typeof transform2 === "function" ? await transform2(result, collection, icon) : result;
    if (!result.startsWith("<svg")) {
      console.warn(`Custom icon "${icon}" in "${collection}" is not a valid SVG`);
      return result;
    }
    return await mergeIconProps(options?.customizations?.trimCustomSvg === true ? trimSVG(result) : result, collection, icon, options, void 0);
  }
}
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) result.hFlip = true;
  if (!obj1.vFlip !== !obj2.vFlip) result.vFlip = true;
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) result.rotate = rotate;
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) if (key in defaultIconTransformations) {
    if (key in parent && !(key in result)) result[key] = defaultIconTransformations[key];
  } else if (key in child) result[key] = child[key];
  else if (key in parent) result[key] = parent[key];
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name2) {
    if (icons[name2]) return resolved[name2] = [];
    if (!(name2 in resolved)) {
      resolved[name2] = null;
      const parent = aliases[name2] && aliases[name2].parent;
      const value2 = parent && resolve(parent);
      if (value2) resolved[name2] = [parent].concat(value2);
    }
    return resolved[name2];
  }
  (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name2, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse2(name3) {
    currentProps = mergeIconData(icons[name3] || aliases[name3], currentProps);
  }
  parse2(name2);
  tree.forEach(parse2);
  return mergeIconData(data, currentProps);
}
function getIconData(data, name2) {
  if (data.icons[name2]) return internalGetIconData(data, name2, []);
  const tree = getIconsTree(data, [name2])[name2];
  return tree ? internalGetIconData(data, name2, tree) : null;
}
async function searchForIcon(iconSet, collection, ids, options) {
  let iconData;
  const { customize } = options?.customizations ?? {};
  for (const id of ids) {
    iconData = getIconData(iconSet, id);
    if (iconData) {
      let defaultCustomizations = { ...defaultIconCustomisations };
      if (typeof customize === "function") {
        iconData = Object.assign({}, iconData);
        defaultCustomizations = customize(defaultCustomizations, iconData, `${collection}:${id}`) ?? defaultCustomizations;
      }
      const { attributes: { width: width2, height: height2, ...restAttributes }, body } = iconToSVG(iconData, defaultCustomizations);
      return await mergeIconProps(`<svg >${body}</svg>`, collection, id, options, () => {
        return {
          ...restAttributes,
          ...width2 ? { [loaderDefaultWidthProp]: width2 } : {},
          ...height2 ? { [loaderDefaultHeightProp]: height2 } : {}
        };
      });
    }
  }
}
const loadIcon = async (collection, icon, options) => {
  const custom2 = options?.customCollections?.[collection];
  if (custom2) if (typeof custom2 === "function") {
    let result;
    try {
      result = await custom2(icon);
    } catch (err) {
      console.warn(`Failed to load custom icon "${icon}" in "${collection}":`, err);
      return;
    }
    if (result) {
      if (typeof result === "string") return await getCustomIcon(() => result, collection, icon, options);
      if ("icons" in result) {
        const ids = [
          icon,
          icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
          icon.replace(/([a-z])(\d+)/g, "$1-$2")
        ];
        return await searchForIcon(result, collection, ids, options);
      }
    }
  } else return await getCustomIcon(custom2, collection, icon, options);
};
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function encodeSvgForCss(svg) {
  let useSvg = svg.startsWith("<svg>") ? svg.replace("<svg>", "<svg >") : svg;
  if (!useSvg.includes(" xmlns:xlink=") && useSvg.includes(" xlink:")) useSvg = useSvg.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  if (!useSvg.includes(" xmlns=")) useSvg = useSvg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  return encodeSVGforURL(useSvg);
}
var define_process_env_default = {};
function getEnvFlags() {
  const isNode = typeof process !== "undefined" && process.stdout;
  return {
    isNode,
    isVSCode: isNode && !!define_process_env_default.VSCODE_CWD,
    isESLint: isNode && !!define_process_env_default.ESLINT
  };
}
var collections_default = [
  "academicons",
  "akar-icons",
  "ant-design",
  "arcticons",
  "at-icons",
  "basil",
  "bi",
  "bitcoin-icons",
  "boxicons",
  "bpmn",
  "brandico",
  "bubbles",
  "bx",
  "bxl",
  "bxs",
  "bytesize",
  "carbon",
  "catppuccin",
  "cbi",
  "charm",
  "ci",
  "cib",
  "cif",
  "cil",
  "circle-flags",
  "circum",
  "clarity",
  "codex",
  "codicon",
  "covid",
  "cryptocurrency-color",
  "cryptocurrency",
  "cuida",
  "dashicons",
  "devicon-line",
  "devicon-original",
  "devicon-plain",
  "devicon",
  "dinkie-icons",
  "duo-icons",
  "ei",
  "el",
  "emblemicons",
  "emojione-monotone",
  "emojione-v1",
  "emojione",
  "entypo-social",
  "entypo",
  "eos-icons",
  "ep",
  "et",
  "eva",
  "f7",
  "fa-brands",
  "fa-regular",
  "fa-solid",
  "fa",
  "fa6-brands",
  "fa6-regular",
  "fa6-solid",
  "fa7-brands",
  "fa7-regular",
  "fa7-solid",
  "fad",
  "famicons",
  "fe",
  "feather",
  "file-icons",
  "flag",
  "flagpack",
  "flat-color-icons",
  "flat-ui",
  "flowbite",
  "fluent-color",
  "fluent-emoji-flat",
  "fluent-emoji-high-contrast",
  "fluent-emoji",
  "fluent-mdl2",
  "fluent",
  "fontelico",
  "fontisto",
  "formkit",
  "foundation",
  "fxemoji",
  "gala",
  "game-icons",
  "garden",
  "gcp",
  "geo",
  "gg",
  "ginetex",
  "gis",
  "glyphs-poly",
  "glyphs",
  "gravity-ui",
  "gridicons",
  "grommet-icons",
  "guidance",
  "healthicons",
  "heroicons-outline",
  "heroicons-solid",
  "heroicons",
  "hugeicons",
  "humbleicons",
  "ic",
  "icomoon-free",
  "icon-park-outline",
  "icon-park-solid",
  "icon-park-twotone",
  "icon-park",
  "iconamoon",
  "iconoir",
  "icons8",
  "il",
  "ion",
  "iwwa",
  "ix",
  "jam",
  "la",
  "lets-icons",
  "line-md",
  "lineicons",
  "logos",
  "ls",
  "lsicon",
  "lucide-lab",
  "lucide",
  "mage",
  "majesticons",
  "maki",
  "map",
  "marketeq",
  "material-icon-theme",
  "material-symbols-light",
  "material-symbols",
  "mdi-light",
  "mdi",
  "medical-icon",
  "memory",
  "meteocons",
  "meteor-icons",
  "mi",
  "mingcute",
  "mono-icons",
  "mynaui",
  "nimbus",
  "nonicons",
  "noto-v1",
  "noto",
  "nrk",
  "octicon",
  "oi",
  "ooui",
  "openmoji",
  "osmic",
  "oui",
  "pajamas",
  "pepicons-pencil",
  "pepicons-pop",
  "pepicons-print",
  "pepicons",
  "ph",
  "picon",
  "pinhead",
  "pixel",
  "pixelarticons",
  "prime",
  "proicons",
  "ps",
  "qlementine-icons",
  "quill",
  "radix-icons",
  "raphael",
  "ri",
  "rivet-icons",
  "roentgen",
  "selfhst",
  "si-glyph",
  "si",
  "sidekickicons",
  "simple-icons",
  "simple-line-icons",
  "skill-icons",
  "solar",
  "stash",
  "streamline-block",
  "streamline-color",
  "streamline-cyber-color",
  "streamline-cyber",
  "streamline-emojis",
  "streamline-flex-color",
  "streamline-flex",
  "streamline-freehand-color",
  "streamline-freehand",
  "streamline-guidance",
  "streamline-kameleon-color",
  "streamline-logos",
  "streamline-pixel",
  "streamline-plump-color",
  "streamline-plump",
  "streamline-sharp-color",
  "streamline-sharp",
  "streamline-stickies-color",
  "streamline-ultimate-color",
  "streamline-ultimate",
  "streamline",
  "subway",
  "svg-spinners",
  "system-uicons",
  "tabler",
  "tdesign",
  "teenyicons",
  "temaki",
  "token-branded",
  "token",
  "topcoat",
  "twemoji",
  "typcn",
  "uil",
  "uim",
  "uis",
  "uit",
  "uiw",
  "unjs",
  "vaadin",
  "vs",
  "vscode-icons",
  "websymbol",
  "weui",
  "whh",
  "wi",
  "wordpress",
  "wpf",
  "zmdi",
  "zondicons"
];
const COLLECTION_NAME_PARTS_MAX = 3;
function createPresetIcons(lookupIconLoader) {
  return definePreset((options = {}) => {
    const { scale: scale2 = 1, mode: mode2 = "auto", prefix = "i-", warn = false, iconifyCollectionsNames, collections: customCollections, extraProperties = {}, customizations = {}, autoInstall = false, collectionsNodeResolvePath, layer: layer2 = "icons", unit, processor } = options;
    const flags = getEnvFlags();
    const loaderOptions = {
      addXmlNs: true,
      scale: scale2,
      customCollections,
      autoInstall,
      cwd: collectionsNodeResolvePath,
      warn: void 0,
      customizations: {
        ...customizations,
        additionalProps: { ...extraProperties },
        trimCustomSvg: true,
        async iconCustomizer(collection, icon, props) {
          await customizations.iconCustomizer?.(collection, icon, props);
          if (unit) {
            if (!props.width) props.width = `${scale2}${unit}`;
            if (!props.height) props.height = `${scale2}${unit}`;
          }
        }
      }
    };
    let iconLoader;
    return {
      name: "@unocss/preset-icons",
      enforce: "pre",
      options,
      layers: { icons: -30 },
      api: {
        encodeSvgForCss,
        parseIconWithLoader
      },
      rules: [[
        /^([\w:-]+)(?:\?(mask|bg|auto))?$/,
        async (matcher) => {
          let [full, body, _mode = mode2] = matcher;
          iconLoader = iconLoader || await lookupIconLoader(options);
          const usedProps = {};
          const parsed = await parseIconWithLoader(body, iconLoader, {
            ...loaderOptions,
            usedProps
          }, iconifyCollectionsNames);
          if (!parsed) {
            if (warn && !flags.isESLint) warnOnce(`failed to load icon "${full}"`);
            return;
          }
          let cssObject;
          const url = `url("data:image/svg+xml;utf8,${encodeSvgForCss(parsed.svg)}")`;
          if (_mode === "auto") _mode = parsed.svg.includes("currentColor") ? "mask" : "bg";
          if (_mode === "mask") cssObject = {
            "--un-icon": url,
            "-webkit-mask": "var(--un-icon) no-repeat",
            "mask": "var(--un-icon) no-repeat",
            "-webkit-mask-size": "100% 100%",
            "mask-size": "100% 100%",
            "background-color": "currentColor",
            "color": "inherit",
            ...usedProps
          };
          else cssObject = {
            "background": `${url} no-repeat`,
            "background-size": "100% 100%",
            "background-color": "transparent",
            ...usedProps
          };
          processor?.(cssObject, {
            ...parsed,
            icon: parsed.name,
            mode: _mode
          });
          return cssObject;
        },
        {
          layer: layer2,
          prefix
        }
      ]]
    };
  });
}
function createCDNFetchLoader(fetcher, cdnBase, cacheMap = /* @__PURE__ */ new Map()) {
  function fetchCollection(name2) {
    if (!collections_default.includes(name2)) return void 0;
    if (!cacheMap.has(name2)) cacheMap.set(name2, fetcher(`${cdnBase}@iconify-json/${name2}/icons.json`));
    return cacheMap.get(name2);
  }
  return async (collection, icon, options) => {
    let result = await loadIcon(collection, icon, options);
    if (result) return result;
    const iconSet = await fetchCollection(collection);
    if (iconSet) result = await searchForIcon(iconSet, collection, [
      icon,
      icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
      icon.replace(/([a-z])(\d+)/g, "$1-$2")
    ], options);
    return result;
  };
}
async function parseIconWithLoader(body, loader, options = {}, safeCollectionsNames = []) {
  let collection = "";
  let name2 = "";
  let svg;
  const allCollections = /* @__PURE__ */ new Set([
    ...collections_default,
    ...safeCollectionsNames,
    ...Object.keys(options.customCollections || {})
  ]);
  if (body.includes(":")) {
    [collection, name2] = body.split(":");
    if (!allCollections.has(collection)) return;
    svg = await loader(collection, name2, options);
  } else {
    const parts = body.split(/-/g);
    for (let i = COLLECTION_NAME_PARTS_MAX; i >= 1; i--) {
      collection = parts.slice(0, i).join("-");
      if (!allCollections.has(collection)) continue;
      name2 = parts.slice(i).join("-");
      svg = await loader(collection, name2, options);
      if (svg) break;
    }
  }
  if (!svg) return;
  return {
    collection,
    name: name2,
    svg
  };
}
const scriptRel = /* @__PURE__ */ (function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
        const link$1 = links[i$1];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
async function createCDNLoader(cdnBase) {
  const { $fetch } = await __vitePreload(async () => {
    const { $fetch: $fetch2 } = await import("./index-CskV5qPn.js");
    return { $fetch: $fetch2 };
  }, true ? [] : void 0, import.meta.url);
  return createCDNFetchLoader($fetch, cdnBase);
}
const presetIcons = createPresetIcons(async (options) => {
  const fetcher = options?.customFetch;
  const cdn = options?.cdn;
  if (fetcher && cdn) return createCDNFetchLoader(fetcher, cdn);
  if (cdn) return await createCDNLoader(cdn);
  return loadIcon;
});
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name2 in all) __defProp(target, name2, {
    get: all[name2],
    enumerable: true
  });
  __defProp(target, Symbol.toStringTag, { value: "Module" });
  return target;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n2 = keys.length, key; i < n2; i++) {
    key = keys[i];
    if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: ((k) => from[k]).bind(null, key),
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c2 = chars.charCodeAt(i);
  intToChar[i] = c2;
  charToInt[c2] = i;
}
function encodeInteger(builder, num, relative) {
  let delta = num - relative;
  delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
  do {
    let clamped = delta & 31;
    delta >>>= 5;
    if (delta > 0) clamped |= 32;
    builder.write(intToChar[clamped]);
  } while (delta > 0);
  return num;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? {
  decode(buf) {
    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    return out.toString();
  }
} : {
  decode(buf) {
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i]);
    }
    return out;
  }
};
var StringWriter = class {
  constructor() {
    this.pos = 0;
    this.out = "";
    this.buffer = new Uint8Array(bufLength);
  }
  write(v) {
    const { buffer } = this;
    buffer[this.pos++] = v;
    if (this.pos === bufLength) {
      this.out += td.decode(buffer);
      this.pos = 0;
    }
  }
  flush() {
    const { buffer, out, pos } = this;
    return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
  }
};
function encode$2(decoded) {
  const writer = new StringWriter();
  let sourcesIndex = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let namesIndex = 0;
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) writer.write(semicolon);
    if (line.length === 0) continue;
    let genColumn = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (j > 0) writer.write(comma);
      genColumn = encodeInteger(writer, segment[0], genColumn);
      if (segment.length === 1) continue;
      sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
      sourceLine = encodeInteger(writer, segment[2], sourceLine);
      sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
      if (segment.length === 4) continue;
      namesIndex = encodeInteger(writer, segment[4], namesIndex);
    }
  }
  return writer.flush();
}
class BitSet {
  constructor(arg) {
    this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
  }
  add(n2) {
    this.bits[n2 >> 5] |= 1 << (n2 & 31);
  }
  has(n2) {
    return !!(this.bits[n2 >> 5] & 1 << (n2 & 31));
  }
}
class Chunk {
  constructor(start, end, content) {
    this.start = start;
    this.end = end;
    this.original = content;
    this.intro = "";
    this.outro = "";
    this.content = content;
    this.storeName = false;
    this.edited = false;
    {
      this.previous = null;
      this.next = null;
    }
  }
  appendLeft(content) {
    this.outro += content;
  }
  appendRight(content) {
    this.intro = this.intro + content;
  }
  clone() {
    const chunk = new Chunk(this.start, this.end, this.original);
    chunk.intro = this.intro;
    chunk.outro = this.outro;
    chunk.content = this.content;
    chunk.storeName = this.storeName;
    chunk.edited = this.edited;
    return chunk;
  }
  contains(index) {
    return this.start < index && index < this.end;
  }
  eachNext(fn) {
    let chunk = this;
    while (chunk) {
      fn(chunk);
      chunk = chunk.next;
    }
  }
  eachPrevious(fn) {
    let chunk = this;
    while (chunk) {
      fn(chunk);
      chunk = chunk.previous;
    }
  }
  edit(content, storeName, contentOnly) {
    this.content = content;
    if (!contentOnly) {
      this.intro = "";
      this.outro = "";
    }
    this.storeName = storeName;
    this.edited = true;
    return this;
  }
  prependLeft(content) {
    this.outro = content + this.outro;
  }
  prependRight(content) {
    this.intro = content + this.intro;
  }
  reset() {
    this.intro = "";
    this.outro = "";
    if (this.edited) {
      this.content = this.original;
      this.storeName = false;
      this.edited = false;
    }
  }
  split(index) {
    const sliceIndex = index - this.start;
    const originalBefore = this.original.slice(0, sliceIndex);
    const originalAfter = this.original.slice(sliceIndex);
    this.original = originalBefore;
    const newChunk = new Chunk(index, this.end, originalAfter);
    newChunk.outro = this.outro;
    this.outro = "";
    this.end = index;
    if (this.edited) {
      newChunk.edit("", false);
      this.content = "";
    } else {
      this.content = originalBefore;
    }
    newChunk.next = this.next;
    if (newChunk.next) newChunk.next.previous = newChunk;
    newChunk.previous = this;
    this.next = newChunk;
    return newChunk;
  }
  toString() {
    return this.intro + this.content + this.outro;
  }
  trimEnd(rx) {
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length) return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        this.split(this.start + trimmed.length).edit("", void 0, true);
        if (this.edited) {
          this.edit(trimmed, this.storeName, true);
        }
      }
      return true;
    } else {
      this.edit("", void 0, true);
      this.intro = this.intro.replace(rx, "");
      if (this.intro.length) return true;
    }
  }
  trimStart(rx) {
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length) return true;
    const trimmed = this.content.replace(rx, "");
    if (trimmed.length) {
      if (trimmed !== this.content) {
        const newChunk = this.split(this.end - trimmed.length);
        if (this.edited) {
          newChunk.edit(trimmed, this.storeName, true);
        }
        this.edit("", void 0, true);
      }
      return true;
    } else {
      this.edit("", void 0, true);
      this.outro = this.outro.replace(rx, "");
      if (this.outro.length) return true;
    }
  }
}
function getBtoa() {
  if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") {
    return (str) => globalThis.btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer === "function") {
    return (str) => Buffer.from(str, "utf-8").toString("base64");
  } else {
    return () => {
      throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
    };
  }
}
const btoa = /* @__PURE__ */ getBtoa();
class SourceMap {
  constructor(properties2) {
    this.version = 3;
    this.file = properties2.file;
    this.sources = properties2.sources;
    this.sourcesContent = properties2.sourcesContent;
    this.names = properties2.names;
    this.mappings = encode$2(properties2.mappings);
    if (typeof properties2.x_google_ignoreList !== "undefined") {
      this.x_google_ignoreList = properties2.x_google_ignoreList;
    }
    if (typeof properties2.debugId !== "undefined") {
      this.debugId = properties2.debugId;
    }
  }
  toString() {
    return JSON.stringify(this);
  }
  toUrl() {
    return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
  }
}
function guessIndent(code2) {
  const lines = code2.split("\n");
  const tabbed = lines.filter((line) => /^\t+/.test(line));
  const spaced = lines.filter((line) => /^ {2,}/.test(line));
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "	";
  }
  const min = spaced.reduce((previous, current) => {
    const numSpaces = /^ +/.exec(current)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
  const fromParts = from.split(/[/\\]/);
  const toParts = to.split(/[/\\]/);
  fromParts.pop();
  while (fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  if (fromParts.length) {
    let i = fromParts.length;
    while (i--) fromParts[i] = "..";
  }
  return fromParts.concat(toParts).join("/");
}
const toString = Object.prototype.toString;
function isObject(thing) {
  return toString.call(thing) === "[object Object]";
}
function getLocator(source) {
  const originalLines = source.split("\n");
  const lineOffsets = [];
  for (let i = 0, pos = 0; i < originalLines.length; i++) {
    lineOffsets.push(pos);
    pos += originalLines[i].length + 1;
  }
  return function locate(index) {
    let i = 0;
    let j = lineOffsets.length;
    while (i < j) {
      const m = i + j >> 1;
      if (index < lineOffsets[m]) {
        j = m;
      } else {
        i = m + 1;
      }
    }
    const line = i - 1;
    const column = index - lineOffsets[line];
    return { line, column };
  };
}
const wordRegex = /\w/;
class Mappings {
  constructor(hires) {
    this.hires = hires;
    this.generatedCodeLine = 0;
    this.generatedCodeColumn = 0;
    this.raw = [];
    this.rawSegments = this.raw[this.generatedCodeLine] = [];
    this.pending = null;
  }
  addEdit(sourceIndex, content, loc, nameIndex) {
    if (content.length) {
      const contentLengthMinusOne = content.length - 1;
      let contentLineEnd = content.indexOf("\n", 0);
      let previousContentLineEnd = -1;
      while (contentLineEnd >= 0 && contentLengthMinusOne > contentLineEnd) {
        const segment2 = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
        if (nameIndex >= 0) {
          segment2.push(nameIndex);
        }
        this.rawSegments.push(segment2);
        this.generatedCodeLine += 1;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
        this.generatedCodeColumn = 0;
        previousContentLineEnd = contentLineEnd;
        contentLineEnd = content.indexOf("\n", contentLineEnd + 1);
      }
      const segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
      if (nameIndex >= 0) {
        segment.push(nameIndex);
      }
      this.rawSegments.push(segment);
      this.advance(content.slice(previousContentLineEnd + 1));
    } else if (this.pending) {
      this.rawSegments.push(this.pending);
      this.advance(content);
    }
    this.pending = null;
  }
  addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
    let originalCharIndex = chunk.start;
    let first = true;
    let charInHiresBoundary = false;
    while (originalCharIndex < chunk.end) {
      if (original[originalCharIndex] === "\n") {
        loc.line += 1;
        loc.column = 0;
        this.generatedCodeLine += 1;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
        this.generatedCodeColumn = 0;
        first = true;
        charInHiresBoundary = false;
      } else {
        if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
          const segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
          if (this.hires === "boundary") {
            if (wordRegex.test(original[originalCharIndex])) {
              if (!charInHiresBoundary) {
                this.rawSegments.push(segment);
                charInHiresBoundary = true;
              }
            } else {
              this.rawSegments.push(segment);
              charInHiresBoundary = false;
            }
          } else {
            this.rawSegments.push(segment);
          }
        }
        loc.column += 1;
        this.generatedCodeColumn += 1;
        first = false;
      }
      originalCharIndex += 1;
    }
    this.pending = null;
  }
  advance(str) {
    if (!str) return;
    const lines = str.split("\n");
    if (lines.length > 1) {
      for (let i = 0; i < lines.length - 1; i++) {
        this.generatedCodeLine++;
        this.raw[this.generatedCodeLine] = this.rawSegments = [];
      }
      this.generatedCodeColumn = 0;
    }
    this.generatedCodeColumn += lines[lines.length - 1].length;
  }
}
const n = "\n";
const warned = {
  insertLeft: false,
  insertRight: false,
  storeName: false
};
class MagicString {
  constructor(string, options = {}) {
    const chunk = new Chunk(0, string.length, string);
    Object.defineProperties(this, {
      original: { writable: true, value: string },
      outro: { writable: true, value: "" },
      intro: { writable: true, value: "" },
      firstChunk: { writable: true, value: chunk },
      lastChunk: { writable: true, value: chunk },
      lastSearchedChunk: { writable: true, value: chunk },
      byStart: { writable: true, value: {} },
      byEnd: { writable: true, value: {} },
      filename: { writable: true, value: options.filename },
      indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
      sourcemapLocations: { writable: true, value: new BitSet() },
      storedNames: { writable: true, value: {} },
      indentStr: { writable: true, value: void 0 },
      ignoreList: { writable: true, value: options.ignoreList },
      offset: { writable: true, value: options.offset || 0 }
    });
    this.byStart[0] = chunk;
    this.byEnd[string.length] = chunk;
  }
  addSourcemapLocation(char) {
    this.sourcemapLocations.add(char);
  }
  append(content) {
    if (typeof content !== "string") throw new TypeError("outro content must be a string");
    this.outro += content;
    return this;
  }
  appendLeft(index, content) {
    index = index + this.offset;
    if (typeof content !== "string") throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.appendLeft(content);
    } else {
      this.intro += content;
    }
    return this;
  }
  appendRight(index, content) {
    index = index + this.offset;
    if (typeof content !== "string") throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.appendRight(content);
    } else {
      this.outro += content;
    }
    return this;
  }
  clone() {
    const cloned = new MagicString(this.original, { filename: this.filename, offset: this.offset });
    let originalChunk = this.firstChunk;
    let clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
    while (originalChunk) {
      cloned.byStart[clonedChunk.start] = clonedChunk;
      cloned.byEnd[clonedChunk.end] = clonedChunk;
      const nextOriginalChunk = originalChunk.next;
      const nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
      if (nextClonedChunk) {
        clonedChunk.next = nextClonedChunk;
        nextClonedChunk.previous = clonedChunk;
        clonedChunk = nextClonedChunk;
      }
      originalChunk = nextOriginalChunk;
    }
    cloned.lastChunk = clonedChunk;
    if (this.indentExclusionRanges) {
      cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
    }
    cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
    cloned.intro = this.intro;
    cloned.outro = this.outro;
    return cloned;
  }
  generateDecodedMap(options) {
    options = options || {};
    const sourceIndex = 0;
    const names = Object.keys(this.storedNames);
    const mappings = new Mappings(options.hires);
    const locate = getLocator(this.original);
    if (this.intro) {
      mappings.advance(this.intro);
    }
    this.firstChunk.eachNext((chunk) => {
      const loc = locate(chunk.start);
      if (chunk.intro.length) mappings.advance(chunk.intro);
      if (chunk.edited) {
        mappings.addEdit(
          sourceIndex,
          chunk.content,
          loc,
          chunk.storeName ? names.indexOf(chunk.original) : -1
        );
      } else {
        mappings.addUneditedChunk(sourceIndex, chunk, this.original, loc, this.sourcemapLocations);
      }
      if (chunk.outro.length) mappings.advance(chunk.outro);
    });
    if (this.outro) {
      mappings.advance(this.outro);
    }
    return {
      file: options.file ? options.file.split(/[/\\]/).pop() : void 0,
      sources: [
        options.source ? getRelativePath(options.file || "", options.source) : options.file || ""
      ],
      sourcesContent: options.includeContent ? [this.original] : void 0,
      names,
      mappings: mappings.raw,
      x_google_ignoreList: this.ignoreList ? [sourceIndex] : void 0
    };
  }
  generateMap(options) {
    return new SourceMap(this.generateDecodedMap(options));
  }
  _ensureindentStr() {
    if (this.indentStr === void 0) {
      this.indentStr = guessIndent(this.original);
    }
  }
  _getRawIndentString() {
    this._ensureindentStr();
    return this.indentStr;
  }
  getIndentString() {
    this._ensureindentStr();
    return this.indentStr === null ? "	" : this.indentStr;
  }
  indent(indentStr, options) {
    const pattern = /^[^\r\n]/gm;
    if (isObject(indentStr)) {
      options = indentStr;
      indentStr = void 0;
    }
    if (indentStr === void 0) {
      this._ensureindentStr();
      indentStr = this.indentStr || "	";
    }
    if (indentStr === "") return this;
    options = options || {};
    const isExcluded = {};
    if (options.exclude) {
      const exclusions = typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude;
      exclusions.forEach((exclusion) => {
        for (let i = exclusion[0]; i < exclusion[1]; i += 1) {
          isExcluded[i] = true;
        }
      });
    }
    let shouldIndentNextCharacter = options.indentStart !== false;
    const replacer = (match) => {
      if (shouldIndentNextCharacter) return `${indentStr}${match}`;
      shouldIndentNextCharacter = true;
      return match;
    };
    this.intro = this.intro.replace(pattern, replacer);
    let charIndex = 0;
    let chunk = this.firstChunk;
    while (chunk) {
      const end = chunk.end;
      if (chunk.edited) {
        if (!isExcluded[charIndex]) {
          chunk.content = chunk.content.replace(pattern, replacer);
          if (chunk.content.length) {
            shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
          }
        }
      } else {
        charIndex = chunk.start;
        while (charIndex < end) {
          if (!isExcluded[charIndex]) {
            const char = this.original[charIndex];
            if (char === "\n") {
              shouldIndentNextCharacter = true;
            } else if (char !== "\r" && shouldIndentNextCharacter) {
              shouldIndentNextCharacter = false;
              if (charIndex === chunk.start) {
                chunk.prependRight(indentStr);
              } else {
                this._splitChunk(chunk, charIndex);
                chunk = chunk.next;
                chunk.prependRight(indentStr);
              }
            }
          }
          charIndex += 1;
        }
      }
      charIndex = chunk.end;
      chunk = chunk.next;
    }
    this.outro = this.outro.replace(pattern, replacer);
    return this;
  }
  insert() {
    throw new Error(
      "magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)"
    );
  }
  insertLeft(index, content) {
    if (!warned.insertLeft) {
      console.warn(
        "magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"
      );
      warned.insertLeft = true;
    }
    return this.appendLeft(index, content);
  }
  insertRight(index, content) {
    if (!warned.insertRight) {
      console.warn(
        "magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"
      );
      warned.insertRight = true;
    }
    return this.prependRight(index, content);
  }
  move(start, end, index) {
    start = start + this.offset;
    end = end + this.offset;
    index = index + this.offset;
    if (index >= start && index <= end) throw new Error("Cannot move a selection inside itself");
    this._split(start);
    this._split(end);
    this._split(index);
    const first = this.byStart[start];
    const last = this.byEnd[end];
    const oldLeft = first.previous;
    const oldRight = last.next;
    const newRight = this.byStart[index];
    if (!newRight && last === this.lastChunk) return this;
    const newLeft = newRight ? newRight.previous : this.lastChunk;
    if (oldLeft) oldLeft.next = oldRight;
    if (oldRight) oldRight.previous = oldLeft;
    if (newLeft) newLeft.next = first;
    if (newRight) newRight.previous = last;
    if (!first.previous) this.firstChunk = last.next;
    if (!last.next) {
      this.lastChunk = first.previous;
      this.lastChunk.next = null;
    }
    first.previous = newLeft;
    last.next = newRight || null;
    if (!newLeft) this.firstChunk = first;
    if (!newRight) this.lastChunk = last;
    return this;
  }
  overwrite(start, end, content, options) {
    options = options || {};
    return this.update(start, end, content, { ...options, overwrite: !options.contentOnly });
  }
  update(start, end, content, options) {
    start = start + this.offset;
    end = end + this.offset;
    if (typeof content !== "string") throw new TypeError("replacement content must be a string");
    if (this.original.length !== 0) {
      while (start < 0) start += this.original.length;
      while (end < 0) end += this.original.length;
    }
    if (end > this.original.length) throw new Error("end is out of bounds");
    if (start === end)
      throw new Error(
        "Cannot overwrite a zero-length range – use appendLeft or prependRight instead"
      );
    this._split(start);
    this._split(end);
    if (options === true) {
      if (!warned.storeName) {
        console.warn(
          "The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"
        );
        warned.storeName = true;
      }
      options = { storeName: true };
    }
    const storeName = options !== void 0 ? options.storeName : false;
    const overwrite = options !== void 0 ? options.overwrite : false;
    if (storeName) {
      const original = this.original.slice(start, end);
      Object.defineProperty(this.storedNames, original, {
        writable: true,
        value: true,
        enumerable: true
      });
    }
    const first = this.byStart[start];
    const last = this.byEnd[end];
    if (first) {
      let chunk = first;
      while (chunk !== last) {
        if (chunk.next !== this.byStart[chunk.end]) {
          throw new Error("Cannot overwrite across a split point");
        }
        chunk = chunk.next;
        chunk.edit("", false);
      }
      first.edit(content, storeName, !overwrite);
    } else {
      const newChunk = new Chunk(start, end, "").edit(content, storeName);
      last.next = newChunk;
      newChunk.previous = last;
    }
    return this;
  }
  prepend(content) {
    if (typeof content !== "string") throw new TypeError("outro content must be a string");
    this.intro = content + this.intro;
    return this;
  }
  prependLeft(index, content) {
    index = index + this.offset;
    if (typeof content !== "string") throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byEnd[index];
    if (chunk) {
      chunk.prependLeft(content);
    } else {
      this.intro = content + this.intro;
    }
    return this;
  }
  prependRight(index, content) {
    index = index + this.offset;
    if (typeof content !== "string") throw new TypeError("inserted content must be a string");
    this._split(index);
    const chunk = this.byStart[index];
    if (chunk) {
      chunk.prependRight(content);
    } else {
      this.outro = content + this.outro;
    }
    return this;
  }
  remove(start, end) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0) start += this.original.length;
      while (end < 0) end += this.original.length;
    }
    if (start === end) return this;
    if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
    if (start > end) throw new Error("end must be greater than start");
    this._split(start);
    this._split(end);
    let chunk = this.byStart[start];
    while (chunk) {
      chunk.intro = "";
      chunk.outro = "";
      chunk.edit("");
      chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    }
    return this;
  }
  reset(start, end) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0) start += this.original.length;
      while (end < 0) end += this.original.length;
    }
    if (start === end) return this;
    if (start < 0 || end > this.original.length) throw new Error("Character is out of bounds");
    if (start > end) throw new Error("end must be greater than start");
    this._split(start);
    this._split(end);
    let chunk = this.byStart[start];
    while (chunk) {
      chunk.reset();
      chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    }
    return this;
  }
  lastChar() {
    if (this.outro.length) return this.outro[this.outro.length - 1];
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length) return chunk.outro[chunk.outro.length - 1];
      if (chunk.content.length) return chunk.content[chunk.content.length - 1];
      if (chunk.intro.length) return chunk.intro[chunk.intro.length - 1];
    } while (chunk = chunk.previous);
    if (this.intro.length) return this.intro[this.intro.length - 1];
    return "";
  }
  lastLine() {
    let lineIndex = this.outro.lastIndexOf(n);
    if (lineIndex !== -1) return this.outro.substr(lineIndex + 1);
    let lineStr = this.outro;
    let chunk = this.lastChunk;
    do {
      if (chunk.outro.length > 0) {
        lineIndex = chunk.outro.lastIndexOf(n);
        if (lineIndex !== -1) return chunk.outro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.outro + lineStr;
      }
      if (chunk.content.length > 0) {
        lineIndex = chunk.content.lastIndexOf(n);
        if (lineIndex !== -1) return chunk.content.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.content + lineStr;
      }
      if (chunk.intro.length > 0) {
        lineIndex = chunk.intro.lastIndexOf(n);
        if (lineIndex !== -1) return chunk.intro.substr(lineIndex + 1) + lineStr;
        lineStr = chunk.intro + lineStr;
      }
    } while (chunk = chunk.previous);
    lineIndex = this.intro.lastIndexOf(n);
    if (lineIndex !== -1) return this.intro.substr(lineIndex + 1) + lineStr;
    return this.intro + lineStr;
  }
  slice(start = 0, end = this.original.length - this.offset) {
    start = start + this.offset;
    end = end + this.offset;
    if (this.original.length !== 0) {
      while (start < 0) start += this.original.length;
      while (end < 0) end += this.original.length;
    }
    let result = "";
    let chunk = this.firstChunk;
    while (chunk && (chunk.start > start || chunk.end <= start)) {
      if (chunk.start < end && chunk.end >= end) {
        return result;
      }
      chunk = chunk.next;
    }
    if (chunk && chunk.edited && chunk.start !== start)
      throw new Error(`Cannot use replaced character ${start} as slice start anchor.`);
    const startChunk = chunk;
    while (chunk) {
      if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
        result += chunk.intro;
      }
      const containsEnd = chunk.start < end && chunk.end >= end;
      if (containsEnd && chunk.edited && chunk.end !== end)
        throw new Error(`Cannot use replaced character ${end} as slice end anchor.`);
      const sliceStart = startChunk === chunk ? start - chunk.start : 0;
      const sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
      result += chunk.content.slice(sliceStart, sliceEnd);
      if (chunk.outro && (!containsEnd || chunk.end === end)) {
        result += chunk.outro;
      }
      if (containsEnd) {
        break;
      }
      chunk = chunk.next;
    }
    return result;
  }
  // TODO deprecate this? not really very useful
  snip(start, end) {
    const clone2 = this.clone();
    clone2.remove(0, start);
    clone2.remove(end, clone2.original.length);
    return clone2;
  }
  _split(index) {
    if (this.byStart[index] || this.byEnd[index]) return;
    let chunk = this.lastSearchedChunk;
    let previousChunk = chunk;
    const searchForward = index > chunk.end;
    while (chunk) {
      if (chunk.contains(index)) return this._splitChunk(chunk, index);
      chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
      if (chunk === previousChunk) return;
      previousChunk = chunk;
    }
  }
  _splitChunk(chunk, index) {
    if (chunk.edited && chunk.content.length) {
      const loc = getLocator(this.original)(index);
      throw new Error(
        `Cannot split a chunk that has already been edited (${loc.line}:${loc.column} – "${chunk.original}")`
      );
    }
    const newChunk = chunk.split(index);
    this.byEnd[index] = chunk;
    this.byStart[index] = newChunk;
    this.byEnd[newChunk.end] = newChunk;
    if (chunk === this.lastChunk) this.lastChunk = newChunk;
    this.lastSearchedChunk = chunk;
    return true;
  }
  toString() {
    let str = this.intro;
    let chunk = this.firstChunk;
    while (chunk) {
      str += chunk.toString();
      chunk = chunk.next;
    }
    return str + this.outro;
  }
  isEmpty() {
    let chunk = this.firstChunk;
    do {
      if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim())
        return false;
    } while (chunk = chunk.next);
    return true;
  }
  length() {
    let chunk = this.firstChunk;
    let length2 = 0;
    do {
      length2 += chunk.intro.length + chunk.content.length + chunk.outro.length;
    } while (chunk = chunk.next);
    return length2;
  }
  trimLines() {
    return this.trim("[\\r\\n]");
  }
  trim(charType) {
    return this.trimStart(charType).trimEnd(charType);
  }
  trimEndAborted(charType) {
    const rx = new RegExp((charType || "\\s") + "+$");
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length) return true;
    let chunk = this.lastChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimEnd(rx);
      if (chunk.end !== end) {
        if (this.lastChunk === chunk) {
          this.lastChunk = chunk.next;
        }
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted) return true;
      chunk = chunk.previous;
    } while (chunk);
    return false;
  }
  trimEnd(charType) {
    this.trimEndAborted(charType);
    return this;
  }
  trimStartAborted(charType) {
    const rx = new RegExp("^" + (charType || "\\s") + "+");
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length) return true;
    let chunk = this.firstChunk;
    do {
      const end = chunk.end;
      const aborted = chunk.trimStart(rx);
      if (chunk.end !== end) {
        if (chunk === this.lastChunk) this.lastChunk = chunk.next;
        this.byEnd[chunk.end] = chunk;
        this.byStart[chunk.next.start] = chunk.next;
        this.byEnd[chunk.next.end] = chunk.next;
      }
      if (aborted) return true;
      chunk = chunk.next;
    } while (chunk);
    return false;
  }
  trimStart(charType) {
    this.trimStartAborted(charType);
    return this;
  }
  hasChanged() {
    return this.original !== this.toString();
  }
  _replaceRegexp(searchValue, replacement) {
    function getReplacement(match, str) {
      if (typeof replacement === "string") {
        return replacement.replace(/\$(\$|&|\d+)/g, (_, i) => {
          if (i === "$") return "$";
          if (i === "&") return match[0];
          const num = +i;
          if (num < match.length) return match[+i];
          return `$${i}`;
        });
      } else {
        return replacement(...match, match.index, str, match.groups);
      }
    }
    function matchAll(re, str) {
      let match;
      const matches = [];
      while (match = re.exec(str)) {
        matches.push(match);
      }
      return matches;
    }
    if (searchValue.global) {
      const matches = matchAll(searchValue, this.original);
      matches.forEach((match) => {
        if (match.index != null) {
          const replacement2 = getReplacement(match, this.original);
          if (replacement2 !== match[0]) {
            this.overwrite(match.index, match.index + match[0].length, replacement2);
          }
        }
      });
    } else {
      const match = this.original.match(searchValue);
      if (match && match.index != null) {
        const replacement2 = getReplacement(match, this.original);
        if (replacement2 !== match[0]) {
          this.overwrite(match.index, match.index + match[0].length, replacement2);
        }
      }
    }
    return this;
  }
  _replaceString(string, replacement) {
    const { original } = this;
    const index = original.indexOf(string);
    if (index !== -1) {
      if (typeof replacement === "function") {
        replacement = replacement(string, index, original);
      }
      if (string !== replacement) {
        this.overwrite(index, index + string.length, replacement);
      }
    }
    return this;
  }
  replace(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceString(searchValue, replacement);
    }
    return this._replaceRegexp(searchValue, replacement);
  }
  _replaceAllString(string, replacement) {
    const { original } = this;
    const stringLength = string.length;
    for (let index = original.indexOf(string); index !== -1; index = original.indexOf(string, index + stringLength)) {
      const previous = original.slice(index, index + stringLength);
      let _replacement = replacement;
      if (typeof replacement === "function") {
        _replacement = replacement(previous, index, original);
      }
      if (previous !== _replacement) this.overwrite(index, index + stringLength, _replacement);
    }
    return this;
  }
  replaceAll(searchValue, replacement) {
    if (typeof searchValue === "string") {
      return this._replaceAllString(searchValue, replacement);
    }
    if (!searchValue.global) {
      throw new TypeError(
        "MagicString.prototype.replaceAll called with a non-global RegExp argument"
      );
    }
    return this._replaceRegexp(searchValue, replacement);
  }
}
function getBracket(str, open, close) {
  if (str === "") return;
  const l = str.length;
  let parenthesis = 0;
  let opened = false;
  let openAt = 0;
  for (let i = 0; i < l; i++) switch (str[i]) {
    case open:
      if (!opened) {
        opened = true;
        openAt = i;
      }
      parenthesis++;
      break;
    case close:
      --parenthesis;
      if (parenthesis < 0) return;
      if (parenthesis === 0) return [
        str.slice(openAt, i + 1),
        str.slice(i + 1),
        str.slice(0, openAt)
      ];
      break;
  }
}
function getStringComponent(str, open, close, separators) {
  if (str === "") return;
  if (isString(separators)) separators = [separators];
  if (separators.length === 0) return;
  const l = str.length;
  let parenthesis = 0;
  for (let i = 0; i < l; i++) switch (str[i]) {
    case open:
      parenthesis++;
      break;
    case close:
      if (--parenthesis < 0) return;
      break;
    default:
      for (const separator of separators) {
        const separatorLength = separator.length;
        if (separatorLength && separator === str.slice(i, i + separatorLength) && parenthesis === 0) {
          if (i === 0 || i === l - separatorLength) return;
          return [str.slice(0, i), str.slice(i + separatorLength)];
        }
      }
  }
  return [str, ""];
}
function getStringComponents(str, separators, limit, open = "(", close = ")") {
  limit = limit ?? 10;
  const components = [];
  let i = 0;
  while (str !== "") {
    if (++i > limit) return;
    const componentPair = getStringComponent(str, open, close, separators);
    if (!componentPair) return;
    const [component, rest] = componentPair;
    components.push(component);
    str = rest;
  }
  if (components.length > 0) return components;
}
const cssColorFunctions = [
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "rgb",
  "rgba"
];
const rectangularColorSpace = [
  "srgb",
  "srgb-linear",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "lab",
  "oklab",
  "xyz",
  "xyz-d50",
  "xyz-d65"
];
const polarColorSpace = [
  "hsl",
  "hwb",
  "lch",
  "oklch"
];
const hueInterpolationMethods = [
  "shorter",
  "longer",
  "increasing",
  "decreasing"
];
const alphaPlaceholders = ["%alpha", "<alpha-value>"];
const alphaPlaceholdersRE = new RegExp(alphaPlaceholders.map((v) => escapeRegExp(v)).join("|"), "g");
function isInterpolatedMethod(type) {
  if (!type) return false;
  return rectangularColorSpace.some((space) => type.includes(space)) || polarColorSpace.some((space) => type.includes(space)) || hueInterpolationMethods.some((method) => type.includes(method));
}
function hex2rgba(hex2 = "") {
  const color2 = parseHexColor(hex2);
  if (color2 != null) {
    const { components, alpha: alpha2 } = color2;
    if (alpha2 == null) return components;
    return [...components, alpha2];
  }
}
function parseCssColor(str = "") {
  const color2 = parseColor$1(str);
  if (color2 == null || color2 === false) return;
  const { type: casedType, components, alpha: alpha2 } = color2;
  const type = casedType.toLowerCase();
  if (components.length === 0) return;
  if (cssColorFunctions.includes(type) && ![1, 3].includes(components.length)) return;
  return {
    type,
    components: components.map((c2) => typeof c2 === "string" ? c2.trim() : c2),
    alpha: typeof alpha2 === "string" ? alpha2.trim() : alpha2
  };
}
function colorOpacityToString(color2) {
  const alpha2 = color2.alpha ?? 1;
  return typeof alpha2 === "string" && alphaPlaceholders.includes(alpha2) ? 1 : alpha2;
}
function colorToString(color2, alphaOverride) {
  if (typeof color2 === "string") return color2.replace(alphaPlaceholdersRE, `${alphaOverride ?? 1}`);
  const { components } = color2;
  let { alpha: alpha2, type } = color2;
  alpha2 = alphaOverride ?? alpha2;
  type = type.toLowerCase();
  if (["hsla", "rgba"].includes(type)) return `${type}(${components.join(", ")}${alpha2 == null ? "" : `, ${alpha2}`})`;
  alpha2 = alpha2 == null ? "" : ` / ${alpha2}`;
  if (cssColorFunctions.includes(type)) return `${type}(${components.join(" ")}${alpha2})`;
  return `color(${type} ${components.join(" ")}${alpha2})`;
}
function parseColor$1(str) {
  if (!str) return;
  let color2 = parseHexColor(str);
  if (color2 != null) return color2;
  color2 = cssColorKeyword(str);
  if (color2 != null) return color2;
  color2 = parseCssCommaColorFunction(str);
  if (color2 != null) return color2;
  color2 = parseCssSpaceColorFunction(str);
  if (color2 != null) return color2;
  color2 = parseCssColorFunction(str);
  if (color2 != null) return color2;
}
function parseHexColor(str) {
  const [, body] = str.match(/^#([\da-f]+)$/i) || [];
  if (!body) return;
  switch (body.length) {
    case 3:
    case 4: {
      const digits = Array.from(body, (s) => Number.parseInt(s, 16)).map((n2) => n2 << 4 | n2);
      return {
        type: "rgb",
        components: digits.slice(0, 3),
        alpha: body.length === 3 ? void 0 : Math.round(digits[3] / 255 * 100) / 100
      };
    }
    case 6:
    case 8: {
      const value2 = Number.parseInt(body, 16);
      return {
        type: "rgb",
        components: body.length === 6 ? [
          value2 >> 16 & 255,
          value2 >> 8 & 255,
          value2 & 255
        ] : [
          value2 >> 24 & 255,
          value2 >> 16 & 255,
          value2 >> 8 & 255
        ],
        alpha: body.length === 6 ? void 0 : Math.round((value2 & 255) / 255 * 100) / 100
      };
    }
  }
}
function cssColorKeyword(str) {
  const color2 = { rebeccapurple: [
    102,
    51,
    153,
    1
  ] }[str];
  if (color2 != null) return {
    type: "rgb",
    components: color2.slice(0, 3),
    alpha: color2[3]
  };
}
function parseCssCommaColorFunction(color2) {
  const match = color2.match(/^(rgb|rgba|hsl|hsla)\((.+)\)$/i);
  if (!match) return;
  const [, type, componentString] = match;
  const components = getStringComponents(componentString, ",", 5);
  if (components) {
    if ([3, 4].includes(components.length)) return {
      type,
      components: components.slice(0, 3),
      alpha: components[3]
    };
    else if (components.length !== 1) return false;
  }
}
const cssColorFunctionsRe = new RegExp(`^(${cssColorFunctions.join("|")})\\((.+)\\)$`, "i");
function parseCssSpaceColorFunction(color2) {
  const match = color2.match(cssColorFunctionsRe);
  if (!match) return;
  const [, fn, componentString] = match;
  const parsed = parseCssSpaceColorValues(`${fn} ${componentString}`);
  if (parsed) {
    const { alpha: alpha2, components: [type, ...components] } = parsed;
    return {
      type,
      components,
      alpha: alpha2
    };
  }
}
function parseCssColorFunction(color2) {
  const match = color2.match(/^color\((.+)\)$/);
  if (!match) return;
  const parsed = parseCssSpaceColorValues(match[1]);
  if (parsed) {
    const { alpha: alpha2, components: [type, ...components] } = parsed;
    return {
      type,
      components,
      alpha: alpha2
    };
  }
}
function parseCssSpaceColorValues(componentString) {
  const components = getStringComponents(componentString, " ");
  if (!components) return;
  let totalComponents = components.length;
  if (components[totalComponents - 2] === "/") return {
    components: components.slice(0, totalComponents - 2),
    alpha: components[totalComponents - 1]
  };
  if (components[totalComponents - 2] != null && (components[totalComponents - 2].endsWith("/") || components[totalComponents - 1].startsWith("/"))) {
    const removed = components.splice(totalComponents - 2);
    components.push(removed.join(" "));
    --totalComponents;
  }
  const withAlpha = getStringComponents(components[totalComponents - 1], "/", 2);
  if (!withAlpha) return;
  if (withAlpha.length === 1 || withAlpha[withAlpha.length - 1] === "") return { components };
  const alpha2 = withAlpha.pop();
  components[totalComponents - 1] = withAlpha.join("/");
  return {
    components,
    alpha: alpha2
  };
}
const themeFnRE = /theme\(\s*(['"])?(.*?)\1?\s*\)/g;
function hasThemeFn(str) {
  return str.includes("theme(") && str.includes(")");
}
function transformThemeFn(code2, theme2, throwOnMissing = true) {
  const matches = Array.from(code2.toString().matchAll(themeFnRE));
  if (!matches.length) return code2;
  const s = new MagicString(code2);
  for (const match of matches) {
    const rawArg = match[2];
    if (!rawArg) throw new Error("theme() expect exact one argument, but got 0");
    const value2 = transformThemeString(rawArg, theme2, throwOnMissing);
    if (value2) s.overwrite(match.index, match.index + match[0].length, value2);
  }
  return s.toString();
}
function transformThemeString(code2, theme2, throwOnMissing = true) {
  const [rawKey, alpha2] = code2.split("/");
  let value2 = rawKey.trim().split(".").reduce((t, k) => t?.[k], theme2);
  if (typeof value2 === "object") value2 = value2.DEFAULT;
  if (typeof value2 === "string") {
    if (alpha2) {
      const color2 = parseCssColor(value2);
      if (color2) value2 = colorToString(color2, alpha2);
    }
    return value2;
  } else if (throwOnMissing) throw new Error(`theme of "${code2}" did not found`);
}
function calcMaxWidthBySize(size) {
  const value2 = size.match(/^-?\d+\.?\d*/)?.[0] || "";
  const unit = size.slice(value2.length);
  if (unit === "px") {
    const maxWidth2 = Number.parseFloat(value2) - 0.1;
    return Number.isNaN(maxWidth2) ? size : `${maxWidth2}${unit}`;
  }
  return `calc(${size} - 0.1px)`;
}
function createValueHandler(handlers) {
  const handler2 = function(str, theme2) {
    const s = this.__options?.sequence || [];
    this.__options.sequence = [];
    for (const n2 of s) {
      const res = handlers[n2](str, theme2);
      if (res != null) return res;
    }
  };
  function addProcessor(that, name2) {
    if (!that.__options) that.__options = { sequence: [] };
    that.__options.sequence.push(name2);
    return that;
  }
  for (const name2 of Object.keys(handlers)) Object.defineProperty(handler2, name2, {
    enumerable: true,
    configurable: true,
    get() {
      return addProcessor(this, name2);
    }
  });
  return handler2;
}
const iconFnRE = /icon\(\s*(['"])?(.*?)\1?\s*\)/g;
function hasIconFn(str) {
  return str.includes("icon(") && str.includes(")");
}
const PseudoPlaceholder = "__pseudo_placeholder__";
const PseudoClasses = Object.fromEntries([
  ["first-letter", "::first-letter"],
  ["first-line", "::first-line"],
  "any-link",
  "link",
  "visited",
  "target",
  ["open", "[open]"],
  "default",
  "checked",
  "indeterminate",
  "placeholder-shown",
  "autofill",
  "optional",
  "required",
  "valid",
  "invalid",
  "user-valid",
  "user-invalid",
  "in-range",
  "out-of-range",
  "read-only",
  "read-write",
  "empty",
  "focus-within",
  "hover",
  "focus",
  "focus-visible",
  "active",
  "enabled",
  "disabled",
  "popover-open",
  "root",
  "empty",
  ["even-of-type", ":nth-of-type(even)"],
  ["even", ":nth-child(even)"],
  ["odd-of-type", ":nth-of-type(odd)"],
  ["odd", ":nth-child(odd)"],
  ["nth", `:nth-child(${PseudoPlaceholder})`],
  ["nth-last", `:nth-last-child(${PseudoPlaceholder})`],
  ["nth-last-of-type", `:nth-last-of-type(${PseudoPlaceholder})`],
  ["nth-of-type", `:nth-of-type(${PseudoPlaceholder})`],
  "first-of-type",
  ["first", ":first-child"],
  "last-of-type",
  ["last", ":last-child"],
  "only-child",
  "only-of-type",
  ["backdrop-element", "::backdrop"],
  ["placeholder", "::placeholder"],
  ["before", "::before"],
  ["after", "::after"],
  ["file", "::file-selector-button"],
  ["details-content", "::details-content"]
].map((key) => Array.isArray(key) ? key : [key, `:${key}`]));
const PseudoClassesKeys = Object.keys(PseudoClasses);
const PseudoClassesColon = Object.fromEntries([["backdrop", "::backdrop"]].map((key) => Array.isArray(key) ? key : [key, `:${key}`]));
const PseudoClassesColonKeys = Object.keys(PseudoClassesColon);
const PseudoClassFunctions = [
  "not",
  "is",
  "where",
  "has"
];
const PseudoClassesMulti = Object.fromEntries([["selection", ["::selection", " *::selection"]], ["marker", ["::marker", " *::marker"]]]);
const PseudoClassesStr = Object.entries(PseudoClasses).filter(([, pseudo2]) => !pseudo2.startsWith("::")).map(([key]) => key).sort((a2, b2) => b2.length - a2.length).join("|");
const PseudoClassesColonStr = Object.entries(PseudoClassesColon).filter(([, pseudo2]) => !pseudo2.startsWith("::")).map(([key]) => key).sort((a2, b2) => b2.length - a2.length).join("|");
const PseudoClassFunctionsStr = PseudoClassFunctions.join("|");
const PseudoClassesMultiStr = Object.keys(PseudoClassesMulti).sort((a2, b2) => b2.length - a2.length).join("|");
const excludedPseudo = [
  "::-webkit-resizer",
  "::-webkit-scrollbar",
  "::-webkit-scrollbar-button",
  "::-webkit-scrollbar-corner",
  "::-webkit-scrollbar-thumb",
  "::-webkit-scrollbar-track",
  "::-webkit-scrollbar-track-piece",
  "::file-selector-button"
];
const PseudoClassesAndElementsStr = Object.entries(PseudoClasses).map(([key]) => key).sort((a2, b2) => b2.length - a2.length).join("|");
const PseudoClassesAndElementsColonStr = Object.entries(PseudoClassesColon).map(([key]) => key).sort((a2, b2) => b2.length - a2.length).join("|");
function createTaggedPseudoClassMatcher(tag, parent, combinator, utils) {
  const { h: h2, variantGetBracket: variantGetBracket2 } = utils;
  const rawRE = new RegExp(`^(${escapeRegExp(parent)}:)(\\S+)${escapeRegExp(combinator)}\\1`);
  let splitRE;
  let pseudoRE;
  let pseudoColonRE;
  let pseudoVarRE;
  const matchBracket = (input) => {
    const body = variantGetBracket2(`${tag}-`, input, []);
    if (!body) return;
    const [match, rest] = body;
    const bracketValue = h2.bracket(match);
    if (bracketValue == null) return;
    const label = rest.split(splitRE, 1)?.[0] ?? "";
    const prefix = `${parent}${escapeSelector(label)}`;
    return [
      label,
      input.slice(input.length - (rest.length - label.length - 1)),
      bracketValue.includes("&") ? bracketValue.replace(/&/g, prefix) : `${prefix}${bracketValue}`
    ];
  };
  const matchPseudo = (input) => {
    const match = input.match(pseudoRE) || input.match(pseudoColonRE);
    if (!match) return;
    const [original, fn, pseudoKey] = match;
    const label = match[3] ?? "";
    let pseudo2 = PseudoClasses[pseudoKey] || PseudoClassesColon[pseudoKey] || `:${pseudoKey}`;
    if (fn) pseudo2 = `:${fn}(${pseudo2})`;
    return [
      label,
      input.slice(original.length),
      `${parent}${escapeSelector(label)}${pseudo2}`,
      pseudoKey
    ];
  };
  const matchPseudoVar = (input) => {
    const match = input.match(pseudoVarRE);
    if (!match) return;
    const [original, fn, pseudoValue] = match;
    const label = match[3] ?? "";
    const pseudo2 = `:${fn}(${pseudoValue})`;
    return [
      label,
      input.slice(original.length),
      `${parent}${escapeSelector(label)}${pseudo2}`
    ];
  };
  return {
    name: `pseudo:${tag}`,
    match(input, ctx) {
      if (!(splitRE && pseudoRE && pseudoColonRE)) {
        splitRE = new RegExp(`(?:${ctx.generator.config.separators.join("|")})`);
        pseudoRE = new RegExp(`^${tag}-(?:(?:(${PseudoClassFunctionsStr})-)?(${PseudoClassesStr}))(?:(/[\\w-]+))?(?:${ctx.generator.config.separators.join("|")})`);
        pseudoColonRE = new RegExp(`^${tag}-(?:(?:(${PseudoClassFunctionsStr})-)?(${PseudoClassesColonStr}))(?:(/[\\w-]+))?(?:${ctx.generator.config.separators.filter((x) => x !== "-").join("|")})`);
        pseudoVarRE = new RegExp(`^${tag}-(?:(${PseudoClassFunctionsStr})-)?\\[(.+)\\](?:(/[\\w-]+))?(?:${ctx.generator.config.separators.filter((x) => x !== "-").join("|")})`);
      }
      if (!input.startsWith(tag)) return;
      const result = matchBracket(input) || matchPseudo(input) || matchPseudoVar(input);
      if (!result) return;
      const [_label, matcher, prefix, pseudoName = ""] = result;
      return {
        matcher,
        handle: (input2, next) => next({
          ...input2,
          prefix: `${prefix}${combinator}${input2.prefix}`.replace(rawRE, "$1$2:"),
          sort: PseudoClassesKeys.indexOf(pseudoName) ?? PseudoClassesColonKeys.indexOf(pseudoName)
        })
      };
    },
    multiPass: true
  };
}
function createPseudoClassesAndElements(utils) {
  const { h: h2 } = utils;
  let PseudoClassesAndElementsRE;
  let PseudoClassesAndElementsColonRE;
  let PseudoClassesMultiRE;
  return [{
    name: "pseudo",
    match(input, ctx) {
      if (!(PseudoClassesAndElementsRE && PseudoClassesAndElementsColonRE)) {
        PseudoClassesAndElementsRE = new RegExp(`^(${PseudoClassesAndElementsStr})(?:-(\\d+|\\[(\\w|[+-.])+\\]))?(?:${ctx.generator.config.separators.join("|")})`);
        PseudoClassesAndElementsColonRE = new RegExp(`^(${PseudoClassesAndElementsColonStr})(?:${ctx.generator.config.separators.filter((x) => x !== "-").join("|")})`);
      }
      const match = input.match(PseudoClassesAndElementsRE) || input.match(PseudoClassesAndElementsColonRE);
      if (match) {
        let pseudo2 = PseudoClasses[match[1]] || PseudoClassesColon[match[1]] || `:${match[1]}`;
        if (match[2]) {
          let anPlusB2;
          if (match[2].startsWith("[") && match[2].endsWith("]")) anPlusB2 = h2.bracket(match[2]);
          else anPlusB2 = match[2];
          if (anPlusB2) pseudo2 = pseudo2.replace(PseudoPlaceholder, anPlusB2);
        }
        let index = PseudoClassesKeys.indexOf(match[1]);
        if (index === -1) index = PseudoClassesColonKeys.indexOf(match[1]);
        if (index === -1) index = void 0;
        return {
          matcher: input.slice(match[0].length),
          handle: (input2, next) => {
            const selectors = pseudo2.includes("::") && !excludedPseudo.includes(pseudo2) ? { pseudo: `${input2.pseudo}${pseudo2}` } : { selector: `${input2.selector}${pseudo2}` };
            return next({
              ...input2,
              ...selectors,
              sort: index,
              noMerge: true
            });
          }
        };
      }
    },
    multiPass: true,
    autocomplete: `(${PseudoClassesAndElementsStr}|${PseudoClassesAndElementsColonStr}):`
  }, {
    name: "pseudo:multi",
    match(input, ctx) {
      if (!PseudoClassesMultiRE) PseudoClassesMultiRE = new RegExp(`^(${PseudoClassesMultiStr})(?:${ctx.generator.config.separators.join("|")})`);
      const match = input.match(PseudoClassesMultiRE);
      if (match) return PseudoClassesMulti[match[1]].map((pseudo2) => {
        return {
          matcher: input.slice(match[0].length),
          handle: (input2, next) => next({
            ...input2,
            pseudo: `${input2.pseudo}${pseudo2}`
          })
        };
      });
    },
    multiPass: false,
    autocomplete: `(${PseudoClassesMultiStr}):`
  }];
}
function createPseudoClassFunctions(utils) {
  const { getBracket: getBracket2, h: h2 } = utils;
  let PseudoClassFunctionsRE;
  let PseudoClassColonFunctionsRE;
  let PseudoClassVarFunctionRE;
  return {
    match(input, ctx) {
      if (!(PseudoClassFunctionsRE && PseudoClassColonFunctionsRE)) {
        PseudoClassFunctionsRE = new RegExp(`^(${PseudoClassFunctionsStr})-(${PseudoClassesStr})(?:${ctx.generator.config.separators.join("|")})`);
        PseudoClassColonFunctionsRE = new RegExp(`^(${PseudoClassFunctionsStr})-(${PseudoClassesColonStr})(?:${ctx.generator.config.separators.filter((x) => x !== "-").join("|")})`);
        PseudoClassVarFunctionRE = new RegExp(`^(${PseudoClassFunctionsStr})-(\\[.+\\])(?:${ctx.generator.config.separators.filter((x) => x !== "-").join("|")})`);
      }
      const match = input.match(PseudoClassFunctionsRE) || input.match(PseudoClassColonFunctionsRE) || input.match(PseudoClassVarFunctionRE);
      if (match) {
        const fn = match[1];
        const pseudo2 = getBracket2(match[2], "[", "]") ? h2.bracket(match[2]) : PseudoClasses[match[2]] || PseudoClassesColon[match[2]] || `:${match[2]}`;
        return {
          matcher: input.slice(match[0].length),
          selector: (s) => `${s}:${fn}(${pseudo2})`
        };
      }
    },
    multiPass: true,
    autocomplete: `(${PseudoClassFunctionsStr})-(${PseudoClassesStr}|${PseudoClassesColonStr}):`
  };
}
function createTaggedPseudoClasses(options, utils) {
  const attributify = !!options?.attributifyPseudo;
  let firstPrefix = options?.prefix ?? "";
  firstPrefix = escapeSelector((Array.isArray(firstPrefix) ? firstPrefix : [firstPrefix]).filter(Boolean)[0] ?? "");
  const tagWithPrefix = (tag, combinator) => createTaggedPseudoClassMatcher(tag, attributify ? `[${firstPrefix}${tag}=""]` : `.${firstPrefix}${tag}`, combinator, utils);
  return [
    tagWithPrefix("group", " "),
    tagWithPrefix("peer", "~"),
    tagWithPrefix("parent", ">"),
    tagWithPrefix("previous", "+")
  ];
}
const PartClassesRE = /(part-\[(.+)\]:)(.+)/;
function createPartClasses() {
  return {
    match(input) {
      const match = input.match(PartClassesRE);
      if (match) {
        const part = `part(${match[2]})`;
        return {
          matcher: input.slice(match[1].length),
          selector: (s) => `${s}::${part}`
        };
      }
    },
    multiPass: true
  };
}
function variantMatcher(name2, handler2, options = {}) {
  let re;
  return {
    name: name2,
    match(input, ctx) {
      if (!re) re = new RegExp(`^${escapeRegExp(name2)}(?:${ctx.generator.config.separators.join("|")})`);
      const match = input.match(re);
      if (match) {
        const matcher = input.slice(match[0].length);
        const handlers = toArray(handler2).map((handler3) => ({
          matcher,
          handle: (input2, next) => next({
            ...input2,
            ...handler3(input2)
          }),
          ...options
        }));
        return handlers.length === 1 ? handlers[0] : handlers;
      }
    },
    autocomplete: `${name2}:`
  };
}
function variantParentMatcher(name2, parent) {
  let re;
  return {
    name: name2,
    match(input, ctx) {
      if (!re) re = new RegExp(`^${escapeRegExp(name2)}(?:${ctx.generator.config.separators.join("|")})`);
      const match = input.match(re);
      if (match) return {
        matcher: input.slice(match[0].length),
        handle: (input2, next) => next({
          ...input2,
          parent: `${input2.parent ? `${input2.parent} $$ ` : ""}${parent}`
        })
      };
    },
    autocomplete: `${name2}:`
  };
}
function variantGetBracket(prefix, matcher, separators) {
  if (matcher.startsWith(`${prefix}[`)) {
    const [match, rest] = getBracket(matcher.slice(prefix.length), "[", "]") ?? [];
    if (match && rest) {
      for (const separator of separators) if (rest.startsWith(separator)) return [
        match,
        rest.slice(separator.length),
        separator
      ];
      return [
        match,
        rest,
        ""
      ];
    }
  }
}
function variantGetParameter(prefix, matcher, separators) {
  for (const p of toArray(prefix)) if (matcher.startsWith(p)) {
    const body = variantGetBracket(p, matcher, separators);
    if (body) {
      const [label = "", rest = body[1]] = variantGetParameter("/", body[1], separators) ?? [];
      return [
        body[0],
        rest,
        label
      ];
    }
    for (const separator of separators.filter((x) => x !== "/")) {
      const pos = matcher.indexOf(separator, p.length);
      if (pos !== -1) {
        const labelPos = matcher.indexOf("/", p.length);
        const unlabelled = labelPos === -1 || pos <= labelPos;
        return [
          matcher.slice(p.length, unlabelled ? pos : labelPos),
          matcher.slice(pos + separator.length),
          unlabelled ? "" : matcher.slice(labelPos + 1, pos)
        ];
      }
    }
  }
}
const import__unocss_rule_utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PseudoClassFunctions,
  PseudoClassFunctionsStr,
  PseudoClasses,
  PseudoClassesAndElementsColonStr,
  PseudoClassesAndElementsStr,
  PseudoClassesColon,
  PseudoClassesColonKeys,
  PseudoClassesColonStr,
  PseudoClassesKeys,
  PseudoClassesMulti,
  PseudoClassesMultiStr,
  PseudoClassesStr,
  alphaPlaceholders,
  alphaPlaceholdersRE,
  calcMaxWidthBySize,
  colorOpacityToString,
  colorToString,
  createPartClasses,
  createPseudoClassFunctions,
  createPseudoClassesAndElements,
  createTaggedPseudoClassMatcher,
  createTaggedPseudoClasses,
  createValueHandler,
  cssColorFunctions,
  excludedPseudo,
  getBracket,
  getStringComponent,
  getStringComponents,
  hasIconFn,
  hasThemeFn,
  hex2rgba,
  hueInterpolationMethods,
  iconFnRE,
  isInterpolatedMethod,
  parseCssColor,
  polarColorSpace,
  rectangularColorSpace,
  themeFnRE,
  transformThemeFn,
  transformThemeString,
  variantGetBracket,
  variantGetParameter,
  variantMatcher,
  variantParentMatcher
}, Symbol.toStringTag, { value: "Module" }));
const directionMap = {
  "l": ["-left"],
  "r": ["-right"],
  "t": ["-top"],
  "b": ["-bottom"],
  "s": ["-inline-start"],
  "e": ["-inline-end"],
  "x": ["-left", "-right"],
  "y": ["-top", "-bottom"],
  "": [""],
  "bs": ["-block-start"],
  "be": ["-block-end"],
  "is": ["-inline-start"],
  "ie": ["-inline-end"],
  "block": ["-block-start", "-block-end"],
  "inline": ["-inline-start", "-inline-end"]
};
const insetMap = {
  ...directionMap,
  s: ["-inset-inline-start"],
  start: ["-inset-inline-start"],
  e: ["-inset-inline-end"],
  end: ["-inset-inline-end"],
  bs: ["-inset-block-start"],
  be: ["-inset-block-end"],
  is: ["-inset-inline-start"],
  ie: ["-inset-inline-end"],
  block: ["-inset-block-start", "-inset-block-end"],
  inline: ["-inset-inline-start", "-inset-inline-end"]
};
const cornerMap = {
  "l": ["-top-left", "-bottom-left"],
  "r": ["-top-right", "-bottom-right"],
  "t": ["-top-left", "-top-right"],
  "b": ["-bottom-left", "-bottom-right"],
  "tl": ["-top-left"],
  "lt": ["-top-left"],
  "tr": ["-top-right"],
  "rt": ["-top-right"],
  "bl": ["-bottom-left"],
  "lb": ["-bottom-left"],
  "br": ["-bottom-right"],
  "rb": ["-bottom-right"],
  "": [""],
  "bs": ["-start-start", "-start-end"],
  "be": ["-end-start", "-end-end"],
  "s": ["-end-start", "-start-start"],
  "is": ["-end-start", "-start-start"],
  "e": ["-start-end", "-end-end"],
  "ie": ["-start-end", "-end-end"],
  "ss": ["-start-start"],
  "bs-is": ["-start-start"],
  "is-bs": ["-start-start"],
  "se": ["-start-end"],
  "bs-ie": ["-start-end"],
  "ie-bs": ["-start-end"],
  "es": ["-end-start"],
  "be-is": ["-end-start"],
  "is-be": ["-end-start"],
  "ee": ["-end-end"],
  "be-ie": ["-end-end"],
  "ie-be": ["-end-end"]
};
const xyzMap = {
  "x": ["-x"],
  "y": ["-y"],
  "z": ["-z"],
  "": ["-x", "-y"]
};
const xyzArray = [
  "x",
  "y",
  "z"
];
const basePositionMap = [
  "top",
  "top center",
  "top left",
  "top right",
  "bottom",
  "bottom center",
  "bottom left",
  "bottom right",
  "left",
  "left center",
  "left top",
  "left bottom",
  "right",
  "right center",
  "right top",
  "right bottom",
  "center",
  "center top",
  "center bottom",
  "center left",
  "center right",
  "center center"
];
const positionMap = Object.assign({}, ...basePositionMap.map((p) => ({ [p.replace(/ /, "-")]: p })), ...basePositionMap.map((p) => ({ [p.replace(/\b(\w)\w+/g, "$1").replace(/ /, "")]: p })));
const globalKeywords = [
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset"
];
const cssMathFnRE = /^(calc|clamp|min|max)\s*\((.+)\)(.*)/;
const cssVarFnRE = /^(var)\s*\((.+)\)(.*)/;
const numberWithUnitRE = /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i;
const numberRE$1 = /^(-?\d*(?:\.\d+)?)$/;
const unitOnlyRE = /^(px|[sld]?v[wh])$/i;
const unitOnlyMap = {
  px: 1,
  vw: 100,
  vh: 100,
  svw: 100,
  svh: 100,
  dvw: 100,
  dvh: 100,
  lvh: 100,
  lvw: 100
};
const bracketTypeRe = /^\[(color|image|length|size|position|quoted|string):/i;
const splitComma = /,(?![^()]*\))/g;
var handlers_exports = /* @__PURE__ */ __exportAll({
  auto: () => auto,
  bracket: () => bracket,
  bracketOfColor: () => bracketOfColor,
  bracketOfLength: () => bracketOfLength,
  bracketOfPosition: () => bracketOfPosition,
  cssvar: () => cssvar,
  degree: () => degree,
  fraction: () => fraction,
  global: () => global$1,
  number: () => number$1,
  numberWithUnit: () => numberWithUnit,
  percent: () => percent,
  position: () => position,
  properties: () => properties$1,
  px: () => px,
  rem: () => rem,
  time: () => time$1
});
const cssProps = [
  "color",
  "border-color",
  "background-color",
  "outline-color",
  "text-decoration-color",
  "flex-grow",
  "flex",
  "flex-shrink",
  "grid",
  "grid-template-columns",
  "grid-template-rows",
  "caret-color",
  "font",
  "gap",
  "opacity",
  "visibility",
  "z-index",
  "font-weight",
  "zoom",
  "text-shadow",
  "transform",
  "box-shadow",
  "border",
  "background-position",
  "left",
  "right",
  "top",
  "bottom",
  "object-position",
  "max-height",
  "min-height",
  "max-width",
  "min-width",
  "height",
  "width",
  "border-width",
  "margin",
  "padding",
  "outline-width",
  "outline-offset",
  "font-size",
  "line-height",
  "text-indent",
  "vertical-align",
  "border-spacing",
  "letter-spacing",
  "word-spacing",
  "stroke",
  "filter",
  "backdrop-filter",
  "fill",
  "mask",
  "mask-size",
  "mask-border",
  "clip-path",
  "clip",
  "border-radius"
];
function round(n2) {
  return +n2.toFixed(10);
}
function numberWithUnit(str) {
  const match = str.match(numberWithUnitRE);
  if (!match) return;
  const [, n2, unit] = match;
  const num = Number.parseFloat(n2);
  if (unit && !Number.isNaN(num)) return `${round(num)}${unit}`;
}
function auto(str) {
  if (str === "auto" || str === "a") return "auto";
}
function rem(str) {
  if (!str) return;
  if (unitOnlyRE.test(str)) return `${unitOnlyMap[str]}${str}`;
  const match = str.match(numberWithUnitRE);
  if (!match) return;
  const [, n2, unit] = match;
  const num = Number.parseFloat(n2);
  if (!Number.isNaN(num)) {
    if (num === 0) return "0";
    return unit ? `${round(num)}${unit}` : `${round(num / 4)}rem`;
  }
}
function px(str) {
  if (unitOnlyRE.test(str)) return `${unitOnlyMap[str]}${str}`;
  const match = str.match(numberWithUnitRE);
  if (!match) return;
  const [, n2, unit] = match;
  const num = Number.parseFloat(n2);
  if (!Number.isNaN(num)) return unit ? `${round(num)}${unit}` : `${round(num)}px`;
}
function number$1(str) {
  if (!numberRE$1.test(str)) return;
  const num = Number.parseFloat(str);
  if (!Number.isNaN(num)) return round(num);
}
function percent(str) {
  if (str.endsWith("%")) str = str.slice(0, -1);
  if (!numberRE$1.test(str)) return;
  const num = Number.parseFloat(str);
  if (!Number.isNaN(num)) return `${round(num / 100)}`;
}
function fraction(str) {
  if (!str) return;
  if (str === "full") return "100%";
  const [left, right] = str.split("/");
  const num = Number.parseFloat(left) / Number.parseFloat(right);
  if (!Number.isNaN(num)) {
    if (num === 0) return "0";
    return `${round(num * 100)}%`;
  }
}
function bracketWithType(str, requiredType) {
  if (str && str.startsWith("[") && str.endsWith("]")) {
    let base;
    let hintedType;
    const match = str.match(bracketTypeRe);
    if (!match) base = str.slice(1, -1);
    else {
      if (!requiredType) hintedType = match[1];
      base = str.slice(match[0].length, -1);
    }
    if (!base) return;
    if (base === '=""') return;
    if (base.startsWith("--")) base = `var(${base})`;
    let curly = 0;
    for (const i of base) if (i === "[") curly += 1;
    else if (i === "]") {
      curly -= 1;
      if (curly < 0) return;
    }
    if (curly) return;
    switch (hintedType) {
      case "string":
        return base.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_");
      case "quoted":
        return base.replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(["\\])/g, "\\$1").replace(/^(.+)$/, '"$1"');
    }
    return base.replace(/(url\(.*?\))/g, (v) => v.replace(/_/g, "\\_")).replace(/(^|[^\\])_/g, "$1 ").replace(/\\_/g, "_").replace(/(?:calc|clamp|max|min)\((.*)/g, (match2) => {
      const vars = [];
      return match2.replace(/var\((--.+?)[,)]/g, (match3, g1) => {
        vars.push(g1);
        return match3.replace(g1, "--un-calc");
      }).replace(/(-?\d*\.?\d(?!-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 ").replace(/--un-calc/g, () => vars.shift());
    });
  }
}
function bracket(str) {
  return bracketWithType(str);
}
function bracketOfColor(str) {
  return bracketWithType(str, "color");
}
function bracketOfLength(str) {
  return bracketWithType(str, "length");
}
function bracketOfPosition(str) {
  return bracketWithType(str, "position");
}
function cssvar(str) {
  if (/^\$[^\s'"`;{}]/.test(str)) {
    const [name2, defaultValue] = str.slice(1).split(",");
    return `var(--${escapeSelector(name2)}${defaultValue ? `, ${defaultValue}` : ""})`;
  }
}
function time$1(str) {
  const match = str.match(/^(-?[0-9.]+)(s|ms)?$/i);
  if (!match) return;
  const [, n2, unit] = match;
  const num = Number.parseFloat(n2);
  if (!Number.isNaN(num)) {
    if (num === 0 && !unit) return "0s";
    return unit ? `${round(num)}${unit}` : `${round(num)}ms`;
  }
}
function degree(str) {
  const match = str.match(/^(-?[0-9.]+)(deg|rad|grad|turn)?$/i);
  if (!match) return;
  const [, n2, unit] = match;
  const num = Number.parseFloat(n2);
  if (!Number.isNaN(num)) {
    if (num === 0) return "0deg";
    return unit ? `${round(num)}${unit}` : `${round(num)}deg`;
  }
}
function global$1(str) {
  if (globalKeywords.includes(str)) return str;
}
function properties$1(str) {
  if (str.split(",").every((prop) => cssProps.includes(prop))) return str;
}
function position(str) {
  if ([
    "top",
    "left",
    "right",
    "bottom",
    "center"
  ].includes(str)) return str;
}
const handler = createValueHandler(handlers_exports);
const h = handler;
const CONTROL_MINI_NO_NEGATIVE = "$$mini-no-negative";
function directionSize(propertyPrefix) {
  return ([_, direction, size], { theme: theme2 }) => {
    const v = theme2.spacing?.[size || "DEFAULT"] ?? h.bracket.cssvar.global.auto.fraction.rem(size);
    if (v != null) return directionMap[direction].map((i) => [`${propertyPrefix}${i}`, v]);
    else if (size?.startsWith("-")) {
      const v2 = theme2.spacing?.[size.slice(1)];
      if (v2 != null) return directionMap[direction].map((i) => [`${propertyPrefix}${i}`, `calc(${v2} * -1)`]);
    }
  };
}
function getThemeColorForKey(theme2, colors2, key = "colors") {
  const obj = theme2[key];
  function deepGet(current, path) {
    if (path.length === 0) return current;
    if (!current || typeof current !== "object") return void 0;
    for (let i = path.length; i > 0; i--) {
      const flatKey = path.slice(0, i).join("-");
      const value2 = current[flatKey.replace(/(-[a-z])/g, (n2) => n2.slice(1).toUpperCase())] ?? current[flatKey];
      if (value2 != null) {
        if (i === path.length) return value2;
        return deepGet(value2, path.slice(i));
      }
    }
  }
  return deepGet(obj, colors2);
}
function getThemeColor(theme2, colors2, key) {
  return getThemeColorForKey(theme2, colors2, key) || getThemeColorForKey(theme2, colors2, "colors");
}
function splitShorthand(body, type) {
  const [front, rest] = getStringComponent(body, "[", "]", ["/", ":"]) ?? [];
  if (front != null) {
    const match = (front.match(bracketTypeRe) ?? [])[1];
    if (match == null || match === type) return [front, rest];
  }
}
function parseColor(body, theme2, key) {
  const split = splitShorthand(body, "color");
  if (!split) return;
  const [main, opacity2] = split;
  const colors2 = main.replace(/([a-z])(\d)/g, "$1-$2").split(/-/g);
  const [name2] = colors2;
  if (!name2) return;
  let color2;
  const bracket2 = h.bracketOfColor(main);
  const bracketOrMain = bracket2 || main;
  if (h.numberWithUnit(bracketOrMain)) return;
  if (/^#[\da-f]+$/i.test(bracketOrMain)) color2 = bracketOrMain;
  else if (/^hex-[\da-fA-F]+$/.test(bracketOrMain)) color2 = `#${bracketOrMain.slice(4)}`;
  else if (main.startsWith("$")) color2 = h.cssvar(main);
  color2 = color2 || bracket2;
  if (!color2) {
    const colorData = getThemeColor(theme2, [main], key);
    if (typeof colorData === "string") color2 = colorData;
  }
  let no = "DEFAULT";
  if (!color2) {
    let keys = colors2;
    let _no;
    const [scale2] = colors2.slice(-1);
    if (/^\d+$/.test(scale2)) {
      no = _no = scale2;
      keys = colors2.slice(0, -1);
    }
    const colorData = getThemeColor(theme2, keys, key);
    if (typeof colorData === "object") color2 = colorData[_no ?? no];
    else if (typeof colorData === "string" && !_no) color2 = colorData;
  }
  return {
    opacity: opacity2,
    name: name2,
    no,
    color: color2,
    cssColor: parseCssColor(color2),
    alpha: h.bracket.cssvar.percent(opacity2 ?? "")
  };
}
function colorResolver(property2, varName, key, shouldPass) {
  return ([, body], { theme: theme2, generator }) => {
    const data = parseColor(body ?? "", theme2, key);
    if (!data) return;
    const { alpha: alpha2, color: color2, cssColor } = data;
    const rawColorComment = generator.config.envMode === "dev" && color2 ? ` /* ${color2} */` : "";
    const css = {};
    if (cssColor) if (alpha2 != null) css[property2] = colorToString(cssColor, alpha2) + rawColorComment;
    else {
      const opacityVar = `--un-${varName}-opacity`;
      const result = colorToString(cssColor, `var(${opacityVar})`);
      if (result.includes(opacityVar)) css[opacityVar] = colorOpacityToString(cssColor);
      css[property2] = result + rawColorComment;
    }
    else if (color2) if (alpha2 != null) css[property2] = colorToString(color2, alpha2) + rawColorComment;
    else {
      const opacityVar = `--un-${varName}-opacity`;
      const result = colorToString(color2, `var(${opacityVar})`);
      if (result.includes(opacityVar)) css[opacityVar] = 1;
      css[property2] = result + rawColorComment;
    }
    if (shouldPass?.(css) !== false) return css;
  };
}
function colorableShadows(shadows, colorVar) {
  const colored = [];
  shadows = toArray(shadows);
  for (let i = 0; i < shadows.length; i++) {
    const components = getStringComponents(shadows[i], " ", 6);
    if (!components || components.length < 3) return shadows;
    let isInset = false;
    const pos = components.indexOf("inset");
    if (pos !== -1) {
      components.splice(pos, 1);
      isInset = true;
    }
    let colorVarValue = "";
    const lastComp = components.at(-1);
    if (parseCssColor(components.at(0))) {
      const color2 = parseCssColor(components.shift());
      if (color2) colorVarValue = `, ${colorToString(color2)}`;
    } else if (parseCssColor(lastComp)) {
      const color2 = parseCssColor(components.pop());
      if (color2) colorVarValue = `, ${colorToString(color2)}`;
    } else if (lastComp && lastComp.startsWith("var(")) colorVarValue = `, ${components.pop()}`;
    colored.push(`${isInset ? "inset " : ""}${components.join(" ")} var(${colorVar}${colorVarValue})`);
  }
  return colored;
}
function hasParseableColor(color2, theme2, key) {
  return color2 != null && !!parseColor(color2, theme2, key)?.color;
}
const reLetters = /[a-z]+/gi;
const resolvedBreakpoints = /* @__PURE__ */ new WeakMap();
function resolveBreakpoints({ theme: theme2, generator }, key = "breakpoints") {
  const breakpoints2 = generator?.userConfig?.theme?.[key] || theme2[key];
  if (!breakpoints2) return void 0;
  if (resolvedBreakpoints.has(theme2)) return resolvedBreakpoints.get(theme2);
  const resolved = Object.entries(breakpoints2).sort((a2, b2) => Number.parseInt(a2[1].replace(reLetters, "")) - Number.parseInt(b2[1].replace(reLetters, ""))).map(([point, size]) => ({
    point,
    size
  }));
  resolvedBreakpoints.set(theme2, resolved);
  return resolved;
}
function resolveVerticalBreakpoints(context) {
  return resolveBreakpoints(context, "verticalBreakpoints");
}
function makeGlobalStaticRules(prefix, property2) {
  return globalKeywords.map((keyword2) => [`${prefix}-${keyword2}`, { [property2 ?? prefix]: keyword2 }]);
}
function isCSSMathFn(value2) {
  return value2 != null && cssMathFnRE.test(value2);
}
function isSize(str) {
  if (str[0] === "[" && str.slice(-1) === "]") str = str.slice(1, -1);
  return cssMathFnRE.test(str) || numberWithUnitRE.test(str);
}
function transformXYZ(d, v, name2) {
  const values = v.split(splitComma);
  if (d || !d && values.length === 1) return xyzMap[d].map((i) => [`--un-${name2}${i}`, v]);
  return values.map((v2, i) => [`--un-${name2}-${xyzArray[i]}`, v2]);
}
var _utils_exports = /* @__PURE__ */ __exportAll({
  CONTROL_MINI_NO_NEGATIVE: () => CONTROL_MINI_NO_NEGATIVE,
  colorResolver: () => colorResolver,
  colorableShadows: () => colorableShadows,
  cornerMap: () => cornerMap,
  cssMathFnRE: () => cssMathFnRE,
  cssVarFnRE: () => cssVarFnRE,
  directionMap: () => directionMap,
  directionSize: () => directionSize,
  globalKeywords: () => globalKeywords,
  h: () => h,
  handler: () => handler,
  hasParseableColor: () => hasParseableColor,
  insetMap: () => insetMap,
  isCSSMathFn: () => isCSSMathFn,
  isSize: () => isSize,
  makeGlobalStaticRules: () => makeGlobalStaticRules,
  parseColor: () => parseColor,
  positionMap: () => positionMap,
  resolveBreakpoints: () => resolveBreakpoints,
  resolveVerticalBreakpoints: () => resolveVerticalBreakpoints,
  splitShorthand: () => splitShorthand,
  transformXYZ: () => transformXYZ,
  valueHandlers: () => handlers_exports,
  xyzArray: () => xyzArray,
  xyzMap: () => xyzMap
});
__reExport(_utils_exports, import__unocss_rule_utils);
var utils_exports = /* @__PURE__ */ __exportAll({
  CONTROL_MINI_NO_NEGATIVE: () => CONTROL_MINI_NO_NEGATIVE,
  colorResolver: () => colorResolver,
  colorableShadows: () => colorableShadows,
  cornerMap: () => cornerMap,
  cssMathFnRE: () => cssMathFnRE,
  cssVarFnRE: () => cssVarFnRE,
  directionMap: () => directionMap,
  directionSize: () => directionSize,
  globalKeywords: () => globalKeywords,
  h: () => h,
  handler: () => handler,
  hasParseableColor: () => hasParseableColor,
  insetMap: () => insetMap,
  isCSSMathFn: () => isCSSMathFn,
  isSize: () => isSize,
  makeGlobalStaticRules: () => makeGlobalStaticRules,
  parseColor: () => parseColor,
  positionMap: () => positionMap,
  resolveBreakpoints: () => resolveBreakpoints,
  resolveVerticalBreakpoints: () => resolveVerticalBreakpoints,
  splitShorthand: () => splitShorthand,
  transformXYZ: () => transformXYZ,
  valueHandlers: () => handlers_exports,
  xyzArray: () => xyzArray,
  xyzMap: () => xyzMap
});
__reExport(utils_exports, _utils_exports);
const verticalAlignAlias = {
  "mid": "middle",
  "base": "baseline",
  "btm": "bottom",
  "baseline": "baseline",
  "top": "top",
  "start": "top",
  "middle": "middle",
  "bottom": "bottom",
  "end": "bottom",
  "text-top": "text-top",
  "text-bottom": "text-bottom",
  "sub": "sub",
  "super": "super",
  ...Object.fromEntries(globalKeywords.map((x) => [x, x]))
};
const verticalAligns = [[
  /^(?:vertical|align|v)-(.+)$/,
  ([, v]) => ({ "vertical-align": verticalAlignAlias[v] ?? h.bracket.cssvar.numberWithUnit(v) }),
  { autocomplete: [`(vertical|align|v)-(${Object.keys(verticalAlignAlias).join("|")})`, "(vertical|align|v)-<percentage>"] }
]];
const textAlignValues = [
  "center",
  "left",
  "right",
  "justify",
  "start",
  "end"
];
const textAligns = [...textAlignValues.map((v) => [`text-${v}`, { "text-align": v }]), ...[...globalKeywords, ...textAlignValues].map((v) => [`text-align-${v}`, { "text-align": v }])];
const outline = [
  [
    /^outline-(?:width-|size-)?(.+)$/,
    handleWidth$3,
    { autocomplete: "outline-(width|size)-<num>" }
  ],
  [
    /^outline-(?:color-)?(.+)$/,
    handleColorOrWidth$3,
    { autocomplete: "outline-$colors" }
  ],
  [
    /^outline-offset-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "outline-offset": theme2.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d) }),
    { autocomplete: "outline-(offset)-<num>" }
  ],
  ["outline", { "outline-style": "solid" }],
  ...[
    "auto",
    "dashed",
    "dotted",
    "double",
    "hidden",
    "solid",
    "groove",
    "ridge",
    "inset",
    "outset",
    ...globalKeywords
  ].map((v) => [`outline-${v}`, { "outline-style": v }]),
  ["outline-none", {
    "outline": "2px solid transparent",
    "outline-offset": "2px"
  }]
];
function handleWidth$3([, b2], { theme: theme2 }) {
  return { "outline-width": theme2.lineWidth?.[b2] ?? h.bracket.cssvar.global.px(b2) };
}
function handleColorOrWidth$3(match, ctx) {
  if (isCSSMathFn(h.bracket(match[1]))) return handleWidth$3(match, ctx);
  return colorResolver("outline-color", "outline-color", "borderColor")(match, ctx);
}
const appearance = [["appearance-auto", {
  "-webkit-appearance": "auto",
  "appearance": "auto"
}], ["appearance-none", {
  "-webkit-appearance": "none",
  "appearance": "none"
}]];
function willChangeProperty(prop) {
  return h.properties.auto.global(prop) ?? {
    contents: "contents",
    scroll: "scroll-position"
  }[prop];
}
const willChange = [[/^will-change-(.+)/, ([, p]) => ({ "will-change": willChangeProperty(p) })]];
const borderStyles = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "hidden",
  "none",
  "groove",
  "ridge",
  "inset",
  "outset",
  ...globalKeywords
];
const borders = [
  [
    /^(?:border|b)()(?:-(.+))?$/,
    handlerBorderSize,
    { autocomplete: "(border|b)-<directions>" }
  ],
  [/^(?:border|b)-([xy])(?:-(.+))?$/, handlerBorderSize],
  [/^(?:border|b)-([rltbse])(?:-(.+))?$/, handlerBorderSize],
  [/^(?:border|b)-(block|inline)(?:-(.+))?$/, handlerBorderSize],
  [/^(?:border|b)-([bi][se])(?:-(.+))?$/, handlerBorderSize],
  [
    /^(?:border|b)-()(?:width|size)-(.+)$/,
    handlerBorderSize,
    { autocomplete: ["(border|b)-<num>", "(border|b)-<directions>-<num>"] }
  ],
  [/^(?:border|b)-([xy])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-([rltbse])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-(block|inline)-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:border|b)-([bi][se])-(?:width|size)-(.+)$/, handlerBorderSize],
  [
    /^(?:border|b)-()(?:color-)?(.+)$/,
    handlerBorderColorOrSize,
    { autocomplete: ["(border|b)-$colors", "(border|b)-<directions>-$colors"] }
  ],
  [/^(?:border|b)-([xy])-(?:color-)?(.+)$/, handlerBorderColorOrSize],
  [/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/, handlerBorderColorOrSize],
  [/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/, handlerBorderColorOrSize],
  [/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/, handlerBorderColorOrSize],
  [
    /^(?:border|b)-()op(?:acity)?-?(.+)$/,
    handlerBorderOpacity,
    { autocomplete: "(border|b)-(op|opacity)-<percent>" }
  ],
  [/^(?:border|b)-([xy])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [/^(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/, handlerBorderOpacity],
  [
    /^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/,
    handlerRounded,
    { autocomplete: [
      "(border|b)-(rounded|rd)",
      "(border|b)-(rounded|rd)-$borderRadius",
      "(rounded|rd)",
      "(rounded|rd)-$borderRadius"
    ] }
  ],
  [/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/, handlerRounded],
  [
    /^(?:border|b)-(?:style-)?()(.+)$/,
    handlerBorderStyle,
    { autocomplete: [
      "(border|b)-style",
      `(border|b)-(${borderStyles.join("|")})`,
      "(border|b)-<directions>-style",
      `(border|b)-<directions>-(${borderStyles.join("|")})`,
      `(border|b)-<directions>-style-(${borderStyles.join("|")})`,
      `(border|b)-style-(${borderStyles.join("|")})`
    ] }
  ],
  [/^(?:border|b)-([xy])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-([rltbse])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-(block|inline)-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:border|b)-([bi][se])-(?:style-)?(.+)$/, handlerBorderStyle]
];
function transformBorderColor(color2, alpha2, direction) {
  if (alpha2 != null) return { [`border${direction}-color`]: colorToString(color2, alpha2) };
  if (direction === "") {
    const object = {};
    const opacityVar = `--un-border-opacity`;
    const result = colorToString(color2, `var(${opacityVar})`);
    if (result.includes(opacityVar)) object[opacityVar] = typeof color2 === "string" ? 1 : colorOpacityToString(color2);
    object["border-color"] = result;
    return object;
  } else {
    const object = {};
    const opacityVar = "--un-border-opacity";
    const opacityDirectionVar = `--un-border${direction}-opacity`;
    const result = colorToString(color2, `var(${opacityDirectionVar})`);
    if (result.includes(opacityDirectionVar)) {
      object[opacityVar] = typeof color2 === "string" ? 1 : colorOpacityToString(color2);
      object[opacityDirectionVar] = `var(${opacityVar})`;
    }
    object[`border${direction}-color`] = result;
    return object;
  }
}
function borderColorResolver(direction) {
  return ([, body], theme2) => {
    const data = parseColor(body, theme2, "borderColor");
    if (!data) return;
    const { alpha: alpha2, color: color2, cssColor } = data;
    if (cssColor) return transformBorderColor(cssColor, alpha2, direction);
    else if (color2) return transformBorderColor(color2, alpha2, direction);
  };
}
function handlerBorderSize([, a2 = "", b2], { theme: theme2 }) {
  const v = theme2.lineWidth?.[b2 || "DEFAULT"] ?? h.bracket.cssvar.global.px(b2 || "1");
  if (a2 in directionMap && v != null) return directionMap[a2].map((i) => [`border${i}-width`, v]);
}
function handlerBorderColorOrSize([, a2 = "", b2], ctx) {
  if (a2 in directionMap) {
    if (isCSSMathFn(h.bracket(b2))) return handlerBorderSize([
      "",
      a2,
      b2
    ], ctx);
    if (hasParseableColor(b2, ctx.theme, "borderColor")) return Object.assign({}, ...directionMap[a2].map((i) => borderColorResolver(i)(["", b2], ctx.theme)));
  }
}
function handlerBorderOpacity([, a2 = "", opacity2]) {
  const v = h.bracket.percent.cssvar(opacity2);
  if (a2 in directionMap && v != null) return directionMap[a2].map((i) => [`--un-border${i}-opacity`, v]);
}
function handlerRounded([, a2 = "", s], { theme: theme2 }) {
  const v = theme2.borderRadius?.[s || "DEFAULT"] || h.bracket.cssvar.global.fraction.rem(s || "1");
  if (a2 in cornerMap && v != null) return cornerMap[a2].map((i) => [`border${i}-radius`, v]);
}
function handlerBorderStyle([, a2 = "", s]) {
  if (borderStyles.includes(s) && a2 in directionMap) return directionMap[a2].map((i) => [`border${i}-style`, s]);
}
const opacity = [[/^op(?:acity)?-?(.+)$/, ([, d]) => ({ opacity: h.bracket.percent.cssvar(d) })]];
const bgUrlRE = /^\[url\(.+\)\]$/;
const bgLengthRE = /^\[(?:length|size):.+\]$/;
const bgPositionRE = /^\[position:.+\]$/;
const bgGradientRE = /^\[(?:linear|conic|radial)-gradient\(.+\)\]$/;
const bgImageRE = /^\[image:.+\]$/;
const bgColors = [[
  /^bg-(.+)$/,
  (...args) => {
    const d = args[0][1];
    if (bgUrlRE.test(d)) return {
      "--un-url": h.bracket(d),
      "background-image": "var(--un-url)"
    };
    if (bgLengthRE.test(d) && h.bracketOfLength(d) != null) return { "background-size": h.bracketOfLength(d).split(" ").map((e) => h.fraction.auto.px.cssvar(e) ?? e).join(" ") };
    if ((isSize(d) || bgPositionRE.test(d)) && h.bracketOfPosition(d) != null) return { "background-position": h.bracketOfPosition(d).split(" ").map((e) => h.position.fraction.auto.px.cssvar(e) ?? e).join(" ") };
    if (bgGradientRE.test(d) || bgImageRE.test(d)) {
      const s = h.bracket(d);
      if (s) return { "background-image": (s.startsWith("http") ? `url(${s})` : h.cssvar(s)) ?? s };
    }
    return colorResolver("background-color", "bg", "backgroundColor")(...args);
  },
  { autocomplete: "bg-$colors" }
], [
  /^bg-op(?:acity)?-?(.+)$/,
  ([, opacity2]) => ({ "--un-bg-opacity": h.bracket.percent.cssvar(opacity2) }),
  { autocomplete: "bg-(op|opacity)-<percent>" }
]];
const colorScheme = [[/^color-scheme-(\w+)$/, ([, v]) => ({ "color-scheme": v })]];
const containerParent = [[/^@container(?:\/(\w+))?(?:-(normal|inline-size|size))?$/, ([, l, v]) => {
  return {
    "container-type": v ?? "inline-size",
    "container-name": l
  };
}]];
const decorationStyles = [
  "solid",
  "double",
  "dotted",
  "dashed",
  "wavy",
  ...globalKeywords
];
const textDecorations = [
  [
    /^(?:decoration-)?(underline|overline|line-through)$/,
    ([, s]) => ({ "text-decoration-line": s }),
    { autocomplete: "decoration-(underline|overline|line-through)" }
  ],
  [
    /^(?:underline|decoration)-(?:size-)?(.+)$/,
    handleWidth$2,
    { autocomplete: "(underline|decoration)-<num>" }
  ],
  [
    /^(?:underline|decoration)-(auto|from-font)$/,
    ([, s]) => ({ "text-decoration-thickness": s }),
    { autocomplete: "(underline|decoration)-(auto|from-font)" }
  ],
  [
    /^(?:underline|decoration)-(.+)$/,
    handleColorOrWidth$2,
    { autocomplete: "(underline|decoration)-$colors" }
  ],
  [
    /^(?:underline|decoration)-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-line-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "(underline|decoration)-(op|opacity)-<percent>" }
  ],
  [
    /^(?:underline|decoration)-offset-(.+)$/,
    ([, s], { theme: theme2 }) => ({ "text-underline-offset": theme2.lineWidth?.[s] ?? h.auto.bracket.cssvar.global.px(s) }),
    { autocomplete: "(underline|decoration)-(offset)-<num>" }
  ],
  ...decorationStyles.map((v) => [`underline-${v}`, { "text-decoration-style": v }]),
  ...decorationStyles.map((v) => [`decoration-${v}`, { "text-decoration-style": v }]),
  ["no-underline", { "text-decoration": "none" }],
  ["decoration-none", { "text-decoration": "none" }]
];
function handleWidth$2([, b2], { theme: theme2 }) {
  return { "text-decoration-thickness": theme2.lineWidth?.[b2] ?? h.bracket.cssvar.global.px(b2) };
}
function handleColorOrWidth$2(match, ctx) {
  if (isCSSMathFn(h.bracket(match[1]))) return handleWidth$2(match, ctx);
  const result = colorResolver("text-decoration-color", "line", "borderColor")(match, ctx);
  if (result) return {
    "-webkit-text-decoration-color": result["text-decoration-color"],
    ...result
  };
}
const flex$1 = [
  ["flex", { display: "flex" }],
  ["inline-flex", { display: "inline-flex" }],
  ["flex-inline", { display: "inline-flex" }],
  [/^flex-(.*)$/, ([, d]) => ({ flex: h.bracket(d) != null ? h.bracket(d).split(" ").map((e) => h.cssvar.fraction(e) ?? e).join(" ") : h.cssvar.fraction(d) })],
  ["flex-1", { flex: "1 1 0%" }],
  ["flex-auto", { flex: "1 1 auto" }],
  ["flex-initial", { flex: "0 1 auto" }],
  ["flex-none", { flex: "none" }],
  [
    /^(?:flex-)?shrink(?:-(.*))?$/,
    ([, d = ""]) => ({ "flex-shrink": h.bracket.cssvar.number(d) ?? 1 }),
    { autocomplete: ["flex-shrink-<num>", "shrink-<num>"] }
  ],
  [
    /^(?:flex-)?grow(?:-(.*))?$/,
    ([, d = ""]) => ({ "flex-grow": h.bracket.cssvar.number(d) ?? 1 }),
    { autocomplete: ["flex-grow-<num>", "grow-<num>"] }
  ],
  [
    /^(?:flex-)?basis-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "flex-basis": theme2.spacing?.[d] ?? h.bracket.cssvar.auto.fraction.rem(d) }),
    { autocomplete: ["flex-basis-$spacing", "basis-$spacing"] }
  ],
  ["flex-row", { "flex-direction": "row" }],
  ["flex-row-reverse", { "flex-direction": "row-reverse" }],
  ["flex-col", { "flex-direction": "column" }],
  ["flex-col-reverse", { "flex-direction": "column-reverse" }],
  ["flex-wrap", { "flex-wrap": "wrap" }],
  ["flex-wrap-reverse", { "flex-wrap": "wrap-reverse" }],
  ["flex-nowrap", { "flex-wrap": "nowrap" }]
];
const directions = {
  "": "",
  "x": "column-",
  "y": "row-",
  "col": "column-",
  "row": "row-"
};
function handleGap([, d = "", s], { theme: theme2 }) {
  const v = theme2.spacing?.[s] ?? h.bracket.cssvar.global.rem(s);
  if (v != null) return { [`${directions[d]}gap`]: v };
}
const gaps = [
  [
    /^(?:flex-|grid-)?gap-?()(.+)$/,
    handleGap,
    { autocomplete: ["gap-$spacing", "gap-<num>"] }
  ],
  [
    /^(?:flex-|grid-)?gap-([xy])-?(.+)$/,
    handleGap,
    { autocomplete: ["gap-(x|y)-$spacing", "gap-(x|y)-<num>"] }
  ],
  [
    /^(?:flex-|grid-)?gap-(col|row)-?(.+)$/,
    handleGap,
    { autocomplete: ["gap-(col|row)-$spacing", "gap-(col|row)-<num>"] }
  ]
];
function rowCol(s) {
  return s.replace("col", "column");
}
function rowColTheme(s) {
  return s[0] === "r" ? "Row" : "Column";
}
function autoDirection(c2, theme2, prop) {
  const v = theme2[`gridAuto${rowColTheme(c2)}`]?.[prop];
  if (v != null) return v;
  switch (prop) {
    case "min":
      return "min-content";
    case "max":
      return "max-content";
    case "fr":
      return "minmax(0,1fr)";
  }
  return h.bracket.cssvar.auto.rem(prop);
}
const grids = [
  ["grid", { display: "grid" }],
  ["inline-grid", { display: "inline-grid" }],
  [/^(?:grid-)?(row|col)-(.+)$/, ([, c2, v], { theme: theme2 }) => ({ [`grid-${rowCol(c2)}`]: theme2[`grid${rowColTheme(c2)}`]?.[v] ?? h.bracket.cssvar.auto(v) })],
  [
    /^(?:grid-)?(row|col)-span-(.+)$/,
    ([, c2, s]) => {
      if (s === "full") return { [`grid-${rowCol(c2)}`]: "1/-1" };
      const v = h.bracket.number(s);
      if (v != null) return { [`grid-${rowCol(c2)}`]: `span ${v}/span ${v}` };
    },
    { autocomplete: "(grid-row|grid-col|row|col)-span-<num>" }
  ],
  [/^(?:grid-)?(row|col)-start-(.+)$/, ([, c2, v]) => ({ [`grid-${rowCol(c2)}-start`]: h.bracket.cssvar(v) ?? v })],
  [
    /^(?:grid-)?(row|col)-end-(.+)$/,
    ([, c2, v]) => ({ [`grid-${rowCol(c2)}-end`]: h.bracket.cssvar(v) ?? v }),
    { autocomplete: "(grid-row|grid-col|row|col)-(start|end)-<num>" }
  ],
  [
    /^(?:grid-)?auto-(rows|cols)-(.+)$/,
    ([, c2, v], { theme: theme2 }) => ({ [`grid-auto-${rowCol(c2)}`]: autoDirection(c2, theme2, v) }),
    { autocomplete: "(grid-auto|auto)-(rows|cols)-<num>" }
  ],
  [/^(?:grid-auto-flow|auto-flow|grid-flow)-(.+)$/, ([, v]) => ({ "grid-auto-flow": h.bracket.cssvar(v) })],
  [
    /^(?:grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)$/,
    ([, v]) => ({ "grid-auto-flow": rowCol(v).replace("-", " ") }),
    { autocomplete: ["(grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)"] }
  ],
  [/^(?:grid-)?(rows|cols)-(.+)$/, ([, c2, v], { theme: theme2 }) => ({ [`grid-template-${rowCol(c2)}`]: theme2[`gridTemplate${rowColTheme(c2)}`]?.[v] ?? h.bracket.cssvar(v) })],
  [/^(?:grid-)?(rows|cols)-minmax-([\w.-]+)$/, ([, c2, d]) => ({ [`grid-template-${rowCol(c2)}`]: `repeat(auto-fill,minmax(${d},1fr))` })],
  [
    /^(?:grid-)?(rows|cols)-(\d+)$/,
    ([, c2, d]) => ({ [`grid-template-${rowCol(c2)}`]: `repeat(${d},minmax(0,1fr))` }),
    { autocomplete: "(grid-rows|grid-cols|rows|cols)-<num>" }
  ],
  [/^grid-area(s)?-(.+)$/, ([, s, v]) => {
    if (s != null) return { "grid-template-areas": h.cssvar(v) ?? v.split("-").map((s2) => `"${h.bracket(s2)}"`).join(" ") };
    return { "grid-area": h.bracket.cssvar(v) };
  }],
  ["grid-rows-none", { "grid-template-rows": "none" }],
  ["grid-cols-none", { "grid-template-columns": "none" }],
  ["grid-rows-subgrid", { "grid-template-rows": "subgrid" }],
  ["grid-cols-subgrid", { "grid-template-columns": "subgrid" }]
];
const overflowValues = [
  "auto",
  "hidden",
  "clip",
  "visible",
  "scroll",
  "overlay",
  ...globalKeywords
];
const overflows = [[
  /^(?:overflow|of)-(.+)$/,
  ([, v]) => overflowValues.includes(v) ? { overflow: v } : void 0,
  { autocomplete: [`(overflow|of)-(${overflowValues.join("|")})`, `(overflow|of)-(x|y)-(${overflowValues.join("|")})`] }
], [/^(?:overflow|of)-([xy])-(.+)$/, ([, d, v]) => overflowValues.includes(v) ? { [`overflow-${d}`]: v } : void 0]];
const positions = [
  [
    /^(?:position-|pos-)?(relative|absolute|fixed|sticky)$/,
    ([, v]) => ({ position: v }),
    { autocomplete: [
      "(position|pos)-<position>",
      "(position|pos)-<globalKeyword>",
      "<position>"
    ] }
  ],
  [/^(?:position-|pos-)([-\w]+)$/, ([, v]) => globalKeywords.includes(v) ? { position: v } : void 0],
  [/^(?:position-|pos-)?(static)$/, ([, v]) => ({ position: v })]
];
const justifies = [
  ["justify-start", { "justify-content": "flex-start" }],
  ["justify-end", { "justify-content": "flex-end" }],
  ["justify-center", { "justify-content": "center" }],
  ["justify-between", { "justify-content": "space-between" }],
  ["justify-around", { "justify-content": "space-around" }],
  ["justify-evenly", { "justify-content": "space-evenly" }],
  ["justify-stretch", { "justify-content": "stretch" }],
  ["justify-left", { "justify-content": "left" }],
  ["justify-right", { "justify-content": "right" }],
  ["justify-center-safe", { "justify-content": "safe center" }],
  ["justify-end-safe", { "justify-content": "safe flex-end" }],
  ["justify-normal", { "justify-content": "normal" }],
  ...makeGlobalStaticRules("justify", "justify-content"),
  ["justify-items-start", { "justify-items": "start" }],
  ["justify-items-end", { "justify-items": "end" }],
  ["justify-items-center", { "justify-items": "center" }],
  ["justify-items-stretch", { "justify-items": "stretch" }],
  ["justify-items-center-safe", { "justify-items": "safe center" }],
  ["justify-items-end-safe", { "justify-items": "safe flex-end" }],
  ...makeGlobalStaticRules("justify-items"),
  ["justify-self-auto", { "justify-self": "auto" }],
  ["justify-self-start", { "justify-self": "start" }],
  ["justify-self-end", { "justify-self": "end" }],
  ["justify-self-center", { "justify-self": "center" }],
  ["justify-self-stretch", { "justify-self": "stretch" }],
  ["justify-self-baseline", { "justify-self": "baseline" }],
  ["justify-self-center-safe", { "justify-self": "safe center" }],
  ["justify-self-end-safe", { "justify-self": "safe flex-end" }],
  ...makeGlobalStaticRules("justify-self")
];
const orders = [
  [/^order-(.+)$/, ([, v]) => ({ order: h.bracket.cssvar.number(v) })],
  ["order-first", { order: "-9999" }],
  ["order-last", { order: "9999" }],
  ["order-none", { order: "0" }]
];
const alignments = [
  ["content-center", { "align-content": "center" }],
  ["content-start", { "align-content": "flex-start" }],
  ["content-end", { "align-content": "flex-end" }],
  ["content-between", { "align-content": "space-between" }],
  ["content-around", { "align-content": "space-around" }],
  ["content-evenly", { "align-content": "space-evenly" }],
  ["content-baseline", { "align-content": "baseline" }],
  ["content-center-safe", { "align-content": "safe center" }],
  ["content-end-safe", { "align-content": "safe flex-end" }],
  ["content-stretch", { "align-content": "stretch" }],
  ["content-normal", { "align-content": "normal" }],
  ...makeGlobalStaticRules("content", "align-content"),
  ["items-start", { "align-items": "flex-start" }],
  ["items-end", { "align-items": "flex-end" }],
  ["items-center", { "align-items": "center" }],
  ["items-baseline", { "align-items": "baseline" }],
  ["items-stretch", { "align-items": "stretch" }],
  ["items-baseline-last", { "align-items": "last baseline" }],
  ["items-center-safe", { "align-items": "safe center" }],
  ["items-end-safe", { "align-items": "safe flex-end" }],
  ...makeGlobalStaticRules("items", "align-items"),
  ["self-auto", { "align-self": "auto" }],
  ["self-start", { "align-self": "flex-start" }],
  ["self-end", { "align-self": "flex-end" }],
  ["self-center", { "align-self": "center" }],
  ["self-stretch", { "align-self": "stretch" }],
  ["self-baseline", { "align-self": "baseline" }],
  ["self-baseline-last", { "align-self": "last baseline" }],
  ["self-center-safe", { "align-self": "safe center" }],
  ["self-end-safe", { "align-self": "safe flex-end" }],
  ...makeGlobalStaticRules("self", "align-self")
];
const placements = [
  ["place-content-center", { "place-content": "center" }],
  ["place-content-start", { "place-content": "start" }],
  ["place-content-end", { "place-content": "end" }],
  ["place-content-between", { "place-content": "space-between" }],
  ["place-content-around", { "place-content": "space-around" }],
  ["place-content-evenly", { "place-content": "space-evenly" }],
  ["place-content-stretch", { "place-content": "stretch" }],
  ["place-content-baseline", { "place-content": "baseline" }],
  ["place-content-center-safe", { "place-content": "safe center" }],
  ["place-content-end-safe", { "place-content": "safe flex-end" }],
  ...makeGlobalStaticRules("place-content"),
  ["place-items-start", { "place-items": "start" }],
  ["place-items-end", { "place-items": "end" }],
  ["place-items-center", { "place-items": "center" }],
  ["place-items-stretch", { "place-items": "stretch" }],
  ["place-items-baseline", { "place-items": "baseline" }],
  ["place-items-center-safe", { "place-items": "safe center" }],
  ["place-items-end-safe", { "place-items": "safe flex-end" }],
  ...makeGlobalStaticRules("place-items"),
  ["place-self-auto", { "place-self": "auto" }],
  ["place-self-start", { "place-self": "start" }],
  ["place-self-end", { "place-self": "end" }],
  ["place-self-center", { "place-self": "center" }],
  ["place-self-stretch", { "place-self": "stretch" }],
  ["place-self-center-safe", { "place-self": "safe center" }],
  ["place-self-end-safe", { "place-self": "safe flex-end" }],
  ...makeGlobalStaticRules("place-self")
];
const flexGridJustifiesAlignments = [
  ...justifies,
  ...alignments,
  ...placements
].flatMap(([k, v]) => [[`flex-${k}`, v], [`grid-${k}`, v]]);
function handleInsetValue(v, { theme: theme2 }) {
  return theme2.spacing?.[v] ?? h.bracket.cssvar.global.auto.fraction.rem(v);
}
function handleInsetValues([, d, v], ctx) {
  const r = handleInsetValue(v, ctx);
  if (r != null && d in insetMap) return insetMap[d].map((i) => [i.slice(1), r]);
}
const insets = [
  [
    /^(?:position-|pos-)?inset-(.+)$/,
    ([, v], ctx) => ({ inset: handleInsetValue(v, ctx) }),
    { autocomplete: [
      "(position|pos)-inset-<directions>-$spacing",
      "(position|pos)-inset-(block|inline)-$spacing",
      "(position|pos)-inset-(bs|be|is|ie)-$spacing",
      "(position|pos)-(top|left|right|bottom)-$spacing"
    ] }
  ],
  [/^(?:position-|pos-)?(start|end)-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([xy])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([rltbse])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-(block|inline)-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?inset-([bi][se])-(.+)$/, handleInsetValues],
  [/^(?:position-|pos-)?(top|left|right|bottom)-(.+)$/, ([, d, v], ctx) => ({ [d]: handleInsetValue(v, ctx) })]
];
const floats = [
  ["float-left", { float: "left" }],
  ["float-right", { float: "right" }],
  ["float-start", { float: "inline-start" }],
  ["float-end", { float: "inline-end" }],
  ["float-none", { float: "none" }],
  ...makeGlobalStaticRules("float"),
  ["clear-left", { clear: "left" }],
  ["clear-right", { clear: "right" }],
  ["clear-both", { clear: "both" }],
  ["clear-start", { clear: "inline-start" }],
  ["clear-end", { clear: "inline-end" }],
  ["clear-none", { clear: "none" }],
  ...makeGlobalStaticRules("clear")
];
const zIndexes = [[/^(?:position-|pos-)?z([\d.]+)$/, ([, v]) => ({ "z-index": h.number(v) })], [
  /^(?:position-|pos-)?z-(.+)$/,
  ([, v], { theme: theme2 }) => ({ "z-index": theme2.zIndex?.[v] ?? h.bracket.cssvar.global.auto.number(v) }),
  { autocomplete: "z-<num>" }
]];
const boxSizing = [
  ["box-border", { "box-sizing": "border-box" }],
  ["box-content", { "box-sizing": "content-box" }],
  ...makeGlobalStaticRules("box", "box-sizing")
];
const questionMark = [[/^(where|\?)$/, (_, { constructCSS, generator }) => {
  if (generator.userConfig.envMode === "dev") return `@keyframes __un_qm{0%{box-shadow:inset 4px 4px #ff1e90, inset -4px -4px #ff1e90}100%{box-shadow:inset 8px 8px #3399ff, inset -8px -8px #3399ff}} ${constructCSS({ animation: "__un_qm 0.5s ease-in-out alternate infinite" })}`;
}]];
const cursorValues = [
  "auto",
  "default",
  "none",
  "context-menu",
  "help",
  "pointer",
  "progress",
  "wait",
  "cell",
  "crosshair",
  "text",
  "vertical-text",
  "alias",
  "copy",
  "move",
  "no-drop",
  "not-allowed",
  "grab",
  "grabbing",
  "all-scroll",
  "col-resize",
  "row-resize",
  "n-resize",
  "e-resize",
  "s-resize",
  "w-resize",
  "ne-resize",
  "nw-resize",
  "se-resize",
  "sw-resize",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "zoom-in",
  "zoom-out"
];
const containValues = [
  "none",
  "strict",
  "content",
  "size",
  "inline-size",
  "layout",
  "style",
  "paint"
];
const varEmpty = " ";
const displays = [
  ["inline", { display: "inline" }],
  ["block", { display: "block" }],
  ["inline-block", { display: "inline-block" }],
  ["contents", { display: "contents" }],
  ["flow-root", { display: "flow-root" }],
  ["list-item", { display: "list-item" }],
  ["hidden", { display: "none" }],
  [/^display-(.+)$/, ([, c2]) => ({ display: h.bracket.cssvar.global(c2) })]
];
const appearances = [
  ["visible", { visibility: "visible" }],
  ["invisible", { visibility: "hidden" }],
  ["backface-visible", { "backface-visibility": "visible" }],
  ["backface-hidden", { "backface-visibility": "hidden" }],
  ...makeGlobalStaticRules("backface", "backface-visibility")
];
const cursors = [[/^cursor-(.+)$/, ([, c2]) => ({ cursor: h.bracket.cssvar.global(c2) })], ...cursorValues.map((v) => [`cursor-${v}`, { cursor: v }])];
const contains = [[/^contain-(.*)$/, ([, d]) => {
  if (h.bracket(d) != null) return { contain: h.bracket(d).split(" ").map((e) => h.cssvar.fraction(e) ?? e).join(" ") };
  return containValues.includes(d) ? { contain: d } : void 0;
}]];
const pointerEvents = [
  ["pointer-events-auto", { "pointer-events": "auto" }],
  ["pointer-events-none", { "pointer-events": "none" }],
  ...makeGlobalStaticRules("pointer-events")
];
const resizes = [
  ["resize-x", { resize: "horizontal" }],
  ["resize-y", { resize: "vertical" }],
  ["resize", { resize: "both" }],
  ["resize-none", { resize: "none" }],
  ...makeGlobalStaticRules("resize")
];
const userSelects = [
  ["select-auto", {
    "-webkit-user-select": "auto",
    "user-select": "auto"
  }],
  ["select-all", {
    "-webkit-user-select": "all",
    "user-select": "all"
  }],
  ["select-text", {
    "-webkit-user-select": "text",
    "user-select": "text"
  }],
  ["select-none", {
    "-webkit-user-select": "none",
    "user-select": "none"
  }],
  ...makeGlobalStaticRules("select", "user-select")
];
const whitespaces = [[
  /^(?:whitespace-|ws-)([-\w]+)$/,
  ([, v]) => [
    "normal",
    "nowrap",
    "pre",
    "pre-line",
    "pre-wrap",
    "break-spaces",
    ...globalKeywords
  ].includes(v) ? { "white-space": v } : void 0,
  { autocomplete: "(whitespace|ws)-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)" }
]];
const contentVisibility = [
  [
    /^intrinsic(?:-(block|inline|w|h))?(?:-size)?-(.+)$/,
    ([, d, s]) => {
      return { [`contain-intrinsic-${{
        block: "block-size",
        inline: "inline-size",
        w: "width",
        h: "height"
      }[d] ?? "size"}`]: h.bracket.cssvar.global.fraction.rem(s) };
    },
    { autocomplete: [
      "intrinsic-size-<num>",
      "intrinsic-<num>",
      "intrinsic-(block|inline|w|h)-<num>"
    ] }
  ],
  ["content-visibility-visible", { "content-visibility": "visible" }],
  ["content-visibility-hidden", { "content-visibility": "hidden" }],
  ["content-visibility-auto", { "content-visibility": "auto" }],
  ...makeGlobalStaticRules("content-visibility")
];
const contents = [
  [/^content-(.+)$/, ([, v]) => ({ content: h.bracket.cssvar(v) })],
  ["content-empty", { content: '""' }],
  ["content-none", { content: "none" }]
];
const breaks = [
  ["break-normal", {
    "overflow-wrap": "normal",
    "word-break": "normal"
  }],
  ["break-words", { "overflow-wrap": "break-word" }],
  ["break-all", { "word-break": "break-all" }],
  ["break-keep", { "word-break": "keep-all" }],
  ["break-anywhere", { "overflow-wrap": "anywhere" }]
];
const textWraps = [
  ["text-wrap", { "text-wrap": "wrap" }],
  ["text-nowrap", { "text-wrap": "nowrap" }],
  ["text-balance", { "text-wrap": "balance" }],
  ["text-pretty", { "text-wrap": "pretty" }]
];
const textOverflows = [
  ["truncate", {
    "overflow": "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }],
  ["text-truncate", {
    "overflow": "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }],
  ["text-ellipsis", { "text-overflow": "ellipsis" }],
  ["text-clip", { "text-overflow": "clip" }]
];
const textTransforms$1 = [
  ["case-upper", { "text-transform": "uppercase" }],
  ["case-lower", { "text-transform": "lowercase" }],
  ["case-capital", { "text-transform": "capitalize" }],
  ["case-normal", { "text-transform": "none" }],
  ...makeGlobalStaticRules("case", "text-transform")
];
const fontStyles = [
  ["italic", { "font-style": "italic" }],
  ["not-italic", { "font-style": "normal" }],
  ["font-italic", { "font-style": "italic" }],
  ["font-not-italic", { "font-style": "normal" }],
  ["oblique", { "font-style": "oblique" }],
  ["not-oblique", { "font-style": "normal" }],
  ["font-oblique", { "font-style": "oblique" }],
  ["font-not-oblique", { "font-style": "normal" }]
];
const fontSmoothings = [["antialiased", {
  "-webkit-font-smoothing": "antialiased",
  "-moz-osx-font-smoothing": "grayscale"
}], ["subpixel-antialiased", {
  "-webkit-font-smoothing": "auto",
  "-moz-osx-font-smoothing": "auto"
}]];
const fieldSizing = [["field-sizing-fixed", { "field-sizing": "fixed" }], ["field-sizing-content", { "field-sizing": "content" }]];
const ringBase = {
  "--un-ring-inset": " ",
  "--un-ring-offset-width": "0px",
  "--un-ring-offset-color": "#fff",
  "--un-ring-width": "0px",
  "--un-ring-color": "rgb(147 197 253 / 0.5)",
  "--un-shadow": "0 0 rgb(0 0 0 / 0)"
};
const rings = [
  [
    /^ring(?:-(.+))?$/,
    ([, d], { theme: theme2 }) => {
      const value2 = theme2.ringWidth?.[d || "DEFAULT"] ?? h.px(d || "1");
      if (value2) return {
        "--un-ring-width": value2,
        "--un-ring-offset-shadow": "var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)",
        "--un-ring-shadow": "var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)",
        "box-shadow": "var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"
      };
    },
    {
      custom: { preflightKeys: Object.keys(ringBase) },
      autocomplete: "ring-$ringWidth"
    }
  ],
  [
    /^ring-(?:width-|size-)(.+)$/,
    handleWidth$1,
    { autocomplete: "ring-(width|size)-$lineWidth" }
  ],
  ["ring-offset", { "--un-ring-offset-width": "1px" }],
  [
    /^ring-offset-(?:width-|size-)?(.+)$/,
    ([, d], { theme: theme2 }) => ({ "--un-ring-offset-width": theme2.lineWidth?.[d] ?? h.bracket.cssvar.px(d) }),
    { autocomplete: "ring-offset-(width|size)-$lineWidth" }
  ],
  [
    /^ring-(.+)$/,
    handleColorOrWidth$1,
    { autocomplete: "ring-$colors" }
  ],
  [
    /^ring-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-ring-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "ring-(op|opacity)-<percent>" }
  ],
  [
    /^ring-offset-(.+)$/,
    colorResolver("--un-ring-offset-color", "ring-offset", "borderColor"),
    { autocomplete: "ring-offset-$colors" }
  ],
  [
    /^ring-offset-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-ring-offset-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "ring-offset-(op|opacity)-<percent>" }
  ],
  ["ring-inset", { "--un-ring-inset": "inset" }]
];
function handleWidth$1([, b2], { theme: theme2 }) {
  return { "--un-ring-width": theme2.ringWidth?.[b2] ?? h.bracket.cssvar.px(b2) };
}
function handleColorOrWidth$1(match, ctx) {
  if (isCSSMathFn(h.bracket(match[1]))) return handleWidth$1(match, ctx);
  return colorResolver("--un-ring-color", "ring", "borderColor")(match, ctx);
}
const boxShadowsBase = {
  "--un-ring-offset-shadow": "0 0 rgb(0 0 0 / 0)",
  "--un-ring-shadow": "0 0 rgb(0 0 0 / 0)",
  "--un-shadow-inset": " ",
  "--un-shadow": "0 0 rgb(0 0 0 / 0)"
};
const boxShadows = [
  [
    /^shadow(?:-(.+))?$/,
    (match, context) => {
      const [, d] = match;
      const { theme: theme2 } = context;
      const v = theme2.boxShadow?.[d || "DEFAULT"];
      const c2 = d ? h.bracket.cssvar(d) : void 0;
      if ((v != null || c2 != null) && !hasParseableColor(c2, theme2, "shadowColor")) return {
        "--un-shadow": colorableShadows(v || c2, "--un-shadow-color").join(","),
        "box-shadow": "var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"
      };
      return colorResolver("--un-shadow-color", "shadow", "shadowColor")(match, context);
    },
    {
      custom: { preflightKeys: Object.keys(boxShadowsBase) },
      autocomplete: ["shadow-$colors", "shadow-$boxShadow"]
    }
  ],
  [
    /^shadow-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-shadow-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "shadow-(op|opacity)-<percent>" }
  ],
  ["shadow-inset", { "--un-shadow-inset": "inset" }]
];
const sizeMapping = {
  h: "height",
  w: "width",
  inline: "inline-size",
  block: "block-size"
};
function getPropName(minmax, hw) {
  return `${minmax || ""}${sizeMapping[hw]}`;
}
function getSizeValue(minmax, hw, theme2, prop) {
  const v = theme2[getPropName(minmax, hw).replace(/-(\w)/g, (_, p) => p.toUpperCase())]?.[prop];
  if (v != null) return v;
  switch (prop) {
    case "fit":
    case "max":
    case "min":
      return `${prop}-content`;
    case "stretch":
      return "stretch";
  }
  return h.bracket.cssvar.global.auto.fraction.rem(prop);
}
const sizes = [
  [/^size-(min-|max-)?(.+)$/, ([, m, s], { theme: theme2 }) => ({
    [getPropName(m, "w")]: getSizeValue(m, "w", theme2, s),
    [getPropName(m, "h")]: getSizeValue(m, "h", theme2, s)
  })],
  [/^(?:size-)?(min-|max-)?([wh])-?(.+)$/, ([, m, w, s], { theme: theme2 }) => ({ [getPropName(m, w)]: getSizeValue(m, w, theme2, s) })],
  [
    /^(?:size-)?(min-|max-)?(block|inline)-(.+)$/,
    ([, m, w, s], { theme: theme2 }) => ({ [getPropName(m, w)]: getSizeValue(m, w, theme2, s) }),
    { autocomplete: [
      "(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(max|min)-(w|h|block|inline)",
      "(max|min)-(w|h|block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize",
      "(w|h)-full",
      "(max|min)-(w|h)-full"
    ] }
  ],
  [/^(?:size-)?(min-|max-)?(h)-screen-(.+)$/, ([, m, h2, p], context) => ({ [getPropName(m, h2)]: handleBreakpoint(context, p, "verticalBreakpoints") })],
  [
    /^(?:size-)?(min-|max-)?(w)-screen-(.+)$/,
    ([, m, w, p], context) => ({ [getPropName(m, w)]: handleBreakpoint(context, p) }),
    { autocomplete: [
      "(w|h)-screen",
      "(min|max)-(w|h)-screen",
      "h-screen-$verticalBreakpoints",
      "(min|max)-h-screen-$verticalBreakpoints",
      "w-screen-$breakpoints",
      "(min|max)-w-screen-$breakpoints"
    ] }
  ]
];
function handleBreakpoint(context, point, key = "breakpoints") {
  const bp = resolveBreakpoints(context, key);
  if (bp) return bp.find((i) => i.point === point)?.size;
}
function getAspectRatio(prop) {
  if (/^\d+\/\d+$/.test(prop)) return prop;
  switch (prop) {
    case "square":
      return "1/1";
    case "video":
      return "16/9";
  }
  return h.bracket.cssvar.global.auto.number(prop);
}
const aspectRatio = [[
  /^(?:size-)?aspect-(?:ratio-)?(.+)$/,
  ([, d]) => ({ "aspect-ratio": getAspectRatio(d) }),
  { autocomplete: ["aspect-(square|video|ratio)", "aspect-ratio-(square|video)"] }
]];
const paddings = [
  [
    /^pa?()-?(.+)$/,
    directionSize("padding"),
    { autocomplete: ["(m|p)<num>", "(m|p)-<num>"] }
  ],
  [
    /^p-?xy()()$/,
    directionSize("padding"),
    { autocomplete: "(m|p)-(xy)" }
  ],
  [/^p-?([xy])(?:-?(.+))?$/, directionSize("padding")],
  [
    /^p-?([rltbse])(?:-?(.+))?$/,
    directionSize("padding"),
    { autocomplete: "(m|p)<directions>-<num>" }
  ],
  [
    /^p-(block|inline)(?:-(.+))?$/,
    directionSize("padding"),
    { autocomplete: "(m|p)-(block|inline)-<num>" }
  ],
  [
    /^p-?([bi][se])(?:-?(.+))?$/,
    directionSize("padding"),
    { autocomplete: "(m|p)-(bs|be|is|ie)-<num>" }
  ]
];
const margins = [
  [/^ma?()-?(.+)$/, directionSize("margin")],
  [/^m-?xy()()$/, directionSize("margin")],
  [/^m-?([xy])(?:-?(.+))?$/, directionSize("margin")],
  [/^m-?([rltbse])(?:-?(.+))?$/, directionSize("margin")],
  [/^m-(block|inline)(?:-(.+))?$/, directionSize("margin")],
  [/^m-?([bi][se])(?:-?(.+))?$/, directionSize("margin")]
];
const svgUtilities = [
  [
    /^fill-(.+)$/,
    colorResolver("fill", "fill", "backgroundColor"),
    { autocomplete: "fill-$colors" }
  ],
  [
    /^fill-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-fill-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "fill-(op|opacity)-<percent>" }
  ],
  ["fill-none", { fill: "none" }],
  [
    /^stroke-(?:width-|size-)?(.+)$/,
    handleWidth,
    { autocomplete: ["stroke-width-$lineWidth", "stroke-size-$lineWidth"] }
  ],
  [
    /^stroke-dash-(.+)$/,
    ([, s]) => ({ "stroke-dasharray": h.bracket.cssvar.number(s) }),
    { autocomplete: "stroke-dash-<num>" }
  ],
  [
    /^stroke-offset-(.+)$/,
    ([, s], { theme: theme2 }) => ({ "stroke-dashoffset": theme2.lineWidth?.[s] ?? h.bracket.cssvar.px.numberWithUnit(s) }),
    { autocomplete: "stroke-offset-$lineWidth" }
  ],
  [
    /^stroke-(.+)$/,
    handleColorOrWidth,
    { autocomplete: "stroke-$colors" }
  ],
  [
    /^stroke-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-stroke-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "stroke-(op|opacity)-<percent>" }
  ],
  ["stroke-cap-square", { "stroke-linecap": "square" }],
  ["stroke-cap-round", { "stroke-linecap": "round" }],
  ["stroke-cap-auto", { "stroke-linecap": "butt" }],
  ["stroke-join-arcs", { "stroke-linejoin": "arcs" }],
  ["stroke-join-bevel", { "stroke-linejoin": "bevel" }],
  ["stroke-join-clip", { "stroke-linejoin": "miter-clip" }],
  ["stroke-join-round", { "stroke-linejoin": "round" }],
  ["stroke-join-auto", { "stroke-linejoin": "miter" }],
  ["stroke-none", { stroke: "none" }]
];
function handleWidth([, b2], { theme: theme2 }) {
  return { "stroke-width": theme2.lineWidth?.[b2] ?? h.bracket.cssvar.fraction.px.number(b2) };
}
function handleColorOrWidth(match, ctx) {
  if (isCSSMathFn(h.bracket(match[1]))) return handleWidth(match, ctx);
  return colorResolver("stroke", "stroke", "borderColor")(match, ctx);
}
const transformValues = [
  "translate",
  "rotate",
  "scale"
];
const transformCpu = [
  "translateX(var(--un-translate-x))",
  "translateY(var(--un-translate-y))",
  "rotate(var(--un-rotate))",
  "rotateZ(var(--un-rotate-z))",
  "skewX(var(--un-skew-x))",
  "skewY(var(--un-skew-y))",
  "scaleX(var(--un-scale-x))",
  "scaleY(var(--un-scale-y))"
].join(" ");
const transform = [
  "translateX(var(--un-translate-x))",
  "translateY(var(--un-translate-y))",
  "translateZ(var(--un-translate-z))",
  "rotate(var(--un-rotate))",
  "rotateX(var(--un-rotate-x))",
  "rotateY(var(--un-rotate-y))",
  "rotateZ(var(--un-rotate-z))",
  "skewX(var(--un-skew-x))",
  "skewY(var(--un-skew-y))",
  "scaleX(var(--un-scale-x))",
  "scaleY(var(--un-scale-y))",
  "scaleZ(var(--un-scale-z))"
].join(" ");
const transformGpu = [
  "translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))",
  "rotate(var(--un-rotate))",
  "rotateX(var(--un-rotate-x))",
  "rotateY(var(--un-rotate-y))",
  "rotateZ(var(--un-rotate-z))",
  "skewX(var(--un-skew-x))",
  "skewY(var(--un-skew-y))",
  "scaleX(var(--un-scale-x))",
  "scaleY(var(--un-scale-y))",
  "scaleZ(var(--un-scale-z))"
].join(" ");
const transformBase = {
  "--un-rotate": 0,
  "--un-rotate-x": 0,
  "--un-rotate-y": 0,
  "--un-rotate-z": 0,
  "--un-scale-x": 1,
  "--un-scale-y": 1,
  "--un-scale-z": 1,
  "--un-skew-x": 0,
  "--un-skew-y": 0,
  "--un-translate-x": 0,
  "--un-translate-y": 0,
  "--un-translate-z": 0
};
const preflightKeys = Object.keys(transformBase);
const transforms = [
  [
    /^(?:transform-)?origin-(.+)$/,
    ([, s]) => ({ "transform-origin": positionMap[s] ?? h.bracket.cssvar(s) }),
    { autocomplete: [`transform-origin-(${Object.keys(positionMap).join("|")})`, `origin-(${Object.keys(positionMap).join("|")})`] }
  ],
  [/^(transform-)?perspect(?:ive)?-(.+)$/, ([, t, s]) => {
    const v = h.bracket.cssvar.px.numberWithUnit(s);
    if (v != null) {
      if (t) return {
        "--un-perspective": `perspective(${v})`,
        "transform": `var(--un-perspective) ${transform}`
      };
      return {
        "-webkit-perspective": v,
        "perspective": v
      };
    }
  }],
  [/^perspect(?:ive)?-origin-(.+)$/, ([, s]) => {
    const v = h.bracket.cssvar(s) ?? (s.length >= 3 ? positionMap[s] : void 0);
    if (v != null) return {
      "-webkit-perspective-origin": v,
      "perspective-origin": v
    };
  }],
  [
    /^(?:transform-)?translate-()(.+)$/,
    handleTranslate,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?translate-([xyz])-(.+)$/,
    handleTranslate,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?rotate-()(.+)$/,
    handleRotate,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?rotate-([xyz])-(.+)$/,
    handleRotate,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?skew-()(.+)$/,
    handleSkew,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?skew-([xy])-(.+)$/,
    handleSkew,
    {
      custom: { preflightKeys },
      autocomplete: ["transform-skew-(x|y)-<percent>", "skew-(x|y)-<percent>"]
    }
  ],
  [
    /^(?:transform-)?scale-()(.+)$/,
    handleScale,
    { custom: { preflightKeys } }
  ],
  [
    /^(?:transform-)?scale-([xyz])-(.+)$/,
    handleScale,
    {
      custom: { preflightKeys },
      autocomplete: [
        `transform-(${transformValues.join("|")})-<percent>`,
        `transform-(${transformValues.join("|")})-(x|y|z)-<percent>`,
        `(${transformValues.join("|")})-<percent>`,
        `(${transformValues.join("|")})-(x|y|z)-<percent>`
      ]
    }
  ],
  [/^(?:transform-)?preserve-3d$/, () => ({ "transform-style": "preserve-3d" })],
  [/^(?:transform-)?preserve-flat$/, () => ({ "transform-style": "flat" })],
  [
    "transform",
    { transform },
    { custom: { preflightKeys } }
  ],
  [
    "transform-cpu",
    { transform: transformCpu },
    { custom: { preflightKeys: [
      "--un-translate-x",
      "--un-translate-y",
      "--un-rotate",
      "--un-rotate-z",
      "--un-skew-x",
      "--un-skew-y",
      "--un-scale-x",
      "--un-scale-y"
    ] } }
  ],
  [
    "transform-gpu",
    { transform: transformGpu },
    { custom: { preflightKeys } }
  ],
  ["transform-none", { transform: "none" }],
  ...makeGlobalStaticRules("transform")
];
function handleTranslate([, d, b2], { theme: theme2 }) {
  const v = theme2.spacing?.[b2] ?? h.bracket.cssvar.fraction.rem(b2);
  if (v != null) return [...transformXYZ(d, v, "translate"), ["transform", transform]];
}
function handleScale([, d, b2]) {
  const v = h.bracket.cssvar.fraction.percent(b2);
  if (v != null) return [...transformXYZ(d, v, "scale"), ["transform", transform]];
}
function handleRotate([, d = "", b2]) {
  const v = h.bracket.cssvar.degree(b2);
  if (v != null) if (d) return {
    "--un-rotate": 0,
    [`--un-rotate-${d}`]: v,
    "transform": transform
  };
  else return {
    "--un-rotate-x": 0,
    "--un-rotate-y": 0,
    "--un-rotate-z": 0,
    "--un-rotate": v,
    "transform": transform
  };
}
function handleSkew([, d, b2]) {
  const v = h.bracket.cssvar.degree(b2);
  if (v != null) return [...transformXYZ(d, v, "skew"), ["transform", transform]];
}
function resolveTransitionProperty(prop, theme2) {
  let p;
  if (h.cssvar(prop) != null) p = h.cssvar(prop);
  else {
    if (prop.startsWith("[") && prop.endsWith("]")) prop = prop.slice(1, -1);
    const props = prop.split(",").map((p2) => theme2.transitionProperty?.[p2] ?? h.properties(p2));
    if (props.every(Boolean)) p = props.join(",");
  }
  return p;
}
const transitions = [
  [
    /^transition(?:-(\D+?))?(?:-(\d+))?$/,
    ([, prop, d], { theme: theme2 }) => {
      if (!prop && !d) return {
        "transition-property": theme2.transitionProperty?.DEFAULT,
        "transition-timing-function": theme2.easing?.DEFAULT,
        "transition-duration": theme2.duration?.DEFAULT ?? h.time("150")
      };
      else if (prop != null) {
        const p = resolveTransitionProperty(prop, theme2);
        const duration2 = theme2.duration?.[d || "DEFAULT"] ?? h.time(d || "150");
        if (p) return {
          "transition-property": p,
          "transition-timing-function": theme2.easing?.DEFAULT,
          "transition-duration": duration2
        };
      } else if (d != null) return {
        "transition-property": theme2.transitionProperty?.DEFAULT,
        "transition-timing-function": theme2.easing?.DEFAULT,
        "transition-duration": theme2.duration?.[d] ?? h.time(d)
      };
    },
    { autocomplete: "transition-$transitionProperty-$duration" }
  ],
  [
    /^(?:transition-)?duration-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "transition-duration": theme2.duration?.[d || "DEFAULT"] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: ["transition-duration-$duration", "duration-$duration"] }
  ],
  [
    /^(?:transition-)?delay-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "transition-delay": theme2.duration?.[d || "DEFAULT"] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: ["transition-delay-$duration", "delay-$duration"] }
  ],
  [
    /^(?:transition-)?ease(?:-(.+))?$/,
    ([, d], { theme: theme2 }) => ({ "transition-timing-function": theme2.easing?.[d || "DEFAULT"] ?? h.bracket.cssvar(d) }),
    { autocomplete: ["transition-ease-(linear|in|out|in-out|DEFAULT)", "ease-(linear|in|out|in-out|DEFAULT)"] }
  ],
  [
    /^(?:transition-)?property-(.+)$/,
    ([, v], { theme: theme2 }) => {
      const p = h.global(v) || resolveTransitionProperty(v, theme2);
      if (p) return { "transition-property": p };
    },
    { autocomplete: [
      `transition-property-(${[...globalKeywords].join("|")})`,
      "transition-property-$transitionProperty",
      "property-$transitionProperty"
    ] }
  ],
  ["transition-none", { transition: "none" }],
  ...makeGlobalStaticRules("transition"),
  ["transition-discrete", { "transition-behavior": "allow-discrete" }],
  ["transition-normal", { "transition-behavior": "normal" }]
];
const fonts = [
  [
    /^text-(.+)$/,
    handleText,
    { autocomplete: "text-$fontSize" }
  ],
  [
    /^(?:text|font)-size-(.+)$/,
    handleSize,
    { autocomplete: "text-size-$fontSize" }
  ],
  [
    /^text-(?:color-)?(.+)$/,
    handlerColorOrSize,
    { autocomplete: "text-$colors" }
  ],
  [
    /^(?:color|c)-(.+)$/,
    colorResolver("color", "text", "textColor"),
    { autocomplete: "(color|c)-$colors" }
  ],
  [
    /^(?:text|color|c)-(.+)$/,
    ([, v]) => globalKeywords.includes(v) ? { color: v } : void 0,
    { autocomplete: `(text|color|c)-(${globalKeywords.join("|")})` }
  ],
  [
    /^(?:text|color|c)-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-text-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "(text|color|c)-(op|opacity)-<percent>" }
  ],
  [
    /^(?:font|fw)-?([^-]+)$/,
    ([, s], { theme: theme2 }) => ({ "font-weight": theme2.fontWeight?.[s] || h.bracket.global.number(s) }),
    { autocomplete: ["(font|fw)-(100|200|300|400|500|600|700|800|900)", "(font|fw)-$fontWeight"] }
  ],
  [
    /^(?:font-)?(?:leading|lh|line-height)-(.+)$/,
    ([, s], { theme: theme2 }) => ({ "line-height": handleThemeByKey(s, theme2, "lineHeight") }),
    { autocomplete: "(leading|lh|line-height)-$lineHeight" }
  ],
  ["font-synthesis-weight", { "font-synthesis": "weight" }],
  ["font-synthesis-style", { "font-synthesis": "style" }],
  ["font-synthesis-small-caps", { "font-synthesis": "small-caps" }],
  ["font-synthesis-none", { "font-synthesis": "none" }],
  [/^font-synthesis-(.+)$/, ([, s]) => ({ "font-synthesis": h.bracket.cssvar.global(s) })],
  [
    /^(?:font-)?tracking-(.+)$/,
    ([, s], { theme: theme2 }) => ({ "letter-spacing": theme2.letterSpacing?.[s] || h.bracket.cssvar.global.rem(s) }),
    { autocomplete: "tracking-$letterSpacing" }
  ],
  [
    /^(?:font-)?word-spacing-(.+)$/,
    ([, s], { theme: theme2 }) => ({ "word-spacing": theme2.wordSpacing?.[s] || h.bracket.cssvar.global.rem(s) }),
    { autocomplete: "word-spacing-$wordSpacing" }
  ],
  ["font-stretch-normal", { "font-stretch": "normal" }],
  ["font-stretch-ultra-condensed", { "font-stretch": "ultra-condensed" }],
  ["font-stretch-extra-condensed", { "font-stretch": "extra-condensed" }],
  ["font-stretch-condensed", { "font-stretch": "condensed" }],
  ["font-stretch-semi-condensed", { "font-stretch": "semi-condensed" }],
  ["font-stretch-semi-expanded", { "font-stretch": "semi-expanded" }],
  ["font-stretch-expanded", { "font-stretch": "expanded" }],
  ["font-stretch-extra-expanded", { "font-stretch": "extra-expanded" }],
  ["font-stretch-ultra-expanded", { "font-stretch": "ultra-expanded" }],
  [
    /^font-stretch-(.+)$/,
    ([, s]) => ({ "font-stretch": h.bracket.cssvar.fraction.global(s) }),
    { autocomplete: "font-stretch-<percentage>" }
  ],
  [
    /^font-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "font-family": theme2.fontFamily?.[d] || h.bracket.cssvar.global(d) }),
    { autocomplete: "font-$fontFamily" }
  ]
];
const tabSizes = [[/^tab(?:-(.+))?$/, ([, s]) => {
  const v = h.bracket.cssvar.global.number(s || "4");
  if (v != null) return {
    "-moz-tab-size": v,
    "-o-tab-size": v,
    "tab-size": v
  };
}]];
const textIndents = [[
  /^indent(?:-(.+))?$/,
  ([, s], { theme: theme2 }) => ({ "text-indent": theme2.textIndent?.[s || "DEFAULT"] || h.bracket.cssvar.global.fraction.rem(s) }),
  { autocomplete: "indent-$textIndent" }
]];
const textStrokes = [
  [
    /^text-stroke(?:-(.+))?$/,
    ([, s], { theme: theme2 }) => ({ "-webkit-text-stroke-width": theme2.textStrokeWidth?.[s || "DEFAULT"] || h.bracket.cssvar.px(s) }),
    { autocomplete: "text-stroke-$textStrokeWidth" }
  ],
  [
    /^text-stroke-(.+)$/,
    colorResolver("-webkit-text-stroke-color", "text-stroke", "borderColor"),
    { autocomplete: "text-stroke-$colors" }
  ],
  [
    /^text-stroke-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-text-stroke-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "text-stroke-(op|opacity)-<percent>" }
  ]
];
const textShadows = [
  [
    /^text-shadow(?:-(.+))?$/,
    ([, s], { theme: theme2 }) => {
      const v = theme2.textShadow?.[s || "DEFAULT"];
      if (v != null) return {
        "--un-text-shadow": colorableShadows(v, "--un-text-shadow-color").join(","),
        "text-shadow": "var(--un-text-shadow)"
      };
      return { "text-shadow": h.bracket.cssvar.global(s) };
    },
    { autocomplete: "text-shadow-$textShadow" }
  ],
  [
    /^text-shadow-color-(.+)$/,
    colorResolver("--un-text-shadow-color", "text-shadow", "shadowColor"),
    { autocomplete: "text-shadow-color-$colors" }
  ],
  [
    /^text-shadow-color-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-text-shadow-opacity": h.bracket.percent.cssvar(opacity2) }),
    { autocomplete: "text-shadow-color-(op|opacity)-<percent>" }
  ]
];
function handleThemeByKey(s, theme2, key) {
  return theme2[key]?.[s] || h.bracket.cssvar.global.rem(s);
}
function handleSize([, s], { theme: theme2 }) {
  const size = toArray(theme2.fontSize?.[s])?.[0] ?? h.bracket.cssvar.global.rem(s);
  if (size != null) return { "font-size": size };
}
function handlerColorOrSize(match, ctx) {
  if (isCSSMathFn(h.bracket(match[1]))) return handleSize(match, ctx);
  return colorResolver("color", "text", "textColor")(match, ctx);
}
function handleText([, s = "base"], { theme: theme2 }) {
  const split = splitShorthand(s, "length");
  if (!split) return;
  const [size, leading] = split;
  const sizePairs = toArray(theme2.fontSize?.[size]);
  const lineHeight2 = leading ? handleThemeByKey(leading, theme2, "lineHeight") : void 0;
  if (sizePairs?.[0]) {
    const [fontSize3, height2, letterSpacing2] = sizePairs;
    if (typeof height2 === "object") return {
      "font-size": fontSize3,
      ...height2
    };
    return {
      "font-size": fontSize3,
      "line-height": lineHeight2 ?? height2 ?? "1",
      "letter-spacing": letterSpacing2 ? handleThemeByKey(letterSpacing2, theme2, "letterSpacing") : void 0
    };
  }
  const fontSize2 = h.bracketOfLength.rem(size);
  if (lineHeight2 && fontSize2) return {
    "font-size": fontSize2,
    "line-height": lineHeight2
  };
  return { "font-size": h.bracketOfLength.rem(s) };
}
const variablesAbbrMap$1 = {
  backface: "backface-visibility",
  break: "word-break",
  case: "text-transform",
  content: "align-content",
  fw: "font-weight",
  items: "align-items",
  justify: "justify-content",
  select: "user-select",
  self: "align-self",
  vertical: "vertical-align",
  visible: "visibility",
  whitespace: "white-space",
  ws: "white-space"
};
const cssVariables$1 = [[/^(.+?)-(\$.+)$/, ([, name2, varname]) => {
  const prop = variablesAbbrMap$1[name2];
  if (prop) return { [prop]: h.cssvar(varname) };
}]];
const cssProperty = [[/^\[(.*)\]$/, ([_, body]) => {
  if (!body.includes(":")) return;
  const [prop, ...rest] = body.split(":");
  const value2 = rest.join(":");
  if (!isURI(body) && /^[\w-]+$/.test(prop) && isValidCSSBody(value2)) {
    const parsed = h.bracket(`[${value2}]`);
    if (parsed) return { [prop]: parsed };
  }
}]];
function isValidCSSBody(body) {
  let i = 0;
  function findUntil(c2) {
    while (i < body.length) {
      i += 1;
      if (body[i] === c2) return true;
    }
    return false;
  }
  for (i = 0; i < body.length; i++) {
    const c2 = body[i];
    if ("\"`'".includes(c2)) {
      if (!findUntil(c2)) return false;
    } else if (c2 === "(") {
      if (!findUntil(")")) return false;
    } else if ("[]{}:".includes(c2)) return false;
  }
  return true;
}
function isURI(declaration) {
  if (!declaration.includes("://")) return false;
  try {
    return new URL(declaration).host !== "";
  } catch {
    return false;
  }
}
const rules$1 = [
  cssVariables$1,
  cssProperty,
  contains,
  pointerEvents,
  appearances,
  positions,
  insets,
  zIndexes,
  orders,
  grids,
  floats,
  margins,
  boxSizing,
  displays,
  aspectRatio,
  sizes,
  flex$1,
  transforms,
  cursors,
  userSelects,
  resizes,
  appearance,
  placements,
  alignments,
  justifies,
  gaps,
  flexGridJustifiesAlignments,
  overflows,
  textOverflows,
  whitespaces,
  breaks,
  borders,
  bgColors,
  colorScheme,
  svgUtilities,
  paddings,
  textAligns,
  textIndents,
  textWraps,
  verticalAligns,
  fonts,
  textTransforms$1,
  fontStyles,
  textDecorations,
  fontSmoothings,
  tabSizes,
  textStrokes,
  textShadows,
  opacity,
  boxShadows,
  outline,
  rings,
  transitions,
  willChange,
  contentVisibility,
  contents,
  containerParent,
  fieldSizing,
  questionMark
].flat(1);
const colors = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724"
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764"
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065"
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16"
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05"
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407"
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b"
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09"
  },
  light: {
    50: "#fdfdfd",
    100: "#fcfcfc",
    200: "#fafafa",
    300: "#f8f9fa",
    400: "#f6f6f6",
    500: "#f2f2f2",
    600: "#f1f3f5",
    700: "#e9ecef",
    800: "#dee2e6",
    900: "#dde1e3",
    950: "#d8dcdf"
  },
  dark: {
    50: "#4a4a4a",
    100: "#3c3c3c",
    200: "#323232",
    300: "#2d2d2d",
    400: "#222222",
    500: "#1f1f1f",
    600: "#1c1c1e",
    700: "#1b1b1b",
    800: "#181818",
    900: "#0f0f0f",
    950: "#080808"
  },
  get lightblue() {
    return this.sky;
  },
  get lightBlue() {
    return this.sky;
  },
  get warmgray() {
    return this.stone;
  },
  get warmGray() {
    return this.stone;
  },
  get truegray() {
    return this.neutral;
  },
  get trueGray() {
    return this.neutral;
  },
  get coolgray() {
    return this.gray;
  },
  get coolGray() {
    return this.gray;
  },
  get bluegray() {
    return this.slate;
  },
  get blueGray() {
    return this.slate;
  }
};
Object.values(colors).forEach((color2) => {
  if (typeof color2 !== "string" && color2 !== void 0) {
    color2.DEFAULT = color2.DEFAULT || color2[400];
    Object.keys(color2).forEach((key) => {
      const short = +key / 100;
      if (short === Math.round(short)) color2[short] = color2[key];
    });
  }
});
const blur = {
  "DEFAULT": "8px",
  "0": "0",
  "sm": "4px",
  "md": "12px",
  "lg": "16px",
  "xl": "24px",
  "2xl": "40px",
  "3xl": "64px"
};
const dropShadow = {
  "DEFAULT": ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
  "sm": "0 1px 1px rgb(0 0 0 / 0.05)",
  "md": ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
  "lg": ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
  "xl": ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
  "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
  "none": "0 0 rgb(0 0 0 / 0)"
};
const fontFamily = {
  sans: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"'
  ].join(","),
  serif: [
    "ui-serif",
    "Georgia",
    "Cambria",
    '"Times New Roman"',
    "Times",
    "serif"
  ].join(","),
  mono: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    '"Liberation Mono"',
    '"Courier New"',
    "monospace"
  ].join(",")
};
const fontSize = {
  "xs": ["0.75rem", "1rem"],
  "sm": ["0.875rem", "1.25rem"],
  "base": ["1rem", "1.5rem"],
  "lg": ["1.125rem", "1.75rem"],
  "xl": ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"],
  "3xl": ["1.875rem", "2.25rem"],
  "4xl": ["2.25rem", "2.5rem"],
  "5xl": ["3rem", "1"],
  "6xl": ["3.75rem", "1"],
  "7xl": ["4.5rem", "1"],
  "8xl": ["6rem", "1"],
  "9xl": ["8rem", "1"]
};
const textIndent = {
  "DEFAULT": "1.5rem",
  "xs": "0.5rem",
  "sm": "1rem",
  "md": "1.5rem",
  "lg": "2rem",
  "xl": "2.5rem",
  "2xl": "3rem",
  "3xl": "4rem"
};
const textStrokeWidth = {
  DEFAULT: "1.5rem",
  none: "0",
  sm: "thin",
  md: "medium",
  lg: "thick"
};
const textShadow = {
  DEFAULT: ["0 0 1px rgb(0 0 0 / 0.2)", "0 0 1px rgb(1 0 5 / 0.1)"],
  none: "0 0 rgb(0 0 0 / 0)",
  sm: "1px 1px 3px rgb(36 37 47 / 0.25)",
  md: ["0 1px 2px rgb(30 29 39 / 0.19)", "1px 2px 4px rgb(54 64 147 / 0.18)"],
  lg: ["3px 3px 6px rgb(0 0 0 / 0.26)", "0 0 5px rgb(15 3 86 / 0.22)"],
  xl: ["1px 1px 3px rgb(0 0 0 / 0.29)", "2px 4px 7px rgb(73 64 125 / 0.35)"]
};
const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2"
};
const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em"
};
const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900"
};
const wordSpacing = letterSpacing;
const breakpoints = {
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px"
};
const verticalBreakpoints = { ...breakpoints };
const lineWidth = {
  DEFAULT: "1px",
  none: "0"
};
const spacing = {
  "DEFAULT": "1rem",
  "none": "0",
  "xs": "0.75rem",
  "sm": "0.875rem",
  "lg": "1.125rem",
  "xl": "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem"
};
const duration = {
  DEFAULT: "150ms",
  none: "0s",
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1e3: "1000ms"
};
const borderRadius = {
  "DEFAULT": "0.25rem",
  "none": "0",
  "sm": "0.125rem",
  "md": "0.375rem",
  "lg": "0.5rem",
  "xl": "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  "full": "9999px"
};
const boxShadow = {
  "DEFAULT": ["var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)", "var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)"],
  "none": "0 0 rgb(0 0 0 / 0)",
  "sm": "var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "md": ["var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)", "var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)"],
  "lg": ["var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)", "var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)"],
  "xl": ["var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)", "var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)"],
  "2xl": "var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
};
const ringWidth = {
  DEFAULT: "3px",
  none: "0"
};
const zIndex = { auto: "auto" };
const media$1 = { mouse: "(hover) and (pointer: fine)" };
const preflightBase = {
  ...transformBase,
  ...boxShadowsBase,
  ...ringBase
};
const baseSize = {
  "xs": "20rem",
  "sm": "24rem",
  "md": "28rem",
  "lg": "32rem",
  "xl": "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  "prose": "65ch"
};
const width = {
  auto: "auto",
  ...baseSize,
  screen: "100vw"
};
const maxWidth = {
  none: "none",
  ...baseSize,
  screen: "100vw"
};
const blockSize = {
  auto: "auto",
  ...baseSize,
  screen: "100vb"
};
const inlineSize = {
  auto: "auto",
  ...baseSize,
  screen: "100vi"
};
const height = {
  auto: "auto",
  ...baseSize,
  screen: "100vh"
};
const maxHeight = {
  none: "none",
  ...baseSize,
  screen: "100vh"
};
const maxBlockSize = {
  none: "none",
  ...baseSize,
  screen: "100vb"
};
const maxInlineSize = {
  none: "none",
  ...baseSize,
  screen: "100vi"
};
const containers = { ...baseSize };
const theme$1 = {
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth: maxWidth,
  minHeight: maxHeight,
  inlineSize,
  blockSize,
  maxInlineSize,
  maxBlockSize,
  minInlineSize: maxInlineSize,
  minBlockSize: maxBlockSize,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  breakpoints,
  verticalBreakpoints,
  borderRadius,
  lineHeight,
  letterSpacing,
  wordSpacing,
  boxShadow,
  textIndent,
  textShadow,
  textStrokeWidth,
  blur,
  dropShadow,
  easing: {
    "DEFAULT": "cubic-bezier(0.4, 0, 0.2, 1)",
    "linear": "linear",
    "in": "cubic-bezier(0.4, 0, 1, 1)",
    "out": "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  transitionProperty: {
    none: "none",
    all: "all",
    colors: [
      "color",
      "background-color",
      "border-color",
      "text-decoration-color",
      "fill",
      "stroke"
    ].join(","),
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform",
    get DEFAULT() {
      return [
        this.colors,
        "opacity",
        "box-shadow",
        "transform",
        "filter",
        "backdrop-filter"
      ].join(",");
    }
  },
  lineWidth,
  spacing,
  duration,
  ringWidth,
  preflightBase,
  containers,
  zIndex,
  media: media$1
};
const variantAria = {
  name: "aria",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("aria-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const aria = h.bracket(match) ?? ctx.theme.aria?.[match] ?? "";
      if (aria) return {
        matcher: rest,
        selector: (s) => `${s}[aria-${aria}]`
      };
    }
  },
  multiPass: true
};
function taggedAria(tagName, combinator, options = {}) {
  return {
    name: `${tagName}-aria`,
    match(matcher, ctx) {
      const variant = (0, utils_exports.variantGetParameter)(`${tagName}-aria-`, matcher, ctx.generator.config.separators);
      if (variant) {
        const [match, rest, label] = variant;
        const ariaAttribute = h.bracket(match) ?? ctx.theme.aria?.[match] ?? "";
        if (ariaAttribute) {
          const attributify = !!options?.attributifyPseudo;
          let firstPrefix = options?.prefix ?? "";
          firstPrefix = (Array.isArray(firstPrefix) ? firstPrefix : [firstPrefix]).filter(Boolean)[0] ?? "";
          const parent = `${attributify ? `[${firstPrefix}${tagName}=""]` : `.${firstPrefix}${tagName}`}`;
          const escapedLabel = escapeSelector(label ? `/${label}` : "");
          return {
            matcher: rest,
            handle: (input, next) => {
              const regexp = new RegExp(`${escapeRegExp(parent)}${escapeRegExp(escapedLabel)}(?:\\[.+?\\])+`);
              const match2 = input.prefix.match(regexp);
              let nextPrefix;
              if (match2) {
                const insertIndex = (match2.index ?? 0) + parent.length + escapedLabel.length;
                nextPrefix = [
                  input.prefix.slice(0, insertIndex),
                  `[aria-${ariaAttribute}]`,
                  input.prefix.slice(insertIndex)
                ].join("");
              } else {
                const prefixGroupIndex = Math.max(input.prefix.indexOf(parent), 0);
                nextPrefix = [
                  input.prefix.slice(0, prefixGroupIndex),
                  parent,
                  escapedLabel,
                  `[aria-${ariaAttribute}]`,
                  combinator,
                  input.prefix.slice(prefixGroupIndex)
                ].join("");
              }
              return next({
                ...input,
                prefix: nextPrefix
              });
            }
          };
        }
      }
    },
    multiPass: true
  };
}
function taggedHasAria() {
  return {
    name: "has-aria",
    match(matcher, ctx) {
      const variant = (0, utils_exports.variantGetParameter)("has-aria-", matcher, ctx.generator.config.separators);
      if (variant) {
        const [match, rest] = variant;
        const ariaAttribute = h.bracket(match) ?? ctx.theme.aria?.[match] ?? "";
        if (ariaAttribute) return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            pseudo: `${input.pseudo}:has([aria-${ariaAttribute}])`
          })
        };
      }
    },
    multiPass: true
  };
}
function variantTaggedAriaAttributes(options = {}) {
  return [
    taggedAria("group", " ", options),
    taggedAria("peer", "~", options),
    taggedAria("parent", ">", options),
    taggedAria("previous", "+", options),
    taggedHasAria()
  ];
}
const sizePseudo = /(max|min)-\[([^\]]*)\]:/;
function variantBreakpoints() {
  const regexCache2 = {};
  return {
    name: "breakpoints",
    match(matcher, context) {
      if (sizePseudo.test(matcher)) {
        const match = matcher.match(sizePseudo);
        return {
          matcher: matcher.replace(match[0], ""),
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (${match[1]}-width: ${match[2]})`
          })
        };
      }
      const variantEntries = (resolveBreakpoints(context) ?? []).map(({ point, size }, idx) => [
        point,
        size,
        idx
      ]);
      for (const [point, size, idx] of variantEntries) {
        if (!regexCache2[point]) regexCache2[point] = new RegExp(`^((?:([al]t-|[<~]|max-))?${point}(?:${context.generator.config.separators.join("|")}))`);
        const match = matcher.match(regexCache2[point]);
        if (!match) continue;
        const [, pre] = match;
        const m = matcher.slice(pre.length);
        if (m === "container") continue;
        const isLtPrefix = pre.startsWith("lt-") || pre.startsWith("<") || pre.startsWith("max-");
        const isAtPrefix = pre.startsWith("at-") || pre.startsWith("~");
        let order2 = 3e3;
        if (isLtPrefix) {
          order2 -= idx + 1;
          return {
            matcher: m,
            handle: (input, next) => next({
              ...input,
              parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (max-width: ${(0, utils_exports.calcMaxWidthBySize)(size)})`,
              parentOrder: order2
            })
          };
        }
        order2 += idx + 1;
        if (isAtPrefix && idx < variantEntries.length - 1) return {
          matcher: m,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (min-width: ${size}) and (max-width: ${(0, utils_exports.calcMaxWidthBySize)(variantEntries[idx + 1][1])})`,
            parentOrder: order2
          })
        };
        return {
          matcher: m,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (min-width: ${size})`,
            parentOrder: order2
          })
        };
      }
    },
    multiPass: true,
    autocomplete: "(at-|lt-|max-|)$breakpoints:"
  };
}
const variantChildren = [(0, utils_exports.variantMatcher)("*", (input) => ({ selector: `${input.selector} > *` }), { order: -1 })];
function scopeMatcher(name2, combinator) {
  return {
    name: `combinator:${name2}`,
    match(matcher, ctx) {
      if (!matcher.startsWith(name2)) return;
      const separators = ctx.generator.config.separators;
      let body = (0, utils_exports.variantGetBracket)(`${name2}-`, matcher, separators);
      if (!body) {
        for (const separator of separators) if (matcher.startsWith(`${name2}${separator}`)) {
          body = ["", matcher.slice(name2.length + separator.length)];
          break;
        }
        if (!body) return;
      }
      let bracketValue = h.bracket(body[0]) ?? "";
      if (bracketValue === "") bracketValue = "*";
      return {
        matcher: body[1],
        selector: (s) => `${s}${combinator}${bracketValue}`
      };
    },
    multiPass: true
  };
}
const variantCombinators$1 = [
  scopeMatcher("all", " "),
  scopeMatcher("children", ">"),
  scopeMatcher("next", "+"),
  scopeMatcher("sibling", "+"),
  scopeMatcher("siblings", "~")
];
const variantContainerQuery = {
  name: "@",
  match(matcher, ctx) {
    if (matcher.startsWith("@container")) return;
    const variant = (0, utils_exports.variantGetParameter)("@", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest, label] = variant;
      const unbracket = h.bracket(match);
      let container2;
      if (unbracket) container2 = h.numberWithUnit(unbracket);
      else container2 = ctx.theme.containers?.[match] ?? "";
      if (container2) {
        let order2 = 1e3 + Object.keys(ctx.theme.containers ?? {}).indexOf(match);
        if (label) order2 += 1e3;
        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@container${label ? ` ${label} ` : " "}(min-width: ${container2})`,
            parentOrder: order2
          })
        };
      }
    }
  },
  multiPass: true
};
function variantColorsMediaOrClass(options = {}) {
  if (options?.dark === "class" || typeof options.dark === "object") {
    const { dark = ".dark", light = ".light" } = typeof options.dark === "string" ? {} : options.dark;
    return [(0, utils_exports.variantMatcher)("dark", toArray(dark).map((dark2) => (input) => ({ prefix: `${dark2} $$ ${input.prefix}` }))), (0, utils_exports.variantMatcher)("light", toArray(light).map((light2) => (input) => ({ prefix: `${light2} $$ ${input.prefix}` })))];
  }
  return [(0, utils_exports.variantParentMatcher)("dark", "@media (prefers-color-scheme: dark)"), (0, utils_exports.variantParentMatcher)("light", "@media (prefers-color-scheme: light)")];
}
const variantDataAttribute = {
  name: "data",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("data-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const dataAttribute = h.bracket(match) ?? ctx.theme.data?.[match] ?? "";
      if (dataAttribute) return {
        matcher: rest,
        selector: (s) => `${s}[data-${dataAttribute}]`
      };
    }
  },
  multiPass: true
};
function taggedData(tagName, combinator, options = {}) {
  return {
    name: `${tagName}-data`,
    match(matcher, ctx) {
      const variant = (0, utils_exports.variantGetParameter)(`${tagName}-data-`, matcher, ctx.generator.config.separators);
      if (variant) {
        const [match, rest, label] = variant;
        const dataAttribute = h.bracket(match) ?? ctx.theme.data?.[match] ?? "";
        if (dataAttribute) {
          const attributify = !!options?.attributifyPseudo;
          let firstPrefix = options?.prefix ?? "";
          firstPrefix = (Array.isArray(firstPrefix) ? firstPrefix : [firstPrefix]).filter(Boolean)[0] ?? "";
          const parent = `${attributify ? `[${firstPrefix}${tagName}=""]` : `.${firstPrefix}${tagName}`}`;
          const escapedLabel = escapeSelector(label ? `/${label}` : "");
          return {
            matcher: rest,
            handle: (input, next) => {
              const regexp = new RegExp(`${escapeRegExp(parent)}${escapeRegExp(escapedLabel)}(?:\\[.+?\\])+`);
              const match2 = input.prefix.match(regexp);
              let nextPrefix;
              if (match2) {
                const insertIndex = (match2.index ?? 0) + parent.length + escapedLabel.length;
                nextPrefix = [
                  input.prefix.slice(0, insertIndex),
                  `[data-${dataAttribute}]`,
                  input.prefix.slice(insertIndex)
                ].join("");
              } else {
                const prefixGroupIndex = Math.max(input.prefix.indexOf(parent), 0);
                nextPrefix = [
                  input.prefix.slice(0, prefixGroupIndex),
                  parent,
                  escapedLabel,
                  `[data-${dataAttribute}]`,
                  combinator,
                  input.prefix.slice(prefixGroupIndex)
                ].join("");
              }
              return next({
                ...input,
                prefix: nextPrefix
              });
            }
          };
        }
      }
    },
    multiPass: true
  };
}
function taggedHasData() {
  return {
    name: "has-data",
    match(matcher, ctx) {
      const variant = (0, utils_exports.variantGetParameter)("has-data-", matcher, ctx.generator.config.separators);
      if (variant) {
        const [match, rest] = variant;
        const dataAttribute = h.bracket(match) ?? ctx.theme.data?.[match] ?? "";
        if (dataAttribute) return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            pseudo: `${input.pseudo}:has([data-${dataAttribute}])`
          })
        };
      }
    },
    multiPass: true
  };
}
function variantTaggedDataAttributes(options = {}) {
  return [
    taggedData("group", " ", options),
    taggedData("peer", "~", options),
    taggedData("parent", ">", options),
    taggedData("previous", "+", options),
    taggedHasData()
  ];
}
const variantLanguageDirections = [(0, utils_exports.variantMatcher)("rtl", (input) => ({ prefix: `[dir="rtl"] $$ ${input.prefix}` })), (0, utils_exports.variantMatcher)("ltr", (input) => ({ prefix: `[dir="ltr"] $$ ${input.prefix}` }))];
function variantImportant() {
  let re;
  return {
    name: "important",
    match(matcher, ctx) {
      if (!re) re = new RegExp(`^(important(?:${ctx.generator.config.separators.join("|")})|!)`);
      let base;
      const match = matcher.match(re);
      if (match) base = matcher.slice(match[0].length);
      else if (matcher.endsWith("!")) base = matcher.slice(0, -1);
      if (base) return {
        matcher: base,
        body: (body) => {
          body.forEach((v) => {
            if (v[1] != null) v[1] += " !important";
          });
          return body;
        }
      };
    }
  };
}
const variantPrint = (0, utils_exports.variantParentMatcher)("print", "@media print");
const variantCustomMedia = {
  name: "media",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("media-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      let media2 = h.bracket(match) ?? "";
      if (media2 === "") media2 = ctx.theme.media?.[match] ?? "";
      if (media2) return {
        matcher: rest,
        handle: (input, next) => next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}@media ${media2}`
        })
      };
    }
  },
  multiPass: true
};
const variantSelector = {
  name: "selector",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetBracket)("selector-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const selector2 = h.bracket(match);
      if (selector2) return {
        matcher: rest,
        selector: () => selector2
      };
    }
  }
};
const variantCssLayer = {
  name: "layer",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("layer-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const layer2 = h.bracket(match) ?? match;
      if (layer2) return {
        matcher: rest,
        handle: (input, next) => next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}@layer ${layer2}`
        })
      };
    }
  }
};
const variantInternalLayer = {
  name: "uno-layer",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("uno-layer-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const layer2 = h.bracket(match) ?? match;
      if (layer2) return {
        matcher: rest,
        layer: layer2
      };
    }
  }
};
const variantScope = {
  name: "scope",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetBracket)("scope-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      const scope2 = h.bracket(match);
      if (scope2) return {
        matcher: rest,
        selector: (s) => `${scope2} $$ ${s}`
      };
    }
  }
};
const variantVariables = {
  name: "variables",
  match(matcher, ctx) {
    if (!matcher.startsWith("[")) return;
    const [match, rest] = (0, utils_exports.getBracket)(matcher, "[", "]") ?? [];
    if (!(match && rest)) return;
    let newMatcher;
    for (const separator of ctx.generator.config.separators) if (rest.startsWith(separator)) {
      newMatcher = rest.slice(separator.length);
      break;
    }
    if (newMatcher == null) return;
    const variant = h.bracket(match) ?? "";
    const useParent = variant.startsWith("@");
    if (!(useParent || variant.includes("&"))) return;
    return {
      matcher: newMatcher,
      handle(input, next) {
        const updates = useParent ? { parent: `${input.parent ? `${input.parent} $$ ` : ""}${variant}` } : { selector: variant.replace(/&/g, input.selector) };
        return next({
          ...input,
          ...updates
        });
      }
    };
  },
  multiPass: true
};
const variantTheme = {
  name: "theme-variables",
  match(matcher, ctx) {
    if (!(0, utils_exports.hasThemeFn)(matcher)) return;
    return {
      matcher,
      handle(input, next) {
        return next({
          ...input,
          entries: JSON.parse((0, utils_exports.transformThemeFn)(JSON.stringify(input.entries), ctx.theme))
        });
      }
    };
  }
};
const anchoredNumberRE = /^-?[0-9.]+(?:[a-z]+|%)?$/;
const numberRE = /-?[0-9.]+(?:[a-z]+|%)?/;
const ignoreProps = [/\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/];
function negateMathFunction(value2) {
  const match = value2.match(cssMathFnRE) || value2.match(cssVarFnRE);
  if (match) {
    const [fnBody, rest] = getStringComponent(`(${match[2]})${match[3]}`, "(", ")", " ") ?? [];
    if (fnBody) return `calc(${match[1]}${fnBody} * -1)${rest ? ` ${rest}` : ""}`;
  }
}
const negateFunctionBodyRE = /\b(hue-rotate)\s*(\(.*)/;
function negateFunctionBody(value2) {
  const match = value2.match(negateFunctionBodyRE);
  if (match) {
    const [fnBody, rest] = getStringComponent(match[2], "(", ")", " ") ?? [];
    if (fnBody) {
      const body = anchoredNumberRE.test(fnBody.slice(1, -1)) ? fnBody.replace(numberRE, (i) => i.startsWith("-") ? i.slice(1) : `-${i}`) : `(calc(${fnBody} * -1))`;
      return `${match[1]}${body}${rest ? ` ${rest}` : ""}`;
    }
  }
}
const variantNegative = {
  name: "negative",
  match(matcher) {
    if (!matcher.startsWith("-")) return;
    return {
      matcher: matcher.slice(1),
      body: (body) => {
        if (body.some((v) => v[0] === "$$mini-no-negative")) return;
        let changed = false;
        body.forEach((v) => {
          const value2 = v[1]?.toString();
          if (!value2 || value2 === "0") return;
          if (ignoreProps.some((i) => i.test(v[0]))) return;
          const negatedFn = negateMathFunction(value2);
          if (negatedFn) {
            v[1] = negatedFn;
            changed = true;
            return;
          }
          const negatedBody = negateFunctionBody(value2);
          if (negatedBody) {
            v[1] = negatedBody;
            changed = true;
            return;
          }
          if (anchoredNumberRE.test(value2)) {
            v[1] = value2.replace(numberRE, (i) => i.startsWith("-") ? i.slice(1) : `-${i}`);
            changed = true;
          }
        });
        if (changed) return body;
        return [];
      }
    };
  }
};
function variantPseudoClassesAndElements() {
  return createPseudoClassesAndElements({
    getBracket: _utils_exports.getBracket,
    h,
    variantGetBracket: _utils_exports.variantGetBracket
  });
}
function variantPseudoClassFunctions() {
  return createPseudoClassFunctions({
    getBracket: _utils_exports.getBracket,
    h,
    variantGetBracket: _utils_exports.variantGetBracket
  });
}
function variantTaggedPseudoClasses(options = {}) {
  return createTaggedPseudoClasses(options, {
    getBracket: _utils_exports.getBracket,
    h,
    variantGetBracket: _utils_exports.variantGetBracket
  });
}
const variantPartClasses = createPartClasses();
const variantStartingStyle = {
  name: "starting",
  match(matcher) {
    if (!matcher.startsWith("starting:")) return;
    return {
      matcher: matcher.slice(9),
      handle: (input, next) => next({
        ...input,
        parent: `@starting-style`
      })
    };
  }
};
const variantSupports = {
  name: "supports",
  match(matcher, ctx) {
    const variant = (0, utils_exports.variantGetParameter)("supports-", matcher, ctx.generator.config.separators);
    if (variant) {
      const [match, rest] = variant;
      let supports2 = h.bracket(match) ?? "";
      if (supports2 === "") supports2 = ctx.theme.supports?.[match] ?? "";
      if (supports2) {
        if (/^[\w-]+$/.test(supports2)) supports2 = `(${supports2}: var(--un))`;
        supports2 = supports2.replace(/\b(and|or|not)\b/gi, " $1 ").replace(/\s+/g, " ").trim();
        if (!(supports2.startsWith("(") && supports2.endsWith(")")) && !/^not\b/i.test(supports2)) supports2 = `(${supports2})`;
        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@supports ${supports2}`
          })
        };
      }
    }
  },
  multiPass: true
};
function variants$1(options) {
  return [
    variantAria,
    variantDataAttribute,
    variantCssLayer,
    variantSelector,
    variantInternalLayer,
    variantNegative,
    variantStartingStyle,
    variantImportant(),
    variantSupports,
    variantPrint,
    variantCustomMedia,
    variantBreakpoints(),
    ...variantCombinators$1,
    ...variantPseudoClassesAndElements(),
    variantPseudoClassFunctions(),
    ...variantTaggedPseudoClasses(options),
    variantPartClasses,
    ...variantColorsMediaOrClass(options),
    ...variantLanguageDirections,
    variantScope,
    ...variantChildren,
    variantContainerQuery,
    variantVariables,
    ...variantTaggedDataAttributes(options),
    ...variantTaggedAriaAttributes(options),
    variantTheme
  ];
}
function hash(str) {
  let i;
  let l;
  let hval = 2166136261;
  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return `00000${(hval >>> 0).toString(36)}`.slice(-6);
}
function transformSkipCode(code2, map, SKIP_RULES_RE, keyFlag) {
  for (const item of Array.from(code2.matchAll(SKIP_RULES_RE))) if (item != null) {
    const matched = item[0];
    const withHashKey = `${keyFlag}${hash(matched)}`;
    map.set(withHashKey, matched);
    code2 = code2.replace(matched, withHashKey);
  }
  return code2;
}
function restoreSkipCode(code2, map) {
  for (const [withHashKey, matched] of map.entries()) code2 = code2.replaceAll(withHashKey, matched);
  return code2;
}
const sourceMapRE = /\/\/#\s*sourceMappingURL=.*\n?/g;
function removeSourceMap(code2) {
  if (code2.includes("sourceMappingURL=")) return code2.replace(sourceMapRE, "");
  return code2;
}
const quotedArbitraryValuesRE = /(?:[\w&:[\]-]|\[\S{1,64}=\S{1,64}\]){1,64}\[\\?['"]?\S{1,64}?['"]\]\]?[\w:-]{0,64}/g;
const arbitraryPropertyRE = /\[(\\\W|[\w-]){1,64}:[^\s:]{0,64}?("\S{1,64}?"|'\S{1,64}?'|`\S{1,64}?`|[^\s:]{1,64}?)[^\s:]{0,64}?\)?\]/g;
const arbitraryPropertyCandidateRE = /^\[(?:\\\W|[\w-]){1,64}:['"]?\S{1,64}?['"]?\]$/;
function splitCodeWithArbitraryVariants(code2) {
  const result = [];
  for (const match of code2.matchAll(arbitraryPropertyRE)) {
    if (match.index !== 0 && !/^[\s'"`]/.test(code2[match.index - 1] ?? "")) continue;
    result.push(match[0]);
  }
  for (const match of code2.matchAll(quotedArbitraryValuesRE)) result.push(match[0]);
  const skipMap = /* @__PURE__ */ new Map();
  const skipFlag = "@unocss-skip-arbitrary-brackets";
  code2 = transformSkipCode(code2, skipMap, /-\[(?!&.+?;)[^\]]*\]/g, skipFlag);
  if (!code2) return result;
  code2.split(defaultSplitRE).forEach((match) => {
    if (match.includes(skipFlag)) match = restoreSkipCode(match, skipMap);
    if (isValidSelector(match) && !arbitraryPropertyCandidateRE.test(match)) result.push(match);
  });
  return result;
}
function extractorArbitraryVariants() {
  return {
    name: "@unocss/extractor-arbitrary-variants",
    order: 0,
    extract({ code: code2 }) {
      return splitCodeWithArbitraryVariants(removeSourceMap(code2));
    }
  };
}
function preflights(options) {
  if (options.preflight) return [{
    layer: "preflights",
    getCSS({ theme: theme2, generator }) {
      if (theme2.preflightBase) {
        let entries = Object.entries(theme2.preflightBase);
        if (options.preflight === "on-demand") {
          const keys = new Set(Array.from(generator.activatedRules).map((r) => r[2]?.custom?.preflightKeys).filter(Boolean).flat());
          entries = entries.filter(([k]) => keys.has(k));
        }
        if (entries.length > 0) {
          let css = entriesToCss(entries);
          if (options.variablePrefix !== "un-") css = css.replace(/--un-/g, `--${options.variablePrefix}`);
          return toArray(theme2.preflightRoot ?? ["*,::before,::after", "::backdrop"]).map((root) => `${root}{${css}}`).join("");
        }
      }
    }
  }];
}
const shorthands = {
  position: [
    "relative",
    "absolute",
    "fixed",
    "sticky",
    "static"
  ],
  globalKeyword: globalKeywords
};
const presetMini = definePreset((options = {}) => {
  options.dark = options.dark ?? "class";
  options.attributifyPseudo = options.attributifyPseudo ?? false;
  options.preflight = options.preflight ?? true;
  options.variablePrefix = options.variablePrefix ?? "un-";
  return {
    name: "@unocss/preset-mini",
    theme: theme$1,
    rules: rules$1,
    variants: variants$1(options),
    options,
    prefix: options.prefix,
    postprocess: VarPrefixPostprocessor(options.variablePrefix),
    preflights: preflights(options),
    extractorDefault: options.arbitraryVariants === false ? void 0 : extractorArbitraryVariants(),
    autocomplete: { shorthands }
  };
});
function VarPrefixPostprocessor(prefix) {
  if (prefix !== "un-") return (obj) => {
    obj.entries.forEach((i) => {
      i[0] = i[0].replace(/^--un-/, `--${prefix}`);
      if (typeof i[1] === "string") i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`);
    });
  };
}
const queryMatcher = /@media \(min-width: (.+)\)/;
const container$1 = [[
  /^__container$/,
  (m, context) => {
    const { theme: theme2, variantHandlers } = context;
    const themePadding = theme2.container?.padding;
    let padding;
    if (isString(themePadding)) padding = themePadding;
    else padding = themePadding?.DEFAULT;
    const themeMaxWidth = theme2.container?.maxWidth;
    let maxWidth2;
    for (const v of variantHandlers) {
      const query = v.handle?.({}, (x) => x)?.parent;
      if (isString(query)) {
        const match = query.match(queryMatcher)?.[1];
        if (match) {
          const matchBp = (resolveBreakpoints(context) ?? []).find((i) => i.size === match)?.point;
          if (!themeMaxWidth) maxWidth2 = match;
          else if (matchBp) maxWidth2 = themeMaxWidth?.[matchBp];
          if (matchBp && !isString(themePadding)) padding = themePadding?.[matchBp] ?? padding;
        }
      }
    }
    const css = { "max-width": maxWidth2 };
    if (!variantHandlers.length) css.width = "100%";
    if (theme2.container?.center) {
      css["margin-left"] = "auto";
      css["margin-right"] = "auto";
    }
    if (themePadding) {
      css["padding-left"] = padding;
      css["padding-right"] = padding;
    }
    return css;
  },
  { internal: true }
]];
const containerShortcuts = [[/^(?:(\w+)[:-])?container$/, ([, bp], context) => {
  let points = (resolveBreakpoints(context) ?? []).map((i) => i.point);
  if (bp) {
    if (!points.includes(bp)) return;
    points = points.slice(points.indexOf(bp));
  }
  const shortcuts2 = points.map((p) => `${p}:__container`);
  if (!bp) shortcuts2.unshift("__container");
  return shortcuts2;
}]];
const animations = [
  [
    /^(?:animate-)?keyframes-(.+)$/,
    ([, name2], { theme: theme2 }) => {
      const kf = theme2.animation?.keyframes?.[name2];
      if (kf) return [`@keyframes ${name2}${kf}`, { animation: name2 }];
    },
    { autocomplete: ["animate-keyframes-$animation.keyframes", "keyframes-$animation.keyframes"] }
  ],
  [
    /^animate-(.+)$/,
    ([, name2], { theme: theme2 }) => {
      const kf = theme2.animation?.keyframes?.[name2];
      if (kf) {
        const duration2 = theme2.animation?.durations?.[name2] ?? "1s";
        const timing = theme2.animation?.timingFns?.[name2] ?? "linear";
        const count = theme2.animation?.counts?.[name2] ?? 1;
        const props = theme2.animation?.properties?.[name2];
        return [`@keyframes ${name2}${kf}`, {
          animation: `${name2} ${duration2} ${timing} ${count}`,
          ...props
        }];
      }
      return { animation: h.bracket.cssvar(name2) };
    },
    { autocomplete: "animate-$animation.keyframes" }
  ],
  [/^animate-name-(.+)/, ([, d]) => ({ "animation-name": h.bracket.cssvar(d) ?? d })],
  [
    /^animate-duration-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "animation-duration": theme2.duration?.[d || "DEFAULT"] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: ["animate-duration", "animate-duration-$duration"] }
  ],
  [
    /^animate-delay-(.+)$/,
    ([, d], { theme: theme2 }) => ({ "animation-delay": theme2.duration?.[d || "DEFAULT"] ?? h.bracket.cssvar.time(d) }),
    { autocomplete: ["animate-delay", "animate-delay-$duration"] }
  ],
  [
    /^animate-ease(?:-(.+))?$/,
    ([, d], { theme: theme2 }) => ({ "animation-timing-function": theme2.easing?.[d || "DEFAULT"] ?? h.bracket.cssvar(d) }),
    { autocomplete: ["animate-ease", "animate-ease-$easing"] }
  ],
  [
    /^animate-(fill-mode-|fill-|mode-)?(.+)$/,
    ([, t, d]) => [
      "none",
      "forwards",
      "backwards",
      "both",
      ...[t ? globalKeywords : []]
    ].includes(d) ? { "animation-fill-mode": d } : void 0,
    { autocomplete: [
      "animate-(fill|mode|fill-mode)",
      "animate-(fill|mode|fill-mode)-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)",
      "animate-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)"
    ] }
  ],
  [
    /^animate-(direction-)?(.+)$/,
    ([, t, d]) => [
      "normal",
      "reverse",
      "alternate",
      "alternate-reverse",
      ...[t ? globalKeywords : []]
    ].includes(d) ? { "animation-direction": d } : void 0,
    { autocomplete: [
      "animate-direction",
      "animate-direction-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)",
      "animate-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)"
    ] }
  ],
  [
    /^animate-(?:iteration-count-|iteration-|count-)(.+)$/,
    ([, d]) => ({ "animation-iteration-count": h.bracket.cssvar(d) ?? d.replace(/-/g, ",") }),
    { autocomplete: ["animate-(iteration|count|iteration-count)", "animate-(iteration|count|iteration-count)-<num>"] }
  ],
  [
    /^animate-(play-state-|play-|state-)?(.+)$/,
    ([, t, d]) => [
      "paused",
      "running",
      ...[t ? globalKeywords : []]
    ].includes(d) ? { "animation-play-state": d } : void 0,
    { autocomplete: [
      "animate-(play|state|play-state)",
      "animate-(play|state|play-state)-(paused|running|inherit|initial|revert|revert-layer|unset)",
      "animate-(paused|running|inherit|initial|revert|revert-layer|unset)"
    ] }
  ],
  ["animate-none", { animation: "none" }],
  ...makeGlobalStaticRules("animate", "animation")
];
function bgGradientToValue(cssColor) {
  if (cssColor) return colorToString(cssColor, 0);
  return "rgb(255 255 255 / 0)";
}
function bgGradientColorValue(mode2, cssColor, color2, alpha2) {
  if (cssColor) if (alpha2 != null) return colorToString(cssColor, alpha2);
  else return colorToString(cssColor, `var(--un-${mode2}-opacity, ${colorOpacityToString(cssColor)})`);
  return colorToString(color2, alpha2);
}
function bgGradientColorResolver() {
  return ([, mode2, body], { theme: theme2 }) => {
    const data = parseColor(body, theme2, "backgroundColor");
    if (!data) return;
    const { alpha: alpha2, color: color2, cssColor } = data;
    if (!color2) return;
    const colorString = bgGradientColorValue(mode2, cssColor, color2, alpha2);
    switch (mode2) {
      case "from":
        return {
          "--un-gradient-from-position": "0%",
          "--un-gradient-from": `${colorString} var(--un-gradient-from-position)`,
          "--un-gradient-to-position": "100%",
          "--un-gradient-to": `${bgGradientToValue(cssColor)} var(--un-gradient-to-position)`,
          "--un-gradient-stops": "var(--un-gradient-from), var(--un-gradient-to)"
        };
      case "via":
        return {
          "--un-gradient-via-position": "50%",
          "--un-gradient-to": bgGradientToValue(cssColor),
          "--un-gradient-stops": `var(--un-gradient-from), ${colorString} var(--un-gradient-via-position), var(--un-gradient-to)`
        };
      case "to":
        return {
          "--un-gradient-to-position": "100%",
          "--un-gradient-to": `${colorString} var(--un-gradient-to-position)`
        };
    }
  };
}
function bgGradientPositionResolver() {
  return ([, mode2, body]) => {
    return { [`--un-gradient-${mode2}-position`]: `${Number(h.bracket.cssvar.percent(body)) * 100}%` };
  };
}
const backgroundStyles = [
  [
    /^bg-gradient-(.+)$/,
    ([, d]) => ({ "--un-gradient": h.bracket(d) }),
    { autocomplete: [
      "bg-gradient",
      "bg-gradient-(from|to|via)",
      "bg-gradient-(from|to|via)-$colors",
      "bg-gradient-(from|to|via)-(op|opacity)",
      "bg-gradient-(from|to|via)-(op|opacity)-<percent>"
    ] }
  ],
  [/^(?:bg-gradient-)?stops-(\[.+\])$/, ([, s]) => ({ "--un-gradient-stops": h.bracket(s) })],
  [/^(?:bg-gradient-)?(from)-(.+)$/, bgGradientColorResolver()],
  [/^(?:bg-gradient-)?(via)-(.+)$/, bgGradientColorResolver()],
  [/^(?:bg-gradient-)?(to)-(.+)$/, bgGradientColorResolver()],
  [/^(?:bg-gradient-)?(from|via|to)-op(?:acity)?-?(.+)$/, ([, position2, opacity2]) => ({ [`--un-${position2}-opacity`]: h.bracket.percent(opacity2) })],
  [/^(from|via|to)-([\d.]+)%$/, bgGradientPositionResolver()],
  [
    /^bg-gradient-((?:repeating-)?(?:linear|radial|conic))$/,
    ([, s]) => ({ "background-image": `${s}-gradient(var(--un-gradient, var(--un-gradient-stops, rgb(255 255 255 / 0))))` }),
    { autocomplete: [
      "bg-gradient-repeating",
      "bg-gradient-(linear|radial|conic)",
      "bg-gradient-repeating-(linear|radial|conic)"
    ] }
  ],
  [
    /^bg-gradient-to-([rltb]{1,2})$/,
    ([, d]) => {
      if (d in positionMap) return {
        "--un-gradient-shape": `to ${positionMap[d]} in oklch`,
        "--un-gradient": "var(--un-gradient-shape), var(--un-gradient-stops)",
        "background-image": "linear-gradient(var(--un-gradient))"
      };
    },
    { autocomplete: `bg-gradient-to-(${Object.keys(positionMap).filter((k) => k.length <= 2 && Array.from(k).every((c2) => "rltb".includes(c2))).join("|")})` }
  ],
  [
    /^(?:bg-gradient-)?shape-(.+)$/,
    ([, d]) => {
      const v = d in positionMap ? `to ${positionMap[d]}` : h.bracket(d);
      if (v != null) return {
        "--un-gradient-shape": `${v} in oklch`,
        "--un-gradient": "var(--un-gradient-shape), var(--un-gradient-stops)"
      };
    },
    { autocomplete: [
      "bg-gradient-shape",
      `bg-gradient-shape-(${Object.keys(positionMap).join("|")})`,
      `shape-(${Object.keys(positionMap).join("|")})`
    ] }
  ],
  ["bg-none", { "background-image": "none" }],
  ["box-decoration-slice", { "box-decoration-break": "slice" }],
  ["box-decoration-clone", { "box-decoration-break": "clone" }],
  ...makeGlobalStaticRules("box-decoration", "box-decoration-break"),
  ["bg-auto", { "background-size": "auto" }],
  ["bg-cover", { "background-size": "cover" }],
  ["bg-contain", { "background-size": "contain" }],
  ["bg-fixed", { "background-attachment": "fixed" }],
  ["bg-local", { "background-attachment": "local" }],
  ["bg-scroll", { "background-attachment": "scroll" }],
  ["bg-clip-border", {
    "-webkit-background-clip": "border-box",
    "background-clip": "border-box"
  }],
  ["bg-clip-content", {
    "-webkit-background-clip": "content-box",
    "background-clip": "content-box"
  }],
  ["bg-clip-padding", {
    "-webkit-background-clip": "padding-box",
    "background-clip": "padding-box"
  }],
  ["bg-clip-text", {
    "-webkit-background-clip": "text",
    "background-clip": "text"
  }],
  ...globalKeywords.map((keyword2) => [`bg-clip-${keyword2}`, {
    "-webkit-background-clip": keyword2,
    "background-clip": keyword2
  }]),
  [/^bg-([-\w]{3,})$/, ([, s]) => ({ "background-position": positionMap[s] })],
  ["bg-repeat", { "background-repeat": "repeat" }],
  ["bg-no-repeat", { "background-repeat": "no-repeat" }],
  ["bg-repeat-x", { "background-repeat": "repeat-x" }],
  ["bg-repeat-y", { "background-repeat": "repeat-y" }],
  ["bg-repeat-round", { "background-repeat": "round" }],
  ["bg-repeat-space", { "background-repeat": "space" }],
  ...makeGlobalStaticRules("bg-repeat", "background-repeat"),
  ["bg-origin-border", { "background-origin": "border-box" }],
  ["bg-origin-padding", { "background-origin": "padding-box" }],
  ["bg-origin-content", { "background-origin": "content-box" }],
  ...makeGlobalStaticRules("bg-origin", "background-origin")
];
const listStyles = {
  "disc": "disc",
  "circle": "circle",
  "square": "square",
  "decimal": "decimal",
  "zero-decimal": "decimal-leading-zero",
  "greek": "lower-greek",
  "roman": "lower-roman",
  "upper-roman": "upper-roman",
  "alpha": "lower-alpha",
  "upper-alpha": "upper-alpha",
  "latin": "lower-latin",
  "upper-latin": "upper-latin"
};
const listStyle = [
  [
    /^list-(.+?)(?:-(outside|inside))?$/,
    ([, alias, position2]) => {
      const style = listStyles[alias];
      if (style) {
        if (position2) return {
          "list-style-position": position2,
          "list-style-type": style
        };
        return { "list-style-type": style };
      }
    },
    { autocomplete: [`list-(${Object.keys(listStyles).join("|")})`, `list-(${Object.keys(listStyles).join("|")})-(outside|inside)`] }
  ],
  ["list-outside", { "list-style-position": "outside" }],
  ["list-inside", { "list-style-position": "inside" }],
  ["list-none", { "list-style-type": "none" }],
  [/^list-image-(.+)$/, ([, d]) => {
    if (/^\[url\(.+\)\]$/.test(d)) return { "list-style-image": h.bracket(d) };
  }],
  ["list-image-none", { "list-style-image": "none" }],
  ...makeGlobalStaticRules("list", "list-style-type")
];
const accents = [[
  /^accent-(.+)$/,
  colorResolver("accent-color", "accent", "accentColor"),
  { autocomplete: "accent-$colors" }
], [
  /^accent-op(?:acity)?-?(.+)$/,
  ([, d]) => ({ "--un-accent-opacity": h.bracket.percent(d) }),
  { autocomplete: ["accent-(op|opacity)", "accent-(op|opacity)-<percent>"] }
]];
const carets = [[
  /^caret-(.+)$/,
  colorResolver("caret-color", "caret", "textColor"),
  { autocomplete: "caret-$colors" }
], [
  /^caret-op(?:acity)?-?(.+)$/,
  ([, d]) => ({ "--un-caret-opacity": h.bracket.percent(d) }),
  { autocomplete: ["caret-(op|opacity)", "caret-(op|opacity)-<percent>"] }
]];
const imageRenderings = [
  ["image-render-auto", { "image-rendering": "auto" }],
  ["image-render-edge", { "image-rendering": "crisp-edges" }],
  ["image-render-pixel", [
    ["-ms-interpolation-mode", "nearest-neighbor"],
    ["image-rendering", "-webkit-optimize-contrast"],
    ["image-rendering", "-moz-crisp-edges"],
    ["image-rendering", "-o-pixelated"],
    ["image-rendering", "pixelated"]
  ]]
];
const overscrolls = [
  ["overscroll-auto", { "overscroll-behavior": "auto" }],
  ["overscroll-contain", { "overscroll-behavior": "contain" }],
  ["overscroll-none", { "overscroll-behavior": "none" }],
  ...makeGlobalStaticRules("overscroll", "overscroll-behavior"),
  ["overscroll-x-auto", { "overscroll-behavior-x": "auto" }],
  ["overscroll-x-contain", { "overscroll-behavior-x": "contain" }],
  ["overscroll-x-none", { "overscroll-behavior-x": "none" }],
  ...makeGlobalStaticRules("overscroll-x", "overscroll-behavior-x"),
  ["overscroll-y-auto", { "overscroll-behavior-y": "auto" }],
  ["overscroll-y-contain", { "overscroll-behavior-y": "contain" }],
  ["overscroll-y-none", { "overscroll-behavior-y": "none" }],
  ...makeGlobalStaticRules("overscroll-y", "overscroll-behavior-y")
];
const scrollBehaviors = [
  ["scroll-auto", { "scroll-behavior": "auto" }],
  ["scroll-smooth", { "scroll-behavior": "smooth" }],
  ...makeGlobalStaticRules("scroll", "scroll-behavior")
];
const columns = [
  [
    /^columns-(.+)$/,
    ([, v], { theme: theme2 }) => {
      if (theme2.containers && v in theme2.containers) return { columns: theme2.containers[v] };
      return { columns: h.bracket.numberWithUnit.number.cssvar(v) };
    },
    { autocomplete: ["columns-<num>", "columns-$containers"] }
  ],
  ["columns-auto", { columns: "auto" }],
  ["break-before-auto", { "break-before": "auto" }],
  ["break-before-avoid", { "break-before": "avoid" }],
  ["break-before-all", { "break-before": "all" }],
  ["break-before-avoid-page", { "break-before": "avoid-page" }],
  ["break-before-page", { "break-before": "page" }],
  ["break-before-left", { "break-before": "left" }],
  ["break-before-right", { "break-before": "right" }],
  ["break-before-column", { "break-before": "column" }],
  ...makeGlobalStaticRules("break-before"),
  ["break-inside-auto", { "break-inside": "auto" }],
  ["break-inside-avoid", { "break-inside": "avoid" }],
  ["break-inside-avoid-page", { "break-inside": "avoid-page" }],
  ["break-inside-avoid-column", { "break-inside": "avoid-column" }],
  ...makeGlobalStaticRules("break-inside"),
  ["break-after-auto", { "break-after": "auto" }],
  ["break-after-avoid", { "break-after": "avoid" }],
  ["break-after-all", { "break-after": "all" }],
  ["break-after-avoid-page", { "break-after": "avoid-page" }],
  ["break-after-page", { "break-after": "page" }],
  ["break-after-left", { "break-after": "left" }],
  ["break-after-right", { "break-after": "right" }],
  ["break-after-column", { "break-after": "column" }],
  ...makeGlobalStaticRules("break-after")
];
const divides = [
  [
    /^divide-?([xy])$/,
    handlerDivide,
    { autocomplete: [
      "divide-(x|y|block|inline)",
      "divide-(x|y|block|inline)-reverse",
      "divide-(x|y|block|inline)-$lineWidth"
    ] }
  ],
  [/^divide-?([xy])-?(.+)$/, handlerDivide],
  [/^divide-?([xy])-reverse$/, ([, d]) => ({ [`--un-divide-${d}-reverse`]: 1 })],
  [/^divide-(block|inline)$/, handlerDivide],
  [/^divide-(block|inline)-(.+)$/, handlerDivide],
  [/^divide-(block|inline)-reverse$/, ([, d]) => ({ [`--un-divide-${d}-reverse`]: 1 })],
  [
    /^divide-(.+)$/,
    colorResolver("border-color", "divide", "borderColor"),
    { autocomplete: "divide-$colors" }
  ],
  [
    /^divide-op(?:acity)?-?(.+)$/,
    ([, opacity2]) => ({ "--un-divide-opacity": h.bracket.percent(opacity2) }),
    { autocomplete: ["divide-(op|opacity)", "divide-(op|opacity)-<percent>"] }
  ],
  ...borderStyles.map((style) => [`divide-${style}`, { "border-style": style }])
];
function handlerDivide([, d, s], { theme: theme2 }) {
  let v = theme2.lineWidth?.[s || "DEFAULT"] ?? h.bracket.cssvar.px(s || "1");
  if (v != null) {
    if (v === "0") v = "0px";
    const results = directionMap[d].map((item) => {
      return [`border${item}-width`, item.endsWith("right") || item.endsWith("bottom") ? `calc(${v} * var(--un-divide-${d}-reverse))` : `calc(${v} * calc(1 - var(--un-divide-${d}-reverse)))`];
    });
    if (results) return [[`--un-divide-${d}-reverse`, 0], ...results];
  }
}
const filterBase = {
  "--un-blur": varEmpty,
  "--un-brightness": varEmpty,
  "--un-contrast": varEmpty,
  "--un-drop-shadow": varEmpty,
  "--un-grayscale": varEmpty,
  "--un-hue-rotate": varEmpty,
  "--un-invert": varEmpty,
  "--un-saturate": varEmpty,
  "--un-sepia": varEmpty
};
const filterBaseKeys = Object.keys(filterBase);
const filterMetaCustom = { preflightKeys: filterBaseKeys };
const filterProperty = "var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)";
const backdropFilterBase = {
  "--un-backdrop-blur": varEmpty,
  "--un-backdrop-brightness": varEmpty,
  "--un-backdrop-contrast": varEmpty,
  "--un-backdrop-grayscale": varEmpty,
  "--un-backdrop-hue-rotate": varEmpty,
  "--un-backdrop-invert": varEmpty,
  "--un-backdrop-opacity": varEmpty,
  "--un-backdrop-saturate": varEmpty,
  "--un-backdrop-sepia": varEmpty
};
const backdropFilterBaseKeys = Object.keys(backdropFilterBase);
const backdropMetaCustom = { preflightKeys: backdropFilterBaseKeys };
const backdropFilterProperty = "var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)";
const composeMetaCustom = { preflightKeys: [...filterBaseKeys, ...backdropFilterBaseKeys] };
function percentWithDefault(str) {
  let v = h.bracket.cssvar(str || "");
  if (v != null) return v;
  v = str ? h.percent(str) : "1";
  if (v != null && Number.parseFloat(v) <= 1) return v;
}
function toFilter(varName, resolver) {
  return ([, b2, s], { theme: theme2 }) => {
    const value2 = resolver(s, theme2) ?? (s === "none" ? "0" : "");
    if (value2 !== "") if (b2) return {
      [`--un-${b2}${varName}`]: `${varName}(${value2})`,
      "-webkit-backdrop-filter": backdropFilterProperty,
      "backdrop-filter": backdropFilterProperty
    };
    else return {
      [`--un-${varName}`]: `${varName}(${value2})`,
      filter: filterProperty
    };
  };
}
function dropShadowResolver([, s], { theme: theme2 }) {
  let v = theme2.dropShadow?.[s || "DEFAULT"];
  if (v != null) return {
    "--un-drop-shadow": `drop-shadow(${colorableShadows(v, "--un-drop-shadow-color").join(") drop-shadow(")})`,
    "filter": filterProperty
  };
  v = h.bracket.cssvar(s);
  if (v != null) return {
    "--un-drop-shadow": `drop-shadow(${v})`,
    "filter": filterProperty
  };
}
const filters = [
  [
    /^(?:(backdrop-)|filter-)?blur(?:-(.+))?$/,
    toFilter("blur", (s, theme2) => theme2.blur?.[s || "DEFAULT"] || h.bracket.cssvar.px(s)),
    {
      custom: composeMetaCustom,
      autocomplete: [
        "(backdrop|filter)-blur-$blur",
        "blur-$blur",
        "filter-blur"
      ]
    }
  ],
  [
    /^(?:(backdrop-)|filter-)?brightness-(.+)$/,
    toFilter("brightness", (s) => h.bracket.cssvar.percent(s)),
    {
      custom: composeMetaCustom,
      autocomplete: ["(backdrop|filter)-brightness-<percent>", "brightness-<percent>"]
    }
  ],
  [
    /^(?:(backdrop-)|filter-)?contrast-(.+)$/,
    toFilter("contrast", (s) => h.bracket.cssvar.percent(s)),
    {
      custom: composeMetaCustom,
      autocomplete: ["(backdrop|filter)-contrast-<percent>", "contrast-<percent>"]
    }
  ],
  [
    /^(?:filter-)?drop-shadow(?:-(.+))?$/,
    dropShadowResolver,
    {
      custom: filterMetaCustom,
      autocomplete: [
        "filter-drop",
        "filter-drop-shadow",
        "filter-drop-shadow-color",
        "drop-shadow",
        "drop-shadow-color",
        "filter-drop-shadow-$dropShadow",
        "drop-shadow-$dropShadow",
        "filter-drop-shadow-color-$colors",
        "drop-shadow-color-$colors",
        "filter-drop-shadow-color-(op|opacity)",
        "drop-shadow-color-(op|opacity)",
        "filter-drop-shadow-color-(op|opacity)-<percent>",
        "drop-shadow-color-(op|opacity)-<percent>"
      ]
    }
  ],
  [/^(?:filter-)?drop-shadow-color-(.+)$/, colorResolver("--un-drop-shadow-color", "drop-shadow", "shadowColor")],
  [/^(?:filter-)?drop-shadow-color-op(?:acity)?-?(.+)$/, ([, opacity2]) => ({ "--un-drop-shadow-opacity": h.bracket.percent(opacity2) })],
  [
    /^(?:(backdrop-)|filter-)?grayscale(?:-(.+))?$/,
    toFilter("grayscale", percentWithDefault),
    {
      custom: composeMetaCustom,
      autocomplete: [
        "(backdrop|filter)-grayscale",
        "(backdrop|filter)-grayscale-<percent>",
        "grayscale-<percent>"
      ]
    }
  ],
  [
    /^(?:(backdrop-)|filter-)?hue-rotate-(.+)$/,
    toFilter("hue-rotate", (s) => h.bracket.cssvar.degree(s)),
    { custom: composeMetaCustom }
  ],
  [
    /^(?:(backdrop-)|filter-)?invert(?:-(.+))?$/,
    toFilter("invert", percentWithDefault),
    {
      custom: composeMetaCustom,
      autocomplete: [
        "(backdrop|filter)-invert",
        "(backdrop|filter)-invert-<percent>",
        "invert-<percent>"
      ]
    }
  ],
  [
    /^(backdrop-)op(?:acity)?-(.+)$/,
    toFilter("opacity", (s) => h.bracket.cssvar.percent(s)),
    {
      custom: composeMetaCustom,
      autocomplete: ["backdrop-(op|opacity)", "backdrop-(op|opacity)-<percent>"]
    }
  ],
  [
    /^(?:(backdrop-)|filter-)?saturate-(.+)$/,
    toFilter("saturate", (s) => h.bracket.cssvar.percent(s)),
    {
      custom: composeMetaCustom,
      autocomplete: [
        "(backdrop|filter)-saturate",
        "(backdrop|filter)-saturate-<percent>",
        "saturate-<percent>"
      ]
    }
  ],
  [
    /^(?:(backdrop-)|filter-)?sepia(?:-(.+))?$/,
    toFilter("sepia", percentWithDefault),
    {
      custom: composeMetaCustom,
      autocomplete: [
        "(backdrop|filter)-sepia",
        "(backdrop|filter)-sepia-<percent>",
        "sepia-<percent>"
      ]
    }
  ],
  [
    "filter",
    { filter: filterProperty },
    { custom: filterMetaCustom }
  ],
  [
    "backdrop-filter",
    {
      "-webkit-backdrop-filter": backdropFilterProperty,
      "backdrop-filter": backdropFilterProperty
    },
    { custom: backdropMetaCustom }
  ],
  ["filter-none", { filter: "none" }],
  ["backdrop-filter-none", {
    "-webkit-backdrop-filter": "none",
    "backdrop-filter": "none"
  }],
  ...globalKeywords.map((keyword2) => [`filter-${keyword2}`, { filter: keyword2 }]),
  ...globalKeywords.map((keyword2) => [`backdrop-filter-${keyword2}`, {
    "-webkit-backdrop-filter": keyword2,
    "backdrop-filter": keyword2
  }])
];
const lineClamps = [[
  /^line-clamp-(\d+)$/,
  ([, v]) => ({
    "overflow": "hidden",
    "display": "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": v,
    "line-clamp": v
  }),
  { autocomplete: ["line-clamp", "line-clamp-<num>"] }
], ...["none", ...globalKeywords].map((keyword2) => [`line-clamp-${keyword2}`, {
  "overflow": "visible",
  "display": "block",
  "-webkit-box-orient": "horizontal",
  "-webkit-line-clamp": keyword2,
  "line-clamp": keyword2
}])];
const placeholders = [[
  /^\$ placeholder-(.+)$/,
  colorResolver("color", "placeholder", "accentColor"),
  { autocomplete: "placeholder-$colors" }
], [
  /^\$ placeholder-op(?:acity)?-?(.+)$/,
  ([, opacity2]) => ({ "--un-placeholder-opacity": h.bracket.percent(opacity2) }),
  { autocomplete: ["placeholder-(op|opacity)", "placeholder-(op|opacity)-<percent>"] }
]];
const scrollSnapTypeBase = { "--un-scroll-snap-strictness": "proximity" };
const custom$3 = { preflightKeys: Object.keys(scrollSnapTypeBase) };
const scrolls = [
  [
    /^snap-(x|y)$/,
    ([, d]) => ({ "scroll-snap-type": `${d} var(--un-scroll-snap-strictness)` }),
    {
      custom: custom$3,
      autocomplete: "snap-(x|y|both)"
    }
  ],
  [
    /^snap-both$/,
    () => ({ "scroll-snap-type": "both var(--un-scroll-snap-strictness)" }),
    { custom: custom$3 }
  ],
  ["snap-mandatory", { "--un-scroll-snap-strictness": "mandatory" }],
  ["snap-proximity", { "--un-scroll-snap-strictness": "proximity" }],
  ["snap-none", { "scroll-snap-type": "none" }],
  ["snap-start", { "scroll-snap-align": "start" }],
  ["snap-end", { "scroll-snap-align": "end" }],
  ["snap-center", { "scroll-snap-align": "center" }],
  ["snap-align-none", { "scroll-snap-align": "none" }],
  ["snap-normal", { "scroll-snap-stop": "normal" }],
  ["snap-always", { "scroll-snap-stop": "always" }],
  [
    /^scroll-ma?()-?(.+)$/,
    directionSize("scroll-margin"),
    { autocomplete: [
      "scroll-(m|p|ma|pa|block|inline)",
      "scroll-(m|p|ma|pa|block|inline)-$spacing",
      "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)",
      "scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)-$spacing"
    ] }
  ],
  [/^scroll-m-?([xy])-?(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-?([rltb])-?(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-(block|inline)-(.+)$/, directionSize("scroll-margin")],
  [/^scroll-m-?([bi][se])-?(.+)$/, directionSize("scroll-margin")],
  [/^scroll-pa?()-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([xy])-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([rltb])-?(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-(block|inline)-(.+)$/, directionSize("scroll-padding")],
  [/^scroll-p-?([bi][se])-?(.+)$/, directionSize("scroll-padding")]
];
const spaces = [
  [
    /^space-([xy])-(.+)$/,
    handlerSpace,
    { autocomplete: [
      "space-(x|y|block|inline)",
      "space-(x|y|block|inline)-reverse",
      "space-(x|y|block|inline)-$spacing"
    ] }
  ],
  [/^space-([xy])-reverse$/, ([, d]) => ({ [`--un-space-${d}-reverse`]: 1 })],
  [/^space-(block|inline)-(.+)$/, handlerSpace],
  [/^space-(block|inline)-reverse$/, ([, d]) => ({ [`--un-space-${d}-reverse`]: 1 })]
];
function handlerSpace([, d, s], { theme: theme2 }) {
  let v = theme2.spacing?.[s || "DEFAULT"] ?? h.bracket.cssvar.auto.fraction.rem(s || "1");
  if (v != null) {
    if (v === "0") v = "0px";
    const results = directionMap[d].map((item) => {
      return [`margin${item}`, item.endsWith("right") || item.endsWith("bottom") ? `calc(${v} * var(--un-space-${d}-reverse))` : `calc(${v} * calc(1 - var(--un-space-${d}-reverse)))`];
    });
    if (results) return [[`--un-space-${d}-reverse`, 0], ...results];
  }
}
const textTransforms = [
  ["uppercase", { "text-transform": "uppercase" }],
  ["lowercase", { "text-transform": "lowercase" }],
  ["capitalize", { "text-transform": "capitalize" }],
  ["normal-case", { "text-transform": "none" }]
];
const hyphens = [...[
  "manual",
  "auto",
  "none",
  ...globalKeywords
].map((keyword2) => [`hyphens-${keyword2}`, {
  "-webkit-hyphens": keyword2,
  "-ms-hyphens": keyword2,
  "hyphens": keyword2
}])];
const writingModes = [
  ["write-vertical-right", { "writing-mode": "vertical-rl" }],
  ["write-vertical-left", { "writing-mode": "vertical-lr" }],
  ["write-normal", { "writing-mode": "horizontal-tb" }],
  ...makeGlobalStaticRules("write", "writing-mode")
];
const writingOrientations = [
  ["write-orient-mixed", { "text-orientation": "mixed" }],
  ["write-orient-sideways", { "text-orientation": "sideways" }],
  ["write-orient-upright", { "text-orientation": "upright" }],
  ...makeGlobalStaticRules("write-orient", "text-orientation")
];
const screenReadersAccess = [["sr-only", {
  "position": "absolute",
  "width": "1px",
  "height": "1px",
  "padding": "0",
  "margin": "-1px",
  "overflow": "hidden",
  "clip": "rect(0,0,0,0)",
  "white-space": "nowrap",
  "border-width": 0
}], ["not-sr-only", {
  "position": "static",
  "width": "auto",
  "height": "auto",
  "padding": "0",
  "margin": "0",
  "overflow": "visible",
  "clip": "auto",
  "white-space": "normal"
}]];
const isolations = [
  ["isolate", { isolation: "isolate" }],
  ["isolate-auto", { isolation: "auto" }],
  ["isolation-auto", { isolation: "auto" }]
];
const objectPositions = [
  ["object-cover", { "object-fit": "cover" }],
  ["object-contain", { "object-fit": "contain" }],
  ["object-fill", { "object-fit": "fill" }],
  ["object-scale-down", { "object-fit": "scale-down" }],
  ["object-none", { "object-fit": "none" }],
  [
    /^object-(.+)$/,
    ([, d]) => {
      if (positionMap[d]) return { "object-position": positionMap[d] };
      if (h.bracketOfPosition(d) != null) return { "object-position": h.bracketOfPosition(d).split(" ").map((e) => h.position.fraction.auto.px.cssvar(e) ?? e).join(" ") };
    },
    { autocomplete: `object-(${Object.keys(positionMap).join("|")})` }
  ]
];
const backgroundBlendModes = [
  ["bg-blend-multiply", { "background-blend-mode": "multiply" }],
  ["bg-blend-screen", { "background-blend-mode": "screen" }],
  ["bg-blend-overlay", { "background-blend-mode": "overlay" }],
  ["bg-blend-darken", { "background-blend-mode": "darken" }],
  ["bg-blend-lighten", { "background-blend-mode": "lighten" }],
  ["bg-blend-color-dodge", { "background-blend-mode": "color-dodge" }],
  ["bg-blend-color-burn", { "background-blend-mode": "color-burn" }],
  ["bg-blend-hard-light", { "background-blend-mode": "hard-light" }],
  ["bg-blend-soft-light", { "background-blend-mode": "soft-light" }],
  ["bg-blend-difference", { "background-blend-mode": "difference" }],
  ["bg-blend-exclusion", { "background-blend-mode": "exclusion" }],
  ["bg-blend-hue", { "background-blend-mode": "hue" }],
  ["bg-blend-saturation", { "background-blend-mode": "saturation" }],
  ["bg-blend-color", { "background-blend-mode": "color" }],
  ["bg-blend-luminosity", { "background-blend-mode": "luminosity" }],
  ["bg-blend-normal", { "background-blend-mode": "normal" }],
  ...makeGlobalStaticRules("bg-blend", "background-blend")
];
const mixBlendModes = [
  ["mix-blend-multiply", { "mix-blend-mode": "multiply" }],
  ["mix-blend-screen", { "mix-blend-mode": "screen" }],
  ["mix-blend-overlay", { "mix-blend-mode": "overlay" }],
  ["mix-blend-darken", { "mix-blend-mode": "darken" }],
  ["mix-blend-lighten", { "mix-blend-mode": "lighten" }],
  ["mix-blend-color-dodge", { "mix-blend-mode": "color-dodge" }],
  ["mix-blend-color-burn", { "mix-blend-mode": "color-burn" }],
  ["mix-blend-hard-light", { "mix-blend-mode": "hard-light" }],
  ["mix-blend-soft-light", { "mix-blend-mode": "soft-light" }],
  ["mix-blend-difference", { "mix-blend-mode": "difference" }],
  ["mix-blend-exclusion", { "mix-blend-mode": "exclusion" }],
  ["mix-blend-hue", { "mix-blend-mode": "hue" }],
  ["mix-blend-saturation", { "mix-blend-mode": "saturation" }],
  ["mix-blend-color", { "mix-blend-mode": "color" }],
  ["mix-blend-luminosity", { "mix-blend-mode": "luminosity" }],
  ["mix-blend-plus-lighter", { "mix-blend-mode": "plus-lighter" }],
  ["mix-blend-normal", { "mix-blend-mode": "normal" }],
  ...makeGlobalStaticRules("mix-blend")
];
const dynamicViewportHeight = [
  ["min-h-dvh", { "min-height": "100dvh" }],
  ["min-h-svh", { "min-height": "100svh" }],
  ["min-h-lvh", { "min-height": "100lvh" }],
  ["h-dvh", { height: "100dvh" }],
  ["h-svh", { height: "100svh" }],
  ["h-lvh", { height: "100lvh" }],
  ["max-h-dvh", { "max-height": "100dvh" }],
  ["max-h-svh", { "max-height": "100svh" }],
  ["max-h-lvh", { "max-height": "100lvh" }]
];
const borderSpacingBase = {
  "--un-border-spacing-x": 0,
  "--un-border-spacing-y": 0
};
const custom$2 = { preflightKeys: Object.keys(borderSpacingBase) };
const borderSpacingProperty = "var(--un-border-spacing-x) var(--un-border-spacing-y)";
const tables = [
  ["inline-table", { display: "inline-table" }],
  ["table", { display: "table" }],
  ["table-caption", { display: "table-caption" }],
  ["table-cell", { display: "table-cell" }],
  ["table-column", { display: "table-column" }],
  ["table-column-group", { display: "table-column-group" }],
  ["table-footer-group", { display: "table-footer-group" }],
  ["table-header-group", { display: "table-header-group" }],
  ["table-row", { display: "table-row" }],
  ["table-row-group", { display: "table-row-group" }],
  ["border-collapse", { "border-collapse": "collapse" }],
  ["border-separate", { "border-collapse": "separate" }],
  [
    /^border-spacing-(.+)$/,
    ([, s], { theme: theme2 }) => {
      const v = theme2.spacing?.[s] ?? h.bracket.cssvar.global.auto.fraction.rem(s);
      if (v != null) return {
        "--un-border-spacing-x": v,
        "--un-border-spacing-y": v,
        "border-spacing": borderSpacingProperty
      };
    },
    {
      custom: custom$2,
      autocomplete: ["border-spacing", "border-spacing-$spacing"]
    }
  ],
  [
    /^border-spacing-([xy])-(.+)$/,
    ([, d, s], { theme: theme2 }) => {
      const v = theme2.spacing?.[s] ?? h.bracket.cssvar.global.auto.fraction.rem(s);
      if (v != null) return {
        [`--un-border-spacing-${d}`]: v,
        "border-spacing": borderSpacingProperty
      };
    },
    {
      custom: custom$2,
      autocomplete: ["border-spacing-(x|y)", "border-spacing-(x|y)-$spacing"]
    }
  ],
  ["caption-top", { "caption-side": "top" }],
  ["caption-bottom", { "caption-side": "bottom" }],
  ["table-auto", { "table-layout": "auto" }],
  ["table-fixed", { "table-layout": "fixed" }],
  ["table-empty-cells-visible", { "empty-cells": "show" }],
  ["table-empty-cells-hidden", { "empty-cells": "hide" }]
];
const touchActionBase = {
  "--un-pan-x": varEmpty,
  "--un-pan-y": varEmpty,
  "--un-pinch-zoom": varEmpty
};
const custom$1 = { preflightKeys: Object.keys(touchActionBase) };
const touchActionProperty = "var(--un-pan-x) var(--un-pan-y) var(--un-pinch-zoom)";
const touchActions = [
  [
    /^touch-pan-(x|left|right)$/,
    ([, d]) => ({
      "--un-pan-x": `pan-${d}`,
      "touch-action": touchActionProperty
    }),
    {
      custom: custom$1,
      autocomplete: ["touch-pan", "touch-pan-(x|left|right|y|up|down)"]
    }
  ],
  [
    /^touch-pan-(y|up|down)$/,
    ([, d]) => ({
      "--un-pan-y": `pan-${d}`,
      "touch-action": touchActionProperty
    }),
    { custom: custom$1 }
  ],
  [
    "touch-pinch-zoom",
    {
      "--un-pinch-zoom": "pinch-zoom",
      "touch-action": touchActionProperty
    },
    { custom: custom$1 }
  ],
  ["touch-auto", { "touch-action": "auto" }],
  ["touch-manipulation", { "touch-action": "manipulation" }],
  ["touch-none", { "touch-action": "none" }],
  ...makeGlobalStaticRules("touch", "touch-action")
];
const fontVariantNumericBase = {
  "--un-ordinal": varEmpty,
  "--un-slashed-zero": varEmpty,
  "--un-numeric-figure": varEmpty,
  "--un-numeric-spacing": varEmpty,
  "--un-numeric-fraction": varEmpty
};
const custom = { preflightKeys: Object.keys(fontVariantNumericBase) };
function toEntries(entry) {
  return {
    ...entry,
    "font-variant-numeric": "var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)"
  };
}
const fontVariantNumeric = [
  [
    /^ordinal$/,
    () => toEntries({ "--un-ordinal": "ordinal" }),
    {
      custom,
      autocomplete: "ordinal"
    }
  ],
  [
    /^slashed-zero$/,
    () => toEntries({ "--un-slashed-zero": "slashed-zero" }),
    {
      custom,
      autocomplete: "slashed-zero"
    }
  ],
  [
    /^lining-nums$/,
    () => toEntries({ "--un-numeric-figure": "lining-nums" }),
    {
      custom,
      autocomplete: "lining-nums"
    }
  ],
  [
    /^oldstyle-nums$/,
    () => toEntries({ "--un-numeric-figure": "oldstyle-nums" }),
    {
      custom,
      autocomplete: "oldstyle-nums"
    }
  ],
  [
    /^proportional-nums$/,
    () => toEntries({ "--un-numeric-spacing": "proportional-nums" }),
    {
      custom,
      autocomplete: "proportional-nums"
    }
  ],
  [
    /^tabular-nums$/,
    () => toEntries({ "--un-numeric-spacing": "tabular-nums" }),
    {
      custom,
      autocomplete: "tabular-nums"
    }
  ],
  [
    /^diagonal-fractions$/,
    () => toEntries({ "--un-numeric-fraction": "diagonal-fractions" }),
    {
      custom,
      autocomplete: "diagonal-fractions"
    }
  ],
  [
    /^stacked-fractions$/,
    () => toEntries({ "--un-numeric-fraction": "stacked-fractions" }),
    {
      custom,
      autocomplete: "stacked-fractions"
    }
  ],
  ["normal-nums", { "font-variant-numeric": "normal" }]
];
const variablesAbbrMap = {
  "bg-blend": "background-blend-mode",
  "bg-clip": "-webkit-background-clip",
  "bg-gradient": "linear-gradient",
  "bg-image": "background-image",
  "bg-origin": "background-origin",
  "bg-position": "background-position",
  "bg-repeat": "background-repeat",
  "bg-size": "background-size",
  "mix-blend": "mix-blend-mode",
  "object": "object-fit",
  "object-position": "object-position",
  "write": "writing-mode",
  "write-orient": "text-orientation"
};
const cssVariables = [[/^(.+?)-(\$.+)$/, ([, name2, varname]) => {
  const prop = variablesAbbrMap[name2];
  if (prop) return { [prop]: h.cssvar(varname) };
}]];
const viewTransition = [[/^view-transition-([\w-]+)$/, ([, name2]) => {
  return { "view-transition-name": name2 };
}]];
const rules = [
  cssVariables$1,
  cssVariables,
  cssProperty,
  container$1,
  contains,
  screenReadersAccess,
  pointerEvents,
  appearances,
  positions,
  insets,
  lineClamps,
  isolations,
  zIndexes,
  orders,
  grids,
  floats,
  margins,
  boxSizing,
  displays,
  aspectRatio,
  sizes,
  flex$1,
  tables,
  transforms,
  animations,
  cursors,
  touchActions,
  userSelects,
  resizes,
  scrolls,
  listStyle,
  appearance,
  columns,
  placements,
  alignments,
  justifies,
  gaps,
  flexGridJustifiesAlignments,
  spaces,
  divides,
  overflows,
  overscrolls,
  scrollBehaviors,
  textOverflows,
  whitespaces,
  breaks,
  borders,
  bgColors,
  backgroundStyles,
  colorScheme,
  svgUtilities,
  objectPositions,
  paddings,
  textAligns,
  textIndents,
  textWraps,
  verticalAligns,
  fonts,
  textTransforms$1,
  textTransforms,
  fontStyles,
  fontVariantNumeric,
  textDecorations,
  fontSmoothings,
  tabSizes,
  textStrokes,
  textShadows,
  hyphens,
  writingModes,
  writingOrientations,
  carets,
  accents,
  opacity,
  backgroundBlendModes,
  mixBlendModes,
  boxShadows,
  outline,
  rings,
  imageRenderings,
  filters,
  transitions,
  willChange,
  contentVisibility,
  contents,
  placeholders,
  containerParent,
  viewTransition,
  dynamicViewportHeight,
  fieldSizing,
  questionMark
].flat(1);
const shortcuts = [...containerShortcuts];
const theme = {
  ...theme$1,
  aria: {
    busy: 'busy="true"',
    checked: 'checked="true"',
    disabled: 'disabled="true"',
    expanded: 'expanded="true"',
    hidden: 'hidden="true"',
    pressed: 'pressed="true"',
    readonly: 'readonly="true"',
    required: 'required="true"',
    selected: 'selected="true"'
  },
  animation: {
    keyframes: {
      "pulse": "{0%, 100% {opacity:1} 50% {opacity:.5}}",
      "bounce": "{0%, 100% {transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)} 50% {transform:translateY(0);animation-timing-function:cubic-bezier(0,0,0.2,1)}}",
      "spin": "{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
      "ping": "{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}",
      "bounce-alt": "{from,20%,53%,80%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0)}40%,43%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-30px,0)}70%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}",
      "flash": "{from,50%,to{opacity:1}25%,75%{opacity:0}}",
      "pulse-alt": "{from{transform:scale3d(1,1,1)}50%{transform:scale3d(1.05,1.05,1.05)}to{transform:scale3d(1,1,1)}}",
      "rubber-band": "{from{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,0.75,1)}40%{transform:scale3d(0.75,1.25,1)}50%{transform:scale3d(1.15,0.85,1)}65%{transform:scale3d(0.95,1.05,1)}75%{transform:scale3d(1.05,0.95,1)}to{transform:scale3d(1,1,1)}}",
      "shake-x": "{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}",
      "shake-y": "{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}20%,40%,60%,80%{transform:translate3d(0,10px,0)}}",
      "head-shake": "{0%{transform:translateX(0)}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}50%{transform:translateX(0)}}",
      "swing": "{20%{transform:rotate3d(0,0,1,15deg)}40%{transform:rotate3d(0,0,1,-10deg)}60%{transform:rotate3d(0,0,1,5deg)}80%{transform:rotate3d(0,0,1,-5deg)}to{transform:rotate3d(0,0,1,0deg)}}",
      "tada": "{from{transform:scale3d(1,1,1)}10%,20%{transform:scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}to{transform:scale3d(1,1,1)}}",
      "wobble": "{from{transform:translate3d(0,0,0)}15%{transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}to{transform:translate3d(0,0,0)}}",
      "jello": "{from,11.1%,to{transform:translate3d(0,0,0)}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg)skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}",
      "heart-beat": "{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}",
      "hinge": "{0%{transform-origin:top left;animation-timing-function:ease-in-out}20%,60%{transform:rotate3d(0,0,1,80deg);transform-origin:top left;animation-timing-function:ease-in-out}40%,80%{transform:rotate3d(0,0,1,60deg);transform-origin:top left;animation-timing-function:ease-in-out}to{transform:translate3d(0,700px,0);opacity:0}}",
      "jack-in-the-box": "{from{opacity:0;transform-origin:center bottom;transform:scale(0.1) rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{transform:scale(1)}}",
      "light-speed-in-left": "{from{opacity:0;transform:translate3d(-100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}",
      "light-speed-in-right": "{from{opacity:0;transform:translate3d(100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}",
      "light-speed-out-left": "{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0) skewX(30deg)}}",
      "light-speed-out-right": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) skewX(30deg)}}",
      "flip": "{from{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,-360deg);animation-timing-function:ease-out}40%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);animation-timing-function:ease-out}50%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(0.95,0.95,0.95) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}to{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}}",
      "flip-in-x": "{from{transform:perspective(400px) rotate3d(1,0,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(1,0,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(1,0,0,-5deg)}to{transform:perspective(400px)}}",
      "flip-in-y": "{from{transform:perspective(400px) rotate3d(0,1,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(0,1,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(0,1,0,-5deg)}to{transform:perspective(400px)}}",
      "flip-out-x": "{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}to{transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}",
      "flip-out-y": "{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}to{transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}",
      "rotate-in": "{from{transform-origin:center;transform:rotate3d(0,0,1,-200deg);opacity:0}to{transform-origin:center;transform:translate3d(0,0,0);opacity:1}}",
      "rotate-in-down-left": "{from{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}to{transform-origin:left bottom;transform:translate3d(0,0,0);opacity:1}}",
      "rotate-in-down-right": "{from{transform-origin:right bottom;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}",
      "rotate-in-up-left": "{from{transform-origin:left top;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:left top;transform:translate3d(0,0,0);opacity:1}}",
      "rotate-in-up-right": "{from{transform-origin:right bottom;transform:rotate3d(0,0,1,-90deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}",
      "rotate-out": "{from{transform-origin:center;opacity:1}to{transform-origin:center;transform:rotate3d(0,0,1,200deg);opacity:0}}",
      "rotate-out-down-left": "{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,45deg);opacity:0}}",
      "rotate-out-down-right": "{from{transform-origin:right bottom;opacity:1}to{transform-origin:right bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}",
      "rotate-out-up-left": "{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}",
      "rotate-out-up-right": "{from{transform-origin:right bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,90deg);opacity:0}}",
      "roll-in": "{from{opacity:0;transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "roll-out": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}",
      "zoom-in": "{from{opacity:0;transform:scale3d(0.3,0.3,0.3)}50%{opacity:1}}",
      "zoom-in-down": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "zoom-in-left": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(-1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "zoom-in-right": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "zoom-in-up": "{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "zoom-out": "{from{opacity:1}50%{opacity:0;transform:scale3d(0.3,0.3,0.3)}to{opacity:0}}",
      "zoom-out-down": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "zoom-out-left": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(-2000px,0,0);transform-origin:left center}}",
      "zoom-out-right": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(2000px,0,0);transform-origin:right center}}",
      "zoom-out-up": "{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}",
      "bounce-in": "{from,20%,40%,60%,80%,to{animation-timing-function:ease-in-out}0%{opacity:0;transform:scale3d(0.3,0.3,0.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(0.9,0.9,0.9)}60%{transform:scale3d(1.03,1.03,1.03);opacity:1}80%{transform:scale3d(0.97,0.97,0.97)}to{opacity:1;transform:scale3d(1,1,1)}}",
      "bounce-in-down": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:translate3d(0,0,0)}}",
      "bounce-in-left": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:translate3d(0,0,0)}}",
      "bounce-in-right": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:translate3d(0,0,0)}}",
      "bounce-in-up": "{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translate3d(0,0,0)}}",
      "bounce-out": "{20%{transform:scale3d(0.9,0.9,0.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(0.3,0.3,0.3)}}",
      "bounce-out-down": "{20%{transform:translate3d(0,10px,0)}40%,45%{opacity:1;transform:translate3d(0,-20px,0)}to{opacity:0;transform:translate3d(0,2000px,0)}}",
      "bounce-out-left": "{20%{opacity:1;transform:translate3d(20px,0,0)}to{opacity:0;transform:translate3d(-2000px,0,0)}}",
      "bounce-out-right": "{20%{opacity:1;transform:translate3d(-20px,0,0)}to{opacity:0;transform:translate3d(2000px,0,0)}}",
      "bounce-out-up": "{20%{transform:translate3d(0,-10px,0)}40%,45%{opacity:1;transform:translate3d(0,20px,0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}",
      "slide-in-down": "{from{transform:translate3d(0,-100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
      "slide-in-left": "{from{transform:translate3d(-100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
      "slide-in-right": "{from{transform:translate3d(100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
      "slide-in-up": "{from{transform:translate3d(0,100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}",
      "slide-out-down": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,100%,0)}}",
      "slide-out-left": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(-100%,0,0)}}",
      "slide-out-right": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(100%,0,0)}}",
      "slide-out-up": "{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,-100%,0)}}",
      "fade-in": "{from{opacity:0}to{opacity:1}}",
      "fade-in-down": "{from{opacity:0;transform:translate3d(0,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-down-big": "{from{opacity:0;transform:translate3d(0,-2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-left": "{from{opacity:0;transform:translate3d(-100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-left-big": "{from{opacity:0;transform:translate3d(-2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-right": "{from{opacity:0;transform:translate3d(100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-right-big": "{from{opacity:0;transform:translate3d(2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-up": "{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-up-big": "{from{opacity:0;transform:translate3d(0,2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-top-left": "{from{opacity:0;transform:translate3d(-100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-top-right": "{from{opacity:0;transform:translate3d(100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-bottom-left": "{from{opacity:0;transform:translate3d(-100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-in-bottom-right": "{from{opacity:0;transform:translate3d(100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
      "fade-out": "{from{opacity:1}to{opacity:0}}",
      "fade-out-down": "{from{opacity:1}to{opacity:0;transform:translate3d(0,100%,0)}}",
      "fade-out-down-big": "{from{opacity:1}to{opacity:0;transform:translate3d(0,2000px,0)}}",
      "fade-out-left": "{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0)}}",
      "fade-out-left-big": "{from{opacity:1}to{opacity:0;transform:translate3d(-2000px,0,0)}}",
      "fade-out-right": "{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0)}}",
      "fade-out-right-big": "{from{opacity:1}to{opacity:0;transform:translate3d(2000px,0,0)}}",
      "fade-out-up": "{from{opacity:1}to{opacity:0;transform:translate3d(0,-100%,0)}}",
      "fade-out-up-big": "{from{opacity:1}to{opacity:0;transform:translate3d(0,-2000px,0)}}",
      "fade-out-top-left": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,-100%,0)}}",
      "fade-out-top-right": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,-100%,0)}}",
      "fade-out-bottom-left": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,100%,0)}}",
      "fade-out-bottom-right": "{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,100%,0)}}",
      "back-in-up": "{0%{opacity:0.7;transform:translateY(1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
      "back-in-down": "{0%{opacity:0.7;transform:translateY(-1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
      "back-in-right": "{0%{opacity:0.7;transform:translateX(2000px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
      "back-in-left": "{0%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}80%{opacity:0.7;transform:translateX(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}",
      "back-out-up": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}",
      "back-out-down": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(700px) scale(0.7)}}",
      "back-out-right": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateX(2000px) scale(0.7)}}",
      "back-out-left": "{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}"
    },
    durations: {
      "pulse": "2s",
      "heart-beat": "1.3s",
      "bounce-in": "0.75s",
      "bounce-out": "0.75s",
      "flip-out-x": "0.75s",
      "flip-out-y": "0.75s",
      "hinge": "2s"
    },
    timingFns: {
      "pulse": "cubic-bezier(0.4,0,.6,1)",
      "ping": "cubic-bezier(0,0,.2,1)",
      "head-shake": "ease-in-out",
      "heart-beat": "ease-in-out",
      "pulse-alt": "ease-in-out",
      "light-speed-in-left": "ease-out",
      "light-speed-in-right": "ease-out",
      "light-speed-out-left": "ease-in",
      "light-speed-out-right": "ease-in"
    },
    properties: {
      "bounce-alt": { "transform-origin": "center bottom" },
      "jello": { "transform-origin": "center" },
      "swing": { "transform-origin": "top center" },
      "flip": { "backface-visibility": "visible" },
      "flip-in-x": { "backface-visibility": "visible !important" },
      "flip-in-y": { "backface-visibility": "visible !important" },
      "flip-out-x": { "backface-visibility": "visible !important" },
      "flip-out-y": { "backface-visibility": "visible !important" },
      "rotate-in": { "transform-origin": "center" },
      "rotate-in-down-left": { "transform-origin": "left bottom" },
      "rotate-in-down-right": { "transform-origin": "right bottom" },
      "rotate-in-up-left": { "transform-origin": "left bottom" },
      "rotate-in-up-right": { "transform-origin": "right bottom" },
      "rotate-out": { "transform-origin": "center" },
      "rotate-out-down-left": { "transform-origin": "left bottom" },
      "rotate-out-down-right": { "transform-origin": "right bottom" },
      "rotate-out-up-left": { "transform-origin": "left bottom" },
      "rotate-out-up-right": { "transform-origin": "right bottom" },
      "hinge": { "transform-origin": "top left" },
      "zoom-out-down": { "transform-origin": "center bottom" },
      "zoom-out-left": { "transform-origin": "left center" },
      "zoom-out-right": { "transform-origin": "right center" },
      "zoom-out-up": { "transform-origin": "center bottom" }
    },
    counts: {
      "spin": "infinite",
      "ping": "infinite",
      "pulse": "infinite",
      "pulse-alt": "infinite",
      "bounce": "infinite",
      "bounce-alt": "infinite"
    },
    category: {
      "pulse": "Attention Seekers",
      "bounce": "Attention Seekers",
      "spin": "Attention Seekers",
      "ping": "Attention Seekers",
      "bounce-alt": "Attention Seekers",
      "flash": "Attention Seekers",
      "pulse-alt": "Attention Seekers",
      "rubber-band": "Attention Seekers",
      "shake-x": "Attention Seekers",
      "shake-y": "Attention Seekers",
      "head-shake": "Attention Seekers",
      "swing": "Attention Seekers",
      "tada": "Attention Seekers",
      "wobble": "Attention Seekers",
      "jello": "Attention Seekers",
      "heart-beat": "Attention Seekers",
      "hinge": "Specials",
      "jack-in-the-box": "Specials",
      "light-speed-in-left": "Lightspeed",
      "light-speed-in-right": "Lightspeed",
      "light-speed-out-left": "Lightspeed",
      "light-speed-out-right": "Lightspeed",
      "flip": "Flippers",
      "flip-in-x": "Flippers",
      "flip-in-y": "Flippers",
      "flip-out-x": "Flippers",
      "flip-out-y": "Flippers",
      "rotate-in": "Rotating Entrances",
      "rotate-in-down-left": "Rotating Entrances",
      "rotate-in-down-right": "Rotating Entrances",
      "rotate-in-up-left": "Rotating Entrances",
      "rotate-in-up-right": "Rotating Entrances",
      "rotate-out": "Rotating Exits",
      "rotate-out-down-left": "Rotating Exits",
      "rotate-out-down-right": "Rotating Exits",
      "rotate-out-up-left": "Rotating Exits",
      "rotate-out-up-right": "Rotating Exits",
      "roll-in": "Specials",
      "roll-out": "Specials",
      "zoom-in": "Zooming Entrances",
      "zoom-in-down": "Zooming Entrances",
      "zoom-in-left": "Zooming Entrances",
      "zoom-in-right": "Zooming Entrances",
      "zoom-in-up": "Zooming Entrances",
      "zoom-out": "Zooming Exits",
      "zoom-out-down": "Zooming Exits",
      "zoom-out-left": "Zooming Exits",
      "zoom-out-right": "Zooming Exits",
      "zoom-out-up": "Zooming Exits",
      "bounce-in": "Bouncing Entrances",
      "bounce-in-down": "Bouncing Entrances",
      "bounce-in-left": "Bouncing Entrances",
      "bounce-in-right": "Bouncing Entrances",
      "bounce-in-up": "Bouncing Entrances",
      "bounce-out": "Bouncing Exits",
      "bounce-out-down": "Bouncing Exits",
      "bounce-out-left": "Bouncing Exits",
      "bounce-out-right": "Bouncing Exits",
      "bounce-out-up": "Bouncing Exits",
      "slide-in-down": "Sliding Entrances",
      "slide-in-left": "Sliding Entrances",
      "slide-in-right": "Sliding Entrances",
      "slide-in-up": "Sliding Entrances",
      "slide-out-down": "Sliding Exits",
      "slide-out-left": "Sliding Exits",
      "slide-out-right": "Sliding Exits",
      "slide-out-up": "Sliding Exits",
      "fade-in": "Fading Entrances",
      "fade-in-down": "Fading Entrances",
      "fade-in-down-big": "Fading Entrances",
      "fade-in-left": "Fading Entrances",
      "fade-in-left-big": "Fading Entrances",
      "fade-in-right": "Fading Entrances",
      "fade-in-right-big": "Fading Entrances",
      "fade-in-up": "Fading Entrances",
      "fade-in-up-big": "Fading Entrances",
      "fade-in-top-left": "Fading Entrances",
      "fade-in-top-right": "Fading Entrances",
      "fade-in-bottom-left": "Fading Entrances",
      "fade-in-bottom-right": "Fading Entrances",
      "fade-out": "Fading Exits",
      "fade-out-down": "Fading Exits",
      "fade-out-down-big": "Fading Exits",
      "fade-out-left": "Fading Exits",
      "fade-out-left-big": "Fading Exits",
      "fade-out-right": "Fading Exits",
      "fade-out-right-big": "Fading Exits",
      "fade-out-up": "Fading Exits",
      "fade-out-up-big": "Fading Exits",
      "fade-out-top-left": "Fading Exits",
      "fade-out-top-right": "Fading Exits",
      "fade-out-bottom-left": "Fading Exits",
      "fade-out-bottom-right": "Fading Exits",
      "back-in-up": "Back Entrances",
      "back-in-down": "Back Entrances",
      "back-in-right": "Back Entrances",
      "back-in-left": "Back Entrances",
      "back-out-up": "Back Exits",
      "back-out-down": "Back Exits",
      "back-out-right": "Back Exits",
      "back-out-left": "Back Exits"
    }
  },
  media: {
    portrait: "(orientation: portrait)",
    landscape: "(orientation: landscape)",
    os_dark: "(prefers-color-scheme: dark)",
    os_light: "(prefers-color-scheme: light)",
    motion_ok: "(prefers-reduced-motion: no-preference)",
    motion_not_ok: "(prefers-reduced-motion: reduce)",
    high_contrast: "(prefers-contrast: high)",
    low_contrast: "(prefers-contrast: low)",
    opacity_ok: "(prefers-reduced-transparency: no-preference)",
    opacity_not_ok: "(prefers-reduced-transparency: reduce)",
    use_data_ok: "(prefers-reduced-data: no-preference)",
    use_data_not_ok: "(prefers-reduced-data: reduce)",
    touch: "(hover: none) and (pointer: coarse)",
    stylus: "(hover: none) and (pointer: fine)",
    pointer: "(hover) and (pointer: coarse)",
    mouse: "(hover) and (pointer: fine)",
    hd_color: "(dynamic-range: high)"
  },
  supports: { grid: "(display: grid)" },
  preflightBase: {
    ...transformBase,
    ...touchActionBase,
    ...scrollSnapTypeBase,
    ...fontVariantNumericBase,
    ...borderSpacingBase,
    ...boxShadowsBase,
    ...ringBase,
    ...filterBase,
    ...backdropFilterBase
  }
};
const variantCombinators = [variantMatcher("svg", (input) => ({ selector: `${input.selector} svg` }))];
const variantColorsScheme = [
  variantMatcher(".dark", (input) => ({ prefix: `.dark $$ ${input.prefix}` })),
  variantMatcher(".light", (input) => ({ prefix: `.light $$ ${input.prefix}` })),
  variantParentMatcher("@dark", "@media (prefers-color-scheme: dark)"),
  variantParentMatcher("@light", "@media (prefers-color-scheme: light)")
];
const variantContrasts = [variantParentMatcher("contrast-more", "@media (prefers-contrast: more)"), variantParentMatcher("contrast-less", "@media (prefers-contrast: less)")];
const variantMotions = [variantParentMatcher("motion-reduce", "@media (prefers-reduced-motion: reduce)"), variantParentMatcher("motion-safe", "@media (prefers-reduced-motion: no-preference)")];
const variantOrientations = [variantParentMatcher("landscape", "@media (orientation: landscape)"), variantParentMatcher("portrait", "@media (orientation: portrait)")];
const variantSpaceAndDivide = (matcher) => {
  if (matcher.startsWith("_")) return;
  if (/space-[xy]-.+$/.test(matcher) || /divide-/.test(matcher)) return {
    matcher,
    selector: (input) => {
      const not = ">:not([hidden])~:not([hidden])";
      return input.includes(not) ? input : `${input}${not}`;
    }
  };
};
const variantStickyHover = [variantMatcher("@hover", (input) => ({
  parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (hover: hover) and (pointer: fine)`,
  selector: `${input.selector || ""}:hover`
}))];
function mixComponent(v1, v2, w) {
  return `calc(${v2} + (${v1} - ${v2}) * ${w} / 100)`;
}
function mixColor(color1, color2, weight) {
  const colors2 = [color1, color2];
  const cssColors = [];
  for (let c2 = 0; c2 < 2; c2++) {
    const color3 = typeof colors2[c2] === "string" ? parseCssColor(colors2[c2]) : colors2[c2];
    if (!color3 || !["rgb", "rgba"].includes(color3.type)) return;
    cssColors.push(color3);
  }
  const newComponents = [];
  for (let x = 0; x < 3; x++) newComponents.push(mixComponent(cssColors[0].components[x], cssColors[1].components[x], weight));
  return {
    type: "rgb",
    components: newComponents,
    alpha: mixComponent(cssColors[0].alpha ?? 1, cssColors[1].alpha ?? 1, weight)
  };
}
function tint(color2, weight) {
  return mixColor("#fff", color2, weight);
}
function shade(color2, weight) {
  return mixColor("#000", color2, weight);
}
function shift(color2, weight) {
  const num = Number.parseFloat(`${weight}`);
  if (!Number.isNaN(num)) return num > 0 ? shade(color2, weight) : tint(color2, -num);
}
const fns = {
  tint,
  shade,
  shift
};
function variantColorMix() {
  let re;
  return {
    name: "mix",
    match(matcher, ctx) {
      if (!re) re = new RegExp(`^mix-(tint|shade|shift)-(-?\\d{1,3})(?:${ctx.generator.config.separators.join("|")})`);
      const m = matcher.match(re);
      if (m) return {
        matcher: matcher.slice(m[0].length),
        body: (body) => {
          body.forEach((v) => {
            if (v[1]) {
              const color2 = parseCssColor(`${v[1]}`);
              if (color2) {
                const mixed = fns[m[1]](color2, m[2]);
                if (mixed) v[1] = colorToString(mixed);
              }
            }
          });
          return body;
        }
      };
    }
  };
}
const placeholderModifier = (input, { theme: theme2 }) => {
  const m = input.match(/^(.*)\b(placeholder-)(.+)$/);
  if (m) {
    const [, pre = "", p, body] = m;
    if (hasParseableColor(body, theme2, "accentColor") || hasOpacityValue(body)) return { matcher: `${pre}placeholder-$ ${p}${body}` };
  }
};
function hasOpacityValue(body) {
  const match = body.match(/^op(?:acity)?-?(.+)$/);
  if (match && match[1] != null) return h.bracket.percent(match[1]) != null;
  return false;
}
function variants(options) {
  return [
    placeholderModifier,
    variantSpaceAndDivide,
    ...variants$1(options),
    ...variantContrasts,
    ...variantOrientations,
    ...variantMotions,
    ...variantCombinators,
    ...variantColorsScheme,
    ...variantStickyHover,
    variantColorMix()
  ];
}
function important(option) {
  if (option == null || option === false) return [];
  const wrapWithIs = (selector2) => {
    if (selector2.startsWith(":is(") && selector2.endsWith(")")) return selector2;
    if (selector2.includes("::")) return selector2.replace(/(.*?)((?:\s\*)?::.*)/, ":is($1)$2");
    return `:is(${selector2})`;
  };
  return [option === true ? (util2) => {
    util2.entries.forEach((i) => {
      if (i[1] != null && !String(i[1]).endsWith("!important")) i[1] += " !important";
    });
  } : (util2) => {
    if (!util2.selector.startsWith(option)) util2.selector = `${option} ${wrapWithIs(util2.selector)}`;
  }];
}
function postprocessors(options) {
  return [...toArray(presetMini(options).postprocess), ...important(options.important)];
}
const presetWind3 = definePreset((options = {}) => {
  options.important = options.important ?? false;
  return {
    ...presetMini(options),
    name: "@unocss/preset-wind3",
    theme,
    rules,
    shortcuts,
    variants: variants(options),
    postprocess: postprocessors(options)
  };
});
const presetUno = definePreset((options = {}) => {
  return {
    ...presetWind3(options),
    name: "@unocss/preset-uno"
  };
});
const EOF$1 = 0;
const Ident = 1;
const Function$2 = 2;
const AtKeyword = 3;
const Hash$1 = 4;
const String$2 = 5;
const BadString = 6;
const Url$1 = 7;
const BadUrl = 8;
const Delim = 9;
const Number$2 = 10;
const Percentage$1 = 11;
const Dimension$1 = 12;
const WhiteSpace$1 = 13;
const CDO$1 = 14;
const CDC$1 = 15;
const Colon = 16;
const Semicolon = 17;
const Comma = 18;
const LeftSquareBracket = 19;
const RightSquareBracket = 20;
const LeftParenthesis = 21;
const RightParenthesis = 22;
const LeftCurlyBracket = 23;
const RightCurlyBracket = 24;
const Comment$1 = 25;
const EOF = 0;
function isDigit(code2) {
  return code2 >= 48 && code2 <= 57;
}
function isHexDigit(code2) {
  return isDigit(code2) || // 0 .. 9
  code2 >= 65 && code2 <= 70 || // A .. F
  code2 >= 97 && code2 <= 102;
}
function isUppercaseLetter(code2) {
  return code2 >= 65 && code2 <= 90;
}
function isLowercaseLetter(code2) {
  return code2 >= 97 && code2 <= 122;
}
function isLetter(code2) {
  return isUppercaseLetter(code2) || isLowercaseLetter(code2);
}
function isNonAscii(code2) {
  return code2 >= 128;
}
function isNameStart(code2) {
  return isLetter(code2) || isNonAscii(code2) || code2 === 95;
}
function isName(code2) {
  return isNameStart(code2) || isDigit(code2) || code2 === 45;
}
function isNonPrintable(code2) {
  return code2 >= 0 && code2 <= 8 || code2 === 11 || code2 >= 14 && code2 <= 31 || code2 === 127;
}
function isNewline(code2) {
  return code2 === 10 || code2 === 13 || code2 === 12;
}
function isWhiteSpace(code2) {
  return isNewline(code2) || code2 === 32 || code2 === 9;
}
function isValidEscape(first, second) {
  if (first !== 92) {
    return false;
  }
  if (isNewline(second) || second === EOF) {
    return false;
  }
  return true;
}
function isIdentifierStart(first, second, third) {
  if (first === 45) {
    return isNameStart(second) || second === 45 || isValidEscape(second, third);
  }
  if (isNameStart(first)) {
    return true;
  }
  if (first === 92) {
    return isValidEscape(first, second);
  }
  return false;
}
function isNumberStart(first, second, third) {
  if (first === 43 || first === 45) {
    if (isDigit(second)) {
      return 2;
    }
    return second === 46 && isDigit(third) ? 3 : 0;
  }
  if (first === 46) {
    return isDigit(second) ? 2 : 0;
  }
  if (isDigit(first)) {
    return 1;
  }
  return 0;
}
function isBOM(code2) {
  if (code2 === 65279) {
    return 1;
  }
  if (code2 === 65534) {
    return 1;
  }
  return 0;
}
const CATEGORY = new Array(128);
const EofCategory = 128;
const WhiteSpaceCategory = 130;
const DigitCategory = 131;
const NameStartCategory = 132;
const NonPrintableCategory = 133;
for (let i = 0; i < CATEGORY.length; i++) {
  CATEGORY[i] = isWhiteSpace(i) && WhiteSpaceCategory || isDigit(i) && DigitCategory || isNameStart(i) && NameStartCategory || isNonPrintable(i) && NonPrintableCategory || i || EofCategory;
}
function charCodeCategory(code2) {
  return code2 < 128 ? CATEGORY[code2] : NameStartCategory;
}
function getCharCode(source, offset) {
  return offset < source.length ? source.charCodeAt(offset) : 0;
}
function getNewlineLength(source, offset, code2) {
  if (code2 === 13 && getCharCode(source, offset + 1) === 10) {
    return 2;
  }
  return 1;
}
function cmpChar(testStr, offset, referenceCode) {
  let code2 = testStr.charCodeAt(offset);
  if (isUppercaseLetter(code2)) {
    code2 = code2 | 32;
  }
  return code2 === referenceCode;
}
function cmpStr(testStr, start, end, referenceStr) {
  if (end - start !== referenceStr.length) {
    return false;
  }
  if (start < 0 || end > testStr.length) {
    return false;
  }
  for (let i = start; i < end; i++) {
    const referenceCode = referenceStr.charCodeAt(i - start);
    let testCode = testStr.charCodeAt(i);
    if (isUppercaseLetter(testCode)) {
      testCode = testCode | 32;
    }
    if (testCode !== referenceCode) {
      return false;
    }
  }
  return true;
}
function findWhiteSpaceStart(source, offset) {
  for (; offset >= 0; offset--) {
    if (!isWhiteSpace(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset + 1;
}
function findWhiteSpaceEnd(source, offset) {
  for (; offset < source.length; offset++) {
    if (!isWhiteSpace(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset;
}
function findDecimalNumberEnd(source, offset) {
  for (; offset < source.length; offset++) {
    if (!isDigit(source.charCodeAt(offset))) {
      break;
    }
  }
  return offset;
}
function consumeEscaped(source, offset) {
  offset += 2;
  if (isHexDigit(getCharCode(source, offset - 1))) {
    for (const maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
      if (!isHexDigit(getCharCode(source, offset))) {
        break;
      }
    }
    const code2 = getCharCode(source, offset);
    if (isWhiteSpace(code2)) {
      offset += getNewlineLength(source, offset, code2);
    }
  }
  return offset;
}
function consumeName(source, offset) {
  for (; offset < source.length; offset++) {
    const code2 = source.charCodeAt(offset);
    if (isName(code2)) {
      continue;
    }
    if (isValidEscape(code2, getCharCode(source, offset + 1))) {
      offset = consumeEscaped(source, offset) - 1;
      continue;
    }
    break;
  }
  return offset;
}
function consumeNumber(source, offset) {
  let code2 = source.charCodeAt(offset);
  if (code2 === 43 || code2 === 45) {
    code2 = source.charCodeAt(offset += 1);
  }
  if (isDigit(code2)) {
    offset = findDecimalNumberEnd(source, offset + 1);
    code2 = source.charCodeAt(offset);
  }
  if (code2 === 46 && isDigit(source.charCodeAt(offset + 1))) {
    offset += 2;
    offset = findDecimalNumberEnd(source, offset);
  }
  if (cmpChar(
    source,
    offset,
    101
    /* e */
  )) {
    let sign = 0;
    code2 = source.charCodeAt(offset + 1);
    if (code2 === 45 || code2 === 43) {
      sign = 1;
      code2 = source.charCodeAt(offset + 2);
    }
    if (isDigit(code2)) {
      offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
    }
  }
  return offset;
}
function consumeBadUrlRemnants(source, offset) {
  for (; offset < source.length; offset++) {
    const code2 = source.charCodeAt(offset);
    if (code2 === 41) {
      offset++;
      break;
    }
    if (isValidEscape(code2, getCharCode(source, offset + 1))) {
      offset = consumeEscaped(source, offset);
    }
  }
  return offset;
}
function decodeEscaped(escaped) {
  if (escaped.length === 1 && !isHexDigit(escaped.charCodeAt(0))) {
    return escaped[0];
  }
  let code2 = parseInt(escaped, 16);
  if (code2 === 0 || // If this number is zero,
  code2 >= 55296 && code2 <= 57343 || // or is for a surrogate,
  code2 > 1114111) {
    code2 = 65533;
  }
  return String.fromCodePoint(code2);
}
const tokenNames = [
  "EOF-token",
  "ident-token",
  "function-token",
  "at-keyword-token",
  "hash-token",
  "string-token",
  "bad-string-token",
  "url-token",
  "bad-url-token",
  "delim-token",
  "number-token",
  "percentage-token",
  "dimension-token",
  "whitespace-token",
  "CDO-token",
  "CDC-token",
  "colon-token",
  "semicolon-token",
  "comma-token",
  "[-token",
  "]-token",
  "(-token",
  ")-token",
  "{-token",
  "}-token",
  "comment-token"
];
const MIN_SIZE = 16 * 1024;
function adoptBuffer(buffer = null, size) {
  if (buffer === null || buffer.length < size) {
    return new Uint32Array(Math.max(size + 1024, MIN_SIZE));
  }
  return buffer;
}
const N$4 = 10;
const F$2 = 12;
const R$2 = 13;
function computeLinesAndColumns(host) {
  const source = host.source;
  const sourceLength = source.length;
  const startOffset = source.length > 0 ? isBOM(source.charCodeAt(0)) : 0;
  const lines = adoptBuffer(host.lines, sourceLength);
  const columns2 = adoptBuffer(host.columns, sourceLength);
  let line = host.startLine;
  let column = host.startColumn;
  for (let i = startOffset; i < sourceLength; i++) {
    const code2 = source.charCodeAt(i);
    lines[i] = line;
    columns2[i] = column++;
    if (code2 === N$4 || code2 === R$2 || code2 === F$2) {
      if (code2 === R$2 && i + 1 < sourceLength && source.charCodeAt(i + 1) === N$4) {
        i++;
        lines[i] = line;
        columns2[i] = column;
      }
      line++;
      column = 1;
    }
  }
  lines[sourceLength] = line;
  columns2[sourceLength] = column;
  host.lines = lines;
  host.columns = columns2;
  host.computed = true;
}
class OffsetToLocation {
  constructor(source, startOffset, startLine, startColumn) {
    this.setSource(source, startOffset, startLine, startColumn);
    this.lines = null;
    this.columns = null;
  }
  setSource(source = "", startOffset = 0, startLine = 1, startColumn = 1) {
    this.source = source;
    this.startOffset = startOffset;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.computed = false;
  }
  getLocation(offset, filename) {
    if (!this.computed) {
      computeLinesAndColumns(this);
    }
    return {
      source: filename,
      offset: this.startOffset + offset,
      line: this.lines[offset],
      column: this.columns[offset]
    };
  }
  getLocationRange(start, end, filename) {
    if (!this.computed) {
      computeLinesAndColumns(this);
    }
    return {
      source: filename,
      start: {
        offset: this.startOffset + start,
        line: this.lines[start],
        column: this.columns[start]
      },
      end: {
        offset: this.startOffset + end,
        line: this.lines[end],
        column: this.columns[end]
      }
    };
  }
}
const OFFSET_MASK = 16777215;
const TYPE_SHIFT = 24;
const BLOCK_OPEN_TOKEN = 1;
const BLOCK_CLOSE_TOKEN = 2;
const balancePair$1 = new Uint8Array(32);
balancePair$1[Function$2] = RightParenthesis;
balancePair$1[LeftParenthesis] = RightParenthesis;
balancePair$1[LeftSquareBracket] = RightSquareBracket;
balancePair$1[LeftCurlyBracket] = RightCurlyBracket;
const blockTokens = new Uint8Array(32);
blockTokens[Function$2] = BLOCK_OPEN_TOKEN;
blockTokens[LeftParenthesis] = BLOCK_OPEN_TOKEN;
blockTokens[LeftSquareBracket] = BLOCK_OPEN_TOKEN;
blockTokens[LeftCurlyBracket] = BLOCK_OPEN_TOKEN;
blockTokens[RightParenthesis] = BLOCK_CLOSE_TOKEN;
blockTokens[RightSquareBracket] = BLOCK_CLOSE_TOKEN;
blockTokens[RightCurlyBracket] = BLOCK_CLOSE_TOKEN;
function boundIndex(index, min, max) {
  return index < min ? min : index > max ? max : index;
}
class TokenStream {
  constructor(source, tokenize2) {
    this.setSource(source, tokenize2);
  }
  reset() {
    this.eof = false;
    this.tokenIndex = -1;
    this.tokenType = 0;
    this.tokenStart = this.firstCharOffset;
    this.tokenEnd = this.firstCharOffset;
  }
  setSource(source = "", tokenize2 = () => {
  }) {
    source = String(source || "");
    const sourceLength = source.length;
    const offsetAndType = adoptBuffer(this.offsetAndType, source.length + 1);
    const balance = adoptBuffer(this.balance, source.length + 1);
    let tokenCount = 0;
    let firstCharOffset = -1;
    let balanceCloseType = 0;
    let balanceStart = source.length;
    this.offsetAndType = null;
    this.balance = null;
    balance.fill(0);
    tokenize2(source, (type, start, end) => {
      const index = tokenCount++;
      offsetAndType[index] = type << TYPE_SHIFT | end;
      if (firstCharOffset === -1) {
        firstCharOffset = start;
      }
      balance[index] = balanceStart;
      if (type === balanceCloseType) {
        const prevBalanceStart = balance[balanceStart];
        balance[balanceStart] = index;
        balanceStart = prevBalanceStart;
        balanceCloseType = balancePair$1[offsetAndType[prevBalanceStart] >> TYPE_SHIFT];
      } else if (this.isBlockOpenerTokenType(type)) {
        balanceStart = index;
        balanceCloseType = balancePair$1[type];
      }
    });
    offsetAndType[tokenCount] = EOF$1 << TYPE_SHIFT | sourceLength;
    balance[tokenCount] = tokenCount;
    for (let i = 0; i < tokenCount; i++) {
      const balanceStart2 = balance[i];
      if (balanceStart2 <= i) {
        const balanceEnd = balance[balanceStart2];
        if (balanceEnd !== i) {
          balance[i] = balanceEnd;
        }
      } else if (balanceStart2 > tokenCount) {
        balance[i] = tokenCount;
      }
    }
    this.source = source;
    this.firstCharOffset = firstCharOffset === -1 ? 0 : firstCharOffset;
    this.tokenCount = tokenCount;
    this.offsetAndType = offsetAndType;
    this.balance = balance;
    this.reset();
    this.next();
  }
  lookupType(offset) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return this.offsetAndType[offset] >> TYPE_SHIFT;
    }
    return EOF$1;
  }
  lookupTypeNonSC(idx) {
    for (let offset = this.tokenIndex; offset < this.tokenCount; offset++) {
      const tokenType2 = this.offsetAndType[offset] >> TYPE_SHIFT;
      if (tokenType2 !== WhiteSpace$1 && tokenType2 !== Comment$1) {
        if (idx-- === 0) {
          return tokenType2;
        }
      }
    }
    return EOF$1;
  }
  lookupOffset(offset) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return this.offsetAndType[offset - 1] & OFFSET_MASK;
    }
    return this.source.length;
  }
  lookupOffsetNonSC(idx) {
    for (let offset = this.tokenIndex; offset < this.tokenCount; offset++) {
      const tokenType2 = this.offsetAndType[offset] >> TYPE_SHIFT;
      if (tokenType2 !== WhiteSpace$1 && tokenType2 !== Comment$1) {
        if (idx-- === 0) {
          return offset - this.tokenIndex;
        }
      }
    }
    return EOF$1;
  }
  lookupValue(offset, referenceStr) {
    offset += this.tokenIndex;
    if (offset < this.tokenCount) {
      return cmpStr(
        this.source,
        this.offsetAndType[offset - 1] & OFFSET_MASK,
        this.offsetAndType[offset] & OFFSET_MASK,
        referenceStr
      );
    }
    return false;
  }
  getTokenStart(tokenIndex) {
    if (tokenIndex === this.tokenIndex) {
      return this.tokenStart;
    }
    if (tokenIndex > 0) {
      return tokenIndex < this.tokenCount ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
    }
    return this.firstCharOffset;
  }
  getTokenEnd(tokenIndex) {
    if (tokenIndex === this.tokenIndex) {
      return this.tokenEnd;
    }
    return this.offsetAndType[boundIndex(tokenIndex, 0, this.tokenCount)] & OFFSET_MASK;
  }
  getTokenType(tokenIndex) {
    if (tokenIndex === this.tokenIndex) {
      return this.tokenType;
    }
    return this.offsetAndType[boundIndex(tokenIndex, 0, this.tokenCount)] >> TYPE_SHIFT;
  }
  substrToCursor(start) {
    return this.source.substring(start, this.tokenStart);
  }
  isBlockOpenerTokenType(tokenType2) {
    return blockTokens[tokenType2] === BLOCK_OPEN_TOKEN;
  }
  isBlockCloserTokenType(tokenType2) {
    return blockTokens[tokenType2] === BLOCK_CLOSE_TOKEN;
  }
  getBlockTokenPairIndex(tokenIndex) {
    const type = this.getTokenType(tokenIndex);
    if (blockTokens[type] === 1) {
      const pairIndex = this.balance[tokenIndex];
      const closeType = this.getTokenType(pairIndex);
      return balancePair$1[type] === closeType ? pairIndex : -1;
    } else if (blockTokens[type] === 2) {
      const pairIndex = this.balance[tokenIndex];
      const openType = this.getTokenType(pairIndex);
      return balancePair$1[openType] === type ? pairIndex : -1;
    }
    return -1;
  }
  isBalanceEdge(tokenIndex) {
    return this.balance[this.tokenIndex] < tokenIndex;
  }
  isDelim(code2, offset) {
    if (offset) {
      return this.lookupType(offset) === Delim && this.source.charCodeAt(this.lookupOffset(offset)) === code2;
    }
    return this.tokenType === Delim && this.source.charCodeAt(this.tokenStart) === code2;
  }
  skip(tokenCount) {
    let next = this.tokenIndex + tokenCount;
    if (next < this.tokenCount) {
      this.tokenIndex = next;
      this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
      next = this.offsetAndType[next];
      this.tokenType = next >> TYPE_SHIFT;
      this.tokenEnd = next & OFFSET_MASK;
    } else {
      this.tokenIndex = this.tokenCount;
      this.next();
    }
  }
  next() {
    let next = this.tokenIndex + 1;
    if (next < this.tokenCount) {
      this.tokenIndex = next;
      this.tokenStart = this.tokenEnd;
      next = this.offsetAndType[next];
      this.tokenType = next >> TYPE_SHIFT;
      this.tokenEnd = next & OFFSET_MASK;
    } else {
      this.eof = true;
      this.tokenIndex = this.tokenCount;
      this.tokenType = EOF$1;
      this.tokenStart = this.tokenEnd = this.source.length;
    }
  }
  skipSC() {
    while (this.tokenType === WhiteSpace$1 || this.tokenType === Comment$1) {
      this.next();
    }
  }
  skipUntilBalanced(startToken, stopConsume) {
    let cursor = startToken;
    let balanceEnd = 0;
    let offset = 0;
    loop:
      for (; cursor < this.tokenCount; cursor++) {
        balanceEnd = this.balance[cursor];
        if (balanceEnd < startToken) {
          break loop;
        }
        offset = cursor > 0 ? this.offsetAndType[cursor - 1] & OFFSET_MASK : this.firstCharOffset;
        switch (stopConsume(this.source.charCodeAt(offset))) {
          case 1:
            break loop;
          case 2:
            cursor++;
            break loop;
          default:
            if (this.isBlockOpenerTokenType(this.offsetAndType[cursor] >> TYPE_SHIFT)) {
              cursor = balanceEnd;
            }
        }
      }
    this.skip(cursor - this.tokenIndex);
  }
  forEachToken(fn) {
    for (let i = 0, offset = this.firstCharOffset; i < this.tokenCount; i++) {
      const start = offset;
      const item = this.offsetAndType[i];
      const end = item & OFFSET_MASK;
      const type = item >> TYPE_SHIFT;
      offset = end;
      fn(type, start, end, i);
    }
  }
  dump() {
    const tokens = new Array(this.tokenCount);
    this.forEachToken((type, start, end, index) => {
      tokens[index] = {
        idx: index,
        type: tokenNames[type],
        chunk: this.source.substring(start, end),
        balance: this.balance[index]
      };
    });
    return tokens;
  }
}
function tokenize$1(source, onToken) {
  function getCharCode2(offset2) {
    return offset2 < sourceLength ? source.charCodeAt(offset2) : 0;
  }
  function consumeNumericToken() {
    offset = consumeNumber(source, offset);
    if (isIdentifierStart(getCharCode2(offset), getCharCode2(offset + 1), getCharCode2(offset + 2))) {
      type = Dimension$1;
      offset = consumeName(source, offset);
      return;
    }
    if (getCharCode2(offset) === 37) {
      type = Percentage$1;
      offset++;
      return;
    }
    type = Number$2;
  }
  function consumeIdentLikeToken() {
    const nameStartOffset = offset;
    offset = consumeName(source, offset);
    if (cmpStr(source, nameStartOffset, offset, "url") && getCharCode2(offset) === 40) {
      offset = findWhiteSpaceEnd(source, offset + 1);
      if (getCharCode2(offset) === 34 || getCharCode2(offset) === 39) {
        type = Function$2;
        offset = nameStartOffset + 4;
        return;
      }
      consumeUrlToken();
      return;
    }
    if (getCharCode2(offset) === 40) {
      type = Function$2;
      offset++;
      return;
    }
    type = Ident;
  }
  function consumeStringToken(endingCodePoint) {
    if (!endingCodePoint) {
      endingCodePoint = getCharCode2(offset++);
    }
    type = String$2;
    for (; offset < source.length; offset++) {
      const code2 = source.charCodeAt(offset);
      switch (charCodeCategory(code2)) {
        // ending code point
        case endingCodePoint:
          offset++;
          return;
        // EOF
        // case EofCategory:
        // This is a parse error. Return the <string-token>.
        // return;
        // newline
        case WhiteSpaceCategory:
          if (isNewline(code2)) {
            offset += getNewlineLength(source, offset, code2);
            type = BadString;
            return;
          }
          break;
        // U+005C REVERSE SOLIDUS (\)
        case 92:
          if (offset === source.length - 1) {
            break;
          }
          const nextCode = getCharCode2(offset + 1);
          if (isNewline(nextCode)) {
            offset += getNewlineLength(source, offset + 1, nextCode);
          } else if (isValidEscape(code2, nextCode)) {
            offset = consumeEscaped(source, offset) - 1;
          }
          break;
      }
    }
  }
  function consumeUrlToken() {
    type = Url$1;
    offset = findWhiteSpaceEnd(source, offset);
    for (; offset < source.length; offset++) {
      const code2 = source.charCodeAt(offset);
      switch (charCodeCategory(code2)) {
        // U+0029 RIGHT PARENTHESIS ())
        case 41:
          offset++;
          return;
        // EOF
        // case EofCategory:
        // This is a parse error. Return the <url-token>.
        // return;
        // whitespace
        case WhiteSpaceCategory:
          offset = findWhiteSpaceEnd(source, offset);
          if (getCharCode2(offset) === 41 || offset >= source.length) {
            if (offset < source.length) {
              offset++;
            }
            return;
          }
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
        // U+0022 QUOTATION MARK (")
        // U+0027 APOSTROPHE (')
        // U+0028 LEFT PARENTHESIS (()
        // non-printable code point
        case 34:
        case 39:
        case 40:
        case NonPrintableCategory:
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
        // U+005C REVERSE SOLIDUS (\)
        case 92:
          if (isValidEscape(code2, getCharCode2(offset + 1))) {
            offset = consumeEscaped(source, offset) - 1;
            break;
          }
          offset = consumeBadUrlRemnants(source, offset);
          type = BadUrl;
          return;
      }
    }
  }
  source = String(source || "");
  const sourceLength = source.length;
  let start = isBOM(getCharCode2(0));
  let offset = start;
  let type;
  while (offset < sourceLength) {
    const code2 = source.charCodeAt(offset);
    switch (charCodeCategory(code2)) {
      // whitespace
      case WhiteSpaceCategory:
        type = WhiteSpace$1;
        offset = findWhiteSpaceEnd(source, offset + 1);
        break;
      // U+0022 QUOTATION MARK (")
      case 34:
        consumeStringToken();
        break;
      // U+0023 NUMBER SIGN (#)
      case 35:
        if (isName(getCharCode2(offset + 1)) || isValidEscape(getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          type = Hash$1;
          offset = consumeName(source, offset + 1);
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+0027 APOSTROPHE (')
      case 39:
        consumeStringToken();
        break;
      // U+0028 LEFT PARENTHESIS (()
      case 40:
        type = LeftParenthesis;
        offset++;
        break;
      // U+0029 RIGHT PARENTHESIS ())
      case 41:
        type = RightParenthesis;
        offset++;
        break;
      // U+002B PLUS SIGN (+)
      case 43:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+002C COMMA (,)
      case 44:
        type = Comma;
        offset++;
        break;
      // U+002D HYPHEN-MINUS (-)
      case 45:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          if (getCharCode2(offset + 1) === 45 && getCharCode2(offset + 2) === 62) {
            type = CDC$1;
            offset = offset + 3;
          } else {
            if (isIdentifierStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
              consumeIdentLikeToken();
            } else {
              type = Delim;
              offset++;
            }
          }
        }
        break;
      // U+002E FULL STOP (.)
      case 46:
        if (isNumberStart(code2, getCharCode2(offset + 1), getCharCode2(offset + 2))) {
          consumeNumericToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+002F SOLIDUS (/)
      case 47:
        if (getCharCode2(offset + 1) === 42) {
          type = Comment$1;
          offset = source.indexOf("*/", offset + 2);
          offset = offset === -1 ? source.length : offset + 2;
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+003A COLON (:)
      case 58:
        type = Colon;
        offset++;
        break;
      // U+003B SEMICOLON (;)
      case 59:
        type = Semicolon;
        offset++;
        break;
      // U+003C LESS-THAN SIGN (<)
      case 60:
        if (getCharCode2(offset + 1) === 33 && getCharCode2(offset + 2) === 45 && getCharCode2(offset + 3) === 45) {
          type = CDO$1;
          offset = offset + 4;
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+0040 COMMERCIAL AT (@)
      case 64:
        if (isIdentifierStart(getCharCode2(offset + 1), getCharCode2(offset + 2), getCharCode2(offset + 3))) {
          type = AtKeyword;
          offset = consumeName(source, offset + 1);
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+005B LEFT SQUARE BRACKET ([)
      case 91:
        type = LeftSquareBracket;
        offset++;
        break;
      // U+005C REVERSE SOLIDUS (\)
      case 92:
        if (isValidEscape(code2, getCharCode2(offset + 1))) {
          consumeIdentLikeToken();
        } else {
          type = Delim;
          offset++;
        }
        break;
      // U+005D RIGHT SQUARE BRACKET (])
      case 93:
        type = RightSquareBracket;
        offset++;
        break;
      // U+007B LEFT CURLY BRACKET ({)
      case 123:
        type = LeftCurlyBracket;
        offset++;
        break;
      // U+007D RIGHT CURLY BRACKET (})
      case 125:
        type = RightCurlyBracket;
        offset++;
        break;
      // digit
      case DigitCategory:
        consumeNumericToken();
        break;
      // name-start code point
      case NameStartCategory:
        consumeIdentLikeToken();
        break;
      // EOF
      // case EofCategory:
      // Return an <EOF-token>.
      // break;
      // anything else
      default:
        type = Delim;
        offset++;
    }
    onToken(type, start, start = offset);
  }
}
let releasedCursors = null;
class List {
  static createItem(data) {
    return {
      prev: null,
      next: null,
      data
    };
  }
  constructor() {
    this.head = null;
    this.tail = null;
    this.cursor = null;
  }
  createItem(data) {
    return List.createItem(data);
  }
  // cursor helpers
  allocateCursor(prev, next) {
    let cursor;
    if (releasedCursors !== null) {
      cursor = releasedCursors;
      releasedCursors = releasedCursors.cursor;
      cursor.prev = prev;
      cursor.next = next;
      cursor.cursor = this.cursor;
    } else {
      cursor = {
        prev,
        next,
        cursor: this.cursor
      };
    }
    this.cursor = cursor;
    return cursor;
  }
  releaseCursor() {
    const { cursor } = this;
    this.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = releasedCursors;
    releasedCursors = cursor;
  }
  updateCursors(prevOld, prevNew, nextOld, nextNew) {
    let { cursor } = this;
    while (cursor !== null) {
      if (cursor.prev === prevOld) {
        cursor.prev = prevNew;
      }
      if (cursor.next === nextOld) {
        cursor.next = nextNew;
      }
      cursor = cursor.cursor;
    }
  }
  *[Symbol.iterator]() {
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      yield cursor.data;
    }
  }
  // getters
  get size() {
    let size = 0;
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      size++;
    }
    return size;
  }
  get isEmpty() {
    return this.head === null;
  }
  get first() {
    return this.head && this.head.data;
  }
  get last() {
    return this.tail && this.tail.data;
  }
  // convertors
  fromArray(array) {
    let cursor = null;
    this.head = null;
    for (let data of array) {
      const item = List.createItem(data);
      if (cursor !== null) {
        cursor.next = item;
      } else {
        this.head = item;
      }
      item.prev = cursor;
      cursor = item;
    }
    this.tail = cursor;
    return this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  // array-like methods
  forEach(fn, thisArg = this) {
    const cursor = this.allocateCursor(null, this.head);
    while (cursor.next !== null) {
      const item = cursor.next;
      cursor.next = item.next;
      fn.call(thisArg, item.data, item, this);
    }
    this.releaseCursor();
  }
  forEachRight(fn, thisArg = this) {
    const cursor = this.allocateCursor(this.tail, null);
    while (cursor.prev !== null) {
      const item = cursor.prev;
      cursor.prev = item.prev;
      fn.call(thisArg, item.data, item, this);
    }
    this.releaseCursor();
  }
  reduce(fn, initialValue, thisArg = this) {
    let cursor = this.allocateCursor(null, this.head);
    let acc = initialValue;
    let item;
    while (cursor.next !== null) {
      item = cursor.next;
      cursor.next = item.next;
      acc = fn.call(thisArg, acc, item.data, item, this);
    }
    this.releaseCursor();
    return acc;
  }
  reduceRight(fn, initialValue, thisArg = this) {
    let cursor = this.allocateCursor(this.tail, null);
    let acc = initialValue;
    let item;
    while (cursor.prev !== null) {
      item = cursor.prev;
      cursor.prev = item.prev;
      acc = fn.call(thisArg, acc, item.data, item, this);
    }
    this.releaseCursor();
    return acc;
  }
  some(fn, thisArg = this) {
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      if (fn.call(thisArg, cursor.data, cursor, this)) {
        return true;
      }
    }
    return false;
  }
  map(fn, thisArg = this) {
    const result = new List();
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      result.appendData(fn.call(thisArg, cursor.data, cursor, this));
    }
    return result;
  }
  filter(fn, thisArg = this) {
    const result = new List();
    for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
      if (fn.call(thisArg, cursor.data, cursor, this)) {
        result.appendData(cursor.data);
      }
    }
    return result;
  }
  nextUntil(start, fn, thisArg = this) {
    if (start === null) {
      return;
    }
    const cursor = this.allocateCursor(null, start);
    while (cursor.next !== null) {
      const item = cursor.next;
      cursor.next = item.next;
      if (fn.call(thisArg, item.data, item, this)) {
        break;
      }
    }
    this.releaseCursor();
  }
  prevUntil(start, fn, thisArg = this) {
    if (start === null) {
      return;
    }
    const cursor = this.allocateCursor(start, null);
    while (cursor.prev !== null) {
      const item = cursor.prev;
      cursor.prev = item.prev;
      if (fn.call(thisArg, item.data, item, this)) {
        break;
      }
    }
    this.releaseCursor();
  }
  // mutation
  clear() {
    this.head = null;
    this.tail = null;
  }
  copy() {
    const result = new List();
    for (let data of this) {
      result.appendData(data);
    }
    return result;
  }
  prepend(item) {
    this.updateCursors(null, item, this.head, item);
    if (this.head !== null) {
      this.head.prev = item;
      item.next = this.head;
    } else {
      this.tail = item;
    }
    this.head = item;
    return this;
  }
  prependData(data) {
    return this.prepend(List.createItem(data));
  }
  append(item) {
    return this.insert(item);
  }
  appendData(data) {
    return this.insert(List.createItem(data));
  }
  insert(item, before = null) {
    if (before !== null) {
      this.updateCursors(before.prev, item, before, item);
      if (before.prev === null) {
        if (this.head !== before) {
          throw new Error("before doesn't belong to list");
        }
        this.head = item;
        before.prev = item;
        item.next = before;
        this.updateCursors(null, item);
      } else {
        before.prev.next = item;
        item.prev = before.prev;
        before.prev = item;
        item.next = before;
      }
    } else {
      this.updateCursors(this.tail, item, null, item);
      if (this.tail !== null) {
        this.tail.next = item;
        item.prev = this.tail;
      } else {
        this.head = item;
      }
      this.tail = item;
    }
    return this;
  }
  insertData(data, before) {
    return this.insert(List.createItem(data), before);
  }
  remove(item) {
    this.updateCursors(item, item.prev, item, item.next);
    if (item.prev !== null) {
      item.prev.next = item.next;
    } else {
      if (this.head !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.head = item.next;
    }
    if (item.next !== null) {
      item.next.prev = item.prev;
    } else {
      if (this.tail !== item) {
        throw new Error("item doesn't belong to list");
      }
      this.tail = item.prev;
    }
    item.prev = null;
    item.next = null;
    return item;
  }
  push(data) {
    this.insert(List.createItem(data));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(data) {
    this.prepend(List.createItem(data));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(list) {
    return this.insertList(list, this.head);
  }
  appendList(list) {
    return this.insertList(list);
  }
  insertList(list, before) {
    if (list.head === null) {
      return this;
    }
    if (before !== void 0 && before !== null) {
      this.updateCursors(before.prev, list.tail, before, list.head);
      if (before.prev !== null) {
        before.prev.next = list.head;
        list.head.prev = before.prev;
      } else {
        this.head = list.head;
      }
      before.prev = list.tail;
      list.tail.next = before;
    } else {
      this.updateCursors(this.tail, list.tail, null, list.head);
      if (this.tail !== null) {
        this.tail.next = list.head;
        list.head.prev = this.tail;
      } else {
        this.head = list.head;
      }
      this.tail = list.tail;
    }
    list.head = null;
    list.tail = null;
    return this;
  }
  replace(oldItem, newItemOrList) {
    if ("head" in newItemOrList) {
      this.insertList(newItemOrList, oldItem);
    } else {
      this.insert(newItemOrList, oldItem);
    }
    this.remove(oldItem);
  }
}
function createCustomError(name2, message) {
  const error = Object.create(SyntaxError.prototype);
  const errorStack = new Error();
  return Object.assign(error, {
    name: name2,
    message,
    get stack() {
      return (errorStack.stack || "").replace(/^(.+\n){1,3}/, `${name2}: ${message}
`);
    }
  });
}
const MAX_LINE_LENGTH = 100;
const OFFSET_CORRECTION = 60;
const TAB_REPLACEMENT = "    ";
function sourceFragment({ source, line, column, baseLine, baseColumn }, extraLines) {
  function processLines(start, end) {
    return lines.slice(start, end).map(
      (line2, idx) => String(start + idx + 1).padStart(maxNumLength) + " |" + line2
    ).join("\n");
  }
  const prelines = "\n".repeat(Math.max(baseLine - 1, 0));
  const precolumns = " ".repeat(Math.max(baseColumn - 1, 0));
  const lines = (prelines + precolumns + source).split(/\r\n?|\n|\f/);
  const startLine = Math.max(1, line - extraLines) - 1;
  const endLine = Math.min(line + extraLines, lines.length + 1);
  const maxNumLength = Math.max(4, String(endLine).length) + 1;
  let cutLeft = 0;
  column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
  if (column > MAX_LINE_LENGTH) {
    cutLeft = column - OFFSET_CORRECTION + 3;
    column = OFFSET_CORRECTION - 2;
  }
  for (let i = startLine; i <= endLine; i++) {
    if (i >= 0 && i < lines.length) {
      lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
      lines[i] = (cutLeft > 0 && lines[i].length > cutLeft ? "…" : "") + lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) + (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? "…" : "");
    }
  }
  return [
    processLines(startLine, line),
    new Array(column + maxNumLength + 2).join("-") + "^",
    processLines(line, endLine)
  ].filter(Boolean).join("\n").replace(/^(\s+\d+\s+\|\n)+/, "").replace(/\n(\s+\d+\s+\|)+$/, "");
}
function SyntaxError$2(message, source, offset, line, column, baseLine = 1, baseColumn = 1) {
  const error = Object.assign(createCustomError("SyntaxError", message), {
    source,
    offset,
    line,
    column,
    sourceFragment(extraLines) {
      return sourceFragment({ source, line, column, baseLine, baseColumn }, isNaN(extraLines) ? 0 : extraLines);
    },
    get formattedMessage() {
      return `Parse error: ${message}
` + sourceFragment({ source, line, column, baseLine, baseColumn }, 2);
    }
  });
  return error;
}
function readSequence(recognizer) {
  const children = this.createList();
  let space = false;
  const context = {
    recognizer
  };
  while (!this.eof) {
    switch (this.tokenType) {
      case Comment$1:
        this.next();
        continue;
      case WhiteSpace$1:
        space = true;
        this.next();
        continue;
    }
    let child = recognizer.getNode.call(this, context);
    if (child === void 0) {
      break;
    }
    if (space) {
      if (recognizer.onWhiteSpace) {
        recognizer.onWhiteSpace.call(this, child, children, context);
      }
      space = false;
    }
    children.push(child);
  }
  if (space && recognizer.onWhiteSpace) {
    recognizer.onWhiteSpace.call(this, null, children, context);
  }
  return children;
}
const NOOP = () => {
};
const EXCLAMATIONMARK$3 = 33;
const NUMBERSIGN$4 = 35;
const SEMICOLON = 59;
const LEFTCURLYBRACKET$1 = 123;
const NULL = 0;
const arrayMethods = {
  createList() {
    return [];
  },
  createSingleNodeList(node2) {
    return [node2];
  },
  getFirstListNode(list) {
    return list && list[0] || null;
  },
  getLastListNode(list) {
    return list && list.length > 0 ? list[list.length - 1] : null;
  }
};
const listMethods = {
  createList() {
    return new List();
  },
  createSingleNodeList(node2) {
    return new List().appendData(node2);
  },
  getFirstListNode(list) {
    return list && list.first;
  },
  getLastListNode(list) {
    return list && list.last;
  }
};
function createParseContext(name2) {
  return function() {
    return this[name2]();
  };
}
function fetchParseValues(dict) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const name2 of Object.keys(dict)) {
    const item = dict[name2];
    const fn = item.parse || item;
    if (fn) {
      result[name2] = fn;
    }
  }
  return result;
}
function processConfig(config) {
  const parseConfig = {
    context: /* @__PURE__ */ Object.create(null),
    features: Object.assign(/* @__PURE__ */ Object.create(null), config.features),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), config.scope),
    atrule: fetchParseValues(config.atrule),
    pseudo: fetchParseValues(config.pseudo),
    node: fetchParseValues(config.node)
  };
  for (const [name2, context] of Object.entries(config.parseContext)) {
    switch (typeof context) {
      case "function":
        parseConfig.context[name2] = context;
        break;
      case "string":
        parseConfig.context[name2] = createParseContext(context);
        break;
    }
  }
  return {
    config: parseConfig,
    ...parseConfig,
    ...parseConfig.node
  };
}
function createParser(config) {
  let source = "";
  let filename = "<unknown>";
  let needPositions = false;
  let onParseError = NOOP;
  let onParseErrorThrow = false;
  const locationMap = new OffsetToLocation();
  const parser = Object.assign(new TokenStream(), processConfig(config || {}), {
    parseAtrulePrelude: true,
    parseRulePrelude: true,
    parseValue: true,
    parseCustomProperty: false,
    readSequence,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(code2) {
      return code2 === LEFTCURLYBRACKET$1 ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(code2) {
      return code2 === LEFTCURLYBRACKET$1 || code2 === SEMICOLON ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(code2) {
      return code2 === EXCLAMATIONMARK$3 || code2 === SEMICOLON ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(code2) {
      return code2 === SEMICOLON ? 2 : 0;
    },
    createList: NOOP,
    createSingleNodeList: NOOP,
    getFirstListNode: NOOP,
    getLastListNode: NOOP,
    parseWithFallback(consumer, fallback) {
      const startIndex = this.tokenIndex;
      try {
        return consumer.call(this);
      } catch (e) {
        if (onParseErrorThrow) {
          throw e;
        }
        this.skip(startIndex - this.tokenIndex);
        const fallbackNode = fallback.call(this);
        onParseErrorThrow = true;
        onParseError(e, fallbackNode);
        onParseErrorThrow = false;
        return fallbackNode;
      }
    },
    lookupNonWSType(offset) {
      let type;
      do {
        type = this.lookupType(offset++);
        if (type !== WhiteSpace$1 && type !== Comment$1) {
          return type;
        }
      } while (type !== NULL);
      return NULL;
    },
    charCodeAt(offset) {
      return offset >= 0 && offset < source.length ? source.charCodeAt(offset) : 0;
    },
    substring(offsetStart, offsetEnd) {
      return source.substring(offsetStart, offsetEnd);
    },
    substrToCursor(start) {
      return this.source.substring(start, this.tokenStart);
    },
    cmpChar(offset, charCode) {
      return cmpChar(source, offset, charCode);
    },
    cmpStr(offsetStart, offsetEnd, str) {
      return cmpStr(source, offsetStart, offsetEnd, str);
    },
    consume(tokenType2) {
      const start = this.tokenStart;
      this.eat(tokenType2);
      return this.substrToCursor(start);
    },
    consumeFunctionName() {
      const name2 = source.substring(this.tokenStart, this.tokenEnd - 1);
      this.eat(Function$2);
      return name2;
    },
    consumeNumber(type) {
      const number2 = source.substring(this.tokenStart, consumeNumber(source, this.tokenStart));
      this.eat(type);
      return number2;
    },
    eat(tokenType2) {
      if (this.tokenType !== tokenType2) {
        const tokenName = tokenNames[tokenType2].slice(0, -6).replace(/-/g, " ").replace(/^./, (m) => m.toUpperCase());
        let message = `${/[[\](){}]/.test(tokenName) ? `"${tokenName}"` : tokenName} is expected`;
        let offset = this.tokenStart;
        switch (tokenType2) {
          case Ident:
            if (this.tokenType === Function$2 || this.tokenType === Url$1) {
              offset = this.tokenEnd - 1;
              message = "Identifier is expected but function found";
            } else {
              message = "Identifier is expected";
            }
            break;
          case Hash$1:
            if (this.isDelim(NUMBERSIGN$4)) {
              this.next();
              offset++;
              message = "Name is expected";
            }
            break;
          case Percentage$1:
            if (this.tokenType === Number$2) {
              offset = this.tokenEnd;
              message = "Percent sign is expected";
            }
            break;
        }
        this.error(message, offset);
      }
      this.next();
    },
    eatIdent(name2) {
      if (this.tokenType !== Ident || this.lookupValue(0, name2) === false) {
        this.error(`Identifier "${name2}" is expected`);
      }
      this.next();
    },
    eatDelim(code2) {
      if (!this.isDelim(code2)) {
        this.error(`Delim "${String.fromCharCode(code2)}" is expected`);
      }
      this.next();
    },
    getLocation(start, end) {
      if (needPositions) {
        return locationMap.getLocationRange(
          start,
          end,
          filename
        );
      }
      return null;
    },
    getLocationFromList(list) {
      if (needPositions) {
        const head = this.getFirstListNode(list);
        const tail = this.getLastListNode(list);
        return locationMap.getLocationRange(
          head !== null ? head.loc.start.offset - locationMap.startOffset : this.tokenStart,
          tail !== null ? tail.loc.end.offset - locationMap.startOffset : this.tokenStart,
          filename
        );
      }
      return null;
    },
    error(message, offset) {
      const location = typeof offset !== "undefined" && offset < source.length ? locationMap.getLocation(offset) : this.eof ? locationMap.getLocation(findWhiteSpaceStart(source, source.length - 1)) : locationMap.getLocation(this.tokenStart);
      throw new SyntaxError$2(
        message || "Unexpected input",
        source,
        location.offset,
        location.line,
        location.column,
        locationMap.startLine,
        locationMap.startColumn
      );
    }
  });
  const createTokenIterateAPI = () => ({
    filename,
    source,
    tokenCount: parser.tokenCount,
    getTokenType: (index) => parser.getTokenType(index),
    getTokenTypeName: (index) => tokenNames[parser.getTokenType(index)],
    getTokenStart: (index) => parser.getTokenStart(index),
    getTokenEnd: (index) => parser.getTokenEnd(index),
    getTokenValue: (index) => parser.source.substring(parser.getTokenStart(index), parser.getTokenEnd(index)),
    substring: (start, end) => parser.source.substring(start, end),
    balance: parser.balance.subarray(0, parser.tokenCount + 1),
    isBlockOpenerTokenType: parser.isBlockOpenerTokenType,
    isBlockCloserTokenType: parser.isBlockCloserTokenType,
    getBlockTokenPairIndex: (index) => parser.getBlockTokenPairIndex(index),
    getLocation: (offset) => locationMap.getLocation(offset, filename),
    getRangeLocation: (start, end) => locationMap.getLocationRange(start, end, filename)
  });
  const parse2 = function(source_, options) {
    source = source_;
    options = options || {};
    parser.setSource(source, tokenize$1);
    locationMap.setSource(
      source,
      options.offset,
      options.line,
      options.column
    );
    filename = options.filename || "<unknown>";
    needPositions = Boolean(options.positions);
    onParseError = typeof options.onParseError === "function" ? options.onParseError : NOOP;
    onParseErrorThrow = false;
    parser.parseAtrulePrelude = "parseAtrulePrelude" in options ? Boolean(options.parseAtrulePrelude) : true;
    parser.parseRulePrelude = "parseRulePrelude" in options ? Boolean(options.parseRulePrelude) : true;
    parser.parseValue = "parseValue" in options ? Boolean(options.parseValue) : true;
    parser.parseCustomProperty = "parseCustomProperty" in options ? Boolean(options.parseCustomProperty) : false;
    const { context = "default", list = true, onComment, onToken } = options;
    if (context in parser.context === false) {
      throw new Error("Unknown context `" + context + "`");
    }
    Object.assign(parser, list ? listMethods : arrayMethods);
    if (Array.isArray(onToken)) {
      parser.forEachToken((type, start, end) => {
        onToken.push({ type, start, end });
      });
    } else if (typeof onToken === "function") {
      parser.forEachToken(onToken.bind(createTokenIterateAPI()));
    }
    if (typeof onComment === "function") {
      parser.forEachToken((type, start, end) => {
        if (type === Comment$1) {
          const loc = parser.getLocation(start, end);
          const value2 = cmpStr(source, end - 2, end, "*/") ? source.slice(start + 2, end - 2) : source.slice(start + 2, end);
          onComment(value2, loc);
        }
      });
    }
    const ast = parser.context[context].call(parser, options);
    if (!parser.eof) {
      parser.error();
    }
    return ast;
  };
  return Object.assign(parse2, {
    SyntaxError: SyntaxError$2,
    config: parser.config
  });
}
var sourceMapGenerator = {};
var base64Vlq = {};
var base64 = {};
var hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64;
  hasRequiredBase64 = 1;
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  base64.encode = function(number2) {
    if (0 <= number2 && number2 < intToCharMap.length) {
      return intToCharMap[number2];
    }
    throw new TypeError("Must be between 0 and 63: " + number2);
  };
  base64.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero2 = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero2 <= charCode && charCode <= nine) {
      return charCode - zero2 + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
  return base64;
}
var hasRequiredBase64Vlq;
function requireBase64Vlq() {
  if (hasRequiredBase64Vlq) return base64Vlq;
  hasRequiredBase64Vlq = 1;
  var base642 = requireBase64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  base64Vlq.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base642.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift2 = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base642.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift2);
      shift2 += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
  return base64Vlq;
}
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    var MAX_CACHED_INPUTS = 32;
    function lruMemoize(f) {
      var cache = [];
      return function(input) {
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].input === input) {
            var temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
        var result = f(input);
        cache.unshift({
          input,
          result
        });
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
        return result;
      };
    }
    var normalize = lruMemoize(function normalize2(aPath) {
      var path = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      var isAbsolute = exports.isAbsolute(path);
      var parts = [];
      var start = 0;
      var i = 0;
      while (true) {
        start = i;
        i = path.indexOf("/", start);
        if (i === -1) {
          parts.push(path.slice(start));
          break;
        } else {
          parts.push(path.slice(start, i));
          while (i < path.length && path[i] === "/") {
            i++;
          }
        }
      }
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    });
    exports.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    var supportsNullProto = (function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    })();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      var length2 = s.length;
      if (length2 < 9) {
        return false;
      }
      if (s.charCodeAt(length2 - 1) !== 95 || s.charCodeAt(length2 - 2) !== 95 || s.charCodeAt(length2 - 3) !== 111 || s.charCodeAt(length2 - 4) !== 116 || s.charCodeAt(length2 - 5) !== 111 || s.charCodeAt(length2 - 6) !== 114 || s.charCodeAt(length2 - 7) !== 112 || s.charCodeAt(length2 - 8) !== 95 || s.charCodeAt(length2 - 9) !== 95) {
        return false;
      }
      for (var i = length2 - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
      var cmp;
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
  })(util);
  return util;
}
var arraySet = {};
var hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var util2 = requireUtil();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util2.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util2.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  arraySet.ArraySet = ArraySet;
  return arraySet;
}
var mappingList = {};
var hasRequiredMappingList;
function requireMappingList() {
  if (hasRequiredMappingList) return mappingList;
  hasRequiredMappingList = 1;
  var util2 = requireUtil();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util2.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  mappingList.MappingList = MappingList;
  return mappingList;
}
var hasRequiredSourceMapGenerator;
function requireSourceMapGenerator() {
  if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
  hasRequiredSourceMapGenerator = 1;
  var base64VLQ = requireBase64Vlq();
  var util2 = requireUtil();
  var ArraySet = requireArraySet().ArraySet;
  var MappingList = requireMappingList().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util2.getArg(aArgs, "file", null);
    this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
    this._ignoreInvalidMapping = util2.getArg(aArgs, "ignoreInvalidMapping", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
      file: aSourceMapConsumer.file,
      sourceRoot
    }));
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util2.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util2.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util2.getArg(aArgs, "generated");
    var original = util2.getArg(aArgs, "original", null);
    var source = util2.getArg(aArgs, "source", null);
    var name2 = util2.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      if (this._validateMapping(generated, original, source, name2) === false) {
        return;
      }
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name2 != null) {
      name2 = String(name2);
      if (!this._names.has(name2)) {
        this._names.add(name2);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name: name2
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util2.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = /* @__PURE__ */ Object.create(null);
      }
      this._sourcesContents[util2.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util2.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util2.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util2.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util2.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name2 = mapping.name;
      if (name2 != null && !newNames.has(name2)) {
        newNames.add(name2);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util2.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      var message = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
      if (this._ignoreInvalidMapping) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message);
      }
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      var message = "Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      });
      if (this._ignoreInvalidMapping) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message);
      }
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util2.relative(aSourceRoot, source);
      }
      var key = util2.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  sourceMapGenerator.SourceMapGenerator = SourceMapGenerator;
  return sourceMapGenerator;
}
var sourceMapGeneratorExports = requireSourceMapGenerator();
const trackNodes = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function generateSourceMap(handlers) {
  const map = new sourceMapGeneratorExports.SourceMapGenerator();
  const generated = {
    line: 1,
    column: 0
  };
  const original = {
    line: 0,
    // should be zero to add first mapping
    column: 0
  };
  const activatedGenerated = {
    line: 1,
    column: 0
  };
  const activatedMapping = {
    generated: activatedGenerated
  };
  let line = 1;
  let column = 0;
  let sourceMappingActive = false;
  const origHandlersNode = handlers.node;
  handlers.node = function(node2) {
    if (node2.loc && node2.loc.start && trackNodes.has(node2.type)) {
      const nodeLine = node2.loc.start.line;
      const nodeColumn = node2.loc.start.column - 1;
      if (original.line !== nodeLine || original.column !== nodeColumn) {
        original.line = nodeLine;
        original.column = nodeColumn;
        generated.line = line;
        generated.column = column;
        if (sourceMappingActive) {
          sourceMappingActive = false;
          if (generated.line !== activatedGenerated.line || generated.column !== activatedGenerated.column) {
            map.addMapping(activatedMapping);
          }
        }
        sourceMappingActive = true;
        map.addMapping({
          source: node2.loc.source,
          original,
          generated
        });
      }
    }
    origHandlersNode.call(this, node2);
    if (sourceMappingActive && trackNodes.has(node2.type)) {
      activatedGenerated.line = line;
      activatedGenerated.column = column;
    }
  };
  const origHandlersEmit = handlers.emit;
  handlers.emit = function(value2, type, auto2) {
    for (let i = 0; i < value2.length; i++) {
      if (value2.charCodeAt(i) === 10) {
        line++;
        column = 0;
      } else {
        column++;
      }
    }
    origHandlersEmit(value2, type, auto2);
  };
  const origHandlersResult = handlers.result;
  handlers.result = function() {
    if (sourceMappingActive) {
      map.addMapping(activatedMapping);
    }
    return {
      css: origHandlersResult(),
      map
    };
  };
  return handlers;
}
const PLUSSIGN$9 = 43;
const HYPHENMINUS$6 = 45;
const code = (type, value2) => {
  if (type === Delim) {
    type = value2;
  }
  if (typeof type === "string") {
    type = Math.min(type.charCodeAt(0), 128) << 6;
  }
  return type << 1;
};
const specPairs = [
  [Ident, Ident],
  [Ident, Function$2],
  [Ident, Url$1],
  [Ident, BadUrl],
  [Ident, "-"],
  [Ident, Number$2],
  [Ident, Percentage$1],
  [Ident, Dimension$1],
  [Ident, CDC$1],
  [Ident, LeftParenthesis],
  [AtKeyword, Ident],
  [AtKeyword, Function$2],
  [AtKeyword, Url$1],
  [AtKeyword, BadUrl],
  [AtKeyword, "-"],
  [AtKeyword, Number$2],
  [AtKeyword, Percentage$1],
  [AtKeyword, Dimension$1],
  [AtKeyword, CDC$1],
  [Hash$1, Ident],
  [Hash$1, Function$2],
  [Hash$1, Url$1],
  [Hash$1, BadUrl],
  [Hash$1, "-"],
  [Hash$1, Number$2],
  [Hash$1, Percentage$1],
  [Hash$1, Dimension$1],
  [Hash$1, CDC$1],
  [Dimension$1, Ident],
  [Dimension$1, Function$2],
  [Dimension$1, Url$1],
  [Dimension$1, BadUrl],
  [Dimension$1, "-"],
  [Dimension$1, Number$2],
  [Dimension$1, Percentage$1],
  [Dimension$1, Dimension$1],
  [Dimension$1, CDC$1],
  ["#", Ident],
  ["#", Function$2],
  ["#", Url$1],
  ["#", BadUrl],
  ["#", "-"],
  ["#", Number$2],
  ["#", Percentage$1],
  ["#", Dimension$1],
  ["#", CDC$1],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", Ident],
  ["-", Function$2],
  ["-", Url$1],
  ["-", BadUrl],
  ["-", "-"],
  ["-", Number$2],
  ["-", Percentage$1],
  ["-", Dimension$1],
  ["-", CDC$1],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [Number$2, Ident],
  [Number$2, Function$2],
  [Number$2, Url$1],
  [Number$2, BadUrl],
  [Number$2, Number$2],
  [Number$2, Percentage$1],
  [Number$2, Dimension$1],
  [Number$2, "%"],
  [Number$2, CDC$1],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", Ident],
  ["@", Function$2],
  ["@", Url$1],
  ["@", BadUrl],
  ["@", "-"],
  ["@", CDC$1],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", Number$2],
  [".", Percentage$1],
  [".", Dimension$1],
  ["+", Number$2],
  ["+", Percentage$1],
  ["+", Dimension$1],
  ["/", "*"]
];
const safePairs = specPairs.concat([
  [Ident, Hash$1],
  [Dimension$1, Hash$1],
  [Hash$1, Hash$1],
  [AtKeyword, LeftParenthesis],
  [AtKeyword, String$2],
  [AtKeyword, Colon],
  [Percentage$1, Percentage$1],
  [Percentage$1, Dimension$1],
  [Percentage$1, Function$2],
  [Percentage$1, "-"],
  [RightParenthesis, Ident],
  [RightParenthesis, Function$2],
  [RightParenthesis, Percentage$1],
  [RightParenthesis, Dimension$1],
  [RightParenthesis, Hash$1],
  [RightParenthesis, "-"]
]);
function createMap(pairs) {
  const isWhiteSpaceRequired = new Set(
    pairs.map(([prev, next]) => code(prev) << 16 | code(next))
  );
  return function(prevCode, type, value2) {
    const nextCode = code(type, value2);
    const nextCharCode = value2.charCodeAt(0);
    const emitWs = nextCharCode === HYPHENMINUS$6 && type !== Ident && type !== Function$2 && type !== CDC$1 || nextCharCode === PLUSSIGN$9 ? isWhiteSpaceRequired.has((prevCode & 65534) << 16 | nextCharCode << 7) : isWhiteSpaceRequired.has((prevCode & 65534) << 16 | nextCode);
    return nextCode | emitWs;
  };
}
const spec = createMap(specPairs);
const safe = createMap(safePairs);
const tokenBefore = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe,
  spec
}, Symbol.toStringTag, { value: "Module" }));
const REVERSESOLIDUS = 92;
function processChildren(node2, delimeter) {
  if (typeof delimeter === "function") {
    let prev = null;
    node2.children.forEach((node3) => {
      if (prev !== null) {
        delimeter.call(this, prev);
      }
      this.node(node3);
      prev = node3;
    });
    return;
  }
  node2.children.forEach(this.node, this);
}
function createGenerator(config) {
  const types2 = /* @__PURE__ */ new Map();
  for (let [name2, item] of Object.entries(config.node)) {
    const fn = item.generate || item;
    if (typeof fn === "function") {
      types2.set(name2, item.generate || item);
    }
  }
  return function(node2, options) {
    let buffer = "";
    let prevCode = 0;
    let handlers = {
      node(node3) {
        if (types2.has(node3.type)) {
          types2.get(node3.type).call(publicApi, node3);
        } else {
          throw new Error("Unknown node type: " + node3.type);
        }
      },
      tokenBefore: safe,
      token(type, value2, suppressAutoWhiteSpace) {
        prevCode = this.tokenBefore(prevCode, type, value2);
        if (!suppressAutoWhiteSpace && prevCode & 1) {
          this.emit(" ", WhiteSpace$1, true);
        }
        this.emit(value2, type, false);
        if (type === Delim && value2.charCodeAt(0) === REVERSESOLIDUS) {
          this.emit("\n", WhiteSpace$1, true);
        }
      },
      emit(value2) {
        buffer += value2;
      },
      result() {
        return buffer;
      }
    };
    if (options) {
      if (typeof options.decorator === "function") {
        handlers = options.decorator(handlers);
      }
      if (options.sourceMap) {
        handlers = generateSourceMap(handlers);
      }
      if (options.mode in tokenBefore) {
        handlers.tokenBefore = tokenBefore[options.mode];
      }
    }
    const publicApi = {
      node: (node3) => handlers.node(node3),
      children: processChildren,
      token: (type, value2) => handlers.token(type, value2),
      tokenize: (raw) => tokenize$1(raw, (type, start, end) => {
        handlers.token(
          type,
          raw.slice(start, end),
          start !== 0
          // suppress auto whitespace for internal value tokens
        );
      })
    };
    handlers.node(node2);
    return handlers.result();
  };
}
function createConvertor(walk2) {
  return {
    fromPlainObject(ast) {
      walk2(ast, {
        enter(node2) {
          if (node2.children && node2.children instanceof List === false) {
            node2.children = new List().fromArray(node2.children);
          }
        }
      });
      return ast;
    },
    toPlainObject(ast) {
      walk2(ast, {
        leave(node2) {
          if (node2.children && node2.children instanceof List) {
            node2.children = node2.children.toArray();
          }
        }
      });
      return ast;
    }
  };
}
const { hasOwnProperty: hasOwnProperty$3 } = Object.prototype;
const noop$2 = function() {
};
function ensureFunction$1(value2) {
  return typeof value2 === "function" ? value2 : noop$2;
}
function invokeForType(fn, type) {
  return function(node2, item, list) {
    if (node2.type === type) {
      fn.call(this, node2, item, list);
    }
  };
}
function getWalkersFromStructure(name2, nodeType) {
  const structure2 = nodeType.structure;
  const walkers = [];
  for (const key in structure2) {
    if (hasOwnProperty$3.call(structure2, key) === false) {
      continue;
    }
    let fieldTypes = structure2[key];
    const walker = {
      name: key,
      type: false,
      nullable: false
    };
    if (!Array.isArray(fieldTypes)) {
      fieldTypes = [fieldTypes];
    }
    for (const fieldType of fieldTypes) {
      if (fieldType === null) {
        walker.nullable = true;
      } else if (typeof fieldType === "string") {
        walker.type = "node";
      } else if (Array.isArray(fieldType)) {
        walker.type = "list";
      }
    }
    if (walker.type) {
      walkers.push(walker);
    }
  }
  if (walkers.length) {
    return {
      context: nodeType.walkContext,
      fields: walkers
    };
  }
  return null;
}
function getTypesFromConfig(config) {
  const types2 = {};
  for (const name2 in config.node) {
    if (hasOwnProperty$3.call(config.node, name2)) {
      const nodeType = config.node[name2];
      if (!nodeType.structure) {
        throw new Error("Missed `structure` field in `" + name2 + "` node type definition");
      }
      types2[name2] = getWalkersFromStructure(name2, nodeType);
    }
  }
  return types2;
}
function createTypeIterator(config, reverse) {
  const fields = config.fields.slice();
  const contextName = config.context;
  const useContext = typeof contextName === "string";
  if (reverse) {
    fields.reverse();
  }
  return function(node2, context, walk2, walkReducer) {
    let prevContextValue;
    if (useContext) {
      prevContextValue = context[contextName];
      context[contextName] = node2;
    }
    for (const field of fields) {
      const ref2 = node2[field.name];
      if (!field.nullable || ref2) {
        if (field.type === "list") {
          const breakWalk = reverse ? ref2.reduceRight(walkReducer, false) : ref2.reduce(walkReducer, false);
          if (breakWalk) {
            return true;
          }
        } else if (walk2(ref2)) {
          return true;
        }
      }
    }
    if (useContext) {
      context[contextName] = prevContextValue;
    }
  };
}
function createFastTraveralMap({
  StyleSheet: StyleSheet2,
  Atrule: Atrule2,
  Rule: Rule2,
  Block: Block2,
  DeclarationList: DeclarationList2
}) {
  return {
    Atrule: {
      StyleSheet: StyleSheet2,
      Atrule: Atrule2,
      Rule: Rule2,
      Block: Block2
    },
    Rule: {
      StyleSheet: StyleSheet2,
      Atrule: Atrule2,
      Rule: Rule2,
      Block: Block2
    },
    Declaration: {
      StyleSheet: StyleSheet2,
      Atrule: Atrule2,
      Rule: Rule2,
      Block: Block2,
      DeclarationList: DeclarationList2
    }
  };
}
function createWalker(config) {
  const types2 = getTypesFromConfig(config);
  const iteratorsNatural = {};
  const iteratorsReverse = {};
  const breakWalk = /* @__PURE__ */ Symbol("break-walk");
  const skipNode = /* @__PURE__ */ Symbol("skip-node");
  for (const name2 in types2) {
    if (hasOwnProperty$3.call(types2, name2) && types2[name2] !== null) {
      iteratorsNatural[name2] = createTypeIterator(types2[name2], false);
      iteratorsReverse[name2] = createTypeIterator(types2[name2], true);
    }
  }
  const fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
  const fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);
  const walk2 = function(root, options) {
    function walkNode(node2, item, list) {
      const enterRet = enter.call(context, node2, item, list);
      if (enterRet === breakWalk) {
        return true;
      }
      if (enterRet === skipNode) {
        return false;
      }
      if (iterators.hasOwnProperty(node2.type)) {
        if (iterators[node2.type](node2, context, walkNode, walkReducer)) {
          return true;
        }
      }
      if (leave.call(context, node2, item, list) === breakWalk) {
        return true;
      }
      return false;
    }
    let enter = noop$2;
    let leave = noop$2;
    let iterators = iteratorsNatural;
    let walkReducer = (ret, data, item, list) => ret || walkNode(data, item, list);
    const context = {
      break: breakWalk,
      skip: skipNode,
      root,
      stylesheet: null,
      atrule: null,
      atrulePrelude: null,
      rule: null,
      selector: null,
      block: null,
      declaration: null,
      function: null
    };
    if (typeof options === "function") {
      enter = options;
    } else if (options) {
      enter = ensureFunction$1(options.enter);
      leave = ensureFunction$1(options.leave);
      if (options.reverse) {
        iterators = iteratorsReverse;
      }
      if (options.visit) {
        if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
          iterators = options.reverse ? fastTraversalIteratorsReverse[options.visit] : fastTraversalIteratorsNatural[options.visit];
        } else if (!types2.hasOwnProperty(options.visit)) {
          throw new Error("Bad value `" + options.visit + "` for `visit` option (should be: " + Object.keys(types2).sort().join(", ") + ")");
        }
        enter = invokeForType(enter, options.visit);
        leave = invokeForType(leave, options.visit);
      }
    }
    if (enter === noop$2 && leave === noop$2) {
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    }
    walkNode(root);
  };
  walk2.break = breakWalk;
  walk2.skip = skipNode;
  walk2.find = function(ast, fn) {
    let found = null;
    walk2(ast, function(node2, item, list) {
      if (fn.call(this, node2, item, list)) {
        found = node2;
        return breakWalk;
      }
    });
    return found;
  };
  walk2.findLast = function(ast, fn) {
    let found = null;
    walk2(ast, {
      reverse: true,
      enter(node2, item, list) {
        if (fn.call(this, node2, item, list)) {
          found = node2;
          return breakWalk;
        }
      }
    });
    return found;
  };
  walk2.findAll = function(ast, fn) {
    const found = [];
    walk2(ast, function(node2, item, list) {
      if (fn.call(this, node2, item, list)) {
        found.push(node2);
      }
    });
    return found;
  };
  return walk2;
}
function noop$1(value2) {
  return value2;
}
function generateMultiplier(multiplier) {
  const { min, max, comma: comma2 } = multiplier;
  if (min === 0 && max === 0) {
    return comma2 ? "#?" : "*";
  }
  if (min === 0 && max === 1) {
    return "?";
  }
  if (min === 1 && max === 0) {
    return comma2 ? "#" : "+";
  }
  if (min === 1 && max === 1) {
    return "";
  }
  return (comma2 ? "#" : "") + (min === max ? "{" + min + "}" : "{" + min + "," + (max !== 0 ? max : "") + "}");
}
function generateTypeOpts(node2) {
  switch (node2.type) {
    case "Range":
      return " [" + (node2.min === null ? "-∞" : node2.min) + "," + (node2.max === null ? "∞" : node2.max) + "]";
    default:
      throw new Error("Unknown node type `" + node2.type + "`");
  }
}
function generateSequence(node2, decorate, forceBraces, compact) {
  const combinator = node2.combinator === " " || compact ? node2.combinator : " " + node2.combinator + " ";
  const result = node2.terms.map((term) => internalGenerate(term, decorate, forceBraces, compact)).join(combinator);
  if (node2.explicit || forceBraces) {
    return (compact || result[0] === "," ? "[" : "[ ") + result + (compact ? "]" : " ]");
  }
  return result;
}
function internalGenerate(node2, decorate, forceBraces, compact) {
  let result;
  switch (node2.type) {
    case "Group":
      result = generateSequence(node2, decorate, forceBraces, compact) + (node2.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return internalGenerate(node2.term, decorate, forceBraces, compact) + decorate(generateMultiplier(node2), node2);
    case "Boolean":
      result = "<boolean-expr[" + internalGenerate(node2.term, decorate, forceBraces, compact) + "]>";
      break;
    case "Type":
      result = "<" + node2.name + (node2.opts ? decorate(generateTypeOpts(node2.opts), node2.opts) : "") + ">";
      break;
    case "Property":
      result = "<'" + node2.name + "'>";
      break;
    case "Keyword":
      result = node2.name;
      break;
    case "AtKeyword":
      result = "@" + node2.name;
      break;
    case "Function":
      result = node2.name + "(";
      break;
    case "String":
    case "Token":
      result = node2.value;
      break;
    case "Comma":
      result = ",";
      break;
    default:
      throw new Error("Unknown node type `" + node2.type + "`");
  }
  return decorate(result, node2);
}
function generate$O(node2, options) {
  let decorate = noop$1;
  let forceBraces = false;
  let compact = false;
  if (typeof options === "function") {
    decorate = options;
  } else if (options) {
    forceBraces = Boolean(options.forceBraces);
    compact = Boolean(options.compact);
    if (typeof options.decorate === "function") {
      decorate = options.decorate;
    }
  }
  return internalGenerate(node2, decorate, forceBraces, compact);
}
const defaultLoc = { offset: 0, line: 1, column: 1 };
function locateMismatch(matchResult, node2) {
  const tokens = matchResult.tokens;
  const longestMatch = matchResult.longestMatch;
  const mismatchNode = longestMatch < tokens.length ? tokens[longestMatch].node || null : null;
  const badNode = mismatchNode !== node2 ? mismatchNode : null;
  let mismatchOffset = 0;
  let mismatchLength = 0;
  let entries = 0;
  let css = "";
  let start;
  let end;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].value;
    if (i === longestMatch) {
      mismatchLength = token.length;
      mismatchOffset = css.length;
    }
    if (badNode !== null && tokens[i].node === badNode) {
      if (i <= longestMatch) {
        entries++;
      } else {
        entries = 0;
      }
    }
    css += token;
  }
  if (longestMatch === tokens.length || entries > 1) {
    start = fromLoc(badNode || node2, "end") || buildLoc(defaultLoc, css);
    end = buildLoc(start);
  } else {
    start = fromLoc(badNode, "start") || buildLoc(fromLoc(node2, "start") || defaultLoc, css.slice(0, mismatchOffset));
    end = fromLoc(badNode, "end") || buildLoc(start, css.substr(mismatchOffset, mismatchLength));
  }
  return {
    css,
    mismatchOffset,
    mismatchLength,
    start,
    end
  };
}
function fromLoc(node2, point) {
  const value2 = node2 && node2.loc && node2.loc[point];
  if (value2) {
    return "line" in value2 ? buildLoc(value2) : value2;
  }
  return null;
}
function buildLoc({ offset, line, column }, extra) {
  const loc = {
    offset,
    line,
    column
  };
  if (extra) {
    const lines = extra.split(/\n|\r\n?|\f/);
    loc.offset += extra.length;
    loc.line += lines.length - 1;
    loc.column = lines.length === 1 ? loc.column + extra.length : lines.pop().length + 1;
  }
  return loc;
}
const SyntaxReferenceError = function(type, referenceName) {
  const error = createCustomError(
    "SyntaxReferenceError",
    type + (referenceName ? " `" + referenceName + "`" : "")
  );
  error.reference = referenceName;
  return error;
};
const SyntaxMatchError = function(message, syntax2, node2, matchResult) {
  const error = createCustomError("SyntaxMatchError", message);
  const {
    css,
    mismatchOffset,
    mismatchLength,
    start,
    end
  } = locateMismatch(matchResult, node2);
  error.rawMessage = message;
  error.syntax = syntax2 ? generate$O(syntax2) : "<generic>";
  error.css = css;
  error.mismatchOffset = mismatchOffset;
  error.mismatchLength = mismatchLength;
  error.message = message + "\n  syntax: " + error.syntax + "\n   value: " + (css || "<empty string>") + "\n  --------" + new Array(error.mismatchOffset + 1).join("-") + "^";
  Object.assign(error, start);
  error.loc = {
    source: node2 && node2.loc && node2.loc.source || "<unknown>",
    start,
    end
  };
  return error;
};
const keywords = /* @__PURE__ */ new Map();
const properties = /* @__PURE__ */ new Map();
const HYPHENMINUS$5 = 45;
const keyword = getKeywordDescriptor;
const property = getPropertyDescriptor;
function isCustomProperty(str, offset) {
  offset = offset || 0;
  return str.length - offset >= 2 && str.charCodeAt(offset) === HYPHENMINUS$5 && str.charCodeAt(offset + 1) === HYPHENMINUS$5;
}
function getVendorPrefix(str, offset) {
  offset = offset || 0;
  if (str.length - offset >= 3) {
    if (str.charCodeAt(offset) === HYPHENMINUS$5 && str.charCodeAt(offset + 1) !== HYPHENMINUS$5) {
      const secondDashIndex = str.indexOf("-", offset + 2);
      if (secondDashIndex !== -1) {
        return str.substring(offset, secondDashIndex + 1);
      }
    }
  }
  return "";
}
function getKeywordDescriptor(keyword2) {
  if (keywords.has(keyword2)) {
    return keywords.get(keyword2);
  }
  const name2 = keyword2.toLowerCase();
  let descriptor = keywords.get(name2);
  if (descriptor === void 0) {
    const custom2 = isCustomProperty(name2, 0);
    const vendor = !custom2 ? getVendorPrefix(name2, 0) : "";
    descriptor = Object.freeze({
      basename: name2.substr(vendor.length),
      name: name2,
      prefix: vendor,
      vendor,
      custom: custom2
    });
  }
  keywords.set(keyword2, descriptor);
  return descriptor;
}
function getPropertyDescriptor(property2) {
  if (properties.has(property2)) {
    return properties.get(property2);
  }
  let name2 = property2;
  let hack = property2[0];
  if (hack === "/") {
    hack = property2[1] === "/" ? "//" : "/";
  } else if (hack !== "_" && hack !== "*" && hack !== "$" && hack !== "#" && hack !== "+" && hack !== "&") {
    hack = "";
  }
  const custom2 = isCustomProperty(name2, hack.length);
  if (!custom2) {
    name2 = name2.toLowerCase();
    if (properties.has(name2)) {
      const descriptor2 = properties.get(name2);
      properties.set(property2, descriptor2);
      return descriptor2;
    }
  }
  const vendor = !custom2 ? getVendorPrefix(name2, hack.length) : "";
  const prefix = name2.substr(0, hack.length + vendor.length);
  const descriptor = Object.freeze({
    basename: name2.substr(prefix.length),
    name: name2.substr(hack.length),
    hack,
    vendor,
    prefix,
    custom: custom2
  });
  properties.set(property2, descriptor);
  return descriptor;
}
const cssWideKeywords = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
];
const PLUSSIGN$8 = 43;
const HYPHENMINUS$4 = 45;
const N$3 = 110;
const DISALLOW_SIGN$1 = true;
const ALLOW_SIGN$1 = false;
function isDelim$1(token, code2) {
  return token !== null && token.type === Delim && token.value.charCodeAt(0) === code2;
}
function skipSC(token, offset, getNextToken) {
  while (token !== null && (token.type === WhiteSpace$1 || token.type === Comment$1)) {
    token = getNextToken(++offset);
  }
  return offset;
}
function checkInteger$1(token, valueOffset, disallowSign, offset) {
  if (!token) {
    return 0;
  }
  const code2 = token.value.charCodeAt(valueOffset);
  if (code2 === PLUSSIGN$8 || code2 === HYPHENMINUS$4) {
    if (disallowSign) {
      return 0;
    }
    valueOffset++;
  }
  for (; valueOffset < token.value.length; valueOffset++) {
    if (!isDigit(token.value.charCodeAt(valueOffset))) {
      return 0;
    }
  }
  return offset + 1;
}
function consumeB$1(token, offset_, getNextToken) {
  let sign = false;
  let offset = skipSC(token, offset_, getNextToken);
  token = getNextToken(offset);
  if (token === null) {
    return offset_;
  }
  if (token.type !== Number$2) {
    if (isDelim$1(token, PLUSSIGN$8) || isDelim$1(token, HYPHENMINUS$4)) {
      sign = true;
      offset = skipSC(getNextToken(++offset), offset, getNextToken);
      token = getNextToken(offset);
      if (token === null || token.type !== Number$2) {
        return 0;
      }
    } else {
      return offset_;
    }
  }
  if (!sign) {
    const code2 = token.value.charCodeAt(0);
    if (code2 !== PLUSSIGN$8 && code2 !== HYPHENMINUS$4) {
      return 0;
    }
  }
  return checkInteger$1(token, sign ? 0 : 1, sign, offset);
}
function anPlusB(token, getNextToken) {
  let offset = 0;
  if (!token) {
    return 0;
  }
  if (token.type === Number$2) {
    return checkInteger$1(token, 0, ALLOW_SIGN$1, offset);
  } else if (token.type === Ident && token.value.charCodeAt(0) === HYPHENMINUS$4) {
    if (!cmpChar(token.value, 1, N$3)) {
      return 0;
    }
    switch (token.value.length) {
      // -n
      // -n <signed-integer>
      // -n ['+' | '-'] <signless-integer>
      case 2:
        return consumeB$1(getNextToken(++offset), offset, getNextToken);
      // -n- <signless-integer>
      case 3:
        if (token.value.charCodeAt(2) !== HYPHENMINUS$4) {
          return 0;
        }
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger$1(token, 0, DISALLOW_SIGN$1, offset);
      // <dashndashdigit-ident>
      default:
        if (token.value.charCodeAt(2) !== HYPHENMINUS$4) {
          return 0;
        }
        return checkInteger$1(token, 3, DISALLOW_SIGN$1, offset);
    }
  } else if (token.type === Ident || isDelim$1(token, PLUSSIGN$8) && getNextToken(offset + 1).type === Ident) {
    if (token.type !== Ident) {
      token = getNextToken(++offset);
    }
    if (token === null || !cmpChar(token.value, 0, N$3)) {
      return 0;
    }
    switch (token.value.length) {
      // '+'? n
      // '+'? n <signed-integer>
      // '+'? n ['+' | '-'] <signless-integer>
      case 1:
        return consumeB$1(getNextToken(++offset), offset, getNextToken);
      // '+'? n- <signless-integer>
      case 2:
        if (token.value.charCodeAt(1) !== HYPHENMINUS$4) {
          return 0;
        }
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger$1(token, 0, DISALLOW_SIGN$1, offset);
      // '+'? <ndashdigit-ident>
      default:
        if (token.value.charCodeAt(1) !== HYPHENMINUS$4) {
          return 0;
        }
        return checkInteger$1(token, 2, DISALLOW_SIGN$1, offset);
    }
  } else if (token.type === Dimension$1) {
    let code2 = token.value.charCodeAt(0);
    let sign = code2 === PLUSSIGN$8 || code2 === HYPHENMINUS$4 ? 1 : 0;
    let i = sign;
    for (; i < token.value.length; i++) {
      if (!isDigit(token.value.charCodeAt(i))) {
        break;
      }
    }
    if (i === sign) {
      return 0;
    }
    if (!cmpChar(token.value, i, N$3)) {
      return 0;
    }
    if (i + 1 === token.value.length) {
      return consumeB$1(getNextToken(++offset), offset, getNextToken);
    } else {
      if (token.value.charCodeAt(i + 1) !== HYPHENMINUS$4) {
        return 0;
      }
      if (i + 2 === token.value.length) {
        offset = skipSC(getNextToken(++offset), offset, getNextToken);
        token = getNextToken(offset);
        return checkInteger$1(token, 0, DISALLOW_SIGN$1, offset);
      } else {
        return checkInteger$1(token, i + 2, DISALLOW_SIGN$1, offset);
      }
    }
  }
  return 0;
}
const PLUSSIGN$7 = 43;
const HYPHENMINUS$3 = 45;
const QUESTIONMARK$2 = 63;
const U$1 = 117;
function isDelim(token, code2) {
  return token !== null && token.type === Delim && token.value.charCodeAt(0) === code2;
}
function startsWith$1(token, code2) {
  return token.value.charCodeAt(0) === code2;
}
function hexSequence(token, offset, allowDash) {
  let hexlen = 0;
  for (let pos = offset; pos < token.value.length; pos++) {
    const code2 = token.value.charCodeAt(pos);
    if (code2 === HYPHENMINUS$3 && allowDash && hexlen !== 0) {
      hexSequence(token, offset + hexlen + 1, false);
      return 6;
    }
    if (!isHexDigit(code2)) {
      return 0;
    }
    if (++hexlen > 6) {
      return 0;
    }
  }
  return hexlen;
}
function withQuestionMarkSequence(consumed, length2, getNextToken) {
  if (!consumed) {
    return 0;
  }
  while (isDelim(getNextToken(length2), QUESTIONMARK$2)) {
    if (++consumed > 6) {
      return 0;
    }
    length2++;
  }
  return length2;
}
function urange(token, getNextToken) {
  let length2 = 0;
  if (token === null || token.type !== Ident || !cmpChar(token.value, 0, U$1)) {
    return 0;
  }
  token = getNextToken(++length2);
  if (token === null) {
    return 0;
  }
  if (isDelim(token, PLUSSIGN$7)) {
    token = getNextToken(++length2);
    if (token === null) {
      return 0;
    }
    if (token.type === Ident) {
      return withQuestionMarkSequence(hexSequence(token, 0, true), ++length2, getNextToken);
    }
    if (isDelim(token, QUESTIONMARK$2)) {
      return withQuestionMarkSequence(1, ++length2, getNextToken);
    }
    return 0;
  }
  if (token.type === Number$2) {
    const consumedHexLength = hexSequence(token, 1, true);
    if (consumedHexLength === 0) {
      return 0;
    }
    token = getNextToken(++length2);
    if (token === null) {
      return length2;
    }
    if (token.type === Dimension$1 || token.type === Number$2) {
      if (!startsWith$1(token, HYPHENMINUS$3) || !hexSequence(token, 1, false)) {
        return 0;
      }
      return length2 + 1;
    }
    return withQuestionMarkSequence(consumedHexLength, length2, getNextToken);
  }
  if (token.type === Dimension$1) {
    return withQuestionMarkSequence(hexSequence(token, 1, true), ++length2, getNextToken);
  }
  return 0;
}
const calcFunctionNames = [
  "calc(",
  "-moz-calc(",
  "-webkit-calc("
];
const comparisonFunctionNames = [
  "min(",
  "max(",
  "clamp("
];
const steppedValueFunctionNames = [
  "round(",
  "mod(",
  "rem("
];
const trigNumberFunctionNames = [
  "sin(",
  "cos(",
  "tan("
];
const trigAngleFunctionNames = [
  "asin(",
  "acos(",
  "atan(",
  "atan2("
];
const otherNumberFunctionNames = [
  "pow(",
  "sqrt(",
  "log(",
  "exp(",
  "sign("
];
const expNumberDimensionPercentageFunctionNames = [
  "hypot("
];
const signFunctionNames = [
  "abs("
];
const numberFunctionNames = [
  ...calcFunctionNames,
  ...comparisonFunctionNames,
  ...steppedValueFunctionNames,
  ...trigNumberFunctionNames,
  ...otherNumberFunctionNames,
  ...expNumberDimensionPercentageFunctionNames,
  ...signFunctionNames
];
const percentageFunctionNames = [
  ...calcFunctionNames,
  ...comparisonFunctionNames,
  ...steppedValueFunctionNames,
  ...expNumberDimensionPercentageFunctionNames,
  ...signFunctionNames
];
const dimensionFunctionNames = [
  ...calcFunctionNames,
  ...comparisonFunctionNames,
  ...steppedValueFunctionNames,
  ...trigAngleFunctionNames,
  ...expNumberDimensionPercentageFunctionNames,
  ...signFunctionNames
];
const balancePair = /* @__PURE__ */ new Map([
  [Function$2, RightParenthesis],
  [LeftParenthesis, RightParenthesis],
  [LeftSquareBracket, RightSquareBracket],
  [LeftCurlyBracket, RightCurlyBracket]
]);
function charCodeAt(str, index) {
  return index < str.length ? str.charCodeAt(index) : 0;
}
function eqStr(actual, expected) {
  return cmpStr(actual, 0, actual.length, expected);
}
function eqStrAny(actual, expected) {
  for (let i = 0; i < expected.length; i++) {
    if (eqStr(actual, expected[i])) {
      return true;
    }
  }
  return false;
}
function isPostfixIeHack(str, offset) {
  if (offset !== str.length - 2) {
    return false;
  }
  return charCodeAt(str, offset) === 92 && // U+005C REVERSE SOLIDUS (\)
  isDigit(charCodeAt(str, offset + 1));
}
function outOfRange(opts, value2, numEnd) {
  if (opts && opts.type === "Range") {
    const num = Number(
      numEnd !== void 0 && numEnd !== value2.length ? value2.substr(0, numEnd) : value2
    );
    if (isNaN(num)) {
      return true;
    }
    if (opts.min !== null && num < opts.min && typeof opts.min !== "string") {
      return true;
    }
    if (opts.max !== null && num > opts.max && typeof opts.max !== "string") {
      return true;
    }
  }
  return false;
}
function consumeFunction(token, getNextToken) {
  let balanceCloseType = 0;
  let balanceStash = [];
  let length2 = 0;
  scan:
    do {
      switch (token.type) {
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          if (balanceStash.length === 0) {
            length2++;
            break scan;
          }
          break;
        case Function$2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair.get(token.type);
          break;
      }
      length2++;
    } while (token = getNextToken(length2));
  return length2;
}
function math(next, functionNames) {
  return function(token, getNextToken, opts) {
    if (token === null) {
      return 0;
    }
    if (token.type === Function$2 && eqStrAny(token.value, functionNames)) {
      return consumeFunction(token, getNextToken);
    }
    return next(token, getNextToken, opts);
  };
}
function tokenType(expectedTokenType) {
  return function(token) {
    if (token === null || token.type !== expectedTokenType) {
      return 0;
    }
    return 1;
  };
}
function customIdent(token) {
  if (token === null || token.type !== Ident) {
    return 0;
  }
  const name2 = token.value.toLowerCase();
  if (eqStrAny(name2, cssWideKeywords)) {
    return 0;
  }
  if (eqStr(name2, "default")) {
    return 0;
  }
  return 1;
}
function dashedIdent(token) {
  if (token === null || token.type !== Ident) {
    return 0;
  }
  if (charCodeAt(token.value, 0) !== 45 || charCodeAt(token.value, 1) !== 45) {
    return 0;
  }
  return 1;
}
function customPropertyName(token) {
  if (!dashedIdent(token)) {
    return 0;
  }
  if (token.value === "--") {
    return 0;
  }
  return 1;
}
function hexColor(token) {
  if (token === null || token.type !== Hash$1) {
    return 0;
  }
  const length2 = token.value.length;
  if (length2 !== 4 && length2 !== 5 && length2 !== 7 && length2 !== 9) {
    return 0;
  }
  for (let i = 1; i < length2; i++) {
    if (!isHexDigit(charCodeAt(token.value, i))) {
      return 0;
    }
  }
  return 1;
}
function idSelector(token) {
  if (token === null || token.type !== Hash$1) {
    return 0;
  }
  if (!isIdentifierStart(charCodeAt(token.value, 1), charCodeAt(token.value, 2), charCodeAt(token.value, 3))) {
    return 0;
  }
  return 1;
}
function declarationValue(token, getNextToken) {
  if (!token) {
    return 0;
  }
  let balanceCloseType = 0;
  let balanceStash = [];
  let length2 = 0;
  scan:
    do {
      switch (token.type) {
        // ... <bad-string-token>, <bad-url-token>,
        case BadString:
        case BadUrl:
          break scan;
        // ... unmatched <)-token>, <]-token>, or <}-token>,
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          break;
        // ... or top-level <semicolon-token> tokens
        case Semicolon:
          if (balanceCloseType === 0) {
            break scan;
          }
          break;
        // ... or <delim-token> tokens with a value of "!"
        case Delim:
          if (balanceCloseType === 0 && token.value === "!") {
            break scan;
          }
          break;
        case Function$2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair.get(token.type);
          break;
      }
      length2++;
    } while (token = getNextToken(length2));
  return length2;
}
function anyValue(token, getNextToken) {
  if (!token) {
    return 0;
  }
  let balanceCloseType = 0;
  let balanceStash = [];
  let length2 = 0;
  scan:
    do {
      switch (token.type) {
        // ... does not contain <bad-string-token>, <bad-url-token>,
        case BadString:
        case BadUrl:
          break scan;
        // ... unmatched <)-token>, <]-token>, or <}-token>,
        case RightCurlyBracket:
        case RightParenthesis:
        case RightSquareBracket:
          if (token.type !== balanceCloseType) {
            break scan;
          }
          balanceCloseType = balanceStash.pop();
          break;
        case Function$2:
        case LeftParenthesis:
        case LeftSquareBracket:
        case LeftCurlyBracket:
          balanceStash.push(balanceCloseType);
          balanceCloseType = balancePair.get(token.type);
          break;
      }
      length2++;
    } while (token = getNextToken(length2));
  return length2;
}
function dimension(type) {
  if (type) {
    type = new Set(type);
  }
  return function(token, getNextToken, opts) {
    if (token === null || token.type !== Dimension$1) {
      return 0;
    }
    const numberEnd = consumeNumber(token.value, 0);
    if (type !== null) {
      const reverseSolidusOffset = token.value.indexOf("\\", numberEnd);
      const unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset) ? token.value.substr(numberEnd) : token.value.substring(numberEnd, reverseSolidusOffset);
      if (type.has(unit.toLowerCase()) === false) {
        return 0;
      }
    }
    if (outOfRange(opts, token.value, numberEnd)) {
      return 0;
    }
    return 1;
  };
}
function percentage(token, getNextToken, opts) {
  if (token === null || token.type !== Percentage$1) {
    return 0;
  }
  if (outOfRange(opts, token.value, token.value.length - 1)) {
    return 0;
  }
  return 1;
}
function zero(next) {
  if (typeof next !== "function") {
    next = function() {
      return 0;
    };
  }
  return function(token, getNextToken, opts) {
    if (token !== null && token.type === Number$2) {
      if (Number(token.value) === 0) {
        return 1;
      }
    }
    return next(token, getNextToken, opts);
  };
}
function number(token, getNextToken, opts) {
  if (token === null) {
    return 0;
  }
  const numberEnd = consumeNumber(token.value, 0);
  const isNumber = numberEnd === token.value.length;
  if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
    return 0;
  }
  if (outOfRange(opts, token.value, numberEnd)) {
    return 0;
  }
  return 1;
}
function integer(token, getNextToken, opts) {
  if (token === null || token.type !== Number$2) {
    return 0;
  }
  let i = charCodeAt(token.value, 0) === 43 || // U+002B PLUS SIGN (+)
  charCodeAt(token.value, 0) === 45 ? 1 : 0;
  for (; i < token.value.length; i++) {
    if (!isDigit(charCodeAt(token.value, i))) {
      return 0;
    }
  }
  if (outOfRange(opts, token.value, i)) {
    return 0;
  }
  return 1;
}
const tokenTypes = {
  "ident-token": tokenType(Ident),
  "function-token": tokenType(Function$2),
  "at-keyword-token": tokenType(AtKeyword),
  "hash-token": tokenType(Hash$1),
  "string-token": tokenType(String$2),
  "bad-string-token": tokenType(BadString),
  "url-token": tokenType(Url$1),
  "bad-url-token": tokenType(BadUrl),
  "delim-token": tokenType(Delim),
  "number-token": tokenType(Number$2),
  "percentage-token": tokenType(Percentage$1),
  "dimension-token": tokenType(Dimension$1),
  "whitespace-token": tokenType(WhiteSpace$1),
  "CDO-token": tokenType(CDO$1),
  "CDC-token": tokenType(CDC$1),
  "colon-token": tokenType(Colon),
  "semicolon-token": tokenType(Semicolon),
  "comma-token": tokenType(Comma),
  "[-token": tokenType(LeftSquareBracket),
  "]-token": tokenType(RightSquareBracket),
  "(-token": tokenType(LeftParenthesis),
  ")-token": tokenType(RightParenthesis),
  "{-token": tokenType(LeftCurlyBracket),
  "}-token": tokenType(RightCurlyBracket)
};
const productionTypes = {
  // token type aliases
  "string": tokenType(String$2),
  "ident": tokenType(Ident),
  // percentage
  "percentage": math(percentage, percentageFunctionNames),
  // numeric
  "zero": zero(),
  "number": math(number, numberFunctionNames),
  "integer": math(integer, numberFunctionNames),
  // complex types
  "custom-ident": customIdent,
  "dashed-ident": dashedIdent,
  "custom-property-name": customPropertyName,
  "hex-color": hexColor,
  "id-selector": idSelector,
  // element( <id-selector> )
  "an-plus-b": anPlusB,
  "urange": urange,
  "declaration-value": declarationValue,
  "any-value": anyValue
};
const unitGroups = [
  "length",
  "angle",
  "time",
  "frequency",
  "resolution",
  "flex",
  "decibel",
  "semitones"
];
function createDemensionTypes(units2) {
  const {
    angle: angle2,
    decibel: decibel2,
    frequency: frequency2,
    flex: flex2,
    length: length2,
    resolution: resolution2,
    semitones: semitones2,
    time: time2
  } = units2 || {};
  return {
    "dimension": math(dimension(null), dimensionFunctionNames),
    "angle": math(dimension(angle2), dimensionFunctionNames),
    "decibel": math(dimension(decibel2), dimensionFunctionNames),
    "frequency": math(dimension(frequency2), dimensionFunctionNames),
    "flex": math(dimension(flex2), dimensionFunctionNames),
    "length": math(zero(dimension(length2)), dimensionFunctionNames),
    "resolution": math(dimension(resolution2), dimensionFunctionNames),
    "semitones": math(dimension(semitones2), dimensionFunctionNames),
    "time": math(dimension(time2), dimensionFunctionNames)
  };
}
function createAttrUnit(units2) {
  const unitSet = /* @__PURE__ */ new Set();
  for (const group of unitGroups) {
    if (Array.isArray(units2[group])) {
      for (const unit of units2[group]) {
        unitSet.add(unit.toLowerCase());
      }
    }
  }
  return function attrUnit(token) {
    if (token === null) {
      return 0;
    }
    if (token.type === Delim && token.value === "%") {
      return 1;
    }
    if (token.type === Ident && unitSet.has(token.value.toLowerCase())) {
      return 1;
    }
    return 0;
  };
}
function createGenericTypes(units2) {
  return {
    ...tokenTypes,
    ...productionTypes,
    ...createDemensionTypes(units2),
    "attr-unit": createAttrUnit(units2)
  };
}
const length = [
  // absolute length units https://www.w3.org/TR/css-values-3/#lengths
  "cm",
  "mm",
  "q",
  "in",
  "pt",
  "pc",
  "px",
  // font-relative length units https://drafts.csswg.org/css-values-4/#font-relative-lengths
  "em",
  "rem",
  "ex",
  "rex",
  "cap",
  "rcap",
  "ch",
  "rch",
  "ic",
  "ric",
  "lh",
  "rlh",
  // viewport-percentage lengths https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
  "vw",
  "svw",
  "lvw",
  "dvw",
  "vh",
  "svh",
  "lvh",
  "dvh",
  "vi",
  "svi",
  "lvi",
  "dvi",
  "vb",
  "svb",
  "lvb",
  "dvb",
  "vmin",
  "svmin",
  "lvmin",
  "dvmin",
  "vmax",
  "svmax",
  "lvmax",
  "dvmax",
  // container relative lengths https://drafts.csswg.org/css-contain-3/#container-lengths
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax"
];
const angle = ["deg", "grad", "rad", "turn"];
const time = ["s", "ms"];
const frequency = ["hz", "khz"];
const resolution = ["dpi", "dpcm", "dppx", "x"];
const flex = ["fr"];
const decibel = ["db"];
const semitones = ["st"];
const units = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle,
  decibel,
  flex,
  frequency,
  length,
  resolution,
  semitones,
  time
}, Symbol.toStringTag, { value: "Module" }));
function SyntaxError$1(message, input, offset) {
  return Object.assign(createCustomError("SyntaxError", message), {
    input,
    offset,
    rawMessage: message,
    message: message + "\n  " + input + "\n--" + new Array((offset || input.length) + 1).join("-") + "^"
  });
}
const TAB$1 = 9;
const N$2 = 10;
const F$1 = 12;
const R$1 = 13;
const SPACE$3 = 32;
const NAME_CHAR = new Uint8Array(128).map(
  (_, idx) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(idx)) ? 1 : 0
);
class Scanner {
  constructor(str) {
    this.str = str;
    this.pos = 0;
  }
  charCodeAt(pos) {
    return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
  }
  charCode() {
    return this.charCodeAt(this.pos);
  }
  isNameCharCode(code2 = this.charCode()) {
    return code2 < 128 && NAME_CHAR[code2] === 1;
  }
  nextCharCode() {
    return this.charCodeAt(this.pos + 1);
  }
  nextNonWsCode(pos) {
    return this.charCodeAt(this.findWsEnd(pos));
  }
  skipWs() {
    this.pos = this.findWsEnd(this.pos);
  }
  findWsEnd(pos) {
    for (; pos < this.str.length; pos++) {
      const code2 = this.str.charCodeAt(pos);
      if (code2 !== R$1 && code2 !== N$2 && code2 !== F$1 && code2 !== SPACE$3 && code2 !== TAB$1) {
        break;
      }
    }
    return pos;
  }
  substringToPos(end) {
    return this.str.substring(this.pos, this.pos = end);
  }
  eat(code2) {
    if (this.charCode() !== code2) {
      this.error("Expect `" + String.fromCharCode(code2) + "`");
    }
    this.pos++;
  }
  peek() {
    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
  }
  error(message) {
    throw new SyntaxError$1(message, this.str, this.pos);
  }
  scanSpaces() {
    return this.substringToPos(this.findWsEnd(this.pos));
  }
  scanWord() {
    let end = this.pos;
    for (; end < this.str.length; end++) {
      const code2 = this.str.charCodeAt(end);
      if (code2 >= 128 || NAME_CHAR[code2] === 0) {
        break;
      }
    }
    if (this.pos === end) {
      this.error("Expect a keyword");
    }
    return this.substringToPos(end);
  }
  scanNumber() {
    let end = this.pos;
    for (; end < this.str.length; end++) {
      const code2 = this.str.charCodeAt(end);
      if (code2 < 48 || code2 > 57) {
        break;
      }
    }
    if (this.pos === end) {
      this.error("Expect a number");
    }
    return this.substringToPos(end);
  }
  scanString() {
    const end = this.str.indexOf("'", this.pos + 1);
    if (end === -1) {
      this.pos = this.str.length;
      this.error("Expect an apostrophe");
    }
    return this.substringToPos(end + 1);
  }
}
const TAB = 9;
const N$1 = 10;
const F = 12;
const R = 13;
const SPACE$2 = 32;
const EXCLAMATIONMARK$2 = 33;
const NUMBERSIGN$3 = 35;
const AMPERSAND$5 = 38;
const APOSTROPHE$2 = 39;
const LEFTPARENTHESIS$2 = 40;
const RIGHTPARENTHESIS$2 = 41;
const ASTERISK$6 = 42;
const PLUSSIGN$6 = 43;
const COMMA = 44;
const HYPERMINUS = 45;
const LESSTHANSIGN$1 = 60;
const GREATERTHANSIGN$3 = 62;
const QUESTIONMARK$1 = 63;
const COMMERCIALAT = 64;
const LEFTSQUAREBRACKET = 91;
const RIGHTSQUAREBRACKET = 93;
const LEFTCURLYBRACKET = 123;
const VERTICALLINE$3 = 124;
const RIGHTCURLYBRACKET = 125;
const INFINITY = 8734;
const COMBINATOR_PRECEDENCE = {
  " ": 1,
  "&&": 2,
  "||": 3,
  "|": 4
};
function readMultiplierRange(scanner) {
  let min = null;
  let max = null;
  scanner.eat(LEFTCURLYBRACKET);
  scanner.skipWs();
  min = scanner.scanNumber(scanner);
  scanner.skipWs();
  if (scanner.charCode() === COMMA) {
    scanner.pos++;
    scanner.skipWs();
    if (scanner.charCode() !== RIGHTCURLYBRACKET) {
      max = scanner.scanNumber(scanner);
      scanner.skipWs();
    }
  } else {
    max = min;
  }
  scanner.eat(RIGHTCURLYBRACKET);
  return {
    min: Number(min),
    max: max ? Number(max) : 0
  };
}
function readMultiplier(scanner) {
  let range = null;
  let comma2 = false;
  switch (scanner.charCode()) {
    case ASTERISK$6:
      scanner.pos++;
      range = {
        min: 0,
        max: 0
      };
      break;
    case PLUSSIGN$6:
      scanner.pos++;
      range = {
        min: 1,
        max: 0
      };
      break;
    case QUESTIONMARK$1:
      scanner.pos++;
      range = {
        min: 0,
        max: 1
      };
      break;
    case NUMBERSIGN$3:
      scanner.pos++;
      comma2 = true;
      if (scanner.charCode() === LEFTCURLYBRACKET) {
        range = readMultiplierRange(scanner);
      } else if (scanner.charCode() === QUESTIONMARK$1) {
        scanner.pos++;
        range = {
          min: 0,
          max: 0
        };
      } else {
        range = {
          min: 1,
          max: 0
        };
      }
      break;
    case LEFTCURLYBRACKET:
      range = readMultiplierRange(scanner);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma: comma2,
    min: range.min,
    max: range.max,
    term: null
  };
}
function maybeMultiplied(scanner, node2) {
  const multiplier = readMultiplier(scanner);
  if (multiplier !== null) {
    multiplier.term = node2;
    if (scanner.charCode() === NUMBERSIGN$3 && scanner.charCodeAt(scanner.pos - 1) === PLUSSIGN$6) {
      return maybeMultiplied(scanner, multiplier);
    }
    if (scanner.charCode() === QUESTIONMARK$1 && scanner.charCodeAt(scanner.pos - 1) === RIGHTCURLYBRACKET) {
      return maybeMultiplied(scanner, multiplier);
    }
    return multiplier;
  }
  return node2;
}
function maybeToken(scanner) {
  const ch = scanner.peek();
  if (ch === "") {
    return null;
  }
  return maybeMultiplied(scanner, {
    type: "Token",
    value: ch
  });
}
function readProperty$1(scanner) {
  let name2;
  scanner.eat(LESSTHANSIGN$1);
  scanner.eat(APOSTROPHE$2);
  name2 = scanner.scanWord();
  scanner.eat(APOSTROPHE$2);
  scanner.eat(GREATERTHANSIGN$3);
  return maybeMultiplied(scanner, {
    type: "Property",
    name: name2
  });
}
function readTypeRange(scanner) {
  let min = null;
  let max = null;
  let sign = 1;
  scanner.eat(LEFTSQUAREBRACKET);
  if (scanner.charCode() === HYPERMINUS) {
    scanner.peek();
    sign = -1;
  }
  if (sign == -1 && scanner.charCode() === INFINITY) {
    scanner.peek();
  } else {
    min = sign * Number(scanner.scanNumber(scanner));
    if (scanner.isNameCharCode()) {
      min += scanner.scanWord();
    }
  }
  scanner.skipWs();
  scanner.eat(COMMA);
  scanner.skipWs();
  if (scanner.charCode() === INFINITY) {
    scanner.peek();
  } else {
    sign = 1;
    if (scanner.charCode() === HYPERMINUS) {
      scanner.peek();
      sign = -1;
    }
    max = sign * Number(scanner.scanNumber(scanner));
    if (scanner.isNameCharCode()) {
      max += scanner.scanWord();
    }
  }
  scanner.eat(RIGHTSQUAREBRACKET);
  return {
    type: "Range",
    min,
    max
  };
}
function readType(scanner) {
  let name2;
  let opts = null;
  scanner.eat(LESSTHANSIGN$1);
  name2 = scanner.scanWord();
  if (name2 === "boolean-expr") {
    scanner.eat(LEFTSQUAREBRACKET);
    const implicitGroup = readImplicitGroup(scanner, RIGHTSQUAREBRACKET);
    scanner.eat(RIGHTSQUAREBRACKET);
    scanner.eat(GREATERTHANSIGN$3);
    return maybeMultiplied(scanner, {
      type: "Boolean",
      term: implicitGroup.terms.length === 1 ? implicitGroup.terms[0] : implicitGroup
    });
  }
  if (scanner.charCode() === LEFTPARENTHESIS$2 && scanner.nextCharCode() === RIGHTPARENTHESIS$2) {
    scanner.pos += 2;
    name2 += "()";
  }
  if (scanner.charCodeAt(scanner.findWsEnd(scanner.pos)) === LEFTSQUAREBRACKET) {
    scanner.skipWs();
    opts = readTypeRange(scanner);
  }
  scanner.eat(GREATERTHANSIGN$3);
  return maybeMultiplied(scanner, {
    type: "Type",
    name: name2,
    opts
  });
}
function readKeywordOrFunction(scanner) {
  const name2 = scanner.scanWord();
  if (scanner.charCode() === LEFTPARENTHESIS$2) {
    scanner.pos++;
    return {
      type: "Function",
      name: name2
    };
  }
  return maybeMultiplied(scanner, {
    type: "Keyword",
    name: name2
  });
}
function regroupTerms(terms, combinators) {
  function createGroup(terms2, combinator2) {
    return {
      type: "Group",
      terms: terms2,
      combinator: combinator2,
      disallowEmpty: false,
      explicit: false
    };
  }
  let combinator;
  combinators = Object.keys(combinators).sort((a2, b2) => COMBINATOR_PRECEDENCE[a2] - COMBINATOR_PRECEDENCE[b2]);
  while (combinators.length > 0) {
    combinator = combinators.shift();
    let i = 0;
    let subgroupStart = 0;
    for (; i < terms.length; i++) {
      const term = terms[i];
      if (term.type === "Combinator") {
        if (term.value === combinator) {
          if (subgroupStart === -1) {
            subgroupStart = i - 1;
          }
          terms.splice(i, 1);
          i--;
        } else {
          if (subgroupStart !== -1 && i - subgroupStart > 1) {
            terms.splice(
              subgroupStart,
              i - subgroupStart,
              createGroup(terms.slice(subgroupStart, i), combinator)
            );
            i = subgroupStart + 1;
          }
          subgroupStart = -1;
        }
      }
    }
    if (subgroupStart !== -1 && combinators.length) {
      terms.splice(
        subgroupStart,
        i - subgroupStart,
        createGroup(terms.slice(subgroupStart, i), combinator)
      );
    }
  }
  return combinator;
}
function readImplicitGroup(scanner, stopCharCode = -1) {
  const combinators = /* @__PURE__ */ Object.create(null);
  const terms = [];
  let prevToken = null;
  let prevTokenPos = scanner.pos;
  let prevTokenIsFunction = false;
  while (scanner.charCode() !== stopCharCode) {
    let token = prevTokenIsFunction ? readImplicitGroup(scanner, RIGHTPARENTHESIS$2) : peek(scanner);
    if (!token) {
      break;
    }
    if (token.type === "Spaces") {
      continue;
    }
    if (prevTokenIsFunction) {
      if (token.terms.length === 0) {
        prevTokenIsFunction = false;
        continue;
      }
      if (token.combinator === " ") {
        while (token.terms.length > 1) {
          combinators[" "] = true;
          terms.push({
            type: "Combinator",
            value: " "
          }, token.terms.shift());
        }
        token = token.terms[0];
      }
    }
    if (token.type === "Combinator") {
      if (prevToken === null || prevToken.type === "Combinator") {
        scanner.pos = prevTokenPos;
        scanner.error("Unexpected combinator");
      }
      combinators[token.value] = true;
    } else if (prevToken !== null && prevToken.type !== "Combinator") {
      combinators[" "] = true;
      terms.push({
        type: "Combinator",
        value: " "
      });
    }
    terms.push(token);
    prevToken = token;
    prevTokenPos = scanner.pos;
    prevTokenIsFunction = token.type === "Function";
  }
  if (prevToken !== null && prevToken.type === "Combinator") {
    scanner.pos -= prevTokenPos;
    scanner.error("Unexpected combinator");
  }
  return {
    type: "Group",
    terms,
    combinator: regroupTerms(terms, combinators) || " ",
    disallowEmpty: false,
    explicit: false
  };
}
function readGroup(scanner) {
  let result;
  scanner.eat(LEFTSQUAREBRACKET);
  result = readImplicitGroup(scanner, RIGHTSQUAREBRACKET);
  scanner.eat(RIGHTSQUAREBRACKET);
  result.explicit = true;
  if (scanner.charCode() === EXCLAMATIONMARK$2) {
    scanner.pos++;
    result.disallowEmpty = true;
  }
  return result;
}
function peek(scanner) {
  let code2 = scanner.charCode();
  switch (code2) {
    case RIGHTSQUAREBRACKET:
      break;
    case LEFTSQUAREBRACKET:
      return maybeMultiplied(scanner, readGroup(scanner));
    case LESSTHANSIGN$1:
      return scanner.nextCharCode() === APOSTROPHE$2 ? readProperty$1(scanner) : readType(scanner);
    case VERTICALLINE$3:
      return {
        type: "Combinator",
        value: scanner.substringToPos(
          scanner.pos + (scanner.nextCharCode() === VERTICALLINE$3 ? 2 : 1)
        )
      };
    case AMPERSAND$5:
      scanner.pos++;
      scanner.eat(AMPERSAND$5);
      return {
        type: "Combinator",
        value: "&&"
      };
    case COMMA:
      scanner.pos++;
      return {
        type: "Comma"
      };
    case APOSTROPHE$2:
      return maybeMultiplied(scanner, {
        type: "String",
        value: scanner.scanString()
      });
    case SPACE$2:
    case TAB:
    case N$1:
    case R:
    case F:
      return {
        type: "Spaces",
        value: scanner.scanSpaces()
      };
    case COMMERCIALAT:
      code2 = scanner.nextCharCode();
      if (scanner.isNameCharCode(code2)) {
        scanner.pos++;
        return {
          type: "AtKeyword",
          name: scanner.scanWord()
        };
      }
      return maybeToken(scanner);
    case ASTERISK$6:
    case PLUSSIGN$6:
    case QUESTIONMARK$1:
    case NUMBERSIGN$3:
    case EXCLAMATIONMARK$2:
      break;
    case LEFTCURLYBRACKET:
      code2 = scanner.nextCharCode();
      if (code2 < 48 || code2 > 57) {
        return maybeToken(scanner);
      }
      break;
    default:
      if (scanner.isNameCharCode(code2)) {
        return readKeywordOrFunction(scanner);
      }
      return maybeToken(scanner);
  }
}
function parse$O(source) {
  const scanner = new Scanner(source);
  const result = readImplicitGroup(scanner);
  if (scanner.pos !== source.length) {
    scanner.error("Unexpected input");
  }
  if (result.terms.length === 1 && result.terms[0].type === "Group") {
    return result.terms[0];
  }
  return result;
}
const noop = function() {
};
function ensureFunction(value2) {
  return typeof value2 === "function" ? value2 : noop;
}
function walk$1(node2, options, context) {
  function walk2(node3) {
    enter.call(context, node3);
    switch (node3.type) {
      case "Group":
        node3.terms.forEach(walk2);
        break;
      case "Multiplier":
      case "Boolean":
        walk2(node3.term);
        break;
      case "Type":
      case "Property":
      case "Keyword":
      case "AtKeyword":
      case "Function":
      case "String":
      case "Token":
      case "Comma":
        break;
      default:
        throw new Error("Unknown type: " + node3.type);
    }
    leave.call(context, node3);
  }
  let enter = noop;
  let leave = noop;
  if (typeof options === "function") {
    enter = options;
  } else if (options) {
    enter = ensureFunction(options.enter);
    leave = ensureFunction(options.leave);
  }
  if (enter === noop && leave === noop) {
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  }
  walk2(node2);
}
const astToTokens = {
  decorator(handlers) {
    const tokens = [];
    let curNode = null;
    return {
      ...handlers,
      node(node2) {
        const tmp = curNode;
        curNode = node2;
        handlers.node.call(this, node2);
        curNode = tmp;
      },
      emit(value2, type, auto2) {
        tokens.push({
          type,
          value: value2,
          node: auto2 ? null : curNode
        });
      },
      result() {
        return tokens;
      }
    };
  }
};
function stringToTokens(str) {
  const tokens = [];
  tokenize$1(
    str,
    (type, start, end) => tokens.push({
      type,
      value: str.slice(start, end),
      node: null
    })
  );
  return tokens;
}
function prepareTokens(value2, syntax2) {
  if (typeof value2 === "string") {
    return stringToTokens(value2);
  }
  return syntax2.generate(value2, astToTokens);
}
const MATCH = { type: "Match" };
const MISMATCH = { type: "Mismatch" };
const DISALLOW_EMPTY = { type: "DisallowEmpty" };
const LEFTPARENTHESIS$1 = 40;
const RIGHTPARENTHESIS$1 = 41;
function createCondition(match, thenBranch, elseBranch) {
  if (thenBranch === MATCH && elseBranch === MISMATCH) {
    return match;
  }
  if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
    return match;
  }
  if (match.type === "If" && match.else === MISMATCH && thenBranch === MATCH) {
    thenBranch = match.then;
    match = match.match;
  }
  return {
    type: "If",
    match,
    then: thenBranch,
    else: elseBranch
  };
}
function isFunctionType(name2) {
  return name2.length > 2 && name2.charCodeAt(name2.length - 2) === LEFTPARENTHESIS$1 && name2.charCodeAt(name2.length - 1) === RIGHTPARENTHESIS$1;
}
function isEnumCapatible(term) {
  return term.type === "Keyword" || term.type === "AtKeyword" || term.type === "Function" || term.type === "Type" && isFunctionType(term.name);
}
function groupNode(terms, combinator = " ", explicit = false) {
  return {
    type: "Group",
    terms,
    combinator,
    disallowEmpty: false,
    explicit
  };
}
function replaceTypeInGraph(node2, replacements, visited = /* @__PURE__ */ new Set()) {
  if (!visited.has(node2)) {
    visited.add(node2);
    switch (node2.type) {
      case "If":
        node2.match = replaceTypeInGraph(node2.match, replacements, visited);
        node2.then = replaceTypeInGraph(node2.then, replacements, visited);
        node2.else = replaceTypeInGraph(node2.else, replacements, visited);
        break;
      case "Type":
        return replacements[node2.name] || node2;
    }
  }
  return node2;
}
function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
  switch (combinator) {
    case " ": {
      let result = MATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        result = createCondition(
          term,
          result,
          MISMATCH
        );
      }
      return result;
    }
    case "|": {
      let result = MISMATCH;
      let map = null;
      for (let i = terms.length - 1; i >= 0; i--) {
        let term = terms[i];
        if (isEnumCapatible(term)) {
          if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
            map = /* @__PURE__ */ Object.create(null);
            result = createCondition(
              {
                type: "Enum",
                map
              },
              MATCH,
              result
            );
          }
          if (map !== null) {
            const key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
            if (key in map === false) {
              map[key] = term;
              continue;
            }
          }
        }
        map = null;
        result = createCondition(
          term,
          MATCH,
          result
        );
      }
      return result;
    }
    case "&&": {
      if (terms.length > 5) {
        return {
          type: "MatchOnce",
          terms,
          all: true
        };
      }
      let result = MISMATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        let thenClause;
        if (terms.length > 1) {
          thenClause = buildGroupMatchGraph(
            combinator,
            terms.filter(function(newGroupTerm) {
              return newGroupTerm !== term;
            }),
            false
          );
        } else {
          thenClause = MATCH;
        }
        result = createCondition(
          term,
          thenClause,
          result
        );
      }
      return result;
    }
    case "||": {
      if (terms.length > 5) {
        return {
          type: "MatchOnce",
          terms,
          all: false
        };
      }
      let result = atLeastOneTermMatched ? MATCH : MISMATCH;
      for (let i = terms.length - 1; i >= 0; i--) {
        const term = terms[i];
        let thenClause;
        if (terms.length > 1) {
          thenClause = buildGroupMatchGraph(
            combinator,
            terms.filter(function(newGroupTerm) {
              return newGroupTerm !== term;
            }),
            true
          );
        } else {
          thenClause = MATCH;
        }
        result = createCondition(
          term,
          thenClause,
          result
        );
      }
      return result;
    }
  }
}
function buildMultiplierMatchGraph(node2) {
  let result = MATCH;
  let matchTerm = buildMatchGraphInternal(node2.term);
  if (node2.max === 0) {
    matchTerm = createCondition(
      matchTerm,
      DISALLOW_EMPTY,
      MISMATCH
    );
    result = createCondition(
      matchTerm,
      null,
      // will be a loop
      MISMATCH
    );
    result.then = createCondition(
      MATCH,
      MATCH,
      result
      // make a loop
    );
    if (node2.comma) {
      result.then.else = createCondition(
        { type: "Comma", syntax: node2 },
        result,
        MISMATCH
      );
    }
  } else {
    for (let i = node2.min || 1; i <= node2.max; i++) {
      if (node2.comma && result !== MATCH) {
        result = createCondition(
          { type: "Comma", syntax: node2 },
          result,
          MISMATCH
        );
      }
      result = createCondition(
        matchTerm,
        createCondition(
          MATCH,
          MATCH,
          result
        ),
        MISMATCH
      );
    }
  }
  if (node2.min === 0) {
    result = createCondition(
      MATCH,
      MATCH,
      result
    );
  } else {
    for (let i = 0; i < node2.min - 1; i++) {
      if (node2.comma && result !== MATCH) {
        result = createCondition(
          { type: "Comma", syntax: node2 },
          result,
          MISMATCH
        );
      }
      result = createCondition(
        matchTerm,
        result,
        MISMATCH
      );
    }
  }
  return result;
}
function buildMatchGraphInternal(node2) {
  if (typeof node2 === "function") {
    return {
      type: "Generic",
      fn: node2
    };
  }
  switch (node2.type) {
    case "Group": {
      let result = buildGroupMatchGraph(
        node2.combinator,
        node2.terms.map(buildMatchGraphInternal),
        false
      );
      if (node2.disallowEmpty) {
        result = createCondition(
          result,
          DISALLOW_EMPTY,
          MISMATCH
        );
      }
      return result;
    }
    case "Multiplier":
      return buildMultiplierMatchGraph(node2);
    // https://drafts.csswg.org/css-values-5/#boolean
    case "Boolean": {
      const term = buildMatchGraphInternal(node2.term);
      const matchNode = buildMatchGraphInternal(groupNode([
        groupNode([
          { type: "Keyword", name: "not" },
          { type: "Type", name: "!boolean-group" }
        ]),
        groupNode([
          { type: "Type", name: "!boolean-group" },
          groupNode([
            { type: "Multiplier", comma: false, min: 0, max: 0, term: groupNode([
              { type: "Keyword", name: "and" },
              { type: "Type", name: "!boolean-group" }
            ]) },
            { type: "Multiplier", comma: false, min: 0, max: 0, term: groupNode([
              { type: "Keyword", name: "or" },
              { type: "Type", name: "!boolean-group" }
            ]) }
          ], "|")
        ])
      ], "|"));
      const booleanGroup = buildMatchGraphInternal(
        groupNode([
          { type: "Type", name: "!term" },
          groupNode([
            { type: "Token", value: "(" },
            { type: "Type", name: "!self" },
            { type: "Token", value: ")" }
          ]),
          { type: "Type", name: "general-enclosed" }
        ], "|")
      );
      replaceTypeInGraph(booleanGroup, { "!term": term, "!self": matchNode });
      replaceTypeInGraph(matchNode, { "!boolean-group": booleanGroup });
      return matchNode;
    }
    case "Type":
    case "Property":
      return {
        type: node2.type,
        name: node2.name,
        syntax: node2
      };
    case "Keyword":
      return {
        type: node2.type,
        name: node2.name.toLowerCase(),
        syntax: node2
      };
    case "AtKeyword":
      return {
        type: node2.type,
        name: "@" + node2.name.toLowerCase(),
        syntax: node2
      };
    case "Function":
      return {
        type: node2.type,
        name: node2.name.toLowerCase() + "(",
        syntax: node2
      };
    case "String":
      if (node2.value.length === 3) {
        return {
          type: "Token",
          value: node2.value.charAt(1),
          syntax: node2
        };
      }
      return {
        type: node2.type,
        value: node2.value.substr(1, node2.value.length - 2).replace(/\\'/g, "'"),
        syntax: node2
      };
    case "Token":
      return {
        type: node2.type,
        value: node2.value,
        syntax: node2
      };
    case "Comma":
      return {
        type: node2.type,
        syntax: node2
      };
    default:
      throw new Error("Unknown node type:", node2.type);
  }
}
function buildMatchGraph(syntaxTree, ref2) {
  if (typeof syntaxTree === "string") {
    syntaxTree = parse$O(syntaxTree);
  }
  return {
    type: "MatchGraph",
    match: buildMatchGraphInternal(syntaxTree),
    syntax: ref2 || null,
    source: syntaxTree
  };
}
const { hasOwnProperty: hasOwnProperty$2 } = Object.prototype;
const STUB = 0;
const TOKEN = 1;
const OPEN_SYNTAX = 2;
const CLOSE_SYNTAX = 3;
const EXIT_REASON_MATCH = "Match";
const EXIT_REASON_MISMATCH = "Mismatch";
const EXIT_REASON_ITERATION_LIMIT = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)";
const ITERATION_LIMIT = 15e3;
function reverseList(list) {
  let prev = null;
  let next = null;
  let item = list;
  while (item !== null) {
    next = item.prev;
    item.prev = prev;
    prev = item;
    item = next;
  }
  return prev;
}
function areStringsEqualCaseInsensitive(testStr, referenceStr) {
  if (testStr.length !== referenceStr.length) {
    return false;
  }
  for (let i = 0; i < testStr.length; i++) {
    const referenceCode = referenceStr.charCodeAt(i);
    let testCode = testStr.charCodeAt(i);
    if (testCode >= 65 && testCode <= 90) {
      testCode = testCode | 32;
    }
    if (testCode !== referenceCode) {
      return false;
    }
  }
  return true;
}
function isContextEdgeDelim(token) {
  if (token.type !== Delim) {
    return false;
  }
  return token.value !== "?";
}
function isCommaContextStart(token) {
  if (token === null) {
    return true;
  }
  return token.type === Comma || token.type === Function$2 || token.type === LeftParenthesis || token.type === LeftSquareBracket || token.type === LeftCurlyBracket || isContextEdgeDelim(token);
}
function isCommaContextEnd(token) {
  if (token === null) {
    return true;
  }
  return token.type === RightParenthesis || token.type === RightSquareBracket || token.type === RightCurlyBracket || token.type === Delim && token.value === "/";
}
function internalMatch(tokens, state, syntaxes) {
  function moveToNextToken() {
    do {
      tokenIndex++;
      token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
    } while (token !== null && (token.type === WhiteSpace$1 || token.type === Comment$1));
  }
  function getNextToken(offset) {
    const nextIndex = tokenIndex + offset;
    return nextIndex < tokens.length ? tokens[nextIndex] : null;
  }
  function stateSnapshotFromSyntax(nextState, prev) {
    return {
      nextState,
      matchStack,
      syntaxStack,
      thenStack,
      tokenIndex,
      prev
    };
  }
  function pushThenStack(nextState) {
    thenStack = {
      nextState,
      matchStack,
      syntaxStack,
      prev: thenStack
    };
  }
  function pushElseStack(nextState) {
    elseStack = stateSnapshotFromSyntax(nextState, elseStack);
  }
  function addTokenToMatch() {
    matchStack = {
      type: TOKEN,
      syntax: state.syntax,
      token,
      prev: matchStack
    };
    moveToNextToken();
    syntaxStash = null;
    if (tokenIndex > longestMatch) {
      longestMatch = tokenIndex;
    }
  }
  function openSyntax() {
    syntaxStack = {
      syntax: state.syntax,
      opts: state.syntax.opts || syntaxStack !== null && syntaxStack.opts || null,
      prev: syntaxStack
    };
    matchStack = {
      type: OPEN_SYNTAX,
      syntax: state.syntax,
      token: matchStack.token,
      prev: matchStack
    };
  }
  function closeSyntax() {
    if (matchStack.type === OPEN_SYNTAX) {
      matchStack = matchStack.prev;
    } else {
      matchStack = {
        type: CLOSE_SYNTAX,
        syntax: syntaxStack.syntax,
        token: matchStack.token,
        prev: matchStack
      };
    }
    syntaxStack = syntaxStack.prev;
  }
  let syntaxStack = null;
  let thenStack = null;
  let elseStack = null;
  let syntaxStash = null;
  let iterationCount = 0;
  let exitReason = null;
  let token = null;
  let tokenIndex = -1;
  let longestMatch = 0;
  let matchStack = {
    type: STUB,
    syntax: null,
    token: null,
    prev: null
  };
  moveToNextToken();
  while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
    switch (state.type) {
      case "Match":
        if (thenStack === null) {
          if (token !== null) {
            if (tokenIndex !== tokens.length - 1 || token.value !== "\\0" && token.value !== "\\9") {
              state = MISMATCH;
              break;
            }
          }
          exitReason = EXIT_REASON_MATCH;
          break;
        }
        state = thenStack.nextState;
        if (state === DISALLOW_EMPTY) {
          if (thenStack.matchStack === matchStack) {
            state = MISMATCH;
            break;
          } else {
            state = MATCH;
          }
        }
        while (thenStack.syntaxStack !== syntaxStack) {
          closeSyntax();
        }
        thenStack = thenStack.prev;
        break;
      case "Mismatch":
        if (syntaxStash !== null && syntaxStash !== false) {
          if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
            elseStack = syntaxStash;
            syntaxStash = false;
          }
        } else if (elseStack === null) {
          exitReason = EXIT_REASON_MISMATCH;
          break;
        }
        state = elseStack.nextState;
        thenStack = elseStack.thenStack;
        syntaxStack = elseStack.syntaxStack;
        matchStack = elseStack.matchStack;
        tokenIndex = elseStack.tokenIndex;
        token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
        elseStack = elseStack.prev;
        break;
      case "MatchGraph":
        state = state.match;
        break;
      case "If":
        if (state.else !== MISMATCH) {
          pushElseStack(state.else);
        }
        if (state.then !== MATCH) {
          pushThenStack(state.then);
        }
        state = state.match;
        break;
      case "MatchOnce":
        state = {
          type: "MatchOnceBuffer",
          syntax: state,
          index: 0,
          mask: 0
        };
        break;
      case "MatchOnceBuffer": {
        const terms = state.syntax.terms;
        if (state.index === terms.length) {
          if (state.mask === 0 || state.syntax.all) {
            state = MISMATCH;
            break;
          }
          state = MATCH;
          break;
        }
        if (state.mask === (1 << terms.length) - 1) {
          state = MATCH;
          break;
        }
        for (; state.index < terms.length; state.index++) {
          const matchFlag = 1 << state.index;
          if ((state.mask & matchFlag) === 0) {
            pushElseStack(state);
            pushThenStack({
              type: "AddMatchOnce",
              syntax: state.syntax,
              mask: state.mask | matchFlag
            });
            state = terms[state.index++];
            break;
          }
        }
        break;
      }
      case "AddMatchOnce":
        state = {
          type: "MatchOnceBuffer",
          syntax: state.syntax,
          index: 0,
          mask: state.mask
        };
        break;
      case "Enum":
        if (token !== null) {
          let name2 = token.value.toLowerCase();
          if (name2.indexOf("\\") !== -1) {
            name2 = name2.replace(/\\[09].*$/, "");
          }
          if (hasOwnProperty$2.call(state.map, name2)) {
            state = state.map[name2];
            break;
          }
        }
        state = MISMATCH;
        break;
      case "Generic": {
        const opts = syntaxStack !== null ? syntaxStack.opts : null;
        const lastTokenIndex2 = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
        if (!isNaN(lastTokenIndex2) && lastTokenIndex2 > tokenIndex) {
          while (tokenIndex < lastTokenIndex2) {
            addTokenToMatch();
          }
          state = MATCH;
        } else {
          state = MISMATCH;
        }
        break;
      }
      case "Type":
      case "Property": {
        const syntaxDict = state.type === "Type" ? "types" : "properties";
        const dictSyntax = hasOwnProperty$2.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
        if (!dictSyntax || !dictSyntax.match) {
          throw new Error(
            "Bad syntax reference: " + (state.type === "Type" ? "<" + state.name + ">" : "<'" + state.name + "'>")
          );
        }
        if (syntaxStash !== false && token !== null && state.type === "Type") {
          const lowPriorityMatching = (
            // https://drafts.csswg.org/css-values-4/#custom-idents
            // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
            // can only claim the keyword if no other unfulfilled production can claim it.
            state.name === "custom-ident" && token.type === Ident || // https://drafts.csswg.org/css-values-4/#lengths
            // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
            // it must parse as a <number>
            state.name === "length" && token.value === "0"
          );
          if (lowPriorityMatching) {
            if (syntaxStash === null) {
              syntaxStash = stateSnapshotFromSyntax(state, elseStack);
            }
            state = MISMATCH;
            break;
          }
        }
        openSyntax();
        state = dictSyntax.matchRef || dictSyntax.match;
        break;
      }
      case "Keyword": {
        const name2 = state.name;
        if (token !== null) {
          let keywordName = token.value;
          if (keywordName.indexOf("\\") !== -1) {
            keywordName = keywordName.replace(/\\[09].*$/, "");
          }
          if (areStringsEqualCaseInsensitive(keywordName, name2)) {
            addTokenToMatch();
            state = MATCH;
            break;
          }
        }
        state = MISMATCH;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
          addTokenToMatch();
          state = MATCH;
          break;
        }
        state = MISMATCH;
        break;
      case "Token":
        if (token !== null && token.value === state.value) {
          addTokenToMatch();
          state = MATCH;
          break;
        }
        state = MISMATCH;
        break;
      case "Comma":
        if (token !== null && token.type === Comma) {
          if (isCommaContextStart(matchStack.token)) {
            state = MISMATCH;
          } else {
            addTokenToMatch();
            state = isCommaContextEnd(token) ? MISMATCH : MATCH;
          }
        } else {
          state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
        }
        break;
      case "String":
        let string = "";
        let lastTokenIndex = tokenIndex;
        for (; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
          string += tokens[lastTokenIndex].value;
        }
        if (areStringsEqualCaseInsensitive(string, state.value)) {
          while (tokenIndex < lastTokenIndex) {
            addTokenToMatch();
          }
          state = MATCH;
        } else {
          state = MISMATCH;
        }
        break;
      default:
        throw new Error("Unknown node type: " + state.type);
    }
  }
  switch (exitReason) {
    case null:
      console.warn("[csstree-match] BREAK after " + ITERATION_LIMIT + " iterations");
      exitReason = EXIT_REASON_ITERATION_LIMIT;
      matchStack = null;
      break;
    case EXIT_REASON_MATCH:
      while (syntaxStack !== null) {
        closeSyntax();
      }
      break;
    default:
      matchStack = null;
  }
  return {
    tokens,
    reason: exitReason,
    iterations: iterationCount,
    match: matchStack,
    longestMatch
  };
}
function matchAsTree(tokens, matchGraph, syntaxes) {
  const matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
  if (matchResult.match === null) {
    return matchResult;
  }
  let item = matchResult.match;
  let host = matchResult.match = {
    syntax: matchGraph.syntax || null,
    match: []
  };
  const hostStack = [host];
  item = reverseList(item).prev;
  while (item !== null) {
    switch (item.type) {
      case OPEN_SYNTAX:
        host.match.push(host = {
          syntax: item.syntax,
          match: []
        });
        hostStack.push(host);
        break;
      case CLOSE_SYNTAX:
        hostStack.pop();
        host = hostStack[hostStack.length - 1];
        break;
      default:
        host.match.push({
          syntax: item.syntax || null,
          token: item.token.value,
          node: item.token.node
        });
    }
    item = item.prev;
  }
  return matchResult;
}
function getTrace(node2) {
  function shouldPutToTrace(syntax2) {
    if (syntax2 === null) {
      return false;
    }
    return syntax2.type === "Type" || syntax2.type === "Property" || syntax2.type === "Keyword";
  }
  function hasMatch(matchNode) {
    if (Array.isArray(matchNode.match)) {
      for (let i = 0; i < matchNode.match.length; i++) {
        if (hasMatch(matchNode.match[i])) {
          if (shouldPutToTrace(matchNode.syntax)) {
            result.unshift(matchNode.syntax);
          }
          return true;
        }
      }
    } else if (matchNode.node === node2) {
      result = shouldPutToTrace(matchNode.syntax) ? [matchNode.syntax] : [];
      return true;
    }
    return false;
  }
  let result = null;
  if (this.matched !== null) {
    hasMatch(this.matched);
  }
  return result;
}
function isType(node2, type) {
  return testNode(this, node2, (match) => match.type === "Type" && match.name === type);
}
function isProperty(node2, property2) {
  return testNode(this, node2, (match) => match.type === "Property" && match.name === property2);
}
function isKeyword(node2) {
  return testNode(this, node2, (match) => match.type === "Keyword");
}
function testNode(match, node2, fn) {
  const trace2 = getTrace.call(match, node2);
  if (trace2 === null) {
    return false;
  }
  return trace2.some(fn);
}
const trace = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace,
  isKeyword,
  isProperty,
  isType
}, Symbol.toStringTag, { value: "Module" }));
function getFirstMatchNode(matchNode) {
  if ("node" in matchNode) {
    return matchNode.node;
  }
  return getFirstMatchNode(matchNode.match[0]);
}
function getLastMatchNode(matchNode) {
  if ("node" in matchNode) {
    return matchNode.node;
  }
  return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
}
function matchFragments(lexer2, ast, match, type, name2) {
  function findFragments(matchNode) {
    if (matchNode.syntax !== null && matchNode.syntax.type === type && matchNode.syntax.name === name2) {
      const start = getFirstMatchNode(matchNode);
      const end = getLastMatchNode(matchNode);
      lexer2.syntax.walk(ast, function(node2, item, list) {
        if (node2 === start) {
          const nodes = new List();
          do {
            nodes.appendData(item.data);
            if (item.data === end) {
              break;
            }
            item = item.next;
          } while (item !== null);
          fragments.push({
            parent: list,
            nodes
          });
        }
      });
    }
    if (Array.isArray(matchNode.match)) {
      matchNode.match.forEach(findFragments);
    }
  }
  const fragments = [];
  if (match.matched !== null) {
    findFragments(match.matched);
  }
  return fragments;
}
const { hasOwnProperty: hasOwnProperty$1 } = Object.prototype;
function isValidNumber(value2) {
  return typeof value2 === "number" && isFinite(value2) && Math.floor(value2) === value2 && value2 >= 0;
}
function isValidLocation(loc) {
  return Boolean(loc) && isValidNumber(loc.offset) && isValidNumber(loc.line) && isValidNumber(loc.column);
}
function createNodeStructureChecker(type, fields) {
  return function checkNode(node2, warn) {
    if (!node2 || node2.constructor !== Object) {
      return warn(node2, "Type of node should be an Object");
    }
    for (let key in node2) {
      let valid = true;
      if (hasOwnProperty$1.call(node2, key) === false) {
        continue;
      }
      if (key === "type") {
        if (node2.type !== type) {
          warn(node2, "Wrong node type `" + node2.type + "`, expected `" + type + "`");
        }
      } else if (key === "loc") {
        if (node2.loc === null) {
          continue;
        } else if (node2.loc && node2.loc.constructor === Object) {
          if (typeof node2.loc.source !== "string") {
            key += ".source";
          } else if (!isValidLocation(node2.loc.start)) {
            key += ".start";
          } else if (!isValidLocation(node2.loc.end)) {
            key += ".end";
          } else {
            continue;
          }
        }
        valid = false;
      } else if (fields.hasOwnProperty(key)) {
        valid = false;
        for (let i = 0; !valid && i < fields[key].length; i++) {
          const fieldType = fields[key][i];
          switch (fieldType) {
            case String:
              valid = typeof node2[key] === "string";
              break;
            case Boolean:
              valid = typeof node2[key] === "boolean";
              break;
            case null:
              valid = node2[key] === null;
              break;
            default:
              if (typeof fieldType === "string") {
                valid = node2[key] && node2[key].type === fieldType;
              } else if (Array.isArray(fieldType)) {
                valid = node2[key] instanceof List;
              }
          }
        }
      } else {
        warn(node2, "Unknown field `" + key + "` for " + type + " node type");
      }
      if (!valid) {
        warn(node2, "Bad value for `" + type + "." + key + "`");
      }
    }
    for (const key in fields) {
      if (hasOwnProperty$1.call(fields, key) && hasOwnProperty$1.call(node2, key) === false) {
        warn(node2, "Field `" + type + "." + key + "` is missed");
      }
    }
  };
}
function genTypesList(fieldTypes, path) {
  const docsTypes = [];
  for (let i = 0; i < fieldTypes.length; i++) {
    const fieldType = fieldTypes[i];
    if (fieldType === String || fieldType === Boolean) {
      docsTypes.push(fieldType.name.toLowerCase());
    } else if (fieldType === null) {
      docsTypes.push("null");
    } else if (typeof fieldType === "string") {
      docsTypes.push(fieldType);
    } else if (Array.isArray(fieldType)) {
      docsTypes.push("List<" + (genTypesList(fieldType, path) || "any") + ">");
    } else {
      throw new Error("Wrong value `" + fieldType + "` in `" + path + "` structure definition");
    }
  }
  return docsTypes.join(" | ");
}
function processStructure(name2, nodeType) {
  const structure2 = nodeType.structure;
  const fields = {
    type: String,
    loc: true
  };
  const docs = {
    type: '"' + name2 + '"'
  };
  for (const key in structure2) {
    if (hasOwnProperty$1.call(structure2, key) === false) {
      continue;
    }
    const fieldTypes = fields[key] = Array.isArray(structure2[key]) ? structure2[key].slice() : [structure2[key]];
    docs[key] = genTypesList(fieldTypes, name2 + "." + key);
  }
  return {
    docs,
    check: createNodeStructureChecker(name2, fields)
  };
}
function getStructureFromConfig(config) {
  const structure2 = {};
  if (config.node) {
    for (const name2 in config.node) {
      if (hasOwnProperty$1.call(config.node, name2)) {
        const nodeType = config.node[name2];
        if (nodeType.structure) {
          structure2[name2] = processStructure(name2, nodeType);
        } else {
          throw new Error("Missed `structure` field in `" + name2 + "` node type definition");
        }
      }
    }
  }
  return structure2;
}
function dumpMapSyntax(map, compact, syntaxAsAst) {
  const result = {};
  for (const name2 in map) {
    if (map[name2].syntax) {
      result[name2] = syntaxAsAst ? map[name2].syntax : generate$O(map[name2].syntax, { compact });
    }
  }
  return result;
}
function dumpAtruleMapSyntax(map, compact, syntaxAsAst) {
  const result = {};
  for (const [name2, atrule2] of Object.entries(map)) {
    result[name2] = {
      prelude: atrule2.prelude && (syntaxAsAst ? atrule2.prelude.syntax : generate$O(atrule2.prelude.syntax, { compact })),
      descriptors: atrule2.descriptors && dumpMapSyntax(atrule2.descriptors, compact, syntaxAsAst)
    };
  }
  return result;
}
function valueHasVar(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].value.toLowerCase() === "var(") {
      return true;
    }
  }
  return false;
}
function syntaxHasTopLevelCommaMultiplier(syntax2) {
  const singleTerm = syntax2.terms[0];
  return syntax2.explicit === false && syntax2.terms.length === 1 && singleTerm.type === "Multiplier" && singleTerm.comma === true;
}
function buildMatchResult(matched, error, iterations) {
  return {
    matched,
    iterations,
    error,
    ...trace
  };
}
function matchSyntax(lexer2, syntax2, value2, useCssWideKeywords) {
  const tokens = prepareTokens(value2, lexer2.syntax);
  let result;
  if (valueHasVar(tokens)) {
    return buildMatchResult(null, new Error("Matching for a tree with var() is not supported"));
  }
  if (useCssWideKeywords) {
    result = matchAsTree(tokens, lexer2.cssWideKeywordsSyntax, lexer2);
  }
  if (!useCssWideKeywords || !result.match) {
    result = matchAsTree(tokens, syntax2.match, lexer2);
    if (!result.match) {
      return buildMatchResult(
        null,
        new SyntaxMatchError(result.reason, syntax2.syntax, value2, result),
        result.iterations
      );
    }
  }
  return buildMatchResult(result.match, null, result.iterations);
}
class Lexer {
  constructor(config, syntax2, structure2) {
    this.cssWideKeywords = cssWideKeywords;
    this.syntax = syntax2;
    this.generic = false;
    this.units = { ...units };
    this.atrules = /* @__PURE__ */ Object.create(null);
    this.properties = /* @__PURE__ */ Object.create(null);
    this.types = /* @__PURE__ */ Object.create(null);
    this.structure = structure2 || getStructureFromConfig(config);
    if (config) {
      if (config.cssWideKeywords) {
        this.cssWideKeywords = config.cssWideKeywords;
      }
      if (config.units) {
        for (const group of Object.keys(units)) {
          if (Array.isArray(config.units[group])) {
            this.units[group] = config.units[group];
          }
        }
      }
      if (config.types) {
        for (const [name2, type] of Object.entries(config.types)) {
          this.addType_(name2, type);
        }
      }
      if (config.generic) {
        this.generic = true;
        for (const [name2, value2] of Object.entries(createGenericTypes(this.units))) {
          this.addType_(name2, value2);
        }
      }
      if (config.atrules) {
        for (const [name2, atrule2] of Object.entries(config.atrules)) {
          this.addAtrule_(name2, atrule2);
        }
      }
      if (config.properties) {
        for (const [name2, property2] of Object.entries(config.properties)) {
          this.addProperty_(name2, property2);
        }
      }
    }
    this.cssWideKeywordsSyntax = buildMatchGraph(this.cssWideKeywords.join(" |  "));
  }
  checkStructure(ast) {
    function collectWarning(node2, message) {
      warns.push({ node: node2, message });
    }
    const structure2 = this.structure;
    const warns = [];
    this.syntax.walk(ast, function(node2) {
      if (structure2.hasOwnProperty(node2.type)) {
        structure2[node2.type].check(node2, collectWarning);
      } else {
        collectWarning(node2, "Unknown node type `" + node2.type + "`");
      }
    });
    return warns.length ? warns : false;
  }
  createDescriptor(syntax2, type, name2, parent = null) {
    const ref2 = {
      type,
      name: name2
    };
    const descriptor = {
      type,
      name: name2,
      parent,
      serializable: typeof syntax2 === "string" || syntax2 && typeof syntax2.type === "string",
      syntax: null,
      match: null,
      matchRef: null
      // used for properties when a syntax referenced as <'property'> in other syntax definitions
    };
    if (typeof syntax2 === "function") {
      descriptor.match = buildMatchGraph(syntax2, ref2);
    } else {
      if (typeof syntax2 === "string") {
        Object.defineProperty(descriptor, "syntax", {
          get() {
            Object.defineProperty(descriptor, "syntax", {
              value: parse$O(syntax2)
            });
            return descriptor.syntax;
          }
        });
      } else {
        descriptor.syntax = syntax2;
      }
      Object.defineProperty(descriptor, "match", {
        get() {
          Object.defineProperty(descriptor, "match", {
            value: buildMatchGraph(descriptor.syntax, ref2)
          });
          return descriptor.match;
        }
      });
      if (type === "Property") {
        Object.defineProperty(descriptor, "matchRef", {
          get() {
            const syntax3 = descriptor.syntax;
            const value2 = syntaxHasTopLevelCommaMultiplier(syntax3) ? buildMatchGraph({
              ...syntax3,
              terms: [syntax3.terms[0].term]
            }, ref2) : null;
            Object.defineProperty(descriptor, "matchRef", {
              value: value2
            });
            return value2;
          }
        });
      }
    }
    return descriptor;
  }
  addAtrule_(name2, syntax2) {
    if (!syntax2) {
      return;
    }
    this.atrules[name2] = {
      type: "Atrule",
      name: name2,
      prelude: syntax2.prelude ? this.createDescriptor(syntax2.prelude, "AtrulePrelude", name2) : null,
      descriptors: syntax2.descriptors ? Object.keys(syntax2.descriptors).reduce(
        (map, descName) => {
          map[descName] = this.createDescriptor(syntax2.descriptors[descName], "AtruleDescriptor", descName, name2);
          return map;
        },
        /* @__PURE__ */ Object.create(null)
      ) : null
    };
  }
  addProperty_(name2, syntax2) {
    if (!syntax2) {
      return;
    }
    this.properties[name2] = this.createDescriptor(syntax2, "Property", name2);
  }
  addType_(name2, syntax2) {
    if (!syntax2) {
      return;
    }
    this.types[name2] = this.createDescriptor(syntax2, "Type", name2);
  }
  checkAtruleName(atruleName) {
    if (!this.getAtrule(atruleName)) {
      return new SyntaxReferenceError("Unknown at-rule", "@" + atruleName);
    }
  }
  checkAtrulePrelude(atruleName, prelude) {
    const error = this.checkAtruleName(atruleName);
    if (error) {
      return error;
    }
    const atrule2 = this.getAtrule(atruleName);
    if (!atrule2.prelude && prelude) {
      return new SyntaxError("At-rule `@" + atruleName + "` should not contain a prelude");
    }
    if (atrule2.prelude && !prelude) {
      if (!matchSyntax(this, atrule2.prelude, "", false).matched) {
        return new SyntaxError("At-rule `@" + atruleName + "` should contain a prelude");
      }
    }
  }
  checkAtruleDescriptorName(atruleName, descriptorName) {
    const error = this.checkAtruleName(atruleName);
    if (error) {
      return error;
    }
    const atrule2 = this.getAtrule(atruleName);
    const descriptor = keyword(descriptorName);
    if (!atrule2.descriptors) {
      return new SyntaxError("At-rule `@" + atruleName + "` has no known descriptors");
    }
    if (!atrule2.descriptors[descriptor.name] && !atrule2.descriptors[descriptor.basename]) {
      return new SyntaxReferenceError("Unknown at-rule descriptor", descriptorName);
    }
  }
  checkPropertyName(propertyName) {
    if (!this.getProperty(propertyName)) {
      return new SyntaxReferenceError("Unknown property", propertyName);
    }
  }
  matchAtrulePrelude(atruleName, prelude) {
    const error = this.checkAtrulePrelude(atruleName, prelude);
    if (error) {
      return buildMatchResult(null, error);
    }
    const atrule2 = this.getAtrule(atruleName);
    if (!atrule2.prelude) {
      return buildMatchResult(null, null);
    }
    return matchSyntax(this, atrule2.prelude, prelude || "", false);
  }
  matchAtruleDescriptor(atruleName, descriptorName, value2) {
    const error = this.checkAtruleDescriptorName(atruleName, descriptorName);
    if (error) {
      return buildMatchResult(null, error);
    }
    const atrule2 = this.getAtrule(atruleName);
    const descriptor = keyword(descriptorName);
    return matchSyntax(this, atrule2.descriptors[descriptor.name] || atrule2.descriptors[descriptor.basename], value2, false);
  }
  matchDeclaration(node2) {
    if (node2.type !== "Declaration") {
      return buildMatchResult(null, new Error("Not a Declaration node"));
    }
    return this.matchProperty(node2.property, node2.value);
  }
  matchProperty(propertyName, value2) {
    if (property(propertyName).custom) {
      return buildMatchResult(null, new Error("Lexer matching doesn't applicable for custom properties"));
    }
    const error = this.checkPropertyName(propertyName);
    if (error) {
      return buildMatchResult(null, error);
    }
    return matchSyntax(this, this.getProperty(propertyName), value2, true);
  }
  matchType(typeName, value2) {
    const typeSyntax = this.getType(typeName);
    if (!typeSyntax) {
      return buildMatchResult(null, new SyntaxReferenceError("Unknown type", typeName));
    }
    return matchSyntax(this, typeSyntax, value2, false);
  }
  match(syntax2, value2) {
    if (typeof syntax2 !== "string" && (!syntax2 || !syntax2.type)) {
      return buildMatchResult(null, new SyntaxReferenceError("Bad syntax"));
    }
    if (typeof syntax2 === "string" || !syntax2.match) {
      syntax2 = this.createDescriptor(syntax2, "Type", "anonymous");
    }
    return matchSyntax(this, syntax2, value2, false);
  }
  findValueFragments(propertyName, value2, type, name2) {
    return matchFragments(this, value2, this.matchProperty(propertyName, value2), type, name2);
  }
  findDeclarationValueFragments(declaration, type, name2) {
    return matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name2);
  }
  findAllFragments(ast, type, name2) {
    const result = [];
    this.syntax.walk(ast, {
      visit: "Declaration",
      enter: (declaration) => {
        result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name2));
      }
    });
    return result;
  }
  getAtrule(atruleName, fallbackBasename = true) {
    const atrule2 = keyword(atruleName);
    const atruleEntry = atrule2.vendor && fallbackBasename ? this.atrules[atrule2.name] || this.atrules[atrule2.basename] : this.atrules[atrule2.name];
    return atruleEntry || null;
  }
  getAtrulePrelude(atruleName, fallbackBasename = true) {
    const atrule2 = this.getAtrule(atruleName, fallbackBasename);
    return atrule2 && atrule2.prelude || null;
  }
  getAtruleDescriptor(atruleName, name2) {
    return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators ? this.atrules[atruleName].declarators[name2] || null : null;
  }
  getProperty(propertyName, fallbackBasename = true) {
    const property$1 = property(propertyName);
    const propertyEntry = property$1.vendor && fallbackBasename ? this.properties[property$1.name] || this.properties[property$1.basename] : this.properties[property$1.name];
    return propertyEntry || null;
  }
  getType(name2) {
    return hasOwnProperty.call(this.types, name2) ? this.types[name2] : null;
  }
  validate() {
    function syntaxRef(name2, isType2) {
      return isType2 ? `<${name2}>` : `<'${name2}'>`;
    }
    function validate(syntax2, name2, broken, descriptor) {
      if (broken.has(name2)) {
        return broken.get(name2);
      }
      broken.set(name2, false);
      if (descriptor.syntax !== null) {
        walk$1(descriptor.syntax, function(node2) {
          if (node2.type !== "Type" && node2.type !== "Property") {
            return;
          }
          const map = node2.type === "Type" ? syntax2.types : syntax2.properties;
          const brokenMap = node2.type === "Type" ? brokenTypes : brokenProperties;
          if (!hasOwnProperty.call(map, node2.name)) {
            errors.push(`${syntaxRef(name2, broken === brokenTypes)} used missed syntax definition ${syntaxRef(node2.name, node2.type === "Type")}`);
            broken.set(name2, true);
          } else if (validate(syntax2, node2.name, brokenMap, map[node2.name])) {
            errors.push(`${syntaxRef(name2, broken === brokenTypes)} used broken syntax definition ${syntaxRef(node2.name, node2.type === "Type")}`);
            broken.set(name2, true);
          }
        }, this);
      }
    }
    const errors = [];
    let brokenTypes = /* @__PURE__ */ new Map();
    let brokenProperties = /* @__PURE__ */ new Map();
    for (const key in this.types) {
      validate(this, key, brokenTypes, this.types[key]);
    }
    for (const key in this.properties) {
      validate(this, key, brokenProperties, this.properties[key]);
    }
    const brokenTypesArray = [...brokenTypes.keys()].filter((name2) => brokenTypes.get(name2));
    const brokenPropertiesArray = [...brokenProperties.keys()].filter((name2) => brokenProperties.get(name2));
    if (brokenTypesArray.length || brokenPropertiesArray.length) {
      return {
        errors,
        types: brokenTypesArray,
        properties: brokenPropertiesArray
      };
    }
    return null;
  }
  dump(syntaxAsAst, pretty) {
    return {
      generic: this.generic,
      cssWideKeywords: this.cssWideKeywords,
      units: this.units,
      types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
      properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst),
      atrules: dumpAtruleMapSyntax(this.atrules, !pretty, syntaxAsAst)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function appendOrSet(a2, b2) {
  if (typeof b2 === "string" && /^\s*\|/.test(b2)) {
    return typeof a2 === "string" ? a2 + b2 : b2.replace(/^\s*\|\s*/, "");
  }
  return b2 || null;
}
function extractProps(obj, props) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const prop of Object.keys(obj)) {
    if (props.includes(prop)) {
      result[prop] = obj[prop];
    }
  }
  return result;
}
function mergeDicts(base, ext, fields) {
  const result = { ...base };
  for (const [key, props] of Object.entries(ext)) {
    result[key] = {
      ...result[key],
      ...fields ? extractProps(props, fields) : props
    };
  }
  return result;
}
function mix(dest, src) {
  const result = { ...dest };
  for (const [prop, value2] of Object.entries(src)) {
    switch (prop) {
      case "generic":
        result[prop] = Boolean(value2);
        break;
      case "cssWideKeywords":
        result[prop] = dest[prop] ? [...dest[prop], ...value2] : value2 || [];
        break;
      case "units":
        result[prop] = { ...dest[prop] };
        for (const [name2, patch] of Object.entries(value2)) {
          result[prop][name2] = Array.isArray(patch) ? patch : [];
        }
        break;
      case "atrules":
        result[prop] = { ...dest[prop] };
        for (const [name2, atrule2] of Object.entries(value2)) {
          const exists = result[prop][name2] || {};
          const current = result[prop][name2] = {
            prelude: exists.prelude || null,
            descriptors: {
              ...exists.descriptors
            }
          };
          if (!atrule2) {
            continue;
          }
          current.prelude = atrule2.prelude ? appendOrSet(current.prelude, atrule2.prelude) : current.prelude || null;
          for (const [descriptorName, descriptorValue] of Object.entries(atrule2.descriptors || {})) {
            current.descriptors[descriptorName] = descriptorValue ? appendOrSet(current.descriptors[descriptorName], descriptorValue) : null;
          }
          if (!Object.keys(current.descriptors).length) {
            current.descriptors = null;
          }
        }
        break;
      case "types":
      case "properties":
        result[prop] = { ...dest[prop] };
        for (const [name2, syntax2] of Object.entries(value2)) {
          result[prop][name2] = appendOrSet(result[prop][name2], syntax2);
        }
        break;
      case "parseContext":
        result[prop] = {
          ...dest[prop],
          ...value2
        };
        break;
      case "scope":
      case "features":
        result[prop] = mergeDicts(dest[prop], value2);
        break;
      case "atrule":
      case "pseudo":
        result[prop] = mergeDicts(dest[prop], value2, ["parse"]);
        break;
      case "node":
        result[prop] = mergeDicts(dest[prop], value2, ["name", "structure", "parse", "generate", "walkContext"]);
        break;
    }
  }
  return result;
}
function createSyntax(config) {
  const parse2 = createParser(config);
  const walk2 = createWalker(config);
  const generate2 = createGenerator(config);
  const { fromPlainObject: fromPlainObject2, toPlainObject: toPlainObject2 } = createConvertor(walk2);
  const syntax2 = {
    lexer: null,
    createLexer: (config2) => new Lexer(config2, syntax2, syntax2.lexer.structure),
    tokenize: tokenize$1,
    parse: parse2,
    generate: generate2,
    walk: walk2,
    find: walk2.find,
    findLast: walk2.findLast,
    findAll: walk2.findAll,
    fromPlainObject: fromPlainObject2,
    toPlainObject: toPlainObject2,
    fork(extension) {
      const base = mix({}, config);
      return createSyntax(
        typeof extension === "function" ? extension(base) : mix(base, extension)
      );
    }
  };
  syntax2.lexer = new Lexer({
    generic: config.generic,
    cssWideKeywords: config.cssWideKeywords,
    units: config.units,
    types: config.types,
    atrules: config.atrules,
    properties: config.properties,
    node: config.node
  }, syntax2);
  return syntax2;
}
const createSyntax$1 = (config) => createSyntax(mix({}, config));
const definitions = {
  "generic": true,
  "cssWideKeywords": [
    "initial",
    "inherit",
    "unset",
    "revert",
    "revert-layer"
  ],
  "units": {
    "angle": [
      "deg",
      "grad",
      "rad",
      "turn"
    ],
    "decibel": [
      "db"
    ],
    "flex": [
      "fr"
    ],
    "frequency": [
      "hz",
      "khz"
    ],
    "length": [
      "cm",
      "mm",
      "q",
      "in",
      "pt",
      "pc",
      "px",
      "em",
      "rem",
      "ex",
      "rex",
      "cap",
      "rcap",
      "ch",
      "rch",
      "ic",
      "ric",
      "lh",
      "rlh",
      "vw",
      "svw",
      "lvw",
      "dvw",
      "vh",
      "svh",
      "lvh",
      "dvh",
      "vi",
      "svi",
      "lvi",
      "dvi",
      "vb",
      "svb",
      "lvb",
      "dvb",
      "vmin",
      "svmin",
      "lvmin",
      "dvmin",
      "vmax",
      "svmax",
      "lvmax",
      "dvmax",
      "cqw",
      "cqh",
      "cqi",
      "cqb",
      "cqmin",
      "cqmax"
    ],
    "resolution": [
      "dpi",
      "dpcm",
      "dppx",
      "x"
    ],
    "semitones": [
      "st"
    ],
    "time": [
      "s",
      "ms"
    ]
  },
  "types": {
    "abs()": "abs( <calc-sum> )",
    "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
    "acos()": "acos( <calc-sum> )",
    "alpha-value": "<number>|<percentage>",
    "an+b": "odd|even|<integer>|<n-dimension>|'+'? † n|-n|<ndashdigit-dimension>|'+'? † <ndashdigit-ident>|<dashndashdigit-ident>|<n-dimension> <signed-integer>|'+'? † n <signed-integer>|-n <signed-integer>|<ndash-dimension> <signless-integer>|'+'? † n- <signless-integer>|-n- <signless-integer>|<n-dimension> ['+'|'-'] <signless-integer>|'+'? † n ['+'|'-'] <signless-integer>|-n ['+'|'-'] <signless-integer>",
    "anchor()": "anchor( <anchor-name>?&&<anchor-side> , <length-percentage>? )",
    "anchor-name": "<dashed-ident>",
    "anchor-side": "inside|outside|top|left|right|bottom|start|end|self-start|self-end|<percentage>|center",
    "anchor-size": "width|height|block|inline|self-block|self-inline",
    "anchor-size()": "anchor-size( [<anchor-name>||<anchor-size>]? , <length-percentage>? )",
    "angle-percentage": "<angle>|<percentage>",
    "angular-color-hint": "<angle-percentage>|<zero>",
    "angular-color-stop": "<color> <color-stop-angle>?",
    "angular-color-stop-list": "<angular-color-stop> , [<angular-color-hint>? , <angular-color-stop>]#?",
    "animateable-feature": "scroll-position|contents|<custom-ident>",
    "animation-action": "none|play|play-once|play-forwards|play-backwards|pause|reset|replay",
    "asin()": "asin( <calc-sum> )",
    "atan()": "atan( <calc-sum> )",
    "atan2()": "atan2( <calc-sum> , <calc-sum> )",
    "attachment": "scroll|fixed|local",
    "attr()": "attr( <attr-name> <attr-type>? , <declaration-value>? )",
    "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
    "attr-modifier": "i|s",
    "attr-type": "type( <syntax> )|raw-string|number|<attr-unit>",
    "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
    "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
    "axis": "block|inline|x|y",
    "baseline-position": "[first|last]? baseline",
    "basic-shape": "<inset()>|<xywh()>|<rect()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
    "basic-shape-rect": "<inset()>|<rect()>|<xywh()>",
    "bg-clip": "<visual-box>|border-area|text",
    "bg-image": "<image>|none",
    "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<visual-box>||<visual-box>",
    "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
    "bg-size": "[<length-percentage [0,∞]>|auto]{1,2}|cover|contain",
    "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
    "blur()": "blur( <length>? )",
    "brightness()": "brightness( [<number>|<percentage>]? )",
    "calc()": "calc( <calc-sum> )",
    "calc-constant": "e|pi|infinity|-infinity|NaN",
    "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
    "calc-size()": "calc-size( <calc-size-basis> , <calc-sum> )",
    "calc-size-basis": "<intrinsic-size-keyword>|<calc-size()>|any|<calc-sum>",
    "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
    "calc-value": "<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )",
    "cf-final-image": "<image>|<color>",
    "cf-mixing-image": "<percentage>?&&<image>",
    "circle()": "circle( <radial-size>? [at <position>]? )",
    "clamp()": "clamp( <calc-sum>#{3} )",
    "class-selector": "'.' <ident-token>",
    "clip-source": "<url>",
    "color": "<color-base>|currentColor|<system-color>|<device-cmyk()>|<light-dark()>|<-non-standard-color>",
    "color()": "color( <colorspace-params> [/ [<alpha-value>|none]]? )",
    "color-base": "<hex-color>|<color-function>|<named-color>|<color-mix()>|transparent",
    "color-function": "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<oklab()>|<oklch()>|<color()>",
    "color-interpolation-method": "in [<rectangular-color-space>|<polar-color-space> <hue-interpolation-method>?|<custom-color-space>]",
    "color-mix()": "color-mix( <color-interpolation-method> , [<color>&&<percentage [0,100]>?]#{2} )",
    "color-stop": "<color-stop-length>|<color-stop-angle>",
    "color-stop-angle": "[<angle-percentage>|<zero>]{1,2}",
    "color-stop-length": "<length-percentage>{1,2}",
    "color-stop-list": "<linear-color-stop> , [<linear-color-hint>? , <linear-color-stop>]#?",
    "colorspace-params": "[<predefined-rgb-params>|<xyz-params>]",
    "combinator": "'>'|'+'|'~'|['|' '|']",
    "common-lig-values": "[common-ligatures|no-common-ligatures]",
    "compat-auto": "searchfield|textarea|checkbox|radio|menulist|listbox|meter|progress-bar|button",
    "compat-special": "textfield|menulist-button",
    "complex-selector": "<complex-selector-unit> [<combinator>? <complex-selector-unit>]*",
    "complex-selector-list": "<complex-selector>#",
    "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
    "compositing-operator": "add|subtract|intersect|exclude",
    "compound-selector": "[<type-selector>? <subclass-selector>*]!",
    "compound-selector-list": "<compound-selector>#",
    "conic-gradient()": "conic-gradient( [<conic-gradient-syntax>] )",
    "conic-gradient-syntax": "[[[from [<angle>|<zero>]]? [at <position>]?]||<color-interpolation-method>]? , <angular-color-stop-list>",
    "container-condition": "not <query-in-parens>|<query-in-parens> [[and <query-in-parens>]*|[or <query-in-parens>]*]",
    "container-name": "<custom-ident>",
    "container-query": "not <query-in-parens>|<query-in-parens> [[and <query-in-parens>]*|[or <query-in-parens>]*]",
    "content-distribution": "space-between|space-around|space-evenly|stretch",
    "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+",
    "content-position": "center|start|end|flex-start|flex-end",
    "content-replacement": "<image>",
    "contextual-alt-values": "[contextual|no-contextual]",
    "contrast()": "contrast( [<number>|<percentage>]? )",
    "coord-box": "content-box|padding-box|border-box|fill-box|stroke-box|view-box",
    "corner-shape-value": "round|scoop|bevel|notch|square|squircle|<superellipse()>",
    "cos()": "cos( <calc-sum> )",
    "counter": "<counter()>|<counters()>",
    "counter()": "counter( <counter-name> , <counter-style>? )",
    "counter-name": "<custom-ident>",
    "counter-style": "<counter-style-name>|symbols( )",
    "counter-style-name": "<custom-ident>",
    "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
    "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
    "cubic-bezier()": "cubic-bezier( [<number [0,1]> , <number>]#{2} )",
    "cubic-bezier-easing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
    "cursor-predefined": "auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing",
    "custom-color-space": "<dashed-ident>",
    "custom-params": "<dashed-ident> [<number>|<percentage>|none]+",
    "dasharray": "[[<length-percentage>|<number>]+]#",
    "dashndashdigit-ident": "<ident-token>",
    "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonHighlight|ButtonShadow|CaptionText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
    "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
    "display-box": "contents|none",
    "display-inside": "flow|flow-root|table|flex|grid|ruby",
    "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
    "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
    "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
    "display-outside": "block|inline|run-in",
    "drop-shadow()": "drop-shadow( [<color>?&&<length>{2,3}] )",
    "dynamic-range-limit-mix()": "dynamic-range-limit-mix( [<'dynamic-range-limit'>&&<percentage [0,100]>]#{2,} )",
    "easing-function": "<linear-easing-function>|<cubic-bezier-easing-function>|<step-easing-function>",
    "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
    "east-asian-width-values": "[full-width|proportional-width]",
    "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
    "ellipse()": "ellipse( <radial-size>? [at <position>]? )",
    "env()": "env( <custom-ident> , <declaration-value>? )",
    "exp()": "exp( <calc-sum> )",
    "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
    "family-name": "<string>|<custom-ident>+",
    "feature-tag-value": "<string> [<integer>|on|off]?",
    "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
    "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
    "feature-value-block-list": "<feature-value-block>+",
    "feature-value-declaration": "<custom-ident> : <integer>+ ;",
    "feature-value-declaration-list": "<feature-value-declaration>",
    "feature-value-name": "<custom-ident>",
    "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
    "filter-value-list": "[<filter-function>|<url>]+",
    "final-bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<visual-box>||<visual-box>||<'background-color'>",
    "fit-content()": "fit-content( <length-percentage [0,∞]> )",
    "fixed-breadth": "<length-percentage>",
    "fixed-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
    "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
    "font-variant-css2": "normal|small-caps",
    "font-weight-absolute": "normal|bold|<number [1,1000]>",
    "font-width-css3": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",
    "form-control-identifier": "select",
    "frequency-percentage": "<frequency>|<percentage>",
    "generic-complete": "serif|sans-serif|system-ui|cursive|fantasy|math|monospace",
    "general-enclosed": "[<function-token> <any-value>? )]|[( <any-value>? )]",
    "generic-family": "<generic-script-specific>|<generic-complete>|<generic-incomplete>|<-non-standard-generic-family>",
    "generic-incomplete": "ui-serif|ui-sans-serif|ui-monospace|ui-rounded",
    "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
    "gradient": "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>",
    "grayscale()": "grayscale( [<number>|<percentage>]? )",
    "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
    "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
    "hsl()": "hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )|hsl( [<hue>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "hsla()": "hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )|hsla( [<hue>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "hue": "<number>|<angle>",
    "hue-interpolation-method": "[shorter|longer|increasing|decreasing] hue",
    "hue-rotate()": "hue-rotate( [<angle>|<zero>]? )",
    "hwb()": "hwb( [<hue>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "hypot()": "hypot( <calc-sum># )",
    "image": "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
    "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
    "image-set()": "image-set( <image-set-option># )",
    "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
    "image-src": "<url>|<string>",
    "image-tags": "ltr|rtl",
    "inflexible-breadth": "<length-percentage>|min-content|max-content|auto",
    "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
    "invert()": "invert( [<number>|<percentage>]? )",
    "keyframe-block": "<keyframe-selector># { <declaration-list> }",
    "keyframe-selector": "from|to|<percentage [0,100]>|<timeline-range-name> <percentage>",
    "keyframes-name": "<custom-ident>|<string>",
    "lab()": "lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "layer()": "layer( <layer-name> )",
    "layer-name": "<ident> ['.' <ident>]*",
    "lch()": "lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "leader()": "leader( <leader-type> )",
    "leader-type": "dotted|solid|space|<string>",
    "length-percentage": "<length>|<percentage>",
    "light-dark()": "light-dark( <color> , <color> )",
    "line-name-list": "[<line-names>|<name-repeat>]+",
    "line-names": "'[' <custom-ident>* ']'",
    "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
    "line-width": "<length>|thin|medium|thick",
    "linear()": "linear( [<number>&&<percentage>{0,2}]# )",
    "linear-color-hint": "<length-percentage>",
    "linear-color-stop": "<color> <color-stop-length>?",
    "linear-easing-function": "linear|<linear()>",
    "linear-gradient()": "linear-gradient( [<linear-gradient-syntax>] )",
    "linear-gradient-syntax": "[[<angle>|<zero>|to <side-or-corner>]||<color-interpolation-method>]? , <color-stop-list>",
    "log()": "log( <calc-sum> , <calc-sum>? )",
    "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
    "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
    "mask-reference": "none|<image>|<mask-source>",
    "mask-source": "<url>",
    "masking-mode": "alpha|luminance|match-source",
    "matrix()": "matrix( <number>#{6} )",
    "matrix3d()": "matrix3d( <number>#{16} )",
    "max()": "max( <calc-sum># )",
    "media-and": "<media-in-parens> [and <media-in-parens>]+",
    "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
    "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
    "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
    "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
    "media-not": "not <media-in-parens>",
    "media-or": "<media-in-parens> [or <media-in-parens>]+",
    "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
    "media-query-list": "<media-query>#",
    "media-type": "<ident>",
    "mf-boolean": "<mf-name>",
    "mf-name": "<ident>",
    "mf-plain": "<mf-name> : <mf-value>",
    "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
    "mf-value": "<number>|<dimension>|<ident>|<ratio>",
    "min()": "min( <calc-sum># )",
    "minmax()": "minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )",
    "mod()": "mod( <calc-sum> , <calc-sum> )",
    "n-dimension": "<dimension-token>",
    "name-repeat": "repeat( [<integer [1,∞]>|auto-fill] , <line-names>+ )",
    "named-color": "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen",
    "namespace-prefix": "<ident>",
    "ndash-dimension": "<dimension-token>",
    "ndashdigit-dimension": "<dimension-token>",
    "ndashdigit-ident": "<ident-token>",
    "ns-prefix": "[<ident-token>|'*']? '|'",
    "number-percentage": "<number>|<percentage>",
    "numeric-figure-values": "[lining-nums|oldstyle-nums]",
    "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
    "numeric-spacing-values": "[proportional-nums|tabular-nums]",
    "offset-path": "<ray()>|<url>|<basic-shape>",
    "oklab()": "oklab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "oklch()": "oklch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "opacity()": "opacity( [<number>|<percentage>]? )",
    "opacity-value": "<number>|<percentage>",
    "outline-line-style": "none|dotted|dashed|solid|double|groove|ridge|inset|outset",
    "outline-radius": "<length>|<percentage>",
    "overflow-position": "unsafe|safe",
    "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
    "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
    "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
    "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
    "page-selector-list": "[<page-selector>#]?",
    "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
    "paint": "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
    "paint()": "paint( <ident> , <declaration-value>? )",
    "paint-box": "<visual-box>|fill-box|stroke-box",
    "palette-identifier": "<dashed-ident>",
    "palette-mix()": "palette-mix( <color-interpolation-method> , [[normal|light|dark|<palette-identifier>|<palette-mix()>]&&<percentage [0,100]>?]#{2} )",
    "path()": "path( <'fill-rule'>? , <string> )",
    "perspective()": "perspective( [<length [0,∞]>|none] )",
    "polar-color-space": "hsl|hwb|lch|oklch",
    "polygon()": "polygon( <'fill-rule'>? , [<length-percentage> <length-percentage>]# )",
    "position": "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
    "position-area": "[[left|center|right|span-left|span-right|x-start|x-end|span-x-start|span-x-end|x-self-start|x-self-end|span-x-self-start|span-x-self-end|span-all]||[top|center|bottom|span-top|span-bottom|y-start|y-end|span-y-start|span-y-end|y-self-start|y-self-end|span-y-self-start|span-y-self-end|span-all]|[block-start|center|block-end|span-block-start|span-block-end|span-all]||[inline-start|center|inline-end|span-inline-start|span-inline-end|span-all]|[self-block-start|center|self-block-end|span-self-block-start|span-self-block-end|span-all]||[self-inline-start|center|self-inline-end|span-self-inline-start|span-self-inline-end|span-all]|[start|center|end|span-start|span-end|span-all]{1,2}|[self-start|center|self-end|span-self-start|span-self-end|span-all]{1,2}]",
    "pow()": "pow( <calc-sum> , <calc-sum> )",
    "predefined-rgb": "srgb|srgb-linear|display-p3|display-p3-linear|a98-rgb|prophoto-rgb|rec2020",
    "predefined-rgb-params": "<predefined-rgb> [<number>|<percentage>|none]{3}",
    "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
    "pseudo-element-selector": "':' <pseudo-class-selector>|<legacy-pseudo-element-selector>",
    "pseudo-page": ": [left|right|first|blank]",
    "query-in-parens": "( <container-condition> )|( <size-feature> )|style( <style-query> )|<general-enclosed>",
    "quote": "open-quote|close-quote|no-open-quote|no-close-quote",
    "radial-extent": "closest-corner|closest-side|farthest-corner|farthest-side",
    "radial-gradient()": "radial-gradient( [<radial-gradient-syntax>] )",
    "radial-gradient-syntax": "[[[<radial-shape>||<radial-size>]? [at <position>]?]||<color-interpolation-method>]? , <color-stop-list>",
    "radial-shape": "circle|ellipse",
    "radial-size": "<radial-extent>|<length [0,∞]>|<length-percentage [0,∞]>{2}",
    "ratio": "<number [0,∞]> [/ <number [0,∞]>]?",
    "ray()": "ray( <angle>&&<ray-size>?&&contain?&&[at <position>]? )",
    "ray-size": "closest-side|closest-corner|farthest-side|farthest-corner|sides",
    "rect()": "rect( [<length-percentage>|auto]{4} [round <'border-radius'>]? )",
    "rectangular-color-space": "srgb|srgb-linear|display-p3|display-p3-linear|a98-rgb|prophoto-rgb|rec2020|lab|oklab|xyz|xyz-d50|xyz-d65",
    "relative-selector": "<combinator>? <complex-selector>",
    "relative-selector-list": "<relative-selector>#",
    "relative-size": "larger|smaller",
    "rem()": "rem( <calc-sum> , <calc-sum> )",
    "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
    "repeating-conic-gradient()": "repeating-conic-gradient( [<conic-gradient-syntax>] )",
    "repeating-linear-gradient()": "repeating-linear-gradient( [<linear-gradient-syntax>] )",
    "repeating-radial-gradient()": "repeating-radial-gradient( [<radial-gradient-syntax>] )",
    "reversed-counter-name": "reversed( <counter-name> )",
    "rgb()": "rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )|rgb( [<number>|<percentage>|none]{3} [/ [<alpha-value>|none]]? )",
    "rgba()": "rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )|rgba( [<number>|<percentage>|none]{3} [/ [<alpha-value>|none]]? )",
    "rotate()": "rotate( [<angle>|<zero>] )",
    "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
    "rotateX()": "rotateX( [<angle>|<zero>] )",
    "rotateY()": "rotateY( [<angle>|<zero>] )",
    "rotateZ()": "rotateZ( [<angle>|<zero>] )",
    "round()": "round( <rounding-strategy>? , <calc-sum> , <calc-sum> )",
    "rounding-strategy": "nearest|up|down|to-zero",
    "saturate()": "saturate( [<number>|<percentage>]? )",
    "scale()": "scale( [<number>|<percentage>]#{1,2} )",
    "scale3d()": "scale3d( [<number>|<percentage>]#{3} )",
    "scaleX()": "scaleX( [<number>|<percentage>] )",
    "scaleY()": "scaleY( [<number>|<percentage>] )",
    "scaleZ()": "scaleZ( [<number>|<percentage>] )",
    "scope-end": "<forgiving-selector-list>",
    "scope-start": "<forgiving-selector-list>",
    "scroll()": "scroll( [<scroller>||<axis>]? )",
    "scroller": "root|nearest|self",
    "scroll-state-feature": "<media-query-list>",
    "scroll-state-in-parens": "( <scroll-state-query> )|( <scroll-state-feature> )|<general-enclosed>",
    "scroll-state-query": "not <scroll-state-in-parens>|<scroll-state-in-parens> [[and <scroll-state-in-parens>]*|[or <scroll-state-in-parens>]*]|<scroll-state-feature>",
    "selector-list": "<complex-selector-list>",
    "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
    "sepia()": "sepia( [<number>|<percentage>]? )",
    "shadow": "inset?&&<length>{2,4}&&<color>?",
    "shadow-t": "[<length>{2,3}&&<color>?]",
    "shape": "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
    "shape-box": "<visual-box>|margin-box",
    "side-or-corner": "[left|right]||[top|bottom]",
    "sign()": "sign( <calc-sum> )",
    "signed-integer": "<number-token>",
    "signless-integer": "<number-token>",
    "sin()": "sin( <calc-sum> )",
    "single-animation": "<'animation-duration'>||<easing-function>||<'animation-delay'>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]||<single-animation-timeline>",
    "single-animation-composition": "replace|add|accumulate",
    "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
    "single-animation-fill-mode": "none|forwards|backwards|both",
    "single-animation-iteration-count": "infinite|<number>",
    "single-animation-play-state": "running|paused",
    "single-animation-timeline": "auto|none|<dashed-ident>|<scroll()>|<view()>",
    "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>||<transition-behavior-value>",
    "single-transition-property": "all|<custom-ident>",
    "size": "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
    "size-feature": "<mf-plain>|<mf-boolean>|<mf-range>",
    "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
    "skewX()": "skewX( [<angle>|<zero>] )",
    "skewY()": "skewY( [<angle>|<zero>] )",
    "sqrt()": "sqrt( <calc-sum> )",
    "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
    "step-easing-function": "step-start|step-end|<steps()>",
    "steps()": "steps( <integer> , <step-position>? )",
    "style-feature": "<declaration>",
    "style-in-parens": "( <style-condition> )|( <style-feature> )|<general-enclosed>",
    "style-query": "<style-condition>|<style-feature>",
    "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
    "superellipse()": "superellipse( [<number>|infinity|-infinity] )",
    "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
    "supports-decl": "( <declaration> )",
    "supports-feature": "<supports-decl>|<supports-selector-fn>",
    "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
    "supports-selector-fn": "selector( <complex-selector> )",
    "symbol": "<string>|<image>|<custom-ident>",
    "symbols()": "symbols( <symbols-type>? [<string>|<image>]+ )",
    "symbols-type": "cyclic|numeric|alphabetic|symbolic|fixed",
    "system-color": "AccentColor|AccentColorText|ActiveText|ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|Mark|MarkText|SelectedItem|SelectedItemText|VisitedText",
    "system-family-name": "caption|icon|menu|message-box|small-caption|status-bar",
    "tan()": "tan( <calc-sum> )",
    "target": "<target-counter()>|<target-counters()>|<target-text()>",
    "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
    "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
    "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
    "text-edge": "[text|cap|ex|ideographic|ideographic-ink] [text|alphabetic|ideographic|ideographic-ink]?",
    "time-percentage": "<time>|<percentage>",
    "timeline-range-name": "cover|contain|entry|exit|entry-crossing|exit-crossing",
    "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
    "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
    "track-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <track-size>]+ <line-names>? )",
    "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )",
    "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
    "transform-list": "<transform-function>+",
    "transition-behavior-value": "normal|allow-discrete",
    "translate()": "translate( <length-percentage> , <length-percentage>? )",
    "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
    "translateX()": "translateX( <length-percentage> )",
    "translateY()": "translateY( <length-percentage> )",
    "translateZ()": "translateZ( <length> )",
    "try-size": "most-width|most-height|most-block-size|most-inline-size",
    "try-tactic": "flip-block||flip-inline||flip-start",
    "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
    "type-selector": "<wq-name>|<ns-prefix>? '*'",
    "var()": "var( <custom-property-name> , <declaration-value>? )",
    "view()": "view( [<axis>||<'view-timeline-inset'>]? )",
    "viewport-length": "auto|<length-percentage>",
    "visual-box": "content-box|padding-box|border-box",
    "wq-name": "<ns-prefix>? <ident-token>",
    "xywh()": "xywh( <length-percentage>{2} <length-percentage [0,∞]>{2} [round <'border-radius'>]? )",
    "xyz": "xyz|xyz-d50|xyz-d65",
    "xyz-params": "<xyz-space> [<number>|<percentage>|none]{3}",
    "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
    "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
    "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
    "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
    "-legacy-radial-gradient-shape": "circle|ellipse",
    "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
    "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
    "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
    "-non-standard-overflow": "overlay|-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
    "-non-standard-size": "intrinsic|min-intrinsic|-webkit-fill-available|-webkit-fit-content|-webkit-min-content|-webkit-max-content|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content",
    "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
    "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
    "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
    "-webkit-gradient-radius": "<length>|<percentage>",
    "-webkit-gradient-type": "linear|radial",
    "-webkit-mask-box-repeat": "repeat|stretch|round",
    "-ms-filter-function-list": "<-ms-filter-function>+",
    "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
    "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
    "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
    "age": "child|young|old",
    "attr-name": "<wq-name>",
    "attr-fallback": "<any-value>",
    "autospace": "no-autospace|[ideograph-alpha||ideograph-numeric||punctuation]||[insert|replace]",
    "bottom": "<length>|auto",
    "generic-voice": "[<age>? <gender> <integer>?]",
    "gender": "male|female|neutral",
    "generic-script-specific": "generic( kai )|generic( fangsong )|generic( nastaliq )",
    "-non-standard-generic-family": "-apple-system|BlinkMacSystemFont",
    "intrinsic-size-keyword": "min-content|max-content|fit-content",
    "left": "<length>|auto",
    "device-cmyk()": "<legacy-device-cmyk-syntax>|<modern-device-cmyk-syntax>",
    "legacy-device-cmyk-syntax": "device-cmyk( <number>#{4} )",
    "modern-device-cmyk-syntax": "device-cmyk( <cmyk-component>{4} [/ [<alpha-value>|none]]? )",
    "cmyk-component": "<number>|<percentage>|none",
    "color-space": "<rectangular-color-space>|<polar-color-space>|<custom-color-space>",
    "right": "<length>|auto",
    "forgiving-selector-list": "<complex-real-selector-list>",
    "forgiving-relative-selector-list": "<relative-real-selector-list>",
    "complex-real-selector-list": "<complex-real-selector>#",
    "simple-selector-list": "<simple-selector>#",
    "relative-real-selector-list": "<relative-real-selector>#",
    "complex-selector-unit": "[<compound-selector>? <pseudo-compound-selector>*]!",
    "complex-real-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
    "relative-real-selector": "<combinator>? <complex-real-selector>",
    "pseudo-compound-selector": "<pseudo-element-selector> <pseudo-class-selector>*",
    "simple-selector": "<type-selector>|<subclass-selector>",
    "legacy-pseudo-element-selector": "':' [before|after|first-line|first-letter]",
    "svg-length": "<percentage>|<length>|<number>",
    "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
    "top": "<length>|auto",
    "x": "<number>",
    "y": "<number>",
    "declaration": "<ident-token> : <declaration-value>? ['!' important]?",
    "declaration-list": "[<declaration>? ';']* <declaration>?",
    "url": "url( <string> <url-modifier>* )|<url-token>",
    "url-modifier": "<ident>|<function-token> <any-value> )",
    "number-zero-one": "<number [0,1]>",
    "number-one-or-greater": "<number [1,∞]>",
    "xyz-space": "xyz|xyz-d50|xyz-d65",
    "style-condition": "not <style-in-parens>|<style-in-parens> [[and <style-in-parens>]*|[or <style-in-parens>]*]",
    "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box",
    "inset-area": "[[left|center|right|span-left|span-right|x-start|x-end|span-x-start|span-x-end|x-self-start|x-self-end|span-x-self-start|span-x-self-end|span-all]||[top|center|bottom|span-top|span-bottom|y-start|y-end|span-y-start|span-y-end|y-self-start|y-self-end|span-y-self-start|span-y-self-end|span-all]|[block-start|center|block-end|span-block-start|span-block-end|span-all]||[inline-start|center|inline-end|span-inline-start|span-inline-end|span-all]|[self-block-start|self-block-end|span-self-block-start|span-self-block-end|span-all]||[self-inline-start|self-inline-end|span-self-inline-start|span-self-inline-end|span-all]|[start|center|end|span-start|span-end|span-all]{1,2}|[self-start|center|self-end|span-self-start|span-self-end|span-all]{1,2}]",
    "syntax": "'*'|<syntax-component> [<syntax-combinator> <syntax-component>]*|<syntax-string>",
    "syntax-component": "<syntax-single-component> <syntax-multiplier>?|'<' transform-list '>'",
    "syntax-single-component": "'<' <syntax-type-name> '>'|<ident>",
    "syntax-type-name": "angle|color|custom-ident|image|integer|length|length-percentage|number|percentage|resolution|string|time|url|transform-function",
    "syntax-combinator": "'|'",
    "syntax-multiplier": "'#'|'+'",
    "syntax-string": "<string>"
  },
  "properties": {
    "--*": "<declaration-value>",
    "-ms-accelerator": "false|true",
    "-ms-block-progression": "tb|rl|bt|lr",
    "-ms-content-zoom-chaining": "none|chained",
    "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
    "-ms-content-zoom-limit-max": "<percentage>",
    "-ms-content-zoom-limit-min": "<percentage>",
    "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
    "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
    "-ms-content-zoom-snap-type": "none|proximity|mandatory",
    "-ms-content-zooming": "none|zoom",
    "-ms-filter": "<string>",
    "-ms-flow-from": "[none|<custom-ident>]#",
    "-ms-flow-into": "[none|<custom-ident>]#",
    "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
    "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
    "-ms-high-contrast-adjust": "auto|none",
    "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
    "-ms-hyphenate-limit-lines": "no-limit|<integer>",
    "-ms-hyphenate-limit-zone": "<percentage>|<length>",
    "-ms-ime-align": "auto|after",
    "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
    "-ms-scroll-chaining": "chained|none",
    "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
    "-ms-scroll-limit-x-max": "auto|<length>",
    "-ms-scroll-limit-x-min": "<length>",
    "-ms-scroll-limit-y-max": "auto|<length>",
    "-ms-scroll-limit-y-min": "<length>",
    "-ms-scroll-rails": "none|railed",
    "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-type": "none|proximity|mandatory",
    "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
    "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
    "-ms-scroll-translation": "none|vertical-to-horizontal",
    "-ms-scrollbar-3dlight-color": "<color>",
    "-ms-scrollbar-arrow-color": "<color>",
    "-ms-scrollbar-base-color": "<color>",
    "-ms-scrollbar-darkshadow-color": "<color>",
    "-ms-scrollbar-face-color": "<color>",
    "-ms-scrollbar-highlight-color": "<color>",
    "-ms-scrollbar-shadow-color": "<color>",
    "-ms-scrollbar-track-color": "<color>",
    "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
    "-ms-touch-select": "grippers|none",
    "-ms-user-select": "none|element|text",
    "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
    "-ms-wrap-margin": "<length>",
    "-ms-wrap-through": "wrap|none",
    "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
    "-moz-binding": "<url>|none",
    "-moz-border-bottom-colors": "<color>+|none",
    "-moz-border-left-colors": "<color>+|none",
    "-moz-border-right-colors": "<color>+|none",
    "-moz-border-top-colors": "<color>+|none",
    "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
    "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
    "-moz-force-broken-image-icon": "0|1",
    "-moz-orient": "inline|block|horizontal|vertical",
    "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
    "-moz-outline-radius-bottomleft": "<outline-radius>",
    "-moz-outline-radius-bottomright": "<outline-radius>",
    "-moz-outline-radius-topleft": "<outline-radius>",
    "-moz-outline-radius-topright": "<outline-radius>",
    "-moz-stack-sizing": "ignore|stretch-to-fit",
    "-moz-text-blink": "none|blink",
    "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
    "-moz-user-input": "auto|none|enabled|disabled",
    "-moz-user-modify": "read-only|read-write|write-only",
    "-moz-window-dragging": "drag|no-drag",
    "-moz-window-shadow": "default|menu|tooltip|sheet|none",
    "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
    "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
    "-webkit-border-before-color": "<color>",
    "-webkit-border-before-style": "<'border-style'>",
    "-webkit-border-before-width": "<'border-width'>",
    "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
    "-webkit-line-clamp": "none|<integer>",
    "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<visual-box>|border|padding|content|text]||[<visual-box>|border|padding|content]]#",
    "-webkit-mask-attachment": "<attachment>#",
    "-webkit-mask-clip": "[<coord-box>|no-clip|border|padding|content|text]#",
    "-webkit-mask-composite": "<composite-style>#",
    "-webkit-mask-image": "<mask-reference>#",
    "-webkit-mask-origin": "[<coord-box>|border|padding|content]#",
    "-webkit-mask-position": "<position>#",
    "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
    "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
    "-webkit-mask-repeat": "<repeat-style>#",
    "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
    "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
    "-webkit-mask-size": "<bg-size>#",
    "-webkit-overflow-scrolling": "auto|touch",
    "-webkit-tap-highlight-color": "<color>",
    "-webkit-text-fill-color": "<color>",
    "-webkit-text-stroke": "<length>||<color>",
    "-webkit-text-stroke-color": "<color>",
    "-webkit-text-stroke-width": "<length>",
    "-webkit-touch-callout": "default|none",
    "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
    "-webkit-user-select": "auto|none|text|all",
    "accent-color": "auto|<color>",
    "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
    "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]|anchor-center",
    "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>|anchor-center",
    "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
    "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
    "all": "initial|inherit|unset|revert|revert-layer",
    "anchor-name": "none|<dashed-ident>#",
    "anchor-scope": "none|all|<dashed-ident>#",
    "animation": "<single-animation>#",
    "animation-composition": "<single-animation-composition>#",
    "animation-delay": "<time>#",
    "animation-direction": "<single-animation-direction>#",
    "animation-duration": "[auto|<time [0s,∞]>]#",
    "animation-fill-mode": "<single-animation-fill-mode>#",
    "animation-iteration-count": "<single-animation-iteration-count>#",
    "animation-name": "[none|<keyframes-name>]#",
    "animation-play-state": "<single-animation-play-state>#",
    "animation-range": "[<'animation-range-start'> <'animation-range-end'>?]#",
    "animation-range-end": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "animation-range-start": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "animation-timeline": "<single-animation-timeline>#",
    "animation-timing-function": "<easing-function>#",
    "animation-trigger": "[none|[<dashed-ident> <animation-action>+]+]#",
    "appearance": "none|auto|<compat-auto>|<compat-special>",
    "aspect-ratio": "auto||<ratio>",
    "backdrop-filter": "none|<filter-value-list>",
    "backface-visibility": "visible|hidden",
    "background": "<bg-layer>#? , <final-bg-layer>",
    "background-attachment": "<attachment>#",
    "background-blend-mode": "<blend-mode>#",
    "background-clip": "<bg-clip>#",
    "background-color": "<color>",
    "background-image": "<bg-image>#",
    "background-origin": "<visual-box>#",
    "background-position": "<bg-position>#",
    "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
    "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
    "background-repeat": "<repeat-style>#",
    "background-size": "<bg-size>#",
    "baseline-shift": "baseline|sub|super|<svg-length>",
    "baseline-source": "auto|first|last",
    "block-size": "<'width'>",
    "border": "<line-width>||<line-style>||<color>",
    "border-block": "<'border-block-start'>",
    "border-block-color": "<'border-top-color'>{1,2}",
    "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-end-color": "<'border-top-color'>",
    "border-block-end-style": "<'border-top-style'>",
    "border-block-end-width": "<'border-top-width'>",
    "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-start-color": "<'border-top-color'>",
    "border-block-start-style": "<'border-top-style'>",
    "border-block-start-width": "<'border-top-width'>",
    "border-block-style": "<'border-top-style'>{1,2}",
    "border-block-width": "<'border-top-width'>{1,2}",
    "border-bottom": "<line-width>||<line-style>||<color>",
    "border-bottom-color": "<'border-top-color'>",
    "border-bottom-left-radius": "<length-percentage [0,∞]>{1,2}",
    "border-bottom-right-radius": "<length-percentage [0,∞]>{1,2}",
    "border-bottom-style": "<line-style>",
    "border-bottom-width": "<line-width>",
    "border-collapse": "separate|collapse",
    "border-color": "<color>{1,4}",
    "border-end-end-radius": "<'border-top-left-radius'>",
    "border-end-start-radius": "<'border-top-left-radius'>",
    "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
    "border-image-outset": "[<length [0,∞]>|<number [0,∞]>]{1,4}",
    "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
    "border-image-slice": "[<number [0,∞]>|<percentage [0,∞]>]{1,4}&&fill?",
    "border-image-source": "none|<image>",
    "border-image-width": "[<length-percentage [0,∞]>|<number [0,∞]>|auto]{1,4}",
    "border-inline": "<'border-block-start'>",
    "border-inline-color": "<'border-top-color'>{1,2}",
    "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-end-color": "<'border-top-color'>",
    "border-inline-end-style": "<'border-top-style'>",
    "border-inline-end-width": "<'border-top-width'>",
    "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-start-color": "<'border-top-color'>",
    "border-inline-start-style": "<'border-top-style'>",
    "border-inline-start-width": "<'border-top-width'>",
    "border-inline-style": "<'border-top-style'>{1,2}",
    "border-inline-width": "<'border-top-width'>{1,2}",
    "border-left": "<line-width>||<line-style>||<color>",
    "border-left-color": "<color>",
    "border-left-style": "<line-style>",
    "border-left-width": "<line-width>",
    "border-radius": "<length-percentage [0,∞]>{1,4} [/ <length-percentage [0,∞]>{1,4}]?",
    "border-right": "<line-width>||<line-style>||<color>",
    "border-right-color": "<color>",
    "border-right-style": "<line-style>",
    "border-right-width": "<line-width>",
    "border-spacing": "<length>{1,2}",
    "border-start-end-radius": "<'border-top-left-radius'>",
    "border-start-start-radius": "<'border-top-left-radius'>",
    "border-style": "<line-style>{1,4}",
    "border-top": "<line-width>||<line-style>||<color>",
    "border-top-color": "<color>",
    "border-top-left-radius": "<length-percentage [0,∞]>{1,2}",
    "border-top-right-radius": "<length-percentage [0,∞]>{1,2}",
    "border-top-style": "<line-style>",
    "border-top-width": "<line-width>",
    "border-width": "<line-width>{1,4}",
    "bottom": "auto|<length-percentage>|<anchor()>|<anchor-size()>",
    "box-align": "start|center|end|baseline|stretch",
    "box-decoration-break": "slice|clone",
    "box-direction": "normal|reverse|inherit",
    "box-flex": "<number>",
    "box-flex-group": "<integer>",
    "box-lines": "single|multiple",
    "box-ordinal-group": "<integer>",
    "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
    "box-pack": "start|center|end|justify",
    "box-shadow": "none|<shadow>#",
    "box-sizing": "content-box|border-box",
    "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
    "caption-side": "top|bottom",
    "caret": "<'caret-color'>||<'caret-animation'>||<'caret-shape'>",
    "caret-animation": "auto|manual",
    "caret-color": "auto|<color>",
    "caret-shape": "auto|bar|block|underscore",
    "clear": "none|left|right|both|inline-start|inline-end",
    "clip": "<shape>|auto",
    "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
    "clip-rule": "nonzero|evenodd",
    "color": "<color>",
    "color-interpolation-filters": "auto|sRGB|linearRGB",
    "color-scheme": "normal|[light|dark|<custom-ident>]+&&only?",
    "column-count": "<integer>|auto",
    "column-fill": "auto|balance",
    "column-gap": "normal|<length-percentage>",
    "column-height": "auto|<length [0,∞]>",
    "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
    "column-rule-color": "<color>",
    "column-rule-style": "<'border-style'>",
    "column-rule-width": "<'border-width'>",
    "column-span": "none|all",
    "column-width": "auto|<length [0,∞]>",
    "column-wrap": "auto|nowrap|wrap",
    "columns": "[<'column-width'>||<'column-count'>] [/ <'column-height'>]?",
    "contain": "none|strict|content|[[size||inline-size]||layout||style||paint]",
    "contain-intrinsic-block-size": "auto? [none|<length>]",
    "contain-intrinsic-height": "auto? [none|<length>]",
    "contain-intrinsic-inline-size": "auto? [none|<length>]",
    "contain-intrinsic-size": "[auto? [none|<length>]]{1,2}",
    "contain-intrinsic-width": "auto? [none|<length>]",
    "container": "<'container-name'> [/ <'container-type'>]?",
    "container-name": "none|<custom-ident>+",
    "container-type": "normal||[size|inline-size]",
    "content": "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>|<attr()>]+]?",
    "content-visibility": "visible|auto|hidden",
    "corner-block-end-shape": "<corner-shape-value>{1,2}",
    "corner-block-start-shape": "<corner-shape-value>{1,2}",
    "corner-bottom-shape": "<corner-shape-value>{1,2}",
    "corner-bottom-left-shape": "<corner-shape-value>",
    "corner-bottom-right-shape": "<corner-shape-value>",
    "corner-end-end-shape": "<corner-shape-value>",
    "corner-end-start-shape": "<corner-shape-value>",
    "corner-inline-end-shape": "<corner-shape-value>{1,2}",
    "corner-inline-start-shape": "<corner-shape-value>{1,2}",
    "corner-left-shape": "<corner-shape-value>{1,2}",
    "corner-right-shape": "<corner-shape-value>{1,2}",
    "corner-shape": "<corner-shape-value>{1,4}",
    "corner-start-start-shape": "<corner-shape-value>",
    "corner-start-end-shape": "<corner-shape-value>",
    "corner-top-shape": "<corner-shape-value>{1,2}",
    "corner-top-left-shape": "<corner-shape-value>",
    "corner-top-right-shape": "<corner-shape-value>",
    "counter-increment": "[<counter-name> <integer>?]+|none",
    "counter-reset": "[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none",
    "counter-set": "[<counter-name> <integer>?]+|none",
    "cursor": "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
    "cx": "<length>|<percentage>",
    "cy": "<length>|<percentage>",
    "d": "none|path( <string> )",
    "direction": "ltr|rtl",
    "display": "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
    "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
    "dynamic-range-limit": "standard|no-limit|constrained|<dynamic-range-limit-mix()>",
    "empty-cells": "show|hide",
    "field-sizing": "content|fixed",
    "fill": "<paint>",
    "fill-opacity": "<number-zero-one>|<percentage>",
    "fill-rule": "nonzero|evenodd",
    "filter": "none|<filter-value-list>|<-ms-filter-function-list>",
    "flex": "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
    "flex-basis": "content|<'width'>",
    "flex-direction": "row|row-reverse|column|column-reverse",
    "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
    "flex-grow": "<number>",
    "flex-shrink": "<number>",
    "flex-wrap": "nowrap|wrap|wrap-reverse",
    "float": "left|right|none|inline-start|inline-end",
    "flood-color": "<color>",
    "flood-opacity": "<'opacity'>",
    "font": "[[<'font-style'>||<font-variant-css2>||<'font-weight'>||<font-width-css3>]? <'font-size'> [/ <'line-height'>]? <'font-family'>#]|<system-family-name>|<-non-standard-font>",
    "font-family": "[<family-name>|<generic-family>]#",
    "font-feature-settings": "normal|<feature-tag-value>#",
    "font-kerning": "auto|normal|none",
    "font-language-override": "normal|<string>",
    "font-optical-sizing": "auto|none",
    "font-palette": "normal|light|dark|<palette-identifier>|<palette-mix()>",
    "font-size": "<absolute-size>|<relative-size>|<length-percentage [0,∞]>|math",
    "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
    "font-smooth": "auto|never|always|<absolute-size>|<length>",
    "font-stretch": "<font-stretch-absolute>",
    "font-style": "normal|italic|oblique <angle>?",
    "font-synthesis": "none|[weight||style||small-caps||position]",
    "font-synthesis-position": "auto|none",
    "font-synthesis-small-caps": "auto|none",
    "font-synthesis-style": "auto|none",
    "font-synthesis-weight": "auto|none",
    "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
    "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
    "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-emoji": "normal|text|emoji|unicode",
    "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
    "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
    "font-variant-position": "normal|sub|super",
    "font-variation-settings": "normal|[<string> <number>]#",
    "font-weight": "<font-weight-absolute>|bolder|lighter",
    "font-width": "normal|<percentage [0,∞]>|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",
    "forced-color-adjust": "auto|none|preserve-parent-color",
    "gap": "<'row-gap'> <'column-gap'>?",
    "grid": "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
    "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
    "grid-auto-columns": "<track-size>+",
    "grid-auto-flow": "[row|column]||dense",
    "grid-auto-rows": "<track-size>+",
    "grid-column": "<grid-line> [/ <grid-line>]?",
    "grid-column-end": "<grid-line>",
    "grid-column-gap": "<length-percentage>",
    "grid-column-start": "<grid-line>",
    "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
    "grid-row": "<grid-line> [/ <grid-line>]?",
    "grid-row-end": "<grid-line>",
    "grid-row-gap": "<length-percentage>",
    "grid-row-start": "<grid-line>",
    "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
    "grid-template-areas": "none|<string>+",
    "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
    "height": "auto|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "hyphenate-character": "auto|<string>",
    "hyphenate-limit-chars": "[auto|<integer>]{1,3}",
    "hyphens": "none|manual|auto",
    "image-orientation": "from-image|<angle>|[<angle>? flip]",
    "image-rendering": "auto|crisp-edges|pixelated|smooth|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
    "image-resolution": "[from-image||<resolution>]&&snap?",
    "ime-mode": "auto|normal|active|inactive|disabled",
    "initial-letter": "normal|[<number> <integer>?]",
    "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
    "inline-size": "<'width'>",
    "inset": "<'top'>{1,4}",
    "inset-block": "<'top'>{1,2}",
    "inset-block-end": "<'top'>",
    "inset-block-start": "<'top'>",
    "inset-inline": "<'top'>{1,2}",
    "inset-inline-end": "<'top'>",
    "inset-inline-start": "<'top'>",
    "interpolate-size": "numeric-only|allow-keywords",
    "isolation": "auto|isolate",
    "interactivity": "auto|inert",
    "interest-delay": "<'interest-delay-start'>{1,2}",
    "interest-delay-end": "normal|<time>",
    "interest-delay-start": "normal|<time>",
    "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
    "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]|anchor-center",
    "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|anchor-center",
    "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
    "left": "auto|<length-percentage>|<anchor()>|<anchor-size()>",
    "letter-spacing": "normal|<length-percentage>",
    "lighting-color": "<color>",
    "line-break": "auto|loose|normal|strict|anywhere",
    "line-clamp": "none|<integer>",
    "line-height": "normal|<number>|<length>|<percentage>",
    "line-height-step": "<length>",
    "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
    "list-style-image": "<image>|none",
    "list-style-position": "inside|outside",
    "list-style-type": "<counter-style>|<string>|none",
    "margin": "<'margin-top'>{1,4}",
    "margin-block": "<'margin-top'>{1,2}",
    "margin-block-end": "<'margin-top'>",
    "margin-block-start": "<'margin-top'>",
    "margin-bottom": "<length-percentage>|auto|<anchor-size()>",
    "margin-inline": "<'margin-top'>{1,2}",
    "margin-inline-end": "<'margin-top'>",
    "margin-inline-start": "<'margin-top'>",
    "margin-left": "<length-percentage>|auto|<anchor-size()>",
    "margin-right": "<length-percentage>|auto|<anchor-size()>",
    "margin-top": "<length-percentage>|auto|<anchor-size()>",
    "margin-trim": "none|in-flow|all",
    "marker": "none|<url>",
    "marker-end": "none|<url>",
    "marker-mid": "none|<url>",
    "marker-start": "none|<url>",
    "mask": "<mask-layer>#",
    "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
    "mask-border-mode": "luminance|alpha",
    "mask-border-outset": "[<length>|<number>]{1,4}",
    "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
    "mask-border-slice": "<number-percentage>{1,4} fill?",
    "mask-border-source": "none|<image>",
    "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
    "mask-clip": "[<coord-box>|no-clip]#",
    "mask-composite": "<compositing-operator>#",
    "mask-image": "<mask-reference>#",
    "mask-mode": "<masking-mode>#",
    "mask-origin": "<coord-box>#",
    "mask-position": "<position>#",
    "mask-repeat": "<repeat-style>#",
    "mask-size": "<bg-size>#",
    "mask-type": "luminance|alpha",
    "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
    "math-depth": "auto-add|add( <integer> )|<integer>",
    "math-shift": "normal|compact",
    "math-style": "normal|compact",
    "max-block-size": "<'max-width'>",
    "max-height": "none|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "max-inline-size": "<'max-width'>",
    "max-lines": "none|<integer>",
    "max-width": "none|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "min-block-size": "<'min-width'>",
    "min-height": "auto|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "min-inline-size": "<'min-width'>",
    "min-width": "auto|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "mix-blend-mode": "<blend-mode>|plus-darker|plus-lighter",
    "object-fit": "fill|contain|cover|none|scale-down",
    "object-position": "<position>",
    "object-view-box": "none|<basic-shape-rect>",
    "offset": "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
    "offset-anchor": "auto|<position>",
    "offset-distance": "<length-percentage>",
    "offset-path": "none|<offset-path>||<coord-box>",
    "offset-position": "normal|auto|<position>",
    "offset-rotate": "[auto|reverse]||<angle>",
    "opacity": "<opacity-value>",
    "order": "<integer>",
    "orphans": "<integer>",
    "outline": "<'outline-width'>||<'outline-style'>||<'outline-color'>",
    "outline-color": "auto|<color>",
    "outline-offset": "<length>",
    "outline-style": "auto|<outline-line-style>",
    "outline-width": "<line-width>",
    "overflow": "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
    "overflow-anchor": "auto|none",
    "overflow-block": "visible|hidden|clip|scroll|auto|<-non-standard-overflow>",
    "overflow-clip-box": "padding-box|content-box",
    "overflow-clip-margin": "<visual-box>||<length [0,∞]>",
    "overflow-inline": "visible|hidden|clip|scroll|auto|<-non-standard-overflow>",
    "overflow-wrap": "normal|break-word|anywhere",
    "overflow-x": "visible|hidden|clip|scroll|auto|<-non-standard-overflow>",
    "overflow-y": "visible|hidden|clip|scroll|auto|<-non-standard-overflow>",
    "overlay": "none|auto",
    "overscroll-behavior": "[contain|none|auto]{1,2}",
    "overscroll-behavior-block": "contain|none|auto",
    "overscroll-behavior-inline": "contain|none|auto",
    "overscroll-behavior-x": "contain|none|auto",
    "overscroll-behavior-y": "contain|none|auto",
    "padding": "<'padding-top'>{1,4}",
    "padding-block": "<'padding-top'>{1,2}",
    "padding-block-end": "<'padding-top'>",
    "padding-block-start": "<'padding-top'>",
    "padding-bottom": "<length-percentage [0,∞]>",
    "padding-inline": "<'padding-top'>{1,2}",
    "padding-inline-end": "<'padding-top'>",
    "padding-inline-start": "<'padding-top'>",
    "padding-left": "<length-percentage [0,∞]>",
    "padding-right": "<length-percentage [0,∞]>",
    "padding-top": "<length-percentage [0,∞]>",
    "page": "auto|<custom-ident>",
    "page-break-after": "auto|always|avoid|left|right|recto|verso",
    "page-break-before": "auto|always|avoid|left|right|recto|verso",
    "page-break-inside": "auto|avoid",
    "paint-order": "normal|[fill||stroke||markers]",
    "perspective": "none|<length>",
    "perspective-origin": "<position>",
    "place-content": "<'align-content'> <'justify-content'>?",
    "place-items": "<'align-items'> <'justify-items'>?",
    "place-self": "<'align-self'> <'justify-self'>?",
    "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
    "position": "static|relative|absolute|sticky|fixed|-webkit-sticky",
    "position-anchor": "auto|none|<anchor-name>",
    "position-area": "none|<position-area>",
    "position-try": "<'position-try-order'>? <'position-try-fallbacks'>",
    "position-try-fallbacks": "none|[[<dashed-ident>||<try-tactic>]|<'position-area'>]#",
    "position-try-order": "normal|<try-size>",
    "position-visibility": "always|[anchors-valid||anchors-visible||no-overflow]",
    "print-color-adjust": "economy|exact",
    "quotes": "none|auto|[<string> <string>]+",
    "r": "<length>|<percentage>",
    "reading-flow": "normal|source-order|flex-visual|flex-flow|grid-rows|grid-columns|grid-order",
    "reading-order": "<integer>",
    "resize": "none|both|horizontal|vertical|block|inline",
    "right": "auto|<length-percentage>|<anchor()>|<anchor-size()>",
    "rotate": "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
    "row-gap": "normal|<length-percentage>",
    "ruby-align": "start|center|space-between|space-around",
    "ruby-merge": "separate|collapse|auto",
    "ruby-overhang": "auto|none",
    "ruby-position": "[alternate||[over|under]]|inter-character",
    "rx": "<length>|<percentage>",
    "ry": "<length>|<percentage>",
    "scale": "none|[<number>|<percentage>]{1,3}",
    "scroll-behavior": "auto|smooth",
    "scroll-initial-target": "none|nearest",
    "scroll-margin": "<length>{1,4}",
    "scroll-margin-block": "<length>{1,2}",
    "scroll-margin-block-end": "<length>",
    "scroll-margin-block-start": "<length>",
    "scroll-margin-bottom": "<length>",
    "scroll-margin-inline": "<length>{1,2}",
    "scroll-margin-inline-end": "<length>",
    "scroll-margin-inline-start": "<length>",
    "scroll-margin-left": "<length>",
    "scroll-margin-right": "<length>",
    "scroll-margin-top": "<length>",
    "scroll-marker-group": "none|before|after",
    "scroll-padding": "[auto|<length-percentage>]{1,4}",
    "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-block-end": "auto|<length-percentage>",
    "scroll-padding-block-start": "auto|<length-percentage>",
    "scroll-padding-bottom": "auto|<length-percentage>",
    "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-inline-end": "auto|<length-percentage>",
    "scroll-padding-inline-start": "auto|<length-percentage>",
    "scroll-padding-left": "auto|<length-percentage>",
    "scroll-padding-right": "auto|<length-percentage>",
    "scroll-padding-top": "auto|<length-percentage>",
    "scroll-snap-align": "[none|start|end|center]{1,2}",
    "scroll-snap-coordinate": "none|<position>#",
    "scroll-snap-destination": "<position>",
    "scroll-snap-points-x": "none|repeat( <length-percentage> )",
    "scroll-snap-points-y": "none|repeat( <length-percentage> )",
    "scroll-snap-stop": "normal|always",
    "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
    "scroll-snap-type-x": "none|mandatory|proximity",
    "scroll-snap-type-y": "none|mandatory|proximity",
    "scroll-target-group": "none|auto",
    "scroll-timeline": "[<'scroll-timeline-name'> <'scroll-timeline-axis'>?]#",
    "scroll-timeline-axis": "[block|inline|x|y]#",
    "scroll-timeline-name": "[none|<dashed-ident>]#",
    "scrollbar-color": "auto|<color>{2}",
    "scrollbar-gutter": "auto|stable&&both-edges?",
    "scrollbar-width": "auto|thin|none",
    "shape-image-threshold": "<opacity-value>",
    "shape-margin": "<length-percentage>",
    "shape-outside": "none|[<shape-box>||<basic-shape>]|<image>",
    "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
    "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
    "stop-color": "<'color'>",
    "stop-opacity": "<'opacity'>",
    "stroke": "<paint>",
    "stroke-color": "<color>",
    "stroke-dasharray": "none|[<svg-length>+]#",
    "stroke-dashoffset": "<svg-length>",
    "stroke-linecap": "butt|round|square",
    "stroke-linejoin": "miter|round|bevel",
    "stroke-miterlimit": "<number-one-or-greater>",
    "stroke-opacity": "<'opacity'>",
    "stroke-width": "<svg-length>",
    "tab-size": "<integer>|<length>",
    "table-layout": "auto|fixed",
    "text-align": "start|end|left|right|center|justify|match-parent",
    "text-align-last": "auto|start|end|left|right|center|justify",
    "text-anchor": "start|middle|end",
    "text-autospace": "normal|<autospace>|auto",
    "text-box": "normal|<'text-box-trim'>||<'text-box-edge'>",
    "text-box-edge": "auto|<text-edge>",
    "text-box-trim": "none|trim-start|trim-end|trim-both",
    "text-combine-upright": "none|all|[digits <integer>?]",
    "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
    "text-decoration-color": "<color>",
    "text-decoration-inset": "<length>{1,2}|auto",
    "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
    "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
    "text-decoration-skip-ink": "auto|all|none",
    "text-decoration-style": "solid|double|dotted|dashed|wavy",
    "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
    "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
    "text-emphasis-color": "<color>",
    "text-emphasis-position": "auto|[over|under]&&[right|left]?",
    "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
    "text-indent": "<length-percentage>&&hanging?&&each-line?",
    "text-justify": "auto|inter-character|inter-word|none",
    "text-orientation": "mixed|upright|sideways",
    "text-overflow": "[clip|ellipsis|<string>]{1,2}",
    "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
    "text-shadow": "none|<shadow-t>#",
    "text-size-adjust": "none|auto|<percentage>",
    "text-spacing-trim": "space-all|normal|space-first|trim-start",
    "text-transform": "none|[capitalize|uppercase|lowercase]||full-width||full-size-kana|math-auto",
    "text-underline-offset": "auto|<length>|<percentage>",
    "text-underline-position": "auto|from-font|[under||[left|right]]",
    "text-wrap": "<'text-wrap-mode'>||<'text-wrap-style'>",
    "text-wrap-mode": "wrap|nowrap",
    "text-wrap-style": "auto|balance|stable|pretty",
    "timeline-scope": "none|<dashed-ident>#",
    "timeline-trigger": "none|[<'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> ['/' <'timeline-trigger-exit-range'>]?]#",
    "timeline-trigger-name": "none|<dashed-ident>#",
    "timeline-trigger-exit-range": "[<'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>?]#",
    "timeline-trigger-exit-range-end": "[auto|normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "timeline-trigger-exit-range-start": "[auto|normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "timeline-trigger-range": "[<'timeline-trigger-range-start'> <'timeline-trigger-range-end'>?]#",
    "timeline-trigger-range-end": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "timeline-trigger-range-start": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "timeline-trigger-source": "<single-animation-timeline>#",
    "top": "auto|<length-percentage>|<anchor()>|<anchor-size()>",
    "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
    "transform": "none|<transform-list>",
    "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
    "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
    "transform-style": "flat|preserve-3d",
    "transition": "<single-transition>#",
    "transition-behavior": "<transition-behavior-value>#",
    "transition-delay": "<time>#",
    "transition-duration": "<time>#",
    "transition-property": "none|<single-transition-property>#",
    "transition-timing-function": "<easing-function>#",
    "translate": "none|<length-percentage> [<length-percentage> <length>?]?",
    "trigger-scope": "none|all|<dashed-ident>#",
    "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
    "user-select": "auto|text|none|all",
    "vector-effect": "none|non-scaling-stroke|non-scaling-size|non-rotation|fixed-position",
    "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
    "view-timeline": "[<'view-timeline-name'> [<'view-timeline-axis'>||<'view-timeline-inset'>]?]#",
    "view-timeline-axis": "[block|inline|x|y]#",
    "view-timeline-inset": "[[auto|<length-percentage>]{1,2}]#",
    "view-timeline-name": "[none|<dashed-ident>]#",
    "view-transition-class": "none|<custom-ident>+",
    "view-transition-name": "none|<custom-ident>|match-element",
    "visibility": "visible|hidden|collapse",
    "white-space": "normal|pre|pre-wrap|pre-line|<'white-space-collapse'>||<'text-wrap-mode'>",
    "white-space-collapse": "collapse|preserve|preserve-breaks|preserve-spaces|break-spaces",
    "widows": "<integer>",
    "width": "auto|<length-percentage [0,∞]>|min-content|max-content|fit-content|fit-content( <length-percentage [0,∞]> )|<calc-size()>|<anchor-size()>|stretch|<-non-standard-size>",
    "will-change": "auto|<animateable-feature>#",
    "word-break": "normal|break-all|keep-all|break-word|auto-phrase",
    "word-spacing": "normal|<length>",
    "word-wrap": "normal|break-word",
    "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
    "x": "<length>|<percentage>",
    "y": "<length>|<percentage>",
    "z-index": "auto|<integer>",
    "zoom": "normal|reset|<number [0,∞]>||<percentage [0,∞]>",
    "-moz-background-clip": "padding|border",
    "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
    "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
    "-moz-border-radius-topleft": "<'border-top-left-radius'>",
    "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
    "-moz-control-character-visibility": "visible|hidden",
    "-moz-osx-font-smoothing": "auto|grayscale",
    "-moz-user-select": "none|text|all|-moz-none",
    "-ms-flex-align": "start|end|center|baseline|stretch",
    "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
    "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
    "-ms-flex-negative": "<'flex-shrink'>",
    "-ms-flex-pack": "start|end|center|justify|distribute",
    "-ms-flex-order": "<integer>",
    "-ms-flex-positive": "<'flex-grow'>",
    "-ms-flex-preferred-size": "<'flex-basis'>",
    "-ms-interpolation-mode": "nearest-neighbor|bicubic",
    "-ms-grid-column-align": "start|end|center|stretch",
    "-ms-grid-row-align": "start|end|center|stretch",
    "-ms-hyphenate-limit-last": "none|always|column|page|spread",
    "-webkit-background-clip": "[<visual-box>|border|padding|content|text]#",
    "-webkit-column-break-after": "always|auto|avoid",
    "-webkit-column-break-before": "always|auto|avoid",
    "-webkit-column-break-inside": "always|auto|avoid",
    "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
    "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
    "-webkit-print-color-adjust": "economy|exact",
    "-webkit-text-security": "none|circle|disc|square",
    "-webkit-user-drag": "none|element|auto",
    "behavior": "<url>+",
    "cue": "<'cue-before'> <'cue-after'>?",
    "cue-after": "<url> <decibel>?|none",
    "cue-before": "<url> <decibel>?|none",
    "glyph-orientation-horizontal": "<angle>",
    "glyph-orientation-vertical": "<angle>",
    "kerning": "auto|<svg-length>",
    "pause": "<'pause-before'> <'pause-after'>?",
    "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "position-try-options": "<'position-try-fallbacks'>",
    "rest": "<'rest-before'> <'rest-after'>?",
    "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "speak": "auto|never|always",
    "voice-balance": "<number>|left|center|right|leftwards|rightwards",
    "voice-duration": "auto|<time>",
    "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
    "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
    "voice-stress": "normal|strong|moderate|none|reduced",
    "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]",
    "white-space-trim": "none|discard-before||discard-after||discard-inner"
  },
  "atrules": {
    "charset": {
      "prelude": "<string>",
      "descriptors": null
    },
    "counter-style": {
      "prelude": "<counter-style-name>",
      "descriptors": {
        "additive-symbols": "[<integer [0,∞]>&&<symbol>]#",
        "fallback": "<counter-style-name>",
        "negative": "<symbol> <symbol>?",
        "pad": "<integer [0,∞]>&&<symbol>",
        "prefix": "<symbol>",
        "range": "[[<integer>|infinite]{2}]#|auto",
        "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
        "suffix": "<symbol>",
        "symbols": "<symbol>+",
        "system": "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
      }
    },
    "container": {
      "prelude": "[<container-name>]? <container-condition>",
      "descriptors": null
    },
    "document": {
      "prelude": "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
      "descriptors": null
    },
    "font-face": {
      "prelude": null,
      "descriptors": {
        "ascent-override": "normal|<percentage>",
        "descent-override": "normal|<percentage>",
        "font-display": "auto|block|swap|fallback|optional",
        "font-family": "<family-name>",
        "font-feature-settings": "normal|<feature-tag-value>#",
        "font-stretch": "<font-stretch-absolute>{1,2}",
        "font-style": "normal|italic|oblique <angle>{0,2}",
        "font-variation-settings": "normal|[<string> <number>]#",
        "font-weight": "<font-weight-absolute>{1,2}",
        "line-gap-override": "normal|<percentage>",
        "size-adjust": "<percentage>",
        "src": "[<url> [format( <string># )]?|local( <family-name> )]#",
        "unicode-range": "<urange>#"
      }
    },
    "font-feature-values": {
      "prelude": "<family-name>#",
      "descriptors": null
    },
    "font-palette-values": {
      "prelude": "<dashed-ident>",
      "descriptors": {
        "base-palette": "light|dark|<integer [0,∞]>",
        "font-family": "<family-name>#",
        "override-colors": "[<integer [0,∞]> <color>]#"
      }
    },
    "import": {
      "prelude": "[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?",
      "descriptors": null
    },
    "keyframes": {
      "prelude": "<keyframes-name>",
      "descriptors": null
    },
    "layer": {
      "prelude": "[<layer-name>#|<layer-name>?]",
      "descriptors": null
    },
    "media": {
      "prelude": "<media-query-list>",
      "descriptors": null
    },
    "namespace": {
      "prelude": "<namespace-prefix>? [<string>|<url>]",
      "descriptors": null
    },
    "page": {
      "prelude": "<page-selector-list>",
      "descriptors": {
        "bleed": "auto|<length>",
        "marks": "none|[crop||cross]",
        "page-orientation": "upright|rotate-left|rotate-right",
        "size": "<length [0,∞]>{1,2}|auto|[<page-size>||[portrait|landscape]]"
      }
    },
    "position-try": {
      "prelude": "<dashed-ident>",
      "descriptors": {
        "top": "<'top'>",
        "left": "<'left'>",
        "bottom": "<'bottom'>",
        "right": "<'right'>",
        "inset-block-start": "<'inset-block-start'>",
        "inset-block-end": "<'inset-block-end'>",
        "inset-inline-start": "<'inset-inline-start'>",
        "inset-inline-end": "<'inset-inline-end'>",
        "inset-block": "<'inset-block'>",
        "inset-inline": "<'inset-inline'>",
        "inset": "<'inset'>",
        "margin-top": "<'margin-top'>",
        "margin-left": "<'margin-left'>",
        "margin-bottom": "<'margin-bottom'>",
        "margin-right": "<'margin-right'>",
        "margin-block-start": "<'margin-block-start'>",
        "margin-block-end": "<'margin-block-end'>",
        "margin-inline-start": "<'margin-inline-start'>",
        "margin-inline-end": "<'margin-inline-end'>",
        "margin": "<'margin'>",
        "margin-block": "<'margin-block'>",
        "margin-inline": "<'margin-inline'>",
        "width": "<'width'>",
        "height": "<'height'>",
        "min-width": "<'min-width'>",
        "min-height": "<'min-height'>",
        "max-width": "<'max-width'>",
        "max-height": "<'max-height'>",
        "block-size": "<'block-size'>",
        "inline-size": "<'inline-size'>",
        "min-block-size": "<'min-block-size'>",
        "min-inline-size": "<'min-inline-size'>",
        "max-block-size": "<'max-block-size'>",
        "max-inline-size": "<'max-inline-size'>",
        "align-self": "<'align-self'>|anchor-center",
        "justify-self": "<'justify-self'>|anchor-center"
      }
    },
    "property": {
      "prelude": "<custom-property-name>",
      "descriptors": {
        "inherits": "true|false",
        "initial-value": "<declaration-value>?",
        "syntax": "<string>"
      }
    },
    "scope": {
      "prelude": "[( <scope-start> )]? [to ( <scope-end> )]?",
      "descriptors": null
    },
    "starting-style": {
      "prelude": null,
      "descriptors": null
    },
    "supports": {
      "prelude": "<supports-condition>",
      "descriptors": null
    },
    "view-transition": {
      "prelude": null,
      "descriptors": {
        "navigation": "auto|none",
        "types": "none|<custom-ident>+"
      }
    },
    "font-features-values": {
      "prelude": "[<string>|<custom-ident>]+",
      "descriptors": {
        "font-display": "auto|block|swap|fallback|optional"
      }
    }
  }
};
const PLUSSIGN$5 = 43;
const HYPHENMINUS$2 = 45;
const N = 110;
const DISALLOW_SIGN = true;
const ALLOW_SIGN = false;
function checkInteger(offset, disallowSign) {
  let pos = this.tokenStart + offset;
  const code2 = this.charCodeAt(pos);
  if (code2 === PLUSSIGN$5 || code2 === HYPHENMINUS$2) {
    if (disallowSign) {
      this.error("Number sign is not allowed");
    }
    pos++;
  }
  for (; pos < this.tokenEnd; pos++) {
    if (!isDigit(this.charCodeAt(pos))) {
      this.error("Integer is expected", pos);
    }
  }
}
function checkTokenIsInteger(disallowSign) {
  return checkInteger.call(this, 0, disallowSign);
}
function expectCharCode(offset, code2) {
  if (!this.cmpChar(this.tokenStart + offset, code2)) {
    let msg = "";
    switch (code2) {
      case N:
        msg = "N is expected";
        break;
      case HYPHENMINUS$2:
        msg = "HyphenMinus is expected";
        break;
    }
    this.error(msg, this.tokenStart + offset);
  }
}
function consumeB() {
  let offset = 0;
  let sign = 0;
  let type = this.tokenType;
  while (type === WhiteSpace$1 || type === Comment$1) {
    type = this.lookupType(++offset);
  }
  if (type !== Number$2) {
    if (this.isDelim(PLUSSIGN$5, offset) || this.isDelim(HYPHENMINUS$2, offset)) {
      sign = this.isDelim(PLUSSIGN$5, offset) ? PLUSSIGN$5 : HYPHENMINUS$2;
      do {
        type = this.lookupType(++offset);
      } while (type === WhiteSpace$1 || type === Comment$1);
      if (type !== Number$2) {
        this.skip(offset);
        checkTokenIsInteger.call(this, DISALLOW_SIGN);
      }
    } else {
      return null;
    }
  }
  if (offset > 0) {
    this.skip(offset);
  }
  if (sign === 0) {
    type = this.charCodeAt(this.tokenStart);
    if (type !== PLUSSIGN$5 && type !== HYPHENMINUS$2) {
      this.error("Number sign is expected");
    }
  }
  checkTokenIsInteger.call(this, sign !== 0);
  return sign === HYPHENMINUS$2 ? "-" + this.consume(Number$2) : this.consume(Number$2);
}
const name$M = "AnPlusB";
const structure$M = {
  a: [String, null],
  b: [String, null]
};
function parse$N() {
  const start = this.tokenStart;
  let a2 = null;
  let b2 = null;
  if (this.tokenType === Number$2) {
    checkTokenIsInteger.call(this, ALLOW_SIGN);
    b2 = this.consume(Number$2);
  } else if (this.tokenType === Ident && this.cmpChar(this.tokenStart, HYPHENMINUS$2)) {
    a2 = "-1";
    expectCharCode.call(this, 1, N);
    switch (this.tokenEnd - this.tokenStart) {
      // -n
      // -n <signed-integer>
      // -n ['+' | '-'] <signless-integer>
      case 2:
        this.next();
        b2 = consumeB.call(this);
        break;
      // -n- <signless-integer>
      case 3:
        expectCharCode.call(this, 2, HYPHENMINUS$2);
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN);
        b2 = "-" + this.consume(Number$2);
        break;
      // <dashndashdigit-ident>
      default:
        expectCharCode.call(this, 2, HYPHENMINUS$2);
        checkInteger.call(this, 3, DISALLOW_SIGN);
        this.next();
        b2 = this.substrToCursor(start + 2);
    }
  } else if (this.tokenType === Ident || this.isDelim(PLUSSIGN$5) && this.lookupType(1) === Ident) {
    let sign = 0;
    a2 = "1";
    if (this.isDelim(PLUSSIGN$5)) {
      sign = 1;
      this.next();
    }
    expectCharCode.call(this, 0, N);
    switch (this.tokenEnd - this.tokenStart) {
      // '+'? n
      // '+'? n <signed-integer>
      // '+'? n ['+' | '-'] <signless-integer>
      case 1:
        this.next();
        b2 = consumeB.call(this);
        break;
      // '+'? n- <signless-integer>
      case 2:
        expectCharCode.call(this, 1, HYPHENMINUS$2);
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN);
        b2 = "-" + this.consume(Number$2);
        break;
      // '+'? <ndashdigit-ident>
      default:
        expectCharCode.call(this, 1, HYPHENMINUS$2);
        checkInteger.call(this, 2, DISALLOW_SIGN);
        this.next();
        b2 = this.substrToCursor(start + sign + 1);
    }
  } else if (this.tokenType === Dimension$1) {
    const code2 = this.charCodeAt(this.tokenStart);
    const sign = code2 === PLUSSIGN$5 || code2 === HYPHENMINUS$2;
    let i = this.tokenStart + sign;
    for (; i < this.tokenEnd; i++) {
      if (!isDigit(this.charCodeAt(i))) {
        break;
      }
    }
    if (i === this.tokenStart + sign) {
      this.error("Integer is expected", this.tokenStart + sign);
    }
    expectCharCode.call(this, i - this.tokenStart, N);
    a2 = this.substring(start, i);
    if (i + 1 === this.tokenEnd) {
      this.next();
      b2 = consumeB.call(this);
    } else {
      expectCharCode.call(this, i - this.tokenStart + 1, HYPHENMINUS$2);
      if (i + 2 === this.tokenEnd) {
        this.next();
        this.skipSC();
        checkTokenIsInteger.call(this, DISALLOW_SIGN);
        b2 = "-" + this.consume(Number$2);
      } else {
        checkInteger.call(this, i - this.tokenStart + 2, DISALLOW_SIGN);
        this.next();
        b2 = this.substrToCursor(i + 1);
      }
    }
  } else {
    this.error();
  }
  if (a2 !== null && a2.charCodeAt(0) === PLUSSIGN$5) {
    a2 = a2.substr(1);
  }
  if (b2 !== null && b2.charCodeAt(0) === PLUSSIGN$5) {
    b2 = b2.substr(1);
  }
  return {
    type: "AnPlusB",
    loc: this.getLocation(start, this.tokenStart),
    a: a2,
    b: b2
  };
}
function generate$N(node2) {
  if (node2.a) {
    const a2 = node2.a === "+1" && "n" || node2.a === "1" && "n" || node2.a === "-1" && "-n" || node2.a + "n";
    if (node2.b) {
      const b2 = node2.b[0] === "-" || node2.b[0] === "+" ? node2.b : "+" + node2.b;
      this.tokenize(a2 + b2);
    } else {
      this.tokenize(a2);
    }
  } else {
    this.tokenize(node2.b);
  }
}
const AnPlusB = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$N,
  name: name$M,
  parse: parse$N,
  structure: structure$M
}, Symbol.toStringTag, { value: "Module" }));
function consumeRaw$4() {
  return this.Raw(this.consumeUntilLeftCurlyBracketOrSemicolon, true);
}
function isDeclarationBlockAtrule() {
  for (let offset = 1, type; type = this.lookupType(offset); offset++) {
    if (type === RightCurlyBracket) {
      return true;
    }
    if (type === LeftCurlyBracket || type === AtKeyword) {
      return false;
    }
  }
  return false;
}
const name$L = "Atrule";
const walkContext$9 = "atrule";
const structure$L = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function parse$M(isDeclaration = false) {
  const start = this.tokenStart;
  let name2;
  let nameLowerCase;
  let prelude = null;
  let block = null;
  this.eat(AtKeyword);
  name2 = this.substrToCursor(start + 1);
  nameLowerCase = name2.toLowerCase();
  this.skipSC();
  if (this.eof === false && this.tokenType !== LeftCurlyBracket && this.tokenType !== Semicolon) {
    if (this.parseAtrulePrelude) {
      prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name2, isDeclaration), consumeRaw$4);
    } else {
      prelude = consumeRaw$4.call(this, this.tokenIndex);
    }
    this.skipSC();
  }
  switch (this.tokenType) {
    case Semicolon:
      this.next();
      break;
    case LeftCurlyBracket:
      if (hasOwnProperty.call(this.atrule, nameLowerCase) && typeof this.atrule[nameLowerCase].block === "function") {
        block = this.atrule[nameLowerCase].block.call(this, isDeclaration);
      } else {
        block = this.Block(isDeclarationBlockAtrule.call(this));
      }
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(start, this.tokenStart),
    name: name2,
    prelude,
    block
  };
}
function generate$M(node2) {
  this.token(AtKeyword, "@" + node2.name);
  if (node2.prelude !== null) {
    this.node(node2.prelude);
  }
  if (node2.block) {
    this.node(node2.block);
  } else {
    this.token(Semicolon, ";");
  }
}
const Atrule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$M,
  name: name$L,
  parse: parse$M,
  structure: structure$L,
  walkContext: walkContext$9
}, Symbol.toStringTag, { value: "Module" }));
const name$K = "AtrulePrelude";
const walkContext$8 = "atrulePrelude";
const structure$K = {
  children: [[]]
};
function parse$L(name2) {
  let children = null;
  if (name2 !== null) {
    name2 = name2.toLowerCase();
  }
  this.skipSC();
  if (hasOwnProperty.call(this.atrule, name2) && typeof this.atrule[name2].prelude === "function") {
    children = this.atrule[name2].prelude.call(this);
  } else {
    children = this.readSequence(this.scope.AtrulePrelude);
  }
  this.skipSC();
  if (this.eof !== true && this.tokenType !== LeftCurlyBracket && this.tokenType !== Semicolon) {
    this.error("Semicolon or block is expected");
  }
  return {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$L(node2) {
  this.children(node2);
}
const AtrulePrelude = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$L,
  name: name$K,
  parse: parse$L,
  structure: structure$K,
  walkContext: walkContext$8
}, Symbol.toStringTag, { value: "Module" }));
const DOLLARSIGN$1 = 36;
const ASTERISK$5 = 42;
const EQUALSSIGN$1 = 61;
const CIRCUMFLEXACCENT = 94;
const VERTICALLINE$2 = 124;
const TILDE$2 = 126;
function getAttributeName() {
  if (this.eof) {
    this.error("Unexpected end of input");
  }
  const start = this.tokenStart;
  let expectIdent = false;
  if (this.isDelim(ASTERISK$5)) {
    expectIdent = true;
    this.next();
  } else if (!this.isDelim(VERTICALLINE$2)) {
    this.eat(Ident);
  }
  if (this.isDelim(VERTICALLINE$2)) {
    if (this.charCodeAt(this.tokenStart + 1) !== EQUALSSIGN$1) {
      this.next();
      this.eat(Ident);
    } else if (expectIdent) {
      this.error("Identifier is expected", this.tokenEnd);
    }
  } else if (expectIdent) {
    this.error("Vertical line is expected");
  }
  return {
    type: "Identifier",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start)
  };
}
function getOperator() {
  const start = this.tokenStart;
  const code2 = this.charCodeAt(start);
  if (code2 !== EQUALSSIGN$1 && // =
  code2 !== TILDE$2 && // ~=
  code2 !== CIRCUMFLEXACCENT && // ^=
  code2 !== DOLLARSIGN$1 && // $=
  code2 !== ASTERISK$5 && // *=
  code2 !== VERTICALLINE$2) {
    this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected");
  }
  this.next();
  if (code2 !== EQUALSSIGN$1) {
    if (!this.isDelim(EQUALSSIGN$1)) {
      this.error("Equal sign is expected");
    }
    this.next();
  }
  return this.substrToCursor(start);
}
const name$J = "AttributeSelector";
const structure$J = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function parse$K() {
  const start = this.tokenStart;
  let name2;
  let matcher = null;
  let value2 = null;
  let flags = null;
  this.eat(LeftSquareBracket);
  this.skipSC();
  name2 = getAttributeName.call(this);
  this.skipSC();
  if (this.tokenType !== RightSquareBracket) {
    if (this.tokenType !== Ident) {
      matcher = getOperator.call(this);
      this.skipSC();
      value2 = this.tokenType === String$2 ? this.String() : this.Identifier();
      this.skipSC();
    }
    if (this.tokenType === Ident) {
      flags = this.consume(Ident);
      this.skipSC();
    }
  }
  this.eat(RightSquareBracket);
  return {
    type: "AttributeSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name2,
    matcher,
    value: value2,
    flags
  };
}
function generate$K(node2) {
  this.token(Delim, "[");
  this.node(node2.name);
  if (node2.matcher !== null) {
    this.tokenize(node2.matcher);
    this.node(node2.value);
  }
  if (node2.flags !== null) {
    this.token(Ident, node2.flags);
  }
  this.token(Delim, "]");
}
const AttributeSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$K,
  name: name$J,
  parse: parse$K,
  structure: structure$J
}, Symbol.toStringTag, { value: "Module" }));
const AMPERSAND$4 = 38;
function consumeRaw$3() {
  return this.Raw(null, true);
}
function consumeRule() {
  return this.parseWithFallback(this.Rule, consumeRaw$3);
}
function consumeRawDeclaration() {
  return this.Raw(this.consumeUntilSemicolonIncluded, true);
}
function consumeDeclaration() {
  if (this.tokenType === Semicolon) {
    return consumeRawDeclaration.call(this, this.tokenIndex);
  }
  const node2 = this.parseWithFallback(this.Declaration, consumeRawDeclaration);
  if (this.tokenType === Semicolon) {
    this.next();
  }
  return node2;
}
const name$I = "Block";
const walkContext$7 = "block";
const structure$I = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function parse$J(isStyleBlock) {
  const consumer = isStyleBlock ? consumeDeclaration : consumeRule;
  const start = this.tokenStart;
  let children = this.createList();
  this.eat(LeftCurlyBracket);
  scan:
    while (!this.eof) {
      switch (this.tokenType) {
        case RightCurlyBracket:
          break scan;
        case WhiteSpace$1:
        case Comment$1:
          this.next();
          break;
        case AtKeyword:
          children.push(this.parseWithFallback(this.Atrule.bind(this, isStyleBlock), consumeRaw$3));
          break;
        default:
          if (isStyleBlock && this.isDelim(AMPERSAND$4)) {
            children.push(consumeRule.call(this));
          } else {
            children.push(consumer.call(this));
          }
      }
    }
  if (!this.eof) {
    this.eat(RightCurlyBracket);
  }
  return {
    type: "Block",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate$J(node2) {
  this.token(LeftCurlyBracket, "{");
  this.children(node2, (prev) => {
    if (prev.type === "Declaration") {
      this.token(Semicolon, ";");
    }
  });
  this.token(RightCurlyBracket, "}");
}
const Block = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$J,
  name: name$I,
  parse: parse$J,
  structure: structure$I,
  walkContext: walkContext$7
}, Symbol.toStringTag, { value: "Module" }));
const name$H = "Brackets";
const structure$H = {
  children: [[]]
};
function parse$I(readSequence2, recognizer) {
  const start = this.tokenStart;
  let children = null;
  this.eat(LeftSquareBracket);
  children = readSequence2.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightSquareBracket);
  }
  return {
    type: "Brackets",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate$I(node2) {
  this.token(Delim, "[");
  this.children(node2);
  this.token(Delim, "]");
}
const Brackets = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$I,
  name: name$H,
  parse: parse$I,
  structure: structure$H
}, Symbol.toStringTag, { value: "Module" }));
const name$G = "CDC";
const structure$G = [];
function parse$H() {
  const start = this.tokenStart;
  this.eat(CDC$1);
  return {
    type: "CDC",
    loc: this.getLocation(start, this.tokenStart)
  };
}
function generate$H() {
  this.token(CDC$1, "-->");
}
const CDC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$H,
  name: name$G,
  parse: parse$H,
  structure: structure$G
}, Symbol.toStringTag, { value: "Module" }));
const name$F = "CDO";
const structure$F = [];
function parse$G() {
  const start = this.tokenStart;
  this.eat(CDO$1);
  return {
    type: "CDO",
    loc: this.getLocation(start, this.tokenStart)
  };
}
function generate$G() {
  this.token(CDO$1, "<!--");
}
const CDO = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$G,
  name: name$F,
  parse: parse$G,
  structure: structure$F
}, Symbol.toStringTag, { value: "Module" }));
const FULLSTOP$2 = 46;
const name$E = "ClassSelector";
const structure$E = {
  name: String
};
function parse$F() {
  this.eatDelim(FULLSTOP$2);
  return {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(Ident)
  };
}
function generate$F(node2) {
  this.token(Delim, ".");
  this.token(Ident, node2.name);
}
const ClassSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$F,
  name: name$E,
  parse: parse$F,
  structure: structure$E
}, Symbol.toStringTag, { value: "Module" }));
const PLUSSIGN$4 = 43;
const SOLIDUS$7 = 47;
const GREATERTHANSIGN$2 = 62;
const TILDE$1 = 126;
const name$D = "Combinator";
const structure$D = {
  name: String
};
function parse$E() {
  const start = this.tokenStart;
  let name2;
  switch (this.tokenType) {
    case WhiteSpace$1:
      name2 = " ";
      break;
    case Delim:
      switch (this.charCodeAt(this.tokenStart)) {
        case GREATERTHANSIGN$2:
        case PLUSSIGN$4:
        case TILDE$1:
          this.next();
          break;
        case SOLIDUS$7:
          this.next();
          this.eatIdent("deep");
          this.eatDelim(SOLIDUS$7);
          break;
        default:
          this.error("Combinator is expected");
      }
      name2 = this.substrToCursor(start);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(start, this.tokenStart),
    name: name2
  };
}
function generate$E(node2) {
  this.tokenize(node2.name);
}
const Combinator = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$E,
  name: name$D,
  parse: parse$E,
  structure: structure$D
}, Symbol.toStringTag, { value: "Module" }));
const ASTERISK$4 = 42;
const SOLIDUS$6 = 47;
const name$C = "Comment";
const structure$C = {
  value: String
};
function parse$D() {
  const start = this.tokenStart;
  let end = this.tokenEnd;
  this.eat(Comment$1);
  if (end - start + 2 >= 2 && this.charCodeAt(end - 2) === ASTERISK$4 && this.charCodeAt(end - 1) === SOLIDUS$6) {
    end -= 2;
  }
  return {
    type: "Comment",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substring(start + 2, end)
  };
}
function generate$D(node2) {
  this.token(Comment$1, "/*" + node2.value + "*/");
}
const Comment = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$D,
  name: name$C,
  parse: parse$D,
  structure: structure$C
}, Symbol.toStringTag, { value: "Module" }));
const likelyFeatureToken = /* @__PURE__ */ new Set([Colon, RightParenthesis, EOF$1]);
const name$B = "Condition";
const structure$B = {
  kind: String,
  children: [[
    "Identifier",
    "Feature",
    "FeatureFunction",
    "FeatureRange",
    "SupportsDeclaration"
  ]]
};
function featureOrRange(kind) {
  if (this.lookupTypeNonSC(1) === Ident && likelyFeatureToken.has(this.lookupTypeNonSC(2))) {
    return this.Feature(kind);
  }
  return this.FeatureRange(kind);
}
const parentheses = {
  media: featureOrRange,
  container: featureOrRange,
  supports() {
    return this.SupportsDeclaration();
  }
};
function parse$C(kind = "media") {
  const children = this.createList();
  scan: while (!this.eof) {
    switch (this.tokenType) {
      case Comment$1:
      case WhiteSpace$1:
        this.next();
        continue;
      case Ident:
        children.push(this.Identifier());
        break;
      case LeftParenthesis: {
        let term = this.parseWithFallback(
          () => parentheses[kind].call(this, kind),
          () => null
        );
        if (!term) {
          term = this.parseWithFallback(
            () => {
              this.eat(LeftParenthesis);
              const res = this.Condition(kind);
              this.eat(RightParenthesis);
              return res;
            },
            () => {
              return this.GeneralEnclosed(kind);
            }
          );
        }
        children.push(term);
        break;
      }
      case Function$2: {
        let term = this.parseWithFallback(
          () => this.FeatureFunction(kind),
          () => null
        );
        if (!term) {
          term = this.GeneralEnclosed(kind);
        }
        children.push(term);
        break;
      }
      default:
        break scan;
    }
  }
  if (children.isEmpty) {
    this.error("Condition is expected");
  }
  return {
    type: "Condition",
    loc: this.getLocationFromList(children),
    kind,
    children
  };
}
function generate$C(node2) {
  node2.children.forEach((child) => {
    if (child.type === "Condition") {
      this.token(LeftParenthesis, "(");
      this.node(child);
      this.token(RightParenthesis, ")");
    } else {
      this.node(child);
    }
  });
}
const Condition = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$C,
  name: name$B,
  parse: parse$C,
  structure: structure$B
}, Symbol.toStringTag, { value: "Module" }));
const EXCLAMATIONMARK$1 = 33;
const NUMBERSIGN$2 = 35;
const DOLLARSIGN = 36;
const AMPERSAND$3 = 38;
const ASTERISK$3 = 42;
const PLUSSIGN$3 = 43;
const SOLIDUS$5 = 47;
function consumeValueRaw() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, true);
}
function consumeCustomPropertyRaw() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, false);
}
function consumeValue() {
  const startValueToken = this.tokenIndex;
  const value2 = this.Value();
  if (value2.type !== "Raw" && this.eof === false && this.tokenType !== Semicolon && this.isDelim(EXCLAMATIONMARK$1) === false && this.isBalanceEdge(startValueToken) === false) {
    this.error();
  }
  return value2;
}
const name$A = "Declaration";
const walkContext$6 = "declaration";
const structure$A = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function parse$B() {
  const start = this.tokenStart;
  const startToken = this.tokenIndex;
  const property2 = readProperty.call(this);
  const customProperty = isCustomProperty(property2);
  const parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
  const consumeRaw2 = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
  let important2 = false;
  let value2;
  this.skipSC();
  this.eat(Colon);
  const valueStart = this.tokenIndex;
  if (!customProperty) {
    this.skipSC();
  }
  if (parseValue) {
    value2 = this.parseWithFallback(consumeValue, consumeRaw2);
  } else {
    value2 = consumeRaw2.call(this, this.tokenIndex);
  }
  if (customProperty && value2.type === "Value" && value2.children.isEmpty) {
    for (let offset = valueStart - this.tokenIndex; offset <= 0; offset++) {
      if (this.lookupType(offset) === WhiteSpace$1) {
        value2.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
    }
  }
  if (this.isDelim(EXCLAMATIONMARK$1)) {
    important2 = getImportant.call(this);
    this.skipSC();
  }
  if (this.eof === false && this.tokenType !== Semicolon && this.isBalanceEdge(startToken) === false) {
    this.error();
  }
  return {
    type: "Declaration",
    loc: this.getLocation(start, this.tokenStart),
    important: important2,
    property: property2,
    value: value2
  };
}
function generate$B(node2) {
  this.token(Ident, node2.property);
  this.token(Colon, ":");
  this.node(node2.value);
  if (node2.important) {
    this.token(Delim, "!");
    this.token(Ident, node2.important === true ? "important" : node2.important);
  }
}
function readProperty() {
  const start = this.tokenStart;
  if (this.tokenType === Delim) {
    switch (this.charCodeAt(this.tokenStart)) {
      case ASTERISK$3:
      case DOLLARSIGN:
      case PLUSSIGN$3:
      case NUMBERSIGN$2:
      case AMPERSAND$3:
        this.next();
        break;
      // TODO: not sure we should support this hack
      case SOLIDUS$5:
        this.next();
        if (this.isDelim(SOLIDUS$5)) {
          this.next();
        }
        break;
    }
  }
  if (this.tokenType === Hash$1) {
    this.eat(Hash$1);
  } else {
    this.eat(Ident);
  }
  return this.substrToCursor(start);
}
function getImportant() {
  this.eat(Delim);
  this.skipSC();
  const important2 = this.consume(Ident);
  return important2 === "important" ? true : important2;
}
const Declaration = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$B,
  name: name$A,
  parse: parse$B,
  structure: structure$A,
  walkContext: walkContext$6
}, Symbol.toStringTag, { value: "Module" }));
const AMPERSAND$2 = 38;
function consumeRaw$2() {
  return this.Raw(this.consumeUntilSemicolonIncluded, true);
}
const name$z = "DeclarationList";
const structure$z = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function parse$A() {
  const children = this.createList();
  while (!this.eof) {
    switch (this.tokenType) {
      case WhiteSpace$1:
      case Comment$1:
      case Semicolon:
        this.next();
        break;
      case AtKeyword:
        children.push(this.parseWithFallback(this.Atrule.bind(this, true), consumeRaw$2));
        break;
      default:
        if (this.isDelim(AMPERSAND$2)) {
          children.push(this.parseWithFallback(this.Rule, consumeRaw$2));
        } else {
          children.push(this.parseWithFallback(this.Declaration, consumeRaw$2));
        }
    }
  }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$A(node2) {
  this.children(node2, (prev) => {
    if (prev.type === "Declaration") {
      this.token(Semicolon, ";");
    }
  });
}
const DeclarationList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$A,
  name: name$z,
  parse: parse$A,
  structure: structure$z
}, Symbol.toStringTag, { value: "Module" }));
const name$y = "Dimension";
const structure$y = {
  value: String,
  unit: String
};
function parse$z() {
  const start = this.tokenStart;
  const value2 = this.consumeNumber(Dimension$1);
  return {
    type: "Dimension",
    loc: this.getLocation(start, this.tokenStart),
    value: value2,
    unit: this.substring(start + value2.length, this.tokenStart)
  };
}
function generate$z(node2) {
  this.token(Dimension$1, node2.value + node2.unit);
}
const Dimension = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$z,
  name: name$y,
  parse: parse$z,
  structure: structure$y
}, Symbol.toStringTag, { value: "Module" }));
const SOLIDUS$4 = 47;
const name$x = "Feature";
const structure$x = {
  kind: String,
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
};
function parse$y(kind) {
  const start = this.tokenStart;
  let name2;
  let value2 = null;
  this.eat(LeftParenthesis);
  this.skipSC();
  name2 = this.consume(Ident);
  this.skipSC();
  if (this.tokenType !== RightParenthesis) {
    this.eat(Colon);
    this.skipSC();
    switch (this.tokenType) {
      case Number$2:
        if (this.lookupNonWSType(1) === Delim) {
          value2 = this.Ratio();
        } else {
          value2 = this.Number();
        }
        break;
      case Dimension$1:
        value2 = this.Dimension();
        break;
      case Ident:
        value2 = this.Identifier();
        break;
      case Function$2:
        value2 = this.parseWithFallback(
          () => {
            const res = this.Function(this.readSequence, this.scope.Value);
            this.skipSC();
            if (this.isDelim(SOLIDUS$4)) {
              this.error();
            }
            return res;
          },
          () => {
            return this.Ratio();
          }
        );
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "Feature",
    loc: this.getLocation(start, this.tokenStart),
    kind,
    name: name2,
    value: value2
  };
}
function generate$y(node2) {
  this.token(LeftParenthesis, "(");
  this.token(Ident, node2.name);
  if (node2.value !== null) {
    this.token(Colon, ":");
    this.node(node2.value);
  }
  this.token(RightParenthesis, ")");
}
const Feature = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$y,
  name: name$x,
  parse: parse$y,
  structure: structure$x
}, Symbol.toStringTag, { value: "Module" }));
const name$w = "FeatureFunction";
const structure$w = {
  kind: String,
  feature: String,
  value: ["Declaration", "Selector"]
};
function getFeatureParser(kind, name2) {
  const featuresOfKind = this.features[kind] || {};
  const parser = featuresOfKind[name2];
  if (typeof parser !== "function") {
    this.error(`Unknown feature ${name2}()`);
  }
  return parser;
}
function parse$x(kind = "unknown") {
  const start = this.tokenStart;
  const functionName = this.consumeFunctionName();
  const valueParser = getFeatureParser.call(this, kind, functionName.toLowerCase());
  this.skipSC();
  const value2 = this.parseWithFallback(
    () => {
      const startValueToken = this.tokenIndex;
      const value3 = valueParser.call(this);
      if (this.eof === false && this.isBalanceEdge(startValueToken) === false) {
        this.error();
      }
      return value3;
    },
    () => this.Raw(null, false)
  );
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "FeatureFunction",
    loc: this.getLocation(start, this.tokenStart),
    kind,
    feature: functionName,
    value: value2
  };
}
function generate$x(node2) {
  this.token(Function$2, node2.feature + "(");
  this.node(node2.value);
  this.token(RightParenthesis, ")");
}
const FeatureFunction = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$x,
  name: name$w,
  parse: parse$x,
  structure: structure$w
}, Symbol.toStringTag, { value: "Module" }));
const SOLIDUS$3 = 47;
const LESSTHANSIGN = 60;
const EQUALSSIGN = 61;
const GREATERTHANSIGN$1 = 62;
const name$v = "FeatureRange";
const structure$v = {
  kind: String,
  left: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
  leftComparison: String,
  middle: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
  rightComparison: [String, null],
  right: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
};
function readTerm() {
  this.skipSC();
  switch (this.tokenType) {
    case Number$2:
      if (this.isDelim(SOLIDUS$3, this.lookupOffsetNonSC(1))) {
        return this.Ratio();
      } else {
        return this.Number();
      }
    case Dimension$1:
      return this.Dimension();
    case Ident:
      return this.Identifier();
    case Function$2:
      return this.parseWithFallback(
        () => {
          const res = this.Function(this.readSequence, this.scope.Value);
          this.skipSC();
          if (this.isDelim(SOLIDUS$3)) {
            this.error();
          }
          return res;
        },
        () => {
          return this.Ratio();
        }
      );
    default:
      this.error("Number, dimension, ratio or identifier is expected");
  }
}
function readComparison(expectColon) {
  this.skipSC();
  if (this.isDelim(LESSTHANSIGN) || this.isDelim(GREATERTHANSIGN$1)) {
    const value2 = this.source[this.tokenStart];
    this.next();
    if (this.isDelim(EQUALSSIGN)) {
      this.next();
      return value2 + "=";
    }
    return value2;
  }
  if (this.isDelim(EQUALSSIGN)) {
    return "=";
  }
  this.error(`Expected ${expectColon ? '":", ' : ""}"<", ">", "=" or ")"`);
}
function parse$w(kind = "unknown") {
  const start = this.tokenStart;
  this.skipSC();
  this.eat(LeftParenthesis);
  const left = readTerm.call(this);
  const leftComparison = readComparison.call(this, left.type === "Identifier");
  const middle = readTerm.call(this);
  let rightComparison = null;
  let right = null;
  if (this.lookupNonWSType(0) !== RightParenthesis) {
    rightComparison = readComparison.call(this);
    right = readTerm.call(this);
  }
  this.skipSC();
  this.eat(RightParenthesis);
  return {
    type: "FeatureRange",
    loc: this.getLocation(start, this.tokenStart),
    kind,
    left,
    leftComparison,
    middle,
    rightComparison,
    right
  };
}
function generate$w(node2) {
  this.token(LeftParenthesis, "(");
  this.node(node2.left);
  this.tokenize(node2.leftComparison);
  this.node(node2.middle);
  if (node2.right) {
    this.tokenize(node2.rightComparison);
    this.node(node2.right);
  }
  this.token(RightParenthesis, ")");
}
const FeatureRange = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$w,
  name: name$v,
  parse: parse$w,
  structure: structure$v
}, Symbol.toStringTag, { value: "Module" }));
const name$u = "Function";
const walkContext$5 = "function";
const structure$u = {
  name: String,
  children: [[]]
};
function parse$v(readSequence2, recognizer) {
  const start = this.tokenStart;
  const name2 = this.consumeFunctionName();
  const nameLowerCase = name2.toLowerCase();
  let children;
  children = recognizer.hasOwnProperty(nameLowerCase) ? recognizer[nameLowerCase].call(this, recognizer) : readSequence2.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "Function",
    loc: this.getLocation(start, this.tokenStart),
    name: name2,
    children
  };
}
function generate$v(node2) {
  this.token(Function$2, node2.name + "(");
  this.children(node2);
  this.token(RightParenthesis, ")");
}
const Function$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$v,
  name: name$u,
  parse: parse$v,
  structure: structure$u,
  walkContext: walkContext$5
}, Symbol.toStringTag, { value: "Module" }));
const name$t = "GeneralEnclosed";
const structure$t = {
  kind: String,
  function: [String, null],
  children: [[]]
};
function parse$u(kind) {
  const start = this.tokenStart;
  let functionName = null;
  if (this.tokenType === Function$2) {
    functionName = this.consumeFunctionName();
  } else {
    this.eat(LeftParenthesis);
  }
  const children = this.parseWithFallback(
    () => {
      const startValueToken = this.tokenIndex;
      const children2 = this.readSequence(this.scope.Value);
      if (this.eof === false && this.isBalanceEdge(startValueToken) === false) {
        this.error();
      }
      return children2;
    },
    () => this.createSingleNodeList(
      this.Raw(null, false)
    )
  );
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "GeneralEnclosed",
    loc: this.getLocation(start, this.tokenStart),
    kind,
    function: functionName,
    children
  };
}
function generate$u(node2) {
  if (node2.function) {
    this.token(Function$2, node2.function + "(");
  } else {
    this.token(LeftParenthesis, "(");
  }
  this.children(node2);
  this.token(RightParenthesis, ")");
}
const GeneralEnclosed = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$u,
  name: name$t,
  parse: parse$u,
  structure: structure$t
}, Symbol.toStringTag, { value: "Module" }));
const xxx = "XXX";
const name$s = "Hash";
const structure$s = {
  value: String
};
function parse$t() {
  const start = this.tokenStart;
  this.eat(Hash$1);
  return {
    type: "Hash",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start + 1)
  };
}
function generate$t(node2) {
  this.token(Hash$1, "#" + node2.value);
}
const Hash = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$t,
  name: name$s,
  parse: parse$t,
  structure: structure$s,
  xxx
}, Symbol.toStringTag, { value: "Module" }));
const name$r = "Identifier";
const structure$r = {
  name: String
};
function parse$s() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(Ident)
  };
}
function generate$s(node2) {
  this.token(Ident, node2.name);
}
const Identifier = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$s,
  name: name$r,
  parse: parse$s,
  structure: structure$r
}, Symbol.toStringTag, { value: "Module" }));
const name$q = "IdSelector";
const structure$q = {
  name: String
};
function parse$r() {
  const start = this.tokenStart;
  this.eat(Hash$1);
  return {
    type: "IdSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start + 1)
  };
}
function generate$r(node2) {
  this.token(Delim, "#" + node2.name);
}
const IdSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$r,
  name: name$q,
  parse: parse$r,
  structure: structure$q
}, Symbol.toStringTag, { value: "Module" }));
const FULLSTOP$1 = 46;
const name$p = "Layer";
const structure$p = {
  name: String
};
function parse$q() {
  let tokenStart = this.tokenStart;
  let name2 = this.consume(Ident);
  while (this.isDelim(FULLSTOP$1)) {
    this.eat(Delim);
    name2 += "." + this.consume(Ident);
  }
  return {
    type: "Layer",
    loc: this.getLocation(tokenStart, this.tokenStart),
    name: name2
  };
}
function generate$q(node2) {
  this.tokenize(node2.name);
}
const Layer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$q,
  name: name$p,
  parse: parse$q,
  structure: structure$p
}, Symbol.toStringTag, { value: "Module" }));
const name$o = "LayerList";
const structure$o = {
  children: [[
    "Layer"
  ]]
};
function parse$p() {
  const children = this.createList();
  this.skipSC();
  while (!this.eof) {
    children.push(this.Layer());
    if (this.lookupTypeNonSC(0) !== Comma) {
      break;
    }
    this.skipSC();
    this.next();
    this.skipSC();
  }
  return {
    type: "LayerList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$p(node2) {
  this.children(node2, () => this.token(Comma, ","));
}
const LayerList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$p,
  name: name$o,
  parse: parse$p,
  structure: structure$o
}, Symbol.toStringTag, { value: "Module" }));
const name$n = "MediaQuery";
const structure$n = {
  modifier: [String, null],
  mediaType: [String, null],
  condition: ["Condition", null]
};
function parse$o() {
  const start = this.tokenStart;
  let modifier = null;
  let mediaType = null;
  let condition = null;
  this.skipSC();
  if (this.tokenType === Ident && this.lookupTypeNonSC(1) !== LeftParenthesis) {
    const ident = this.consume(Ident);
    const identLowerCase = ident.toLowerCase();
    if (identLowerCase === "not" || identLowerCase === "only") {
      this.skipSC();
      modifier = identLowerCase;
      mediaType = this.consume(Ident);
    } else {
      mediaType = ident;
    }
    switch (this.lookupTypeNonSC(0)) {
      case Ident: {
        this.skipSC();
        this.eatIdent("and");
        condition = this.Condition("media");
        break;
      }
      case LeftCurlyBracket:
      case Semicolon:
      case Comma:
      case EOF$1:
        break;
      default:
        this.error("Identifier or parenthesis is expected");
    }
  } else {
    switch (this.tokenType) {
      case Ident:
      case LeftParenthesis:
      case Function$2: {
        condition = this.Condition("media");
        break;
      }
      case LeftCurlyBracket:
      case Semicolon:
      case EOF$1:
        break;
      default:
        this.error("Identifier or parenthesis is expected");
    }
  }
  return {
    type: "MediaQuery",
    loc: this.getLocation(start, this.tokenStart),
    modifier,
    mediaType,
    condition
  };
}
function generate$o(node2) {
  if (node2.mediaType) {
    if (node2.modifier) {
      this.token(Ident, node2.modifier);
    }
    this.token(Ident, node2.mediaType);
    if (node2.condition) {
      this.token(Ident, "and");
      this.node(node2.condition);
    }
  } else if (node2.condition) {
    this.node(node2.condition);
  }
}
const MediaQuery = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$o,
  name: name$n,
  parse: parse$o,
  structure: structure$n
}, Symbol.toStringTag, { value: "Module" }));
const name$m = "MediaQueryList";
const structure$m = {
  children: [[
    "MediaQuery"
  ]]
};
function parse$n() {
  const children = this.createList();
  this.skipSC();
  while (!this.eof) {
    children.push(this.MediaQuery());
    if (this.tokenType !== Comma) {
      break;
    }
    this.next();
  }
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$n(node2) {
  this.children(node2, () => this.token(Comma, ","));
}
const MediaQueryList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$n,
  name: name$m,
  parse: parse$n,
  structure: structure$m
}, Symbol.toStringTag, { value: "Module" }));
const AMPERSAND$1 = 38;
const name$l = "NestingSelector";
const structure$l = {};
function parse$m() {
  const start = this.tokenStart;
  this.eatDelim(AMPERSAND$1);
  return {
    type: "NestingSelector",
    loc: this.getLocation(start, this.tokenStart)
  };
}
function generate$m() {
  this.token(Delim, "&");
}
const NestingSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$m,
  name: name$l,
  parse: parse$m,
  structure: structure$l
}, Symbol.toStringTag, { value: "Module" }));
const name$k = "Nth";
const structure$k = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function parse$l() {
  this.skipSC();
  const start = this.tokenStart;
  let end = start;
  let selector2 = null;
  let nth2;
  if (this.lookupValue(0, "odd") || this.lookupValue(0, "even")) {
    nth2 = this.Identifier();
  } else {
    nth2 = this.AnPlusB();
  }
  end = this.tokenStart;
  this.skipSC();
  if (this.lookupValue(0, "of")) {
    this.next();
    selector2 = this.SelectorList();
    end = this.tokenStart;
  }
  return {
    type: "Nth",
    loc: this.getLocation(start, end),
    nth: nth2,
    selector: selector2
  };
}
function generate$l(node2) {
  this.node(node2.nth);
  if (node2.selector !== null) {
    this.token(Ident, "of");
    this.node(node2.selector);
  }
}
const Nth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$l,
  name: name$k,
  parse: parse$l,
  structure: structure$k
}, Symbol.toStringTag, { value: "Module" }));
const name$j = "Number";
const structure$j = {
  value: String
};
function parse$k() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(Number$2)
  };
}
function generate$k(node2) {
  this.token(Number$2, node2.value);
}
const Number$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$k,
  name: name$j,
  parse: parse$k,
  structure: structure$j
}, Symbol.toStringTag, { value: "Module" }));
const name$i = "Operator";
const structure$i = {
  value: String
};
function parse$j() {
  const start = this.tokenStart;
  this.next();
  return {
    type: "Operator",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start)
  };
}
function generate$j(node2) {
  this.tokenize(node2.value);
}
const Operator = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$j,
  name: name$i,
  parse: parse$j,
  structure: structure$i
}, Symbol.toStringTag, { value: "Module" }));
const name$h = "Parentheses";
const structure$h = {
  children: [[]]
};
function parse$i(readSequence2, recognizer) {
  const start = this.tokenStart;
  let children = null;
  this.eat(LeftParenthesis);
  children = readSequence2.call(this, recognizer);
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "Parentheses",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate$i(node2) {
  this.token(LeftParenthesis, "(");
  this.children(node2);
  this.token(RightParenthesis, ")");
}
const Parentheses = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$i,
  name: name$h,
  parse: parse$i,
  structure: structure$h
}, Symbol.toStringTag, { value: "Module" }));
const name$g = "Percentage";
const structure$g = {
  value: String
};
function parse$h() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(Percentage$1)
  };
}
function generate$h(node2) {
  this.token(Percentage$1, node2.value + "%");
}
const Percentage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$h,
  name: name$g,
  parse: parse$h,
  structure: structure$g
}, Symbol.toStringTag, { value: "Module" }));
const name$f = "PseudoClassSelector";
const walkContext$4 = "function";
const structure$f = {
  name: String,
  children: [["Raw"], null]
};
function parse$g() {
  const start = this.tokenStart;
  let children = null;
  let name2;
  let nameLowerCase;
  this.eat(Colon);
  if (this.tokenType === Function$2) {
    name2 = this.consumeFunctionName();
    nameLowerCase = name2.toLowerCase();
    if (this.lookupNonWSType(0) == RightParenthesis) {
      children = this.createList();
    } else if (hasOwnProperty.call(this.pseudo, nameLowerCase)) {
      this.skipSC();
      children = this.pseudo[nameLowerCase].call(this);
      this.skipSC();
    } else {
      children = this.createList();
      children.push(
        this.Raw(null, false)
      );
    }
    this.eat(RightParenthesis);
  } else {
    name2 = this.consume(Ident);
  }
  return {
    type: "PseudoClassSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name2,
    children
  };
}
function generate$g(node2) {
  this.token(Colon, ":");
  if (node2.children === null) {
    this.token(Ident, node2.name);
  } else {
    this.token(Function$2, node2.name + "(");
    this.children(node2);
    this.token(RightParenthesis, ")");
  }
}
const PseudoClassSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$g,
  name: name$f,
  parse: parse$g,
  structure: structure$f,
  walkContext: walkContext$4
}, Symbol.toStringTag, { value: "Module" }));
const name$e = "PseudoElementSelector";
const walkContext$3 = "function";
const structure$e = {
  name: String,
  children: [["Raw"], null]
};
function parse$f() {
  const start = this.tokenStart;
  let children = null;
  let name2;
  let nameLowerCase;
  this.eat(Colon);
  this.eat(Colon);
  if (this.tokenType === Function$2) {
    name2 = this.consumeFunctionName();
    nameLowerCase = name2.toLowerCase();
    if (this.lookupNonWSType(0) == RightParenthesis) {
      children = this.createList();
    } else if (hasOwnProperty.call(this.pseudo, nameLowerCase)) {
      this.skipSC();
      children = this.pseudo[nameLowerCase].call(this);
      this.skipSC();
    } else {
      children = this.createList();
      children.push(
        this.Raw(null, false)
      );
    }
    this.eat(RightParenthesis);
  } else {
    name2 = this.consume(Ident);
  }
  return {
    type: "PseudoElementSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: name2,
    children
  };
}
function generate$f(node2) {
  this.token(Colon, ":");
  this.token(Colon, ":");
  if (node2.children === null) {
    this.token(Ident, node2.name);
  } else {
    this.token(Function$2, node2.name + "(");
    this.children(node2);
    this.token(RightParenthesis, ")");
  }
}
const PseudoElementSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$f,
  name: name$e,
  parse: parse$f,
  structure: structure$e,
  walkContext: walkContext$3
}, Symbol.toStringTag, { value: "Module" }));
const SOLIDUS$2 = 47;
function consumeTerm() {
  this.skipSC();
  switch (this.tokenType) {
    case Number$2:
      return this.Number();
    case Function$2:
      return this.Function(this.readSequence, this.scope.Value);
    default:
      this.error("Number of function is expected");
  }
}
const name$d = "Ratio";
const structure$d = {
  left: ["Number", "Function"],
  right: ["Number", "Function", null]
};
function parse$e() {
  const start = this.tokenStart;
  const left = consumeTerm.call(this);
  let right = null;
  this.skipSC();
  if (this.isDelim(SOLIDUS$2)) {
    this.eatDelim(SOLIDUS$2);
    right = consumeTerm.call(this);
  }
  return {
    type: "Ratio",
    loc: this.getLocation(start, this.tokenStart),
    left,
    right
  };
}
function generate$e(node2) {
  this.node(node2.left);
  this.token(Delim, "/");
  if (node2.right) {
    this.node(node2.right);
  } else {
    this.node(Number$2, 1);
  }
}
const Ratio = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$e,
  name: name$d,
  parse: parse$e,
  structure: structure$d
}, Symbol.toStringTag, { value: "Module" }));
function getOffsetExcludeWS() {
  if (this.tokenIndex > 0) {
    if (this.lookupType(-1) === WhiteSpace$1) {
      return this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset;
    }
  }
  return this.tokenStart;
}
const name$c = "Raw";
const structure$c = {
  value: String
};
function parse$d(consumeUntil, excludeWhiteSpace) {
  const startOffset = this.getTokenStart(this.tokenIndex);
  let endOffset;
  this.skipUntilBalanced(this.tokenIndex, consumeUntil || this.consumeUntilBalanceEnd);
  if (excludeWhiteSpace && this.tokenStart > startOffset) {
    endOffset = getOffsetExcludeWS.call(this);
  } else {
    endOffset = this.tokenStart;
  }
  return {
    type: "Raw",
    loc: this.getLocation(startOffset, endOffset),
    value: this.substring(startOffset, endOffset)
  };
}
function generate$d(node2) {
  this.tokenize(node2.value);
}
const Raw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$d,
  name: name$c,
  parse: parse$d,
  structure: structure$c
}, Symbol.toStringTag, { value: "Module" }));
function consumeRaw$1() {
  return this.Raw(this.consumeUntilLeftCurlyBracket, true);
}
function consumePrelude() {
  const prelude = this.SelectorList();
  if (prelude.type !== "Raw" && this.eof === false && this.tokenType !== LeftCurlyBracket) {
    this.error();
  }
  return prelude;
}
const name$b = "Rule";
const walkContext$2 = "rule";
const structure$b = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function parse$c() {
  const startToken = this.tokenIndex;
  const startOffset = this.tokenStart;
  let prelude;
  let block;
  if (this.parseRulePrelude) {
    prelude = this.parseWithFallback(consumePrelude, consumeRaw$1);
  } else {
    prelude = consumeRaw$1.call(this, startToken);
  }
  block = this.Block(true);
  return {
    type: "Rule",
    loc: this.getLocation(startOffset, this.tokenStart),
    prelude,
    block
  };
}
function generate$c(node2) {
  this.node(node2.prelude);
  this.node(node2.block);
}
const Rule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$c,
  name: name$b,
  parse: parse$c,
  structure: structure$b,
  walkContext: walkContext$2
}, Symbol.toStringTag, { value: "Module" }));
const name$a = "Scope";
const structure$a = {
  root: ["SelectorList", "Raw", null],
  limit: ["SelectorList", "Raw", null]
};
function parse$b() {
  let root = null;
  let limit = null;
  this.skipSC();
  const startOffset = this.tokenStart;
  if (this.tokenType === LeftParenthesis) {
    this.next();
    this.skipSC();
    root = this.parseWithFallback(
      this.SelectorList,
      () => this.Raw(false, true)
    );
    this.skipSC();
    this.eat(RightParenthesis);
  }
  if (this.lookupNonWSType(0) === Ident) {
    this.skipSC();
    this.eatIdent("to");
    this.skipSC();
    this.eat(LeftParenthesis);
    this.skipSC();
    limit = this.parseWithFallback(
      this.SelectorList,
      () => this.Raw(false, true)
    );
    this.skipSC();
    this.eat(RightParenthesis);
  }
  return {
    type: "Scope",
    loc: this.getLocation(startOffset, this.tokenStart),
    root,
    limit
  };
}
function generate$b(node2) {
  if (node2.root) {
    this.token(LeftParenthesis, "(");
    this.node(node2.root);
    this.token(RightParenthesis, ")");
  }
  if (node2.limit) {
    this.token(Ident, "to");
    this.token(LeftParenthesis, "(");
    this.node(node2.limit);
    this.token(RightParenthesis, ")");
  }
}
const Scope = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$b,
  name: name$a,
  parse: parse$b,
  structure: structure$a
}, Symbol.toStringTag, { value: "Module" }));
const name$9 = "Selector";
const structure$9 = {
  children: [[
    "TypeSelector",
    "IdSelector",
    "ClassSelector",
    "AttributeSelector",
    "PseudoClassSelector",
    "PseudoElementSelector",
    "Combinator"
  ]]
};
function parse$a() {
  const children = this.readSequence(this.scope.Selector);
  if (this.getFirstListNode(children) === null) {
    this.error("Selector is expected");
  }
  return {
    type: "Selector",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$a(node2) {
  this.children(node2);
}
const Selector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$a,
  name: name$9,
  parse: parse$a,
  structure: structure$9
}, Symbol.toStringTag, { value: "Module" }));
const name$8 = "SelectorList";
const walkContext$1 = "selector";
const structure$8 = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function parse$9() {
  const children = this.createList();
  while (!this.eof) {
    children.push(this.Selector());
    if (this.tokenType === Comma) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(children),
    children
  };
}
function generate$9(node2) {
  this.children(node2, () => this.token(Comma, ","));
}
const SelectorList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$9,
  name: name$8,
  parse: parse$9,
  structure: structure$8,
  walkContext: walkContext$1
}, Symbol.toStringTag, { value: "Module" }));
const REVERSE_SOLIDUS$1 = 92;
const QUOTATION_MARK$1 = 34;
const APOSTROPHE$1 = 39;
function decode$1(str) {
  const len = str.length;
  const firstChar = str.charCodeAt(0);
  const start = firstChar === QUOTATION_MARK$1 || firstChar === APOSTROPHE$1 ? 1 : 0;
  const end = start === 1 && len > 1 && str.charCodeAt(len - 1) === firstChar ? len - 2 : len - 1;
  let decoded = "";
  for (let i = start; i <= end; i++) {
    let code2 = str.charCodeAt(i);
    if (code2 === REVERSE_SOLIDUS$1) {
      if (i === end) {
        if (i !== len - 1) {
          decoded = str.substr(i + 1);
        }
        break;
      }
      code2 = str.charCodeAt(++i);
      if (isValidEscape(REVERSE_SOLIDUS$1, code2)) {
        const escapeStart = i - 1;
        const escapeEnd = consumeEscaped(str, escapeStart);
        i = escapeEnd - 1;
        decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
      } else {
        if (code2 === 13 && str.charCodeAt(i + 1) === 10) {
          i++;
        }
      }
    } else {
      decoded += str[i];
    }
  }
  return decoded;
}
function encode$1(str, apostrophe) {
  const quote = '"';
  const quoteCode = QUOTATION_MARK$1;
  let encoded = "";
  let wsBeforeHexIsNeeded = false;
  for (let i = 0; i < str.length; i++) {
    const code2 = str.charCodeAt(i);
    if (code2 === 0) {
      encoded += "�";
      continue;
    }
    if (code2 <= 31 || code2 === 127) {
      encoded += "\\" + code2.toString(16);
      wsBeforeHexIsNeeded = true;
      continue;
    }
    if (code2 === quoteCode || code2 === REVERSE_SOLIDUS$1) {
      encoded += "\\" + str.charAt(i);
      wsBeforeHexIsNeeded = false;
    } else {
      if (wsBeforeHexIsNeeded && (isHexDigit(code2) || isWhiteSpace(code2))) {
        encoded += " ";
      }
      encoded += str.charAt(i);
      wsBeforeHexIsNeeded = false;
    }
  }
  return quote + encoded + quote;
}
const name$7 = "String";
const structure$7 = {
  value: String
};
function parse$8() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: decode$1(this.consume(String$2))
  };
}
function generate$8(node2) {
  this.token(String$2, encode$1(node2.value));
}
const String$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$8,
  name: name$7,
  parse: parse$8,
  structure: structure$7
}, Symbol.toStringTag, { value: "Module" }));
const EXCLAMATIONMARK = 33;
function consumeRaw() {
  return this.Raw(null, false);
}
const name$6 = "StyleSheet";
const walkContext = "stylesheet";
const structure$6 = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function parse$7() {
  const start = this.tokenStart;
  const children = this.createList();
  let child;
  while (!this.eof) {
    switch (this.tokenType) {
      case WhiteSpace$1:
        this.next();
        continue;
      case Comment$1:
        if (this.charCodeAt(this.tokenStart + 2) !== EXCLAMATIONMARK) {
          this.next();
          continue;
        }
        child = this.Comment();
        break;
      case CDO$1:
        child = this.CDO();
        break;
      case CDC$1:
        child = this.CDC();
        break;
      // CSS Syntax Module Level 3
      // §2.2 Error handling
      // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
      case AtKeyword:
        child = this.parseWithFallback(this.Atrule, consumeRaw);
        break;
      // Anything else starts a qualified rule ...
      default:
        child = this.parseWithFallback(this.Rule, consumeRaw);
    }
    children.push(child);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate$7(node2) {
  this.children(node2);
}
const StyleSheet = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$7,
  name: name$6,
  parse: parse$7,
  structure: structure$6,
  walkContext
}, Symbol.toStringTag, { value: "Module" }));
const name$5 = "SupportsDeclaration";
const structure$5 = {
  declaration: "Declaration"
};
function parse$6() {
  const start = this.tokenStart;
  this.eat(LeftParenthesis);
  this.skipSC();
  const declaration = this.Declaration();
  if (!this.eof) {
    this.eat(RightParenthesis);
  }
  return {
    type: "SupportsDeclaration",
    loc: this.getLocation(start, this.tokenStart),
    declaration
  };
}
function generate$6(node2) {
  this.token(LeftParenthesis, "(");
  this.node(node2.declaration);
  this.token(RightParenthesis, ")");
}
const SupportsDeclaration = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$6,
  name: name$5,
  parse: parse$6,
  structure: structure$5
}, Symbol.toStringTag, { value: "Module" }));
const ASTERISK$2 = 42;
const VERTICALLINE$1 = 124;
function eatIdentifierOrAsterisk() {
  if (this.tokenType !== Ident && this.isDelim(ASTERISK$2) === false) {
    this.error("Identifier or asterisk is expected");
  }
  this.next();
}
const name$4 = "TypeSelector";
const structure$4 = {
  name: String
};
function parse$5() {
  const start = this.tokenStart;
  if (this.isDelim(VERTICALLINE$1)) {
    this.next();
    eatIdentifierOrAsterisk.call(this);
  } else {
    eatIdentifierOrAsterisk.call(this);
    if (this.isDelim(VERTICALLINE$1)) {
      this.next();
      eatIdentifierOrAsterisk.call(this);
    }
  }
  return {
    type: "TypeSelector",
    loc: this.getLocation(start, this.tokenStart),
    name: this.substrToCursor(start)
  };
}
function generate$5(node2) {
  this.tokenize(node2.name);
}
const TypeSelector = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$5,
  name: name$4,
  parse: parse$5,
  structure: structure$4
}, Symbol.toStringTag, { value: "Module" }));
const PLUSSIGN$2 = 43;
const HYPHENMINUS$1 = 45;
const QUESTIONMARK = 63;
function eatHexSequence(offset, allowDash) {
  let len = 0;
  for (let pos = this.tokenStart + offset; pos < this.tokenEnd; pos++) {
    const code2 = this.charCodeAt(pos);
    if (code2 === HYPHENMINUS$1 && allowDash && len !== 0) {
      eatHexSequence.call(this, offset + len + 1, false);
      return -1;
    }
    if (!isHexDigit(code2)) {
      this.error(
        allowDash && len !== 0 ? "Hyphen minus" + (len < 6 ? " or hex digit" : "") + " is expected" : len < 6 ? "Hex digit is expected" : "Unexpected input",
        pos
      );
    }
    if (++len > 6) {
      this.error("Too many hex digits", pos);
    }
  }
  this.next();
  return len;
}
function eatQuestionMarkSequence(max) {
  let count = 0;
  while (this.isDelim(QUESTIONMARK)) {
    if (++count > max) {
      this.error("Too many question marks");
    }
    this.next();
  }
}
function startsWith(code2) {
  if (this.charCodeAt(this.tokenStart) !== code2) {
    this.error((code2 === PLUSSIGN$2 ? "Plus sign" : "Hyphen minus") + " is expected");
  }
}
function scanUnicodeRange() {
  let hexLength = 0;
  switch (this.tokenType) {
    case Number$2:
      hexLength = eatHexSequence.call(this, 1, true);
      if (this.isDelim(QUESTIONMARK)) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
        break;
      }
      if (this.tokenType === Dimension$1 || this.tokenType === Number$2) {
        startsWith.call(this, HYPHENMINUS$1);
        eatHexSequence.call(this, 1, false);
        break;
      }
      break;
    case Dimension$1:
      hexLength = eatHexSequence.call(this, 1, true);
      if (hexLength > 0) {
        eatQuestionMarkSequence.call(this, 6 - hexLength);
      }
      break;
    default:
      this.eatDelim(PLUSSIGN$2);
      if (this.tokenType === Ident) {
        hexLength = eatHexSequence.call(this, 0, true);
        if (hexLength > 0) {
          eatQuestionMarkSequence.call(this, 6 - hexLength);
        }
        break;
      }
      if (this.isDelim(QUESTIONMARK)) {
        this.next();
        eatQuestionMarkSequence.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const name$3 = "UnicodeRange";
const structure$3 = {
  value: String
};
function parse$4() {
  const start = this.tokenStart;
  this.eatIdent("u");
  scanUnicodeRange.call(this);
  return {
    type: "UnicodeRange",
    loc: this.getLocation(start, this.tokenStart),
    value: this.substrToCursor(start)
  };
}
function generate$4(node2) {
  this.tokenize(node2.value);
}
const UnicodeRange = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$4,
  name: name$3,
  parse: parse$4,
  structure: structure$3
}, Symbol.toStringTag, { value: "Module" }));
const SPACE$1 = 32;
const REVERSE_SOLIDUS = 92;
const QUOTATION_MARK = 34;
const APOSTROPHE = 39;
const LEFTPARENTHESIS = 40;
const RIGHTPARENTHESIS = 41;
function decode(str) {
  const len = str.length;
  let start = 4;
  let end = str.charCodeAt(len - 1) === RIGHTPARENTHESIS ? len - 2 : len - 1;
  let decoded = "";
  while (start < end && isWhiteSpace(str.charCodeAt(start))) {
    start++;
  }
  while (start < end && isWhiteSpace(str.charCodeAt(end))) {
    end--;
  }
  for (let i = start; i <= end; i++) {
    let code2 = str.charCodeAt(i);
    if (code2 === REVERSE_SOLIDUS) {
      if (i === end) {
        if (i !== len - 1) {
          decoded = str.substr(i + 1);
        }
        break;
      }
      code2 = str.charCodeAt(++i);
      if (isValidEscape(REVERSE_SOLIDUS, code2)) {
        const escapeStart = i - 1;
        const escapeEnd = consumeEscaped(str, escapeStart);
        i = escapeEnd - 1;
        decoded += decodeEscaped(str.substring(escapeStart + 1, escapeEnd));
      } else {
        if (code2 === 13 && str.charCodeAt(i + 1) === 10) {
          i++;
        }
      }
    } else {
      decoded += str[i];
    }
  }
  return decoded;
}
function encode(str) {
  let encoded = "";
  let wsBeforeHexIsNeeded = false;
  for (let i = 0; i < str.length; i++) {
    const code2 = str.charCodeAt(i);
    if (code2 === 0) {
      encoded += "�";
      continue;
    }
    if (code2 <= 31 || code2 === 127) {
      encoded += "\\" + code2.toString(16);
      wsBeforeHexIsNeeded = true;
      continue;
    }
    if (code2 === SPACE$1 || code2 === REVERSE_SOLIDUS || code2 === QUOTATION_MARK || code2 === APOSTROPHE || code2 === LEFTPARENTHESIS || code2 === RIGHTPARENTHESIS) {
      encoded += "\\" + str.charAt(i);
      wsBeforeHexIsNeeded = false;
    } else {
      if (wsBeforeHexIsNeeded && isHexDigit(code2)) {
        encoded += " ";
      }
      encoded += str.charAt(i);
      wsBeforeHexIsNeeded = false;
    }
  }
  return "url(" + encoded + ")";
}
const name$2 = "Url";
const structure$2 = {
  value: String
};
function parse$3() {
  const start = this.tokenStart;
  let value2;
  switch (this.tokenType) {
    case Url$1:
      value2 = decode(this.consume(Url$1));
      break;
    case Function$2:
      if (!this.cmpStr(this.tokenStart, this.tokenEnd, "url(")) {
        this.error("Function name must be `url`");
      }
      this.eat(Function$2);
      this.skipSC();
      value2 = decode$1(this.consume(String$2));
      this.skipSC();
      if (!this.eof) {
        this.eat(RightParenthesis);
      }
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(start, this.tokenStart),
    value: value2
  };
}
function generate$3(node2) {
  this.token(Url$1, encode(node2.value));
}
const Url = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$3,
  name: name$2,
  parse: parse$3,
  structure: structure$2
}, Symbol.toStringTag, { value: "Module" }));
const name$1 = "Value";
const structure$1 = {
  children: [[]]
};
function parse$2() {
  const start = this.tokenStart;
  const children = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(start, this.tokenStart),
    children
  };
}
function generate$2(node2) {
  this.children(node2);
}
const Value = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$2,
  name: name$1,
  parse: parse$2,
  structure: structure$1
}, Symbol.toStringTag, { value: "Module" }));
const SPACE = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
});
const name = "WhiteSpace";
const structure = {
  value: String
};
function parse$1() {
  this.eat(WhiteSpace$1);
  return SPACE;
}
function generate$1(node2) {
  this.token(WhiteSpace$1, node2.value);
}
const WhiteSpace = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: generate$1,
  name,
  parse: parse$1,
  structure
}, Symbol.toStringTag, { value: "Module" }));
const node$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB,
  Atrule,
  AtrulePrelude,
  AttributeSelector,
  Block,
  Brackets,
  CDC,
  CDO,
  ClassSelector,
  Combinator,
  Comment,
  Condition,
  Declaration,
  DeclarationList,
  Dimension,
  Feature,
  FeatureFunction,
  FeatureRange,
  Function: Function$1,
  GeneralEnclosed,
  Hash,
  IdSelector,
  Identifier,
  Layer,
  LayerList,
  MediaQuery,
  MediaQueryList,
  NestingSelector,
  Nth,
  Number: Number$1,
  Operator,
  Parentheses,
  Percentage,
  PseudoClassSelector,
  PseudoElementSelector,
  Ratio,
  Raw,
  Rule,
  Scope,
  Selector,
  SelectorList,
  String: String$1,
  StyleSheet,
  SupportsDeclaration,
  TypeSelector,
  UnicodeRange,
  Url,
  Value,
  WhiteSpace
}, Symbol.toStringTag, { value: "Module" }));
const lexerConfig = {
  generic: true,
  cssWideKeywords,
  ...definitions,
  node: node$1
};
const NUMBERSIGN$1 = 35;
const ASTERISK$1 = 42;
const PLUSSIGN$1 = 43;
const HYPHENMINUS = 45;
const SOLIDUS$1 = 47;
const U = 117;
function defaultRecognizer(context) {
  switch (this.tokenType) {
    case Hash$1:
      return this.Hash();
    case Comma:
      return this.Operator();
    case LeftParenthesis:
      return this.Parentheses(this.readSequence, context.recognizer);
    case LeftSquareBracket:
      return this.Brackets(this.readSequence, context.recognizer);
    case String$2:
      return this.String();
    case Dimension$1:
      return this.Dimension();
    case Percentage$1:
      return this.Percentage();
    case Number$2:
      return this.Number();
    case Function$2:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, context.recognizer);
    case Url$1:
      return this.Url();
    case Ident:
      if (this.cmpChar(this.tokenStart, U) && this.cmpChar(this.tokenStart + 1, PLUSSIGN$1)) {
        return this.UnicodeRange();
      } else {
        return this.Identifier();
      }
    case Delim: {
      const code2 = this.charCodeAt(this.tokenStart);
      if (code2 === SOLIDUS$1 || code2 === ASTERISK$1 || code2 === PLUSSIGN$1 || code2 === HYPHENMINUS) {
        return this.Operator();
      }
      if (code2 === NUMBERSIGN$1) {
        this.error("Hex or identifier is expected", this.tokenStart + 1);
      }
      break;
    }
  }
}
const atrulePrelude = {
  getNode: defaultRecognizer
};
const NUMBERSIGN = 35;
const AMPERSAND = 38;
const ASTERISK = 42;
const PLUSSIGN = 43;
const SOLIDUS = 47;
const FULLSTOP = 46;
const GREATERTHANSIGN = 62;
const VERTICALLINE = 124;
const TILDE = 126;
function onWhiteSpace(next, children) {
  if (children.last !== null && children.last.type !== "Combinator" && next !== null && next.type !== "Combinator") {
    children.push({
      // FIXME: this.Combinator() should be used instead
      type: "Combinator",
      loc: null,
      name: " "
    });
  }
}
function getNode() {
  switch (this.tokenType) {
    case LeftSquareBracket:
      return this.AttributeSelector();
    case Hash$1:
      return this.IdSelector();
    case Colon:
      if (this.lookupType(1) === Colon) {
        return this.PseudoElementSelector();
      } else {
        return this.PseudoClassSelector();
      }
    case Ident:
      return this.TypeSelector();
    case Number$2:
    case Percentage$1:
      return this.Percentage();
    case Dimension$1:
      if (this.charCodeAt(this.tokenStart) === FULLSTOP) {
        this.error("Identifier is expected", this.tokenStart + 1);
      }
      break;
    case Delim: {
      const code2 = this.charCodeAt(this.tokenStart);
      switch (code2) {
        case PLUSSIGN:
        case GREATERTHANSIGN:
        case TILDE:
        case SOLIDUS:
          return this.Combinator();
        case FULLSTOP:
          return this.ClassSelector();
        case ASTERISK:
        case VERTICALLINE:
          return this.TypeSelector();
        case NUMBERSIGN:
          return this.IdSelector();
        case AMPERSAND:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const selector$1 = {
  onWhiteSpace,
  getNode
};
function expressionFn() {
  return this.createSingleNodeList(
    this.Raw(null, false)
  );
}
function varFn() {
  const children = this.createList();
  this.skipSC();
  children.push(this.Identifier());
  this.skipSC();
  if (this.tokenType === Comma) {
    children.push(this.Operator());
    const startIndex = this.tokenIndex;
    const value2 = this.parseCustomProperty ? this.Value(null) : this.Raw(this.consumeUntilExclamationMarkOrSemicolon, false);
    if (value2.type === "Value" && value2.children.isEmpty) {
      for (let offset = startIndex - this.tokenIndex; offset <= 0; offset++) {
        if (this.lookupType(offset) === WhiteSpace$1) {
          value2.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
      }
    }
    children.push(value2);
  }
  return children;
}
function isPlusMinusOperator(node2) {
  return node2 !== null && node2.type === "Operator" && (node2.value[node2.value.length - 1] === "-" || node2.value[node2.value.length - 1] === "+");
}
const value = {
  getNode: defaultRecognizer,
  onWhiteSpace(next, children) {
    if (isPlusMinusOperator(next)) {
      next.value = " " + next.value;
    }
    if (isPlusMinusOperator(children.last)) {
      children.last.value += " ";
    }
  },
  "expression": expressionFn,
  "var": varFn
};
const scope$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: atrulePrelude,
  Selector: selector$1,
  Value: value
}, Symbol.toStringTag, { value: "Module" }));
const nonContainerNameKeywords = /* @__PURE__ */ new Set(["none", "and", "not", "or"]);
const container = {
  parse: {
    prelude() {
      const children = this.createList();
      if (this.tokenType === Ident) {
        const name2 = this.substring(this.tokenStart, this.tokenEnd);
        if (!nonContainerNameKeywords.has(name2.toLowerCase())) {
          children.push(this.Identifier());
        }
      }
      children.push(this.Condition("container"));
      return children;
    },
    block(nested = false) {
      return this.Block(nested);
    }
  }
};
const fontFace = {
  parse: {
    prelude: null,
    block() {
      return this.Block(true);
    }
  }
};
function parseWithFallback(parse2, fallback) {
  return this.parseWithFallback(
    () => {
      try {
        return parse2.call(this);
      } finally {
        this.skipSC();
        if (this.lookupNonWSType(0) !== RightParenthesis) {
          this.error();
        }
      }
    },
    fallback || (() => this.Raw(null, true))
  );
}
const parseFunctions = {
  layer() {
    this.skipSC();
    const children = this.createList();
    const node2 = parseWithFallback.call(this, this.Layer);
    if (node2.type !== "Raw" || node2.value !== "") {
      children.push(node2);
    }
    return children;
  },
  supports() {
    this.skipSC();
    const children = this.createList();
    const node2 = parseWithFallback.call(
      this,
      this.Declaration,
      () => parseWithFallback.call(this, () => this.Condition("supports"))
    );
    if (node2.type !== "Raw" || node2.value !== "") {
      children.push(node2);
    }
    return children;
  }
};
const importAtrule = {
  parse: {
    prelude() {
      const children = this.createList();
      switch (this.tokenType) {
        case String$2:
          children.push(this.String());
          break;
        case Url$1:
        case Function$2:
          children.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      this.skipSC();
      if (this.tokenType === Ident && this.cmpStr(this.tokenStart, this.tokenEnd, "layer")) {
        children.push(this.Identifier());
      } else if (this.tokenType === Function$2 && this.cmpStr(this.tokenStart, this.tokenEnd, "layer(")) {
        children.push(this.Function(null, parseFunctions));
      }
      this.skipSC();
      if (this.tokenType === Function$2 && this.cmpStr(this.tokenStart, this.tokenEnd, "supports(")) {
        children.push(this.Function(null, parseFunctions));
      }
      if (this.lookupNonWSType(0) === Ident || this.lookupNonWSType(0) === LeftParenthesis) {
        children.push(this.MediaQueryList());
      }
      return children;
    },
    block: null
  }
};
const layer = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.LayerList()
      );
    },
    block() {
      return this.Block(false);
    }
  }
};
const media = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.MediaQueryList()
      );
    },
    block(nested = false) {
      return this.Block(nested);
    }
  }
};
const nest = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(true);
    }
  }
};
const page = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(true);
    }
  }
};
const scope = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.Scope()
      );
    },
    block(nested = false) {
      return this.Block(nested);
    }
  }
};
const startingStyle = {
  parse: {
    prelude: null,
    block(nested = false) {
      return this.Block(nested);
    }
  }
};
const supports = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.Condition("supports")
      );
    },
    block(nested = false) {
      return this.Block(nested);
    }
  }
};
const atrule = {
  container,
  "font-face": fontFace,
  import: importAtrule,
  layer,
  media,
  nest,
  page,
  scope,
  "starting-style": startingStyle,
  supports
};
function parseLanguageRangeList() {
  const children = this.createList();
  this.skipSC();
  loop: while (!this.eof) {
    switch (this.tokenType) {
      case Ident:
        children.push(this.Identifier());
        break;
      case String$2:
        children.push(this.String());
        break;
      case Comma:
        children.push(this.Operator());
        break;
      case RightParenthesis:
        break loop;
      default:
        this.error("Identifier, string or comma is expected");
    }
    this.skipSC();
  }
  return children;
}
const selectorList = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
};
const selector = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
};
const identList = {
  parse() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
};
const langList = {
  parse: parseLanguageRangeList
};
const nth = {
  parse() {
    return this.createSingleNodeList(
      this.Nth()
    );
  }
};
const pseudo = {
  "dir": identList,
  "has": selectorList,
  "lang": langList,
  "matches": selectorList,
  "is": selectorList,
  "-moz-any": selectorList,
  "-webkit-any": selectorList,
  "where": selectorList,
  "not": selectorList,
  "nth-child": nth,
  "nth-last-child": nth,
  "nth-last-of-type": nth,
  "nth-of-type": nth,
  "slotted": selector,
  "host": selector,
  "host-context": selector
};
const node = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: parse$N,
  Atrule: parse$M,
  AtrulePrelude: parse$L,
  AttributeSelector: parse$K,
  Block: parse$J,
  Brackets: parse$I,
  CDC: parse$H,
  CDO: parse$G,
  ClassSelector: parse$F,
  Combinator: parse$E,
  Comment: parse$D,
  Condition: parse$C,
  Declaration: parse$B,
  DeclarationList: parse$A,
  Dimension: parse$z,
  Feature: parse$y,
  FeatureFunction: parse$x,
  FeatureRange: parse$w,
  Function: parse$v,
  GeneralEnclosed: parse$u,
  Hash: parse$t,
  IdSelector: parse$r,
  Identifier: parse$s,
  Layer: parse$q,
  LayerList: parse$p,
  MediaQuery: parse$o,
  MediaQueryList: parse$n,
  NestingSelector: parse$m,
  Nth: parse$l,
  Number: parse$k,
  Operator: parse$j,
  Parentheses: parse$i,
  Percentage: parse$h,
  PseudoClassSelector: parse$g,
  PseudoElementSelector: parse$f,
  Ratio: parse$e,
  Raw: parse$d,
  Rule: parse$c,
  Scope: parse$b,
  Selector: parse$a,
  SelectorList: parse$9,
  String: parse$8,
  StyleSheet: parse$7,
  SupportsDeclaration: parse$6,
  TypeSelector: parse$5,
  UnicodeRange: parse$4,
  Url: parse$3,
  Value: parse$2,
  WhiteSpace: parse$1
}, Symbol.toStringTag, { value: "Module" }));
const parserConfig = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude(options) {
      return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    condition(options) {
      return this.Condition(options.kind);
    },
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block() {
      return this.Block(true);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  features: {
    supports: {
      selector() {
        return this.Selector();
      }
    },
    container: {
      style() {
        return this.Declaration();
      }
    }
  },
  scope: scope$1,
  atrule,
  pseudo,
  node
};
const walkerConfig = {
  node: node$1
};
const syntax = createSyntax$1({
  ...lexerConfig,
  ...parserConfig,
  ...walkerConfig
});
function clone(node2) {
  const result = {};
  for (const key of Object.keys(node2)) {
    let value2 = node2[key];
    if (value2) {
      if (Array.isArray(value2) || value2 instanceof List) {
        value2 = value2.map(clone);
      } else if (value2.constructor === Object) {
        value2 = clone(value2);
      }
    }
    result[key] = value2;
  }
  return result;
}
const {
  tokenize,
  parse,
  generate,
  lexer,
  createLexer,
  walk,
  find,
  findLast,
  findAll,
  toPlainObject,
  fromPlainObject,
  fork
} = syntax;
async function handleApply(ctx, node2) {
  const { code: code2, uno, options, filename } = ctx;
  await Promise.all(node2.block.children.map(async (childNode) => {
    if (childNode.type === "Raw") return transformDirectives(code2, uno, options, filename, childNode.value, childNode.loc.start.offset);
    await parseApply(ctx, node2, childNode);
  }).toArray());
}
async function parseApply({ code: code2, uno, applyVariable }, node2, childNode) {
  const original = code2.original;
  let body;
  if (childNode.type === "Atrule" && childNode.name === "apply" && childNode.prelude && childNode.prelude.type === "Raw") body = removeQuotes(childNode.prelude.value.trim());
  else if (childNode.type === "Declaration" && applyVariable.includes(childNode.property) && (childNode.value.type === "Value" || childNode.value.type === "Raw")) {
    let rawValue = original.slice(childNode.value.loc.start.offset, childNode.value.loc.end.offset).trim();
    rawValue = removeQuotes(rawValue);
    body = rawValue.split(/\s+/g).filter(Boolean).map((i) => removeQuotes(i)).join(" ");
  }
  if (!body) return;
  body = removeComments(body);
  const classNames = expandVariantGroup(body).split(/\s+/g).map((className) => className.trim().replace(/\\/, ""));
  const properties2 = /* @__PURE__ */ new Map();
  const utils = (await Promise.all(classNames.map((i) => uno.parseToken(i, "-")))).filter(notNull).flat().sort((a2, b2) => a2[0] - b2[0]).sort((a2, b2) => (a2[3] ? uno.parentOrders.get(a2[3]) ?? 0 : 0) - (b2[3] ? uno.parentOrders.get(b2[3]) ?? 0 : 0)).reduce((acc, item) => {
    if (item[4]?.layer === "properties") {
      properties2.set(item[1], item[2]);
      return acc;
    }
    const target = acc.find((i) => i[1] === item[1] && i[3] === item[3]);
    if (target) {
      if (!target[2].includes(item[2])) target[2] += item[2];
    } else acc.push([...item]);
    return acc;
  }, []);
  if (!utils.length) return;
  let semicolonOffset = original[childNode.loc.end.offset] === ";" ? 1 : original[childNode.loc.end.offset] === "@" ? -1 : 0;
  for (const i of utils) {
    const [, _selector, body2, parent, meta] = i;
    const selectorOrGroup = _selector?.replace(regexScopePlaceholder, " ") || _selector;
    const shouldUseSelector = selectorOrGroup && selectorOrGroup !== ".\\-";
    if (parent || shouldUseSelector || meta?.noMerge) {
      let newSelector = generate(node2.prelude);
      const className = code2.slice(node2.prelude.loc.start.offset, node2.prelude.loc.end.offset);
      if (meta?.noMerge) newSelector = selectorOrGroup;
      else if (shouldUseSelector) {
        const ruleAST = parse(`${selectorOrGroup}{}`, { context: "rule" });
        const prelude = clone(node2.prelude);
        prelude.children?.forEach((child) => {
          const selectorListAst = clone(ruleAST.prelude);
          const classSelectors = new List();
          selectorListAst?.children?.forEach((selectorAst) => {
            classSelectors.appendList(selectorAst?.children?.filter((i2) => i2.type === "ClassSelector" && i2.name === "\\-"));
          });
          classSelectors.forEach((i2) => Object.assign(i2, clone(child)));
          Object.assign(child, selectorListAst);
        });
        newSelector = generate(prelude);
      }
      let css = `${newSelector.includes(".\\-") ? className.split(",").map((e) => newSelector.replace(/.\\-/g, e.trim())).join(",") : newSelector}{${body2}}`;
      if (parent) if (parent.includes(" $$ ")) {
        const [first, ...parentSelectors] = parent.split(" $$ ").reverse();
        css = `${parentSelectors.reduce((p, c2, i2) => i2 === parentSelectors.length - 1 ? `${p}{${c2}{${css}}}${"}".repeat(i2)}` : `${p}{${c2}`, first)}`;
      } else if (parent === ".\\-") css = `${className}{${css}}`;
      else css = `${parent}{${css}}`;
      semicolonOffset = 0;
      code2.appendLeft(node2.loc.end.offset, css);
    } else if (body2.includes("@")) code2.appendRight(original.length, body2);
    else code2.appendRight(childNode.loc.end.offset + semicolonOffset, body2);
  }
  const propertyCss = Array.from(properties2).sort(([a2], [b2]) => a2.localeCompare(b2)).map(([property2, value2]) => `${property2}{${value2}}`).join("");
  code2.appendLeft(0, propertyCss);
  code2.remove(childNode.loc.start.offset, childNode.loc.end.offset + semicolonOffset);
}
function removeQuotes(value2) {
  return value2.replace(/^(['"])(.*)\1$/, "$2");
}
function removeComments(value2) {
  return value2.replace(/(\/\*(?:.|\n)*?\*\/)|(\/\/.*)/g, "");
}
async function transformIconString(uno, icon, color2) {
  const presetIcons2 = uno.config.presets?.flat()?.find((i) => i.name === "@unocss/preset-icons");
  if (!presetIcons2) {
    console.warn("@unocss/preset-icons not found, icon() directive will be keep as-is");
    return;
  }
  const { scale: scale2 = 1, prefix = "i-", collections: customCollections, customizations = {}, autoInstall = false, iconifyCollectionsNames, collectionsNodeResolvePath, unit } = presetIcons2.options;
  const api = presetIcons2.api;
  const loaderOptions = {
    addXmlNs: true,
    scale: scale2,
    customCollections,
    autoInstall,
    cwd: collectionsNodeResolvePath,
    warn: void 0,
    customizations: {
      ...customizations,
      trimCustomSvg: true,
      async iconCustomizer(collection, icon2, props) {
        await customizations.iconCustomizer?.(collection, icon2, props);
        if (unit) {
          if (!props.width) props.width = `${scale2}${unit}`;
          if (!props.height) props.height = `${scale2}${unit}`;
        }
      }
    }
  };
  const loader = await api.createNodeLoader?.() || (async () => void 0);
  for (const p of toArray(prefix)) if (icon.startsWith(p)) {
    icon = icon.slice(p.length);
    const parsed = await api.parseIconWithLoader(icon, loader, loaderOptions, iconifyCollectionsNames);
    if (parsed) return `url("data:image/svg+xml;utf8,${color2 ? api.encodeSvgForCss(parsed.svg).replace(/currentcolor/gi, color2) : api.encodeSvgForCss(parsed.svg)}")`;
  }
}
async function handleFunction({ code: code2, uno, options }, node2) {
  const { throwOnMissing = true } = options;
  switch (node2.name) {
    case "theme": {
      if (!node2.children.size) throw new Error("theme() expect exact one argument");
      if (node2.children.first.type !== "String") throw new Error("theme() expect a string argument");
      let defaultValueLoc;
      if (node2.children.size > 1) {
        const remains = node2.children.toArray().slice(1);
        if (!(remains[0].type === "Operator" && remains[0].value === ",")) throw new Error("theme() expect a comma between expression string and default value");
        if (remains.length > 1) defaultValueLoc = [remains[1].loc.start.offset, node2.children.last.loc.end.offset];
      }
      const themeStr = node2.children.first.value;
      let value2 = transformThemeString(themeStr, uno.config.theme, !defaultValueLoc && throwOnMissing);
      if (!value2 && defaultValueLoc) value2 = code2.slice(defaultValueLoc[0], defaultValueLoc[1]);
      if (value2) code2.overwrite(node2.loc.start.offset, node2.loc.end.offset, value2);
      break;
    }
    case "icon": {
      const params = node2.children.toArray().filter((node3) => node3.type === "String").map((node3) => node3.value);
      if (params.length === 0) throw new Error("icon() expects at least one argument");
      let [icon, color2] = params;
      if (color2) color2 = encodeURIComponent(transformThemeFn(color2, uno.config.theme, throwOnMissing));
      const value2 = await transformIconString(uno, icon, color2);
      if (value2) code2.overwrite(node2.loc.start.offset, node2.loc.end.offset, value2);
      break;
    }
  }
}
const screenRuleRE = /(@screen [^{]+)(.+)/g;
function handleScreen({ code: code2, uno }, node2) {
  let breakpointName = "";
  let prefix = "";
  if (node2.prelude?.type === "Raw") breakpointName = node2.prelude.value.trim();
  if (!breakpointName) return;
  const match = breakpointName.match(/^(?:(lt|at)-)?(\w+)$/);
  if (match) {
    prefix = match[1];
    breakpointName = match[2];
  }
  const resolveBreakpoints2 = () => {
    const key = uno.config.presets.some((p) => p.name === "@unocss/preset-wind4") ? "breakpoint" : "breakpoints";
    const breakpoints2 = uno.config.theme[key];
    return breakpoints2 ? Object.entries(breakpoints2).sort((a2, b2) => Number.parseInt(a2[1].replace(/[a-z]+/gi, "")) - Number.parseInt(b2[1].replace(/[a-z]+/gi, ""))).map(([point, size]) => ({
      point,
      size
    })) : void 0;
  };
  const variantEntries = (resolveBreakpoints2() ?? []).map(({ point, size }, idx) => [
    point,
    size,
    idx
  ]);
  const generateMediaQuery = (breakpointName2, prefix2) => {
    const [, size, idx] = variantEntries.find((i) => i[0] === breakpointName2);
    if (prefix2) if (prefix2 === "lt") return `@media (max-width: ${calcMaxWidthBySize(size)})`;
    else if (prefix2 === "at") return `@media (min-width: ${size})${variantEntries[idx + 1] ? ` and (max-width: ${calcMaxWidthBySize(variantEntries[idx + 1][1])})` : ""}`;
    else throw new Error(`breakpoint variant not supported: ${prefix2}`);
    return `@media (min-width: ${size})`;
  };
  if (!variantEntries.some((i) => i[0] === breakpointName)) throw new Error(`breakpoint ${breakpointName} not found`);
  const offset = node2.loc.start.offset;
  const str = code2.original.slice(offset, node2.loc.end.offset);
  const matches = Array.from(str.matchAll(screenRuleRE));
  if (!matches.length) return;
  for (const match2 of matches) code2.overwrite(offset + match2.index, offset + match2.index + match2[1].length, `${generateMediaQuery(breakpointName, prefix)}`);
}
function resolveApplyVariables(options) {
  let { applyVariable } = options;
  const varStyle = options.varStyle;
  if (applyVariable === void 0) {
    if (varStyle !== void 0) applyVariable = varStyle ? [`${varStyle}apply`] : [];
    applyVariable = [
      "--at-apply",
      "--uno-apply",
      "--uno"
    ];
  }
  return toArray(applyVariable || []);
}
async function transformDirectives(code2, uno, options, filename, originalCode, offset) {
  const applyVariable = resolveApplyVariables(options);
  const isHasApply = (code3) => code3.includes("@apply") || applyVariable.some((s) => code3.includes(s));
  const parseCode = originalCode || code2.original;
  const hasApply = isHasApply(parseCode);
  const hasScreen = parseCode.includes("@screen");
  const hasFn = hasThemeFn(parseCode) || hasIconFn(parseCode);
  if (!hasApply && !hasFn && !hasScreen) return;
  const ast = parse(parseCode, {
    parseCustomProperty: true,
    parseAtrulePrelude: false,
    positions: true,
    filename,
    offset
  });
  if (ast.type !== "StyleSheet") return;
  const stack = [];
  const ctx = {
    options,
    applyVariable,
    uno,
    code: code2,
    filename
  };
  const processNode = async (node2, _item, _list) => {
    if (hasScreen && node2.type === "Atrule" && node2.name === "screen") handleScreen(ctx, node2);
    else if (node2.type === "Function") await handleFunction(ctx, node2);
    else if (hasApply && node2.type === "Rule") await handleApply(ctx, node2);
  };
  walk(ast, (...args) => stack.push(processNode(...args)));
  await Promise.all(stack);
  const oldCode = code2.toString();
  if (!isHasApply(oldCode)) {
    const newCode = oldCode.replace(/([^{}]+)\{\s*\}\s*/g, (m, selector2) => {
      if (/^[\s\w\-.,#:[\]=*"'>~+^$|()\\]+$/.test(selector2.trim())) return "";
      return m;
    });
    if (newCode !== oldCode) code2.update(0, code2.original.length, newCode);
  }
}
function transformerDirectives(options = {}) {
  const applyVariables = resolveApplyVariables(options);
  return {
    name: "@unocss/transformer-directives",
    enforce: options?.enforce,
    idFilter: (id) => cssIdRE.test(id),
    codeFilter: (code2) => code2.includes("@apply") || code2.includes("@screen") || code2.includes("theme(") || code2.includes("icon(") || applyVariables.some((variable) => code2.includes(variable)),
    transform: (code2, id, ctx) => {
      return transformDirectives(code2, ctx.uno, options, id);
    }
  };
}
function transformerVariantGroup(options = {}) {
  const separators = options.separators || [":", "-"];
  return {
    name: "@unocss/transformer-variant-group",
    enforce: "pre",
    codeFilter: (code2) => separators.some((separator) => code2.includes(`${separator}(`)),
    transform(s) {
      const result = parseVariantGroup(s, separators);
      return { get highlightAnnotations() {
        return [...result.groupsByOffset.values()].flatMap((group) => group.items);
      } };
    }
  };
}
function defineConfig(config) {
  return config;
}
defineConfig({
  // 排班单元格的 BEM 类被图标提取器错误拼接为图标名，精确忽略该伪类名。
  blocklist: [/^i-ion:day-cell--clickable-alarm$/],
  presets: [
    // 默认原子化 CSS（Tailwind/Windi 兼容）
    presetUno(),
    // 属性化模式：<div flex items-center />
    presetAttributify(),
    // 图标预设（配合 @iconify/vue）
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  transformers: [
    // 分组变体：hover:(bg-red text-white)
    transformerVariantGroup(),
    // @apply / @screen 指令支持
    transformerDirectives()
  ],
  shortcuts: {
    // 常用布局快捷方式
    "flex-center": "flex items-center justify-center",
    "flex-between": "flex items-center justify-between",
    "flex-col-center": "flex flex-col items-center justify-center",
    // 文本截断
    "text-ellipsis": "overflow-hidden whitespace-nowrap text-ellipsis",
    // 卡片容器
    "card": "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4",
    // 表单输入统一样式
    "form-item": "flex flex-col gap-1 mb-4"
  },
  theme: {
    colors: {
      // 主色调（与 naive-ui 主题保持一致，可按需调整）
      primary: "#18a058",
      danger: "#d03050",
      warning: "#f0a020",
      info: "#2080f0"
    },
    fontFamily: {
      sans: ["PingFang SC", "Microsoft YaHei", "sans-serif"]
    }
  }
});
const useSyncStore = defineStore("sync", () => {
  const status = ref("idle");
  const config = ref(null);
  const pendingCount = ref(0);
  const lastSyncAt = ref(null);
  const lastError = ref(null);
  let unsubscribe = null;
  function initListener() {
    if (unsubscribe) return;
    unsubscribe = window.api.sync.onEvent((event) => {
      status.value = event.status;
      if (event.type === "success") {
        lastSyncAt.value = Date.now();
        lastError.value = null;
        refreshPendingCount();
      }
      if (event.type === "error") {
        lastError.value = event.error ?? "同步失败";
      }
    });
    refreshPendingCount();
    loadConfig();
  }
  function destroyListener() {
    unsubscribe?.();
    unsubscribe = null;
  }
  async function loadConfig() {
    config.value = await window.api.sync.getConfig();
    lastSyncAt.value = config.value?.lastSyncAt ?? null;
  }
  async function saveConfig(cfg) {
    await window.api.sync.saveConfig(cfg);
    config.value = cfg;
  }
  async function triggerManual() {
    await window.api.sync.triggerManual();
  }
  async function refreshPendingCount() {
    const { count } = await window.api.sync.pendingCount();
    pendingCount.value = count;
  }
  async function disableSync() {
    await window.api.sync.disable();
    if (config.value) config.value.enabled = false;
  }
  return {
    status,
    config,
    pendingCount,
    lastSyncAt,
    lastError,
    initListener,
    destroyListener,
    loadConfig,
    saveConfig,
    triggerManual,
    refreshPendingCount,
    disableSync
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const { naiveTheme } = useTheme();
    const syncStore = useSyncStore();
    syncStore.initListener();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(NConfigProvider), {
        theme: unref(naiveTheme),
        locale: unref(zhCN),
        "date-locale": unref(dateZhCN)
      }, {
        default: withCtx(() => [
          createVNode(unref(NGlobalStyle)),
          createVNode(unref(NMessageProvider), null, {
            default: withCtx(() => [
              createVNode(unref(NNotificationProvider), null, {
                default: withCtx(() => [
                  createVNode(unref(NDialogProvider), null, {
                    default: withCtx(() => [
                      createVNode(unref(RouterView))
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
      }, 8, ["theme", "locale", "date-locale"]);
    };
  }
});
const MENU_GROUPS = [
  { key: "archive", label: "档案管理" },
  { key: "admission", label: "入住管理" },
  { key: "care", label: "日常照护" },
  { key: "business", label: "经营管理" },
  { key: "attendance", label: "考勤管理" },
  { key: "iot", label: "物联设备" },
  { key: "operations", label: "运营与安全" },
  { key: "task", label: "任务提醒" },
  { key: "system", label: "系统管理" }
];
const MENU_CATALOG = [
  {
    key: "elderly",
    label: "老人档案",
    icon: "i-ion:people-outline",
    group: "archive"
  },
  {
    key: "bed",
    label: "床位管理",
    icon: "i-ion:grid-outline",
    group: "archive"
  },
  {
    key: "admission",
    label: "入住管理",
    icon: "i-ion:enter-outline",
    group: "admission"
  },
  {
    key: "contract",
    label: "合同管理",
    icon: "i-ion:document-text-outline",
    group: "admission"
  },
  {
    key: "care",
    label: "护理管理",
    icon: "i-ion:medkit-outline",
    group: "care"
  },
  {
    key: "health",
    label: "健康管理",
    icon: "i-ion:heart-outline",
    group: "care"
  },
  {
    key: "meal",
    label: "餐饮管理",
    icon: "i-ion:restaurant-outline",
    group: "care"
  },
  {
    key: "nutrition",
    label: "营养搭配",
    icon: "i-ion:nutrition-outline",
    group: "care"
  },
  {
    key: "activity",
    label: "活动管理",
    icon: "i-ion:balloon-outline",
    group: "care"
  },
  {
    key: "exam",
    label: "体检管理",
    icon: "i-ion:clipboard-outline",
    group: "care"
  },
  {
    key: "fee",
    label: "费用管理",
    icon: "i-ion:cash-outline",
    group: "business"
  },
  {
    key: "report",
    label: "统计报表",
    icon: "i-ion:bar-chart-outline",
    group: "business"
  },
  {
    key: "clock",
    label: "考勤打卡",
    icon: "i-ion:finger-print-outline",
    group: "attendance"
  },
  {
    key: "schedule",
    label: "排班管理",
    icon: "i-ion:calendar-outline",
    group: "attendance"
  },
  {
    key: "leave",
    label: "请假管理",
    icon: "i-ion:exit-outline",
    group: "attendance"
  },
  {
    key: "attendance-report",
    label: "考勤报表",
    icon: "i-ion:stats-chart-outline",
    group: "attendance"
  },
  {
    key: "iot-device",
    label: "设备与维修",
    icon: "i-ion:hardware-chip-outline",
    group: "iot"
  },
  {
    key: "operations",
    label: "运营与安全",
    icon: "i-ion:shield-outline",
    group: "operations"
  },
  {
    key: "task-reminder",
    label: "任务提醒",
    icon: "i-ion:alarm-outline",
    group: "task"
  },
  {
    key: "user",
    label: "账号管理",
    icon: "i-ion:person-circle-outline",
    group: "system"
  },
  {
    key: "role",
    label: "角色权限",
    icon: "i-ion:shield-checkmark-outline",
    group: "system"
  },
  {
    key: "permission-group",
    label: "权限组管理",
    icon: "i-ion:key-outline",
    group: "system"
  },
  {
    key: "announcement",
    label: "公告管理",
    icon: "i-ion:megaphone-outline",
    group: "system"
  },
  {
    key: "sync",
    label: "数据同步",
    icon: "i-ion:sync-outline",
    group: "system"
  },
  {
    key: "settings",
    label: "系统设置",
    icon: "i-ion:settings-outline",
    group: "system"
  }
];
const BUTTON_CATALOG = [
  { key: "elderly:create", label: "新增老人" },
  { key: "elderly:delete", label: "删除老人" },
  { key: "user:create", label: "新增账号" },
  { key: "user:delete", label: "删除账号" },
  { key: "user:reset-pw", label: "重置密码" },
  { key: "role:create", label: "新增角色" },
  { key: "role:delete", label: "删除角色" },
  { key: "leave:approve", label: "请假审批" },
  { key: "iot-device:create", label: "新增设备" },
  { key: "iot-device:delete", label: "删除设备" },
  { key: "exam:create", label: "新增体检预约/结果" },
  { key: "permission-group:create", label: "新增权限组" },
  { key: "permission-group:delete", label: "删除权限组" },
  { key: "reminder:assign", label: "分配任务提醒给他人" },
  { key: "announcement:create", label: "新建公告" },
  { key: "announcement:edit", label: "编辑公告" },
  { key: "announcement:publish", label: "发布/撤回公告" },
  { key: "announcement:delete", label: "删除公告" },
  { key: "operations:handover", label: "登记/确认交接班" },
  { key: "operations:incident", label: "处理安全事件" },
  { key: "operations:inventory", label: "管理物资库存" },
  { key: "operations:document", label: "管理合规文书" }
];
function menuKeysAllow(menuKeys, key) {
  return menuKeys.includes("*") || menuKeys.includes(key);
}
const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const currentRole = ref(null);
  const initialized = ref(false);
  const isLoggedIn = computed(() => !!currentUser.value);
  const menuKeys = computed(() => {
    if (!currentRole.value) return [];
    try {
      return JSON.parse(currentRole.value.menu_keys);
    } catch {
      return [];
    }
  });
  const buttonKeys = computed(() => {
    if (!currentRole.value) return [];
    try {
      return JSON.parse(currentRole.value.button_keys);
    } catch {
      return [];
    }
  });
  function canAccessMenu(key) {
    return menuKeysAllow(menuKeys.value, key);
  }
  function canUseButton(key) {
    return buttonKeys.value.includes("*") || buttonKeys.value.includes(key);
  }
  async function loadRole(roleId) {
    const roles = await window.api.role.list();
    currentRole.value = roles.find((r) => r.id === roleId) ?? null;
  }
  async function restore() {
    if (initialized.value) return;
    const user = await window.api.auth.current();
    if (user) {
      currentUser.value = user;
      await loadRole(user.role_id);
    }
    initialized.value = true;
  }
  async function login(username, password, remember) {
    const res = await window.api.auth.login(username, password, remember);
    if (!res.ok) return res;
    currentUser.value = res.user;
    await loadRole(res.user.role_id);
    return res;
  }
  async function logout() {
    await window.api.auth.logout();
    currentUser.value = null;
    currentRole.value = null;
  }
  async function changePassword(oldPassword, newPassword) {
    const res = await window.api.auth.changePassword(oldPassword, newPassword);
    if (res.ok && currentUser.value) {
      currentUser.value = { ...currentUser.value, must_change_pw: 0 };
    }
    return res;
  }
  return {
    currentUser,
    currentRole,
    initialized,
    isLoggedIn,
    menuKeys,
    buttonKeys,
    canAccessMenu,
    canUseButton,
    restore,
    login,
    logout,
    changePassword,
    loadRole
  };
});
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => __vitePreload(() => import("./LoginView-D_6jCg77.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
    meta: { public: true }
  },
  {
    path: "/",
    component: () => __vitePreload(() => import("./DefaultLayout-DV23jeR6.js"), true ? __vite__mapDeps([7,1,8,9,10,11,2,12,3,13,4,5,14]) : void 0, import.meta.url),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => __vitePreload(() => import("./DashboardView-DRfAGSxy.js"), true ? __vite__mapDeps([15,16,1,17,8,18,19,5,20,9,10,21,22,13,2,4]) : void 0, import.meta.url),
        meta: { title: "首页概览", icon: "i-ion:home-outline", affix: true }
      },
      // ── 老人管理 ──────────────────────────────────
      {
        path: "elderly",
        name: "ElderlyList",
        component: () => __vitePreload(() => import("./ElderlyListView-lS0f7gL7.js"), true ? __vite__mapDeps([23,24,1,2,5,25,20,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "老人管理",
          icon: "i-ion:people-outline",
          menuKey: "elderly"
        }
      },
      {
        path: "elderly/:id",
        name: "ElderlyDetail",
        component: () => __vitePreload(() => import("./ElderlyDetailView-H7w5rz5O.js"), true ? __vite__mapDeps([26,5,1,20,16,9,10,21,2,4]) : void 0, import.meta.url),
        // 动态参数页面不加入 KeepAlive 缓存，避免切换不同老人时显示上一个的残留数据
        meta: { title: "老人详情", menuKey: "elderly", noCache: true }
      },
      // ── 床位管理 ──────────────────────────────────
      {
        path: "bed",
        name: "BedManage",
        component: () => __vitePreload(() => import("./BedManageView-Clj1UqH8.js"), true ? __vite__mapDeps([27,24,1,2,5,20,17,22,13,4]) : void 0, import.meta.url),
        meta: { title: "床位管理", icon: "i-ion:bed-outline", menuKey: "bed" }
      },
      // ── 入住管理 ──────────────────────────────────
      {
        path: "admission",
        name: "Admission",
        component: () => __vitePreload(() => import("./AdmissionView-DPQRSSyv.js"), true ? __vite__mapDeps([28,24,1,2,5,20,17,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "入住管理",
          icon: "i-ion:enter-outline",
          menuKey: "admission"
        }
      },
      // ── 护理管理 ──────────────────────────────────
      {
        path: "care",
        name: "Care",
        component: () => __vitePreload(() => import("./CareView-CcXQSgBR.js"), true ? __vite__mapDeps([29,24,1,2,5,20,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "护理管理",
          icon: "i-ion:medical-outline",
          menuKey: "care"
        }
      },
      // ── 健康管理 ──────────────────────────────────
      {
        path: "health",
        name: "Health",
        component: () => __vitePreload(() => import("./HealthView-D1Bswdha.js"), true ? __vite__mapDeps([30,24,1,2,19,5,20,31,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "健康管理",
          icon: "i-ion:heart-outline",
          menuKey: "health"
        }
      },
      // ── 费用管理 ──────────────────────────────────
      {
        path: "fee",
        name: "Fee",
        component: () => __vitePreload(() => import("./FeeView-CqjZvrYb.js"), true ? __vite__mapDeps([32,24,1,2,5,20,33,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: { title: "费用管理", icon: "i-ion:cash-outline", menuKey: "fee" }
      },
      // ── 餐饮管理 ──────────────────────────────────
      {
        path: "meal",
        name: "Meal",
        component: () => __vitePreload(() => import("./MealView-CSvHTTH1.js"), true ? __vite__mapDeps([34,1,24,2,5,20,35,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "餐饮管理",
          icon: "i-ion:restaurant-outline",
          menuKey: "meal"
        }
      },
      // ── 营养搭配 ──────────────────────────────────
      {
        path: "nutrition",
        name: "Nutrition",
        component: () => __vitePreload(() => import("./NutritionView-DlLhkk_U.js"), true ? __vite__mapDeps([36,9,10,24,1,2,5,20,16,35,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "营养搭配",
          icon: "i-ion:nutrition-outline",
          menuKey: "nutrition"
        }
      },
      // ── 活动管理 ──────────────────────────────────
      {
        path: "activity",
        name: "Activity",
        component: () => __vitePreload(() => import("./ActivityView-CLw60svU.js"), true ? __vite__mapDeps([37,24,1,2,5,20,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "活动管理",
          icon: "i-ion:balloon-outline",
          menuKey: "activity"
        }
      },
      // ── 体检管理 ──────────────────────────────────
      {
        path: "exam",
        name: "Exam",
        component: () => __vitePreload(() => import("./ExamView-Bxhzna9t.js"), true ? __vite__mapDeps([38,24,1,2,5,20,31,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "体检管理",
          icon: "i-ion:clipboard-outline",
          menuKey: "exam"
        }
      },
      // ── 合同管理 ──────────────────────────────────
      {
        path: "contract",
        name: "Contract",
        component: () => __vitePreload(() => import("./ContractView-BPB9gO3R.js"), true ? __vite__mapDeps([39,24,1,2,5,20,18,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "合同管理",
          icon: "i-ion:document-text-outline",
          menuKey: "contract"
        }
      },
      // ── 统计报表 ──────────────────────────────────
      {
        path: "report",
        name: "Report",
        component: () => __vitePreload(() => import("./ReportView-DPChPc88.js"), true ? __vite__mapDeps([40,19,5,1,20,16,17,33,2,4]) : void 0, import.meta.url),
        meta: {
          title: "统计报表",
          icon: "i-ion:bar-chart-outline",
          menuKey: "report"
        }
      },
      // ── 考勤管理 ──────────────────────────────────
      {
        path: "clock",
        name: "Clock",
        component: () => __vitePreload(() => import("./ClockView-rhPcERnk.js"), true ? __vite__mapDeps([41,24,1,2,5,20,42,9,10,22,13,3,4,43]) : void 0, import.meta.url),
        meta: {
          title: "考勤打卡",
          icon: "i-ion:finger-print-outline",
          menuKey: "clock"
        }
      },
      {
        path: "schedule",
        name: "Schedule",
        component: () => __vitePreload(() => import("./ScheduleView-D0Wzl-1G.js"), true ? __vite__mapDeps([44,1,5,20,42,45,46,22,13,2,3,4,47]) : void 0, import.meta.url),
        meta: {
          title: "排班管理",
          icon: "i-ion:calendar-outline",
          menuKey: "schedule"
        }
      },
      {
        path: "leave",
        name: "Leave",
        component: () => __vitePreload(() => import("./LeaveView-b9C7nhXj.js"), true ? __vite__mapDeps([48,24,1,2,5,20,42,45,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "请假管理",
          icon: "i-ion:exit-outline",
          menuKey: "leave"
        }
      },
      {
        path: "attendance-report",
        name: "AttendanceReport",
        component: () => __vitePreload(() => import("./AttendanceReportView-D5BS0x58.js"), true ? __vite__mapDeps([49,24,1,2,5,20,42,45,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "考勤报表",
          icon: "i-ion:stats-chart-outline",
          menuKey: "attendance-report"
        }
      },
      // ── 物联网设备 ──────────────────────────────────
      {
        path: "iot-device",
        name: "IotDevice",
        component: () => __vitePreload(() => import("./DeviceView-CfsHTJU6.js"), true ? __vite__mapDeps([50,24,1,2,5,20,16,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "设备与维修",
          icon: "i-ion:hardware-chip-outline",
          menuKey: "iot-device"
        }
      },
      // ── 采购管理 ──────────────────────────────────
      {
        path: "purchase",
        name: "Purchase",
        component: () => __vitePreload(() => import("./PurchaseView-15Y1Mciz.js"), true ? __vite__mapDeps([51,24,1,2,5,20,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "采购管理",
          icon: "i-ion:cart-outline",
          menuKey: "purchase"
        }
      },
      {
        path: "operations",
        name: "Operations",
        component: () => __vitePreload(() => import("./OperationsView-B2peeFgU.js"), true ? __vite__mapDeps([52,1,24,2,5,20,9,10,22,13,16,4]) : void 0, import.meta.url),
        meta: {
          title: "运营与安全",
          icon: "i-ion:shield-outline",
          menuKey: "operations"
        }
      },
      // ── 系统功能 ──────────────────────────────────
      {
        path: "user",
        name: "UserManage",
        component: () => __vitePreload(() => import("./UserManageView-BYVdYUQz.js"), true ? __vite__mapDeps([53,24,1,2,5,25,20,45,46,9,10,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "账号管理",
          icon: "i-ion:person-circle-outline",
          menuKey: "user"
        }
      },
      {
        path: "role",
        name: "RoleManage",
        component: () => __vitePreload(() => import("./RoleManageView-B5lyrW2c.js"), true ? __vite__mapDeps([54,24,1,2,5,25,20,46,55,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "角色权限",
          icon: "i-ion:shield-checkmark-outline",
          menuKey: "role"
        }
      },
      {
        path: "permission-group",
        name: "PermissionGroupManage",
        component: () => __vitePreload(() => import("./PermissionGroupManageView-DG8Uqy0v.js"), true ? __vite__mapDeps([56,24,1,2,5,25,20,55,22,13,4]) : void 0, import.meta.url),
        meta: {
          title: "权限组管理",
          icon: "i-ion:key-outline",
          menuKey: "permission-group"
        }
      },
      {
        path: "announcement",
        name: "AnnouncementManage",
        component: () => __vitePreload(() => import("./AnnouncementManageView-CZwij4ey.js"), true ? __vite__mapDeps([57,24,1,2,5,20,9,10,12,22,13,3,4,58]) : void 0, import.meta.url),
        meta: {
          title: "公告管理",
          icon: "i-ion:megaphone-outline",
          menuKey: "announcement"
        }
      },
      {
        path: "settings",
        name: "Settings",
        component: () => __vitePreload(() => import("./SettingsView-bxOmhDv4.js"), true ? __vite__mapDeps([59,5,1,20,13,2,4]) : void 0, import.meta.url),
        meta: {
          title: "系统设置",
          icon: "i-ion:settings-outline",
          menuKey: "settings"
        }
      },
      {
        path: "sync",
        name: "SyncPanel",
        component: () => __vitePreload(() => import("./SyncView-9ofBWkwL.js"), true ? __vite__mapDeps([60,5,1,20,11,9,10,2,4]) : void 0, import.meta.url),
        meta: {
          title: "数据同步",
          icon: "i-ion:sync-outline",
          menuKey: "sync"
        }
      },
      // ── 任务提醒 ──────────────────────────────────
      {
        path: "task-reminder",
        name: "TaskReminder",
        component: () => __vitePreload(() => import("./TaskReminderView-C1EAUiwG.js"), true ? __vite__mapDeps([61,24,1,2,5,20,45,22,13,3,4,62]) : void 0, import.meta.url),
        meta: {
          title: "任务提醒",
          icon: "i-ion:alarm-outline",
          menuKey: "task-reminder"
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => __vitePreload(() => import("./NotFoundView-D_-5_-sU.js"), true ? __vite__mapDeps([63,1,2]) : void 0, import.meta.url)
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.restore();
  if (to.meta.public) {
    if (to.name === "Login" && authStore.isLoggedIn) return "/dashboard";
    return true;
  }
  if (!authStore.isLoggedIn) {
    return { name: "Login" };
  }
  const menuKey = to.meta.menuKey;
  if (menuKey && !authStore.canAccessMenu(menuKey)) {
    return false;
  }
  return true;
});
const permDirective = {
  mounted(el, binding) {
    applyPerm(el, binding.value);
  },
  updated(el, binding) {
    applyPerm(el, binding.value);
  }
};
function applyPerm(el, key) {
  const authStore = useAuthStore();
  if (!key || authStore.canUseButton(key)) return;
  el.remove();
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 窗口重新聚焦时自动重新请求
      refetchOnWindowFocus: false,
      // 失败后重试 1 次
      retry: 1,
      // 数据过期时间 5 分钟（ms）
      staleTime: 5 * 60 * 1e3
    },
    mutations: {
      retry: 0
    }
  }
});
const app = createApp(_sfc_main);
app.use(createPinia()).use(router).use(VueQueryPlugin, { queryClient }).use(MotionPlugin).directive("perm", permDirective).mount("#app");
export {
  BUTTON_CATALOG as B,
  MENU_GROUPS as M,
  useSyncStore as a,
  useTheme as b,
  MENU_CATALOG as c,
  useMotion as d,
  useAuthStore as u
};
