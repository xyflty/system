<template>
  <div class="detail-warp">
    <DetailPage
      v-if="detailData"
      :title="detailData.orderJob.projectName"
      :tabs="tabs"
      :active="active"
      :nodeData="nodeData"
      :flowData="flowData"
      mode="show"
      @togggle="handleTogggle"
    >
      <template #nodeStatus>
        <el-button size="mini" type="primary" @click="nodeDetailStatus"
          >详情工单节点动态</el-button
        >
      </template>
      <template #actions>
        <template v-for="item in tableActions">
          <el-button
            :key="item.id"
            v-bind="item"
            v-hasPermi="item.hasPermi"
            @click="batchActions(item)"
            >{{ item.title }}</el-button
          >
        </template>
      </template>
      <template #content>
        <TabsPublic
          v-if="pageData"
          :config="cloneConfigData"
          :allData="pageData"
          :pageMode="pageMode"
          :isShowUpdateOrder="true"
          :isShowBorrowMoney="true"
          mode="show"
        ></TabsPublic>
      </template>
    </DetailPage>

    <!-- 审批状态弹出框 -->
    <ApproveModel
      v-if="visible"
      :title="dialogTitle"
      :visible.sync="visible"
      :form="formData"
      :mode="mode"
      :pageType="pagesId"
      :isShowUpload="false"
      @cancel="approveCancel"
      @confirm="approvePass"
      @approveFail="approveFail"
    >
    </ApproveModel>

    <!-- 暂缓和退回 -->
    <approveModel
      :visible.sync="approveVisible"
      :form="approveForm"
      @confim="approveConfirm"
      @concel="approveConcel"
    ></approveModel>
  </div>
</template>

<script>
import {
  xtOrderJob,
  xtOrderJobAuditPass,
  xtOrderJobAuditNotPass,
  xtOrderJobAssignment,
  xtOrderJobRespite,
  xtOrderJobWithdraw,
  xtOrderJobExitOrder,
  xtOrderJobSubmitAudit,
} from "@/api/workOrderProcessing/qualification";

import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";
// 审批状态弹出框
import ApproveModel from "@/views/components/ApproveModel";
import approveModel from "@/views/xt/components/approveModel";

import {
  synergyNodeGetOrderJobAllProcessNodePreview,
  synergyNodeGetOrderJobProcessNodePreview,
} from "@/api/workOrderOperation";

import { configData } from "./configData";
import { processingData } from "@/mixins/configData/processingData";
import { getPagesCategoryType } from "@/utils/common";

import { mapState } from "vuex";

