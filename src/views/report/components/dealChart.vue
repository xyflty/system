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
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#fff",
            },
          },
        },
        legend: {
          data: ["首次成交率%", "续约率%", "流失率%"],
          top: "0%",
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.data[0],
            axisLabel: {
              show: true,
              color: "#333",
              fontSize: 12,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
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
        ],
        series: [
          {
            name: "首次成交率%",
            type: "line",
            // stack: "Total",,
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[1],
          },
          {
            name: "续约率%",
            type: "line",
            // stack: "Total",,
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[2],
          },
          {
            name: "流失率%",
            type: "line",
            // stack: "Total",,
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[3],
          },
        ],
        color: ["#2b99ff", "#2fc25b", "#facc14"],
      });
    },
  },
};
</script>
