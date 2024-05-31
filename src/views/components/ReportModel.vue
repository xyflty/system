// 工作报告新增编辑弹窗
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="handleClose"
    :before-close="beforeClose"
  >
    <avue-form
      ref="form"
      :option="options"
      v-model="model"
      @submit="handleQuery"
      @reset-change="handleReset"
    >
      <template slot="workSummary">
        <EditorRemark
          :remark.sync="model.workSummary"
          :editorConfig="{ readOnly: false }"
        />
      </template>
      <template slot="workPlan">
        <EditorRemark
          :remark.sync="model.workPlan"
          :editorConfig="{ readOnly: false }"
        />
      </template>
      <template slot="upload">
        <el-upload
          ref="fileRef"
          class="upload-demo"
          action="#"
          multiple
          :file-list="fileList"
          :http-request="uploadImg"
          :before-upload="(rawFile) => beforeUpload(rawFile, 'file')"
          :on-remove="
            (file, fileList) => handleFileRemove(file, fileList, 'file')
          "
        >
          <el-button size="small" type="primary">选择附件</el-button>
          <div slot="tip" class="el-upload__tip">
            支持格式:.rar .zip .doc .docx .pdf,单个文件不能超过20MB
          </div>
        </el-upload>
      </template>
      <template slot="image">
        <el-upload
          ref="imageRef"
          class="upload-demo"
          action="#"
          multiple
          list-type="picture-card"
          :file-list="imageList"
          :http-request="uploadImg"
          :before-upload="(rawFile) => beforeUpload(rawFile, 'image')"
          :on-remove="
            (file, fileList) => handleFileRemove(file, fileList, 'image')
          "
        >
          <i slot="default" class="el-icon-plus"></i>
        </el-upload>
      </template>

      <template slot-scope="{ size }" slot="menuForm">
        <el-button type="primary" :size="size" @click="saveDraft"
          >保存草稿</el-button
        >
      </template>
    </avue-form>
  </el-dialog>
</template>

<script>
import { formatDate } from "@/utils";

import { addInit } from "@/api/content/daily.js";
import { systemResourceAnnexDel } from "@/api/workOrderProcessing/qualification";
// 文件上传
import { fileUpload } from "@/api/upload/upload";

// 获取文件类型
import { getType } from "@/utils/previewAndDownload";
import { mapState } from "vuex";

import EditorRemark from "@/views/components/EditorRemark";

