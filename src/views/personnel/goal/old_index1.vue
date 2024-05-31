<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" label-width="0" prop="targetType">
        <el-select
          v-model="queryParams.targetType"
          :clearable="true"
          @change="handleTypeChange"
        >
          <el-option label="成员目标" :value="1" />
          <el-option label="部门目标" :value="2" />
          <el-option label="公司目标" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="" label-width="0" prop="year">
        <!-- <el-select v-model="queryParams.year" :clearable="true">
          <el-option label="2021年" :value="0" />
          <el-option label="2020年" :value="1" />
          <el-option label="2019年" :value="2" />
          <el-option label="2018年" :value="3" />
          <el-option label="2017年" :value="4" />
        </el-select> -->
        <el-date-picker
          v-model="queryParams.year"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select v-model="queryParams.type" :clearable="true">
          <el-option
            v-for="item in commonData.targetCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="userIds">
        <el-select
          style="width: 100%"
          v-model="queryParams.userIds"
          filterable
          clearable
          placeholder="跟进人员"
          remote
          multiple
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

      <el-form-item label="" prop="deptIds">
        <treeselect
          v-model="queryParams.deptIds"
          appendToBody
          :multiple="true"
          style="margin-left: 10px; max-width: 300px"
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
          v-hasPermi="['core:target:list']"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['core:target:add']"
          >新增</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="goalList"
      @selection-change="handleSelectionChange"
      border
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <!-- <el-table-column label="部门id" align="center" prop="deptId" /> -->
      <el-table-column
        label="姓名"
        v-if="queryParams.targetType == 1"
        align="center"
        prop="userName"
      />
      <el-table-column
        label="所属部门"
        v-if="queryParams.targetType == 2"
        align="center"
        prop="deptName"
      />
      <el-table-column label="目标财年" align="center" prop="year" />
      <el-table-column label="目标类型" align="center" prop="type" width="120">
        <template slot-scope="{ row }">
          <span>{{ getLabel(commonData.targetCategoryList, row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年度目标" align="center" prop="yearTarget" />
      <!--    <el-table-column label="目标单位" align="center" prop="unit">
        <template slot-scope="{ row }">
          <!~~ 1 万 2 亿 3 次 4 个 ~~>
          <span>{{ unitStr(row.unit) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="第一季度" align="center" prop="quarterOne" />
      <el-table-column label="第二季度" align="center" prop="quarterTwo" />
      <el-table-column label="第三季度" align="center" prop="quarterThree" />
      <el-table-column label="第四季度" align="center" prop="quarterFour" />
      <el-table-column label="1月" align="center" prop="monthOne" />
      <el-table-column label="2月" align="center" prop="monthTwo" />
      <el-table-column label="3月" align="center" prop="monthThree" />
      <el-table-column label="4月" align="center" prop="monthFour" />
      <el-table-column label="5月" align="center" prop="monthFive" />
      <el-table-column label="6月" align="center" prop="monthSix" />
      <el-table-column label="7月" align="center" prop="monthSeven" />
      <el-table-column label="8月" align="center" prop="monthEight" />
      <el-table-column label="9月" align="center" prop="monthNine" />
      <el-table-column label="10月" align="center" prop="monthTen" />
      <el-table-column label="11月" align="center" prop="monthEleven" />
      <el-table-column label="12月" align="center" prop="monthTwelve" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:target:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:target:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改目标记录对话框 -->
    <addGoal :show.sync="show" :_form="form" @submit="getList" />
  </div>
</template>

<script>
import addGoal from "@/views/personnel/components/addGoal.vue";
import { mapState } from "vuex";
import { list, getInfo, del, add, update } from "@/api/personnel/goal";

import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const docMonth = [
  "monthOne",
  "monthTwo",
  "monthThree",
  "monthFour",
  "monthFive",
  "monthSix",
  "monthSeven",
  "monthEight",
  "monthNine",
  "monthTen",
  "monthEleven",
  "monthTwelve",
];
const docQuarter = ["quarterOne", "quarterTwo", "quarterThree", "quarterFour"];

export default {
  name: "Goal",
  components: { addGoal, Treeselect },
  data() {
    return {
      userList: [],
      deptOptions: [],
      show: false,
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 目标记录表格数据
      goalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        targetType: 1,
        year: undefined,
        type: undefined,
        deptIds: [],
        userIds: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    // getQuarter(row, val) {
    //   let total = 0;
    //   row.monthTargetSumList.forEach((item, index) => {
    //     if ((val - 1) * 3 < index + 1 && val * 3 >= index + 1) {
    //       total += item.sumTargetDayValue;
    //     }
    //   });
    //   return total;
    // },
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

    unitStr(index) {
      return ["万", "亿", "次", "个"][Number(index) - 1];
    },

    /** 查询目标记录列表 */
    getList() {
      this.loading = true;
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.userIds = params.userIds.join(",");
      params.deptIds = params.deptIds.join(",");
      list(params).then((response) => {
        this.goalList = response.rows;
        this.total = response.total;
        this.loading = false;

        this.goalList.forEach((item) => {
          for (const key in item) {
            if (
              item[key] &&
              typeof item[key] == "string" &&
              item[key].indexOf(".00") != -1
            ) {
              item[key] = Number(item[key]);
            }
          }
        });
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        targetType: undefined,
        year: undefined,
        type: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加业绩目标";

      this.show = true;
      this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.show = true;
        // this.open = true;
        // this.title = "修改业绩目标";
      });
    },

    handleTypeChange(e) {
      console.log(e);
      this.getList();
    },
    handleConvert(form) {
      this.$router.push({ path: "demand/add", query: { type: 2, form: form } });
    },
    //置顶按钮
    handleSetTop(row) {
      this.reset();
      const id = row.id || this.ids;
      let queryObj = {
        id: id,
      };
      setTop(queryObj).then((response) => {
        if (row.isTop) {
          this.$modal.msgSuccess("取消置顶成功");
        } else {
          this.$modal.msgSuccess("置顶成功");
        }
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            update(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            add(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除目标记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return del(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/goal/export",
        {
          ...this.queryParams,
        },
        `goal_${new Date().getTime()}.xlsx`
      );
    },
    /** 跟进按钮  */
    handleFollowUp(row) {
      this.followUpOpen = true;
      this.followUpFormTitle = "新建跟进";
      this.followUpForm.status = row.goalStatus;
      this.followUpForm.companyName = row.companyName;
      this.followUpForm.contactPerson = row.contactName;
      this.followUpForm.followPerson = row.userName;
      this.followUpForm.customerId = row.customerId;
      this.followUpForm.followedId = row.id;
    },
    submitFollowUpForm() {
      this.$refs["followUpForm"].validate((valid) => {
        if (valid) {
          followUp(this.followUpForm).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.followUpOpen = false;
            this.followUpForm = {};
          });
        }
      });
    },
    followUpFormCancel() {
      this.followUpOpen = false;
      this.followUpForm = {};
    },
  },
};
</script>
<style scoped>
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
