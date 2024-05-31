// 协同处理工单详情配置数据
import { area } from "@/utils/area";
import { formatterCallback } from "@/utils/common";
import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

export const configData = {
  // 基础
  base: {
    comparison: [
      {
        label: "订单编号：",
        prop: "orderCode",
      },
      {
        label: "合同编号：",
        prop: "contractCode",
      },
      {
        label: "订单名称：",
        prop: "title",
      },
      {
        label: "订单类型：",
        prop: "orderType",
        formatter: (val) => {
          return formatterCallback(commonData.xtOrderType, val);
        },
      },
      //
      {
        label: "签约时间：",
        prop: "signTime",
      },
      {
        prop: "isSignedContract",
        label: "是否已签合同：",
      },
      {
        label: "订单签约主体：",
        prop: "subjectDeptName",
      },
      {
        label: "订单所属部门：",

        prop: "ascriptionDeptName",
      },
      {
        label: "订单所属人：",

        prop: "launchUserName",
      },
      {
        label: "订单转化人员：", //默认同步为订单所属人

        prop: "transUserName",
      },
      {
        label: "经办部门：",
        prop: "handleDeptName",
      },
      {
        label: "经办人员：",
        options: [], //遍历系统所有人员呈现
        prop: "handleUserName",
      },
      {
        label: "客户名称：",
        prop: "companyName", //1
      },
      {
        label: "客户类型：",
        prop: "customerType",
        formatter: (val) => {
          return ["企业客户", "个人客户"][val];
        },
      },
      {
        label: "订单状态：",
        prop: "orderStatus",
        formatter: (val) => {
          return formatterCallback(commonData.orderStatusList, val);
        },
      },
      {
        label: "订单总金额：",
        prop: "price",
      },
      {
        label: "订单创建人员：",
        prop: "createBy",
      },
      {
        label: "订单创建时间：",
        prop: "createTime",
      },
    ],
  },
  //   安证
  safety: {
    comparison: [
      {
        prop: "emergencyStatus",
        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
      },
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
        options: area.filter((item) => item.value == "44"),
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
  //   资质
  certification: {
    comparison: [
      {
        prop: "qualificationsHandlingArea",
        label: "资质办理地区：",
      },
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
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
        prop: "emergencyStatus",
        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "projectNature",
        label: "项目性质：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
      },
    ],
  },
  // 人才
  talents: {
    comparison: [
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
      {
        prop: "talentDeclarationCompany",
        label: "人才申报公司：",
      },
      {
        prop: "emergencyStatus",

        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "handlingQualificationsCategory",

        label: "办理资质类别：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
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
  //   证书
  certificate: {
    comparison: [
      {
        prop: "emergencyStatus",

        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
      },
    ],
  },
  // 工商
  ICBC: {
    comparison: [
      {
        prop: "emergencyStatus",

        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
      },
    ],
  },
  // 知识产权
  property: {
    comparison: [
      {
        prop: "emergencyStatus",

        label: "紧急情况：",
        formatter: (val) => {
          return formatterCallback(commonData.emergencyStatus, val);
        },
      },
      {
        prop: "promiseTime",
        label: "承诺完成时间：",
      },
      {
        type: "input",
        prop: "emergencyRemark",
        label: "紧急情况备注：",
        attrs: {
          disabled: true,
        },
      },
    ],
  },
  // 附件
  attachment: {},
  // 平台账号密码
  accountPassword: {},
};
