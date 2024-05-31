<template>
  <div class="app-container">
    <div class="table-action">
      <el-button
        size="mini"
        icon="el-icon-back"
        type="primary"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      stripe
      style="width: 100%"
      border
    >
      <el-table-column align="center" label="资质名称">
        <template slot-scope="{ row }">
          {{ row.categoryName || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="指导单价">
        <template slot-scope="{ row }">
          {{ row.guidancePrice || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最低限价">
        <template slot-scope="{ row }">
          {{ row.lowestQuotation || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目名称">
        <template slot-scope="{ row }">
          {{ row.projectName || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品数量">
        <template slot-scope="{ row }">
          {{ row.quantity || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售单价">
        <template slot-scope="{ row }">
          {{ row.unitPrice || 0 }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      @pagination="getList"
      :page.sync="pager.pageNum"
      :limit.sync="pager.pageSize"
      :autoScroll="false"
    />
  </div>
</template>

<script>
import { getOrderProject } from "@/api/newreport/analyse";
export default {
  data() {
    return {
      loading: false,
      list: [],
      queryParams: {},
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  methods: {
    getList() {
      this.loading = true;
      let sendParams = {
        ...this.queryParams,
        ...this.pager,
      };
      getOrderProject(sendParams).then((res) => {
        this.list = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.queryParams = this.$route.query;
    delete this.queryParams.isAsc;
    delete this.queryParams.orderByColumn;

    this.getList();
  },
};
</script>

<style lang='scss' scoped>
.table-action {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>