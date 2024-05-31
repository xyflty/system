<template>
  <div class="app-container">
    <CustomerCom
      :queryForm="queryParams"
      :deptOptions="deptOptions"
      :userList="userList"
      :isShowData="false"
      @query="handleQuery"
      @reset="resetQuery"
      @back="handleBack"
    >
      <CityTable
        v-if="pageType === 'cityDistribute'"
        type="detail"
        :parmas="parmas"
        :api="apiFn"
        ref="cityRef"
      ></CityTable>
      <el-card class="box-card" v-else>
        <div slot="header" class="clearfix">
          <div class="card__header">
            <span>{{ tableTitle }}</span>
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
          :getSpanData="getSpanData"
          @view="handleView"
        >
        </MultiTable>
      </el-card>
    </CustomerCom>
  </div>
</template>

<script>
import CustomerCom from "./components/CustomerCom.vue";
import MultiTable from "@/components/MultiTable";
import CityTable from "@/views/newreport/customer/components/CityTable";

import { userAndDept } from "./mixins/userAnddept.js";
import { customerOptions } from "./config/Option";

import { common } from "./mixins/common";
import { storage } from "./mixins/storageData";

// 接口
import {
  customerGradePercentageUserList,
  dataSourcePercentageUserList,
  projectBigClassUserList,
  getCityDistributeUserList,
  getConversionAnalysisList,
} from "@/api/newreport/customer";
export default {
  components: { CustomerCom, MultiTable, CityTable },
  mixins: [userAndDept, common, storage],
  data() {
    return {
      queryParams: {},

      parmas: null,
      apiFn: null,
      pageType: "", //当前页面类型
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
      this.pageType = type;

      this.getData();
    },
    // 通过label获取对应的prop
    getProjectProp(key) {
      switch (key) {
        case "企业服务":
          return "enterpriseServices";

        case "人才服务":
          return "talentServices";
        case "职训服务":
          return "vocationalTrainingServices";
        case "教育中心":
          return "educationCenter";
      }
    },
    getSpanData(arr) {
      if (this.pageType === "project") {
        arr.forEach((item) => {
          item.projectBigClassPieChartList.forEach((ele) => {
            let prop = this.getProjectProp(ele.projectBigClassName);
            item[prop] = ele.projectBigClassCount;
            item[`${prop}Id`] = ele.id;
          });
        });
      }
      return arr;
    },
    // 获取页面数据
    getData() {
      if (this.pageType === "customerGrade") {
        //客户等级占比
        this.apiFn = customerGradePercentageUserList;
      }
      if (this.pageType === "dataSource") {
        //客户等级占比
        this.apiFn = dataSourcePercentageUserList;
      } else if (this.pageType === "project") {
        // 项目大类
        this.apiFn = projectBigClassUserList;
      } else if (this.pageType === "cityDistribute") {
        // 城市分配占比用户列表
        this.apiFn = getCityDistributeUserList;
      } else if (this.pageType === "behavior") {
        // 客户行为(成交次数)
        this.apiFn = getConversionAnalysisList;
      }
      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
    },
  },
  mounted() {
    if (["Pielist"].includes(this.previousRouterName)) {
      this.getStorage();
      const { type } = this.$route.query;
      this.pageType = type;

      this.getData();
    } else {
      this.init();
    }
  },
  computed: {
    Options() {
      let arr = [
        {
          label: "姓名",
          prop: "userName",
        },
        {
          label: "职务",
          prop: "postName",
        },
      ];
      let newOptions = customerOptions[this.pageType].Options.filter(
        (item) => !item.action
      );

      newOptions.splice(1, 0, ...arr);

      return newOptions;
    },
  },
};
</script>

<style lang='scss' scoped>
.box-card {
  margin-top: 15px;
}
</style>

