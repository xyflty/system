<template>
  <!-- 新增待办 -->
  <FromModel
    :title="title"
    ref="fromModelRef"
    :form.sync="waitForm"
    :option="waitOption"
    :config="$attrs.config"
    @submit="handleSubmit"
  >
    <template slot="type">
      <el-select
        :disabled="archiveDisabled"
        style="width: 100%"
        v-model="waitForm.type"
        placeholder="请选择关联业务"
      >
        <el-option
          v-for="(item, index) in commonData.businessTypeList"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <span style="font-size: 12px; color: red"
        >末转为线索商机订单客户的待办，新增时可无须选择关联业务</span
      >
    </template>
    <template slot="archiveId">
      <el-select
        v-if="!archiveDisabled"
        style="width: 100%"
        v-model="waitForm.archiveId"
        filterable
        remote
        :remote-method="getCompanyData"
        placeholder="请选择"
        @change="handleChange"
      >
        <el-option
          v-for="(item, index) in archiveOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        v-else
        :disabled="archiveDisabled"
        v-model="waitForm.companyName"
      />
    </template>
    <template slot="annexList">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        action="#"
        list-type="picture-card"
        :file-list="uploadSendData"
        :http-request="uploadImg"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </template>
  </FromModel>
</template>

<script>
import FromModel from "@/components/FromModel";

import { followUp } from "@/api/core/clue";
import { addFollowUp, updateFollowUp } from "@/api/core/followUp";

import { associateClueData } from "@/api/core/clue";
import { associateOpportunityData } from "@/api/core/opportunity";
import { associateOrderData } from "@/api/core/order";
import { associateCustomerData } from "@/api/core/customer";

// 文件上传
import { fileUpload } from "@/api/upload/upload";
// 获取文件类型
import { getType } from "@/utils/previewAndDownload";

import { systemResourceAnnexDel } from "@/api/workOrderProcessing/qualification";

import { mapState } from "vuex";

