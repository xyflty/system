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
            :clearable="false"
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

    <!-- 柱状图 -->
    <salesPerformance :initData="listArr1"></salesPerformance>
    <!-- 第一个 -->
    <el-card style="margin-top: 20px">
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
        @sort-change="sortChange1"
        :default-sort="{ prop: 'clueNum', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column prop="" type="index" label="排名" align="center" />
        <el-table-column
          v-if="showUserId == false"
          prop="deptName"
          label="主体\部门"
          align="center"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="userName"
          label="用户"
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
          sortable="custom"
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
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              :datas="datas"
              @click="handleClick(row, 1)"
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
    <salesPerformance :initData="listArr2"></salesPerformance>

    <!-- 第二个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 成交排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index2',
              '/zw/salesRankingAnalysis/exportDealRankingAnalysisList'
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
        @sort-change="sortChange2"
        :default-sort="{ prop: 'orderAmount', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column prop="" type="index" label="排名" align="center" />
        <el-table-column
          v-if="showUserId == false"
          prop="deptName"
          label="主体\部门"
          align="center"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="userName"
          label="用户"
          align="center"
        />
        <el-table-column
          prop="orderAmount"
          label="成交金额"
          align="center"
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
          prop="oneTranAmount"
          label="首次成交金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="twoTranAmount"
          label="二次成交金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="mulTranAmount"
          label="多次成交金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="referralTranAmount"
          label="转介绍成交金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="reOrderAmount"
          label="复购金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="averageOrderAmount"
          label="平均客单价"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>
              {{ row.averageOrderAmount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
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
          align="center"
          prop="orderProjectNum"
          label="关联产品数"
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

    <!-- 整体转化率排名列表柱状图 -->
    <salesPerformance :initData="listArr3"></salesPerformance>

    <!-- 第三个 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 转化率排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              'index3',
              '/zw/salesRankingAnalysis/exportConversionRateAnalysisList'
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
        @sort-change="sortChange3"
        :default-sort="{ prop: 'wholeConversionRate', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column prop="" type="index" label="排名" align="center" />
        <el-table-column
          v-if="showUserId == false"
          prop="deptName"
          label="主体\部门"
          align="center"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="userName"
          label="用户"
          align="center"
        />
        <el-table-column
          prop="clueConversionRate"
          label="线索转化率"
          align="center"
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
          prop="wholeConversionRate"
          label="整体转化率"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="twoTranRate"
          label="二次成交转化率"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="mulTranRate"
          label="多次成交转化率"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="oneReferralTranRate"
          label="转介绍一次成交转化率"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="mulReferralTranRate"
          label="转介绍多次成交转化率"
          sortable="custom"
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
    <!-- <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 流失率排名列表 </span>
        </div>
        <el-button @click="handleExport('index4','/zw/salesRankingAnalysis/exportBasicRankingList')" plain>导出数据</el-button>
      </div>

      <el-table
        :data="list4"
        stripe
        style="width: 100%"
        border
        v-loading="loading4"
      >
        <el-table-column prop="x" label="时间" align="center" />
        <el-table-column prop="x" label="主体\部门" align="center" />
        <el-table-column prop="x" label="线索流失率" align="center" />
        <el-table-column
          align="center"
          prop="projectNumber"
          label="商机流失率"
        />
        <el-table-column align="center" prop="num" label="整体流失率" />
        <el-table-column align="center" prop="money" label="商机转化率" />
        <el-table-column align="center" prop="avgMoney" label="客户流失率" />
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
    </el-card> -->

    <!-- 成交排名列表柱状图 -->
    <salesPerformance :initData="listArr5"></salesPerformance>

    <!-- 第五个 -->
    <el-card style="margin-top: 20px">
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
        :data="list5"
        stripe
        style="width: 100%"
        border
        v-loading="loading5"
        @sort-change="sortChange5"
        :default-sort="{ prop: 'totalFollowUpNum', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column prop="" type="index" label="排名" align="center" />
        <el-table-column
          v-if="showUserId == false"
          prop="deptName"
          label="主体\部门"
          align="center"
        />
        <el-table-column
          v-if="showUserId == true"
          prop="userName"
          label="用户"
          align="center"
        />
        <el-table-column
          prop="clueFollowUpNum"
          label="线索跟进次数"
          align="center"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="opportunityFollowUpNum"
          label="商机跟进次数"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="orderFollowUpNum"
          label="订单跟进次数"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="customerFollowUpNum"
          label="客户跟进次数"
          sortable="custom"
        />
        <el-table-column
          sortable="custom"
          align="center"
          prop="totalFollowUpNum"
          label="全部跟进次数"
        />
        <el-table-column
          align="center"
          prop=""
          width="100"
          fixed="right"
          label="详细分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleClick(row, 5)"
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
import salesPerformance from "newreport/chart/salesPerformance.vue";

import { mapState } from "vuex";
import {
  basicRankingAnalysisList,
  dealRankingAnalysisList,
  conversionRateAnalysisList,
  followUpNumAnalysisList,
} from "@/api/newreport/rank";

import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { systemUserListForSelect } from "@/api/system/user";
import { userAndDept } from "../customer/mixins/userAnddept";
import { filterDepts } from "@/utils/common";

export default {
  name: "Rankperformance",
  components: {
    Treeselect,
    Chooseweek,
    salesPerformance,
  },
  mixins: [userAndDept],
  data() {
    return {
      dates: "排行页面",
      value1: "",
      dateMonth: [],
      deptOptions: [],
      userList: [],
      datas: 1,
      deptDatas: [], // 多选的值新
      dateWeeks: [], // 周的时间底层时间
      weekData: [], // 修改后的时间
      startTimeStamp: "", // 周开始的时间
      endTimeStamp: "", // 周结束的时间
      queryParams: {
        searchDeptId: undefined,
        searchDateType: 1,
        userId: "",
        searchStartDate: "2023",
        searchEndDate: "2023",
        searchDeptIds: "", // 多选的id
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

      // 存储表格的数据
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
      storageData: [], // 存储返回的数据
      setData: "",
      setStartYear: undefined,
      setEndYear: undefined,
      setStartMonth: undefined,
      setEndMonth: undefined,
      setStartDay: undefined,
      setEndDay: undefined,
      setDataYear: "",
      dateDatas1: "",
      dateDatas2: "",
      showDepartSelect: true,
      showUserId: false, // 根据其判断表格用户是否存在 存在展示用户 不尊在显示未部门
      showDepatData: true,
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

    // 监听多选框的变化
    $route(to, from) {
      if (from.name === "useranalyse" && to.name === "Rankperformance") {
        this.include = ["performance"];
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== "Rank/useranalyse") {
      sessionStorage.setItem("storageDatas", null);
    }
    next();
  },
  mounted() {
    // if (
    //   JSON.parse(sessionStorage.getItem("storageDatas")) !== null &&
    //   JSON.parse(sessionStorage.getItem("storageDatas")).length !== 0
    // ) {
    //   this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
    //   this.queryParams = this.storageData[0];
    //   this.$nextTick(() => {
    //     if (this.queryParams.searchDateType == 3) {
    //       this.$refs.Chooseweek.getMont(this.queryParams.searchStartDate);
    //     }
    //   });
    //   this.showDepatData = false
    // }
    // this.getTreeselect();
  },
  activated() {
    // 显示时
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
      console.log(this.queryParams.userId);
      if (this.queryParams.userId) {
        this.queryParams.searchDeptIds = undefined;
        this.queryParams.searchDeptId = undefined;
        this.deptDatas = [];
        console.log(this.queryParams.searchDeptIds);
      }
    },
    // 选择日期周子组件传过来的值
    date(value) {
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
    // 导出
    handleExport(index, url) {
      if (index == "index1") {
        this.queryParams.orderByColumn = "clueNum";
        this.queryParams.isAsc = "desc";
      } else if (index == "index2") {
        this.queryParams.orderByColumn = "orderAmount";
        this.queryParams.isAsc = "desc";
      } else if (index == "index3") {
        this.queryParams.orderByColumn = "wholeConversionRate";
        this.queryParams.isAsc = "desc";
      } else if (index == "index5") {
        this.queryParams.orderByColumn = "totalFollowUpNum";
        this.queryParams.isAsc = "desc";
      }

      this.download(
        url,
        { ...this[index], ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      if (
        JSON.parse(sessionStorage.getItem("storageDatas")) !== null &&
        JSON.parse(sessionStorage.getItem("storageDatas")).length !== 0
      ) {
        this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
        let dataArr = {};
        dataArr.searchStartDate = this.storageData[0].searchStartDate;
        this.queryParams = this.storageData.pop();

        this.queryParams.searchDateType = this.queryParams.searchDateType;
        this.queryParams.searchStartDate = this.queryParams.searchStartDate;
        this.$nextTick(() => {
          if (this.queryParams.searchDateType == 3) {
            this.$refs.Chooseweek.getMont(dataArr.searchStartDate);
          }
        });

        if (this.queryParams.searchDateType == 1) {
          this.setStartYear = this.queryParams.searchStartDate;
          this.setEndYear = this.queryParams.searchEndDate;
        }
        if (this.queryParams.searchDateType == 2) {
          this.setStartMonth = this.queryParams.searchStartDate;
          this.setEndMonth = this.queryParams.searchEndDate;
        }
        if (this.queryParams.searchDateType == 4) {
          this.setStartDay = this.queryParams.searchStartDate;
          this.setEndDay = this.queryParams.searchEndDate;
        }
        sessionStorage.setItem(
          "storageDatas",
          JSON.stringify(this.storageData)
        );
        this.showDepatData = false;
      }

      if (this.showDepatData == true) {
        if (this.$store.state.user.treeList) {
          let { children, deptIds } = filterDepts(
            this.$store.state.user.treeList,
            this.$store.state.user.defaultDeptId
          );
          this.deptOptions = children;
          // console.log(  children,deptIds,'打印的数据');
          deptIds = deptIds.join(",");
          this.queryParams.searchDeptIds = deptIds;
          console.log(this.queryParams.searchDeptIds);
          // this.queryParams.searchDeptId = deptIds;
          this.deptDatas = String(this.queryParams.searchDeptIds)
            .split(",")
            .map((i) => {
              if (i == 200) {
                return Number(i);
              } else {
                return i;
              }
            });
          // this.deptDatas = deptIds
        } else {
          this.queryParams.userId = this.$store.state.user.userId;
          this.showDepartSelect = false;
        }
      } else {
        if (this.$store.state.user.treeList) {
          let { children, deptIds } = filterDepts(
            this.$store.state.user.treeList,
            this.$store.state.user.defaultDeptId
          );
          this.deptOptions = children;
          deptIds = deptIds.join(",");
          this.queryParams.searchDeptIds = deptIds;
          // this.queryParams.searchDeptId = deptIds;

          this.deptDatas = String(this.queryParams.searchDeptIds)
            .split(",")
            .map((i) => {
              if (i == 200) {
                return Number(i);
              } else {
                return i;
              }
            });
        } else {
          this.queryParams.userId = this.$store.state.user.userId;
          this.showDepartSelect = false;
        }
      }

      this.getUserList();
      this.init();
      this.showDepatData = true;
      // });
    },
    /** 查询用户列表 */
    getUserList(deptId, e, isFocus = true) {
      systemUserListForSelect({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
        deptId: deptId,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
    init() {
      this.getList1();
      this.getList2();
      this.getList3();
      // this.getList4();
      this.getList5();
    },

    getList1() {
      this.loading1 = true;
      if (this.query1.orderByColumn) {
        // this.query1.orderByColumn = "";
        // this.query1.isAsc = ""
      } else {
        this.query1.orderByColumn = "clueNum";
        this.query1.isAsc = "desc";
      }

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      basicRankingAnalysisList({ ...queryParams, ...this.query1 }).then(
        (res) => {
          this.total1 = res.total;
          this.list1 = res.rows;
          let data = this.list1.map((t) => {
            return {
              clueNum: t.clueNum,
            };
          });

          // 判断用户是否存在 存在显示不存在显示为部门
          this.list1.map((t) => {
            if (t.userName) {
              this.showUserId = true;
            } else {
              this.showUserId = false;
            }
          });

          // 对其进行排序操作
          data = [...data].sort((a, b) => b.clueNum - a.clueNum);
          data.map((t, index) => {
            this.list1.map((item) => {
              if (t == item.clueNum) {
                item.index = index;
              }
            });
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
      this.loading2 = true;
      if (this.query2.orderByColumn) {
        // this.query1.orderByColumn = "";
        // this.query1.isAsc = ""
      } else {
        this.query2.orderByColumn = "orderAmount";
        this.query2.isAsc = "desc";
      }

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      console.log({ queryParams });
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      dealRankingAnalysisList({ ...queryParams, ...this.query2 }).then(
        (res) => {
          this.total2 = res.total;
          this.list2 = res.rows;
          this.list2.forEach((item) => {
            if (item.ancestorProjectCategory) {
              item.ancestorProjectCategory =
                item.ancestorProjectCategory.split(",");
            }
          });
          // 判断用户是否存在 存在显示不存在显示为部门
          this.list2.map((t) => {
            if (t.userName) {
              this.showUserId = true;
            } else {
              this.showUserId = false;
            }
          });
          // 饼图传送的数据
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
      if (this.query3.orderByColumn) {
        // this.query1.orderByColumn = "";
        // this.query1.isAsc = ""
      } else {
        this.query3.orderByColumn = "wholeConversionRate";
        this.query3.isAsc = "desc";
      }

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      conversionRateAnalysisList({ ...queryParams, ...this.query3 }).then(
        (res) => {
          this.total3 = res.total;
          this.list3 = res.rows;

          this.listArr3 = this.list3.map((t) => {
            return {
              wholeConversionRate: t.wholeConversionRate,
              clueConversionRate: t.clueConversionRate,
              opportunityConversionRate: t.opportunityConversionRate,
              deptName: t.userName || t.deptName,
            };
          });

          // 判断用户是否存在 存在显示不存在显示为部门
          this.list3.map((t) => {
            if (t.userName) {
              this.showUserId = true;
            } else {
              this.showUserId = false;
            }
          });

          this.loading3 = false;
        }
      );
    },
    // getList4() {
    //   this.loading4 = true;
    //   basicRankingAnalysisList({ ...this.query4, ...this.queryParams }).then((res) => {
    //     this.total4 = res.total;
    //     this.list4 = res.rows;
    //     this.loading4 = false;
    //   });
    // },
    getList5() {
      this.loading5 = true;

      if (this.query5.orderByColumn) {
        // this.query1.orderByColumn = "";
        // this.query1.isAsc = ""
      } else {
        this.query5.orderByColumn = "totalFollowUpNum";
        this.query5.isAsc = "desc";
      }

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      followUpNumAnalysisList({ ...queryParams, ...this.query5 }).then(
        (res) => {
          this.total5 = res.total;
          this.list5 = res.rows;
          this.loading5 = false;

          this.listArr5 = this.list5.map((t) => {
            return {
              allNum: t.totalFollowUpNum,

              deptName: t.userName || t.deptName,
            };
          });
          // 判断用户是否存在 存在显示不存在显示为部门
          this.list5.map((t) => {
            if (t.userName) {
              this.showUserId = true;
            } else {
              this.showUserId = false;
            }
          });
        }
      );
    },

    handleClick(row, type) {
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      console.log(row, this.queryParams);
      this.$router.push({
        name: "Rank/useranalyse",
        query: {
          type,
          deptId: row.deptId,
          searchDateType: this.queryParams.searchDateType,
          searchStartDate: this.queryParams.searchStartDate,
          searchEndDate: this.queryParams.searchEndDate,
          searchDeptIds: row.deptId,
          userId: row.userId || this.queryParams.userId,
        },
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      // this.dateMonth = [];
      this.queryParams.searchEndDate = "2023";
      this.queryParams.searchStartDate = "2023";
      this.setStartData = "2023";
      this.setEndData = "2023";
      if (this.showDepartSelect == true) {
        this.resetForm("queryForm");
        // this.queryParams.searchStartDate = undefined;
        let { children, deptIds } = filterDepts(
          this.$store.state.user.treeList,
          this.$store.state.user.defaultDeptId
        );
        this.deptOptions = children;
        deptIds = deptIds.join(",");
        this.queryParams.searchDeptIds = deptIds;
        // this.queryParams.searchDeptId = deptIds;
        console.log(this.queryParams.searchDeptIds);
        this.deptDatas = String(this.queryParams.searchDeptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });
      } else {
        this.resetForm("queryForm");
        this.queryParams.userId = this.$store.state.user.userId;
      }
      // this.queryParams.content = '选择周'
      this.init();
    },
    // 当前时间发生改变,提交到statistics中保存
    dataTypeChange() {
      this.queryParams = this.queryParams;
      this.$store.commit("ADD_TIME_STATUS", this.queryParams);
    },

    sortChange1({ column, prop, order }) {
      this.query1.orderByColumn = prop;
      this.query1.isAsc = order === "descending" ? "desc" : "asc";
      this.getList1();
    },
    sortChange2({ column, prop, order }) {
      this.query2.orderByColumn = prop;
      this.query2.isAsc = order === "descending" ? "desc" : "asc";
      this.getList2();
    },
    sortChange3({ column, prop, order }) {
      this.query3.orderByColumn = prop;
      this.query3.isAsc = order === "descending" ? "desc" : "asc";
      this.getList3();
    },
    // sortChange4({ column, prop, order }) {
    //   this.query4.orderByColumn = prop;
    //   this.query4.isAsc = order === "descending" ? "desc" : "asc";
    //   this.getList4();
    // },
    // 排序
    sortChange5({ column, prop, order }) {
      this.query5.orderByColumn = prop;
      this.query5.isAsc = order === "descending" ? "desc" : "asc";
      this.getList5();
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
