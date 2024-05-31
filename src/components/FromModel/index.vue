// 弹窗框表单
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    v-bind="config && config.attrs"
    @close="hide"
  >
    <div v-if="$slots.title" slot="title" class="clearfix">
      <slot name="title"></slot>
    </div>
    <div class="content_box">
      <avue-form
        ref="formRef"
        :option="option"
        v-model="model"
        @submit="submit"
      >
        <!-- <template > </template> -->
        <template
          v-for="item in slotOptions"
          slot-scope="{ disabled, size }"
          :slot="item.prop"
        >
          <slot
            :name="item.prop"
            :slot-scope="{ disabled, size }"
            :model="model"
          ></slot>
        </template>
      </avue-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <slot v-if="$slots.footer" name="footer" :model="model"></slot>
      <div v-else>
        <el-button @click="hide">{{ emptyText }}</el-button>
        <el-button type="primary" @click="$refs.formRef.submit()">{{
          submitText
        }}</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "FromModel",
  props: {
    title: {
      type: String,
      default: "提示",
    },
    emptyText: {
      type: String,
      default: "取消",
    },
    submitText: {
      type: String,
      default: "确定",
    },
    config: { type: Object, default: null },
    // 配置信息
    option: {
      type: Object,
      required: true,
    },
    form: { type: Object, default: () => {} },
  },
  data() {
    return {
      dialogVisible: false,
      model: {},
    };
  },
  methods: {
    // 显示
    show(data) {
      this.dialogVisible = true;
    },

    // 隐藏
    hide() {
      this.$refs.formRef.resetFields();

      this.dialogVisible = false;
    },
    // 提交
    submit(form, done) {
      this.$emit("submit", form, done, this.hide);
    },
  },
  mounted() {},
  computed: {
    slotOptions() {
      return (
        this.option.column && this.option.column.filter((item) => item.formslot)
      );
    },
  },
  watch: {
    form(val) {
      this.model = val;
    },
    model(val) {
      this.$emit("update:form", val);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>