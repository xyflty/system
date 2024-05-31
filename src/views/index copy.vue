<template>
  <div class="app-container">
    <div class="briefing-container">
      <!-- crm简报 -->
      <CRMBriefing
        isQuery
        title="CRM数据简报"
        :Options="briefingOptions.CRM"
        :data="crmData"
        :queryForm="crmQuery"
        :report="reportOptions"
        size="default"
        @detail="crmDetail"
      ></CRMBriefing>
      <!-- 协同简报 -->
      <CRMBriefing
        isQuery
        :hideTime="false"
        title="协同工单数据简报"
        :queryForm="xtQuery"
        :Options="briefingOptions.XT"
        :report="reportOptions"
        :data="jobData"
        size="default"
        @detail="handleDetail"
      ></CRMBriefing>
    </div>
    <div class="ranking">
      <!-- <RankingBriefing
        :Options="briefingOptions.Ranking"
        :report="reportOptions"
      /> -->
      <CRMBriefing
        isQuery
        isShowSlot
        title="业务排名简报"
        size="default"
        :queryForm="rankingQuery"
        :report="reportOptions"
      >
        <template #header-right>
          <right-toolbar_2
            :isSearch="false"
            :columns="rankingOptions"
            pageName="ranking"
          ></right-toolbar_2>
        </template>
        <MultiTable
          ref="rankingRef"
          v-if="parmas"
          :parmas="parmas"
          isPagination
          border
          stripe
          align="center"
          :Options="rankingOptions"
          :api="apiFn"
          @sort-change="sortChange"
        ></MultiTable>
      </CRMBriefing>
    </div>
    <div :class="['messageAndreport', user.deptId === 200 ? 'reportShow' : '']">
      <div class="message">
        <Message />
      </div>
      <div class="workReport" v-if="user.deptId !== 200">
        <WorkReport size="default"></WorkReport>
      </div>
    </div>

    <div class="quickly-aside">
      <QuicklyCreate />
    </div>
    <Ad />
    <!-- 客服ai -->
    <div class="ai" @click="$router.push({ name: 'Chat' })">
      <img src="../assets/images/kefu.png" alt="" />
      <span>AI问答</span>
    </div>
    <!-- 查看详情数据 -->
    <el-dialog
      width="80%"
      :visible.sync="detailVisible"
      :title="dialogTitle"
      @close="detailClose"
    >
      <el-scrollbar style="height: 700px">
        <MultiTable
          v-if="detailParams"
          isPagination
          border
          stripe
          align="center"
          :Options="detailOptions"
          :api="tableApiFn"
          :parmas="detailParams"
          :getSpanData="getSpanData"
          :span-method="handleObjectSpanMethod"
        >
          <template #totalPrice="{ scope }">
            {{ (scope.unitPrice * scope.quantity).toFixed(2) || "0.00" }}
          </template>
        </MultiTable>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
// crm简报
import CRMBriefing from "@/views/components/homeComponents/CRMBriefing";

import MultiTable from "@/components/MultiTable";
// 业务排名简报
// import RankingBriefing from "@/views/components/homeComponents/RankingBriefing";

//侧边栏新增线索操作
import QuicklyCreate from "@/views/components/homeComponents/QuicklyCreate";
import WorkReport from "@/views/components/homeComponents/WorkReport";

// 消息
import Message from "./dashboard/Message";
// 广告弹出框
import Ad from "./dashboard/Advertising";
import { briefing } from "@/views/components/homeComponents/BriefingOptions";

// 接口api
import {
  getDataReport,
  getSynergyOrderJobDataReport,
  getSynergyOrderCountPageList,
  getOrderJobCountPageList,
  getWaitSynergyOrderAuditPageList,
} from "@/api/index/index";

import { list } from "@/api/common.js";

// 导入通过判断角色获取简报数据minis
import { posts } from "@/mixins/xtAnalysis/posts";
import store from "../store";

