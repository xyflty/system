<template>
  <!-- 添加跟进记录对话框 -->
  <el-dialog
    title="新增报价"
    :visible="showAddForm"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="form.companyName" disabled placeholder="企业名称" />
      </el-form-item>
      <el-form-item label="是否老客户" prop="isOldCustomer">
        <el-select v-model="form.isOldCustomer" placeholder="请选择">
          <el-option label="是" :value="1"> </el-option>
          <el-option label="否" :value="0"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="showProject == true"
        label="报价项目类型"
        prop="projectCategory"
        class="is-required"
      >
        <el-radio-group v-model="projectCategory" @change="changeDate">
          <el-radio disabled :label="1">单安证项目/劳务项目</el-radio>
          <el-radio disabled :label="4">资质项目</el-radio>
          <el-radio disabled :label="2">安证+人才项目/单人才项目</el-radio>
          <el-radio disabled :label="3">其他项目</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="showProject == false"
        label="报价项目类型"
        prop="projectCategory"
        class="is-required"
      >
        <el-radio-group v-model="projectCategory" @change="changeDate">
          <el-radio :label="1">单安证项目/劳务项目</el-radio>
          <el-radio :label="4">资质项目</el-radio>
          <el-radio :label="2">安证+人才项目/单人才项目</el-radio>
          <el-radio :label="3">其他项目</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="以往合作项目" prop="beforeProject">
        <el-input v-model="form.beforeProject" placeholder="以往合作项目" />
      </el-form-item>
      <el-form-item label="现合作项目 " prop="nowProject">
        <el-input v-model="form.nowProject" placeholder="现合作项目" />
      </el-form-item>
      <el-form-item label="报价内容及价格 " prop="priceContent">
        <el-input v-model="form.priceContent" placeholder="报价内容及价格" />
      </el-form-item>
      <el-form-item label=" 低于限价原因" prop="reason">
        <el-input v-model="form.reason" placeholder="低于限价原因" />
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <el-cascader
          :props="{ value: 'label' }"
          v-model="form.area"
          :options="areaList"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="同行低价截图" prop="content">
        <el-upload
          class="avatar-uploader"
          action=""
          :multiple="false"
          :file-list="fileList"
          :http-request="uploadImg"
          :show-file-list="true"
          list-type="picture-card"
          :limit="5"
          :auto-upload="true"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="审核人1" prop="auditor1">
        <el-select
          style="width: 100%"
          v-model="form.auditor1"
          filterable
          clearable
          :disabled="modifyForm ? true : false"
          placeholder="请输入关键字搜索用户"
          remote
          id="auditor1"
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="审核人2" prop="auditor2">
        <div v-if="showExamine == true">
          <el-select
            style="width: 100%"
            disabled
            v-model="form.auditor2"
            filterable
            clearable
            id="auditor2"
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </div>
        <div v-if="showExamine == false">
          <el-select
            style="width: 100%"
            v-model="form.auditor2"
            filterable
            clearable
            :disabled="modifyForm ? true : false"
            id="auditor2"
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item
        label="审核人3"
        prop="auditor3"
        v-if="projectCategory != 4 || user.user.deptId != '1643056146109161474'"
      >
        <div v-if="showExamine == true">
          <el-select
            style="width: 100%"
            v-model="form.auditor3"
            filterable
            clearable
            disabled
            id="auditor3"
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </div>

        <div v-if="showExamine == false">
          <el-select
            style="width: 100%"
            v-model="form.auditor3"
            filterable
            clearable
            :disabled="modifyForm ? true : false"
            id="auditor3"
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item
        v-if="projectCategory == 2 && user.user.deptId != '1643056146109161474'"
        label="审核人4"
        prop="auditor4"
      >
        <el-select
          v-if="showCopy == true"
          style="width: 100%"
          v-model="form.auditor4"
          filterable
          clearable
          disabled
          id="auditor4"
          placeholder="请输入关键字搜索用户"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>

        <el-select
          v-if="showCopy == false"
          style="width: 100%"
          v-model="form.auditor4"
          filterable
          clearable
          :disabled="modifyForm ? true : false"
          id="auditor4"
          placeholder="请输入关键字搜索用户"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="提醒谁看" prop="remindUserIds">
        <el-select
          style="width: 100%"
          v-model="form.remindUserIds"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索用户"
        >
          <el-option
            v-for="item in options"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>

      <template>
        <span class="personnel">抄送人员</span>

        <el-select
          v-if="showModify == true"
          class="select-input"
          disabled
          multiple
          clearable
          v-model="optionsValue"
          filterable
          placeholder="请选择抄送人员"
        >
          <el-option
            v-for="item in options"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>

        <template v-if="showModify == false">
          <el-select
            v-show="showSearchMan == 2"
            class="select-input"
            clearable
            disabled
            v-model="optionsValue"
            filterable
            placeholder="请选择抄送人员"
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>

          <el-select
            v-show="showSearchMan == 1"
            class="select-input"
            multiple
            clearable
            v-model="optionsValue"
            filterable
            placeholder="请选择抄送人员"
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </template>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUser, listUserSearch, template } from "@/api/system/user";
import { fileUpload } from "@/api/upload/upload";

