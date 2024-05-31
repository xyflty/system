<template>
  <el-form-item :label="label" :prop="prop">
    <treeselect
      v-model="value"
      appendToBody
      style="margin-left: 10px; max-width: 200px"
      :options="deptOptions"
      value-consists-of="LEAF_PRIORITY"
      :show-count="true"
      :multiple="multiple"
      :placeholder="placeholder"
    />
  </el-form-item>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    deptId: {
      type: Array | String,
    },
    prop: {
      type: String,
      default: "deptId",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "归属部门",
    },
    label: {
      type: String,
      default: "",
    },
  },
  components: { Treeselect },
  data() {
    return {
      value: null,
      deptOptions: [],
    };
  },

  watch: {
    deptId: {
      handler(n) {
        if (n == undefined || n == "") {
          this.value = null;
        }
      },
    },
    value: {
      handler(n) {
        this.$emit("update:deptId", n);
      },
    },
  },
  mounted() {
    this.getTreeselect();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
  },
};
</script>

<style></style>
