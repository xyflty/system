<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-select v-model="queryParams.rankType">
          <el-option label="个人" :value="1" />
          <el-option label="部门" :value="2" />
        </el-select>

        <!-- <el-form-item
          label=""
          prop="dateMonth"
        >
          <el-date-picker
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="" prop="dateMonth" style="margin-left: 10px">
          <el-date-picker
            v-model="dateMonth"
            type="monthrange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" prop="deptIds">
          <treeselect
            v-model="queryParams.deptIds"
            appendToBody
            :multiple="true"
            style="margin-left: 10px; max-width: 400px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div>
        <analyse class="chart-box" :initData="echartData" />
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span
            >线索数量：
            <span class="ableClick">{{ totalInfo.clueCountNum }}</span>
          </span>
          <span
            >商机数量：
            <span class="ableClick">{{ totalInfo.opportunityCountNum }}</span>
          </span>
          <span
            >订单数量：
            <span class="ableClick">{{ totalInfo.orderCountNum }}</span>
          </span>
          <span
            >客户数量：
            <span class="ableClick">{{ totalInfo.customerCountNum }}</span>
          </span>
          <span
            >线索跟进数量：
            <span class="ableClick">{{ totalInfo.clueFollowUpNum }}</span>
          </span>
          <!-- <span
            >挖需跟进数量：
            <span class="ableClick">{{ totalInfo.demandFollowUpNum }}</span>
          </span> -->
          <span
            >商机跟进数量：
            <span class="ableClick">{{
              totalInfo.opportunityFollowUpNum
            }}</span>
          </span>
          <span
            >订单跟进数量：
            <span class="ableClick">{{ totalInfo.orderFollowUpNum }}</span>
          </span>
          <span
            >客户跟进数量：
            <span class="ableClick">{{ totalInfo.customerFollowUpNum }}</span>
          </span>
          <span
            >订单总价格：
            <span class="ableClick">{{ totalInfo.orderPriceNum }}</span>
          </span>
        </div>
        <!-- <el-button plain>导出</el-button> -->
      </div>
      <div>
        <el-table :data="list" stripe style="width: 100%" border>
          <el-table-column
            v-if="queryParams.rankType == 2"
            prop="deptName"
            label="部门名称"
            align="center"
          />
          <el-table-column
            v-if="queryParams.rankType == 1"
            prop="userName"
            label="员工姓名"
            align="center"
          />
          <el-table-column prop="clueCount" label="线索数量" align="center" />

          <!-- <el-table-column align="center" prop="demandNum" label="挖需数量" /> -->

          <el-table-column
            align="center"
            prop="opportunityCount"
            label="商机数量"
          />

          <el-table-column align="center" prop="orderCount" label="订单数量" />

          <el-table-column
            align="center"
            prop="customerCount"
            label="客户数量"
          />
          <el-table-column
            prop="clueFollowUpNum"
            label="线索跟进数量"
            align="center"
          />
          <!-- <el-table-column
            align="center"
            prop="demandFollowUpNum"
            label="挖需跟进数量"
          /> -->
          <el-table-column
            align="center"
            prop="opportunityFollowUpNum"
            label="商机跟进数量"
          />
          <el-table-column
            align="center"
            prop="orderFollowUpNum"
            label="订单跟进数量"
          />
          <el-table-column
            align="center"
            prop="customerFollowUpNum"
            label="客户跟进数量"
          />
          <el-table-column
            align="center"
            prop="orderPrice"
            label="订单总价格"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import analyse from "../components/analyse.vue";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { getSalesChart, getSalesList } from "@/api/report/index";

