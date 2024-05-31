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
      <el-form-item label="挖需状态" prop="demandStatus">
        <el-select v-model="queryParams.demandStatus" :clearable="true">
          <el-option
            v-for="demandStatus in commonData.demandStatusList"
            :key="demandStatus.value"
            :label="demandStatus.label"
            :value="demandStatus.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源" prop="dataSource">
        <el-select v-model="queryParams.dataSource" :clearable="true">
          <el-option
            v-for="dataSource in commonData.dataSourceList"
            :key="dataSource.value"
            :label="dataSource.label"
            :value="dataSource.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="跟进人员" prop="followUpPerson">
        <el-input
          v-model="queryParams.followUpPerson"
          placeholder="请输入跟进人员"
          clearable
        />
      </el-form-item> -->

      <el-form-item label="跟进人员" prop="followUpPersonIds">
        <el-select
          style="width: 100%"
          v-model="queryParams.followUpPersonIds"
          filterable
          clearable
          placeholder="跟进人员"
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

      <el-form-item label="归属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          appendToBody
          style="margin-left: 10px; max-width: 200px"
          :options="deptOptions"
          value-consists-of="LEAF_PRIORITY"
          :show-count="true"
          placeholder="请选择归属部门"
        />
      </el-form-item>

      <el-form-item label="最后跟进时间" prop="lastFollowUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.lastFollowUpTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择最后跟进时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="安证有效期" prop="safetyPermitsTimeEndTime">
        <el-date-picker
          clearable
          v-model="dateMonth1"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="资质日期" prop="expireDateEndTime">
        <el-date-picker
          clearable
          v-model="dateMonth2"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        >
        </el-date-picker>
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
        <PowerSearch :type="2" @submit="setSearch" />
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
          v-hasPermi="['core:demand:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['core:demand:import']"
          >导入</el-button
        >
      </el-col>
      <right-toolbar_2
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar_2>
    </el-row>

    <el-table
      v-loading="loading"
      :data="demandList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      border
      highlight-current-row
      ref="myTable"
      style="width: 100%"
    >
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.visible"
          :key="index"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :prop="item.prop"
          :min-width="item.width"
          :show-overflow-tooltip="item.showOverflow"
        >
          <template slot-scope="{ row }">
            <span
              class="ableClick"
              v-if="item.prop == 'title'"
              @click="
                $router.push({ name: 'Demand/detail', query: { id: row.id } })
              "
              >{{ row.title }}</span
            >
            <span
              class="ableClick"
              v-else-if="item.prop == 'companyName'"
              @click="
                $router.push({
                  name: 'Customer/detail',
                  query: { id: row.customerId, type: '1' },
                })
              "
            >
              {{ row.companyName }}
            </span>
            <span
              v-else-if="
                ['demandStatus', 'role', 'dataSource'].includes(item.prop)
              "
            >
              {{ getLabel(commonData[`${item.prop}List`], row[item.prop]) }}
            </span>
            <span v-else-if="item.prop == 'gender'">
              {{ row.gender == 1 ? "先生" : "女士" }}
            </span>
            <span v-else-if="item.prop == 'province' && row.province">
              {{ row.province }} - {{ row.city }} - {{ row.area }}
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="350"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-chat-dot-round"
            size="mini"
            type="text"
            @click="handleFollowUp(scope.row)"
            v-hasPermi="['core:demand:followUp']"
            >跟进</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:demand:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            @click="handleSetTop(scope.row)"
            v-hasPermi="['core:demand:setTop']"
            >{{ scope.row.isTop ? "取消置顶" : "置顶" }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-bell"
            @click="handleQuotedPrice(scope.row)"
            v-hasPermi="['core:auditReferPrice:add']"
            >报价</el-button
          >

          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="text"
            @click="handleConvert(scope.row)"
            v-hasPermi="['core:demand:convert']"
            >转为商机</el-button
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

    <!-- 挖需导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- <followUpDialog
      :followUpForm.sync="followUpForm"
      :followUpOpen.sync="followUpOpen"
      :type="2"
    /> -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="2"
      @success="handleSuccess"
    />

    <quotedPrice
      :show.sync="showQuotedPrice"
      :quotedPriceForm="quotedPriceForm"
    />
  </div>
</template>

<script>
import {
  listDemand,
  getDemand,
  delDemand,
  addDemand,
  updateDemand,
  setTop,
  followUp,
  importTemplate,
} from "@/api/core/demand";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import quotedPrice from "@/views/core/demand/components/quotedPrice";

const regionDataArr = regionData.filter((item) => item.label == "广东省");
regionDataArr[0].children.forEach((item) => {
  item.children.forEach((val, index, array) => {
    if (val.label == "市辖区") {
      array.splice(0, 1);
    }
  });
});
import { mapState } from "vuex";

import PowerSearch from "@/views/core/components/powerSearch";

export default {
  name: "Demand",
  components: { followUpDialog, Treeselect, quotedPrice, PowerSearch },
  mixins: [followUpMinixs],
  data() {
    return {
      dateMonth1: [],
      dateMonth2: [],
      showQuotedPrice: false,
      quotedPriceForm: {},
      deptOptions: [],
      // 跟进弹出框标题
      followUpFormTitle: "",
      // 是否显示跟进弹出框
      followUpOpen: false,
      // 跟进表单
      followUpForm: {},
      // 跟进表单校验
      followUpRules: {
        followUpMethod: [
          { required: true, message: "跟进类型不能为空", trigger: "blur" },
        ],
        title: [
          { required: true, message: "跟进事由不能为空", trigger: "blur" },
        ],
        followUpTime: [
          { required: true, message: "跟进时间不能为空", trigger: "blur" },
        ],
        nextFollowUpTime: [
          { required: true, message: "下次跟进时间不能为空", trigger: "blur" },
        ],
        content: [
          { required: true, message: "工作总结不能为空", trigger: "blur" },
        ],
        // status: [
        //   { required: true, message: "线索状态不能为空", trigger: "blur" },
        // ],
      },
      areaSelectData: regionDataArr, //省市区三级联动数据
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
      // 列信息
      columns: [
        {
          key: 0,
          label: `挖需标题`,
          width: "250",
          prop: "title",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 1,
          label: `企业名称`,
          width: "250",
          prop: "companyName",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 2,
          label: `联系人姓名`,
          width: "120",
          prop: "contactName",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 3,
          label: `手机号码`,
          visible: true,
          width: "150",
          prop: "cellphone",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 4,
          label: `跟进人员`,
          visible: true,
          width: "140",
          prop: "userName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 5,
          label: `挖需状态`,
          width: "140",
          prop: "demandStatus",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 6,
          label: `最后跟进时间`,
          width: "180",
          prop: "lastFollowUpTime",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 7,
          label: `未跟进天数`,
          width: "140",
          prop: "unFollowUpDays",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 8,
          label: `角色`,
          width: "140",
          prop: "role",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 9,
          label: `数据来源`,
          width: "140",
          prop: "dataSource",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 10,
          label: `性别`,
          width: "100",
          prop: "gender",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 11,
          label: `法人`,
          width: "140",
          prop: "legalPerson",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 12,
          label: `喜恶`,
          width: "140",
          prop: "hobby",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 13,
          label: `职位`,
          width: "140",
          prop: "position",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 14,
          label: `微信`,
          width: "150",
          prop: "tencentWx",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 15,
          label: `安证有效期`,
          width: "180",
          prop: "safetyPermitsTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 16,
          label: `下次跟进时间`,
          width: "180",
          prop: "lastNextFollowUpTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 17,
          label: `所在地区`,
          width: "250",
          prop: "province",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
      ],

      // 总条数
      total: 0,
      // 挖需记录表格数据
      demandList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 项目导入参数
      upload: {
        // 是否显示弹出层（项目导入）
        open: false,
        // 弹出层标题（项目导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的项目数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/zw/demand/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: undefined,
        title: undefined,
        status: undefined,
        projectType: undefined,
        consultTime: undefined,
        lastFollowUpTime: undefined,
        safetyPermitsTimeEndTime: undefined,
        expireDateEndTime: undefined,
        isConvert: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "挖需标题不能为空", trigger: "blur" },
        ],
        demandStatus: [
          { required: true, message: "挖需状态不能为空", trigger: "blur" },
        ],
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur",
          },
        ],
        projectType: [
          { required: true, message: "不能为空", trigger: "change" },
        ],
      },

      userList: [],
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    dateMonth1: {
      handler(n) {
        this.queryParams.safetyPermitsTimeBeginTime = n != null ? n[0] : "";
        this.queryParams.safetyPermitsTimeEndTime = n != null ? n[1] : "";
      },
    },
    dateMonth2: {
      handler(n) {
        this.queryParams.expireDateBeginTime = n != null ? n[0] : "";
        this.queryParams.expireDateEndTime = n != null ? n[1] : "";
      },
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getList();
    });
  },

  created() {
    const { timeType } = this.$route.params;
    if (timeType) {
      this.queryParams.timeType = timeType;
    }

    // this.getList();
    this.getTreeselect();
  },

  updated() {
    // 在数据更新后执行
    this.$nextTick(() => {
      // myTable是表格的ref属性值
      if (this.$refs.myTable && this.$refs.myTable.doLayout) {
        this.$refs.myTable.doLayout();
      }
    });
  },
  methods: {
    // 排序改变
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },

    // 高级搜索
    setSearch(val) {
      this.getUserList();
      const {
        status,
        keyword,
        deptId,
        dataSource,
        followUpPersonIds,
        lastFollowUpTime,
        dateMonth1,
        dateMonth2,
      } = val;
      this.dateMonth1 = dateMonth1;
      this.dateMonth2 = dateMonth2;
      this.queryParams = {
        ...this.queryParams,
        demandStatus: status,
        keyword,
        deptId,
        dataSource,
        followUpPersonIds,
        lastFollowUpTime,
      };
      this.getList();
    },

    handleQuotedPrice(row) {
      this.showQuotedPrice = true;
      this.quotedPriceForm = row;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 选中省市区
    handleChange(value) {
      console.log(value);
      //value为省市区code数组
      if (value) {
        var provinceCode = CodeToText[value[0]]; //code转为省
        var cityCode = CodeToText[value[1]]; //市
        var orgion = CodeToText[value[2]]; //区
        this.form.province = provinceCode;
        this.form.city = cityCode;
        this.form.area = orgion;
        // this.form.selectedOptions = provinceCode + cityCode + orgion;
      }
    },
    /** 查询挖需记录列表 */
    getList() {
      this.loading = true;
      listDemand(this.queryParams).then((response) => {
        this.demandList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        title: undefined,
        status: 0,
        projectType: undefined,
        consultTime: undefined,
        lastFollowUpTime: undefined,
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
      this.dateMonth1 = [];
      this.dateMonth2 = [];
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
      // this.title = "添加挖需记录";
      this.$router.push({ name: "Demand/add", query: { type: 0 } });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      this.$router.push({ name: "Demand/add", query: { type: 1, id } });
      // this.loading = true;
      // this.reset();
      // const id = row.id || this.ids;
      // getDemand(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.form.province
      //     ? this.$set(this.form, "selectedOptions", [
      //         TextToCode[this.form.province].code,
      //         TextToCode[this.form.province][this.form.city].code,
      //         TextToCode[this.form.province][this.form.city][this.form.area]
      //           .code,
      //       ])
      //     : this.$set(this.form, "selectedOptions", []);
      //   this.open = true;
      //   this.title = "修改挖需记录";
      // });
    },
    handleConvert(form) {
      // this.$router.push({ name: "Demand/add", query: { type: 0 } });
      this.$router.push({
        name: "Opportunity/add",
        query: { type: 2, form: JSON.stringify(form) },
      });
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
            updateDemand(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addDemand(this.form)
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
        .confirm('是否确认删除挖需记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delDemand(ids);
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
        "system/demand/export",
        {
          ...this.queryParams,
        },
        `demand_${new Date().getTime()}.xlsx`
      );
    },
    /** 跟进按钮  */
    // handleFollowUp(row) {
    //   this.followUpOpen = true;
    //   this.followUpFormTitle = "新建跟进";
    //   this.followUpForm.status = row.demandStatus;
    //   this.followUpForm.companyName = row.companyName;
    //   this.followUpForm.contactPerson = row.contactName;
    //   this.followUpForm.followPerson = row.userName;
    //   this.followUpForm.customerId = row.customerId;
    //   this.followUpForm.followedId = row.id;
    // },
    // submitFollowUpForm() {
    //   this.$refs["followUpForm"].validate((valid) => {
    //     if (valid) {
    //       followUp(this.followUpForm).then((response) => {
    //         this.$modal.msgSuccess("新增成功");
    //         this.followUpOpen = false;
    //         this.followUpForm = {};
    //       });
    //     }
    //   });
    // },
    // followUpFormCancel() {
    //   this.followUpOpen = false;
    //   this.followUpForm = {};
    // },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "挖需导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        const link = document.createElement("a");
        let blob = new Blob([response], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + "挖需导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
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
