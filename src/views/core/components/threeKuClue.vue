<template>
  <el-dialog
    title="三库转线索"
    :visible.sync="dialogVisible"
    width="50%"
    @close="handleReset"
  >
    <avue-form
      v-model="addForm"
      :option="option"
      @submit="submit"
      @reset-change="handleReset"
    >
      <template slot-scope="{ disabled, size }" slot="contactInfoList">
        <div>
          <addPerson :list.sync="addForm.contactInfoList" :rules="rules" />
        </div>
      </template>
    </avue-form>
  </el-dialog>
</template>

<script>
import addPerson from "./addPerson.vue";
export default {
  components: { addPerson },
  props: {
    visible: Boolean,
    form: Object,
  },
  data() {
    return {
      dialogVisible: this.visible,
      option: {
        emptyText: "取消",
        column: [
          {
            label: "资源名称",
            prop: "companyName",
            row: true,
            span: 24,
            disabled: true,
          },
          //   {
          //     label: "成立时间",
          //     prop: "setUpTime",
          //     type: "datetime",
          //     format: "yyyy-MM-dd",
          //     valueFormat: "yyyy-MM-dd",
          //     row: true,
          //     span: 24,
          //     disabled: true,
          //   },
          {
            label: "联系人",
            prop: "contactInfoList",
            formslot: true,
            row: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "联系人不能为空",
                trigger: ["blur", "change"],
              },
            ],
          },
        ],
      },

      addForm: {},

      rules: {
        contactInfoList: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: ["blur", "change"],
          },
        ],
        cellphone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不对",

            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit(form, done) {
      this.$emit("submit", form, done);
    },
    handleReset() {
      this.$emit("reset");
    },
  },
  mounted() {},
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    form: {
      handler(newForm) {
        console.log(newForm);
        this.addForm = { ...newForm, contactInfoList: [] };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang='scss' scoped>
</style>