<template>
  <div>
    <DetailPage
      v-if="detailData"
      :title="detailData.zwOrderVo.companyName"
      :tabs="tabs"
      :active="active"
      mode="show"
      :nodeData="nodeData"
      showPage="approval"
      @togggle="handleTogggle"
    >
      <template #nodeStatus>
        <el-button type="primary" size="mini" @click="detailNodeStatus"
          >详情工单节点动态</el-button
        >
      </template>
      <template #actions>
        <el-button
          v-hasPermi="['xt:orderJobAudit:audit']"
          v-show="detailData.auditFlag"
          type="primary"
          @click="setupEvents('approval')"
          >审批</el-button
        >
        <el-button
          v-hasPermi="['xt:orderJobAudit:quash']"
          v-show="detailData.auditOrderJobLaunchFlag"
          type="primary"
          @click="setupEvents('revocation')"
          >撤销</el-button
        >
      </template>
      <template #content>
        <TabsPublic
          v-if="pageData"
          :config="cloneConfigData"
          :allData="pageData"
          mode="show"
          :pageMode="pageMode"
          :tabsData="tabsData"
          :pageActive.sync="pageActive"
        >
        </TabsPublic>
      </template>
    </DetailPage>

    <!-- 审批弹出框 -->
    <ApproveModel
      ref="approverRef"
      :visible.sync="visible"
      :mode="mode"
      :form="approveForm"
      :isShowAudit="false"
      @confirm="approvePass"
      @approveFail="approveFail"
    >
      <el-form-item label="备注原因：">
        <el-input
          type="textarea"
          :disabled="true"
          v-model="approveForm.orderJobAuditRemark"
          placeholder="请填写备注信息"
        ></el-input>
      </el-form-item>
    </ApproveModel>
  </div>
</template>

<script>
import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";
import ApproveModel from "@/views/components/ApproveModel";

import { xtOrderJobAuditOrderJobAudit } from "@/api/workOrderProcessing/qualification";
// 获取所有的动态详情
import { synergyNodeGetOrderJobAllProcessNodePreview } from "@/api/workOrderOperation";
import { xtBaseInfoProjectDetail } from "@/api/settlement";
// 作业端工单列表接口
import {
  xtOrderJobAuditAudit,
  xtOrderJobAuditQuash,
} from "@/api/core/workOrderApproval";

// import { configData } from "@/mixins/configData/configData.js";
// import { processingData } from "@/mixins/configData/processingData";
// import { dealTabs } from "@/utils/common";
import { xtCommonDetail } from "@/mixins/xtCommonDetail";

