<template>
  <div class="app-container abcTrainApply">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入学员名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="trainType">
        <el-select v-model="queryParams.trainType" placeholder="请选择培训类型">
          <el-option label="A证" :value="1"> </el-option>
          <el-option label="B证" :value="2"> </el-option>
          <el-option label="C证" :value="3"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="examType">
        <el-select v-model="queryParams.examType" placeholder="请选择考试形式">
          <el-option label="机考" :value="1"> </el-option>
          <el-option label="笔试" :value="2"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['core:abcTrainApply:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['core:abcTrainApply:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['core:abcTrainApply:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['core:abcTrainApply:export']">导出</el-button>
      </el-col>
      <right-toolbar_2 :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"
        pageName="abcTrainApply"></right-toolbar_2>
    </el-row>

    <el-table v-loading="loading" :data="abcTrainApplyList" @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column type="selection" width="55" align="center" />

      <template v-for="(item, index) in columns">
        <el-table-column v-if="item.visible" :key="index" :label="item.label" align="center" :sortable="item.sortable"
          :prop="item.prop" :min-width="item.width" :show-overflow-tooltip="item.showOverflow">
          <template slot-scope="{ row }">
            <span v-if="item.prop == 'examType'">
              {{ row.examType ? (row.examType == 1 ? "机考" : "笔试") : "-" }}
            </span>
            <span v-else-if="item.prop == 'trainType'">
              {{
      row.trainType == 1 ? "A证" : row.trainType == 2 ? "B证" : "C证"
    }}
            </span>
            <span v-else-if="item.prop == 'classType'">
              {{ row.classType == 1 ? "普通班" : "无忧班" }}
            </span>
            <span v-else-if="item.prop == 'openExam'">
              {{ row.openExam == 1 ? "同步" : "不同步" }}
            </span>
            <span v-else-if="item.prop == 'companyFocus'">
              {{ row.companyFocus == 1 ? "是" : "否" }}
            </span>
            <span v-else-if="item.prop == 'paymentType'">
              {{ row.paymentType == 1 ? "对公" : "对私" }}
            </span>
            <span v-else> {{ row[item.prop] || "--" }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column width="100" label="确认状态" align="center" prop="confirmState" fixed="right">
        <template slot-scope="scope">
          <el-switch :disabled="!SetCheckPermi(['core:abcTrainApply:confirm']) ||
      (scope.row.confirmState == 1 ? true : false)
      " :value="scope.row.confirmState == 1 ? true : false" active-color="#13ce66" inactive-color="#ff4949"
            @change="changeSwitch($event, 'confirmState', scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column e-column width="100" label="签到状态" align="center" prop="signInState" fixed="right">
        <template slot-scope="scope">
          <el-switch :disabled="!SetCheckPermi(['core:abcTrainApply:sign-in']) ||
      (scope.row.signInState == 1 ? true : false)
      " :value="scope.row.signInState == 1 ? true : false" active-color="#13ce66" inactive-color="#ff4949"
            @change="changeSwitch($event, 'signInState', scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">
              {{ Authority(scope.row) ? "修改" : "查看详情" }}
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['core:abcTrainApplyFeedback:query']"
              @click="trainingAttitude(scope.row)">
              培训评价
            </el-button>
          </div>
          <div>
            <el-button v-if="!scope.row.confirmState" size="mini" type="text" icon="el-icon-delete"
              @click="handleDelete(scope.row)" v-hasPermi="['core:abcTrainApply:remove']">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改ABC现场培训报名对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="学员名称" prop="userName">
          <el-input :disabled="!Authority(form)" v-model="form.userName" placeholder="请输入学员名称" />
        </el-form-item>

        <el-form-item v-if="form.id" label="销售人员" prop="createBy">
          <el-input :disabled="true" v-model="form.createBy" />
        </el-form-item>
        <el-form-item label="开通题库" prop="openExam">
          <el-switch :disabled="!Authority(form)" :value="form.openExam == 1 ? true : false" active-color="#13ce66"
            inactive-color="#ff4949" @change="(res) => {
      form.openExam = res ? 1 : 0;
    }
      ">
          </el-switch>
        </el-form-item>

        <el-form-item label="是否企业客户 （需重点关注）" prop="companyFocus">
          <el-switch :disabled="!Authority(form)" :value="form.companyFocus == 1 ? true : false" active-color="#13ce66"
            inactive-color="#ff4949" @change="(res) => {
      form.companyFocus = res ? 1 : 0;
    }
      ">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="form.id" label="培训时间" prop="trainTime">
          <el-date-picker :disabled="!Authority(form)" clearable v-model="form.trainTime" type="date"
            value-format="yyyy-MM-dd" placeholder="请选择培训时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-else label="培训时间" prop="addTrainTimeArr">
          <el-date-picker type="dates" v-model="form.addTrainTimeArr" value-format="yyyy-MM-dd" placeholder="选择一个或多个日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间" prop="examTime">
          <el-date-picker :disabled="!Authority(form)" clearable v-model="form.examTime" type="date"
            value-format="yyyy-MM-dd" placeholder="请选择考试时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="培训类型" prop="trainType">
          <el-select :disabled="!Authority(form)" v-model="form.trainType" placeholder="请选择">
            <el-option label="A证" :value="1"> </el-option>
            <el-option label="B证" :value="2"> </el-option>
            <el-option label="C证" :value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款方式" prop="paymentType">
          <el-select :disabled="!Authority(form)" v-model="form.paymentType" placeholder="请选择">
            <el-option label="对公" :value="1"> </el-option>
            <el-option label="对私" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试形式" prop="examType">
          <el-select :disabled="!Authority(form)" v-model="form.examType" placeholder="请选择">
            <el-option label="机考" :value="1"> </el-option>
            <el-option label="笔试" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班型" prop="price">
          <el-select :disabled="!Authority(form)" v-model="form.classType" placeholder="请选择">
            <el-option label="普通班" :value="1"> </el-option>
            <el-option label="无忧班" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款主体" prop="paymentMain">
          <el-input :disabled="!Authority(form)" v-model="form.paymentMain" placeholder="请输入收款主体" />
        </el-form-item>
        <el-form-item label="费用" prop="price">
          <el-input :disabled="!Authority(form)" v-model="form.price" placeholder="请输入费用" />
        </el-form-item>

        <el-form-item label="招生老师" prop="recruiter">
          <el-input :disabled="!Authority(form)" v-model="form.recruiter" placeholder="请输入招生老师" />
        </el-form-item>
        <el-form-item label="所属企业全称" prop="companyName">
          <el-input :disabled="!Authority(form)" v-model="form.companyName" placeholder="请输入所属企业全称" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCardNumber">
          <el-input :disabled="!Authority(form)" v-model="form.idCardNumber" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input :disabled="!Authority(form)" v-model="form.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :disabled="!Authority(form)" show-word-limit maxlength="300" type="textarea" v-model="form.remark"
            placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="Authority(form)" :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="trainingTitle" :visible.sync="trainingOpen" width="30%" append-to-body>
      <el-form ref="trainingForm" :model="trainingForm" :rules="trainingRules" label-width="120px">
        <el-form-item label="培训态度" prop="manner">
          <el-input :disabled="trainingFil" v-model="trainingForm.manner" placeholder="请输入培训态度" />
        </el-form-item>
        <el-form-item label="培训分数" prop="score">
          <el-input :disabled="trainingFil" v-model="trainingForm.score" placeholder="请输入培训分数" />
        </el-form-item>
        <el-form-item label="考前建议" prop="suggest">
          <el-input :disabled="trainingFil" show-word-limit type="textarea" v-model="trainingForm.suggest"
            placeholder="请输入考前建议" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasPermi="['core:abcTrainApplyFeedback:add']" type="primary" @click="trainingSubmit">确
          定</el-button>
        <el-button @click="trainingOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAbcTrainApply,
  getAbcTrainApply,
  delAbcTrainApply,
  addAbcTrainApply,
  updateAbcTrainApply,
  coreAbcTrainApplyConfirm,
  coreAbcTrainApplySingIn,
  getAbcTrainApplyFeedback,
  addAbcTrainApplyFeedback,
} from "@/api/core/abcTrainApply";
import mixin from "./mixinData.js";
import { checkPermi } from "../../../utils/permission";
export default {
  mixins: [mixin],
  name: "AbcTrainApply",
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
      // ABC现场培训报名表格数据
      abcTrainApplyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        userId: undefined,
        trainTime: undefined,
        examTime: undefined,
        addTrainTimeArr: undefined,
        trainType: undefined,
        price: undefined,
        recruiter: undefined,
        examType: undefined,
        companyName: undefined,
        idCardNumber: undefined,
        phoneNumber: undefined,
        confirmState: undefined,
        signInState: undefined,
        confirmBy: undefined,
        confirmTime: undefined,
        paymentType: undefined,
        paymentMain: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: "ID不能为空", trigger: "blur" }],
        userName: [
          { required: true, message: "学员名称不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "销售人员id不能为空", trigger: "blur" },
        ],
        trainTime: [
          { required: true, message: "培训时间不能为空", trigger: "blur" },
        ],
        examTime: [
          { required: true, message: "考试时间不能为空", trigger: "blur" },
        ],
        paymentType: [
          { required: true, message: "收款方式不能为空", trigger: "blur" },
        ],
        paymentMain: [
          { required: true, message: "收款主体不能为空", trigger: "blur" },
        ],
        companyFocus: [
          { required: true, message: "是否企业用户不能为空", trigger: "blur" },
        ],
        addTrainTimeArr: [
          { required: true, message: "考试时间不能为空", trigger: "blur" },
        ],
        trainType: [
          {
            required: true,
            message: "培训类别不能为空",
            trigger: "change",
          },
        ],
        price: [{ required: true, message: "费用不能为空", trigger: "blur" }],
        classType: [
          { required: true, message: "班型不能为空", trigger: "blur" },
        ],
        recruiter: [
          { required: true, message: "招生老师不能为空", trigger: "blur" },
        ],
      },
      // 培训态度
      trainingTitle: "新增培训态度",
      trainingOpen: false,
      trainingForm: {},
      trainingRules: {},
    };
  },
  created() {
    this.getList();
    this.getCloumns();
  },
  computed: {
    Authority() {
      return (row) => {
        // 判断是否有权限;
        if (!checkPermi(["core:abcTrainApply:edit"])) return false;
        // 是否是教务
        if (checkPermi(["core:abcTrainApply:edu"])) {
          if (row.signInState) return false;
          return true;
        } else {
          if (row.confirmState) return false;
          return true;
        }
      };
    },
    trainingFil() {
      if (checkPermi(["core:abcTrainApplyFeedback:add"])) {
        return false;
      } else {
        return true;
      }
    },
    SetCheckPermi() {
      return (res) => {
        return checkPermi(res);
      };
    },
  },
  methods: {
    // 培训态度
    trainingAttitude(row) {
      this.trainingForm = {
        applyId: row.id,
        manner: undefined,
        score: undefined,
        suggest: undefined,
      };
      this.trainingOpen = true;
      getAbcTrainApplyFeedback(row.id).then((res) => {
        if (res.data) {
          this.trainingForm = res.data;
        }
      });
    },
    trainingSubmit() {
      this.$refs["trainingForm"].validate((valid) => {
        if (valid) {
          addAbcTrainApplyFeedback(this.trainingForm)
            .then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.trainingOpen = false;
              this.getList();
            })
            .finally(() => { });
        }
      });
    },
    // 确定状态
    changeSwitch(res, value, item) {
      if (value == "confirmState") {
        coreAbcTrainApplyConfirm(item.id).then(() => {
          this.$modal.msgSuccess("确认成功");
          this.getList();
        });
      } else {
        if (!item.confirmState) {
          this.$modal.msgError("请确认后再签到");
          return;
        }
        coreAbcTrainApplySingIn(item.id).then(() => {
          this.$modal.msgSuccess("签到成功");
          this.getList();
        });
      }
    },

    /** 查询ABC现场培训报名列表 */
    getList() {
      this.loading = true;
      listAbcTrainApply(this.queryParams).then((response) => {
        this.abcTrainApplyList = response.rows;
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
        userName: undefined,
        userId: undefined,
        trainTime: undefined,
        examTime: undefined,
        addTrainTimeArr: undefined,
        trainType: undefined,
        price: undefined,
        recruiter: undefined,
        examType: undefined,
        companyName: undefined,
        idCardNumber: undefined,
        phoneNumber: undefined,
        confirmState: undefined,
        signInState: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        confirmBy: undefined,
        confirmTime: undefined,
        classType: undefined,
        openExam: undefined,
        companyFocus: 0,
        paymentType: undefined,
        paymentMain: undefined,
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
      this.title = "添加安管人员ABC证培训报名";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getAbcTrainApply(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        if (this.form.companyFocus == null) {
          this.form.companyFocus = "0"
        }
        this.open = true;
        this.title = "修改安管人员ABC证培训报名";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateAbcTrainApply(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addAbcTrainApply(this.form)
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
        .confirm('是否确认删除ABC现场培训报名编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delAbcTrainApply(ids);
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
        "core/abcTrainApply/export",
        {
          ...this.queryParams,
          ids: this.ids,
        },
        `abcTrainApply_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  color: #000 !important;
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff !important;
  color: #000 !important;
}
</style>