export default {
  components: {
    FromModel,
  },
  props: {
    title: {
      type: String,
      default: "新建/跟进待办",
    },
    formType: {
      type: String,
      default: "edit",
    },
    fileType: {
      type: Array,
      default: () => [
        ".jpg",
        ".png",
        ".JPG",
        ".PNG",
        ".jpeg",
        ".pdf",
        ".PDF",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
      ],
    },

    // 关联的类型
    followUpType: {
      type: Number,
      default: null,
    },
    isShowType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      waitForm: {},
      // 新增配置信息
      waitOption: {
        submitBtn: false,
        emptyBtn: false,
        filterDic: true,
        filterNull: true,
        labelWidth: 120,
        size: "mini",
        column: [],
      },
      // 上传
      // 上传文件信息存储
      uploadObj: {},
      // 存储已上传的数据
      uploadSendData: [],
      followedId: "",

      archiveOptions: [],
      archiveDisabled: false,
    };
  },
  methods: {
    setOptions() {
      this.waitOption.column = [
        {
          label: "跟进方式",
          prop: "followUpMethod",
          span: 24,
          type: "select",

          dicData: this.commonData.followMethodList,
          rules: [
            {
              required: true,
              message: "请选择跟进方式",
              trigger: "change",
            },
          ],
        },
        {
          label: "事项事由",
          prop: "title",
          span: 24,
          rules: [
            {
              required: true,
              message: "请输入事项事由",
              trigger: "blur",
            },
          ],
        },
        {
          label: "关联业务",
          prop: "type",
          type: "select",
          dicData: this.commonData.businessTypeList,
          disabled: false,
          display: true,
          formslot: true,
          // change: ({ value }) => {
          //   // 调用接口
          //   this.getCompanyData(value);
          // },
        },
        {
          label: "",
          prop: "archiveId",
          formslot: true,
          labelWidth: 20,
          disabled: false,
          display: true,
          placeholder: "选择",
        },
        {
          label: "跟进情况",
          prop: "content",
          span: 24,
          type: "textarea",
          maxlength: 300,
          minRows: 2,
          maxRows: 4,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: "请输入跟进情况",
              trigger: "blur",
            },
          ],
        },
        {
          label: "跟进结果",
          prop: "result",
          span: 24,
          type: "textarea",
          maxlength: 30,
          minRows: 2,
          maxRows: 4,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: "请输入跟进结果",
              trigger: "blur",
            },
          ],
        },

        {
          label: "是否结束跟进",
          prop: "isEndFollowUp",
          span: 24,
          type: "radio",
          dicData: [
            {
              label: "否",
              value: 0,
            },
            {
              label: "是",
              value: 1,
            },
          ],
        },
        {
          label: "下次跟进",
          prop: "nextFollowUpTime",
          span: 24,
          type: "datetime",
          format: "yyyy-MM-dd",
          valueFormat: "yyyy-MM-dd",
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 86400000;
            },
          },
          display: true,
          rules: [
            {
              required: true,
              message: "请选择下次跟进",
              trigger: "change",
            },
          ],
        },
        {
          label: "是否重点关注",
          prop: "isHeavyPoint",
          span: 24,
          type: "radio",
          dicData: [
            {
              label: "否",
              value: 0,
            },
            {
              label: "是",
              value: 1,
            },
          ],
        },
        {
          label: "跟进人员",
          prop: "userName",
          span: 24,
          disabled: true,
        },
        {
          label: "",
          prop: "status",
          span: 24,
          type: "select",
          dicData: [],
          display: false,
          rules: [
            {
              required: true,
              message: "请选择状态",
              trigger: "change",
            },
          ],
        },
        {
          label: "上传附件",
          prop: "annexList",
          span: 24,
          formslot: true,
        },
      ];
    },

    show(data) {
      this.waitForm = data;
      // 是否跟进，默认为否
      this.waitForm.isEndFollowUp = 0;
      this.waitForm.type = this.followUpType;
      this.followedId = this.waitForm.followedId;
      this.uploadSendData = this.waitForm.annexList || [];

      this.disabledOptions();
      this.disabledDateSelect(this.waitForm.nextFollowUpTime);
      this.$nextTick(() => {
        this.$refs.fromModelRef.show();
      });
    },

    disabledOptions() {
      const { type } = this.waitForm;
      this.waitOption.column[2].disabled = true;
      this.waitOption.column[2].display = this.isShowType;
      this.waitOption.column[3].display = this.isShowType;
      this.archiveDisabled = true;
      console.log(this.waitOption.column, "555555");
      if (!type) {
        // 为空时，允许添加
        this.waitOption.column[2].disabled = false;
        this.archiveDisabled = false;
      }
    },

    // 禁止时间选中
    disabledDateSelect(time) {
      console.log(time);
      if (!time) return;
      // 如果下次跟进已存在，那当前跟进时间之前的都禁止选中
      let row = this.waitOption.column.find(
        (item) => item.prop === "nextFollowUpTime"
      );
      let nextTime = new Date(time).getTime();

      row.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < nextTime;
        },
      };
    },

    handleChange(val) {
      let item = this.archiveOptions.find((item) => item.value === val);
      console.log(item);
      if (!item) return;
      this.followedId = item && item.followedId;
    },

    // 获取公司信息
    getCompanyData(query) {
      const { type } = this.waitForm;

      if (!type) return;

      const { column } = this.waitOption;
      // let optionItem = column.find((item) => item.prop === "archiveId");
      // optionItem.dicData = [];
      let fn = associateClueData;
      if (type === 1) {
        fn = associateClueData;
      } else if (type === 3) {
        fn = associateOpportunityData;
      } else if (type === 4) {
        fn = associateOrderData;
      } else if (type === 5) {
        fn = associateCustomerData;
      }

      fn({ companyName: query }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: [1, 5].includes(type)
              ? item.companyName
              : `${item.title} / ${item.companyName}`, // 回显显示公司名称
            value: type === 5 ? item.id : item.archiveId, //后台存储
            followedId: item.id,
          };
        });
        this.archiveOptions = arr;
      });
    },
    // 提交
    handleSubmit(model, done, hide) {
      if (model.type && !model.archiveId) {
        this.$message.error("请选择公司名称");
        done();
        return;
      }

      let msg = "已新增";
      let fn = addFollowUp;
      let sendData = {
        ...model,
        followedId: this.followedId,
      };

      sendData.annexList = this.uploadSendData;

      if (this.formType === "add") {
        // 新增
        sendData.userId = this.user.userId;

        if (model.type) {
          // 使用有关联类型，使用关联
          fn = followUp;
        } else {
          fn = addFollowUp;
        }
        msg = "已新增";
      } else {
        msg = "已跟进";
        fn = updateFollowUp;
        sendData.isFollowUp = 1;
      }

      console.log({ sendData });
      console.log(this.typeIndex, "typeIndex");

      fn(sendData, {
        type:
          this.typeIndex == 4
            ? "customerArchive"
            : this.commonData.typeEn[this.typeIndex],
      })
        .then((res) => {
          if (res.code === 200) {
            this.$emit("success", this.formType, msg, hide);
          } else {
            this.$message.error(res.msg);
          }
          done();
        })
        .catch(() => {
          done();
        });
    },
    // 上传之前对文件进行校验
    beforeUpload(rawFile) {
      const type = rawFile.name.substring(rawFile.name.lastIndexOf("."));

      const isImage = this.fileType.indexOf(type) > -1;

      let imgSize = Number(rawFile.size / 1024); // kb

      if (!isImage) {
        this.$message.error(
          "上传文件只能是 以 doc/xls/ppt/txt/pdf/zip/rar 格式!"
        );
        return false;
      }
      if (imgSize > 1024 * 1024) {
        this.$message.error("上传头像图片大小不能超过 1G!");
        return false;
      }
      this.uploadObj.fileSize = imgSize.toFixed(2) + "KB";
      return;
    },
    handleRemove(file, fileList) {
      if (file.id) {
        systemResourceAnnexDel(file.id);
      }

      this.uploadSendData = fileList;
    },
    /** 图片上传 */
    uploadImg(file) {
      fileUpload(file)
        .then((res) => {
          if (res.code == 200) {
            // 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台

            this.uploadSendData.push({
              fileSuffix: getType(res.data.url),
              url: res.data.url,
              fileName: res.data.fileName,
              fileSize: this.uploadObj.fileSize,
              uploadUser: this.user.name,
              annexType: 5,
            });
          } else {
            this.$message.error("上传图片异常");
          }
        })
        .finally((err) => {
          console.log(err);
        });
    },

    // 商机和订单状态显示
    showFormStatus(type) {
      let row = this.waitOption.column.find((item) => item.prop === "status");
      let label = "";
      let dicData = [];
      let display = false;
      if (type === 4) {
        // 订单
        label = "订单状态";
        dicData = this.commonData.orderStatusList;
        display = true;
      } else if (type === 3) {
        label = "商机状态";
        dicData = this.commonData.opportunityStatusList;
        display = true;
      }

      row.label = label;
      row.dicData = dicData;
      row.display = display;
    },
  },
  mounted() {
    this.setOptions();
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    typeIndex() {
      const { type } = this.waitForm;
      return type ? Number(type) - 1 : type;
    },
  },
  watch: {
    "waitForm.type"(val) {
      this.showFormStatus(val);
      if (this.archiveDisabled) return;

      this.waitForm.archiveId = null;
      this.archiveOptions = [];
      this.waitForm.status = "";
    },
    "waitForm.isEndFollowUp"(val) {
      console.log(val, "2133");
      let row = this.waitOption.column.find(
        (item) => item.prop === "nextFollowUpTime"
      );
      row.display = val === 0 ? true : false;
      this.waitForm.nextFollowUpTime = "";
    },
  },
};
</script>

<style lang='scss' scoped>
</style>