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
        backgroundColor: "#f1f1f1",
        // color: ["#3aa1ff", "#4ecb73", "#fbd437", "#435188", "#975fe5"], // 柱状图颜色
        // 柱状图颜色 渐变色
        color: [
          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                color: "#2DE1FD",
                offset: 0,
              },
              {
                color: "#0E5FFF",
                offset: 1,
              },
            ],
          },

          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                color: "#6DD400",
                offset: 0,
              },
              {
                color: "#44D7B6",
                offset: 1,
              },
            ],
          },
          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 桃红色
              {
                color: "#fe194e",
                offset: 0,
              },
              {
                color: "#fb7191",
                offset: 1,
              },
            ],
          },

          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 蓝绿色
              {
                color: "#026DB2",
                offset: 0,
              },
              {
                color: "#12FEE0",
                offset: 1,
              },
            ],
          },

          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 墨绿色
              {
                color: "#5AD8A6",
                offset: 0,
              },
              {
                color: "#269A99",
                offset: 1,
              },
            ],
          },

          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                color: "#5283FF",
                offset: 0,
              },
              {
                color: "#380DC9",
                offset: 1,
              },
            ],
          },
          {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                color: "#fc5d19",
                offset: 0,
              },
              {
                color: "#fbb395",
                offset: 1,
              },
            ],
          },
        ],
        legend: {
          data: ["首次成交", "二次成交", "多次成交", "粉丝客户", "忠实客户"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            const x = params[0].axisValue;
            var result = x + "</br>";
            params.forEach((item, index) => {
              if (index < 5) {
                result +=
                  item.marker + item.seriesName + ": " + item.value + "</br>";
              } else {
                result +=
                  item.marker +
                  item.seriesName +
                  ": " +
                  item.value[2] +
                  "</br>";
              }
            });
            return result;
          },

          axisPointer: {
            type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
            snap: false, // 坐标轴指示器是否自动吸附到点上。默认自动判断。

            animation: true, // 是否开启动画
            animationDuration: 1000, // 初始动画时长
            animationDurationUpdate: 200, // 数据更新动画的时长
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            name: "",
            data: this.data[0],
            axisLabel: {
              color: "#00000",
              fontSize: 10,
              interval: 0,
            },
          },
          {
            type: "value",
            max: 12 * 100,
            show: false,
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
            data: this.data[1],
            name: "首次成交",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            itemStyle: {},
          },
          {
            data: this.data[2],
            name: "二次成交",
            type: "bar",
            emphasis: {
              focus: "series",
            },
          },
          {
            data: this.data[3],
            name: "多次成交",
            type: "bar",
            emphasis: {
              focus: "series",
            },
          },
          {
            data: this.data[4],
            name: "粉丝客户",
            type: "bar",
            emphasis: {
              focus: "series",
            },
          },
          {
            data: this.data[5],
            name: "忠实客户",
            type: "bar",
            emphasis: {
              focus: "series",
            },
          },
          {
            xAxisIndex: 1,
            data: this.data[6],
            type: "line",
            name: "首次成交环比增长率",
            symbol: "circle",
            symbolSize: 6,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                  color: "#3aa1ff",
                },
              },
            },
          },
          {
            xAxisIndex: 1,
            data: this.data[7],
            type: "line",
            name: "二次成交环比增长率",
            symbol: "circle",
            symbolSize: 6, //拐点大小
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1, //折线宽度
                  color: "#4ecb73", //折线颜色
                },
              },
            },
          },
          {
            xAxisIndex: 1,
            data: this.data[8],
            type: "line",
            name: "多次成交环比增长率",
            symbol: "circle", //拐点样式
            symbolSize: 6, //拐点大小
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1, //折线宽度
                  color: "#fbd437", //折线颜色
                },
              },
            },
          },
          {
            xAxisIndex: 1,
            data: this.data[9],
            type: "line",
            name: "粉丝客户环比增长率",
            symbol: "circle", //拐点样式
            symbolSize: 6, //拐点大小
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1, //折线宽度
                  color: "#435188", //折线颜色
                },
              },
            },
          },
          {
            xAxisIndex: 1,
            data: this.data[10],
            type: "line",
            name: "忠实客户环比增长率",
            symbol: "circle", //拐点样式
            symbolSize: 6, //拐点大小
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1, //折线宽度
                  color: "#975fe5", //折线颜色
                },
              },
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,0.7c-0.3-0.3-0.8-0.3-1.1,0L4,5.9V2.5C4,1.1,2.9,0,1.5,0S0,1.1,0,2.5v6C0,9.9,1.1,11,2.5,11 S5,9.9,5,8.5v-3.4l5.6-5.2C11,0.4,11,0,10.7,0.7z M2.5,8.5c-0.8,0-1.5-0.7-1.5-1.5v-6C1,0.7,1.7,0,2.5,0S4,0.7,4,1.5v3.4L2.4,5.9 C2.2,6.1,2.2,6.4,2.5,6.3l6-5.6c0.3-0.3,0.8-0.3,1.1,0L13,5.1V8.5c0,0.8-0.7,1.5-1.5,1.5S10,9.3,10,8.5v-6C10,1.1,8.9,0,7.5,0 S5,1.1,5,2.5v3.4L2.5,8.5C2.3,8.7,2.3,9,2.5,8.5z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
      });
    },
  },
};
</script>
