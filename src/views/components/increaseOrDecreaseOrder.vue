// 项目变更
<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :show-close="false"
      size="80%"
      v-bind="$attrs"
      @close="handleCancel"
    >
      <template #title>
        <div class="drawer-header">
          <div class="drawer-title">
            <span v-if="title">{{ title }}</span>
            <span v-else>{{
              `${tableRow.title} + ${tableRow.orderCode} + 项目变更审核操作`
            }}</span>
          </div>
          <div class="drawer-btn">
            <div v-if="type !== 'show'">
              <el-button type="primary" @click="handleSubmit">提交</el-button>
              <!-- 第一次配置才显示取消 -->
              <el-button v-if="type === 'once'" @click="handleCancel"
                >取消</el-button
              >
            </div>
            <el-button v-else type="primary" @click="handleAudit"
              >审批</el-button
            >
          </div>
        </div>
      </template>
      <div class="drawer-form">
        <div class="tableCard-container" v-if="type === 'show'">
          <the-descriptions
            title="基础信息"
            border
            :column="2"
            :comparison="comparison"
            :data="form.zwOrderVo"
          >
          </the-descriptions>
        </div>
        <el-form
          ref="formRef"
          label-width="120px"
          :model="form"
          :label-position="type === 'show' ? 'top' : 'right'"
        >
          <el-form-item label="关联项目" prop="orderProjects">
            <addProject
              :type="type"
              :orderProjects.sync="form.zwOrderProjectVoList"
              :id="id"
              :tableRow="tableRow"
              :recordData="tableData"
            />
          </el-form-item>
          <el-form-item label="当前更改记录" v-if="type !== 'show'">
            <MultiTable
              border
              align="center"
              isIndex
              indexLabel="序号"
              :data="tableData"
              :Options="tableOption"
              :isSlice="tableDataSlice"
              :sliceNum="5"
            >
              <template #originalTotle="{ scope }">
                <span>{{
                  scope.originalUnitPrice * scope.originalQuantity
                }}</span>
              </template>
              <template #changeTotle="{ scope }">
                <span v-if="scope.changeUnitPrice && scope.changeQuantity">{{
                  scope.changeUnitPrice * scope.changeQuantity
                }}</span>
                <span v-else>--</span>
              </template>
            </MultiTable>
            <div class="card-footer" style="justify-content: center">
              <p style="cursor: pointer" @click="catMore('tableData')">
                {{ tableDataSlice ? "查看更多" : "收起" }}
              </p>
            </div>
          </el-form-item>
          <el-form-item label="历史更改记录" v-if="type !== 'once'">
            <MultiTable
              border
              align="center"
              isIndex
              indexLabel="序号"
              :data="form.xtOrderProjectChangeAuditList"
              :Options="tableOption"
              :isSlice="isSlice"
              :sliceNum="5"
            >
              <template #originalTotle="{ scope }">
                <span>{{
                  scope.originalUnitPrice * scope.originalQuantity
                }}</span>
              </template>
              <template #changeTotle="{ scope }">
                <span v-if="scope.changeUnitPrice && scope.changeQuantity">{{
                  scope.changeUnitPrice * scope.changeQuantity
                }}</span>
                <span v-else>--</span>
              </template>
            </MultiTable>
            <div class="card-footer" style="justify-content: center">
              <p
                style="cursor: pointer"
                @click="catMore('xtOrderProjectChangeAuditList')"
              >
                {{ isSlice ? "查看更多" : "收起" }}
              </p>
            </div>
          </el-form-item>
          <el-row>
            <!-- 第一次配置（市场主管）才显示审批人 -->
            <el-col :span="9" v-if="type === 'once'">
              <el-form-item
                v-for="(domain, index) in form.auditUserIds"
                :label="'审批人' + Number(+index + 1)"
                :key="domain.key"
                :prop="'auditUserIds.' + index + '.id'"
                :rules="{
                  required: true,
                  message: '审批人不能为空',
                  trigger: 'blur',
                }"
              >
                <el-select
                  v-model="domain.id"
                  style="width: 80%; margin-right: 15px"
                  filterable
                  remote
                  reserve-keyword
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    v-bind="item"
                    :disabled="disabledChoose(item)"
                  ></el-option>
                </el-select>
                <el-button type="danger" @click.prevent="removeDomain(domain)"
                  >删除</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addDomain">新增</el-button>
              </el-form-item>

              <el-form-item label="提醒谁看" prop="remindUserIds">
                <el-select
                  v-model="form.toUserIds"
                  multiple
                  style="width: 100%"
                  filterable
                  remote
                  reserve-keyword
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    v-bind="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="备注">
                <div style="border: 1px solid #ccc">
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="editorMode"
                  />
                  <Editor
                    style="height: 300px; overflow-y: hidden"
                    v-model="form.remark"
                    :defaultConfig="editorConfig"
                    :mode="editorMode"
                    @onCreated="onCreated"
                  />
                </div>
              </el-form-item>
              <el-form-item label="附件">
                <el-upload
                  ref="uploadRef"
                  action="#"
                  list-type="picture-card"
                  :file-list="form.xtResourceAnnexList"
                  :http-request="uploadImg"
                  :before-upload="beforeUpload"
                >
                  <i class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                        <i class="el-icon-download"></i>
                      </span>
                      <!-- <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span> -->
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 数据展示时展示审批人信息 -->
        <div class="approval" v-if="type === 'show'">
          <h3>审批结果</h3>
          <div class="approval-warp">
            <div
              class="approval-content"
              v-for="item in form.zwAuditDetailVoList"
              :key="item.id"
            >
              <dl>
                <dt>审批人：</dt>
                <dd>
                  <span>{{ item.auditUserName }}</span>
                  <span>{{ auditStatusText(item.auditStatus) }}</span>
                </dd>
              </dl>
              <dl>
                <dt>审批结果：</dt>
                <dd>{{ item.remark }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import addProject from "@/views/components/AddProject.vue";
import MultiTable from "@/components/MultiTable";
import TheDescriptions from "@/components/TheDescriptions";

import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";
// 获取文件类型
import { getType } from "@/utils/previewAndDownload";
// 文件上传
import { fileUpload } from "@/api/upload/upload";
import { systemResourceAnnex } from "@/api/workOrderProcessing/qualification";
import cloneDeep from "lodash/cloneDeep";
import { mapState, mapGetters } from "vuex";
export default {
  name: "orderDrawer",
  components: { addProject, MultiTable, Editor, Toolbar, TheDescriptions },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: "rtl",
    },
    title: {
      type: String,
      default: "",
    },
    drawerForm: {
      type: Object,
    },
    type: {
      type: String,
      default: "once",
    },
    id: {
      type: [String, Number],
      default: "",
    },
    tableRow: {
      type: Object,
    },
  },
  data() {
    return {
      comparison: [
        {
          label: "订单编号：",
          prop: "orderCode", //1
        },
        {
          label: "合同编号：",
          prop: "contractCode",
        },
        {
          label: "订单名称：",
          prop: "title", //
        },
        {
          label: "订单类型：",
          prop: "orderType", //
          formatter: (val) => {
            return formatterCallback(this.commonData.xtOrderType, val);
          },
        },

        {
          label: "签约时间：",
          prop: "signTime", //
        },
        {
          label: "订单签约主体：",
          prop: "subjectDeptName", //
        },
        {
          label: "订单所属部门：",

          prop: "ascriptionDeptName", //
        },
        {
          label: "订单所属人：",

          prop: "launchUserName", //
        },
        {
          label: "订单转化人员：",

          prop: "transUserName", //
        },
        {
          label: "经办部门：",
          prop: "handleDeptName",
        },
        {
          label: "经办人员：",
          options: [], //遍历系统所有人员呈现
          prop: "handleUserName", //
        },
        {
          label: "客户名称：",
          prop: "companyName", //1
        },
        {
          label: "客户类型：",
          prop: "customerType",
          formatter: (val) => {
            return ["企业", "个人"][val];
          },
        },
        {
          label: "订单状态：",
          prop: "orderStatus",
          formatter: (val) => {
            return formatterCallback(this.commonData.orderStatusList, val);
          },
        },
        {
          label: "订单创建时间：",
          prop: "createTime", //
        },
        {
          label: "订单创建人员：",
          prop: "createBy", //
        },
      ],
      drawer: this.visiable,
      form: {},
      fileList: [],
      tableData: [],
      isSlice: true,
      tableDataSlice: true,

      tableOption: [
        {
          label: "项目分类",
          prop: "projectCategoryName",
          width: "240px",
        },
        {
          label: "项目类型",
          prop: "projectType",
          width: "150px",
        },
        {
          label: "项目名称",
          prop: "projectName",
          width: "300px",
        },
        {
          label: "是否赠品",
          prop: "isGift",
          width: "120px",
          formatter: (row, column, val) => {
            return formatterCallback(this.commonData.isGift, val);
          },
        },
        {
          label: "类型",
          prop: "changeType",
          width: "120px",
          formatter: (row, column, val) => {
            return formatterCallback(
              this.commonData.orderProjectChangeType,
              val
            );
          },
        },

        {
          label: "更改后单价",
          prop: "changeUnitPrice",
          width: "120px",
        },
        {
          label: "更改后数量",
          prop: "changeQuantity",
          width: "120px",
        },
        {
          label: "更改后总价",
          slotName: "changeTotle",
          width: "120px",
        },
        {
          label: "原单价",
          prop: "originalUnitPrice",
          width: "120px",
        },

        {
          label: "原数量",
          prop: "originalQuantity",
          width: "120px",
        },
        {
          label: "原总价",
          slotName: "originalTotle",
          width: "120px",
        },
        {
          label: "变更时间",
          prop: "createTime",
          width: "180px",
        },
      ],

      dialogVisible: false,
      dialogImageUrl: "",
      disabled: false,

      // 富文本
      editor: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly: this.mode === "show",
      },
      editorMode: "simple", // or 'simple'

      uploadObj: {},
      detailId: this.id, //当前操作表格行操作的id

      uploadSendData: [], //文件上传的参数
    };
  },
  methods: {
    auditStatusText(status) {
      return formatterCallback(this.commonData.auditstatus, status);
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // 初始化表单数据
    initForm() {
      this.form = cloneDeep(this.drawerForm);
    },
    // 取消操作
    handleCancel() {
      this.$refs.uploadRef.clearFiles();
      this.$emit("cancel", this.drawer);
      this.tableData = [];
    },
    // 提交
    handleSubmit() {
      console.log(this.form, 665);
      if (!this.tableData.length) {
        return this.$message.error("请选择要增减单的项目");
      }

      let sendForm = {
        ...this.form,
        xtOrderProjectChangeAuditList: this.tableData,
      };
      console.log({ sendForm }, "sendForm");

      this.$emit("submit", { model: sendForm, form: this.$refs.formRef });
    },
    handleAudit() {
      this.$emit("audit");
    },

    // 新增审批人
    addDomain() {
      this.form.auditUserIds.push({
        id: "",
        key: Date.now(),
      });
    },
    // 移除审批人
    removeDomain(item) {
      var index = this.form.auditUserIds.indexOf(item);
      if (index !== -1) {
        this.form.auditUserIds.splice(index, 1);
      }
    },
    // 移除图片
    // handleRemove(file) {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 下载
    handleDownload(file) {},

    // 上传之前对文件进行校验
    beforeUpload(rawFile) {
      let fileType = [
        ".jpg",
        ".png",
        ".JPG",
        ".PNG",
        ".pdf",
        ".PDF",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".txt",
        ".zip",
        ".rar",
      ];
      const type = rawFile.name.substring(rawFile.name.lastIndexOf("."));

      const isImage = fileType.indexOf(type) > -1;

      let imgSize = Number(rawFile.size / 1024); // kb

      if (!isImage) {
        this.$message.error("上传文件只能是 以.xml,.doc,.docx,.pdf 格式!");
        return false;
      }
      if (imgSize > 20 * 1024) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
        return false;
      }
      this.uploadObj.fileSize = imgSize.toFixed(2) + "KB";
      return;
    },
    /** 图片上传 */
    uploadImg(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台

          this.uploadSendData.push({
            fileSuffix: getType(res.data.url),
            url: res.data.url,
            fileName: res.data.fileName,
            uploadedId: this.detailId,
            annexType: 3,
            uploadUser: this.name,
          });
          systemResourceAnnex(this.uploadSendData).then((res) => {
            if (res.code === 200) {
              this.$message.success("已成功上传");
              this.uploadSendData = [];
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("上传图片异常");
          this.uploadSendData = [];
        }
      });
    },
    catMore(type) {
      if (type === "xtOrderProjectChangeAuditList") {
        this.isSlice = !this.isSlice;
      } else {
        this.tableDataSlice = !this.tableDataSlice;
      }
    },
  },
  mounted() {
    this.$store.dispatch("commonData/getUserList");
    this.initForm();
  },
  watch: {
    visiable(newVal) {
      this.drawer = newVal;
    },
    drawer(newVal) {
      this.$emit("update:visiable", newVal);
    },
    drawerForm() {
      this.initForm();
    },
    id(newVal) {
      this.detailId = newVal;
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
      userList: (state) => state.commonData.userList,
    }),
    ...mapGetters(["name"]),
    disabledChoose() {
      return (item) => {
        let arr = this.form.auditUserIds.map((item) => item.id);

        return arr.includes(item.value);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .drawer-title {
    font-size: 16px;
    color: #333;
    span {
      font-weight: 600;
    }
  }
  .drawer-btn {
    margin-right: 20px;
  }
}
.drawer-form {
  padding: 20px;
  .approval {
    .approval-warp {
      border: 1px solid #dfe6ec;
      border-radius: 5px;
      padding: 15px 30px;
      background: #f8f8f9;
    }

    h3 {
      margin-bottom: 20px;
    }
    .approval-content {
      display: flex;
      align-items: center;
      margin: 10px 0;
      dl {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 16px;
        margin-right: 50px;
        dd {
          span {
            &:first-child {
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
  ::v-deep .el-form-item__label {
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }
}
.card-footer {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  background: #f8f8f9;
  span {
    color: red;
    font-size: 16px;
    font-weight: 500;
  }
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(233, 233, 233);
}
</style>
