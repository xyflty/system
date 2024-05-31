<template>
  <el-card class="box-card" v-if="detail">
    <div slot="header" class="header-box">
      <span class="header-title">{{ detail.companyName || "-" }}</span>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="handleReceive"
          v-if="val == 0 || val == undefined"
          >领取资源</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="val"
          @click="handleAction(1)"
          >{{ title }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="val"
          @click="handleAction(2)"
        >
          转为线索
        </el-button>
        <el-button
          type="primary"
          size="small"
          v-if="val && ['clueSea', 'threeLibrarySea'].includes(type)"
          @click="handleFeedback"
        >
          反馈
        </el-button>
      </div>
    </div>

    <div class="body">
      <div class="left">
        <h2 class="h2-title">基础信息</h2>

        <div class="base_info">
          <template v-for="(item, index) in baseInfo">
            <div class="base_item" :key="index" v-if="!item.hide">
              <span class="detail-dt">{{ item.name }} :</span>
              <span>{{ item.value }}</span>
            </div>
          </template>

          <div v-if="val && ['commonResourceSea', 'inspectSea'].includes(type)">
            <!-- <div class="base_item" v-if="type != 'commonResourceSea'">
              <span>跟进状态 :</span>
              <el-select
                v-model="form.status"
                placeholder="请选择"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div> -->
            <div class="base_item">
              <span class="detail-dt">备注 :</span>
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入备注信息"
                v-model="form.remark"
                style="width: 70%; margin-left: 10px"
              >
              </el-input>
            </div>
            <div
              class="base_item base_item_1"
              v-if="type === 'commonResourceSea'"
            >
              <span class="detail-dt">跟进信息 :</span>
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="form.title"
                style="width: 70%; margin-left: 10px"
              >
              </el-input>
            </div>

            <div style="text-align: center">
              <el-button type="primary" @click="submit">保存提交</el-button>
            </div>
          </div>
        </div>

        <!-- <div v-if="type == 'customerSea'">
          <h2 class="h2-title">已成交订单情况</h2>
          <div class="order_box">
            <el-table :data="orderList" style="width: 100%">
              <el-table-column
                prop="title"
                label="订单标题"
                show-overflow-tooltip
              />
              <el-table-column prop="signTime" label="签单日期" />
              <el-table-column prop="price" label="订单金额" width="100" />
            </el-table>
          </div>
        </div> -->

        <div v-if="['customerSea', 'threeLibrarySea'].includes(type)">
          <!-- v-if="type != 'commonResourceSea'" -->
          <h2 class="h2-title">资质情况</h2>
          <div class="box2" v-if="type === 'customerSea'">
            <div
              class="box2_item"
              v-for="(item, index) in cardInfo"
              :key="index"
            >
              <span class="detail-dt">{{ item.certName }} </span>
              <span>{{ item.expireDate }}</span>
            </div>
          </div>

          <div class="box2" v-if="type === 'threeLibrarySea'">
            <MultiTable
              align="center"
              border
              :Options="threeLibraryOption"
              :data="cardInfo"
            />
          </div>
        </div>
        <div v-if="['threeLibrarySea'].includes(type)">
          <!-- v-if="type != 'commonResourceSea'" -->
          <h2 class="h2-title">安证情况</h2>

          <div class="box2">
            <MultiTable
              align="center"
              border
              :Options="threeAzOption"
              :data="[detail.safetyInfo]"
            />
          </div>
        </div>
      </div>
      <div
        class="right"
        v-if="
          ['commonResourceSea', 'clueSea', 'threeLibrarySea'].includes(type)
        "
      >
        <h2 class="h2-title">领用历史详情</h2>

        <div class="block">
          <el-scrollbar style="height: 450px">
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in followUpVoList"
                :key="index"
                :timestamp="item.createTime ? item.createTime : '-'"
                placement="top"
                color="#0079fe"
              >
                <!-- <h4 style="margin-bottom: 10px">状态：{{ item.status }}</h4>
              <h4 style="margin-bottom: 10px">跟进人：{{ item.userName }}</h4> -->
                <h4 style="margin-bottom: 20px" class="conte">
                  <!-- <span>{{ item.status }}</span>
                <span>{{ item.userName }}</span>
                <span>{{ item.followUpMethod }}</span>
                <span>{{ item.title }}</span>
                <span>{{ item.content }}</span>
                <span>{{ item.createTime }}</span> -->

                  <div v-if="item.feedback" class="timeline-item--content">
                    <span>{{ item.createBy }}</span>
                    <span>反馈意见：{{ item.feedback }}</span>
                    <div>
                      <el-tooltip placement="top" :content="item.remark">
                        <span class="timeline-item--remark">
                          备注：{{ item.remark }}</span
                        >
                      </el-tooltip>
                    </div>
                  </div>
                  <span v-else>{{ item.createBy }}</span>
                </h4>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- tabs -->
    <el-tabs
      v-if="type === 'clueSea'"
      v-model="active"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
      </el-tab-pane>
      <component
        :is="tabsName"
        :data="baseDetail"
        :companyName="detail.companyName"
      ></component>
    </el-tabs>

    <!-- 三库转线索 -->
    <ThreeKuClue
      :visible.sync="visible"
      :form="clueForm"
      @submit="addClueSbumit"
      @reset="handleReset"
    />

    <el-dialog
      :visible.sync="feedbackVisible"
      title="Tips"
      width="500"
      @close="hide"
    >
      <el-form
        :model="feedbackForm"
        :rules="feedbackRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="反馈情况" prop="feedback">
          <el-select
            v-model="feedbackForm.feedback"
            placeholder="请选择反馈情况"
          >
            <el-option label="无联系方式" value="无联系方式"></el-option>
            <el-option label="疑似同行" value="疑似同行"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="feedbackForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请填写备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import {
  getDetail,
  receive as receiveCommonResourceSea,
  convertClue as comConvertClue,
  putBack as comPutBack,
  followUp as comFollowUp,
} from "@/api/core/commonResourceSea";
import {
  receive as receiveCustomerSea,
  convertClue as cuConvertClue,
  putBack as cuPutBack,
  followUp as cuFollowUp,
} from "@/api/core/customerSea";
import {
  receive as receiveClueSea,
  convertCustomer as convertCustomer,
  putBack as clPutBack,
  followUp as clFollowUp,
  seaHistory,
} from "@/api/core/clueSea";

