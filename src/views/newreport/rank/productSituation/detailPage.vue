<template>
  <div class="box-card">
    <!-- 日期 -->
    <el-card>
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

        <!-- 部门选择 -->
        <el-cascader
          placeholder="请选择相应的部门"
          @change="departmentChange"
          v-model="deptOptions1"
          style="width: 350px"
          :options="deptOptions"
          :props="{ multiple: false, checkStrictly: true }"
          clearable
        ></el-cascader>

        <!-- 产品名称 -->
        <el-select
          class="product-data"
          v-model="value4"
          filterable
          placeholder="产品名称"
          clearable
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
          <el-button icon="el-icon-back" type="primary" @click="goBack"
            >返回</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览数据 -->
    <el-card style="margin-top: 10px" v-loading="loading1">
      <div class="menu-box">
        <div v-for="(item, index) in tabData" :key="index" class="text item">
          <div>{{ item.lable }}</div>
          <div>{{ item.value || 0 }}</div>
        </div>
      </div>
    </el-card>

    <!-- K线图 -->
    <div v-loading="loading9" class="k-line">
      <pricePie :initData="echartLineData"></pricePie>
    </div>

    <!-- 表格 -->
    <el-card style="margin-top: 20px" v-loading="loading2">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span class="text">产品销售排名列表 </span>
        </div>
        <el-select
          @change="dataChange"
          class="select-table"
          v-model="customerGradeValue"
          placeholder="全部等级"
        >
          <el-option
            v-for="item in customerGradeArray"
            :key="item.customerGrade"
            :label="item.label"
            :value="item.customerGrade"
          >
          </el-option>
        </el-select>
        <el-select
          @change="behaviorChange"
          class="select-table"
          v-model="customerBehaviorValue"
          placeholder="全部行为"
        >
          <el-option
            v-for="item in customerBehaviorArray"
            :key="item.customerBehavior"
            :label="item.label"
            :value="item.customerBehavior"
          >
          </el-option>
        </el-select>
        <el-select
          @change="cityChange"
          class="select-table"
          v-model="cityDataAll"
          placeholder="全部地区"
        >
          <el-option
            v-for="item in cityDataAllArray"
            :key="item.city"
            :label="item.city"
            :value="item.city"
          >
          </el-option>
        </el-select>
        <el-select
          @change="mainstayChange"
          class="select-table"
          v-model="attributionSubjectValue"
          placeholder="全部主体"
        >
          <el-option
            v-for="item in attributionSubjectArray"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <el-button
          class="export-btn"
          @click="handleData('/zw/salesRankingAnalysis/exportGetOrder')"
          plain
          >导出数据</el-button
        >
      </div>
      <!-- <el-card style="margin-top: 10px" v-loading="loading1"> -->
      <div class="menu-box">
        <div v-for="(item, index) in tabData2" :key="index" class="text item2">
          <div>{{ item.lable }}:</div>
          <div>{{ item.value || 0 }}</div>
        </div>
      </div>
      <!-- </el-card> -->
      <div>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          border
          @sort-change="sortChange"
        >
          <el-table-column label="排名" type="index" width="50" />
          <el-table-column prop="queryParams.searchDate" label="时间" align="center">{{ queryParams.searchStartDate 
          }} 至 {{ queryParams.searchEndDate }}</el-table-column>
          <el-table-column prop="secondCategoryName" label="项目二级分类" align="center" />
          <el-table-column prop="projectType" label="项目类型" align="center" />
          <el-table-column prop="projectName" label="产品名称" align="center" />
          <el-table-column
            prop="projectQuantity"
            label="销售数量"
            align="center"
            sortable="custom"
          />
          <el-table-column
            align="center"
            prop="projectPrice"
            label="销售金额"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="orderTitle"
            label="关联订单名称"
          >
            <template slot-scope="{ row }">
              <span> {{ row.orderTitle || "0" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="companyName"
            label="关联客户名称"
          ></el-table-column>
          <el-table-column align="center" prop="customerGrade" label="客户等级">
            <template slot-scope="{ row }">
              <span v-if="row.customerGrade == 1">Vip</span>
              <span v-if="row.customerGrade == 2">A类</span>
              <span v-if="row.customerGrade == 3">B类</span>
              <span v-if="row.customerGrade == 4">C类</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="tranType" label="客户行为">
            <template slot-scope="{ row }">
              <span v-if="row.tranType == 1">首次成交 </span>
              <span v-if="row.tranType == 2">二次成交 </span>
              <span v-if="row.tranType == 3">多次成交 </span>
              <span v-if="row.fansType == 4"> -- 粉丝客户</span>
              <span v-if="row.fansType == 5"> -- 忠实客户</span>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="city" label="销售地区">
          </el-table-column>
          <el-table-column align="center" prop="mainPart" label="归属主体" />
          <el-table-column
            align="center"
            prop="userName"
            label="归属人员"
          ></el-table-column>
        </el-table>
        <pagination
          v-show="total1"
          :total="total1"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getTabData"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import pricePie from "newreport/chart/pricePie.vue";
import { treeselect } from "@/api/core/project/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import pieChart from "newreport/chart/pie.vue";

import { getOrder } from "@/api/newreport/rank";
import {
  projectSalesInfo,
  getSalePriceKLineDiagram,
  getCityProjectSales,
} from "@/api/newreport/rank";
import { mapState } from "vuex";
import { listDate } from "@/api/core/project/index";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { list, projectTypeList } from "@/api/core/project/category";

export default {
  name: "DetailPage",
  components: {
    pricePie,
    Treeselect,
    pieChart,
    Chooseweek,
  },
  data() {
    return {
      queryParams: {
        searchDeptId: undefined,
        searchDateType: 1,

        topCategoryId: "", //	项目大类id
        secondCategoryId: "", //	二级分类id
        projectType: "", // 项目类型
        searchStartDate: undefined,
        searchEndDate: undefined,
        pageSize: 10,
        pageNum: 1,
      },
      showTree: false,
      tabData: [
        {
          lable: "销售产品数",
          key: "projectQuantity",
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
      ],
      tabData2: [
        {
          lable: "销售产品数",
          key: "projectQuantity",
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
      ],
      deptOptions: [],
      total1: 0,

      treeselect1: [],
      echartLineData: [], // k线图的数据

      productIds: [],
      loading1: false,
      loading2: false,

      loading9: false,
      deptOptions1: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      tableData: [],
      tableData2: [],
      options: [],
      value: "",
      customerGradeValue: "全部等级",
      customerGradeArray: [
        {
          customerGrade: "",
          label: "全部等级",
        },
        {
          customerGrade: "1",
          label: "Vip",
        },
        {
          customerGrade: "2",
          label: "A类",
        },
        {
          customerGrade: "3",
          label: "B类",
        },
        {
          customerGrade: "4",
          label: "C类",
        },
      ],
      customerBehaviorValue: "全部行为",
      customerBehaviorArray: [
        {
          customerBehavior: "",
          label: "全部行为",
        },
        {
          customerBehavior: "1",
          label: "首次成交",
        },
        {
          customerBehavior: "2",
          label: "二次成交",
        },
        {
          customerBehavior: "3",
          label: "多次成交",
        },
        {
          customerBehavior: "4",
          label: "粉丝客户",
        },
        {
          customerBehavior: "5",
          label: "忠实客户",
        },
      ],
      attributionSubjectValue: "全部主体",
      attributionSubjectArray: [
        {
          attributionSubject: "",
          label: "全部主体",
        },
        {
          attributionSubject: "1",
          label: "第二集团军",
        },
        {
          attributionSubject: "2",
          label: "第一集团军",
        },
      ],
      cityDataAll: "全部城市",
      cityDataAllArray: [],
      setYear: "",
      setMonth: "",
      value4: "",
      parentIds: [],
      obj1: {
        ancestors: "",
        categoryName: "",
        createTime: "",
        orderNum: "",
        parentId: "",
        value: "",
      },
      proNumber: 0, //销售产品数
      proPrice: 0, // 销售金额
      proRelatedOrders: 0, // 关联订单数
      proCustomerNum: 0, // 关联客户数
      proAdvicePrice: 0, // 平均客单价
      proZwzx: "0%", // 第二集团军占比
      proDyjtj: "0%", // 第一集团军占比

      dateMonth: [],
      showMaxPermission: false, // 按照当前id查看是否最高 是最高级展示特殊数据 否则不展示
    };
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
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState(["user"]),
  },

  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.searchStartDate = n != null ? n[0] : "";
        this.queryParams.searchEndDate = n != null ? n[1] : "";
      },
    },

    deptOptions1: {
      handler(n) {
        this.queryParams.topCategoryId = n[0];
        this.queryParams.secondCategoryId = n[1];
        if (n[1] == "") {
          this.value4 = "";
        } else {
          this.getProjectId();
        }
      },
    },
    value4: {
      handler(n) {
        if (this.queryParams.secondCategoryId == "") {
          this.productIds = [];
        }
        this.queryParams.projectId = n;
      },
    },
  },
  mounted() {
    this.getRouteParams();
  },
  methods: {
    toggleDateType(val) {
      if (val == 1) {
        this._getNowYear(this.queryParams, "searchStartDate", "searchEndDate");
      } else if (val == 3) {
      } else {
        this.dateMonth = [];
      }
    },
    // h获取传递过来的路由参数
    getRouteParams() {
      const {
        searchDateType,
        searchStartDate,
        searchEndDate,
        topCategoryId,
        secondCategoryId,
        productIds,
        userId,
      } = this.$route.query;
      this.queryParams.userId = userId;
      this.queryParams.searchDateType = +searchDateType;

      // 根据日期类型进行处理展示

      if ([2, 4].includes(+searchDateType)) {
        // 月和日
        this.dateMonth = [searchStartDate, searchEndDate];
        console.log(this.dateMonth, 666);
      }

      if (searchDateType == 3) {
        this.$nextTick(() => {
          this.$refs.Chooseweek.getMont(searchStartDate);
        });
      }
      this.queryParams.searchStartDate = searchStartDate;
      this.queryParams.searchEndDate = searchEndDate;

      this.queryParams.topCategoryId = topCategoryId;
      this.queryParams.secondCategoryId = secondCategoryId;
      // this.queryParams.projectType = this.$route.query.projectType

      // 相应部门所接受的id
      if (this.queryParams.secondCategoryId !== "") {
        this.deptOptions1 = [
          this.queryParams.topCategoryId,
          this.queryParams.secondCategoryId,
        ];
      } else if (this.queryParams.topCategoryId !== "") {
        this.deptOptions1 = [this.queryParams.topCategoryId];
      } else {
        this.deptOptions1 = [];
      }
      this.value4 = productIds;
      this.queryParams.projectId = productIds;

      this.init();
    },
    // 所有请求集合
    init() {
      this.getInfo();
      this.getTreeselect();

      this.getTabData();
      this.getSalePriceKLineDiagram();
      this.getCustomData();
      // this.getProjectId()
    },
    // 请求周的数据
    date(value) {
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
    // 请求部门的数据
    async getTreeselect() {
      await list().then((res) => {
        let dataArr = [];
        this.deptOptions = [];
        dataArr = res.data;
        dataArr.map((t) => {
          this.deptOptions.push(
            JSON.parse(JSON.stringify(t).replace(/id/g, "value"))
          );
        });
      });

      let data1 = [];
      this.deptOptions.map((item) => {
        if (item.parentId == 0) {
          item.children = [];
          data1.push(item);
        }
      });

      this.deptOptions.map((item) => {
        data1.map((t) => {
          if (item.parentId == t.value) {
            // item.children = []
            t.children.push(item);
          }
        });
      });
      const { treeList, defaultUserId, defaultDeptId } = this.user;
      if (defaultDeptId == 100) {
        this.showMaxPermission = true;
      } else {
        this.showMaxPermission = false;
        // this.productOptions.column = this.productOptions.column.filter(
        //   (item) => {
        //     return item.prop !== "zwzx" && item.prop !== "dyjtj";
        //   }
        // );
      }
      // this.deptOptions.map((item) => {

      //   data1.map((t) => {
      //     t.children.map((key) => {
      //       if (item.parentId == key.value) {

      //         key.children.push(item)
      //       }
      //     })
      //   })

      // })

      this.deptOptions = [];
      data1.map((t) => {
        this.deptOptions.push(
          JSON.parse(JSON.stringify(t).replace(/categoryName/g, "label"))
        );
      });

      // treeselect().then((res) => {
      //   let dataArr = []
      //   dataArr = res.data
      //   dataArr.map(t => {
      //     this.deptOptions.push(JSON.parse(JSON.stringify(t).replace(/id/g, 'value')))
      //   })
      //   // // 请求全部项目大类
      //   // list({ parentId: 0 }).then((res) => {

      //   //   this.parentIds = res.data

      //   // });

      // })
    },
    // 根据条件请求相应的部门并进行展示
    getProjectId() {
      if (this.queryParams.secondCategoryId) {
        listDate({ categoryId: this.queryParams.secondCategoryId }).then(
          (res) => {
            this.productIds = res.rows;
          }
        );
      }
    },
    // 页面顶部的数据预览
    getInfo() {
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      this.loading1 = true;
      projectSalesInfo(queryParams).then((res) => {
        this.tabData.forEach((item) => {
          item.value = res.data[item.key];
        });

        if (this.showMaxPermission == true) {
        } else {
          this.tabData = this.tabData.filter((item) => {
            return item.key !== "zwzx" && item.key !== "dyjtj";
          });
        }
        this.loading1 = false;
      });
    },
    // 底部表格上的 数据预览
    async getInfo2(queryParamsData) {
      var queryParams = JSON.parse(JSON.stringify(queryParamsData));

      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      this.loading2 = true;
      projectSalesInfo(queryParams).then((res) => {
        this.tabData2.forEach((item) => {
          item.value = res.data[item.key];
        });

        if (this.showMaxPermission == true) {
        } else {
          this.tabData2 = this.tabData2.filter((item) => {
            return item.key !== "zwzx" && item.key !== "dyjtj";
          });
        }

        this.loading2 = false;
      });
      queryParams.pageSize = 10;
      await getOrder(queryParams).then((res) => {
        this.tableData2 = res.rows;
      });

      this.proNumber = 0;
      this.proPrice = 0;
      this.proCustomerNum = 0;
      var dataArr = [];
      var dejtj = [];
      var dyjtj = [];
      this.tableData2.forEach((t) => {
        this.proNumber += t.projectQuantity;
        var num = Number(t.projectPrice);
        this.proPrice += num;
        dataArr.push(t.companyName);

        if (t.mainPart == "众为咨询") {
          dejtj.push(t.mainPart);
        } else if (t.mainPart == "第一集团军") {
          dyjtj.push(t.mainPart);
        } else {
          return;
        }
      });

      dataArr = new Set(dataArr);

      // let data = Object.entries(dataArr)

      this.proCustomerNum = dataArr.size;
      this.proRelatedOrders = this.tableData2.length;
      queryParams.pageSize = 10;
      this.proAdvicePrice = this.proPrice / this.proNumber; // 计算平均客单价
      this.proZwzx = (this.proNumber / dejtj.length).toFixed(2) + "%"; // 计算第二集团军的占比
      this.proDyjtj = Math.floor(this.proNumber / dyjtj.length) * 10 + "%"; // 计算第二集团军的占比
    },

    // 获取产品销售情况列表表格
    async getTabData() {
      this.loading2 = true;
      await getOrder(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total1 = res.total;
        this.loading2 = false;
        // this.proNumber +=  res.rows.projectQuantity
      });

      this.getInfo2(this.queryParams);
    },
    // 请求k线图数据
    getSalePriceKLineDiagram() {
      this.loading9 = true;
      // sessionStorage.setItem('setTime',JSON.stringify(this.queryParams))
      getSalePriceKLineDiagram(this.queryParams).then((res) => {
        this.echartLineData = res.data;
        this.loading9 = false;
        // this.echartLineData.push(this.queryParams)
      });
    },
    // 搜索数据
    searchDateList() {
      if (this.queryParams.searchStartDate && this.queryParams.searchEndDate) {
        this.queryParams.orderByColumn = undefined;
        this.queryParams.isAsc = undefined;
        this.init();
      } else {
        this.$message.error("请选择日期");
      }
    },
    // 数据重置
    reSet() {
      this.getRouteParams();
    },
    // 数据导出
    handleData(url) {
      this.download(
        url,
        { ...this.query, ...this.queryParams },
        `产品销售排名列表.xlsx`
      );
    },
    handleNodeClick(data) {
      if (data.children && data.children.length) {
        return;
      }
      const params = findItemById(this.options, data.parentId);
      let title = params ? params.label + " - " + data.label : data.label;
      this.$set(this.form, "title", title);
    },
    // 请求所有城市数据
    getCustomData() {
      getCityProjectSales().then((res) => {
        this.cityDataAllArray = res.rows;
        let city = {
          city: "全部城市",
        };
        this.cityDataAllArray.unshift(city);
      });
    },
    // 等级筛选
    dataChange() {
      if (this.customerGradeValue == "1") {
        this.queryParams.customerGrade = 1;
        this.getTabData();
      } else if (this.customerGradeValue == "2") {
        this.queryParams.customerGrade = 2;
        this.getTabData();
      } else if (this.customerGradeValue == "3") {
        this.queryParams.customerGrade = 3;
        this.getTabData();
      } else if (this.customerGradeValue == "4") {
        this.queryParams.customerGrade = 4;
        this.getTabData();
      } else {
        this.queryParams.customerGrade = "";
        this.getTabData();
      }
    },
    // 城市筛选
    cityChange() {
      if (this.cityDataAll == "全部城市") {
        this.queryParams.customerCity = "";
      } else {
        this.queryParams.customerCity = this.cityDataAll;
      }

      this.getTabData();
    },
    // 主体筛选
    mainstayChange() {
      if (this.attributionSubjectValue == "第二集团军") {
        this.queryParams.mainPartId = "200";
      } else if (this.attributionSubjectValue == "第一集团军") {
        this.queryParams.mainPartId = "1580402169644216321";
      } else {
        this.queryParams.mainPartId = "";
      }
      this.getTabData();
    },
    // 客户行为筛选
    behaviorChange() {
      this.queryParams.customerBehavior = this.customerBehaviorValue;
      this.getTabData();
    },
    departmentChange() {},
    // 返回上一页面的按钮功能
    goBack() {
      this.$router.go(-1);
    },
    // 首页底部表格的排序
    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.getTabData();
    },
  },
};
</script>

