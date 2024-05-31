<template>
  <div class="customer-referral" v-loading="loading">
    <div class="flex flex-between flex-acenter mt_20">
      <h3 class="fs_16">客户转介绍</h3>
      <div style="text-align: right">
        客户转介绍记录数量：<span class="main_color">{{
          customerReferral.referralCount || 0
        }}</span>
        条 客户转介绍总金额：
        <span class="main_color"
          >¥ {{ customerReferral.referralPrice || 0 }}</span
        >
      </div>
    </div>
    <avue-crud
      :option="options"
      :data="ReferralList"
      :page.sync="page"
      @on-load="getList"
    ></avue-crud>
  </div>
</template>

<script>
import { getCustomerReferralList } from "@/api/core/customerArchive";

import { mapState } from "vuex";
export default {
  name: "CustomerReferral",
  props: {
    companyName: String,
  },
  data() {
    return {
      customerReferral: {},
      options: {
        menu: false,
        refreshBtn: false, //去掉table表格上的刷新按钮
        columnBtn: false,
        addBtn: false, //去掉table表格上的新增按钮
        border: true,
        stripe: true,
        align: "center",
        headerAlign: "center",
        column: [
          {
            label: "企业名称",
            prop: "companyName",
          },
          {
            label: "转介绍时间",
            prop: "customerReferralTime",
          },
          {
            label: "转介绍来源",
            prop: "customerReferralSource",
          },
          {
            label: "跟进人",
            prop: "userName",
          },
          {
            label: "是否成交",
            prop: "isCustomer",
            formatter: (val, value, label) => {
              return value ? "是" : "否";
            },
          },
          {
            label: "成交金额",
            prop: "price",
          },
        ],
      },
      ReferralList: [],
      loading: false,

      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
      },
    };
  },
  methods: {
    getList() {
      this.loading = true;
      getCustomerReferralList({
        // ...this.query,
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        companyName: this.companyName,
      })
        .then((res) => {
          console.log(res);
          this.customerReferral = res.data;
          this.ReferralList = res.data.resultList.records;
          this.page.total = res.data.resultList.total;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    // this.getList();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/flex.scss";
</style>