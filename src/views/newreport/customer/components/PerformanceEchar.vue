// 业绩挖掘页面公共图表抽离
<template>
  <div>
    <!-- 客户行为 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
        <el-card style="margin-top: 10px" v-loading="loading1">
          <div class="flextop"></div>
          <lineChart :initData="echartData1" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
        <el-card style="margin-top: 10px" v-loading="loading1">
          <div class="flextop">
            <span>客户行为转化分析</span>
            <el-button
              type="primary"
              size="mini"
              @click="handleDrill('behavior')"
              >钻取</el-button
            >
          </div>
          <funnelChart :initData="echartData2" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 饼图 -->
    <el-row :gutter="10">
      <template v-for="(title, key) in compare">
        <el-col :key="key" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card style="margin-top: 10px" v-loading="loading3">
            <div class="flextop">
              <span>{{ title }}</span>
              <el-button
                v-if="PieChartData[key].isDrill"
                type="primary"
                size="mini"
                @click="handleDrill(key)"
                >钻取</el-button
              >
            </div>
            <div></div>
            <pieChart
              height="500px"
              :initData="PieChartData[key].echartData"
              @click="pieClick($event, key)"
            />
          </el-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import {
  getStackedAreaChart,
  getConversionAnalysis,
  getPieChart,
} from "@/api/newreport/customer";

// 图表
import lineChart from "newreport/chart/line.vue";
import funnelChart from "newreport/chart/funnel.vue";
import pieChart from "newreport/chart/pie.vue";

// 通过laebl获取对应的value
import { passLabelGetValue } from "@/utils/common";

import { mapState } from "vuex";

import { storage } from "../mixins/storageData";
export default {
  components: {
    lineChart,
    funnelChart,
    pieChart,
  },
  mixins: [storage],

  data() {
    return {
      loading1: false,
      echartData1: [],
      echartData2: [],

      // 饼图数据
      loading3: false,
      compare: {
        customerGrade: "客户等级占比",
        dataSource: "数据来源占比",
        project: "项目大类占比",
        cityDistribute: "城市分布占比",
      },
      PieChartData: {
        customerGrade: {
          echartData: [],
          isDrill: true, //是否钻取
        },
        dataSource: {
          echartData: [],
          isDrill: true,
        },
        project: {
          echartData: [],
          isDrill: true,
        },
        cityDistribute: {
          echartData: [],
          isDrill: true,
        },
      }, //存储饼图数据

      queryParams: {}, //请求参数
    };
  },
  methods: {
    // 图表挖掘
    handleDrill(key) {
      let query = {
        type: key,
        deptIds: this.queryParams.deptIds.join(","),
        userId: this.queryParams.userId,
        beginTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
        dateType: this.queryParams.dateType,
      };
      this.setStorage(query);
      this.$router.push({
        name: "Analyselist",
        query: query,
      });
    },
    // 饼图点击操作
    pieClick(data, key) {
      const query = {
        type: key,
        deptIds: this.queryParams.deptIds.join(","),
        userId: this.queryParams.userId,
        dateType: this.queryParams.dateType,
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
        dataSourceType: data.id,
      };

      if (key === "project") {
        query.projectBigClassId = data.projectBigClassId;
      } else if (key === "cityDistribute") {
        query.dataSourceType = data.name;
      }
      // 存储数据
      this.setStorage(query);

      // 最底层数据展示
      this.$router.push({
        name: "Pielist",
        query: query,
      });
    },

    // 客户行为柱状图数据
    getDataHistogram(params) {
      this.loading1 = true;
      getStackedAreaChart(params).then((res) => {
        const {
          xname,
          firstDealAmount,
          twiceDealAmount,
          manyTimesDealAmount,
          fansCustomerAmount,
          loyalCustomerAmount,
        } = res.data;

        // 数据处理
        const arr1 = [
          xname,
          firstDealAmount,
          twiceDealAmount,
          manyTimesDealAmount,
          fansCustomerAmount,
          loyalCustomerAmount,
        ];
        this.echartData1 = [...arr1];
        this.loading1 = false;
      });
    },
    getConversionAnalysis(params) {
      getConversionAnalysis(params).then((res) => {
        const {
          firstDealConversionRatio: first,
          twiceDealConversionRatio: twice,
          manyDealConversionRatio: many,
          fansCustomerConversionRatio: fans,
          loyalCustomerConversionRatio: loyal,
        } = res.data;
        this.echartData2 = [
          {
            value: first.substring(0, first.length - 1),
            value1: first,
            name: "首次成交",
          },
          {
            value: twice.substring(0, first.length - 1),
            value1: twice,
            name: "二次成交",
          },
          {
            value: many.substring(0, first.length - 1),
            value1: many,
            name: "多次成交",
          },
          {
            value: fans.substring(0, first.length - 1),
            value1: fans,
            name: "粉丝客户",
          },
          {
            value: loyal.substring(0, first.length - 1),
            value1: loyal,
            name: "忠实客户",
          },
        ];
      });
    },

    // 获取饼图数据
    getPieChart(params) {
      this.loading3 = true;
      getPieChart(params).then((res) => {
        const {
          customerGradeRatioPieChart: P1,
          dataSourceRatioPieChart: P2,
          projectBigClassRatioPieChart: P3,
          cityDistributeRatioPieChart: P4,
        } = res.data;

        const { dataSourceList, customerGradeList } = this.commonData;
        // 客户等级
        this.PieChartData.customerGrade.echartData = P1.map((item) => ({
          id: item.customerGrade,
          name: this.getLabel(customerGradeList, item.customerGrade),
          value: item.customerGradeCount,
        }));
        // 数据来源
        this.PieChartData.dataSource.echartData = P2.map((item) => ({
          id: item.dataSourceName,

          name: this.getLabel(dataSourceList, item.dataSourceName),
          value: item.dataSourceCount,
        }));
        // 项目大类
        this.PieChartData.project.echartData = P3.map((item) => ({
          id: passLabelGetValue(
            this.commonData.customerGrade,
            item.projectBigClassName
          ),
          projectBigClassId: item.id,
          name: item.projectBigClassName,
          value: item.projectBigClassCount,
        }));
        // 城市
        this.PieChartData.cityDistribute.echartData = P4.map((item) => ({
          name: item.cityName,
          value: item.cityCount,
        }));

        this.loading3 = false;
      });
    },
    getCharData(params) {
      this.queryParams = params;
      this.getDataHistogram(params);
      this.getConversionAnalysis(params);
      this.getPieChart(params);
    },
  },
  mounted() {
    this._getCharData = this.getCharData;
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
.flextop {
  display: flex;
  justify-content: space-between;
  height: 30px;
}
</style>