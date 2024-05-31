<template>
  <div class="app-container loading-box">
    <!-- v-loading="loading"
    element-loading-customClass="loader"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" -->
    <div class="loading-mask" v-if="loading">
      <div class="loader"></div>
      <span>拼命加载中</span>
    </div>
    <el-card class="box-card">
      <el-form
        size="small"
        inline
        ref="form"
        :model="queryParams"
        label-width="80px"
      >
        <template>
          <el-form-item label="" prop="timeType">
            <el-select v-model="queryParams.timeType" @change="toggleDateType">
              <el-option label="按年统计" :value="1" />
              <el-option label="按月统计" :value="2" />
              <!-- <el-option label="按周统计" :value="4" /> -->
              <el-option label="按日统计" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="beginTime">
            <el-date-picker
              v-if="queryParams.timeType == 1"
              v-model="queryParams.beginTime"
              value-format="yyyy"
              type="year"
              placeholder="开始年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
            <el-date-picker
              v-if="queryParams.timeType == 2 || queryParams.timeType == 3"
              v-model="dateMonth"
              :type="pickerType"
              :value-format="valueFormat"
              range-separator="至"
              :start-placeholder="
                queryParams.timeType === 2 ? '开始月份' : '开始日期'
              "
              :end-placeholder="
                queryParams.timeType === 2 ? '结束月份' : '结束日期'
              "
              :editable="false"
              :clearable="false"
            />
          </el-form-item>

          <el-form-item label="" prop="endTime">
            <el-date-picker
              v-if="queryParams.timeType == 1"
              v-model="queryParams.endTime"
              type="year"
              value-format="yyyy"
              placeholder="结束年份"
              :editable="false"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
        </template>
        <el-form-item label="" prop="deptIds">
          <!-- 个人是没有部门选择 -->
          <div class="vueTreeSelectSmall">
            <treeselect
              v-model="queryParams.deptIds"
              :flat="true"
              appendToBody
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              placeholder="请选择归属部门"
              clearable
              :disabled="isUserRole"
            />
          </div>
        </el-form-item>
        <el-form-item label="" prop="userId">
          <el-select
            style="width: 100%"
            v-model="queryParams.userId"
            filterable
            placeholder="请输入关键字搜索用户"
            remote
            clearable
          >
            <!-- 个人用户不能看其他人员 -->
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="queryDisable" type="primary" @click="handleQuery"
            >查询</el-button
          >
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt-15">
      <avue-crud
        :data="dataList"
        :option="option"
        :page.sync="page"
        :span-method="spanMethod"
        :summary-method="summaryMethod"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="menuLeft">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            plain
            @click="handleExport"
            >导出</el-button
          >
        </template>
      </avue-crud>
    </el-card>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { userAndDept } from "../../customer/mixins/userAnddept";
// 接口
import { customerDealList } from "@/api/newreport/person";

