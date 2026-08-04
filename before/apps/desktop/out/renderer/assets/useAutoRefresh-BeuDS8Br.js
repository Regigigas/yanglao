const callbacks = /* @__PURE__ */ new Set();
let timerId = null;
let currentIntervalSec = 0;
function initAutoRefresh(seconds) {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  currentIntervalSec = seconds > 0 ? seconds : 0;
  if (currentIntervalSec > 0) {
    timerId = setInterval(() => {
      for (const cb of callbacks) {
        try {
          const ret = cb();
          if (ret instanceof Promise) ret.catch(() => {
          });
        } catch {
        }
      }
    }, currentIntervalSec * 1e3);
  }
}
function registerAutoRefresh(cb) {
  callbacks.add(cb);
  return () => callbacks.delete(cb);
}
export {
  initAutoRefresh as i,
  registerAutoRefresh as r
};
