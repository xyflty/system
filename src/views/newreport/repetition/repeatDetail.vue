// 重复明细-钻取页，线索，商机，客户
<template>
  <div class="app-container">
    <QueryCard
      :options="queryOptions"
      :search.sync="queryForm"
      :isBack="true"
      @submit="handleQuery"
      @reset="resetQuery"
    />

    <el-card v-if="pageDetail && queryParams">
      <PagesTable
        :title="pageDetail.title"
        :api="pageDetail.api"
        :parmas="queryParams"
        :isPagination="true"
        :options="pageDetail.options"
      >
        <!-- <template #btns>
          <el-button type="warning" plain icon="el-icon-download" size="mini"
            >导出</el-button
          >
        </template> -->
      </PagesTable>
    </el-card>
  </div>
</template>

<script>
import QueryCard from "./QueryCard.vue";
import PagesTable from "./PagesTable";

import {
  clueRepeatPageListInto,
  customerRepeatPageListInto,
  opportunityRepeatCompanyPageListInto,
  opportunityRepeatTitlePageListInto,
} from "@/api/newreport/repetition";
import { repeatDetail, cliqueOptions, deptOptions } from "./options";
import { mapState } from "vuex";
export default {
  components: { QueryCard, PagesTable },
  data() {
    return {
      queryOptions: {
        filterDic: true,
        filterNull: true,
        menuSpan: 6,

        submitText: "查询",
        emptyText: "重置",
        column: [],
      },
      queryForm: {},
      //   参数
      queryParams: null,

      // 当前页面类型
      pageType: null,
      //   当前表格的配置数据

      // 页面保存的数据配置（根据传递过来的类型判断）
      pageSave: {
        opportunityCompany: {
          title: "商机-按企业重复明细",
          api: opportunityRepeatCompanyPageListInto,
          options: repeatDetail.opportunityCompany,
        },
        clue: {
          title: "线索数据重复明细钻取",
          api: clueRepeatPageListInto,
          options: repeatDetail.clue,
        },
        customer: {
          title: "客户数据重复明细",
          api: customerRepeatPageListInto,
          options: repeatDetail.customer,
        },
        opportunityCustomer: {
          title: "商机-按商机标题重复明细",
          api: opportunityRepeatTitlePageListInto,
          options: repeatDetail.opportunityCustomer,
        },
      },

      companyName: "",
    };
  },
  methods: {
    setOptions() {
      this.queryOptions.column = [
        {
          label: "主体",
          prop: "deptIds",
          type: "select",
          dicData: cliqueOptions,
          span: 6,
        },
        {
          label: "部门",
          prop: "depts",
          type: "select",
          dicData: deptOptions,
          span: 6,
        },
        {
          label: "最后跟进时间",
          prop: "FollowUpBeginTime",
          type: "daterange",
          format: "yyyy-MM-dd",
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          labelWidth: 120,
        },
        {
          label: "跟进人员",
          prop: "userId",
          type: "select",
          filterable: true,
          dicData: this.commonData.userList,
          span: 6,
        },
      ];
    },
    // 处理参数
    dealParams(form) {
      const { deptIds, depts, FollowUpBeginTime, userId } = form;
      let ids = "";

      if (deptIds) {
        // 判断主体是否存在数据
        if (depts) {
          // 判断是否存在
          ids = depts;
        } else {
          ids = deptIds;
        }
      } else {
        if (depts) {
          // 判断是否存在
          ids = depts;
        } else {
          ids = null;
        }
      }

      const sendParams = {
        userId,
        deptIds: ids,
        companyName: this.companyName,
        lastFollowUpBeginTime:
          (FollowUpBeginTime && FollowUpBeginTime[0]) || null,
        lastFollowUpEndTime:
          (FollowUpBeginTime && FollowUpBeginTime[1]) || null,
      };
      return sendParams;
    },
    // 查询
    handleQuery(form, done) {
      let sendParams = this.dealParams(form);
      // if (sendParams.deptIds) {

      // } else {
      //   this.$message.error("请至少选择一个主体或者部门");
      // }
      this.queryParams = sendParams;
      console.log(this.queryParams);
      done();
    },
    // 重置
    resetQuery() {
      this.queryParams = this.dealParams(this.queryForm);
    },
  },
  mounted() {
    this.$store.dispatch("commonData/getUserList");
    this.pageType = this.$route.query.type;
    this.companyName = this.$route.query.companyName;
    this.queryForm.companyName = this.companyName;
    this.queryParams = this.dealParams(this.queryForm);
    this.setOptions();
  },
  computed: {
    pageDetail() {
      return this.pageSave[this.pageType];
    },
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    "queryForm.deptIds"(newVal) {
      let dicData = deptOptions;
      if (newVal) {
        dicData = deptOptions.filter((item) => item.parentId === newVal);
      }

      this.queryOptions.column[1].dicData = dicData;
      this.queryForm.depts = "";
    },
  },
};
</script>

<style lang='scss' scoped>
.el-card {
  margin-bottom: 15px;
}
</style>