import { area } from "@/utils/area";

import {
  addAuditReferPrice,
  modifyAuditReferPrice,
} from "@/api/core/auditReferPrice";

import {
  channelChannelAuditReferPriceEdit,
  channelChannelAuditReferPriceAdd,
} from "@/api/irrigationDitch/opportunity";

import { mapState } from "vuex";

export default {
  name: "addPrice",
  watch: {},
  props: {
    showAddForm: {
      type: Boolean,
      default: false,
    },
    modifyForm: {
      type: Object,
      default: () => {},
    },
    companyName: {
      type: String,
      default: "",
    },
    quotedArea: {
      type: Array,
      default: () => {
        return [];
      },
    },
    projectData: {
      type: Number,
      default: 3,
    },
    // 渠道部是1
    type: {
      type: String,
      default: "0",
    },
    customerType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      fileList: [],
      options: [],
      optionsArr: [],
      optionsValue: [],

      form: {
        companyName: "",
        beforeProject: "",
        isOldCustomer: "",
        nowProject: "",
        priceContent: "",
        reason: "",
        remindUserIds: [],
        area: [],
        auditor1: "",
        auditor2: "",
        auditor3: "",
        auditor4: "",

        // optionsValue: [],
      },
      userList: [],
      projectCategory: 3,
      setData: [],
      setData2: [],
      // 跟进表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        isOldCustomer: [
          { required: true, message: "是否老客户不能为空", trigger: "change" },
        ],
        beforeProject: [
          {
            required: true,
            message: "以往合作项目不能为空",
            trigger: "blur",
          },
        ],
        nowProject: [
          { required: true, message: "现合作项目不能为空", trigger: "blur" },
        ],
        priceContent: [
          {
            required: true,
            message: "报价内容及价格不能为空",
            trigger: "blur",
          },
        ],
        reason: [
          { required: true, message: "低于限价原因不能为空", trigger: "blur" },
        ],
        auditor1: [
          { required: true, message: "审核人1不能为空", trigger: "change" },
        ],
        auditor2: [
          { required: true, message: "审核人2不能为空", trigger: "change" },
        ],
        auditor3: [
          { required: true, message: "审核人3不能为空", trigger: "change" },
        ],
        auditor4: [
          { required: true, message: "审核人4不能为空", trigger: "change" },
        ],
        area: [{ required: true, message: "地区不能为空", trigger: "change" }],
      },
      showExamine: false, // 判断当前类型是否为单安证和安证加人才
      showCopy: false, // 判断类型是否为安证加人才 为安证加人才抄送人员显示默认且无法更改
      showOneExa: false, // 判断能否识别当前主管 可以的话当前选择无法更改，否的话需手动选择
      showProject: false, // 判断进来是是修改页面进来 是则无法修改 否则可以选择
      showPint: false, // 根据条件展示相应提示框
      showSearchMan: 1, // 根据搜索人员展示相关条件
      showModify: false, // 当点击为修改时展示另一组抄送人

      areaList: area.filter((item) => item.value == "44"),

      deptId: "",
    };
  },
  watch: {
    modifyForm: {
      handler(n) {
        console.log({ n });
        const {
          companyName,
          beforeProject,
          isOldCustomer,
          nowProject,
          priceContent,
          reason,
          remindUserId,
          imgUrlArr,
          auditDetailVoList,
          recipients,
          projectCategory,
          area,
        } = n;

        let cityArea = [];

        if (area && typeof area === "string") {
          cityArea = area.split("-");
        }

        this.form = {
          companyName,
          beforeProject,
          isOldCustomer,
          nowProject,
          priceContent,
          reason,
          area: cityArea,
          remindUserIds: remindUserId,
        };
        this.optionsValue = [];

        console.log(recipients);

        if (projectCategory !== null) {
          this.projectCategory = projectCategory;
          this.showProject = true;
          this.showSearchMan = 3;
          this.showModify = true;
          if (recipients) {
            this.optionsValue = recipients.split(",");
          }
        } else {
          this.projectCategory = 3;
          this.showProject = false;
        }

        this.fileList = [];
        if (imgUrlArr != null && imgUrlArr.length) {
          imgUrlArr.forEach((item) => {
            this.fileList.push({
              name: `${item.split("/")[item.split("/").length - 1]}`,
              status: "success",
              uid: Date.now() - Math.floor(Math.random() * 10),
              url: item,
            });
          });
        }
        // this.getUList();
        if (auditDetailVoList != null && auditDetailVoList.length) {
          auditDetailVoList.forEach((item, index) => {
            this.$set(this.form, `auditor${index + 1}`, item.auditUserId);
          });
        }
      },
      deep: true,
    },
    companyName: {
      handler(n) {
        if (n) this.form.companyName = n;

        this.fileList = [];
      },
      deep: true,
      immediate: true,
    },
    quotedArea: {
      handler(n) {
        if (n) this.form.area = n;
      },
      deep: true,
      immediate: true,
    },
    optionsValue: {
      handler(n) {
        // this.optionsValue=this.optionsArr
      },
      deep: true,
    },
    "form.remindUserIds": {
      handler(n) {
        // this.optionsValue=this.optionsArr
      },
      deep: true,
    },
    "form.auditor1": {
      handler(n) {
        if (n == "") {
          // this.form.auditor2 = "";
          // this.form.auditor3 = "";
        } else {
          // this.changeDate()
        }
      },
    },
    "form.auditor2": {
      handler(n) {
        if (n == "") {
          this.form.auditor3 = "";
        }
        if (this.showPint == true) {
          // this.$message.error("请按顺序填写审核1字段");
        } else {
          if (n && this.form.auditor1 == "") {
            this.form.auditor2 = "";
            this.$message.error("请按顺序填写审核1字段");
          }
        }
      },
    },

    "form.auditor3": {
      handler(n) {
        if (this.showPint == true) {
          // this.$message.error("请按顺序填写审核1字段");
        } else {
          if (n && (this.form.auditor1 == "" || this.form.auditor2 == "")) {
            this.form.auditor3 = "";
            this.$message.error("请按顺序填写审核1、审核2字段");
          }
        }
      },
    },

    "form.auditor4": {
      handler(n) {
        if (this.showPint == true) {
          // this.$message.error("请按顺序填写审核1字段");
        } else {
          if (
            n &&
            (this.form.auditor1 == "" ||
              this.form.auditor2 == "" ||
              this.form.auditor3 == "")
          ) {
            this.form.auditor4 = "";
            this.$message.error("请按顺序填写审核1、审核2字段、审核3字段");
          }
        }
      },
    },
    projectCategory: {
      handler(n) {
        if (n == 3) {
          this.form.auditor1 = "";
          this.form.auditor2 = "";
          this.form.auditor3 = "";
          this.form.auditor4 = "";
          this.showExamine = false;
          this.showCopy = false;
          this.showPint = false;
          this.showCopy = false;
          this.showSearchMan = 1;
          console.log("为啥其他");
          this.rules.auditor3 = [];
        } else if (n == 1) {
          this.showCopy = false;
          this.form.auditor4 = "";
          this.showSearchMan = 1;
          this.rules.auditor3 = [
            { required: true, message: "审核人3不能为空", trigger: "change" },
          ];
        } else {
          this.showCopy = true;
          this.rules.auditor3 = [
            { required: true, message: "审核人3不能为空", trigger: "change" },
          ];
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.getUList();

    console.log(this.user.user.deptId, "哈哈");
  },
  methods: {
    async changeDate() {
      await template({
        projectCategory: this.projectCategory,
        customerType: this.customerType,
      }).then((res) => {
        this.setData = res.data.auditUserList;
        this.setData2 = res.data.recipientList;
      });

      // 判断当选择的为单安证项目/劳务项目
      // this.optionsValue = ''
      // 重置
      this.form.auditor1 = "";
      this.form.auditor2 = "";
      this.form.auditor3 = "";
      this.form.auditor4 = "";
      this.optionsValue = [];

      if (this.projectCategory == 1 || this.projectCategory == 4) {
        // this.optionsValue = ''

        if (this.setData.length == 0) {
          return;
        } else {
          if (this.setData[0].userId == null) {
            this.showExamine = true;
            this.showPint = true;
            this.showSearchMan = 1;

            this.form.auditor2 = this.setData[1].userId;

            if (
              this.projectCategory == 1 ||
              this.user.user.deptId != "1643056146109161474"
            ) {
              this.form.auditor3 = this.setData[2].userId;
            }

            this.optionsValue = [];
          } else {
            this.showExamine = true;
            // this.showOneExa = true
            this.showPint = false;
            this.showSearchMan = 1;
            this.form.auditor1 = this.setData[0].userId;
            this.form.auditor2 = this.setData[1].userId;
            if (
              this.projectCategory == 1 ||
              this.user.user.deptId != "1643056146109161474"
            ) {
              this.form.auditor3 = this.setData[2].userId;
            }

            this.optionsValue = [];
          }
          console.log(this.optionsValue, 888);
        }
        // 判断当选择为安证加人才项目时
      } else if (this.projectCategory == 2) {
        if (this.setData.length == 0) {
          this.showCopy = false;

          return;
        } else {
          if (this.setData[0].userId == null) {
            this.showExamine = true;
            this.showCopy = true;
            this.showPint = true;
            this.form.auditor2 = this.setData[1].userId;
            this.form.auditor3 = this.setData[2].userId;

            // 不是领跑的为4个审批人
            if (this.user.user.deptId != "1643056146109161474") {
              this.form.auditor4 = this.setData[3].userId;
            }
            this.optionsValue = this.setData2[0].userId;
            this.showSearchMan = 2;
          } else {
            this.showExamine = true;
            this.showCopy = true;
            // this.showOneExa = true
            this.showPint = false;
            this.showSearchMan = 2;
            this.form.auditor1 = this.setData[0].userId;
            this.form.auditor2 = this.setData[1].userId;
            this.form.auditor3 = this.setData[2].userId;

            if (this.user.user.deptId != "1643056146109161474") {
              this.form.auditor4 = this.setData[3].userId;
            }
            this.optionsValue = this.setData2[0].userId;
          }
        }
        // 判断为其他项目时
      } else {
        this.showPint = false;
        // this.optionsValue=''
        this.optionsValue = [];
        this.showSearchMan = 1;
        this.showExamine = false;
        this.showCopy = false;
        // this.showOneExa = false
      }
    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      const id = e.target && e.target.id;
      if (
        id == "auditor2" &&
        (this.form.auditor1 == undefined || this.form.auditor1 == "")
      ) {
        this.$message.error("请先选择审核人1");
        this.form.auditor2 = "";
        return;
      }

      if (
        id == "auditor3" &&
        (this.form.auditor2 == undefined || this.form.auditor2 == "")
      ) {
        this.$message.error("请先选择审核人2");
        this.form.auditor3 = "";
        return;
      }

      if (
        id == "auditor4" &&
        (this.form.auditor3 == undefined || this.form.auditor3 == "")
      ) {
        this.$message.error("请先选择审核人3");
        this.form.auditor4 = "";
        return;
      }

      listUserSearch({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    getUList() {
      listUserSearch({
        pageNum: 1,
        pageSize: "",
        userName: "",
      }).then((response) => {
        this.userList = response.rows;
        this.options = response.rows;
        // this.form.optionsValue='1553251673250865154'
      });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(file, fileList) {
      this.fileList = fileList.filter((item) => item.status === "success");
    },
    handleExceed(file, fileList) {
      this.$message.error("上传图片数量超出限制");
    },
    uploadImg(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台
          this.fileList.push({ name: res.data.fileName, url: res.data.url });
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },

    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.optionsValue == undefined) {
            this.form.recipients = this.optionsValue;
          }
          if (this.showCopy == true) {
            if (Array.isArray(this.optionsValue)) {
              console.log("cao1111", this.optionsValue);
              // 判断是否为数组
              this.form.recipients = this.optionsValue.join(",");
            } else {
              this.form.recipients = this.optionsValue.length
                ? this.optionsValue
                : "";
            }
          } else {
            if (!this.optionsValue) {
            } else {
              this.form.recipients = this.optionsValue.join(",");
            }
          }

          let params = JSON.parse(JSON.stringify(this.form));

          if (Array.isArray(params.area)) {
            params.area = params.area.join("-");
          }

          if (Array.isArray(params.remindUserIds)) {
            // 判断是否为数组
            params.remindUserIds =
              params.remindUserIds && params.remindUserIds.join(",");
          }

          params.auditUserIds = "";

          if (params.auditor1) {
            params.auditUserIds += `${params.auditor1}`;
          }
          if (params.auditor2) {
            params.auditUserIds += `,${params.auditor2}`;
          }
          if (params.auditor3) {
            params.auditUserIds += `,${params.auditor3}`;
          }

          if (params.auditor4) {
            params.auditUserIds += `,${params.auditor4}`;
          }
          params.auditor1 = undefined;
          params.auditor2 = undefined;
          params.auditor3 = undefined;
          params.auditor4 = undefined;
          params.projectCategory = this.projectCategory;
          let imgUrl = "";
          this.fileList &&
            this.fileList.length &&
            this.fileList.forEach((item) => (imgUrl += `,${item.url}`));
          params.imgUrl = imgUrl.substr(1);

          if (this.modifyForm && this.modifyForm.id) {
            params.id = this.modifyForm.id;
            params.auditId = this.modifyForm.auditId;

            let fn = null;

            if (this.type == 1) {
              fn = channelChannelAuditReferPriceEdit;
            } else {
              fn = modifyAuditReferPrice;
            }

            if (Array.isArray(params.recipients)) {
              // 判断是否为数组
              params.recipients =
                (params.recipients && params.recipients.join(",")) || "";
            }

            fn(params).then((response) => {
              this.$modal.msgSuccess("修改成功");

              this.$emit("update:showAddForm", false);
              this.$refs["form"].resetFields();
              this.fileList = [];
              this.$emit("getInfo");
            });
          } else {
            // return;

            let fn = null;
            if (this.type == 1) {
              fn = channelChannelAuditReferPriceAdd;
            } else {
              fn = addAuditReferPrice;
            }

            fn(params).then((response) => {
              this.$modal.msgSuccess("新增成功");

              this.$emit("update:showAddForm", false);
              this.$refs["form"].resetFields();
              this.fileList = [];
              this.$emit("getList");
              this.projectCategory = 3;
              this.optionsValue = [];
            });
          }
        }
      });
    },

    cancel() {
      this.$refs["form"].resetFields();
      this.$emit("update:showAddForm", false);
      if (this.showProject == false) {
        this.projectCategory = 3;
        this.optionsValue = [];
      }
    },
  },

  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/upload.scss";
@import "@/assets/styles/dialog.scss";

.personnel {
  margin: 0 10px 0 92px;
}

.select-input {
  width: 583px;
}

.wait-face {
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  color: #666;
}

.el-radio {
  padding-bottom: 8px;
}
</style>
