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
      :getSpanData="getSpanData"
      :span-method="handleObjectSpanMethod"
      @setupEvents="setupEvents"
      @SelectionChange="SelectionChange"
    >
      <template #actions>
        <el-button
          type="primary"
          :disabled="single"
          @click="handleActions('defer')"
          >暂缓工单</el-button
        >
        <el-button
          v-if="isShowBack"
          type="primary"
          :disabled="single"
          @click="handleActions('back')"
          >退回工单</el-button
        >
        <el-button
          v-if="!isShowBack"
          type="primary"
          :disabled="single"
          @click="handleActions('cancel')"
          >取消工单</el-button
        >
      </template>
    </MultiTable>

    <!-- 提交下单审批 -->
    <el-dialog
      title="提交协同下单审批"
      :visible.sync="approveDialog"
      width="40%"
      @close="approveConcel('approveRef')"
    >
      <el-form
        ref="approveRef"
        :model="approveForm"
        :rules="approveRules"
        labelWidth="100px"
      >
        <el-form-item
          v-for="(domain, index) in approveForm.auditUserIds"
          :label="'审批人' + Number(+index + 1)"
          :key="domain.key"
          :prop="'auditUserIds.' + index + '.id'"
          :rules="{
            required: true,
            message: '审批人不能为空',
            trigger: 'blur',
          }"
        >
          <el-select v-model="domain.id" style="width: 85%">
            <el-option
              v-for="item in commonData.userList"
              :key="item.value"
              v-bind="item"
              :disabled="disabledChoose(item)"
            ></el-option> </el-select
          ><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>

        <!-- <el-form-item label="提醒谁看" prop="toUserIds">
          <el-select
            v-model="approveForm.toUserIds"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="item in commonData.userList"
              :key="item.value"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注信息">
          <el-input
            type="textarea"
            v-model="approveForm.remark"
            placeholder="请填写备注信息"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="approveConcel('approveRef')">取 消</el-button>
        <el-button type="primary" @click="approveConfirm('approveRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import {
  xtOrderJobManageList,
  xtOrderJobManageSubmitAudit,
  xtOrderJobManageExitOrder,
} from "@/api/xt/jobManagement";
import { xtProjectType } from "@/api/workOrderProcessing/qualification";

// 格式化表格数据方法
import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";

