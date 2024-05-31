<template>
  <div class="app-container">
    <!-- <h3>各类型业务占比</h3> -->
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
        <el-table-column label="业务名称" align="center" prop="businessName" />
        <el-table-column label="数量" align="center" prop="count" />
        <el-table-column label="占比" align="center" prop="rate" />
      </el-table>
    </div>

    <el-dialog
      title="各类型业务占比"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="业务名称" prop="businessName">
          <el-select v-model="form.businessName" placeholder="请选择">
            <el-option label="资质新申请/增项" value="资质新申请/增项" />
            <el-option label="资质升级" value="资质升级" />
            <el-option label="资质重组分立/整转" value="资质重组分立/整转" />
            <el-option label="安证新申请/延期" value="安证新申请/延期" />
            <el-option label="基础培训服务" value="基础培训服务" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" placeholder="请填写" />
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
import { getBusinessCount, setBusinessCount } from "@/api/databoard/index";

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
    this.getBusinessCount();
  },
  methods: {
    // 左上列表
    getBusinessCount() {
      getBusinessCount().then((response) => {
        this.list = response.data;
        this.list.forEach(
          (item) => (item.rate = (item.rate * 100).toFixed(0) + "%")
        );
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setBusinessCount(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getBusinessCount();
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
