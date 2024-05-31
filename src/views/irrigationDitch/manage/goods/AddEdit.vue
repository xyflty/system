<template>
  <div @click="addEShowMet" class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>转为订单</span>
        <span style="float: right; padding: 3px 0"><span style="color: red"> * </span> 为必填项
        </span>
      </div>

      <el-form ref="form" :rules="rules" :model="form" label-width="200px">
        <el-form-item label="关联商机" prop="opportunityId">
          <el-select :disabled="id ? true : false" v-model="form.opportunityId">
            <el-option v-for="orderStatus in getchannelOpportunitylistOptionData" :key="orderStatus.id"
              :label="orderStatus.title" :value="orderStatus.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单标题" prop="title" style="position: relative">
          <el-input v-model="form.title" placeholder="订单标题" @click.stop.native="showTree = true" @input="titleMet">
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

        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="form.orderStatus" :clearable="true">
            <el-option v-for="orderStatus in commonData.orderStatusList" :key="orderStatus.id" :label="orderStatus.label"
              :value="orderStatus.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
          <el-select v-model="form.customerType" :clearable="true">
            <el-option label="企业客户" :value="1" />
            <el-option label="个人客户" :value="2" />
            <el-option label="渠道客户" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单总金额" prop="price">
          <el-input v-model="form.price" placeholder="订单总金额" />
        </el-form-item>
        <el-form-item label="签单日期" prop="signTime">
          <el-date-picker v-model="form.signTime" type="datetime" placeholder="选择签单日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户签约人" prop="customerSigner">
          <el-input v-model="form.customerSigner" placeholder="请输入客户签约人" />
        </el-form-item>
        <el-form-item label="我方签约人" prop="ourSigner">
          <el-input v-model="form.ourSigner" placeholder="请输入我方签约人" />
        </el-form-item>
        <el-form-item label="联系人信息" prop="channelContactInfoBoList">
          <addPerson :list.sync="form.channelContactInfoBoList" />
        </el-form-item>
        <el-form-item label="关联子公司" prop="orderProjects">
          <addSubsidiary :list.sync="form.channelSubsidiaryBoList" />
        </el-form-item>
        <el-form-item label="成交项目" prop="channelOrderProjectBoList">
          <addProject typeP="2" :orderProjects.sync="form.channelOrderProjectBoList" :price.sync="form.price" />
        </el-form-item>
        <el-form-item label="客户优势项目与主营项目" prop="channelDomainProjectBoList">
          <addItem :list.sync="form.channelDomainProjectBoList" />
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod">
          <el-select v-model="form.paymentMethod" :clearable="true" placeholder="付款方式">
            <el-option v-for="paymentMethod in commonData.paymentMethodList" :key="paymentMethod.value"
              :label="paymentMethod.label" :value="paymentMethod.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileList">
          <el-upload drag action="" :limit="1" :http-request="() => { }" :show-file-list="true" :auto-upload="true"
            :on-remove="changeUpload" :on-change="changeUpload" multiple :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" placeholder="备注" />
        </el-form-item>
      </el-form>

      <div style="display: flex; justify-content: center">
        <el-button @click="submitAdd" type="primary" plain>提交</el-button>
        <el-button @click="form = {}" type="primary" plain>重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fileFwbUpload } from "@/api/upload/upload";
import { getProjectCategoryTree } from "@/api/core/opportunity";
import { getchannelChannelCustomerListByName } from "../../../../api/irrigationDitch/opportunity";
import {
  getchannelOrderId,
  getchannelchannelOrder,
  getchannelOpportunitylistOption,
  getchannelchannelOrderPost,
} from "../../../../api/irrigationDitch/goods";
import { mapState } from "vuex";
import { findItemById } from "@/utils/ruoyi";
import addPerson from "../../../core/components/addPerson.vue";
import addSubsidiary from "../components/addSubsidiary.vue";
import addProject from "../components/addProject.vue";
import addItem from "../components/addItem.vue";
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
      id: undefined,
      rules: {
        title: [
          {
            required: true,
            message: "商机标题不能为空",
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
      fileList: [],
      form: {},
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
      // 获取商机选择列表
      getchannelOpportunitylistOptionData: [],
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
    this.getchannelOpportunitylistOption();
    getchannelChannelCustomerListByName().then((res) => {
      this.companyNameOptions = res;
    });
    this.getProjectCategoryTree();

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getchannelOrderId(getchannelOrderId, this.id);
    }
    if (this.$route.query.customerId) {
      this.form.customerId = this.$route.query.customerId;
      this.getchannelOrderId(
        getchannelchannelCustomerId,
        this.form.customerId,
        true
      );
    }
  },
  methods: {
    addEShowMet() {
      this.showTree = false;
      this.companyNameShow = false;
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
    handleNodeClickCompany(data) {
      this.$set(this.form, "companyName", data.companyName);
      this.form.customerId = data.id;
      this.getchannelOrderId(
        getchannelchannelCustomerId,
        this.form.customerId,
        true
      );
    },
    submitAdd() {
      var order = this.id ? getchannelchannelOrder : getchannelchannelOrderPost;
      if (this.form.channelOrderProjectBoList) {
        this.form.channelOrderProjectBoList.forEach((res) => {
          if (!res.projectId) {
            res.projectId = JSON.parse(JSON.stringify(res.id));
            delete res.id;
          }
        });
      }
      if (this.fileList.length && this.fileList[0].size) {
        fileFwbUpload(this.fileList[0].raw).then((res) => {
          this.form.attachment = res.data.url;
          this.$refs["form"].validate((valid) => {
            if (valid) {
              order(this.form).then((response) => {
                this.$modal.msgSuccess(this.id ? "修改成功" : "新增成功");
                this.$router.push({ name: "IrrigationDitch/goods" });
              });
            }
          });
        });
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            order(this.form).then((response) => {
              this.$modal.msgSuccess(this.id ? "修改成功" : "新增成功");
              this.$router.push({ name: "IrrigationDitch/goods" });
            });
          }
        });
      }
    },
    // 获取商机选择列表
    getchannelOpportunitylistOption() {
      getchannelOpportunitylistOption().then((res) => {
        this.getchannelOpportunitylistOptionData = res.data;
      });
    },
    titleMet(name) {
      var _this = this;
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        _this.getProjectCategoryTree(name);
      }, 500);
    },
    changeUpload(file, fileList) {
      this.fileList[0] = file;
    },
    handleNodeClick(data) {
      if (data.children && data.children.length) {
        return;
      }
      const params = findItemById(this.options, data.parentId);
      let title = params ? params.label + " - " + data.label : data.label;
      this.$set(this.form, "title", title);
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

    getchannelOrderId(name, id, bo) {
      name(id).then((res) => {
        var data = res.data;
        if (bo) {
          data.id = undefined;
          data.createTime = undefined;
          data.turnCustomerTime = undefined;
          data.updateTime = undefined;
        }
        for (const key in data) {
          if (typeof data[key] != "object") {
            this.$set(this.form, key, data[key]);
          }
        }
        if (res.data.attachment) {
          let file = res.data.attachment.substring(
            res.data.attachment.lastIndexOf("/") + 1,
            res.data.attachment.lastIndexOf(".")
          );
          this.$set(this.fileList, 0, { url: res.data.attachment, name: file });
        }
        this.$set(
          this.form,
          "channelOrderProjectBoList",
          res.data.channelOrderProjectVoList
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