import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
export const Options = [
  {
    label: "工单编号",
    prop: "orderJobCode", //1
    width: "160px",
    fixed: true,
  },
  {
    label: "客户名称",
    prop: "companyName",
    width: "250px",
    fixed: true,
  },

  {
    label: "订单类型",
    prop: "orderType",
    width: "160px",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.xtOrderType, value);
    },
  }, //1
  {
    label: "项目类别",
    prop: "projectCategoryName",
    width: "180px",
  },
  {
    label: "项目类型",
    prop: "projectType",
    width: "180px",
  },
  {
    label: "项目产品名称",
    prop: "projectName",
    width: "250px",
  },
  {
    label: "工单状态",
    prop: "orderJobStatus",
    width: "120px",
    isHtml: (row, column, value) => {
      let color = getOrderJobColor(commonData.orderJobStatus, value);
      return `<div class="circle-container">
          <span class="circle-status" style="background:${color}; box-shadow: 0 0 5px ${color};"></span>
          <span>${formatterCallback(commonData.orderJobStatus, value)}</span>
        </div>`;
    },
  },
  {
    label: "工单作业节点",
    prop: "rootNode",
    width: "150px",
  },
  {
    label: "工单节点动态",
    prop: "childNode",
    width: "150px",
  },
  {
    label: "紧急程度",
    prop: "emergencyStatus",
    width: "150px",

    formatter: (row, column, value) => {
      return formatterCallback(commonData.emergencyStatus, value);
    },
  }, //1
  {
    label: "超时预警",
    prop: "warnTypeString",
    isHtml: (row, column, value) => {
      return htmlCallback(value);
    },
    width: "200px",
  },
  {
    label: "服务顾问（制）",
    prop: "makeUserName",
    width: "150px",
  }, //1
  {
    label: "服务顾问（审）",
    prop: "auditUserName",
    width: "150px",
  }, //1
  {
    label: "财务顾问",
    prop: "financeAdvisor",
    width: "150px",
  }, //1
  {
    label: "订单发起人",
    prop: "orderInitiator",
    width: "150px",
  },
  {
    label: "工单发起人",
    prop: "orderJobInitiator",
    width: "150px",
  },
  {
    label: "工单提交时间",
    prop: "orderJobSubmitTime",
    width: "150px",
  },
  {
    label: "承诺完成时间",
    prop: "promiseTime",
    width: "150px",
  }, //1
  {
    label: "应收金额",
    prop: "planPrice",
    width: "150px",
  }, //1
  {
    label: "已收金额",
    prop: "actualPrice",
    width: "160px",
  }, //1
];

export const search = [
  {
    type: "select",
    label: "",
    prop: "orderJobStatus",

    placeholder: "请选择工单状态",
    children: commonData.orderJobStatus,
  },
  {
    type: "select",
    label: "",
    prop: "warnType",
    placeholder: "请选择超时预警",
    children: commonData.warnType,
  },
];

export const project = [
  { label: "安证", value: 1 },
  { label: "资质", value: 2 },
  { label: "人才", value: 3 },
  { label: "证书", value: 4 },
  { label: "工商", value: 5 },
  { label: "知识产权", value: 6 },
];
