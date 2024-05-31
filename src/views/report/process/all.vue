<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="" prop="param">
          <el-select v-model="queryParams.param">
            <el-option label="跟进次数" :value="1" />
            <el-option label="跟进商机数" :value="2" />
            <el-option label="成交订单" :value="3" />
            <el-option label="成交金额" :value="4" />
            <el-option label="成交产品总数" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label=" " prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择">
            <el-option label="按月统计" :value="1" />
            <!-- <el-option label="按周统计" :value="2" /> -->
            <el-option label="按日统计" :value="2" />
            <el-option label="按年统计" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="deptId">
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 400px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item label="" prop="userId">
          <el-select
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            clearable
            placeholder="请输入关键字搜索用户"
            remote
            :remote-method="getUserList"
            @focus="getUserList($event, true)"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
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
        <all class="chart-box" :initData="echartData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import all from "../components/all.vue";
import { getDataByParam } from "@/api/report/index";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "ProcessAll",
  components: {
    all,
    Treeselect,
  },
  data() {
    return {
      firstOpen: true,
      deptOptions: [],
      userList: [],
      echartData: [],
      queryParams: {
        param: 1,
        deptId: 200,
        userId: "",
        type: 1,
      },
    };
  },
  watch: {
    firstOpen: {
      handler(n) {
        if (n) {
          this.queryParams.deptId = this.$store.state.user.subjectDeptId || 100;
          this.firstOpen = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getDataByParam();
    this.getTreeselect();
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.getDataByParam();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getDataByParam();
      this.firstOpen = true;
    },

    // chart 数据
    getDataByParam() {
      getDataByParam(this.queryParams).then((res) => {
        let arr1 = [];
        let arr2 = [];
        let typeArr = [
          "跟进次数",
          "跟进商机数",
          "成交订单",
          "成交金额",
          "成交产品总数",
        ];
        let arr3 = typeArr[this.queryParams.param - 1];

        res.data.forEach((item) => {
          arr1.push(item.x);
          arr2.push(this.queryParams.param == 4 ? item.money : item.num);
        });
        this.echartData = [arr1, arr2, arr3];
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
</style>
