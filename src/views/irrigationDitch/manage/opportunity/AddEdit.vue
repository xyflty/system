<template>
  <div @click="addEShowMet" class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑商机</span>
        <span style="float: right; padding: 3px 0"><span style="color: red"> * </span> 为必填项
        </span>
      </div>
      <el-form ref="form" :rules="rules" :model="form" label-width="200px">
        <el-form-item label="商机标题" prop="title" style="position: relative">
          <el-input v-model="form.title" placeholder="商机标题" @click.stop.native="showTree = true" @input="titleMet">
          </el-input>
          <div class="project" v-show="showTree">
            <el-tree @click.stop="showTree = true" :data="options" :props="defaultProps"
              @node-click="handleNodeClick"></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="企业名称" @click.stop.native="companyNameShow = true"
            @input="companyNameMet" />
          <div class="project" v-show="companyNameShow">
            <el-tree @click.stop="companyNameShow = true" :data="companyNameOptions" :props="defaultProps1"
              @node-click="handleNodeClickCompany"></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="法人" prop="legalPerson">
          <el-input v-model="form.legalPerson" placeholder="法人" />
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="form.dataSource" :clearable="true">
            <el-option v-for="dataSource in commonData.dataSourceList" :key="dataSource.value" :label="dataSource.label"
              :value="dataSource.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-select v-model="form.customerType" :clearable="true">
            <el-option label="企业客户" :value="1" />
            <el-option label="个人客户" :value="2" />
            <el-option label="渠道客户" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人信息" prop="channelContactInfoBoList">
          <addPerson :list.sync="form.channelContactInfoBoList" />
        </el-form-item>
        <el-form-item label="商机关联项目" prop="channelRelevanceProjectBoList">
          <addProject :orderProjects.sync="form.channelRelevanceProjectBoList" :price.sync="form.price" />
        </el-form-item>
        <el-form-item label="客户优势项目与主营项目" prop="channelDomainProjectBoList">
          <addItem :list.sync="form.channelDomainProjectBoList" />
        </el-form-item>

        <el-form-item label="关联子公司" prop="channelSubsidiaryBoList">
          <addSubsidiary :list.sync="form.channelSubsidiaryBoList" />
        </el-form-item>

        <el-form-item label="咨询日期" prop="consultTime">
          <el-date-picker v-model="form.consultTime" type="datetime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在地区" prop="area">
          <ProvinceSelect ref="province" size="small" placeholder="客户所在地" :checkStrictly="true"
            :selectedOptions="[form.province, form.city, form.area]" @change="(e) => (form = { ...form, ...e })" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请填写详细地址" />
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="lastNextFollowUpTime">
          <el-date-picker v-model="form.lastNextFollowUpTime" type="datetime" placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跟进内容" prop="remindContent">
          <el-input v-model="form.remindContent" placeholder="跟进内容" />
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
import { getProjectCategoryTree } from "@/api/core/opportunity";
import { mapState } from "vuex";
import { findItemById } from "@/utils/ruoyi";
import addPerson from "../../../core/components/addPerson.vue";
import addProject from "../components/addProject.vue";
import addItem from "../components/addItem.vue";
import addSubsidiary from "../components/addSubsidiary.vue";
import {
  getChannelOpportunity,
  getchannelOpportunity,
  channelOpportunity,
  getchannelChannelCustomerListByName,
} from "../../../../api/irrigationDitch/opportunity";
import { getchannelchannelCustomerId } from "../../../../api/irrigationDitch/customer";
export default {
  components: { addPerson, addProject, addItem, addSubsidiary },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  data() {
    return {
      // 修改的客户id
      id: undefined,
      // 必传参数
      rules: {
        title: [
          {
            required: true,
            message: "商机标题不能为空",
            trigger: ["blur", "change"],
          },
        ],
        customerType: [
          {
            required: true,
            message: "客户类型不能为空",
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
      },
      // 请求数据
      form: {},
      // 商机标题
      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultProps1: {
        label: "companyName",
        value: "id",
      },
      showTree: false,
      // 定时器
      time: undefined,
      companyNameShow: false,
      companyNameTime: undefined,
      companyNameOptions: [],
    };
  },
  destroyed() {
    clearTimeout(this.time);
    clearTimeout(this.companyNameTime);
  },
  created() {
    this.getProjectCategoryTree();
    getchannelChannelCustomerListByName().then((res) => {
      this.companyNameOptions = res;
    });
    if (this.$route.query.customerId) {
      this.form.customerId = this.$route.query.customerId;
      this.getchannelchannelCustomerId();
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getchannelOpportunity();
    }
  },
  methods: {
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
            channelOpportunity(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.$router.push({ name: "IrrigationDitch/Opportunity" });
            });
          } else {
            getChannelOpportunity(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$router.push({ name: "IrrigationDitch/Opportunity" });
            });
          }
        }
      });
    },
    titleMet(name) {
      var _this = this;
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        _this.getProjectCategoryTree(name);
      }, 500);
    },

    companyNameMet(companyName) {
      var _this = this;
      clearTimeout(this.companyNameTime);
      this.companyNameTime = setTimeout(() => {
        getchannelChannelCustomerListByName({ companyName }).then((res) => {
          _this.companyNameOptions = res;
        });
      }, 500);
    },

    handleNodeClick(data) {
      if (data.children && data.children.length) {
        return;
      }
      const params = findItemById(this.options, data.parentId);
      let title = params ? params.label + " - " + data.label : data.label;
      this.$set(this.form, "title", title);
    },
    handleNodeClickCompany(data) {
      this.$set(this.form, "companyName", data.companyName);
      this.form.customerId = data.id;
      this.getchannelchannelCustomerId();
    },
    getProjectCategoryTree(categoryName) {
      getProjectCategoryTree({ categoryName }).then((res) => {
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
    addEShowMet() {
      this.showTree = false;
      this.companyNameShow = false;
    },

    getchannelchannelCustomerId() {
      getchannelchannelCustomerId(this.form.customerId).then((res) => {
        this.$set(this.form, "companyName", res.data.companyName);
        this.$set(this.form, "legalPerson", res.data.legalPerson);
        this.$set(this.form, "dataSource", res.data.dataSource);
        this.$set(this.form, "consultTime", res.data.consultTime);
        this.$set(this.form, "address", res.data.address);
        this.$set(this.form, "province", res.data.province);
        this.$set(this.form, "city", res.data.city);
        this.$set(this.form, "area", res.data.area);
        this.$set(this.form, "remindContent", res.data.remindContent);
        this.$set(this.form, "customerType", res.data.customerType);
        this.$set(
          this.form,
          "lastNextFollowUpTime",
          res.data.lastNextFollowUpTime
        );
        this.$set(
          this.form,
          "channelContactInfoBoList",
          res.data.channelContactInfoVoList
        );
        this.$set(
          this.form,
          "channelDomainProjectBoList",
          res.data.channelDomainProjectVoList
        );
        this.$set(
          this.form,
          "channelSubsidiaryBoList",
          res.data.channelSubsidiaryVoList
        );
        // channelSubsidiaryBoList
      });
    },

    getchannelOpportunity() {
      getchannelOpportunity(this.id).then((res) => {
        res.data.channelContactInfoBoList = res.data.channelContactInfoVoList;
        res.data.channelDomainProjectBoList =
          res.data.channelDomainProjectVoList;
        res.data.channelRelevanceProjectBoList =
          res.data.channelRelevanceProjectVoList;
        res.data.channelSubsidiaryBoList = res.data.channelSubsidiaryVoList;
        this.form = res.data;
        this.form.createTime = undefined;
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