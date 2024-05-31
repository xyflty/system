<template>
  <div class="certificateProcessing-warp">
    <MultiTable
      ref="tableRef"
      v-if="this.parmas"
      :api="apiFn"
      :Options="tableOptions"
      isSearchForm
      isPagination
      border
      align="center"
      :parmas="parmas"
      :row-class-name="tableRowClassName"
      :searchOptions="searchOptions"
      :getSpanData="getSpanData"
      @setupEvents="setupEvents"
    >
      <template #operation="{ scope }">
        <el-button
          v-if="scope.row.isFinancialAdvisorFlag"
          type="text"
          @click="getFinancialCheck(scope.row.id)"
          >核销</el-button
        >
      </template>
    </MultiTable>

    <!-- 核销 -->
    <DestroyModel
      :visible.sync="destroyVisible"
      :isCompile="isCompile"
      :data="collectionData"
      @submit="destroySubmit"
      @cancel="destroyCancel"
    ></DestroyModel>
  </div>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";
// 审批状态弹出框
import ApproveModel from "@/views/components/ApproveModel";

import DestroyModel from "@/views/xt/components/destroyModel";

// 作业端mixins公共方法混入
import { operation } from "@/mixins/operation";

export default {
  name: "OperationCom",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: { MultiTable, ApproveModel, DestroyModel },
  mixins: [operation],
  data() {
    return {
      pagesType: this.type,
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
.certificateProcessing-warp {
  padding: 20px;
}
</style>