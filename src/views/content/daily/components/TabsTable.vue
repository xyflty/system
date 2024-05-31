<template>
  <div>
    <avue-form
      :option="searchOptions"
      v-model="queryParams"
      @submit="handleQuery"
      @reset-change="handleReset"
    ></avue-form>
    <MultiTable
      ref="crudRef"
      :data="tableData"
      :Options="options"
      :paginationAttrs="pager"
      :total="pager.total"
      align="center"
      isPagination
      border
      stripe
      :default-sort="{ prop: 'dailyTime', order: 'descending' }"
      @SizeChange="sizeChange"
      @CurrentChange="currentChange"
      @sort="handleSort"
    >
      <template #actions>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" v-if="active === '1'">
            <el-button
              :loading="visible"
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              v-hasPermi="['core:daily:add']"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini"
              >导出</el-button
            >
          </el-col> -->
        </el-row>
      </template>

      <template #operation="{ scope }">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['core:daily:query']"
          @click="setupEvents(scope.row, 'detail')"
          >详情</el-button
        >
        <el-button
          v-if="
            active === '1' &&
            isToday(scope.row.dailyTime) &&
            user.userId == scope.row.userId
          "
          type="text"
          icon="el-icon-delete"
          size="mini"
          v-hasPermi="['core:daily:remove']"
          @click="setupEvents(scope.row, 'remove')"
          >删除</el-button
        >
      </template>
    </MultiTable>

    <!-- 新增编辑操作 -->
    <ReportModel
      :visible.sync="visible"
      :form="form"
      :type="formType"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import ReportModel from "@/views/components/ReportModel";

import {
  list,
  add,
  dailyRemove,
  dailyRead,
  updateIsRead,
} from "@/api/content/daily.js";
import { systemResourceAnnex } from "@/api/workOrderProcessing/qualification";
import { personOptions, otherOptions, search } from "../config";

import { mapState } from "vuex";
export default {
  components: {
    MultiTable,
    ReportModel,
  },
  props: {
    active: String,
  },
  data() {
    return {
      options: otherOptions,

      tableData: [],
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },

      searchOptions: search,
      queryParams: {
        orderBy: "dailyTime",
        orderType: "desc",
      },

      visible: false,
      form: {},
      // 表单操作类型
      formType: "add",
    };
  },
  methods: {
    // 判断是否是当前时间
    isToday(date) {
      // 获取当前时间1
      const now = new Date();

      // 将要比较的时间转换成Date对象
      const targetTime = new Date(date);

      return (
        now.getDate() == targetTime.getDate() &&
        now.getMonth() == targetTime.getMonth() &&
        now.getFullYear() == targetTime.getFullYear()
      );
    },
    setOptions() {
      let flag = false;
      if (this.active === "2") {
        flag = true;
      }
      this.searchOptions.column.map((item) => {
        if (item.prop === "deptId") {
          item.display = flag;
        }
      });
      // if (this.active === "1") {
      //   // 个人
      //   this.options = personOptions;
      // } else {

      // }
      // this.options = otherOptions;
    },
    handleQuery(form, done) {
      this.getList();
      done();
    },
    handleReset() {
      this.getList();
    },
    sizeChange(size) {
      this.pager.pageSize = size;
      this.getList();
    },
    currentChange(current) {
      this.pager.pageNum = current;
      this.getList();
    },
    getList() {
      let sendParams = {
        ...this.queryParams,
        param: this.active,
        pageNum: this.pager.pageNum,
        pageSize: this.pager.pageSize,
      };
      list(sendParams).then((res) => {
        this.tableData = res.rows;
        this.pager.total = res.total;
      });
    },

    // 删除回调
    removeCallBack(id) {
      this.$confirm("此操作将删除该工作报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dailyRemove(id).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.$message.success("删除成功!");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 表格操作
    setupEvents(row, type) {
      const { id, isRead } = row;
      if (type === "detail") {
        if (["2", "3"].includes(this.active)) {
          let fn = null;
          if (this.active === "2") {
            fn = dailyRead;
          } else if (this.active === "3") {
            fn = updateIsRead;
          }
          // 部门主管点击详情，更新已预览
          fn({ dailyId: id }).then((res) => {
            if (res.code === 200) {
              this.$router.push({
                name: "Daily/detail",
                query: { id, type: this.active },
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$router.push({
            name: "Daily/detail",
            query: { id, type: this.active },
          });
        }
      } else if (type === "remove") {
        // 删除操作
        this.removeCallBack(row.id);
      }
    },

    // 新增
    handleAdd() {
      this.formType = "add";
      this.visible = true;
    },
    // 提交操作
    handleSubmit(form, done) {
      const {
        fileUpload,
        auditUserIds,
        ccPersonUserIds,
        dailyType,
        dailyTime,
        workSummary,
        workPlan,
      } = form;
      let sendData = {
        dailyType,
        dailyTime,
        workSummary,
        workPlan,
        deptId: this.user.user.deptId,
        userId: this.user.user.userId,
        auditUserIds: auditUserIds.join(","),
        ccPersonUserIds: ccPersonUserIds.join(","),
      };
      console.log(fileUpload, "fileUpload");

      add(sendData)
        .then(async (res) => {
          if (res.code === 200) {
            if (fileUpload && fileUpload.length) {
              fileUpload.forEach((item) => (item.uploadedId = res.data));

              await systemResourceAnnex(fileUpload);
            }
            this.getList();
            done();
            this.visible = false;
            this.$message.success("新增成功");

            this.$nextTick(() => {
              console.log("删除了");
              sessionStorage.removeItem("DRAFT_KEY");
            });
          } else {
            this.$message.error(res.msg);
            done();
          }
        })
        .catch((err) => {
          done();
        });
    },

    handleSort({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      console.log(column, prop, order);
      this.getList();
    },
  },
  mounted() {
    this.setOptions();
    this.getList();
  },
  watch: {
    active(newVal) {
      this.pager = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      this.setOptions();
      this.getList();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
::v-deep .cell {
  .cricle {
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #f56c6c;
      border: none;
      display: inline-block;
      margin-right: 5px;
    }
  }
  .cricle-color {
    &::before {
      background: #67c23a;
    }
  }
}

::v-deep .el-form-item__content {
  margin-right: 15px;
}
</style>
