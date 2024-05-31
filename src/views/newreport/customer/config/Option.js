import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

const filterOptions = (options, filterArr) => {
  const newOptions = options.filter((item) => !filterArr.includes(item.label));
  console.log(newOptions);
  return newOptions;
};

// 最底层表格头配置
const pielist = [
  {
    label: "主体部门",
    prop: "deptName",
  },

  {
    label: "职务",
    prop: "postName",
  },
  {
    label: "姓名",
    prop: "userName",
  },
  {
    label: "客户名称",
    prop: "customerName",
  },
  {
    label: "客户等级",
    prop: "customerGrade",
    formatter: (row, column, val) => {
      return formatterCallback(commonData.customerGradeList, val);
    },
  },
  {
    label: "关联订单名称",
    prop: "orderTitle", //type == 3 ,4
  },
  {
    label: "客户订单",
    prop: "orderTitle", //type == 6 ,5
  },
  {
    label: "转介绍成交客户",
    prop: "referralDealCustomer", //type == 6
    isCheck: true,
  },

  {
    label: "成交金额",
    prop: "dealPrice",
  },
  {
    label: "未跟进天数",
    prop: "notFollowUpDays",
  },
  {
    label: "关联项目大类",
    slotName: "projectBigClassList",
  },
  {
    label: "关联产品数",
    prop: "associatedProductCount",
    isCheck: true,
  },
];

// 钻取配置 start
const customerDrill = [
  {
    label: "部门",
    prop: "deptName",
  },
  {
    label: "VIP",
    prop: "vipGradeCount",
    isCheck: true,
  },
  {
    label: "A类",
    prop: "agradeCount",
    isCheck: true,
  },
  {
    label: "B类",
    prop: "bgradeCount",
    isCheck: true,
  },
  {
    label: "C类",
    prop: "cgradeCount",
    isCheck: true,
  },
  {
    label: "客户数量",
    prop: "customerGradeCount",
    isCheck: true,
  },
  {
    label: "占比",
    prop: "percentage",
  },
  {
    label: "钻取分析",
    action: true,
    width: 180,
    fixed: "right",
    btns: [
      {
        id: "drill",
        type: "primary",
        size: "mini",
        text: "钻取",
      },
      {
        id: "viewUser",
        type: "primary",
        size: "mini",
        text: "钻取用户",
      },
    ],
  },
];

const sourceDrill = [
  {
    label: "主体部门",
    prop: "deptName",
  },
  {
    label: "电话营销",
    prop: "phoneCount",
    isCheck: true,
  },
  {
    label: "工商客户",
    prop: "industrialCount",
    isCheck: true,
  },
  {
    label: "网推客户",
    prop: "internetCount",
    isCheck: true,
  },
  {
    label: "跨部门客户",
    prop: "diffDeptCount",
    isCheck: true,
  },
  {
    label: "客户转介绍",
    prop: "customerIntroduceCount",
    isCheck: true,
  },
  {
    label: "其他途径",
    prop: "otherCount",
    isCheck: true,
  },
  {
    label: "考场数据",
    prop: "examCount",
    isCheck: true,
  },
  {
    label: "渠道数据",
    prop: "channelCount",
    isCheck: true,
  },
  {
    label: "占比",
    prop: "dataSourcePercentage",
  },
  {
    label: "钻取分析",
    action: true,
    width: 180,
    fixed: "right",
    btns: [
      {
        id: "drill",
        type: "primary",
        size: "mini",
        text: "钻取",
      },
      {
        id: "viewUser",
        type: "primary",
        size: "mini",
        text: "钻取用户",
      },
    ],
  },
];

const projectDrill = [
  {
    label: "主体部门",
    prop: "deptName",
  },
  {
    label: "职训服务",
    prop: "vocationalTrainingServices",
    isCheck: true,
  },
  {
    label: "企业服务",
    prop: "enterpriseServices",
    isCheck: true,
  },
  {
    label: "人才服务",
    prop: "talentServices",
    isCheck: true,
  },
  {
    label: "教育中心",
    prop: "educationCenter",
    isCheck: true,
  },
  {
    label: "占比",
    prop: "percentage",
  },
  {
    label: "钻取分析",
    action: true,
    width: 180,
    fixed: "right",
    btns: [
      {
        id: "drill",
        type: "primary",
        size: "mini",
        text: "钻取",
      },
      {
        id: "viewUser",
        type: "primary",
        size: "mini",
        text: "钻取用户",
      },
    ],
  },
];

const cityDrill = [
  {
    label: "主体部门",
    prop: "deptName",
  },
  {
    ColumnSlot: "city",
  },
];

const behaviorDrill = [
  {
    label: "主体部门",
    prop: "deptName",
  },
  {
    label: "首次成交转化率",
    prop: "firstDealConversionRatio",
  },
  {
    label: "首次成交",
    prop: "firstDealCount",
    isCheck: true,
  },
  {
    label: "二次成交转化率",
    prop: "twiceDealConversionRatio",
  },
  {
    label: "二次成交",
    prop: "twiceDealCount",
    isCheck: true,
  },
  {
    label: "多次成交转化率",
    prop: "manyDealConversionRatio",
  },
  {
    label: "多次成交",
    prop: "manyDealCount",
    isCheck: true,
  },
  {
    label: "粉丝客户转化率",
    prop: "fansCustomerConversionRatio",
  },
  {
    label: "粉丝客户",
    prop: "fansCustomerCount",
    isCheck: true,
  },
  {
    label: "忠实客户转化率",
    prop: "loyalCustomerConversionRatio",
  },
  {
    label: "忠实客户",
    prop: "loyalCustomerCount",
    isCheck: true,
  },
  {
    label: "详细分析",
    action: true,
    btns: [
      {
        id: "drill",
        type: "primary",
        size: "mini",
        text: "钻取",
      },
    ],
  },
];

