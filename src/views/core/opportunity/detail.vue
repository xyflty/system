<template>
  <div class="container">
    <div class="header">
      <h3 class="fw_600 fs_18">{{ detail.companyName || "-" }}</h3>
      <div class="mt_20 flex">
        <div class="color_999 fs_14">
          <span>跟进人：</span
          ><span class="color_333">{{ detail.userName || "-" }}</span>
        </div>
        <div class="ml_20 color_999 fs_14">
          <span>联系人姓名：</span
          ><span class="color_333">{{ detail.contactName || "-" }}</span>
        </div>
        <div class="ml_20 color_999 fs_14">
          <span>下次跟进：</span
          ><span class="color_333">{{
            detail.lastNextFollowUpTime || "-"
          }}</span>
        </div>
      </div>
      <div class="mt_20 flex">
        <el-select
          v-model="detail.opportunityStatus"
          disabled
          placeholder="请选择"
        >
          <el-option
            v-for="opportunityStatus in commonData.opportunityStatusList"
            :key="opportunityStatus.value"
            :label="opportunityStatus.label"
            :value="opportunityStatus.value"
          />
        </el-select>
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-refresh"
          :disabled="detail.isLoss == 1"
          @click="handleConvert(detail)"
          >转为订单</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit-outline"
          :disabled="detail.isLoss == 1"
          @click="handleFollowUp(detail)"
          >写新跟进</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit"
          :disabled="detail.isLoss == 1"
          @click="handleUpdate(detail)"
          >编辑商机</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-share"
          :disabled="detail.isLoss == 1"
          @click="shareOpportunity(detail)"
          >共享商机</el-button
        >
      </div>
    </div>

    <div class="content mt_20">
      <el-tabs v-model="active" @tab-click="handleClickTab">
        <el-tab-pane label="概况信息" name="0">
          <h3 class="fs_16 mt_30">基本信息</h3>
          <el-descriptions
            class="mt_10"
            :column="2"
            border
            :contentStyle="CS"
            :label-style="LS"
          >
            <el-descriptions-item
              v-for="item in FormData[0].children"
              :key="item.key"
            >
              <template slot="label">
                {{ item.name }}<span v-show="item.name">：</span>
              </template>
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>

          <h3 class="fs_16 mt_30">联系人</h3>
          <el-table :data="detail.contactInfoList" class="mt_20" border>
            <el-table-column
              label="联系人姓名"
              align="center"
              prop="contactName"
            />
            <el-table-column label="性别" align="center" prop="gender">
              <template slot-scope="{ row }">
                {{ row.gender == 1 ? "先生" : "女士" }}
              </template>
            </el-table-column>
            <el-table-column label="手机号码" align="center" prop="cellphone" />
            <el-table-column label="微信账号" align="center" prop="tencentWx" />
            <el-table-column label="角色" align="center" prop="role">
              <template slot-scope="{ row }">
                {{ getLabel(commonData[`roleList`], row.role) }}
              </template>
            </el-table-column>
            <el-table-column label="部门职务" align="center" prop="position" />
            <el-table-column label="喜恶" align="center" prop="hobby" />
          </el-table>

          <h3 class="fs_16 mt_30">资质情况</h3>
          <el-table
            :data="detail.buildingQualificationBoList"
            class="mt_20"
            border
          >
            <el-table-column label="名称" align="center" prop="certName" />
            <el-table-column
              label="到期时间"
              align="center"
              prop="expireDate"
            />
            <el-table-column
              label="到期预警"
              align="center"
              prop="warningStatusCode"
              :formatter="formatterFn"
            />
          </el-table>

          <h3 class="fs_16 mt_30">商机项目</h3>
          <MultiTable
            class="mt_20"
            border
            align="center"
            :data="detail.opportunityProjectVoList"
            :Options="opportunityOptions"
          />

          <div class="" v-for="(item, index) in FormData" :key="index">
            <template v-if="index > 1">
              <h3 class="fs_16 mt_30">{{ item.name }}</h3>

              <el-descriptions
                class="mt_10"
                :column="2"
                border
                :contentStyle="CS"
                :label-style="LS"
              >
                <el-descriptions-item
                  v-for="(item, itemIndex) in item.children"
                  :key="itemIndex"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </div>

          <!-- 商机动态 -->
          <div class="opportunity-box">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16 mt_20">商机动态</h3>
              <div>
                <el-checkbox v-model="checked">只看跟进</el-checkbox>
                <el-button
                  plain
                  style="margin-left: 10px"
                  icon="el-icon-edit-outline"
                  @click="handleFollowUp(detail)"
                  >写跟进</el-button
                >
              </div>
            </div>

            <timeline :list.sync="list" @refresh="getList" />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="1">
          <div class="mt_30">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16">跟进记录</h3>
              <div class="flex flex-acenter">
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-input
                  placeholder="请输入内容"
                  v-model="searchValue"
                  class="input-with-select"
                  style="margin-left: 20px"
                >
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  style="margin-left: 20px"
                  >导出</el-button
                >
              </div>
            </div>
            <timeline :list.sync="list" @refresh="getList" />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="操作日志" name="2">
          <div class="mt_30">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16">费用记录</h3>
              <div>
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>

                <el-button
                  type="primary"
                  icon="el-icon-download"
                  style="margin-left: 20px"
                  >导出</el-button
                >
              </div>
            </div>
          </div>

          <el-table :data="opportunityList" class="mt_20" border>
            <!~~ <el-table-column type="selection" width="55" align="center" /> ~~>
            <el-table-column
              label="操作时间"
              align="center"
              prop="contactName"
            />
            <el-table-column label="操作人员" align="center" prop="cellphone" />
            <el-table-column label="操作类型" align="center" prop="userName" />
            <el-table-column
              label="字段名"
              align="center"
              prop="lastFollowUpTime"
            />
            <el-table-column
              label="旧字段值"
              align="center"
              prop="unFollowUpDays"
            />
            <el-table-column
              label="新字段值"
              align="center"
              prop="unFollowUpDays"
            />
            <el-table-column
              label="备注"
              align="center"
              prop="unFollowUpDays"
            />
          </el-table>

          <!~~ <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          /> ~~>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="3"
      @success="handleSuccess"
    />

    <!-- 添加跟进记录对话框 -->
    <el-dialog
      title="共享商机"
      :visible="shareOpportunityDialog"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="shareOpportunityCancel"
    >
      <el-form
        ref="shareOpportunityForm"
        :model="shareOpportunityForm"
        :rules="shareOpportunityFormRules"
        label-width="120px"
      >
        <el-form-item label="共享对象" prop="shareUserId">
          <el-select
            style="width: 100%"
            v-model="shareOpportunityForm.shareUserId"
            filterable
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
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="shareOpportunityForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShareOpportunity"
          >确 定</el-button
        >
        <el-button @click="shareOpportunityCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import data from "@/views/core/opportunity/data";