export default {
  components: {
    DetailPage,
    TabsPublic,
    ApproveModel,
  },
  mixins: [xtCommonDetail],
  data() {
    return {
      // 节点动态数据
      nodeData: [],
      baseApi: xtOrderJobAuditOrderJobAudit,
      projectDetailApi: xtBaseInfoProjectDetail,
      isAccessory: true,
      visible: false,
      mode: "audit",
      approveForm: {},

      auditId: "", //审批id
      rowId: "", //列表id
    };
  },

  mounted() {
    // this.initFun();
    // this.initConfig("基本信息");
    // this.getDetail();

    this.rowId = this.$route.query.rowId;
    this.getAllNodeStatus();
  },

  methods: {
    // initFun() {
    //   this.detailId = this.$route.query.id;
    // },
    // 生成当前页面配置
    // initConfig(key) {
    //   switch (key) {
    //     case "基本信息":
    //       this.pageMode = "base";

    //       break;
    //     case "安证项目":
    //       this.pageMode = "safety";

    //       break;
    //     case "资质项目":
    //       this.pageMode = "certification";

    //       break;
    //     case "人才项目":
    //       this.pageMode = "talents";

    //       break;
    //     case "证书项目":
    //       this.pageMode = "certificate";

    //       break;
    //     case "工商项目":
    //       this.pageMode = "ICBC";

    //       break;
    //     case "知识产权项目":
    //       this.pageMode = "property";

    //       break;

    //     default:
    //       break;
    //   }
    //   this.cloneConfigData = configData[this.pageMode];
    //   if (this.pageMode !== "base") {
    //     this.cloneConfigData.processing =
    //       processingData[`${this.pageMode}`].processing;
    //   }
    // },
    // generateData(data, key) {
    //   this.allData[key].descData = data.zwOrderVo; //基础信息
    //   this.allData[key].projectData = data.orderProjectList; //
    //   this.allData[key].financeData = data.xtMoneyNodeList; //收款节点
    //   switch (key) {
    //     case "base":
    //       // 基础
    //       this.pageData = this.allData[this.pageMode];

    //       break;
    //     case "safety":
    //     case "certification":
    //     case "talents":
    //     case "certificate":
    //     case "ICBC":
    //     case "property":
    //       this.allData[key].processingData = data.projectMainInfo;
    //       this.pageData = this.allData[this.pageMode][this.pageActive];

    //       break;
    //     default:
    //       break;
    //   }
    //   this.pageData.accessoryData = this.detailData.resourceAnnexList; //项目附件表格数据
    // },
    // getDetail() {
    //   if (this.pageMode === "base") {
    //     this.getBaseInfo();
    //   } else {
    //     this.getXtBaseInfoProjectDetail();
    //   }
    // },
    // // 基础信息
    // getBaseInfo() {
    //   let sendData = {
    //     id: this.detailId,
    //     projectCategory: this.projectCategory,
    //   };
    //   xtOrderJob(sendData).then((res) => {
    //     if (res.code === 200) {
    //       this.detailData = res.data;

    //       if (this.flag) {
    //         // 只有执行一次
    //         let newTabs = dealTabs(res.data.xtProjectCategoryVos);
    //         this.tabs.push(...newTabs);
    //       }
    //       this.flag = false;

    //       this.generateData(res.data, this.pageMode);
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    // // 获取项目详情
    // getXtBaseInfoProjectDetail() {
    //   // 切换协同分类详情数据
    //   let sendParams = {
    //     orderId: this.detailData.zwOrderVo.id,
    //     orderJobId: this.detailId,

    //     xtProjectCategoryId: this.active,
    //   };
    //   xtBaseInfoProjectDetail(sendParams).then((res) => {
    //     this.tabsData = res.data.map((item) => {
    //       return {
    //         id: item.orderProject.id,
    //         title: item.orderProject.projectName,
    //       };
    //     });
    //     this.pageActive = this.tabsData[0].id;
    //     this.generateData(res.data, this.pageMode);
    //   });
    // },
    // handleTogggle(row) {
    //   this.pageData = null;
    //   this.active = row.value;
    //   this.initConfig(row.label);
    //   this.getDetail();
    // },
    //详情操作按钮
    setupEvents(type) {
      if (type === "approval") {
        // 审批
        this.visible = true;
        this.approveForm = {
          remark: "",
          toUserIds: [],
          orderJobAuditRemark: this.detailData.xtOrderJobAudit.remark,
        };
      } else if (type === "revocation") {
        this.revocationCallback();
      }
    },
    // 审批接口
    approveCallback(model, form, msg, flag) {
      let sendData = {
        orderJobId: this.detailId,
        auditId: this.auditId,
        ...model,
      };
      if (flag) {
        sendData.orderJobStatus = 8;
      } else {
        sendData.auditStatus = 2;
      }

      xtOrderJobAuditAudit(sendData).then((res) => {
        if (res.code === 200) {
          this.visible = false;
          form.resetFields();
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 审批通过
    approvePass({ form, model }) {
      form.validate((valid) => {
        if (valid) {
          let msg = "审批成功";

          this.approveCallback(model, form, msg);
        } else {
          this.$message.error("请选择必填参数");
        }
      });
    },
    // 审批不通过
    approveFail({ form, model }) {
      form.validate((valid) => {
        if (valid) {
          let msg = "审批不通过";
          this.approveCallback(model, form, msg, true);
        } else {
          this.$message.error("请选择必填参数");
        }
      });
    },
    revocationCallback() {
      this.$confirm("此操作将执行撤回操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let sendData = {
            id: this.rowId,
          };

          xtOrderJobAuditQuash(sendData).then((res) => {
            if (res.code === 200) {
              this.$refs.tableRef.getTableData();
              this.$message.success("已撤回");
              this.detailId = "";
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    // 跳转到详情动态节点
    detailNodeStatus() {
      this.$router.push({
        path: "/xt/nodeStatus",
        query: { orderId: this.detailData.zwOrderVo.id, pagesId: this.pagesId },
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
  },
};
</script>

<style lang="scss" scoped>
</style>