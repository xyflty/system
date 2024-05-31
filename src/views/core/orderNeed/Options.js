import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

export const Options = [
  {
    label: "市场人员",
    prop: "userName",
    width: 120,
  },
  {
    label: "下单日期",
    prop: "orderDay",
    width: 160,
  },

  {
    label: "资质专业",
    prop: "professionalQualifications",
    width: 120,
  },
  {
    label: "市（区）",
    prop: "urbanRea",
    width: 120,
  },
  {
    label: "类型",
    prop: "type",
    width: 120,
    formatter: (row, column, val) => {
      return formatterCallback(commonData.orderNeedType, val);
    },
  },
  {
    label: "是否带安证",
    prop: "isfSecurityErtificate",
    width: 120,
    formatter: (row, column, val) => {
      return ["否", "是"][val];
    },
  },
  {
    label: "初步报价（万）",
    prop: "offer",
    width: 120,
  },
  {
    label: "客户预算",
    prop: "customerBudget",
    width: 120,
  },
  {
    label: "客户特别要求备注",
    prop: "customerRemark",
    width: 180,
  },
  {
    label: "货源匹配人",
    prop: "sourceMatchingUserName",
    width: 120,
  },
  {
    label: "渠道反馈日期",
    prop: "channelFeedbackDate",
    width: 160,
  },
  {
    label: "货源情况说明",
    prop: "sourceInformation",
    width: 180,
  },
  {
    label: "市场需反馈时间",
    prop: "marketYesFeedbackDate",
    width: 160,
  },
  {
    label: "市场最终结果反馈日期",
    prop: "marketFinallyResultFeedbackDate",
    width: 160,
  },
  {
    label: "客户意向度",
    prop: "customerIntent",
    width: 100,
  },
  {
    label: "预计签约日期",
    prop: "expectedDateOfSigning",
    width: 160,
  },
  {
    label: "是否成交",
    prop: "isfDeal",
    width: 100,
    formatter: (row, column, val) => {
      return ["否", "是"][val];
    },
  },
  {
    label: "操作",
    action: true,
    width: 120,
    fixed: "right",
    btns: [
      {
        id: "edit",
        type: "text",
        text: "修改",
        hasPermi: ["core:sourceMatching:editMarkets"],
      },
      {
        id: "channel",
        type: "text",
        text: "反馈",
        hasPermi: ["core:sourceMatching:editChannel"],
      },
    ],
  },
];

