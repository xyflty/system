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
              select_title: index + 1 === queryParams.rankType,
              msg_title: true,
            }"
            >{{ item }}</span
          >
        </div>
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="businessType">
          <el-select v-model="queryParams.businessType">
            <!-- 1线索转化率 2商机成交率 3商机流失率 （只完成线索转化率）-->
            <el-option label="线索转化率" :value="1" />
            <el-option label="商机成交率" :value="2" />
            <el-option label="商机流失率" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="dateMonth">
          <el-date-picker
            v-model="dateMonth"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :clearable="false"
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
        <rank_rate class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >新增线索：
            <span class="ableClick">{{ totalInfo.originValueNum }}</span></span
          ><span
            >已转客户：
            <span class="ableClick">{{ totalInfo.transValueNum }}</span></span
          ><span
            >转化率：
            <span class="ableClick">{{
              Number(totalInfo.transRateNum) * 100 + "%"
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
          <el-table-column prop="index" label="排名" align="center">
          </el-table-column>
          <el-table-column
            align="center"
            v-if="queryParams.rankType == 1"
            prop="userName"
            label="员工姓名"
          >
          </el-table-column>
          <el-table-column
            align="center"
            v-if="queryParams.rankType == 2"
            prop="deptName"
            label="部门名称"
          >
          </el-table-column>
          <el-table-column
            align="center"
            v-if="queryParams.rankType == 1"
            prop="deptName"
            label="所在部门"
          />
          <el-table-column align="center" prop="originValue" label="新增线索">
          </el-table-column>
          <el-table-column align="center" prop="transValue" label="已转客户">
          </el-table-column>
          <el-table-column align="center" prop="transRate" label="转化率">
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import rank_rate from "../components/rank_rate.vue";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getTransRateRank, getTransRateRankList } from "@/api/report/index";

export default {
  name: "RankFinish",
  components: {
    rank_rate,
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
      tab: ["个人排名", "部门排名"],
      total: 0,
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rankType: 1, // 1个人 2部门
        businessType: 1, //  1成交金额 2新增线索 3新增订单数
        beginTime: "",
        endTime: "",
        deptIds: [],
        userIds: [],
      },
      totalInfo: "",
    };
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },
    "queryParams.rankType": {
      handler(n) {
        this.queryParams.pageNum = 1;
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
    setTimeout(() => {
      this.getList();
      this.getData();
    });
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
      this.firstOpen = true;
      this.queryParams.rankType = index + 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.firstOpen = true;
      this.resetForm("queryForm");
      this.getList();
      this.getData();
    },
    // chart 数据
    getData() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      getTransRateRank(query).then((res) => {
        this.echartData = [
          res.data.xname,
          res.data.originValue,
          res.data.transValue,
        ];
      });
    },
    getList() {
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      this.loading = true;
      getTransRateRankList(query).then((res) => {
        this.total = res.data.transRateRankPage.total;
        this.totalInfo = res.data;
        this.list = res.data.transRateRankPage.records;
        this.list.forEach((item, index) => {
          item.index =
            (this.queryParams.pageNum - 1) * this.queryParams.pageSize +
            (index + 1);
          item.transRate = item.transRate * 100 + "%";
        });
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
