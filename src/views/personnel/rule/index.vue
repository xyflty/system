<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="关键字" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          placeholder="请输入关键字"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          v-hasPermi="['core:promoteRule:query']"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          v-hasPermi="['core:promoteRule:query']"
          @click="resetQuery"
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
          v-hasPermi="['core:promoteRule:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="ruleList"
      @selection-change="handleSelectionChange"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="规则名称" align="center" prop="ruleName">
        <template slot-scope="{ row }">
          <span class="ableClick" @click="handleEdit(row)">{{
            row.ruleName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所含层级" align="center" prop="levelName" />
      <el-table-column label="描述" align="center" prop="note" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleEdit(scope.row)"
            v-hasPermi="['core:promoteRule:edit']"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:promoteRule:remove']"
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

    <!-- 添加或修改层级规则对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="70%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input
            v-model="form.ruleName"
            :maxlength="20"
            placeholder="不能超过20个字"
          />
        </el-form-item>
        <el-form-item label="层级设置" prop="levelName">
          <addRuleLevel :form.sync="form" />
        </el-form-item>

        <el-form-item label="规则描述" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
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
  listPromoteMain,
  delPromoteMain,
  getPromoteMain,
  addPromoteMain,
  updatePromoteMain,
} from "@/api/personnel/rule";
import addRuleLevel from "@/views/personnel/components/addRuleLevel";
import { getToken } from "@/utils/auth";
export default {
  name: "Rule",
  components: { addRuleLevel },
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
      // 总条数
      total: 0,
      // 层级规则表格数据
      ruleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ruleName: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ruleName: [
          {
            required: true,
            message: "规则名称不能为空",
            trigger: "blur",
          },
        ],
        // levelName: [
        //   {
        //     required: true,
        //     message: "层级设置不能为空",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询层级规则列表 */
    getList() {
      this.loading = true;
      listPromoteMain(this.queryParams).then((response) => {
        this.ruleList = response.rows;
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
        ruleName: undefined,
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
      this.title = "添加层级规则";
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getPromoteMain(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改层级规则";
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePromoteMain(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addPromoteMain(this.form)
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
        .confirm('是否确认删除层级规则编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPromoteMain(ids);
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
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
