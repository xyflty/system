// 重复数据钻取页面
<template>
  <div class="app-container">
    <QueryCard
      :options="queryOptions"
      :search.sync="queryForm"
      :isBack="true"
      @submit="handleQuery"
      @reset="resetQuery"
    />

    <!-- 生成页面所有的表格数据 -->
    <template v-for="(page, index) in pagesTableArr">
      <el-card :key="index" v-if="queryParams">
        <PagesTable
          :title="page.title"
          :api="page.api"
          :parmas="queryParams"
          :addColumns="true"
          :isPagination="true"
          :dealData="dealData"
          :options="page.options"
        />
      </el-card>
    </template>
  </div>
</template>

<script>
import QueryCard from "./QueryCard.vue";
import PagesTable from "./PagesTable";

import {
  clueRepeatFollowUpPageList,
  opportunityRepeatFollowUpPageList,
  customerRepeatFollowUpPageList,
  customerRepeatPageList,
  clueRepeatPageList,
  opportunityRepeatTitlePageList,
} from "@/api/newreport/repetition";
import { repeatPages, deptOptions } from "./options";
export default {
  components: { QueryCard, PagesTable },
  data() {
    return {
      queryOptions: {
        filterDic: true,
        filterNull: true,
        labelWidth: 20,
        menuSpan: 6,

        submitText: "查询",
        emptyText: "重置",
        column: [],
      },
      queryForm: { deptIds: "", type: 2 },
      queryParams: null,

      pagesTableArr: [
        {
          title: "线索数据重复明细",
          api: clueRepeatPageList,
          options: repeatPages.clue,
        },
        {
          title: "正在跟进重复线索名称明细",
          api: clueRepeatFollowUpPageList,
          options: repeatPages.clue,
        },
        {
          title: "商机数据重复明细",
          api: opportunityRepeatTitlePageList,
          options: repeatPages.opportunity,
        },
        {
          title: "正在跟进重复商机名称明细",
          api: opportunityRepeatFollowUpPageList,
          options: repeatPages.opportunity,
        },
        {
          title: "客户数据重复明细",
          api: customerRepeatPageList,
          options: repeatPages.customer,
        },
        {
          title: "正在跟进重复客户名称明细",
          api: customerRepeatFollowUpPageList,
          options: repeatPages.customer,
        },
      ],
    };
  },
  methods: {
    setOptions() {
      this.queryOptions.column = [
        {
          label: "",
          prop: "deptIds",
          type: "select",
          dicData: deptOptions,
          span: 6,
        },
      ];
    },
    // 查询
    handleQuery(form, done) {
      this.queryParams = form;

      done();
    },
    // 重置
    resetQuery() {
      this.queryForm = { deptIds: this.deptId, type: 2 };
      this.queryParams = this.queryForm;
    },
    // 处理表格方法
    dealData(data, props) {
      data.forEach((item) => {
        props.forEach((user) => {
          // 当前部门的人员
          item[user.userId] = 0;
        });

        if (item.userRepeatMap) {
          let obj = item.userRepeatMap;

          for (const key in obj) {
            item[key] = obj[key];
          }
        }
      });

      return data;
    },
  },
  mounted() {
    this.deptId = this.$route.query.id;
    this.queryForm.deptIds = this.deptId;
    // 表格参数赋值
    this.queryParams = { ...this.queryForm };
    this.setOptions();
  },
};
</script>

<style lang='scss' scoped>
.el-card {
  margin-bottom: 15px;
}
</style>