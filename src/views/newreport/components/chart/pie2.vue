<template>
  <div @mousemove.prevent :class="className" :style="{ height: height, width: width }" />
</template>

<!-- 这是产品销售情况分析的柱形图 -->
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

  methods: {

    initChart() {

      // console.log('数据获取的', this.data, this.initData);

      var color = ["#3aa1ff", "#4ecb73", "#fbd437", "#435188", "#975fe5"];
      let data = []
      this.initData.map((t) => {

        data.push(t.projectName)

      })

      let data2 = []
      let data3 = []
      this.initData.map((t, index) => {
        data2.push(t.zwzx,)
        return data3.push(t.dyjtj)

      })




      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
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
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'none',    // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
            snap: false,    // 坐标轴指示器是否自动吸附到点上。默认自动判断。

            animation: true,     // 是否开启动画
            animationDuration: 1000,     // 初始动画时长
            animationDurationUpdate: 200,    // 数据更新动画的时长
          },
          backgroundColor: 'rgba(50,50,50,0.7)',
        },
        legend: {
          show: true,

        },
        xAxis: {
          type: 'category',
          data: data
        },
        yAxis: {
          type: 'value',
          data: [0, 100, 200, 300, 400, 500, 600, 700, 800]
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: {
        //       show: true,
        //       readOnly: false,
        //       //修改数据视图格式
        //       optionToContent: function (opt) {
        //         //修改数据视图代码最后贴出，此处不做过多展示
        //       }
        //     },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //     dataZoom: {
        //       show: true,
        //     }
        //   }
        // },

        dataZoom: [
          {
            show: true,
            start: 0,
            end: 20
          },
          {
            type: 'inside',
            start: 0,
            end: 20
          },

        ],
        series: [{
          name: '第二集团军',
          type: 'bar',
          data: data2,
          stack: 'total',
          // barWidth:'50%',
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
        },
        {
          name: '第一集团军',
          type: 'bar',
          data: data3,
          stack: 'total',
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
        }],


      });
    },
  },
};
</script>
