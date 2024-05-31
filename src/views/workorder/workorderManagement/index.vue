<template>
  <div class="workorderManagement-warp">
    <MultiTable
      :api="apiFn"
      :Options="tableOptions"
      isSearchForm
      :searchOptions="searchOptions"
      isSelection
      isPagination
      isEditRow
      :editRowIndex.sync="editRowIndex"
      align="center"
      @setupEvents="setupEvents"
    >
    </MultiTable>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import { workOrderApprovalList } from "@/api/core/workOrderApproval";

// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";
export default {
  components: {
    MultiTable,
  },
  data() {
    return {
      apiFn: workOrderApprovalList,
      //  表格配置
      tableOptions: [
        {
          label: "订单编号",
          prop: "id",
          sortable: true,
        },
        {
          label: "订单类型",
          prop: "type",
          formatter: (row, column, value) => {
            return formatterCallback(this.commonData.xtOrderType, value);
          },
        },
        {
          label: "客户名称",
          prop: "customerName",
        },
        {
          label: "项目类别",
          prop: "projectCategoryName",
        },
        {
          label: "项目类型",
          prop: "projectType",
        },
        {
          label: "单价",
          prop: "price",
        },
        {
          label: "数量",
          prop: "num",
        },
        {
          label: "总价",
          prop: "total",
        },
        {
          label: "项目总价",
          prop: "projectTotal",
        },
        {
          label: "操作",
          action: true,
          btns: [
            {
              id: "detail",
              type: "text",
              text: "详情",
              hasPermi: "",
              icon: "el-icon-edit",
            },
            {
              id: "del",
              type: "text",
              text: "删除",
              hasPermi: "",
              icon: "el-icon-edit",
            },
          ],
          rowEditBtn: [
            {
              id: "confirm",
              type: "text",
              text: "确定",
              hasPermi: "",
              icon: "el-icon-edit",
            },
            {
              id: "cancel",
              type: "text",
              text: "取消",
              hasPermi: "",
              icon: "el-icon-edit",
            },
          ],
        },
      ],
      //   筛选表单配置
      searchOptions: [
        {
          type: "input",
          prop: "search",
          value: "",
          placeholder: "搜索关键词",
        },
        {
          type: "select",
          prop: "type",
          value: "",
          placeholder: "工单类型",
        },
        {
          type: "select",
          prop: "status",
          value: "",
          placeholder: "工单状态",
        },
        {
          type: "select",
          prop: "emerg",
          value: "",
          placeholder: "紧急程度",
        },
        {
          type: "select",
          prop: "time",
          value: "",
          placeholder: "等待时间",
        },
      ],
      editRowIndex: "",
    };
  },
  methods: {
    setupEvents({ row, type }) {
      console.log(row, type);
      if (type === "detail") {
        this.editRowIndex = "detail";
      }
    },
  },
  mounted() {},
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.workorderManagement-warp {
  padding: 20px;
}
</style>
