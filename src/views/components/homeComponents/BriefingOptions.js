import {
  formatterCallback,
  getOrderJobColor,
  htmlCallback,
} from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
const xtCommon = [
  {
    label: "客户名称",
    prop: "companyName",
    minWidth: 250,
    fixed: true,
  },
  {
    label: "工单编号",
    prop: "orderJobCode",
    width: 160,
  },
  {
    label: "订单类型",
    prop: "orderType",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.xtOrderType, value);
    },
    width: 150,
  },
  {
    label: "项目产品名称",
    prop: "projectName",
    minWidth: 250,
  },
  {
    label: "工单状态",
    prop: "orderJobStatus",
    width: 120,
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
    width: 120,
  },
  {
    label: "工单节点动态",
    prop: "childNode",
    width: 120,
  },
  {
    label: "超时预警",
    prop: "warnTypeString",
    isHtml: (row, column, value) => {
      return htmlCallback(value);
    },
    width: 120,
  },
  {
    label: "服务顾问（制）",
    prop: "makeUserName",
    width: 120,
  },
  {
    label: "服务顾问（审）",
    prop: "auditUserName",
    width: 120,
  },
  {
    label: "财务顾问",
    prop: "financeAdvisor",
    width: 120,
  },
  {
    label: "应收金额",
    prop: "planPrice",
    width: 120,
  },
  {
    label: "已收金额",
    prop: "actualPrice",
    width: 120,
  },
];
const xtCommon1 = [
  {
    label: "客户名称",
    prop: "companyName",
  },
  {
    label: "项目产品名称",
    prop: "projectName",
  },
  {
    label: "单价",
    prop: "unitPrice",
  },
  {
    label: "总价",
    prop: "totalPrice",
  },
  {
    label: "项目总价",
    prop: "projectTotalPrice",
  },
  {
    label: "订单审批发起时间",
    prop: "orderInitiatorTime",
  },
  {
    label: "订单审批状态",
    prop: "auditResult",
  },
  {
    label: "订单审批时间",
    prop: "auditTime",
  },
];

