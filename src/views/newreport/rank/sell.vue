<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="searchDateType">
          <el-select
            v-model="queryParams.searchDateType"
            @change="dataTypeChange"
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

        <el-form-item v-if="showDepartSelect == true" label="" prop="deptDatas">
          <div class="vueTreeSelectSmall">
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
          </div>
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
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px" v-loading="loading1">
      <div class="menu-box">
        <div v-for="(item, index) in tabData" :key="index" class="text item">
          <div>{{ item.lable }}</div>
          <div>{{ item.value || 0 }}</div>
        </div>
      </div>
    </el-card>

    <!-- 饼图 -->
    <el-row :gutter="10" class="echarts-Img">
      <el-col class="border" :xs="14" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card style="margin-top: 20px" v-loading="loading2">
          <div class="title-box">
            <h3>数据来源占比</h3>
            <span
              class="click-btn"
              @click="handleTypeClick({ row: $event, type: 8 })"
              >钻取</span
            >
          </div>
          <pieChart
            :initData="echartData1"
            @click="handleTypeClick({ row: $event, type: 8 })"
          />
        </el-card>
      </el-col>
      <el-col class="border1" :xs="14" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card style="margin-top: 20px" v-loading="loading4">
          <div class="title-box">项目大类占比</div>
          <pieChart
            :initData="echartData2"
            @click="handleTypeClick({ row: $event, type: 3 })"
          />
        </el-card>
      </el-col>
      <el-col class="border2" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card style="margin-top: 20px" v-loading="loading5">
          <div class="title-box">
            <h3>城市分布占比</h3>
            <span
              class="click-btn"
              @click="handleTypeClick({ row: $event, type: 7 })"
              >钻取</span
            >
          </div>
          <pieChart
            :initData="echartData3"
            height="500px"
            @click="handleTypeClick({ row: $event, type: 7 })"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>产品销售排名列表 </span>
        </div>
        <el-button
          @click="
            handleExport(
              '/zw/salesRankingAnalysis/exportProjectSalesRankingList'
            )
          "
          plain
          >导出数据</el-button
        >
      </div>
      <div>
        <!-- @sort-change="sortChange" -->

        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading3"
          @sort-change="sortChange"
          :default-sort="{ prop: 'totalPrice', order: 'descending' }"
        >
          <!-- <el-table-column prop="x" label="时间" align="center" /> -->
          <el-table-column prop="" type="index" label="排名" align="center" />
          <el-table-column
            prop="topCategoryName"
            label="项目大类"
            align="center"
          />
          <el-table-column
            prop="secondCategoryName"
            label="项目二级分类"
            align="center"
          />
          <el-table-column align="center" prop="projectType" label="项目类型" />
          <el-table-column align="center" prop="projectName" label="产品名称" />
          <el-table-column
            align="center"
            prop="projectQuantity"
            label="销售数量"
            sortable="custom"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="totalPrice"
            label="销售金额"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="orderNum"
            label="关联订单数"
          >
            <template slot-scope="{ row }">
              <span class="ableClick" @click="handleClickOrder({ row })">{{
                row.orderNum
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            align="center"
            prop="customerNum"
            label="关联客户数"
          >
            <template slot-scope="{ row }">
              <span class="ableClick" @click="handleClickOrder({ row })">{{
                row.customerNum
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            align="center"
            prop="maxUnitPrice"
            label="最高销售单价"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="minUnitPrice"
            label="最低销售单价"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="averagePrice"
            label="平均客单价"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="projectQuantityRate"
            label="销售数量占比"
          />
          <el-table-column
            sortable="custom"
            align="center"
            prop="totalPriceRate"
            label="销售金额占比"
          />
          <el-table-column
            align="center"
            prop="userName"
            label="产品销售最高者"
          >
            <template slot-scope="{ row }">
              <span
                class="ableClick"
                @click="handleTypeClick({ row, type: 1 })"
                >{{ row.userName }}</span
              >
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            prop=""
            label="详细分析"
            width="100"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleClick(row)"
                >钻取</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import {
  projectSalesRankingList,
  countCustomerDataSource,
  countCustomerCity,
  countCustomerGrade,
  countTopCategory,
  customerBehavior as countCustomerBehavior,
  projectSalesInfo,
} from "@/api/newreport/rank";
import pieChart from "newreport/chart/pie.vue";
import { mapState } from "vuex";

import { userAndDept } from "../customer/mixins/userAnddept";
import { filterDepts } from "@/utils/common";

export default {
  name: "Ranksell",
  components: { Treeselect, pieChart, Chooseweek },

  mixins: [userAndDept],
  data() {
    return {
      dateMonth: [],
      deptOptions: [],
      userList: [],
      deptDatas: [],
      queryParams: {
        searchDeptId: undefined,
        searchDateType: 1,
        searchStartDate: "2023",
        searchEndDate: "2023",
        searchDeptIds: "", // 多选的id
      },
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      valueFormat: "yyyy-MM",
      tabData: [
        {
          lable: "销售产品数",
          key: "projectQuantity",
          value: "",
        },
        // {
        //   lable: "关联项目二级分类",
        //   key: "secondCategoryName",
        //   value: "",
        // },
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
      ],

      echartData1: [],
      echartData2: [],
      echartData3: [],
      echartData4: [],
      echartData5: [],
      list: [],
      total: 0,

      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      storageData: [], // ssession接受传参的值
      // 防止在搜索年和月产生冲突 用新的参数去接收
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
      showDepartSelect: true, // 当用户进来只有用户时对部门进行隐藏
      showDepatData: true,
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
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
  beforeRouteEnter(to, from, next) {
    console.log(from.name);
    if (from.name == "Selllist" || from.name == "Orderlist") {
    } else {
      console.log("5555");
      sessionStorage.setItem("storageDatas", null);
    }
    next();
  },
  mounted() {
    // if (JSON.parse(sessionStorage.getItem('storageDatas')) !== null && JSON.parse(sessionStorage.getItem('storageDatas')).length !== 0) {
    //   this.storageData = JSON.parse(sessionStorage.getItem('storageDatas'))
    //   this.queryParams = this.storageData[0]
    //   this.$nextTick(() => {
    //     if (this.queryParams.searchDateType == 3) {
    //       this.$refs.Chooseweek.getMont(this.queryParams.searchStartDate);
    //     }
    //   })
    // }
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
    handleExport(url) {
      if (this.queryParams.searchDeptIds.constructor == Array) {
        this.queryParams.searchDeptIds =
          this.queryParams.searchDeptIds.join(",");
      }

      this.download(
        url,
        { ...this.query, ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      console.log(JSON.parse(sessionStorage.getItem("storageDatas")));

      if (
        JSON.parse(sessionStorage.getItem("storageDatas")) !== null &&
        JSON.parse(sessionStorage.getItem("storageDatas")).length !== 0
      ) {
        this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
        let dataArr = {};
        dataArr.searchStartDate = this.storageData[0].searchStartDate;
        this.queryParams = this.storageData.pop();

        this.queryParams.searchDateType = this.queryParams.searchDateType;

        this.$nextTick(() => {
          if (this.queryParams.searchDateType == 3) {
            this.$refs.Chooseweek.getMont(dataArr.searchStartDate);
          }
        });
        console.log(this.queryParams);

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
          this.queryParams.userId = this.$store.state.user.userId;
          this.showDepartSelect = false;
        }
      }

      this.getUserList();
      this.init();
      this.showDepatData = true;
      // });
    },

    init() {
      this.getPieChart();
      this.getList();
      this.getInfo();
    },

    getInfo() {
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      projectSalesInfo(queryParams).then((res) => {
        this.tabData.forEach((item) => {
          item.value = res.data[item.key];
        });
      });
    },

    getPieChart() {
      this.loading2 = true;
      this.loading4 = true;
      this.loading5 = true;
      this.loading6 = true;
      this.loading7 = true;
      const { dataSourceList, customerGradeList, customerBehavior } =
        this.commonData;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;

      countCustomerDataSource(queryParams).then((res) => {
        this.echartData1 = res.data.map((item) => ({
          name: this.getLabel(dataSourceList, item.dataSource),
          value: item.dataSourceNum,
        }));
        this.loading2 = false;
      });

      countCustomerCity(queryParams).then((res) => {
        this.echartData3 = res.data.map((item) => ({
          name: item.city,
          value: item.cityNum,
        }));
        this.loading5 = false;
      });
      countCustomerGrade(queryParams).then((res) => {
        this.echartData4 = res.data.map((item) => ({
          name: this.getLabel(customerGradeList, item.customerGrade),
          value: item.customerGradeNum,
        }));
        this.loading6 = false;
      });
      countTopCategory(queryParams).then((res) => {
        this.echartData2 = res.data.map((item) => ({
          name: item.topCategoryName,
          value: item.topCategoryNum,
          topCategoryId: item.topCategoryId,
        }));
        this.loading4 = false;
      });
      countCustomerBehavior(queryParams).then((res) => {
        this.echartData5 = res.data.map((item) => ({
          name: this.getLabel(customerBehavior, item.customerBehavior),
          value: item.customerBehaviorNum,
        }));
        this.loading7 = false;
      });
    },

    getList() {
      this.loading = true;
      if (this.queryParams.orderByColumn) {
        // this.query1.orderByColumn = "";
        // this.query1.isAsc = ""
      } else {
        this.queryParams.orderByColumn = "totalPrice";
        this.queryParams.isAsc = "desc";
      }

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;

      projectSalesRankingList({ ...this.query, ...queryParams }).then((res) => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },

    handleTypeClick({ row, type }) {
      console.log(row);
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));

      const { dataSourceList, customerGradeList } = this.commonData;

      let query = {
        type,
        queryParams: JSON.stringify(this.queryParams),
        name: row.name || "",
      };

      if (type == 1) {
        query.projectId = row.projectId;
        // query.userId = row.userId;
      }

      if (type == 2) {
        query.customerDataSourceType = this.getValue(dataSourceList, row.name);
      }

      if (type == 3) {
        query.nextCategoryId = row.topCategoryId;
      }

      if (type == 7) {
        if (row.name) {
          query.customerCity = row.name;
        }
      }
      if (type == 8) {
        if (row.name) {
          this.commonData.dataSourceList.map((t) => {
            if (row.name == t.label) {
              row.value = t.value;
            }
          });
          query.customerDataSourceType = row.value;
        }
      }
      if (type == 5) {
        query.customerGrade = this.getValue(customerGradeList, row.name);
      }
      // 在进入下一页面前清除参数携带的排序 不影响到下一个页面
      this.queryParams.orderByColumn = null;
      this.queryParams.isAsc = null;
      this.$router.push({
        name: "Selllist",
        query,
      });
    },

    handleClick(row) {
      // 在进入下一页面前清除参数携带的排序 不影响到下一个页面
      this.queryParams.orderByColumn = null;
      this.queryParams.isAsc = null;

      this.$router.push({
        name: "Selluser",
        query: { deptId: row.deptId },
      });
    },

    handleClickOrder({ row }) {
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;
      if (
        JSON.parse(sessionStorage.getItem("storageDatas")) !== null &&
        JSON.parse(sessionStorage.getItem("storageDatas")).length !== 0
      ) {
        this.storageData = [];
      }

      this.storageData = [];
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      // this.queryParams.searchDeptIds = this.deptDatas.join(',')
      this.$router.push({
        name: "Orderlist",
        query: {
          queryParams: JSON.stringify(this.queryParams),
          projectId: row.projectId,
        },
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
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
      this.queryParams.searchStartDate = "2023";
      this.queryParams.searchEndDate = "2023";

      if (this.$store.state.user.treeList) {
        this.resetForm("queryForm");
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
        this.queryParams.searchDeptIds = null;
      }

      this.init();
    },
    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    dataTypeChange() {
      this.queryParams = this.queryParams;
      // this.$store.commit("ADD_TIME_STATUS", this.queryParams);
    },
  },
};
</script>

<style lang='scss' scoped>
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

.menu-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

.echarts-Img {
  margin-top: 20px;
}

.border {
  /* grid-auto-flow: row dense;
  grid-area: nav1;
  border: 1px solid #e6ebf5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */

  .title-box {
    padding: 10px;
    display: flex;

    .click-btn {
      padding: 5px 7px;
      background-color: #0079fe;
      border-radius: 8px;
      color: white;
      cursor: pointer;
    }
  }
}

.border1 {
  .title-box {
    padding: 15px 12px;
    /* height: 46px; */
  }
}

.border2 {
  .title-box {
    padding: 10px;
    display: flex;

    .click-btn {
      padding: 5px 7px;
      background-color: #0079fe;
      border-radius: 8px;
      color: white;
      cursor: pointer;
    }
  }
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
