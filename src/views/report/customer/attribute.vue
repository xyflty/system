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

        <el-form-item
          label=""
          prop="dateMonth"
          v-if="queryParams.type == 1"
        >
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

    <!-- <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <span>客户状态</span>
        <el-button plain>查看更多</el-button>
      </div>
      <div class="echart-box">
        <attribute1 class="chart-box" :initData="echartData1" />
        <div class="table-box">
          <el-table :data="pageNumData" stripe style="width: 100%">
            <el-table-column prop="date" label="名称"> </el-table-column>
            <el-table-column prop="name" label="新增客户"> </el-table-column>
            <el-table-column prop="address" label="新增占比"> </el-table-column>
            <el-table-column prop="address" label="跟进次数"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card> -->

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <span>客户等级</span>
        <el-button plain>查看更多</el-button>
      </div>
      <div class="echart-box">
        <attribute2 class="chart-box" :initData="echartData2" />
        <div class="table-box">
          <el-table :data="gradeList" stripe style="width: 100%">
            <el-table-column align="center" prop="xStr" label="等级"> </el-table-column>
            <el-table-column align="center" prop="num" label="新增客户"> </el-table-column>
            <el-table-column align="center" prop="percentageStr" label="新增占比"> </el-table-column>
            <el-table-column align="center" prop="followUpNum" label="跟进次数"> </el-table-column>
            <el-table-column align="center" prop="dealNum" label="成交次数"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <span>客户来源</span>
        <el-button plain>查看更多</el-button>
      </div>
      <div class="echart-box">
        <attribute3 class="chart-box" :initData="echartData3" />
        <div class="table-box">
          <el-table :data="dataSourceList" stripe style="width: 100%">
           <el-table-column align="center" prop="xStr" label="等级"> </el-table-column>
            <el-table-column  align="center" prop="num" label="新增客户"> </el-table-column>
            <el-table-column  align="center" prop="percentageStr" label="新增占比"> </el-table-column>
            <el-table-column  align="center" prop="followUpNum" label="跟进次数"> </el-table-column>
            <el-table-column  align="center" prop="dealNum" label="成交次数"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <span>所在城市</span>
        <el-button plain>查看更多</el-button>
      </div>
      <div class="echart-box">
        <attribute4 class="chart-box" :initData="echartData4" />
        <div class="table-box">
          <el-table :data="list" stripe style="width: 100%">
           <el-table-column align="center" prop="x" label="名称"> </el-table-column>
            <el-table-column  align="center" prop="num" label="新增客户"> </el-table-column>
            <el-table-column  align="center" prop="percentageStr" label="新增占比"> </el-table-column>
            <el-table-column  align="center" prop="followUpNum" label="跟进次数"> </el-table-column>
            <el-table-column  align="center" prop="dealNum" label="成交次数"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import attribute1 from "../components/attribute1.vue";
import attribute2 from "../components/attribute2.vue";
import attribute3 from "../components/attribute3.vue";
import attribute4 from "../components/attribute4.vue";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


import {
  getCustomerGradeCount,
  getCustomerSourceCount,
  getCustomerCityCount,
} from "@/api/report/index";

export default {
  name: "CustomerArea",
  components: {
    attribute1,
    attribute2,
    attribute3,
    attribute4,
    Treeselect
  },
  data() {
    return {
      firstOpen:true,
      deptOptions: [],
      userList: [],
      echartData: [],
      dateMonth: [],

      echartData1: [],
      echartData2: [],
      echartData3: [],
      echartData4: [],
    queryParams: {
        startDate: "",
        endDate: "",
        deptId: undefined,
        userId: "",
        type: 1,
      },
      gradeList:[],
      dataSourceList:[],
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
     this.getList();
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
      this.getCustomerGradeCount()
       this.getCustomerSourceCount();
       this.getCustomerCityCount()
    },
    getCustomerGradeCount() {
      getCustomerGradeCount(this.queryParams).then((res) => {
        let arr = [];

        res.data.forEach((item) => {
          arr.push(item.num);
        });
        this.echartData2 = arr;
        this.gradeList = res.data;
        const textStr = ['A','B','C','VIP']
        this.gradeList.forEach(item=>{
          item.xStr = textStr[item.x - 1]
          item.percentageStr = (item.percentage *100).toFixed(2) +'%'
        })

       
      });
    },
    getCustomerSourceCount() {
      getCustomerSourceCount(this.queryParams).then((res) => {
       let arr = [];

        res.data.forEach((item) => {
          arr.push(item.num);
        });
        this.echartData3 = arr;
        this.dataSourceList = res.data;
        const textStr = [
            "电话营销",
            "工商客户",
            "网推客户",
            "跨部门客户",
            "客户转介绍",
            "其它途径",
          ]
        this.dataSourceList.forEach(item=>{
          item.xStr = textStr[item.x - 1]
          item.percentageStr = (item.percentage *100).toFixed(2) +'%'
        })
      });
    },

    getCustomerCityCount() {
      getCustomerCityCount(this.queryParams).then((res) => {
        let arr = [[], [] ];

        res.data.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.num);
        });
        this.echartData4 = arr;
        this.list = res.data;
        this.list.forEach(item=>{
          item.percentageStr = (item.percentage *100).toFixed(2) +'%'
        })

        // this.loading = true;
        // this.total = Math.ceil(this.list.length / this.pageSize);
        // this.total = this.total == 0 ? 1 : this.total;
        // this.getpageNumData();
      });
    },
  },
};
</script>
</script>

<style scoped>
.echart-box {
  display: flex;
  justify-content: space-between;
  padding: 20px 100px;
}
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
</style>
