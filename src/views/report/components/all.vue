<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "480px",
    },
    initData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    initData: {
      handler(n) {
        this.data = n;
        this.length = Math.ceil((12 / this.data[0].length) * 100);

        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
  },
  data() {
    return {
      chart: null,
      data: [],
      length: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
        },
        dataZoom: [
          {
            show: false,
            start: 0,
            end: this.length,
          },
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            show: false,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "93%",
          },
        ],
        xAxis: {
          type: "category",
          data: this.data[0],
          axisLabel: {
            show: true,
            color: "#333",
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          //y轴字体设置
          axisLabel: {
            show: true,
            color: "#333",
            fontSize: 12,
          },
          //y轴线设置不显示
          axisLine: {
            show: false,
          },
          //与x轴平行的线样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              width: 1,
              type: "dashd",
            },
          },
        },
        series: [
          {
            name: this.data[2],
            data: this.data[1],
            type: "bar",
            barWidth: 40,
          },
        ],
        color: ["#3aa1ff"],
      });
    },
  },
};
</script>
