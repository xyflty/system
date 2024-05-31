<template>
  <CustomerCom
    ref="CustomerRef"
    :queryForm="queryParams"
    :deptOptions="deptOptions"
    :userList="userList"
    @query="handleQuery"
    @reset="resetQuery"
    @back="handleBack"
  >
    <PerformanceEchar ref="performanceRef" />

    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>业绩数据可视化 </span>
        </div>
        <!-- <el-button
          plain
          @click="handleExport"
          v-hasPermi="['zw:customerAnalysis:export']"
          >导出数据</el-button
        > -->
      </div>
      <MultiTable
        v-if="parmas"
        :parmas="parmas"
        border
        align="center"
        stripe
        isIndex
        indexLabel="排名"
        :api="apiFn"
        :Options="Options"
        :getSpanData="getSpanData"
        @view="handleView"
        @setupEvents="setupEvents"
      >
        <template #rata="{ scope }">
          {{ CustomerValueQuality(scope.leftData) }}
        </template>
        <template #operation="{ scope }">
          <el-button
            type="primary"
            size="mini"
            @click="setupEvents({ type: 'viewUser', row: scope.row })"
            >钻取用户</el-button
          >
        </template>
      </MultiTable>
    </el-card>
  </CustomerCom>
</template>

<script>
// 组件
import CustomerCom from "./components/CustomerCom.vue";
import MultiTable from "@/components/MultiTable";
import PerformanceEchar from "./components/PerformanceEchar.vue";

// 混入minis
import { common } from "./mixins/common";
import { userAndDept } from "./mixins/userAnddept.js";

import { performanceOptions } from "./config/Option";

// api
import { getPerformanceDataList } from "@/api/newreport/customer";

import { storage } from "./mixins/storageData";
export default {
  components: {
    CustomerCom,
    MultiTable,
    PerformanceEchar,
  },
  mixins: [common, userAndDept, storage],
  data() {
    return {
      queryParams: {},

      // 业绩数据可视化请求参数
      parmas: {},
      // 请求接口
      apiFn: null,
      Options: performanceOptions, //业绩表格头配置
      previousRouterName: "",
    };
  },
  methods: {
    // 设置业绩表格头配置
    setOptions() {
      let userArr = [
        {
          label: "主体部门",
          prop: "deptName",
          width: 160,
        },
      ];
      this.Options = [...userArr, ...performanceOptions];
    },

    init() {
      const { type, dateType, deptIds, userId, beginTime, endTime } =
        this.$route.query;

      let dealDeptIds = null;
      if (typeof deptIds === "string") {
        dealDeptIds = deptIds.split(",");
      } else {
        dealDeptIds = deptIds;
      }

      this.queryParams = {
        userId: userId,
        beginTime: beginTime, // 周开始的时间
        endTime: endTime, // 周结束的时间
        dateType: +dateType,
        deptIds: deptIds ? dealDeptIds : null,
        pageNum: 1,
        pageSize: 10,
      };

      this.getData();
    },
    getData() {
      this.$refs["CustomerRef"]._getHeaderData(this.queryParams);
      this.$refs["performanceRef"]._getCharData(this.queryParams);
      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
      this.apiFn = getPerformanceDataList;
    },

    // 业务数据分析 start
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/zw/customerAnalysis/export",
        {
          ...this.query,
          ...this.queryParams,
        },
        `业绩数据_${new Date().getTime()}.xlsx`
      );
    },
    // 处理表格数据
    getSpanData(data) {
      data.forEach((item) => {
        item["VIP"] = 0;
        item["A"] = 0;
        item["B"] = 0;
        item["C"] = 0;
        item.leftData.forEach((ele) => {
          item[ele.customerGradeName] = ele.customerCount;
        });
        // item.rata = this.CustomerValueQuality(item.leftData);
      });

      return data;
    },

    // 表格操作（钻取）
    setupEvents({ row, type }) {
      let routeName = "Deptanalyse";
      let query = {
        deptIds: [row.deptId].join(","),
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
        dateType: this.queryParams.dateType,
        userId: this.queryParams.userId,
      };
      if (type === "drill") {
        // 存储数据

        if (
          this.lastDept.some((i) => {
            return i == row.deptId;
          })
        ) {
          this.setStorage(query);
          routeName = "Visualization";
          this.$router.push({
            name: routeName,
            query: query,
          });
        } else {
          let deptIds = this.getTreeselectList1(this.deptOptions, row.deptId);

          query.deptIds = deptIds;
          this.queryParams = query;
          this.getData();

          this.$router.push({
            name: "Deptanalyse",
            query: query,
          });
        }
      } else if (type === "viewUser") {
        this.setStorage(query);
        routeName = "Visualization";
        this.$router.push({
          name: routeName,
          query: query,
        });
        // 钻取用户
      }
    },
    // 业务数据分析 end
    // 返回
    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.setOptions();
    if (
      ["Analyselist", "Visualization", "Pielist"].includes(
        this.previousRouterName
      )
    ) {
      this.getStorage();

      this.getData();
    } else {
      this.init();
    }
  },

  computed: {
    CustomerValueQuality() {
      return (item) => {
        var num = 0;
        item.forEach((item) => {
          if (item.customerGradeName == "C") {
            num += item.customerCount * 0.2;
          }
          if (item.customerGradeName == "B") {
            num += item.customerCount * 0.23;
          }
          if (item.customerGradeName == "A") {
            num += item.customerCount * 0.27;
          }
          if (item.customerGradeName == "VIP") {
            num += item.customerCount * 0.3;
          }
        });
        return Number((num / 4 / 100).toFixed(6));
      };
    },
  },
  watch: {
    $route: {
      handler(newVal) {
        this.init();
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>