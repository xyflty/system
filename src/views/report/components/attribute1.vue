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
            "了解产品",
            "正在跟进",
            "正在试用",
            "准备购买",
            "准备付款",
            "已经购买",
            "暂时搁置",
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
              { value: 0, name: "暂时搁置" },
              { value: 0, name: "已经购买" },
              { value: 0, name: "准备付款" },
              { value: 0, name: "准备购买" },
              { value: 0, name: "正在试用" },
              { value: 0, name: "正在跟进" },
              { value: 0, name: "了解产品" },
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
          "#36cbcb",
          "#4ecb73",
          "#fbd437",
          "#f2637b",
          "#975fe5",
          "#5254cf",
        ].reverse(),
      });
    },
  },
};
</script>
