<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="项目分类名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入项目分类名称"
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
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="projectCategoryList"
    >
      <el-table-column
        prop="categoryName"
        label="分类名称"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['synergy:projectCategory:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['synergy:projectCategory:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改协同项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="上级项目分类" prop="parentId">
          <treeselect
            v-model="form.parentId"
            :options="projectCategoryOptions"
            :normalizer="normalizer"
            placeholder="请选择上级项目分类"
          />
        </el-form-item>
        <el-form-item
          label="映射项目分类"
          prop="zwProjectCategoryId"
          v-if="form.parentId > 0"
        >
          <treeselect
            v-model="form.zwProjectCategoryId"
            :options="deptOptions"
            :disableBranchNodes="true"
            :show-count="true"
            placeholder="请选择映射项目分类"
          />
        </el-form-item>
        <el-form-item
          label="分类名称"
          prop="categoryName"
          v-if="form.parentId == 0"
        >
          <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            :min="0"
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
  listProjectCategory,
  getProjectCategory,
  delProjectCategory,
  addProjectCategory,
  updateProjectCategory,
} from "@/api/synergy/projectCategory";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { twoTree } from "@/api/core/project/category";

export default {
  name: "XtProjectCategory",
  components: {
    Treeselect,
  },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 协同项目分类表格数据
      projectCategoryList: [],
      // 协同项目分类树选项
      projectCategoryOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 部门树选项
      deptOptions: undefined,
      // 查询参数
      queryParams: {
        parentId: undefined,
        ancestors: undefined,
        zwProjectCategoryId: undefined,
        categoryName: undefined,
        orderNum: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "id不能为空", trigger: "blur" }],
        parentId: [
          { required: true, message: "父分类id不能为空", trigger: "blur" },
        ],
        ancestors: [
          { required: true, message: "祖级列表不能为空", trigger: "blur" },
        ],
        zwProjectCategoryId: [
          {
            required: true,
            message: "映射原CRM项目分类的编码不能为空",
            trigger: "blur",
          },
        ],
        categoryName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getZWTreeselect();
    this.getList();
  },
  methods: {
    /** 查询协同项目分类列表 */
    getList() {
      this.loading = true;
      listProjectCategory(this.queryParams).then((response) => {
        this.projectCategoryList = this.handleTree(
          response.data,
          "id",
          "parentId"
        );
        this.loading = false;
      });
    },
    /** 转换协同项目分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.categoryName,
        children: node.children,
      };
    },
    /** 查询协同项目分类下拉树结构 */
    getTreeselect() {
      listProjectCategory().then((response) => {
        this.projectCategoryOptions = [];
        const data = { id: 0, categoryName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.projectCategoryOptions.push(data);
      });
    },
    /** 查询部门下拉树结构 */
    getZWTreeselect() {
      twoTree({ parentId: 0 }).then((response) => {
        this.deptOptions = response.data;
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
        id: null,
        parentId: null,
        ancestors: null,
        zwProjectCategoryId: null,
        categoryName: null,
        orderNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加协同项目分类";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getProjectCategory(row.id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改协同项目分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateProjectCategory(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addProjectCategory(this.form)
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
      this.$modal
        .confirm('是否确认删除协同项目分类编号为"' + row.id + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delProjectCategory(row.id);
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
