<template>
  <el-card class="box-card">
    <div slot="header" class="header-box">
      <span>{{ type == 0 ? "添加线索" : "编辑线索" }}</span>
      <span style="color: red">*为必填项</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <!-- <el-form-item label="线索状态" prop="clueStatus">
        <el-select v-model="form.clueStatus">
          <el-option
            v-for="clueStatus in commonData.clueStatusList"
            :key="clueStatus.value"
            :label="clueStatus.label"
            :value="clueStatus.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="企业名称" prop="companyName">
        <el-autocomplete
          style="width: 100%"
          v-model="form.companyName"
          :fetch-suggestions="getCustomerName"
          placeholder="企业名称"
          @select="getContacts"
        ></el-autocomplete>
        <!-- <el-input v-model="form.companyName" placeholder="企业名称"></el-input> -->
      </el-form-item>
      <el-form-item label="法人" prop="legalPerson">
        <el-input v-model="form.legalPerson" placeholder="法人" />
      </el-form-item>
      <el-form-item label="安证有效期" prop="safetyPermitsTime">
        <el-date-picker
          v-model="form.safetyPermitsTime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="数据来源" prop="dataSource">
        <el-select v-model="form.dataSource">
          <el-option
            v-for="dataSource in commonData.dataSourceList"
            :key="dataSource.value"
            :label="dataSource.label"
            :value="dataSource.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-radio-group v-model="form.customerType">
          <el-radio
            v-for="dataSource in commonData.customerTypeList"
            :key="dataSource.value"
            :label="dataSource.value"
            >{{ dataSource.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item
        v-if="form.dataSource == 5"
        label="转介绍来源"
        prop="customerReferralSource"
      >
        <el-input
          v-model="form.customerReferralSource"
          placeholder="转介绍来源"
        />
      </el-form-item> -->

      <el-form-item
        v-if="form.dataSource == 5"
        label="转介绍来源"
        prop="contactInfoString"
      >
        <el-select
          style="width: 100%"
          v-model="form.contactInfoId"
          placeholder="请输入关键字搜索"
          filterable
          remote
          reserve-keyword
          :remote-method="getContactInfoSelectList"
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
      <!-- 
      <el-form-item label="联系人姓名" prop="contactName">
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
      </el-form-item>-->
      <!-- <el-form-item label="微信" prop="tencent_wx">
        <el-input v-model="form.tencentWx" placeholder="微信" />
      </el-form-item> -->
      <!-- <el-form-item label="QQ" prop="tencent_qq">
        <el-input v-model="form.tencentQq" placeholder="QQ" />
      </el-form-item> -->
      <!-- <el-form-item label="喜恶" prop="hobby">
        <el-input v-model="form.hobby" placeholder="喜恶" />
      </el-form-item> -->

      <el-form-item label="联系人信息" prop="contactInfoList">
        <addPerson :list.sync="form.contactInfoList" :rules="rules" />
      </el-form-item>

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

      <el-form-item label="下次跟进时间" prop="remindTime">
        <el-date-picker
          v-model="form.remindTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="跟进内容" prop="remindContent">
        <el-input v-model="form.remindContent" placeholder="跟进内容" />
      </el-form-item>
      <!-- <el-form-item label="提醒谁看" prop="userId">
        <el-select
          style="width: 100%"
          v-model="form.remindUserList"
          filterable
          multiple
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
      </el-form-item> -->

      <el-form-item label="资质情况" prop="buildingQualificationBoList">
        <addQualification :list.sync="form.buildingQualificationBoList" />
      </el-form-item>
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
  getClue,
  addClue,
  updateClue,
  getContactInfoSelectList,
  customerArchiveListByName,
} from "@/api/core/clue";
import { getCustomerArchive } from "@/api/core/customerArchive";
import addQualification from "../components/addQualification.vue";
import addPerson from "../components/addPerson.vue";
import { listUser } from "@/api/system/user";

import { mapState } from "vuex";

export default {
  name: "AddClue",
  components: { addQualification, addPerson },
  data() {
    return {
      selectedOptions: [],
      // === 资质 ===
      dialogVisible: false,
      qualificationForm: {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      },
      qualification_rules: {
        certName: [
          { required: true, message: "资质名称不能为空", trigger: "blur" },
        ],
      },
      // === 资质 ===

      id: 0,
      type: 0, // 0添加 1 编辑
      buttonLoading: false,
      // 表单参数
      form: { customerType: 1 },
      // 表单校验
      rules: {
        // clueStatus: [
        //   { required: true, message: "线索状态不能为空", trigger: "blur" },
        // ],
        contactInfoList: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: ["blur", "change"],
          },
        ],
        contactName: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: ["blur", "change"],
          },
        ],

        cellphone: [
          {
            required: true,
            message: "手机号码不能为空",
            trigger: "blur",
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
            message: "微信不能为空",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z\d_][a-zA-Z\d_-]{5,19}$/,
            message:
              "微信号格式不对，请以字母，数字或者下划线开头，字母不区分大小写或6到20位之间",
            trigger: "blur",
          },
        ],
        customerReferralTime: [
          { required: true, message: "转介绍时间不能为空", trigger: "blur" },
        ],
        contactInfoString: [
          { required: true, message: "转介绍来源不能为空", trigger: "blur" },
        ],
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur",
          },
          {
            pattern: /^[\u4e00-\u9fa5()（）]+$/,
            message: "企业名称请输入中文名称",
            trigger: "blur",
          },
        ],
        customerType: [
          { required: true, message: "客户类型不能为空", trigger: "change" },
        ],
        dataSource: [
          { required: true, message: "数据来源不能为空", trigger: "change" },
        ],
      },

      // 提醒谁看
      userList: [],
      contactInfoSelect: [],

      customerNameList: [],
      customerLoading: false,

      archiveId: undefined,
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
    "$route.query": {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.type = this.$route.query.type;
      this.id = this.$route.query.id;
      this.form.followUpId = this.$route.query.followUpId;
      this.form.followUpCategory = +this.$route.query.followUpCategory;

      if (this.id) {
        this.handleUpdate();
        this.getContactInfoSelectList();
      }
    },
    // 企业名称选中数据
    getContacts(obj) {
      this.$router.push({
        name: "Clue/add",
        query: {
          type: 1,
          id: obj.address,
          followUpId: this.form.followUpId,
          followUpCategory: this.form.followUpCategory,
        },
      });
    },
    // 输入关键字，筛选输入的企业
    getCustomerName(queryString, cb) {
      console.log({ queryString });

      if (queryString) {
        let sendParams = {
          companyName: queryString,
        };
        customerArchiveListByName(sendParams).then((res) => {
          this.customerNameList = res.map((item) => {
            return {
              value: item.companyName,
              address: item.clueId,
            };
          });
          cb(this.customerNameList);
        });
      } else {
        cb([]);
      }
    },

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
      console.log(contactInfoString);
      this.form.contactInfoString = contactInfoString;
      this.form = {
        ...this.form,
        ...args,
      };

      console.log(this.form);
    },

    getContactInfoSelectList(e, isFocus) {
      console.log(e, "e");
      getContactInfoSelectList({
        contactInfoString: isFocus ? "" : e,
      }).then((response) => {
        this.contactInfoSelect = response.data;
      });
    },

    cancelAdd() {
      this.dialogVisible = false;
      this.qualificationForm = {
        certName: undefined,
        expireDate: undefined,
        certNo: undefined,
        signDate: undefined,
      };
    },
    submitAdd() {
      this.$refs["qualificationForm"].validate((valid) => {
        if (valid) {
          let arr = this.form["buildingQualificationBoList"] || [];
          arr.push({
            ...Object.assign({}, this.qualificationForm),
            localId: arr.length + 1,
          });
          this.$set(this.form, "buildingQualificationBoList", arr);
          this.cancelAdd();
        }
      });
    },
    // 移除资质  有localId 本地删除  无 走请求删除
    handleDelClick(row) {
      if (row.localId) {
        const index = this.form["buildingQualificationBoList"].findIndex(
          (item) => item.localId === row.localId
        );
        this.form["buildingQualificationBoList"].splice(index, 1);
        let arr = this.form["buildingQualificationBoList"];
        this.$set(this.form, "buildingQualificationBoList", arr);
      } else {
      }
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
        clueStatus: 0,
        companyName: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        dataSource: 0,
        contaceName: undefined,
        gender: 0,
        role: 0,
        position: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        email: undefined,
        tencentWx: undefined,
        tencentQq: undefined,
        hobby: undefined,
        customerType: 1,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = this.id;
      getClue(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.form.followUpId = this.$route.query.followUpId;
        this.form.followUpCategory = +this.$route.query.followUpCategory;
        this.form.contactInfoList.map((item) => {
          console.log(item);
          return (this.form.contactInfoId = item.id);
        });
        this.form.archiveId = response.data.archiveId;
        const { province, city, area } = this.form;
        this.selectedOptions = province ? [province, city, area] : [];
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.type) {
            const sendData = {
              ...this.form,

              // companyName: this.form.$companyName
              //   ? this.form.$companyName
              //   : this.form.companyName,
            };

            // if (this.archiveId) {
            //   sendData.archiveId = this.archiveId;
            // }
            console.log(sendData);

            updateClue(sendData)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                setTimeout(() => {
                  this.$router.push({ name: "Clue" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            const sendData = {
              ...this.form,
              // archiveId: this.archiveId,
              // companyName: this.form.$companyName,
            };

            addClue(sendData)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                setTimeout(() => {
                  this.$router.push({ name: "Clue" });
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
  padding: 20px 100px;
}

.addDialog ::v-deep .el-form-item {
  margin-bottom: 20px;
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
</style>
