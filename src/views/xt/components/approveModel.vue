<template>
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
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object,
    },
    form: {
      type: Object,
    },
  },
  data() {
    return {
      approveDialog: this.visible,
      approveForm: this.form,
      approveRules: this.rules,
    };
  },
  methods: {
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
    approveConfirm(formName) {
      this.$emit("confim", {
        form: this.$refs[formName],
        model: this.approveForm,
      });
    },
    approveConcel(formName) {
      this.$emit("concel", { form: this.$refs[formName] });
    },
  },
  mounted() {},
  watch: {
    approveDialog(newVal) {
      this.$emit("update:visible", newVal);
    },
    visible(newVal) {
      this.approveDialog = newVal;
    },
  },
  computed: {
    // 获取state仓库存储的数据
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

<style lang='scss' scoped>
</style>