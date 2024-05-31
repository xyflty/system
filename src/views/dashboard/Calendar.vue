<template>
  <el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-box">
        <span>工作日程</span>
        <div class="work-box">
          <el-select
            v-model="ownerType"
            placeholder="请选择"
            @change="handleTypechange"
          >
            <el-option label="全部日程" :value="0"> </el-option>
            <el-option label="我的日程" :value="1"> </el-option>
            <el-option label="下属日程" :value="2"> </el-option>
          </el-select>

          <el-button
            plain
            style="margin-left: 10px"
            @click="add"
            v-hasPermi="['core:schedule:add']"
            >新建日程</el-button
          >
          <el-button
            plain
            style="margin-left: 10px"
            @click="$router.push({ name: 'Schedule' })"
            >日程管理</el-button
          >
        </div>
      </div>
      <div class="date-box">
        <el-date-picker
          v-model="date"
          class="date-month"
          type="month"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
        >
        </el-date-picker>
        <el-calendar v-model="date">
          <template slot="dateCell" slot-scope="{ data }">
            <div class="date-day" @click="handleClick(data.day)">
              <span>{{ data.day.split("-")[2] }}</span>

              <span
                v-if="workDayList.includes(data.day)"
                class="info-day"
              ></span>
            </div>
          </template>
        </el-calendar>
      </div>
    </el-card>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="日程标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入日程标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="followUpTime">
          <el-date-picker
            v-model="form.followUpTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联业务">
          <el-col :span="11">
            <el-select v-model="form.relateType" placeholder="请选择业务类型">
              <el-option label="线索" :value="1"></el-option>
              <!-- <el-option label="挖需" :value="2"></el-option> -->
              <el-option label="商机" :value="3"></el-option>
              <el-option label="订单" :value="4"></el-option>
              <el-option label="客户" :value="5"></el-option>
            </el-select>
          </el-col>
          <el-col :span="11">
            <el-select
              style="width: 100%"
              v-model="form.relateId"
              filterable
              placeholder="请输入关键字搜索"
              remote
              :remote-method="getCompanyList"
              @focus="getCompanyList($event, true)"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="日程描述">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="4"
            placeholder="请输入描述信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="日程状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">未开始</el-radio>
            <el-radio :label="1">执行中</el-radio>
            <el-radio :label="2">已结束</el-radio>
            <el-radio :label="3">已取消</el-radio>
          </el-radio-group>
          <el-checkbox style="margin-left: 10px" v-model="form.isAutoCancel"
            >过期自动结束</el-checkbox
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 日程列表 -->
    <el-dialog title="日程列表" :visible.sync="dialogVisibleList" width="60%">
      <el-table :data="list" border style="width: 100%" stripe>
        <el-table-column prop="title" align="center" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="followUpTime"
          align="center"
          label="跟进时间"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="{ row }">
            <span>{{ statusStr(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" align="center" label="关联业务">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-arrow-right"
              @click="handleDetail(row)"
              v-hasPermi="['core:schedule:query']"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['core:schedule:edit']"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(row)"
              >删除</el-button
            > -->
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

      <el-dialog
        title="日程详情"
        :visible.sync="dialogVisibleDetail"
        width="30%"
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
            <template slot="label"> 日程标题： </template>
            {{ detail.title || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 跟进时间： </template>
            {{ detail.followUpTime || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 关联业务： </template>
            {{ detail.companyName || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 日程描述： </template>
            {{ detail.content || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 日程状态： </template>
            {{ statusStr(detail.status) || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 负责人员： </template>
            {{ detail.userName || "-" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 创建时间： </template>
            {{ detail.createTime || "-" }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  listSchedule,
  getScheduleCount,
  getSchedule,
  addSchedule,
  updateSchedule,
  delSchedule,
  getBaseInfoList,
} from "@/api/content/schedule";

import { formatDate_1 } from "@/utils/index";

export default {
  computed: {},

  watch: {
    date: {
      handler(n) {
        this.getScheduleCount();
      },
      immediate: true,
    },
  },
  data() {
    return {
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "60px",
        "word-break": "keep-all",
      },
      value: 0,
      date: new Date(),
      dialogVisible: false,
      form: {},
      title: "新建日程",
      rules: {
        title: [{ required: true, message: "请输入日程标题", trigger: "blur" }],
        followUpTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
      },
      dialogVisibleDetail: false,
      detail: "",
      dialogVisibleList: false,

      workDayList: [],

      day: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      companyList: [],
      buttonLoading: false,

      ownerType: 0,
    };
  },
  mounted() {},
  methods: {
    handleTypechange(e) {
      this.getScheduleCount();
    },
    statusStr(index) {
      return ["未开始", "执行中", "已结束", "已取消"][index];
    },
    // 获取日程标记
    getScheduleCount() {
      getScheduleCount({
        followUpTime: formatDate_1(this.date) + " 00:00:00",
        ownerType: this.ownerType,
        dateType: 1,
      }).then((res) => {
        console.log(res);
        this.workDayList = [];
        res.data.forEach((item) => {
          item.followUpTime = item.followUpTime.split(" ")[0];
          this.workDayList.push(item.followUpTime);
        });
      });
    },

    add() {
      this.form = {};
      this.dialogVisible = true;
      this.title = "新建日程";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            this.form.isAutoCancel = this.form.isAutoCancel ? 1 : 0;
            this.form.customerId = this.companyList.length
              ? this.companyList.find((item) => item.id == this.form.relateId)[
                  "customerId"
                ]
              : this.form.customerId;
            console.log(this.form);

            updateSchedule(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getList();
                this.form = {};
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            this.form.isAutoCancel = this.form.isAutoCancel ? 1 : 0;
            this.form.customerId = this.companyList.length
              ? this.companyList.find((item) => item.id == this.form.relateId)[
                  "customerId"
                ]
              : "";
            console.log(this.form);

            // return;
            addSchedule(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.dialogVisible = false;
                this.form = {};
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },

    /** 查询关联列表 */
    getCompanyList(e, isFocus) {
      let typeStr = ["clue", "demand", "opportunity", "order", "customer"];
      if (this.form.relateType == null || this.form.relateType == undefined) {
        this.$message.error("请先选择关联业务类型");
        return;
      }

      getBaseInfoList(
        {
          pageNum: 1,
          pageSize: 10,
          searchValue: isFocus ? "" : e,
        },
        typeStr[this.form.relateType - 1]
      ).then((response) => {
        this.companyList = response.rows;
      });
    },

    // 获取列表
    getList() {
      listSchedule({
        followUpTime: this.day + " 00:00:00",
        ...this.queryParams,
      }).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.dialogVisibleList = true;
      });
    },

    handleClick(day) {
      if (!this.workDayList.includes(day)) {
        return;
      }
      this.day = day;
      this.getList();
    },

    // 详情
    handleDetail(row) {
      getSchedule({ id: row.id }).then((res) => {
        console.log(res);
        this.dialogVisibleDetail = true;
        this.detail = res.data;
      });
    },

    // 编辑
    handleEdit(row) {
      this.title = "编辑日程";
      getSchedule({ id: row.id }).then((res) => {
        console.log(res);
        this.dialogVisible = true;
        this.form = res.data;
        this.form.isAutoCancel = this.form.isAutoCancel ? true : false;
        this.getCompanyList(this.form.companyName);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/dialog.scss";

::v-deep .el-card__header {
  background: #f9f9f9;
}
::v-deep .el-card__body {
  height: 700px;
}
::v-deep .el-dialog__body {
  max-height: 550px;
  overflow-y: scroll;
}
.text {
  font-size: 14px;
}
.date-box {
  position: relative;
}
.date-month {
  position: absolute;
  left: 0;
  top: 8px;
}
.date-day {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.date-day span:not(:first-child) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  top: 40%;
  left: 65%;
}
.error-day {
  background: #ff3b31;
}
.warning-day {
  background: #fe9400;
}
.info-day {
  background: #0079fe;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
}
.item:hover {
  background-color: #f9f9f9;
}
.item img {
  width: 48px;
  height: 48px;
}
.item div {
  margin-top: 10px;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn_more {
  box-sizing: border-box;
  width: 90px;
  height: 36px;
  font-size: 12px;
  color: #999999;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(228, 228, 228, 1);
  text-align: center;
  line-height: 36px;
  background: #fff;
  border-radius: 5px;
  font-family: "微软雅黑 Regular", 微软雅黑;
  font-weight: 400;
  cursor: pointer;
}
.msg_title {
  position: relative;
  padding: 0 20px;
  cursor: pointer;
}
.work-box {
  display: flex;
}
.msg_title::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  background: #d7d7d7;
  width: 2px;
  height: 100%;
}
.msg-box .msg_title:first-child {
  padding-left: 0;
}
.msg-box .msg_title:last-child::after {
  width: 0;
}
.select_title {
  font-weight: 600;
  color: #333;
}
.box-card {
  width: 100%;
}
.menu-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
}
</style>
