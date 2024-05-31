<template>
  <div class="dashboard-editor-container">
    <QuicklyCreate />

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :xs="24" :sm="24" :lg="12">
        <DataPresentation />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <Message />
      </el-col>
    </el-row>

    <div style="margin-top: 10px"><Chart /></div>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :xs="24" :sm="24" :lg="12">
        <WorkReport />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <Calendar />
      </el-col>
    </el-row>
    <Ad />
  </div>
</template>

<script>
import QuicklyCreate from "./dashboard/QuicklyCreate";
import DataPresentation from "./dashboard/DataPresentation";
import Message from "./dashboard/Message";
import Calendar from "./dashboard/Calendar";
import WorkReport from "./dashboard/WorkReport";
import Chart from "./dashboard/Chart";
import Ad from "./dashboard/Advertising";

import store from "../store";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  name: "Index",
  components: {
    QuicklyCreate,
    DataPresentation,
    Message,
    Chart,
    Calendar,
    WorkReport,
    Ad,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
  },
  mounted() {
    store.dispatch("commonData/getUserList");
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
