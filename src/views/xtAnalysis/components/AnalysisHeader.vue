<template>
  <div>
    <section v-if="isBasicEmployee">
      <el-card class="box-card">
        <el-form
          size="small"
          inline
          ref="form"
          :model="queryForm"
          label-width="80px"
        >
          <el-form-item label="" prop="deptIds">
            <treeselect
              @input="treeselectinput"
              :flat="true"
              v-model="getTreeselectArr1"
              appendToBody
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              :clearable="false"
              placeholder="请选择归属部门"
            />
          </el-form-item>
          <el-form-item label="" prop="userId">
            <el-select
              @input="selectInput"
              style="width: 100%"
              v-model="queryForm.userId"
              filterable
              placeholder="请输入关键字搜索用户"
              remote
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </section>
    <!-- 预览 -->
    <section>
      <el-card class="box-card">
        <div class="preview clearfix" v-loading="histogramLoading">
          <dl v-for="(key, value) in compare" :key="value">
            <dt>{{ key }}</dt>
            <dd>{{ previewData[value] }}</dd>
          </dl>
        </div>
      </el-card>
    </section>
    <slot></slot>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

export default {
  name: "AnalysisHeader",
  props: {
    previewData: Object,
    queryForm: {
      type: Object,
    },
    deptOptions: Array,
    userList: Array,
    isBasicEmployee: Boolean,
    histogramLoading: Boolean,
  },

  components: { Treeselect },
  data() {
    return {
      getTreeselectArr1: [],

      dateMonth: "",

      // 工单数据预览
      // 对照表
      compare: {
        synergyOrderQuantity: "协同下单数据",
        synergyOrderJobQuantity: "协同工单数量",
        notActivated: "待审核分配工单",
        jobInProgress: "正在作业工单",
        finished: "已完结工单",
        canceled: "已取消工单",
        suspended: "已暂缓工单",
        waitCanceled: "待取消工单",
        waitSuspended: "待暂缓工单",
        planPrice: "协同工单应收金额",
        actualPrice: "协同工单已收金额",
        unpaidPrice: "协同工单未收金额",
      },

      resetDeptIds: [],
    };
  },
  methods: {
    handleQuery() {
      this.$emit("query", this.queryForm);
    },
    handleReset() {
      this.getTreeselectArr1 = this.resetDeptIds;

      this.$emit("reset", this.$refs.form, this.queryForm);
    },

    treeselectinput(i) {
      if (i.length) {
        this.queryForm.deptIds = this.getTreeselectArr1.join(",");
        this.queryForm.userId = "";
      } else {
        if (!this.queryForm.userId) {
          this.getTreeselectArr1 = [];
          this.queryForm.deptIds = null;
        }
      }
    },
    selectInput(i) {
      this.queryForm.userId = i;
      if (this.queryForm.userId) {
        this.queryForm.deptIds = undefined;
        this.getTreeselectArr1 = [];
      }
    },
    setDepts() {
      this.resetDeptIds = this.queryForm.deptIds.split(",").map((item) => {
        if (item == "200") {
          return Number(item);
        } else {
          return item;
        }
      });
      this.getTreeselectArr1 = this.queryForm.deptIds.split(",").map((item) => {
        if (item == "200") {
          return Number(item);
        } else {
          return item;
        }
      });
    },
  },
  mounted() {
    // this.getTreeselectArr1 = [this.user.defaultDeptId];
    // this.getTreeselect();
    this.setDepts();
  },

  computed: {
    pickerType() {
      const { timeType } = this.queryForm;
      if (timeType === 2) {
        return "monthrange";
      } else if (timeType === 3) {
        return "daterange";
      }
    },
    valueFormat() {
      const { timeType } = this.queryForm;
      if (timeType === 2) {
        return "yyyy-MM";
      } else if (timeType === 3) {
        return "yyyy-MM-dd";
      }
    },
    ...mapState(["user"]),
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryForm.timeValueBegin = n != null ? n[0] : "";
        this.queryForm.timeValueEnd = n != null ? n[1] : "";
      },
    },
    queryForm: {
      handler() {
        this.setDepts();
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
section {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  .preview {
    text-align: center;
    margin: 0 auto;
    width: fit-content;
    dl {
      float: left;
      padding: 0 15px;

      dt {
        margin-bottom: 15px;
        color: #409eff;
      }
      &:not(:last-of-type) {
        margin-bottom: 20px;
      }
    }
  }
}

.vue-treeselect {
  margin-right: 10px;
}
::v-deep .vue-treeselect__control {
  width: 350px;
  min-height: 28px;
  line-height: 28px;
}
::v-deep .vue-treeselect__multi-value-item {
  height: 22px;
}
::v-deep .vue-treeselect__multi-value-item-container {
  height: 25px;
}

::v-deep .vue-treeselect__multi-value-item {
  display: block;
  line-height: 18px;
}

::v-deep .vue-treeselect__value-container {
  line-height: normal;
}
</style>