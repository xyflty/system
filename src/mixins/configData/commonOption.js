import { formatterCallback } from "@/utils/common";
import store from "@/store/index.js";
let commonData = store.state.commonData.commonData;
const commonObj = [
  {
    label: "工单编号：",
    prop: "orderJobCode",
  },
  {
    label: "订单编号：",
    prop: "orderCode", //1
  },
  {
    label: "合同编号：",
    prop: "contractCode",
  },
  {
    label: "订单名称：",
    prop: "title", //
  },
  {
    label: "订单类型：",
    prop: "orderType", //
    formatter: (val) => {
      return formatterCallback(commonData.xtOrderType, val);
    },
  },

  {
    label: "签约时间：",
    prop: "signTime", //
  },
  {
    prop: "isSignedContract",
    label: "是否已签合同：",
  },
  {
    label: "订单签约主体：",
    prop: "subjectDeptName", //
  },
  {
    label: "订单所属部门：",

    prop: "ascriptionDeptName", //
  },
  {
    label: "订单所属人：",

    prop: "launchUserName", //
  },
  {
    label: "订单转化人员：",

    prop: "transUserName", //
  },
  {
    label: "经办部门：",
    prop: "handleDeptName",
  },
  {
    label: "经办人员：",
    options: [], //遍历系统所有人员呈现
    prop: "handleUserName", //
  },
  {
    label: "客户名称：",
    prop: "companyName", //1
  },
  {
    label: "客户联系人：",
    prop: "contactName",
  },
  {
    label: "客户性质：",
    prop: "customerType",
    formatter: (val) => {
      return ["企业", "个人"][val];
    },
  },
  {
    label: "承诺完成时间：",
    prop: "promiseTime", //1
  },
  {
    label: "紧急程度：",
    prop: "emergencyStatus", //1
    formatter: (val) => {
      return formatterCallback(commonData.emergencyStatus, val);
    },
  },
  {
    label: "订单创建人员：",
    prop: "createBy", //
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
    label: "订单创建时间：",
    prop: "createTime", //
  },
  {
    label: "工单提交时间：",
    prop: "orderJobSubmitTime", //
  },
  {
    label: "工单提交人：",
    prop: "orderJobInitiator",
  },
];
export default commonObj;
