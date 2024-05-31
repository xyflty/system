<template>
  <div class="app-container payslip">
    <!-- 筛选表单 -->
    <div class="queryForm">
      <el-form ref="queryFormRef" inline :model="queryForm" size="mini">
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model="queryForm.userName"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认状态" prop="confirmFlag">
          <el-select
            v-model="queryForm.confirmFlag"
            placeholder="请选择确认状态"
          >
            <el-option label="已确认" :value="true"></el-option>
            <el-option label="未确认" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方式状态" prop="sendFlag">
          <el-select v-model="queryForm.sendFlag" placeholder="请选择方式状态">
            <el-option label="已发送" :value="true"></el-option>
            <el-option label="未发送" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleQuery"
            >查询</el-button
          >
          <el-button size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作区域 -->
    <div class="actions">
      <el-row :gutter="15">
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:user:export']"
            >导出</el-button
          >
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <el-table
      stripe
      border
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      :default-sort="{ prop: 'serialNumber', order: 'ascending' }"
    >
      <template v-for="(item, index) in options">
        <el-table-column
          v-if="item.columns && item.columns.length"
          :label="item.label"
          v-bind="item.attrs"
          :key="index"
        >
          <el-table-column
            v-for="(childItem, childIndex) in item.columns"
            :key="childIndex"
            :label="childItem.label"
            :prop="childItem.prop"
            show-overflow-tooltip
            align="center"
            v-bind="childItem.attrs"
          >
            <template slot-scope="scope">
              <div v-if="childItem.formatter">
                {{
                  childItem.formatter(
                    scope.row,
                    scope.column,
                    scope.row[childItem.prop]
                  )
                }}
              </div>
              <span v-else>{{
                scope.row[childItem.prop] !== null
                  ? scope.row[childItem.prop]
                  : "--"
              }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :prop="item.prop"
          show-overflow-tooltip
          align="center"
          v-bind="item.attrs"
        >
          <template slot-scope="scope">
            <div v-if="item.formatter">
              {{
                item.formatter(scope.row, scope.column, scope.row[item.prop])
              }}
            </div>
            <div v-else>
              <span v-if="item.prop === 'confirmFlag'"
                ><el-tag :type="scope.row.confirmFlag ? 'success' : 'danger'">{{
                  scope.row.confirmFlag ? "已确认" : "未确认"
                }}</el-tag></span
              >
              <span v-else-if="item.prop === 'sendFlag'"
                ><el-tag :type="scope.row.sendFlag ? 'success' : 'danger'">{{
                  scope.row.sendFlag ? "已发送" : "未发送"
                }}</el-tag></span
              >
              <span v-else>{{
                scope.row[item.prop] !== null ? scope.row[item.prop] : "--"
              }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination" v-if="total">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageNum"
        :page-sizes="pages.pageSizes"
        :page-size="pages.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 工资条列表数据接口
import { zwPayrollList } from "@/api/content/payslip.js";

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      options: [
        {
          label: "序号",
          prop: "serialNumber",
          attrs: {
            width: "80px",
            sortable: true,
          },
        },
        {
          label: "确认状态",
          prop: "confirmFlag",

          attrs: {
            width: "100px",
          },
        },
        {
          label: "发送状态",
          prop: "sendFlag",

          attrs: {
            width: "100px",
          },
        },
        {
          label: "主体",
          prop: "subjectDept",
          attrs: {
            width: "210px",
          },
        },
        {
          label: "职位",
          prop: "position",
          attrs: {
            width: "120px",
          },
        },
        {
          label: "手机号码",
          prop: "phoneNumber",
          attrs: {
            width: "160px",
          },
        },
        {
          label: "姓名",
          prop: "userName",
          attrs: {
            width: "100px",
          },
        },
        {
          label: "入职日期",
          prop: "entryDate",
          attrs: {
            width: "180px",
          },
        },
        {
          label: "异动",
          prop: "differentDynamic",
        },
        {
          label: "发薪月份",
          prop: "countMonth",
          attrs: {
            width: "120px",
            sortable: true,
          },
        },
        {
          label: "应发工资",
          attrs: {
            headerAlign: "center",
          },
          columns: [
            {
              label: "基本工资",
              prop: "basicPayroll",
            },
            {
              label: "职务工资",
              prop: "positionPayroll",
            },

            {
              label: "岗位津贴",
              prop: "postAllowance",
            },
            {
              label: "合计",
              prop: "total",
              attrs: {
                width: "120px",
              },
            },
          ],
        },
        {
          label: "出勤情况",
          attrs: {
            headerAlign: "center",
          },
          columns: [
            {
              label: "满勤天数",
              prop: "fullAttendanceDays",
            },
            {
              label: "实际出勤",
              prop: "actualAttendance",
            },

            {
              label: "事假天数",
              prop: "daysOfPersonalLeave",
            },
            {
              label: "病假天数",
              prop: "daysOfSick",
            },
            {
              label: "缺勤天数",
              prop: "daysForLackOfAttendance",
            },
            {
              label: "迟到/早退次数",
              prop: "beLateOrLeaveEarly",
            },
            {
              label: "旷工次数",
              prop: "minerDays",
            },
            {
              label: "漏卡次数",
              prop: "numberOfMissedCards",
            },
            {
              label: "产检假天数",
              prop: "numberOfMaternityLeave",
            },
            {
              label: "年休假",
              prop: "annualLeave",
            },
            {
              label: "其他",
              prop: "other",
            },
            {
              label: "小计",
              prop: "subtotal",
            },
          ],
        },
        {
          label: "提成",
          prop: "commission",
        },
        {
          label: "绩效",
          prop: "performance",
        },
        {
          label: "应发工资合计（个税申报）",
          prop: "totalOfWagesPayable",
        },
        {
          label: "个人应缴社保",
          prop: "individualSocialSecurityPayable",
        },
        {
          label: "个人公积金应缴",
          prop: "personalProvidentFundPayable",
        },
        {
          label: "个人应扣个税",
          prop: "individualIncomeTaxDeduction",
        },
        {
          label: "实发工资",
          prop: "actualSalary",
          attrs: {
            width: "120px",
          },
        },
      ],
      roureParams: {}, //接收传递的参数
      queryForm: {},
      pages: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
      },
      total: 400, //总页数
    };
  },
  methods: {
    // 查询
    handleQuery() {
      this.pages.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.pages.pageNum = 1;

      this.queryForm = {};
      this.getList();
    },
    // 每页显示几条
    handleSizeChange(size) {
      this.pages.pageSize = size;
      this.getList();
    },
    // 切换当前页
    handleCurrentChange(current) {
      this.pages.pageNum = current;
      this.getList();
    },

    /** 导出按钮操作 */
    handleExport() {
      const { countMonth, subjectDept } = this.roureParams;
      this.download(
        "/zw/payroll/export",
        {
          subjectDept,
          countMonth,
          ...this.queryForm,
        },
        `${countMonth}的工资条.xlsx`
      );
    },

    // 获取表格数据
    async getList() {
      this.loading = true;
      const { countMonth, subjectDept } = this.roureParams;
      let sendParams = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        countMonth,
        subjectDept,
        ...this.queryForm,
      };
      try {
        const res = await zwPayrollList(sendParams);

        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.roureParams = this.$route.query;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.payslip {
  .actions {
    padding: 15px 0;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
  }
}
.sendForm {
  p {
    span {
      display: inline-block;
      margin: 0 10px;
    }
  }
}
::v-deep.el-table--scrollable-x {
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 25px;
    height: 17px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 12px;
  }
}
</style>
