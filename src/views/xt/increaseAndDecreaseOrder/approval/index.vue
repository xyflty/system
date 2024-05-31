<template>
  <div class="increaseAndDecreaseOrder">
    <MultiTable
      ref="tableRef"
      border
      align="center"
      isPagination
      isSearchForm
      :searchOptions="approvalConfig.searchOptions"
      :api="apiFn"
      :parmas="parmas"
      :span-method="handleObjectSpanMethod"
      :getSpanData="getSpanData"
      :Options="approvalConfig.tableOption"
      @setupEvents="setupEvents"
    >
      <template #originalTotle="{ scope }">
        <span>{{ scope.originalUnitPrice * scope.originalQuantity }}</span>
      </template>
      <template #changeTotle="{ scope }">
        <span>{{ scope.changeUnitPrice * scope.changeQuantity }}</span>
      </template>
    </MultiTable>

    <!-- 项目变更 -->
    <order-drawer
      v-if="increaseOrDecreaseOrderForm"
      title="订单标题+订单编号+项目变更审核操作"
      type="show"
      :id="rowItem.orderId"
      :drawerForm="increaseOrDecreaseOrderForm"
      :visiable.sync="increaseOrDecreaseOrderDrawer"
      @cancel="handleCancel"
      @audit="handleAudit"
    ></order-drawer>

    <el-dialog
      title="项目变更审批"
      :visible.sync="auditDialog"
      @close="handleClose"
    >
      <el-form ref="auditRef" label-width="100px" :model="auditForm">
        <el-form-item label="审核信息" prop="remark">
          <el-input
            type="textarea"
            v-model="auditForm.remark"
            placeholder="请输入审批信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="auditFun('pass')">审批通过</el-button>
        <el-button @click="auditFun('noPass')">审批不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
// 项目变更
import orderDrawer from "@/views/components/increaseOrDecreaseOrder.vue";

import {
  xtOrderProjectChangeAuditList,
  xtOrderProjectChangeAudit,
  xtOrderProjectChangeAuditAuditPass,
  xtOrderProjectChangeAuditAuditNotPass,
} from "@/api/xt";

import { approvalOptions } from "../Options";

export default {
  components: {
    MultiTable,
    orderDrawer,
  },
  data() {
    return {
      approvalConfig: approvalOptions, //页面的配置信息（表格和筛选表单）
      apiFn: xtOrderProjectChangeAuditList,

      // 项目变更弹出框
      increaseOrDecreaseOrderDrawer: false,
      increaseOrDecreaseOrderForm: null,

      auditDialog: false, //审批弹出框
      auditForm: {}, //审批表单
      rowItem: "", //当前表格行数据

      spanData: [],
      pos: 0,
      parmas: {},
    };
  },
  methods: {
    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let index = 0; index < arr.length; index++) {
        if (index === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[index].auditId === arr[index - 1].auditId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = index;
          }
        }
      }
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = ["订单编号", "客户名称", "操作"];
      if (obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    // 获取表格数据，生成合并的span数组
    getSpanData(arr) {
      this.spanData = [];
      this.pos = 0;
      this.getSpanId(arr);
      return arr;
    },

    handleCancel() {
      this.increaseOrDecreaseOrderDrawer = false;
      this.increaseOrDecreaseOrderForm = null;
    },

    setupEvents({ type, row }) {
      this.rowItem = row;
      if (type === "audit") {
        // 详情
        xtOrderProjectChangeAudit(row.orderId).then((res) => {
          if (res.code === 200) {
            this.$nextTick(() => {
              this.increaseOrDecreaseOrderForm = res.data;
              this.increaseOrDecreaseOrderDrawer = true;
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    // 审批
    handleAudit() {
      this.auditDialog = true;
    },
    // 审批回调
    auditCallBack(type) {
      let fn = null;
      let msg = "";
      let sendData = {
        ...this.auditForm,
        auditId: this.rowItem.auditId,
        orderId: this.rowItem.orderId,
      };
      if (type === "pass") {
        fn = xtOrderProjectChangeAuditAuditPass;
        msg = "审批通过";
      } else if (type === "noPass") {
        fn = xtOrderProjectChangeAuditAuditNotPass;
        msg = "审批不通过";
      }

      fn(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs.tableRef.getTableData();
          this.handleClose();
          this.increaseOrDecreaseOrderDrawer = false;
          this.increaseOrDecreaseOrderForm = null;
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 关闭审批弹出框
    handleClose() {
      this.auditDialog = false;
      this.$refs.auditRef.resetFields();
    },
    auditFun(type) {
      this.auditCallBack(type);
    },
  },
  created() {
    const { timeType } = this.$route.params;
    console.log({ timeType });
    if (timeType) {
      this.parmas.timeType = timeType;
    }
  },
};
</script>

<style lang='scss' scoped>
.increaseAndDecreaseOrder {
  padding: 20px;
}
</style>