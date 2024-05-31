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
      <el-table-column
        prop="customerName"
        label="客户名称"
        align="center"
        min-width="200"
        fixed="left"
      />
      <el-table-column prop="userName" label="归属人员" align="center" />
      <el-table-column
        label="客户等级"
        align="center"
        prop="customerGradeName"
      />
      <!-- <el-table-column
        label="客户行为"
        align="center"
        prop="projectName"
      /> -->
      <el-table-column
        label="关联订单名称"
        align="center"
        prop="orderTitle"
        min-width="120"
      />

      <!-- <el-table-column
        label="关联项目类型"
        align="center"
        prop="guidancePrice"
      /> -->

      <el-table-column
        label="关联产品名称"
        align="center"
        prop="associatedProductName"
        min-width="250"
      >
      </el-table-column>
      <el-table-column
        sortable
        label="产品数量"
        align="center"
        prop="productCount"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        sortable
        label="成交金额"
        align="center"
        prop="dealPrice"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        sortable
        label="成交时间"
        align="center"
        prop="dealTime"
        min-width="220"
      >
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      :autoScroll="false"
    />
  </div>
</template>

<script>
import { associatedProductList } from "@/api/newreport/customer";
export default {
  data() {
    return {
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: "",
        archiveId: "",
      },
      list: [],
      rowAndColumn: [],
      total: 0,
    };
  },

  methods: {
    getList() {
      this.loading = true;
      associatedProductList(this.queryParams).then((res) => {
        // this.list = res.rows;
        let list = [];

        res.rows.forEach((item) => {
          item.orderInfoList.forEach((val) => {
            val.orderProjectInfoList.forEach((value) => {
              list.push({
                ...item,
                ...val,
                ...value,
              });
            });
          });
        });

        this.list = list;
        this.ergodicData(list);
        this.total = res.total;
        this.loading = false;
      });
    },

    //合并行前数据整理 data 就是请求下来的数据
    ergodicData(data) {
      let self = this;
      // 该变量用于生成每一行该跨的列数
      self.rowAndColumn = [];
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          self.rowAndColumn.push(1);
          // pos用于定位是哪一行该开启跨列
          self.pos = 0;
        } else {
          //customerName为要合并的列名。每一行与上一行的customerName相同，则合并
          if (data[i].customerName === data[i - 1].customerName) {
            // 如果customerName相等就累加，并且push 0。pos用于定位是哪一行该开启跨列
            self.rowAndColumn[self.pos] += 1;
            self.rowAndColumn.push(0);
          } else {
            // 不相等push 1
            self.rowAndColumn.push(1);
            self.pos = i;
          }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let self = this;
      // 第三列需要合并
      if (columnIndex < 4) {
        if (self.rowAndColumn[rowIndex]) {
          let rowNum = self.rowAndColumn[rowIndex];
          return {
            rowspan: rowNum,
            colspan: rowNum > 0 ? 1 : 0,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },

    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const { archiveId, userId } = this.$route.query;
    this.queryParams.userId = userId;
    this.queryParams.archiveId = archiveId;
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.table-action {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
