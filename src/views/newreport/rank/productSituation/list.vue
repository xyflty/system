<template>
  <TableModel
    :queryForm="queryParams"
    :deptOptions="deptOptions"
    :userList="userList"
    @query="handleQuery"
    @reset="handleReset"
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
            @click="handleView(scope.row, slot.prop)"
            >{{ scope.row[slot.prop] }}</span
          >
        </template>
        <template #menuHeader="{}"> 钻取分析 </template>

        <template slot-scope="{ row, index }" slot="menu">
          <el-button
            size="mini"
            type="primary"
            @click="drillCallBack(row, index)"
            >钻取</el-button
          >
        </template>
      </avue-crud>
    </el-card>
  </TableModel>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import TableModel from "../components/TableModel";

import userAndDept from "./minixs/userAndDept";

// 导入配置信息
import {
  products,
  projectOptions,
  cityOptions,
  sellDetail,
} from "../data/tableOptions";

import { projectBigClassDigInto, cityDigInto } from "@/api/newreport/rank";
import { cloneDeep } from "lodash";
export default {
  components: { MultiTable, TableModel },
  mixins: [userAndDept],
  data() {
    return {
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
        menu: true,
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
      grade: "", //当前层级
      drillType: "", //当前页面类型
      orderBy: "",
      orderType: "",

      key: Math.random(),
    };
  },
  methods: {
    init() {
      this.key = Math.random();
      // 重置分页信息
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      const { type, grade, name } = this.$route.query;
      //   获取当前的名称
      this.tableTitle = name;
      //   当前钻取的类型
      this.drillType = type;
      //   当前钻取的等级
      this.grade = grade;
      this.queryParams = this.$route.query;
      //   移除
      delete this.queryParams.grade;
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

      // 判断当前是项目还是城市，赋值对应的接口和当前表格头配置
      if (type === "project") {
        this.apiFn = projectBigClassDigInto;
        this.column = projectOptions[this.grade];
      } else if (type === "city") {
        this.apiFn = cityDigInto;

        this.column = cityOptions[this.grade];
      }

      if (this.grade === "area") {
        // 如果等级是地区，则没有操作栏
        this.tableOptions.menu = false;
      } else {
        this.tableOptions.menu = true;
      }

      this.tableOptions.column = this.column;
      this.getList();
    },
    // 查询
    handleQuery(model) {
      this.queryParams = model;
      this.getList();
      console.log(this.queryParams, "this.queryParams");
    },
    // 重置
    handleReset(model) {
      this.queryParams = model;
      this.getList();
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

      this.isFrist = false;

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

    // 钻取
    drillCallBack(row) {
      let nextGrade = "";
      let name = "";
      let query = cloneDeep(this.queryParams);
      query.nextCategoryId = row.nextCategoryId;

      // 判断是否为最后一层
      let lastGrade = row.nextFlag ? false : true;

      // 对城市的标题处理
      if (this.drillType === "city") {
        let title = this.tableTitle.slice(0, -8);
        name = `${title} - ${row.categoryName}产品销售情况`;
      } else {
        name = row.categoryName;
      }
      if (this.grade === "city") {
        // 当前是城市，钻取对应的区数据
        this.apiFn = cityDigInto;
        query.orderByColumn = "productPrice";
        query.isAsc = "desc";
        name = row.customerCity;
        query.customerCity = name;

        nextGrade = "area";
      } else {
        if (lastGrade) {
          // 判断是否为最后一层
          delete query.nextCategoryId;
          query.categoryId = row.categoryId;
          query.orderByColumn = "orderPrice";
          query.isAsc = "desc";
          nextGrade = "quinary";

          this.$router.push({
            name: "SituationDetail",
            query: {
              type: "quinary",

              ...query,
              name: name,
            },
          });
          return;
        } else {
          // 判断处于那个等级页面，钻取下一等级
          if (this.grade === "secondary") {
            // 当前是2级项目，钻取第3级项目
            this.apiFn = projectBigClassDigInto;
            query.orderByColumn = "productPrice";
            query.isAsc = "desc";
            nextGrade = "tertiary";
          }
          if (this.grade === "tertiary") {
            // 当前是3级项目，钻取项目名称
            this.apiFn = projectBigClassDigInto;
            query.orderByColumn = "productPrice";
            query.isAsc = "desc";
            nextGrade = "fourthly";
          }
        }
      }

      this.$router.push({
        name: "SituationList",
        query: {
          type: this.drillType,
          grade: nextGrade,
          ...query,
          name: name,
        },
      });
    },

    // 表格数据点击操作
    handleView(row, prop) {
      this.apiFn = projectBigClassDigInto;
      let name = "";
      // 默认为二级项目
      let nextGrade = "secondary";
      let query = cloneDeep(this.queryParams);
      query.orderByColumn = "productPrice";
      query.isAsc = "desc";

      const { topCategoryId, secondCategoryId } = query;
      query.customerArea = row.customerArea;
      query[`nextCategoryId`] = row[`${prop}Id`];
      // 如果重新条件存在二级项目，则跳三级项目，存在3级则跳转项目名称
      if (topCategoryId && !secondCategoryId) {
        // (需要展示3级项目)
        nextGrade = "tertiary";
      } else if (topCategoryId && secondCategoryId) {
        // (需要展示项目名称)
        nextGrade = "fourthly";
      }
      name = `${query.customerCity} - ${row.customerArea}产品销售情况`;
      this.$router.push({
        name: "SituationList",
        query: {
          type: "project",
          grade: nextGrade,
          ...query,
          name: name,
        },
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