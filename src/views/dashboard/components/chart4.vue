<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "../mixins/resize";

const animationDuration = 3000;

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
          trigger: "item",
          formatter: "{b} : {c}",
        },
        toolbox: {
          feature: {},
        },
        legend: {
          data: [],
        },

        series: [
          {
            name: "销售漏斗",
            type: "funnel",
            left: "0",
            top: 30,
            bottom: 60,
            width: "100%",
            min: 0,
            max: 100,
            minSize: "5%",
            maxSize: "200%",
            sort: "descending",
            gap: 0,
            label: {
              show: true,
              position: "right",
              formatter: "{b}: {c}",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 0,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: this.data,
            color: ["#975fe5", "#435188", "#fbd437", "#4ecb73", "#3aa1ff"],
          },
        ],
      });
    },
  },
};
</script>
