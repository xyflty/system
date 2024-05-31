<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="搜索企业" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入企业关键字"
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
    </el-form>

    <el-table
      v-loading="loading"
      :data="list"
      border
      highlight-current-row
      ref="myTable"
      style="width: 100%"
    >
      <el-table-column
        label="企业名称"
        align="center"
        prop="companyName"
        :min-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        label="转介绍时间"
        align="center"
        prop="customerReferralTime"
        :min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        label="转介绍来源"
        align="center"
        prop="customerReferralsource"
        :min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        label="首次成交时间"
        align="center"
        prop="turnCustomerTime"
        :min-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        label="首次录入时间"
        align="center"
        prop="firstRecordingTime"
        :min-width="250"
        show-overflow-tooltip
      />
      <el-table-column
        label="复购天数"
        align="center"
        prop="daysOfBuyback"
        :min-width="250"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span>{{ row.daysOfBuyback && "首次合作" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="复购的次数"
        align="center"
        prop="countOfRepurchases"
        :min-width="250"
        show-overflow-tooltip
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCustomerQualityList } from "@/api/report";

export default {
  name: "Quality",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 跟进记录表格数据
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跟进记录列表 */
    getList() {
      this.loading = true;
      getCustomerQualityList(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
