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
            <!-- :remote-method="getUserList"
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
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 关联订单\客户</span>
        </div>
        <!-- <el-button
          @click="handleExport('/zw/salesRankingAnalysis/exportGetOrder')"
          plain
          >导出数据</el-button
        > -->
      </div>
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        border
        v-loading="loading"
      >
        <!-- <el-table-column prop="x" label="时间" align="center" /> -->
        <!-- <el-table-column
          prop="topCategoryName"
          label="项目大类"
          align="center"
          min-width="80"
        /> -->

        <el-table-column
          prop="secondCategoryName"
          label="项目二级分类"
          align="center"
          min-width="100"
        />
        <el-table-column prop="projectType" label="项目类型" align="center" />
        <el-table-column prop="projectName" label="产品名称" align="center" />
        <el-table-column prop="companyName" label="客户名称" align="center" />

        <el-table-column
          sortable
          prop="customerGrade"
          label="客户等级"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{
              getLabel(commonData.customerGradeList, row.customerGrade)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="orderTitle"
          label="关联订单名称"
        />
        <el-table-column align="center" prop="totalPrice" label="成交金额" />
        <el-table-column
          align="center"
          prop="unFollowUpDay"
          label="未跟进天数"
        />
        <el-table-column align="center" prop="productNum" label="关联产品数">
          <template slot-scope="{ row }">
            <span class="ableClick" @click="handleClick({ row })">{{
              row.productNum
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
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { getOrder } from "@/api/newreport/rank";
import { mapState } from "vuex";
import { userAndDept } from "../customer/mixins/userAnddept";
import { filterDepts } from "@/utils/common";
export default {
  name: "Orderlist",
  components: { Treeselect, Chooseweek },
  mixins: [userAndDept],
  data() {
    return {
      type: 1,
      name: "",
      deptDatas: [],
      datas: "", // 存储日期的时间，用来切换显示
      deptOptions: [],
      userList: [],
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

      tableList: [],
      loading1: false,
      dateDatas1: "",
      dateDatas2: "",
      setStartYear: undefined,
      setEndYear: undefined,
      setStartMonth: undefined,
      setEndMonth: undefined,
      setStartDay: undefined,
      setEndDay: undefined,
      showDepartSelect: true, // 在用户进来权限较低时进行处理 部门隐藏
    };
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
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  mounted() {
    this.queryParams = this.$route.query;
    this.getTreeselect();
    this.getUserList();

    const { queryParams, ...query } = this.$route.query;
    this.queryParams = { ...JSON.parse(queryParams), ...query };
    this.$nextTick(() => {
      if (this.queryParams.searchDateType == 3) {
        this.$refs.Chooseweek.getMont(JSON.parse(queryParams).searchStartDate);
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
      console.log(this.setStartMonth);
    }
    if (this.queryParams.searchDateType == 4) {
      this.setStartDay = this.queryParams.searchStartDate;
      this.setEndDay = this.queryParams.searchEndDate;
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

    this.getList();
  },
  methods: {
    date(value) {
      this.queryParams.searchStartDate = value[0];
      this.queryParams.searchEndDate = value[1];
    },
    treeselectInput(i) {
      if (i.length) {
        this.queryParams.searchDeptIds = this.deptDatas.join(",");
        this.queryParams.userId = "";
      } else {
        if (!this.queryParams.userId) {
          this.deptDatas = [this.deptOptions[0].id];
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
    // 导出
    handleExport(url) {
      this.download(
        url,
        { ...this.query, ...this.queryParams },
        `${new Date().getTime()}.xlsx`
      );
    },
    // /** 查询用户列表 */
    // getUserList(deptId, e, isFocus = true) {
    //   systemUserListForSelect({
    //     pageNum: 1,
    //     pageSize: 10,
    //     userName: isFocus ? "" : e,
    //     deptId: deptId,
    //   }).then((response) => {
    //     this.userList = response.rows;
    //   });
    // },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      if (this.$store.state.user.treeList) {
        let { children, deptIds } = filterDepts(
          this.$store.state.user.treeList,
          this.$store.state.user.defaultDeptId
        );
        this.deptOptions = children;
      } else {
        this.queryParams.userId = this.$store.state.user.userId;
        this.showDepartSelect = false;
      }
    },

    getList() {
      this.loading = true;
      this.queryParams.searchDeptIds = this.deptDatas.join(",");
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.searchDateType =
        queryParams.searchDateType == 4 ? 3 : queryParams.searchDateType;
      getOrder({ ...this.query, ...queryParams }).then((res) => {
        this.total = res.total;
        this.list = res.rows;
        this.list.forEach((item) => {
          item.productNum =
            item.orderProjectList == null ? 0 : item.orderProjectList.length;
        });
        this.loading = false;
      });
    },

    handleClick({ row }) {
      sessionStorage.setItem(
        "orderProjectList",
        JSON.stringify(row.orderProjectList)
      );
      this.$router.push({
        name: "SellRelevancyProduct",
      });
      // this.tableList = row.orderProjectList;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
      // this.query.pageNum = 1;
      // this.getList();
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
    // 监听多选框发生变化
    select() {
      let data = this.deptDatas;
      this.queryParams.searchDeptIds = this.deptDatas;
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
        this.deptOptions = this.$store.state.user.treeList;

        this.deptDatas = this.deptOptions[0].id;
      } else {
        this.resetForm("queryForm");

        this.queryParams.searchDeptIds = null;
      }
      this.getList();
    },
    // 返回上一层
    goBack() {
      this.$router.go(-1);
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
