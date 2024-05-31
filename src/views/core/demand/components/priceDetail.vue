<template>
  <div class="container">
    <div class="header">
      <h3 class="fw_600 fs_18 flex flex-acenter">
        <div>
          {{ detail.createTime || "-" }} 报价申请 ({{
            detail.applyUserName || "-"
          }})
        </div>
        <!-- <div class="status">
          {{ ["未查看", "已查看"][detail.isRead] || "-" }}
        </div> -->
      </h3>
      <!-- <div class="mt_20 flex">
        <div class="color_999 fs_14">
          <span>批阅人员：</span
          ><span class="color_333">{{ detail.leaderUserName || "-" }}</span>
        </div>
      </div> -->
      <div class="edit_btn">
        <el-button
          type="primary"
          plain
          v-if="detail.isNeedAudit"
          @click="dialogVisible = true"
          >审核</el-button
        >
        <el-button type="warning" plain v-if="detail.isWithdraw" @click="modify"
          >修改</el-button
        >
        <el-button type="danger" plain v-if="detail.isWithdraw" @click="revoke"
          >撤回申请</el-button
        >
      </div>
    </div>

    <div class="content mt_20">
      <h3 class="fs_16 mt_20">报价信息</h3>

      <el-descriptions
        v-loading="loading"
        class="mt_10"
        :column="2"
        border
        :contentStyle="CS"
        :label-style="LS"
      >
        <el-descriptions-item
          v-for="(item, index) in FormData[0].children"
          :key="index"
        >
          <template slot="label">
            {{ item.name }}<span v-show="item.name">：</span>
          </template>
          {{ item.value }}
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 2">
          <template slot="label"> 项目类型<span>：</span> </template>
          安证+人才项目/单人才项目

          <template slot="label">
            <span></span>
          </template>
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 2">
          <template slot="label">
            <span></span>
          </template>
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 1">
          <template slot="label"> 项目类型<span>：</span> </template>
          单安证项目/劳务项目
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 1">
          <template slot="label">
            <span></span>
          </template>
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 3">
          <template slot="label"> 项目类型<span>：</span> </template>
          其他项目
        </el-descriptions-item>
        <el-descriptions-item v-if="projectCategory == 3">
          <template slot="label">
            <span></span>
          </template>
        </el-descriptions-item>
      </el-descriptions>

      <div class="mt_20">
        <h3 class="fs_16 mt_20">同行低价截图</h3>
        <div class="grid_2 mt_20">
          <el-image
            v-for="(item, index) in detail.imgUrlArr"
            :src="item"
            :key="index"
            class="img_bg"
            alt=""
            :preview-src-list="detail.imgUrlArr"
          />
        </div>
      </div>
      <div class="mt_20">
        <h3 class="fs_16 mt_20">审核结果</h3>
        <div class="mt_20 remark color_666">
          <div v-for="(item, index) in detail.auditDetailVoList" :key="index">
            <div class="mt_10 flex">
              <div style="min-width: 200px">
                审核人{{ index + 1 }}：{{ item.auditUserName }}
                <!-- 1待审批 2通过 3驳回 -->
                {{
                  ["待审批", "通过", "驳回", "撤回审核"][item.auditStatus - 1]
                }}
              </div>
              <div class="ml_20">审核意见 ：{{ item.remark || "无" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="审核意见"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="cancel"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="审核结果" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核信息" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            placeholder="审核信息"
          />
        </el-form-item>

        <template>
          <span class="personnel">抄送人员</span>
          <el-select
            class="select-input"
            multiple
            v-model="optionsValue"
            filterable
            placeholder="请选择抄送人员"
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <addPrice
      :showAddForm.sync="showAddForm"
      :modifyForm="detail"
      :type="pageType"
      @getInfo="getInfo"
    />
  </div>
</template>

<script>
import {
  getAuditReferPrice,
  addAudit,
  getInfoByAuditId,
  cancelAuditReferPrice,
} from "@/api/core/auditReferPrice";

import {
  channelChannelAuditReferPriceDetail,
  channelAuditReferPriceGetInfoByAuditId,
  withdrawApproval,
} from "@/api/irrigationDitch/opportunity";

import data from "@/views/core/demand/components/data";
import { listUser, listUserSearch } from "@/api/system/user";
import addPrice from "./addPrice";

export default {
  name: "priceDetail",
  components: { addPrice },
  data() {
    return {
      loading: false,

      showAddForm: false,
      dialogVisible: false,
      ...data,
      id: "",
      type: "",
      value: 0,
      date: "",
      active: "0",
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      projectCategory: 3,
      list: [],

      detail: {},
      rescies: "",
      // 描述列表样式
      CS: {
        "text-align": "center", //文本居中
        "min-width": "250px", //最小宽度
        "word-break": "break-all", //过长时自动换行
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "100px",
        "word-break": "keep-all",
      },

      form: {},

      // 跟进表单校验
      rules: {
        auditStatus: [
          { required: true, message: "审核结果不能为空", trigger: "blur" },
        ],
      },
      options: [],
      optionsValue: "",

      pageType: "0", //1为渠道部
    };
  },

  watch: {
    $route: {
      handler(n) {},
    },
  },

  mounted() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    this.pageType = this.$route.query.pageType || "0";

    this.getInfo();
    this.getUserList();
  },
  methods: {
    // 撤回
    revoke() {
      this.$modal
        .confirm("是否确认撤回该报价申请？")
        .then(() => {
          let fn = null;
          if (this.pageType == 1) {
            // 渠道部
            fn = withdrawApproval;
          } else {
            fn = cancelAuditReferPrice;
          }

          fn(this.detail.auditId).then((res) => {
            this.$modal.msgSuccess("撤回成功！");
            this.getInfo();
          });
        })
        .catch(() => {});
    },

    // 修改
    modify() {
      console.log(this.detail, "detail");
      this.showAddForm = true;
    },
    getInfo() {
      this.loading = true;
      let params = [];
      if (this.pageType == 1) {
        params = [
          channelChannelAuditReferPriceDetail,
          channelAuditReferPriceGetInfoByAuditId,
        ];
      } else {
        params = [getAuditReferPrice, getInfoByAuditId];
      }

      params[this.type](this.type == 0 ? this.id : { auditId: this.id }).then(
        (res) => {
          this.detail = res.data;
          this.projectCategory = res.data.projectCategory;
          let data = res.data;
          this.detail.imgUrlArr = [];
          this.detail.imgUrlArr = this.detail.imgUrl.length
            ? this.detail.imgUrl.split(",")
            : [];

          this.FormData.forEach((item, index) => {
            item.value = data[item.key];
            item.children.forEach((item) => {
              if (data[item.key] != undefined) {
                item.value = data[item.key];
                if (item.key === "isOldCustomer") {
                  item.value =
                    data.isOldCustomer != null && data.isOldCustomer == 1
                      ? "是"
                      : "否";
                }
              } else {
                item.value = "--";
              }
            });
          });

          this.loading = false;
        }
      );
    },

    /** 提交按钮 */
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.recipients = this.optionsValue.join(",");
          let params = JSON.parse(JSON.stringify(this.form));

          params.auditId = this.detail.auditId;
          // return;
          addAudit(params).then((res) => {
            this.$modal.msgSuccess("审核成功！");
            // 改为跳转下一个
            if (res.data) {
              if (this.pageType == "1") {
                this.$router.replace({
                  path: "channelPriceDetail",
                  query: { id: res.data, type: 1, pageType: "1" },
                });
              } else {
                this.$router.replace({
                  path: "PriceDetail",
                  query: { id: res.data, type: 1 },
                });
              }
            }
            this.getInfo();
            this.dialogVisible = false;
            this.form = {};
          });
        }
      });
    },
    cancel() {
      console.log("取消没有");
      this.form = {};
      this.dialogVisible = false;
      this.optionsValue = "";
    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUserSearch({
        pageNum: 1,
        pageSize: 10,
        userName: "",
      }).then((response) => {
        this.options = response.rows;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

.container {
  background-color: rgb(240, 242, 245);
  padding: 20px 100px;

  .header,
  .content {
    position: relative;
    background: #fff;
    padding: 30px;
    overflow: hidden;

    .mt_30 {
      margin-top: 30px;
    }

    .clue-box {
      margin-top: 40px;
    }
  }
}

::v-deep .pagination-container {
  height: 60px;
}

.edit_btn {
  position: absolute;
  top: 20px;
  right: 30px;
}

.status {
  margin-left: 20px;
  font-weight: 400;
  // color: #999;
  font-size: 13px;
}

.grid_2 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;

  div {
    width: 80%;
    height: 60px;
    margin-top: 20px;
    border-radius: 40px;
    border: 1px solid #eeeeee;

    span:last-child {
      margin-left: 10px;
    }
  }
}

.content_2 {
  margin-top: 20px;
  border: 1px solid #e9e9e9;
  padding: 20px;
  background: #fcfcfc;

  ::v-deep p {
    color: #666;
    line-height: 28px;
  }

  ::v-deep p:last-child {
    margin-bottom: 10px;
  }
}

.img_bg {
  width: 100%;
  height: 200px;
}

.remark {
  border: 1px solid #e9e9e9;
  background: #fcfcfc;
  padding: 20px;
}
.personnel {
  margin-left: 33px;
  margin-right: 10px;
}
.wait-face {
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  color: #666;
}
.select-input {
  width: 436px;
}
</style>
