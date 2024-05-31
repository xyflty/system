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
      :queryForm="queryForm"
      :userList="userList"
      @query="handleQuery"
      @reset="handleReset"
    >
      <section>
        <div class="pie-list">
          <div
            class="pie-items"
            v-for="item in pageData.panoramicViewDataList"
            :key="item.projectCategory"
          >
            <CRMBriefing
              :title="getTitle(item.projectCategory)"
              :Options="briefingOptions.panorama"
              :data="item"
              @detail="
                (val) => {
                  handleDetail(item.projectCategory, val);
                }
              "
            ></CRMBriefing>
          </div>
        </div>
      </section>
      <section>
        <el-card class="box-card">
          <span class="job-detail">工单详情</span>
          <MultiTable
            v-if="parmas"
            :parmas="parmas"
            ref="tableRef"
            align="center"
            :api="apiFn"
            :Options="tableOptions"
            isPagination
          ></MultiTable>
        </el-card>
      </section>
    </AnalysisHeader>
  </div>
</template>

<script>
import AnalysisHeader from "../components/AnalysisHeader.vue";
import MultiTable from "@/components/MultiTable";

import CRMBriefing from "@/views/components/homeComponents/CRMBriefing";

import {
  briefing,
  titleList,
} from "@/views/components/homeComponents/BriefingOptions";

import { Options } from "../components/Options";
import { deptAndUser } from "@/mixins/xtAnalysis/getdeptAndUser";

import {
  queryOrderJobPageList,
  getSynergyDataAnalysisContainer,
} from "@/api/xtAnalysis/panorama";
export default {
  components: {
    AnalysisHeader,
    CRMBriefing,
    MultiTable,
  },
  mixins: [deptAndUser],
  data() {
    return {
      apiFn: queryOrderJobPageList,
      tableOptions: Options,

      // 筛选表单
      queryForm: {
        userId: "",
        // timeType: 1,
        // timeValueBegin: "",
        // timeValueEnd: "",
        pageNum: 1,
        pageSize: 10,
        deptIds: "",
      },

      pageData: null,

      briefingOptions: briefing,
    };
  },
  methods: {
    handleQuery(model) {
      this.parmas = {
        projectCategory: this.pageType,
        ...model,
      };
      this.getPageData();
    },
    handleReset(from, model) {
      from.resetFields();
      this.queryForm.deptIds = this.defaultDeptIds.join(",");
      this.parmas = {
        projectCategory: this.pageType,
        ...model,
      };
      this.getPageData();
      // this.$refs.tableRef.getTableData();
    },

    // 生成标题
    getTitle(type) {
      const row = titleList.find((item) => item.value === type);
      return row && row.label;
    },

    // 获取点击详情数据
    handleDetail(prejectId, { label, type, status }) {
      sessionStorage.setItem("XTPANORAMA_KEY", JSON.stringify(this.queryForm));
      const { userId, deptIds } = this.queryForm;
      this.$router.push({
        name: "PanoramaDetail",
        query: { type, prejectId, status, userId, deptIds },
      });
    },

    async getPageData() {
      try {
        let sendData = {
          ...this.queryForm,
        };
        const res = await getSynergyDataAnalysisContainer(sendData);

        this.pageData = res;
      } catch (error) {
        console.log(err);
      }
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.xtAnalysis {
  min-height: calc(100vh - 84px);
}
.job-detail {
  display: inline-block;
  font-size: 14px;
  margin-bottom: 20px;
}
.pie-list {
  display: grid;
  grid-template-columns: repeat(2, 50%);

  grid-column-gap: 15px;
  grid-row-gap: 15px;
}
@media (max-width: 1460px) {
  .pie-list {
    display: grid;
    grid-template-columns: 1fr;

    grid-column-gap: 15px;
  }
}
</style>