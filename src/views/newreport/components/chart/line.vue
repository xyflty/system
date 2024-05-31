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
      default: "400px",
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
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: [
            "首次成交金额",
            "二次成交金额",
            "多次成交金额",
            "粉丝客户成交金额",
            "忠实客户成交金额",
          ],
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {},
          },
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
            name: "",
            boundaryGap: false,
            data: this.data[0],
            axisLabel: {
              show: true,
              color: "#00000",
              fontSize: 10,
              interval: 0,
            },
          },
        ],
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
            name: "首次成交金额",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[1],
          },
          {
            name: "二次成交金额",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[2],
          },
          {
            name: "多次成交金额",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[3],
          },
          {
            name: "粉丝客户成交金额",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[4],
          },
          {
            name: "忠实客户成交金额",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: this.data[5],
          },
        ],
        color: [
          "#ee6666",
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#73c0de",
          "#9a60b4",
          "#fc8452",
          "#3ba272",
        ],
      });
    },
  },
};
</script>
