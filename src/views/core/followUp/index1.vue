<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="客户id" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入客户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="被跟进id，线索、挖需、商机、订单、客户id"
        prop="followedId"
      >
        <el-input
          v-model="queryParams.followedId"
          placeholder="请输入被跟进id，线索、挖需、商机、订单、客户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户表id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户表id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他"
        prop="followUpMethod"
      >
        <el-input
          v-model="queryParams.followUpMethod"
          placeholder="请输入跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="跟进时间" prop="followUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.followUpTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择跟进时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下次跟进时间" prop="nextFollowUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.nextFollowUpTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择下次跟进时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="queryParams.contactPerson"
          placeholder="请输入联系人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="附件" prop="attachment">
        <el-input
          v-model="queryParams.attachment"
          placeholder="请输入附件"
          clearable
          @keyup.enter.native="handleQuery"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:followUp:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:followUp:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:followUp:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:followUp:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="followUpList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" v-if="true" />
      <el-table-column label="客户id" align="center" prop="customerId" />
      <el-table-column
        label="被跟进id，线索、挖需、商机、订单、客户id"
        align="center"
        prop="followedId"
      />
      <el-table-column
        label="跟进类型 1线索 2挖需 3商机 4订单 5客户"
        align="center"
        prop="type"
      />
      <el-table-column label="用户表id" align="center" prop="userId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="跟进内容" align="center" prop="content" />
      <el-table-column
        label="跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他"
        align="center"
        prop="followUpMethod"
      />
      <el-table-column
        label="跟进时间"
        align="center"
        prop="followUpTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.followUpTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="下次跟进时间"
        align="center"
        prop="nextFollowUpTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.nextFollowUpTime, "{y}-{m}-{d}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" prop="contactPerson" />
      <el-table-column
        label="状态 根据类型的不同代表不同状态，详情见type字段关联的类型"
        align="center"
        prop="status"
      />
      <el-table-column label="附件" align="center" prop="attachment" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:followUp:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:followUp:remove']"
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

    <!-- 添加或修改跟进记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item
          label="被跟进id，线索、挖需、商机、订单、客户id"
          prop="followedId"
        >
          <el-input
            v-model="form.followedId"
            placeholder="请输入被跟进id，线索、挖需、商机、订单、客户id"
          />
        </el-form-item>
        <el-form-item label="用户表id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户表id" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="跟进内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item
          label="跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他"
          prop="followUpMethod"
        >
          <el-input
            v-model="form.followUpMethod"
            placeholder="请输入跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他"
          />
        </el-form-item>
        <el-form-item label="跟进时间" prop="followUpTime">
          <el-date-picker
            clearable
            v-model="form.followUpTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextFollowUpTime">
          <el-date-picker
            clearable
            v-model="form.nextFollowUpTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择下次跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-input v-model="form.attachment" placeholder="请输入附件" />
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
  listFollowUp,
  getFollowUp,
  delFollowUp,
  addFollowUp,
  updateFollowUp,
} from "@/api/core/followUp";

export default {
  name: "FollowUp",
  data() {
    return {
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
      // 跟进记录表格数据
      followUpList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: undefined,
        followedId: undefined,
        type: undefined,
        userId: undefined,
        title: undefined,
        content: undefined,
        followUpMethod: undefined,
        followUpTime: undefined,
        nextFollowUpTime: undefined,
        contactPerson: undefined,
        status: undefined,
        attachment: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "不能为空", trigger: "blur" }],
        customerId: [
          { required: true, message: "客户id不能为空", trigger: "blur" },
        ],
        followedId: [
          {
            required: true,
            message: "被跟进id，线索、挖需、商机、订单、客户id不能为空",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "跟进类型 1线索 2挖需 3商机 4订单 5客户不能为空",
            trigger: "change",
          },
        ],
        userId: [
          { required: true, message: "用户表id不能为空", trigger: "blur" },
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [
          { required: true, message: "跟进内容不能为空", trigger: "blur" },
        ],
        followUpMethod: [
          {
            required: true,
            message: "跟进方式 1面谈 2电话 3微信 4短信 5邮件 6QQ 7其他不能为空",
            trigger: "blur",
          },
        ],
        followUpTime: [
          { required: true, message: "跟进时间不能为空", trigger: "blur" },
        ],
        nextFollowUpTime: [
          { required: true, message: "下次跟进时间不能为空", trigger: "blur" },
        ],
        contactPerson: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message:
              "状态 根据类型的不同代表不同状态，详情见type字段关联的类型不能为空",
            trigger: "blur",
          },
        ],
        attachment: [
          { required: true, message: "附件不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询跟进记录列表 */
    getList() {
      this.loading = true;
      listFollowUp(this.queryParams).then((response) => {
        this.followUpList = response.rows;
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
        customerId: undefined,
        followedId: undefined,
        type: undefined,
        userId: undefined,
        title: undefined,
        content: undefined,
        followUpMethod: undefined,
        followUpTime: undefined,
        nextFollowUpTime: undefined,
        contactPerson: undefined,
        status: 0,
        attachment: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      this.title = "添加跟进记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getFollowUp(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改跟进记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateFollowUp(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addFollowUp(this.form)
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
        .confirm('是否确认删除跟进记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delFollowUp(ids);
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
        "system/followUp/export",
        {
          ...this.queryParams,
        },
        `followUp_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
