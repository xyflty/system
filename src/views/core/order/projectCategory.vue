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
          v-hasPermi="['core:projectCategory:add']"
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
      :data="deptList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
            v-hasPermi="['core:projectCategory:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['core:projectCategory:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:projectCategory:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级项目分类" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级项目分类"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目分类名称" prop="categoryName">
          <el-input
            v-model="form.categoryName"
            placeholder="请输入项目分类名称"
          />
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  add,
  update,
  del,
  getCategory,
  listDeptExcludeChild,
} from "@/api/core/project/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProjectCategory",
  dicts: ["sys_normal_disable"],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 项目分类树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        categoryName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级项目分类不能为空", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "项目分类名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目分类列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.deptList = this.handleTree(response.data);
        this.loading = false;
      });
    },
    /** 转换项目分类数据结构 */
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        categoryName: undefined,
        orderNum: undefined,
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
      if (row != undefined) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加项目分类";
      list().then((response) => {
        this.deptOptions = [];
        const menu = {
          id: 0,
          parentId: 0,
          categoryName: "主类目",
          children: [],
        };

        menu.children = this.handleTree(response.data);
        this.deptOptions.push(menu);
      });
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
      this.reset();
      getCategory(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目分类";
      });
      listDeptExcludeChild(row.id).then((response) => {
        this.deptOptions = [];
        const menu = {
          id: 0,
          parentId: 0,
          categoryName: "主类目",
          children: [],
        };

        menu.children = this.handleTree(response.data);
        this.deptOptions.push(menu);
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            update(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.categoryName + '"的数据项？')
        .then(function () {
          return del(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
</style>
