<template>
  <div>
    <span v-if="ifDIO" @click="getCustomerCountList" class="ableClick">
      {{ val }}
    </span>

    <!-- 转客户数量 -->

    <el-dialog v-if="ifDIO" title="转客户数量" :visible.sync="dialogVisible1" width="1020px">
      <el-table :data="list" stripe style="width: 100%" border v-loading="loading1" :span-method="objectSpanMethod">
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
      <pagination v-show="total1 > 0" :total="total1" @pagination="getCustomerCountList" :page.sync="queryParams1.pageNum"
        :limit.sync="queryParams1.pageSize" :autoScroll="false" />
    </el-dialog>

    <el-dialog title="关联产品列表" :visible.sync="dialogVisible" width="1020px">
      <el-table v-loading="loading2" :data="list_dialog" stripe style="width: 100%" border>
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
      <pagination v-show="total2 > 0" :total="total2" @pagination="handleClickLisr" :page.sync="queryParams2.pageNum"
        :limit.sync="queryParams2.pageSize" :autoScroll="false" />
    </el-dialog>
  </div>
</template>

<script>
import {
  customerDealCountList,
  getCustomerCountList,
  getOrderProject,
} from "@/api/newreport/analyse";
export default {
  props: {
    // true 要不是客户数据量
    ifDIO: {
      type: Boolean,
      default: true,
    },
    // table 数值
    val: {
      type: [String, Number],
      default: "0",
    },
    // 请求数据
    queryParams: {
      type: Object,
      default: {},
    },
    row: {
      type: [Object],
      default: () => {
        return {};
      },
    },
  },
  watch: {
    queryParams: {
      handler(val) {
        this.queryParams1 = JSON.parse(JSON.stringify(val));
        this.queryParams2 = JSON.parse(JSON.stringify(val));
        this.queryParams1.pageNum = 1;
        this.queryParams1.pageSize = 10;
        this.queryParams2.pageNum = 1;
        this.queryParams2.pageSize = 10;
        this.queryParams.orderByColumn = undefined
        this.queryParams.isAsc = undefined
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      queryParams1: {},
      queryParams2: {},
      list_dialog: [],
      list: [],
      total1: 0,
      total2: 0,
      loading1: true,
      loading2: true,
      list_dialog: [],
      dialogVisible1: false,
      dialogVisible: false,
    };
  },
  methods: {
    getCustomerCountList() {
      this.queryParams1.deptId = this.row.deptId;
      this.queryParams1.userId = this.row.userId;
      this.queryParams1.archiveId = this.row.archiveId;
      this.dialogVisible1 = true;
      getCustomerCountList(this.queryParams1).then((res) => {
        this.total1 = res.total;
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
        this.loading1 = false;
      });
    },
    // 关联产品数
    handleClickLisr(res) {
      this.dialogVisible = true;
      this.queryParams2.deptId = res.deptId;
      this.queryParams2.userId = res.userId;
      this.queryParams2.orderStatus = res.orderStatus;
      this.queryParams2.orderId = res.orderId;
      this.queryParams2.archiveId = res.archiveId;
      getOrderProject(this.queryParams2).then((res) => {
        this.list_dialog = res.rows;
        this.total2 = res.total;
        this.loading2 = false;
      });
    },
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

      // if (columnIndex != 1) {
      //   if (row.objectSpanMethod > 1) {
      //     let rowNum = row.objectSpanMethod;
      //     return {
      //       rowspan: rowNum,
      //       colspan: 0,
      //     };
      //   } else {
      //     return {
      //       rowspan: 1,
      //       colspan: 1,
      //     };
      //   }
      // }
    },
  },
};
</script>

<style></style>