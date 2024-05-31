<template>
  <div class="box app-container">
    <!-- 日期和部门 -->
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="searchDateType">
          <el-select
            v-model="queryParams.searchDateType"
            @change="toggleDateType"
          >
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

        <!-- 全部项目大类的 -->
        <el-select
          class="project-date"
          v-model="value1"
          filterable
          clearable
          placeholder="全部项目大类"
          @change="getProjectType($event, 'big')"
        >
          <el-option
            v-for="item in parentIds"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <!-- 二级项目大类的 -->
        <el-select
          class="project-date"
          v-model="value2"
          filterable
          clearable
          placeholder="全部项目二级分类"
          :disabled="!value1"
          @change="getProjectType($event, 'medium')"
        >
          <el-option
            v-for="key in secondIds"
            :key="key.id"
            :label="key.categoryName"
            :value="key.id"
          >
          </el-option>
        </el-select>

        <!--项目类型 -->
        <el-select
          class="project-date"
          v-model="value3"
          filterable
          clearable
          placeholder="项目类型"
          :disabled="!value2"
          @change="getProjectType($event, 'samll')"
        >
          <el-option
            v-for="date in sonIds"
            :key="date"
            :label="date"
            :value="date"
          >
          </el-option>
        </el-select>

        <!-- 产品名称 -->
        <el-select
          class="project-date"
          v-model="value4"
          filterable
          clearable
          placeholder="产品名称"
          :disabled="!value3"
        >
          <el-option
            v-for="date in productIds"
            :key="date.id"
            :label="date.categoryName + '-' + date.projectName"
            :value="date.id"
          >
          </el-option>
        </el-select>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="searchDateList"
            size="mini"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="reSet"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据预览 -->
    <el-card v-loading="previewLoading">
      <div class="menu-box">
        <div
          v-for="(item, index) in previewData"
          :key="index"
          class="text item"
        >
          <div>{{ item.lable }}</div>
          <div>{{ item.value || 0 }}</div>
        </div>
      </div>
    </el-card>
    <!-- 柱形图 -->
    <el-card v-if="showMaxPermission == true" v-loading="barLoading">
      <div class="column">
        <pieChart :initData="barData"></pieChart>
      </div>
    </el-card>

    <!-- 扇形图 -->
    <el-row :gutter="15" style="margin-top: 15px">
      <template v-for="(title, key) in PieChartCompare">
        <el-col :key="key" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-card v-loading="pieLoading">
            <div class="flextop">
              <span>{{ title }}</span>
              <el-button
                v-if="PieChartData[key].isDrill"
                type="primary"
                size="mini"
                @click="goCityData(key)"
                >钻取</el-button
              >
            </div>
            <productPie
              :initData="PieChartData[key].echartData"
              @click="pieClick($event, key, PieChartData[key].isClick)"
            ></productPie>
          </el-card>
        </el-col>
      </template>
    </el-row>

    <!-- 底部表格 -->
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>产品销售情况列表 </span>
        </div>
        <!-- <el-button plain>导出数据</el-button> -->
      </div>

      <div class="menu-box">
        <div
          v-for="(item, index) in previewData"
          :key="index"
          class="text item2"
        >
          <div>{{ item.lable }}:</div>
          <div>{{ item.value || 0 }}</div>
        </div>

        <!-- 导出 -->
        <div class="export-box">
          <el-button
            class="export"
            @click="
              handleExport(
                '/zw/salesRankingAnalysis/exportProjectSalesRankingList'
              )
            "
            plain
            >导出数据</el-button
          >
        </div>
      </div>

      <avue-crud
        :data="productData"
        :page.sync="productPage"
        :option="productOptions"
        :table-loading="productLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange2"
      >
        <template #searchStartDate>
          {{ queryParams.searchStartDate }} 至 {{ queryParams.searchEndDate }}
        </template>
        <template #orderNum="scope">
          <span
            class="click--active"
            @click="getData(scope.row, 'relevancy', '关联订单')"
          >
            {{ scope.row.orderNum || 0 }}</span
          >
        </template>
        <template #customerNum="scope">
          <span
            class="click--active"
            @click="getData(scope.row, 'relevancy', '关联客户')"
          >
            {{ scope.row.customerNum || 0 }}</span
          >
        </template>
        <template #zwzx="scope">
          <span
            class="click--active"
            @click="getData(scope.row, 'dept', '第二集团军')"
          >
            {{ scope.row.zwzx || 0 }}</span
          >
        </template>
        <template #dyjtj="scope">
          <span
            class="click--active"
            @click="getData(scope.row, 'dept', '第一集团军')"
          >
            {{ scope.row.dyjtj || 0 }}</span
          >
        </template>
        <!-- <template #userName="scope">
          <span class="click--active" @click="getData(scope.row, 'user')">
            {{ scope.row.userName || 0 }}</span
          >
        </template> -->
        <template slot-scope="{ row, index }" slot="menu">
          <el-button size="mini" type="primary" @click="handleClick(row, index)"
            >钻取</el-button
          >
        </template>
      </avue-crud>
    </el-card>
  </div>
