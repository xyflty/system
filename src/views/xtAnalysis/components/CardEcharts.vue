<template>
  <el-card>
    <div slot="header" class="card-header">
      <span>{{ title }}</span>
      <el-button type="primary" size="mini" @click="handleClick"
        >钻取</el-button
      >
    </div>
    <Echarts
      :chartData="chartData"
      :style="`height:${height}`"
      :isAxisChart="isAxisChart"
    />
  </el-card>
</template>

<script>
import Echarts from "@/components/Echarts";

export default {
  components: {
    Echarts,
  },

  props: {
    title: String,
    height: {
      type: String,
      default: "360px",
    },
    isAxisChart: Boolean,
    chartData: Object,
  },
  data() {
    return {};
  },
  methods: {
    handleClick() {
      this.$emit("drilling");
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>