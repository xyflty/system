import { formatterCallback } from "@/utils/common";
// 配置分类下的主要信息
export const processingData = {
  safety: {
    processing: {
      title: "安证服务主要信息",
      comparison: [
        {
          label: "服务顾问(制)：",
          prop: "makeUserName",
        },
        {
          label: "服务顾问(审)：",
          prop: "auditUserName",
        },
        {
          label: "申报日期：",
          prop: "declareTime",
        },
        {
          label: "申报流水号：",
          prop: "declareCode",
        },
        {
          label: "受理日期：",
          prop: "acceptTime",
        },
        {
          label: "办理结果：",
          prop: "handleResult",
        },
        {
          label: "通过时间：",
          prop: "passTime",
        },
        {
          label: "资质：",
          prop: "qualification",
        },
        {
          label: "社保情况：",
          prop: "socialSecuritySituation",
        },
        {
          label: "不予原因：",
          prop: "refuseReason",
        },
        {
          label: "二次：",
          prop: "twice",
        },
        {
          label: "渠道：",
          prop: "channel",
        },
      ],
    },
  },
  certification: {
    processing: {
      // 新项
      add: {
        title: "资质服务主要信息",
        comparison: [
          {
            label: "服务顾问(制)：",
            prop: "makeUserName",
          },
          {
            label: "服务顾问(审)：",
            prop: "auditUserName",
          },
          {
            label: "预计可申报时间：",
            prop: "anticipateCanDeclareTime",
          },
          {
            label: "申报日期：",
            prop: "declareTime",
          },
          {
            label: "公示是否同意：",
            prop: "isPublicAgree",
            formatter: (val) => {
              return ["同意", "不同意"][val];
            },
          },
          {
            label: "公示未通过原因：",
            prop: "publicFailCause",
          },
          {
            label: "是否证件打印：",
            prop: "isCertificatePrint",
            formatter: (val) => {
              return ["是", "否"][val];
            },
          },
          {
            label: "打证时间：",
            prop: "certificatePrintTime",
          },
        ],
      },
      // 整转
      full: {
        title: "资质作业主要信息",
        comparison: [
          {
            label: "服务顾问(制)：",
            prop: "makeUserName",
          },
          {
            label: "服务顾问(审)：",
            prop: "auditUserName",
          },
          {
            label: "资质上报：",
            prop: "qualificationReport",
          },
          {
            label: "上报时间：",
            prop: "reportTime",
          },
          // {
          //   label: "注销旧证：",
          //   prop: "cancellationOldCertificate",
          // },
          // {
          //   label: "领取新证：",
          //   prop: "receiveNewCertificate",
          // },
          {
            label: "资质变更：",
            prop: "qualificationChange",
          },
        ],
      },
      // 分立
      part: {
        title: "资质作业主要信息",
        comparison: [
          {
            label: "服务顾问(制)：",
            prop: "makeUserName",
          },
          {
            label: "服务顾问(审)：",
            prop: "auditUserName",
          },
          {
            label: "资质上报：",
            prop: "qualificationReport",
          },
          {
            label: "上报时间：",
            prop: "reportTime",
          },
          // {
          //   label: "注销旧证：",
          //   prop: "cancellationOldCertificate",
          // },
          // {
          //   label: "领取新证：",
          //   prop: "receiveNewCertificate",
          // },
        ],
      },
    },
  },
  talents: {
    processing: {
      title: "人才服务主要信息",
      comparison: [
        {
          label: "服务顾问(制)：",
          prop: "makeUserName",
        },
        {
          label: "服务顾问(审)：",
          prop: "auditUserName",
        },
        {
          label: "人才匹配：",
          prop: "talentMatch",
        },
        {
          label: "人员匹配状态：",
          prop: "personnelMatchStatus",
        },
      ],
    },
  },
  certificate: {
    processing: {
      title: "证书服务主要信息",
      comparison: [
        {
          label: "教务顾问：",
          prop: "academicAdvisor",
        },
      ],
    },
  },
  ICBC: {
    processing: {
      title: "工商服务主要信息",
      comparison: [
        {
          label: "服务顾问：",
          prop: "makeUserName",
        },
        {
          label: "法人、股权变更：",
          prop: "legalPersonChange",
        },
        {
          label: "清税流程：",
          prop: "clearTaxProcess",
        },
        {
          label: "地址变更：",
          prop: "addressChange",
        },
      ],
    },
  },
  property: {
    processing: {
      title: "知识产权服务主要信息",
      comparison: [
        {
          label: "教务顾问：",
          prop: "academicAdvisor",
        },
      ],
    },
  },
};

