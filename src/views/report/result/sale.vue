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
              select_title: index === current,
              msg_title: true,
            }"
            >{{ item }}</span
          >
        </div>
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item v-if="current != 2" label="" prop="type">
          <el-select v-model="queryParams.type" :clearable="true">
            <el-option label="按月统计" :value="1" />
            <!-- <el-option label="按周统计" :value="2" /> -->
            <el-option label="按日统计" :value="2" />
            <el-option label="按年统计" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item
          label=""
          prop="dateMonth"
          v-if="
            (queryParams.type == 2 || queryParams.type == 3) && current != 2
          "
        >
          <el-date-picker
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label=""
          prop="dateMonth"
          v-if="queryParams.type == 1 && current != 2"
        >
          <el-date-picker
            v-model="dateMonth"
            type="monthrange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="current == 2" label="" prop="year">
          <el-date-picker
            v-model="year"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="deptId">
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item v-if="current != 0" label="" prop="categoryId">
          <treeselect
            v-model="queryParams.categoryId"
            appendToBody
            :options="deptOptions_2"
            style="margin-left: 10px; max-width: 400px"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择项目分类"
          />
        </el-form-item>
        <el-form-item v-if="current == 2" label="" prop="projectId">
          <el-select
            style="width: 100%"
            v-model="queryParams.projectId"
            filterable
            clearable
            placeholder="请输入关键字搜索产品"
            remote
            :remote-method="getProjectList"
            @focus="getProjectList($event, true)"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="userId">
          <el-select
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
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
        <sale class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >销售金额：<span class="ableClick">{{
              totalInfo.salesAmountNum
            }}</span></span
          >
          <span
            >销售数量：<span class="ableClick">{{
              totalInfo.salesQuantityNum
            }}</span></span
          >
          <span
            >平均客单价：<span class="ableClick">{{
              totalInfo.customerSinglePriceNum
            }}</span></span
          >
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <el-table :data="pageNumData" stripe style="width: 100%" border>
          <el-table-column
            v-if="current == 2"
            prop="x"
            label="时间"
            align="center"
          />
          <el-table-column
            v-if="current == 0"
            prop="x"
            label="产品名称"
            align="center"
          />
          <el-table-column
            v-if="current == 1"
            prop="x"
            label="分类名称"
            align="center"
          />
          <el-table-column
            align="center"
            v-if="current == 0"
            prop="projectNumber"
            label="产品编号"
          />
          <el-table-column align="center" prop="num" label="销售数量" />
          <el-table-column align="center" prop="money" label="销售金额" />
          <el-table-column align="center" prop="avgMoney" label="平均客单价" />
        </el-table>
        <pagination
          v-show="list.length > 0"
          :total="list.length"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import sale from "../components/sale.vue";

import { listUser } from "@/api/system/user";
import { list as listProject } from "@/api/core/project/index";
import { treeselect } from "@/api/system/dept";
import { treeselect as listProjectCategory } from "@/api/core/project/category";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  getAllProjectSale,
  getAllProjectSaleByCategory,
  getAllProjectSaleByDate,
} from "@/api/report/index";

export default {
  components: {
    sale,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      loading: false,
      dateMonth: [],
      year: "",
      deptOptions: [],
      deptOptions_2: [],
      userList: [],
      projectList: [],
      echartData: [],
      current: 0,
      tab: ["按产品汇总", "按分类汇总", "按时间汇总"],
      list: [],
      queryParams: {
        startDate: "",
        endDate: "",
        deptId: undefined,
        userId: "",
        type: 1,
      },

      list: [],
      total: 1, // 统共页数，默认为1
      pageNum: 1, //当前页数 ，默认为1
      pageSize: 10, // 每页显示数量
      pageNumData: [], //当前页显示内容
      headPage: 1,
      loading: false,
      totalInfo: "",
    };
  },
  created() {
    const { timeType } = this.$route.params;
    if (timeType) {
      this.queryParams.timeType = timeType;
    }
    this.getTreeselect();
    this.getProjectCategory();
    this.getAllProjectSale();
  },
  watch: {
    current: {
      handler(n) {
        this.queryParams = {
          startDate: "",
          endDate: "",
          deptId: undefined,
          userId: "",
          type: 1,
        };
        if (n == 0) {
          this.queryParams.deptId = this.$store.state.user.subjectDeptId;
          this.getAllProjectSale();
        }

        n == 1 && this.getAllProjectSaleByCategory();
        if (n == 2) {
          this.queryParams.year = 2022;
          this.getAllProjectSaleByDate();
        }
      },
    },
    year: {
      handler(n) {
        this.queryParams.startDate = `${n}-01-01`;
        this.queryParams.endDate = `${n}-12-31`;
        this.queryParams.type = 1;
      },
    },
    dateMonth: {
      handler(n) {
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";
        // this.current == 0 ? this.getAllProjectSale() : this.getAllProjectSaleByDate();
      },
    },

    firstOpen: {
      handler(n) {
        if (n) {
          this.queryParams.deptId = this.$store.state.user.subjectDeptId || 100;
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
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
    /** 查询产品列表 */
    getProjectList(e, isFocus) {
      listProject({
        pageNum: 1,
        pageSize: 10,
        projectName: isFocus ? "" : e,
      }).then((response) => {
        this.projectList = response.rows;
      });
    },
    /** 查询产品列表 */
    getProjectCategory() {
      listProjectCategory().then((response) => {
        this.deptOptions_2 = response.data;
      });
    },

    getpageNumData() {
      let begin = (this.pageNum - 1) * this.pageSize;
      let end = this.pageNum * this.pageSize;
      this.pageNumData = this.list.slice(begin, end);
      this.loading = false;
    },

    handleClick(index) {
      this.current = index;
      this.firstOpen = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {
        startDate: "",
        endDate: "",
        deptId: undefined,
        userId: "",
        type: 1,
      };
      this.dateMonth = null;
      this.firstOpen = true;
      setTimeout(this.getList);
    },

    getList() {
      this.current == 0 && this.getAllProjectSale();
      this.current == 1 && this.getAllProjectSaleByCategory();
      this.current == 2 && this.getAllProjectSaleByDate();
    },
    getAllProjectSaleByDate() {
      getAllProjectSaleByDate(this.queryParams).then((res) => {
        this.totalInfo = res.data;
        let arr = [[], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.money);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
    },
    getAllProjectSale() {
      getAllProjectSale(this.queryParams).then((res) => {
        this.totalInfo = res.data;
        let arr = [[], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.money);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
      });
    },

    getAllProjectSaleByCategory() {
      getAllProjectSaleByCategory(this.queryParams).then((res) => {
        this.totalInfo = res.data;
        let arr = [[], []];

        res.data.chartVoList.forEach((item) => {
          arr[0].push(item.x);
          arr[1].push(item.money);
        });
        this.echartData = arr;
        this.list = res.data.chartVoList;

        this.loading = true;
        this.total = Math.ceil(this.list.length / this.pageSize);
        this.total = this.total == 0 ? 1 : this.total;
        this.getpageNumData();
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
.msg-box2 span {
  margin-right: 15px;
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
</style>
