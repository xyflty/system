<template>
  <div class="app-container">
    <avue-crud
      :data="data"
      :option="option"
      :search.sync="queryParams"
      :page.sync="page"
      @on-load="onLoad"
      @search-change="searchChange"
      @search-reset="resetChange"
    >
      <template slot="menuLeft">
        <el-button
          icon="el-icon-download"
          size="mini"
          plain
          type="warning"
          v-hasPermi="['system:monitoringEnt:export']"
          @click="handleExport"
          >导出</el-button
        >
      </template>

      <template slot="applyQuaSn" slot-scope="scope">
        <p>
          <span>{{ scope.row.applyQuaSn }}</span>
        </p>
        <p class="color--red">
          <span>{{ scope.row.applyQuaRank }}</span>
          <span>( {{ scope.row.applyReason }} )</span>
        </p>
      </template>
      <template slot="approveStatus" slot-scope="scope">
        <el-tag v-if="scope.row.approveStatus == 10" type="success"
          >同意</el-tag
        >
        <el-tag v-else-if="scope.row.approveStatus == 11" type="warning">
          不同意</el-tag
        >
        <span v-else>--</span>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { monitoringEntList, areaClass } from "@/api/xt/monitor";
import { mapState } from "vuex";
export default {
  data() {
    return {
      data: [],
      queryParams: {},
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {},
    };
  },
  methods: {
    setOptions() {
      this.option = {
        addBtn: false,
        menu: false,
        stripe: true,
        align: "center",
        headerAlign: "center",
        searchMenuSpan: 3,
        searchFilterDic: true,
        searchFilterNull: true,

        column: [
          {
            label: "关键字",
            prop: "searchValue",
            search: true,
            searchSpan: 4,
            // 隐藏列
            hide: true,
            showColumn: false,
            // 隐藏列
          },
          {
            label: "公司名称",
            prop: "entName",
            fixed: true,
          },
          {
            label: "资质类别",
            prop: "applyQuaType",
            // 查询设置
            search: true,
            searchType: "select",
            searchSpan: 4,
            dicData: this.commonData.applyQuaTypeEnun,
            // 查询设置
          },
          {
            label: "申请事项",
            prop: "applyQuaSn",
            slot: true,
          },
          {
            label: "受理单位",
            prop: "orgId",
            // 查询设置
            search: true,
            searchType: "select",
            searchSpan: 4,
            dicData: [],
            props: {
              label: "name",
              value: "code",
            },
            // 查询设置
          },
          {
            label: "办理环节",
            prop: "entType",
            search: true,
            searchType: "select",
            searchSpan: 4,
            dicData: this.commonData.entTypeEnun,
          },
          {
            label: "审查意见",
            prop: "approveStatus",
            slot: true,
            // 查询设置
            search: true,
            searchType: "select",
            searchSpan: 4,
            dicData: [
              {
                label: "同意",
                value: "10",
              },
              {
                label: "不同意",
                value: "11",
              },
            ],
            // 查询设置
          },

          {
            label: "流水号",
            prop: "serialNo",
          },
          {
            label: "公示截止日期",
            prop: "deadline",
          },
        ],
      };
    },
    // 初始化页面数据
    onLoad(page) {
      this.getList();
    },
    // 查询
    searchChange(params, done) {
      this.page.currentPage = 1;
      this.getList();
      done();
    },
    // 重置
    resetChange() {
      this.page.currentPage = 1;
      this.getList();
    },
    async getList() {
      let sendParams = {
        ...this.queryParams,
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      const res = await monitoringEntList(sendParams);
      if (res.code === 200) {
        this.data = res.rows;
        this.page.total = res.total;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/system/monitoringEnt/export",
        {
          ...this.queryParams,
        },
        `新三库一平台监测管理_${new Date().getTime()}.xlsx`
      );
    },

    async getAreaClass() {
      const res = await areaClass();
      console.log(res);
      if (res.code === 200) {
        let areaList = res.data;
        const row = this.option.column.find((item) => item.prop === "orgId");
        row.dicData = areaList;
      }
    },
  },
  mounted() {
    this.setOptions();
    this.getAreaClass();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.color--red {
  color: orangered;
}
</style>
