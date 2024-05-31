// 工单审批详情
<template>
  <div class="orderApprovalDetail-warp">
    <DetailPage
      v-if="detailData"
      :title="detailData.zwOrderVo.companyName"
      :tabs="tabs"
      :active="active"
      :nodeData="nodeData"
      mode="show"
      @togggle="handleTogggle"
    >
      <template #nodeStatus>
        <el-button size="mini" type="primary" @click="nodeDetailStatus"
          >详情工单节点动态</el-button
        >
      </template>
      <template #actions>
        <el-button
          type="primary"
          :disabled="detailData.orderJob.orderJobStatus === 4"
          @click="handleActions('defer')"
          >暂缓工单</el-button
        >
        <el-button
          type="primary"
          :disabled="detailData.orderJob.orderJobStatus === 4"
          @click="handleActions('cancel')"
          >取消工单</el-button
        >
      </template>
      <template #content>
        <TabsPublic
          v-if="pageData"
          :config="cloneConfigData"
          :allData="pageData"
          :pageMode="pageMode"
          :tabsData="tabsData"
          :pageActive.sync="pageActive"
          mode="show"
        ></TabsPublic>
      </template>
    </DetailPage>

    <!-- 提交下单审批 -->
    <el-dialog
      title="提交协同下单审批"
      :visible.sync="approveDialog"
      width="40%"
      @close="approveConcel('approveRef')"
    >
      <el-form
        ref="approveRef"
        :model="approveForm"
        :rules="approveRules"
        labelWidth="100px"
      >
        <el-form-item
          v-for="(domain, index) in approveForm.auditUserIds"
          :label="'审批人' + Number(+index + 1)"
          :key="domain.key"
          :prop="'auditUserIds.' + index + '.id'"
          :rules="{
            required: true,
            message: '审批人不能为空',
            trigger: 'blur',
          }"
        >
          <el-select v-model="domain.id" style="width: 85%">
            <el-option
              v-for="item in commonData.userList"
              :key="item.value"
              v-bind="item"
              :disabled="disabledChoose(item)"
            ></el-option> </el-select
          ><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增</el-button>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            type="textarea"
            v-model="approveForm.remark"
            placeholder="请填写备注信息"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="approveConcel('approveRef')">取 消</el-button>
        <el-button type="primary" @click="approveConfirm('approveRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DetailPage from "@/components/DetailPage";
import TabsPublic from "@/components/TabsPublic";

// 获取基础信息接口
import {
  xtOrderJobManageGetInfo,
  xtOrderJobManageSubmitAudit,
} from "@/api/xt/jobManagement";

// 获取所有动态节点接口
import { synergyNodeGetOrderJobAllProcessNodePreview } from "@/api/workOrderOperation";
import { xtBaseInfoProjectDetail } from "@/api/settlement";

// import { dealTabs } from "@/utils/common";
// import { configData } from "@/mixins/configData/configData.js";
// import { processingData } from "@/mixins/configData/processingData";

// import { getPagesCategoryId } from "@/utils/common";

import { xtCommonDetail } from "@/mixins/xtCommonDetail";

import { mapState } from "vuex";
export default {
  components: {
    DetailPage,
    TabsPublic,
  },
  mixins: [xtCommonDetail],

  data() {
    return {
      // detailId: "", //工单id
      // detailData: null, //当前页面的详情数据
      nodeData: [], //所有的节点动态数据
      // 分类切换
      // tabs: [
      //   {
      //     value: 1,
      //     label: "基本信息",
      //   },
      // ],
      // // 当前默认的tabs节点
      // active: 1,
      // flag: true, //只获取一次

      // cloneConfigData: null, //tabs数据配置信息
      // pageData: null, //当前tabs内容的数据
      // pageMode: "base", //当前是那个tabs页的分类类型
      // // 子页面下的tabs数据
      // tabsData: [],
      // // 子页面选中的tabs
      // pageActive: -1,
      // allData: {
      //   base: {},
      //   safety: {},
      //   certification: {},
      //   talents: {},
      //   certificate: {},
      //   ICBC: {},
      //   property: {},
      // }, //存储页面所有数据

      baseApi: xtOrderJobManageGetInfo,
      projectDetailApi: xtBaseInfoProjectDetail,
      approveDialog: false, //提交审批信息
      approveForm: {
        auditUserIds: [{ id: "" }],
        orderId: "",
        toUserIds: [],
        remark: "",
      },
      approveRules: {},
      orderJobAuditType: "",
    };
  },

  mounted() {
    // this.initFun();
    // this.initConfig("基本信息");
    // this.getDetail();

    this.getAllNodeStatus();
  },

  methods: {
    // 获取所有的节点状态
    getAllNodeStatus() {
      let sendParams = {
        orderJobId: this.detailId,
      };
      synergyNodeGetOrderJobAllProcessNodePreview(sendParams).then((res) => {
        this.nodeData = res.data;
      });
    },

    // 跳转到详情节点动态
    nodeDetailStatus() {
      this.$router.push({
        path: "/xt/nodeStatus",
        query: {
          // id: this.detailData.orderJob.id,
          orderId: this.detailData.zwOrderVo.id,
          pagesId: this.pagesId,
        },
      });
    },
    // 详情操作
    handleActions(type) {
      this.approveDialog = true;
      if (type === "defer") {
        // 暂缓
        this.orderJobAuditType = 2;
      } else if (type === "cancel") {
        // 取消
        this.orderJobAuditType = 1;
      } else if (type === "back") {
        // 退回
        this.orderJobAuditType = 3;
      }
    },
    addDomain() {
      this.approveForm.auditUserIds.push({
        value: "",
        key: Date.now(),
      });
    },
    removeDomain(item) {
      var index = this.approveForm.auditUserIds.indexOf(item);
      if (index !== -1) {
        this.approveForm.auditUserIds.splice(index, 1);
      }
    },
    approveConcel(formName) {
      this.approveDialog = false;
      this.approveForm = {
        auditUserIds: [{ id: "" }],
        orderId: "",
      };
      this.$refs[formName].resetFields();
    },
    approveConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let auditUserIds = this.approveForm.auditUserIds.map(
            (item) => item.id
          );
          let sendData = {
            orderJobIds: [this.detailId],
            auditUserIds: auditUserIds,
            // toUserIds: this.approveForm.toUserIds,
            orderJobAuditRemark: this.approveForm.remark,
            orderJobAuditType: this.orderJobAuditType,
          };
          xtOrderJobManageSubmitAudit(sendData).then((res) => {
            if (res.code === 200) {
              this.getDetail();
              this.approveConcel(formName);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请填写必填参数");
        }
      });
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    disabledChoose() {
      return (item) => {
        let arr = this.approveForm.auditUserIds.map((item) => item.id);

        return arr.includes(item.value);
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
