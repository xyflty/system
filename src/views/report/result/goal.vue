<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <span
            v-for="(item, index) in tab"
            :key="index"
            @click="handleClick(index)"
            :class="{
              select_title: index + 1 === queryParams.businessType,
              msg_title: true,
            }"
            >{{ item }}</span
          >
        </div>
      </div>
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
        <goal class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >完成数量：<span class="ableClick">{{
              totalInfo.actualNum
            }}</span></span
          >
          <span
            >平均客单价：<span class="ableClick">{{
              totalInfo.customerSinglePriceNum
            }}</span></span
          >
          <span
            >完成率：<span class="ableClick">{{
              totalInfo.finishRateNum
            }}</span></span
          >
          <span
            >成交订单：<span class="ableClick">{{
              totalInfo.orderNum
            }}</span></span
          >
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <el-table :data="list" stripe style="width: 100%" border>
          <el-table-column prop="yearMonth" label="时间" align="center" />
          <el-table-column
            align="center"
            v-if="queryParams.businessType == 1"
            prop="targetValue"
            label="目标金额"
          />
          <el-table-column
            align="center"
            v-if="queryParams.businessType == 1"
            prop="actualValue"
            label="成交金额"
          />
          <el-table-column
            align="center"
            v-if="queryParams.businessType == 1"
            prop="orderCount"
            label="成交订单"
          />
          <el-table-column
            align="center"
            v-if="queryParams.businessType != 1"
            prop="targetValue"
            label="目标数量"
          />
          <el-table-column
            align="center"
            v-if="queryParams.businessType != 1"
            prop="actualValue"
            label="完成数量"
          />
          <el-table-column align="center" prop="finishRate" label="完成率" />
          <el-table-column
            align="center"
            v-if="queryParams.businessType == 1"
            prop="customerSinglePrice"
            label="平均客单价"
          />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import goal from "../components/goal.vue";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  getPerformanceTargetChartVo,
  getPerformanceTargetList,
} from "@/api/report/index";

export default {
  components: {
    goal,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      loading: false,
      dateMonth: [],
      deptOptions: [],
      userList: [],
      echartData: [],
      tab: ["成交金额", "新增线索数", "新增订单数"],
      total: 0,
      list: [],
      queryParams: {
        year: "2022",
        deptIds: [],
        userIds: [],
        businessType: 1,
      },
      totalInfo: "",
    };
  },
  watch: {
    "queryParams.businessType": {
      handler(n) {
        this.getList();
        this.getData();
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
  mounted() {
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
      this.queryParams.businessType = index + 1;
      this.firstOpen = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
      this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");

      // this.queryParams = {
      //   deptIds: [],
      //   userIds: [],
      // };
      this.firstOpen = true;

      this.getList();
      this.getData();
    },
    // chart 数据
    getData() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");

      let textArr1 = ["目标金额", "成交金额"];
      let textArr2 = ["目标数量", "完成数量"];

      getPerformanceTargetChartVo(query).then((res) => {
        this.echartData = [
          res.data.yearMonth,
          res.data.targetValue,
          res.data.actualValue,
          this.queryParams.businessType == 1 ? textArr1 : textArr2,
        ];
      });
    },
    getList() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      this.loading = true;
      getPerformanceTargetList(query).then((res) => {
        this.totalInfo = res.data;
        this.list = res.data.performanceTargetList;
        this.list.forEach(
          (item) => (item.finishRate = item.finishRate * 100 + "%")
        );
        this.loading = false;
      });
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

.msg_title {
  position: relative;
  padding-right: 20px;
  cursor: pointer;
}
.msg-box2 span {
  margin-right: 15px;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
</style>
