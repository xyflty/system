// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

const commit = [
  {
    label: "销售产品数量",
    prop: "productCount",
    sortable: "custom",
  },
  {
    label: "销售产品金额",
    prop: "productPrice",
    sortable: "custom",
  },
  {
    label: "关联订单数",
    prop: "orderCount",
    sortable: "custom",
  },
  {
    label: "关联客户数",
    prop: "associatedCustomerCount",
    sortable: "custom",
  },
];

const cityCommit = [
  {
    label: "职训服务",
    prop: "vocationalTrainingServices",
    sortable: "custom",
  },
  {
    label: "企业服务",
    prop: "enterpriseServices",
    sortable: "custom",
  },
  {
    label: "人才服务",
    prop: "talentServices",
    sortable: "custom",
  },
  {
    label: "教育中心",
    prop: "educationCenter",
    sortable: "custom",
  },
  {
    label: "销售产品数量",
    prop: "productCount",
    sortable: "custom",
  },
  {
    label: "销售金额",
    prop: "productPrice",
    sortable: "custom",
  },
];

const detailOptions = [
  {
    label: "部门",
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
    label: "订单名称",
    prop: "orderTitle",
  },
  {
    label: "订单状态",
    prop: "orderStatus",
    formatter: (val, value, label) => {
      return formatterCallback(commonData.xtOrderStatus, value);
    },
  },
  {
    label: "客户名称",
    prop: "companyName",
  },
  {
    label: "订单金额",
    prop: "orderPrice",
    sortable: "custom",
  },
  {
    label: "客户等级",
    prop: "customerGradeName",
  },

  {
    label: "客户地区",
    prop: "customerArea",
  },
];

const dealClick = (data, need) => {
  let newData = JSON.parse(JSON.stringify(data));
  newData.forEach((item) => {
    if (need.includes(item.label)) {
      item.isClick = true;
    }
  });

  return newData;
};

export const projectOptions = {
  secondary: [
    {
      label: "项目二级分类",
      prop: "categoryName",
    },
    ...commit,
  ],
  tertiary: [
    {
      label: "项目三级分类",
      prop: "categoryName",
    },
    ...commit,
  ],
  fourthly: [
    {
      label: "项目名称",
      prop: "categoryName",
    },
    ...commit,
  ],
  quinary: detailOptions,
};

export const cityOptions = {
  city: [
    {
      label: "城市",
      prop: "customerCity",
    },
    ...cityCommit,
  ],
  area: [
    {
      label: "县区",
      prop: "customerArea",
    },
    ...dealClick(cityCommit, ["职训服务", "企业服务", "人才服务", "教育中心"]),
  ],
};

