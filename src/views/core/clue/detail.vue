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
        <!-- <el-select v-model="detail.clueStatus" disabled placeholder="请选择">
          <el-option
            v-for="clueStatus in commonData.clueStatusList"
            :key="clueStatus.value"
            :label="clueStatus.label"
            :value="clueStatus.value"
          />
        </el-select> -->
        <el-button plain icon="el-icon-refresh" @click="handleConvert(detail)"
          >转为商机</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit-outline"
          @click="handleFollowUp(detail)"
          >写新跟进</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit"
          @click="handleUpdate(detail)"
          >编辑线索</el-button
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
                  v-for="item in item.children"
                  :key="item.key"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </div>

          <!-- 线索动态 -->
          <div class="clue-box">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16 mt_20">线索动态</h3>
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
      </el-tabs>
    </div>
    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="1"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import data from "@/views/core/clue/data";
import timeline from "../components/timeline";
import { getClue } from "@/api/core/clue";

import followUpDialog from "../components/followUp.vue";
import { followUpDetailList } from "@/api/core/followUp";

import { formatterCallback } from "@/utils/common";

import { followUpMinixs } from "@/mixins/followUp.js";

import { mapState } from "vuex";

export default {
  name: "clueDetail",
  components: { timeline, followUpDialog },
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
        // type: 1,
      },
      list: [],
      clueList: [],
      searchValue: "",

      detail: "",

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
  },
  methods: {
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
      // this.$router.push({ name: "Demand/add", query: { type: 0 } });
      // this.$router.push({
      //   name: "Demand/add",
      //   query: { type: 2, form: JSON.stringify(form) },
      // });
      this.$router.push({
        name: "Opportunity/add",
        query: { type: 2, form: JSON.stringify(form) },
      });
    },

    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Clue/add", query: { type: 1, id } });
      // getClue(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.$set(this.form, "selectedOptions", [
      //     TextToCode[this.form.province].code,
      //     TextToCode[this.form.province][this.form.city].code,
      //     TextToCode[this.form.province][this.form.city][this.form.area].code,
      //   ]);
      //   this.open = true;
      //   this.title = "修改线索记录";
      // });
    },

    getInfo() {
      getClue(this.id).then((res) => {
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
                ["clueStatus", "dataSource", "role", "clueSourceType"].includes(
                  item.key
                )
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
    .clue-box {
      margin-top: 40px;
    }
  }
}

::v-deep .pagination-container {
  height: 60px;
}
</style>
