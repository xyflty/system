<template>
  <el-card class="box-card">
    <div slot="header" class="header-box">
      <span>{{ typeString[type] }}</span>
      <span style="color: red">*为必填项</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="挖需标题" prop="title">
        <el-input v-model="form.title" placeholder="挖需标题" />
      </el-form-item>
      <el-form-item label="挖需状态" prop="demandStatus">
        <el-select v-model="form.demandStatus" :clearable="true">
          <el-option
            v-for="demandStatus in commonData.demandStatusList"
            :key="demandStatus.value"
            :label="demandStatus.label"
            :value="demandStatus.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="form.projectType" :clearable="true">
          <el-option
            v-for="projectType in commonData.projectTypeList"
            :key="projectType.value"
            :label="projectType.label"
            :value="projectType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="咨询日期" prop="consultTime">
        <el-date-picker
          v-model="form.consultTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="form.companyName" placeholder="企业名称" />
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

      <el-form-item
        v-if="form.dataSource == 5"
        label="转介绍来源"
        prop="customerReferralSource"
      >
        <el-input
          v-model="form.customerReferralSource"
          placeholder="转介绍来源"
        />
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
        <template>
          <el-select v-model="form.role">
            <el-option
              v-for="role in commonData.roleList"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input v-model="form.position" placeholder="职位" />
      </el-form-item>
      <el-form-item label="手机号码" prop="cellphone">
        <el-input v-model="form.cellphone" placeholder="手机号码" />
      </el-form-item>
      <!-- <el-form-item label="固定电话" prop="telephone">
        <el-input v-model="form.telephone" placeholder="固定电话" />
      </el-form-item>
      <el-form-item label="传真号码" prop="fax">
        <el-input v-model="form.fax" placeholder="传真号码" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="form.email" placeholder="电子邮箱" />
      </el-form-item> -->
      <el-form-item label="微信" prop="tencent_wx">
        <el-input v-model="form.tencentWx" placeholder="微信" />
      </el-form-item>
      <!-- <el-form-item label="QQ" prop="tencent_qq">
        <el-input v-model="form.tencentQq" placeholder="QQ" />
      </el-form-item> -->
      <el-form-item label="喜恶" prop="hobby">
        <el-input v-model="form.hobby" placeholder="喜恶" />
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
import { getDemand, addDemand, updateDemand } from "@/api/core/demand";
import { convert } from "@/api/core/clue";
import addQualification from "../components/addQualification.vue";
import { listUser } from "@/api/system/user";
import { getClue } from "@/api/core/clue";

import { mapState } from "vuex";

export default {
  name: "AddClue",
  components: { addQualification },
  data() {
    return {
      selectedOptions: [],
      typeString: ["添加挖需", "编辑挖需", "转为挖需"],
      id: 0,
      type: 0, // 0添加 1 编辑 2转挖需
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
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "挖需标题不能为空", trigger: "blur" },
        ],
        demandStatus: [
          { required: true, message: "挖需状态不能为空", trigger: "change" },
        ],
        customerReferralTime: [
          { required: true, message: "转介绍时间不能为空", trigger: "change" },
        ],
        customerReferralSource: [
          { required: true, message: "转介绍来源不能为空", trigger: "change" },
        ],
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur",
          },
        ],
        projectType: [
          { required: true, message: "不能为空", trigger: "change" },
        ],
      },

      // 提醒谁看
      userList: [],
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    if (this.id) {
      this.handleUpdate();
    }
    if (this.type == 2) {
      this.form = JSON.parse(this.$route.query.form);
      this.getClueInfo(this.form.id);
      const { province, city, area } = this.form;
      this.selectedOptions = province ? [province, city, area] : [];
    }
  },
  methods: {
    // 获取线索详情
    getClueInfo(id) {
      getClue(id).then((res) => {
        this.form.buildingQualificationBoList =
          res.data.buildingQualificationBoList;
      });
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
      getDemand(id).then((response) => {
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
            updateDemand(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                setTimeout(() => {
                  this.$router.push({ name: "Demand" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 0) {
            addDemand(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                setTimeout(() => {
                  this.$router.push({ name: "Demand" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 2) {
            convert(this.form)
              .then((response) => {
                this.$modal.msgSuccess("转挖需成功");
                setTimeout(() => {
                  this.$router.push({ name: "Demand" });
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
