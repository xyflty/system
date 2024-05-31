import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
let user = store.state.user;

const TableOptions = [
  {
    label: "报告标题",
    prop: "title",
  },
  {
    label: "提交人员",
    prop: "userName",
  },
  {
    label: "报告类型",
    prop: "dailyType",
    formatter: (row, column, value) => {
      return formatterCallback(commonData.reportTypeEnum, value);
    },
  },
  {
    label: "批阅状态",
    prop: "isRead",
    isHtml: (row, column, vlaue) => {
      let name = ["未批阅", "已批阅"][vlaue];
      return `<span class='cricle ${
        vlaue === 1 && "cricle-color"
      }'>${name}</span>`;
    },
  },
  {
    label: "提交时间",
    prop: "dailyTime",
    sortable: "custom",
  },
];

export const otherOptions = [
  ...TableOptions,
  {
    label: "操作",
    action: true,
  },
];

export const search = {
  menuSpan: 5,
  filterDic: true,
  filterNull: true,
  submitText: "查询",
  emptyText: "重置",
  submitIcon: "el-icon-search",
  emptyIcon: "el-icon-refresh",
  menuPosition: "left",
  column: [
    // {
    //   label: "关键词",
    //   prop: "searchValue",
    //   span: 6,
    // },
    {
      label: "报告类型",
      prop: "dailyType",
      type: "select",
      dicData: commonData.reportTypeEnum,
      span: 5,
    },
    {
      label: "批阅状态",
      prop: "isRead",
      type: "select",
      dicData: commonData.perusalEnum,
      span: 4,
    },
    {
      label: "提交部门",
      prop: "deptId",

      type: "tree",
      dicData: user.treeList,
      props: {
        label: "label",
        value: "id",
        children: "children",
      },
      display: false,
      span: 5,
    },
    {
      label: "提交人员",
      prop: "commitUserId",
      type: "select",
      dicData: commonData.userList,
      filterable: true,
      span: 5,
    },
    {
      label: "提交时间",
      prop: "dailyTime",
      type: "datetime",
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      span: 5,
    },
  ],
};

export const accessory = [
  {
    label: "上传时间",
    prop: "createTime",
  },
  {
    label: "附件名称",
    prop: "fileName",
  },
  {
    label: "附件格式",
    prop: "fileSuffix",
  },
  {
    label: "文件大小",
    prop: "fileSize",
  },
  {
    label: "上传人员",
    prop: "uploadUser",
  },

  {
    label: "操作",
    action: true,
    btns: [
      {
        id: "preview",
        type: "text",
        text: "预览",
      },
      {
        id: "down",
        type: "text",
        text: "下载",
      },
      {
        id: "remove",
        type: "text",
        text: "删除",
      },
    ],
  },
];

// 日报统计表格配置
export const reportCrud = {
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  align: "center",
  menuAlign: "center",

  menu: false,
  stripe: true,
  border: true,
  column: [
    {
      label: "姓名",
      prop: "userName",
    },

    {
      label: "完成率",
      prop: "percent",
    },
  ],
};

export const weekArr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
export const monthArr = [
  "01月",
  "02月",
  "03月",
  "04月",
  "05月",
  "06月",
  "07月",
  "08月",
  "09月",
  "10月",
  "11月",
  "12月",
];
