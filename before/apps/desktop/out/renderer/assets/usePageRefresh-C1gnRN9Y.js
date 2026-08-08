import { r as registerAutoRefresh } from "./useAutoRefresh-BeuDS8Br.js";
import { o as onMounted, I as onUnmounted, r as ref } from "./vendor-vue-C6_copC_.js";
function usePageRefresh(loadFn, opts = {}) {
  const { immediate = true } = opts;
  const refreshing = ref(false);
  async function refresh() {
    if (refreshing.value) return;
    refreshing.value = true;
    try {
      await loadFn();
    } finally {
      refreshing.value = false;
    }
  }
  let unsubscribe = null;
  onMounted(() => {
    unsubscribe = registerAutoRefresh(refresh);
    if (immediate) {
      refresh();
    }
  });
  onUnmounted(() => {
    unsubscribe?.();
  });
  return { refresh, refreshing };
}
export {
  usePageRefresh as u
};