export default {
  components: {
    analyse,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      loading: false,
      dateMonth: [],
      deptOptions: [],

      echartData: [],
      list: [],
      queryParams: {
        beginTime: "",
        endTime: "",
        deptIds: [],
        rankType: 1,
      },

      list: [],
      total: 0, // 统共页数，默认为1
      pageNum: 1, //当前页数 ，默认为1
      pageSize: 10, // 每页显示数量

      totalInfo: "",
    };
  },
  created() {
    this.getTreeselect();
  },
  watch: {
    dateMonth: {
      handler(n) {
        console.log(n);
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },

    firstOpen: {
      handler(n) {
        if (n) {
          this.queryParams.deptIds = [this.$store.state.user.subjectDeptId] || [
            "100",
          ];
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
        // let list = this.findItemById(response.data, 200);
        // let leafList = [];
        // this.getTreeLeaf(list, leafList);

        // this.queryParams.deptIds = leafList.map((item) => item.id);
        this.getList();
        this.getSalesChart();
      });
    },

    getTreeLeaf(treeData, leafList) {
      // 判断是否为数组
      if (Array.isArray(treeData)) {
        treeData.forEach((item) => {
          if (item.children && item.children.length > 0) {
            this.getTreeLeaf(item.children, leafList);
          } else {
            leafList.push(item);
          }
        });
      } else {
        if (treeData.children && treeData.children.length > 0) {
          this.getTreeLeaf(treeData.children, leafList);
        } else {
          leafList.push(treeData);
        }
      }
    },

    findItemById(list, id) {
      if (id == undefined) {
        return list;
      }

      // 每次进来使用find遍历一次
      let res = list.find((item) => item.id == id);
      if (res) {
        return res.children;
      } else {
        for (let i = 0; i < list.length; i++) {
          if (
            list[i].children instanceof Array &&
            list[i].children.length > 0
          ) {
            res = this.findItemById(list[i].children, id);
            if (res) return res;
          }
        }
        return null;
      }
    },

    parseTreeJson(array) {
      let nodes = [];
      let nodeIds = [];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        // 1.判断element.children是对象
        if (element.children && typeof element.children == "array") {
          this.parseTreeJson(element.children);
        } else {
          // 判断是否为子节点
          if (element.children == undefined) {
            console.log(element.des + "的id:" + element.id);
            // 获得符合的 node
            nodes.push(element);
            // 获得符合的 nodeId
            nodeIds.push(element.id);
          }
        }
      }

      console.log(nodes);
      console.log(nodeIds);
    },

    getList() {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.deptIds = params.deptIds.join(",");
      params.pageNum = this.pageNum;
      params.pageSize = this.pageSize;
      getSalesList(params).then((res) => {
        this.totalInfo = res.data;
        this.list = res.data.salesPerformanceVoPage.records;
        this.total = res.data.salesPerformanceVoPage.total;
      });
    },

    getSalesChart() {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.deptIds = params.deptIds.join(",");
      getSalesChart(params).then((res) => {
        const {
          clueCount,

          opportunityCount,
          orderCount,
          customerCount,

          clueFollowUpNum,
          demandFollowUpNum,
          opportunityFollowUpNum,
          orderFollowUpNum,
          customerFollowUpNum,
          orderPrice,
          xdeptName,
          xuserName,
        } = res.data;
        this.echartData = [
          clueCount,
          opportunityCount,
          orderCount,
          customerCount,
          clueFollowUpNum,
          demandFollowUpNum,
          opportunityFollowUpNum,
          orderFollowUpNum,
          customerFollowUpNum,
          orderPrice,
          this.queryParams.rankType == 1 ? xuserName : xdeptName,
          this.queryParams.rankType,
        ];
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
      this.getSalesChart();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.pageNum = 1;
      this.queryParams = {
        beginTime: "",
        endTime: "",
        deptIds: [],
        rankType: 1,
      };
      this.firstOpen = true;
      this.dateMonth = null;
      setTimeout(() => {
        this.getList();
        this.getSalesChart();
      });
    },
  },
};
</script>

<style scoped>
.echart-box {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 20px 100px;
}

.msg_title {
  position: relative;
  padding-right: 20px;
  cursor: pointer;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select_title {
  font-weight: 600;
  color: #0079fe;
}
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
.msg-box2 span {
  margin-right: 15px;
}
</style>
