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
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: " {b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["A", "B", "C", "VIP"],
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            label: {
              show: true,
              position: "right",
              formatter: "{b}: {d}%",
            },
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [
              { value: this.data[0], name: "A" },
              { value: this.data[1], name: "B" },
              { value: this.data[2], name: "C" },
              { value: this.data[3], name: "VIP" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ["#3aa1ff", "#36cbcb", "#4ecb73", "#fbd437"].reverse(),
      });
    },
  },
};
</script>
