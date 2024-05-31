
<template>
  <!-- // 资质和联系人查看 -->
  <el-dialog
    :title="`${type === 'Aptitude' ? '资质查看' : '查看联系人'}`"
    :visible.sync="dialogVisible"
    width="60%"
    append-to-body
    v-bind="$attrs"
    @close="handleClose"
  >
    <MultiTable
      v-if="dialogVisible"
      isPagination
      border
      stripe
      align="center"
      :Options="options"
      :api="apiFn"
      :parmas="query"
    />
  </el-dialog>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import { getQualification, getContactInfoList } from "@/api/core/clue";

import { ContactOptions, AptitudeOptions } from "./modelOptions/index";

export default {
  name: "AptitudeModel",
  props: {
    visible: { type: Boolean, default: false },
    archiveId: { type: String | Number },
    type: {
      type: String,
      default: "Aptitude", // 资质  Contact 联系人
    },
  },
  components: { MultiTable },
  data() {
    return {
      dialogVisible: this.visible,
      options: [],

      apiFn: null,
      query: {
        archiveId: "",
      },
    };
  },
  methods: {
    // 页面配置信息
    setOption() {
      if (this.type === "Aptitude") {
        // 资质
        this.apiFn = getQualification;
        this.options = AptitudeOptions;
      } else {
        // 联系人
        this.apiFn = getContactInfoList;
        this.options = ContactOptions;
      }
    },
    handleClose() {
      this.$emit("update:archiveId", "");
    },
  },
  mounted() {
    this.setOption();
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    archiveId(newVal) {
      this.query.archiveId = newVal;
    },
  },
};
</script>

<style lang='scss' scoped>
</style>