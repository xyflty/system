<template>
  <div @click="showTree = false">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <span>{{ typeString[type] }}</span>
        <span style="color: red">*为必填项</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商机标题" prop="title" style="position: relative">
          <el-input
            v-model="form.title"
            placeholder="商机标题"
            @click.stop.native="showTree = true"
          >
          </el-input>
          <div class="project" v-show="showTree">
            <el-tree
              @click.stop="showTree = true"
              :data="options"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </el-form-item>
        <el-form-item
          label="商机状态"
          prop="opportunityStatus"
          v-if="type !== 1"
        >
          <el-select v-model="form.opportunityStatus" :clearable="true">
            <el-option
              v-for="opportunityStatus in commonData.opportunityStatusList"
              :key="opportunityStatus.value"
              :label="opportunityStatus.label"
              :value="opportunityStatus.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="form.projectType" :clearable="true">
          <el-option
            v-for="projectType in commonData.projectTypeList"
            :key="projectType.value"
            :label="projectType.label"
            :value="projectType.value"
          />
        </el-select>
      </el-form-item> -->
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
          <el-input
            v-model="form.companyName"
            :disabled="type == 2 || isCustomer == 1"
            placeholder="企业名称"
          />
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
          prop="contactInfoString"
        >
          <el-select
            style="width: 100%"
            v-model="form.contactInfoString"
            filterable
            placeholder="请输入关键字搜索"
            remote
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

        <el-form-item label="联系人信息" prop="contactInfoList">
          <addPerson :list.sync="form.contactInfoList" />
        </el-form-item>

        <el-form-item label="关联项目" prop="opportunityProjectBoList">
          <addProject
            :orderProjects.sync="form.opportunityProjectBoList"
            type="opportunity"
          />
        </el-form-item>
        <!-- <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="联系人姓名" />
        </el-form-item> -->
        <!-- <el-form-item label="性别" prop="gender">
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
        <!-- <el-form-item label="微信" prop="tencent_wx">
          <el-input v-model="form.tencentWx" placeholder="微信" />
        </el-form-item> -->
        <!-- <el-form-item label="QQ" prop="tencent_qq">
        <el-input v-model="form.tencentQq" placeholder="QQ" />
      </el-form-item> -->
        <!-- <el-form-item label="喜恶" prop="hobby">
          <el-input v-model="form.hobby" placeholder="喜恶" />
        </el-form-item> -->

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
  </div>
</template>

<script>
import {
  listOpportunity,
  getOpportunity,
  delOpportunity,
  addOpportunity,
  updateOpportunity,
  setTop,
  getProjectCategoryTree,
} from "@/api/core/opportunity";
import { getDemand } from "@/api/core/demand";
import addQualification from "../components/addQualification.vue";
import { listUser } from "@/api/system/user";
import { getClue, convert, getContactInfoSelectList } from "@/api/core/clue";
import { getCustomerArchive } from "@/api/core/customerArchive";
import addProject from "@/views/core/components/addProject.vue";
import { mapState } from "vuex";

import addPerson from "../components/addPerson.vue";

import { findItemById, removeAllParents } from "@/utils/ruoyi";

