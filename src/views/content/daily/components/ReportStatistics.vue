// 统计报告模块
<template>
  <div>
    <avue-form
      :option="searchOptions"
      v-model="queryParams"
      @submit="handleQuery"
      @reset-change="handleReset"
    ></avue-form>
    <avue-crud
      ref="crud"
      v-loading="loading"
      :data="reportData"
      :option="option"
      :page.sync="pager"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="menuLeft">
        <el-radio-group v-model="dailyType" @input="toggleType">
          <el-radio-button :label="1">日报</el-radio-button>
          <el-radio-button :label="2">周报</el-radio-button>
          <el-radio-button :label="3">月报</el-radio-button>
        </el-radio-group>

        <div class="title-time">{{ reportTime }}</div>
        <div class="emry"></div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getDailyList } from "@/api/content/daily.js";
import { systemUserListForSelect } from "@/api/system/user";
import { reportCrud, weekArr, monthArr } from "../config";

import cloneDeep from "lodash/cloneDeep";
import { mapState } from "vuex";
export default {
  name: "ReportStatistics",
  data() {
    return {
      loading: false,
      reportData: [],
      option: reportCrud,
      pager: {
        total: 1000,
        currentPage: 1,
        pageSize: 10,
      },
      // 筛选条件
      queryParams: { commitUserId: null, deptId: null },
      searchOptions: {},

      dailyType: 1,

      // 是否更新表格配置
      isUpdateOptions: false,

      reportTime: "",
    };
  },
  methods: {
    setSeachOption() {
      this.searchOptions = {
        menuSpan: 6,
        filterDic: true,
        filterNull: true,
        submitText: "查询",
        emptyText: "重置",
        submitIcon: "el-icon-search",
        emptyIcon: "el-icon-refresh",
        menuPosition: "left",
        column: [
          {
            label: "提交部门",
            prop: "deptId",
            type: "tree",
            dicData: this.user.treeList,

            props: {
              label: "label",
              value: "id",
              children: "children",
            },
            display: !!(this.user.treeList && this.user.treeList.length),
            span: 6,
            change: ({ value, column }) => {
              this.getUserList(value);
            },
          },
          {
            label: "提交人员",
            prop: "commitUserId",
            type: "select",
            dicData: this.commonData.userList,

            filterable: true,
            disabled: !this.user.defaultDeptId,
            span: 6,
          },
          {
            label: "提交时间",
            prop: "dailyTime",
            type: "datetime",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            span: 6,
          },
        ],
      };
    },
    // 处理时间格式
    dealDate(date, type) {
      let dealDate = new Date(date);
      let month = dealDate.getMonth() + 1;
      let day = dealDate.getDate();
      if (type === "day") {
        return `${month.toString().padStart(2, "0")}/${day
          .toString()
          .padStart(2, "0")}`;
      } else if (type === "week") {
        return `${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      }
    },
    // 表格配置信息
    setOptions(options) {
      if (!this.isUpdateOptions) return;
      let newOptions = [];
      if (options) {
        options.forEach((ele, index) => {
          let obj = {
            label: "",
            prop: `day${index + 1}`,
            html: true,
            formatter: (val, value, label) => {
              return `<span class='${value === 0 ? "notColor" : "endColor"}'>${
                ["未提交", "已提交"][value]
              }</span>`;
            },
          };
          if (this.dailyType === 1) {
            obj.label = `${weekArr[index]} ${this.dealDate(ele.date, "day")}`;
          } else if (this.dailyType === 2) {
            let date = ele.date.split("~");
            obj.label = `${this.dealDate(date[0], "week")} ~ ${this.dealDate(
              date[1],
              "week"
            )}`;
          } else if (this.dailyType === 3) {
            obj.label = monthArr[index];
          }
          newOptions.push(obj);
        });
      }

      this.option.column = [
        {
          label: "姓名",
          prop: "userName",
        },
        ...newOptions,
        {
          label: "完成率",
          prop: "percent",
        },
      ];

      // 重置
      this.isUpdateOptions = false;
      // 解决AVue表格错位问题
      this.$refs.crud.refreshTable();
    },

    // 切换类型
    toggleType() {
      this.isUpdateOptions = true;
      this.getReportTime();
      this.getList();
    },
    handleQuery(form, done) {
      this.isUpdateOptions = true;
      this.getList();
      this.getReportTime();
      done();
    },
    sizeChange(size) {
      this.pager.pageSize = size;
      this.getList();
    },
    currentChange(current) {
      this.pager.currentPage = current;
      this.getList();
    },
    handleReset() {
      this.isUpdateOptions = true;
      if (this.user.defaultDeptId) {
        this.queryParams.deptId = this.user.defaultDeptId;
        this.queryParams.commitUserId = null;
      } else {
        this.queryParams.deptId = null;
        this.queryParams.commitUserId = this.user.defaultUserId;
      }
      this.getReportTime();
      this.getList();
    },
    getList() {
      this.loading = true;

      const { currentPage, pageSize } = this.pager;
      let sendParams = {
        commitUserId: this.user.defaultDeptId ? null : this.user.defaultUserId,
        deptId: this.user.defaultDeptId,
        ...this.queryParams,
        pageNum: currentPage,
        pageSize,

        dailyType: this.dailyType,
      };

      getDailyList(sendParams).then((res) => {
        if (res.code === 200) {
          if (res.rows && res.rows.length) {
            res.rows.forEach((item) => {
              if (item.userCommitRecord && item.userCommitRecord.length) {
                item.userCommitRecord.forEach((ele, index) => {
                  item[`day${index + 1}`] = ele.isCommit === "未提交" ? 0 : 1;
                });
              }
            });

            this.setOptions(res.rows[0].userCommitRecord);
          }
          this.reportData = res.rows;
          this.pager.total = res.total;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },

    // 获取当前是本年第几周
    getYearWeek(endDate) {
      //本年的第一天
      const beginDate = new Date(endDate.getFullYear(), 0, 1);
      //星期从0-6,0代表星期天，6代表星期六
      let endWeek = endDate.getDay();
      if (endWeek == 0) endWeek = 7;
      let beginWeek = beginDate.getDay();
      if (beginWeek == 0) beginWeek = 7;
      //计算两个日期的天数差
      const millisDiff = endDate.getTime() - beginDate.getTime();
      const dayDiff = Math.floor(
        (millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000
      );
      return Math.ceil(dayDiff / 7) + 1;
    },

    // 获取当前时间
    getReportTime() {
      const { dailyTime } = this.queryParams;
      let str = "";
      let date = dailyTime ? new Date(dailyTime) : new Date();

      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (this.dailyType === 3) {
        // 月报
        this.reportTime = year + "年";
      } else if (this.dailyType === 2) {
        // 周报
        this.reportTime = `${year}年${month.toString().padStart(2, "0")}月`;
      } else if (this.dailyType === 1) {
        // 日报
        const week = this.getYearWeek(date);
        this.reportTime = `${year}年第${week.toString().padStart(2, "0")}周`;
      }
    },

    // 获取用户列表数据
    getUserList(deptId) {
      systemUserListForSelect({ deptIdsString: deptId }).then((res) => {
        if (res.code === 200) {
          const { column } = this.searchOptions;
          const data = res.rows.map((item) => {
            return {
              label: item.userName,
              value: item.userId,
            };
          });

          const row = column.find((item) => item.prop === "commitUserId");

          row && (row.dicData = data);
        }
      });
    },
  },
  mounted() {
    this.isUpdateOptions = true;

    if (this.user.defaultDeptId) {
      this.queryParams.deptId = this.user.defaultDeptId;
      this.queryParams.commitUserId = null;
    } else {
      this.queryParams.deptId = null;
      this.queryParams.commitUserId = this.user.defaultUserId;
    }
    this.setSeachOption();
    this.getReportTime();
    this.getList();
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
.avue-form {
  margin-bottom: 20px;
}
::v-deep .avue-crud__left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .emry {
    width: 12%;
  }
}
::v-deep .avue-crud .el-table__row {
  .cell {
    .notColor {
      color: #f56c6c;
    }
    .endColor {
      color: #67c23a;
    }
  }
}
::v-deep .el-form-item__content {
  margin-right: 15px;
}
</style>