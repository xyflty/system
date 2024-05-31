<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="param">
          <el-select v-model="queryParams.param">
            <el-option label="新增客户" :value="1" />
            <el-option label="新增商机" :value="2" />
            <el-option label="新增线索" :value="3" />
            <el-option label="新增订单" :value="4" />
            <el-option label="成交总额" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="growthType">
          <el-select v-model="queryParams.growthType">
            <el-option label="同比增长率" :value="1" />
            <el-option label="环比增长率" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="deptId">
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label=" " prop="years">
          <el-select
            v-model="queryParams.years"
            placeholder="选择年份"
            multiple
          >
            <el-option label="2022年" value="2022" />
            <el-option label="2021年" value="2021" />
            <el-option label="2020年" value="2020" />
            <el-option label="2019年" value="2019" />
            <el-option label="2018年" value="2018" />
            <el-option label="2017年" value="2017" />
          </el-select>
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
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div>
        <grow class="chart-box" :initData="echartData" />
      </div>
      <div class="tip">
        <p align="center">
          同比增长率：当前周期与去年同时期的对比增长率，如2021年7月成交总额150元，2020年7月成交总额为100元，则2021年7月同比增长率为：(150-100)/100*100%
          = 50%
        </p>
        <p align="center">
          环比增长率：当前周期与上一个周期的对比增长率，如2021年7月成交总额150元，2020年6月成交总额为100元，则2021年7月环比增长率为：(150-100)/100*100%
          = 50%
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import grow from "../components/grow.vue";
import { getGrowthRateByDate } from "@/api/report/index";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProcessGrow",
  components: {
    grow,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      echartData: [],
      queryParams: {
        param: 1,
        growthType: 1,
        years: ["2022"],
        deptId: undefined,
      },
    };
  },
  watch: {
    firstOpen: {
      handler(n) {
        console.log(n);
        if (n) {
          this.queryParams.deptId = this.$store.state.user.subjectDeptId || 100;
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getTreeselect();
    this.getGrowthRateByDate();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getGrowthRateByDate();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.firstOpen = true;
      this.getGrowthRateByDate();
    },
    getGrowthRateByDate() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.years = query.years.join(",");

      let labelArrr = ["同比增长率", "环比增长率"];
      let yearsArr = this.queryParams.years.sort();
      let titleArr = yearsArr.map(
        (item) => `${item}年${labelArrr[this.queryParams.growthType - 1]}%`
      );
      getGrowthRateByDate(query).then((res) => {
        let arr = [[], []];
        yearsArr.forEach(() => arr.push([]));

        arr[0] = titleArr;
        res.data.forEach((item) => {
          arr[1].push(item.x);

          yearsArr.forEach((val, index) => {
            arr[index + 2].push(item.map[val].percentage);
          });
        });

        this.echartData = arr;
      });
    },
  },
};
</script>

<style scoped>
.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
}
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
.tip p {
  font-size: 12px;
  line-height: 24px;
  color: rgb(153, 153, 153);
}
</style>
