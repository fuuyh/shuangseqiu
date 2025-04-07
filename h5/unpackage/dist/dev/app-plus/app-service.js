if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onNavigationBarButtonTap = /* @__PURE__ */ createHook(ON_NAVIGATION_BAR_BUTTON_TAP);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    __name: "index",
    setup(__props) {
      const cpqs = vue.ref("2025031");
      const kjrq = vue.ref("2025-03-27");
      const kjxq = vue.ref("");
      const zxkjhq = vue.ref([]);
      const zxkjlq = vue.ref("");
      const wqkjList = vue.ref([]);
      vue.onMounted(() => {
        uni.request({
          // url: 'https://kaijiang.500.com/static/info/kaijiang/xml/ssq/list.xml',
          url: "/api/static/info/kaijiang/xml/ssq/list.xml",
          method: "GET",
          success: (res) => {
            const data = parseXML(res.data);
            cpqs.value = data[0].qh;
            kjrq.value = data[0].kjrq;
            zxkjhq.value = data[0].hq;
            zxkjlq.value = data[0].lq;
            kjxq.value = data[0].day;
            wqkjList.value = data;
            uni.setStorageSync("zxhm", cpqs.value);
            uni.setStorageSync("lshm", wqkjList.value);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/index/index.vue:232", "请求失败：", err);
          }
        });
      });
      const getWeekday = (dateStr) => {
        const date = new Date(dateStr);
        const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
        return weekdays[date.getDay()];
      };
      const parseXML = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const rows = xmlDoc.getElementsByTagName("row");
        return Array.from(rows).map((row) => {
          const expect = row.getAttribute("expect") || "";
          const opencode = row.getAttribute("opencode") || "";
          const opentime = (row.getAttribute("opentime") || "").split(" ")[0];
          let hq = [], lq = "";
          if (opencode.includes("|")) {
            const [redPart, bluePart] = opencode.split("|");
            hq = redPart.split(",");
            lq = bluePart;
          }
          return {
            qh: `20${expect}`,
            // 与Python的'20' + expect一致
            kjrq: opentime,
            hq,
            lq,
            day: getWeekday(opentime)
            // 转换星期
          };
        }).sort((a, b) => b.kjrq.localeCompare(a.kjrq)).slice(0, 100);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createElementVNode("view", { class: "header" }),
          vue.createElementVNode("view", { class: "gg card" }, [
            vue.createElementVNode(
              "view",
              { class: "gg_title" },
              " 福彩双色球 " + vue.toDisplayString(cpqs.value) + " 期全国开奖公告 ",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "gg_f_title" },
              " 本期" + vue.toDisplayString(cpqs.value) + " 开奖日期：" + vue.toDisplayString(kjrq.value) + "(" + vue.toDisplayString(kjxq.value) + ") ",
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "gg_content" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(zxkjhq.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      class: "gg_item",
                      key: index
                    },
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createElementVNode(
                "view",
                { class: "gg_item gg_item_blue" },
                vue.toDisplayString(zxkjlq.value),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "zj card" }, [
            vue.createElementVNode("view", { class: "zj_title" }, [
              vue.createElementVNode("view", { class: "jx" }, " 奖项 "),
              vue.createElementVNode("view", { class: "tj" }, " 条件 "),
              vue.createElementVNode("view", { class: "zjzs" }, " 中奖注数 "),
              vue.createElementVNode("view", { class: "djje" }, " 单奖金额 ")
            ]),
            vue.createElementVNode("view", { class: "zj_content" }, [
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 一等奖 "),
                vue.createElementVNode("view", { class: "tj" }, [
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdb" })
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 2 "),
                vue.createElementVNode("view", { class: "djje" }, " 100000000 ")
              ]),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 二等奖 "),
                vue.createElementVNode("view", { class: "tj" }, [
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" })
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 79 "),
                vue.createElementVNode("view", { class: "djje" }, " 296038 ")
              ]),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 三等奖 "),
                vue.createElementVNode("view", { class: "tj" }, [
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdr" }),
                  vue.createElementVNode("view", { class: "tjdb" })
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 1179 "),
                vue.createElementVNode("view", { class: "djje" }, " 3000 ")
              ]),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 四等奖 "),
                vue.createElementVNode("view", { class: "tj tj2" }, [
                  vue.createElementVNode("view", { class: "top" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" })
                  ]),
                  vue.createElementVNode("view", { class: "bottom" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdb" })
                  ])
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 66102 "),
                vue.createElementVNode("view", { class: "djje" }, " 200 ")
              ]),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 五等奖 "),
                vue.createElementVNode("view", { class: "tj tj2" }, [
                  vue.createElementVNode("view", { class: "top" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" })
                  ]),
                  vue.createElementVNode("view", { class: "bottom" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdb" })
                  ])
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 1303555 "),
                vue.createElementVNode("view", { class: "djje" }, " 10 ")
              ]),
              vue.createElementVNode("view", { class: "row" }, [
                vue.createElementVNode("view", { class: "jx" }, " 六等奖 "),
                vue.createElementVNode("view", { class: "tj tj2" }, [
                  vue.createElementVNode("view", { class: "top" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdb" })
                  ]),
                  vue.createElementVNode("view", { class: "bottom" }, [
                    vue.createElementVNode("view", { class: "tjdr" }),
                    vue.createElementVNode("view", { class: "tjdb" })
                  ])
                ]),
                vue.createElementVNode("view", { class: "zjzs" }, " 10929071 "),
                vue.createElementVNode("view", { class: "djje" }, " 5 ")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "hr" }, " - 福彩双色球往期中奖号码 - "),
          vue.createElementVNode("view", { class: "wq card" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(wqkjList.value, (item, i) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "wq_item",
                  key: i
                }, [
                  vue.createElementVNode("view", { class: "wq_title" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "qs" },
                      " 第" + vue.toDisplayString(item.qh) + "期 ",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "date" },
                      vue.toDisplayString(item.kjrq) + "(" + vue.toDisplayString(item.day) + ") ",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "gg_content" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item.hq, (hq, index) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            class: "gg_item",
                            key: index
                          },
                          vue.toDisplayString(hq),
                          1
                          /* TEXT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    vue.createElementVNode(
                      "view",
                      { class: "gg_item gg_item_blue" },
                      vue.toDisplayString(item.lq),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", {
            class: "hr",
            style: { "margin-bottom": "0", "padding-bottom": "20px" }
          }, " - 暂无更多数据 - ")
        ]);
      };
    }
  };
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/pages/index/index.vue"]]);
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$5 = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = {
          ...this.styles,
          "transition-duration": this.duration / 1e3 + "s"
        };
        let transform = "";
        for (let i in styles) {
          let line = this.toLine(i);
          transform += line + ":" + styles[i] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])), [
      [vue.vShow, $data.isShow]
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$2], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$4 = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e) {
        e.stopPropagation();
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:310", "缺少类型：", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          this.showPoptrans();
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      showPoptrans() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.showTrans = true;
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$1);
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]])
      },
      [
        vue.createElementVNode(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? (vue.openBlock(), vue.createBlock(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: vue.normalizeStyle($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* HYDRATE_EVENTS */
        )
      ],
      2
      /* CLASS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$1], ["__scopeId", "data-v-4dd3c44b"], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _sfc_main$3 = {};
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" From Uiverse.io by JkHuger "),
        vue.createElementVNode("div", { class: "box-of-star1" }, [
          vue.createElementVNode("div", { class: "star star-position1" }),
          vue.createElementVNode("div", { class: "star star-position2" }),
          vue.createElementVNode("div", { class: "star star-position3" }),
          vue.createElementVNode("div", { class: "star star-position4" }),
          vue.createElementVNode("div", { class: "star star-position5" }),
          vue.createElementVNode("div", { class: "star star-position6" }),
          vue.createElementVNode("div", { class: "star star-position7" })
        ]),
        vue.createElementVNode("div", { class: "box-of-star2" }, [
          vue.createElementVNode("div", { class: "star star-position1" }),
          vue.createElementVNode("div", { class: "star star-position2" }),
          vue.createElementVNode("div", { class: "star star-position3" }),
          vue.createElementVNode("div", { class: "star star-position4" }),
          vue.createElementVNode("div", { class: "star star-position5" }),
          vue.createElementVNode("div", { class: "star star-position6" }),
          vue.createElementVNode("div", { class: "star star-position7" })
        ]),
        vue.createElementVNode("div", { class: "box-of-star3" }, [
          vue.createElementVNode("div", { class: "star star-position1" }),
          vue.createElementVNode("div", { class: "star star-position2" }),
          vue.createElementVNode("div", { class: "star star-position3" }),
          vue.createElementVNode("div", { class: "star star-position4" }),
          vue.createElementVNode("div", { class: "star star-position5" }),
          vue.createElementVNode("div", { class: "star star-position6" }),
          vue.createElementVNode("div", { class: "star star-position7" })
        ]),
        vue.createElementVNode("div", { class: "box-of-star4" }, [
          vue.createElementVNode("div", { class: "star star-position1" }),
          vue.createElementVNode("div", { class: "star star-position2" }),
          vue.createElementVNode("div", { class: "star star-position3" }),
          vue.createElementVNode("div", { class: "star star-position4" }),
          vue.createElementVNode("div", { class: "star star-position5" }),
          vue.createElementVNode("div", { class: "star star-position6" }),
          vue.createElementVNode("div", { class: "star star-position7" })
        ]),
        vue.createElementVNode("div", {
          "data-js": "astro",
          class: "astronaut"
        }, [
          vue.createElementVNode("div", { class: "head" }),
          vue.createElementVNode("div", { class: "arm arm-left" }),
          vue.createElementVNode("div", { class: "arm arm-right" }),
          vue.createElementVNode("div", { class: "body" }, [
            vue.createElementVNode("div", { class: "panel" })
          ]),
          vue.createElementVNode("div", { class: "leg leg-left" }),
          vue.createElementVNode("div", { class: "leg leg-right" }),
          vue.createElementVNode("div", { class: "schoolbag" })
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const loadingVue = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__scopeId", "data-v-194c36fa"], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/component/loading.vue"]]);
  const _sfc_main$2 = {
    __name: "f-share",
    props: {
      data: {
        type: Array,
        default: () => []
      },
      qh: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const formattedTime = vue.ref("");
      const formatTime = () => {
        const now = /* @__PURE__ */ new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}.${month}.${day}-${hours}:${minutes}:${seconds}`;
      };
      vue.onMounted(() => {
        formattedTime.value = formatTime();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "bg" }, [
          vue.createElementVNode("view", { class: "top bgred" }),
          vue.createElementVNode("view", { class: "center" }, [
            vue.createElementVNode("view", { style: { "font-size": "24px", "text-align": "center", "padding": "30px", "padding-bottom": "3px", "font-weight": "bold" } }, "中国福利彩票 双色球 "),
            vue.createElementVNode(
              "view",
              { style: { "font-size": "22px", "text-align": "center", "padding": "30px", "padding-top": "0", "color": "#252424" } },
              vue.toDisplayString(formattedTime.value) + " " + vue.toDisplayString(__props.qh) + "期 ",
              1
              /* TEXT */
            ),
            __props.data.length ? (vue.openBlock(), vue.createElementBlock("table", {
              key: 0,
              border: "1"
            }, [
              vue.createElementVNode("tbody", null, [
                vue.createElementVNode("tr", null, [
                  vue.createElementVNode("th", null, "中奖号码"),
                  vue.createElementVNode("th", null, "引擎")
                ]),
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(__props.data, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("tr", { key: index }, [
                      vue.createElementVNode(
                        "td",
                        { class: "zjhm" },
                        vue.toDisplayString(item.hq.join(", ")) + "-" + vue.toDisplayString(item.lq),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.type),
                        1
                        /* TEXT */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "createBy" }, [
              vue.createElementVNode("view", { class: "sjly" }, [
                vue.createCommentVNode(" <br /> "),
                vue.createTextVNode(" 1. 分析引擎基于deepsekk-r1本地部署 "),
                vue.createElementVNode("br"),
                vue.createTextVNode(" 2. 历史中奖数据由kaijiang.500.com提供 "),
                vue.createElementVNode("br"),
                vue.createCommentVNode(" 3. 应用由UniApp+vue3搭建 "),
                vue.createTextVNode(" 3. 生成结果仅供娱乐参考 "),
                vue.createElementVNode("br"),
                vue.createTextVNode(" 4. power-by@Fuyh "),
                vue.createElementVNode("br")
              ]),
              vue.createCommentVNode(' 				<view class="author">\n					@Fuyh\n				</view> ')
            ])
          ]),
          vue.createElementVNode("view", { class: "bottom bgred" })
        ]);
      };
    }
  };
  const fShareVue = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-9f896e47"], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/component/f-share.vue"]]);
  const _sfc_main$1 = {
    __name: "fenxi",
    setup(__props) {
      const dsjhm = vue.ref(["*", "*", "*", "*", "*", "*"]);
      const jxhm = vue.ref(["*", "*", "*", "*", "*", "*"]);
      const zyhm = vue.ref(["*", "*", "*", "*", "*", "*"]);
      const lyhm = vue.ref(["*", "*", "*", "*", "*", "*"]);
      const dsjhml = vue.ref("*");
      const jxhml = vue.ref("*");
      const zyhml = vue.ref("*");
      const lyhml = vue.ref("*");
      const dqqh = vue.ref("2025036");
      const lshm = vue.ref([]);
      const isLoading = vue.ref(false);
      vue.onMounted(() => {
        dqqh.value = Number(uni.getStorageSync("zxhm")) + 1;
        lshm.value = uni.getStorageSync("lshm");
      });
      const getDJHM = (type) => {
        const data = {
          input: {
            prompt: "获取双色球中奖号码",
            biz_params: {
              user_defined_params: {
                type,
                qh: dqqh.value,
                ls: JSON.stringify(lshm.value)
              }
            }
          }
        };
        isLoading.value = true;
        uni.request({
          url: "https://dashscope.aliyuncs.com/api/v1/apps/f6cf80bd3e254b4d83583c1d5e0fd632/completion",
          method: "POST",
          data,
          header: {
            "Authorization": "sk-435ed03c80fa4c85ad321e3aa8d1c328",
            "Content-Type": "application/json"
          },
          timeout: 6e5,
          success: async (res) => {
            formatAppLog("log", "at pages/fenxi/fenxi.vue:137", res, "[[[[]]]]");
            if (res.statusCode == 200) {
              const cljg = JSON.parse(res.data.output.text);
              await setResNum(type, cljg);
            } else {
              isLoading.value = false;
              uni.showToast({
                mask: true,
                title: "请求失败"
              });
            }
          },
          fail: (err) => {
            isLoading.value = false;
            formatAppLog("error", "at pages/fenxi/fenxi.vue:151", "请求失败：", err);
            uni.showToast({
              mask: true,
              title: "请求失败" + err
            });
          }
        });
      };
      const setResNum = (type, res) => {
        formatAppLog("log", "at pages/fenxi/fenxi.vue:162", "设置号码", res);
        const parseNumbers = (str) => {
          const match = str.match(/\[([\d,\s]+)\]/);
          if (!match)
            return [];
          return match[1].split(",").map((num) => parseInt(num.trim(), 10));
        };
        const redBalls = parseNumbers(res.res.split("\n")[0]);
        const blueBalls = parseNumbers(res.res.split("\n")[1]);
        switch (type) {
          case "0":
            dsjhm.value = redBalls;
            dsjhml.value = blueBalls[0];
            break;
          case "1":
            jxhm.value = redBalls;
            jxhml.value = blueBalls[0];
            break;
          case "2":
            zyhm.value = redBalls;
            zyhml.value = blueBalls[0];
            break;
          case "3":
            lyhm.value = redBalls;
            lyhml.value = blueBalls[0];
            break;
        }
        isLoading.value = false;
      };
      const popup = vue.ref();
      const filteredData = vue.ref([]);
      onNavigationBarButtonTap((e) => {
        filteredData.value = collectData();
        popup.value.open();
        uni.hideTabBar();
      });
      const collectData = () => {
        const result = [];
        const checkValid = (redArray, blue) => {
          return redArray.every((item) => item !== "*") && blue !== "*" && redArray.length === 6;
        };
        const types = [
          {
            type: "大数据",
            red: dsjhm.value,
            blue: dsjhml.value
          },
          {
            type: "AI机选",
            red: jxhm.value,
            blue: jxhml.value
          },
          {
            type: "周易",
            red: zyhm.value,
            blue: zyhml.value
          },
          {
            type: "六爻",
            red: lyhm.value,
            blue: lyhml.value
          }
        ];
        types.forEach((typeObj) => {
          if (checkValid(typeObj.red, typeObj.blue)) {
            result.push({
              hq: typeObj.red,
              lq: typeObj.blue,
              type: typeObj.type
            });
          }
        });
        return result;
      };
      const closePopup = () => {
        uni.showTabBar();
      };
      const currentQH = vue.ref("2023150");
      vue.ref(["02", "08", "15", "23", "27", "30"]);
      vue.ref("12");
      const h5SaveImage = (dataURL) => {
        try {
          const link = document.createElement("a");
          link.download = `lottery-${currentQH.value}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          uni.showToast({
            title: "开始下载，请稍候"
          });
        } catch (e) {
          formatAppLog("warn", "at pages/fenxi/fenxi.vue:281", "直接下载失败，改用新窗口方式");
          window.open(dataURL, "_blank");
          uni.showToast({
            title: "右键图片另存为",
            icon: "none",
            duration: 3e3
          });
        }
      };
      const generateImage = async () => {
        try {
          const captureBox = document.querySelector("#captureBox");
          if (!captureBox) {
            throw new Error("未找到需要生成图片的 DOM 节点");
          }
          const canvas = await window.html2canvas(captureBox, {
            scale: window.devicePixelRatio || 1,
            // 提高清晰度
            useCORS: true,
            // 支持跨域图片
            logging: false
            // 关闭日志
          });
          const dataURL = canvas.toDataURL("image/png");
          h5SaveImage(dataURL);
        } catch (err) {
          formatAppLog("error", "at pages/fenxi/fenxi.vue:312", "生成失败:", err);
          uni.showToast({
            title: `保存失败：${err.message}`,
            icon: "none"
          });
        }
      };
      return (_ctx, _cache) => {
        const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_0);
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          !isLoading.value ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            [
              vue.createElementVNode("view", { class: "header" }),
              vue.createElementVNode("view", { class: "card" }, [
                vue.createElementVNode(
                  "view",
                  { class: "title" },
                  " 大数据分析 " + vue.toDisplayString(dqqh.value) + " 期预测 ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "gg_content" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(dsjhm.value, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "gg_item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(item),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "gg_item gg_item_blue" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(dsjhml.value),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "gg_footer" }, [
                  vue.createElementVNode("button", {
                    type: "button",
                    onClick: _cache[0] || (_cache[0] = ($event) => getDJHM("0"))
                  }, "分析预测")
                ])
              ]),
              vue.createElementVNode("view", { class: "card" }, [
                vue.createElementVNode(
                  "view",
                  { class: "title" },
                  " AI机选 " + vue.toDisplayString(dqqh.value) + " 期预测 ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "gg_content" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(jxhm.value, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "gg_item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(item),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "gg_item gg_item_blue" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(jxhml.value),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "gg_footer" }, [
                  vue.createElementVNode("button", {
                    type: "button",
                    onClick: _cache[1] || (_cache[1] = ($event) => getDJHM("1"))
                  }, "分析预测")
                ])
              ]),
              vue.createElementVNode("view", { class: "card" }, [
                vue.createElementVNode(
                  "view",
                  { class: "title" },
                  " 周易六十四卦 " + vue.toDisplayString(dqqh.value) + " 期预测 ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "gg_content" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(zyhm.value, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "gg_item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(item),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "gg_item gg_item_blue" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(zyhml.value),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "gg_footer" }, [
                  vue.createElementVNode("button", {
                    type: "button",
                    onClick: _cache[2] || (_cache[2] = ($event) => getDJHM("2"))
                  }, "分析预测")
                ])
              ]),
              vue.createElementVNode("view", { class: "card" }, [
                vue.createElementVNode(
                  "view",
                  { class: "title" },
                  " 六爻卦 " + vue.toDisplayString(dqqh.value) + " 期预测 ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "gg_content" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(lyhm.value, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "gg_item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(item),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "gg_item gg_item_blue" }, [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(lyhml.value),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                vue.createElementVNode("view", { class: "gg_footer" }, [
                  vue.createElementVNode("button", {
                    type: "button",
                    onClick: _cache[3] || (_cache[3] = ($event) => getDJHM("3"))
                  }, "分析预测")
                ])
              ]),
              vue.createElementVNode("view", { class: "hr" }, " - 以上分析结果仅供参考 - ")
            ],
            64
            /* STABLE_FRAGMENT */
          )) : (vue.openBlock(), vue.createBlock(loadingVue, { key: 1 })),
          vue.createCommentVNode(` <canvas canvas-id="h5Canvas" :style="{position: 'absolute', left: '-9999px'}"></canvas> `),
          vue.createVNode(
            _component_uni_popup,
            {
              onMaskClick: closePopup,
              style: { "height": "75vh" },
              "background-color": "#fff",
              ref_key: "popup",
              ref: popup,
              type: "bottom",
              "border-radius": "10px 10px 0 0"
            },
            {
              default: vue.withCtx(() => [
                vue.createVNode(fShareVue, {
                  class: "preview-box",
                  id: "captureBox",
                  data: filteredData.value,
                  qh: dqqh.value
                }, null, 8, ["data", "qh"]),
                filteredData.value.length > 0 ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  onClick: generateImage
                }, "保存图片")) : vue.createCommentVNode("v-if", true)
              ]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          )
        ]);
      };
    }
  };
  const PagesFenxiFenxi = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9a600470"], ["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/pages/fenxi/fenxi.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/fenxi/fenxi", PagesFenxiFenxi);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/fuyh/Desktop/code/shuangseqiu/h5/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
