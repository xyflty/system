<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "../mixins/resize";

const animationDuration = 3000;

var seriesDatas = [
  [83, 56, 77, 99],
  [62, 55, 67, 82],
  [71, 45, 62, 79],
  [78, 40, 58, 77],
  [76, 33, 52, 67],
];

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
      data: [],
      chart: null,
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
        //标题样式
        title: {
          text: "",
        },
        //提示框
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        //菜单
        legend: {
          //菜单字体样式
          textStyle: {
            color: "#333",
          },
          //菜单位置
          x: "center",
          //菜单数据
          // data: ["线索", "商机", "客户", "订单"],
        },
        xAxis: [
          {
            type: "category",
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
        ],
        dataZoom: [
          {
            show: false,
            start: 0,
            end: 50,
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
        series: [
          {
            name: this.data[2],
            type: "bar",
            //柱子宽度
            barWidth: 20,
            //柱状图样式
            itemStyle: {
              color: "#38a0ff",
            },
            data: this.data[1],
          },
        ],
      });
    },
  },
};
</script>
