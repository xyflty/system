<template>
  <el-card>
    <avue-form
      :option="options"
      v-model="form"
      @submit="handleSubmit"
      @reset-change="resetQuery"
    >
      <template slot-scope="{ size }" slot="menuForm">
        <el-button
          v-if="isBack"
          type="primary"
          :size="size"
          icon="el-icon-back"
          @click="goBack"
          >返回</el-button
        >
      </template>
    </avue-form>
  </el-card>
</template>

<script>
export default {
  name: "QueryCard",
  props: {
    options: {
      type: Object,
      required: true,
    },
    search: {
      type: Object,
      required: true,
    },
    isBack: Boolean,
  },
  data() {
    return {
      form: this.search,
    };
  },
  methods: {
    handleSubmit(form, done) {
      this.$emit("submit", form, done);
    },
    resetQuery() {
      this.$emit("reset");
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {},
  watch: {
    search: {
      handler(newForm) {
        this.form = newForm;
      },
      deep: true,
    },
    form: {
      handler(newForm) {
        this.$emit("update:search", newForm);
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
</style>