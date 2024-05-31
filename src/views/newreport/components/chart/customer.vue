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
    name: {
      type: Array,
    },
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
      data: [[]],
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
      var _this = this;
      var color = ["#3aa1ff", "#4ecb73", "#fbd437", "#435188", "#975fe5"];
      console.log(this.data, 8888);
      var series = this.data.map((res, index) => {
        console.log(res, 666);

        if (index != 0) {
          if ((this.data.length - 1) / 2 >= index) {
            return {
              data: res,
              name: this.name[index - 1],
              type: "bar",

              barWidth: this.data[0].length < 14 ? 10 : 7,
              emphasis: {
                focus: "series",
              },
            };
          } else {
            return {
              xAxisIndex: 1,
              data: res,
              type: "line",

              name: this.name[index - 5],
              symbol: "circle",
              symbolSize: 6,
              smooth: false,
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 1,
                    color: color[index - 5],
                  },
                },
              },
            };
          }
        }
      });
      series.shift();
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        backgroundColor: "#f1f1f1",
        // color: ["#3aa1ff", "#4ecb73", "#fbd437", "#435188"], // 柱状图颜色
        // 柱形图颜色渐变色
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
          // data: ["首次成交", "二次成交", "多次成交", "粉丝客户", "忠实客户"],
          data: this.name.slice(0, this.name.length / 2),
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
            snap: true, // 坐标轴指示器是否自动吸附到点上。默认自动判断。
            label: {
              margin: 10, // label 距离轴的距离
              color: "#FFF", // 文字的颜色
              fontStyle: "normal", // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体）
              fontWeight: "normal", // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
              fontSize: "20", // 文字字体大小
              lineHeight: "50", // 行高
              padding: [5, 7, 5, 7], // 内边距，单位px
              backgroundColor: "auto", // 文本标签的背景颜色
            },
            animation: true, // 是否开启动画
            animationDuration: 1000, // 初始动画时长
            animationDurationUpdate: 200, // 数据更新动画的时长
          },

          formatter: function (params) {
            if (params.length == 1) {
              return;
            }
            var name = [
              "线索",
              "商机",
              "订单",
              "客户",
              "线索环比增长率",
              "商机环比增长率",
              "订单环比增长率",
              "客户环比增长率",
            ];
            var x = null;
            _this.data[0].forEach((item, index) => {
              if (params[0].axisValue == item) {
                x = index;
              }
            });
            var result = "";
            _this.data.forEach((item, index) => {
              if (index == 0) {
                result += item[x] + "</br>";
              } else if (5 > index > 0) {
                result += name[index - 1] + ": " + item[x] + "</br>";
              } else {
                result += name[index - 1] + ": " + item[x][2] + "</br>";
              }
            });
            return result;
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
            max: this.data[0].length < 14 ? 12 : 30,
            min: 0,
            data: this.data[0],
            axisLabel: {
              show: true,
              color: "#00000",
              fontSize: this.data[0].length < 14 ? 10 : 7,
              interval: 0,
            },
          },
          {
            type: "value",
            max: this.data[0].length < 14 ? 12 * 100 : 30 * 100,
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
        series: series,
      });
    },
  },
};
</script>