export const channel = [
  {
    label: "货源匹配人",
    prop: "sourceMatchingUserId",
    type: "select",
    value: "",
    filterable: true,
    props: {
      label: "userName",
      value: "userId",
    },
    dicData: commonData.needUserList,
    labelWidth: 160,
    row: true,
    rules: [
      {
        required: true,
        message: "请选择货源匹配人",
        trigger: "change",
      },
    ],
  },
  {
    label: "渠道反馈日期",
    type: "date",
    prop: "channelFeedbackDate",
    format: "yyyy-MM-dd",
    valueFormat: "yyyy-MM-dd",
    row: true,
    labelWidth: 160,
    rules: [
      {
        required: true,
        message: "请选择渠道反馈日期",
        trigger: "change",
      },
    ],
  },
  {
    label: "货源情况说明",
    prop: "sourceInformation",
    type: "textarea",
    value: "",
    minRows: 3,
    maxRows: 5,
    row: true,
    labelWidth: 160,
  },
  {
    label: "市场需反馈时间",
    type: "date",
    prop: "marketYesFeedbackDate",
    format: "yyyy-MM-dd",
    valueFormat: "yyyy-MM-dd",
    row: true,
    labelWidth: 160,
    rules: [
      {
        required: true,
        message: "请选择市场需反馈时间",
        trigger: "change",
      },
    ],
  },
  {
    label: "市场最终结果反馈日期",
    type: "date",
    prop: "marketFinallyResultFeedbackDate",
    format: "yyyy-MM-dd",
    valueFormat: "yyyy-MM-dd",
    row: true,
    labelWidth: 160,
  },
];
// 市场
export const bazaar = [
  {
    label: "资质专业",
    prop: "professionalQualifications",
    value: "",
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请输入资质专业",
        trigger: "blur",
      },
    ],
  },
  {
    label: "资质类型",
    prop: "type",
    type: "select",
    dicData: commonData.orderNeedType,
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请选择资质类型",
        trigger: "change",
      },
    ],
  },
  {
    label: "市（区）",
    prop: "urbanRea",
    value: "",
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请填写市（区）",
        trigger: "blur",
      },
    ],
  },
  {
    label: "是否带安证",
    prop: "isfSecurityErtificate",
    type: "select",
    value: "",
    filterable: true,
    dicData: [
      { label: "否", value: 0 },
      { label: "是", value: 1 },
    ],
    labelWidth: 150,
    row: true,
    rules: [
      {
        required: true,
        message: "请选择是否带安证",
        trigger: "change",
      },
    ],
  },
  {
    label: "下单日期",
    type: "date",
    prop: "orderDay",
    format: "yyyy-MM-dd",
    valueFormat: "yyyy-MM-dd",
    pickerOptions: {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            picker.$emit("pick", new Date());
          },
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit("pick", date);
          },
        },
        {
          text: "一周前",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", date);
          },
        },
      ],
    },
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请选择下单日期",
        trigger: "change",
      },
    ],
  },
  {
    label: "初步报价",
    prop: "offer",
    value: "",
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请填写初步报价",
        trigger: "blur",
      },
    ],
  },
  {
    label: "客户预算",
    prop: "customerBudget",
    value: "",
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请填写客户预算",
        trigger: "blur",
      },
    ],
  },
  {
    label: "客户特别要求备注",
    prop: "customerRemark",
    type: "textarea",
    value: "",
    minRows: 3,
    maxRows: 5,
    row: true,
    labelWidth: 150,
  },
  {
    label: "客户意向度",
    prop: "customerIntent",
    type: "select",
    filterable: true,
    dicData: [
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },
      { label: "D", value: "D" },
    ],
    labelWidth: 150,
    row: true,
    rules: [
      {
        required: true,
        message: "请选择客户意向度",
        trigger: "change",
      },
    ],
  },
  {
    label: "预计签约日期",
    type: "date",
    prop: "expectedDateOfSigning",
    format: "yyyy-MM-dd",
    valueFormat: "yyyy-MM-dd",
    row: true,
    labelWidth: 150,
    rules: [
      {
        required: true,
        message: "请选择预计签约日期",
        trigger: "change",
      },
    ],
  },
  {
    label: "是否成交",
    prop: "isfDeal",
    type: "select",
    filterable: true,
    dicData: [
      { label: "否", value: 0 },
      { label: "是", value: 1 },
    ],
    labelWidth: 150,
    row: true,
    rules: [
      {
        required: true,
        message: "请选择是否成交",
        trigger: "change",
      },
    ],
  },
];

export const search = {
  size: "mini",
  menuSpan: 3,
  submitText: "查询",
  emptyText: "重置",
  filterNull: true,
  filterDic: true,
  column: [
    {
      label: "搜索关键字",
      prop: "searchValue",

      span: 4,
    },
    {
      label: "市场人员",
      prop: "userId",
      type: "select",

      filterable: true,
      dicData: commonData.userList,
      span: 4,
    },
    {
      label: "资质类型",
      prop: "type",
      type: "select",
      filterable: true,
      dicData: commonData.orderNeedType,
      span: 4,
    },
    {
      label: "下单时间",
      type: "datetimerange",
      prop: "orderDay",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      span: 6,
    },
    {
      label: "渠道反馈日期",
      type: "datetimerange",
      prop: "channelFeedbackDate",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      labelWidth: 150,
      span: 6,
    },
    {
      label: "市场最终结果反馈日期",
      type: "datetimerange",
      prop: "marketFinallyResultFeedbackDate",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      labelWidth: 160,
      span: 6,
    },
    {
      label: "市场反馈时间",
      type: "datetimerange",
      prop: "marketYesFeedbackDate",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
      labelWidth: 150,
      span: 6,
    },
    {
      label: "是否带安证",
      prop: "isfSecurityErtificate",
      type: "select",
      filterable: true,
      dicData: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      labelWidth: 100,
      span: 4,
    },
    {
      prop: "isfSource",
      type: "radio",

      dicData: [
        {
          label: "未进行货源匹配",
          value: true,
        },
      ],
      labelWidth: 20,
      span: 2,
    },
    {
      prop: "isfMe",
      type: "radio",

      dicData: [
        {
          label: "我提交的",
          value: true,
        },
      ],
      labelWidth: 20,
      span: 2,
    },
  ],
};

export const addFormOptions = {};
