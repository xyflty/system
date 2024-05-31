<template>
  <div class="order-record" v-loading="loading">
    <div class="flex flex-between flex-acenter mt_20">
      <h3 class="fs_16">订单记录</h3>
      <div style="text-align: right">
        订单记录数量：<span class="main_color">{{
          orderInfo.orderCount || 0
        }}</span>
        条 订单总金额：
        <span class="main_color">¥ {{ orderInfo.orderPrice || 0 }}</span>
      </div>
    </div>
    <avue-crud :option="options" :data="orderInfo.resultList"></avue-crud>
  </div>
</template>

<script>
import { customerListOrder } from "@/api/core/order";

import { formatterCallback } from "@/utils/common";
import { mapState } from "vuex";
export default {
  name: "OrderRecord",
  data() {
    return {
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
            label: "订单标题",
            prop: "title",
          },
          {
            label: "订单总金额",
            prop: "price",
          },
          {
            label: "订单状态",
            prop: "orderStatus",
            formatter: (val, value, label) => {
              return formatterCallback(this.commonData.orderStatusList, value);
            },
          },
          {
            label: "跟进人",
            prop: "userName",
          },
          {
            label: "共享人",
            prop: "shareUserName",
          },
          {
            label: "签单时间",
            prop: "signTime",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
        ],
      },
      orderInfo: {},
      archiveId: "",
      loading: false,
    };
  },
  methods: {
    getCustomerListOrder() {
      this.loading = true;
      customerListOrder({ archiveId: this.archiveId })
        .then((res) => {
          console.log(res);
          this.orderInfo = res.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.archiveId = this.$route.query.archiveId;
    this.getCustomerListOrder();
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