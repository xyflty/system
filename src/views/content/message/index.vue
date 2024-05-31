<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="" prop="isRead">
        <el-select
          v-model="queryParams.isRead"
          :clearable="true"
          placeholder="消息类型"
        >
          <el-option label="全部" value="" />
          <el-option label="未读" :value="0" />
          <el-option label="已读" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="lastFollowUpTime">
        <el-date-picker
          v-model="queryParams.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="messageType">
        <el-select
          v-model="queryParams.messageType"
          :clearable="true"
          placeholder="消息类型"
        >
          <el-option label="任务类消息" :value="1" />
          <el-option label="业务类消息" :value="2" />
          <el-option label="审核类消息" :value="3" />
        </el-select>
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
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="消息标题" align="center" prop="title">
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="content" />
      <el-table-column label="消息类型" align="center" prop="messageType">
        <template slot-scope="{ row }">
          <span>{{ ["任务类", "业务类", "审核类",'协同通知'][row.messageType - 1] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接收时间" align="center" prop="receiveTime" />
      <el-table-column label="状态" align="center" prop="isRead">
        <template slot-scope="{ row }">
          <span>{{ ["未读", "已读"][row.isRead] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-d-arrow-right"
            size="mini"
            type="text"
            @click="
              {
                row = scope.row;
                show = true;
              }
            "
            v-hasPermi="['core:message:convert']"
            >详情</el-button
          >
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

    <MessageInfo :row="row" :show.sync="show" />
  </div>
</template>

<script>
import { list, getInfo } from "@/api/content/message";
import MessageInfo from "@/views/core/components/messageInfo";

export default {
  name: "Message",
  components: { MessageInfo },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 消息记录表格数据
      list: [],
      detail: "",
      showDialog: false,

      row: {},
      show: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isRead: undefined,
        messageType: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询消息记录列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        pageNum: 1,
        pageSize: 10,
        isRead: undefined,
        messageType: undefined,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    // 详情
    handleConvert(row) {
      getInfo(row.id).then((res) => {
        console.log(res);
        this.detail = res.data;
        this.showDialog = true;
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

::v-deep .el-dialog__body {
  min-height: 400px;
}
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
.detail-box {
  border: 1px solid #e4e4e4;
  padding: 10px 5px;

  background: #f9f9f9;
}
</style>
