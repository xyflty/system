// 节点动态
<template>
  <div class="nodeStatus-warp">
    <div class="nodeStatus-header">
      <h3>详细工单节点动态</h3>
      <div class="nodeStatus-header__content">
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
        <div class="table-header" v-if="tabsData.length">
          <div class="table-tabs">
            <template v-for="item in tabsData">
              <span
                :key="item.value"
                :class="{ active: pageActive === item.value }"
                @click="chindToggleTabs(item)"
              >
                {{ item.label }}
              </span>
            </template>
          </div>
        </div>
        <div class="node-title">
          <span>{{ title }}</span>
          <span class="node-color" v-if="warnString">( {{ warnString }} )</span>
        </div>
      </div>
    </div>
    <div class="nodeStatus-timeLine">
      <TimeLine
        :mode="mode"
        :timelineList="timeData.firstNodeList"
        :disabledBtns="timeData"
        v-on="$listeners"
        v-bind="$attrs"
        reverse
      ></TimeLine>
    </div>
  </div>
</template>

<script>
import TimeLine from "@/components/TimeLine";
export default {
  name: "NodeStatus",
  components: { TimeLine },
  props: {
    title: {
      type: String,
    },
    warnString: String,
    timeData: {
      type: Object,
      required: true,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String | Number,
      default: 1,
    },
    tabsData: {
      type: Array,
      default: () => [],
    },
    pageActive: {
      type: String | Number,
      default: 1,
    },
    mode: {
      type: "edit" | "show",
    },
  },
  data() {
    return {};
  },
  methods: {
    toggleTabs(item) {
      this.$emit("togggle", item);
    },
    chindToggleTabs(item) {
      this.$emit("chindToggle", item);
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.nodeStatus-warp {
  background: #f2f2f2;
  padding: 20px;
  .nodeStatus-header {
    background: #fff;
    margin-bottom: 15px;
    h3 {
      color: #333;
      font-size: 18px;
      font-weight: 600;
      padding: 20px 30px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
    }
    .nodeStatus-header__content {
      padding: 15px 0;
      .tabs-list {
        display: flex;
        color: #555;
        font-size: 12px;

        .tabs-items {
          padding: 15px 30px;
          cursor: pointer;
        }
        .is-checked {
          color: #0079fe;
        }
      }
      .node-title {
        padding: 15px 30px;
        font-size: 18px;
        color: #333;
        font-weight: 600;

        .node-color {
          color: #f56c6c;
          font-size: 14px;
          margin-left: 15px;
        }
      }
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
}
</style>