// 1.订单需求货源匹配表
<template>
  <div class="app-container">
    <!-- 筛选表单 -->
    <avue-form
      :option="searchOptions"
      v-model="queryForm"
      @submit="handleQuery"
      @reset-change="handleReset"
    >
    </avue-form>

    <!-- 表格 -->
    <MultiTable
      ref="tableRef"
      :parmas="queryParams"
      :api="apiFn"
      :Options="tableOptions"
      isPagination
      border
      align="center"
      @setupEvents="setupEvents"
    >
      <template #actions>
        <el-row>
          <el-col>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['core:sourceMatching:addMarkets']"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </template>
    </MultiTable>
  </div>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";

// 接口api
import { sourceMatchingList } from "@/api/core/orderNeed";

import { systemUserListForSelect } from "@/api/system/user";

// 表格配置信息
import { Options, search } from "./Options";
import { cloneDeep } from "lodash";
export default {
  components: { MultiTable },

  data() {
    return {
      apiFn: sourceMatchingList,
      tableOptions: Options,

      queryForm: {},
      searchOptions: search,
      queryParams: null, //筛选参数
    };
  },
  methods: {
    // 处理筛选时间
    dealFiterTime(dealTime) {
      this.queryParams = cloneDeep(this.queryForm);
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      dealTime.forEach((item) => {
        if (this.queryForm[item] && this.queryForm[item].length) {
          this.queryParams[`${item}Start`] = this.queryForm[item][0];
          this.queryParams[`${item}End`] = this.queryForm[item][1];
        } else {
          this.queryParams[`${item}Start`] = null;
          this.queryParams[`${item}End`] = null;
        }
        delete this.queryParams[item];
      });
    },

    handleQuery(form, done) {
      this.dealFiterTime([
        "orderDay",
        "channelFeedbackDate",
        "marketYesFeedbackDate",
        "marketFinallyResultFeedbackDate",
      ]);

      //   this.$refs.tableRef.getTableData();
      done();
    },

    handleReset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };

      // this.$refs.tableRef.getTableData();
    },

    // 市场新增
    handleAdd() {
      this.$router.push({ name: "OrderNeed/add" });
    },

    setupEvents({ row, type }) {
      console.log(row, type);
      if (type === "edit") {
        // 编辑
        this.$router.push({
          name: "OrderNeed/add",
          query: { type: 2, id: row.id },
        });
      } else if (type === "channel") {
        // 反馈
        this.$router.push({
          name: "OrderNeed/add",
          query: { type: 3, id: row.id },
        });
      }
    },

    // 获取渠道部和领跑咨询的全体人员
    async getUserList() {
      let sendData = {
        deptIdsString: "1555082687581421570,1643056146109161474",
      };
      const res = await systemUserListForSelect(sendData);
      if (res.code === 200) {
        sessionStorage.setItem("NEEDUSERLIST", JSON.stringify(res.rows));
      }
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang='scss' scoped>
</style>