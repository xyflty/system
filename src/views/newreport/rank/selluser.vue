<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="type">
          <el-select v-model="queryParams.type">
            <el-option label="按月统计" :value="1" />
            <el-option label="按周统计" :value="2" />
            <el-option label="按日统计" :value="3" />
            <!-- <el-option label="按年统计" :value="3" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="dateMonth">
          <el-date-picker
            v-model="dateMonth"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="" prop="deptId">
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :multiple="false"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="" prop="userId">
          <el-select
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            clearable
            placeholder="请输入关键字搜索用户"
            remote
          >
            <!--    :remote-method="getUserList"
            @focus="getUserList($event, true)" -->
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px" v-loading="loading1">
      <div class="menu-box">
        <div v-for="(item, index) in tabData" :key="index" class="text item">
          <div>{{ item.lable }}</div>
          <div>{{ item.value || 0 }}</div>
        </div>
      </div>
    </el-card>

    <!-- 饼图 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card style="margin-top: 20px" v-loading="loading2"
          ><div>客户等级占比</div>
          <pieChart :initData="echartData4" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card style="margin-top: 20px" v-loading="loading2"
          ><div>客户行为占比</div>
          <pieChart :initData="echartData5" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card style="margin-top: 20px" v-loading="loading2"
          ><div>城市分布占比</div>
          <pieChart :initData="echartData3" />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>产品销售排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              '/zw/salesRankingAnalysis/exportProjectSalesRankingList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading3"
        >
          <!-- <el-table-column prop="x" label="时间" align="center" /> -->
          <el-table-column
            prop="topCategoryName"
            label="项目大类"
            align="center"
          />
          <el-table-column
            prop="secondCategoryName"
            label="项目二级分类"
            align="center"
          />
          <el-table-column align="center" prop="projectType" label="项目类型" />
          <el-table-column align="center" prop="projectName" label="产品名称" />
          <el-table-column
            align="center"
            prop="projectQuantity"
            label="销售数量"
          />
          <el-table-column align="center" prop="totalPrice" label="销售金额" />
          <el-table-column align="center" prop="orderNum" label="关联订单数" />
          <el-table-column
            align="center"
            prop="customerNum"
            label="关联客户数"
          />
          <el-table-column
            align="center"
            prop="maxUnitPrice"
            label="最高销售单价"
          />
          <el-table-column
            align="center"
            prop="minUnitPrice"
            label="最低销售单价"
          />
          <el-table-column
            align="center"
            prop="averagePrice"
            label="平均客单价"
          />
          <el-table-column
            align="center"
            prop="userName"
            label="产品销售最高者"
          >
            <template slot-scope="{ row }">
              <span class="ableClick">{{ row.userName }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  getHeaderData,
  getPieChart,
  getDataHistogram,
  getDistributionMap,
  getPerformanceDataList,
} from "@/api/newreport/customer";

import { projectSalesRankingList } from "@/api/newreport/rank";
import pieChart from "newreport/chart/pie.vue";
import { mapState } from "vuex";
import { userAndDept } from "../customer/mixins/userAnddept";

export default {
  name: "Selluser",
  components: { Treeselect, pieChart },
  mixins: [userAndDept],
  data() {
    return {
      dateMonth: [],
      deptOptions: [],
      userList: [],

      queryParams: {
        deptId: undefined,
        userId: "",
      },

      query: {
        pageNum: 1,
        pageSize: 10,
      },

      tabData: [
        {
          lable: "销售产品数",
          key: "customerNumber",
          value: "",
        },
        // {
        //   lable: "关联项目二级分类",
        //   key: "sequentialGrowthRate",
        //   value: "",
        // },
        // {
        //   lable: "关联项目类型",
        //   key: "associatedOrderNumber",
        //   value: "",
        // },
        {
          lable: "产品销售金额",
          key: "numberOfAssociatedProducts",
          value: "",
        },
        {
          lable: "关联订单数",
          key: "numberOfAssociatedProducts",
          value: "",
        },
        {
          lable: "关联客户数",
          key: "numberOfAssociatedProducts",
          value: "",
        },
        {
          lable: "平均客单价",
          key: "numberOfAssociatedProducts",
          value: "",
        },
      ],

      echartData1: [],
      echartData2: [],
      echartData3: [],
      echartData4: [],
      echartData5: [],
      list: [],
      total: 0,

      loading1: false,
      loading2: false,
      loading3: false,
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";
      },
    },
  },
  mounted() {
    this.getTreeselect();
    this.getUserList();

    this.queryParams.deptId = this.$store.state.user.deptId || "100";
    this.init();
  },
  methods: {
    // 导出
    handleExport(url) {
      this.download(
        url,
        { ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      if (this.$store.state.user.treeList) {
        this.deptOptions = this.$store.state.user.treeList;
        // this.queryParams.searchDeptIds = this.deptOptions[0].id
        // this.queryParams.searchDeptId = this.deptOptions[0].id;
        // this.deptDatas = [this.deptOptions[0].id]
      } else {
        this.queryParams.userId = this.$store.state.user.defaultDeptId;
      }
    },

    init() {
      this.getPieChart();
      this.getList();
    },

    getPieChart() {
      this.loading2 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      getPieChart(queryParams).then((res) => {
        const {
          customerGradeRatioPieChart: P1,
          dataSourceRatioPieChart: P2,
          projectRatioPieChart: P3,
          cityDistributeRatioPieChart: P4,
        } = res.data;

        const { dataSourceList, customerGradeList } = this.commonData;

        this.echartData1 = P2.map((item) => ({
          name: this.getLabel(dataSourceList, item.dataSourceName),
          value: item.dataSourceName,
        }));

        this.echartData2 = P3.map((item) => ({
          name: item.projectBigClassName,
          value: item.projectBigClassCount,
        }));
        this.echartData3 = P4.map((item) => ({
          name: item.cityName,
          value: item.cityCount,
        }));

        this.echartData4 = P1.map((item) => ({
          name: this.getLabel(customerGradeList, item.customerGrade),
          value: item.customerGradeCount,
        }));

        // this.echartData5 = P4.map((item) => ({
        //   name: item.cityName,
        //   value: item.cityCount,
        // }));

        this.loading2 = false;
      });
    },

    getList() {
      this.loading = true;

      projectSalesRankingList({ ...this.query }).then((res) => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    handlePieClick(val) {},

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.init();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.deptId = this.$store.state.user.deptId || "100";
      this.init();
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
.menu-box {
  display: flex;
  flex-wrap: wrap;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
}
.item:hover {
  background-color: #f9f9f9;
}

.item div {
  margin-top: 20px;
}
.item div:nth-child(1) {
  color: rgb(0, 121, 254);
  font-size: 18px;
}
.item div:nth-child(2) {
  color: #000;
  font-size: 20px;
}
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
