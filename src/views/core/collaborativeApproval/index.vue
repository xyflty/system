<template>
  <div class="collaborativeApproval-warp">
    <MultiTable
      ref="tableRef"
      :api="apiFn"
      :parmas="parmas"
      border
      
      isSelection
      isSearchForm
      align="center"
      :Options="tableOptions"
      :searchOptions="searchOptions"
      :span-method="handleObjectSpanMethod"
      :getSpanData="getSpanData"
      isPagination
       :row-class-name="tableRowClassName"
      @SelectionChange="SelectionChange"

    >
      <!-- <template #actions>
        <el-button type="primary" @click="handleActions('audit')"
          >审批</el-button
        >
        <el-button type="primary" @click="handleActions('revocation')"
          >撤销</el-button
        >
      </template> -->

      <template #total="{ scope }">
        <span>
          {{ scope.unitPrice * scope.quantity }}
        </span>
      </template>
      <template #operation="{ scope }">
        <el-button
          type="text"
          @click="setupEvents('detail', scope.row)"
          v-hasPermi="['xt:orderApprove:detail']"
          >详情</el-button
        >

        <el-button
          type="text"
          v-show="scope.row.showAuditButtonFlag"
          :disabled="scope.row.auditStatus != 1"
          @click="setupEvents('approval', scope.row)"
          v-hasPermi="['xt:orderApprove:audit']"
          >审批</el-button
        >
        <el-button
          type="text"
          v-show="scope.row.showWithdrawButtonFlag"
          @click="handleRevocation(scope.row)"
          v-hasPermi="['xt:orderApprove:audit']"
          >撤销</el-button
        >
      </template>
      <!-- <template #auditResult="{ scope }">
        <div>
          <span>{{ scope.auditResult }}</span>
        </div>
      </template> -->
    </MultiTable>
    <!--  -->
    <!-- 审批弹出框 -->
    <ApproveModel
      :visible.sync="visible"
      :form="approveForm"
      @confirm="handleConfirm"
      @cancel="approveCancel"
      @approveFail="approveFail"
      :mode="mode"
      type="crm"
    ></ApproveModel>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import ApproveModel from "@/views/components/ApproveModel";
import {
  synergyOrderAuditList,
  xtSynergyOrderAudit,
  projectCategoryAllZwAndXtList,
} from "@/api/core/workOrderApproval";

import { tableSpan } from "@/mixins/tableSpan";

