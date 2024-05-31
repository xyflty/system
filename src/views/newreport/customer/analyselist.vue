<template>
  <div class="">
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
        :parmas="parmas"
        :api="apiFn"
        ref="cityRef"
        @pieClick="setupEvents"
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
          align="center"
          isPagination
          stripe
          :api="apiFn"
          :Options="Options"
          @view="handleView"
          @setupEvents="setupEvents"
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

import { customerOptions } from "./config/Option";

import { common } from "./mixins/common";
import { storage } from "./mixins/storageData";

import { userAndDept } from "./mixins/userAnddept.js";

// 接口
import {
  dataSourcePercentageDeptList,
  projectBigClassDeptList,
  getCityDistributeTeamList,
  customerGradePercentageDeptList,
  getConversionAnalysisDeptList,
} from "@/api/newreport/customer";
import Timeline from "../../core/components/timeline.vue";
export default {
  components: {
    CustomerCom,
    MultiTable,
    CityTable,
    Timeline,
  },
  mixins: [userAndDept, common, storage],
  data() {
    return {
      queryParams: {},
      userList: [],
      deptOptions: [],

      apiFn: null,
      parmas: null,

      pageType: "",
      markIndex: 0,
    };
  },
  methods: {
    // 初始化筛选条件参数
    init() {
      this.queryParams = {};
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

      this.pageType = type;

      this.getData();
    },
    // 获取页面数据
    getData() {
      this.parmas = {};

      if (this.pageType === "customerGrade") {
        //客户等级占比
        this.apiFn = customerGradePercentageDeptList;
      } else if (this.pageType === "dataSource") {
        //
        this.apiFn = dataSourcePercentageDeptList;
      } else if (this.pageType === "project") {
        // 项目大类
        this.apiFn = projectBigClassDeptList;
      } else if (this.pageType === "cityDistribute") {
        // 城市分配占比用户列表
        this.apiFn = getCityDistributeTeamList;
      } else if (this.pageType === "behavior") {
        // 客户行为(成交次数)
        this.apiFn = getConversionAnalysisDeptList;
      }

      this.parmas = JSON.parse(JSON.stringify(this.queryParams));
    },

    // 处理表格数据
    getSpanData(data) {
      if (this.pageType === "project") {
        // 项目大类
        data.forEach((item) => {
          let sum = 0;
          item.projectBigClassList.forEach((ele, index) => {
            sum += +ele.projectBigClassCount;
            item["customerGrade" + (index + 1)] = ele.projectBigClassCount;
          });

          item["percentage"] =
            ((sum / item.listProjectBigClassTotal) * 100).toFixed(2) + "%";
        });
      }
      return data;
    },

    // 表格行操作
    setupEvents({ type, row }) {
      let routeName = "Analyselist";
      let query = {
        type: this.pageType,
        deptIds: [row.deptId].join(","),
        userId: this.queryParams.userId,
        dateType: this.queryParams.dateType,
        beginTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
      };
      if (type === "drill") {
        if (
          this.lastDept.some((i) => {
            return i == row.deptId;
          })
        ) {
          this.setStorage(query);
          // 没有下一级
          routeName = "Useranalyselist";
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
            name: "Analyselist",
            query: query,
          });
        }
      } else if (type === "viewUser") {
        this.setStorage(query);
        // 钻取用户
        routeName = "Useranalyselist";
        this.$router.push({
          name: routeName,
          query: query,
        });
      }
    },
    // 返回
    handleBack() {
      this.$router.go(-1);

      // if (JSON.parse(sessionStorage.getItem("STORAGE_KEY")).length == 1) {
      // } else {
      //   this.getData();
      // }
    },
  },
  mounted() {
    if (["Useranalyselist", "Pielist"].includes(this.previousRouterName)) {
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
      return customerOptions[this.pageType].Options;
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
.card__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}
.box-card {
  margin-top: 15px;
}
.ableClick {
  color: #409eff;
}
</style>