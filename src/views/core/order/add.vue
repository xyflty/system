<template>
  <div @click="showTree = false">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <span>{{ typeString[type] }}</span>
        <span style="color: red">*为必填项</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item
          v-if="type == 0 || type == 1"
          label="关联商机"
          prop="archiveId"
        >
          <el-select
            v-if="type == 0"
            v-model="form.opportunityName"
            :clearable="true"
            @clear="
              form.companyName = undefined;
              form.archiveId = undefined;
            "
          >
            <el-option
              v-for="opportunity in opportunityList"
              :key="opportunity.id"
              :label="opportunity.title"
              :value="opportunity.title"
              @click.native="opportunityChange(opportunity)"
            />
          </el-select>
          <el-input v-else :disabled="true" v-model="form.opportunityName" />
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input
            :disabled="true"
            v-model="form.companyName"
            placeholder="请输入企业名称"
          />
        </el-form-item>
        <!-- <el-form-item label="订单标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入订单标题" />
      </el-form-item> -->

        <el-form-item label="订单标题" prop="title" style="position: relative">
          <el-input
            v-model="form.title"
            placeholder="订单标题"
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

        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="form.orderStatus" :clearable="true">
            <el-option
              v-for="orderStatus in commonData.orderStatusList"
              :key="orderStatus.id"
              :label="orderStatus.label"
              :value="orderStatus.value"
            />
          </el-select>
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

        <el-form-item label="是否特殊订单" prop="orderType">
          <!-- <el-radio-group v-model="form.specialFlag ? 1 : 0">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
            
          </el-radio-group> -->
          <el-checkbox
            v-model="form.orderType"
            :true-label="3"
            :false-label="null"
          ></el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="订单类型" prop="orderType">
          <el-select v-model="form.orderType" :clearable="true">
            <el-option
              v-for="orderType in commonData.orderTypeList"
              :key="orderType.value"
              :label="orderType.label"
              :value="orderType.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="关联项目" prop="orderProjects">
          <addProject
            v-if="$route.query.type == 2"
            @addProMet="addProMet"
            :orderProjects.sync="form.orderProjects"
            :price.sync="form.price"
          />

          <addProject
            v-else
            @addProMet="addProMet"
            :orderProjects.sync="form.orderProjects"
            type="order"
          />
        </el-form-item>
        <el-form-item label="订单总金额" prop="price">
          <el-input
            v-model="form.price"
            type="number"
            placeholder="请输入订单总金额"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="签单日期" prop="signTime">
          <el-date-picker
            clearable
            v-model="form.signTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择签单日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单开始时间" prop="beginTime">
          <el-date-picker
            clearable
            v-model="form.beginTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户签约人" prop="customerSigner">
          <el-input
            v-model="form.customerSigner"
            placeholder="请输入客户签约人"
          />
        </el-form-item>
        <el-form-item label="我方签约人" prop="ourSigner">
          <el-input v-model="form.ourSigner" placeholder="请输入我方签约人" />
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod">
          <el-select v-model="form.paymentMethod" :clearable="true">
            <el-option
              v-for="paymentMethod in commonData.paymentMethodList"
              :key="paymentMethod.value"
              :label="paymentMethod.label"
              :value="paymentMethod.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上传附件 todo" prop="attachment">
        <el-input v-model="form.paymentMethod" placeholder="上传附件" />
      </el-form-item> -->
        <el-form-item label="上传附件" prop="attachment">
          <!-- 上传多张 -->
          <!-- <el-upload
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
        </el-upload> -->

          <el-upload
            drag
            action=""
            :file-list="fileList"
            :http-request="uploadImg"
            :show-file-list="true"
            :auto-upload="true"
            :limit="5"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <!-- <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div> -->
          </el-upload>
          <!-- 上传多张 -->
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="三库账号" prop="threeLibraryAccount">
              <el-input
                v-model="form.customerAccount.threeLibraryAccount"
                placeholder="请输入三库账号"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三库密码" prop="threeLibraryPassword">
              <el-input
                v-model="form.customerAccount.threeLibraryPassword"
                placeholder="请输入三库密码"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一建账号" prop="constructorAccount">
              <el-input
                v-model="form.customerAccount.constructorAccount"
                placeholder="请输入一建账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一建密码" prop="constructorPassword">
              <el-input
                v-model="form.customerAccount.constructorPassword"
                placeholder="请输入一建密码"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="二建账号" prop="associateConstructorAccount">
              <el-input
                v-model="form.customerAccount.associateConstructorAccount"
                placeholder="请输入二建账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二建密码" prop="associateConstructorPassword">
              <el-input
                v-model="form.customerAccount.associateConstructorPassword"
                placeholder="请输入二建密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社保账号" prop="socialSecurityAccount">
              <el-input
                v-model="form.customerAccount.constructorAccount"
                placeholder="请输入一建账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一建密码" prop="constructorPassword">
              <el-input
                v-model="form.customerAccount.constructorPassword"
                placeholder="请输入一建密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="政务网络账号"
              prop="governmentAffairsNetworkAccount"
            >
              <el-input
                v-model="form.customerAccount.associateConstructorAccount"
                placeholder="请输入二建账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="政务网络密码"
              prop="governmentAffairsNetworkPassword"
            >
              <el-input
                v-model="form.customerAccount.associateConstructorPassword"
                placeholder="请输入二建密码"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="投标加分项" prop="tenderList">
          <addPoints :list.sync="form.customerAccount.tenderList" />
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            v-model="form.note"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div class="footer-box">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">重置</el-button>
      </div>
      <customerInfo
        :dialogVisible.sync="dialogVisible"
        :archiveId="form.archiveId"
      />
    </el-card>
  </div>
