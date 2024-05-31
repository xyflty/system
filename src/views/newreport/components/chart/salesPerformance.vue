<template>
  <div
    @mousemove.prevent
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
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
  data() {
    return {
      chart: null,
      data2: [],
      length: 0,
    };
  },
  watch: {
    initData: {
      handler(n) {
        // this.data = n;
        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.data2 = this.initData;

      // 获取线索数量
      let clueNum = this.data2.map((t) => {
        return t.clueNum;
      });

      // 获取成交排名列表
      let orderAmount = this.data2.map((t) => {
        return t.orderAmount;
      });

      // 获取整体转化率排名
      let wholeConversionRate = this.data2.map((t) => {
        return t.wholeConversionRate;
      });

      // 获取跟进次数排名表
      let allNum = this.data2.map((t) => {
        return t.allNum;
      });

      // 对其进行排序操作
      // this.data2 = [...this.data2].sort((a, b) =>   b.clueNum -  a.clueNum);

      // 获取排名名称
      let deptName = this.data2.map((t) => {
        return t.deptName;
      });

      this.chart = echarts.init(this.$el, "macarons");

      if (clueNum[0] !== undefined) {
        this.chart.setOption({
          backgroundColor: "#f1f1f1",
          color: ["#738edc", "#a9df96", "#f6dc7d", "#f6868a"],
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
              snap: false, // 坐标轴指示器是否自动吸附到点上。默认自动判断。

              animation: true, // 是否开启动画
              animationDuration: 1000, // 初始动画时长
              animationDurationUpdate: 200, // 数据更新动画的时长
            },
            backgroundColor: "rgba(50,50,50,0.7)",
          },
          legend: {
            show: true,
          },

          xAxis: {
            type: "category",
            axisTick: { show: false },
            data: deptName,
          },

          yAxis: {
            type: "value",
            // inverse:true
          },
          series: [
            {
              name: "线索数量",
              data: this.data2.map((t) => {
                return t.clueNum;
              }),
              type: "bar",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },

              barWidth: "22",
              // barGap:"200%",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#2DE1FD",
                      offset: 1,
                    },
                    {
                      color: "#0E5FFF",
                      offset: 0,
                    },
                  ]),
                },
              },
            },
            {
              name: "商机数量",

              data: this.data2.map((t) => {
                return t.opportunityNum;
              }),
              type: "bar",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              barWidth: "22",
              // barGap:"200%",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#6DD400",
                      offset: 0,
                    },
                    {
                      color: "#44D7B6",
                      offset: 1,
                    },
                  ]),
                },
              },
            },
            {
              name: "订单数量",

              data: this.data2.map((t) => {
                return t.orderNum;
              }),
              type: "bar",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              barWidth: "22",
              // barGap:"200%",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#fa2929",
                      offset: 0,
                    },
                    {
                      color: "#f4f43e",
                      offset: 1,
                    },
                  ]),
                },
              },
            },
            {
              name: "客户数量",

              data: this.data2.map((t) => {
                return t.customerNum;
              }),
              type: "bar",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              barWidth: "22",
              // barGap:"200%",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#fe194e",
                      offset: 0,
                    },
                    {
                      color: "#fb7191",
                      offset: 1,
                    },
                  ]),
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
      }
      if (orderAmount[0] !== undefined) {
        this.chart.setOption({
          backgroundColor: "#f1f1f1",
          color: ["#738edc", "#a9df96", "#f6dc7d", "#f6868a"],
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
              snap: false, // 坐标轴指示器是否自动吸附到点上。默认自动判断。

              animation: true, // 是否开启动画
              animationDuration: 1000, // 初始动画时长
              animationDurationUpdate: 200, // 数据更新动画的时长
            },
            backgroundColor: "rgba(50,50,50,0.7)",
            // formatter: function (params) {
            //   let html = params[0].name;
            //   params.forEach((item, index) => {
            //     html += `<br/>${item.seriesName}: ${item.value == undefined ? 0 : item.value
            //       }`;
            //   });
            //   return html;
            // },
          },
          legend: {
            show: true,
          },

          xAxis: {
            type: "category",
            axisTick: { show: false },
            data: deptName,
          },

          yAxis: {
            type: "log",
            // inverse:true
          },
          series: [
            {
              name: "成交金额",

              data: this.data2.map((t) => {
                return +t.orderAmount || undefined;
              }),
              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#2DE1FD",
                      offset: 1,
                    },
                    {
                      color: "#0E5FFF",
                      offset: 0,
                    },
                  ]),
                },
              },
            },
            {
              name: "首次成交金额",

              data: this.data2.map((t) => {
                return +t.oneTranAmount || undefined;
              }),
              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#6DD400",
                      offset: 0,
                    },
                    {
                      color: "#44D7B6",
                      offset: 1,
                    },
                  ]),
                },
              },
            },
            {
              name: "二次成交金额",

              data: this.data2.map((t) => {
                return +t.twoTranAmount || undefined;
              }),
              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#fa2929",
                      offset: 0,
                    },
                    {
                      color: "#f4f43e",
                      offset: 1,
                    },
                  ]),
                },
              },
            },
            {
              name: "多次成交金额",

              data: this.data2.map((t) => {
                return +t.mulTranAmount || undefined;
              }),
              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#fe194e",
                      offset: 0,
                    },
                    {
                      color: "#fb7191",
                      offset: 1,
                    },
                  ]),
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
      }

      if (wholeConversionRate[0] !== undefined) {
        this.chart.setOption({
          backgroundColor: "#f1f1f1",
          color: ["#738edc", "#a9df96", "#f6dc7d", "#f6868a"],
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
              snap: false, // 坐标轴指示器是否自动吸附到点上。默认自动判断。

              animation: true, // 是否开启动画
              animationDuration: 1000, // 初始动画时长
              animationDurationUpdate: 200, // 数据更新动画的时长
            },
            backgroundColor: "rgba(50,50,50,0.7)",
            // formatter: "{c}%", //显示百分号
          },
          legend: {
            show: true,
          },

          xAxis: {
            type: "category",
            // axisTick: { show: false },
            data: deptName,
          },

          yAxis: {
            type: "value",
            name: "单位(%)",
            nameGap: 35,
            // inverse:true
          },
          series: [
            {
              name: "整体转化率",

              data: this.data2.map((t) => {
                return t.wholeConversionRate.replace("%", "");
              }),

              type: "bar",
              barWidth: "22",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                formatter: "{c}%", //显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#2DE1FD",
                      offset: 1,
                    },
                    {
                      color: "#0E5FFF",
                      offset: 0,
                    },
                  ]),
                },
              },
            },
            {
              name: "线索转化率",

              data: this.data2.map((t) => {
                return t.clueConversionRate.replace("%", "");
              }),

              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                formatter: "{c}%", //显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#6DD400",
                      offset: 0,
                    },
                    {
                      color: "#44D7B6",
                      offset: 1,
                    },
                  ]),
                },
              },
            },
            {
              name: "商机转化率",

              data: this.data2.map((t) => {
                return t.opportunityConversionRate.replace("%", "");
              }),
              type: "bar",

              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                formatter: "{c}%", //显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              // barGap:"200%",
              barWidth: "22",
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#fa2929",
                      offset: 0,
                    },
                    {
                      color: "#f4f43e",
                      offset: 1,
                    },
                  ]),
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
      }

      if (allNum[0] !== undefined) {
        this.chart.setOption({
          backgroundColor: "#f1f1f1",
          color: ["#738edc", "#a9df96", "#f6dc7d", "#f6868a"],
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "shadow", // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
              snap: false, // 坐标轴指示器是否自动吸附到点上。默认自动判断。

              animation: true, // 是否开启动画
              animationDuration: 1000, // 初始动画时长
              animationDurationUpdate: 200, // 数据更新动画的时长
            },
            backgroundColor: "rgba(50,50,50,0.7)",
          },
          legend: {
            show: true,
          },

          xAxis: {
            type: "category",
            axisTick: { show: false },
            data: deptName,
          },

          yAxis: {
            type: "value",
            // inverse:true
          },
          series: [
            {
              name: "整体跟进次排名",

              data: this.data2.map((t) => {
                return t.allNum;
              }),

              type: "bar",
              barWidth: "22",
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                // formatter: '{c}%',//显示百分号
                textStyle: {
                  //数值样式
                  color: "black", //字体颜色
                  fontSize: 10, //字体大小
                },
              },
              itemStyle: {
                normal: {
                  //柱形图圆角，顺时针左上，右上，右下，左下）
                  barBorderRadius: [12, 12, 12, 12],
                  //设置柱状图颜色渐变
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      color: "#2DE1FD",
                      offset: 1,
                    },
                    {
                      color: "#0E5FFF",
                      offset: 0,
                    },
                  ]),
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
      }
    },
    getEcharts3DBar() {
      var colorArr = ["#0C628C", "#3887D5", "#2570BB"];
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
              color: "#0056FF",
              offset: 0,
            },
            {
              color: "#3D7FFF",
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
              color: "#fa2929",
              offset: 0,
            },
            {
              color: "#f4f43e",
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
              color: "#ff809d",
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
          // 橙色
          colorStops: [
            {
              color: "#ff5810",
              offset: 0,
            },
            {
              color: "#fbac8b",
              offset: 1,
            },
          ],
        },
        ,
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
          // 橙色
          colorStops: [
            {
              color: "#ff5810",
              offset: 0,
            },
            {
              color: "#fbac8b",
              offset: 1,
            },
          ],
        },
      ];
      var barWidth = 30;
      var option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            var str = params[0].name + ":";
            params.filter(function (item) {
              if (item.componentSubType == "bar") {
                str += "<br/>" + item.seriesName + "：" + item.value;
              }
            });
            return str;
          },
        },
        grid: {
          x: "7%",
          x2: "0%",
          y: "15%",
          y2: "15%",
        },
        legend: {
          show: false,
          data: ["本期", "同期"],
          textStyle: {
            color: "#fff",
            fontSize: "20",
          },
        },
        xAxis: {
          data: ["毕节市", "七星关区", "大方县", "黔西县"],
          //坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#214776",
            },
            textStyle: {
              color: "#fff",
              fontSize: "10",
            },
          },
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#C5DFFB",
              fontWeight: 500,
              fontSize: "14",
            },
          },
          axisTick: {
            textStyle: {
              color: "#fff",
              fontSize: "16",
            },
            show: false,
          },
          splitLine: { show: false },
        },
        yAxis: {
          type: "value",
          //坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#214776",
            },
            textStyle: {
              color: "#fff",
              fontSize: "10",
            },
          },
          axisTick: {
            show: false,
          },
          //坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: "#C5DFFB",
            },
          },
          //分格线
          splitLine: {
            lineStyle: {
              color: "#13365f",
            },
          },
        },
        series: [
          {
            z: 1,
            name: "本期",
            type: "bar",
            barWidth: barWidth,
            // barGap: "0%",
            data: data,
            itemStyle: {
              normal: {
                color: color,
              },
            },
          },
          {
            z: 2,
            name: "本期",
            type: "pictorialBar",
            data: sideData,
            symbol: "diamond",
            symbolOffset: ["-75%", "50%"],
            symbolSize: [barWidth, 10],
            itemStyle: {
              normal: {
                color: color,
              },
            },
            tooltip: {
              show: false,
            },
          },
          {
            z: 3,
            name: "本期",
            type: "pictorialBar",
            symbolPosition: "end",
            data: data,
            symbol: "diamond",
            symbolOffset: ["-75%", "-50%"],
            symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: colorArr[2],
              },
            },
            tooltip: {
              show: false,
            },
          },
          {
            z: 1,
            name: "同期",
            type: "bar",
            barWidth: barWidth,
            // barGap: "50%",
            data: data2,
            itemStyle: {
              normal: {
                color: color,
              },
            },
          },
          {
            z: 2,
            name: "同期",
            type: "pictorialBar",
            data: sideData2,
            symbol: "diamond",
            symbolOffset: ["75%", "50%"],
            symbolSize: [barWidth, 10],
            itemStyle: {
              normal: {
                color: color,
              },
            },
            tooltip: {
              show: false,
            },
          },
          {
            z: 3,
            name: "同期",
            type: "pictorialBar",
            symbolPosition: "end",
            data: data2,
            symbol: "diamond",
            symbolOffset: ["75%", "-50%"],
            symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: colorArr[2],
              },
            },
            tooltip: {
              show: false,
            },
          },
        ],
      };
      return option;
    },
  },
};
</script>
  
<style scoped>
.box {
  color: #bddbb2;
}
</style>