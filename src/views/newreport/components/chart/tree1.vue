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
      var color = [
        "#5b9e3a",
        "#d29306",
        "#298aaf",
        "#fac858",
        // "#73c0de",
        // "#9a60b4",
        // "#fc8452",
        // "#3ba272",
      ];
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "",
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          selectedMode: "single",
        },
        tooltip: {
          trigger: "item",
          // formatter: "{b}: {c}",
          formatter: function (params) {
            const { name, value } = params;
            var result = `${name}：${value[0]}个 ${
              value[1] ? value[1] + "元" : ""
            }`;
            return result;
          },
        },
        calculable: false,
        series: this.data.map((item, index) => {
          return {
            type: "treemap",
            breadcrumb: { show: false },

            name: item.name,
            data: item.children,
            // roam: false,
            label: {
              normal: {
                formatter: function (params) {
                  let result = "";
                  const data = params.data;
                  result +=
                    data.name +
                    "\n\n" +
                    data.value[0] +
                    "个" +
                    (data.value[1] ? " \n\n ￥" + data.value[1] : "");

                  return result;
                },
              },
            },
            levels: [
              {
                color: [color[index]],
                itemStyle: {
                  borderColor: "#fff",
                  borderWidth: 2,
                  gapWidth: 2,
                },
              },
              {
                colorSaturation: [0.4, 0.7],
                itemStyle: {
                  borderColorSaturation: 0.7,
                  gapWidth: 2,
                  borderWidth: 2,
                },
              },
            ],
          };
        }),
      });
    },
  },
};
</script>
