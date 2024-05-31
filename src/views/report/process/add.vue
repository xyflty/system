<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <span
            v-for="(item, index) in tab"
            :key="index"
            @click="handleClick(index)"
            :class="{ select_title: index === current, msg_title: true }"
            >{{ item }}</span
          >
        </div>
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="type">
          <el-select v-model="queryParams.type">
            <el-option label="按月统计" :value="1" />
            <!-- <el-option label="按周统计" :value="2" /> -->
            <el-option label="按日统计" :value="2" />
            <!-- <el-option label="按年统计" :value="3" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="dateMonth" v-if="queryParams.type == 2">
          <el-date-picker
            v-model="dateMonth"
            :type="current == 1 ? 'datetimerange' : 'daterange'"
            :value-format="current == 1 ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
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
            :value-format="current == 1 ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
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
      <div>
        <add v-if="current == 0" class="chart-box" :initData="echartData" />
        <add2 v-else class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >新增线索：
            <span class="ableClick">{{ totalInfo.clueNum }}</span></span
          >
          <!-- <span
            >新增挖需：
            <span class="ableClick">{{ totalInfo.demandNum }}</span></span
          > -->
          <span
            >新增商机：
            <span class="ableClick">{{ totalInfo.opportunityNum }}</span></span
          >
          <span
            >新增订单：
            <span class="ableClick">{{ totalInfo.orderNum }}</span></span
          >
          <span
            >新增客户：
            <span class="ableClick">{{ totalInfo.clueNum }}</span></span
          >
        </div>
        <el-button plain @click="handleExport" v-if="current == 1"
          >导出</el-button
        >
      </div>
      <div>
        <el-table
          :data="pageNumData"
          stripe
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column
            v-if="current == 0"
            prop="x"
            label="时间"
            align="center"
          />
          <el-table-column
            v-if="current == 1"
            prop="userName"
            label="员工姓名"
            align="center"
          />
          <el-table-column
            v-if="current == 1"
            prop="deptName"
            label="所在部门"
            align="center"
          />
          <el-table-column
            :key="Math.random()"
            v-if="current == 1"
            align="center"
            prop="loginDate"
            label="最后登录时间"
          />
          <el-table-column align="center" prop="clueNum" label="新增线索" />
          <!-- <el-table-column align="center" prop="demandNum" label="新增挖需" /> -->
          <el-table-column
            align="center"
            prop="opportunityNum"
            label="新增商机"
          />
          <el-table-column align="center" prop="orderNum" label="新增订单" />
          <el-table-column align="center" prop="customerNum" label="新增客户" />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="followUpNum"
            label="跟进次数"
          />
        </el-table>
        <pagination
          v-show="list.length > 0"
          :total="list.length"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import add from "../components/add.vue";
import add2 from "../components/add2.vue";

import {
  getAllCountByUser,
  getAllCountByDate,
  getAllCountByDateMerge,
  getAllCountByUserMerge,
} from "@/api/report/index";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProcessAdd",
  components: {
    add,
    add2,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      userList: [],
      echartData: [],
      dateMonth: [],
      tab: ["按创建时间汇总", "按创建人员汇总"],
      current: 0,
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

      totalInfo: "",
    };
  },
  created() {
    this.getTreeselect();
    this.getAllCountByDateMerge();
  },
  watch: {
    current: {
      handler(n) {
        this.dateMonth = [];
        this.queryParams = {
          startDate: "",
          endDate: "",
          deptId: undefined,
          userId: "",
          type: 1,
        };
        n == 0 ? this.getAllCountByDateMerge() : this.getAllCountByUserMerge();
      },
    },
    dateMonth: {
      handler(n) {
        console.log(n);
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";

        // this.current == 0 ? this.getAllCountByDateMerge() : this.getAllCountByUser();
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
    getAllCountByUserMerge() {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      console.log(params);
      // return;
      params.startTime = params.startDate;
      params.endTime = params.endDate;
      delete params.startDate;
      delete params.endDate;
      getAllCountByUserMerge(params).then((res) => {
        this.totalInfo = res.data;
        let arr = [[], [], [], [], [], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.userName);
          arr[1].push(item.clueNum);
          arr[2].push(item.demandNum);
          arr[3].push(item.opportunityNum);
          arr[4].push(item.orderNum);
          arr[5].push(item.customerNum);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
    },
    getAllCountByDateMerge() {
      getAllCountByDateMerge(this.queryParams).then((res) => {
        this.totalInfo = res.data;

        let arr = [[], [], [], [], [], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.clueNum);
          arr[2].push(item.demandNum);
          arr[3].push(item.opportunityNum);
          arr[4].push(item.orderNum);
          arr[5].push(item.customerNum);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
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

    getpageNumData() {
      let begin = (this.pageNum - 1) * this.pageSize;
      let end = this.pageNum * this.pageSize;
      this.pageNumData = this.list.slice(begin, end);
      this.loading = false;
    },

    handleClick(index) {
      this.current = index;
      this.firstOpen = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.dateMonth = null;
      this.firstOpen = true;
      setTimeout(this.getList);
    },

    getList() {
      this.current == 0
        ? this.getAllCountByDateMerge()
        : this.getAllCountByUserMerge();
    },
    getAllCountByUser() {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      console.log(params);
      // return;
      params.startTime = params.startDate;
      params.endTime = params.endDate;
      delete params.startDate;
      delete params.endDate;
      getAllCountByUser(params).then((res) => {
        let arr = [[], [], [], [], [], []];

        res.data.forEach((item) => {
          arr[0].push(item.userName);
          arr[1].push(item.clueNum);
          arr[2].push(item.demandNum);
          arr[3].push(item.opportunityNum);
          arr[4].push(item.orderNum);
          arr[5].push(item.customerNum);
        });
        this.echartData = arr;
        this.list = res.data;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
    },
    getAllCountByDate() {
      getAllCountByDate(this.queryParams).then((res) => {
        let arr = [[], [], [], [], [], []];

        res.data.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.clueNum);
          arr[2].push(item.demandNum);
          arr[3].push(item.opportunityNum);
          arr[4].push(item.orderNum);
          arr[5].push(item.customerNum);
        });
        this.echartData = arr;
        this.list = res.data;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
    },
    handleExport() {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      console.log(params);
      // return;
      params.startTime = params.startDate;
      params.endTime = params.endDate;
      delete params.startDate;
      delete params.endDate;
      this.download(
        "/zw/StatisticalReport/exportAllCountByUser",
        {
          ...params,
        },
        `data_${new Date().getTime()}.xlsx`
      );
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
.msg-box2 span {
  margin-right: 15px;
}
</style>