import { mapState } from "vuex";

export default {
  components: {
    CRMBriefing,
    MultiTable,
    QuicklyCreate,
    WorkReport,
    Message,
    Ad,
  },
  mixins: [posts],
  data() {
    return {
      briefingOptions: briefing, //简报配置信息

      crmData: {},
      jobData: {},

      // 展示表格详情

      detailVisible: false, //显示表格数据弹出框
      showType: "", //展示类型,判断是那个表格数据
      dialogTitle: "", //弹出框的标题
      detailParams: null,
      tableApiFn: null,

      // 存储表格合并的数据
      spanData: [],
      pos: 0,
      mergeRow: [], //需要合并的列
      rankingOptions: [],
    };
  },
  methods: {
    crmDetail({ label, type, status }) {
      let pathName = "";
      if (type === "orderProjectCount") {
        pathName = "Sale";
      } else if (type === "priceSum") {
        pathName = "ReportCustomer";
      } else if (type === "waitReferPriceAudit") {
        pathName = "Audit";
      } else if (type === "waitOrderProjectChangeAudit") {
        pathName = "Approval";
      } else {
        pathName = type[0].toUpperCase() + type.slice(1, -5);
      }

      this.$router.push({
        name: pathName,
        params: { timeType: this.crmQuery.type },
      });
    },
    // 获取其他协同工单的typeString
    getTypeString(label) {
      switch (label) {
        case "工单数量":
          return "协同" + label;

        default:
          return label + "工单";
      }
    },
    // 解构树结构
    deconstructionTree(tree, prop = "zwOrderProjectVoList", arr = []) {
      tree.map((item) => {
        if (item[prop] && item[prop].length) {
          arr.push(...this.deconstructionTree(item[prop]));
          delete item[prop];
        } else {
          arr.push(item);
        }
      });
      return arr;
    },
    // 根据订单id判断需要合并的行
    getSpanId(arr, mergeProp = "orderId") {
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[i][mergeProp] === arr[i - 1][mergeProp]) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = i;
          }
        }
      }
    },
    // 处理表格数据
    dealTableData(data, prop = "zwOrderProjectVoList") {
      data.forEach((item) => {
        if (item[prop].length) {
          item[prop] = item[prop].map((ele) => {
            return {
              commonId: item.id, //当前数据id的下有几条数据，用于合并单元格
              ...item,
              ...ele,
              [prop]: [],
            };
          });
        } else {
          item.commonId = item.id;
        }
      });

      return data;
    },
    // 处理表格数据和计算需要合并的单元格
    getSpanData(data) {
      this.spanData = [];
      this.pos = 0;

      let arr = data;

      if (["下单数量", "待审批下单"].includes(this.dialogTitle)) {
        const newData = this.dealTableData(data, "orderProjectList");
        arr = this.deconstructionTree(newData, "orderProjectList");
        this.getSpanId(arr, "orderId");
      } else {
        // 其他情况
        const newData = this.dealTableData(data);
        arr = this.deconstructionTree(newData);
        // 计算需要合并的行
        this.getSpanId(arr, "commonId");
      }

      return arr;
    },
    // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.mergeRow.includes(column.label) || column.type === "selection") {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    detailClose() {
      this.detailParams = null;
      this.tableApiFn = null;
    },

    // 获取协同点击后表格详情数据列表
    getDetail(label) {
      const { type } = this.xtQuery;
      let fn = null;
      const sendData = {
        reportType: type,
        pageNum: 1,
        pageSize: 10,
      };

      if (label === "下单数量") {
        // 协同下单数量列表
        fn = getSynergyOrderCountPageList;
        this.mergeRow = [
          "客户名称",
          "项目总价",
          "订单审批发起时间",
          "订单审批状态",
          "订单审批时间",
        ];
      } else if (label === "待审批下单") {
        // 协同工单数量
        this.mergeRow = [
          "客户名称",
          "项目总价",
          "订单审批发起时间",
          "订单审批状态",
          "订单审批时间",
        ];
        fn = getWaitSynergyOrderAuditPageList;
      } else {
        // 其他
        this.mergeRow = [
          "客户名称",
          "工单编号",
          "订单类型",
          "服务顾问（制）",
          "服务顾问（审）",
          "财务顾问",
          "应收金额",
          "已收金额",
        ];
        let typeString = this.getTypeString(label);
        sendData.typeString = typeString;
        fn = getOrderJobCountPageList;
      }

      this.detailParams = sendData;
      this.tableApiFn = fn;

      this.detailVisible = true;
    },

    // 获取点击详情数据
    handleDetail({ label, type, status }) {
      this.dialogTitle = label;
      this.showType = type;
      this.getDetail(label);
    },
    // 获取crm数据统计
    async getCrmReport() {
      const { type, timeType, date } = this.crmQuery;

      let sendData = {
        type,
        timeType,
        beginTime: date == null ? "" : date[0],
        endTime: date == null ? "" : date[1],
      };

      try {
        const res = await getDataReport(sendData);
        if (res.code === 200) {
          this.crmData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取协同数据统计
    async getOrderJobDataReport() {
      const { type } = this.xtQuery;
      const sendData = { reportType: type };
      try {
        const res = await getSynergyOrderJobDataReport(sendData);
        if (res.code === 200) {
          this.jobData = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    sortChange({ column, prop, order }) {
      if (order === null) {
        this.$set(this.parmas, "orderByColumn", null);
        this.$set(this.parmas, "isAsc", null);
        return;
      }
      const isAsc = order === "descending" ? "desc" : "asc";
      this.$set(this.parmas, "orderByColumn", prop);
      this.$set(this.parmas, "isAsc", isAsc);
    },

    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.briefingOptions.Ranking));

      list({ pageName: "ranking" }).then((res) => {
        if (res.rows && res.rows.length) {
          let data = res.rows.map((item) => ({
            key: item.tableColumnKey,
            label: item.label,
            minWidth: item.minWidth,
            prop: item.prop,
            visible: item.visible,
            showOverflow: item.showOverFlow,
            sortable: item.sortable,
          }));

          let arr = data.filter((item) => item.visible);

          let result = columns.filter((item) => {
            item.visible = false;
            return !arr.find((obj) => {
              return obj.key === item.key;
            });
          });

          this.rankingOptions = [...arr, ...result];
        } else {
          this.rankingOptions = columns;
        }
      });
    },
  },
  mounted() {
    store.dispatch("commonData/getUserList");
  },
  computed: {
    ...mapState(["user"]),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // vm.$refs.rankingRef.getTableData();
      console.log(vm.$refs.rankingRef);
      vm.getCloumns();
    });
  },
};
</script>

<style lang='scss' scoped>
.ranking {
  margin: 15px 0;
  ::v-deep .el-card__body {
    padding: 20px 15px 10px;
  }
}
.briefing-container {
  display: grid;

  grid-template-columns: repeat(2, 50%);

  grid-column-gap: 15px;
  grid-row-gap: 15px;
}
.quickly-aside {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: 999;
  box-shadow: -2px 2px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}
.ai {
  position: fixed;
  right: 0;
  bottom: 25px;
  width: 68px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 10px;
  background: #fff;

  cursor: pointer;
  font-size: 12px;

  border-radius: 8px;
  box-shadow: -2px 2px 20px rgba(0, 0, 0, 0.3);
  z-index: 999;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    margin-top: 10px;
    letter-spacing: 0.5px;
  }
}

.messageAndreport {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
}
.reportShow {
  grid-template-columns: 1fr;
}

@media (max-width: 1460px) {
  .briefing-container {
    display: grid;

    grid-template-columns: 1fr;
    grid-column-gap: 15px;
  }
}
</style>