// 动态检查
<template>
  <div class="app-container">
    <!-- 筛选表单 -->
    <avue-form
      :option="searchOption"
      v-model="queryParams"
      @submit="handleSubmit"
      @reset-change="handleReset"
    ></avue-form>
    <!-- 表格 -->
    <avue-crud
      ref="crud"
      :data="tableData"
      :option="option"
      :page.sync="pager"
      @on-load="getList"
    >
      <template slot="companyName" slot-scope="scope">
        <span class="is--click" @click="goDetail(scope.row)">{{
          scope.row.companyName
        }}</span>
      </template>

      <!-- 操作栏 -->
      <template slot-scope="{ row }" slot="menu">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleContact(row)"
          v-hasPermi="['core:contactInfo:getContactInfoList']"
          >查看联系人</el-button
        >
      </template>
    </avue-crud>

    <!-- 联系人查看 -->

    <AptitudeModel
      type="Contact"
      :visible.sync="visible"
      :archiveId.sync="archiveId"
    />
  </div>
</template>

<script>
import { companyCheckSituationCompareList } from "@/api/core/dynamicCheck";
import AptitudeModel from "@/views/core/components/model/AptitudeModel.vue";

import { mapState } from "vuex";
export default {
  components: {
    AptitudeModel,
  },
  data() {
    return {
      tableData: [],
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,

        border: true,
        stripe: true,

        headerAlign: "center",
        align: "center",
        column: [],
      },
      queryParams: {},
      pager: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },

      // 筛选表单
      searchOption: {
        menuSpan: 6,
        filterDic: true,
        filterNull: true,
        column: [],
      },

      // 查看联系人
      visible: false,
      archiveId: "",
    };
  },
  methods: {
    setOptions() {
      this.searchOption.column = [
        {
          label: "企业名称",
          prop: "companyName",
          span: 6,
        },
        {
          label: "跟进人员",
          prop: "followUpPersonIds",
          type: "select",
          dicData: this.commonData.userList,
          filterable: true,
          span: 6,
        },
        {
          label: "数据类型",
          prop: "businessType",
          type: "select",
          dicData: [
            { label: "线索", value: 1 },

            { label: "商机", value: 2 },
            { label: "客户", value: 3 },
          ],
          span: 6,
        },
        {
          label: "数据来源",
          prop: "dataSource",
          type: "select",
          dicData: this.commonData.dataSourceList,
          span: 6,
        },
        {
          label: "最后跟进时间",
          prop: "lastFollowUpTime",
          type: "datetime",
          format: "yyyy-MM-dd",
          valueFormat: "yyyy-MM-dd",
          span: 6,
          labelWidth: 120,
        },
      ];

      this.option.column = [
        {
          label: "企业名称",
          prop: "companyName",
          slot: true,
        },
        {
          label: "安证编号",
          prop: "safetyNum",
        },
        {
          label: "核查情况",
          prop: "situation",
        },
        {
          label: "CRM阶段",
          prop: "businessType",
          dicData: [
            { label: "线索", value: 1 },
            { label: "商机", value: 2 },
            { label: "客户", value: 3 },
          ],
        },
        {
          label: "最后跟进时间",
          prop: "lastFollowUpTime",
        },
        {
          label: "跟进人",
          prop: "userName",
        },
        {
          label: "备注",
          prop: "remark",
          overHidden: true,
        },
      ];
    },

    // 查询
    handleSubmit(form, done) {
      this.getList();
      done();
    },

    handleReset() {
      this.pager.currentPage = 1;
      this.getList();
      done();
    },

    async getList() {
      const { currentPage, pageSize } = this.pager;
      let sendParams = {
        ...this.queryParams,
        pageNum: currentPage,
        pageSize,
      };
      try {
        const res = await companyCheckSituationCompareList(sendParams);
        if (res.code === 200) {
          this.tableData = res.rows;
          this.pager.total = res.total;
        }
      } catch (error) {}
    },

    handleContact(row) {
      this.visible = true;
      this.archiveId = row.archiveId;
    },

    // 跳到对应详情页
    goDetail(row) {
      if (!row.businessType) {
        this.$message.error("当前数据类型为");
        return;
      }
      let routerName = "";
      let query = {
        id: row.infoMap[row.businessType],
      };
      if (row.businessType === 1) {
        // 线索
        routerName = "Clue/detail";
      } else if (row.businessType === 2) {
        // 商机
        routerName = "Customer/detail";

        query.type = "1";
      } else if (row.businessType === 3) {
        // 客户
        routerName = "Customer/detail";
      }

      this.$router.push({ name: routerName, query: query });
    },
  },
  mounted() {
    this.$store.dispatch("commonData/getUserList");
    this.setOptions();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__header {
  min-height: 0;
}
.is--click {
  color: #409eff;
  cursor: pointer;
}
</style>
