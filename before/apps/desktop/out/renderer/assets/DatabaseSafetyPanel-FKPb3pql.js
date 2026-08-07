import { I as Icon } from "./iconify-DIn4WxPo.js";
import { p as useDialog, u as useMessage, y as NText, B as Button, X as NDivider, v as NSpace, a4 as NTable } from "./vendor-naive-DqQyyJr8.js";
import { l as defineComponent, o as onMounted, V as openBlock, a1 as createElementBlock, a3 as createBaseVNode, X as createVNode, u as unref, W as withCtx, k as createTextVNode, U as createBlock, a8 as toDisplayString, a9 as createCommentVNode, F as Fragment, a6 as renderList, r as ref } from "./vendor-vue-Hc3ejqjp.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1 = { class: "data-safety-tools" };
const _hoisted_2 = { class: "data-safety-tool" };
const _hoisted_3 = { class: "data-safety-icon" };
const _hoisted_4 = { class: "data-safety-tool" };
const _hoisted_5 = { class: "data-safety-icon integrity" };
const _hoisted_6 = { class: "data-safety-tool local-sync-tool" };
const _hoisted_7 = { class: "data-safety-icon sync" };
const _hoisted_8 = { class: "backup-heading" };
const _hoisted_9 = { class: "backup-table-wrap" };
const _hoisted_10 = { class: "backup-name" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DatabaseSafetyPanel",
  emits: ["synchronized"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const dialog = useDialog();
    const message = useMessage();
    const backups = ref([]);
    const backupCreating = ref(false);
    const backupExporting = ref("");
    const backupRestoring = ref("");
    const integrityChecking = ref(false);
    const localSyncing = ref(false);
    const lastLocalSync = ref(null);
    function errorMessage(error, fallback) {
      return error instanceof Error && error.message ? error.message : fallback;
    }
    function formatBytes(value) {
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
      return `${(value / 1024 / 1024).toFixed(2)} MB`;
    }
    function formatDate(value) {
      return new Date(value).toLocaleString("zh-CN", { hour12: false });
    }
    async function loadBackups() {
      backups.value = await window.api.db.listBackups();
    }
    async function createBackup() {
      backupCreating.value = true;
      try {
        const backup = await window.api.db.createBackup();
        await loadBackups();
        message.success(`本地备份已创建：${backup.name}`);
      } catch (error) {
        message.error(errorMessage(error, "创建本地备份失败"));
      } finally {
        backupCreating.value = false;
      }
    }
    async function checkIntegrity() {
      integrityChecking.value = true;
      try {
        const result = await window.api.db.checkIntegrity();
        if (result.ok) message.success("数据库完整性检查通过");
        else message.error(result.messages.join("；"));
      } catch (error) {
        message.error(errorMessage(error, "数据库完整性检查失败"));
      } finally {
        integrityChecking.value = false;
      }
    }
    function syncLocalFile() {
      dialog.warning({
        title: "选择数据文件本地同步",
        content: "系统会先校验所选 SQLite 文件并自动备份当前数据库，再按记录更新时间合并。当前云端、局域网、定时同步配置和本机附件路径不会被覆盖。",
        positiveText: "选择文件并同步",
        negativeText: "取消",
        onPositiveClick: async () => {
          localSyncing.value = true;
          try {
            const response = await window.api.db.syncLocalFile();
            if (response.canceled || !response.result) return;
            lastLocalSync.value = response.result;
            await loadBackups();
            emit("synchronized");
            message.success(
              `本地同步完成：新增 ${response.result.inserted} 条，更新 ${response.result.updated} 条`
            );
          } catch (error) {
            message.error(errorMessage(error, "本地数据同步失败"));
          } finally {
            localSyncing.value = false;
          }
        }
      });
    }
    async function exportBackup(name) {
      backupExporting.value = name;
      try {
        const result = await window.api.db.exportBackup(name);
        if (!result.canceled) message.success("备份已导出到所选位置");
      } catch (error) {
        message.error(errorMessage(error, "导出备份失败"));
      } finally {
        backupExporting.value = "";
      }
    }
    function restoreBackup(name) {
      dialog.warning({
        title: "恢复数据库备份",
        content: `恢复 ${name} 将用备份中的整库数据替换当前数据库，应用会立即重启。系统会先保存当前数据库用于安全回退。`,
        positiveText: "继续",
        negativeText: "取消",
        onPositiveClick: () => {
          dialog.error({
            title: "再次确认恢复",
            content: "请确认远程同步已经停止，并且当前没有未完成的数据录入。确定后应用将立即关闭并执行恢复。",
            positiveText: "确认恢复并重启",
            negativeText: "取消",
            onPositiveClick: async () => {
              backupRestoring.value = name;
              try {
                await window.api.db.restoreBackup(name);
                message.info("恢复请求已提交，应用正在重启");
              } catch (error) {
                backupRestoring.value = "";
                message.error(errorMessage(error, "提交数据库恢复请求失败"));
              }
            }
          });
        }
      });
    }
    async function openBackupDirectory() {
      try {
        await window.api.db.openBackupDirectory();
      } catch (error) {
        message.error(errorMessage(error, "无法打开备份目录"));
      }
    }
    onMounted(() => {
      void loadBackups().catch((error) => {
        message.error(errorMessage(error, "读取本地备份历史失败"));
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1, [
          createBaseVNode("section", _hoisted_2, [
            createBaseVNode("span", _hoisted_3, [
              createVNode(unref(Icon), { icon: "ion:server-outline" })
            ]),
            createBaseVNode("div", null, [
              _cache[1] || (_cache[1] = createBaseVNode("strong", null, "新建本地数据库备份", -1)),
              createVNode(unref(NText), {
                depth: "3",
                class: "tool-detail"
              }, {
                default: withCtx(() => [..._cache[0] || (_cache[0] = [
                  createTextVNode(" 生成包含当前 WAL 数据的一致性 SQLite 快照，程序保留最近 30 份。 ", -1)
                ])]),
                _: 1
              })
            ]),
            createVNode(unref(Button), {
              type: "primary",
              loading: backupCreating.value,
              onClick: createBackup
            }, {
              icon: withCtx(() => [
                createVNode(unref(Icon), { icon: "ion:save-outline" })
              ]),
              default: withCtx(() => [
                _cache[2] || (_cache[2] = createTextVNode(" 立即备份 ", -1))
              ]),
              _: 1
            }, 8, ["loading"])
          ]),
          createBaseVNode("section", _hoisted_4, [
            createBaseVNode("span", _hoisted_5, [
              createVNode(unref(Icon), { icon: "ion:shield-checkmark-outline" })
            ]),
            createBaseVNode("div", null, [
              _cache[4] || (_cache[4] = createBaseVNode("strong", null, "数据库完整性", -1)),
              createVNode(unref(NText), {
                depth: "3",
                class: "tool-detail"
              }, {
                default: withCtx(() => [..._cache[3] || (_cache[3] = [
                  createTextVNode("检查数据库页结构、索引和数据一致性。", -1)
                ])]),
                _: 1
              })
            ]),
            createVNode(unref(Button), {
              loading: integrityChecking.value,
              onClick: checkIntegrity
            }, {
              icon: withCtx(() => [
                createVNode(unref(Icon), { icon: "ion:checkmark-circle-outline" })
              ]),
              default: withCtx(() => [
                _cache[5] || (_cache[5] = createTextVNode(" 运行检查 ", -1))
              ]),
              _: 1
            }, 8, ["loading"])
          ]),
          createBaseVNode("section", _hoisted_6, [
            createBaseVNode("span", _hoisted_7, [
              createVNode(unref(Icon), { icon: "ion:push-outline" })
            ]),
            createBaseVNode("div", null, [
              _cache[7] || (_cache[7] = createBaseVNode("strong", null, "选择数据文件本地同步", -1)),
              createVNode(unref(NText), {
                depth: "3",
                class: "tool-detail"
              }, {
                default: withCtx(() => [..._cache[6] || (_cache[6] = [
                  createTextVNode(" 合并其他养老管理系统数据库中的较新业务记录，现有其他同步方式保持不变。 ", -1)
                ])]),
                _: 1
              }),
              lastLocalSync.value ? (openBlock(), createBlock(unref(NText), {
                key: 0,
                depth: "3",
                class: "last-sync-detail"
              }, {
                default: withCtx(() => [
                  createTextVNode(" 最近：" + toDisplayString(lastLocalSync.value.sourceName) + "，新增 " + toDisplayString(lastLocalSync.value.inserted) + "，更新 " + toDisplayString(lastLocalSync.value.updated), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ]),
            createVNode(unref(Button), {
              type: "info",
              secondary: "",
              loading: localSyncing.value,
              onClick: syncLocalFile
            }, {
              icon: withCtx(() => [
                createVNode(unref(Icon), { icon: "ion:document-attach-outline" })
              ]),
              default: withCtx(() => [
                _cache[8] || (_cache[8] = createTextVNode(" 选择数据文件 ", -1))
              ]),
              _: 1
            }, 8, ["loading"])
          ])
        ]),
        createVNode(unref(NDivider)),
        createBaseVNode("div", _hoisted_8, [
          createBaseVNode("div", null, [
            _cache[9] || (_cache[9] = createBaseVNode("strong", null, "本地备份历史", -1)),
            createVNode(unref(NText), {
              depth: "3",
              class: "tool-detail"
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(backups.value.length) + " 份备份", 1)
              ]),
              _: 1
            })
          ]),
          createVNode(unref(NSpace), null, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                quaternary: "",
                title: "刷新备份历史",
                onClick: loadBackups
              }, {
                icon: withCtx(() => [
                  createVNode(unref(Icon), { icon: "ion:refresh-outline" })
                ]),
                default: withCtx(() => [
                  _cache[10] || (_cache[10] = createTextVNode(" 刷新 ", -1))
                ]),
                _: 1
              }),
              createVNode(unref(Button), {
                quaternary: "",
                title: "打开备份目录",
                onClick: openBackupDirectory
              }, {
                icon: withCtx(() => [
                  createVNode(unref(Icon), { icon: "ion:folder-open-outline" })
                ]),
                default: withCtx(() => [
                  _cache[11] || (_cache[11] = createTextVNode(" 打开目录 ", -1))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_9, [
          backups.value.length ? (openBlock(), createBlock(unref(NTable), {
            key: 0,
            "single-line": false,
            size: "small"
          }, {
            default: withCtx(() => [
              _cache[14] || (_cache[14] = createBaseVNode("thead", null, [
                createBaseVNode("tr", null, [
                  createBaseVNode("th", null, "备份文件"),
                  createBaseVNode("th", null, "大小"),
                  createBaseVNode("th", null, "创建时间"),
                  createBaseVNode("th", null, "操作")
                ])
              ], -1)),
              createBaseVNode("tbody", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(backups.value, (backup) => {
                  return openBlock(), createElementBlock("tr", {
                    key: backup.name
                  }, [
                    createBaseVNode("td", null, [
                      createBaseVNode("strong", _hoisted_10, toDisplayString(backup.name), 1),
                      createVNode(unref(NText), {
                        depth: "3",
                        class: "backup-path"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(backup.path), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    createBaseVNode("td", null, toDisplayString(formatBytes(backup.size)), 1),
                    createBaseVNode("td", null, toDisplayString(formatDate(backup.createdAt)), 1),
                    createBaseVNode("td", null, [
                      createVNode(unref(NSpace), {
                        wrap: false,
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            quaternary: "",
                            size: "small",
                            type: "warning",
                            title: "恢复此备份",
                            loading: backupRestoring.value === backup.name,
                            disabled: Boolean(backupRestoring.value) && backupRestoring.value !== backup.name,
                            onClick: ($event) => restoreBackup(backup.name)
                          }, {
                            icon: withCtx(() => [
                              createVNode(unref(Icon), { icon: "ion:refresh-circle-outline" })
                            ]),
                            default: withCtx(() => [
                              _cache[12] || (_cache[12] = createTextVNode(" 恢复 ", -1))
                            ]),
                            _: 1
                          }, 8, ["loading", "disabled", "onClick"]),
                          createVNode(unref(Button), {
                            quaternary: "",
                            size: "small",
                            title: "导出备份",
                            loading: backupExporting.value === backup.name,
                            onClick: ($event) => exportBackup(backup.name)
                          }, {
                            icon: withCtx(() => [
                              createVNode(unref(Icon), { icon: "ion:download-outline" })
                            ]),
                            default: withCtx(() => [
                              _cache[13] || (_cache[13] = createTextVNode(" 导出 ", -1))
                            ]),
                            _: 1
                          }, 8, ["loading", "onClick"])
                        ]),
                        _: 2
                      }, 1024)
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          })) : (openBlock(), createBlock(unref(NText), {
            key: 1,
            depth: "3"
          }, {
            default: withCtx(() => [..._cache[15] || (_cache[15] = [
              createTextVNode("尚未创建本地数据库备份", -1)
            ])]),
            _: 1
          }))
        ])
      ], 64);
    };
  }
});
const DatabaseSafetyPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-23d1493b"]]);
export {
  DatabaseSafetyPanel as D
};