import timeline from "../components/timeline";
import { getOpportunity, shareOpportunity } from "@/api/core/opportunity";
import { followUpDetailList } from "@/api/core/followUp";
import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import MultiTable from "@/components/MultiTable";
import { listUser } from "@/api/system/user";

import { formatterCallback } from "@/utils/common";

import { mapState } from "vuex";

export default {
  name: "opportunityDetail",
  components: { timeline, followUpDialog, MultiTable },
  mixins: [followUpMinixs],
  data() {
    return {
      id: "",
      value: 0,
      date: "",
      active: "0",
      ...data,
      checked: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // type: 3,
      },
      list: [],
      opportunityList: [],
      searchValue: "",

      shareOpportunityDialog: false,
      shareOpportunityForm: {},
      userList: [],
      shareOpportunityFormRules: {},

      detail: "",

      shareOpportunityFormRules: {
        shareUserId: [{ required: true, message: "不能为空", trigger: "blur" }],
      },

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
      // 商机项目情况
      opportunityOptions: [
        {
          label: "项目分类",
          prop: "allCategoryName",
        },
        // {
        //   label: "类别名称",
        //   prop: "categoryName",
        // },
        {
          label: "项目名称",
          prop: "projectName",
        },
        // {
        //   label: "数量",
        //   prop: "quantity",
        // },
        {
          label: "是否赠品",
          prop: "isGift",
          formatter: (row, column, value) => {
            return ["否", "是"][value];
          },
        },
      ],
      opportunityData: [],
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  mounted() {
    this.id = this.$route.query.id;
    this.getInfo();
    this.getUserList();
  },
  methods: {
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

    getList() {
      this.loading = true;
      followUpDetailList({
        ...this.queryParams,
        archiveId: this.detail.archiveId,
      }).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    handleClickTab(tab, event) {
      console.log(tab, event);
    },

    handleConvert(form) {
      this.$router.push({
        name: "Order/add",
        query: { type: 2, form: JSON.stringify(form) },
      });
    },

    // 共享商机
    shareOpportunity() {
      this.shareOpportunityDialog = true;
    },

    submitShareOpportunity() {
      this.shareOpportunityForm.id = this.detail.id;
      shareOpportunity(this.shareOpportunityForm).then((response) => {
        this.$modal.msgSuccess("共享商机成功");
        this.shareOpportunityForm = {};
        this.shareOpportunityDialog = false;
      });
    },
    shareOpportunityCancel() {
      this.shareOpportunityForm = {};
      this.shareOpportunityDialog = false;
    },

    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Opportunity/add", query: { type: 1, id } });
      // getClue(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.$set(this.form, "selectedOptions", [
      //     TextToCode[this.form.province].code,
      //     TextToCode[this.form.province][this.form.city].code,
      //     TextToCode[this.form.province][this.form.city][this.form.area].code,
      //   ]);
      //   this.open = true;
      //   this.title = "修改商机记录";
      // });
    },

    getInfo() {
      getOpportunity(this.id).then((res) => {
        console.log(res);
        this.detail = JSON.parse(JSON.stringify(res.data));

        let data = res.data;

        let nData = [
          {
            name: "转介绍来源",
            key: "customerReferralSource",
            value: "",
          },
          {
            name: "转介绍时间",
            key: "customerReferralTime",
            value: "",
          },
        ];

        if (data.dataSource == 5) {
          this.FormData.forEach((item) => {
            item.children.forEach((item, index, array) => {
              if (item.key == "dataSource") {
                array.splice(index + 1, 0, ...nData);
              }
            });
          });
        } else {
          this.FormData.forEach((item) => {
            item.children.forEach((item, index, array) => {
              if (item.key == "customerReferralSource") {
                array.splice(index, 2);
              }
            });
          });
        }

        this.getList();

        this.FormData.forEach((item, index) => {
          item.children.forEach((item) => {
            item.value = data[item.key];
            if (data[item.key] != undefined) {
              item.value = data[item.key];
              if (item.key === "province") {
                const { province, city, area } = data;
                // item.value = city == "市辖区" ? province + area : city + area;
                item.value = province + city + area;
              } else if (item.key === "gender") {
                item.value =
                  data.gender != null && data.gender == 1 ? "先生" : "女士";
              } else if (
                [
                  "opportunityStatus",
                  "dataSource",
                  "role",
                  "projectType",
                ].includes(item.key)
              ) {
                item.value = this.getLabel(
                  this.commonData[`${item.key}List`],
                  data[item.key]
                );
              }
            }
          });

          // if (item.name == "资质情况") {
          //   item.children = [];
          //   data.buildingQualificationBoList.forEach((val) => {
          //     let row = this.commonData.threeKuEnum[val.warningStatusCode];
          //     let obj = {
          //       name: "资质名称",
          //       value: val.certName,
          //     };
          //     let obj_2 = {
          //       name: "到期时间",
          //       value: val.expireDate,
          //     };
          //     let obj_3 = {
          //       name: "到期预警",
          //       value: (row && row.label) || "--",
          //     };
          //     item.children.push(obj);
          //     item.children.push(obj_2);
          //     item.children.push(obj_3);
          //   });

          //   return;
          // }
        });
      });
    },
    formatterFn(row, column) {
      return formatterCallback(
        this.commonData.threeKuEnum,
        row.warningStatusCode
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.container {
  background-color: rgb(240, 242, 245);
  padding: 20px 100px;
  .header,
  .content {
    background: #fff;
    padding: 30px;
    overflow: hidden;
    .mt_30 {
      margin-top: 30px;
    }
    .opportunity-box {
      margin-top: 40px;
    }
  }
}
::v-deep .pagination-container {
  height: 60px;
}
</style>
