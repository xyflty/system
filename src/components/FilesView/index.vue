<template>
  <div>
    <input v-show="false" type="file" ref="fileButton" @change="handleChange" />
    <el-button v-if="isUpdatePreview" @click="handlePrev">{{
      updatePreviewText
    }}</el-button>
    <div class="fileView" ref="fileViewRef"></div>
  </div>
</template>

<script>
import axios from "axios";
import { readBuffer } from "@/utils";
import render from "./utils";
export default {
  props: {
    url: {
      type: String,
    },
    isUpdatePreview: {
      type: Boolean,
      default: false,
    },
    updatePreviewText: {
      type: String,
      default: "上传预览",
    },
  },
  data() {
    return {
      images: "",
    };
  },
  methods: {
    async handleChange(e) {
      const [file] = e.target.files;
      const dot = file.name.lastIndexOf(".");
      let type = file.name.substr(dot + 1);
      const { fileViewRef } = this.$refs;
      // 生成新的dom
      const node = document.createElement("div");
      let arr = ["doc", "xls", "pptx"];

      if (fileViewRef.lastChild) {
        fileViewRef.removeChild(fileViewRef.lastChild);
      }

      const child = fileViewRef.appendChild(node);
      if (arr.includes(type)) {
        child.innerHTML = `<div style="text-align: center; margin-top: 80px">不支持.${type}格式的在线预览，请下载后预览或转换为支持的格式</div>
  <div style="text-align: center">支持docx, xlsx,, pdf, 以及纯文本格式和各种图片格式的在线预览</div>`;
        return;
      }
      const arrayBuffer = await readBuffer(file);
      render(arrayBuffer, type, child);
    },
    loadFromUrl(url) {
      const filename = url.substr(url.lastIndexOf("/") + 1);

      axios({
        url,
        method: "get",
        responseType: "blob",
      }).then((res) => {
        console.log(res, "res");
        const file = new File([res.data], filename, {});
        console.log({ file });
        this.handleChange({ target: { files: [file] } });
      });
    },
    handlePrev() {
      this.$refs["fileButton"].click();
    },
  },
  watch: {
    url() {
      this.loadFromUrl(this.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.fileView {
  display: flex;
  justify-content: center;
}
</style>