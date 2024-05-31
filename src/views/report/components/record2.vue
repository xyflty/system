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
        this.length = Math.ceil((10 / this.data[0].length) * 100);

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
        //标题样式
        title: {
          text: "",
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
          data: ["面谈", "电话", "微信", "邮件", "QQ", "短信", "其他"],
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

        series: [
          {
            name: "面谈",
            type: "bar",
            //柱子宽度
            barWidth: 12,
            //柱状图样式
            itemStyle: {
              color: "#38a0ff",
            },
            data: this.data[1],
            barGap: 0,
          },
          {
            name: "电话",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#4ecb73",
            },
            data: this.data[2],
          },
          {
            name: "微信",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#fbd437",
            },
            data: this.data[3],
          },
          {
            name: "邮件",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#435188",
            },
            data: this.data[4],
          },
          {
            name: "QQ",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#975fe5",
            },
            data: this.data[5],
          },
          {
            name: "短信",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#36cbcb",
            },
            data: this.data[6],
          },
          {
            name: "其他",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              color: "#36cbcb",
            },
            data: this.data[7],
          },
        ],
      });
    },
  },
};
</script>
