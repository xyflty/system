<template>
  <div class="app-container">
    <MultiTable
    v-if="refreshTable"
      ref="tableRef"
      isSearchForm
      :default-expand-all="isExpandAll"
      :searchOptions="searchOptions"
      :api="apiFn"
      :Options="tableOption"
      row-key="id"
      :getSpanData="getSpanData"
      @setupEvents="setupEvents"
    >
      <template #actions>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('add')"
          >新增</el-button
        >

        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </template>
      <template #operation="{ scope }">
        <el-button
          v-if="scope.row.parentId == 0"
          type="text"
          @click="setupEvents({ type: 'add', row: scope.row })"
        >
          新增
        </el-button>
        <el-button
          type="text"
          @click="setupEvents({ type: 'edit', row: scope.row })"
        >
          编辑
        </el-button>

        <el-button
          type="text"
          @click="setupEvents({ type: 'del', row: scope.row })"
        >
          删除
        </el-button>
      </template>
    </MultiTable>
    <el-dialog
      :title="`${actionType === 'add' ? '添加' : '修改'}财务对接项目`"
      :visible.sync="open"
      width="500px"
      append-to-body
      @close="cancel"
    >
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="上级人员" prop="parentId">
          <el-select
            v-model="formData.parentId"
            placeholder="请选择上级人员"
            filterable
            :disabled="true"
          >
            <el-option
              v-for="item in [{ value: 0, label: '顶级节点' }].concat(
                commonData.userList
              )"
              :key="item.value"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="项目分类"
          prop="zwProjectCategoryId"
          v-if="formData.parentId > 0"
        >
          <treeselect
            v-model="formData.zwProjectCategoryId"
            :options="deptOptions"
            :disableBranchNodes="true"
            :show-count="true"
            placeholder="请选择项目分类"
          />
        </el-form-item>
        <el-form-item
          label="人员名称"
          prop="userId"
          v-if="formData.parentId == 0"
        >
          <el-select
            v-model="formData.userId"
            filterable
            placeholder="请选择人员名称"
          >
            <el-option
              v-for="item in commonData.userList"
              :key="item.value"
              v-bind="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number
            v-model="formData.orderNum"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import { mapState } from "vuex";
import {
  financialProjectCategoryList,
  addFinancialProjectCategory,
  delFinancialProjectCategory,
  getFinancialProjectCategory,
  editFinancialProjectCategory,
} from "@/api/synergy/projectCategory";
import { twoTree } from "@/api/core/project/category";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    MultiTable,
    Treeselect,
  },
  data() {
    return {
      apiFn: financialProjectCategoryList,
      tableOption: [
        {
          prop: "name",
          label: "人员名称",
          showOverflowTooltip: false,
          align: "left",
        },
        {
          prop: "orderNum",
          label: "排序",
        },
        {
          prop: "createTime",
          label: "创建时间",
        },
        {
          label: "操作",
          action: true,
          width: "200",
          align:"center",
        },
      ],
      searchOptions: [],
      // 是否展开，默认全部展开
      isExpandAll: true,

      //   添加和编辑弹出框
      open: false,
      actionType: "add",

      formOptions: [],
      formData: {
        parentId: 0,
        orderNum: 0,
      },
      rules: {},
      buttonLoading: false,

      projectCategoryList: [],
      deptOptions: [],
      rowItem: null, //当前点击的表格行数据
      refreshTable:true
    };
  },
  methods: {
    initSearch() {
      this.searchOptions = [
        {
          type: "select",
          label: "人员名称",
          prop: "userId",
          placeholder: "请输入人员名称",
          children: this.commonData.userList,
          attrs: {
            clearable: true,
            filterable: true,
          },
        },
      ];
    },
    getSpanData(arr) {
      arr.map((item) => {
        if (item.categoryName || item.userName) {
          return (item.name = item.categoryName || item.userName);
        }
      });
   
      let newTableData = this.handleTree(arr, "id", "parentId");
   
      return newTableData;
    },

    // 添加操作
    handleAdd(type) {
      this.actionType = type;
      this.open = true;

      this.formData.parentId = 0;
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
        this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
    },
    // 删除回调
    delCallBack(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delFinancialProjectCategory(row.id).then((res) => {
            this.$refs.tableRef.getTableData(); //更新表格数据
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑回调
    editCallBack(row) {
      if (row != null) {
        this.formData.parentId = row.id;
      }

      getFinancialProjectCategory(row.id).then((response) => {
        this.formData = response.data;
        if (row.parentId == 0) {
          this.formData.parentId = row.parentId;
        } else {
          this.formData.parentId = response.data.userId;
        }

        this.open = true;
      });
    },
    setupEvents({ type, row }) {

      this.rowItem = row; // 当前表格行数据赋值
      if (type === "del") {
        // 删除
        this.delCallBack(row);
      } else if (type === "edit") {
        this.actionType = "edit";
        this.editCallBack(row);
      } else if (type === "add") {
        // 新增
        this.actionType = "add";
        this.$nextTick(() => {

          this.formData.parentId = row.userId;
    
        });

        this.open = true;
      }
    },

    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let fn = null;
          let msg = "";
          let sendData = {
            ...this.formData,
          };

          if (this.formData.userId) {
            sendData.userName = this.commonData.userList.find(
              (item) => item.value == this.formData.userId
            ).label;
          }

          if (this.actionType === "add") {
            fn = addFinancialProjectCategory;
            if (this.rowItem) {
              // 不是顶级节点，parentId = 当前表格行的id
              sendData.parentId = this.rowItem.id;
            }
            msg = "添加成功";
          } else if (this.actionType === "edit") {
            fn = editFinancialProjectCategory;
            sendData.parentId = this.rowItem.parentId;
            msg = "修改成功";
          }

          fn(sendData).then((res) => {
            if (res.code === 200) {
              this.$refs.tableRef.getTableData(); //更新表格数据
              this.open = false;
              this.$message.success(msg);
              this.buttonLoading = false;
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.$refs.form.resetFields();
      this.rowItem = null;
      this.formData = {
        parentId: 0,
        orderNum: 0,
      };
    },

    /** 查询部门下拉树结构 */
    getZWTreeselect() {
      twoTree({ parentId: 0 }).then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
  mounted() {

    this.initSearch();
    this.getZWTreeselect();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss'>

</style>