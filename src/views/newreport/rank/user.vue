<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="year">
          <el-date-picker
            v-model="queryParams.year"
            type="year"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy 年"
          >
          </el-date-picker>
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
            <!--   :remote-method="getUserList"
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
          <el-button type="primary" size="mini" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 第一个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{ tab[type - 1] }} </span>
        </div>
        <el-button
          @click="
            handleExport('/zw/salesRankingAnalysis/exportUserTargetAmountList')
          "
          plain
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
      >
        <!-- <el-table-column prop="year" label="时间" align="center" /> -->
        <el-table-column
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="90"
        />
        <el-table-column
          prop="postName"
          label="职务"
          align="center"
          min-width="90"
        />
        <el-table-column
          prop="userName"
          label="姓名"
          align="center"
          min-width="90"
        />
        <el-table-column
          prop="quarterOne"
          label="第一季度目标"
          align="center"
        />
        <el-table-column
          align="center"
          prop="quarterOneAmount"
          label="第一季度业绩"
        />
        <el-table-column
          align="center"
          prop="quarterOnePercentage"
          label="完成度"
        />
        <el-table-column
          align="center"
          prop="quarterTwo"
          label="第二季度目标"
        />
        <el-table-column
          align="center"
          prop="quarterTwoAmount"
          label="第二季度业绩"
        />
        <el-table-column
          align="center"
          prop="quarterTwoPercentage"
          label="完成度"
        />
        <el-table-column
          align="center"
          prop="quarterThree"
          label="第三季度目标"
        />
        <el-table-column
          align="center"
          prop="quarterThreeAmount"
          label="第三季度业绩"
        />
        <el-table-column
          align="center"
          prop="quarterThreePercentage"
          label="完成度"
        />
        <el-table-column
          align="center"
          prop="quarterFour"
          label="第四季度目标"
        />
        <el-table-column
          align="center"
          prop="quarterFourAmount"
          label="第四季度业绩"
        />
        <el-table-column
          align="center"
          prop="quarterFourPercentage"
          label="完成度"
        />
        <el-table-column
          align="center"
          prop="totalPercentage"
          label="整体完成度"
        />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { userTargetAmountList, treeselect } from "@/api/newreport/rank";

export default {
  name: "RankUser",
  components: { Treeselect },
  data() {
    return {
      tab: [
        "成交金额目标完成分析列表",
        "线索数量目标完成分析列表",
        "资质订单目标完成度分析列表",
        "安证订单目标完成度分析列表",
      ],
      type: 1,
      deptId: 0,
      deptOptions: [],
      userList: [],

      queryParams: {
        deptId: undefined,
        userId: "",
        year: "2023",
        pageNum: 1,
        pageSize: 10,
        type: 1,
      },

      total: 0,
      list: [],
      loading: false,
    };
  },

  mounted() {
    this.getTreeselect();
    this.getUserList();

    const { type, deptId } = this.$route.query;
    this.queryParams.deptId = deptId;
    this.queryParams.type = [1, 2, 4, 5][type - 1];
    this.deptId = deptId;
    this.type = type;

    this.getList();
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

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    getList() {
      this.loading = true;
      userTargetAmountList({ ...this.queryParams }).then((res) => {
        this.total = res.total;
        this.list = res.rows;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.deptId = this.deptId;
      this.getList();
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

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
