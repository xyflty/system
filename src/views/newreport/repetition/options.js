// 筛选条件
// 筛选类型 按什么查询
export const queryType = [
  {
    label: "按集团内分析",
    value: 1,
  },
  {
    label: "按部门内分析",
    value: 2,
  },
  {
    label: "按个人分析",
    value: 3,
  },
];

// 集团搜索下拉列表
export const cliqueOptions = [
  {
    label: "第一集团军",
    value: "1580402169644216321",
  },
  {
    label: "第二集团军",
    value: 200,
  },
];

// 部门下拉列表
export const deptOptions = [
  {
    value: "1590260880386723841",
    label: "精英队",
    parentId: "1580402169644216321",
  },
  {
    value: "1590260999391711234",
    label: "阳光队",
    parentId: "1580402169644216321",
  },
  {
    value: "1590261086473850881",
    label: "贰队",
    parentId: "1580402169644216321",
  },
  {
    value: "1590261583066861569",
    label: "政企服务部",
    parentId: "1580402169644216321",
  },
  {
    value: "1553247069968670721",
    label: "合众部",
    parentId: 200,
  },
  {
    value: "1553247344989184002",
    label: "勇者部",
    parentId: 200,
  },
  {
    value: "1553247256376123394",
    label: "先驱队",
    parentId: 200,
  },
  {
    value: "1579025726418886657",
    label: "营销中心",
    parentId: 200,
  },
  {
    value: "1553246996052451330",
    label: "数据运营部",
    parentId: 200,
  },
];

// 数据重复分布 (集团分析)
const repeatCom = [
  {
    label: "线索重复数量",
    prop: "repeatClueCount",
  },
  {
    label: "正在跟进重复线索数量",
    prop: "followUpRepeatClueCount",
  },
  {
    label: "商机重复数量",
    prop: "repeatOpportunityCount",
  },
  {
    label: "正在跟进商机重复数量",
    prop: "followUpRepeatOpportunityCount",
  },
  {
    label: "客户重复数量",
    prop: "customerRepeatCount",
  },
  {
    label: "正在跟进客户重复数量",
    prop: "followUpRepeatCustomerCount",
  },
];

