<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="years">
          <el-date-picker
            v-model="queryParams.years"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="deptId">
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
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
        <dealChart class="chart-box" :initData="echartData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import dealChart from "../components/dealChart.vue";
import { getCustomerRate } from "@/api/report/index";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "CustomerArea",
  components: {
    dealChart,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      userList: [],
      echartData: [],
      dateMonth: [],

      queryParams: {
        years: "2022",
        deptId: undefined,
        userId: "",
      },
    };
  },
  created() {
    this.getTreeselect();
    this.getCustomerRate();
  },
  watch: {
    firstOpen: {
      handler(n) {
        if (n) {
          this.queryParams.deptId = this.$store.state.user.subjectDeptId || 100;
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.getCustomerRate();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.firstOpen = true;
      this.getCustomerRate();
    },

    getCustomerRate() {
      getCustomerRate(this.queryParams).then((res) => {
        let arr = [[], [], [], []];

        res.data.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.percentage);
          arr[2].push(item.renewalRate);
          arr[3].push(item.lossRate);
        });
        this.echartData = arr;
        this.list = res.data;
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
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
</style>
