<template>
  <TableModel
    :queryForm="queryParams"
    :deptOptions="deptOptions"
    :userList="userList"
    :previewData="previewData"
    @query="handleQuery"
  >
    <el-card style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span>{{ tableTitle }}</span>
        </div>
      </div>
      <!-- 关联订单/关联客户 -->
      <avue-crud
        :key="key"
        ref="crud"
        :data="tableData"
        :page.sync="page"
        :option="tableOptions"
        :table-loading="loading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange"
      >
        <template v-for="slot in slotOptions" #[slot.prop]="scope">
          <span
            :key="slot.prop"
            class="click--active"
            @click="handleView(scope.row, slot.prop, slot.label)"
            >{{ scope.row[slot.prop] }}</span
          >
        </template>
        <!-- <template #menuHeader="{}"> 钻取分析 </template>

        <template slot-scope="{ row, index }" slot="menu">
          <el-button
            size="mini"
            type="primary"
            @click="drillCallBack(row, index)"
            >钻取</el-button
          >
        </template> -->
      </avue-crud>
    </el-card>
  </TableModel>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import TableModel from "../components/TableModel";
import userAndDept from "./minixs/userAndDept";

import { projectOptions, sellDetail } from "../data/tableOptions";
import {
  customerDigInto,
  getOrder,
  getUserSales,
  getUserSalesInfo,
  getNoneChildDeptSales,
  getNoneChildDeptSalesInfo,
} from "@/api/newreport/rank";

import { cloneDeep } from "lodash";
export default {
  components: { MultiTable, TableModel },
  mixins: [userAndDept],
  data() {
    return {
      key: Math.random(),
      queryParams: {},

      tableData: [],
      apiFn: null,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      loading: true,
      tableOptions: {
        menu: false,
        border: true,
        align: "center",
        stripe: true,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        loadingText: "Loading...",
        loadingSpinner: "svg",
        loadingSvgViewBox: "-10, -10, 50, 50",
        loadingBackground: "rgba(122, 122, 122, 0.8)",
        defaultSort: {
          prop: "",
          order: "",
        },
        menuWidth: 120,

        column: [],
      },
      column: [],
      tableTitle: "",
      drillType: "", //当前页面类型
      orderBy: "",

      previewFn: null,
      previewData: [], //预览
      contrast: {
        projectQuantity: "销售产品数",
        totalPrice: "产品销售金额",
        orderNum: "关联订单数",
        customerNum: "关联客户数",
        deptNum: "关联客户数",
      },
    };
  },
  methods: {
    init() {
      this.key = Math.random();
      // 重置分页信息
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      // 重置预览数据
      this.previewData = [];
      const { name, type } = this.$route.query;
      //   获取当前的名称
      this.tableTitle = name;
      // 当前页面内容
      this.drillType = type;
      this.queryParams = this.$route.query;
      delete this.queryParams.name;
      delete this.queryParams.type;

      /**
       * 默认排序 start
       */
      this.orderBy = this.queryParams.orderByColumn;
      this.orderType = this.queryParams.isAsc;
      let isAsc = this.queryParams.isAsc == "desc" ? "descending" : "ascending";

      this.tableOptions.defaultSort.order = isAsc;
      this.tableOptions.defaultSort.prop = this.queryParams.orderByColumn;
      /**
       * 默认排序 end
       */

      if (type === "quinary") {
        this.apiFn = customerDigInto;
        this.column = projectOptions[this.drillType];
      } else if (["relevancy", "dept", "dept1"].includes(type)) {
        this.column = sellDetail[this.drillType];
        if (type === "dept") {
          this.apiFn = getNoneChildDeptSales;
          this.previewFn = getNoneChildDeptSalesInfo;
        } else if (type === "dept1") {
          this.apiFn = getUserSales;
          this.previewFn = getUserSalesInfo;
        } else {
          this.apiFn = getOrder;
          this.previewFn = null;
        }
      } else {
      }
      this.tableOptions.column = this.column;
      this.getList();
      this.getInfo();
    },
    handleQuery(model) {
      this.queryParams = model;
      this.getList();
      console.log(this.queryParams, "this.queryParams");
    },

    sizeChange() {
      this.getList();
    },
    currentChange() {
      this.getList();
    },
    sortChange(val) {
      this.orderBy = val.prop;
      this.orderType = val.order === "ascending" ? "asc" : "desc";
      this.getList();
    },
    async getList() {
      this.loading = true;
      if (!this.apiFn) return;

      const { searchEndDate, searchStartDate } = this.queryParams;

      const sendData = {
        ...this.queryParams,
        searchEndDate,
        searchStartDate,
        orderByColumn: this.orderBy || "totalPrice",
        isAsc: this.orderType || "desc",
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };

      try {
        const res = await this.apiFn(sendData);
        if (res.code === 200) {
          let mainPart = "";
          // 特殊处理
          if (sendData.deptNo) {
            mainPart = sendData.deptNo === 1 ? "第二集团军" : "第一集团军";
            res.rows.forEach((item) => (item.mainPart = mainPart));
          }
          this.tableData = res.rows;
          // this.$refs.crud.refreshTable();
          this.page.total = res.total;
          this.loading = false;
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },

    getInfo() {
      if (!this.previewFn) return;

      const { searchEndDate, searchStartDate } = this.queryParams;

      const sendData = {
        ...this.queryParams,
        searchEndDate,
        searchStartDate,
        orderByColumn: this.orderBy || "totalPrice",
        isAsc: this.orderType || "desc",
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      this.previewFn(sendData).then((res) => {
        let previewData = [];

        for (const key in this.contrast) {
          previewData.push({
            lable: this.contrast[key],
            value: res.data[key],
          });
        }
        this.previewData = previewData;
      });
    },

    // 表格数据展示
    handleView(row, prop, name) {
      let type = "";
      let query = cloneDeep(this.queryParams);
      query.searchDeptIds = row.deptId;
      if (this.drillType == "dept") {
        type = "dept1";
      } else if (this.drillType == "dept1") {
        type = "relevancy";
        query.projectId = row.projectId;
        query.searchDeptIds = this.defaultDeptId;
        query.userId = row.userId;
      }
      this.$router.push({
        name: "SituationDetail",
        query: { type: type, ...query, name: name },
      });
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    slotOptions() {
      if (this.column && this.column.length) {
        return this.column.filter((item) => item.isClick);
      }
      return [];
    },
  },
  watch: {
    "$route.query": {
      handler(newval) {
        this.init();
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.click--active {
  color: #409eff;
  cursor: pointer;
}
</style>