// 销售详情配置
export const sellDetail = {
  relevancy: [
    {
      label: "城市分布",
      prop: "city",
    },
    {
      label: "项目二级分类",
      prop: "secondCategoryName",
    },
    {
      label: "项目类型",
      prop: "projectType",
    },

    {
      label: "产品名称",
      prop: "projectName",
    },
    {
      label: "客户名称",
      prop: "companyName",
    },
    {
      label: "客户等级",
      prop: "customerGrade",
      formatter: (val, value, label) => {
        return formatterCallback(commonData.customerGradeList, value);
      },
    },
    {
      label: "关联订单名称",
      prop: "orderTitle",
    },
    {
      label: "成交金额",
      prop: "totalPrice",
      sortable: "custom",
    },
    {
      label: "归属主体",
      prop: "mainPart",
    },
    {
      label: "归属人员",
      prop: "userName",
    },
  ],
  dept: [
    {
      label: "项目类型",
      prop: "projectType",
    },
    {
      label: "产品名称",
      prop: "projectName",
    },
    {
      label: "归属主体",
      prop: "mainPart",
    },

    {
      label: "归属部门",
      prop: "deptName",
    },
    {
      label: "销售金额",
      prop: "totalPrice",
      sortable: "custom",
    },
    {
      label: "平均客单价",
      prop: "averagePrice",
      sortable: "custom",
    },
    {
      label: "关联订单数",
      prop: "orderNum",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "关联客户数",
      prop: "customerNum",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "销售数量占比",
      prop: "projectQuantityRate",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "销售金额占比",
      prop: "totalPriceRate",
      isClick: true,
      sortable: "custom",
    },
  ],
  dept1: [
    {
      label: "项目类型",
      prop: "projectType",
    },
    {
      label: "产品名称",
      prop: "projectName",
    },

    {
      label: "归属部门",
      prop: "deptName",
    },
    {
      label: "归属人员",
      prop: "userName",
    },
    {
      label: "销售金额",
      prop: "totalPrice",
      sortable: "custom",
    },
    {
      label: "平均客单价",
      prop: "averagePrice",
      sortable: "custom",
    },
    {
      label: "关联订单数",
      prop: "orderNum",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "关联客户数",
      prop: "customerNum",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "销售数量占比",
      prop: "projectQuantityRate",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "销售金额占比",
      prop: "totalPriceRate",
      isClick: true,
      sortable: "custom",
    },
  ],
  // 用户名
  user: [
    {
      label: "项目大类",
      prop: "topCategoryName",
    },
    {
      label: "项目二级分类",
      prop: "secondCategoryName",
    },
    {
      label: "项目类型",
      prop: "projectType",
    },

    {
      label: "产品名称",
      prop: "projectName",
    },
    {
      label: "业务员排名",
      prop: "userName",
    },
    {
      label: "销售数量",
      prop: "projectQuantity",
      sortable: "custom",
    },
    {
      label: "销售金额",
      prop: "totalPrice",
      sortable: "custom",
    },
    {
      label: "平均客单价",
      prop: "averagePrice",
      sortable: "custom",
    },
    {
      label: "关联订单数",
      prop: "orderNum",
      isClick: true,
      sortable: "custom",
    },
    {
      label: "关联客户数",
      prop: "customerNum",
      isClick: true,
      sortable: "custom",
    },
  ],
};

export const products = {
  border: true,
  align: "center",
  stripe: true,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  loadingText: "Loading...",
  loadingSpinner: "svg",
  loadingSvgViewBox: "-10, -10, 50, 50",
  loadingBackground: "rgba(122, 122, 122, 0.8)",

  menuWidth: 120,
  index: true,
  indexLabel: "排名",
  defaultSort: {
    prop: "totalPrice",
    order: "descending",
  },
  column: [
    {
      label: "时间",
      prop: "searchStartDate",
      slot: true,
    },
    {
      label: "项目二级分类",
      prop: "secondCategoryName",
    },
    {
      label: "项目类型",
      prop: "projectType",
    },

    {
      label: "产品名称",
      prop: "projectName",
    },
    {
      label: "销售数量",
      prop: "projectQuantity",
      sortable: "custom",
    },
    {
      label: "销售数量占比",
      prop: "projectQuantityRate",
    },
    {
      label: "销售金额",
      prop: "totalPrice",
      sortable: "custom",
    },

    {
      label: "销售金额占比",
      prop: "totalPriceRate",
    },
    {
      label: "关联订单数",
      prop: "orderNum",
      slot: true,
      sortable: "custom",
    },
    {
      label: "关联客户数",
      prop: "customerNum",
      slot: true,
      sortable: "custom",
    },
    {
      label: "最高销售单价",
      prop: "maxUnitPrice",
      sortable: "custom",
    },

    {
      label: "最低销售单价",
      prop: "minUnitPrice",
      sortable: "custom",
    },
    {
      label: "平均客单价",
      prop: "averagePrice",
      sortable: "custom",
    },

    {
      label: "第二集团军",
      prop: "zwzx",
      slot: true,
    },
    {
      label: "第一集团军",
      prop: "dyjtj",
      slot: true,
    },

    // {
    //   label: "产品最高销售者",
    //   prop: "userName",
    //   slot: true,
    // },
  ],
};
