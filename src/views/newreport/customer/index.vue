<template>
  <CustomerCom
    ref="CustomerRef"
    :queryForm="queryParams"
    :deptOptions="deptOptions"
    :userList="userList"
    :isBack="false"
    @query="handleQuery"
    @reset="resetQuery"
  >
    <!-- 客户行为分布统计 -->
    <el-card style="margin-top: 10px">
      <div>
        <div>客户行为分布统计</div>
        <customerChart
          class="chart-box"
          v-loading="loading2"
          :initData="echartData1"
        />
      </div>
    </el-card>

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

    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>业绩数据可视化 </span>
        </div>
        <div v-if="isUserRole">
          <el-button
            plain
            @click="
              handleExport('/zw/customerAnalysis/exportDetail', '业绩详细数据')
            "
            v-hasPermi="['zw:customerAnalysis:exportDetail']"
            >导出数据</el-button
          >
        </div>
        <!-- <div v-else>
          <template v-if="miniDepts">
            <el-button
              plain
              @click="
                handleExport('/zw/customerAnalysis/exportUser', '用户业绩数据')
              "
              v-hasPermi="['zw:customerAnalysis:exportUser']"
              >导出数据</el-button
            >
          </template>
          <template v-else>
            <el-button
              plain
              @click="handleExport('/zw/customerAnalysis/export', '业绩数据')"
              v-hasPermi="['zw:customerAnalysis:export']"
              >导出数据</el-button
            >
          </template>
        </div> -->
      </div>
      <template v-if="isUserRole">
        <!-- 个人 -->
        <MultiTable
          v-if="parmas"
          :parmas="parmas"
          border
          align="center"
          isPagination
          stripe
          :api="apiFn"
          :Options="Options"
          @view="JumpDetail"
        >
          <template #projectBigClassList="{ scope }">
            <el-tag
              v-for="tag in scope.projectBigClassList"
              :key="tag"
              type="danger"
              size="small"
              >{{ tag }}
            </el-tag>
          </template>
        </MultiTable>
      </template>
      <template v-else>
        <!-- 部门 -->
        <MultiTable
          v-if="parmas"
          :parmas="parmas"
          border
          align="center"
          stripe
          isIndex
          indexLabel="排名"
          isPagination
          :api="apiFn"
          :Options="Options"
          :getSpanData="getSpanData"
          @view="handleView"
          @setupEvents="setupEvents"
        >
          <template #rata="{ scope }">
            <span v-if="miniDepts">
              {{
                CustomerValueQuality(
                  scope.customerGradeList,
                  "customerGradeCount"
                )
              }}
            </span>
            <span v-else>
              {{ CustomerValueQuality(scope.leftData, "customerCount") }}</span
            >
          </template>
          <template #operation="{ scope }">
            <el-button
              v-if="!miniDepts"
              type="primary"
              size="mini"
              @click="setupEvents({ type: 'viewUser', row: scope.row })"
              >钻取用户</el-button
            >
          </template>
        </MultiTable>
      </template>
    </el-card>
  </CustomerCom>
</template>

<script>
import CustomerCom from "./components/CustomerCom.vue";

import {
  getPieChart,
  getDataHistogram,
  getPerformanceDataList,
  deptJumpEmployeesList,
  employeesJumpDetail,
} from "@/api/newreport/customer";

import customerChart from "newreport/chart/customer1.vue";
import MultiTable from "@/components/MultiTable";
import pieChart from "newreport/chart/pie.vue";

// 通过laebl获取对应的value
import { passLabelGetValue } from "@/utils/common";

import { performanceOptions, detailOption } from "./config/Option";
import { mapState } from "vuex";

import { common } from "./mixins/common";
import { storage } from "./mixins/storageData";
import { userAndDept } from "./mixins/userAnddept.js";

