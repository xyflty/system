// 项目数据分析组件
<template>
  <div
    class="app-container xtAnalysis"
    v-loading="pageData === null"
    element-loading-text="数据加载中"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <AnalysisHeader
      v-if="pageData"
      :previewData="pageData.synergyDataAnalysisTop"
      :isBasicEmployee="isBasicEmployee"
      :deptOptions="deptOptions"
      :userList="userList"
      :queryForm="queryForm"
      :histogramLoading="histogramLoading"
      @query="handleQuery"
      @reset="handleReset"
    >
      <ProjectAnalysis
        :data="pageData.synergyDataAnalysisChartContainer"
        :radio="histogramType"
        :pageType="pageType"
        :histogramLoading="histogramLoading"
        @toggle="handleToggle"
        @drilling="handleDrilling"
      />
      <section>
        <el-card class="box-card">
          <MultiTable
            v-if="parmas"
            align="center"
            ref="tableRef"
            isSearchForm
            isPagination
            :searchOptions="searchOptions"
            :api="apiFn"
            :Options="tableOptions"
            :parmas="parmas"
          ></MultiTable>
        </el-card>
      </section>
    </AnalysisHeader>
  </div>
</template>

<script>
import AnalysisHeader from "./AnalysisHeader.vue";
import ProjectAnalysis from "./ProjectAnalysis.vue";

// 工单详情
import MultiTable from "@/components/MultiTable";

import { analysis } from "@/mixins/xtAnalysis/xtAnalysis";
import { deptAndUser } from "@/mixins/xtAnalysis/getdeptAndUser";

export default {
  props: {
    pageType: Number,
  },
  components: {
    AnalysisHeader,
    ProjectAnalysis,
    MultiTable,
  },
  mixins: [deptAndUser, analysis],
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
.xtAnalysis {
  min-height: calc(100vh - 84px);
}
</style>