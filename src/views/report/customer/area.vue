<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="type">
          <el-select v-model="queryParams.type">
            <el-option label="按月统计" :value="1" />
            <!-- <el-option label="按周统计" :value="2" /> -->
            <el-option label="按日统计" :value="2" />
            <el-option label="按年统计" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          prop="dateMonth"
          v-if="queryParams.type == 2 || queryParams.type == 3"
        >
          <el-date-picker
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" prop="dateMonth" v-if="queryParams.type == 1">
          <el-date-picker
            v-model="dateMonth"
            type="monthrange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      <div class="echart-box">
        <provinceChart class="chart-box" :initData="echartData" />
        <div class="table-box">
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="index" label="排名"> </el-table-column>
            <el-table-column prop="x" label="地区"> </el-table-column>
            <el-table-column prop="num" label="新增客户"> </el-table-column>
            <el-table-column prop="percentageStr" label="新增占比">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import provinceChart from "../components/provinceChart.vue";
import { getCustomerCityCount } from "@/api/report/index";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "CustomerArea",
  components: {
    provinceChart,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      userList: [],
      dateMonth: [],
      echartData: [],
      queryParams: {
        startDate: "",
        endDate: "",
        deptId: undefined,
        userId: "",
        type: 1,
      },
      list: [],
      total: 1, // 统共页数，默认为1
      pageNum: 1, //当前页数 ，默认为1
      pageSize: 10, // 每页显示数量
      pageNumData: [], //当前页显示内容
      headPage: 1,
      loading: false,
    };
  },
  created() {
    this.getTreeselect();
    this.getCustomerCityCount();
  },
  watch: {
    current: {
      handler(n) {
        this.queryParams.type = 1;
        n == 0 ? this.getAllCountByDate() : this.getAllCountByUser();
      },
    },
    dateMonth: {
      handler(n) {
        console.log(n);
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";
        // this.current == 0 ? this.getAllCountByDate() : this.getAllCountByUser();
      },
    },

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

    getpageNumData() {
      let begin = (this.pageNum - 1) * this.pageSize;
      let end = this.pageNum * this.pageSize;
      this.pageNumData = this.list.slice(begin, end);
      this.loading = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getCustomerCityCount();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.firstOpen = true;
      this.getCustomerCityCount();
    },

    getCustomerCityCount() {
      getCustomerCityCount(this.queryParams).then((res) => {
        let arr = [];

        res.data.forEach((item) => {
          let obj = {
            name: item.x,
            value: String(item.num),
          };
          arr.push(obj);
        });
        this.echartData = [arr];

        this.list = res.data;
        this.list.sort((a, b) => b.num - a.num);
        this.list.forEach((item, index) => {
          item.index = index + 1;
          item.percentageStr = (item.percentage * 100).toFixed(2) + "%";
        });

        // this.loading = true;
        // this.total = Math.ceil(this.list.length / this.pageSize);
        // this.total = this.total == 0 ? 1 : this.total;
        // this.getpageNumData();
      });
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 32px;
  /* background-color: rgb(240, 242, 245); */
  position: relative;
}
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