import { mapState } from "vuex";
export default {
  components: {
    MultiTable,
  },

  data() {
    return {
      apiFn: xtOrderJobManageList,
      tableOptions: [],
      searchOptions: [],
      selectTableData: [],
      visible: false,
      projectType: [], //项目类型
      approveDialog: false, //提交审批信息

      mode: "",
      single: true,
      approveForm: {
        auditUserIds: [{ id: "" }],
        orderId: "",
        remark: "",
      },
      approveRules: {},

      spanData: [],
      pos: 0,
      isShowBack: false, //是否显示未退回工单
    };
  },

  mounted() {
    this.initOptions();
    this.getProjectType();
  },

  methods: {
    // 初始化表格配置信息
    initOptions() {
      this.tableOptions = [
        {
          label: "客户名称",
          prop: "companyName",
          width: "160px",
          sortable: true,
          fixed: true,
        },
        {
          label: "工单编号",
          prop: "orderJobCode",
          sortable: true,
          width: "160px",
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
          label: "订单发起人",
          prop: "orderInitiator",
          width: "250px",
          sortable: true,
        },
        {
          label: "工单发起人",
          prop: "orderJobInitiator",
          width: "250px",
          sortable: true,
        },
        {
          label: "工单提交时间",
          prop: "orderJobSubmitTime",
          width: "250px",
          sortable: true,
        },
        {
          label: "承诺完成时间",
          prop: "promiseTime",
          width: "250px",
          sortable: true,
        },
        {
          label: "工单状态",
          prop: "orderJobStatus",
          width: "120px",
          sortable: true,
          isHtml: (row, column, value) => {
            let color = getOrderJobColor(this.commonData.orderJobStatus, value);
            return `<div class="circle-container">
              <span class="circle-status" style="background:${color}; box-shadow: 0 0 5px ${color};"></span>
              <span>${formatterCallback(
                this.commonData.orderJobStatus,
                value
              )}</span>
            </div>`;
          },
        },
        {
          label: "工单作业节点",
          prop: "rootNode",
          width: "150px",
          sortable: true,
        },
        {
          label: "工单节点动态",
          prop: "childNode",
          width: "150px",
          sortable: true,
        },
        {
          label: "超时预警",
          prop: "warnTypeString",
          isHtml: (row, column, value) => {
            return htmlCallback(value);
          },
          width: "200px",
          sortable: true,
        },
        {
          label: "紧急程度",
          prop: "emergencyStatus",
          width: "150px",
          sortable: true,
          formatter: (row, column, value) => {
            return formatterCallback(this.commonData.emergencyStatus, value);
          },
        }, //1
        {
          label: "服务顾问（制）",
          prop: "makeUserName",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "服务顾问（审）",
          prop: "auditUserName",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "财务顾问",
          prop: "financeAdvisor",
          width: "150px",
          sortable: true,
        }, //1
        {
          label: "订单编号",
          prop: "orderCode",
          width: "160px",
        },

        {
          label: "操作",
          action: true,
          fixed: "right",
          width: "150px",
          btns: [
            {
              id: "detail",
              type: "text",
              text: "详情",
              icon: "el-icon-edit",
            },
          ],
        },
      ];
      this.searchOptions = [
        {
          type: "input",
          prop: "searchValue",
          placeholder: "搜索关键词",
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "projectType",
          placeholder: "项目类型",
          children: [],
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "orderJobStatus",
          placeholder: "工单状态",
          children: this.commonData.orderJobStatus,
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          prop: "emergencyStatus",
          placeholder: "紧急程度",
          children: this.commonData.emergencyStatus,
          attrs: {
            clearable: true,
          },
        },
      ];
    },
    // 表格当前行操作
    setupEvents({ type, row }) {
      this.$router.push({ name: "JobManagementDetail", query: { id: row.id } });
    },
    // 多选
    SelectionChange(list) {
      // if (!list.length) return this.$message.error("请选择需要操作的表格数据");
      this.selectTableData = list;

      this.single = list.length !== 1;
    },
    async getOrderJobManageExitOrder(id) {
      let sendData = {
        id: id,
      };
      const res = await xtOrderJobManageExitOrder(sendData);
      console.log(res);
      if (res.code === 200) {
        if (res.data.length) {
          let auditUserIds = [];
          res.data.forEach((item) => {
            auditUserIds.push({
              id: item,
            });
          });
          this.approveForm.auditUserIds = auditUserIds;
        }
        this.approveDialog = true;
      } else {
        this.$message.error(res.msg);
      }
    },
    handleActions(type) {
      this.getOrderJobManageExitOrder(this.selectTableData[0].id);

      this.mode = type;
      this.approveForm.remark = this.selectTableData[0].remark;
    },
    approveConcel(formName) {
      this.approveDialog = false;
      this.approveForm = {
        auditUserIds: [{ id: "" }],
        orderId: "",
      };
      this.$refs[formName].resetFields();
    },
    approveConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let ids = this.selectTableData.map((item) => item.id);
          let auditUserIds = this.approveForm.auditUserIds.map(
            (item) => item.id
          );

          console.log(this.mode);
          let sendData = {
            orderJobIds: ids,
            auditUserIds: auditUserIds,
            orderJobAuditRemark: this.approveForm.remark,
            // toUserIds: this.approveForm.toUserIds,
          };

          if (this.mode === "defer") {
            sendData.orderJobAuditType = 2;
          } else if (this.mode === "cancel") {
            sendData.orderJobAuditType = 1;
          } else if (this.mode === "back") {
            sendData.orderJobAuditType = 3;
          }

          xtOrderJobManageSubmitAudit(sendData).then((res) => {
            if (res.code === 200) {
              this.$refs.tableRef.getTableData();
              this.approveConcel(formName);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请填写必填参数");
        }
      });
    },

    addDomain() {
      this.approveForm.auditUserIds.push({
        value: "",
        key: Date.now(),
      });
    },
    removeDomain(item) {
      var index = this.approveForm.auditUserIds.indexOf(item);
      if (index !== -1) {
        this.approveForm.auditUserIds.splice(index, 1);
      }
    },

    // 获取项目类型
    getProjectType() {
      xtProjectType().then((res) => {
        let arr = res.map((item) => {
          return {
            label: item,
            value: item,
          };
        });

        this.projectType = arr;

        let row = this.searchOptions.find(
          (item) => item.prop === "projectType"
        );
        row.children = this.projectType;
      });
    },

    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[i].orderId === arr[i - 1].orderId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 计算需要合并的单元格
    getSpanData(data, res) {
      this.spanData = [];
      this.pos = 0;

      this.isShowBack = res.param;

      this.getSpanId(data);
      return data;
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = ["订单编号", "订单类型", "订单发起人", "工单发起人", "操作"];

      if (obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    disabledChoose() {
      return (item) => {
        let arr = this.approveForm.auditUserIds.map((item) => item.id);

        return arr.includes(item.value);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.workOrderApproval-warp {
  padding: 20px 10px;
}
</style>