export default {
  name: "ReportModel",
  components: {
    EditorRemark,
  },
  props: {
    title: {
      type: String,
      default: "写工作报告",
    },
    visible: Boolean,
    form: {
      type: Object,
    },
    type: "edit" | "add",
  },
  data() {
    return {
      dialogVisible: this.visible,

      options: {},
      model: this.form,

      fileType: [".rar", ".zip", ".doc", ".docx", ".pdf"],
      imageType: [".jpg", ".png", ".JPG", ".PNG"],
      // 文件大小
      fileSize: "",

      // 存储上传文件信息
      uploadSendData: [],

      fileList: [],
      imageList: [],
    };
  },
  methods: {
    setOptions() {
      this.options.column = [
        {
          label: "报告类型",
          prop: "dailyType",
          type: "select",
          dicData: this.commonData.reportTypeEnum,
          rules: [
            {
              required: true,
              message: "请选择报告类型",
              trigger: "change",
            },
          ],
        },
        {
          label: "",
          prop: "dailyTime",
          type: "datetime",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          disabled: true,
          labelWidth: 10,
        },
        {
          label: "工作总结",
          prop: "workSummary",
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入工作总结",
              trigger: "blur",
            },
          ],
        },
        {
          label: "工作计划",
          prop: "workPlan",
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入工作计划",
              trigger: "blur",
            },
          ],
        },
        {
          label: "文件上传",
          prop: "upload",
          span: 24,
        },
        {
          label: "图片上传",
          prop: "image",
          span: 24,
        },
        {
          label: "批阅人员",
          prop: "auditUserIds",
          type: "select",
          dicData: this.commonData.userList,
          multiple: true,
          disabled: this.type === "edit",
          span: 24,
          filterable: true,
          rules: [
            {
              required: true,
              message: "请选择批阅人员",
              trigger: "change",
            },
          ],
        },
        {
          label: "抄送人员",
          prop: "ccPersonUserIds",
          type: "select",
          dicData: this.commonData.userList,
          multiple: true,
          disabled: this.type === "edit",
          filterable: true,
          span: 24,
        },
      ];
    },
    handleQuery(form, done) {
      console.log(form.workSummary);
      if (form.workSummary && form.workSummary == "<p><br></p>") {
        this.$message.error("请填写工作总结");
        done();
        return;
      }
      if (form.workPlan && form.workPlan == "<p><br></p>") {
        this.$message.error("请填写工作计划");
        done();
        return;
      }
      form.fileUpload = this.uploadSendData;
      this.$emit("submit", form, done);
    },
    handleReset() {
      this.$refs.fileRef.clearFiles();
      this.$refs.imageRef.clearFiles();
      this.dialogVisible = false;
    },

    // 初始化默认数据
    getInit() {
      addInit()
        .then((res) => {
          const { dailyType, dailyTime, auditUserIds, ccPersonUserList } =
            res.data;
          this.$nextTick(() => {
            this.model = {
              dailyType,
              dailyTime,
              workSummary: "",
              workPlan: "",
              auditUserIds: auditUserIds.split(","),
              ccPersonUserIds: ccPersonUserList.map((item) => item.userId),
            };
          });
          this.dialogVisible = true;

          console.log(this.model);
        })
        .catch((err) => {
          this.$emit("update:visible", false);
        });
    },

    // 文件上传
    beforeUpload(rawFile, uploadType) {
      const type = rawFile.name.substring(rawFile.name.lastIndexOf("."));

      let imgSize = Number(rawFile.size / 1024); // kb

      let isImage = "";
      let msg = "";
      if (uploadType === "file") {
        isImage = this.fileType.indexOf(type) > -1;
        msg = "rar/zip/doc/docx/pdf";
      } else {
        isImage = this.imageType.indexOf(type) > -1;
        msg = "jpg/png//JPG/PNG";
      }

      if (!isImage) {
        this.$message.error(`上传文件只能是 以 ${msg} 格式!`);
        return false;
      }

      if (imgSize > 20 * 1024) {
        this.$message.error("上传头像图片大小不能超过 20M!");
        return false;
      }
      this.fileSize = imgSize.toFixed(2) + "KB";
      return;
    },

    /** 图片上传 */
    uploadImg(file) {
      fileUpload(file)
        .then((res) => {
          if (res.code == 200) {
            // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台

            this.uploadSendData.push({
              fileSuffix: getType(res.data.url),
              url: res.data.url,
              fileName: res.data.fileName,
              fileSize: this.fileSize,
              uploadUser: this.name,
              dailyId: this.type === "edit" ? this.model.id : "",
              annexType: 4,
            });
          } else {
            this.$message.error("上传图片异常");
          }
        })
        .finally((err) => {
          console.log(err);
        });
    },
    // 删除图片
    handleFileRemove(file, fileList, type) {
      console.log(file, "file");
      if (file.id) {
        // 有id通过接口删除
        systemResourceAnnexDel(file.id);
      }
      console.log(this.uploadSendData, "上传文件1111");
      // 清除上传的数据
      const index = this.uploadSendData.findIndex(
        (item) => item.fileName === file.name
      );
      console.log({ index });
      this.uploadSendData.splice(index, 1);

      console.log(this.uploadSendData, "上传文件");
      if (type === "image") {
        this.imageList = fileList;
      } else {
        this.fileList = fileList;
      }
    },

    handleClose() {
      this.$refs.form.resetForm();
    },
    // 关闭前缓存表单数据
    beforeClose(done) {
      this.saveDraft();
      console.log("关闭了");
      done();
    },

    // 保存草稿
    saveDraft() {
      const { auditUserIds, ccPersonUserIds, dailyTime, dailyType } =
        this.model;
      console.log(this.model, "model");
      if (
        dailyType &&
        dailyTime &&
        auditUserIds.length &&
        ccPersonUserIds.length
      ) {
        // 基础数据存在了，才能进行缓存
        let form = {
          ...this.model,
          dailyAnnexList: this.uploadSendData,
        };
        sessionStorage.setItem("DRAFT_KEY", JSON.stringify(form));
      }
    },
    // 初始化表单数据
    initModel(newForm) {
      this.fileList = [];
      this.imageList = [];
      const { dailyAnnexList } = newForm;
      dailyAnnexList &&
        dailyAnnexList.forEach((item) => {
          if (
            ["rar", "zip", "doc", "docx", "pdf", "word"].includes(
              item.fileSuffix
            )
          ) {
            this.fileList.push({
              name: item.fileName,
              url: item.url,
              id: item.id,
            });
          }
          if (["jpg", "png"].includes(item.fileSuffix)) {
            this.imageList.push({
              name: item.fileName,
              url: item.url,
              id: item.id,
            });
          }
        });
    },
  },
  mounted() {
    this.setOptions();
  },
  watch: {
    visible(newVal) {
      if (newVal && this.type === "add") {
        if (sessionStorage.getItem("DRAFT_KEY")) {
          let newForm = JSON.parse(sessionStorage.getItem("DRAFT_KEY"));

          this.uploadSendData = newForm.dailyAnnexList;
          this.initModel(newForm);

          delete newForm.dailyAnnexList;
          this.model = newForm;
          this.model.dailyTime = formatDate(Date.now());
          this.dialogVisible = newVal;
        } else {
          this.getInit();
        }
      } else {
        this.dialogVisible = newVal;
      }
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    form: {
      handler(newForm) {
        this.initModel(newForm);
        this.model = newForm;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState({
      name: (state) => state.user.name,
    }),
  },
};
</script>

<style lang='scss' scoped>
</style>