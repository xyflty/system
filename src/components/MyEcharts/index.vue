<template>
  <div ref="chartEl" style="height: 100%"></div>
</template>

<script>
import echarts from "echarts";
const ChartBlock = {
  name: "MyEcharts",
//   props: {
//     option: {
//       type: Object,
//       default: () => {},
//     },
//   },
  data() {
    return {
      chart: null,
      timer: null,
    };
  },

  mounted() {
    this.chart = echarts.init(this.$refs.chartEl);

    window.addEventListener("resize", this.echartResize);
  },

  methods: {
    // 添加窗口改变监听
    echartResize() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
         
        this.chart.resize();
        clearTimeout(this.timer);
      }, 500);
    
    },
    setOption(option) {
      this.chart && this.chart.setOption(option)
    },
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
        this.chart.setOption(newVal);
      },
      deep: true,
    },
  },
  beforeDestroy() {
    // 移除窗口改变监听
    window.removeEventListener("resize", this.echartResize);
  },
};

/* 注册组件的方法 */
ChartBlock.install = (Vue) => {
  Vue.component(ChartBlock.name, ChartBlock);
};
export default ChartBlock;
</script>

<style lang="scss" scoped>
</style>