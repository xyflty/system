import { area } from "@/utils/area";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

import { formatterCallback } from "@/utils/common";

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
        type: "select",
        prop: "isSignedContract",
        label: "是否已签合同：",
        requred: true,
        isShowErrMsg: false,
        errmsg: "已签合同不能为空",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        label: "订单签约主体：",
        requred: true,
        isShowErrMsg: false,
        errmsg: "订单签约主体不能为空",
        options: commonData.subjectDept, //需要根据主题选择后的数据
        prop: "subjectDeptName",
      },
      {
        type: "treeselect",
        label: "订单所属部门：",
        options: [], //需要根据主题选择后的数据
        prop: "ascriptionDeptId",
        attrs: {
          style: "height:40px",
          placeholder: "请选择",

          disableBranchNodes: true,
          valueConsistsOf: "LEAF_PRIORITY",
          showCount: true,
        },
      },
      {
        type: "select",
        label: "订单所属人：",
        options: [], //需根据上述“订单所属部门”遍历呈现
        prop: "launchUserId",
        attrs: {
          placeholder: "请选择",
        },
      },
      {
        type: "select",
        label: "订单转化人员：", //默认同步为订单所属人
        options: commonData.userList, //遍历系统所有人员呈现
        prop: "transUserId",
        attrs: {
          filterable: true,
        },
      },
      {
        type: "treeselect",
        label: "经办部门：",
        prop: "handleDeptId",
        options: [], //需要根据主题选择后的数据
        attrs: {
          style: "height:40px",
          placeholder: "请选择",

          disableBranchNodes: true,
          valueConsistsOf: "LEAF_PRIORITY",
          showCount: true,
        },
      },
      {
        type: "select",
        label: "经办人员：",
        options: commonData.userList, //遍历系统所有人员呈现
        prop: "handleUserId",
        attrs: {
          filterable: true,
        },
      },
      {
        label: "客户名称：",
        prop: "companyName", //1
      },
      {
        label: "客户类型：",
        prop: "customerType",
        formatter: (val) => {
          return formatterCallback(commonData.customerTypeList, val);
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
        label: "订单创建时间：",
        prop: "createTime",
      },
      {
        label: "订单创建人员：",
        prop: "createBy",
      },
    ],
  },
  //   安证
  safety: {
    comparison: [
      {
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
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
        type: "select",
        prop: "safetyCertificateCategory",
        label: "安证类别：",
        options: [
          { label: "首次", value: "首次" },
          { label: "延续", value: "延续" },
          { label: "只配人才", value: "只配人才" },
        ],
      },
      {
        type: "select",
        prop: "handlingLevel",
        label: "办理级别：",
        options: [
          { label: "一次性", value: "一次性" },
          { label: "安证做资料", value: "安证做资料" },
        ],
      },
      {
        type: "select",
        prop: "handlingArea",
        label: "安证办理地区：",
        options: [
          { label: "省厅", value: "省厅" },
          { label: "广州", value: "广州" },
          { label: "深圳", value: "深圳" },
          { label: "南沙", value: "南沙" },
          { label: "蛇口", value: "蛇口" },
          { label: "横琴", value: "横琴" },
        ],
      },
      {
        type: "cascader",
        prop: "customersLocation",
        label: "客户所在地：",
        options: area.filter((item) => item.value == "44"),
        attrs: {
          props: {
            value: "label",
          },
        },
      },
      {
        type: "select",
        prop: "isProcessingQualifications",
        label: "是否办理资质：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "consultantUserId",
        label: "资质资料顾问：",
        options: commonData.userList,
        attrs: {
          filterable: true,
        },
      },
      {
        type: "select",
        prop: "isTunePersonnel",
        label: "是否调人员：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "input-number",
        prop: "tunePersonnelNumber",
        label: "调人员数量：",
        attrs: {
          style: { width: "100%" },
          placeholder: "请填写",
          min: 0,
          step: 1,
          stepStrictly: true,
          controls: false,
        },
      },
      {
        type: "select",
        prop: "isSocialSecurity",
        label: "人员是否购买社保：",
        attrs: {
          placeholder: "请填写",
        },
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "socialSecurityMonth",
        label: "人员社保购买月份：",

        options: [
          { label: "1月", value: "1月" },
          { label: "2月", value: "2月" },
          { label: "3月", value: "3月" },
          { label: "4月", value: "4月" },
          { label: "5月", value: "5月" },
          { label: "6月", value: "6月" },
          { label: "7月", value: "7月" },
          { label: "8月", value: "8月" },
          { label: "9月", value: "9月" },
          { label: "10月", value: "10月" },
          { label: "11月", value: "11月" },
          { label: "12月", value: "12月" },
        ],
        attrs: {
          multiple: true,
        },
      },
      {
        type: "select",
        prop: "isSignUp",
        label: "是否需要代报名：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "paymentStatus",
        label: "人员费用收款情况：",
        options: [
          { label: "已收全款", value: "已收全款" },
          { label: "未收款", value: "未收款" },
          { label: "已收半款", value: "已收半款" },
        ],
      },
      // {
      //   type: "select",
      //   prop: "personnelMatchStatus",
      //   label: "人员匹配状态：",
      //   options: [
      //     { label: "已配", value: "已配" },
      //     { label: "已买保险", value: "已买保险" },
      //     { label: "已建立调动", value: "已建立调动" },
      //     { label: "已完成", value: "已完成" },
      //   ],
      // },
      {
        type: "input",
        prop: "safetyManagementRegistration",
        label: "安管报名：",
        // options: [
        //   { label: "1A", value: "1A" },
        //   { label: "2B", value: "2B" },
        //   { label: "3C", value: "3C" },
        // ],
        attrs: {
          placeholder: "请填写",
        },
      },
      {
        type: "select",
        prop: "isHandlingPhotos",
        label: "是否处理照片：",
        options: [
          { label: "已报备企业端负责人", value: "已报备企业端负责人" },
          { label: "已报备渠道端负责人", value: "已报备渠道端负责人" },
          { label: "能配合拍", value: "能配合拍" },
        ],
      },
      {
        type: "select",
        prop: "isHandlingInvoice",
        label: "是否处理发票：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "invoiceProcessingCharges",
        label: "发票处理收费情况：",
        options: [
          { label: "直接在客户群提", value: "直接在客户群提" },
          {
            label: "从安证/资质咨询费用抽1000转资料顾问",
            value: "从安证/资质咨询费用抽1000转资料顾问",
          },
          { label: "从安证/其他情况", value: "从安证/其他情况" },
        ],
      },
      // {
      //   type: "select",
      //   prop: "isSignedContract",
      //   label: "是否已签合同：",
      //   options: [
      //     { label: "是", value: "是" },
      //     { label: "否", value: "否" },
      //   ],
      // },
      {
        type: "select",
        prop: "isAgencyFee",
        label: "是否有居间费：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
    ],
  },
  //   资质
  certification: {
    comparison: [
      {
        type: "cascader",
        prop: "qualificationsHandlingArea",
        options: area.filter((item) => item.value == "44"),
        label: "资质办理地区：",
        attrs: {
          props: {
            value: "label",
          },
        },
      },
      {
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
      },
      {
        type: "select",
        prop: "isTunePersonnel",
        label: "是否调人员：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "isSocialSecurity",
        label: "人员是否购买社保：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "isSecurityCertificate",
        label: "是否同时办理安证：",

        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      // {
      //   type: "select",
      //   prop: "isHandlingPhotos",
      //   label: "是否处理照片：",
      //   options: [
      //     { label: "已报备企业端负责人", value: "已报备企业端负责人" },
      //     { label: "已报备渠道端负责人", value: "已报备渠道端负责人" },
      //     { label: "能配合拍", value: "能配合拍" },
      //   ],
      // },
      // {
      //   type: "select",
      //   prop: "isHandlingInvoice",
      //   label: "是否处理发票：",
      //   options: [
      //     { label: "是", value: "是" },
      //     { label: "否", value: "否" },
      //   ],
      // },
      // {
      //   type: "select",
      //   prop: "isSignedContract",
      //   label: "是否已签合同：",
      //   options: [
      //     { label: "是", value: "是" },
      //     { label: "否", value: "否" },
      //   ],
      // },
      {
        type: "select",
        prop: "isAgencyFee",
        label: "是否有居间费：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "isSwitchInvoice",
        label: "是否需要开票：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
      {
        type: "select",
        prop: "businessChangeDockingPersonnel",
        label: "工商变更对接人员：",
        options: commonData.userList,
        attrs: {
          filterable: true,
        },
      },
      {
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "select",
        prop: "projectNature",
        label: "项目性质：",
        options: [
          { label: "新申请", value: "新申请" },
          { label: "增项", value: "增项" },
          { label: "整转", value: "整转" },
          { label: "分立", value: "分立" },
          { label: "只配人才", value: "只配人才" },
          { label: "升级", value: "升级" },
          { label: "孵化", value: "孵化" },
        ],
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
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
      },
      {
        type: "input",
        prop: "talentDeclarationCompany",
        label: "人才申报公司：",
        attrs: {
          placeholder: "请填写",
        },
      },
      {
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "select",
        prop: "handlingQualificationsCategory",
        options: [
          { label: "新申请", value: "新申请" },
          { label: "增项", value: "增项" },
          { label: "分立", value: "分立" },
          { label: "升级", value: "升级" },
        ],
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
        type: "select",
        prop: "isHandlingSafetyCertificate",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
        label: "安证资料否我司办理：",
      },
      {
        type: "radio",
        prop: "typeOfTalentOrder",
        value: "内部订单",
        options: [
          { label: "内部订单", value: "内部订单" },
          { label: "外部订单", value: "外部订单" },
        ],
        label: "人才订单类型：",
      },
      {
        type: "input",
        prop: "talentUseNature",
        label: "人才使用性质：",
        attrs: {
          placeholder: "请填写",
        },
      },
      {
        type: "select",
        prop: "socialSecurityMonth",
        label: "社保购买几月份：",

        options: [
          { label: "1月", value: "1月" },
          { label: "2月", value: "2月" },
          { label: "3月", value: "3月" },
          { label: "4月", value: "4月" },
          { label: "5月", value: "5月" },
          { label: "6月", value: "6月" },
          { label: "7月", value: "7月" },
          { label: "8月", value: "8月" },
          { label: "9月", value: "9月" },
          { label: "10月", value: "10月" },
          { label: "11月", value: "11月" },
          { label: "12月", value: "12月" },
        ],
        attrs: {
          multiple: true,
        },
      },
      {
        type: "input",
        prop: "demandEngineerTotal",

        label: "需求工程师总数：",
        attrs: {
          placeholder: "请填写",
        },
      },
      {
        type: "input",
        prop: "demandArchitectTotal",

        label: "需求建造师总数：",
        attrs: {
          placeholder: "请填写",
        },
      },
      {
        type: "cascader",
        prop: "declareYourLocation",
        label: "申报所在地区：",
        options: area,
        attrs: {
          props: {
            value: "label",
          },
        },
      },

      // {
      //   type: "select",
      //   prop: "isSignedContract",
      //   label: "是否已签合同：",
      //   options: [
      //     { label: "是", value: "是" },
      //     { label: "否", value: "否" },
      //   ],
      // },

      {
        type: "select",
        prop: "isAgencyFee",
        label: "是否有居间费：",
        options: [
          { label: "是", value: "是" },
          { label: "否", value: "否" },
        ],
      },
    ],
  },
  //   证书
  certificate: {
    comparison: [
      {
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
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
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
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
        type: "select",
        prop: "emergencyStatus",
        options: commonData.emergencyStatus,
        label: "紧急情况：",
      },

      {
        type: "date-picker",
        prop: "promiseTime",
        label: "承诺完成时间：",
        attrs: {
          type: "datetime",
          placeholder: "选择日期时间",
          format: "yyyy-MM-dd hh:mm:ss",
          valueFormat: "yyyy-MM-dd hh:mm:ss",
        },
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
};
