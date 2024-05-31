<template>
  <div class="orderCenter">
    <MultiTable
      ref="tableRef"
      v-if="this.parmas"
      :parmas="parmas"
      :api="apiFn"
      :Options="tableOptions"
      isSearchForm
      isSelection
      isPagination
      border
      align="center"
      :getSpanData="getSpanData"
      :span-method="handleObjectSpanMethod"
      :row-class-name="tableRowClassName"
      :searchOptions="searchOptions"
    >
      <template #operation="{ scope }">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-chat-dot-round"
          v-hasPermi="['core:order:synergy']"
          :disabled="scope.finishTwiceConfigFlag == 1"
          @click="synergyOrdering(scope.row)"
          >二次配置</el-button
        >
        <el-button
          size="mini"
          type="text"
          icon="el-icon-chat-dot-round"
          @click="increaseOrDecreaseOrder(scope.row)"
          >项目变更</el-button
        >
      </template>
      <template #xtConfigFlag="{ scope }">
        <el-tag
          effect="dark"
          :type="scope.xtConfigFlag ? 'success' : 'danger'"
          >{{
            formatter(commonData.xtConfigFlagStatus, scope.xtConfigFlag)
          }}</el-tag
        >
      </template>
    </MultiTable>

    <!-- 项目变更 -->
    <order-drawer
      v-if="increaseOrDecreaseOrderForm"
      type="twice"
      :id="rowId"
      :tableRow="rowItem"
      :drawerForm="increaseOrDecreaseOrderForm"
      :visiable.sync="increaseOrDecreaseOrderDrawer"
      @cancel="handleCancel"
      @submit="handleSubmit"
    ></order-drawer>
  </div>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";
import { zwOrderGetOrderManageList } from "@/api/core/order";
import { treeselect } from "@/api/system/dept";

// 格式化表格数据方法
import { formatterCallback } from "@/utils/common";

// 项目变更
import orderDrawer from "@/views/components/increaseOrDecreaseOrder.vue";
import {
  xtOrderProjectChangeRecord,
  xtOrderProjectChangeRecordItemModifiedSubmit,
} from "@/api/xt";

