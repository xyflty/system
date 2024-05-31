<template>
  <div>
    <CustomerCom
      :queryForm="queryParams"
      :deptOptions="deptOptions"
      :userList="userList"
      :isShowData="false"
      :isData="false"
      @query="handleQuery"
      @reset="resetQuery"
      @back="handleBack"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="card__header">
            <span>{{ getTableTitle() }}</span>
          </div>
        </div>

        <MultiTable
          v-if="parmas"
          :parmas="parmas"
          border
          stripe
          align="center"
          isPagination
          :api="apiFn"
          :Options="Options"
          @view="handleView"
        >
          <template #projectBigClassList="{ scope }">
            <el-tag
              v-for="tag in scope[projectBigClassProp]"
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
import CustomerCom from "./components/CustomerCom.vue";
import MultiTable from "@/components/MultiTable";

import { userAndDept } from "./mixins/userAnddept.js";
import { common } from "./mixins/common";

import { pielistOptions } from "./config/Option";

// 接口
import {
  customerGradePercentageUserList,
  dataSourceTypeList,
  getProjectBigClassList,
  getBusinessPercentagesList,
  employeesJumpDetail,
  jumpDealList,
  jumpCustomerList,
} from "@/api/newreport/customer";
export default {
  components: { CustomerCom, MultiTable },
  mixins: [common, userAndDept],
  data() {
    return {
      queryParams: {},

      parmas: null,
      apiFn: null,
      pageType: "", //当前页面类型
      dataSourceType: "", //当前展示数据的类型

      projectBigClassProp: "projectBigClassList", //定义项目大类的参数名
    };
  },
  methods: {
    init() {
      const {
        type,
        deptIds,
        userId,
        dateType,
        endTime,
        beginTime,
        dataSourceType,
        projectBigClassId,
      } = this.$route.query;

      this.queryParams = {
        userId: userId,
        dateType: dateType,
        endTime: endTime,
        beginTime: beginTime,
        deptIds: deptIds ? deptIds.split(",") : null,
        projectBigClassId: projectBigClassId,
        pageNum: 1,
        pageSize: 10,
      };
      this.pageType = type;
      this.dataSourceType = dataSourceType;

      this.getData();
    },

    getData() {
      // 参数名称
      let dataType = "";

      if (this.pageType === "customerGrade") {
        //客户等级占比
        this.apiFn = customerGradePercentageUserList;
        dataType = "customerGrade";
      } else if (this.pageType === "dataSource") {
        // 数据来源占比
        this.apiFn = dataSourceTypeList;
        dataType = "dataSourceType";
      } else if (this.pageType === "project") {
        //项目大类占比
        this.apiFn = getProjectBigClassList;
        dataType = "projectType";
      } else if (this.pageType === "cityDistribute") {
        //城市分布占比
        this.apiFn = getBusinessPercentagesList;
        dataType = "cityName";
        // 城市的参数名称不一致
        this.projectBigClassProp = "projectBigClassName";
      } else if (this.pageType === "customer") {
        //客户数量
        this.apiFn = employeesJumpDetail;
        this.dataSourceType = "客户数量";
      } else if (this.pageType === "behavior") {
        //成交次数
        this.apiFn = jumpDealList;
        dataType = "dealType";
      } else if (this.pageType === "fans") {
        // 粉丝客户
        this.apiFn = jumpCustomerList;
        dataType = "customerType";
      }
      this.queryParams[dataType] = this.dataSourceType;
      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
    },

    handleQuery(form) {
      if (!this.queryParams.deptIds.length) {
        this.$message.error("请至少选择一个部门");
        return;
      }
      this.queryParams = form;
      this.getData();
    },
    resetQuery(formName) {
      formName.resetFields();

      this.init();
    },

    getTableTitle() {
      if (!this.pageType) return;
      const { Grade } = pielistOptions[this.pageType];
      if (["project"].includes(this.pageType)) {
        // 项目大类
        return Grade[this.dataSourceType];
      } else if (["cityDistribute", "customer"].includes(this.pageType)) {
        // 城市占比
        return this.dataSourceType;
      }
      // 其他

      return Grade[this.dataSourceType - 1];
    },

    // 表格数据点击回调
    handleView({ row, _, item }) {
      if (item.prop === "associatedProductCount") {
        // 关联产品数

        this.$router.push({
          name: "RelevancyProduct",
          query: { userId: row.userId, archiveId: row.archiveId },
        });
      }
      if (item.label === "转介绍成交客户") {
        this.$router.push({
          name: "Referralcustomer",
          query: { type: 1, archiveId: row.archiveId },
        });
      }
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    Options() {
      return pielistOptions[this.pageType].Options;
    },
  },
  watch: {
    "$route.query": {
      handler(newVal) {
        this.init();
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.box-card {
  margin-top: 15px;
}
</style>