</template>

<script>
// 接口api start
import { list, projectTypeList } from "@/api/core/project/category";
// 获取项目名称接口
import { listDate } from "@/api/core/project/index";
// 获取所有用户接口
import { systemUserListForSelect } from "@/api/system/user";

// 页面数据接口
import {
  projectSalesInfo,
  getSecondDeptProjectCount,
  countCategoryOrProject,
  countCustomerCity,
  projectSalesRankingList,
  projectBigClassDigInto,
  customerDigInto,
  cityDigInto,
  getOrder,
  projectUserSales,
  getUserSales,
  getUserSalesInfo,
  getNoneChildDeptSales,
  getNoneChildDeptSalesInfo,
} from "@/api/newreport/rank";

// 接口api end

// 图表
import pieChart from "newreport/chart/pie2.vue";
import productPie from "newreport/chart/productPie.vue";

// 周选择组件
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
// // 表格弹出框组件
// import TableModel from "../components/TableModel.vue";

// 导入配置信息
import {
  products,
  projectOptions,
  cityOptions,
  sellDetail,
} from "../data/tableOptions";

import { cloneDeep } from "lodash";
import { filterDepts } from "@/utils/common";
import { mapState } from "vuex";
export default {
  components: { pieChart, productPie, Chooseweek },
  data() {
    return {
      userList: [], //用户数据列表
      deptOptions: [], //部门数据列表

      queryParams: {
        searchDateType: 1,
        searchStartDate: "",
        searchEndDate: "",
        topCategoryId: "", //	项目大类id
        secondCategoryId: "", //	二级分类id
        projectType: "", // 项目类型
      },
      parentIds: [], // 全部项目大类
      secondIds: [], // 项目大类里面的二级分类
      sonIds: [], // 二级分类里面的项目类型
      productIds: [], // 产品里的数据
      value1: "", // 全部项目大类
      value2: "", // 项目二级分类
      value3: "", // 项目类型
      value4: "", // 产品名称

      dateMonth: [], //日期

      previewLoading: false, //数据预览加载
      previewData: [
        {
          lable: "销售产品数",
          key: "projectQuantity",
          value: "",
        },
        {
          lable: "关联项目类型",
          key: "projectTypeNum",
          value: "",
        },
        {
          lable: "产品销售金额",
          key: "totalPrice",
          value: "",
        },
        {
          lable: "关联订单数",
          key: "orderNum",
          value: "",
        },
        {
          lable: "关联客户数",
          key: "customerNum",
          value: "",
        },
        {
          lable: "平均客单价",
          key: "averagePrice",
          value: "",
        },
        {
          lable: "第二集团军",
          key: "zwzx",
          value: "",
        },
        {
          lable: "第一集团军",
          key: "dyjtj",
          value: "",
        },
      ], //数据预览

      barLoading: false,
      barData: [], //产品销售分析列表柱形图 数据

      pieLoading: false,

      PieChartCompare: {
        project: "项目大类占比",
        city: "城市分布占比",
      },
      PieChartData: {
        project: {
          echartData: [],
          isDrill: false,
          isClick: true,
        },
        city: {
          echartData: [],
          isDrill: true,
          isClick: false,
        },
      }, //存储饼图数据

      productLoading: false,
      productData: [],
      productPage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      productOptions: products,
      // 弹出框区域数据
      apiFn: null,
      prejectOption: {
        secondary: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
        tertiary: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
        fourthly: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
        quinary: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
        city: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
        area: {
          title: "",
          visible: false,
          column: [],
          showMenu: true,
          isDept: true,
        },
      },

      secondaryParams: {},
      tertiaryParams: {},
      fourthlyParams: {},
      quinaryParams: {},
      cityParams: {},
      areaParams: {},

      drillType: "", //当前钻取的类型

      contrast: {
        projectQuantity: "销售产品数",
        totalPrice: "产品销售金额",
        orderNum: "关联订单数",
        customerNum: "关联客户数",
        deptNum: "关联客户数",
      },

      deptNo: 1, //判断当前是第一（2）还是第二集团军（1）
      defaultDeptId: undefined, //默认当前登录人部门
      defaultUserId: undefined, //默认当前登录人id

      storageData: [], //数据存储到本地
      showStorage: false,
      individual: true, //判断当前登录人是否是个体，true 个体 ，false 为部门
      showMaxPermission: false, // 按照当前id查看是否最高 是最高级展示特殊数据 否则不展示
      orderByColumn: undefined,
      isAsc: undefined,
    };
  },
  methods: {
    getProjectType(val, type) {
      if (type === "big") {
        this.queryParams.secondCategoryId = "";
        this.queryParams.projectType = "";

        this.value2 = this.value3 = this.value4 = "";
      } else if (type === "medium") {
        this.queryParams.projectType = "";

        this.value3 = this.value4 = "";
      } else if (type === "samll") {
        this.value4 = "";
      }
    },
    toggleDateType(val) {
      if (val == 1) {
        this._getNowYear(this.queryParams, "searchStartDate", "searchEndDate");
      } else if (val == 3) {
      } else {
        this.dateMonth = [];
      }
    },
    // 选择周
    date(value) {
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
    init() {
      const queryParams = cloneDeep(this.queryParams);
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;

      if (this.individual) {
        // 个体需要添加userId参数
        queryParams.userId = this.user.defaultUserId;
      }

      this.getInfo(queryParams);
      this.getBarData(queryParams);
      this.getPieData(queryParams);
      this.getProductData();
    },
    // 切换码数
    sizeChange() {
      this.getProductData();
    },
    currentChange() {
      this.getProductData();
    },
    // 排序
    sortChange2(val) {
      let query = {};
      this.orderByColumn = val.prop;
      this.isAsc = val.order === "ascending" ? "asc" : "desc";
      this.getProductData();
    },

    // 搜索
    searchDateList() {
      if (this.queryParams.searchStartDate && this.queryParams.searchEndDate) {
        this.productPage.currentPage = 1;
        this.productPage.pageSize = 10;
        if (this.value4 == "") {
          this.init();
        } else {
          this.handleClick();
        }
      } else {
        this.$message.error("请选择日期");
      }
    },
    // 重置
    reSet() {
      this.value1 = this.value2 = this.value3 = this.value4 = "";

      this.queryParams = {
        searchDateType: 1,
        topCategoryId: "",
        secondCategoryId: "",
        projectType: "",
      };
      this._getNowYear(this.queryParams, "searchStartDate", "searchEndDate");

      this.orderByColumn = undefined;
      this.isAsc = undefined;

      this.init();
    },

    //图表上方的钻取按钮
    goCityData() {
      // 城市图表钻取
      this.drillType = "city";
      let query = {
        ...this.queryParams,
        searchDeptIds: this.defaultDeptId,
        userId: this.individual ? this.user.defaultUserId : undefined,
        orderByColumn: this.orderByColumn || "productPrice",
        isAsc: this.isAsc || "desc",
      };

      this.$router.push({
        name: "SituationList",
        query: {
          type: this.drillType,
          grade: "city",
          ...query,
          name: "城市分布",
        },
      });
    },

    // 图表点击操作
    pieClick(row, type, isflag) {
      if (type === "project") {
        this.drillType = "project";
        let fn = null;
        let grade = "secondary";

        const { topCategoryId, secondCategoryId, projectType } =
          this.queryParams;

        const query = {
          ...this.queryParams,
          searchDeptIds: this.defaultDeptId,
          userId: this.individual ? this.user.defaultUserId : undefined,
          nextCategoryId: row.id,
          orderByColumn: this.orderByColumn || "productPrice",
          isAsc: this.isAsc || "desc",
        };

        if (topCategoryId && !secondCategoryId && !projectType) {
          // 判断是否已经选中一级项目(需要展示3级项目)
          grade = "tertiary";
        } else if (topCategoryId && secondCategoryId && !projectType) {
          // 判断是否已经选中二级项目(需要展示项目名称)
          grade = "fourthly";
        } else if (topCategoryId && secondCategoryId && projectType) {
          // 判断是否为项目名称(需要展示项目名称)

          delete query.nextCategoryId;
          query.categoryId = row.id;

          grade = "quinary";
        }

        this.$router.push({
          name: "SituationList",
          query: { type: type, grade: grade, ...query, name: row.name },
        });
      }
    },

    // 产品表格点击
    getData(row, type, name) {
      let query = {};
      let titleName = name;
      if (type === "relevancy") {
        // 关联客户数和关联订单数 - 详情

        query = {
          ...this.queryParams,
          projectId: row.projectId,
          searchDeptIds: this.defaultDeptId,
          userId: this.individual ? this.user.defaultUserId : undefined,
          orderByColumn: this.orderByColumn || "totalPrice",
          isAsc: this.isAsc || "desc",
        };
      } else if (["第一集团军", "第二集团军"].includes(name)) {
        // 第一，第二集团军
        this.deptNo = name === "第一集团军" ? 2 : 1;
        titleName = row.projectName;
        query = {
          ...this.queryParams,
          projectId: row.projectId,
          deptNo: this.deptNo,
          orderByColumn: this.orderByColumn || "totalPrice",
          isAsc: this.isAsc || "desc",
        };
      }
      this.$router.push({
        name: "SituationDetail",
        query: { type: type, ...query, name: titleName },
      });
    },

    // 存储到本地
    setStorageData() {
      if (JSON.parse(sessionStorage.getItem("setStorageData")) !== null) {
        this.storageData.pop();
      }

      this.storageData.push(this.queryParams);
      sessionStorage.setItem(
        "setStorageData",
        JSON.stringify(this.storageData)
      );
    },

    // 表格钻取
    handleClick(row) {
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;

      this.setStorageData();
      if (row == undefined) {
        this.$router.push({
          name: "DetailPage",
          query: {
            searchDateType: this.queryParams.searchDateType,
            searchDate: this.queryParams.searchDate,
            searchStartDate: this.queryParams.searchStartDate,
            searchEndDate: this.queryParams.searchEndDate,
            topCategoryId: this.queryParams.topCategoryId,
            secondCategoryId: this.queryParams.secondCategoryId,
            projectType: this.queryParams.projectType,
            productIds: this.value4,
            userId: this.individual ? this.user.defaultUserId : undefined,
          },
        });
      } else {
        this.$router.push({
          name: "DetailPage",
          query: {
            searchDateType: this.queryParams.searchDateType,
            searchDate: this.queryParams.searchDate,
            searchStartDate: this.queryParams.searchStartDate,
            searchEndDate: this.queryParams.searchEndDate,
            topCategoryId: row.topCategoryId,
            secondCategoryId: row.secondCategoryId,
            projectType: this.queryParams.projectType,
            productIds: row.projectId,
            userId: this.individual ? this.user.defaultUserId : undefined,
          },
        });
      }
    },

    // 数据请求api
    // 请求顶部数据类型
    getProductDate() {
      // 请求全部项目大类
      list({ parentId: 0 }).then((res) => {
        this.parentIds = res.data;
      });
    },

    // 数据预览
    getInfo(queryParams) {
      this.previewLoading = true;
      projectSalesInfo(queryParams).then((res) => {
        this.previewData.forEach((item) => {
          item.value = res.data[item.key];
        });

        if (this.showMaxPermission == true) {
        } else {
          this.previewData = this.previewData.filter((item) => {
            return item.key !== "zwzx" && item.key !== "dyjtj";
          });
        }

        this.previewLoading = false;
      });
    },
    // 请求产品销售分析列表柱形图
    getBarData(queryParams) {
      this.barLoading = true;
      getSecondDeptProjectCount(queryParams).then((res) => {
        this.barData = res.data;
      });
      this.barLoading = false;
    },
    // 请求扇形图的数据
    getPieData(queryParams) {
      this.pieLoading = true;

      countCategoryOrProject(queryParams).then((res) => {
        this.PieChartData.project.echartData = res.data;
        this.pieLoading = false;
      });
      countCustomerCity(queryParams).then((res) => {
        this.PieChartData.city.echartData = res.data;
        this.pieLoading = false;
      });
    },
    // 请求表格数据
    getProductData(query) {
      this.productLoading = true;
      const searchDateType =
        this.queryParams.searchDateType == 4
          ? 3
          : this.queryParams.searchDateType;
      const sendData = {
        ...this.queryParams,
        searchDateType: searchDateType,
        pageSize: this.productPage.pageSize,
        pageNum: this.productPage.currentPage,
        orderByColumn: this.orderByColumn || "totalPrice",
        isAsc: this.isAsc || "desc",
        userId: this.individual ? this.user.defaultUserId : undefined,
      };

      projectSalesRankingList(sendData).then((res) => {
        this.productData = res.rows;

        this.productPage.total = res.total;
        this.productLoading = false;
      });
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

    /** 查询部门下拉树结构 */
    async getTreeselect() {
      const { treeList, defaultUserId, defaultDeptId } = this.user;
      // 判断其id是否最高 最高展示特殊数据 否则隐藏

      if (defaultDeptId == 100) {
        this.showMaxPermission = true;
      } else {
        this.showMaxPermission = false;
        // 对页面的表格进行处理，隐藏特殊的数据
        this.productOptions.column = this.productOptions.column.filter(
          (item) => {
            return item.prop !== "zwzx" && item.prop !== "dyjtj";
          }
        );
      }

      // 去除顶级数型数据，保留子数据和当前子部门的所有部门id
      const { children, deptIds } = filterDepts(treeList, defaultDeptId);
      this.deptOptions = children;

      if (treeList) {
        this.individual = false;
        this.defaultDeptId = deptIds.join(",");
      } else {
        this.defaultDeptId = undefined;

        this.productOptions.column = this.productOptions.column.filter(
          (item) => {
            return item.prop !== "userName";
          }
        );
      }
      this.defaultUserId = defaultUserId;

      this.getUserList(defaultDeptId);
    },

    // 导出
    handleExport(url) {
      this.queryParams.pageNum = undefined;
      this.queryParams.pageSize = undefined;
      this.download(
        url,
        { ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },
  },
  mounted() {
    // 获取当前年
    this._getNowYear(this.queryParams, "searchStartDate", "searchEndDate");

    this.getTreeselect();
    if (this.showStorage == true) {
      if (JSON.parse(sessionStorage.getItem("setStorageData")).length !== 0) {
        this.storageData = JSON.parse(sessionStorage.getItem("setStorageData"));
        const dataArrs = this.storageData[0];

        const { searchDateType, searchStartDate, searchEndDate } = dataArrs;

        if ([2, 4].includes(searchDateType)) {
          // 月和日
          this.dateMonth = [searchStartDate, searchEndDate];
        }
        if (searchDateType == 3) {
          this.$nextTick(() => {
            this.$refs.Chooseweek.getMont(searchStartDate);
          });
        }

        this.queryParams = cloneDeep(dataArrs);
        // this.storageData = [];
        // sessionStorage.setItem(
        //   "setStorageData",
        //   JSON.stringify(this.storageData)
        // );
        this.value1 = this.queryParams.topCategoryId;
        this.value2 = this.queryParams.secondCategoryId;
        this.value3 = this.queryParams.projectType;
      }
    }
    this.init();
    // 请求全部项目大类
    this.getProductDate();
  },
  watch: {
    value1: {
      handler(n) {
        if (n) {
          // 全部项目二级分类的数据
          list({ parentId: n }).then((res) => {
            this.dataArr = res.data;
            this.secondIds = [];
            // 将项目安装类型分类存储 if (this.dataArr.length > 0) {
            for (let item of this.dataArr) {
              if (item.parentId == n) {
                this.secondIds.push(item);
              }
            }
          });
        } else {
          this.queryParams.secondCategoryId = "";
          this.queryParams.projectType = "";

          this.value2 = this.value3 = this.value4 = "";
        }
        this.queryParams.topCategoryId = this.value1;
      },
    },
    value2: {
      handler(n) {
        if (n) {
          // 请求项目类型
          projectTypeList({ categoryId: n }).then((res) => {
            this.sonIds = res.data;
          });
          listDate({ categoryId: this.value2 }).then((res) => {
            this.productIds = res.rows;
          });
        } else {
          this.queryParams.projectType = "";
          this.value3 = this.value4 = "";
        }
        this.queryParams.secondCategoryId = this.value2;
      },
    },
    value3: {
      handler(n) {
        if (n) {
        } else {
          this.value4 = "";
        }

        this.queryParams.projectType = this.value3;
      },
    },
    dateMonth: {
      handler(n) {
        this.queryParams.searchStartDate = n != null ? n[0] : "";
        this.queryParams.searchEndDate = n != null ? n[1] : "";
      },
    },
  },
  computed: {
    pickerType() {
      const { searchDateType } = this.queryParams;
      if (searchDateType === 2) {
        return "monthrange";
      } else if (searchDateType === 4) {
        return "daterange";
      }
    },
    valueFormat() {
      const { searchDateType } = this.queryParams;
      if (searchDateType === 2) {
        return "yyyy-MM";
      } else if (searchDateType === 4) {
        return "yyyy-MM-dd";
      }
    },
    ...mapState(["user"]),
  },
  beforeRouteEnter(to, from, next) {
    const that = this;
    if (from.name == "DetailPage") {
      next((vm) => {
        vm.showStorage = true;
      });
    }
    next();
  },
};
</script>

<style lang='scss' scoped>
.box {
  background: rgb(245, 245, 245);
}

.project-date {
  margin-right: 15px;
}

// 预览
.menu-box {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: nowrap;
  position: relative;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 40px;
    cursor: pointer;

    > div {
      margin-top: 20px;

      &:nth-child(1) {
        color: rgb(0, 121, 254);
        font-size: 18px;
      }

      &:nth-child(2) {
        color: #000;
        font-size: 20px;
      }
    }
  }

  .item2 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px 10px;
    cursor: pointer;
    color: rgb(0, 121, 254);

    > div {
      margin: 20px 0;
    }

    &:hover {
      background-color: #f9f9f9;
    }
  }
}

/* 导出按钮的外层盒子 */
.export-box {
  position: absolute;
  display: inline-block;
  right: 100px;
  top: 100%;
  z-index: 9;
}

/* 导出按钮的样式 */

.column {
  margin: 15px 0;
  background-color: white;
}

.flextop {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.click--active {
  color: #0079fe;
  cursor: pointer;
}

.el-card {
  &:not(:first-child) {
    margin-top: 15px;
  }
}
</style>