<style scoped>
.box-card {
  background: rgb(244, 244, 244);
  width: 100%;
  height: 100%;
}

.menu-box {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
}

.item:hover {
  background-color: #f9f9f9;
}

.item div {
  margin-top: 20px;
}

.item div:nth-child(1) {
  color: rgb(0, 121, 254);
  font-size: 18px;
}

.item div:nth-child(2) {
  color: #000;
  font-size: 20px;
}

.item2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
  color: rgb(0, 121, 254);
  font-weight: 700;
}

.item2:hover {
  background-color: #f9f9f9;
}

.item2 div {
  margin: 20px 0;
}

.item2 div:nth-child(1) {
  font-weight: 600;
}

.pie-box {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

.pie-chart1,
.pie-chart2,
.pie-chart3 {
  position: relative;
  width: 32%;
  height: 300px;
  background-color: white;
}

.title {
  position: absolute;
  left: 20px;
  top: 20px;
}

.header-box {
  display: flex;
  vertical-align: center;
}

.msg-box2 {
  line-height: 40px;
}

.text {
  font-weight: 600;
}

.select-table {
  margin-left: 10px;
}

.export-btn {
  position: absolute;
  right: 20px;
}

.select-department {
  width: 400px;
}

.product-data {
  margin: 0 10px;
  height: 32px;
  width: 260px;
}

.k-line {
  margin-top: 30px;
  background-color: white;
  height: 500px;
}
</style>