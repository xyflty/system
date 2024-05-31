<template>
  <div @click="showTree = false" class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>转为订单</span>
        <span style="float: right; padding: 3px 0"><span style="color: red"> * </span> 为必填项
        </span>
      </div>

      <el-form ref="form" :rules="rules" :model="form" label-width="200px">
        <el-form-item label="订单标题" prop="title" style="position: relative">
          <el-input v-model="form.title" placeholder="订单标题" @click.stop.native="showTree = true" @input="titleMet">
          </el-input>
          <div class="project" v-show="showTree">
            <el-tree @click.stop="showTree = true" :data="options" :props="defaultProps"
              @node-click="handleNodeClick"></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input disabled v-model="form.companyName" placeholder="企业名称" />
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
            :on-remove="changeUpload" :on-change="changeUpload" multiple>
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
import {
  getchannelOpportunity,
  getchannelOpportunityconversion,
} from "../../../../api/irrigationDitch/opportunity";
import { mapState } from "vuex";
import { findItemById } from "@/utils/ruoyi";
import addPerson from "../../../core/components/addPerson.vue";
import addSubsidiary from "../components/addSubsidiary.vue";
import addProject from "../components/addProject.vue";
import addItem from "../components/addItem.vue";
export default {
  components: { addPerson, addProject, addItem, addSubsidiary },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  data() {
    return {
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
      fileList: [],
      form: {},
      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      showTree: false,
      // 定时器
      time: undefined,
    };
  },
  destroyed() {
    clearTimeout(this.time);
  },
  created() {
    this.id = this.$route.query.id;
    this.getProjectCategoryTree();

    if (this.id) {
      getchannelOpportunity(this.id).then((res) => {
        // this.$set(this.form, "companyName", res.data.companyName);
        var data = res.data;
        for (const key in data) {
          if (typeof data[key] != "object") {
            this.form[key] = data[key];
          }
        }
        this.$set(this.form, "opportunityId", res.data.id);
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
        this.form.id = undefined;
      });
    }
  },
  methods: {
    submitAdd() {
      if (this.form.channelOrderProjectBoList) {
        this.form.channelOrderProjectBoList.forEach((res) => {
          if (!res.projectId) {
            res.projectId = JSON.parse(JSON.stringify(res.id));
            delete res.id;
          }
        });
      }

      if (this.fileList.length) {
        fileFwbUpload(this.fileList[0].raw).then((res) => {
          this.form.attachment = res.data.url;
          this.$refs["form"].validate((valid) => {
            if (valid) {
              getchannelOpportunityconversion(this.form).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.$router.push({ name: "IrrigationDitch/Opportunity" });
              });
            }
          });
        });
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            getchannelOpportunityconversion(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$router.push({ name: "IrrigationDitch/Opportunity" });
            });
          }
        });
      }
    },
    changeUpload(file, fileList) {
      this.fileList[0] = file;
    },
    titleMet(name) {
      var _this = this;
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        _this.getProjectCategoryTree(name);
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