export const customerOptions = {
  customerGrade: {
    // 客户等级占比
    Options: customerDrill,
    title: "客户等级占比",
  },
  dataSource: {
    // 数据来源占比
    Options: sourceDrill,
    title: "数据来源占比",
  },
  project: {
    Options: projectDrill,
    title: "项目大类统计",
  },
  cityDistribute: {
    Options: cityDrill,
    title: "城市分配占比",
  },
  behavior: {
    Options: behaviorDrill,
    title: "客户行为转化率钻取分析",
  },
};

// 最底层数据展示
export const pielistOptions = {
  customerGrade: {
    // 客户等级占比
    Options: filterOptions(pielist, ["转介绍成交客户", "客户订单"]),
    Grade: ["C类客户数量", "B类客户数量", "A类客户数量", "VIP客户数量"],
  },
  dataSource: {
    // 数据来源占比
    Options: filterOptions(pielist, ["转介绍成交客户", "客户订单"]),
    Grade: [
      "电话营销",
      "工商客户",
      "网推客户",
      "跨部门客户",
      "客户转介绍",
      "其他途径",
      "考场数据",
      "渠道数据",
    ],
  },
  project: {
    // 项目大类占比
    Options: filterOptions(pielist, ["转介绍成交客户", "客户订单"]),
    Grade: ["企业服务", "人才服务", "职训服务", "教育中心"],
  },
  cityDistribute: {
    // 城市占比
    Options: filterOptions(pielist, ["转介绍成交客户", "客户订单"]),
    Grade: "",
  },

  customer: {
    // 客户数量
    Options: filterOptions(pielist, ["姓名", "转介绍成交客户", "客户订单"]),
  },

  behavior: {
    // 成交次数
    Options: filterOptions(pielist, ["姓名", "转介绍成交客户", "客户订单"]),
    Grade: ["首次成交客户数量", "二次成交客户数量", "多次成交客户数量"],
  },
  fans: {
    // 粉丝
    Options: filterOptions(pielist, ["姓名", "关联订单名称"]),
    Grade: ["粉丝客户数量", "忠实客户数量"],
  },
};

// 业务数据可视化
export const performanceOptions = [
  {
    label: "客户数量",
    prop: "customerCount",
    isCheck: true,
  },
  {
    label: "客户数量占比",
    prop: "percentage",
    width: 120,
  },

  {
    label: "VIP",
    prop: "VIP",
    isCheck: true,
  },
  {
    label: "A类",
    prop: "A",
    isCheck: true,
  },
  {
    label: "B类",
    prop: "B",
    isCheck: true,
  },
  {
    label: "C类",
    prop: "C",
    isCheck: true,
  },
  {
    label: "客户价值质量",
    slotName: "rata",
  },
  {
    label: "首次成交",
    prop: "firstDealCount",
    isCheck: true,
  },
  {
    label: "二次成交",
    prop: "twiceDealCount",
    isCheck: true,
  },
  {
    label: "多次成交",
    prop: "manyTimesDealCount",
    isCheck: true,
  },
  {
    label: "粉丝客户",
    prop: "fansCustomerCount",
    isCheck: true,
  },
  {
    label: "忠实客户",
    prop: "loyalCustomerCount",
    isCheck: true,
  },
  {
    label: "客户行为质量",
    prop: "customerBehaviorQuality",
  },
  {
    label: "详细分析",
    action: true,
    width: 180,
    fixed: "right",
    btns: [
      {
        id: "drill",
        type: "primary",
        size: "mini",
        text: "钻取",
      },
    ],
  },
];

// 详细分析列表
export const detailOption = [
  {
    label: "客户名称",
    prop: "customerName",
  },
  {
    label: "客户等级",
    prop: "customerGrade",
    formatter: (row, column, val) => {
      return formatterCallback(commonData.customerGradeList, val);
    },
  },
  {
    label: "数据来源",
    prop: "dataSource",
    formatter: (row, column, val) => {
      return formatterCallback(commonData.dataSourceList, val);
    },
  },
  {
    label: "城市分布",
    prop: "cityDistribution",
  },
  {
    label: "客户成交次数",
    prop: "customerDealCount",
    isCheck: true,
  },
  {
    label: "转介绍成交客户",
    prop: "referralDealCustomer",
    isCheck: true,
  },
  {
    label: "关联项目类型",
    slotName: "projectBigClassList",
  },
  {
    label: "关联产品数",
    prop: "associatedProductCount",
    isCheck: true,
  },
  {
    label: "累计成交金额",
    prop: "dealPrice",
  },
  {
    label: "最近成交时间",
    prop: "recentlyDealTime",
  },
  {
    label: "未跟进天数",
    prop: "notFollowUpDays",
  },
];
