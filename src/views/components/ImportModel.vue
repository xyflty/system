<template>
  <!-- 导入对话框 -->
  <div :class="['loading-box', { zIndex: loading }]">
    <div class="loading-mask" v-if="loading">
      <div class="loader"></div>
      <span>数据正在导入中，请稍等...</span>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="400px"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "ImportModel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: "文件上传",
    },

    // 模版的url地址
    templateUrl: {
      type: String,
      default: "",
    },
    // 模版的名称
    templateName: {
      type: String,
      default: "模版",
    },
    // 自定义模版方法（使用了模版的url和名称失效）
    templateFn: {
      type: Function,
      default: null,
    },
    // 文件的上传地址
    action: {
      type: String,
      required: true,
    },
  },
  // emits:[success,error,progress]
  /**
   * success  文件上传成功
   * error  文件上传失败
   * progress  文件上传进度
   */

  data() {
    return {
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + this.action,
      },

      dialogVisible: this.visible,

      loading: false,
    };
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      if (this.templateFn) {
        this.templateFn();
      } else {
        this.download(
          this.templateUrl,
          {},
          `${this.templateName}_${new Date().getTime()}.xlsx`
        );
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      console.log(event, file, fileList);
      this.upload.isUploading = true;
      this.$emit("progress", { event, file, fileList });
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.dialogVisible = false;
      this.upload.isUploading = false;
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.$emit("success", { response, file, fileList });
    },

    handleError(err, file, fileList) {
      this.$message.error(err);
      this.loading = false;
      this.$emit("error", { err, file, fileList });
    },

    // 提交上传文件
    submitFileForm() {
      this.loading = true;
      this.$refs.upload.submit();
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
  },
};
</script>

<style lang="scss" scoped>
.loading-box {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  display: none;
  background: rgba($color: #000000, $alpha: 0.3);
}
.zIndex {
  z-index: 9999;
  display: block;
}
</style>
