<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <span
            v-for="(item, index) in tab"
            @click="current = index"
            :key="index"
            :class="{
              select_title: index === current,
              msg_title: true,
            }"
            >{{ item }}</span
          >
        </div>
      </div>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item
          label=""
          prop="companyOrCustomerReferralSourceName"
          v-if="current == 0"
        >
          <el-input
            v-model="query.companyOrCustomerReferralSourceName"
            placeholder="请输入关键字搜索"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item
          label=""
          prop="customerReferralSource"
          v-if="current == 0"
        >
          <el-input
            v-model="query.customerReferralSource"
            placeholder="转介绍来源"
            clearable
          />
        </el-form-item> -->

        <el-form-item label="" prop="dateMonth" v-if="current == 1">
          <el-date-picker
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" prop="dateMonth" v-if="current == 1">
          <el-select v-model="queryParams.queryType">
            <el-option label="转介绍数" :value="1" />
            <el-option label="转介绍成交数" :value="2" />
            <el-option label="转介绍成交金额" :value="3" />
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

    <el-card class="box-card" style="margin-top: 20px" v-if="current == 1">
      <div>
        <referral class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px" v-if="current == 0">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <!-- 目标金额：¥ 1,000,000.00， 成交金额：¥ 12,00,000.00，完成率： 120% -->
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <div class="flex flex-between flex-acenter mt_20">
          <h3 class="fs_16">客户转介绍</h3>
          <div style="text-align: right">
            客户转介绍记录数量：<span class="main_color">{{
              customerReferral.referralCount || 0
            }}</span>
            条 订单总金额：
            <span class="main_color"
              >¥ {{ customerReferral.referralPrice || 0 }}</span
            >
          </div>
        </div>
        <el-table :data="list" class="mt_20" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="企业名称" align="center" prop="companyName" />
          <el-table-column
            label="转介绍时间"
            align="center"
            prop="customerReferralTime"
          />
          <el-table-column
            label="转介绍来源"
            align="center"
            prop="customerReferralSource"
          />
          <el-table-column label="跟进人" align="center" prop="userName" />
          <el-table-column label="是否成交" align="center" prop="isCustomer">
            <template slot-scope="{ row }">
              <span>
                {{ row.isCustomer ? "是" : "否" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="成交金额" align="center" prop="price" />
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
import referral from "../components/referral.vue";
import { mapState } from "vuex";

import { getTrend } from "@/api/core/customer";
import { getCustomerReferralList } from "@/api/core/customerArchive";

export default {
  name: "Referral",
  components: {
    referral,
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  data() {
    return {
      loading: false,
      dateMonth: [],

      current: 0,
      customerReferral: "",

      echartData: [],
      tab: ["企业查询", "趋势查询"],
      queryParams: {
        queryType: 1, // 1转介绍数 2转介绍成交数 3转介绍成交金额
        beginTime: "",
        endTime: "",
      },
      list: [],
      total: 0,
      query: {
        companyOrCustomerReferralSourceName: "",
        dataSource: "",
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },
    current: {
      handler(n) {
        console.log(n);
        n == 0 ? this.getList() : this.getData();
      },
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.current == 0 ? this.getList() : this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.query = {
        companyOrCustomerReferralSourceName: "",
        dataSource: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.current == 0 ? this.getList() : this.getData();
    },
    // chart 数据
    getData() {
      getTrend(this.queryParams).then((res) => {
        this.echartData = [res.data.date, res.data.resultValue];
      });
    },
    getList() {
      getCustomerReferralList(this.query).then((res) => {
        this.list = res.data.resultList.records;
        this.customerReferral = res.data;
        this.total = res.data.resultList.total;
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/flex.scss";

.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
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
