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
    type: {
      type: Boolean,
      default: false,
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
      var _this = this;
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        title: {
          text: "",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return params.data.name + "</br>" + params.data.value1;
          },
        },

        legend: {
          show: false,
        },
        series: [
          {
            name: "客户交易行为漏斗",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 80,
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            // sort: _this.type ? "ascending" : "descending", //descending
            sort: "none",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: this.data,
            labelLayout: {
              draggable: true,
            },
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
