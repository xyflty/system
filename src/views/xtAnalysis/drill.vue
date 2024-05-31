// 数据钻取详情
<template>
  <div class="app-container">
    <div class="actions">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-back"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <div class="drilling-title">
      {{ name }}
    </div>
    <el-table v-loading="loading" :data="detailData" border style="width: 100%">
      <template v-for="option in Options">
        <el-table-column
          :prop="option.prop"
          :label="option.label"
          :key="option.prop"
          v-bind="option"
        >
        </el-table-column>
      </template>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="pager.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatterCallback } from "@/utils/common";

import { drillTake } from "@/api/xtAnalysis";
import { mapState } from "vuex";
export default {
  data() {
    return {
      name: "",
      //   表格数据
      detailData: [],
      Options: [
        {
          label: "客户名称",
          prop: "companyName",
          width: "250px",
          fixed: true,
        },
        {
          label: "工单编号",
          prop: "orderJobCode", //1
          width: "155px",
        },

        {
          label: "订单类型",
          prop: "orderType",
          width: "100px",
          formatter: (row, column, value) => {
            return formatterCallback(this.commonData.xtOrderType, value);
          },
        }, //1
        {
          label: "项目产品名称",
          prop: "projectName",
          width: "250px",
        },

        {
          label: "订单发起人",
          prop: "orderInitiator",
          width: "150px",
        },
        {
          label: "工单作业节点",
          prop: "rootNode",
          width: "120px",
        },
        {
          label: "服务顾问（制）",
          prop: "makeUserName",
          width: "200px",
        }, //1
        {
          label: "服务顾问（审）",
          prop: "auditUserName",
          width: "200px",
        }, //1
        {
          label: "财务顾问",
          prop: "financeAdvisor",
          width: "120px",
        }, //1

        {
          label: "是否赠品",
          prop: "isGift",
          width: "100px",
          formatter: (row, column, value) => {
            return ["非赠品", "赠品"][value];
          },
        }, //1

        {
          label: "应收金额",
          prop: "planPrice",
          width: "110px",
        }, //1
        {
          label: "已收金额",
          prop: "actualPrice",
          width: "110px",
        }, //1
      ],
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,

      queryParams: {},
      // 传递过来的类型
      id: "",

      itemRow: {},

      loading: false,
    };
  },
  methods: {
    handleSizeChange(size) {
      this.pager.pageNum = 1;
      this.pager.pageSize = size;
      this.getList();
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getList();
    },
    async getList() {
      this.loading = true;
      const { name, tableName } = this.itemRow;
      let sendData = {
        ...this.queryParams,
        ...this.pager,
      };
      console.log({ sendData });

      if (name === "deptName") {
        sendData["deptId"] = this.id;
      } else if (tableName === "客户地区") {
        sendData["customersLocation"] = this.id;
      } else if (tableName === "办理地区") {
        sendData["basicInfoArea"] = this.id;
      } else {
        sendData[name] = this.id;
      }

      try {
        const res = await drillTake(sendData);
        if (res.code === 200) {
          this.detailData = res.rows;
          this.total = res.total;
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const { row } = JSON.parse(sessionStorage.getItem("XTANALYSIS_KEY"));
    this.itemRow = row;
    const { id, userId, deptIds, projectCategory, name } = this.$route.query;
    this.id = id;
    this.name = name;
    this.queryParams = {
      userId,
      deptIds,
      projectCategory,
    };

    this.getList();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
.drilling-title {
  background-color: #e8eef0;
  padding: 15px 10px;
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
  color: #333;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}
.actions {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>