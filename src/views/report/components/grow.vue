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
        let arr = [12, 12, 7, 7, 5, 5];
        this.length = Math.ceil(
          (arr[this.data[0].length] / this.data[1].length) * 100
        );
        this.series = [];
        this.data[0].forEach((item, index) => {
          let obj = {
            name: item,
            data: this.data[index + 2],
            type: "bar",
            barGap: 0,
            barWidth: 40,
          };
          this.series.push(obj);
        });

        this.$nextTick(() => {
          setTimeout(() => {
            this.initChart();
          });
        });
      },
    },
  },
  data() {
    return {
      chart: null,
      data: [],
      series: [],
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

      this.chart.setOption(
        {
          tooltip: {
            trigger: "axis",
          },
          dataZoom: [
            {
              show: false,
              start: 0,
              end: this.length || 100,
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
          legend: {
            data: this.data[0],
          },
          xAxis: {
            type: "category",
            data: this.data[1],
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
          series: this.series,
          color: ["#3aa1ff", "#4cca73", "#fbd437", "#435188", "#975fe5"],
        },
        true
      );
    },
  },
};
</script>