import { mapState } from "vuex";
export default {
  components: { MultiTable, orderDrawer },
  data() {
    return {
      apiFn: zwOrderGetOrderManageList,
      tableOptions: [
        {
          label: `订单编号`,
          width: "250",
          prop: "orderCode",
          visible: true,
          showOverflow: true,
          fixed: true,
          sortable: true,
        },
        {
          label: `订单标题`,
          width: "250",
          prop: "title",
          visible: true,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `关联客户`,
          width: "250",
          prop: "companyName",
          visible: true,
          showOverflow: true,
          sortable: true,
        },
        {
          label: "项目名称",
          prop: "projectName",
          width: "200",
        },
        {
          label: `签单日期`,
          visible: true,
          width: "180",
          prop: "signTime",
          showOverflow: true,
          sortable: true,
        },
        {
          label: `订单总金额`,
          visible: true,
          width: "140",
          prop: "price",
          showOverflow: true,
          sortable: true,
        },
        {
          label: `项目状态`,
          visible: true,
          width: "140",
          prop: "changeType",
          showOverflow: true,
          sortable: true,
          formatter: (row, column, val) => {
            return formatterCallback(
              this.commonData.orderProjectChangeType,
              val
            );
          },
        },
        {
          label: `配置状态`,
          visible: true,
          width: "140",
          slotName: "xtConfigFlag",
        },
        {
          label: `订单状态`,
          width: "140",
          prop: "orderStatus",
          visible: false,
          showOverflow: true,
          sortable: true,
          formatter: (row, column, val) => {
            return formatterCallback(this.commonData.xtOrderStatus, val);
          },
        },
        // {
        //   key: 6,
        //   label: `订单类型`,
        //   width: "140",
        //   prop: "orderType",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          label: `订单开始时间`,
          width: "180",
          prop: "beginTime",
          visible: false,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `订单结束时间`,
          width: "180",
          prop: "endTime",
          visible: false,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `客户签约人`,
          width: "180",
          prop: "customerSigner",
          visible: false,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `我方签约人`,
          width: "180",
          prop: "ourSigner",
          visible: true,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `付款方式`,
          width: "180",
          prop: "paymentMethod",
          visible: false,
          showOverflow: true,
          sortable: true,
        },
        {
          label: `跟进人`,
          width: "180",
          prop: "userName",
          visible: true,
          showOverflow: true,
          sortable: true,
        },
        // {
        //   label: `角色`,
        //   width: "140",
        //   prop: "role",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        // {
        //   label: `性别`,
        //   width: "140",
        //   prop: "gender",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        // {
        //   label: `法人`,
        //   width: "140",
        //   prop: "legalPerson",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        // {
        //   label: `职位`,
        //   width: "140",
        //   prop: "position",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        // {
        //   label: `微信`,
        //   width: "140",
        //   prop: "tencentWx",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        // {
        //   label: `安证有效期`,
        //   width: "180",
        //   prop: "safetyPermitsTime",
        //   sortable: true,
        //   visible: true,
        //   showOverflow: true,
        // },
        // {
        //   label: `所在地区`,
        //   width: "180",
        //   prop: "province",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: true,
        // },
        {
          label: `操作`,
          width: "180",
          action: true,
          fixed: "right",
        },
      ],
      searchOptions: [],
      deptOptions: [],
      parmas: {
        auditStatus: 2,
      },

      // 项目变更弹出框
      increaseOrDecreaseOrderDrawer: false,
      increaseOrDecreaseOrderForm: null,

      spanData: [],
      pos: 0,

      rowId: "",
      rowItem: {}, //订单当前表格数据
    };
  },
  methods: {
    formatter(data, val) {
      return formatterCallback(data, val);
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = [
        "项目名称",
        "配置状态",
        "项目状态",
        "签单日期",
        "订单状态",
        "微信",
        "所在地区",
        "安证有效期",
        "角色",
      ];
      if (!obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let index = 0; index < arr.length; index++) {
        if (index === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[index].id === arr[index - 1].id) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = index;
          }
        }
      }
    },
    // 处理表格数据和生成span的数据
    getSpanData(arr) {
      this.spanData = [];
      this.pos = 0;
      let newTable = [];
      arr.forEach((item) => {
        if (item.orderProjects.length) {
          item.orderProjects.forEach((ele) => {
            newTable.push({
              ...item,
              changeType: ele.changeType,
              projectName: ele.projectName,
              xtConfigFlag: ele.xtConfigFlag,
            });
          });
        }
      });
      this.getSpanId(newTable);
      return newTable;
    },
    initOption() {
      this.searchOptions = [
        {
          type: "input",
          label: "搜索关键字",
          prop: "keyword",
          placeholder: "搜索关键字",
          attrs: {
            clearable: true,
          },
        },
        {
          type: "select",
          label: "项目状态",
          prop: "changeType",
          placeholder: "项目状态",
          children: this.commonData.orderProjectChangeType,
          attrs: {
            clearable: true,
          },
        },
        {
          type: "treeselect",
          label: "归属部门",
          prop: "deptId",

          placeholder: "归属部门",
          options: this.deptOptions,
          attrs: {
            style: "margin-left: 10px; max-width: 200px",
            clearable: true,
          },
        },
        // {
        //   type: "select",
        //   label: "是否二次配置",
        //   prop: "finishTwiceConfigFlag",
        //   value: 0,
        //   children: [
        //     {
        //       label: "否",
        //       value: 0,
        //     },
        //     {
        //       label: "是",
        //       value: 1,
        //     },
        //   ],
        //   attrs: {
        //     clearable: true,
        //   },
        // },
        {
          type: "select",
          label: "审核状态",
          prop: "auditStatus",
          value: 2,
          children: this.commonData.auditstatus,
          attrs: {
            clearable: true,
          },
        },
      ];
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
        let row = this.searchOptions.find((item) => item.prop === "deptId");
        row.options = this.deptOptions;
      });
    },
    //当前表格行操作
    synergyOrdering(row) {
      this.$router.push({
        name: "SynergyConfig",
        query: { id: row.id, type: 1 },
      });
    },
    // 项目变更

    increaseOrDecreaseOrder(row) {
      this.rowId = row.id;
      this.rowItem = row;
      // let sendParams = {
      //   orderId:row.id
      // }
      xtOrderProjectChangeRecord(row.id).then((res) => {
        this.$nextTick(() => {
          this.increaseOrDecreaseOrderForm = res.data;
          this.increaseOrDecreaseOrderForm.xtOrderProjectChangeAuditList =
            res.data.xtOrderProjectChangeRecordList;
        });
        this.increaseOrDecreaseOrderDrawer = true;
      });
    },
    handleCancel(flag) {
      this.rowId = "";
      this.rowItem = null;
      this.increaseOrDecreaseOrderForm = null;
    },
    // 提交操作

    handleSubmit({ model }) {
      const { xtOrderProjectChangeAuditList } = model;
      let sendData = {
        ...model,
        xtOrderProjectChangeRecordList: xtOrderProjectChangeAuditList,
        orderId: this.rowId,
      };
      delete sendData.xtOrderProjectChangeAuditList;
      xtOrderProjectChangeRecordItemModifiedSubmit(sendData).then((res) => {
        if (res.code === 200) {
          this.$refs.tableRef.getTableData();
          this.handleCancel();

          this.$message.success("已成功提交");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 标记当前表格行变色
    tableRowClassName: function ({ row, rowIndex }) {
      if (row.isOperateUser) {
        return "warm-row";
      }
    },
  },
  mounted() {
    this.initOption();
    this.getTreeselect();
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang="scss" scoped>
.orderCenter {
  padding: 20px;
}
</style>
