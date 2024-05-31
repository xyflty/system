<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/views/dashboard/mixins/resize";
import "./guangdong.js";

const animationDuration = 3000;
// const mydata = [
//   { name: "深圳市", value: "0" },
//   { name: "广州市", value: "0" },
//   { name: "珠海市", value: "0" },
//   { name: "东莞市", value: "0" },
//   { name: "佛山市", value: "0" },
//   { name: "中山市", value: "0" },
//   { name: "惠州市", value: "0" },
//   { name: "江门市", value: "0" },
//   { name: "湛江市", value: "0" },
//   { name: "梅州市", value: "0" },
//   { name: "肇庆市", value: "0" },
//   { name: "茂名市", value: "0" },
//   { name: "阳江市", value: "0" },
//   { name: "云浮市", value: "0" },
//   { name: "清远市", value: "0" },
//   { name: "韶关市", value: "0" },
//   { name: "河源市", value: "0" },
//   { name: "潮州市", value: "0" },
//   { name: "汕尾市", value: "0" },
//   { name: "揭阳市", value: "0" },
//   { name: "汕头市", value: "0" },
// ];
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
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        backgroundColor: "#FFFFFF",
        title: {
          text: "",
          subtext: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
        },

        //左侧小导航图标
        visualMap: {
          show: true,
          x: "0",
          y: "center",
          splitList: [
            { start: 50000 },
            { start: 10000, end: 50000 },
            { start: 5001, end: 10000 },
            { start: 1001, end: 5000 },
            { start: 501, end: 1000 },
            { start: 101, end: 500 },
            { start: 11, end: 100 },
            { start: 0, end: 10 },
          ],
          color: [
            "#b40000",
            "#e80e0e",
            "#ff7f00",
            "#ffec45",
            "#45ba45",
            "#4fd27d",
            "#47acea",
            "#7bc6ef",
          ],
        },

        //配置属性
        series: [
          {
            name: "新增客户",
            type: "map",
            mapType: "广东",
            roam: false,
            label: {
              normal: {
                show: true, //省份名称
              },
              emphasis: {
                show: false,
              },
            },
            data: this.data[0], //数据
          },
        ],
      });
    },
  },
};
</script>