export const replenishProps = [
  {
    type: "date-picker",
    label: "申报日期：",
    prop: "declareTime",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  {
    type: "input",
    label: "申报流水号：",
    prop: "declareCode",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "date-picker",
    label: "受理日期：",
    prop: "acceptTime",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  {
    type: "input",
    label: "办理结果：",
    prop: "handleResult",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "date-picker",
    label: "通过时间：",
    prop: "passTime",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  {
    type: "input",
    label: "资质：",
    prop: "qualification",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "社保情况：",
    prop: "socialSecuritySituation",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "不予原因：",
    prop: "refuseReason",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "二次：",
    prop: "twice",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "渠道：",
    prop: "channel",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "date-picker",
    label: "预计可申报时间：",
    prop: "anticipateCanDeclareTime",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  {
    type: "select",
    label: "公示是否同意：",
    prop: "isPublicAgree",
    children: [
      { label: "同意", value: 0 },
      { label: "不同意", value: 1 },
    ],
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "公示未通过原因：",
    prop: "publicFailCause",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "select",
    label: "是否证件打印：",
    prop: "isCertificatePrint",
    children: [
      { label: "是", value: 0 },
      { label: "否", value: 1 },
    ],
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "date-picker",
    label: "打证时间：",
    prop: "certificatePrintTime",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  {
    type: "select",
    placeholder: "请填写",
    label: "资质上报：",
    prop: "qualificationReport",

    children: [
      {
        type: "option",
        label: "待上报",
        value: "待上报",
      },
      {
        type: "option",
        label: "已上报",
        value: "已上报",
      },
      {
        type: "option",
        label: "公示",
        value: "公示",
      },
      {
        type: "option",
        label: "发证",
        value: "发证",
      },
    ],
    attrs: {
      style: "width:100%",
    },
  },
  {
    label: "上报时间：",
    prop: "reportTime",
    type: "date-picker",
    placeholder: "选择日期时间",
    attrs: {
      style: "width:100%",
      type: "datetime",
      valueFormat: "yyyy-MM-dd hh:mm:ss",
      format: "yyyy-MM-dd hh:mm:ss",
    },
  },
  // {
  //   type: "input",
  //   placeholder: "请填写",
  //   label: "注销旧证：",
  //   prop: "cancellationOldCertificate",
  //   attrs: {
  //     style: "width:100%",
  //   },
  // },
  // {
  //   type: "input",
  //   placeholder: "请填写",
  //   label: "领取新证：",
  //   prop: "receiveNewCertificate",
  //   attrs: {
  //     style: "width:100%",
  //   },
  // },
  {
    type: "input",
    placeholder: "请填写",
    label: "资质变更：",
    prop: "qualificationChange",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    placeholder: "请填写",
    label: "教务顾问：",
    prop: "academicAdvisor",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    placeholder: "请填写",
    label: "法人、股权变更：",
    prop: "legalPersonChange",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    placeholder: "请填写",
    label: "清税流程：",
    prop: "clearTaxProcess",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    placeholder: "请填写",
    label: "地址变更：",
    prop: "addressChange",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "input",
    label: "人才匹配：",
    prop: "talentMatch",
    placeholder: "请填写",
    attrs: {
      style: "width:100%",
    },
  },
  {
    type: "select",
    label: "人员匹配状态：",
    prop: "personnelMatchStatus",
    placeholder: "请填写",
    children: [
      { label: "已配", value: "已配" },
      { label: "已买保险", value: "已买保险" },
      { label: "已建立调动", value: "已建立调动" },
      { label: "已完成", value: "已完成" },
    ],
    attrs: {
      style: "width:100%",
    },
  },
];
