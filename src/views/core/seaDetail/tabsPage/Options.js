import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
export default {
  FormData: [
    {
      name: "基本信息",
      type: "desc",
      children: [
        {
          name: "企业名称",
          key: "companyName",
        },
        {
          name: "系统编号",
          key: "customerCode",
        },
        {
          name: "客户类型",
          key: "customerType",
          formatter: (val) => {
            return formatterCallback(commonData.customerTypeList, val);
          },
        },
        {
          name: "助记名称",
          key: "shortCompanyName",
        },

        // {
        //   name: "客户等级",
        //   key: "customerGrade",
        //   value: "",
        // },
        // {
        //   name: "客户状态",
        //   key: "customerStatus",
        //   value: "",
        // },
        // {
        //   name: "客户跟进",
        //   key: "userName",
        //   value: "",
        // },
        {
          name: "法人",
          key: "legalPerson",
        },
        {
          name: "安证有效期",
          key: "safetyPermitsTime",
        },
        {
          name: "数据来源",
          key: "dataSource",
          formatter: (val) => {
            return formatterCallback(commonData.dataSourceList, val);
          },
        },
        {
          name: "企业规模",
          key: "scale",
        },
        {
          name: "所在地区",
          key: "province",
        },
        {
          name: "详细地址",
          key: "address",
        },

        {
          name: "备注",
          key: "note",
        },
        {
          name: "",
          key: "",
        },
      ],
    },
    {
      name: "联系人",
      type: "table",
      dataType: "contactInfoList",
      column: [
        {
          label: "联系人姓名",
          prop: "contactName",
          formatter: (val, value, label) => {
            if (val.ishide) {
              return val.contactName.replace(/(?<=.)./g, "*");
            }
            return val.contactName;
          },
        },
        {
          label: "性别",
          prop: "gender",
          dicData: [
            {
              label: "先生",
              value: 1,
            },
            {
              label: "女士",
              value: 2,
            },
            {
              label: "未知",
              value: null,
            },
          ],
        },
        {
          label: "手机号码",
          prop: "cellphone",
          formatter: (val, value, label) => {
            if (val.ishide) {
              return val.cellphone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
            }
            return val.cellphone;
          },
        },
        {
          label: "微信账号",
          prop: "tencentWx",
          formatter: (val, value, label) => {
            if (val.tencentWx && val.ishide) {
              return val.tencentWx.replace(/(?<=.)./g, "*");
            }
            return val.tencentWx;
          },
        },
        {
          label: "角色",
          prop: "role",
          formatter: (val, value, label) => {
            return formatterCallback(commonData.roleList, value);
          },
        },
        {
          label: "部门职务",
          prop: "position",
        },

        {
          label: "数据来源",
          prop: "dataSource",
        },
        {
          label: "喜恶",
          prop: "hobby",
        },
      ],
    },
    {
      name: "资质情况",
      type: "table",
      dataType: "buildingQualificationBoList",
      column: [
        {
          label: "名称",
          prop: "certName",
        },
        {
          label: "到期时间",
          prop: "expireDate",
        },
      ],
    },
    {
      name: "账号信息",
      type: "desc",
      dataType: "customerAccount",
      children: [
        {
          name: "三库账号：",
          key: "threeLibraryAccount",
        },
        {
          name: "三库密码：",
          key: "threeLibraryPassword",
        },
        {
          name: "一建账号：",
          key: "constructorAccount",
        },
        {
          name: "一建密码：",
          key: "constructorPassword",
        },
        {
          name: "二建账号：",
          key: "associateConstructorAccount",
        },
        {
          name: "二建密码：",
          key: "associateConstructorPassword",
        },
      ],
    },
  ],
};