// 协同下单数量
const xtCommon2 = [
  {
    label: "客户名称",
    prop: "companyName",
    width: 280,
    fixed: true,
  },
  {
    label: "项目产品名称",
    prop: "projectName",
    width: 360,
  },
  {
    label: "单价",
    prop: "unitPrice",
    width: 120,
  },
  {
    label: "数量",
    prop: "quantity",
    width: 100,
  },
  {
    label: "总价",
    slotName: "totalPrice",
    width: 120,
  },
  {
    label: "项目总价",
    prop: "price",
    width: 120,
  },
  {
    label: "订单审批发起时间",
    prop: "launchAuditTime",
    width: 160,
  },
  {
    label: "订单审批状态",
    prop: "auditStatus",
    width: 120,
    formatter: (row, column, val) => {
      return formatterCallback(commonData.auditstatus, val);
    },
  },
  {
    label: "订单审批时间",
    prop: "lastAuditTime",
    width: 160,
  },
];
// 协同工单详情
const xtCommon3 = [
  {
    label: "客户名称",
    prop: "companyName",
    width: 280,
    fixed: true,
  },
  {
    label: "工单编号",
    prop: "orderJobCode",
    width: 160,
  },
  {
    label: "订单类型",
    prop: "orderType",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.xtOrderType, value);
    },
    width: 110,
  },
  {
    label: "项目产品名称",
    prop: "projectName",
    width: 360,
  },
  {
    label: "工单状态",
    prop: "orderJobStatus",
    width: 120,
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
    width: 120,
  },
  {
    label: "工单节点动态",
    prop: "childNode",
    width: 120,
  },

  {
    label: "服务顾问（制）",
    prop: "makeUserName",
    width: 120,
  },
  {
    label: "服务顾问（审）",
    prop: "auditUserName",
    width: 120,
  },
  {
    label: "财务顾问",
    prop: "financeAdvisor",
    width: 120,
  },
];
export const briefing = {
  // crm数据
  CRM: {
    compare: {
      clueCount: "线索",
      opportunityCount: "商机",
      orderCount: "订单",
      customerCount: "客户",
      priceSum: "成交金额",
      orderProjectCount: "成交产品",
      waitReferPriceAudit: "待报价审批",
      waitOrderProjectChangeAudit: "待项目变更审批",
    },
  },
  // 协同数据
  XT: {
    compare: {
      synergyOrderCount: "下单数量",
      waitSynergyOrderAudit: "待审批下单",
      orderJobCount: "工单数量",
      waitDivideOrderJobAudit: "待审核分配",
      inProgressCount: "正在作业",
      finishedCount: "已完结",
      qualificationCount: "资质项目",
      safetyCount: "安证项目",
      talentCount: "人才项目",
      certificateCount: "证书项目",
      businessCount: "工商项目",
      intellectualCount: "知识产权项目",
    },
    tableOptions: {
      synergyOrderCount: xtCommon2,
      waitSynergyOrderAudit: xtCommon2,
      orderJobCount: xtCommon3,
      waitDivideOrderJobAudit: xtCommon3,
      inProgressCount: xtCommon3,
      finishedCount: xtCommon3,
      qualificationCount: xtCommon3,
      safetyCount: xtCommon3,
      talentCount: xtCommon3,
      certificateCount: xtCommon3,
      businessCount: xtCommon3,
      intellectualCount: xtCommon3,
    },
  },
  // 业务排名
  Ranking: [
    {
      key: 0,
      label: "姓名",
      prop: "userName",
      minWidth: 120,
      fixed: true,
      visible: true,
    },
    {
      key: 1,
      label: "成交金额",
      prop: "dealPrice",
      minWidth: 120,
      sortable: "custom",
      visible: true,
    },
    {
      key: 2,
      label: "成交金额部门内排名",
      prop: "dealPriceDeptRank",
      minWidth: 200,
      sortable: "custom",
      visible: true,
    },
    {
      key: 3,
      label: "成交金额集团内排名",
      prop: "dealPriceGroupRank",
      minWidth: 200,
      sortable: "custom",
      visible: true,
    },
    {
      key: 4,
      label: "线索数量",
      prop: "clueCount",
      minWidth: 120,
      sortable: "custom",
      visible: true,
    },
    {
      key: 5,
      label: "线索部门内排名",
      prop: "clueCountDeptRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 6,
      label: "线索集团内排名",
      prop: "clueCountGroupRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 7,
      label: "商机数量",
      prop: "opportunityCount",
      minWidth: 120,
      sortable: "custom",
      visible: true,
    },
    {
      key: 8,
      label: "商机部门内排名",
      prop: "opportunityCountDeptRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 9,
      label: "商机集团内排名",
      prop: "opportunityCountGroupRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 10,
      label: "订单数量",
      prop: "orderCount",
      minWidth: 120,
      sortable: "custom",
      visible: true,
    },
    {
      key: 11,
      label: "订单部门内排名",
      prop: "orderCountDeptRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 12,
      label: "订单集团内排名",
      prop: "orderCountGroupRank",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },

    {
      key: 13,
      label: "销售产品数量",
      prop: "projectCount",
      minWidth: 160,
      sortable: "custom",
      visible: true,
    },
    {
      key: 14,
      label: "销售产品数量部门内排名",
      prop: "projectCountDeptRank",
      minWidth: 200,
      sortable: "custom",
      visible: true,
    },
    {
      key: 15,
      label: "销售产品数量集团内排名",
      prop: "projectCountGroupRank",
      minWidth: 200,
      sortable: "custom",
      visible: true,
    },
  ],
  // 全景数据分析配置
  panorama: {
    compare: {
      synergyOrderQuantity: "协同下单数量",
      synergyOrderJobQuantity: "协同工单数量",
      notActivated: "待分配工单",
      jobInProgress: "正在作业工单",
      finished: "已完结工单",
      canceled: "已取消工单",
      suspended: "已暂缓工单",
      waitCanceled: "待取消工单",
      waitSuspended: "待暂缓工单",
      planPrice: "协同工单应收金额",
      actualPrice: "协同工单已收金额",
      timeoutWarn: "超时预警工单",
    },

    tableOptions: {
      synergyOrderQuantity: xtCommon1,
      synergyOrderJobQuantity: xtCommon.filter(
        (item) => item.label !== "超时预警"
      ),
      notActivated: xtCommon
        .slice(0, -2)
        .filter((item) => item.label !== "超时预警"),
      jobInProgress: xtCommon.filter((item) => item.label !== "超时预警"),
      finished: xtCommon,
      canceled: xtCommon,
      suspended: xtCommon,
      waitCanceled: xtCommon,
      waitSuspended: xtCommon,
      planPrice: xtCommon,
      actualPrice: xtCommon,
      timeoutWarn: xtCommon,
    },
  },
};

// 全景标题
export const titleList = [
  { label: "安证", value: 1 },
  { label: "资质", value: 2 },
  { label: "人才", value: 3 },
  { label: "证书", value: 4 },
  { label: "工商", value: 5 },
  { label: "知识产权", value: 6 },
];
