<template>
  <div @click="showTree = false" class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑商机</span>
        <span style="float: right; padding: 3px 0"><span style="color: red"> * </span> 为必填项
        </span>
      </div>

      <el-form ref="form" :rules="rules" :model="form" label-width="200px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="基础信息"> </el-form-item>
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="企业名称" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="form.legalPerson" placeholder="法人" />
            </el-form-item>
            <el-form-item label="客户等级" prop="customerGrade">
              <el-select style="width: 100%" placeholder="客户等级" v-model="form.customerGrade" :clearable="true">
                <el-option v-for="customerGrade in commonData.customerGradeList" :key="customerGrade.value"
                  :label="customerGrade.label" :value="customerGrade.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="市场人员" prop="marketingUserId">
              <el-select style="width: 100%" v-model="form.marketingUserId" filterable clearable placeholder="市场人员"
                remote>
                <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源" prop="dataSource">
              <el-select v-model="form.dataSource" :clearable="true">
                <el-option v-for="dataSource in commonData.dataSourceList" :key="dataSource.value"
                  :label="dataSource.label" :value="dataSource.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户类型" prop="customerType">
              <el-select v-model="form.customerType" :clearable="true">
                <el-option label="企业客户" :value="1" />
                <el-option label="个人客户" :value="2" />
                <el-option label="渠道客户" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据归属" prop="deptId">
              <treeselect v-model="form.deptId" appendToBody style="margin-left: 10px; max-width: 200px"
                :options="deptOptions" value-consists-of="LEAF_PRIORITY" :show-count="true" placeholder="数据归属" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附加信息"> </el-form-item>
            <el-form-item label="客户所在地" prop="area">
              <ProvinceSelect ref="province" size="small" placeholder="客户所在地" :checkStrictly="true"
                :selectedOptions="[form.province, form.city, form.area]" @change="(e) => (form = { ...form, ...e })" />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请填写详细地址" />
            </el-form-item>
            <el-form-item label="跟进时间" prop="lastFollowUpTime">
              <el-date-picker v-model="form.lastFollowUpTime" type="datetime" placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进内容" prop="remindContent">
              <el-input v-model="form.remindContent" placeholder="跟进内容" />
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" v-model="form.note" placeholder="备注" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="联系人信息" prop="channelContactInfoBoList">
          <addPerson :list.sync="form.channelContactInfoBoList" />
        </el-form-item>

        <el-form-item label="客户优势项目与主营项目" prop="orderProjects">
          <addItem :list.sync="form.channelDomainProjectBoList" />
        </el-form-item>

        <el-form-item label="关联子公司" prop="orderProjects">
          <addSubsidiary :list.sync="form.channelSubsidiaryBoList" />
        </el-form-item>
      </el-form>

      <div style="display: flex; justify-content: center">
        <el-button @click="submitForm" type="primary" plain>提交</el-button>
        <el-button @click="form = {}" type="primary" plain>重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listUser } from "@/api/system/user";
import { getProjectCategoryTree } from "@/api/core/opportunity";
import { mapState } from "vuex";
import { findItemById } from "@/utils/ruoyi";
import addPerson from "../../../core/components/addPerson.vue";
import addItem from "../components/addItem.vue";
import addSubsidiary from "../components/addSubsidiary.vue";
import {
  getchannelchannelCustomer,
  getchannelchannelCustomerId,
  getchannelchannelCustomerPut,
} from "../../../../api/irrigationDitch/customer";
export default {
  components: { addPerson, addItem, addSubsidiary, Treeselect },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  data() {
    return {
      id: undefined,
      rules: {
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: ["blur", "change"],
          },
        ],
        channelContactInfoBoList: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: ["blur", "change"],
          },
        ],
        customerType: [
          {
            required: true,
            message: "客户类型不能为空",
            trigger: ["blur", "change"],
          }
        ]
        // area: [
        //   {
        //     required: true,
        //     message: "所在地区不能为空",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // address: [
        //   {
        //     required: true,
        //     message: "详细地区不能为空",
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      form: {},
      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      showTree: false,
      userList: [],
      deptOptions: [],
    };
  },
  created() {
    this.getUserList();
    this.getTreeselect();
    this.id = this.$route.query.id;
    this.getProjectCategoryTree();

    if (this.id) {
      getchannelchannelCustomerId(this.id).then((res) => {
        res.data.channelContactInfoBoList = res.data.channelContactInfoVoList;
        res.data.channelDomainProjectBoList =
          res.data.channelDomainProjectVoList;
        res.data.channelRelevanceProjectBoList =
          res.data.channelRelevanceProjectVoList;
        res.data.channelSubsidiaryBoList = res.data.channelSubsidiaryVoList;
        res.data.customerGrade = res.data.customerGrade
          ? Number(res.data.customerGrade)
          : null;
        this.form = res.data;
        this.form.createTime = undefined;
      });
    }
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.channelRelevanceProjectBoList) {
            this.form.channelRelevanceProjectBoList.forEach((res) => {
              if (!res.projectId) {
                res.projectId = JSON.parse(JSON.stringify(res.id));
                delete res.id;
              }
            });
          }
          if (this.form.id != null) {
            getchannelchannelCustomerPut(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.$router.push({ name: "IrrigationDitch/customer" });
            });
          } else {
            getchannelchannelCustomer(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$router.push({ name: "IrrigationDitch/customer" });
            });
          }
        }
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
    getProjectCategoryTree() {
      getProjectCategoryTree().then((res) => {
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
  },
};
</script>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 80%;
  margin: auto;
}

.el-form {
  padding-right: 5%;
}
</style>