export const pageOptions = {
  // 数据概览图
  summary: [
    {
      label: "线索数量",
      prop: "clueCount",
    },
    {
      label: "线索重复数量",
      prop: "repeatClueCount",
    },
    {
      label: "正在跟进线索数量",
      prop: "followUpClueCount",
    },
    {
      label: "正在跟进重复线索数量",
      prop: "followUpRepeatClueCount",
      width: 160,
    },
    {
      label: "商机数量",
      prop: "opportunityCount",
    },
    {
      label: "商机重复数量",
      prop: "repeatOpportunityCount",
    },
    {
      label: "正在跟进商机数量",
      prop: "followUpOpportunityCount",
    },
    {
      label: "正在跟进商机重复数量",
      prop: "followUpRepeatOpportunityCount",
      width: 160,
    },
    {
      label: "客户数量",
      prop: "customerCount",
    },
    {
      label: "客户重复数量",
      prop: "customerRepeatCount",
    },
    {
      label: "正在跟进客户数量",
      prop: "repeatCustomerCount",
    },
    {
      label: "正在跟进客户重复数量",
      prop: "followUpRepeatCustomerCount",
      width: 160,
    },
  ],
  // 数据重复 (集团分析)
  repetition: {
    dept2: [
      {
        label: "第二集团军",
        prop: "deptName",
      },
      ...repeatCom,
      {
        label: "操作",
        action: true,
        width: 80,
        //  hasPermi: []
        btns: [{ id: "repeat", type: "text", text: "钻取" }],
      },
    ],
    dept1: [
      {
        label: "第一集团军",
        prop: "deptName",
      },
      ...repeatCom,
      {
        label: "操作",
        action: true,
        width: 80,
        //  hasPermi: []
        btns: [{ id: "repeat", type: "text", text: "钻取" }],
      },
    ],

    dept: [
      {
        label: "部门人员",
        prop: "userName",
      },
      ...repeatCom,
    ],

    user: [
      {
        label: "对比维度",
        prop: "dimensionName",
      },
      {
        label: "与部门内重复数量",
        prop: "deptRepeat",
      },
      {
        label: "与部门内正在跟进重复数量",
        prop: "deptRepeatFollowUp",
      },
      {
        label: "与主体内重复数量",
        prop: "subjectRepeat",
      },
      {
        label: "与主体内正在跟进重复数量",
        prop: "subjectRepeatFollowUp",
      },
      {
        label: "与集团内重复数量",
        prop: "armyRepeat",
      },
      {
        label: "与集团内正在跟进重复数量",
        prop: "armyRepeatFollowUp",
      },
    ],
  },
  // 线索数据重复明细
  clue: [
    {
      label: "公司名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "跟进人员数量",
      prop: "followUpPersonCount",
    },
    {
      label: "第一集团军占比",
      prop: "firstArmyPercent",
    },
    {
      label: "第二集团军占比",
      prop: "secondArmyPercent",
    },
    {
      label: "操作",
      action: true,
      width: 80,
      //  hasPermi: []
      btns: [{ id: "clue", type: "text", text: "钻取" }],
    },
  ],
  // 客户数据重叠明细
  customer: [
    {
      label: "客户名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "客户总成交金额",
      prop: "price",
    },
    {
      label: "第一集团军占比",
      prop: "firstArmyPercent",
    },
    {
      label: "第二集团军占比",
      prop: "secondArmyPercent",
    },
    {
      label: "操作",
      action: true,
      width: 80,
      //  hasPermi: []
      btns: [{ id: "customer", type: "text", text: "钻取" }],
    },
  ],
  // 按企业重复明细
  opportunityCompany: [
    {
      label: "企业名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
    {
      label: "第一集团军占比",
      prop: "firstArmyPercent",
    },
    {
      label: "第二集团军占比",
      prop: "secondArmyPercent",
    },
    {
      label: "操作",
      action: true,
      width: 80,
      //  hasPermi: []
      btns: [{ id: "opportunityCompany", type: "text", text: "钻取" }],
    },
  ],
  // 按商机标题重复明细
  opportunityCustomer: [
    {
      label: "商机标题",
      prop: "title",
    },
    {
      label: "企业名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
    {
      label: "第一集团军占比",
      prop: "firstArmyPercent",
    },
    {
      label: "第二集团军占比",
      prop: "secondArmyPercent",
    },
    {
      label: "操作",
      action: true,
      width: 80,
      //  hasPermi: []
      btns: [{ id: "opportunityCustomer", type: "text", text: "钻取" }],
    },
  ],
};

// 按部门
export const deptPageOptions = {
  // 线索数据重复明细
  clue: [
    {
      label: "公司名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
  ],
  // 按商机标题重复明细
  opportunityCustomer: [
    {
      label: "商机标题",
      prop: "title",
    },
    {
      label: "企业名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
  ],
  // 按企业重复明细
  opportunityCompany: [
    {
      label: "企业名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
  ],
  // 客户数据重叠明细
  customer: [
    {
      label: "客户名称",
      prop: "companyName",
    },
    {
      label: "重复数量",
      prop: "repeatCount",
    },
    {
      label: "客户总成交金额",
      prop: "price",
    },
  ],
};

// 按用户

const userReCom = [
  {
    label: "与部门内重复数量",
    prop: "deptRepeat",
  },
  {
    label: "与部门内正在跟进重复数量",
    prop: "deptRepeatFollowUp",
  },
  {
    label: "与主体内重复数量",
    prop: "subjectRepeat",
  },
  {
    label: "与主体内正在跟进重复数量",
    prop: "subjectRepeatFollowUp",
  },
  {
    label: "与集团内重复数量",
    prop: "armyRepeat",
  },
  {
    label: "与集团内正在跟进重复数量",
    prop: "armyRepeatFollowUp",
  },
];
export const userPageOptions = {
  // 线索数据重复明细
  clue: [
    {
      label: "公司名称",
      prop: "companyName",
    },
    ...userReCom,
  ],
  // 按商机标题重复明细
  opportunityCustomer: [
    {
      label: "商机标题",
      prop: "title",
    },
    {
      label: "企业名称",
      prop: "companyName",
    },

    {
      label: "预估重复金额",
      prop: "price",
    },
    ...userReCom,
  ],
  // 按企业重复明细
  opportunityCompany: [
    {
      label: "企业名称",
      prop: "companyName",
    },

    {
      label: "预估重复金额",
      prop: "price",
    },
    ...userReCom,
  ],
  // 客户数据重叠明细
  customer: [
    {
      label: "企业名称",
      prop: "companyName",
    },

    {
      label: "客户总成交金额",
      prop: "price",
    },
    ...userReCom,
  ],
};

export const repeatDetail = {
  clue: [
    {
      label: "公司名称",
      prop: "companyName",
    },
    {
      label: "主体",
      prop: "subjectDeptName",
    },
    {
      label: "部门",
      prop: "deptName",
    },
    {
      label: "跟进人员",
      prop: "userName",
    },
    {
      label: "线索录入时间",
      prop: "createTime",
    },
    {
      label: "最后跟进时间",
      prop: "lastFollowUpTime",
    },
  ],
  customer: [
    {
      label: "客户名称",
      prop: "companyName",
    },
    {
      label: "主体",
      prop: "subjectDeptName",
    },
    {
      label: "部门",
      prop: "deptName",
    },
    {
      label: "客户成交金额",
      prop: "price",
    },
    {
      label: "跟进人员",
      prop: "userName",
    },
    {
      label: "转为客户时间",
      prop: "turnCustomerTime",
    },
    {
      label: "最后客户跟进时间",
      prop: "lastFollowUpTime",
    },
  ],
  opportunityCompany: [
    {
      label: "客户名称",
      prop: "companyName",
    },
    {
      label: "主体",
      prop: "subjectDeptName",
    },
    {
      label: "部门",
      prop: "deptName",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
    {
      label: "跟进人员",
      prop: "userName",
    },
    {
      label: "转为客户时间",
      prop: "turnCustomerTime",
    },
    {
      label: "最后客户跟进时间",
      prop: "lastFollowUpTime",
    },
  ],
  opportunityCustomer: [
    {
      label: "商机标题",
      prop: "title",
    },
    {
      label: "企业名称",
      prop: "companyName",
    },
    {
      label: "主体",
      prop: "subjectDeptName",
    },
    {
      label: "部门",
      prop: "deptName",
    },
    {
      label: "预估重复金额",
      prop: "price",
    },
    {
      label: "跟进人员",
      prop: "userName",
    },
    {
      label: "转为商机时间",
      prop: "createTime",
    },
    {
      label: "最后商机跟进时间",
      prop: "lastFollowUpTime",
    },
  ],
};

// 重复数据钻取页
const commonOptions = [
  {
    label: "企业名称",
    prop: "companyName",
  },
  {
    label: "重复数量",
    prop: "repeatCount",
  },
];

// 钻取重复页
export const repeatPages = {
  clue: [...commonOptions],
  opportunity: [
    ...commonOptions,
    {
      label: "预估成交金额",
      prop: "price",
    },
  ],
  customer: [
    ...commonOptions,
    {
      label: "客户总成交金额",
      prop: "price",
    },
  ],
};