import { mapState } from "vuex";
export default {
  // name: "PersonTransaction",
  mixins: [userAndDept],
  components: { Treeselect },
  data() {
    return {
      dateMonth: "",
      option: {
        menu: false,
        stripe: true,
        headerAlign: "center",
        align: "center",
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        showSummary: true,

        column: [
          {
            label: "排名",
            prop: "ranking",
            width: 55,
            fixed: true,
          },
          {
            label: "日期",
            prop: "date",
            width: 120,
            fixed: true,
          },
          {
            label: "姓名",
            prop: "userName",
            width: 100,
            fixed: true,
          },
          {
            label: "转介绍数据单位（个）",
            children: [
              {
                label: "转介绍企业",
                prop: "refCompanyType",
                width: 120,
              },
              {
                label: "转介绍个人",
                prop: "refPersonalType",
                width: 120,
              },
            ],
          },
          {
            label: "成交客户数量单位（个）",
            children: [
              {
                label: "企业复购",
                prop: "companyRepurchase",
                width: 120,
              },

              {
                label: "转介绍成交企业",
                prop: "refCompanyTypeDeal",
                width: 120,
              },

              {
                label: "转介绍成交个人",
                prop: "refPersonalTypeDeal",
                width: 120,
              },

              {
                label: "自主开发企业",
                prop: "companyTypeDeal",
                width: 120,
              },

              {
                label: "自主开发个人",
                prop: "personalTypeDeal",
                width: 120,
              },

              {
                label: "合计成交客户数",
                prop: "totalDealCount",
                width: 120,
              },
            ],
          },
          {
            label: "成交订单数量单位（个）",
            children: [
              {
                label: "企业复购",
                prop: "companyRepurchaseOrder",
                width: 120,
              },
              {
                label: "转介绍成交企业",
                prop: "refCompanyTypeDealOrder",
                width: 120,
              },
              {
                label: "转介绍成交个人",
                prop: "refPersonalTypeDealOrder",
                width: 120,
              },
              {
                label: "自主开发企业",
                prop: "companyTypeDealOrder",
                width: 120,
              },
              {
                label: "自主开发个人",
                prop: "personalTypeDealOrder",
                width: 120,
              },
              {
                label: "渠道部客户",
                prop: "channelTypeDealOrder",
                width: 120,
              },
              {
                label: "合计成交订单数",
                prop: "totalDealOrderCount",
                width: 120,
              },
            ],
          },
        ],
      },
      dataList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        deptIds: [],
        userId: undefined,
      },

      queryParams: {
        timeType: 1,
        beginTime: "",
        endTime: "",
        userId: undefined,
      },
      loading: false,

      // 合并
      spanData: [],
      pos: 0,
      // 排名
      rowIndex: 1,

      // 合并的条数
      spanNum: 1,

      sumColumn: [
        "refCompanyType",
        "refPersonalType",
        // 客户数量合计prop
        "companyRepurchase",
        "refCompanyTypeDeal",
        "refPersonalTypeDeal",
        "companyTypeDeal",
        "personalTypeDeal",
        "totalDealCount",
        // 订单数量合计prop
        "companyRepurchaseOrder",
        "refCompanyTypeDealOrder",
        "refPersonalTypeDealOrder",
        "companyTypeDealOrder",
        "personalTypeDealOrder",
        "channelTypeDealOrder",
        "totalDealOrderCount",
      ],

      queryDisable: false,
      timer: null, //防止双击造成排名错
    };
  },
  methods: {
    // 处理时间
    dealDate(type) {
      let date = new Date();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;
      let currentDay = date.getDate();
      let nowDate = "";
      if (type === "month") {
        nowDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;
      } else if (type === "day") {
        nowDate = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;
      }
      return nowDate;
    },
    toggleDateType(val) {
      if (val == 1) {
        this._getNowYear(this.queryParams, "beginTime", "endTime");
      } else if (val == 2) {
        // 月
        let nowDate = this.dealDate("month");
        this.dateMonth = [nowDate, nowDate];
      } else if (val === 3) {
        let nowDate = this.dealDate("day");
        this.dateMonth = [nowDate, nowDate];
      }
    },
    createQuery() {
      this._getNowYear(this.queryParams, "beginTime", "endTime");
      this.queryParams.deptIds = this.defaultDeptIds;
    },
    handleQuery() {
      if (!this.queryParams.deptIds.length)
        return this.$message.error("请选择一个部门，部门不能为空");
      // 防止双击，造成排名错乱
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.queryDisable = true;
        this.page.currentPage = 1;
        this.rowIndex = 1;
        // 合并的条数
        this.mergeNum();
        this.getList();
      }, 500);
    },
    // 切换页码
    sizeChange() {
      this.page.currentPage = 1;
      this.rowIndex = 1;
      this.getList();
    },
    currentChange(current) {
      let pageSize = this.page.pageSize;
      const num = pageSize / this.spanNum;

      // 排序对this.rowIndex进行赋值
      if (this.spanNum % 2 === 0) {
        this.rowIndex = Math.floor(num * (current - 1) + 1);
        console.log(this.rowIndex);
      } else {
        const num1 = pageSize % this.spanNum;
        if (num1) {
          this.rowIndex = Math.floor(num * (current - 1) + 1);
        } else {
          this.rowIndex = num * (current - 1) + 1;
        }
      }

      this.getList();
    },
    // 重置
    handleReset() {
      this.queryParams.timeType = 1;
      this._getNowYear(this.queryParams, "beginTime", "endTime");
      this.queryParams.deptIds = this.defaultDeptIds;
      this.queryParams.userId = undefined;
      this.rowIndex = 1;
      this.page.currentPage = 1;
      // 合并的条数
      this.mergeNum();
      this.getList();
    },
    async getList() {
      console.log(this.rowIndex);
      this.loading = true;
      let sendParams = {
        ...this.queryParams,
        deptIds: this.queryParams.deptIds.join(","),
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage,
      };
      // console.log(sendParams);
      try {
        const res = await customerDealList(sendParams);
        if (res.code === 200) {
          this.dataList = res.rows;
          this.page.total = res.total;

          this.getSpanId();

          this.loading = false;
        }
        this.queryDisable = false;
      } catch (error) {
        this.queryDisable = false;
        this.loading = false;
      }
    },

    // 根据订单id判断需要合并的行
    getSpanId(flag = true) {
      this.spanData = [];
      this.pos = 0;

      for (let index = 0; index < this.dataList.length; index++) {
        // 判断下一页第一和未切换前当前页最后数据是否相同

        if (index === 0) {
          this.spanData.push(1);
          this.pos = 0;
          // 添加排名
          this.dataList[index].ranking = this.rowIndex;
          this.rowIndex++;
        } else {
          if (this.dataList[index].userId === this.dataList[index - 1].userId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = index;
            // 添加排名

            this.dataList[index].ranking = this.rowIndex;
            this.rowIndex++;
          }
        }
      }
    },

    spanMethod({ row, column, rowIndex, columnIndex }) {
      let obj = ["排名", "姓名"];
      if (obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },

    /** 导出按钮操作 */
    handleExport() {
      let sendParams = {
        ...this.queryParams,
        deptIds: this.queryParams.deptIds.join(","),
      };
      this.download(
        "/zw/customerDeal/export",
        {
          ...sendParams,
        },
        `个人客户成交_${new Date().getTime()}.xlsx`
      );
    },

    // 合并的条数
    mergeNum() {
      const { timeType, beginTime, endTime } = this.queryParams;
      let num = 1;
      if (timeType === 1) {
        num = Math.abs(endTime - beginTime) + 1;
      } else if (timeType === 2) {
        let dt1 = beginTime.split("-");
        let dt2 = endTime.split("-");
        dt1 = parseInt(dt1[0]) * 12 + parseInt(dt1[1]);
        dt2 = parseInt(dt2[0]) * 12 + parseInt(dt2[1]);
        num = Math.abs(dt2 - dt1) + 1;
      } else if (timeType === 3) {
        let dt1 = new Date(beginTime);
        let dt2 = new Date(endTime);
        let difference = Math.abs(dt2.getTime() - dt1.getTime());
        num = difference / (1000 * 3600 * 24) + 1;
      }
      this.spanNum = num;
    },

    summaryMethod({ columns, data }) {
      const sums = [];
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "总计";
            // column.colSpan = 3;
          } else if ([1, 2].includes(index)) {
            // column.colSpan = 0;
            sums[index] = "";
          } else {
            let prop = column.property;
            let i = index;
            if (this.sumColumn.includes(prop)) {
              let values = data.map((item) => Number(item[prop] || 0));
              let all =
                values.length !== 0
                  ? (sums[i] = values.reduce((a, b) => {
                      return a + b;
                    }))
                  : 0;
              sums[i] = all.toFixed(2);
            } else {
              sums[i] = "--";
            }
          }
        });
      }
      return sums;
    },

    // 缓存数据回显
    keepAlive() {
      const { list, params, total } = this.transaction;
      const {
        pageSize,
        pageNum,
        timeType,
        deptIds,
        beginTime,
        endTime,
        userId,
      } = params;
      this.dataList = list;
      this.page = {
        total,
        pageSize: pageSize,
        currentPage: pageNum,
      };

      this.queryParams = {
        timeType,
        beginTime,
        endTime,
        deptIds,
        userId,
      };
      if (timeType == 1) {
        this._getNowYear(this.queryParams, "beginTime", "endTime");
      } else if (timeType == 2 || timeType == 2) {
        this.dateMonth = [beginTime, endTime];
      }
      this.rowIndex = this.dataList[0].ranking;
      this.mergeNum();
      this.getSpanId();
      // 重置
      this.$store.commit("SET_DATA", { params: null, list: null, total: 0 });
    },
  },
  mounted() {
    console.log(this.transaction);
    this.createQuery();

    if (this.transaction.params && this.transaction.list) {
      this.keepAlive();
    } else {
      this.mergeNum();
      this.getList();
    }

    // 表格fixed 影响合计合列
    this.$nextTick(() => {
      let tds = document.querySelectorAll(
        ".el-table__fixed .el-table__fixed-footer-wrapper .el-table__footer tr>td"
      );

      tds.forEach((item, index) => {
        if (index === 0) {
          item.colSpan = 3;
          item.style.textAlign = "center";
        } else if (index === 1 || index === 2) {
          item.style.display = "none";
        } else {
        }
      });
    });
  },
  computed: {
    pickerType() {
      const { timeType } = this.queryParams;
      if (timeType === 2) {
        return "monthrange";
      } else if (timeType === 3) {
        return "daterange";
      }
    },
    valueFormat() {
      const { timeType } = this.queryParams;
      if (timeType === 2) {
        return "yyyy-MM";
      } else if (timeType === 3) {
        return "yyyy-MM-dd";
      }
    },

    ...mapState({
      transaction: (state) => state.setData.transaction,
    }),
  },
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },
  },
  beforeDestroy() {
    this.$store.commit("SET_DATA", {
      params: {
        ...this.queryParams,
        pageSize: this.page.pageSize,
        pageNum: this.page.currentPage,
      },
      data: this.dataList,
      total: this.page.total,
    });
  },
};
</script>

<style lang="scss" scoped>
.mt-15 {
  margin-top: 15px;
}
</style>
