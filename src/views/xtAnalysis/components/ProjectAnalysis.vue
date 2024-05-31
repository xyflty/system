<template>
  <div class="ProjectAnalysis" v-if="isShow">
    <section>
      <div class="pie-list" v-loading="histogramLoading">
        <div class="pie-items" v-for="(key, value) in compare" :key="value">
          <CardEcharts
            :chartData="pieData[value]"
            :title="key['title']"
            @drilling="handleDrilling(key, pieData[value])"
          />
        </div>
      </div>
    </section>

    <section>
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <span>协同工单分布</span>

          <el-radio-group :value="radio" @input="toggleHistogramType">
            <el-radio :label="false">按市场人员</el-radio>
            <span style="padding: 0 10px; color: #999">|</span>
            <el-radio :label="true">按作业人员</el-radio>
          </el-radio-group>
        </div>
        <div class="card-content" v-loading="histogramLoading">
          <Echarts
            :chartData="barData"
            :dataZoom="dataZoom"
            style="height: 450px"
          />
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import CardEcharts from "./CardEcharts.vue";
import Echarts from "@/components/Echarts";

import { mapState } from "vuex";

// 获取项目数据信息
import { project } from "./Options";

export default {
  name: "ProjectAnalysis",
  components: {
    CardEcharts,
    Echarts,
  },
  props: {
    data: {
      type: Object,
    },
    radio: {
      type: Boolean,
    },
    pageType: Number,
    histogramLoading: Boolean,
  },

  data() {
    return {
      // 对照表
      compare: {
        orderJobStatusPieChart: {
          title: "工单状态占比",
          name: "orderJobStatus",
          tableName: "工单状态",
          caption: "工单状态占比", //表格标题
        },
        orderJobCategoryPieChart: {
          title: "",
          name: "projectName",
          tableName: "",
          caption: "", //表格标题
        },
        orderJobDeptPieChart: {
          title: "",
          name: "deptName",
          tableName: "部门名称",
          caption: "部门占比", //表格标题
        },
        orderJobSignSubjectPieChart: {
          title: "签约主体分布占比",
          name: "subjectDeptName",
          tableName: "签约主体",
          caption: "办理地区分布占比", //表格标题
        },
        orderJobTransactAreaPieChart: {
          title: "",
          name: "area",
          tableName: "办理地区",
          caption: "", //表格标题
        },
        customerAreaPieChart: {
          title: "客户地区分布占比",
          name: "area",
          tableName: "客户地区",
          caption: "客户所在地区分布占比", //表格标题
        },
        collectionPricePhasePieChart: {
          title: "收款阶段分布占比",
          name: "moneyTag",
          tableName: "收款阶段",
          caption: "收款阶段分布占比", //表格标题
        },
        productNaturePieChart: {
          title: "产品性质分布占比",
          name: "isGift",
          tableName: "产品性质",
          caption: "产品性质分布占比", //表格标题
        },
        timelinessWarnPieChart: {
          title: "时效预警分布",
          name: "warnType",
          tableName: "时效预警类型",
          caption: "时效预警分布占比", //表格标题
        },
      },

      barCompare: {
        canceled: "已取消",
        finished: "已完结",
        jobInProgress: "正在作业",
        notActivated: "未激活",
        suspended: "已暂缓",
        timeoutWarn: "超时预警",
      }, //条形图对照表

      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 8,
        },
        {
          start: 0,
          end: 8,
          handleIcon:
            "M10.7,0.7c-0.3-0.3-0.8-0.3-1.1,0L4,5.9V2.5C4,1.1,2.9,0,1.5,0S0,1.1,0,2.5v6C0,9.9,1.1,11,2.5,11 S5,9.9,5,8.5v-3.4l5.6-5.2C11,0.4,11,0,10.7,0.7z M2.5,8.5c-0.8,0-1.5-0.7-1.5-1.5v-6C1,0.7,1.7,0,2.5,0S4,0.7,4,1.5v3.4L2.4,5.9 C2.2,6.1,2.2,6.4,2.5,6.3l6-5.6c0.3-0.3,0.8-0.3,1.1,0L13,5.1V8.5c0,0.8-0.7,1.5-1.5,1.5S10,9.3,10,8.5v-6C10,1.1,8.9,0,7.5,0 S5,1.1,5,2.5v3.4L2.5,8.5C2.3,8.7,2.3,9,2.5,8.5z",
          handleSize: "80%",

          handleStyle: {
            color: "#fff",
            shadowBlur: 3,
            shadowColor: "rgba(255, 255, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
        // {
        //   show: false,
        //   yAxisIndex: 0,
        //   filterMode: "empty",
        //   width: 30,
        //   height: "80%",
        //   showDataShadow: false,
        //   left: "93%",
        // },
      ],
      pieData: {}, //饼图数据
      barData: {
        xData: [],
        series: [],
      },
      isShow: false,
      labelOption: {},
    };
  },
  methods: {
    handleDrilling(key, value) {
      const { series } = value;

      let data = series[0].data;

      this.$emit("drilling", { row: key, data });
    },
    toggleHistogramType(val) {
      this.$emit("toggle", val);
    },

    getLabel(data, prop) {
      let row = data.find((ele) => ele.value == prop);
      return row && row.label;
    },
    // 生成图表数据
    generateSeries(item, key) {
      if (this.compare[key]["name"] === "orderJobStatus") {
        return {
          id: item[this.compare[key]["name"]],
          name: this.getLabel(
            this.commonData.orderJobStatus,
            item["orderJobStatus"]
          ),
          value: item.orderJobCount,
          percentage: item.percentage,
        };
      } else if (this.compare[key]["name"] === "warnType") {
        return {
          id: item[this.compare[key]["name"]],
          name: this.getLabel(this.commonData.warnType, item["warnType"]),
          value: item.orderJobCount,
          percentage: item.percentage,
        };
      } else if (this.compare[key]["name"] === "isGift") {
        return {
          id: item[this.compare[key]["name"]],
          name: ["非赠品", "赠品"][item["isGift"]],
          value: item.orderJobCount,
          percentage: item.percentage,
        };
      } else {
        return {
          id:
            key === "orderJobDeptPieChart"
              ? item.deptId
              : item[this.compare[key]["name"]],
          name: item[this.compare[key]["name"]],
          value:
            key === "customerAreaPieChart"
              ? item.customerCount
              : item.orderJobCount,
          percentage: item.percentage,
        };
      }
    },
    // 处理图标数据
    dealData() {
      for (const key in this.data) {
        if (this.compare.hasOwnProperty(key)) {
          this.pieData[key] = {
            series: [],
          };
          let data = [];
          if (this.data[key] && this.data[key].length) {
            data = this.data[key].map((item) => this.generateSeries(item, key));
          } else {
            // 数据为空，默认[]
            data = [];
          }

          this.pieData[key].series.push({
            data: data,
            type: "pie",
            label: {
              show: true,
              formatter(param) {
                // correct the percentage

                return param.name + " (" + param.percent + "%)\n";
              },
            },
          });
        } else {
          if (key == "personHistogramChartContainer") {
            // 柱状图
            let newData = this.data["personHistogramChartContainer"];
            this.barData.series = [];

            for (const key in this.barCompare) {
              let data = newData[key];

              this.barData.series.push({
                name: this.barCompare[key],
                data: data,

                emphasis: {
                  focus: "series",
                },
                type: "bar",
                itemStyle: {
                  normal: {
                    //柱形图圆角，顺时针左上，右上，右下，左下）
                    barBorderRadius: [12, 12, 12, 12],
                    //设置柱状图颜色渐变
                  },
                },
              });
            }

            this.barData.xData = newData.xname;
          }
        }
      }
      this.isShow = true;
    },

    getApp() {
      this.labelOption = {
        show: true,
        position: "insideBottom",
        distance: 15,
        align: "left",
        verticalAlign: "middle",
        rotate: 90,
        formatter: "{c}  {name|{a}}",
        fontSize: 14,
        rich: {
          name: {},
        },
      };
    },

    // 判断当前是项目那个项目
    setCompareTitle() {
      let str = project.find((item) => item.value === this.pageType).label;
      // 工单分类占比
      this.compare.orderJobCategoryPieChart.title = `${str}工单分类占比`;
      this.compare.orderJobCategoryPieChart.caption = `${str}工单分类占比`;
      this.compare.orderJobCategoryPieChart.tableName = `${str}分类`;
      // 工单部门占比
      this.compare.orderJobDeptPieChart.title = `${str}工单部门占比`;
      // 办理地区分布占比
      if ([4, 5, 6].includes(this.pageType)) {
        delete this.compare.orderJobTransactAreaPieChart;
      } else {
        this.compare.orderJobTransactAreaPieChart.title = `${str}办理地区分布占比`;
        this.compare.orderJobTransactAreaPieChart.caption = `${str}办理地区分布占比`;
      }
    },
  },
  mounted() {
    this.setCompareTitle();
    this.getApp();
    this.dealData();
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    data: {
      handler(newval) {
        this.isShow = false;
        this.dealData();
      },
      deep: true,
    },
    radio: {
      handler(newval) {
        if (newval) {
          this.dataZoom[0].end = 20;
        } else {
          this.dataZoom[0].end = 8;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang='scss' scoped>
section {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  > div {
    margin-left: 20px;
    span {
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.pie-list {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  grid-column-gap: 15px;
  grid-row-gap: 15px;
}

::v-deep .el-radio {
  margin: 0;

  .el-radio__input {
    display: none;
  }
  .el-radio__label {
    padding: 0;
  }
}
</style>