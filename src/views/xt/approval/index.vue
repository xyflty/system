// 工单审批
<template>
  <div class="workOrderApproval-warp">
    <MultiTable
      ref="tableRef"
      :api="apiFn"
      border
      stripe
      isSelection
      isSearchForm
      align="center"
      :Options="tableOptions"
      :searchOptions="searchOptions"
      isPagination
      @SelectionChange="SelectionChange"
      :row-class-name="tableRowClassName"
    >
      <!-- <template #actions>
        <el-button type="primary" @click="handleApprove">审批</el-button>
      </template> -->
      <template #auditResult="{ scope }">
        <div>
          <span>{{ scope.auditResult }}</span>
          <span
            v-if="scope.auditStatus !== 2"
            v-show="scope.auditOrderJobLaunchFlag"
            v-hasPermi="['xt:orderJobAudit:quash']"
            style="color: #0079fe; cursor: pointer"
            @click="handleRevocation(scope)"
            >撤销</span
          >
        </div>
      </template>
      <template #operation="{ scope }">
        <el-button
          v-hasPermi="['xt:orderJobAudit:info']"
          type="text"
          @click="setupEvents('detail', scope.row)"
          >详情</el-button
        >
        <el-button
          type="text"
          v-hasPermi="['xt:orderJobAudit:audit']"
          v-show="scope.row.auditFlag"
          :disabled="scope.row.auditStatus === 2"
          @click="setupEvents('approval', scope.row)"
          >审批</el-button
        >
      </template>
    </MultiTable>

    <!-- 审批弹出框 -->
    <ApproveModel
      ref="approverRef"
      :visible.sync="visible"
      :mode="mode"
      :form="approveForm"
      :isShowAudit="false"
      @confirm="approvePass"
      @approveFail="approveFail"
    >
      <el-form-item label="备注原因：">
        <el-input
          type="textarea"
          :disabled="true"
          v-model="approveForm.orderJobAuditRemark"
          placeholder="请填写备注信息"
        ></el-input>
      </el-form-item>
    </ApproveModel>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import ApproveModel from "@/views/components/ApproveModel";

// 作业端工单列表接口
import {
  xtOrderJobAuditList,
  xtOrderJobAuditAudit,
  xtOrderJobAuditQuash,
} from "@/api/core/workOrderApproval";
// 项目类别
import { xtProjectCategory } from "@/api/workOrderProcessing/qualification";

