<template>
  <div>
    <DetailPage
      v-if="detailData"
      :title="detailData.zwOrderVo.companyName"
      :tabs="tabs"
      :active="active"
      mode="show"
      showPage="approval"
      @togggle="handleTogggle"
    >
      <template #actions>
        <el-button type="primary" v-show="detailData.showAuditButtonFlag" @click="handleActions('audit')"
          >审批</el-button
        >
        <el-button type="primary"  v-show="detailData.showWithdrawButtonFlag" @click="handleActions('revocation')"
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
      :visible.sync="visible"
      :form="approveForm"
      @confirm="handleConfirm"
      @cancel="approveCancel"
      @approveFail="approveFail"
      :mode="mode"
      type="crm"
    ></ApproveModel>
  </div>
</template>

<script>
import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";
import ApproveModel from "@/views/components/ApproveModel";

import { xtDetail } from "@/mixins/xtDetail";
import { xtSynergyOrderAudit } from "@/api/core/workOrderApproval";

export default {
  components: {
    DetailPage,
    TabsPublic,
    ApproveModel,
  },
  mixins: [xtDetail],
  data() {
    return {
      visible: false,
      approveForm: {},
      mode: "",
      auditType: "pass",
    };
  },

  mounted() {},

  methods: {
    // 表格批量操作
    handleActions(type) {
      if (type === "audit") {
        this.mode = "audit";
        this.visible = true;
      } else if (type === "revocation") {
        // 撤回
        this.auditType = "revocation";
        this.revocationCallback();
      }
    },
    // 审批取消操作
    approveCancel(form) {
      this.visible = false;
      form.resetFields();
    },
    // 驳回操作
    approveFail(form, model) {
      this.auditType = "reject"; //审批驳回
      this.synergyOrderAudit(this.approveForm, form);
    },
    handleConfirm({ form, model }) {
      this.auditType = "pass"; //审批通过
      this.synergyOrderAudit(model, form);
    },
    // 撤销回调
    revocationCallback() {
      this.$confirm("此操作将执行撤回操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.synergyOrderAudit();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    // 判断当前是审批操作还是撤销操作等
    isAudit(key) {
      // "审批状态 1待审批 2通过 3驳回 4撤回 10已作废"
      let str = 1;
      let msg = "";
      switch (key) {
        case "pass":
          str = 2;
          msg = "审批已通过";
          break;
        case "reject":
          str = 3;
          msg = "审批已驳回";
          break;
        case "revocation":
          str = 4;
          msg = "审批已撤回";
          break;
      }
      return { auditstatus: str, msg };
    },
    // 协同下单审批
    synergyOrderAudit(data, id, formRef) {
      let { auditstatus, msg } = this.isAudit(this.auditType);

      let sendData = {
        ...data,
        auditDetailId: this.$route.query.auditDetailId,
        auditStatus: auditstatus,
      };

      xtSynergyOrderAudit(sendData).then((res) => {
        if (res.code === 200) {
          this.visible = false;
          if (formRef) {
            formRef.resetFields();
          }
          this.$router.push('/xt/workOrderApprovalCenter/collaborativeApproval')
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err=>{
        loading.close()
      });;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>