<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <span
            @click="queryParams.queryType = 1"
            :class="{
              select_title: 1 === queryParams.queryType,
              msg_title: true,
            }"
            >我提交的</span
          >
          <span
            @click="queryParams.queryType = 2"
            :class="{
              select_title: 2 === queryParams.queryType,
              msg_title: true,
            }"
            >我审批的</span
          >
          <span
            @click="queryParams.queryType = 3"
            :class="{
              select_title: 3 === queryParams.queryType,
              msg_title: true,
            }"
            >抄送给我的</span
          >
        </div>
      </div>

      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="queryParams.queryType != 1"
      >
        <el-form-item label="创建时间" prop="dateMonth">
          <el-date-picker
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人部门" prop="deptIds">
          <treeselect
            v-model="queryParams.deptIds"
            appendToBody
            multiple
            style="margin-left: 10px; max-width: 400px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>

        <el-form-item label="申请人" prop="userIds">
          <el-select
            style="width: 100%"
            v-model="queryParams.userIds"
            filterable
            multiple
            clearable
            placeholder="申请人"
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

    <el-table
      style="margin-top: 30px"
      v-loading="loading"
      :data="auditList"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="true" />
      <el-table-column label="标题" align="center" prop="title" /> -->
      <el-table-column label="申请类型" align="center" prop="auditType">
        <template slot-scope="{ row }">
          <span>{{ row.auditType == 1 ? "报价申请" : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center" prop="title" />
      <el-table-column label="申请人" align="center" prop="applyUserName" />

      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="审核结果" align="center" prop="auditResult" />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                path: 'channelPriceDetail',
                query: { id: row.id, type: 1, pageType: '1' },
              })
            "
            >详情</el-button
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

    <!-- 添加或修改审批流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="申请人" prop="applyUserId">
          <el-input v-model="form.applyUserId" placeholder="请输入申请人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAudit,
  getAudit,
  delAudit,
  addAudit,
  updateAudit,
} from "@/api/core/audit";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Audit",
  components: { Treeselect },
  data() {
    return {
      userList: [],
      deptOptions: [],
      dateMonth: [],

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
      // 审批流程表格数据
      auditList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptIds: [],
        userIds: [],
        queryType: 1,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        auditType: [
          { required: true, message: "审批类型不能为空", trigger: "change" },
        ],
        applyUserId: [
          { required: true, message: "申请人不能为空", trigger: "blur" },
        ],
        auditStatus: [
          {
            required: true,
            message: "审批状态 1待审批 2通过 3驳回不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    "queryParams.queryType": {
      handler() {
        this.getList();
      },
    },
  },
  created() {
    const { timeType } = this.$route.params;
    if (timeType) {
      this.queryParams.timeType = timeType;
    }
    this.getList();
    this.getTreeselect();
  },
  beforeRouteEnter(to, from, next) {
    // console.log(from);
    if (from.name == "Index") {
      next((vm) => {
        // 通过 `vm` 访问组件实例
        vm.queryParams.queryType = 2;
      });
    }
    next();
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

    /** 查询审批流程报价列表 */
    getList() {
      this.loading = true;
      let query = JSON.parse(JSON.stringify(this.queryParams));
      query.deptIds = query.deptIds.join(",");
      query.userIds = query.userIds.join(",");
      listAudit(query).then((response) => {
        this.auditList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        title: undefined,
        auditType: undefined,
        applyUserId: undefined,
        auditStatus: 0,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
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
      this.reset();
      this.open = true;
      this.title = "添加审批流程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getAudit(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改审批流程";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateAudit(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addAudit(this.form)
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
        .confirm('是否确认删除审批流程编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delAudit(ids);
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
        "core/audit/export",
        {
          ...this.queryParams,
        },
        `audit_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style scoped>
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

.Information {
  margin-top: 20px;
}
</style>
