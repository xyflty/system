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
      <div>
        <record v-if="current == 0" class="chart-box" :initData="echartData" />
        <record2 v-else class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2" v-if="current == 0">
          <span
            >跟进线索：<span class="ableClick">{{
              totalInfo.clueNum
            }}</span></span
          >
          <!-- <span
            >跟进挖需：<span class="ableClick">{{
              totalInfo.demandNum
            }}</span></span
          > -->
          <span
            >跟进商机：<span class="ableClick">{{
              totalInfo.opportunityNum
            }}</span></span
          >
          <span
            >跟进订单：<span class="ableClick">{{
              totalInfo.orderNum
            }}</span></span
          >
          <span
            >跟进客户：<span class="ableClick">{{
              totalInfo.clueNum
            }}</span></span
          >
        </div>

        <div class="msg-box2" v-if="current == 1">
          <span
            >面谈：<span class="ableClick">{{ totalInfo.faceNum }}</span></span
          >
          <span
            >电话：<span class="ableClick">{{ totalInfo.phoneNum }}</span></span
          >
          <span
            >短信：<span class="ableClick">{{ totalInfo.textNum }}</span></span
          >
          <span
            >邮件：<span class="ableClick">{{ totalInfo.emailNum }}</span></span
          >
          <span
            >微信：<span class="ableClick">{{
              totalInfo.wechatNum
            }}</span></span
          >
          <span
            >QQ：<span class="ableClick">{{ totalInfo.qqNum }}</span></span
          >
          <span
            >其他：<span class="ableClick">{{ totalInfo.otherNum }}</span></span
          >
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <el-table
          :data="pageNumData"
          stripe
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="userName" label="员工姓名" align="center">
          </el-table-column>
          <el-table-column prop="deptName" label="所在部门" align="center">
          </el-table-column>
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="clueNum"
            label="跟进次数"
          />
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="demandNum"
            label="跟进线索次数"
          />
          <!-- <el-table-column
            align="center"
            v-if="current == 0"
            prop="demandNum"
            label="跟进挖需次数"
          /> -->
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="opportunityNum"
            label="跟进商机次数"
          />
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="orderNum"
            label="跟进订单次数"
          />
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="customerNum"
            label="跟进客户次数"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="faceNum"
            label="面谈"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="phoneNum"
            label="电话"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="wechatNum"
            label="微信"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="textNum"
            label="短信"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="emailNum"
            label="邮件"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="qqNum"
            label="QQ"
          />
          <el-table-column
            v-if="current == 1"
            align="center"
            prop="otherNum"
            label="其他"
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
import record from "../components/record.vue";
import record2 from "../components/record2.vue";

import {
  getAllFollowTypeCount,
  getAllFollowMethodCount,
} from "@/api/report/index";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProcessRecord",
  components: {
    record,
    record2,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      userList: [],
      echartData: [],
      dateMonth: [],
      tab: ["跟进对象", "跟进类型"],
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
    this.getAllFollowTypeCount();
  },
  watch: {
    current: {
      handler(n) {
        this.queryParams.type = 1;
        n == 0 ? this.getAllFollowTypeCount() : this.getAllFollowMethodCount();
      },
    },
    dateMonth: {
      handler(n) {
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";

        // this.current == 0 ? this.getAllFollowMethodCount() : this.getAllFollowTypeCount();
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
      this.dateMonth = null;
      this.resetForm("queryForm");
      this.firstOpen = true;
      setTimeout(this.getList);
    },
    getpageNumData() {
      let begin = (this.pageNum - 1) * this.pageSize;
      let end = this.pageNum * this.pageSize;
      this.pageNumData = this.list.slice(begin, end);
      this.loading = false;
    },

    getList() {
      this.current == 0
        ? this.getAllFollowTypeCount()
        : this.getAllFollowMethodCount();
    },

    getAllFollowTypeCount() {
      getAllFollowTypeCount(this.queryParams).then((res) => {
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
    getAllFollowMethodCount() {
      getAllFollowMethodCount(this.queryParams).then((res) => {
        this.totalInfo = res.data;
        let arr = [[], [], [], [], [], [], [], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.userName);
          arr[1].push(item.faceNum);
          arr[2].push(item.phoneNum);
          arr[3].push(item.wechatNum);
          arr[4].push(item.emailNum);
          arr[5].push(item.qqNum);
          arr[6].push(item.textNum);
          arr[7].push(item.otherNum);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
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
