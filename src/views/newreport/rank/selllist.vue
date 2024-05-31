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
            @input="treeselectInput"
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
            <!--  :remote-method="getUserList"
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

    <!-- 第一个 -->
    <el-card v-if="type == 4 || type == 1" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{
            [
              "产品销售业务员排名分析",
              `${name}数据来源钻取分析`,
              `${name}钻取分析`,
              `${name}钻取分析`,
              `${name}钻取分析`,
            ][type - 1]
          }}</span>
        </div>
        <el-button size="mini" @click="handleExport" plain>导出数据</el-button>
      </div>
      <el-table
        :key="Math.random()"
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
        @sort-change="sortChange2"
        :default-sort="{ prop: 'totalPrice', order: 'descending' }"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <el-table-column
          prop="topCategoryName"
          label="项目大类"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="secondCategoryName"
          label="项目二级分类"
          align="center"
          min-width="100"
        />
        <el-table-column prop="projectType" label="项目类型" align="center" />
        <el-table-column prop="projectName" label="产品名称" align="center" />
        <el-table-column prop="userName" label="业务员" align="center" />
        <el-table-column
          prop=""
          type="index"
          label="排名"
          align="center"
          min-width="80"
        />
        <el-table-column
          align="center"
          prop="projectQuantity"
          label="销售数量"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="totalPrice"
          label="销售金额"
          sortable="custom"
        />
        <el-table-column
          align="center"
          prop="averagePrice"
          label="平均客单价"
        />
        <el-table-column align="center" prop="orderNum" label="关联订单数">
          <template slot-scope="{ row }">
            <span class="ableClick" @click="handleClick({ row })">{{
              row.orderNum
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="customerNum" label="关联客户数">
          <template slot-scope="{ row }">
            <span class="ableClick" @click="handleClick({ row })">{{
              row.customerNum
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>

    <!-- 显示城市 钻取按钮跳转 -->
    <el-card v-if="type == 7 && city == true" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>城市分布占比</span>
        </div>
        <!-- <el-button size="mini" @click="handleExport" plain>导出数据</el-button> -->
      </div>

      <!-- 点击饼图钻取所出现的页面 -->
      <el-table
        :key="Math.random()"
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
        @sort-change="sortChange"
        :default-sort="{ prop: 'productPrice', order: 'descending' }"
      >
        <!-- <el-table-column   prop="customerCity" :label="城市" align="center" min-width="80" /> -->
        <el-table-column v-if="type == 7" align="center" prop="" label=" 城市">
          <template slot-scope="{ row }">
            <span>{{ row.customerCity || row.customerArea }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column v-if="area ==true" prop="customerArea" label="城市" align="center" min-width="80" /> -->
        <el-table-column
          prop="vocationalTrainingServices"
          label="职训服务"
          align="center"
          min-width="80"
          sortable="custom"
        />
        <el-table-column
          prop="enterpriseServices"
          label="企业服务"
          align="center"
          min-width="100"
          sortable="custom"
        />
        <el-table-column
          prop="talentServices"
          label="人才服务"
          align="center"
          sortable="custom"
        />
        <el-table-column
          prop="educationCenter"
          label="教育中心"
          align="center"
          sortable="custom"
        />
        <el-table-column
          :key="156"
          prop="productCount"
          label="销售产品数量"
          align="center"
          sortable="custom"
        />

        <el-table-column
          :key="122"
          align="center"
          prop="productPrice"
          label="销售金额"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="" label="钻取分析">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="requireData(row)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>
    <!-- 城市切换县区 表格内容可以点击跳转，钻取按钮消失 -->
    <el-card
      v-if="(type == 7 && city == false) || type == 8"
      style="margin-top: 20px"
    >
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{ name || "数据来源" }} 分布占比</span>
        </div>
        <!-- <el-button size="mini" @click="handleExport" plain>导出数据</el-button> -->
      </div>

      <!-- 点击饼图钻取所出现的页面 -->
      <el-table
        :key="Math.random()"
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
        @sort-change="sortChange"
        :default-sort="{ prop: 'productPrice', order: 'descending' }"
      >
        <!-- <el-table-column   prop="customerCity" :label="城市" align="center" min-width="80" /> -->
        <el-table-column v-if="type == 7" align="center" prop="" label=" 县区">
          <template slot-scope="{ row }">
            <span>{{ row.customerArea }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type == 8"
          align="center"
          prop=""
          label="数据来源"
        >
          <template slot-scope="{ row }">
            <span>{{ row.dataSource }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="area ==true" prop="customerArea" label="城市" align="center" min-width="80" /> -->

        <el-table-column
          align="center"
          prop="vocationalTrainingServices"
          label="职训服务"
          min-width="80"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              @click="
                requireData(row, row.vocationalTrainingServicesId, '职训服务')
              "
              >{{ row.vocationalTrainingServices }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="enterpriseServices"
          label="企业服务"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              @click="requireData(row, row.enterpriseServicesId, '企业服务')"
              >{{ row.enterpriseServices }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="talentServices"
          label="人才服务"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              @click="requireData(row, row.talentServicesId, '人才服务')"
              >{{ row.talentServices }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="educationCenter"
          label="教育中心"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              @click="requireData(row, row.educationCenterId, '教育中心')"
              >{{ row.educationCenter }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productCount"
          :key="157"
          label="销售产品数量"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="122"
          align="center"
          prop="productPrice"
          label="销售金额"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productPrice }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>

    <!-- 显示城市 钻取按钮跳转 -->
    <el-card v-if="type == 3 || type == 3" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{ name }}产品销售情况</span>
        </div>
        <!-- <el-button size="mini" @click="handleExport" plain>导出数据</el-button> -->
      </div>

      <!-- 点击饼图钻取所出现的页面 -->

      <el-table
        :key="Math.random()"
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
        @sort-change="sortChange"
        :default-sort="{ prop: 'productPrice', order: 'descending' }"
      >
        <el-table-column
          v-if="setType == 1"
          align="center"
          prop="categoryName"
          label="项目二级分类"
        >
          <template slot-scope="{ row }">
            <span>{{ row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="setType == 2"
          align="center"
          prop="categoryName"
          label="项目三级分类"
        >
          <template slot-scope="{ row }">
            <span>{{ row.categoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productCount"
          label="销售产品数量"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="122"
          align="center"
          prop="productPrice"
          label="销售产品金额"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderCount"
          :key="155"
          label="关联订单数"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.orderCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="associatedCustomerCount"
          label="关联客户数"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.associatedCustomerCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :key="Math.random()"
          align="center"
          prop=""
          label="钻取分析"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="requireData(row)"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>

    <!-- 钻取到用户的详情页面 -->
    <el-card v-if="type == 9" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{ name }} 钻取分析</span>
        </div>
        <!-- <el-button size="mini" @click="handleExport" plain>导出数据</el-button> -->
      </div>

      <!-- 点击饼图钻取所出现的页面 -->

      <el-table
        :key="Math.random()"
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
        @sort-change="sortChange"
        :default-sort="{ prop: 'orderPrice', order: 'descending' }"
      >
        <el-table-column align="center" prop="deptName" label="部门">
          <template slot-scope="{ row }">
            <span>{{ row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          align="center"
          prop="postName"
          label="职务"
        >
          <template slot-scope="{ row }">
            <span>{{ row.postName }}</span>
          </template>
        </el-table-column>
        <el-table-column :key="134" align="center" prop="userName" label="姓名">
          <template slot-scope="{ row }">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="135"
          align="center"
          prop="orderTitle"
          label="订单名称"
        >
          <template slot-scope="{ row }">
            <span>{{ row.orderTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="136"
          align="center"
          prop="orderStatus"
          label="订单状态"
        >
          <template slot-scope="{ row }">
            <span>{{ row.orderStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="137"
          align="center"
          prop="companyName"
          label="客户名称"
        >
          <template slot-scope="{ row }">
            <span>{{ row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="122"
          align="center"
          prop="orderPrice"
          label="订单金额"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            <span>{{ row.orderPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="customerGradeName"
          label="客户等级"
        >
          <template slot-scope="{ row }">
            <span>{{ row.customerGradeName }}类</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="customerArea" label="客户地区">
          <template slot-scope="{ row }">
            <span>{{ row.customerArea }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getList"
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
  projectSalesRankingList,
  customerBehavior as countCustomerBehavior,
  projectUserSales,
  cityDigInto,
  projectBigClassDigInto,
  customerDigInto,
  dataSourceDigInto,
} from "@/api/newreport/rank";
import { userAndDept } from "../customer/mixins/userAnddept";
import { filterDepts } from "@/utils/common";

export default {
  name: "Selllist",
  components: { Treeselect, Chooseweek },
  mixins: [userAndDept],
  data() {
    return {
      type: 1,
      name: "",
      serverName: "", // 点击表格中具体数据在下个页面标题展示
      previousRouterName: "",
      dateMonth: [],
      deptOptions: [],
      userList: [],
      deptDatas: [],
      datas: "", // 存储日期的时间，用来切换显示
      queryParams: {
        searchDeptId: undefined,
        searchDateType: 1,
        searchStartDate: "2023",
        searchEndDate: "2023",
        searchDeptIds: "",
      },
      query: { pageNum: 1, pageSize: 10 },
      total: 0,
      list: [],
      loading: false,
      storageData: [],
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
      city: true,
      showDetail: false,
      comdata: null,
      data2: undefined,
      setType: 0, // 当前的页面在钻取时有nextId则给赋值为1 第二次传nextiD 赋值为2
      showDepartSelect: true, // 在用户进来权限较低时进行处理 部门隐藏
    };
  },
  computed: {
    ...mapState(["statistics"]),
    ...mapState(["commonData"]),
    // this.$store.state.commonData.commonData.xtOrderStatus
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
  created() {
    // class mySteam extends ReadAble {
    //   constructor(options, data) {
    //     super(options)
    //     this.data2 = data
    //   }
    //   _read() {
    //     this.push(this.data2)
    //     this.push(null)
    //   }
    // }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.previousRouterName = from.name;
    });
  },
  mounted() {
    this.$route.query.orderByColumn = null;
    this.$route.query.isAsc = null;

    // this.queryParams = this.$route.query;

    const { queryParams, type, name, ...query } = this.$route.query;
    this.type = type;
    this.name = name;
    this.queryParams = { ...JSON.parse(queryParams), ...query };
    let data = { ...JSON.parse(queryParams) };

    if (data.searchDateType == 1) {
      this.setStartYear = data.searchStartDate;
      this.setEndYear = data.searchEndDate;
    }
    if (data.searchDateType == 2) {
      this.setStartMonth = data.searchStartDate;
      this.setEndMonth = data.searchEndDate;
    }
    if (data.searchDateType == 4) {
      this.setStartDay = data.searchStartDate;
      this.setEndDay = data.searchEndDate;
    }

    this.$nextTick(() => {
      if (this.queryParams.searchDateType == 3) {
        this.$refs.Chooseweek.getMont(JSON.parse(queryParams).searchStartDate);
      }
    });

    this.queryParams.searchDeptIds = this.queryParams.searchDeptIds;
    if (this.previousRouterName == "Orderlist") {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.queryParams = this.storageData.pop();

      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      this.queryParams.searchDateType = this.queryParams.searchDateType;

      this.$nextTick(() => {
        if (this.queryParams.searchDateType == 3) {
          this.$refs.Chooseweek.getMont(this.queryParams.searchStartDate);
        }
      });

      this.setStartData = this.queryParams.searchStartDate;
      this.setEndData = this.queryParams.searchEndDate;
    }

    if (this.queryParams.searchDeptIds) {
      this.deptDatas = String(this.queryParams.searchDeptIds)
        .split(",")
        .map((i) => {
          if (i == 200 || i == 100) {
            return Number(i);
          } else {
            return i;
          }
        });
    }
    this.getTreeselect();
    this.getUserList();
    this.getList();
  },
  methods: {
    treeselectInput(i) {
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
    handleExport() {
      this.download(
        "/zw/salesRankingAnalysis/exportProjectUserSales",
        { ...this.query, ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      // treeselect().then((response) => {
      //   this.deptOptions = response.data;
      // });

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
        this.showDepartSelect = false;
      }
    },

    getList() {
      this.loading = true;
      let params = [
        this.type == 1 ? projectUserSales : projectSalesRankingList,
      ];

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      if (this.type == 3) {
        if (queryParams.orderByColumn) {
        } else {
          queryParams.orderByColumn = "productPrice";
          queryParams.isAsc = "desc";
        }

        if (this.setType == 0) {
          this.setType = 1;
        }

        projectBigClassDigInto({ ...this.query, ...queryParams }).then(
          (res) => {
            this.total = res.total;
            this.list = res.rows;
            this.loading = false;
          }
        );
      }
      if (this.type == 4 || this.type == 1) {
        if (queryParams.orderByColumn) {
        } else {
          queryParams.orderByColumn = "totalPrice";
          queryParams.isAsc = "desc";
        }

        params[0]({ ...this.query, ...queryParams }).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading = false;
        });
      }
      // 请求点击钻取进来的数据
      if (this.type == 7) {
        if (queryParams.orderByColumn) {
        } else {
          queryParams.orderByColumn = "productPrice";
          queryParams.isAsc = "desc";
        }
        if (queryParams.customerCity) {
          this.city = false;
          this.name = queryParams.customerCity;
        }
        cityDigInto({ ...this.query, ...queryParams }).then((res) => {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (this.type == 8) {
        if (queryParams.orderByColumn) {
        } else {
          queryParams.orderByColumn = "productPrice";
          queryParams.isAsc = "desc";
        }

        dataSourceDigInto({ ...this.query, ...queryParams }).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading = false;
          this.commonData.commonData.dataSourceList.map((t) => {
            this.list.map((item) => {
              if (item.dataSource == t.value) {
                item.dataSource = t.label;
              }
            });
          });
        });
      }

      // 请求用户的数据
      if (this.type == 9) {
        if (queryParams.orderByColumn) {
        } else {
          queryParams.orderByColumn = "orderPrice";
          queryParams.isAsc = "desc";
        }

        customerDigInto({ ...this.query, ...queryParams }).then((res) => {
          this.total = res.total;
          this.list = res.rows;
          // 对获取到的订单状态进行判断 给其不同是数据类型
          this.commonData.commonData.xtOrderStatus.map((t) => {
            this.list.map((item) => {
              if (item.orderStatus == t.value) {
                item.orderStatus = t.label;
              }
            });
          });

          this.loading = false;
        });
      }
    },

    handleClick({ row }) {
      console.log(row);
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.storageData.push(this.queryParams);

      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      if (this.type == 1) {
        this.queryParams.userId = row.userId;
        this.queryParams.searchDeptIds = undefined;
      }
      // 在进入下一页面前清除参数携带的排序 不影响到下一个页面
      this.queryParams.orderByColumn = null;
      this.queryParams.isAsc = null;
      this.$router.push({
        name: "Orderlist",
        query: {
          queryParams: JSON.stringify(this.queryParams),
          projectId: row.projectId,
        },
      });
    },
    requireData(row, id, deptName) {
      console.log(row);
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      // 传递城市过去时
      if (row.customerCity) {
        this.queryParams.customerCity = row.customerCity;
        this.name = row.customerCity;
        this.city = false;

        // 传递区过去时
      } else if (row.customerArea) {
        this.queryParams.customerArea = row.customerArea;
        this.queryParams.nextCategoryId = id;
        this.name = row.customerArea + "-" + deptName;
        this.setType = 1;

        // this.queryParams.nextCategoryId = row.nextCategoryId
        this.type = 3;
      } else if (this.type == 8) {
        this.queryParams.nextCategoryId = id;
        this.queryParams.detail = "数据";
        this.type = 3;

        this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
        let data = this.storageData.pop();
        this.storageData.push(this.queryParams);
        this.name = row.dataSource + "-" + deptName;
        sessionStorage.setItem(
          "storageDatas",
          JSON.stringify(this.storageData)
        );
      } else if (row.nextFlag == false) {
        this.queryParams.categoryId = row.categoryId;
        console.log("直接进入用户");
        // this.setType = 2;
        // this.showDetail = true;
        this.type = 9;
      } else if (row.nextFlag == true) {
        console.log("继续钻取项目");
        this.queryParams.nextCategoryId = row.nextCategoryId;
        this.setType = 2;
        this.queryParams.detail = null;
        this.showDetail = true;
      }
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;
      this.getList();
    },
    //type == 1 和4 时 使用原来排序
    sortChange2({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    // 不等于时使用新的排序
    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.getList();
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    // 提示框样式
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
      const { queryParams, type, name, ...query } = this.$route.query;
      this.type = type;
      this.name = name;
      this.queryParams = { ...JSON.parse(queryParams), ...query };
      let data = { ...JSON.parse(queryParams) };

      if (data.searchDateType == 1) {
        this.setStartYear = data.searchStartDate;
        this.setEndYear = data.searchEndDate;
      }
      if (data.searchDateType == 2) {
        this.setStartMonth = data.searchStartDate;
        this.setEndMonth = data.searchEndDate;
      }
      if (data.searchDateType == 4) {
        this.setStartDay = data.searchStartDate;
        this.setEndDay = data.searchEndDate;
      }

      if (this.$store.state.user.treeList) {
        this.resetForm("queryForm");
        let { children, deptIds } = filterDepts(
          this.$store.state.user.treeList,
          this.$store.state.user.defaultDeptId
        );
        this.deptOptions = children;

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

        this.queryParams.searchDeptIds = null;
      }

      this.getList();
    },
    // 返回上一层
    goBack() {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      // 数组为1 直接返回首页
      if (this.storageData.length == 1) {
        this.$router.go(-1);
      } else {
        this.queryParams = this.storageData.pop();
        sessionStorage.setItem(
          "storageDatas",
          JSON.stringify(this.storageData)
        );

        // 当前页面为客户页面直接跳回项目大类的页面
        if (this.type == 9) {
          this.type = 3;
          // this.showDetail = false;
          this.queryParams.categoryId = null;
        } else if (this.type == 3) {
          if (
            !this.queryParams.customerArea &&
            !this.queryParams.detail &&
            this.setType !== 2
          ) {
            this.queryParams.customerArea = null;
            this.queryParams.nextCategoryId = null;
            this.type = 7;
            this.city = false;
            this.setType = 0;
            this.name = this.queryParams.customerCity;
          } else {
            // 判断  setType 类型 等于1 表格显示二级分类 为2 显示三级分类
            if (this.setType == 2) {
              this.setType = 1;
              this.showDetail = false;
            } else {
              if (this.queryParams.detail) {
                this.type = 8;
                this.queryParams.detail = null;
                this.queryParams.nextCategoryId = null;
                this.name = "数据来源";
              }
            }
          }

          //当前页面是否有nextId 有的话清空再次跳转项目大类，如果没有的话则直接跳入城市区域占比页面
        } else if (this.type == 7) {
          this.city = true;
        } else if (this.type == 8) {
        }
        this.getList();
      }
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
