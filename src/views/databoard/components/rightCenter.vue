<template>
  <div class="app-container">
    <!-- <h3>2022年与2021年各月同比增长率</h3> -->
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
        <el-table-column label="2021年" align="center" prop="2021" />
        <el-table-column label="2022年" align="center" prop="2022" />
        <el-table-column label="同比增长率" align="center" prop="rate" />
      </el-table>
    </div>

    <el-dialog
      title="2022年与2021年各月同比增长率"
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
        <el-form-item label="2021年" prop="2021">
          <el-input v-model="form['2021']" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="2022年" prop="2022">
          <el-input v-model="form['2022']" placeholder="请填写" />
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
import {
  getYearMonthContrast,
  setYearMonthContrast,
} from "@/api/databoard/index";

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
    this.getYearMonthContrast();
  },
  methods: {
    // 左上列表
    getYearMonthContrast() {
      getYearMonthContrast().then((response) => {
        let data = response.data;
        let arr = [];
        arr = data[2021].map((item) => ({
          month: item.month,
          2021: item.count,
        }));
        data["rate"].forEach((item, index) => (arr[index]["rate"] = item));
        data["2022"].forEach(
          (item, index) => (arr[index]["2022"] = item.count)
        );
        this.list = arr;

        this.list.forEach(
          (item) => (item.rate = (item.rate * 100).toFixed(0) + "%")
        );
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setYearMonthContrast(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getYearMonthContrast();
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
