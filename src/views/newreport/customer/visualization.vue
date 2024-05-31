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
          v-hasPermi="['zw:customerAnalysis:exportUser']"
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
        isPagination
        :api="apiFn"
        :Options="Options"
        :getSpanData="getSpanData"
        @view="handleView"
        @setupEvents="setupEvents"
      >
        <template #rata="{ scope }">
          {{ CustomerValueQuality(scope.customerGradeList) }}
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
import { deptJumpEmployeesList } from "@/api/newreport/customer";

import { mapState } from "vuex";
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
      Options: [], //业绩表格头配置
    };
  },
  methods: {
    // 设置业绩表格头配置
    setOptions() {
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
    },

    init() {
      const { type, dateType, deptIds, userId, beginTime, endTime } =
        this.$route.query;

      this.queryParams = {
        userId: userId,
        beginTime: beginTime, // 周开始的时间
        endTime: endTime, // 周结束的时间
        dateType: +dateType,
        deptIds: deptIds ? deptIds.split(",") : null,
        pageNum: 1,
        pageSize: 10,
      };
      this.getData();
    },
    getData() {
      this.$refs["CustomerRef"]._getHeaderData(this.queryParams);
      this.$refs["performanceRef"]._getCharData(this.queryParams);

      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
      this.apiFn = deptJumpEmployeesList;
    },

    // 业务数据分析 start

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/zw/customerAnalysis/exportUser",
        {
          ...this.query,
          ...this.queryParams,
        },
        `用户业绩数据_${new Date().getTime()}.xlsx`
      );
    },

    // 处理表格数据
    getSpanData(data) {
      data.forEach((item) => {
        item["VIP"] = 0;
        item["A"] = 0;
        item["B"] = 0;
        item["C"] = 0;
        item.customerGradeList.forEach((ele) => {
          item[ele.customerGradeName] = ele.customerGradeCount || 0;
        });
        // item.rata = this.CustomerValueQuality(item.leftData);
      });

      return data;
    },

    // 表格操作（钻取）
    setupEvents({ row, type }) {
      let query = {
        deptIds: [row.deptId].join(","),
        userId: row.userId,
        endTime: this.queryParams.endTime,
        beginTime: this.queryParams.beginTime,
        dateType: this.queryParams.dateType,
      };
      this.setStorage(query);
      if (type === "drill") {
        this.$router.push({
          name: "Detailanalyse",
          query: query,
        });
      }
    },
    // 业务数据分析 end
  },
  mounted() {
    this.setOptions();

    if (
      ["Detailanalyse", "Analyselist", "Pielist"].includes(
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
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    CustomerValueQuality() {
      return (item) => {
        var num = 0;
        item.forEach((ele) => {
          if (ele.customerGradeName == "C") {
            num += ele.customerGradeCount * 0.2;
          }
          if (ele.customerGradeName == "B") {
            num += ele.customerGradeCount * 0.23;
          }
          if (ele.customerGradeName == "A") {
            num += ele.customerGradeCount * 0.27;
          }
          if (ele.customerGradeName == "VIP") {
            num += ele.customerGradeCount * 0.3;
          }
        });

        return Number((num / 4 / 100).toFixed(6));
      };
    },
  },
};
</script>

<style lang='scss' scoped>
.flextop {
  display: flex;
  justify-content: space-between;
  height: 30px;
}
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>