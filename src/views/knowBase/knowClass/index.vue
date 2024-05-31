<template>
  <div class="app-container">
    <!-- 筛选表单 -->
    <!-- <avue-form
      :option="searchOptions"
      v-model="queryForm"
    
    ></avue-form> -->
    <!-- 表格区域 -->
    <avue-crud
      v-model="form"
      :option="option"
      :search.sync="queryForm"
      :data="data"
      ref="crud"
      :before-open="beforeOpen"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="resetChange"
    >
      <template slot-scope="scope" slot="menuLeft">
        <el-button icon="el-icon-sort" size="small" @click="handleToggle(scope)"
          >展开/折叠</el-button
        >
      </template>

      <template slot="icon" slot-scope="scope">
        <i :class="scope.row.icon" style="font-size: 24px"></i>
      </template>
      <template slot="menu" slot-scope="{ row, size, type }">
        <el-button :size="size" :type="type" @click="handleAdd(row)"
          >新增子级</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  baseCategoryList,
  baseCategoryAdd,
  baseCategoryEdit,
  baseCategoryDel,
} from "@/api/knowBase/knowClass";
export default {
  data() {
    return {
      parentId: undefined,
      form: {},
      data: [],
      queryForm: {},

      option: {
        // 筛选配置
        searchMenuSpan: 4,
        searchBtnText: "搜索",
        emptyBtnText: "重置",

        // 新增表单配置
        labelWidth: 120,
        // 表格配置
        headerAlign: "center",
        align: "center",

        rowKey: "id",
        rowParentKey: "parentId",

        deptOptions: [], //树形数据

        defaultExpandAll: true,
        column: [
          {
            label: "关键字",
            prop: "searchValue",
            search: true, //添加筛选
            hide: true, //不显示当前列
            showColumn: false, //隐藏表格列
            editDisplay: false, // 编辑表单不显示
            addDisplay: false, // 新增表单不显示
          },
          {
            label: "上级项目分类",
            prop: "parentId",
            type: "tree",

            hide: true,
            showColumn: false,
            row: true,
            span: 24,
            props: {
              label: "categoryName",
              value: "id",
            },
            dicData: this.deptOptions,

            rules: [
              {
                required: true,
                message: "请选择上级项目分类",
                trigger: "blur",
              },
            ],
          },
          // 表格
          {
            label: "分类名称",
            prop: "categoryName",
            align: "left",
            row: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请填写分类名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "排序",
            prop: "orderNum",
            type: "number",
            row: true,
            span: 24,
            value: 0,
            rules: [
              {
                required: true,
                message: "请填写排序",
                trigger: "blur",
              },
            ],
          },
          {
            label: "创建时间",
            prop: "createTime",
            editDisplay: false,
            addDisplay: false,
          },
        ],
      },
    };
  },
  methods: {
    handleToggle() {
      this.option.defaultExpandAll = !this.option.defaultExpandAll;
      this.$refs.crud.refreshTable();
    },
    // 新增或者修改弹出框前调用
    beforeOpen(done, type) {
      this.getDeptOptions(done);
    },
    // 删除操作
    rowDel(row, index, done) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await baseCategoryDel(row.id);
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableList();
          } else {
            this.$message({
              type: "info",
              message: res.msg,
            });
          }
          done(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          done(row);
        });
    },
    // 新增表单保存
    async rowSave(row, done) {
      console.log(this.form, "add845454");
      const { orderNum, parentId, categoryName } = this.form;
      let sendData = {
        orderNum,
        parentId,
        categoryName,
      };
      const res = await baseCategoryAdd(sendData);
      if (res.code === 200) {
        this.$message.success("添加成功");
        this.getTableList();

        console.log("添加成功");
        done(row);
      }
    },
    // 修改操作保存
    async rowUpdate(row, index, done) {
      console.log(row, index, "edit");
      console.log(this.form, "edit6699");
      const { id, orderNum, parentId, categoryName } = this.form;
      const sendData = {
        id,
        orderNum,
        parentId,
        categoryName,
      };
      const res = await baseCategoryEdit(sendData);
      if (res.code === 200) {
        this.$message.success("修改成功");
        this.getTableList();

        console.log("修改成功");
        done(row);
      }
    },
    // 新增子集
    handleAdd(row) {
      this.form.parentId = row.id;
      this.$refs.crud.rowAdd();
    },
    // 搜索
    searchChange(form, done) {
      console.log(form);
      done();
    },
    // 重置
    resetChange() {},
    // 获取表格数据
    async getTableList() {
      const res = await baseCategoryList(this.queryForm);
      if (res.code === 200) {
        this.data = this.handleTree(res.data);
      }
    },

    // 获取树形数据
    async getDeptOptions(done) {
      const res = await baseCategoryList(this.queryForm);
      if (res.code === 200) {
        this.deptOptions = [];
        const menu = {
          id: 0,
          parentId: 0,
          categoryName: "项目销售指引公告",
          children: [],
        };
        menu.children = this.handleTree(res.data);
        this.deptOptions.push(menu);

        const row = this.option.column.find((item) => item.prop === "parentId");

        row.dicData = this.deptOptions;
        console.log(row);

        // this.$refs.crud.refreshTable();
        done();
      }
    },
  },
  mounted() {
    this.getTableList();
  },
};
</script>

<style lang='scss' scoped>
</style>