// 三库
import {
  threeLibrarySeaPutBackSea,
  convertClue,
  threeLibrarySeaTake,
} from "@/api/core/threeKuSea";
import {
  dynamicVerifyLibraryDetail,
  dynamicVerifyLibraryTake,
  putBack,
  dynamicVerifyLibraryConvertClue,
  dynamicVerifyLibraryEdit,
} from "@/api/core/inspectSea";
import Data from "./data";

import BaseInfo from "./tabsPage/BaseInfo.vue";
import FollowUpRecord from "./tabsPage/FollowUpRecord.vue";
import OrderRecord from "./tabsPage/OrderRecord.vue";
import CustomerReferral from "./tabsPage/CustomerReferral.vue";

import MultiTable from "@/components/MultiTable";
import ThreeKuClue from "@/views/core/components/threeKuClue.vue";

export default {
  name: "SeaDetail",
  components: {
    BaseInfo,
    FollowUpRecord,
    OrderRecord,
    CustomerReferral,
    MultiTable,
    ThreeKuClue,
  },
  data() {
    return {
      id: 0,
      detail: null,
      type: "",
      val: 0,
      ...Data,
      baseInfo: [],
      cardInfo: [],
      followUpVoList: [],
      orderList: [],

      form: {
        status: "",
        title: "",
        remark: "",
      },

      // tabs
      active: "BaseInfo",
      baseDetail: {},

      titleObj: {
        commonResourceSea: "放入公共资源库",
        clueSea: "放入线索公海",
        customerSea: "放入客户公海",
        threeLibrarySea: "放回三库资源库",
        inspectSea: "放回动态核查资源库",
      },

      visible: false,
      clueForm: {},

      // 反馈意见弹出框
      feedbackVisible: false,
      feedbackForm: {},
      feedbackRules: {
        feedback: {
          required: true,
          message: "请选择反馈情况",
          trigger: "change",
        },
        remark: { required: true, message: "请填写备注信息", trigger: "blur" },
      },
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),

    statusList() {
      return this.type == "clueSea"
        ? this.commonData.clueStatusList
        : this.commonData.customerStatusList;
    },

    // 显示那个tabs
    tabsName() {
      return this.active;
    },

    title() {
      return this.titleObj[this.type];
    },
  },

  mounted() {
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    this.val = this.$route.query.val;
    this.getDetail();
  },
  methods: {
    submit() {
      console.log(this.form);
      let params = JSON.parse(JSON.stringify(this.form));
      if (this.type == "commonResourceSea") {
        params.status = undefined;
        params.archiveId = this.detail.archiveId;
        comFollowUp(params).then((res) => {
          this.$message.success(res.msg);
          this.getDetail();
          this.form = {};
        });
      } else if (this.type === "clueSea") {
        params.archiveId = this.detail.archiveId;
        params["clueStatus"] = params.status;
        params.status = undefined;
        clFollowUp(params).then((res) => {
          this.$message.success(res.msg);
          this.getDetail();
          this.form = {};
        });
      } else if (this.type === "inspectSea") {
        let sendData = {
          id: this.detail.id,
          ...this.detail,
          remark: this.form.remark,
        };

        dynamicVerifyLibraryEdit(sendData).then((res) => {
          if (res.code === 200) {
            this.$message.success("修改成功");
            this.getDetail();
            this.form = {};
          }
        });
      } else {
        params.archiveId = this.detail.archiveId;
        params["customerStatus"] = params.status;
        params.status = undefined;
        cuFollowUp(params).then((res) => {
          this.$message.success(res.msg);
          this.getDetail();
          this.form = {};
        });
      }
    },
    putSeaFn(fn, path) {
      this.$modal
        .confirm(`是否确认将所选择的资源放回公海？`)
        .then(() => {
          this.loading = true;

          return fn({ id: this.id });
        })
        .then(() => {
          this.loading = false;
          // this.getList();
          this.$modal.msgSuccess("操作成功");
          this.$router.push({ path: path });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async addClueSbumit(form, done) {
      let sendData = {
        id: form.id,
        contactInfoList: form.contactInfoList,
      };
      console.log(sendData);

      try {
        let fn;
        let routerPath;
        if (this.type == "inspectSea") {
          fn = dynamicVerifyLibraryConvertClue;
          routerPath = "/sea/inspectSea";
        } else if (this.type == "threeLibrarySea") {
          fn = convertClue;
          routerPath = "/sea/threeKuSea";
        }
        const res = await fn(sendData);

        if (res.code === 200) {
          this.handleReset();

          this.$message.success("已转线索");
          this.$router.push({ path: routerPath });
        } else {
          this.$message.error(res.msg);
        }
        done();
      } catch (error) {
        done();
      }
    },
    handleReset() {
      this.visible = false;
      this.clueForm = {};
    },
    handleAction(type) {
      if (this.type === "threeLibrarySea") {
        if (type === 1) {
          this.putSeaFn(threeLibrarySeaPutBackSea, "/sea/threeKuSea");
        } else if (type === 2) {
          this.clueForm = this.detail;
          this.visible = true;
        }
      } else if (this.type === "inspectSea") {
        if (type === 1) {
          this.putSeaFn(putBack, "/sea/inspectSea");
        } else if (type === 2) {
          this.clueForm = this.detail;
          this.visible = true;
        }
      } else {
        let str =
          type == 2
            ? `是否确认将所选择的资源转为线索？`
            : "是否确认将所选择的资源放回公海？";
        this.$modal
          .confirm(str)
          .then(() => {
            this.loading = true;
            if (type == 2) {
              return this.type == "commonResourceSea"
                ? comConvertClue({
                    archiveId: this.detail.archiveId,
                    id: this.id,
                    companyName: this.detail.companyName,
                  })
                : this.type == "clueSea"
                ? convertCustomer({
                    archiveId: this.detail.archiveId,
                    id: this.id,
                  })
                : cuConvertClue({
                    archiveId: this.detail.archiveId,
                    id: this.id,
                  });
            } else {
              return this.type == "commonResourceSea"
                ? comPutBack({
                    id: this.id,
                  })
                : this.type == "clueSea"
                ? clPutBack({ id: this.id })
                : cuPutBack({
                    id: this.id,
                  });
            }
          })
          .then(() => {
            this.loading = false;
            // this.getList();
            this.$modal.msgSuccess("操作成功");
            this.$router.push({ path: `/sea/${this.type}` });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    handleReceive() {
      const ids = this.id;
      this.$modal
        .confirm('是否确认领取公共资源公海编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return this.type == "commonResourceSea"
            ? receiveCommonResourceSea({ seaIds: [this.id] })
            : this.type == "clueSea"
            ? receiveClueSea({ seaIds: [this.id] })
            : this.type == "threeLibrarySea"
            ? threeLibrarySeaTake({ ids: [ids] })
            : this.type == "inspectSea"
            ? dynamicVerifyLibraryTake({ ids: [ids] })
            : receiveCustomerSea({ seaIds: [this.id] });
        })
        .then((res) => {
          this.loading = false;

          if (res.data && res.data.length) {
            this.$alert(
              "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
                res.data.join("<br />") +
                "</div>",
              "导入结果",
              { dangerouslyUseHTMLString: true }
            );
          } else {
            this.getDetail();
            this.$modal.msgSuccess("领取成功");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getDetailCallback(res) {
      if (["inspectSea", "threeLibrarySea"].includes(this.type)) {
        // 三库资源
        this.detail = res.data;
        this[`${this.type}Vo`].forEach((item, index) => {
          if (res.data[item.key] != undefined) {
            item.value = res.data[item.key];
            item.hide = false;
            if (
              this.type === "inspectSea" &&
              this.val == 1 &&
              item.key === "remark"
            ) {
              this.form.remark = item.value;

              item.hide = true;
            }
          }
        });
        this.baseInfo = this[`${this.type}Vo`];

        this.cardInfo = res.data.companyMonitorDetails;

        this.followUpVoList = res.data.seaHistoryList;
      } else {
        let baseList = res.data[`${this.type}Vo`];
        this.detail = res.data[`${this.type}Vo`];
        this[`${this.type}Vo`].forEach((item) => {
          if (baseList[item.key] != undefined) {
            item.value = baseList[item.key];
            if (item.key === "province") {
              const { province, city, area } = baseList;
              item.value = city + area;
            } else if (["dataSource"].includes(item.key)) {
              item.value = this.getLabel(
                this.commonData[`${item.key}List`],
                baseList[item.key]
              );
            } else if (["status"].includes(item.key)) {
              if (this.type == "clueSea")
                item.value = this.getLabel(
                  this.commonData[`clueStatusList`],
                  baseList["status"]
                );
              else
                item.value = this.getLabel(
                  this.commonData[`customerStatusList`],
                  baseList["status"]
                );
            }
          }
        });
        this.baseInfo = this[`${this.type}Vo`];

        // 概况信息
        this.baseDetail = {
          ...res.data.customerArchiveVo,
          companyName: this.baseInfo[0].value,
          contactInfoList:
            res.data.customerArchiveVo &&
            res.data.customerArchiveVo.contactInfoList.map((item) => {
              return {
                ...item,
                ishide: res.data[`${this.type}Vo`].userId ? false : true,
              };
            }),
        };

        this.cardInfo = res.data.buildingQualificationBoList;
        this.followUpVoList = res.data.seaHistoryList;
        this.orderList = res.data.orderList;
      }
    },
    getDetail() {
      if (this.type === "inspectSea") {
        dynamicVerifyLibraryDetail(this.id).then((res) => {
          this.getDetailCallback(res);
        });
      } else {
        getDetail({
          type: this.type,
          id: this.id,
        }).then((res) => {
          this.getDetailCallback(res);
        });
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

    /** tabs start */
    handleClickTab(tab, event) {
      if (this.active == 4) {
        // this.getByCompanyName(this.detail.companyName);
      }
    },

    /** tabs end */

    /**
     * 反馈意见
     */
    handleFeedback() {
      this.feedbackVisible = true;
    },
    hide() {
      this.feedbackVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 反馈意见提交
    submitForm(formName) {
      const { feedback, remark } = this.feedbackForm;
      // if (feedback === "其他" && !remark) {
      //   this.$message.error("请填写备注信息");
      //   return;
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let sendData = {
            userId: this.detail.userId,

            feedback,
            remark,
          };

          if (this.type === "threeLibrarySea") {
            sendData.threeLibraryId = this.detail.id;
          } else if (this.type === "clueSea") {
            sendData.archiveId = this.detail.archiveId;
          }

          seaHistory(sendData).then((res) => {
            if (res.code === 200) {
              this.getDetail();

              this.$message.success("反馈意见成功");
              this.hide();
            }
          });
        } else {
          this.$message.error("请输入必填信息");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 20px 30px;
}
.box-card {
  width: 95%;
  margin: 30px auto;
}
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-title {
    font-weight: bold;
    letter-spacing: 0.5px;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.2);
  }
}

.body {
  display: flex;

  .left,
  .right {
    flex: 1;
    padding: 20px 30px;

    .h2-title {
      font-weight: 600;
      margin-top: 30px;
      height: 50px;
      padding-left: 10px;
      text-align: left;
      position: relative;
    }
    .h2-title::after {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      width: 3px;
      height: 16px;
      background: #0079fe;
    }
  }

  .left {
    .base_info {
      margin-bottom: 60px;
      .base_item {
        margin-bottom: 30px;
        font-size: 17px;
        span {
          display: inline-block;
        }
        span:first-child {
          min-width: 140px;
          text-align: right;
        }
        span:last-child {
          margin-left: 15px;
        }
      }
      .base_item_1 {
        display: flex;
        align-items: flex-start;
      }
    }
    .order_box {
      margin-bottom: 60px;
    }
    .box2 {
      margin-bottom: 60px;
      .box2_item {
        margin-bottom: 30px;
        font-size: 17px;
        display: flex;
        justify-content: space-between;
        span:last-child {
          min-width: fit-content;
          margin-left: 15px;
        }
      }
    }
  }
}
.conte {
  margin-bottom: 20px;

  span {
    margin-right: 10px;
  }
}
.detail-dt {
  font-weight: bold;
  color: #333;
}

.timeline-item--content {
  display: flex;
  flex-direction: column;
  > span,
  > div {
    padding: 3px 0;
    line-height: 1.5;
  }
}

::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.el-timeline {
  padding-left: 10px;
}
.timeline-item--remark {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /* 这里是超出几行省略 */
}
</style>
