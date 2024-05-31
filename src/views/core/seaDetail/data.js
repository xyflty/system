import { formatDate_1 } from "@/utils";

export default {
  commonResourceSeaVo: [
    {
      name: "资源名称",
      key: "companyName",
      value: "",
    },
    {
      name: "联系人",
      key: "contactName",
      value: "",
    },
    {
      name: "联系方式",
      key: "cellphone",
      value: "",
    },
    {
      name: "数据来源",
      key: "dataSource",
      value: "",
    },
    // {
    //   name: "所在地区",
    //   key: "province",
    //   value: "",
    // },
  ],
  clueSeaVo: [
    {
      name: "线索名称",
      key: "companyName",
      value: "",
    },
    // {
    //   name: "联系人",
    //   key: "contactName",
    //   value: "",
    // },
    // {
    //   name: "联系方式",
    //   key: "cellphone",
    //   value: "",
    // },
    {
      name: "数据来源",
      key: "dataSource",
      value: "",
    },
    // {
    //   name: "线索最后状态",
    //   key: "status",
    //   value: "",
    // },
    {
      name: "线索地区",
      key: "province",
      value: "",
    },
    {
      name: "首次领取人",
      key: "firstReceivePerson",
      value: "",
    },
    {
      name: "最后领取人",
      key: "lastReceivePerson",
      value: "",
    },
    {
      name: "最后跟进时间",
      key: "lastFollowUpTime",
      value: "",
    },
    {
      name: "未跟进天数",
      key: "unFollowUpDays",
      value: "",
    },
  ],

  customerSeaVo: [
    {
      name: "客户名称",
      key: "companyName",
      value: "",
    },
    {
      name: "联系人",
      key: "contactName",
      value: "",
    },
    {
      name: "联系方式",
      key: "cellphone",
      value: "",
    },
    {
      name: "客户来源",
      key: "dataSource",
      value: "",
    },
    {
      name: "客户最后状态",
      key: "status",
      value: "",
    },
    {
      name: "客户地区",
      key: "province",
      value: "",
    },
    {
      name: "首次成交人",
      key: "firstDealPerson",
      value: "",
    },
    {
      name: "最后成交人",
      key: "lastDealPerson",
      value: "",
    },
    {
      name: "最后跟进时间",
      key: "lastFollowUpTime",
      value: "",
    },
    {
      name: "未跟进天数",
      key: "unFollowUpDays",
      value: "",
    },
  ],
  tabsList: [
    {
      label: "概况信息",

      key: "BaseInfo",
    },
    {
      label: "跟进记录",

      key: "FollowUpRecord",
    },
    {
      label: "订单记录",

      key: "OrderRecord",
    },
    {
      label: "客户转介绍",

      key: "CustomerReferral",
    },
  ],

  // 三库
  threeLibrarySeaVo: [
    {
      name: "资源名称",
      key: "companyName",
      value: "",
    },
    {
      name: "所在地区",
      key: "city",
      value: "",
    },
    {
      name: "首次领取人",
      key: "firstReceivePerson",
      value: "",
    },
    {
      name: "最后领取人",
      key: "lastReceivePerson",
      value: "",
    },
  ],

  inspectSeaVo: [
    {
      name: "资源名称",
      key: "companyName",
      value: "",
    },
    {
      name: "安证编号",
      key: "safetyNum",
      value: "",
    },
    {
      name: "核查情况",
      key: "situation",
      value: "",
    },

    {
      name: "首次领取人",
      key: "firstReceivePerson",
      value: "",
    },
    {
      name: "最后领取人",
      key: "lastReceivePerson",
      value: "",
    },
    {
      name: "备注",
      key: "remark",
      value: "",
    },
  ],

  // 三库资质表格配置
  threeLibraryOption: [
    {
      label: "证书编号",
      prop: "aptCertNum",

      width: 120,
    },
    {
      label: "证书类别",
      prop: "certType",

      width: 100,
    },
    {
      label: "资质(备案)等级",
      prop: "quaLevel",
    },
    {
      label: "发证机关",
      prop: "aptIssueOrg",

      width: 180,
    },
    {
      label: "发证日期",
      prop: "aptIssueDate",
      formatter: (val, value, label) => {
        return formatDate_1(val.aptIssueDate);
      },
      width: 180,
    },
    {
      label: "证书有效期",
      prop: "aptExpireDate",
      formatter: (val, value, label) => {
        return formatDate_1(val.aptExpireDate);
      },

      width: 180,
    },
    // {
    //   label: "证书状态",
    //   prop: "aptStatus",

    //   width: 120,
    // },
  ],
  threeAzOption: [
    {
      label: "证书编码",
      prop: "certNum",
    },
    {
      label: "安证发证机关",
      prop: "issueOrg",
    },
    {
      label: "发证日期",
      prop: "issueDate",
      formatter: (val, value, label) => {
        return formatDate_1(val.issueDate);
      },
    },
    {
      label: "安证有效期",
      prop: "expireDate",
      formatter: (val, value, label) => {
        return formatDate_1(val.expireDate);
      },
    },
    // {
    //   label: "证书状态",
    //   prop: "status",
    // },
  ],
};
