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
          data: [
            "电话营销",
            "工商客户",
            "网推客户",
            "跨部门客户",
            "客户转介绍",
            "其它途径",
          ],
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            label: {
              show: true,
              position: "right",
              formatter: "{b}: {d}%",
            },
            data: [
              { value: this.data[0], name: "电话营销" },
              { value: this.data[1], name: "工商客户" },
              { value: this.data[2], name: "网推客户" },
              { value: this.data[3], name: "跨部门客户" },
              { value: this.data[4], name: "客户转介绍" },
              { value: this.data[5], name: "其它途径" },
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
        color: [
          "#3aa1ff",
          "#88d1ea",
          "#36cbcb",
          "#82dfbe",
          "#4ecb73",
          "#acdf82",
          "#fbd437",
          "#eaa674",
          "#f2637b",
        ].reverse(),
      });
    },
  },
};
</script>
