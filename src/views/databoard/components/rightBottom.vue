<template>
  <div class="app-container">
    <!-- <h3>部门成交排名</h3> -->
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
        <el-table-column label="部门名称" align="center" prop="name" />
        <el-table-column label="数量（单位/万）" align="center" prop="count" />
      </el-table>
    </div>

    <el-dialog
      title="部门成交排名"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="数量（单位/万）" prop="count">
          <el-input v-model="form.count" placeholder="数量（单位/万）" />
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
import { getDeptSales, setDeptSales } from "@/api/databoard/index";

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
    this.getDeptSales();
  },
  methods: {
    // 左上列表
    getDeptSales() {
      getDeptSales().then((response) => {
        this.list = response.data;
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setDeptSales(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getDeptSales();
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
