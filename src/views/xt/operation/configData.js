// import { formatterCallback } from "@/utils/common";
// import store from "@/store/index.js";
// let commonData = store.state.commonData.commonData;
import commonObj from "@/mixins/configData/commonOption.js";
export const configData = {
  base: {
    safety: {
      comparison: [
        ...commonObj,

        {
          prop: "safetyCertificateCategory",
          label: "安证类别：",
        },
        {
          prop: "handlingLevel",
          label: "办理级别：",
        },
        {
          prop: "handlingArea",
          label: "安证办理地区：",
        },
        {
          prop: "customersLocation",
          label: "客户所在地：",
        },
        {
          prop: "isProcessingQualifications",
          label: "是否办理资质：",
        },
        {
          prop: "consultantUserId",
          label: "资质资料顾问：",
        },
        {
          prop: "isTunePersonnel",
          label: "是否调人员：",
        },
        {
          prop: "tunePersonnelNumber",
          label: "调人员数量：",
        },
        {
          prop: "isSocialSecurity",
          label: "人员是否购买社保：",
        },
        {
          prop: "socialSecurityMonth",
          label: "人员社保购买月份：",
        },
        {
          prop: "isSignUp",
          label: "是否需要代报名：",
        },
        {
          prop: "paymentStatus",
          label: "人员费用收款情况：",
        },
        // {
        //   prop: "personnelMatchStatus",
        //   label: "人员匹配状态：",
        // },
        {
          prop: "safetyManagementRegistration",
          label: "安管报名：",
        },
        {
          prop: "isHandlingPhotos",
          label: "是否处理照片：",
        },
        {
          prop: "isHandlingInvoice",
          label: "是否处理发票：",
        },
        {
          prop: "invoiceProcessingCharges",
          label: "发票处理收费情况：",
        },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
        },
      ],
    },
    certification: {
      comparison: [
        ...commonObj,

        {
          prop: "isTunePersonnel",
          label: "是否调人员：",
        },
        {
          prop: "isSocialSecurity",
          label: "人员是否购买社保：",
        },
        {
          prop: "isSecurityCertificate",
          label: "是否同时办理安证：",
        },
        {
          prop: "isHandlingPhotos",
          label: "是否处理照片：",
        },
        {
          prop: "isHandlingInvoice",
          label: "是否处理发票：",
        },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
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
        //   prop: "isHandlingInvoice",
        //   label: "是否处理发票：",
        // },
        // {
        //   prop: "isHandlingPhotos",
        //   label: "是否处理照片：",
        // },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        // {
        //   prop: "invoiceProcessingCharges",
        //   label: "发票处理收费情况：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
        },
      ],
    },
    certificate: {
      comparison: [
        ...commonObj,
        {
          prop: "isHandlingPhotos",
          label: "是否处理照片：",
        },
        {
          prop: "isHandlingInvoice",
          label: "是否处理发票：",
        },
        {
          prop: "invoiceProcessingCharges",
          label: "发票处理收费情况：",
        },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
        },
      ],
    },
    ICBC: {
      comparison: [
        ...commonObj,
        {
          prop: "isHandlingPhotos",
          label: "是否处理照片：",
        },
        {
          prop: "isHandlingInvoice",
          label: "是否处理发票：",
        },
        {
          prop: "invoiceProcessingCharges",
          label: "发票处理收费情况：",
        },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
        },
      ],
    },
    property: {
      comparison: [
        ...commonObj,

        {
          prop: "isHandlingPhotos",
          label: "是否处理照片：",
        },
        {
          prop: "isHandlingInvoice",
          label: "是否处理发票：",
        },
        {
          prop: "invoiceProcessingCharges",
          label: "发票处理收费情况：",
        },
        // {
        //   prop: "isSignedContract",
        //   label: "是否已签合同：",
        // },
        {
          prop: "isAgencyFee",
          label: "是否有居间费：",
        },
      ],
    },
  },
  attachment: {},
};
