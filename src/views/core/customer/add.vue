<template>
  <el-card class="box-card">
    <div slot="header" class="header-box">
      <span>{{ typeString[type] }}</span>
      <span style="color: red">*为必填项</span>
    </div>
    <el-form
      ref="form"
      :model="form"
      class="form-box"
      :rules="rules"
      label-width="120px"
    >
      <!-- 基础信息 -->
      <div style="padding: 0 20px">
        <h2 class="h2-title">基础信息</h2>
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="助记名称" prop="shortCompanyName">
          <el-input
            v-model="form.shortCompanyName"
            placeholder="请输入企业名称"
          />
        </el-form-item>
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="请输入法人" />
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-radio-group v-model="form.customerType">
            <el-radio
              v-for="customerType in commonData.customerTypeList"
              :key="customerType.value"
              :label="customerType.value"
              >{{ customerType.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="客户状态" prop="customerStatus">
          <el-select v-model="form.customerStatus" :clearable="true">
            <el-option
              v-for="customerStatus in commonData.customerStatusList"
              :key="customerStatus.value"
              :label="customerStatus.label"
              :value="customerStatus.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="客户等级" prop="customerGrade">
          <el-select
            v-model="form.customerGrade"
            :clearable="true"
            :disabled="true"
          >
            <el-option
              v-for="customerGrade in commonData.customerGradeList"
              :key="customerGrade.value"
              :label="customerGrade.label"
              :value="customerGrade.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="form.dataSource" :clearable="true">
            <el-option
              v-for="dataSource in commonData.dataSourceList"
              :key="dataSource.value"
              :label="dataSource.label"
              :value="dataSource.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="form.dataSource == 5"
          label="转介绍来源"
          prop="contactInfoString"
        >
          <el-select
            style="width: 100%"
            v-model="form.contactInfoId"
            filterable
            placeholder="请输入关键字搜索"
            :remote-method="getContactInfoSelectList"
            @focus="getContactInfoSelectList($event, true)"
            @change="handleChange"
          >
            <el-option
              v-for="item in contactInfoSelect"
              :key="item.contactInfoId"
              :label="item.contactInfoString"
              :value="item.contactInfoId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="form.dataSource == 5"
          label="转介绍时间"
          prop="customerReferralTime"
        >
          <el-date-picker
            v-model="form.customerReferralTime"
            type="date"
            placeholder="转介绍时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="安证有效期" prop="safetyPermitsTime">
          <el-date-picker
            clearable
            v-model="form.safetyPermitsTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择安证有效期"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <div style="padding: 0 20px">
        <h2 class="h2-title">附加信息</h2>
        <el-form-item label="所在区域" prop="province">
          <ProvinceSelect
            :province.sync="form.province"
            :selectedOptions="selectedOptions"
            :address="form.address"
            @change="(e) => (form = { ...form, ...e })"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="详细地址" />
        </el-form-item>
        <el-form-item label="企业规模" prop="scale">
          <el-input v-model="form.scale" placeholder="请输入企业规模" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            v-model="form.note"
            :rows="5"
            maxlength="300"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="跟进时间" prop="remindTime">
          <el-date-picker
            clearable
            v-model="form.remindTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跟进内容" prop="remindContent">
          <el-input v-model="form.remindContent" placeholder="请输入跟进内容" />
        </el-form-item>
        <!-- <el-form-item label="跟进人员" prop="followPerson">
          <el-input v-model="form.followPerson" placeholder="请输入跟进人员" />
        </el-form-item> -->

        <!-- <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="联系人姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender">
            <el-option label="先生" :value="1" />
            <el-option label="女士" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role">
            <el-option
              v-for="role in commonData.roleList"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="职位" />
        </el-form-item>
        <el-form-item label="手机号码" prop="cellphone">
          <el-input v-model="form.cellphone" placeholder="手机号码" />
        </el-form-item> -->
        <!-- <el-form-item label="固定电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="固定电话" />
        </el-form-item>
        <el-form-item label="传真号码" prop="fax">
          <el-input v-model="form.fax" placeholder="传真号码" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="电子邮箱" />
        </el-form-item> -->
        <!-- <el-form-item label="微信" prop="tencentWx">
          <el-input v-model="form.tencentWx" placeholder="微信" />
        </el-form-item> -->
        <!-- <el-form-item label="QQ" prop="tencentQq">
          <el-input v-model="form.tencentQq" placeholder="QQ" />
        </el-form-item> -->
        <!-- <el-form-item label="喜恶" prop="hobby">
          <el-input v-model="form.hobby" placeholder="喜恶" />
        </el-form-item> -->
      </div>

      <div>
        <h2 class="h2-title">联系人</h2>
        <el-form-item label="联系人信息" prop="contactInfoList">
          <addPerson :list.sync="form.contactInfoList" :rules="rules" />
        </el-form-item>
      </div>

      <div>
        <h2 class="h2-title">资质情况</h2>
        <el-form-item label="资质情况" prop="buildingQualificationBoList">
          <addQualification :list.sync="form.buildingQualificationBoList" />
        </el-form-item>
      </div>
    </el-form>

    <div class="footer-box">
      <el-button :loading="buttonLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">重置</el-button>
    </div>
  </el-card>
</template>

<script>
import {
  getCustomerArchive,
  addCustomerArchive,
  updateCustomerArchive,
} from "@/api/core/customerArchive";
import { convert, getContactInfoSelectList } from "@/api/core/clue";
import addQualification from "../components/addQualification.vue";
import { listUser } from "@/api/system/user";

import { mapState } from "vuex";

import addPerson from "../components/addPerson.vue";

export default {
  name: "AddCustomer",
  components: { addQualification, addPerson },
  data() {
    return {
      selectedOptions: [],
      typeString: ["添加客户", "编辑客户", "转为客户"],
      id: 0,
      type: 0, // 0添加 1 编辑 2转客户

      buttonLoading: false,
      pageTitle: undefined,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: undefined,
        title: undefined,
        status: undefined,
        projectType: undefined,
        consultTime: undefined,
        lastFollowUpTime: undefined,
      },
      // 表单参数
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contactInfoList: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: ["blur", "change"],
          },
        ],

        companyName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        // customerStatus: [
        //   { required: true, message: "客户状态不能为空", trigger: "change" },
        // ],
        customerType: [
          { required: true, message: "客户类型不能为空", trigger: "change" },
        ],
        customerReferralTime: [
          { required: true, message: "转介绍时间不能为空", trigger: "change" },
        ],
        contactInfoString: [
          { required: true, message: "转介绍来源不能为空", trigger: "blur" },
        ],
        // customerGrade: [
        //   { required: true, message: "客户等级不能为空", trigger: "change" },
        // ],
        province: [
          {
            required: true,
            message: "所在区域不能为空",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "详细地址不能为空",
            trigger: "blur",
          },
        ],

        contactName: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "blur",
          },
        ],
        role: [
          {
            required: true,
            message: "角色不能为空",
            trigger: "change",
          },
        ],
        position: [
          {
            required: true,
            message: "职位不能为空",
            trigger: "blur",
          },
        ],
        cellphone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不对",

            trigger: "blur",
          },
        ],
        tencentWx: [
          {
            required: true,
            message: "微信号不能为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z\d_][a-zA-Z\d_-]{5,19}$/,
            message:
              "微信号格式不对，请以字母，数字或者下划线开头，字母不区分大小写或6到20位之间",
            trigger: "blur",
          },
        ],
      },

      // 提醒谁看
      userList: [],
      contactInfoSelect: [],
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    "form.dataSource": {
      handler(n) {
        if (n == 5) {
          this.$set(
            this.form,
            "customerReferralTime",
            this.parseTime(new Date(), "{y}-{m}-{d}")
          );
        } else {
          const keyArr = [
            "customerReferralTime",
            "contactInfoId",
            "referralArchiveId",
            "customerReferralSource",
            "customerReferralPhone",
            "contactInfoString",
          ];
          keyArr.forEach((item) => this.$set(this.form, item, undefined));
        }
      },
    },
  },
  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.getContactInfoSelectList();

    if (this.id) {
      this.handleUpdate();
    }
    if (this.type == 2) {
      this.form = this.$route.query.form;

      const { province, city, area } = this.form;
      this.selectedOptions = province ? [province, city, area] : [];
    }
  },
  methods: {
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    handleChange(e) {
      let params = this.contactInfoSelect.find(
        (item) => e === item.contactInfoId
      );
      const { companyName, contactInfoString, ...args } = params;
      this.form.contactInfoString = contactInfoString;
      this.form = {
        ...this.form,
        ...args,
      };
    },

    getContactInfoSelectList(e, isFocus) {
      getContactInfoSelectList({
        contactInfoString: isFocus ? "" : e,
      }).then((response) => {
        this.contactInfoSelect = response.data;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        customerId: undefined,
        title: undefined,
        status: 0,
        projectType: undefined,
        consultTime: undefined,
        lastFollowUpTime: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = this.id;
      getCustomerArchive(id).then((response) => {
        this.loading = false;
        this.form = response.data;

        const { province, city, area } = this.form;
        this.selectedOptions = province ? [province, city, area] : [];
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.type == 1) {
            updateCustomerArchive(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                setTimeout(() => {
                  this.$router.push({ name: "Customer" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 0) {
            addCustomerArchive(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                setTimeout(() => {
                  this.$router.push({ name: "Customer" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 2) {
            convert(this.form)
              .then((response) => {
                this.$modal.msgSuccess("转客户成功");
                setTimeout(() => {
                  this.$router.push({ name: "Customer" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 20px 30px;
}
.box-card {
  width: 70%;
  margin: 30px auto;
}
.header-box {
  display: flex;
  justify-content: space-between;
}
.header-box span:nth-child(2) {
  color: #999;
}
.footer-box {
  display: flex;
  justify-content: center;
}

.form-box {
  display: flex;
  flex-wrap: wrap;
}
.form-box div {
  flex: 1;
}
.h2-title {
  font-weight: 600;
  margin: 0 50px;
  margin-top: 30px;
  height: 50px;
  padding-left: 10px;
  text-align: left;
  position: relative;
}
.h2-title::after {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 3px;
  height: 16px;
  background: #0079fe;
}
</style>
