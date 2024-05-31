<template>
  <div
    :class="className"
    :style="{ margin: margin, height: height, width: width }"
  />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";
import { mapState } from "vuex";
export default {
  mixins: [resize],
  props: {
    num: {
      type: Number,
      default: 0,
    },
    queryParams: {
      type: Object,
    },
    userId: {
      type: [String, Number, Boolean],
    },
    depID: {
      type: [String, Number, Boolean],
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
      default: "350px",
    },
    initData: {
      type: Array,
      default: () => [],
    },
    chil: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
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
      storageData: [], // session数据存储
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
      // console.log(this.num,this.data,this.initData);
      let color = [
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

      var myFontSize = 20; // 显示文字大小
      var lines = 1; // 行数
      var space = 0.5; // 标签间距，单位
      var myLineHeight = (myFontSize * (lines + space)) / (lines + 2); // 基础行高

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
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          show: false,
          bottom: 10,
          left: "center",
          data: this.data.map((val) => val.name),
        },
        series: [
          {
            type: "pie",
            radius: [20, 100],
            roseType: "radius",
            label: {
              show: true,
              // position: "right",
              formatter: "{b}: {c} ({d}%)\n",
              //数据标签的字体配置，与其他组件相同
              // textStyle: {
              //   fontSize: myLineHeight, //字号
              // },
              fontSize: myLineHeight,

              // rich: {
              //   a: {
              //     fontSize: myFontSize,
              //     //lineHeight: myFontSize,
              //   }
              // }
            },
            labelLine: {
              show: true, //数据标签引导线
              length: 5,
              showAbove: true,
              lineStyle: {
                width: 1,
                type: "solid",
              },
              // length: 5,
              length2: 5,
            },
            center: ["50%", "50%"],
            data: this.data,
            itemStyle: {
              borderRadius: 5, // 重点
            },
            avoidLabelOverlap: true,
            minAngle: 5,
            // emphasis: {
            //   itemStyle: {
            //     borderRadius: [0, 0, 8, 8],
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowColor: "rgba(0, 0, 0, 0.5)",
            //   },
            // },
          },
        ],
        // color: [
        //   "#ee6666",
        //   "#5470c6",
        //   "#91cc75",
        //   "#fac858",
        //   "#73c0de",
        //   "#9a60b4",
        //   "#fc8452",
        //   "#3ba272",
        // ],
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
        ],
      });
      // 取消之前的点击事件
      this.chart.off("click");
      // 事件
      this.chart.on("click", (params) => {
    

        if (this.chil) {
          this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
          this.queryParams.orderByColumn = undefined;
          this.queryParams.isAsc = undefined;
          this.queryParams.setTimeType = this.queryParams.timeType;
          if (this.storageData == null) {
            this.storageData = [];
          }
          this.storageData.push(this.queryParams);
          sessionStorage.setItem(
            "storageDatas",
            JSON.stringify(this.storageData)
          );

          if (this.num == 1) {
            this.commonData.dataSourceList.forEach((element, index) => {
              if (params.name == element.label) {
                this.$router.push(
                  `/newreport/process/detailed?type=3&dataSourceType=${
                    index + 1
                  }&depId=${this.queryParams.deptIds}&timeType=${
                    this.queryParams.timeType
                  }&timeValueBegin=${
                    this.queryParams.timeValueBegin
                  }&timeValueEnd=${this.queryParams.timeValueEnd}&userId=${
                    this.userId
                  }&deptIds=${this.queryParams.deptIds}`
                );
              }
            });
          } else if (this.num == 2) {
            this.commonData.followMethodList.forEach((element, index) => {
              if (params.name == element.label) {
                this.$router.push(
                  `/newreport/process/detailed?type=11&followUpMethod=${element.value}&depId=${this.queryParams.deptIds}&timeType=${this.queryParams.timeType}&timeValueBegin=${this.queryParams.timeValueBegin}&timeValueEnd=${this.queryParams.timeValueEnd}&userId=${this.userId}&deptIds=${this.queryParams.deptIds}`
                );
              }
            });
          }
        } else {
          this.$emit("click", params.data);
        }
      });
    },
  },
};
</script>

<style>
.box {
  color: #fa2929;
}
/* .chart{
  margin: 0 auto ;
} */
</style>