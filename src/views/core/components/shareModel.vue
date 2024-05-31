<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    v-bind="$attrs"
    width="500px"
    @close="reset('ruleForm', 'close')"
  >
    <el-form
      :model="shareForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="共享人员" prop="shareUserId">
        <el-select
          filterable
          v-model="shareForm.shareUserId"
          placeholder="请选择共享人员"
        >
          <el-option
            v-for="item in commonData.userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
      <el-button v-if="callOff" type="danger" @click="reset('ruleForm')"
        >取消共享</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { mapState } from "vuex";
export default {
  name: "ShareModel",
  props: {
    title: {
      type: String,
      default: "设置共享",
    },
    visible: Boolean,
    form: Object,
  },
  data() {
    return {
      dialogVisible: this.visible,
      shareForm: {},
      rules: {},
      // 是否显示取消按钮
      callOff: false,
    };
  },
  methods: {
    isShow() {
      const { shareUserId } = this.form;
      if (shareUserId) {
        this.callOff = true;
      } else {
        this.callOff = false;
      }
    },
    submit(formName) {
      this.$emit("share", {
        form: this.$refs[formName],
        model: this.shareForm,
      });
    },
    reset(formName, type) {
      this.$refs[formName].resetFields();
      this.$emit("reset", { form: this.$refs[formName], type });
    },
  },
  mounted() {
    this.$store.dispatch("commonData/getUserList");
    this.isShow();
  },
  watch: {
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    form: {
      handler(newVal) {
        this.shareForm = cloneDeep(newVal);
        this.isShow();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
</style>