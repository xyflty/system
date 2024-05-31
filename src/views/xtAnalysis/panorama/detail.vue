<template>
  <div class="app-container">
    <div class="actions">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-back"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <MultiTable
      v-if="detailParams"
      isPagination
      align="center"
      :Options="detailOptions"
      :api="tableApiFn"
      :parmas="detailParams"
    ></MultiTable>
  </div>
</template>

<script>
import {
  queryOrderJobPageList,
  getSynergyOrderQuantityScreenPopUpList,
} from "@/api/xtAnalysis/panorama";

import MultiTable from "@/components/MultiTable";
import { briefing } from "@/views/components/homeComponents/BriefingOptions";
export default {
  components: {
    MultiTable,
  },
  data() {
    return {
      detailParams: null,
      briefingOptions: briefing,
      tableApiFn: null,
      prejectId: "",
      status: "",
      showType: "", //展示类型,判断是那个表格数据
      queryForm: {},
    };
  },
  methods: {
    // 获取详情数据
    async getDetail(type) {
      let params = {
        ...this.queryForm,
        warnType: null,
        orderJobStatus: null,
        projectCategory: this.prejectId,
      };
      let fn = null;

      if (["synergyOrderQuantity"].includes(type)) {
        fn = getSynergyOrderQuantityScreenPopUpList;
      } else {
        if (type === "timeoutWarn") {
          params.warnType = this.status;
        } else {
          params.orderJobStatus = this.status;
        }

        fn = queryOrderJobPageList;
      }

      this.detailParams = params;

      this.tableApiFn = fn;
    },
    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const { prejectId, status, type, userId, deptIds } = this.$route.query;
    this.prejectId = prejectId;
    this.status = status;
    this.showType = type;
    this.queryForm = { userId, deptIds };

    this.getDetail();
    console.log(this.detailOptions);
  },
  computed: {
    detailOptions() {
      return this.briefingOptions.panorama.tableOptions[this.showType] || [];
    },
  },
};
</script>

<style lang='scss' scoped>
.actions {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>