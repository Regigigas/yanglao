import { l as defineComponent, o as onMounted, a1 as createElementBlock, X as createVNode, W as withCtx, u as unref, r as ref, V as openBlock, a2 as useRouter, k as createTextVNode, a3 as createBaseVNode, a4 as withKeys, a5 as withModifiers } from "./vendor-vue-Hc3ejqjp.js";
import { u as useAuthStore } from "./index-77IpmxCe.js";
import { u as useMessage, g as NCard, h as NModal, i as NAlert, j as NForm, k as NFormItem, l as NInput, m as NCheckbox, B as Button } from "./vendor-naive-sdNTCZPI.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./vendor-query-CFvMrhIw.js";
import "./vendor-echarts-DEbY5nl3.js";
const _hoisted_1 = { class: "login-page flex-col-center h-screen" };
const _hoisted_2 = { class: "flex-col gap-2 mb-3" };
const _hoisted_3 = { class: "flex items-center justify-between" };
const REMEMBER_USERNAME_KEY = "yanglao:remember-username";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoginView",
  setup(__props) {
    const router = useRouter();
    const authStore = useAuthStore();
    const message = useMessage();
    const form = ref({ username: "admin", password: "admin123" });
    const loading = ref(false);
    const rememberUsername = ref(false);
    const rememberLogin = ref(false);
    const agreed = ref(false);
    const showAgreementModal = ref(false);
    onMounted(() => {
      const saved = localStorage.getItem(REMEMBER_USERNAME_KEY);
      if (saved) {
        form.value.username = saved;
        rememberUsername.value = true;
      }
    });
    const showChangePwModal = ref(false);
    const pwForm = ref({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const changingPw = ref(false);
    async function handleLogin() {
      if (!form.value.username || !form.value.password) {
        message.error("请输入用户名和密码");
        return;
      }
      if (!agreed.value) {
        message.error("请先阅读并勾选同意《用户使用协议》");
        return;
      }
      loading.value = true;
      try {
        const res = await authStore.login(form.value.username, form.value.password, rememberLogin.value);
        if (!res.ok) {
          message.error(res.error ?? "登录失败");
          return;
        }
        if (rememberUsername.value) {
          localStorage.setItem(REMEMBER_USERNAME_KEY, form.value.username);
        } else {
          localStorage.removeItem(REMEMBER_USERNAME_KEY);
        }
        if (res.user.must_change_pw) {
          pwForm.value.oldPassword = form.value.password;
          showChangePwModal.value = true;
          return;
        }
        message.success("登录成功");
        router.replace("/dashboard");
      } finally {
        loading.value = false;
      }
    }
    async function handleChangePassword() {
      if (!pwForm.value.newPassword || pwForm.value.newPassword.length < 6) {
        message.error("新密码至少6位");
        return;
      }
      if (pwForm.value.newPassword !== pwForm.value.confirmPassword) {
        message.error("两次输入的新密码不一致");
        return;
      }
      changingPw.value = true;
      try {
        const res = await authStore.changePassword(pwForm.value.oldPassword, pwForm.value.newPassword);
        if (!res.ok) {
          message.error(res.error ?? "修改失败");
          return;
        }
        message.success("密码修改成功，请重新登录");
        showChangePwModal.value = false;
        await authStore.logout();
        form.value.password = "";
      } finally {
        changingPw.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(NCard), {
          title: "养老管理系统",
          style: { "width": "380px" },
          class: "shadow-lg"
        }, {
          default: withCtx(() => [
            createVNode(unref(NAlert), {
              type: "info",
              "show-icon": true,
              class: "mb-4"
            }, {
              default: withCtx(() => [..._cache[11] || (_cache[11] = [
                createTextVNode(" 初次使用请用默认账号 ", -1),
                createBaseVNode("b", null, "admin", -1),
                createTextVNode(" / 密码 ", -1),
                createBaseVNode("b", null, "admin123", -1),
                createTextVNode(" 登录，登录后系统会强制要求修改密码，请设置为只有自己知道的新密码。 ", -1)
              ])]),
              _: 1
            }),
            createVNode(unref(NForm), {
              model: form.value,
              "label-placement": "left",
              "label-width": "0"
            }, {
              default: withCtx(() => [
                createVNode(unref(NFormItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: form.value.username,
                      "onUpdate:value": _cache[0] || (_cache[0] = ($event) => form.value.username = $event),
                      placeholder: "用户名",
                      size: "large",
                      onKeydown: withKeys(handleLogin, ["enter"])
                    }, {
                      prefix: withCtx(() => [..._cache[12] || (_cache[12] = [
                        createBaseVNode("i", { class: "i-ion:person-outline inline-block" }, null, -1)
                      ])]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), null, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: form.value.password,
                      "onUpdate:value": _cache[1] || (_cache[1] = ($event) => form.value.password = $event),
                      type: "password",
                      "show-password-on": "click",
                      placeholder: "密码",
                      size: "large",
                      onKeydown: withKeys(handleLogin, ["enter"])
                    }, {
                      prefix: withCtx(() => [..._cache[13] || (_cache[13] = [
                        createBaseVNode("i", { class: "i-ion:lock-closed-outline inline-block" }, null, -1)
                      ])]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }),
                createBaseVNode("div", _hoisted_2, [
                  createBaseVNode("div", _hoisted_3, [
                    createVNode(unref(NCheckbox), {
                      checked: rememberUsername.value,
                      "onUpdate:checked": _cache[2] || (_cache[2] = ($event) => rememberUsername.value = $event)
                    }, {
                      default: withCtx(() => [..._cache[14] || (_cache[14] = [
                        createTextVNode("记住用户名", -1)
                      ])]),
                      _: 1
                    }, 8, ["checked"]),
                    createVNode(unref(NCheckbox), {
                      checked: rememberLogin.value,
                      "onUpdate:checked": _cache[3] || (_cache[3] = ($event) => rememberLogin.value = $event)
                    }, {
                      default: withCtx(() => [..._cache[15] || (_cache[15] = [
                        createTextVNode("记住登录状态（30天）", -1)
                      ])]),
                      _: 1
                    }, 8, ["checked"])
                  ]),
                  createVNode(unref(NCheckbox), {
                    checked: agreed.value,
                    "onUpdate:checked": _cache[5] || (_cache[5] = ($event) => agreed.value = $event)
                  }, {
                    default: withCtx(() => [
                      _cache[16] || (_cache[16] = createTextVNode(" 我已阅读并同意 ", -1)),
                      createBaseVNode("a", {
                        href: "javascript:void(0)",
                        onClick: _cache[4] || (_cache[4] = withModifiers(($event) => showAgreementModal.value = true, ["stop"]))
                      }, "《用户使用协议》")
                    ]),
                    _: 1
                  }, 8, ["checked"])
                ]),
                createVNode(unref(Button), {
                  type: "primary",
                  size: "large",
                  block: "",
                  loading: loading.value,
                  onClick: handleLogin
                }, {
                  default: withCtx(() => [..._cache[17] || (_cache[17] = [
                    createTextVNode("登录", -1)
                  ])]),
                  _: 1
                }, 8, ["loading"])
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          _: 1
        }),
        createVNode(unref(NModal), {
          show: showAgreementModal.value,
          "onUpdate:show": _cache[7] || (_cache[7] = ($event) => showAgreementModal.value = $event),
          title: "用户使用协议",
          preset: "card",
          style: { "width": "520px" }
        }, {
          footer: withCtx(() => [
            createVNode(unref(Button), {
              type: "primary",
              block: "",
              onClick: _cache[6] || (_cache[6] = ($event) => {
                agreed.value = true;
                showAgreementModal.value = false;
              })
            }, {
              default: withCtx(() => [..._cache[18] || (_cache[18] = [
                createTextVNode("我已阅读并同意", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            _cache[19] || (_cache[19] = createBaseVNode("div", { class: "agreement-content" }, [
              createBaseVNode("p", null, '欢迎使用养老管理系统（以下简称"本系统"）。在您使用本系统前，请仔细阅读以下条款：'),
              createBaseVNode("p", null, "1. 账号安全：请妥善保管您的登录账号与密码，不要将账号密码告知无关人员，因账号泄露造成的数据风险由使用者自行承担。"),
              createBaseVNode("p", null, "2. 数据合规：本系统涉及老人及员工的个人信息，请严格遵守相关法律法规及本机构内部管理制度，仅在工作范围内查阅、使用相关数据。"),
              createBaseVNode("p", null, "3. 操作规范：请按照岗位权限规范操作系统功能，不得利用系统权限进行与工作无关的操作。"),
              createBaseVNode("p", null, "4. 责任说明：因违规操作、账号外借等行为导致的数据丢失、泄露或其他后果，由责任人自行承担。"),
              createBaseVNode("p", null, "本协议内容后续可能根据实际管理需要调整，如有变更将以系统内通知为准。")
            ], -1))
          ]),
          _: 1
        }, 8, ["show"]),
        createVNode(unref(NModal), {
          show: showChangePwModal.value,
          "onUpdate:show": _cache[10] || (_cache[10] = ($event) => showChangePwModal.value = $event),
          title: "首次登录，请修改密码",
          preset: "card",
          style: { "width": "420px" },
          closable: false,
          "mask-closable": false
        }, {
          footer: withCtx(() => [
            createVNode(unref(Button), {
              type: "primary",
              block: "",
              loading: changingPw.value,
              onClick: handleChangePassword
            }, {
              default: withCtx(() => [..._cache[20] || (_cache[20] = [
                createTextVNode("确认修改", -1)
              ])]),
              _: 1
            }, 8, ["loading"])
          ]),
          default: withCtx(() => [
            createVNode(unref(NForm), {
              model: pwForm.value,
              "label-placement": "left",
              "label-width": "90"
            }, {
              default: withCtx(() => [
                createVNode(unref(NFormItem), {
                  label: "新密码",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: pwForm.value.newPassword,
                      "onUpdate:value": _cache[8] || (_cache[8] = ($event) => pwForm.value.newPassword = $event),
                      type: "password",
                      "show-password-on": "click",
                      placeholder: "至少6位"
                    }, null, 8, ["value"])
                  ]),
                  _: 1
                }),
                createVNode(unref(NFormItem), {
                  label: "确认密码",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(NInput), {
                      value: pwForm.value.confirmPassword,
                      "onUpdate:value": _cache[9] || (_cache[9] = ($event) => pwForm.value.confirmPassword = $event),
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
        }, 8, ["show"])
      ]);
    };
  }
});
const LoginView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50641394"]]);
export {
  LoginView as default
};
