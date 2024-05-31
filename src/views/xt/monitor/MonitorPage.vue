
<template>
  <div class="app-container">
    <MyForm
      inline
      size="mini"
      :formOptions="searchOptions"
      :form="queryForm"
      @input="handleInput"
      @change="handleChange"
    >
      <template #formAction="{ form, model }">
        <div class="btns">
          <el-button
            class="btn"
            type="primary"
            @click="handleSearch(form, model)"
            >查询</el-button
          >
          <el-button @click="handleReset(form, model)">取消</el-button>
        </div>
      </template>
    </MyForm>
    <MultiTable
      isPagination
      align="center"
      border
      isSelection
      :Options="options"
      :total="pager.total"
      :paginationAttrs="pager"
      :data="tableData"
      @SizeChange="SizeChange"
      @CurrentChange="CurrentChange"
      @SelectionChange="SelectionChange"
    >
      <template #actions>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleImport">
              导入流水号监测</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="mini" @click="handleAdd">
              新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" size="mini" @click="handleDel">
              删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </template>

      <template #view="{ scope }">
        <el-button type="text" size="mini" @click="handleView(scope)">
          详情</el-button
        >
      </template>

      <template #operation="{ scope }">
        <el-button type="text" size="mini" @click="handleEdit(scope.row)">
          修改</el-button
        >
        <el-button
          v-if="scope.row.monitoringStatus === 0"
          type="text"
          size="mini"
          @click="toggleStatus(scope.row, 1)"
        >
          未检测</el-button
        >
        <el-button
          v-else-if="scope.row.monitoringStatus === 1"
          type="text"
          size="mini"
          @click="toggleStatus(scope.row, 2)"
        >
          监测中</el-button
        >
        <el-button v-else type="text" size="mini"> 已结束</el-button>
        <el-button type="text" size="mini" @click="handleDel(scope.row)">
          删除</el-button
        >
      </template>
    </MultiTable>

    <!-- 详情 -->

    <el-dialog
      title="办理环节轨迹详情"
      :visible.sync="detailVisible"
      width="60%"
    >
      <div class="detail-content">
        <div class="descriptions">
          <el-descriptions
            title="办理换机轨迹详情"
            direction="vertical"
            :column="4"
            border
          >
            <el-descriptions-item label="申报流水号">{{
              detailData["processId"]
            }}</el-descriptions-item>
            <el-descriptions-item label="申请人名称">{{
              detailData["applicant"]
            }}</el-descriptions-item>
            <el-descriptions-item label="事项名称">{{
              detailData["processName"]
            }}</el-descriptions-item>
            <el-descriptions-item label="受理日期">{{
              detailData["acceptDate"]
            }}</el-descriptions-item>
            <el-descriptions-item label="申报事项">
              {{ detailData["declareItem"] }}
            </el-descriptions-item>
            <el-descriptions-item label="申报类型">{{
              detailData["declareType"]
            }}</el-descriptions-item>
            <el-descriptions-item label="办理环节最新变更时间">{{
              detailData["nodeUpdateDate"] || "--"
            }}</el-descriptions-item>
            <el-descriptions-item label="办理环节">{{
              detailData["nodeName"]
            }}</el-descriptions-item>
            <el-descriptions-item label="监测开始时间">{{
              detailData["monitoringStartDate"] || "--"
            }}</el-descriptions-item>
            <el-descriptions-item label="监测结束时间">{{
              detailData["monitoringEndDate"] || "--"
            }}</el-descriptions-item>
            <el-descriptions-item label="监测状态">{{
              ["未监测", "监测中", "已结束"][detailData["monitoringStatus"]]
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <MultiTable
          isPagination
          align="center"
          :Options="detailOptions"
          :data="detailData.list"
        >
        </MultiTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog
      :title="`${formType === 'add' ? '新增' : '修改'}申报`"
      :visible.sync="reportDialog"
      width="50%"
      @close="handleCancel('ruleForm')"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="流水号" prop="processId">
          <el-input
            :disabled="formType === 'edit'"
            v-model="ruleForm.processId"
            placeholder="请输入流水号"
          ></el-input>
        </el-form-item>
        <el-form-item label="通知人" prop="noticeIds">
          <el-select
            style="width: 100%"
            v-model="ruleForm.noticeIds"
            filterable
            placeholder="请输入关键字搜索用户"
            remote
            clearable
            multiple
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增导入 -->
    <ImportModel
      title="流水号导入"
      :upload="upload"
      :loading.sync="uploadIng"
      @success="handleSuccess"
      :importTemFn="importTemFn"
    />
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import MyForm from "@/components/MyForm";
import ImportModel from "@/components/ImportModel";

import { formatDate_1 } from "@/utils";
import { getToken } from "@/utils/auth";
import { systemUserListForSelect } from "@/api/system/user";
import {
  monitoringList,
  monitoringAdd,
  monitoringEdit,
  monitoringDetail,
  importTemplate,
  monitoringRemove,
} from "@/api/xt/monitor";

export default {
  components: {
    MyForm,
    MultiTable,
    ImportModel,
  },

  props: {
    pageType: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tableData: [],
      userList: [],
      options: [
        {
          label: "申报流水号",
          prop: "processId",
          width: "250px",
          fixed: true,
        },
        {
          label: "申请人名称",
          prop: "applicant",
          width: "270px",
        },
        {
          label: "事项名称",
          prop: "processName",
          width: "270px",
        },
        {
          label: "受理日期",
          prop: "acceptDate",
          width: "150px",
        },
        {
          label: "申报事项",
          prop: "declareItem",
          width: "230px",
        },
        {
          label: "申报类型",
          prop: "declareType",
          width: "180px",
        },
        {
          label: "最新办理环节",
          prop: "nodeName",
          width: "180px",
        },
        {
          label: "最新办理环节更新时间",
          prop: "nodeUpdateDate",
          width: "270px",
        },
        {
          label: "办理环节详情",
          slotName: "view",
          width: "120px",
        },
        {
          label: "监测开始时间",
          prop: "monitoringStartDate",
          width: "120px",
        },
        {
          label: "监测结束时间",
          prop: "monitoringEndDate",
          width: "120px",
        },
        // {
        //   label: "监测状态",
        //   prop: "monitoringStatus",
        //   width: "100px",
        //   formatter: (row, column, value) => {
        //     return formatterCallback(this.status, value);
        //   },
        // },
        {
          label: "操作",
          action: true,
          width: 180,
          // btns: [
          //   {
          //     id: "end",
          //     text: "结束",
          //     type: "text",
          //   },
          // ],
        },
      ],
      searchOptions: [],
      selectData: [], //表格选中数据

      status: [
        { type: "option", label: "未监测", value: 0 },
        { type: "option", label: "监测中", value: 1 },
        { type: "option", label: "已结束", value: 2 },
      ],

      queryForm: {
        searchValue: null,
        acceptDate: null,
        nodeUpdateDate: null,
        monitoringStartDate: null,
        monitoringEndDate: null,
        monitoringStatus: 1,
        radioValue: null,
      },
      //   分页配置信息
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },

      //   详情弹出框
      detailVisible: false,

      detailOptions: [
        {
          label: "办理环节",
          prop: "nodeName",
        },
        {
          label: "办理环节时间",
          prop: "nodeDate",
        },
      ],
      detailData: {},
      // 新增申报弹出框
      reportDialog: false,
      formType: "add", //表单操作类型
      ruleForm: { processId: "" },
      rules: {
        processId: [
          { required: true, message: "请输入流水号", trigger: "blur" },
        ],
      },

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
        url:
          process.env.VUE_APP_BASE_API +
          "/synergy/monitoring/importData?projectCategory=" +
          this.pageType,
      },
      uploadIng: false,
      importTemFn: importTemplate, //导入模版接口
    };
  },
  methods: {
    setOptions() {
      this.searchOptions = [
        {
          type: "input",
          label: "关键词",
          prop: "searchValue",
          placeholder: "请输入关键词",
        },
        {
          type: "date-picker",
          label: "受理时间",
          prop: "acceptDate",
          attrs: {
            type: "daterange",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            defaultTime: ["00:00:00", "23:59:59"],
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        },
        {
          type: "date-picker",
          label: "办理环节更新时间",
          prop: "nodeUpdateDate",
          attrs: {
            type: "daterange",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            defaultTime: ["00:00:00", "23:59:59"],
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        },

        {
          type: "date-picker",
          label: "监测开始时间",
          prop: "monitoringStartDate",
          placeholder: "监测开始时间",
          attrs: {
            type: "daterange",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            defaultTime: ["00:00:00", "23:59:59"],
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        },
        {
          type: "date-picker",
          label: "监测结束时间",
          prop: "monitoringEndDate",
          placeholder: "监测结束时间",
          attrs: {
            type: "daterange",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            defaultTime: ["00:00:00", "23:59:59"],
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
        },
        {
          type: "select",
          label: "监测状态",
          prop: "monitoringStatus",

          children: this.status,
        },
        {
          type: "radio-group",
          label: "",
          prop: "radioValue",

          children: [
            { type: "radio", label: "昨日更新", value: 1 },
            { type: "radio", label: "近7日更新", value: 2 },
            { type: "radio", label: "近15日更新", value: 3 },
            { type: "radio", label: "近一月更新", value: 4 },
          ],
        },
      ];
    },
    SelectionChange(list) {
      this.selectData = list;
    },
    handleSearch(form, model) {
      this.queryForm = model;
      this.getList();
    },
    handleReset(form, model) {
      this.queryForm = {};
      this.getList();
    },

    SizeChange(size) {
      this.pager.pageSize = size;
      this.pager.pageNum = 1;
      this.getList();
    },
    CurrentChange(current) {
      this.pager.pageNum = current;
      this.getList();
    },
    // 查看详情
    async handleView(row) {
      const res = await monitoringDetail(row.id);
      console.log(res);
      if (res.code === 200) {
        this.detailData = res.data;
        this.detailVisible = true;
      }
    },
    // 修改
    async handleEdit(row) {
      const res = await monitoringDetail(row.id);

      if (res.code === 200) {
        this.ruleForm = {
          id: res.data.id,
          processId: res.data.processId,
          noticeIds: res.data.noticeIds,
        };
        this.formType = "edit";
        this.reportDialog = true;
      } else {
        this.$message.error(res.msg);
      }
    },

    removeCallBack(ids) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await monitoringRemove(ids);
          console.log(res);
          if (res.code === 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleDel(row) {
      console.log(row);
      let ids = "";
      if (row.id) {
        ids = row.id;
      } else {
        if (!this.selectData.length) {
          this.$message.error("请选择表格数据");
          return;
        }
        ids = this.selectData.map((item) => item.id);
      }

      this.removeCallBack(ids);
    },

    getParams() {
      const {
        searchValue,
        acceptDate,
        nodeUpdateDate,
        monitoringStartDate,
        monitoringEndDate,
        monitoringStatus,
      } = this.queryForm;

      const sendData = {
        searchValue,
        projectCategory: this.pageType,

        params: {
          acceptDateStartTime: acceptDate && acceptDate[0],
          acceptDateEndTime: acceptDate && acceptDate[1],
          nodeUpdateDateStartTime: nodeUpdateDate && nodeUpdateDate[0],
          nodeUpdateDateEndTime: nodeUpdateDate && nodeUpdateDate[1],
          monitoringStartDateStartTime:
            monitoringStartDate && monitoringStartDate[0],
          monitoringStartDateEndTime:
            monitoringStartDate && monitoringStartDate[1],
          monitoringEndDateStartTime: monitoringEndDate && monitoringEndDate[0],
          monitoringEndDateEndTime: monitoringEndDate && monitoringEndDate[1],
        },
        monitoringStatus,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
      };

      return sendData;
    },

    async getList() {
      const {
        searchValue,
        acceptDate,
        nodeUpdateDate,
        monitoringStartDate,
        monitoringEndDate,
        monitoringStatus,
      } = this.queryForm;

      const sendData = {
        searchValue,
        projectCategory: this.pageType,

        params: {
          acceptDateStartTime: acceptDate && acceptDate[0],
          acceptDateEndTime: acceptDate && acceptDate[1],
          nodeUpdateDateStartTime: nodeUpdateDate && nodeUpdateDate[0],
          nodeUpdateDateEndTime: nodeUpdateDate && nodeUpdateDate[1],
          monitoringStartDateStartTime:
            monitoringStartDate && monitoringStartDate[0],
          monitoringStartDateEndTime:
            monitoringStartDate && monitoringStartDate[1],
          monitoringEndDateStartTime: monitoringEndDate && monitoringEndDate[0],
          monitoringEndDateEndTime: monitoringEndDate && monitoringEndDate[1],
        },
        monitoringStatus,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
      };
      const res = await monitoringList(sendData);
      if (res.code === 200) {
        this.tableData = res.rows;
        this.pager.total = res.total;
      }
    },

    handleImport() {
      this.upload.open = true;
    },
    // 导入成功回调
    handleSuccess() {
      console.log("成功了");
      this.uploadIng = false;
      this.getList();
    },

    /* 新增操作 start */
    handleAdd() {
      this.formType = "add";
      this.reportDialog = true;
    },
    // 新增添加操作
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const sendData = {
              ...this.ruleForm,
              projectCategory: this.pageType,
            };
            let fn = null;
            let msg = "";
            if (this.formType === "add") {
              // 新增
              fn = monitoringAdd;
              msg = "新增成功";
            } else {
              // 编辑
              fn = monitoringEdit;
              msg = "修改成功";
            }
            const res = await fn(sendData);
            console.log(res);
            if (res.code === 200) {
              this.getList();
              this.handleCancel(formName);
              this.$message.success(msg);
            }
          } catch (error) {
            console.log(error);
            this.$message.error(res.msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增取消操作
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.reportDialog = false;

      this.ruleForm = { processId: "", noticeIds: [] };
    },
    /* 新增操作 end */

    // 表格行操作
    toggleStatus(row, status) {
      const { id } = row;

      const sendData = {
        id: id,
        monitoringStatus: status,
      };
      console.log({ sendData });
      monitoringEdit(sendData).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.getList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 处理日期
    dealDate(val) {
      const end = formatDate_1(new Date()) + " 23:59:59";
      const start = new Date();
      //   记录近几天
      let day = 1;

      switch (val) {
        case 1:
          // 昨天
          day = 1;
          break;
        case 2:
          // 上周
          day = 7;
          break;

        case 3:
          // 上半月
          day = 15;
          break;
        case 4:
          // 上一个月
          day = 30;
          break;

        default:
          break;
      }
      start.setTime(start.getTime() - 3600 * 1000 * 24 * day);

      const newStart = formatDate_1(start) + " 00:00:00";

      return [newStart, end];
    },

    handleInput({ val, row }) {
      console.log(val, row);

      if (row.prop === "radioValue") {
        let date = this.dealDate(val);
        this.queryForm.radioValue = val;
        this.$set(this.queryForm, "nodeUpdateDate", date);
      }
    },
    handleChange({ val, row }) {
      console.log(val, row);
      if (row.prop === "nodeUpdateDate") {
        this.$set(this.queryForm, "radioValue", "");
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      let sendData = this.getParams();
      this.download(
        "/synergy/monitoring/export",
        {
          ...sendData,
          projectCategory: this.pageType,
        },
        `流水号_${new Date().getTime()}.xlsx`
      );
    },
    /** 查询用户列表 */
    getUserList(deptId, e, isFocus = true) {
      systemUserListForSelect({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
        deptId: deptId,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
  },
  mounted() {
    this.setOptions();
    this.getUserList();
    this.getList();
  },
};
</script>

<style lang='scss' scoped>
.descriptions {
  margin-bottom: 15px;
}
</style>