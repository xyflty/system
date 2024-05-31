// 页面的配置信息

// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";
import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
export const approvalOptions = {
  tableOption: [
    {
      label: "订单编号",
      prop: "orderCode",
      width: "160px",
      sortable: true,
      fixed: true,
    }, //1
    // {
    //   label: "工单编号",
    //   prop: "orderJobCode", //1
    //   width: "160px",
    //   sortable: true,
    //   fixed: true,
    // },
    {
      label: "订单类型",
      prop: "orderType",
      width: "160px",
      sortable: true,
      formatter: (row, column, value) => {
        return formatterCallback(commonData.xtOrderType, value);
      },
    }, //1
    {
      label: "客户名称",
      prop: "customerName",
      width: "280px",
    },
    {
      label: "项目类别",
      prop: "projectCategoryName",
      width: "150px",
      sortable: true,
    },
    {
      label: "项目类型",
      prop: "projectType",
      width: "150px",
      sortable: true,
    },
    {
      label: "项目产品名称",
      prop: "projectName",
      width: "280px",
      sortable: true,
    },
    {
      label: "是否赠品",
      prop: "isGift",
      width: "120px",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.isGift, val);
      },
    },
    {
      label: "项目变更类型",
      prop: "changeType",
      width: "120px",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.orderProjectChangeType, val);
      },
    },
    {
      label: "原单价",
      prop: "originalUnitPrice",
    },
    {
      label: "原数量",
      prop: "originalQuantity",
    },
    {
      label: "原总价",
      slotName: "originalTotle",
    },
    {
      label: "更改后单价",
      width: "140px",
      prop: "changeUnitPrice",
    },
    {
      label: "更改后数量",
      width: "140px",
      prop: "changeQuantity",
    },
    {
      label: "更改后总价",
      width: "140px",
      slotName: "changeTotle",
    },
    {
      label: "提交日期",
      prop: "submitTime",
      width: "190px",
    },
    {
      label: "审批状态",
      prop: "auditStatus",
      width: "120px",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.auditstatus, val);
      },
    },
    {
      label: "审批日期",
      prop: "auditTime",
      width: "190px",
    },
    {
      label: "操作",
      action: true,
      width: "120px",
      fixed: "right",
      btns: [
        {
          id: "audit",
          text: "审批",
          type: "text",
        },
      ],
    },
  ],
  //   筛选表单配置
  searchOptions: [
    {
      type: "input",
      prop: "searchValue",
      placeholder: "搜索关键词",
      attrs: {
        clearable: true,
      },
    },
    {
      type: "select",
      prop: "orderType",
      placeholder: "订单类型",
      children: commonData.xtOrderType,
      attrs: {
        clearable: true,
      },
    },
    {
      type: "select",
      prop: "changeType",
      placeholder: "项目变更类型",
      children: commonData.orderProjectChangeType,
      attrs: {
        clearable: true,
      },
    },
    {
      type: "select",
      prop: "auditStatus",
      placeholder: "审批状态",
      children: commonData.auditstatus,
      attrs: {
        clearable: true,
      },
    },
    {
      type: "date-picker",
      prop: "changeTime",
      placeholder: "提交日期",
      attrs: {
        type: "datetime",
        valueFormat: "yyyy-MM-dd hh:mm:ss",
        format: "yyyy-MM-dd hh:mm:ss",
      },
    },
    {
      type: "date-picker",
      prop: "auditTime",
      placeholder: "审批日期",
      attrs: {
        type: "datetime",
        valueFormat: "yyyy-MM-dd hh:mm:ss",
        format: "yyyy-MM-dd hh:mm:ss",
      },
    },
  ],
};

export const recordOptions = {
  tableOption: [
    {
      label: "订单编号",
      prop: "orderCode",
      width: "160px",
      sortable: true,
    }, //1

    {
      label: "订单类型",
      prop: "orderType",
      width: "160px",
      sortable: true,
      formatter: (row, column, value) => {
        return formatterCallback(commonData.xtOrderType, value);
      },
    }, //1
    {
      label: "客户名称",
      prop: "customerName",
      width: "280px",
    },
    {
      label: "项目类别",
      prop: "projectCategoryName",
      width: "150px",
      sortable: true,
    },
    {
      label: "项目类型",
      prop: "projectType",
      width: "150px",
      sortable: true,
    },
    {
      label: "项目产品名称",
      prop: "projectName",
      width: "280px",
      sortable: true,
    },
    {
      label: "是否赠品",
      prop: "isGift",
      width: "120px",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.isGift, val);
      },
    },
    {
      label: "项目变更类型",
      prop: "changeType",
      width: "120px",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.orderProjectChangeType, val);
      },
    },
    {
      label: "原单价",
      prop: "originalUnitPrice",
      width: "140px",
    },
    {
      label: "原数量",
      prop: "originalQuantity",
      width: "120px",
    },
    {
      label: "原总价",
      slotName: "originalTotle",
      width: "140px",
    },
    {
      label: "更改后单价",
      width: "140px",
      prop: "changeUnitPrice",
    },
    {
      label: "更改后数量",
      width: "120px",
      prop: "changeQuantity",
    },
    {
      label: "更改后总价",
      width: "140px",
      slotName: "changeTotle",
    },
    // {
    //   label: "原始变更人",
    //   prop: "originalAlteration",
    //   width: "120px",
    // },
    {
      label: "变更人",
      prop: "changeUserName",
      width: "120px",
    },
    {
      label: "变更日期",
      prop: "createTime",
      width: "190px",
    },
  ],
  searchOptions: [
    {
      type: "input",
      prop: "searchValue",
      placeholder: "搜索关键词",
      attrs: {
        clearable: true,
      },
    },

    {
      type: "select",
      prop: "changeType",
      placeholder: "项目变更类型",
      children: commonData.orderProjectChangeType,
      attrs: {
        clearable: true,
      },
    },

    {
      type: "date-picker",
      prop: "changeTime",
      placeholder: "变更日期",
      attrs: {
        type: "datetime",
        valueFormat: "yyyy-MM-dd hh:mm:ss",
        format: "yyyy-MM-dd hh:mm:ss",
      },
    },
  ],
};