// 格式化表格数据
import { formatterCallback } from "@/utils/common";
import { mapState } from "vuex";
export default {
  components: {
    MultiTable,
    ApproveModel,
  },
  mixins: [tableSpan],
  data() {
    return {
      apiFn: synergyOrderAuditList,
      detailId: "",
      parmas: {
        auditStatus: 1,
      },
      searchOptions: [],
      tableOptions: [
        {
          label: "订单编号",
          prop: "orderCode",
          sortable: true,
          width: "160px",
          fixed: true,
        },
        {
          label: "订单类型",
          prop: "orderType",
          formatter: (row, column, val) => {
            return formatterCallback(this.commonData.xtOrderType, val);
          },
          width: "120px",
          sortable: true,
        },
        {
          label: "客户名称",
          prop: "companyName",
          width: "220px",
          sortable: true,
        },
        {
          label: "项目类别",
          prop: "categoryName",
          width: "150px",
          sortable: true,
        },
        {
          label: "项目类型",
          prop: "projectType",
          width: "150px",
          sortable: true,
        },
        {
          label: "项目产品名称",
          prop: "projectName",
          width: "250px",
          sortable: true,
        },
        {
          label: "单价",
          prop: "unitPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "数量",
          prop: "quantity",
          width: "120px",
          sortable: true,
        },
        {
          label: "总价",
          slotName: "total",
          width: "120px",
          sortable: true,
        },
        {
          label: "项目总价",
          prop: "price",
          width: "120px",
          sortable: true,
        },
        {
          label: "订单发起人",
          prop: "orderLaunchUserName",
          width: "120px",
          sortable: true,
        },
        {
          label: "订单审批发起时间",
          prop: "createTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "订单审批状态",
          prop: "auditResult",
          width: "230px",
          sortable: true,
        },
        {
          label: "订单审批时间",
          prop: "updateTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "紧急情况",
          prop: "emergencyStatus",
          width: "150px",
          sortable: true,
          formatter: (row, column, val) => {
            return formatterCallback(this.commonData.emergencyStatus, val);
          },
        },
        {
          label: "操作",
          action: true,
          fixed: "right",
          width: "150px",
          // btns: [
          //   {
          //     id: "detail",
          //     type: "text",
          //     text: "详情",
          //     hasPermi: "",
          //     icon: "el-icon-edit",
          //   },
          //   {
          //     id: "approval",
          //     type: "text",
          //     text: "审批",
          //     hasPermi: "",
          //   },
          // ],
        },
      ],
      // 选中的表格数据
      selectData: [],

      visible: false,
      approveForm: {},
      mode: "",
      auditType: "pass",
      projectCategory: [],
    };
  },

  mounted() {
    this.getProjectCategory();
    this.initOption();
  },

  methods: {
    initOption() {
      this.searchOptions = [
        {
          type: "input",
          prop: "searchValue",
          placeholder: "搜索关键字",
          attrs: {
            clearable: true,
          },
        },
        {
          type: "treeselect",
          prop: "projectCategoryId",
          placeholder: "项目类别",
          options: [],
          attrs: {
            style: "width:250px",
            placeholder: "请选择项目类别",
            normalizer: this.tenantIdnormalizer,
          },
        },
        {
          type: "select",
          prop: "auditStatus",
          value: 1,
          children: [
            {
              label: "待审批",
              value: 1,
            },
            {
              label: "通过",
              value: 2,
            },
            {
              label: "驳回",
              value: 3,
            },
            {
              label: "撤回",
              value: 4,
            },
          ],
          placeholder: "订单审批状态",
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "emergencyStatus",
          placeholder: "紧急情况",
          children: this.commonData.emergencyStatus,
          attrs: {
            clearable: true,
          },
        },
      ];
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = [
        "订单编号",
        "订单类型",
        "客户名称",
        "项目总价",
        "订单发起人",
        "订单审批发起时间",
        "订单审批状态",
        "订单审批时间",
        "操作",
      ];

      if (obj.includes(column.label) || column.type === "selection") {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    // 表格当前行操作
    setupEvents(type, row) {
      this.detailId = row.auditDetailId;
      if (type === "approval") {
        // 审批
        this.visible = true;
        this.mode = "audit";
      } else if (type === "detail") {
        // 详情
        this.$router.push({
          path: "approvalDetail",
          query: { id: row.orderId, auditDetailId: row.auditDetailId },
        });
      }
    },
    // 表格批量操作
    handleActions(type) {
      this.detailId = ""; //重置当前选中行id
      if (!this.selectData.length) return this.$message.error("请选择表格数据");
      if (type === "audit") {
        this.mode = "audit";
        this.visible = true;
      } else if (type === "revocation") {
        // 撤回
        this.auditType = "revocation";
        this.revocationCallback();
      }
    },
    handleRevocation(row) {
      this.detailId = row.auditDetailId;
      this.auditType = "revocation";
      this.revocationCallback();
    },
    revocationCallback() {
      this.$confirm("此操作将执行撤回操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.synergyOrderAudit();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    // 选择表格数据
    SelectionChange(list) {
      this.selectData = list;
    },
    // 审批取消操作
    approveCancel(form) {
      this.visible = false;
      form.resetFields();
    },
    // 驳回操作
    approveFail(form, model) {
      this.auditType = "reject"; //审批驳回
      this.synergyOrderAudit(this.approveForm, form);
    },
    // 审批通过
    handleConfirm({ form, model }) {
      this.auditType = "pass"; //审批通过

      this.synergyOrderAudit(model, form);
    },
    // 判断当前是审批操作还是撤销操作等
    isAudit(key) {
      // "审批状态 1待审批 2通过 3驳回 4撤回 10已作废"
      let str = 1;
      let msg = "";
      switch (key) {
        case "pass":
          str = 2;
          msg = "审批已通过";
          break;
        case "reject":
          str = 3;
          msg = "审批已驳回";
          break;
        case "revocation":
          str = 4;
          msg = "审批已撤回";
          break;
      }
      return { auditstatus: str, msg };
    },
    // 协同下单审批
    synergyOrderAudit(data, id, formRef) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let { auditstatus, msg } = this.isAudit(this.auditType);
      let ids = "";
      if (this.detailId) {
        ids = this.detailId;
      } else {
        ids = this.selectData.map((item) => item.id).join(",");
      }

      let sendData = {
        ...data,
        auditDetailId: ids,
        auditStatus: auditstatus,
      };

      xtSynergyOrderAudit(sendData)
        .then((res) => {
          loading.close();
          if (res.code === 200) {
            this.visible = false;
            if (formRef) {
              formRef.resetFields();
            }
            this.$refs.tableRef.getTableData();
            this.$message.success(msg);
          } else {
            loading.close();
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          loading.close();
        });
    },
    getProjectCategory() {
      projectCategoryAllZwAndXtList().then((res) => {
        this.projectCategory = this.handleTree(res.data);
        let row = this.searchOptions.find(
          (item) => item.prop === "projectCategoryId"
        );
        row.options = this.projectCategory;
      });
    },
    tenantIdnormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.categoryName,
        children: node.children,
      };
    },
        // 标记当前表格行变色
    tableRowClassName: function ({ row, rowIndex }) {
      if (row.isOperateUser) {
        return "warm-row";
      }
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.collaborativeApproval-warp {
  padding: 20px;
}
</style>