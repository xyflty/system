<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="累计订单销售" name="1"> <leftTop /> </el-tab-pane>
      <el-tab-pane label="各类型业务占比" name="2"><leftCenter /></el-tab-pane>
      <el-tab-pane label="广东省地图数据" name="3"><centerMap /></el-tab-pane>
      <el-tab-pane label="实时客户成交动态" name="4"
        ><centerBottom
      /></el-tab-pane>
      <el-tab-pane label="2022年各月销售数量" name="5"
        ><rightTop
      /></el-tab-pane>
      <el-tab-pane label="2022年与2021年各月同比增长率" name="6"
        ><rightCenter
      /></el-tab-pane>
      <el-tab-pane label="部门成交排名" name="7"><rightBottom /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import leftTop from "./components/leftTop.vue";
import leftCenter from "./components/leftCenter.vue";
import centerMap from "./components/centerMap.vue";
import centerBottom from "./components/centerBottom.vue";
import rightTop from "./components/rightTop.vue";
import rightCenter from "./components/rightCenter.vue";
import rightBottom from "./components/rightBottom.vue";

export default {
  name: "DataBoard",
  components: {
    leftTop,
    leftCenter,
    centerMap,
    centerBottom,
    rightTop,
    rightCenter,
    rightBottom,
  },
  data() {
    return {
      activeName: "1",
    };
  },
};
</script>
<style scoped></style>
