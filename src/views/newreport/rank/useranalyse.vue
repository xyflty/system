<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="searchDateType">
          <el-select v-model="queryParams.searchDateType">
            <el-option label="按年统计" :value="1" />
            <el-option label="按月统计" :value="2" />
            <el-option label="按周统计" :value="3" />
            <el-option label="按日统计" :value="4" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="searchStartDate">
          <el-date-picker
            v-if="queryParams.searchDateType == 1"
            v-model="queryParams.searchStartDate"
            value-format="yyyy"
            type="year"
            placeholder="开始年份"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
          <el-date-picker
            v-if="
              queryParams.searchDateType != 1 && queryParams.searchDateType != 3
            "
            v-model="dateMonth"
            :type="pickerType"
            :value-format="valueFormat"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            :clearable="false"
          />
        </el-form-item>

        <!-- 这是周的选择日期 -->
        <el-form-item label="" v-if="queryParams.searchDateType == 3" prop="">
          <Chooseweek ref="Chooseweek" @sallBusiness="date"></Chooseweek>
        </el-form-item>

        <el-form-item label="" prop="searchEndDate">
          <el-date-picker
            v-if="queryParams.searchDateType == 1"
            v-model="queryParams.searchEndDate"
            type="year"
            value-format="yyyy"
            placeholder="结束年份"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="showDepartSelect == true" label="" prop="deptDatas">
          <treeselect
            @input="treeselectinput"
            :flat="true"
            v-model="deptDatas"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :multiple="true"
            :options="deptOptions"
            value-consists-of="ALL"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="" prop="userId">
          <el-select
            @input="selectInput"
            :disabled="!user.treeList"
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            placeholder="请输入关键字搜索用户"
            remote
          >
            <!--    :remote-method="getUserList"
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
          <el-button icon="el-icon-back" type="primary" @click="goBack"
            >返回</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 基本排名列表柱状图 -->
    <salesPerformance v-if="type == 1" :initData="listArr1"></salesPerformance>

    <!-- 第一个 -->
    <el-card style="margin-top: 20px" v-if="type == 1">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>基本排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index1',
              '/zw/salesRankingAnalysis/exportBasicRankingAnalysisList'
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
        @sort-change="sortChange"
        :default-sort="{ prop: 'clueNum', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column
          prop=""
          type="index"
          label="排名"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showDate == true && showUserId == true"
          prop="postName"
          label="职务"
          align="center"
          min-width="100"
        />
        <el-table-column
          v-if="showDate == true"
          prop="userName"
          label="姓名"
          align="center"
        />
        <el-table-column
          prop="clueNum"
          label="线索数量"
          align="center"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="clueConversionRate"
          label="线索转化率"
        />
        <el-table-column
          align="center"
          prop="opportunityNum"
          label="商机数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="opportunityConversionRate"
          label="商机转化率"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="orderNum"
          label="订单数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="customerNum"
          label="客户数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="oneTranNum"
          label="首次成交数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="mulTranNum"
          label="多次成交数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="referralTranNum"
          label="转介绍成交数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="wholeConversionRate"
          label="整体转化率"
          sortable="custom"
        />
        <el-table-column
          v-if="showDate == false"
          :key="Math.random()"
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row)"
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

    <!-- 成交排名列表柱状图 -->
    <salesPerformance v-if="type == 2" :initData="listArr2"></salesPerformance>

    <!-- 第二个 -->
    <el-card style="margin-top: 20px" v-if="type == 2">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 成交排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'inedx2',
              '/zw/salesRankingAnalysis/exportDealRankingAnalysisList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>

      <el-table
        @sort-change="sortChange"
        :data="list2"
        stripe
        style="width: 100%"
        border
        v-loading="loading2"
        :default-sort="{ prop: 'orderAmount', order: 'descending' }"
      >
        <el-table-column
          prop=""
          type="index"
          label="排名"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showDate == true && showUserId == true"
          prop="postName"
          label="职务"
          align="center"
          min-width="100"
        />
        <el-table-column
          v-if="showDate == true"
          prop="userName"
          label="姓名"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="orderAmount"
          label="成交金额"
          align="center"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="orderNum"
          label="订单数量"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="customerNum"
          label="客户数量"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="oneTranAmount"
          label="首次成交金额"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="twoTranAmount"
          label="二次成交金额"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="mulTranAmount"
          label="多次成交金额"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="referralTranAmount"
          label="转介绍成交金额"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="reOrderAmount"
          label="复购金额"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="averageOrderAmount"
          label="平均客单价"
        >
          <template slot-scope="{ row }">
            <span>{{ row.averageOrderAmount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :key="Math.random()"
          prop="ancestorProjectCategory"
          label="关联项目大类"
          min-width="130px"
        >
          <template slot-scope="{ row }">
            <div class="gridflex">
              <span
                v-for="(item, index) in row.ancestorProjectCategory"
                :key="index"
                class="span"
                >{{ item }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          :key="Math.random()"
          align="center"
          prop="orderProjectNum"
          label="关联产品数"
        />
        <el-table-column
          v-if="showDate == false"
          :key="Math.random()"
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row)"
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

    <!-- 成交排名列表柱状图 -->
    <salesPerformance v-if="type == 3" :initData="listArr3"></salesPerformance>

    <!-- 第三个 -->
    <el-card style="margin-top: 20px" v-if="type == 3">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 转化率排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index4',
              '/zw/salesRankingAnalysis/exportConversionRateAnalysisList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>

      <el-table
        @sort-change="sortChange"
        :data="list3"
        stripe
        style="width: 100%"
        border
        v-loading="loading3"
        :default-sort="{ prop: 'wholeConversionRate', order: 'descending' }"
      >
        <el-table-column
          prop=""
          type="index"
          label="排名"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showDate == true && showUserId == true"
          prop="postName"
          label="职务"
          align="center"
          min-width="100"
        />
        <el-table-column
          v-if="showDate == true"
          prop="userName"
          label="姓名"
          align="center"
        />
        <el-table-column
          prop="clueConversionRate"
          label="线索转化率"
          align="center"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="opportunityConversionRate"
          label="商机转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="wholeConversionRate"
          label="整体转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="twoTranRate"
          label="二次成交转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="mulTranRate"
          label="多次成交转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="oneReferralTranRate"
          label="转介绍一次成交转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="mulReferralTranRate"
          label="转介绍多次成交转化率"
        />
        <el-table-column
          v-if="showDate == false"
          :key="Math.random()"
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row)"
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
    <el-card style="margin-top: 20px" v-if="type == 4">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 流失率排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index4',
              '/zw/salesRankingAnalysis/exportBasicRankingAnalysisList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>

      <el-table
        @sort-change="sortChange"
        :data="list4"
        stripe
        style="width: 100%"
        border
        v-loading="loading4"
      >
        <el-table-column
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="postName"
          label="职务"
          align="center"
          min-width="100"
        />
        <el-table-column prop="userName" label="姓名" align="center" />
        <el-table-column
          sortable="custom"
          prop="x"
          label="线索流失率"
          align="center"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="projectNumber"
          label="商机流失率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="num"
          label="整体流失率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="money"
          label="商机转化率"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="avgMoney"
          label="客户流失率"
        />
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

    <!-- 全部跟进排名列表柱状图 -->
    <salesPerformance v-if="type == 5" :initData="listArr5"></salesPerformance>
    <!-- 第五个 -->
    <el-card style="margin-top: 20px" v-if="type == 5">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 跟进次数排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index5',
              '/zw/salesRankingAnalysis/exportFollowUpNumAnalysisList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>

      <el-table
        @sort-change="sortChange"
        :data="list5"
        stripe
        style="width: 100%"
        border
        v-loading="loading5"
        :default-sort="{ prop: 'totalFollowUpNum', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column
          prop=""
          type="index"
          label="排名"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="deptName"
          label="主体\部门"
          align="center"
          min-width="80"
        />
        <el-table-column
          v-if="showDate == true && showUserId == true"
          prop="postName"
          label="职务"
          align="center"
          min-width="100"
        />
        <el-table-column
          v-if="showDate == true"
          prop="userName"
          label="姓名"
          align="center"
        />
        <el-table-column
          sortable="custom"
          prop="clueFollowUpNum"
          label="线索跟进次数"
          align="center"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="opportunityFollowUpNum"
          label="商机跟进次数"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="orderFollowUpNum"
          label="订单跟进次数"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="customerFollowUpNum"
          label="客户跟进次数"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="totalFollowUpNum"
          label="全部跟进次数"
        />
        <el-table-column
          v-if="showDate == false"
          :key="Math.random()"
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total5 > 0"
        :total="total5"
        :page.sync="query5.pageNum"
        :limit.sync="query5.pageSize"
        @pagination="getList5"
        :autoScroll="false"
      />
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { mapState } from "vuex";
import {
  basicRankingAnalysisList,
  dealRankingAnalysisList,
  conversionRateAnalysisList,
  followUpNumAnalysisList,
} from "@/api/newreport/rank";
import salesPerformance from "newreport/chart/salesPerformance.vue";

import { userAndDept } from "../customer/mixins/userAnddept";
import { filterDepts } from "@/utils/common";

export default {
  name: "Rankperformance",
  components: { Treeselect, Chooseweek, salesPerformance },
  mixins: [userAndDept],
  data() {
    return {
      type: 1,
      deptId: 0,
      dad: 0,
      dateMonth: [],
      deptOptions: [],
      userList: [],
      sortAble: "custom",
      deptDatas: [], // 多选框里面的值
      queryParams: {
        searchDeptId: undefined,
        searchDateType: 1,
        searchStartDate: "2023",
        searchEndDate: "2023",
        searchDeptIds: "",
        userId: "",
        orderByColumn: null,
        isAsc: null,
      },

      query1: { pageNum: 1, pageSize: 10 },
      query2: { pageNum: 1, pageSize: 10 },
      query3: { pageNum: 1, pageSize: 10 },
      query4: { pageNum: 1, pageSize: 10 },
      query5: { pageNum: 1, pageSize: 10 },

      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,

      // 表格存储数据
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],

      // 传递柱形图的数据
      listArr1: [],
      listArr2: [],
      listArr3: [],
      listArr4: [],
      listArr5: [],

      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      dateDatas1: "",
      dateDatas2: "",
      // 判断当前是否挖掘到最后一层 如果是最后一层则隐藏钻取按钮 展示人员名称和职务
      showDate: false,
      showBtn: true,
      showDepartSelect: true,
      showUserId: true,
      setStartYear: undefined,
      setEndYear: undefined,
      setStartMonth: undefined,
      setEndMonth: undefined,
      setStartDay: undefined,
      setEndDay: undefined,
    };
  },
  computed: {
    ...mapState(["statistics"]),
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.searchStartDate = n != null ? n[0] : "";
        this.queryParams.searchEndDate = n != null ? n[1] : "";
      },
    },

    "queryParams.searchDateType": {
      handler(n) {
        if (n == 1) {
          if (this.setStartYear !== undefined) {
            this.dateMonth = [this.setStartYear, this.setEndYear];
          } else {
            this.dateMonth = ["2023", "2023"];
          }
        } else if (n == 3) {
        } else {
          this.pickerType = n == 2 ? "monthrange" : "daterange";
          this.valueFormat = n == 2 ? "yyyy-MM" : "yyyy-MM-dd";

          if (n == 2) {
            if (this.setStartMonth !== undefined) {
              this.dateMonth = [this.setStartMonth, this.setEndMonth];
            } else {
              this.dateMonth = ["2023-01", "2023-01"];
            }
          } else {
            if (this.setStartDay !== undefined) {
              this.dateMonth = [this.setStartDay, this.setEndDay];
            } else {
              this.dateMonth = ["2023-01-01", "2023-01-01"];
            }
          }
        }
      },
    },
  },
  created() {},
  mounted() {
    const {
      type,
      deptId,
      searchDate,
      searchDateType,
      searchStartDate,
      searchEndDate,
      searchDeptIds,
      userId,
    } = this.$route.query;

    this.queryParams.searchDateType = Number(searchDateType);
    this.$nextTick(() => {
      if (this.queryParams.searchDateType == 3) {
        this.$refs.Chooseweek.getMont(searchStartDate);
      }
    });

    if (searchDateType == 1) {
      this.setStartYear = searchStartDate;
      this.setEndYear = searchEndDate;
    }
    if (searchDateType == 2) {
      this.setStartMonth = searchStartDate;
      this.setEndMonth = searchEndDate;
    }
    if (searchDateType == 4) {
      this.setStartDay = searchStartDate;
      this.setEndDay = searchEndDate;
    }

    if (this.$route.query.type == 1) {
      this.queryParams.orderByColumn = "clueNum";
      this.queryParams.isAsc = "desc";
    }

    if (this.$route.query.type == 2) {
      this.queryParams.orderByColumn = "orderAmount";
      this.queryParams.isAsc = "desc";
    }
    if (this.$route.query.type == 3) {
      this.queryParams.orderByColumn = "wholeConversionRate";
      this.queryParams.isAsc = "desc";
    }

    if (this.$route.query.type == 5) {
      this.queryParams.orderByColumn = "totalFollowUpNum";
      this.queryParams.isAsc = "desc";
    }

    this.queryParams.searchStartDate = this.$route.query.searchStartDate;
    this.queryParams.searchEndDate = this.$route.query.searchEndDate;

    this.queryParams.searchDeptIds = searchDeptIds;
    this.queryParams.userId = userId;

    this.deptId = deptId;
    this.type = type;
    this.getTreeselect();
    this.getUserList();

    this.init();
    this.dad = typeof Date.now();

    if (this.queryParams.searchDeptIds) {
      this.deptDatas = String(searchDeptIds)
        .split(",")
        .map((i) => {
          if (i == 200) {
            return Number(i);
          } else {
            return i;
          }
        });
    }
  },
  methods: {
    treeselectinput(i) {
      if (i.length) {
        this.queryParams.searchDeptIds = this.deptDatas.join(",");
        this.queryParams.userId = "";
      } else {
        if (!this.queryParams.userId) {
          this.deptDatas = String(this.queryParams.searchDeptIds)
            .split(",")
            .map((i) => {
              if (i == 200) {
                return Number(i);
              } else {
                return i;
              }
            });
        }
      }
    },
    selectInput(i) {
      this.queryParams.userId = i;
      if (this.queryParams.userId) {
        this.queryParams.searchDeptIds = undefined;
        this.deptDatas = [];
      }
    },
    // 选择日期周子组件传过来的值
    date(value) {
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
    // 导出
    handleExport(index, url) {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.download(
        url,
        { ...this[index], ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      // 从全局变量中获取部门id进行展示 如果部门不存在则直接展示用户id 直接锁死无法搜索部门

      if (this.$store.state.user.treeList) {
        let { children, deptIds } = filterDepts(
          this.$store.state.user.treeList,
          this.$store.state.user.defaultDeptId
        );
        this.deptOptions = children;
        // this.queryParams.searchDeptIds = this.deptOptions[0].id
        // this.queryParams.searchDeptId = this.deptOptions[0].id;
      } else {
        this.queryParams.userId = this.$store.state.user.userId;
        this.queryParams.searchDeptIds = null;
        this.showDepartSelect = false;
        this.showUserId = false;
      }
      // });
    },

    init() {
      if (this.type == 1) this.getList1();
      if (this.type == 2) this.getList2();
      if (this.type == 3) this.getList3();
      if (this.type == 4) this.getList4();
      if (this.type == 5) this.getList5();
    },

    getList1() {
      this.loading1 = true;

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;

      basicRankingAnalysisList({ ...this.query1, ...queryParams }).then(
        (res) => {
          this.total1 = res.total;
          this.list1 = [...res.rows];
          this.list1.map((t) => {
            if (t.userName) {
              this.showDate = true;
              this.showBtn = false;
            } else {
              this.showDate = false;
              this.showBtn = true;
            }
          });

          this.listArr1 = this.list1.map((t) => {
            return {
              clueNum: t.clueNum,
              opportunityNum: t.opportunityNum,
              orderNum: t.orderNum,
              customerNum: t.customerNum,
              deptName: t.userName || t.deptName,
            };
          });

          this.loading1 = false;
        }
      );
    },
    getList2() {
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      this.loading2 = true;
      // queryParams.searchDeptIds = this.queryParams.searchDeptIds

      dealRankingAnalysisList({ ...this.query2, ...queryParams }).then(
        (res) => {
          this.total2 = res.total;
          this.list2 = res.rows;
          this.list2.forEach((item) => {
            if (item.ancestorProjectCategory) {
              item.ancestorProjectCategory =
                item.ancestorProjectCategory.split(",");
            }
          });

          this.list2.map((t) => {
            if (t.userName) {
              this.showDate = true;
              this.showBtn = false;
            } else {
              this.showDate = false;
              this.showBtn = true;
            }
          });

          this.listArr2 = this.list2.map((t) => {
            return {
              orderAmount: t.orderAmount,
              oneTranAmount: t.oneTranAmount,
              twoTranAmount: t.twoTranAmount,
              mulTranAmount: t.mulTranAmount,

              deptName: t.userName || t.deptName,
            };
          });

          this.loading2 = false;
        }
      );
    },
    getList3() {
      this.loading3 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      conversionRateAnalysisList({ ...this.query3, ...queryParams }).then(
        (res) => {
          this.total3 = res.total;
          this.list3 = res.rows;
          this.list3.map((t) => {
            if (t.userName) {
              this.showDate = true;
              this.showBtn = false;
            } else {
              this.showDate = false;
              this.showBtn = true;
            }
          });
          this.listArr3 = this.list3.map((t) => {
            return {
              wholeConversionRate: t.wholeConversionRate,
              clueConversionRate: t.clueConversionRate,
              opportunityConversionRate: t.opportunityConversionRate,
              deptName: t.userName || t.deptName,
            };
          });
          this.loading3 = false;
        }
      );
    },
    // getList4() {
    //   this.loading4 = true;
    //   var queryParams = JSON.parse(JSON.stringify(this.queryParams))
    //   queryParams.searchDateType = queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType
    //   basicRankingAnalysisList({ ...this.query4, ...queryParams }).then(
    //     (res) => {
    //       this.total4 = res.total;
    //       this.list4 = res.rows;
    //       this.loading4 = false

    //       this.list4.map(t => {
    //         if (t.userName) {
    //           this.showDate = true
    //           this.showBtn = false
    //         } else {
    //           this.showDate = false
    //           this.showBtn = true
    //         }

    //       })
    //     }
    //   );
    // },
    getList5() {
      this.loading5 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      followUpNumAnalysisList({ ...this.query5, ...queryParams }).then(
        (res) => {
          this.total5 = res.total;
          this.list5 = res.rows;
          this.loading5 = false;
          this.list5.map((t) => {
            if (t.userName) {
              this.showDate = true;
              this.showBtn = false;
            } else {
              this.showDate = false;
              this.showBtn = true;
            }

            if (t.postName) {
            }
          });
          this.listArr5 = this.list5.map((t) => {
            return {
              allNum:
                t.clueFollowUpNum +
                t.customerFollowUpNum +
                t.opportunityFollowUpNum +
                t.orderFollowUpNum,

              deptName: t.deptName,
            };
          });

          // // 循环将全部值想加后返回给请求的数组存储使用
          // for (let i = 0; i < this.list5.length; i++) {

          //   this.list5[i].allNum = this.listArr5[i].allNum;
          // }
        }
      );
    },

    // handleClick(row, type) {
    //   this.$router.push({
    //     name: "Rank/useranalyse",
    //     query: { type, deptId: row.deptId },
    //   });
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.searchDeptIds = this.deptDatas.join(',')
      this.query1.pageNum = 1;
      this.query2.pageNum = 1;
      this.query3.pageNum = 1;
      this.query4.pageNum = 1;
      this.query5.pageNum = 1;
      this.init();
    },
    open(value) {
      this.$alert(value, "提示", {
        confirmButtonText: "确定",
        // callback: action => {
        //   this.$message({
        //     type: 'info',
        //     message: `action: ${ action }`
        //   });
        // }
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = this.$route.query;
      // this.queryParams.type =null
      this.queryParams.deptId = null;

      if (this.$route.query.type == 1) {
        this.queryParams.orderByColumn = "clueNum";
        this.queryParams.isAsc = "desc";
      }

      if (this.$route.query.type == 2) {
        this.queryParams.orderByColumn = "orderAmount";
        this.queryParams.isAsc = "desc";
      }
      if (this.$route.query.type == 3) {
        this.queryParams.orderByColumn = "wholeConversionRate";
        this.queryParams.isAsc = "desc";
      }

      if (this.$route.query.type == 5) {
        this.queryParams.orderByColumn = "totalFollowUpNum";
        this.queryParams.isAsc = "desc";
      }
      // this.resetForm("queryForm");
      // if (this.showDepartSelect == true) {
      //   this.resetForm("queryForm");

      //   this.deptDatas = [this.deptOptions[0].id];
      // } else {
      //   this.queryParams.userId = this.$store.state.user.userId;
      // }
      this.init();
    }, // 排序改变
    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.init();
    },
    goBack() {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      //  判断存储的session是否只剩一个 只有一个则直接返回上一页面 否 则获取其中数据请求上一层页面
      if (this.storageData.length == 1) {
        this.$router.go(-1);
      } else {
        this.queryParams = this.storageData.pop();
        sessionStorage.setItem(
          "storageDatas",
          JSON.stringify(this.storageData)
        );
        this.init();
      }
    },
    handleClick(row) {
      //  对数据进行存储 请求下一层的数据
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));

      this.queryParams.searchDeptIds = row.deptId;
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

.gridflex {
  display: flex;
  flex-wrap: wrap;
}

.span {
  background: #f57676;
  color: #fff;
  padding: 1px 3px;
  border-radius: 2px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.vue-treeselect {
  margin-right: 30px;
}

.vue-treeselect >>> .vue-treeselect__control {
  width: 350px;
  min-height: 30px;
  line-height: 32px;
}

.vue-treeselect >>> .vue-treeselect__multi-value-item {
  height: 22px;
}

.vue-treeselect >>> .vue-treeselect__multi-value-item-container {
  height: 25px;
}

.vue-treeselect >>> .vue-treeselect__multi-value-item {
  display: block;
  line-height: 18px;
  height: 22px;
}

.vue-treeselect >>> .vue-treeselect__value-container {
  width: 400px;
  line-height: normal;
}

.vue-treeselect >>> .vue-treeselect__control-arrow-container {
  display: block;
  position: absolute;
  top: 2px;
  right: 8px;
  width: 12px;
  height: 30px;
  line-height: 32px;
}
</style>
