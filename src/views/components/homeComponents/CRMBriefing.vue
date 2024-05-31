// crm简报
<template>
  <div>
    <el-card :class="`box-card font-${size}`">
      <div slot="header" class="card-header">
        <span class="card_header--title">{{ title }}</span>
        <div v-if="isQuery" style="display: flex">
          <div>
            <slot name="header-right"></slot>
          </div>
          <div>
            <el-select
              size="mini"
              v-model="queryForm.type"
              placeholder="请选择"
              style="margin-left: 10px; max-width: 100px"
            >
              <template v-for="option in report">
                <el-option
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </template>
            </el-select>
            <el-select
              v-if="hideTime"
              size="mini"
              v-model="queryForm.timeType"
              placeholder="请选择"
              style="margin-left: 10px; max-width: 100px"
            >
              <el-option label="今天" :value="1" />
              <el-option label="昨天" :value="2" />
              <el-option label="近7天" :value="3" />
              <el-option label="近15天" :value="4" />
              <el-option label="近30天" :value="5" />
            </el-select>
            <el-date-picker
              v-if="hideTime"
              v-model="queryForm.date"
              type="datetimerange"
              size="mini"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="margin-left: 10px; max-width: 200px"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <template>
        <div v-if="isShowSlot">
          <slot></slot>
        </div>
        <div v-else class="card-content">
          <div class="list">
            <div
              class="list-items"
              v-for="(key, value) in Options.compare"
              :key="key"
              @click="showData(key, value)"
            >
              <span :title="key" class="list-items--text">{{ key }}</span>
              <span class="colorBlue">{{ data[value] || 0 }}</span>
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

export default {
  name: "CRMBriefing",
  components: {
    MultiTable,
  },

  props: {
    title: String,
    isQuery: Boolean,
    size: {
      type: String,
      default: "mini",
    },
    Options: {
      type: Object,
    },
    data: {
      type: Object,
    },
    queryForm: Object,
    report: Array,
    isShowSlot: Boolean,
    hideTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 获取当前工单状态
    getjobStatus(type) {
      switch (type) {
        case "notActivated":
          // 未激活
          return 1;
        case "jobInProgress":
          // 正在作业
          return 3;
        case "finished":
          // 已完结
          return 4;
        case "canceled":
          // 已取消
          return 5;
        case "suspended":
          // 已暂缓
          return 7;

        case "waitCanceled":
          // 待取消
          return 9;
        case "waitSuspended":
          // 待暂缓
          return 10;
        case "timeoutWarn":
          // 超时预警
          return 3;
      }
    },
    showData(label, type) {
      let status = this.getjobStatus(type);
      this.$emit("detail", { label, type, status });
    },
    // SizeChange(size) {
    //   this.$emit("SizeChange", size);
    // },
    // CurrentChange(current) {
    //   this.$emit("CurrentChange", current);
    // },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.font-default {
  font-size: 16px;
}
.card_header--title {
  flex: 0 0 140px;
  font-weight: 600;
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);
}
.font-mini {
  font-size: 14px;
}
.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-content {
    padding: 20px;
    .list {
      // display: flex;
      // justify-content: space-around;
      // flex-wrap: wrap;
      display: grid;
      grid-template-columns: repeat(
        6,
        1fr
      ); //第一个参数是几份，后面可以说绝对单位，百分比，fr
      grid-auto-flow: row dense;
      .list-items {
        // min-width: 130px;
        // flex: 1;
        display: flex;

        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        overflow: hidden;
        box-sizing: border-box;
        &--text {
          font-weight: 600;
          color: #333;
          display: block;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        cursor: pointer;
        position: relative;
        &::after {
          content: "";
          width: 1px;
          height: 25px;
          background: #eee;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        &:last-child::after,
        &:nth-child(6n)::after {
          background: #fff;
        }

        //倒数第二个并且是 1 ,4,7,10,13列
        &:nth-last-child(2):nth-child(3n + 1),
        //倒数最后一个并且是 2,5,8,11列
        &:last-child:nth-child(3n - 1) {
          grid-column-end: span 3;
          border-top: 1px solid #eee;
        }

        /* Dealing with single orphan */

        // &:last-child:nth-child(3n - 2) {
        //   grid-column-end: 5;
        // }

        span {
          &:first-child {
            margin-bottom: 15px;
          }
        }
        .colorBlue {
          color: #409eff;
        }
      }
    }
  }
}

::v-deep .el-card__body {
  padding: 0;
}
</style>