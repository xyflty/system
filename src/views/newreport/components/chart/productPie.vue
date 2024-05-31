<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>
  
<!-- 这是产品销售情况分析的扇形图 -->
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
      default: "550px",
    },
    initData: {
      type: Array,
      default: () => [],
    },
    chil: {
      type: Boolean,
      default: false,
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
      // console.log('扇形图数据', this.initData);
      this.chart = echarts.init(this.$el, "macarons");
      let data = [];

      data = this.initData.map((t) => {
        // data.push(t.projectName,t.projectNameNum)
        if (t.projectName) {
          return {
            id: t.nextCategoryId,
            value: t.projectNameNum,
            name: t.projectName,
          };
        } else if (t.secondCategoryName) {
          return {
            id: t.nextCategoryId,
            value: t.secondCategoryNameNum,
            name: t.secondCategoryName,
          };
        } else if (t.projectTypeName) {
          return {
            id: t.nextCategoryId,
            value: t.projectTypeNameNum,
            name: t.projectTypeName,
          };
        } else {
          return {
            value: t.cityNum,
            name: t.city,
          };
        }
      });

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

          top: "70%",
        },
        series: [
          {
            type: "pie",
            radius: "45%",
            roseType: "radius",
            label: {
              show: true,
              position: "right",
              formatter: "{b}: {c} ({d}%)\n",
              //数据标签的字体配置，与其他组件相同
              textStyle: {
                fontSize: 10, //字号
              },
            },
            labelLine: {
              show: true, //数据标签引导线
              length: 5,
              showAbove: true,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            center: ["50%", "50%"],
            data: data,
            itemStyle: {
              borderRadius: 5, // 重点
            },
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
          if (this.num == 1) {
            this.commonData.dataSourceList.forEach((element, index) => {
              if (params.name == element.label) {
                this.$router.push(
                  `/newreport/process/detailed?type=3&dataSourceType=${
                    index + 1
                  }&depId=${this.depID}&timeType=${
                    this.queryParams.timeType
                  }&timeValueBegin=${
                    this.queryParams.timeValueBegin
                  }&timeValueEnd=${this.queryParams.timeValueEnd}&userId=${
                    this.userId
                  }`
                );
              }
            });
          } else if (this.num == 2) {
            this.commonData.followMethodList.forEach((element, index) => {
              if (params.name == element.label) {
                this.$router.push(
                  `/newreport/process/detailed?type=11&followUpMethod=${element.value}&depId=${this.depID}&timeType=${this.queryParams.timeType}&timeValueBegin=${this.queryParams.timeValueBegin}&timeValueEnd=${this.queryParams.timeValueEnd}&userId=${this.userId}`
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


<style scoped  lang="scss">
.box {
  color: #44d7b6;
}
</style>
  