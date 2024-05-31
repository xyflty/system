<template>
  <div class="app-container">
    <!-- <h3>实时客户成交动态</h3> -->
    <div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="open = true"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="list" border>
        <el-table-column
          label="项目一级分类"
          align="center"
          prop="categoryOne"
        />
        <el-table-column
          label="项目二级分类"
          align="center"
          prop="categoryTwo"
        />
        <el-table-column
          label="项目三级分类"
          align="center"
          prop="categoryThree"
        />
        <el-table-column label="项目名称" align="center" prop="projectName" />
        <el-table-column label="客户名称" align="center" prop="companyName" />
      </el-table>
    </div>

    <el-dialog
      title="实时客户成功动态"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="项目一级分类" prop="categoryOne">
          <el-input v-model="form.categoryOne" placeholder="项目一级分类" />
        </el-form-item>
        <el-form-item label="项目二级分类" prop="categoryTwo">
          <el-input v-model="form.categoryTwo" placeholder="项目二级分类" />
        </el-form-item>
        <el-form-item label="项目三级分类" prop="categoryThree">
          <el-input v-model="form.categoryThree" placeholder="项目三级分类" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="客户名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="客户名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomerDeal, setsCustomerDeal } from "@/api/databoard/index";

export default {
  name: "leftTop",
  data() {
    return {
      list: [],
      open: false,
      form: {},
    };
  },
  watch: {},
  created() {
    this.getCustomerDeal();
  },
  methods: {
    // 左上列表
    getCustomerDeal() {
      getCustomerDeal().then((response) => {
        this.list = response.data;
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setsCustomerDeal(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getCustomerDeal();
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.form = {};
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
</style>
