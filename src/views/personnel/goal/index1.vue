<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入部门id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月"
        prop="timeValue"
      >
        <el-input
          v-model="queryParams.timeValue"
          placeholder="请输入时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成交金额目标" prop="priceTarget">
        <el-input
          v-model="queryParams.priceTarget"
          placeholder="请输入成交金额目标"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成交金额结果" prop="priceResult">
        <el-input
          v-model="queryParams.priceResult"
          placeholder="请输入成交金额结果"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线索目标" prop="clueTarget">
        <el-input
          v-model="queryParams.clueTarget"
          placeholder="请输入线索目标"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线索结果" prop="clueResult">
        <el-input
          v-model="queryParams.clueResult"
          placeholder="请输入线索结果"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
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
          @click="handleAdd"
          v-hasPermi="['core:targetMain:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['core:targetMain:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['core:targetMain:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['core:targetMain:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="targetMainList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="true" />
      <el-table-column
        label="目标类型 1成员目标 2部门目标 3公司目标"
        align="center"
        prop="targetType"
      />
      <el-table-column
        label="时间类型 1年份 2季度 3月份"
        align="center"
        prop="timeType"
      />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column
        label="时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月"
        align="center"
        prop="timeValue"
      />
      <el-table-column label="成交金额目标" align="center" prop="priceTarget" />
      <el-table-column label="成交金额结果" align="center" prop="priceResult" />
      <el-table-column label="线索目标" align="center" prop="clueTarget" />
      <el-table-column label="线索结果" align="center" prop="clueResult" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:targetMain:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:targetMain:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改业绩目标对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item
          label="时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月"
          prop="timeValue"
        >
          <el-input
            v-model="form.timeValue"
            placeholder="请输入时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月"
          />
        </el-form-item>
        <el-form-item label="成交金额目标" prop="priceTarget">
          <el-input
            v-model="form.priceTarget"
            placeholder="请输入成交金额目标"
          />
        </el-form-item>
        <el-form-item label="成交金额结果" prop="priceResult">
          <el-input
            v-model="form.priceResult"
            placeholder="请输入成交金额结果"
          />
        </el-form-item>
        <el-form-item label="线索目标" prop="clueTarget">
          <el-input v-model="form.clueTarget" placeholder="请输入线索目标" />
        </el-form-item>
        <el-form-item label="线索结果" prop="clueResult">
          <el-input v-model="form.clueResult" placeholder="请输入线索结果" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTargetMain,
  getTargetMain,
  delTargetMain,
  addTargetMain,
  updateTargetMain,
} from "@/api/personnel/targetMain";

export default {
  name: "TargetMain",
  data() {
    return {
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
      // 业绩目标表格数据
      targetMainList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        targetType: undefined,
        timeType: undefined,
        userId: undefined,
        deptId: undefined,
        timeValue: undefined,
        priceTarget: undefined,
        priceResult: undefined,
        clueTarget: undefined,
        clueResult: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
        targetType: [
          {
            required: true,
            message: "目标类型 1成员目标 2部门目标 3公司目标不能为空",
            trigger: "change",
          },
        ],
        timeType: [
          {
            required: true,
            message: "时间类型 1年份 2季度 3月份不能为空",
            trigger: "change",
          },
        ],
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "部门id不能为空", trigger: "blur" },
        ],
        timeValue: [
          {
            required: true,
            message:
              "时间值 根据time_type的值代表不同的时间，time_type为1代表年份，为2代表第几季度，为3代表第几个月不能为空",
            trigger: "blur",
          },
        ],
        priceTarget: [
          { required: true, message: "成交金额目标不能为空", trigger: "blur" },
        ],
        priceResult: [
          { required: true, message: "成交金额结果不能为空", trigger: "blur" },
        ],
        clueTarget: [
          { required: true, message: "线索目标不能为空", trigger: "blur" },
        ],
        clueResult: [
          { required: true, message: "线索结果不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询业绩目标列表 */
    getList() {
      this.loading = true;
      listTargetMain(this.queryParams).then((response) => {
        this.targetMainList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        timeType: undefined,
        userId: undefined,
        deptId: undefined,
        timeValue: undefined,
        priceTarget: undefined,
        priceResult: undefined,
        clueTarget: undefined,
        clueResult: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业绩目标";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getTargetMain(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改业绩目标";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTargetMain(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addTargetMain(this.form)
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
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除业绩目标编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delTargetMain(ids);
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
        "core/targetMain/export",
        {
          ...this.queryParams,
        },
        `targetMain_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
