<template>
  <div class="detail-page">
    <div class="header-container" v-if="flowData">
      <h4 v-if="flowData.msg">{{ flowData.msg }}</h4>
      <dl>
        <dt>
          <span class="preview-color" v-if="flowData.warnTypeString"
            >( {{ flowData.warnTypeString }} )</span
          >
          <span>{{ flowData.projectName }}</span>
        </dt>
        <dd>
          <span
            :class="{ 'is-active': chindItem.finishTime }"
            v-for="(chindItem, chindIndex) in flowData.processNodeList"
            :key="chindIndex"
            >{{ chindItem.name }}</span
          >
        </dd>
      </dl>
    </div>
    <!-- 动态预览 -->
    <div class="preview-header" v-if="nodeData.length">
      <header>
        <span>协同工单节点动态预览</span>
        <div>
          <slot name="nodeStatus"></slot>
        </div>
      </header>
      <div class="preview-content">
        <dl v-for="(item, index) in nodeData" :key="index">
          <dt>
            <span v-if="item.warnTypeString" class="preview-color"
              >( {{ item.warnTypeString }} )</span
            >
            <span>{{ item.projectName }}</span>
          </dt>
          <dd>
            <p
              v-for="(chindItem, chindIndex) in item.processNodeList"
              :key="chindIndex"
              :class="{ 'is-active': chindItem.finishTime }"
            >
              <span class="preview-moneyTag" v-if="chindItem.moneyTag"
                >( {{ chindItem.moneyTag }} )</span
              >
              <span>{{ chindItem.name }}</span>
            </p>
          </dd>
        </dl>
      </div>
    </div>
    <!-- 信息 -->
    <div class="tabs-list">
      <div :class="{ isFixed: isFixed }" ref="scroll-box" class="scroll">
        <header>
          <div class="tabs-title">{{ title }}</div>
          <div>
            <slot name="actions"></slot>
          </div>
        </header>

        <div class="list">
          <div
            class="list-item"
            :class="{ 'is-checked': active == item.value }"
            v-for="item in tabs"
            :key="item.value"
            @click="toggleTabs(item)"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div v-if="isFixed" style="height: 120px"></div>
      <!-- tabs内容 -->
      <div class="tabs-content">
        <keep-alive>
          <slot name="content"></slot>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 流程数据
    flowData: {
      type: Object,
      default: () => null,
    },
    // 动态节点数据
    nodeData: {
      type: Array,
      default: () => [],
    },
    // tabs切换数据
    tabs: {
      type: Array,
      required: true,
    },
    title: String,
    active: Number | String,
    // 当前是否可编辑新增
    mode: {
      type: "edit" | "show",
      default: "edit",
    },
    showPage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      config: null,
      showData: {},
      isFixed: false, //是否吸顶
    };
  },
  methods: {
    // tabs切换
    toggleTabs(item) {
      this.$emit("togggle", item);
    },
  },
  mounted() {
    // let scollDom = this.$refs["scroll-box"];
    // let scollDomTop = scollDom.offsetTop;
    // let sidebarDom = document.querySelector(
    //   ".sidebar-container .sidebar-logo-container"
    // );
    // let timer = null;
    // document.onscroll = () => {
    //   // 节流
    // console.log(1);
    //   if (timer) clearTimeout(timer);
    //   timer = setTimeout(() => {
    //     const scrollTop =
    //       window.pageYOffset ||
    //       document.documentElement.scrollTop ||
    //       document.body.scrollTop;
    //     let isExist = sidebarDom.classList.contains("collapse");
    //     if (scrollTop >= scollDomTop) {
    //       if (isExist) {
    //         scollDom.style.left = "65px";
    //       } else {
    //         scollDom.style.left = "210px";
    //       }
    //       this.isFixed = true;
    //     } else {
    //       this.isFixed = false;
    //     }
    //     timer = null;
    //   },0);
    // };
  },
};
</script>

<style lang="scss" scoped>
.sticky-box {
  position: sticky;
  top: 0;
}
.detail-page {
  padding: 20px 10px;
  background: #d4dce2;
  position: relative;
  .isFixed {
    position: fixed;
    right: 10px;
    top: 0;
    z-index: 3;
    transition: top 0.5s;
  }
  .header-container {
    background: #fff;
    text-align: center;
    padding: 20px 0;
    margin-bottom: 10px;
    h4 {
      color: #d9001b;
      font-size: 14px;
      margin-bottom: 20px;
    }
    dl {
      justify-content: center;
      align-items: flex-end;
      padding: 0;
      dt {
        color: #333;
        display: flex;
        flex-direction: column;
      }
      dd {
        color: #7f7f7f;
        &::before {
          background: #7f7f7f;
        }
        .is-active {
          color: #0079fe;
        }
      }
    }
  }
  .preview-header {
    background: #fff;
    padding: 15px 15px 30px 15px;
    margin-bottom: 10px;
    header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        font-weight: 600;
        color: #333;
        margin-right: 10px;
      }
    }
    .preview-content {
      padding: 20px 15px;
      border: 1px solid #ccc;
      .is-active {
        color: #0079fe;
      }
      p {
        position: relative;
        padding: 0 20px;
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
        span {
          margin-right: 0;
        }
        .preview-moneyTag {
          width: 100%;
          position: absolute;
          top: -18px;
          left: 0;
          text-align: center;
          color: #d9001b;
        }
      }
      dl {
        align-items: flex-end;
        padding: 0;
        dt {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }

  .tabs-list {
    margin-bottom: 10px;
    .scroll {
      position: sticky;
      top: 0;
      z-index: 3;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 20px;
      font-size: 18px;
      font-weight: 600;
      background: #fff;
      .tabs-title {
        color: #333;
        font-weight: 600;
      }
    }
    .list {
      display: flex;
      padding: 20px;
      margin-bottom: 6px;
      background: #fff;
      .list-item {
        padding: 10px 30px;
        border: 1px solid #0079fe;
        color: #0079fe;
        background: #fff;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      }
      .is-checked {
        background: #0079fe;
        color: #fff;
      }
    }
    .tabs-content {
      background: #fff;
      padding: 20px;
    }
  }
  dl {
    display: flex;
    padding: 10px 0;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    dt {
      margin-right: 15px;
    }
    dd {
      position: relative;
      color: #7f7f7f;
      display: flex;
      align-items: center;
      font-size: 14px;
      span {
        position: relative;
        padding: 0 10px;
        background: #fff;
        z-index: 2;

        &:not(:last-child) {
          margin-right: 30px;
        }
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 1px;
        background: #7f7f7f;
      }
    }
  }
  .preview-color {
    color: #f56c6c;
    font-size: 14px;
    margin-bottom: 8px;
  }
}
</style>