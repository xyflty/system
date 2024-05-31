<template>
  <div class="container">
    <div class="header">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="关键字" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键字"
            clearable
          />
        </el-form-item>

        <el-form-item label="数据来源" prop="dataSource">
          <el-select v-model="queryParams.dataSource" :clearable="true">
            <el-option
              v-for="dataSource in commonData.dataSourceList"
              :key="dataSource.value"
              :label="dataSource.label"
              :value="dataSource.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="跟进人员" prop="followUpPerson">
          <el-input
            v-model="queryParams.followUpPerson"
            placeholder="请输入跟进人员"
            clearable
          />
        </el-form-item> -->

        <el-form-item label="跟进人员" prop="followUpPersonIds">
          <el-select
            style="width: 100%"
            v-model="queryParams.followUpPersonIds"
            filterable
            clearable
            placeholder="跟进人员"
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

        <el-form-item label="最后跟进时间" prop="lastFollowUpTime">
          <el-date-picker
            clearable
            v-model="queryParams.lastFollowUpTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择最后跟进时间"
          >
          </el-date-picker>
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
          <PowerSearch :type="6" @submit="setSearch" />
        </el-form-item>
      </el-form>
    </div>

    <div class="content mt_20">
      <div class=" ">
        <div class="flex flex-between flex-acenter">
          <h3 class="fs_16">跟进记录</h3>
          <div class="flex flex-acenter">
            <el-button
              type="primary"
              icon="el-icon-download"
              style="margin-left: 20px"
              >导出</el-button
            >
          </div>
        </div>
        <timeline
          :list.sync="list"
          @refresh="getList"
          @showCustomerInfo="showCustomerInfo"
        />
      </div>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <el-dialog title="客户信息" :visible.sync="dialogVisible" width="60%">
        <div class="info" v-for="(item, index) in FormData" :key="index">
          <h3 class="fs_16 mt_20">{{ item.name }}</h3>

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
      </el-dialog>
    </div>
  </div>
</template>

<script>
import timeline from "@/views/core/components/timeline";

import { listFollowUp } from "@/api/core/followUp";
import { listUser } from "@/api/system/user";
import { getCustomer } from "@/api/core/customer";

import { mapState } from "vuex";
import PowerSearch from "@/views/core/components/powerSearch";
import data from "@/views/core/followUp/data";

export default {
  name: "FollowUp",
  components: { timeline, PowerSearch },
  data() {
    return {
      id: "",
      value: 0,
      date: "",
      active: "1",
      checked: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      searchValue: "",
      userList: [],

      dialogVisible: false,
      ...data,
      // 描述列表样式
      CS: {
        "text-align": "center", //文本居中
        // "min-width": "250px", //最小宽度
        "word-break": "break-all", //过长时自动换行
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        // "min-width": "100px",
        "word-break": "keep-all",
      },
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getList();
    });
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  mounted() {
    this.id = this.$route.params.id;
    // this.getList();
  },
  methods: {
    showCustomerInfo(id) {
      console.log(id);
      this.getInfo(id);
    },

    getInfo(id) {
      getCustomer(id).then((res) => {
        console.log(res);

        let data = res.data;
        this.dialogVisible = true;

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
    // 高级搜索
    setSearch(val) {
      this.getUserList();
      const { keyword, followUpPersonIds, dataSource, lastFollowUpTime } = val;
      this.queryParams = {
        ...this.queryParams,
        keyword,
        followUpPersonIds,
        dataSource,
        lastFollowUpTime,
      };
      this.getList();
    },

    handleClickTab(tab, event) {
      console.log(tab, event);
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
    getList() {
      this.loading = true;
      listFollowUp(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        clueStatus: 0,
        companyName: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        dataSource: 0,
        contaceName: undefined,
        gender: 0,
        role: 0,
        position: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        email: undefined,
        tencentWx: undefined,
        tencentQq: undefined,
        hobby: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
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

.content .info:first-child h3 {
  margin-top: 0;
}
</style>