export default {
  name: "NewreportCustomer",
  components: {
    CustomerCom,
    MultiTable,
    customerChart,
    pieChart,
  },
  mixins: [userAndDept, common, storage],
  data() {
    return {
      userList: [],
      deptOptions: [],

      queryParams: {
        userId: "",
        dateType: 1,
        beginTime: "", // 周开始的时间
        endTime: "", // 周结束的时间
        deptIds: [],
        pageNum: 1,
        pageSize: 10,
      },
      // 业绩数据可视化请求参数
      parmas: null,
      // 请求接口
      apiFn: null,
      Options: [], //业绩表格头配置

      loading2: false,
      loading3: false,

      echartData1: [],

      echartData6: [],
      compare: {
        customerGrade: "客户等级占比",
        dataSource: "数据来源占比",
        project: "项目大类占比",
        cityDistribute: "城市分布占比",
      },

      // 饼图数据

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
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    CustomerValueQuality() {
      return (item, prop) => {
        var num = 0;
        item.forEach((item) => {
          if (item.customerGradeName == "C") {
            num += item[prop] * 0.2;
          }
          if (item.customerGradeName == "B") {
            num += item[prop] * 0.23;
          }
          if (item.customerGradeName == "A") {
            num += item[prop] * 0.27;
          }
          if (item.customerGradeName == "VIP") {
            num += item[prop] * 0.3;
          }
        });
        return Number((num / 4 / 100).toFixed(6));
      };
    },
  },

  mounted() {
    this._getNowYear(this.queryParams, "beginTime", "endTime");
    if (this.isExist()) {
      this.getStorage();
      const { deptIds, dateType, endTime, beginTime, userId } =
        this.queryParams;
      this.queryParams = {
        deptIds,
        dateType,
        endTime,
        beginTime,
        userId,
        pageNum: 1,
        pageSize: 10,
      };
      sessionStorage.removeItem("STORAGE_KEY");
      sessionStorage.removeItem("ROUTERNAME");
    }
    this.setOptions();
    if (this.isUserRole) {
      // 个人

      this.queryParams.userId = this.userId;
      this.queryParams.deptIds = [];
    } else {
      // 主管以上
      this.queryParams.deptIds = this.defaultDeptIds; //获取当前登录的部门
      this.queryParams.userId = undefined;
    }

    this.init();

    this.removeRouterName();
  },
  methods: {
    // 设置业绩表格头配置
    setOptions() {
      console.log(this.miniDepts);
      if (this.isUserRole) return (this.Options = detailOption);
      if (this.miniDepts) {
        // 最小的部门
        let userArr = [
          {
            label: "姓名",
            prop: "userName",
          },
          {
            label: "职务",
            prop: "postName",
          },
        ];
        this.Options = [...userArr, ...performanceOptions];
      } else {
        let userArr = [
          {
            label: "主体部门",
            prop: "deptName",
            width: 160,
          },
        ];
        this.Options = [...userArr, ...performanceOptions];
        if (this.noDrill) {
          this.Options = this.Options.filter((item) => !item.action);
        }
      }
    },
    // 处理表格数据
    getSpanData(data) {
      let customerProp = "leftData";
      let countProp = "customerCount";
      if (this.miniDepts) {
        // 最小部门
        customerProp = "customerGradeList";
        countProp = "customerGradeCount";
      }
      data.forEach((item) => {
        item["VIP"] = 0;
        item["A"] = 0;
        item["B"] = 0;
        item["C"] = 0;

        item[customerProp].forEach((ele) => {
          item[ele.customerGradeName] = ele[countProp] || 0;
        });
        // item.rata = this.CustomerValueQuality(item.leftData);
      });

      return data;
    },
    init() {
      this.parmas = null;
      this.$refs["CustomerRef"]._getHeaderData(this.queryParams);
      this.getPieChart();
      this.getDataHistogram();
      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
      console.log(this.parmas, "this.parmas");
      if (this.isUserRole) {
        // 个人（个体）
        this.apiFn = employeesJumpDetail;
      } else {
        // 部门
        if (this.miniDepts) {
          // 最小部门，不显示部门信息，显示当前部门的使用人员信息
          this.apiFn = deptJumpEmployeesList;
        } else {
          this.apiFn = getPerformanceDataList;
        }
      }
    },

    // 个人业务点击数量弹出框
    JumpDetail({ row, column, item }) {
      this.setStorage();
      if (item.label === "客户成交次数") {
        this.$router.push({
          name: "Referralcustomer",
          query: { type: 2, archiveId: row.archiveId },
        });
      } else if (item.label === "转介绍成交客户") {
        this.$router.push({
          name: "Referralcustomer",
          query: { type: 3, archiveId: row.archiveId },
        });
      } else if (item.label === "关联产品数") {
        // 关联产品数
        this.$router.push({
          name: "RelevancyProduct",
          query: { userId: row.userId, archiveId: row.archiveId },
        });
      }
    },

    // 表格操作（钻取）
    setupEvents({ row, type }) {
      let routeName = "Deptanalyse";
      const query = {
        deptIds: [row.deptId].join(","),
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
        dateType: this.queryParams.dateType,
        userId: this.queryParams.userId,
      };
      this.setStorage(query);
      if (type === "drill") {
        if (this.miniDepts) {
          // 最小部门
          routeName = "Detailanalyse";
          query.userId = row.userId;
        }

        this.$router.push({
          name: routeName,
          query: query,
        });
      } else if (type === "viewUser") {
        // 钻取用户
        routeName = "Visualization";
      }

      this.$router.push({
        name: routeName,
        query: query,
      });
    },

    // 客户行为分布统计
    getDataHistogram() {
      this.loading2 = true;
      getDataHistogram(this.queryParams).then((res) => {
        const {
          xname,
          firstDeal,
          twiceDeal,
          manyTimesDeal,
          fansCustomer,
          loyalCustomer,
          firstDealSequentialGrowthRate,
          twiceDealSequentialGrowthRate,
          manyTimesDealSequentialGrowthRate,
          fansCustomerSequentialGrowthRate,
          loyalCustomerSequentialGrowthRate,
        } = res.data;

        // 数据处理
        const arr1 = [
          xname,
          firstDeal,
          twiceDeal,
          manyTimesDeal,
          fansCustomer,
          loyalCustomer,
        ];
        const arr2 = [
          firstDealSequentialGrowthRate,
          twiceDealSequentialGrowthRate,
          manyTimesDealSequentialGrowthRate,
          fansCustomerSequentialGrowthRate,
          loyalCustomerSequentialGrowthRate,
        ];
        arr2.forEach((value, idx) => {
          value &&
            value.forEach((item, index, array) => {
              array[index] = [
                index * 100 + 15 * (idx + 1) + idx * 2,
                arr1[idx + 1][index],
                `${Number(item) * 100}%`,
              ];
            });
        });

        this.echartData1 = [...arr1, ...arr2];

        this.loading2 = false;
      });
    },

    // 获取饼图数据
    getPieChart() {
      this.loading3 = true;
      getPieChart(this.queryParams).then((res) => {
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

    // 拼图钻取按钮操作
    handleDrill(key) {
      let routeName = "Analyselist";
      const query = {
        type: key,
        deptIds: this.queryParams.deptIds.join(","),
        userId: this.queryParams.userId,
        dateType: this.queryParams.dateType,
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
      };
      this.setStorage(query);

      if (this.isUserRole) {
        // 个人
        routeName = "Useranalyselist";
      }

      this.$router.push({
        name: routeName,
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
      this.setStorage(query);

      // 最底层数据展示
      this.$router.push({
        name: "Pielist",
        query: query,
      });
    },

    /** 搜索按钮操作 */
    handleQuery(form) {
      if (!this.queryParams.deptIds.length && !this.isUserRole) {
        this.$message.error("请至少选择一个部门");
        return;
      }
      this.queryParams = form;
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;

      this.init();
    },

    /** 重置按钮操作 */
    resetQuery(formName, model) {
      this.queryParams = {
        userId: "",
        dateType: 1,
        pageNum: 1,
        pageSize: 10,
      };
      this._getNowYear(this.queryParams, "beginTime", "endTime");
      this.queryParams.deptIds = this.defaultDeptIds;
      sessionStorage.removeItem("STORAGE_KEY");
      this.init();
    },

    /** 导出按钮操作 */
    handleExport(url, name) {
      this.download(
        url,
        {
          ...this.query,
          ...this.queryParams,
        },
        `${name}_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style scoped>
.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
}

.chart-box {
  flex: 60%;
}

.table-box {
  flex: 40%;
}

.tip p {
  font-size: 12px;
  line-height: 24px;
  color: rgb(153, 153, 153);
}

.label {
  color: rgb(0, 121, 254);
  font-size: 18px;
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.value {
  color: #000;
  font-size: 20px;
  width: 100px;
  height: 100px;
  line-height: 100px;
}

/* .flex2 {
  flex: 50%;
} */
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flextop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
