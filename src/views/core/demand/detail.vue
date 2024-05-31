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
        <el-select v-model="detail.demandStatus" disabled placeholder="请选择">
          <el-option
            v-for="demandStatus in commonData.demandStatusList"
            :key="demandStatus.value"
            :label="demandStatus.label"
            :value="demandStatus.value"
          />
        </el-select>
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-refresh"
          @click="handleConvert(detail)"
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
          >编辑挖需</el-button
        >
      </div>
    </div>

    <div class="content mt_20">
      <el-tabs v-model="active" @tab-click="handleClickTab">
        <el-tab-pane label="概况信息" name="0">
          <div class="" v-for="(item, index) in FormData" :key="index">
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
          </div>

          <!-- 挖需动态 -->
          <div class="demand-box">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16 mt_20">挖需动态</h3>
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

          <el-table :data="demandList" class="mt_20" border>
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
      :followUpForm.sync="followUpForm"
      :followUpOpen.sync="followUpOpen"
      :type="2"
      @submit="getList"
    />
  </div>
</template>

<script>
import data from "@/views/core/demand/data";
import timeline from "../components/timeline";
import { getDemand } from "@/api/core/demand";
import { listFollowUp } from "@/api/core/followUp";
import followUpDialog from "../components/followUp.vue";
import { mapState } from "vuex";

export default {
  name: "demandDetail",
  components: { timeline, followUpDialog },
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
        type: 2,
      },
      list: [],
      demandList: [],
      searchValue: "",
      followUpForm: {},
      followUpOpen: false,

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
      listFollowUp({
        ...this.queryParams,
        customerId: this.detail.customerId,
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
      this.$router.push({
        name: "Opportunity/add",
        query: { type: 2, form: JSON.stringify(form) },
      });
    },

    /** 跟进按钮  */
    handleFollowUp(row) {
      this.followUpOpen = true;
      this.followUpFormTitle = "新建跟进";
      this.followUpForm.status = row.demandStatus;
      this.followUpForm.companyName = row.companyName;
      this.followUpForm.contactPerson = row.contactName;
      this.followUpForm.followPerson = row.userName;
      this.followUpForm.customerId = row.customerId;
      this.followUpForm.followedId = row.id;
    },

    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Demand/add", query: { type: 1, id } });
      // getDemand(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.$set(this.form, "selectedOptions", [
      //     TextToCode[this.form.province].code,
      //     TextToCode[this.form.province][this.form.city].code,
      //     TextToCode[this.form.province][this.form.city][this.form.area].code,
      //   ]);
      //   this.open = true;
      //   this.title = "修改挖需记录";
      // });
    },

    getInfo() {
      getDemand(this.id).then((res) => {
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
          item.value = data[item.key];
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
                ["demandStatus", "dataSource", "role"].includes(item.key)
              ) {
                item.value = this.getLabel(
                  this.commonData[`${item.key}List`],
                  data[item.key]
                );
              }
            }
          });

          if (item.name == "资质情况") {
            item.children = [];
            data.buildingQualificationBoList.forEach((val) => {
              let obj = {
                name: "资质名称",
                value: val.certName,
              };
              let obj_2 = {
                name: "到期时间",
                value: val.expireDate,
              };
              item.children.push(obj);
              item.children.push(obj_2);
            });

            return;
          }
        });
      });
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
    .demand-box {
      margin-top: 40px;
    }
  }
}
::v-deep .pagination-container {
  height: 60px;
}
</style>
