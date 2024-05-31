<template>
  <el-dialog
    :title="title"
    :visible.sync="upload.open"
    width="400px"
    append-to-body
  >
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip text-center" slot="tip" v-if="isTemplate">
        <span>仅允许导入xls、xlsx格式文件。</span>
        <el-link
          type="primary"
          :underline="false"
          style="font-size: 12px; vertical-align: baseline"
          @click="importTemplate"
          >下载模板</el-link
        >
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="upload.open = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  props: {
    upload: {
      type: Object,
      required: true,
    },
    title: String,
    importTemFn: Function,
    isTemplate: {
      type: Boolean,
      default: true,
    },
    loading: Boolean,
  },
  data() {
    return {
      importLoading: null,
    };
  },
  methods: {
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      console.log(this.upload, "855");
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      console.log(this.upload, "55");
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.$emit("success");
    },

    handleFileError() {
      this.$emit("update:loading", false);
    },
    /** 下载模板操作 */
    importTemplate() {
      this.importTemFn().then((response) => {
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + `${this.title}模板`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.importLoading = this.$loading({
        lock: true,
        text: "正在导入中，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$emit("update:loading", true);
      this.$refs.upload.submit();
    },
  },
  mounted() {},
  watch: {
    loading(newVal) {
      if (!newVal) {
        this.importLoading.close();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>