export default {
  components: {
    DetailPage,
    TabsPublic,
    ApproveModel,
    approveModel,
  },

  data() {
    return {
      detailId: null, //当前订单id
      pagesId: null, //当前页的类型
      projectId: null, //项目id
      projectCategory: null,
      detailData: null,
      // 节点动态数据
      nodeData: [],
      // 头部的时间提示
      flowData: {},
      //   操作区域按钮配置
      tableActions: [
        {
          id: "audit",
          title: "审核工单",
          hasPermi: ["xt:orderJob:audit"],
        },
        {
          id: "allot",
          title: "分配工单",
          hasPermi: ["xt:orderJob:assignment"],
        },
        {
          id: "defer",
          title: "暂缓工单",
          hasPermi: ["xt:orderJob:respite"],
        },
        {
          id: "back",
          title: "退回工单",
          hasPermi: ["xt:orderJob:withdraw"],
        },
      ],
      // tabs切换数据
      tabs: [
        {
          value: 1,
          label: "基本信息",
        },
        {
          value: 2,

          label: "资料文件",
        },
      ],
      // 当前默认的tabs节点
      active: 1,
      cloneConfigData: null,
      allData: {
        base: {},
        attachment: {},
        account: {},
      },
      pageData: {},
      pageMode: "base",
      //   审批状态弹出框
      visible: false,
      mode: "",
      dialogTitle: "",
      formData: {},

      // 退回和暂缓
      approveVisible: false,
      approveForm: {
        auditUserIds: [{ id: "" }],
        orderId: "",
        remark: "",
      },
    };
  },
  methods: {
    inFun() {
      this.detailId = this.$route.query.id;
      this.pagesId = this.$route.query.pagesId;
      this.projectId = this.$route.query.projectId;
      this.pagesType = getPagesCategoryType(this.pagesId);
    },
    initConfig(key) {
      switch (key) {
        case "基本信息":
          this.pageMode = "base";
          this.cloneConfigData = configData[this.pageMode][this.pagesType];

          this.cloneConfigData.processing =
            processingData[`${this.pagesType}`].processing;

          break;
        case "资料文件":
          this.pageMode = "attachment";
          this.cloneConfigData = configData[this.pageMode];
          break;
        case "三库一平台账号密码":
          this.pageMode = "account";
          this.cloneConfigData = {};
          break;
      }
    },
    // 生成数据结构
    generateData(data, key) {
      switch (key) {
        case "base":
          this.allData[key].descData = {
            ...data.zwOrderVo,

            ...data.orderJob,
            ...data.projectBasicInfo,
          }; //基础信息

          this.allData[key].remark = ""; //备注
          this.allData[key].projectData = data.orderProjectList; //项目数据
          this.allData[key].processingData =
            {
              ...data.projectMainInfo,
              auditUserName: data.orderJob.auditUserName,
              makeUserName: data.orderJob.makeUserName,
            } || {}; //当前页面数据
          this.allData[key].financeData = data.xtMoneyNodeList;

          if (this.pagesType === "talents") {
            //人才详情基础信息才显示人才需求
            this.allData[key].talentData = data.xtTalentDemandInfos;
          }
          this.allData[key].addOrSubOrderInfo =
            data.xtOrderProjectChangeRecordList; //项目变更数据

          break;
        case "attachment":
          let accessoryData = data.resourceAnnexList.filter(
            (item) => item.annexType === 1
          );
          this.allData[key].accessoryData = accessoryData; //附件数据
          break;
        case "account":
          this.allData[key].accountInfoData = data.zwCustomerAccount || {}; //账号信息

          break;
      }
      this.pageData = this.allData[this.pageMode];

      if (this.pagesType === "certification") {
        // 资质需要判断多种情况
        let projectNature = this.allData["base"].descData.projectNature;
        if (projectNature === "新申请") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.add;
        } else if (projectNature === "整转") {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.full;
        } else {
          this.cloneConfigData.processing =
            processingData[this.pagesType].processing.part;
        }
      }
    },
    // 获取当前页面详情
    getDetail() {
      this.generateData(this.detailData, this.pageMode);
    },
    // 获取基础信息
    getXtOrderJob() {
      let sendData = {
        id: this.detailId,
        projectId: this.projectId,
        projectCategoryEnum: this.pagesId,
      };
      xtOrderJob(sendData).then((res) => {
        if (res.code === 200) {
          this.detailData = res.data;

          this.generateData(res.data, this.pageMode);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    auditCallback(mode, str) {
      this.mode = mode;
      this.dialogTitle = str;
      this.visible = true;
    },
    batchActions(row) {
      const { auditUserId, makeUserId, remark } = this.detailData;
      let mode = "audit";
      let str = "工单审批";
      let obj = {};
      if (row.id === "audit") {
        mode = "audit";
        str = "工单审批";
        obj = {
          auditUserId: auditUserId,
          makeUserId: makeUserId,
          remark: remark,
        };
        this.auditCallback(mode, str);
      } else if (row.id === "allot") {
        mode = "allot";
        str = "分配工单审批";
        obj = {
          auditUserId: auditUserId,
          makeUserId: makeUserId,
        };
        this.auditCallback(mode, str);
      } else if (row.id === "defer") {
        this.mode = "defer";
        this.getOrderJobExitOrder(this.detailId);
      } else if (row.id === "back") {
        this.mode = "back";
        this.getOrderJobExitOrder(this.detailId);
      }

      this.formData = obj;
    },
    // 切换当前节点
    handleTogggle(row) {
      this.pageData = null;
      this.active = row.value;
      this.initConfig(row.label);
      this.getDetail();
    },
    // 审批取消操作
    approveCancel(form) {
      this.visible = false;
      form.resetFields();
    },
    // 订单审批
    orderJobAudit(ids, model, msg, form, flag) {
      let sendData = {
        orderJobIds: ids,
        ...model,
      };
      let fn = xtOrderJobAuditPass;
      if (flag) {
        sendData.orderJobStatus = 8;
        fn = xtOrderJobAuditNotPass;
      }
      fn(sendData).then((res) => {
        if (res.code === 200) {
          this.visible = false;
          form.resetFields();
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 审批不通过
    approveFail({ form, model }) {
      let ids = [this.detailId];
      let msg = "审批不通过";
      this.orderJobAudit(ids, model, msg, form, true);
    },
    // 审批通过提交
    approvePass({ form, model }) {
      let ids = [this.detailId];
      let msg = "";
      let fn = null;
      let sendData = {};
      if (this.mode === "audit") {
        // 审批
        msg = "审批通过";
        this.orderJobAudit(ids, model, msg, form);
        return;
      } else if (this.mode === "allot") {
        // 分配
        sendData = {
          orderJobIds: ids,
          handleType: 2, //分配工单
          ...model,
        };
        fn = xtOrderJobAssignment;

        msg = "工单分配成功";
      } else if (this.mode === "defer") {
        // 暂缓
        fn = xtOrderJobRespite;
        sendData = {
          orderJobIds: ids,
          handleType: 5, //暂缓工单
          orderJobStatus: 7,
          ...model,
        };

        msg = "暂缓工单成功";
      } else if (this.mode === "back") {
        // 退回
        fn = xtOrderJobWithdraw;
        sendData = {
          orderJobIds: ids,
          handleType: 6, //退回工单
          orderJobStatus: 4,
          ...model,
        };

        msg = "退回工单成功";
      }

      fn(sendData).then((res) => {
        if (res.code === 200) {
          this.approveCancel(form);

          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取所有的节点状态
    getAllNodeStatus() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeGetOrderJobAllProcessNodePreview(sendParams).then((res) => {
        this.nodeData = res.data;
      });
    },
    // 获取当前节点状态
    getNodeStatus() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeGetOrderJobProcessNodePreview(sendParams).then((res) => {
        this.flowData = res.data;
      });
    },

    // 获取详情节点动态
    nodeDetailStatus() {
      this.$router.push({
        path: "/xt/nodeStatus",
        query: { orderId: this.detailData.zwOrderVo.id, pagesId: this.pagesId },
      });
    },
    approveConfirm({ form, model }) {
      form.validate(async (valid) => {
        if (valid) {
          let ids = [this.detailId];
          const { auditUserIds, remark } = model;
          let str = "";
          let sendData = {
            auditUserIds: auditUserIds.map((item) => item.id),
            orderJobIds: ids,
            orderJobAuditRemark: remark,
          };
          if (this.mode === "defer") {
            sendData.orderJobAuditType = 2;
            str = "已暂缓工单";
          } else if (this.mode === "back") {
            sendData.orderJobAuditType = 3;
            str = "已退回工单";
          }

          const res = await xtOrderJobSubmitAudit(sendData);

          if (res.code === 200) {
            this.$message.success(str);
            this.getXtOrderJob();
            this.approveVisible = false;
          } else {
            this.$message.error(res.msg);
            this.approveVisible = false;
          }
        } else {
          this.$message.error("请填写必填参数");
        }
      });
    },
    approveConcel({ form }) {
      this.approveVisible = false;
    },
    // 获取暂缓和退回的审批人
    async getOrderJobExitOrder(id) {
      let sendData = {
        id: id,
      };
      const res = await xtOrderJobExitOrder(sendData);
      console.log({ res });
      if (res.code === 200) {
        if (res.data.length) {
          let auditUserIds = [];
          res.data.forEach((item) => {
            auditUserIds.push({
              id: item,
            });
          });
          console.log(auditUserIds);
          this.approveForm.auditUserIds = auditUserIds;
        }
        this.approveVisible = true;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
      // 项目分类
      projectCategoryType: (state) => state.commonData.projectCategoryType,
    }),
  },
  mounted() {
    this.inFun();

    if (this.pagesId == 1 || this.pagesId == 2) {
      this.tabs.push({
        value: 3,
        label: "三库一平台账号密码",
      });
    }
    this.initConfig("基本信息");

    this.getXtOrderJob();

    this.getAllNodeStatus();
    this.getNodeStatus();
  },
};
</script>

<style lang='scss' scoped>
</style>