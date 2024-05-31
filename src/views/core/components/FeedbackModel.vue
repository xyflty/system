<template>
  <el-dialog
    :visible.sync="feedbackVisible"
    title="Tips"
    width="500"
    @close="hide"
  >
    <el-form
      :model="feedbackForm"
      :rules="feedbackRules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="反馈情况" prop="feedback">
        <el-select v-model="feedbackForm.feedback" placeholder="请选择反馈情况">
          <el-option label="无联系方式" value="无联系方式"></el-option>
          <el-option label="疑似同行" value="疑似同行"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="feedbackForm.remark"
          type="textarea"
          :rows="4"
          placeholder="请填写备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "FeedbackModel",
  data() {
    return {
      feedbackVisible: false,
      feedbackForm: {},
      feedbackRules: {
        feedback: {
          required: true,
          message: "请选择反馈情况",
          trigger: "change",
        },
        remark: { required: true, message: "请填写备注信息", trigger: "blur" },
      },
    };
  },
  methods: {
    show() {
      this.feedbackVisible = true;
    },
    hide() {
      this.$refs.ruleForm.resetFields();
      this.feedbackVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("submit", this.feedbackForm, this.hide);
        } else {
          this.$message.error("请输入必填信息");
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
</style>