// 格式化表格数据
import { formatterCallback } from "@/utils/common";
import { mapState } from "vuex";
export default {
  components: {
    MultiTable,
    ApproveModel,
  },

  data() {
    return {
      apiFn: xtOrderJobAuditList,
      //   表格配置信息
      tableOptions: [],
      //   筛选表单
      searchOptions: [],
      //   存储选择表格数据
      selectTable: [],
      //   当前行的id
      rowId: "",
      visible: false,
      mode: "audit",
      approveForm: {},
      projectCategory: [],
      detailId: "",
      auditId: "",
    };
  },

  mounted() {
    this.initOptions();
    this.getProjectCategory();
  },

  methods: {
    // 初始化表格配置信息
    initOptions() {
      this.tableOptions = [
        {
          label: "订单编号",
          prop: "orderCode",
          sortable: true,
          width: "160px",
          fixed: true,
        },
        {
          label: "审批类型",
          prop: "auditOrderJobType",
          sortable: true,
          width: "230px",
          formatter: (row, column, val) => {
            return formatterCallback(this.commonData.auditType, val);
          },
        },
        {
          label: "审批发起时间",
          prop: "auditLaunchTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "审批状态",
          slotName: "auditResult",
          width: "230px",
        },
        {
          label: "审批时间",
          prop: "auditTime",
          width: "150px",
          sortable: true,
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
          prop: "projectCategoryName",
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
          prop: "totalPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "项目总价",
          prop: "projectTotalPrice",
          width: "120px",
          sortable: true,
        },
        {
          label: "订单发起人",
          prop: "orderInitiator",
          width: "120px",
          sortable: true,
        },
        {
          label: "工单发起人",
          prop: "orderJobInitiator",
          width: "120px",
          sortable: true,
        },
        {
          label: "工单发起时间",
          prop: "orderJobLaunchTime",
          width: "150px",
          sortable: true,
        },
        {
          label: "操作",
          action: true,
          fixed: "right",
          width: "150px",
        },
      ];
      this.searchOptions = [
        {
          type: "input",
          prop: "searchValue",
          placeholder: "搜索关键字",
        },
        {
          type: "treeselect",
          prop: "categoryName",
          placeholder: "项目类别",
          options: [],
          attrs: {
            style: "width:250px",
            placeholder: "请选择项目类别",
            normalizer: this.tenantIdnormalizer,
          },
          isSelectLabel: true, //是否选择label值
          dataProp: "projectCategoryName", //数据中label值的prop
        },
        {
          type: "select",
          prop: "orderType",
          placeholder: "订单类型",
          children: this.commonData.xtOrderType,
        },
        {
          type: "date-picker",
          prop: "orderJobLaunchTime",
          placeholder: "工单发起时间",
          attrs: {
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          type: "date-picker",
          prop: "auditLaunchTime",
          placeholder: "审批发起时间",
          attrs: {
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          type: "select",
          prop: "auditStatus",
          placeholder: "审批状态",
          children: this.commonData.auditstatus,
        },
        {
          type: "select",
          prop: "auditOrderJobType",
          placeholder: "审批类型",
          children: this.commonData.auditType,
        },
      ];
    },
    // 表格当前行操作
    setupEvents(type, row) {
      this.auditId = row.auditId;
      if (type === "approval") {
        // 审批
        this.visible = true;
        this.rowId = row.orderJobId;
        this.approveForm.orderJobAuditRemark = row.orderJobAuditRemark;
      } else if (type === "detail") {
        this.$router.push({
          name: "JobApprovalDetail",
          query: {
            id: row.orderJobId,
            auditId: this.auditId,
            rowId: row.id,
            auditOrderNum: row.auditOrderNum,
          },
        });
      }
    },
    // 多选
    SelectionChange(list) {
      this.selectTable = list;
    },
    // 弹出审批弹出框
    handleApprove() {
      if (!this.selectTable.length)
        return this.$message.error("请选择表格数据");
      this.visible = true;
    },
    // 审批接口
    approveCallback(model, form, msg, flag) {
      let sendData = {
        orderJobId: this.rowId,
        auditId: this.auditId,
        ...model,
      };
      if (flag) {
        sendData.orderJobStatus = 8;
      } else {
        sendData.auditStatus = 2;
      }

      xtOrderJobAuditAudit(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs.tableRef.getTableData();
          this.visible = false;
          form.resetFields();
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    approvePass({ form, model }) {
      form.validate((valid) => {
        if (valid) {
          let msg = "审批成功";

          this.approveCallback(model, form, msg);
        } else {
          this.$message.error("请选择必填参数");
        }
      });
    },
    approveFail({ form, model }) {
      form.validate((valid) => {
        if (valid) {
          let msg = "审批不通过";
          this.approveCallback(model, form, msg, true);
        } else {
          this.$message.error("请选择必填参数");
        }
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
    // 项目类别
    getProjectCategory() {
      xtProjectCategory().then((res) => {
        this.projectCategory = this.handleTree(res);

        let row = this.searchOptions.find(
          (item) => item.prop === "categoryName"
        );
        row.options = this.projectCategory;
      });
    },
    handleRevocation(row) {
      this.detailId = row.id;
      this.revocationCallback();
    },
    revocationCallback() {
      this.$confirm("此操作将执行撤回操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let sendData = {
            id: this.detailId,
          };

          xtOrderJobAuditQuash(sendData).then((res) => {
            if (res.code === 200) {
              this.$refs.tableRef.getTableData();
              this.$message.success("已撤回");
              this.detailId = "";
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
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
.workOrderApproval-warp {
  padding: 20px 10px;
}
</style>
