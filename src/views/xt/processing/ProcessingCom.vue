<template>
  <div class="certificateProcessing-warp">
    <MultiTable
      ref="tableRef"
      v-if="this.parmas"
      :api="apiFn"
      :Options="tableOptions"
      isSearchForm
      isSelection
      isPagination
      border
      align="center"
      :parmas="parmas"
      :searchOptions="searchOptions"
      :row-class-name="tableRowClassName"
      :getSpanData="getSpanData"
      @setupEvents="setupEvents"
      @SelectionChange="SelectionChange"
    >
      <template #actions>
        <template v-for="item in tableActions">
          <el-button
            :key="item.id"
            v-bind="item"
            v-hasPermi="item.hasPermi"
            @click="batchActions(item)"
            >{{ item.title }}</el-button
          >
        </template>
      </template>
    </MultiTable>

    <!-- 审批状态弹出框 -->
    <ApproveModel
      v-if="visible"
      :pageType="pagesId"
      :title="dialogTitle"
      :visible.sync="visible"
      :form="formData"
      :mode="mode"
      :isShowUpload="false"
      @cancel="approveCancel"
      @confirm="approvePass"
      @approveFail="approveFail"
    >
    </ApproveModel>
    <!-- 暂缓和退回 -->
    <approveModel
      :visible.sync="approveVisible"
      :form="approveForm"
      @confim="approveConfirm"
      @concel="approveConcel"
    ></approveModel>
  </div>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";
// 审批状态弹出框
import ApproveModel from "@/views/components/ApproveModel";
import approveModel from "@/views/xt/components/approveModel";

// mixins混入
import { processing } from "@/mixins/processing";
export default {
  name: "ProcessingCom",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  components: { MultiTable, ApproveModel, approveModel },
  mixins: [processing],
  data() {
    return {
      // 当前页面的类型
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