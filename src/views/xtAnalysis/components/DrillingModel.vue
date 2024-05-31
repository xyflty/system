<template>
  <div>
    <el-dialog :title="itemRow.title" :visible.sync="dialogVisible">
      <div class="drilling-title">
        {{ itemRow.caption }}
      </div>
      <el-table :data="data" border style="width: 100%">
        <el-table-column prop="name" :label="itemRow.tableName">
        </el-table-column>
        <el-table-column prop="value" label="工单数量"> </el-table-column>
        <el-table-column prop="percentage" label="占比"> </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >钻取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 数据挖掘详情 -->
    <el-dialog width="80%" :title="itemRow.title" :visible.sync="detailVisible">
      <div class="drilling-title">
        {{ rowItem.name }}
      </div>
      <el-table :data="detailData" border style="width: 100%">
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
          :page-sizes="[2, 10, 30, 50]"
          :page-size="pager.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import { drillTake } from "@/api/xtAnalysis";

import { formatterCallback } from "@/utils/common";

import { mapState } from "vuex";
export default {
  name: "DrillingModel",
  components: {
    MultiTable,
  },
  props: {
    itemRow: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    visible: Boolean,
    params: Object,
  },
  data() {
    return {
      dialogVisible: this.visible,

      // 挖掘数据详情
      detailVisible: false,

      rowItem: {},
      queryParams: this.params,
      detailData: [],
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,

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
    };
  },
  methods: {
    // 判断当前点击了那个图表获取对应的参数
    setParams() {
      console.log(this.tableName);
      switch (this.tableName) {
        case "":
          break;

        default:
          break;
      }
    },
    async getList() {
      const { name, tableName } = this.itemRow;
      console.log(this.itemRow);
      let sendData = {
        ...this.queryParams,
        ...this.pager,
      };
      console.log({ sendData });
      if (name === "deptName") {
        sendData["deptId"] = this.rowItem.id;
      } else if (tableName === "客户地区") {
        sendData["customersLocation"] = this.rowItem.id;
      } else if (tableName === "办理地区") {
        sendData["basicInfoArea"] = this.rowItem.id;
      } else {
        sendData[name] = this.rowItem.id;
      }

      const res = await drillTake(sendData);
      if (res.code === 200) {
        this.detailData = res.rows;
        this.total = res.total;
        this.detailVisible = true;
      }
    },
    // 表格钻取
    handleClick(row) {
      this.rowItem = row;
      this.pager.pageNum = 1;
      this.getList();
    },
    handleSizeChange(size) {
      this.pager.pageNum = 1;
      this.pager.pageSize = size;
      this.getList();
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getList();
    },
  },
  mounted() {},
  watch: {
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    params(newVal) {
      this.queryParams = newVal;
    },
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
</style>