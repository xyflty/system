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

      const type = this.data[11] == 1 ? "line" : "bar";
      const stack = this.data[11] == 1 ? "" : "Ad";

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
        },
        xAxis: [
          {
            type: "category",
            data: this.data[10],
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
            name: "线索数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[0],
            barWidth: 40,
          },
          {
            name: "商机数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[1],
          },
          {
            name: "订单数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[2],
          },
          {
            name: "客户数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[3],
          },
          {
            name: "线索跟进数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[4],
          },
          // {
          //   name: "挖需跟进数量",
          //   type,
          //   stack,
          //   emphasis: {
          //     focus: "series",
          //   },
          //   data: this.data[5],
          // },
          {
            name: "商机跟进数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[6],
          },
          {
            name: "订单跟进数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[7],
          },
          {
            name: "客户跟进数量",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[8],
          },
          {
            name: "订单总价格",
            type,
            stack,
            emphasis: {
              focus: "series",
            },
            data: this.data[9],
          },
        ],
      });
    },
  },
};
</script>
