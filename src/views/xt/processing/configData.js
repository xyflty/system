// import { formatterCallback } from "@/utils/common";
// import store from "@/store/index.js";
// let commonData = store.state.commonData.commonData;

import commonObj from "@/mixins/configData/commonOption.js";

// const commonObj = [
//   {
//     label: "工单编号：",
//     prop: "orderJobCode",
//   },
//   {
//     label: "订单编号：",
//     prop: "orderCode", //1
//   },
//   {
//     label: "合同编号：",
//     prop: "contractCode",
//   },
//   {
//     label: "订单名称：",
//     prop: "title", //
//   },
//   {
//     label: "订单类型：",
//     prop: "orderType", //
//     formatter: (val) => {
//       return formatterCallback(commonData.xtOrderType, val);
//     },
//   },

//   {
//     label: "签约时间：",
//     prop: "signTime", //
//   },
//   {
//     label: "订单签约主体：",
//     prop: "subjectDeptName", //
//   },
//   {
//     label: "订单所属部门：",

//     prop: "ascriptionDeptName", //
//   },
//   {
//     label: "订单所属人：",

//     prop: "launchUserName", //
//   },
//   {
//     label: "订单转化人员：",

//     prop: "transUserName", //
//   },
//   {
//     label: "经办部门：",
//     prop: "handleDeptName",
//   },
//   {
//     label: "经办人员：",
//     options: [], //遍历系统所有人员呈现
//     prop: "handleUserName", //
//   },
//   {
//     label: "客户名称：",
//     prop: "companyName", //1
//   },
//   {
//     label: "客户联系人：",
//     prop: "contactName",
//   },
//   {
//     label: "客户性质：",
//     prop: "customerType",
//     formatter: (val) => {
//       return ["企业", "个人"][val];
//     },
//   },
//   {
//     label: "承诺完成时间：",
//     prop: "promiseTime", //1
//   },
//   {
//     label: "紧急程度：",
//     prop: "emergencyStatus", //1
//     formatter: (val) => {
//       return formatterCallback(commonData.emergencyStatus, val);
//     },
//   },
//   {
//     label: "订单创建人员：",
//     prop: "createBy", //
//   },
//   {
//     label: "订单创建时间：",
//     prop: "createTime", //
//   },
//   {
//     label: "工单提交时间：",
//     prop: "createTime", //
//   },
//   {
//     label: "工单提交人：",
//     prop: "orderJobInitiator",
//   },
// ];

export const configData = {
  base: {
    safety: {
      comparison: [
        ...commonObj,
        {
          label: "安证类别：",
          prop: "safetyCertificateCategory",
        },
        {
          label: "办理级别：",
          prop: "handlingLevel",
        },
        {
          label: "安证办理地区：",
          prop: "handlingArea",
        },
        {
          label: "客户所在地：",
          prop: "customersLocation",
        },
        {
          label: "是否办理资质：",
          prop: "isProcessingQualifications",
        },
        {
          label: "资质服务顾问：",
          prop: "consultantUserId",
        },
        {
          label: "是否调人员：",
          prop: "isTunePersonnel",
        },
        {
          label: "调人员数量：",
          prop: "tunePersonnelNumber",
        },
        {
          label: "人员是否购买社保：",
          prop: "isSocialSecurity",
        },
        {
          label: "人才社保购买月份：",
          prop: "socialSecurityMonth",
        },
        {
          label: "人才费用收款情况：",
          prop: "paymentStatus",
        },
        {
          label: "安管报名：",
          prop: "safetyManagementRegistration",
        },
        {
          label: "是否处理照片：",
          prop: "isHandlingPhotos",
        },
        {
          label: "是否处理发票：",
          prop: "isHandlingInvoice",
        },
        {
          label: "发票处理收费情况：",
          prop: "invoiceProcessingCharges",
        },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
      ],
    },
    certification: {
      comparison: [
        ...commonObj,
        {
          label: "是否调人员：",
          prop: "isTunePersonnel",
        },
        {
          label: "人员是否购买社保：",
          prop: "isSocialSecurity",
        },
        {
          prop: "isSecurityCertificate",
          label: "是否同时办理安证：",
        },
        {
          label: "是否处理照片：",
          prop: "isHandlingPhotos",
        },
        {
          label: "是否处理发票：",
          prop: "isHandlingInvoice",
        },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
        {
          prop: "isSwitchInvoice",
          label: "是否需要开票：",
        },
        {
          prop: "businessChangeDockingPersonnel",
          label: "工商变更对接人员：",
        },

        {
          prop: "projectNature",
          label: "项目性质：",
        },
      ],
    },
    talents: {
      comparison: [
        ...commonObj,
        {
          prop: "handlingQualificationsCategory",

          label: "办理资质类别：",
        },
        {
          prop: "isHandlingSafetyCertificate",
          label: "安证资料否我司办理：",
        },
        {
          prop: "typeOfTalentOrder",
          label: "人才订单类型：",
        },
        {
          prop: "talentUseNature",
          label: "人才使用性质：",
        },
        {
          prop: "socialSecurityMonth",
          label: "社保购买几月份：",
        },
        {
          prop: "demandEngineerTotal",

          label: "需求工程师总数：",
        },
        {
          prop: "demandArchitectTotal",

          label: "需求建造师总数：",
        },
        {
          prop: "declareYourLocation",
          label: "申报所在地区：",
        },
        // {
        //   label: "是否处理发票：",
        //   prop: "isHandlingInvoice",
        // },
        // {
        //   label: "是否处理照片：",
        //   prop: "isHandlingPhotos",
        // },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        // {
        //   label: "发票处理收费情况：",
        //   prop: "invoiceProcessingCharges",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
      ],
    },
    // 证书
    certificate: {
      comparison: [
        ...commonObj,
        // 不同
        {
          label: "是否处理照片：",
          prop: "isHandlingPhotos",
        },
        {
          label: "是否处理发票：",
          prop: "isHandlingInvoice",
        },
        {
          label: "发票处理收费情况：",
          prop: "invoiceProcessingCharges",
        },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
      ],
    },
    // 工商
    ICBC: {
      comparison: [
        ...commonObj,
        // 不同
        {
          label: "是否处理照片：",
          prop: "isHandlingPhotos",
        },
        {
          label: "是否处理发票：",
          prop: "isHandlingInvoice",
        },
        {
          label: "发票处理收费情况：",
          prop: "invoiceProcessingCharges",
        },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
      ],
    },
    // 知识产权
    property: {
      comparison: [
        ...commonObj,
        // 不同
        {
          label: "是否处理照片：",
          prop: "isHandlingPhotos",
        },
        {
          label: "是否处理发票：",
          prop: "isHandlingInvoice",
        },
        {
          label: "发票处理收费情况：",
          prop: "invoiceProcessingCharges",
        },
        // {
        //   label: "是否已签合同：",
        //   prop: "isSignedContract",
        // },
        {
          label: "是否有居间费：",
          prop: "isAgencyFee",
        },
      ],
    },
  },
  attachment: {},
};
