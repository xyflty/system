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
        <!-- <el-select
          v-model="detail.customerStatus"
          disabled
          placeholder="请选择"
        >
          <el-option
            v-for="customerStatus in commonData.customerStatusList"
            :key="customerStatus.value"
            :label="customerStatus.label"
            :value="customerStatus.value"
          />
        </el-select> -->
        <el-button
          v-if="type != 1"
          plain
          icon="el-icon-refresh"
          @click="handleConvert(detail)"
          >添加商机</el-button
        >
        <el-button
          v-if="type != 1"
          plain
          style="margin-left: 10px"
          icon="el-icon-edit-outline"
          @click="handleFollowUp(detail)"
          >写新跟进</el-button
        >
        <el-button
          v-if="type != 1"
          plain
          style="margin-left: 10px"
          icon="el-icon-edit"
          @click="handleUpdate(detail)"
          >编辑客户</el-button
        >
      </div>
    </div>

    <div class="content mt_20">
      <el-tabs v-model="active" @tab-click="handleClickTab">
        <el-tab-pane label="概况信息" name="0">
          <div class="" v-for="(item, index) in FormData" :key="`0-${index}`">
            <template v-if="index == 0">
              <h3 class="fs_16 mt_30">{{ item.name }}</h3>

              <el-descriptions
                class="mt_10"
                :column="2"
                border
                :contentStyle="CS"
                :label-style="LS"
              >
                <el-descriptions-item
                  v-for="(item, index) in item.children"
                  :key="index"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </div>

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

          <h3 class="fs_16 mt_30">账号信息</h3>
          <el-descriptions
            class="mt_10"
            :column="2"
            border
            :contentStyle="CS"
            :label-style="LS"
          >
            <el-descriptions-item>
              <template slot="label">
                <span> 三库账号：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.threeLibraryAccount
              }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span> 三库密码：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.threeLibraryPassword
              }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span> 一建账号：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.constructorAccount
              }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span> 一建密码：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.constructorPassword
              }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span> 二建账号：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.associateConstructorAccount
              }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <span> 二建密码：</span>
              </template>
              {{
                detail.customerAccount &&
                detail.customerAccount.associateConstructorPassword
              }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            :data="detail.customerAccount && detail.customerAccount.tenderList"
            class="mt_20"
            border
          >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column
              label="企业认证情况"
              align="center"
              prop="situation"
            />
            <el-table-column label="有效期" align="center" prop="expiryDate" />
            <el-table-column label="专利" align="center" prop="patent" />
            <el-table-column label="商标" align="center" prop="trademark" />
          </el-table>

          <div class="" v-for="(item, index) in FormData" :key="index">
            <template v-if="index == FormData.length - 1">
              <h3 class="fs_16 mt_30">{{ item.name }}</h3>

              <el-descriptions
                class="mt_10"
                :column="2"
                border
                :contentStyle="CS"
                :label-style="LS"
              >
                <el-descriptions-item
                  v-for="(item, index) in item.children"
                  :key="index"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
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
                <!-- <el-button
                  type="primary"
                  icon="el-icon-download"
                  style="margin-left: 20px"
                  >导出</el-button
                > -->
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

        <el-tab-pane label="订单记录" name="2">
          <div class="flex flex-between flex-acenter mt_20">
            <h3 class="fs_16">订单记录</h3>
            <div style="text-align: right">
              订单记录数量：<span class="main_color">{{
                orderInfo.orderCount || 0
              }}</span>
              条 订单总金额：
              <span class="main_color">¥ {{ orderInfo.orderPrice || 0 }}</span>
            </div>
          </div>
          <el-table :data="orderInfo.resultList" class="mt_20" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="订单标题" align="center" prop="title" />
            <el-table-column label="订单总金额" align="center" prop="price" />
            <!-- <el-table-column label="订单类型" align="center" prop="orderType">
              <template slot-scope="{ row }">
                <span>{{
                  getLabel(commonData.orderTypeList, row.orderType)
                }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="订单状态" align="center" prop="orderStatus">
              <template slot-scope="{ row }">
                <span>{{
                  getLabel(commonData.orderStatusList, row.orderStatus)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="跟进人" align="center" prop="userName" />
            <el-table-column
              label="共享人"
              align="center"
              prop="shareUserName"
            />
            <el-table-column label="签单时间" align="center" prop="signTime" />
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
            />
          </el-table>

          <!-- <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          /> -->
        </el-tab-pane>

        <el-tab-pane label="客户转介绍" name="3">
          <!-- <el-form :model="query" ref="queryForm" size="small" :inline="true">
            <el-form-item
              label=""
              prop="companyOrCustomerReferralSourceName"
              v-if="current == 0"
            >
              <el-input
                v-model="query.companyOrCustomerReferralSourceName"
                placeholder="请输入关键字搜索"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form> -->

          <div class="flex flex-between flex-acenter mt_20">
            <h3 class="fs_16">客户转介绍</h3>
            <div style="text-align: right">
              客户转介绍记录数量：<span class="main_color">{{
                customerReferral.referralCount || 0
              }}</span>
              条 客户转介绍总金额：
              <span class="main_color"
                >¥ {{ customerReferral.referralPrice || 0 }}</span
              >
            </div>
          </div>
          <el-table :data="ReferralList" class="mt_20" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column
              label="转介绍来源"
              align="center"
              prop="companyName"
            />
            <el-table-column
              label="转介绍时间"
              align="center"
              prop="customerReferralTime"
            />

            <el-table-column
              label="转介绍来源"
              align="center"
              prop="customerReferralSource"
            />
            <el-table-column label="跟进人" align="center" prop="userName" />
            <el-table-column label="是否成交" align="center" prop="isCustomer">
              <template slot-scope="{ row }">
                <span>
                  {{ row.isCustomer ? "是" : "否" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="成交金额" align="center" prop="price" />
          </el-table>

          <pagination
            v-show="total_1 > 0"
            :total="total_1"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getList"
          />

          <div class="flex flex-between flex-acenter mt_20">
            <h3 class="fs_16">商机项目</h3>
          </div>
          <el-table :data="List1" class="mt_20" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column
              label="项目名称"
              align="center"
              prop="projectName"
            />
            <el-table-column
              label="项目分类"
              align="center"
              prop="categoryName"
            />

            <el-table-column label="商机状态" align="center" prop="isCustomer">
              <template slot-scope="{ row }">
                <span>
                  {{
                    getLabel(
                      commonData[`opportunityStatusList`],
                      row.opportunityStatus
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="跟进人" align="center" prop="userName" />
          </el-table>

          <pagination
            v-show="total_2 > 0"
            :total="total_2"
            :page.sync="query_1.pageNum"
            :limit.sync="query_1.pageSize"
            @pagination="getByCompanyName"
          />
        </el-tab-pane>

        <el-tab-pane label="商机项目" name="4" v-if="show">
          <div class="flex flex-between flex-acenter mt_20">
            <h3 class="fs_16">商机项目</h3>
          </div>
          <el-table :data="List1" class="mt_20" border>
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column
              label="项目名称"
              align="center"
              prop="projectName"
            />
            <el-table-column
              label="项目分类"
              align="center"
              prop="categoryName"
            />

            <el-table-column label="商机状态" align="center" prop="isCustomer">
              <template slot-scope="{ row }">
                <span>
                  {{
                    getLabel(
                      commonData[`opportunityStatusList`],
                      row.opportunityStatus
                    )
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="跟进人" align="center" prop="userName" />
          </el-table>

          <pagination
            v-show="total_2 > 0"
            :total="total_2"
            :page.sync="query_1.pageNum"
            :limit.sync="query_1.pageSize"
            @pagination="getByCompanyName"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="followUpType"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import data from "@/views/core/customer/data";
import timeline from "../components/timeline";
import {
  getCustomerReferralList,
  getCustomerArchive,
} from "@/api/core/customerArchive";
import { getByCompanyName } from "@/api/core/customer";
import { followUpDetailList } from "@/api/core/followUp";
import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import { customerListOrder } from "@/api/core/order";

import { mapState } from "vuex";
import { checkPermi } from "@/utils/permission";
import { formatterCallback } from "@/utils/common";

export default {
  name: "customerDetail",
  components: { timeline, followUpDialog },
  mixins: [followUpMinixs],
  data() {
    return {
      show: false,
      id: "",
      type: "",
      value: 0,
      date: "",
      active: "0",
      ...data,
      checked: false,
      total: 0,
      total_1: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // type: 1,
      },
      ReferralList: [],
      query: {
        pageNum: 1,
        pageSize: 10,
      },

      List1: [],
      total_2: 0,
      query_1: {
        pageNum: 1,
        pageSize: 10,
      },

      list: [],
      customerList: [],
      orderInfo: "",
      searchValue: "",

      detail: "",

      customerReferral: "",

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
      followUpType: 5,
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  mounted() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;

    this.getInfo();
    this.getList();
    this.show = checkPermi(["core:opportunityProject:getByCompanyName"]);
  },

  methods: {
    getList() {
      this.loading = true;
      followUpDetailList({
        ...this.queryParams,
        archiveId: this.id,
      }).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 订单列表
    getCustomerListOrder() {
      customerListOrder({ archiveId: this.id }).then((res) => {
        this.orderInfo = res.data;
      });
    },

    handleClickTab(tab, event) {
      if (this.active == 4) {
        this.getByCompanyName(this.detail.companyName);
      }
    },

    handleConvert(form) {
      // this.$router.push({ name: "Demand/add", query: { type: 2, form: form } });
      // this.$router.push({ name: "Opportunity/add", query: { type: 0 } });

      this.$router.push({
        name: "Opportunity/add",
        query: { type: 0, form: JSON.stringify(form) },
      });
    },

    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Customer/add", query: { type: 1, id } });
      // getcustomer(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.$set(this.form, "selectedOptions", [
      //     TextToCode[this.form.province].code,
      //     TextToCode[this.form.province][this.form.city].code,
      //     TextToCode[this.form.province][this.form.city][this.form.area].code,
      //   ]);
      //   this.open = true;
      //   this.title = "修改客户记录";
      // });
    },

    getCustomerReferralList(companyName) {
      getCustomerReferralList({ ...this.query, companyName }).then((res) => {
        this.customerReferral = res.data;
        this.ReferralList = res.data.resultList.records;
        this.total_1 = res.data.resultList.total;
      });
    },

    getByCompanyName(companyName) {
      getByCompanyName({ ...this.query_1, companyName }).then((res) => {
        console.log(res);
        this.List1 = res.rows;
        this.total_2 = res.total;
      });
    },

    getInfo() {
      getCustomerArchive(this.id).then((res) => {
        console.log(res);
        this.getCustomerListOrder();
        this.getCustomerReferralList(res.data.companyName);

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
          this.FormData_2.forEach((item) => {
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
          this.FormData_2.forEach((item) => {
            item.children.forEach((item, index, array) => {
              if (item.key == "customerReferralSource") {
                array.splice(index, 2);
              }
            });
          });
        }

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
                  "customerStatus",
                  "dataSource",
                  "role",
                  "customerType",
                  "customerGrade",
                ].includes(item.key)
              ) {
                item.value = this.getLabel(
                  this.commonData[`${item.key}List`],
                  data[item.key]
                );
              }
            }
          });
        });

        this.FormData_2.forEach((item, index) => {
          item.children.forEach((item) => {
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
                  "customerStatus",
                  "dataSource",
                  "role",
                  "customerType",
                  "customerGrade",
                ].includes(item.key)
              ) {
                item.value = this.getLabel(
                  this.commonData[`${item.key}List`],
                  data[item.key]
                );
              }
            }
          });
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
    .customer-box {
      margin-top: 40px;
    }
  }
}

::v-deep .pagination-container {
  height: 60px;
}
</style>
