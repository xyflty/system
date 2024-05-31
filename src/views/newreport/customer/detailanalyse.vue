<template>
  <div>
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
            <span>详细分析列表 </span>
          </div>

          <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:exportDetail']"
            >导出数据</el-button
          >
        </div>
        <MultiTable
          v-if="parmas"
          :parmas="parmas"
          border
          align="center"
          stripe
          isPagination
          :api="apiFn"
          :Options="Options"
          @view="handleView"
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
      </el-card>
    </CustomerCom>
  </div>
</template>

<script>
// 组件
import CustomerCom from "./components/CustomerCom.vue";
import MultiTable from "@/components/MultiTable";

import PerformanceEchar from "./components/PerformanceEchar.vue";

// 混入minis
import { common } from "./mixins/common";
import { userAndDept } from "./mixins/userAnddept.js";

import { detailOption } from "./config/Option";

// api
import { employeesJumpDetail } from "@/api/newreport/customer";

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
      Options: detailOption, //业绩表格头配置

      // 关联产品数
    };
  },
  methods: {
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
      this.apiFn = employeesJumpDetail;
    },

    handleView({ row, column, item }) {
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

    // 业务数据分析 start
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/zw/customerAnalysis/exportDetail",
        {
          ...this.query,
          ...this.queryParams,
        },
        `业绩详细数据_${new Date().getTime()}.xlsx`
      );
    },

    // 表格操作（钻取）
    setupEvents({ row, type }) {
      if (type === "drill") {
        let routeName = "Deptanalyse";
        let query = {
          deptIds: [row.deptId].join(","),
          endTime: this.queryParams.endTime,
          beginTime: this.queryParams.beginTime,
          dateType: this.queryParams.dateType,
        };
        if (
          this.lastDept.some((i) => {
            return i == row.deptId;
          })
        ) {
          routeName = "Visualization";
        } else {
          routeName = "Deptanalyse";
          let deptIds = this.getTreeselectList1(this.deptOptions, row.deptId);

          query.deptIds = deptIds;
        }

        this.$router.push({
          name: routeName,
          query: query,
        });
      }
    },
    // 业务数据分析 end
  },
  mounted() {
    if (
      ["Analyselist", "Pielist", "Referralcustomer"].includes(
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