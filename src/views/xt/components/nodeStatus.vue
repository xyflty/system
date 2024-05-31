<template>
  <div class="nodeStatus-warp">
    <nodeStatus
      v-if="timelineList"
      :timeData="timelineList"
      :tabs="tabs"
      :active="active"
      :tabsData="tabsData"
      :pageActive="pageActive"
      mode="show"
      :title="title"
      :warnString="warnTypeString"
      reverse
      @togggle="handleTogggle"
      @chindToggle="chindToggle"
    ></nodeStatus>
  </div>
</template>

<script>
import nodeStatus from "@/views/components/NodeStatus.vue";

// 基础信息
import { synergyOrder } from "@/api/core/order";
import { synergyOrderDetails } from "@/api/workOrderProcessing/qualification";
import { synergyNodeQueryProcessForShow } from "@/api/workOrderProcessing/qualification";
import { mapState } from "vuex";
export default {
  components: {
    nodeStatus,
  },
  data() {
    return {
      detailId: "", //订单id,
      pagesId: "", //当前页面的类型
      tabsData: [],
      pageActive: "",
      tabs: [],
      active: "",
      timelineList: null,
      orderId: "",
      warnTypeString: "",
    };
  },
  methods: {
    // 获取当前页面的类型的label
    getPagesLabel() {
      return this.projectCategoryType.find((item) => item.value == this.pagesId)
        .label;
    },
    // 处理数据生成label和value格式
    dealTabs(data) {
      return data.map((item) => {
        return {
          label: item.categoryName,
          value: item.id,
        };
      });
    },
    // 获取详情
    getDetail() {
      synergyOrder(this.orderId).then((res) => {
        if (res.code === 200) {
          this.tabs = this.dealTabs(res.data.xtProjectCategoryVos);
          let label = this.getPagesLabel();
          this.active = this.tabs.find((item) => item.label == label).value;
          this.getoOderDetail();
        }
      });
    },
    // 获取分类下的子分类信息
    getoOderDetail() {
      let sendParams = {
        orderId: this.orderId,
        xtProjectCategoryId: this.active,
      };
      synergyOrderDetails(sendParams).then((res) => {
        this.tabsData = res.data.map((item) => {
          return {
            value: item.orderJobId,
            label: item.orderProject.projectName,
          };
        });
        this.pageActive = this.tabsData[0].value;
        this.getNodeStatus();
      });
    },
    // 获取当前的节点动态数据
    getNodeStatus() {
      let sendParams = {
        orderJobId: this.pageActive,
      };
      synergyNodeQueryProcessForShow(sendParams).then((res) => {
        this.timelineList = res.data;
        this.warnTypeString = res.data.warnTypeString;
        console.log(this.warnTypeString);
      });
    },
    // tabs切换
    handleTogggle(row) {
      this.active = row.value;
      this.getoOderDetail();
    },
    // tabs下子分类切换
    chindToggle(row) {
      this.pageActive = row.value;
      this.getNodeStatus();
    },
  },
  mounted() {
    // this.detailId = this.$route.query.id;
    this.orderId = this.$route.query.orderId;
    this.pagesId = this.$route.query.pagesId;
    this.getDetail();
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
      // 项目分类
      projectCategoryType: (state) => state.commonData.projectCategoryType,
      //   处理类型
    }),
    title() {
      return this.tabsData.find((item) => item.value == this.pageActive).label;
    },
  },
};
</script>

<style lang='scss' scoped>
</style>