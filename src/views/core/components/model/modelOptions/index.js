import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;

// 联系人表格配置信息
export const ContactOptions = [
  {
    label: "联系人姓名",
    prop: "contactName",
  },
  {
    label: "性别",
    prop: "gender",
    formatter: (row, column, value) => {
      return (value && ["其他", "先生", "女士"][value]) || "--";
    },
  },
  {
    label: "角色",
    prop: "role",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.roleList, value);
    },
  },
  {
    label: "职位",
    prop: "position",
  },
  {
    label: "手机号码",
    prop: "cellphone",
  },
  {
    label: "座机",
    prop: "landlinePhone",
  },
  {
    label: "微信",
    prop: "tencentWx",
  },
  {
    label: "喜恶",
    prop: "hobby",
  },
];

// 资质表格配置信息
export const AptitudeOptions = [
  {
    label: "名称",
    prop: "certName",
  },
  {
    label: "到期时间",
    prop: "expireDate",
  },
  {
    label: "到期预警",
    prop: "warningStatusCode",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.threeKuEnum, value);
    },
  },
];
