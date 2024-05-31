// 订单配置页的配置信息
// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";

import store from "@/store/index.js";

let commonData = store.state.commonData.commonData;
export const configData = {
  // 项目信息配置
  projectOptions: [
    // {
    //   label: "项目编号",
    //   prop: "projectId",
    //   width: 200,
    // },
    {
      label: "项目分类",
      prop: "allCategoryName",
      width: 260,
    },
    // {
    //   label: "项目二级分类",
    //   prop: "twoCategoryName",
    // },
    {
      label: "项目类型",
      prop: "projectType",
      width: 200,
    },
    {
      label: "项目名称",
      prop: "projectName", //1
    },
    {
      label: "项目状态",
      prop: "changeType",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.orderProjectChangeType, val);
      },
      width: 100,
    },
    {
      label: "是否赠品",
      prop: "isGift",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.isGift, val);
      },
      width: 100,
    },
    {
      label: "实际单价",
      prop: "unitPrice", //1
      width: 120,
    },
    {
      label: "数量",
      prop: "quantity", //1
      width: 100,
    },
    {
      label: "实际总价",
      slotName: "total",

      width: 120,
    },
    {
      label: "拆账金额",
      prop: "dismantlePrice",

      width: 180,
    },
  ],
  // 项目变更
  addOrSubOrderOptions: [
    {
      label: "项目分类",
      prop: "projectCategoryName",
      width: 180,
    },

    {
      label: "项目类型",
      prop: "projectType",
      width: 150,
    },
    {
      label: "项目名称",
      prop: "projectName", //1
      width: 200,
    },
    {
      label: "是否赠品",
      prop: "isGift",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.isGift, val);
      },
      width: 100,
    },
    {
      label: "项目状态",
      prop: "changeType",
      formatter: (row, column, val) => {
        return formatterCallback(commonData.orderProjectChangeType, val);
      },
    },
    {
      label: "原单价",
      prop: "originalUnitPrice",
    },
    {
      label: "原数量",
      prop: "originalQuantity",
    },
    {
      label: "原总价",
      slotName: "originalTotle",
    },
    {
      label: "更改后单价",
      prop: "changeUnitPrice",
    },
    {
      label: "更改后数量",
      prop: "changeQuantity",
    },
    {
      label: "更改后总价",
      slotName: "changeTotle",
    },
    {
      label: "变更时间",
      prop: "updateTime",
      width: 160,
    },
  ],
  // 人才需求
  talentDemandOptions: [
    {
      editType: "input-number",
      label: "需求数量",
      prop: "quantityRequired",
      width: "120px",
      attrs: {
        stepStrictly: true,
        step: 1,
        min: 0,
        controls: false,
        style: { width: "100px" },
      },
    },
    {
      editType: "select",
      label: "主要人员",
      prop: "keyPersonnel",
      width: "140px",
      editOptions: [
        { label: "请选择", value: "请选择" },
        { label: "一级建造师", value: "一级建造师" },
        { label: "二级建造师", value: "二级建造师" },
        { label: "技术负责人", value: "技术负责人" },
        { label: "中级工程师", value: "中级工程师" },
        { label: "技术工人", value: "技术工人" },
      ],
    },
    {
      editType: "input",
      label: "专业",
      prop: "professional",
      width: "130px",
    },
    {
      editType: "input",
      label: "等级",
      prop: "level",
      width: "130px",
    },
    {
      editType: "select",
      label: "是否带B",
      prop: "isBPermit",
      editOptions: [
        { label: "是", value: "是" },
        { label: "否", value: "否" },
      ],
      width: "150px",
    },
    {
      editType: "input",
      label: "签约时长",
      prop: "lengthOfContract",
      width: "150px",
    },
    {
      editType: "select",
      label: "用途",
      prop: "purpose",
      editOptions: [
        { label: "资质", value: "资质" },
        { label: "安证", value: "安证" },
        { label: "资质安证", value: "资质安证" },
        { label: "其他", value: "其他" },
      ],
      width: "220px",
    },
    {
      editType: "select",
      label: "社保要求",
      prop: "socialEcurity",
      editOptions: [
        { label: "省内唯一（省外社保）", value: "省内唯一（省外社保）" },
      ],
      width: "190px",
    },
    {
      editType: "input",
      label: "人才单价",
      prop: "talentUnitPrice",
      width: "130px",
    },
    {
      editType: "input",
      label: "毕业年限有无要求",
      prop: "graduationYearIsRequest",
      width: "190px",
    },
    {
      editType: "select",
      label: "企业建造师系统有无开通",
      prop: "isArchitectSystem",
      editOptions: [
        { label: "有", value: "有" },
        { label: "无", value: "无" },
      ],
      width: "170px",
    },
    {
      editType: "select",
      label: "是否需配合录制视频",
      prop: "isCooperateRecordVideo",
      editOptions: [
        { label: "有", value: "有" },
        { label: "否", value: "否" },
      ],
      width: "160px",
    },
    {
      editType: "select",
      label: "无要求专业齐全",
      prop: "isCompleteRofessional",
      editOptions: [
        { label: "有", value: "有" },
        { label: "否", value: "否" },
      ],
      width: "150px",
    },
    {
      editType: "select",
      label: "是否需要配合证书原件",
      prop: "isCooperateCertificateOriginal",
      editOptions: [
        { label: "有", value: "有" },
        { label: "否", value: "否" },
      ],
      width: "150px",
    },
    {
      editType: "select",
      label: "是否需要配合出场",
      prop: "isCooperateShowUp",
      editOptions: [
        { label: "有", value: "有" },
        { label: "否", value: "否" },
      ],
      width: "150px",
    },
    {
      editType: "date-picker",
      label: "与客户约定完成匹配时间",
      prop: "customersAgreementCompletionTime",
      width: "270px",
      attrs: {
        type: "datetime",
        placeholder: "选择日期时间",
        format: "yyyy-MM-dd hh:mm:ss",
        valueFormat: "yyyy-MM-dd hh:mm:ss",
      },
    },
    {
      label: "操作",
      action: true,
    },
  ],
  // 人才需求补充
  talentOptions: [
    {
      label: "需求数量",
      prop: "quantityRequired",
    },
    {
      label: "主要人员",
      prop: "keyPersonnel",
      width: "140px",
    },
    {
      label: "专业",
      prop: "professional",
      width: "130px",
    },
    {
      label: "等级",
      prop: "level",
      width: "130px",
    },
    {
      label: "是否带B",
      prop: "isBPermit",

      width: "150px",
    },
    {
      label: "签约时长",
      prop: "lengthOfContract",
      width: "150px",
    },
    {
      label: "用途",
      prop: "purpose",

      width: "220px",
    },
    {
      label: "社保要求",
      prop: "socialEcurity",

      width: "190px",
    },
    {
      label: "人才单价",
      prop: "talentUnitPrice",
      width: "130px",
    },
    {
      label: "毕业年限有无要求",
      prop: "graduationYearIsRequest",
      width: "190px",
    },
    {
      label: "企业建造师系统有无开通",
      prop: "isArchitectSystem",

      width: "170px",
    },
    {
      label: "是否需配合录制视频",
      prop: "isCooperateRecordVideo",

      width: "160px",
    },
    {
      label: "无要求专业齐全",
      prop: "isCompleteRofessional",

      width: "150px",
    },
    {
      label: "是否需要配合证书原件",
      prop: "isCooperateCertificateOriginal",

      width: "150px",
    },
    {
      label: "是否需要配合出场",
      prop: "isCooperateShowUp",

      width: "150px",
    },
    {
      label: "与客户约定完成匹配时间",
      prop: "customersAgreementCompletionTime",
      width: "150px",
    },
  ],
  // 审批信息
  approvalOptions: [
    { label: "审批阶段", slotName: "auditStage" },
    { label: "审批人", prop: "auditUserName" },
    {
      label: "审批结果",
      prop: "auditStatus",
      formatter: (row, column, value) => {
        return formatterCallback(commonData.auditstatus, value);
      },
    },
    { label: "审批信息", prop: "remark" },
    { label: "审批时间", prop: "updateTime" },
  ],
  // 作业相关附件表格配置信息
  accessoryOptions: [
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
      label: "备注信息",
      prop: "remake",
    },
    {
      label: "备注",
      action: true,
      btns: [
        // {
        //   id: "preview",
        //   type: "text",
        //   text: "预览",
        // },
        {
          id: "down",
          type: "text",
          text: "下载",
        },
      ],
    },
  ],
};
