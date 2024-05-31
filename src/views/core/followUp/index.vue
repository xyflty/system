<template>
  <div class="app-container">
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

    <el-row :gutter="10" class="mb8">
      <!-- <right-toolbar_2
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
        pageName="followUp"
      ></right-toolbar_2> -->
    </el-row>

    <!-- <div class="content mt_20">
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
      </div>
       -->

    <el-table
      v-loading="loading"
      :data="list"
      border
      highlight-current-row
      ref="myTable"
      style="width: 100%"
    >
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.visible"
          :key="index"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :prop="item.prop"
          :min-width="item.width"
          :show-overflow-tooltip="item.showOverflow"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              v-if="item.prop == 'companyName'"
              @click="showCustomerInfo(row.archiveId)"
            >
              {{ row.companyName }}
            </span>
            <span v-else-if="['followUpMethod'].includes(item.prop)">
              {{ getLabel(commonData[`followMethodList`], row[item.prop]) }}
            </span>
            <span v-else-if="item.prop == 'type'">
              {{ getLabel(commonData[`businessTypeList`], row[item.prop]) }}
            </span>

            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column align="center" label="操作" width="250" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            style="margin-left: 10px"
            icon="el-icon-d-arrow-right"
            @click="handleDetail(row)"
            >详情</el-button
          >

          <el-dropdown
            size="mini"
            @command="(command) => handleCommand(command, row)"
          >
            <span class="el-dropdown-link">
              <el-button
                size="mini"
                style="margin-left: 10px"
                icon="el-icon-chat-dot-round"
                >评论 <span>({{ row.commentCount }})</span></el-button
              >
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleCommentInput"
                >输入评论</el-dropdown-item
              >
              <el-dropdown-item command="handleCommentShow"
                >查看</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

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
              {{ item.name }}<span v-show="item.name">:</span>
            </template>
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <el-dialog
      title="跟进详情"
      :visible.sync="dialogVisibleDetail"
      width="40%"
      append-to-body
    >
      <el-descriptions
        class="margin-top"
        title=""
        :label-style="LS"
        :column="1"
        border
      >
        <el-descriptions-item>
          <template slot="label"> 跟进类型： </template>
          {{ typeStr_1(detail.type) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进方式： </template>
          {{ typeStr_2(detail.followUpMethod) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进时间： </template>
          {{ detail.followUpTime || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进事由： </template>
          {{ detail.title || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 工作总结： </template>
          {{ detail.content || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 当前状态： </template>
          {{ statusStr(detail.status) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 联系人： </template>
          {{ detail.contactPerson || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 相关附件： </template>
          <img
            v-for="(item, index) in attachmentArr"
            :key="index"
            :src="item"
            class="attach-icon"
            @click="
              $viewerApi({
                images: attachmentArr,
              })
            "
            alt=""
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 评论数量： </template>
          {{ detail.commentCount }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进人员： </template>
          {{ detail.userName || "-" }}
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template slot="label"> 提醒谁看： </template>
          {{ detail.userList || "-" }}
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label"> 创建时间： </template>
          {{ detail.createTime || "-" }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit(detail)"
          >编辑跟进</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="查看评论"
      :visible.sync="dialogVisibleComment"
      width="40%"
      append-to-body
    >
      <div class="child-box" v-for="(item, index) in commentList" :key="index">
        <div class="flex flex-between">
          <div class="flex flex-acenter">
            <img
              :src="
                item.avatar ||
                require('@/assets/images/user_default_avatar.png')
              "
              alt=""
              class="avatar"
            />
            <span class="ml_10">{{ item.userName || "-" }}</span>
            <!-- <span class="ml_10"
              >跟进({{ typeStr(item.followUpMethod) || "-" }})</span
            > -->
            <span class="ml_10 color_999"> {{ item.createTime || "-" }}</span>
          </div>
          <div class="flex flex-acenter color_999">
            <!-- <span class="mr_10">X</span> -->
          </div>
        </div>
        <div class="mt_10 color_999 content">
          {{ item.content || "-" }}
        </div>
      </div>
      <pagination
        v-show="total"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getCommentList"
      />
    </el-dialog>

    <el-dialog
      title="输入评论"
      :visible.sync="dialogVisibleInput"
      width="40%"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="评论内容" prop="type">
          <el-input v-model="form.comment" placeholder="评论内容" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="handleAdd(detail)">提交</el-button>
      </span>
    </el-dialog>

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="followUpType"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import timeline from "@/views/core/components/timeline";

import {
  listFollowUp,
  getInfo,
  getFollowUp,
  getCommentList,
  addComment,
} from "@/api/core/followUp";
import { listUser } from "@/api/system/user";
import { getCustomer } from "@/api/core/customer";
getCustomerArchive;
import { getCustomerArchive } from "@/api/core/customerArchive";
import { mapState } from "vuex";
import PowerSearch from "@/views/core/components/powerSearch";
import data from "@/views/core/followUp/data";

import followUpDialog from "@/views/core/components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

export default {
  name: "FollowUp",
  components: { timeline, PowerSearch, followUpDialog },
  mixins: [followUpMinixs],
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
      loading: false,
      list: [],
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        {
          key: 0,
          label: `企业名称`,
          width: "250",
          prop: "companyName",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 1,
          label: `跟进人员`,
          width: "140",
          prop: "userName",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 2,
          label: `跟进类型`,
          width: "140",
          prop: "type",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 3,
          label: `跟进方式`,
          width: "140",
          prop: "followUpMethod",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 4,
          label: `跟进事由`,
          width: "180",
          prop: "title",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 5,
          label: `工作总结`,
          width: "250",
          prop: "content",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 6,
          label: `跟进时间`,
          width: "180",
          prop: "followUpTime",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 7,
          label: `创建时间`,
          width: "180",
          prop: "createTime",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
      ],
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

      detail: "",
      dialogVisibleDetail: false,

      dataList: [],
      dialogVisibleComment: false,
      commentList: [],
      query: {
        pageNum: 1,
        pageSize: 10,
        followUpId: "",
      },
      total: 0,
      dialogVisibleInput: false,
      form: { comment: "" },

      followUpType: 1,
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

    attachmentArr() {
      return (
        this.detail.attachment != undefined &&
        this.detail.attachment.length &&
        this.detail.attachment.split(",")
      );
    },
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
      getCustomerArchive(id).then((res) => {
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

    handleDetail(row) {
      console.log(row);
      getInfo({ id: row.id }).then((res) => {
        this.detail = res.data;
        this.detail.id = row.id;
        // 获取当前订单的类型
        this.followUpType = res.data.type;
        this.dialogVisibleDetail = true;
      });
    },

    typeStr_2(index) {
      return this.getLabel(this.commonData.followMethodList, index);
    },

    typeStr_1(index) {
      return this.getLabel(this.commonData.businessTypeList, index);
    },

    statusStr(index) {
      if (index == null || index == undefined) {
        return;
      }

      const currentTypeEn = `${
        this.commonData.typeEn[this.detail.type - 1]
      }StatusList`;
      const statuslist = this.commonData[currentTypeEn];

      return this.getLabel(statuslist, index);
    },

    // 获取评论列表
    getCommentList(item) {
      this.query.followUpId = item.id;
      getCommentList(this.query).then((res) => {
        this.commentList = res.rows;
        this.total = res.total;
        if (res.total) {
          this.dialogVisibleComment = true;
        } else {
          this.$message.warning("暂无评论数据查看");
        }
      });
    },

    cancelSubmit() {
      this.dialogVisibleInput = false;
      this.form.comment = "";
    },

    // 输入评论
    handleSubmitComment(item) {
      console.log(item);
      this.dataList.forEach(
        (val) => item.id == val.id && (val.commentStatus = true)
      );
    },

    // 提交
    handleAdd() {
      if (this.form.comment.trim().length == 0) {
        this.$message.error("请输入评价内容");
        return;
      }
      addComment({
        followUpId: this.id,
        content: this.form.comment,
        parentId: 0,
        topId: 0,
      }).then((res) => {
        this.$message.success("评论成功！");
        this.getList();
        this.dialogVisibleInput = false;
      });
    },

    // 更多操作触发
    handleCommand(command, row) {
      console.log(row);
      switch (command) {
        case "handleCommentInput":
          this.dialogVisibleInput = true;
          this.id = row.id;
          // this.handleSubmitComment(row);
          break;
        case "handleCommentShow":
          this.getCommentList(row);
          break;
        default:
          break;
      }
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
        console.log("打印数据", response);
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
@import "@/assets/styles/dialog.scss";
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

.attach-icon {
  width: 50px;
  height: 50px;
  // border-radius: 50%;
  margin-right: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.clue-box-item {
  padding: 10px 20px;
  background: #f7fbfe;
  border: 1px solid rgba(215, 232, 244, 1);

  .child-box {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
    border: 1px solid rgba(215, 232, 244, 1);
  }
}
.content {
  padding: 0 20px 30px 40px;
}
</style>
