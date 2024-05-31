<template>
  <!-- 添加跟进记录对话框 -->
  <el-dialog
    title=""
    :visible="show"
    width="1100px"
    append-to-body
    :close-on-click-modal="false"
    @close="close"
  >
    <el-row :gutter="10" class="mb8">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        >新增</el-button
      >
    </el-row>

    <el-table v-loading="loading" :data="List" border>
      <el-table-column label="现合作项目" align="center" prop="nowProject" />
      <el-table-column label="报价时间" align="center" prop="createTime" />
      <el-table-column label="低于限价原因" align="center" prop="reason" />
      <el-table-column label="地区" align="center" prop="area">
      </el-table-column>
      <el-table-column
        label="报价内容及价格"
        align="center"
        prop="priceContent"
      />
      <el-table-column label="报价人员" align="center" prop="applyUserName" />
      <el-table-column label="报价审核" align="center" prop="auditResult">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="goPage(row)">{{
            row.auditResult
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- <el-dialog
      title="新增报价"
      :visible="showAddForm"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="企业名称" prop="companyName">
          <el-input
            v-model="form.companyName"
            disabled
            placeholder="企业名称"
          />
        </el-form-item>
        <el-form-item label="是否老客户" prop="isOldCustomer">
          <el-select v-model="form.isOldCustomer" placeholder="请选择">
            <el-option label="是" :value="1"> </el-option>
            <el-option label="否" :value="0"> </el-option>
          </el-select>
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
          <el-select
            style="width: 100%"
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
        </el-form-item>
        <el-form-item label="审核人3" prop="auditor3">
          <el-select
            style="width: 100%"
            v-model="form.auditor3"
            filterable
            clearable
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
        </el-form-item>
        <el-form-item label="提醒谁看" prop="remindUserIds">
          <el-select
            style="width: 100%"
            v-model="form.remindUserIds"
            filterable
            multiple
            clearable
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->

    <addPrice
      :showAddForm.sync="showAddForm"
      :companyName="queryParams.companyName"
      :customerType="customerType"
      :quotedArea="quotedArea"
      :projectData="projectData"
      @getList="getList"
    />
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";
import { fileUpload } from "@/api/upload/upload";

import { listByCompany, addAuditReferPrice } from "@/api/core/auditReferPrice";
import addPrice from "./addPrice";

export default {
  name: "quotedPrice",
  watch: {},
  components: { addPrice },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    quotedPriceForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      projectCategor: 3,
      projectData: 3,
      showAddForm: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: "",
      },
      loading: false,
      total: 0,
      List: [],

      fileList: [],
      projectCategory: 3,
      form: {
        auditor1: "",
        auditor2: "",
        auditor3: "",
      },
      userList: [],

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
      },

      quotedArea: [],

      // 客户类型
      customerType: "",
    };
  },
  watch: {
    quotedPriceForm: {
      handler(n) {
        this.queryParams.companyName = n.companyName;
        this.customerType = n.customerType;

        this.form.companyName = n.companyName;

        this.quotedArea = [n.province, n.city, n.area];
      },
    },
    show: {
      handler(n) {
        n && this.getList();
      },
    },

    "form.auditor1": {
      handler(n) {
        if (n == "") {
          this.form.auditor2 = "";
          this.form.auditor3 = "";
        }
      },
    },
    "form.auditor2": {
      handler(n) {
        if (n == "") {
          this.form.auditor3 = "";
        }
        if (this.form.auditor1 == "") {
          this.form.auditor2 = "";
          this.$message.error("请按顺序填写审核1字段");
        }
      },
    },

    "form.auditor3": {
      handler(n) {
        if (this.form.auditor1 == "" || this.form.auditor2 == "") {
          this.form.auditor3 = "";
          this.$message.error("请按顺序填写审核1、审核2字段");
        }
      },
    },
  },
  mounted() {
    // this.projectCategory=3
  },
  methods: {
    goPage(row) {
      this.$emit("update:show", false);
      this.$router.push({
        name: "PriceDetail",
        query: { id: row.id, type: 0 },
      });
    },
    handleAdd() {
      this.projectCategory = 3;

      this.showAddForm = true;
      this.projectData = 3;
    },
    getList() {
      this.loading = true;
      listByCompany(this.queryParams).then((response) => {
        this.List = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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

      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
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
          let params = JSON.parse(JSON.stringify(this.form));
          params.remindUserIds =
            params.remindUserIds && params.remindUserIds.join(",");
          params.optionsValue =
            params.optionsValue && params.optionsValue.join(",");
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

          let imgUrl = "";
          this.fileList &&
            this.fileList.length &&
            this.fileList.forEach((item) => (imgUrl += `,${item.url}`));
          params.imgUrl = imgUrl.substr(1);

          addAuditReferPrice(params).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.getList();
            this.showAddForm = false;
            this.form = {};
          });
        }
      });
    },
    close() {
      this.$emit("update:show", false);
    },
    cancel() {
      this.showAddForm = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/upload.scss";
@import "@/assets/styles/dialog.scss";
</style>
