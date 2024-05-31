<template>
  <div class="app-container">
    <!-- <h3>广东省地图数据</h3> -->
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
        <el-table-column label="城市" align="center" prop="city" />
        <el-table-column label="数量" align="center" prop="salesAmount" />
      </el-table>
    </div>

    <el-dialog
      title="广东省地图数据"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="城市" prop="city">
          <el-select v-model="form.city" placeholder="请选择">
            <el-option
              v-for="(item, index) in option"
              :key="index"
              :label="item.label"
              :value="item.label"
            />
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
import { getCitySales, setCitySales } from "@/api/databoard/index";

import { regionData, CodeToText, TextToCode } from "element-china-area-data";

console.log();
export default {
  name: "leftTop",
  data() {
    return {
      list: [],
      open: false,
      option: regionData.find((item) => item.label == "广东省").children,
      form: {},
    };
  },
  watch: {},
  created() {
    this.getCitySales();
  },
  methods: {
    // 左上列表
    getCitySales() {
      getCitySales().then((response) => {
        this.list = response.data;
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setCitySales(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getCitySales();
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
