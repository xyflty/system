<template>
  <div class="app-container">
    <div class="go-box">
      <el-button
        class="go-button"
        icon="el-icon-back"
        type="primary"
        size="mini"
        @click="goBack"
        >返回</el-button
      >
    </div>

    <!-- 第一个 -->
    <el-card v-if="type == 2" style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 客户成交次数 </span>
        </div>
        <!-- <el-button plain>导出数据</el-button> -->
      </div>
      <el-table
        :data="list1"
        stripe
        style="width: 100%"
        border
        v-loading="loading1"
      >
        <el-table-column
          prop="customerName"
          label="客户名称"
          align="center"
          min-width="80"
        />

        <el-table-column
          sortable
          prop="customerGrade"
          label="客户等级"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{
              getLabel(commonData.customerGradeList, row.customerGrade)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTitle"
          label="客户订单名称"
          align="center"
          min-width="100"
        />
        <el-table-column
          sortable
          align="center"
          prop="dealPrice"
          label="成交金额"
        />
        <el-table-column
          sortable
          align="center"
          prop="notFollowUpDays"
          label="未跟进天数"
        />

        <el-table-column
          sortable
          align="center"
          prop="dealPrice"
          label="成交金额"
        />

        <el-table-column
          sortable
          align="center"
          prop="associatedProductCount"
          label="关联产品数"
          ><template slot-scope="{ row }">
            <span class="ableClick" @click="productCount(row)">{{
              row.associatedProductCount
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total1 > 0"
        :total="total1"
        :page.sync="query1.pageNum"
        :limit.sync="query1.pageSize"
        @pagination="getList1"
        :autoScroll="false"
      />
    </el-card>
    <el-card v-else style="margin-top: 20px">
      <div slot="header" class="header-box">
        <div class="msg-box2">
          <span> 转介绍客户 </span>
        </div>
        <!-- <el-button plain>导出数据</el-button> -->
      </div>
      <el-table
        :data="list1"
        stripe
        style="width: 100%"
        border
        v-loading="loading1"
      >
        <el-table-column
          prop="referralDealCustomer"
          label="转介绍成交客户"
          align="center"
          min-width="80"
        />

        <!-- <el-table-column prop="userName" label="客户行为" align="center" /> -->
        <el-table-column prop="customerGrade" label="客户等级" align="center">
          <template slot-scope="{ row }">
            <span>{{
              getLabel(commonData.customerGradeList, row.customerGrade)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTitle"
          label="客户订单"
          align="center"
          min-width="100"
        />
        <el-table-column
          sortable
          align="center"
          prop="dealPrice"
          label="成交金额"
        />
        <el-table-column
          sortable
          align="center"
          prop="dealTime"
          label="成交时间"
        />
        <el-table-column
          sortable
          align="center"
          prop="notFollowUpDays"
          label="未跟进天数"
        />

        <el-table-column
          sortable
          align="center"
          prop="dealPrice"
          label="成交金额"
        />

        <el-table-column
          align="center"
          prop="projectBigClassList"
          label="关联项目大类"
          min-width="130px"
        >
          <template slot-scope="{ row }">
            <div class="gridflex">
              <span
                v-for="(item, index) in row.projectBigClassList"
                :key="index"
                class="span"
                >{{ item }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="associatedProductCount"
          label="关联产品数"
          ><template slot-scope="{ row }">
            <span class="ableClick" @click="productCount(row)">{{
              row.associatedProductCount
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="owningCustomerName"
          label="归属客户名称"
        />
        <el-table-column align="center" prop="userName" label="归属业务员" />
      </el-table>
      <pagination
        v-show="total1 > 0"
        :total="total1"
        :page.sync="query1.pageNum"
        :limit.sync="query1.pageSize"
        @pagination="getList1"
        :autoScroll="false"
      />
    </el-card>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {
  jumpReferralCustomerList,
  customerDealCountList,
} from "@/api/newreport/customer";
import { mapState } from "vuex";

export default {
  name: "CustomerAnalyselist",
  components: { Treeselect },
  data() {
    return {
      options: {
        dialogVisible: false,
        userId: "",
        archiveId: "",
      },
      type: 1,
      deptId: 0,
      customerGrade: 1,
      dealType: 1,

      dateMonth: [],
      deptOptions: [],
      userList: [],

      queryParams: {
        deptId: undefined,
        userId: "",
      },

      query1: { pageNum: 1, pageSize: 10 },
      query2: { pageNum: 1, pageSize: 10 },
      query3: { pageNum: 1, pageSize: 10 },
      query4: { pageNum: 1, pageSize: 10 },
      query5: { pageNum: 1, pageSize: 10 },

      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,

      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],

      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  mounted() {
    this.getTreeselect();
    this.getUserList();

    const { type, ...query } = this.$route.query;
    this.type = type;
    this.archiveId = query.archiveId;
    this.deptId = query.deptId;
    this.queryParams = { ...query };

    this.init();
  },
  methods: {
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },

    init() {
      this.getList1();
    },

    getList1() {
      this.loading1 = true;
      if (this.type == 2) {
        customerDealCountList({ ...this.query2, ...this.queryParams }).then(
          (res) => {
            this.total1 = res.total;
            this.list1 = res.rows;
            this.loading1 = false;
          }
        );
      } else {
        jumpReferralCustomerList({ ...this.query2, ...this.queryParams }).then(
          (res) => {
            this.total1 = res.total;
            this.list1 = res.rows;
            this.loading1 = false;
          }
        );
      }
    },

    handleClick(row, type) {
      this.$router.push({
        name: "Rank/useranalyse",
        query: { type, deptId: row.deptId },
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.query1.pageNum = 1;
      this.query2.pageNum = 1;
      this.query3.pageNum = 1;
      this.query4.pageNum = 1;
      this.query5.pageNum = 1;
      this.init();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.deptId = this.deptId;
      this.init();
    },
    goBack() {
      this.$router.go(-1);
    },
    productCount(row) {
      this.$router.push({
        name: "RelevancyProduct",
        query: { userId: row.userId, archiveId: row.archiveId },
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
.chart-box {
  flex: 60%;
}
.table-box {
  flex: 40%;
}
.tip p {
  font-size: 12px;
  line-height: 24px;
  color: rgb(153, 153, 153);
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gridflex {
  display: flex;
  flex-wrap: wrap;
}
.span {
  background: #f57676;
  color: #fff;
  padding: 1px 3px;
  border-radius: 2px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.go-box {
  width: 100%;
  height: 40px;
}
.go-button {
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
