// 动态核实导入
<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      :data="tableData"
      :option="option"
      :page.sync="pager"
      :search.sync="queryParams"
      @on-load="getList"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @search-reset="resetChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
    >
      <template slot="menuLeft">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="$refs.crud.rowAdd()"
              v-hasPermi="['zw:companyCheckSituation:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="selectData.length === 0"
              @click="addDetale"
              v-hasPermi="['zw:companyCheckSituation:remove']"
              >批量删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['zw:companyCheckSituation:import']"
              >导入</el-button
            >
          </el-col>
        </el-row>
      </template>
      <template slot-scope="{ row, index }" slot="menu">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="$refs.crud.rowEdit(row, index)"
          v-hasPermi="['zw:companyCheckSituation:edit']"
          >修改</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleRemove(row)"
          v-hasPermi="['zw:companyCheckSituation:remove']"
          >删除</el-button
        >
      </template>
    </avue-crud>

    <!-- 线索导入对话框 -->
    <ImportModel
      title="动态核查导入"
      :visible.sync="uploadOpen"
      action="/zw/companyCheckSituation/importData"
      :templateFn="downloadTemplate"
      @success="handleFileSuccess"
    />
  </div>
</template>

<script>
import {
  companyCheckSituationList,
  importTemplate,
  companyCheckSituationAdd,
  companyCheckSituationEdit,
  companyCheckSituationRemove,
} from "@/api/core/verifyImport";
import ImportModel from "@/views/components/ImportModel.vue";
export default {
  components: {
    ImportModel,
  },
  data() {
    return {
      tableData: [],
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,

        // 搜索配置
        searchFilterDic: true,
        searchFilterNull: true,
        searchMenuSpan: 6,

        // 表单配置
        // 标题的宽度
        labelWidth: 150,

        border: true,
        stripe: true,
        selection: true,
        headerAlign: "center",
        align: "center",

        column: [],
      },
      queryParams: {},
      pager: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      selectData: [],
      // 导入
      uploadOpen: false,
    };
  },
  methods: {
    setOptions() {
      this.option.column = [
        {
          label: "企业社会信用代码",
          prop: "creditCode",

          // 表单配置
          row: true,
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入企业社会信用代码",
              trigger: "blur",
            },
          ],
          // 编辑时禁止
          editDisabled: true,
        },
        {
          label: "企业名称",
          prop: "companyName",
          search: true,

          // 表单配置
          row: true,
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入企业名称",
              trigger: "blur",
            },
          ],
          // 编辑时禁止
          editDisabled: true,
        },
        {
          label: "安证编号",
          prop: "safetyNum",

          // 表单配置
          row: true,
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入安证编号",
              trigger: "blur",
            },
          ],
        },
        {
          label: "核查情况",
          prop: "situation",

          // 表单配置
          row: true,
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入核查情况",
              trigger: "blur",
            },
          ],
        },
        {
          label: "备注",
          prop: "remark",
          overHidden: true,

          // 表单配置
          row: true,
          span: 24,
          type: "textarea",
          minRows: 3,
          maxRows: 5,
        },
      ];
    },
    // 提交
    searchChange(params, done) {
      this.getList();
      done();
    },
    // 重置
    resetChange() {
      this.pager.currentPage = 1;
      this.getList();
    },
    // 表格选中的数据
    selectionChange(list) {
      this.selectData = list;
    },
    async getList() {
      const { currentPage, pageSize } = this.pager;
      let sendParams = {
        ...this.queryParams,
        pageNum: currentPage,
        pageSize,
      };
      try {
        const res = await companyCheckSituationList(sendParams);
        if (res.code === 200) {
          this.tableData = res.rows;
          this.pager.total = res.total;
        }
      } catch (error) {}
    },

    // 导入
    handleImport() {
      this.uploadOpen = true;
    },

    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.getList();
    },
    /** 下载模板操作 */
    downloadTemplate() {
      importTemplate().then((response) => {
        console.log();
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + "动态核查导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },

    // 新增和修改
    async saveCallback(form, done, loading, type = "add") {
      let fn;
      let msg;
      if (type === "edit") {
        fn = companyCheckSituationEdit;
        msg = "修改成功";
      } else {
        fn = companyCheckSituationAdd;
        msg = "新增成功";
      }

      try {
        const res = await fn(form);

        if (res.code === 200) {
          this.$message.success(msg);

          this.getList();
          loading();
          done();
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        loading();
      }
    },
    rowSave(form, done, loading) {
      this.saveCallback(form, done, loading);
    },
    rowUpdate(form, index, done, loading) {
      this.saveCallback(form, done, loading, "edit");
    },
    deteleCallback(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          companyCheckSituationRemove(id).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除
    handleRemove(row) {
      this.deteleCallback(row.id);
    },
    // 批量删除
    addDetale() {
      let ids = this.selectData.map((item) => item.id).join(",");
      console.log(ids);
      this.deteleCallback(ids);
    },
  },
  mounted() {
    this.setOptions();
  },
};
</script>

<style lang="scss" scoped></style>
