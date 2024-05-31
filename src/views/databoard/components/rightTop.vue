<template>
  <div class="app-container">
    <!-- <h3>2022年各月销售数量</h3> -->
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
        <el-table-column label="时间" align="center" prop="month" />
        <el-table-column label="数量（单位/万）" align="center" prop="count" />
      </el-table>
    </div>
    <el-dialog
      title="2022年各月销售数量"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="时间" prop="month">
          <el-select v-model="form.month" placeholder="请选择">
            <el-option
              v-for="(item, index) in option"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量（单位/万）" prop="count">
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
import { getMonthSales, setMonthSales } from "@/api/databoard/index";

export default {
  name: "leftTop",
  data() {
    return {
      list: [],
      open: false,
      form: {},
      option: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
    };
  },
  watch: {},
  created() {
    this.getMonthSales();
  },
  methods: {
    // 左上列表
    getMonthSales() {
      getMonthSales().then((response) => {
        this.list = response.data;
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setMonthSales(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getMonthSales();
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
