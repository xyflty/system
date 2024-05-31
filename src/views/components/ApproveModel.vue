<template>
  <!-- 审批状态弹出框 -->
  <el-dialog
    class="approve-model"
    :visible.sync="approvalDialog"
    :close-on-click-modal="false"
    v-bind="$attrs"
    @close="approveCancel('close')"
  >
    <el-form ref="formRef" :model="model" :rules="rules" label-width="150px">
      <el-form-item label="审核信息：" prop="remark" v-if="mode === 'audit'">
        <el-input
          type="textarea"
          show-word-limit
          :maxlength="300"
          :rows="6"
          v-model="model.remark"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
      <!-- 只有分配和审批才显示 -->
      <div
        v-if="
          (mode === 'audit' || mode === 'allot') &&
          type === 'job' &&
          isShowAudit
        "
      >
        <el-form-item
          label="服务顾问（制）："
          prop="makeUserId"
          :error="errorMsg"
        >
          <el-select
            ref="makeUserId"
            v-model="model.makeUserId"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            @change="(val) => handleChange('makeUserId', val)"
          >
            <el-option
              v-for="option in makeUserList"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>注：本项可直接分配服务顾问（制）。</span>
        </el-form-item>
        <el-form-item
          label="服务顾问（审）："
          prop="auditUserId"
          :error="errorMsg"
        >
          <el-select
            ref="auditUserId"
            v-model="model.auditUserId"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            @change="(val) => handleChange('auditUserId', val)"
          >
            <el-option
              v-for="option in auditUserList"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>注：本项可直接分配服务顾问（审）。</span>
        </el-form-item>
      </div>
      <el-form-item label="通知人员：" prop="toUserIds" v-if="mode === 'audit'">
        <el-select
          v-model="model.toUserIds"
          filterable
          style="width: 100%"
          multiple
        >
          <el-option
            v-for="option in commonData.userList"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="暂缓原因：" prop="remark" v-if="mode === 'defer'">
        <el-input
          type="textarea"
          show-word-limit
          :maxlength="300"
          :rows="6"
          v-model="model.remark"
          placeholder="请输入暂缓原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="取消原因：" prop="remark" v-if="mode === 'cancel'">
        <el-input
          type="textarea"
          show-word-limit
          :maxlength="300"
          :rows="6"
          v-model="model.remark"
          placeholder="请输入取消原因"
        ></el-input>
      </el-form-item>
      <el-form-item label="退回原因：" prop="remark" v-if="mode === 'back'">
        <el-input
          type="textarea"
          show-word-limit
          :maxlength="300"
          :rows="6"
          v-model="model.remark"
          placeholder="请输入退回原因"
        ></el-input>
      </el-form-item>
      <div v-if="mode !== 'audit' && mode !== 'allot' && isShowUpload">
        <el-form-item label="文件上传：">
          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">选择附件</el-button>
            <div slot="tip" class="el-upload__tip">
              支持格式：.xml.doc .docx .pdf ，单个文件不能超过20MB
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片上传：">
          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"
            list-type="picture-card"
          >
            <div class="upload-box">
              <i class="el-icon-plus"></i>
              <span>上传图片</span>
            </div>
          </el-upload>
        </el-form-item>
      </div>

      <slot></slot>
      <div style="margin-left: 150px" v-if="mode === 'audit'">
        <span>注：审批完成后，将自动通知到所选人员。</span>
      </div>
    </el-form>
    <div class="hint">
      <span v-if="mode === 'defer'"
        >暂缓工单提交审批通过后，将停止工单计时，请沟通协调，谨慎操作</span
      >
      <span v-if="mode === 'back' || mode === 'cancel'"
        >请沟通协调，谨慎操作</span
      >
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <slot name="footer" :form="$refs.formRef"></slot> -->
      <el-button v-if="mode !== 'audit'" @click="approveCancel('')"
        >取消</el-button
      >
      <el-button v-if="mode === 'audit'" @click="approveFail('')"
        >审批不通过</el-button
      >
      <el-button type="primary" @click="approvePass">{{
        mode === "audit" ? "审批通过" : "确定"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MyForm from "@/components/MyForm";

import { cloneDeep } from "lodash";

import {
  xtServiceAdvisorUserGetMakeUserList,
  xtServiceAdvisorUserGetAuditUserList,
} from "@/api/workOrderProcessing/qualification";

import { mapState } from "vuex";
export default {
  name: "ApproveModel",
  components: {
    MyForm,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: "audit" | "allot" | "defer" | "cancel" | "back",
      required: true,
    },
    form: {
      type: Object,
      default: () => {},
    },
    // 验证规则
    rules: {
      type: Object,
    },
    // 是否显示上传
    isShowUpload: {
      type: Boolean,
      default: true,
    },
    type: {
      type: "crm" | "job",
      default: "job",
    },
    isShowAudit: {
      type: Boolean,
      default: true,
    },
    pageType: {
      type: [String, Number],
    },
  },

  data() {
    return {
      // 下单审批
      approvalDialog: this.visible,
      model: cloneDeep(this.form),
      sourceData: [
        {
          id: "audit",
          options: [
            {
              type: "input",
              label: "审核信息",
              prop: "auditInformation",
              placeholder: "请输入备注信息",
              attrs: {
                type: "textarea",
                showWordLimit: true,
                maxlength: 300,
              },
            },
            {
              type: "select",
              label: "通知人员",
              prop: "notifyingOfficer",
              placeholder: "请选择人员",
              children: [
                {
                  label: "张三",
                  value: 0,
                },
                {
                  label: "李四",
                  value: 1,
                },
                {
                  label: "王五",
                  value: 2,
                },
              ],
              attrs: {
                style: "width: 100%",
                multiple: true,
              },
            },
            {
              slotName: "describe",
            },
          ],
        },
        {
          id: "defer",
          options: [
            {
              type: "input",
              label: "",
              prop: "remark",
              placeholder: "请输入备注信息",
              attrs: {
                type: "textarea",
                showWordLimit: true,
                maxlength: 300,
              },
            },
            {
              type: "upload",
              label: "文件上传：",
              prop: "filesUrl",
              uploadAttrs: {
                action: "",
              },
            },
            {
              slotName: "pci",
              label: "图片上传：",
              prop: "imgUrl",
            },
          ],
        },
      ],
      formRefName: null,

      errorMsg: "",
      userList: [],
      makeUserList: [], //服务顾问制
      auditUserList: [], //服务顾问审
    };
  },

  mounted() {
    // this.remoteMethod();

    if (this.pageType && (this.mode === "audit" || this.mode === "allot")) {
      this.getMakeUserList();
      this.getAuditUserList();
    }
  },

  methods: {
    // 审批不通过
    approveFail() {
      this.$emit("approveFail", {
        form: this.$refs.formRef,
        model: this.model,
      });
    },
    approveCancel(type) {
      this.model = {};

      this.$emit("cancel", this.$refs.formRef, type);
    },
    // 审批通过
    approvePass() {
      if (this.model.auditUserId && !this.model.makeUserId) {
        this.$message.error("请选择审批人（制）");
        return;
      }
      if (!this.model.auditUserId && this.model.makeUserId) {
        this.$message.error("请选择审批人（审）");
        return;
      }
      if (!this.model.auditUserId) {
        delete this.model.auditUserName;
      }
      if (!this.model.makeUserId) {
        delete this.model.makeUserName;
      }

      this.$emit("confirm", { form: this.$refs.formRef, model: this.model });
    },
    // 上传之前对文件进行校验
    beforeUpload(rawFile) {
      let fileType = [
        "text/xml",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
      ];
      let isfileFlag = fileType.includes(rawFile.type);
      let imgSize = Number(rawFile.size / 1024 / 1024);
      if (!isfileFlag) {
        this.$message.error("上传文件只能是 以.xml,.doc,.docx,.pdf 格式!");
      }
      if (imgSize > 20) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return;
    },
    httpRequest(option) {},
    //  获取服务顾问（制）用户列表
    getMakeUserList() {
      let sendParams = {
        projectCategory: this.pageType,
      };
      xtServiceAdvisorUserGetMakeUserList(sendParams).then((res) => {
        if (res.code === 200) {
          res.data.forEach((item) => {
            this.makeUserList.push({
              label: item.userName,
              value: item.userId,
            });
          });
        }
      });
    },
    // 获取服务顾问（审）用户列表
    getAuditUserList() {
      let sendParams = {
        projectCategory: this.pageType,
      };
      xtServiceAdvisorUserGetAuditUserList(sendParams).then((res) => {
        if (res.code === 200) {
          res.data.forEach((item) => {
            this.auditUserList.push({
              label: item.userName,
              value: item.userId,
            });
          });
        }
      });
    },

    handleChange(prop, val) {
      this.$nextTick(() => {
        if (prop === "auditUserId") {
          this.model.auditUserName = this.$refs["auditUserId"].selectedLabel;
        } else if (prop === "makeUserId") {
          this.model.makeUserName = this.$refs["makeUserId"].selectedLabel;
        }
      });
      this.errorMsg = "";
    },
  },
  watch: {
    visible(newVal) {
      this.approvalDialog = newVal;

      this.model = this.form;
    },
    approvalDialog(newVal) {
      this.$emit("update:visible", newVal);
    },
  },
  computed: {
    formOptions() {
      if (this.mode) {
        let item = this.sourceData.find((item) => item.id === this.mode);

        return item ? item.options : [];
      }
    },
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    disabledChoose() {
      const { makeUserId, auditUserId } = this.model;
      return (item) => {
        let arr = [makeUserId, auditUserId];

        return arr.includes(item.value);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-box {
  height: 148px;
  width: 148px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.5;
}
.hint {
  color: #d9001b;
  font-size: 14px;
  padding-left: 40px;
}
</style>