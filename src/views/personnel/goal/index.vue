<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" label-width="0" prop="targetType">
        <el-select
          v-model="queryParams.targetType"
          :clearable="false"
          @change="handleTypeChange"
        >
          <el-option label="成员目标" :value="1" />
          <el-option label="部门目标" :value="2" />
          <el-option label="公司目标" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="" label-width="0" prop="targetYear">
        <el-date-picker
          :clearable="false"
          v-model="queryParams.targetYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" label-width="0" prop="timeType">
        <el-select
          @input="getList()"
          :clearable="false"
          v-model="queryParams.timeType"
          placeholder="请选择时间类型"
        >
          <el-option
            v-for="item in TimeType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" label-width="0" prop="timeTypeValue">
        <el-date-picker
          v-if="queryParams.timeType == 1"
          v-model="queryParams.timeTypeValue"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
        >
        </el-date-picker>
        <el-select
          v-if="queryParams.timeType == 2"
          clearable
          v-model="queryParams.timeTypeValue"
          placeholder="请选择季度"
        >
          <el-option
            v-for="item in quarterArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- targetQuarter -->
        <el-select
          v-if="queryParams.timeType == 3"
          filterable
          clearable
          remote
          v-model="queryParams.timeTypeValue"
          placeholder="请选择月份"
        >
          <el-option
            v-for="item in weekArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="userId">
        <el-select
          v-model="queryParams.userId"
          filterable
          clearable
          placeholder="跟进人员"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="deptId">
        <div style="width: 250px">
          <treeselect
            v-model="queryParams.deptId"
            :multiple="false"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          v-hasPermi="['core:target:list']"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(false, false)"
          v-hasPermi="['core:target:add']"
          >新增</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(false, 2)"
          v-hasPermi="['core:target:add']"
          >批量新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['core:target:import']"
          >导入</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table
      :span-method="objectSpanMethod"
      :data="goalList"
      style="width: 100%"
    >
      <el-table-column prop="dataName" label="所属部门"> </el-table-column>
      <el-table-column prop="targetYear" label="目标财年"> </el-table-column>

      <el-table-column
        prop="timeTypeValue"
        :label="
          queryParams.timeType == 1
            ? '目标年份'
            : queryParams.timeType == 2
            ? '目标季度'
            : '目标月份'
        "
      >
        <template slot-scope="scope">
          {{
            scope.row.timeType == 1
              ? scope.row.timeTypeValue + "年"
              : scope.row.timeType == 2
              ? "第" + scope.row.timeTypeValue + "季度"
              : scope.row.timeTypeValue + "月"
          }}
        </template>
      </el-table-column>

      <el-table-column label="成交金额">
        <el-table-column prop="priceTarget" label="目标"> </el-table-column>
        <el-table-column prop="priceResult" label="结果"> </el-table-column>
        <el-table-column prop="priceRate" label="完成率">
          <template slot-scope="scope"> {{ scope.row.priceRate }}% </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="新增线索数量">
        <el-table-column prop="clueTarget" label="目标"> </el-table-column>
        <el-table-column prop="clueResult" label="结果"> </el-table-column>
        <el-table-column prop="clueRate" label="完成率">
          <template slot-scope="scope"> {{ scope.row.clueRate }}% </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="orderCategory" label="订单类型">
        <template slot-scope="scope">
          {{
            scope.row.orderCategory == 1
              ? "综合订单"
              : scope.row.orderCategory == 2
              ? "普通订单"
              : "特殊订单"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="orderCount" label="订单数量"> </el-table-column>
      <el-table-column label="资质项目数量">
        <el-table-column prop="qualificationTarget" label="目标">
        </el-table-column>
        <el-table-column prop="qualificationResult" label="结果">
        </el-table-column>
        <el-table-column prop="qualificationRate" label="完成率">
          <template slot-scope="scope">
            {{ scope.row.qualificationRate }}%
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="安证项目数量">
        <el-table-column prop="safetyTarget" label="目标"> </el-table-column>
        <el-table-column prop="safetyResult" label="结果"> </el-table-column>
        <el-table-column prop="safetyRate" label="完成率">
          <template slot-scope="scope"> {{ scope.row.safetyRate }}% </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="劳务项目数量">
        <el-table-column prop="serviceTarget" label="目标"> </el-table-column>
        <el-table-column prop="serviceResult" label="结果"> </el-table-column>
        <el-table-column prop="serviceRate" label="完成率">
          <template slot-scope="scope"> {{ scope.row.serviceRate }}% </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="成交项目数量">
        <el-table-column prop="projectTarget" label="目标"> </el-table-column>
        <el-table-column prop="projectResult" label="结果"> </el-table-column>
        <el-table-column prop="projectRate" label="完成率">
          <template slot-scope="scope"> {{ scope.row.projectRate }}% </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center">
            <el-button @click="handleAdd(scope.row.idID, false)" type="text"
              >修改</el-button
            >
            <el-button @click="handleDelete(scope.row)" type="text"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改目标记录对话框 -->
    <addGoal
      :targetType="targetType"
      :weekArr="weekArr"
      :quarterArr="quarterArr"
      :show.sync="show"
      :addGoalID="addGoalID"
      @submit="getList"
    />

    <!-- 业绩目标导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addGoal from "@/views/personnel/components/addGoal.vue";
import { mapState } from "vuex";
import {
  list,
  getInfo,
  NewDel,
  add,
  update,
  importTemplate,
  NewList,
  NewAdd,
} from "@/api/personnel/goal";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Goal",
  components: { addGoal, Treeselect },
  data() {
    return {
      // 批量新增
      targetType: false,
      // 时间类型
      TimeType: [
        {
          value: "1",
          label: "年份",
        },
        {
          value: "2",
          label: "季度",
        },
        {
          value: "3",
          label: "月份",
        },
      ],
      // 新增id
      addGoalID: false,
      // 季度
      quarterArr: [
        {
          value: "1",
          label: "第一季度",
        },
        {
          value: "2",
          label: "第二季度",
        },
        {
          value: "3",
          label: "第三季度",
        },
        {
          value: "4",
          label: "第四季度",
        },
      ],
      // 周
      weekArr: [
        {
          value: "1",
          label: "1月",
        },
        {
          value: "2",
          label: "2月",
        },
        {
          value: "3",
          label: "3月",
        },
        {
          value: "4",
          label: "4月",
        },
        {
          value: "5",
          label: "5月",
        },
        {
          value: "6",
          label: "6月",
        },
        {
          value: "7",
          label: "7月",
        },
        {
          value: "8",
          label: "8月",
        },
        {
          value: "9",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      userList: [],
      deptOptions: [],
      show: false,
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 目标记录表格数据
      goalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        targetType: 1,
        targetYear: "2023",
        timeType: "1",
        userId: undefined,
        targetMonth: undefined,
        targetQuarter: undefined,
        deptId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 项目导入参数
      upload: {
        // 是否显示弹出层（项目导入）
        open: false,
        // 弹出层标题（项目导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的项目数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/core/target/importData",
      },
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= 8 || columnIndex == 23) {
        if (rowIndex % 3 == 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    unitStr(index) {
      return ["万", "亿", "次", "个"][Number(index) - 1];
    },

    /** 查询目标记录列表 */
    getList() {
      console.log(this.queryParams);
      this.loading = true;
      NewList(this.queryParams).then((response) => {
        this.goalList = [];
        response.rows.forEach((element) => {
          if (element.targetSubList.length) {
            element.targetSubList.forEach((item) => {
              this.goalList.push({ ...element, ...item, idID: element.id });
            });
          } else {
            this.goalList.push(
              { ...element, idID: element.id },
              { ...element },
              { ...element }
            );
          }
        });
        this.total = response.total;
        this.loading = false;

        // this.goalList.forEach((item) => {
        //   for (const key in item) {
        //     if (
        //       item[key] &&
        //       typeof item[key] == "string" &&
        //       item[key].indexOf(".00") != -1
        //     ) {
        //       item[key] = Number(item[key]);
        //     }
        //   }
        // });
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        targetType: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.idID);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(id, targetType) {
      // this.reset();
      // this.open = true;
      // this.title = "添加业绩目标";
      this.targetType = targetType;
      this.show = true;
      this.addGoalID = id;
      // this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.show = true;
        // this.open = true;
        // this.title = "修改业绩目标";
      });
    },

    handleTypeChange(e) {
      console.log(e);
      this.getList();
    },
    handleConvert(form) {
      this.$router.push({ path: "demand/add", query: { type: 2, form: form } });
    },
    //置顶按钮
    handleSetTop(row) {
      this.reset();
      const id = row.id || this.ids;
      let queryObj = {
        id: id,
      };
      setTop(queryObj).then((response) => {
        if (row.isTop) {
          this.$modal.msgSuccess("取消置顶成功");
        } else {
          this.$modal.msgSuccess("置顶成功");
        }
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            update(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            NewAdd(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.idID || this.ids;
      this.$modal
        .confirm('是否确认删除目标记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return NewDel(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/goal/export",
        {
          ...this.queryParams,
        },
        `goal_${new Date().getTime()}.xlsx`
      );
    },
    /** 跟进按钮  */
    handleFollowUp(row) {
      this.followUpOpen = true;
      this.followUpFormTitle = "新建跟进";
      this.followUpForm.status = row.goalStatus;
      this.followUpForm.companyName = row.companyName;
      this.followUpForm.contactPerson = row.contactName;
      this.followUpForm.followPerson = row.userName;
      this.followUpForm.customerId = row.customerId;
      this.followUpForm.followedId = row.id;
    },
    submitFollowUpForm() {
      this.$refs["followUpForm"].validate((valid) => {
        if (valid) {
          followUp(this.followUpForm).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.followUpOpen = false;
            this.followUpForm = {};
          });
        }
      });
    },
    followUpFormCancel() {
      this.followUpOpen = false;
      this.followUpForm = {};
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "业绩目标导入";
      this.upload.open = true;
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
        link.download = new Date().getTime() + "业绩目标导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
  },
};
</script>
<style scoped>
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
