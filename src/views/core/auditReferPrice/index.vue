<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="关键字" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键字"
          clearable
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="dateMonth">
        <el-date-picker
          v-model="dateMonth"
          type="daterange"
          value-format="yyyy-MM-dd"
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

      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" clearable>
          <el-option label="待审批" :value="1" />
          <el-option label="已通过" :value="2" />
          <el-option label="已驳回" :value="3" />
          <el-option label="已撤回" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template>
          <el-select
            @change="changeTimeValue"
            style="width: 130px; height: 28px"
            v-model="expirationValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expiration"
              :key="item.isValid"
              :label="item.label"
              :value="item.isValid"
            >
            </el-option>
          </el-select>
        </template>
        <el-button
          style="margin-left: 10px"
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['core:auditReferPrice:add']"
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
          v-hasPermi="['core:auditReferPrice:edit']"
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
          v-hasPermi="['core:auditReferPrice:remove']"
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
          v-hasPermi="['core:auditReferPrice:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->

    <el-table
      v-loading="loading"
      :data="auditReferPriceList"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="主键" align="center" prop="id" v-if="false" />
      <!-- <el-table-column label="关联审核主表" align="center" prop="auditId" /> -->
      <el-table-column label="企业名称" align="center" prop="companyName" />

      <el-table-column label="现合作项目" align="center" prop="nowProject" />
      <el-table-column label="低于限价原因" align="center" prop="reason" />
      <el-table-column
        label="以往合作项目"
        align="center"
        prop="beforeProject"
      />
      <el-table-column
        label="报价内容及价格"
        align="center"
        prop="priceContent"
      />
      <el-table-column label="地区" align="center" prop="area" />
      <el-table-column label="是否老客户" align="center" prop="isOldCustomer">
        <template slot-scope="{ row }">
          <span>{{ row.isOldCustomer == 0 ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyUserName" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="审批通过时间" align="center" prop="endTime">
        <template slot-scope="{ row }">
          <span>{{ row.auditStatus == 2 ? row.endTime : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报价有效期" align="center" prop="">
        <template slot-scope="{ row }">
          <span>{{ row.auditStatus == 2 ? row.setTime : "" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片url" align="center" prop="imgUrl" /> -->
      <el-table-column
        label="报价审核"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="text"
            @click="
              $router.push({
                path: 'PriceDetail',
                query: { id: row.id, type: 0 },
              })
            "
            >{{ row.auditResult }}</el-button
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

    <!-- 添加或修改审批流程报价对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联审核主表" prop="auditId">
          <el-input v-model="form.auditId" placeholder="请输入关联审核主表" />
        </el-form-item>
        <el-form-item label="报价人员" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入报价人员" />
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="是否老客户 0否 1是" prop="isOldCustomer">
          <el-input
            v-model="form.isOldCustomer"
            placeholder="请输入是否老客户 0否 1是"
          />
        </el-form-item>
        <el-form-item label="以往合作项目" prop="beforeProject">
          <el-input
            v-model="form.beforeProject"
            placeholder="请输入以往合作项目"
          />
        </el-form-item>
        <el-form-item label="现合作项目" prop="nowProject">
          <el-input v-model="form.nowProject" placeholder="请输入现合作项目" />
        </el-form-item>
        <el-form-item label="报价内容及价格">
          <editor v-model="form.priceContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="低于限价原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入低于限价原因" />
        </el-form-item>
        <el-form-item label="图片url" prop="imgUrl">
          <el-input
            v-model="form.imgUrl"
            type="textarea"
            placeholder="请输入内容"
          />
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
  listAuditReferPrice,
  getAuditReferPrice,
  delAuditReferPrice,
  addAuditReferPrice,
  updateAuditReferPrice,
} from "@/api/core/auditReferPrice";
import { listUser, listUserSearch } from "@/api/system/user";

import { treeselect } from "@/api/system/dept";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import index from "watch-size";

export default {
  name: "AuditReferPrice",
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
      // 审批流程报价表格数据
      auditReferPriceList: [],
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
        keyword: "",
        beginTime: "",
        endTime: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
        auditId: [
          { required: true, message: "关联审核主表不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "报价人员不能为空", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        isOldCustomer: [
          {
            required: true,
            message: "是否老客户 0否 1是不能为空",
            trigger: "blur",
          },
        ],
        beforeProject: [
          { required: true, message: "以往合作项目不能为空", trigger: "blur" },
        ],
        nowProject: [
          { required: true, message: "现合作项目不能为空", trigger: "blur" },
        ],
        priceContent: [
          {
            required: true,
            message: "报价内容及价格不能为空",
            trigger: "blur",
          },
        ],
        reason: [
          { required: true, message: "低于限价原因不能为空", trigger: "blur" },
        ],
        imgUrl: [
          { required: true, message: "图片url不能为空", trigger: "blur" },
        ],
      },
      expiration: [
        {
          isValid: "",
          label: "全部报价日期",
        },
        {
          isValid: "1",
          label: "有效中",
        },
        {
          isValid: "2",
          label: "已过期",
        },
      ], // 报价是否有效选项
      expirationValue: "全部报价日期", // 报价是否有效选项
      setTime: [],
    };
  },

  watch: {
    dateMonth: {
      handler(n) {
        console.log(n);
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";

        // this.current == 0 ? this.getAllCountByDate() : this.getAllCountByUser();
      },
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
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
      listAuditReferPrice(query).then((response) => {
        this.auditReferPriceList = response.rows;
        this.total = response.total;
        this.setTime = [];
        // 对审批通过时间进行处理获取报价有效期
        this.auditReferPriceList.forEach((element) => {
          this.setTime.push(element.endTime);
        });
        this.setTime = this.setTime.map((t) => {
          if (t !== null) {
            var dateTime = new Date(t);
            dateTime = dateTime.setDate(dateTime.getDate() + 7);
            dateTime = new Date(dateTime);
            dateTime = dateTime.toLocaleDateString();
            dateTime = dateTime.replace(/\//g, "-");
            dateTime = dateTime
              .split("-")
              .map((item) => {
                if (+item < 10) {
                  return "0" + item;
                }
                return item;
              })
              .join("-");

            return dateTime;
          }
        });
        // 将处理过后的数据返回数组
        this.auditReferPriceList.forEach((item, index) => {
          item["setTime"] = this.setTime[index];
        });
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
        auditId: undefined,
        userId: undefined,
        companyName: undefined,
        isOldCustomer: undefined,
        beforeProject: undefined,
        nowProject: undefined,
        priceContent: undefined,
        reason: undefined,
        imgUrl: undefined,
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
      console.log(this.queryParams);
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.expirationValue = "";
      this.queryParams.isValid = "";
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
      this.title = "添加审批流程报价";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getAuditReferPrice(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改审批流程报价";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateAuditReferPrice(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addAuditReferPrice(this.form)
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
        .confirm('是否确认删除审批流程报价编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delAuditReferPrice(ids);
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
        "core/auditReferPrice/export",
        {
          ...this.queryParams,
        },
        `auditReferPrice_${new Date().getTime()}.xlsx`
      );
    },
    // 筛选报价的有效日期
    changeTimeValue() {
      if (this.expirationValue == 1) {
        this.queryParams.isValid = 1;
        this.queryParams.pageNum = 1;
      } else if (this.expirationValue == 2) {
        this.queryParams.isValid = 2;
        this.queryParams.pageNum = 1;
      } else {
        this.queryParams.isValid = "";
        this.queryParams.pageNum = 1;
      }
    },
  },
};
</script>
