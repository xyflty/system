<template>
  <div class="app-container payslip">
    <!-- 筛选表单 -->
    <div class="queryForm">
      <el-form ref="queryFormRef" inline :model="queryForm" size="mini">
        <el-form-item label="主体" prop="subjectDept">
          <el-select
            filterable
            v-model="queryForm.subjectDept"
            placeholder="请选择主体"
          >
            <el-option
              v-for="option in commonData.subjectDept"
              :key="option.value"
              v-bind="option"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发薪月份" prop="countMonth">
          <el-date-picker
            v-model="queryForm.countMonth"
            type="month"
            value-format="yyyy年M月"
            placeholder="请选择发薪月份"
            :picker-options="disableDatesOption"
          >
          </el-date-picker>
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
            size="mini"
            type="primary"
            icon="el-icon-upload2"
            plain
            @click="handleImport"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-upload2"
            plain
            @click="handleSend"
            >发送微信通知</el-button
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(item, index) in options">
        <el-table-column
          :key="index"
          :label="item.label"
          :prop="item.prop"
          show-overflow-tooltip
          align="center"
          v-bind="item.attrs"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row[item.prop] !== null ? scope.row[item.prop] : "--"
            }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleViews(scope.row)"
            >详情</el-button
          >
          <!-- <el-button type="text" size="small" @click="handleRemove(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
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

    <!-- 线索导入对话框 -->
    <el-dialog
      title="工资条导入"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--发送微信通知  -->
    <el-dialog
      title="发送微信通知"
      :visible.sync="sendVisible"
      width="30%"
      append-to-body
    >
      <el-form :model="sendForm" class="sendForm">
        <el-form-item prop="countMonth">
          <p>
            <span>是否确认发送发薪月份为</span>

            <el-date-picker
              v-model="sendForm.countMonth"
              type="month"
              value-format="yyyy年M月"
              :picker-options="disableDatesOption"
              prefix-icon="clearIcon"
              :clearable="false"
              placeholder="请选择发薪月份"
            >
            </el-date-picker>
            <span>的工资条通知</span>
          </p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendSubmit" :loading="sendLoading"
          >确 定</el-button
        >
        <el-button @click="sendVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { importTemplate } from "@/api/core/clue";
// 工资条列表数据接口
import {
  zwPayrollOuterLayerList,
  zwPayrollSendMessage,
} from "@/api/content/payslip.js";
import { getToken } from "@/utils/auth";

import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      options: [
        {
          label: "主体",
          prop: "subjectDept",
        },
        {
          label: "发薪月份",
          prop: "countMonth",
        },
        {
          label: "发送时间",
          prop: "sendTime",
        },
        {
          label: "应通知人员",
          prop: "userNumber",
        },
        {
          label: "已通知人员",
          prop: "sendCount",
        },
        {
          label: "确认人数",
          prop: "confirmCount",
        },
      ],
      lastMonth: "",
      queryForm: {},
      selectData: [], //表格选中的数据
      pages: {
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50, 100],
      },
      total: 400, //总页数

      // 工资条导入参数
      upload: {
        // 是否显示弹出层（项目导入）
        open: false,

        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的项目数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/zw/payroll/importData",
      },

      sendVisible: false,
      sendForm: {},
      disableDatesOption: {},
      sendLoading: false,
    };
  },
  methods: {
    /**
     * 导入start
     */
    /** 导入按钮操作 */
    handleImport() {
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + "线索导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /**
     * 导入end
     */
    /**
     * 发送微信信息 start
     */
    disabledDate(date, month) {
      return date.getTime() > new Date(month);
    },
    // 格式化时间 年月
    formatDateYearMonth(cellValue) {
      if (cellValue == null || cellValue == "") return "";
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      return `${year}年${month}月`;
    },
    // 设置延迟一个月时间
    dealTime() {
      let dateTime = new Date();

      dateTime = dateTime.setMonth(dateTime.getMonth() - 1);
      console.log(dateTime);

      return dateTime;
    },
    // 获取上个月
    sendLastMonth() {
      let lastMonth = this.dealTime();
      this.lastMonth = this.formatDateYearMonth(lastMonth);

      this.disableDatesOption = {
        disabledDate: (date) => this.disabledDate(date, lastMonth),
      };
      this.sendForm = {
        countMonth: this.formatDateYearMonth(lastMonth),
      };
      this.queryForm = {
        countMonth: this.formatDateYearMonth(lastMonth),
      };
    },
    // 发送微信信息
    handleSend() {
      this.sendVisible = true;
    },
    async sendSubmit() {
      try {
        this.sendLoading = true;
        const { countMonth } = this.sendForm;

        let sendData = {
          countMonth: countMonth,
          subjectDeptList: this.selectData,
        };

        const res = await zwPayrollSendMessage(sendData);
        if (res.code === 200) {
          this.getList();
          this.$message.success("发送成功");
        }
      } finally {
        this.sendVisible = false;
        this.sendLoading = false;
      }
    },

    /**
     * 发送微信信息 end
     */

    // 查看主体里面的详情
    handleViews(row) {
      console.log(row);
      this.$router.push({
        path: "/content/payslip",
        query: { subjectDept: row.subjectDept, countMonth: row.countMonth },
      });
    },
    // 删除
    handleRemove(row) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleSelectionChange(list) {
      this.selectData = list.map((item) => item.subjectDept);
    },
    // 查询
    handleQuery() {
      this.pages.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.pages.pageNum = 1;
      this.$refs.queryFormRef.resetFields();
      this.queryForm = {
        countMonth: this.lastMonth,
      };
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

    // 获取表格数据
    async getList() {
      this.loading = true;
      let sendParams = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        ...this.queryForm,
      };
      try {
        const res = await zwPayrollOuterLayerList(sendParams);

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
    this.sendLastMonth();
    this.getList();
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
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