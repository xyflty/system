<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="year">
          <el-date-picker
            v-model="queryParams.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" prop="deptIds">
          <treeselect
            v-model="queryParams.deptIds"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :multiple="true"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item label="" prop="userIds">
          <el-select
            style="width: 100%"
            v-model="queryParams.userIds"
            filterable
            multiple
            clearable
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
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

    <el-card class="box-card" style="margin-top: 20px">
      <div>
        <customer class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >成交数量：<span class="ableClick">{{
              totalInfo.dealCountNum
            }}</span></span
          >
          <span
            >成交金额：<span class="ableClick">{{
              totalInfo.dealPriceNum
            }}</span></span
          >
          <span
            >平均客单价：<span class="ableClick">{{
              totalInfo.customerSinglePriceNum
            }}</span></span
          >
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading"
        >
          <!-- <el-table-column prop="index" label="排名" align="center"/> -->
          <el-table-column prop="yearMonth" label="时间" align="center" />
          <el-table-column prop="dealCount" label="成交数量" align="center" />
          <!-- <el-table-column
            prop="dealPrice"
            label="成交数量环比增长"
            align="center"
          /> -->
          <el-table-column prop="dealPrice" label="成交金额" align="center" />
          <!-- <el-table-column
            prop="customerSinglePrice1"
            label="成交金额环比增长"
            align="center"
          /> -->
          <el-table-column
            prop="customerSinglePrice"
            label="平均客单价"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="openOrder(scope.row)"
                >订单列表</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="订单列表" :visible.sync="dialogVisible" width="60%">
          <el-form :model="query" ref="query" size="small" :inline="true">
            <el-form-item label="搜索关键字" prop="keyword">
              <el-input
                v-model="query.keyword"
                placeholder="请输入搜索关键字"
                clearable
              />
            </el-form-item>
            <el-form-item label="我方签约人" prop="ourSigner">
              <el-input
                v-model="query.ourSigner"
                placeholder="请输入我方签约人"
                clearable
              />
            </el-form-item>
            <el-form-item label="订单状态" prop="orderStatus">
              <el-select v-model="query.orderStatus" :clearable="true">
                <el-option
                  v-for="orderStatus in commonData.orderStatusList"
                  :key="orderStatus.value"
                  :label="orderStatus.label"
                  :value="orderStatus.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="签单日期" prop="signTime">
              <el-date-picker
                v-model="dateMonth_1"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="queryParams.deptIds"
                style="margin-left: 10px; max-width: 200px"
                :options="deptOptions"
                :multiple="true"
                value-consists-of="LEAF_PRIORITY"
                :show-count="true"
                placeholder="请选择归属部门"
              />
            </el-form-item>

            <el-form-item label="跟进人员" prop="followUpPersonIds">
              <el-select
                style="width: 100%"
                v-model="queryParams.userIds"
                filterable
                clearable
                multiple
                placeholder="跟进人员"
                remote
                :remote-method="getUserList"
                @focus="getUserList($event, true)"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="付款方式" prop="paymentMethod">
              <el-select v-model="query.paymentMethod" :clearable="true">
                <el-option
                  v-for="paymentMethod in commonData.paymentMethodList"
                  :key="paymentMethod.value"
                  :label="paymentMethod.label"
                  :value="paymentMethod.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery_1"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery_1"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <el-table
            :data="orderList"
            stripe
            style="width: 100%"
            border
            ref="myTable"
          >
            <el-table-column
              label="订单编号"
              align="center"
              prop="orderCode"
              v-if="columns[0].visible"
              :width="columns[0].width"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="订单标题"
              align="center"
              prop="title"
              v-if="columns[1].visible"
              :width="columns[1].width"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <span
                  class="ableClick"
                  @click="
                    $router.push({
                      name: 'Order/detail',
                      query: { id: row.id },
                    })
                  "
                  >{{ row.title }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="关联客户"
              align="center"
              prop="companyName"
              v-if="columns[2].visible"
              :width="columns[2].width"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <span
                  class="ableClick"
                  @click="
                    $router.push({
                      name: 'Customer/detail',
                      query: { id: row.customerId, type: '1' },
                    })
                  "
                  >{{ row.companyName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="签单日期"
              align="center"
              prop="signTime"
              v-if="columns[3].visible"
              :width="columns[3].width"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.signTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="订单总金额"
              align="center"
              prop="price"
              v-if="columns[4].visible"
              :width="columns[4].width"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="跟进人"
              align="center"
              prop="userName"
              v-if="columns[5].visible"
              :width="columns[5].width"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="订单状态"
              align="center"
              prop="orderStatus"
              v-if="columns[6].visible"
              :width="columns[6].width"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <span>{{
                  getLabel(commonData.orderStatusList, row.orderStatus)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              width="120"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="openProject(scope.row)"
                  >订单下项目</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getOrderList"
            :autoScroll="false"
          />

          <el-dialog
            title="订单下项目列表"
            :visible.sync="dialogVisible_2"
            width="60%"
            append-to-body
          >
            <el-table :data="projectList" stripe style="width: 100%" border>
              <el-table-column
                label="产品名称"
                align="center"
                prop="projectName"
              />
              <el-table-column
                label="最低限价"
                align="center"
                prop="lowestQuotation"
              />
              <el-table-column
                label="标准单价"
                align="center"
                prop="guidancePrice"
              />
              <el-table-column
                label="实际售价"
                align="center"
                prop="unitPrice"
              />
              <el-table-column label="数量" align="center" prop="quantity" />
            </el-table>
          </el-dialog>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import customer from "../components/customer.vue";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

import {
  getDealCustomerSummary,
  getDealCustomerSummaryList,
  getTransactionAmountDetails,
  getTransactionDetails,
} from "@/api/report/index";

export default {
  name: "ReportCustomer",
  components: {
    customer,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      dialogVisible: false,
      orderList: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        yearMonth: "",
      },
      projectList: [],
      dialogVisible_2: false,
      dateMonth_1: [],

      loading: false,
      dateMonth: [],
      deptOptions: [],
      userList: [],
      echartData: [],
      tab: ["个人排名", "部门排名"],
      list: [],
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        year: "2022",
        deptIds: [],
        userIds: [],
      },

      // 列信息
      columns: [
        { key: 0, label: `订单编号`, visible: true, width: "250" },
        { key: 1, label: `订单标题`, visible: true, width: "250" },
        { key: 2, label: `关联客户`, visible: true, width: "250" },
        { key: 3, label: `签单日期`, visible: true, width: "180" },
        { key: 4, label: `订单总金额`, visible: true, width: "140" },
        { key: 5, label: `跟进人`, visible: true, width: "180" },
        { key: 6, label: `订单状态`, visible: false, width: "140" },
      ],

      totalInfo: "",
    };
  },
  watch: {
    dateMonth_1: {
      handler(n) {
        console.log(n);
        this.query.beginSignTime = n != null ? n[0] : "";
        this.query.endSignTime = n != null ? n[1] : "";
      },
    },

    firstOpen: {
      handler(n) {
        if (n) {
          this.queryParams.deptIds = [this.$store.state.user.subjectDeptId] || [
            "100",
          ];
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  updated() {
    // 在数据更新后执行
    this.$nextTick(() => {
      // myTable是表格的ref属性值
      if (this.$refs.myTable && this.$refs.myTable.doLayout) {
        this.$refs.myTable.doLayout();
      }
    });
  },

  mounted() {
    const { timeType } = this.$route.params;
    if (timeType) {
      this.queryParams.timeType = timeType;
    }

    let date = new Date();
    const defaultMonth =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + Number(date.getMonth() + 1)
        : Number(date.getMonth() + 1));
    this.dateMonth = [defaultMonth, defaultMonth];

    this.getTreeselect();
    this.getList();
    this.getData();
  },
  methods: {
    //
    openOrder(val) {
      this.query.yearMonth = val.yearMonth;
      this.query.pageNum = 1;
      this.getOrderList();
    },
    getOrderList() {
      getTransactionAmountDetails({
        ...this.query,
        followUpPersonIds: this.queryParams.userIds.join(","),
        deptIds: this.queryParams.deptIds.join(","),
      }).then((res) => {
        this.dialogVisible = true;
        this.orderList = res.rows;
        this.total = res.total;
      });
    },
    //
    openProject(val) {
      getTransactionDetails({
        orderId: val.id,
      }).then((res) => {
        this.projectList = res.data;
        this.dialogVisible_2 = true;
      });
    },

    /** 搜索按钮操作 */
    handleQuery_1() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.getOrderList();
    },
    /** 重置按钮操作 */
    resetQuery_1() {
      this.dateMonth_1 = [];
      this.firstOpen = true;
      this.resetForm("query");
      this.handleQuery_1();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    handleClick(index) {
      this.queryParams.rankType = index + 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
      this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
      this.getData();
    },
    // chart 数据
    getData() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      getDealCustomerSummary(query).then((res) => {
        this.echartData = [res.data.month, res.data.dealPrice];
      });
    },
    getList() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      this.loading = true;
      getDealCustomerSummaryList(query).then((res) => {
        this.totalInfo = res.data;
        this.list = res.data.dealCustomerSummaryList;

        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
}

.msg_title {
  position: relative;
  padding-right: 20px;
  cursor: pointer;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg-box2 span {
  margin-right: 15px;
}

.select_title {
  font-weight: 600;
  color: #0079fe;
}
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
