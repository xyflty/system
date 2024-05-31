<template>
  <treeselect
    v-model="value"
    appendToBody
    style="margin-left: 10px; max-width: 400px"
    multiple
    :options="deptOptions"
    value-consists-of="LEAF_PRIORITY"
    :show-count="true"
    :placeholder="placeholder"
    @close="handleClose"
  />
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    Treeselect,
  },
  props: {
    deptId: {
      type: String | Array,
    },
    placeholder: {
      type: String,
      default: "请选择归属部门",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: "",
      deptOptions: [],
    };
  },

  watch: {
    deptId: {
      handler(n) {
        this.value = n;
      },
      immediate: true,
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

    handleClose() {
      console.log(this.value);
      console.log(this.value.join(","));
      this.$emit("update:deptld", this.value.join(","));
    },
  },
};
</script>