export default {
  name: "AddOpportunity",
  components: { addQualification, addProject, addPerson },
  data() {
    return {
      isCustomer: 0,
      orderProjectLocalList: [],
      selectedOptions: [],
      typeString: ["添加商机", "编辑商机", "转为商机"],
      id: 0,
      type: 0, // 0添加 1 编辑
      buttonLoading: false,
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
        title: [
          { required: true, message: "商机标题不能为空", trigger: "change" },
        ],
        customerType: [
          { required: true, message: "客户类型不能为空", trigger: "change" },
        ],
        opportunityStatus: [
          {
            required: true,
            message: "商机状态不能为空",
            trigger: "change",
          },
        ],
        customerReferralTime: [
          { required: true, message: "转介绍时间不能为空", trigger: "change" },
        ],
        contactInfoId: [
          { required: true, message: "转介绍来源不能为空", trigger: "blur" },
        ],
        projectType: [
          {
            required: true,
            message: "项目类型不能为空",
            trigger: "change",
          },
        ],
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur",
          },
        ],
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
        contactInfoString: [
          {
            required: true,
            message: "转介绍来源不能为空",
            trigger: "blur",
          },
        ],
        opportunityProjectBoList: [
          { required: true, message: "关联项目不能为空", trigger: "blur" },
        ],
      },

      // 提醒谁看
      userList: [],
      contactInfoSelect: [],

      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      showTree: false,
      categoryName: "",
      time: undefined,
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
    "form.title": {
      handler(val) {
        // this.getData(val)
        var _this = this;
        clearTimeout(this.time);
        this.time = setTimeout(() => {
          _this.getProjectCategoryTree(val);
        }, 500);
      },
    },
    "form.opportunityProjectBoList": {
      handler(newVal) {
        if (newVal) {
          this.$refs["form"].clearValidate("opportunityProjectBoList");
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    let from = this.$route.query.form ? JSON.parse(this.$route.query.form) : {};
    this.form = this.dealObjectValue(from);
    this.getContactInfoSelectList();

    if (this.form) {
      const { province, city, area } = this.form;
      this.selectedOptions = province ? [province, city, area] : [];
    }

    if (this.id) {
      this.handleUpdate();
    }
    if (this.type == 0 && this.form["id"]) {
      this.form.archiveId = this.form.id;
      this.getCustomerInfo(this.form.id);
      this.isCustomer = 1;
      this.form.customerId = undefined;
      this.form.id = undefined;
      const { province, city, area } = this.form;
      this.selectedOptions = province ? [province, city, area] : [];
    }
    if (this.type == 2) {
      // if (!this.form.archiveId) {
      //   this.form.archiveId = this.form.id;
      // }
      this.getClueInfo(this.form.id);
      this.form.id = undefined;
    }

    this.getProjectCategoryTree();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleFilterNode(value, data, node) {
      let names = this.getParents(node, node.data.name, "name");
      let isName = names.indexOf(value) !== -1;
      return !value || isName ? true : false;
    },
    getParents(node, name, key) {
      if (node.parent && node.parent.data[key]) {
        name += node.parent.data[key];
        return getParents(node.parent, name, key);
      }
      return name;
    },

    dealObjectValue(obj) {
      let newObj = {};
      for (const key in obj) {
        //如果对象属性的值不为空，就保存该属性（如果属性的值为0 false，保存该属性。如果属性的值全部是空格，属于为空。）
        if (
          (obj[key] === 0 || obj[key] === false || obj[key]) &&
          obj[key].toString().replace(/(^\s*)|(\s*$)/g, "") !== ""
        ) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
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

    handleNodeClick(data) {
      if (data.children && data.children.length) {
        return;
      }
      const params = findItemById(this.options, data.parentId);
      let title = params ? params.label + " - " + data.label : data.label;
      this.$set(this.form, "title", title);
    },
    getProjectCategoryTree(val) {
      getProjectCategoryTree({ categoryName: val }).then((res) => {
        this.options = [];
        let data = res.data;
        let array = [];
        data.forEach((item) => {
          if (item.children != undefined) {
            array.push(item.children);
          }
        });
        this.options = array.flat(1);
      });
    },
    // 获取线索详情
    getClueInfo(id) {
      getClue(id).then((res) => {
        const { buildingQualificationBoList, contactInfoList } = res.data;
        this.$set(
          this.form,
          "buildingQualificationBoList",
          buildingQualificationBoList
        );
        this.$set(this.form, "contactInfoList", contactInfoList);
        const { province, city, area } = this.form;
        this.selectedOptions = province ? [province, city, area] : [];
      });
    },

    // 获取挖需详情
    getDemandInfo(id) {
      getDemand(id).then((res) => {
        const { buildingQualificationBoList, contactInfoList } = res.data;
        this.$set(
          this.form,
          "buildingQualificationBoList",
          buildingQualificationBoList
        );
        this.$set(this.form, "contactInfoList", contactInfoList);
      });
    },

    // 获取客户详情
    getCustomerInfo(id) {
      getCustomerArchive(id).then((res) => {
        const { buildingQualificationBoList, contactInfoList } = res.data;
        this.$set(
          this.form,
          "buildingQualificationBoList",
          buildingQualificationBoList
        );
        this.$set(this.form, "contactInfoList", contactInfoList);
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

    /** 查询商机记录列表 */
    getList() {
      this.loading = true;
      listOpportunity(this.queryParams).then((response) => {
        this.opportunityList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        userId: undefined,
        title: undefined,
        status: 0,
        projectType: undefined,
        consultTimee: undefined,
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
      getOpportunity(id).then((response) => {
        this.loading = false;
        this.form = response.data;

        this.form.opportunityProjectBoList = this.form.opportunityProjectVoList
          ? JSON.parse(JSON.stringify(this.form.opportunityProjectVoList))
          : [];
        this.form.opportunityProjectBoList =
          this.form.opportunityProjectBoList.map((item) => ({
            ...item,
            quantity: 1,
            unitPrice: 0,
            isEdit: true,
          }));
        console.log(this.form.opportunityProjectBoList, "6666");
        this.form.archiveId = response.data.archiveId;
        const { province, city, area } = this.form;
        this.selectedOptions = province ? [province, city, area] : [];
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.opportunityProjectBoList =
            this.form.opportunityProjectBoList.map((item) => {
              let projectId = item.projectId || item.id;

              // if (!item.isEdit) delete item.id;
              delete item.id;
              return {
                ...item,
                // allCategoryName: item.allCategoryName,
                // projectType: item.projectType,
                // projectName: item.projectName,
                // quantity: item.quantity,
                // unitPrice: item.unitPrice,
                projectId: projectId,
                isGift: 0,
              };
            });

          console.log(this.form);

          this.buttonLoading = true;
          if (this.type == 1) {
            updateOpportunity(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                setTimeout(() => {
                  this.$router.push({ name: "Opportunity" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 0) {
            this.form.createTime = undefined;
            this.form.updateTime = undefined;
            addOpportunity(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                setTimeout(() => {
                  this.$router.push({ name: "Opportunity" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 2) {
            convert(this.form)
              .then((response) => {
                this.$modal.msgSuccess("转商机成功");
                setTimeout(() => {
                  this.$router.push({ name: "Opportunity" });
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

.project {
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: scroll;
  top: 40px;
  left: 0;
  z-index: 9999;
  padding: 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