</template>

<script>
import { listOrder, getOrder, addOrder, updateOrder } from "@/api/core/order";
import {
  convert,
  getOpportunityList,
  getProjectCategoryTree,
  getOpportunity,
} from "@/api/core/opportunity";
import addProject from "@/views/core/components/addProject.vue";
import addPoints from "@/views/core/components/addPoints.vue";
import { fileUpload } from "@/api/upload/upload";

import customerInfo from "@/views/core/components/customerInfo.vue";

import { mapState } from "vuex";
import { findItemById } from "@/utils/ruoyi";

export default {
  name: "AddOrder",
  components: { addProject, addPoints, customerInfo },
  data() {
    return {
      // 判断是否提交错误
      SubmitErrors: true,
      fileList: [],
      dialogVisible: false,

      // 商机下拉框列表
      opportunityList: [],
      typeString: ["添加订单", "编辑订单", "转为订单"],
      id: 0,
      type: 0, // 0添加 1 编辑
      buttonLoading: false,
      form: {
        specialFlag: 0,
        orderProjects: [],
        customerAccount: {
          threeLibraryAccount: "",
          threeLibraryPassword: "",
          constructorPassword: "",
          constructorAccount: "",
          associateConstructorPassword: "",
          associateConstructorAccount: "",
        },
      },
      rules: {
        opportunityName: [
          { required: true, message: "关联商机不能为空", trigger: "change" },
        ],
        title: [
          { required: true, message: "订单标题不能为空", trigger: "change" },
        ],
        orderStatus: [
          { required: true, message: "订单状态不能为空", trigger: "change" },
        ],
        price: [
          { required: true, message: "订单金额不能为空", trigger: "change" },
        ],
        signTime: [
          { required: true, message: "签单日期不能为空", trigger: "change" },
        ],
        // orderType: [
        //   { required: true, message: "订单类型不能为空", trigger: "change" },
        // ],
        orderProjects: [
          { required: true, message: "关联项目不能为空", trigger: "change" },
        ],
        customerType: [
          { required: true, message: "客户类型不能为空", trigger: "change" },
        ],
      },

      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      showTree: false,
      priceData: "",
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    // "form.orderProjects": {

    //   handler(val) {

    //       this.$refs["form"].validateField('orderprojects')

    //   },

    // },
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
  },
  mounted() {
    this.getOpportunityList();
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;

    if (this.id) {
      this.handleUpdate();
    }
    if (this.type == 2) {
      this.form = JSON.parse(this.$route.query.form);
      this.form.opportunityName = this.form.title;
      this.form.title = undefined;

      this.form.opportunityId = this.form.id;
      this.getOpportunityInfo(this.form.id);

      this.form.id = undefined;

      this.$set(this.form, "customerAccount", {
        threeLibraryAccount: "",
        threeLibraryPassword: "",
        constructorPassword: "",
        constructorAccount: "",
        associateConstructorPassword: "",
        associateConstructorAccount: "",
      });
    }

    this.getProjectCategoryTree();
  },
  beforeDestroy() {
    this.fileList = [];
  },

  methods: {
    addProMet() {
      //  if (this.SubmitErrors) {
      //   console.log(123456);
      //     this.$refs["form"].validateField('orderprojects')
      //  } else {

      this.$refs["form"].validate();
      //  }
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

    //商机下拉框改变
    opportunityChange(obj) {
      this.$set(this.form, "archiveId", obj.archiveId);
      this.$set(this.form, "companyName", obj.companyName);
    },
    /** 查询订单记录列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
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
        specialFlag: 0,
        id: undefined,
        archiveId: undefined,
        userId: undefined,
        title: undefined,
        price: undefined,
        signTime: undefined,
        beginTime: undefined,
        endTime: undefined,
        customerSigner: undefined,
        ourSigner: undefined,
        paymentMethod: undefined,
        status: 0,
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
      this.loading = true;
      this.reset();
      const id = this.id;
      this.form.customerAccount = {};

      getOrder(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.priceData = this.form.price;
        this.form.archiveId = response.data.archiveId;
        this.open = true;
        this.title = "修改订单记录";
        if (this.form.attachment != null && this.form.attachment.length) {
          let arr = this.form.attachment.split(",");
          arr.forEach((item) => {
            this.fileList.push({
              name: `${item.split("/")[item.split("/").length - 1]}`,
              status: "success",
              uid: Date.now() - Math.floor(Math.random() * 10),
              url: item,
            });
          });
        }
      });
    },

    // 获取客户详情
    getOpportunityInfo(id) {
      getOpportunity(id).then((res) => {
        let orderProjectVoList = res.data.orderProjectVoList;
        if (orderProjectVoList) {
          orderProjectVoList = orderProjectVoList.map((item) => ({
            ...item,
            id: item.projectId,
            quantity: 1,
            isGift: item.isGift || 0,
            unitPrice:
              item.isGift == 0
                ? item.unitPrice
                  ? item.unitPrice
                  : item.guidancePrice
                : "0",
          }));
        }

        this.$set(
          this.form,
          "orderProjects",
          JSON.parse(JSON.stringify(orderProjectVoList))
        );
        this.form.title = res.data.title;
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
    handlePreview(e) {
      open(e.url);
    },

    /** 图片上传 */
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

    // 判断非赠品价格是否为空
    isGiftPriceEmpty(data) {
      if (data && data.length) {
        return data.some((item) => {
          console.log({ item });
          return (
            item.isGift === 0 &&
            (item.unitPrice === "0.00" ||
              item.unitPrice === "0" ||
              item.unitPrice === "")
          );
        });
      }
    },

    /** 提交按钮 */
    submitForm() {
      // console.log(this.form,'转订单的数据');
      let attachment = "";
      if (this.fileList.length) {
        this.fileList.forEach((item) => {
          attachment += `,${item.url}`;
        });
        this.form.attachment = attachment.slice(1);
      }

      // 判断非赠品价格是否为空
      // let isEmpty = this.isGiftPriceEmpty(this.form.orderProjects);

      // if (isEmpty) {
      //   this.$message.error("请填写非赠品项目单价或者项目为赠品");
      //   return;
      // }

      if (this.form.orderProjects && this.form.orderProjects.length) {
        this.form.orderProjects.forEach((val) => {
          if (!val.hasOwnProperty("isGift") || val.isGift == null) {
            val.isGift = 0;
          }
          if (val.projectId == undefined) {
            val.projectId = val.id;
          }
          delete val.id;
        });
      }

      this.form.customerAccount.companyName = this.form.companyName;

      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.type == 1) {
            updateOrder(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                // this.open = false;
                // this.getList();
                setTimeout(() => {
                  this.$router.push({ name: "Order" });
                }, 1000);
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 0) {
            //新增订单也调用转换接口

            convert(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");

                // this.open = false;
                // this.getList();
                // setTimeout(() => {
                //   this.$router.push({ name: "Order" });
                // }, 1000);

                this.dialogVisible = true;
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else if (this.type == 2) {
            convert(this.form)
              .then((response) => {
                this.$modal.msgSuccess("转订单成功");
                // setTimeout(() => {
                //   this.$router.push({ name: "Order" });
                // }, 1000);
                this.dialogVisible = true;
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        } else {
          this.SubmitErrors = false;
        }
      });
    },
    getOpportunityList() {
      getOpportunityList().then((response) => {
        this.opportunityList = response;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/dialog.scss";

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
