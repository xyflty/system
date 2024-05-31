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
      :data="list"
      stripe
      style="width: 100%"
      border
      v-loading="loading"
      :span-method="objectSpanMethod"
    >
      <el-table-column prop="customerName" align="center" label="企业名称">
      </el-table-column>
      <el-table-column prop="title" align="center" label="订单标题">
      </el-table-column>
      <el-table-column align="center" label="成交金额">
        <template slot-scope="{ row }">
          <span>{{ row.dealPrice || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="未跟进天数">
        <template slot-scope="{ row }">
          <span>{{ row.unFollowUpDay }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关联产品数">
        <template slot-scope="{ row }">
          <span class="ableClick" @click="handleClickLisr(row)">{{
            row.associatedProductCount
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      @pagination="getCustomerCountList"
      :page.sync="pager.pageNum"
      :limit.sync="pager.pageSize"
      :autoScroll="false"
    />
  </div>
</template>

<script>
import { getCustomerCountList } from "@/api/newreport/analyse";
export default {
  data() {
    return {
      list: [],
      loading: false,
      queryParams: {},
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  methods: {
    // 合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // // 第三列需要合并

      if (columnIndex != 1) {
        if (row.objectSpanMethod > 1) {
          return {
            rowspan: row.objectSpanMethod,
            colspan: 1,
          };
        }
        if (row.objectSpanMethod == "不用合并") {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    },
    getCustomerCountList() {
      this.loading = true;
      let sendParams = {
        ...this.queryParams,
        ...this.pager,
      };
      getCustomerCountList(sendParams).then((res) => {
        this.total = res.total;
        let list = [];
        res.rows.forEach((item) => {
          if (item.orderTitleList.length == 0) {
            list.push(item);
          } else {
            item.orderTitleList.forEach((val, index) => {
              if (index == 0) {
                list.push({
                  ...item,
                  ...val,
                  objectSpanMethod: item.orderTitleList.length,
                });
              } else {
                list.push({
                  ...item,
                  ...val,
                  objectSpanMethod: "不用合并",
                });
              }
            });
          }
        });
        this.list = list;
        this.loading = false;
      });
    },

    // 关联产品数
    handleClickLisr(row) {
      this.$router.push({
        name: "AnalyseRelevancyProduct",
        query: {
          ...this.queryParams,
          deptId: row.deptId,
          userId: row.userId,
          orderStatus: row.orderStatus,
          orderId: row.orderId,
          archiveId: row.archiveId,
        },
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

    this.getCustomerCountList();
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