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
        <!-- <el-form-item label="" prop="userId">
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
        </el-form-item> -->
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
          <span>成交金额目标完成度 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index1',
              '/zw/salesRankingAnalysis/exportDeptTargetAmountList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list1"
        stripe
        style="width: 100%"
        border
        v-loading="loading1"
      >
        <!-- <el-table-column prop="year" label="时间" align="center" /> -->
        <el-table-column
          prop="deptName"
          label="主体\部门"
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
        <el-table-column
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row, 1)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total1 > 0"
        :total="total1"
        :page.sync="query1.pageNum"
        :limit.sync="query1.pageSize"
        @pagination="getList1"
        :autoScroll="false"
      />
    </el-card>

    <!-- 第二个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>线索数量目标完成度 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index2',
              '/zw/salesRankingAnalysis/exportDeptTargetAmountList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list2"
        stripe
        style="width: 100%"
        border
        v-loading="loading2"
      >
        <!-- <el-table-column prop="year" label="时间" align="center" /> -->
        <el-table-column
          prop="deptName"
          label="主体\部门"
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
        <el-table-column
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row, 2)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total2 > 0"
        :total="total2"
        :page.sync="query2.pageNum"
        :limit.sync="query2.pageSize"
        @pagination="getList2"
        :autoScroll="false"
      />
    </el-card>

    <!-- 第三个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 资质订单目标完成度 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index3',
              '/zw/salesRankingAnalysis/exportDeptTargetAmountList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list3"
        stripe
        style="width: 100%"
        border
        v-loading="loading3"
      >
        <!-- <el-table-column prop="year" label="时间" align="center" /> -->
        <el-table-column
          prop="deptName"
          label="主体\部门"
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
        <el-table-column
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row, 3)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total3 > 0"
        :total="total3"
        :page.sync="query3.pageNum"
        :limit.sync="query3.pageSize"
        @pagination="getList3"
        :autoScroll="false"
      />
    </el-card>

    <!-- 第四个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>安证订单目标完成度 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index4',
              '/zw/salesRankingAnalysis/exportDeptTargetAmountList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <el-table
        :data="list4"
        stripe
        style="width: 100%"
        border
        v-loading="loading4"
      >
        <!-- <el-table-column prop="year" label="时间" align="center" /> -->
        <el-table-column
          prop="deptName"
          label="主体\部门"
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
        <el-table-column
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row, 4)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total4 > 0"
        :total="total4"
        :page.sync="query4.pageNum"
        :limit.sync="query4.pageSize"
        @pagination="getList4"
        :autoScroll="false"
      />
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  deptTargetAmountList,
  userTargetAmountList,
  treeselect,
} from "@/api/newreport/rank";

export default {
  name: "RankTarget",
  components: { Treeselect },
  data() {
    return {
      deptOptions: [],
      userList: [],

      queryParams: {
        deptId: undefined,
        year: "2023",
      },
      query1: {
        type: 1,
        pageNum: 1,
        pageSize: 10,
      },
      query2: { type: 2, pageNum: 1, pageSize: 10 },
      query3: { type: 4, pageNum: 1, pageSize: 10 },
      query4: { type: 5, pageNum: 1, pageSize: 10 },

      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      list1: [],
      list2: [],
      list3: [],
      list4: [],

      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
    };
  },

  mounted() {
    this.getTreeselect();
    this.queryParams.deptId = this.$store.state.user.deptId || "100";
    this.init();
  },
  methods: {
    // 导出
    handleExport(index, url) {
      this.download(
        url,
        { ...this[index], ...this.queryParams },
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

    init() {
      this.getList1();
      this.getList2();
      this.getList3();
      this.getList4();
    },

    getList1() {
      this.loading1 = true;
      deptTargetAmountList({ ...this.queryParams, ...this.query1 }).then(
        (res) => {
          this.total1 = res.total;
          this.list1 = res.rows;
          this.loading1 = false;
        }
      );
    },
    getList2() {
      this.loading2 = true;
      deptTargetAmountList({ ...this.queryParams, ...this.query2 }).then(
        (res) => {
          this.total2 = res.total;
          this.list2 = res.rows;
          this.loading2 = false;
        }
      );
    },
    getList3() {
      this.loading3 = true;
      deptTargetAmountList({ ...this.queryParams, ...this.query3 }).then(
        (res) => {
          this.total3 = res.total;
          this.list3 = res.rows;
          this.loading3 = false;
        }
      );
    },
    getList4() {
      this.loading4 = true;
      deptTargetAmountList({ ...this.queryParams, ...this.query4 }).then(
        (res) => {
          this.total4 = res.total;
          this.list4 = res.rows;
          this.loading4 = false;
        }
      );
    },

    handleClick(row, type) {
      this.$router.push({
        name: "Rank/user",
        query: { type, deptId: row.deptId },
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.query1.pageNum = 1;
      this.query2.pageNum = 1;
      this.query3.pageNum = 1;
      this.query4.pageNum = 1;
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

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
