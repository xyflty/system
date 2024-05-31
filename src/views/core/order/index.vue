<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="搜索关键字" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="搜索关键字"
          clearable
        />
      </el-form-item>
      <el-form-item label="我方签约人" prop="ourSigner">
        <el-input
          v-model="queryParams.ourSigner"
          placeholder="我方签约人"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          :clearable="true"
          placeholder="订单状态"
        >
          <el-option
            v-for="orderStatus in commonData.orderStatusList"
            :key="orderStatus.value"
            :label="orderStatus.label"
            :value="orderStatus.value"
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
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="queryParams.role"
          :clearable="true"
          placeholder="角色"
        >
          <el-option
            v-for="item in commonData.roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-select
          v-model="queryParams.customerType"
          :clearable="true"
          placeholder="客户类型"
        >
          <el-option
            v-for="option in commonData.customerTypeList"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="签单日期" prop="signTime">
        <el-date-picker
          clearable
          v-model="queryParams.signTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择签单日期"
        >
        </el-date-picker>
      </el-form-item> -->

      <el-form-item label="签单日期" prop="signTime">
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

      <el-form-item label="归属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          appendToBody
          style="margin-left: 10px; max-width: 200px"
          :options="deptOptions"
          value-consists-of="LEAF_PRIORITY"
          :show-count="true"
          placeholder="归属部门"
        />
      </el-form-item>

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

      <el-form-item label="付款方式" prop="paymentMethod">
        <el-select
          v-model="queryParams.paymentMethod"
          :clearable="true"
          placeholder="付款方式"
        >
          <el-option
            v-for="paymentMethod in commonData.paymentMethodList"
            :key="paymentMethod.value"
            :label="paymentMethod.label"
            :value="paymentMethod.value"
          />
        </el-select>
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
      <el-form-item label="前两个月签单" prop="endBeforeSignTime">
        <el-date-picker
          clearable
          v-model="queryParams.endBeforeSignTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="前两个月签单"
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
      <el-form-item label="" prop="searchDesign">
        <el-checkbox v-model="queryParams.searchDesign"
          >快捷查询设计资质</el-checkbox
        >
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
        <PowerSearch :type="4" @submit="setSearch" />
      </el-form-item>
    </el-form>

    <div class="table_actions">
      <PresentationStatistics
        :comparison="statisticContrast"
        :data="statisticData"
        :loading="StatisticsLoading"
      />
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['core:order:add']"
          >新增</el-button
        >
      </el-col> -->
        <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['core:order:import']"
          >导入</el-button
        >
      </el-col> -->
        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="order"
        ></right-toolbar_2>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="orderList"
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
            <div
              class="ableClick"
              v-if="item.prop == 'title'"
              @click="
                $router.push({ name: 'Order/detail', query: { id: row.id } })
              "
            >
              {{ row.title }}
            </div>
            <div
              class="ableClick"
              v-else-if="item.prop == 'companyName'"
              @click="
                $router.push({
                  name: 'Customer/detail',
                  query: { id: row.archiveId, type: '1' },
                })
              "
            >
              <p>{{ row.companyName }}</p>
              <p v-if="row.shareUserId" class="share_sign">
                <span v-if="user.userId == row.shareUserId"
                  >( 来自 {{ row.userName }} 的共享 )</span
                >
                <span v-else>( 已共享给 {{ row.shareUserName }} )</span>
              </p>
            </div>
            <span
              v-else-if="
                [
                  'orderStatus',
                  'role',
                  'paymentMethod',
                  'orderType',
                  'dataSource',
                ].includes(item.prop)
              "
            >
              {{ getLabel(commonData[`${item.prop}List`], row[item.prop]) }}
            </span>
            <span v-else-if="item.prop == 'gender'">
              {{ row.gender == 1 ? "先生" : "女士" }}
            </span>
            <span v-else-if="item.prop == 'customerType'">
              {{ formatter(commonData.customerTypeList, row.customerType) }}
            </span>
            <span v-else-if="item.prop == 'province' && row.province">
              {{ row.province }} - {{ row.city }} - {{ row.area }}
            </span>
            <span v-else-if="item.prop == 'signTime'">{{
              parseTime(row.signTime)
            }}</span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" align="center" width="350" fixed="right">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-chat-dot-round"
            size="mini"
            type="text"
            @click="handleFollowUp(scope.row)"
            v-hasPermi="['core:order:followUp']"
            >跟进</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            :disabled="scope.row.synergyOrderStatus == 2"
            v-hasPermi="['core:order:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            @click="handleSetTop(scope.row)"
            v-hasPermi="['core:order:setTop']"
            >{{ scope.row.isTop ? "取消置顶" : "置顶" }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-chat-dot-round"
            v-hasPermi="['core:order:synergy']"
            :disabled="scope.row.synergyOrderStatus == 2"
            @click="synergyOrdering(scope.row)"
            >协同下单</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-chat-dot-round"
            @click="increaseOrDecreaseOrder(scope.row)"
            >项目变更</el-button
          >
          <el-popconfirm
            title="是否删除当前选中的表格行数据？"
            @confirm="handleOrderDel(scope.row)"
            style="display: block"
          >
            <el-button
              slot="reference"
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['core:order:delete']"
              >删除</el-button
            >
          </el-popconfirm>
          <!-- <el-button
            icon="el-icon-sort"
            size="mini"
            type="text"
            @click="handleTransfer(scope.row)"
            >转移</el-button
          > -->
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

    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="4"
      @success="handleSuccess"
    />

    <!-- 线索导入对话框 -->
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

    <!-- 项目变更 -->
    <order-drawer
      v-if="rowItem"
      :drawerForm="increaseOrDecreaseOrderForm"
      :visiable.sync="increaseOrDecreaseOrderDrawer"
      :id="rowId"
      :tableRow="rowItem"
      @cancel="handleCancel"
      @submit="handleSubmit"
    ></order-drawer>

    <!-- 转移 -->
    <TransferModel
      :visible.sync="transferVisible"
      :ids="transferIds"
      :rowId="rowId"
      type="order"
      :tableApi="getList"
      :tableRef="tableRefName"
    ></TransferModel>
  </div>
</template>

<script>
import {
  listOrder,
  orderListCount,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
  setTop,
  followUp,
  importTemplate,
  zwOrderDel,
} from "@/api/core/order";
import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";
import { listUser } from "@/api/system/user";
import PowerSearch from "@/views/core/order/search";
import { getToken } from "@/utils/auth";
import { list } from "@/api/common.js";

// 项目变更
import orderDrawer from "@/views/components/increaseOrDecreaseOrder.vue";
import {
  xtOrderProjectChangeAuditGetItemModifiedInfo,
  xtProjectChangeAuditAuditSubmit,
} from "@/api/xt";
import { formatterCallback } from "@/utils/common.js";
import TransferModel from "@/views/components/TransferModel.vue";
export default {
  name: "Order",
  components: {
    followUpDialog,
    Treeselect,
    PowerSearch,
    orderDrawer,
    TransferModel,
  },
  mixins: [followUpMinixs],
  data() {
    return {
      dateMonth1: [],
      dateMonth2: [],
      dateMonth: [],
      deptOptions: [],
      // 跟进弹出框标题
      followUpFormTitle: "",
      // 是否显示跟进弹出框

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
      // 商机下拉框列表
      opportunityList: [],
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
          label: `订单编号`,
          width: "250",
          prop: "orderCode",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 1,
          label: `订单标题`,
          width: "250",
          prop: "title",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 2,
          label: `关联客户`,
          width: "250",
          prop: "companyName",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 3,
          label: `签单日期`,
          visible: true,
          width: "180",
          prop: "signTime",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 4,
          label: `订单总金额`,
          visible: true,
          width: "140",
          prop: "price",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 5,
          label: `订单状态`,
          width: "140",
          prop: "orderStatus",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        // {
        //   key: 6,
        //   label: `订单类型`,
        //   width: "140",
        //   prop: "orderType",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          key: 7,
          label: `订单开始时间`,
          width: "180",
          prop: "beginTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 8,
          label: `订单结束时间`,
          width: "180",
          prop: "endTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 9,
          label: `客户签约人`,
          width: "180",
          prop: "customerSigner",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 10,
          label: `我方签约人`,
          width: "180",
          prop: "ourSigner",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 11,
          label: `付款方式`,
          width: "180",
          prop: "paymentMethod",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 12,
          label: `跟进人`,
          width: "180",
          prop: "userName",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 20,
          label: `客户类型`,
          width: "140",
          prop: "customerType",
          visible: true,
          showOverflow: true,
        },
        // {
        //   key: 13,
        //   label: `角色`,
        //   width: "140",
        //   prop: "role",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 14,
        //   label: `性别`,
        //   width: "140",
        //   prop: "gender",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 15,
        //   label: `法人`,
        //   width: "140",
        //   prop: "legalPerson",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 16,
        //   label: `职位`,
        //   width: "140",
        //   prop: "position",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 17,
        //   label: `微信`,
        //   width: "140",
        //   prop: "tencentWx",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 18,
          label: `安证有效期`,
          width: "180",
          prop: "safetyPermitsTime",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        // {
        //   key: 19,
        //   label: `所在地区`,
        //   width: "180",
        //   prop: "province",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 21,
          label: `数据来源`,
          width: "180",
          prop: "dataSource",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
      ],

      // 总条数
      total: 0,
      // 订单记录表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: undefined,
        userId: undefined,
        title: undefined,
        price: undefined,
        dataSource: undefined,
        signTime: undefined,
        beginTime: undefined,
        endTime: undefined,
        customerSigner: undefined,
        ourSigner: undefined,
        paymentMethod: undefined,
        safetyPermitsTimeEndTime: undefined,
        expireDateEndTime: undefined,
        status: undefined,
        lastFollowUpTime: undefined,
        searchDesign: false,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "订单标题不能为空", trigger: "blur" },
        ],
        orderStatus: [
          { required: true, message: "订单状态不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "订单金额不能为空", trigger: "blur" },
        ],
        signTime: [
          { required: true, message: "签单日期不能为空", trigger: "blur" },
        ],
        orderType: [
          { required: true, message: "订单类型不能为空", trigger: "blur" },
        ],
      },
      userList: [],
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
        url: process.env.VUE_APP_BASE_API + "/zw/order/importData",
      },
      // 项目变更弹出框
      increaseOrDecreaseOrderDrawer: false,
      increaseOrDecreaseOrderForm: {
        auditRemark: "",
        auditUserIds: [
          {
            id: "",
          },
        ],
        toUserIds: [],
      },
      rowId: "",
      rowItem: null,

      transferIds: [],
      transferVisible: false,
      tableRefName: null,
      rowId: "", //当前行id

      // 统计对照表
      statisticContrast: [
        {
          label: "订单数量:",
          value: "orderCount",
        },
        // {
        //   label: "跟进人员数量:",
        //   value: "clueFollowUpCount",
        // },
        {
          label: "订单金额:",
          value: "orderPriceCount",
        },
        {
          label: "签单项目数量:",
          value: "orderProjectCount",
        },

        {
          label: "企业客户数量:",
          value: "companyCustomerCount",
        },
        {
          label: "个人客户数量:",
          value: "personalCustomerCount",
        },
        {
          label: "渠道客户数量:",
          value: "channelCustomerCount",
        },
      ],
      statisticData: {},
      StatisticsLoading: false,
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState(["enterpriseData"]),
    ...mapState(["user"]),
  },

  beforeRouteEnter(to, from, next) {
    if (from.name == "Index") {
      next((vm) => {
        if (vm.enterpriseData.dataId == "") {
        } else {
          vm.setShowDate = true;
        }
      });
    }

    next((vm) => {
      console.log("555");
      vm.getList();
      vm.getCloumns();
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
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.beginSignTime = n != null ? n[0] : "";
        this.queryParams.endSignTime = n != null ? n[1] : "";
      },
    },
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

  activated() {
    this.$nextTick(() => {
      // myTable是表格的ref属性值
      if (this.$refs.myTable && this.$refs.myTable.doLayout) {
        this.$refs.myTable.doLayout();
      }
    });
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
    handleTransfer(row) {
      this.transferVisible = true;
      this.transferIds = [row.userId];
      this.rowId = row.id;
    },
    formatter(data, val) {
      return formatterCallback(data, val);
    },
    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.columns));

      list({ pageName: "order" }).then((res) => {
        if (res.rows && res.rows.length) {
          let data = res.rows.map((item) => ({
            key: item.tableColumnKey,
            label: item.label,
            width: item.width,
            prop: item.prop,
            visible: item.visible,
            showOverflow: item.showOverFlow,
            sortable: item.sortable,
          }));

          let arr = data.filter((item) => item.visible);
          console.log({ columns });

          let result = columns.filter((item) => {
            item.visible = false;
            return !arr.find((obj) => {
              return obj.key === item.key;
            });
          });

          this.columns = [...arr, ...result];
        }
      });
    },
    // 排序改变
    sortChange({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderCategory = order === "descending" ? "desc" : "asc";
      this.getList();
    },

    // 高级搜索
    setSearch(val) {
      this.getUserList();
      const {
        beginSignTime,
        endSignTime,
        safetyPermitsTimeBeginTime,
        safetyPermitsTimeEndTime,
        expireDateBeginTime,
        expireDateEndTime,
      } = val;

      safetyPermitsTimeBeginTime &&
        (this.dateMonth1 = [
          safetyPermitsTimeBeginTime,
          safetyPermitsTimeEndTime,
        ]);
      expireDateBeginTime &&
        (this.dateMonth2 = [expireDateBeginTime, expireDateEndTime]);

      beginSignTime && (this.dateMonth = [beginSignTime, endSignTime]);

      this.queryParams = {
        ...this.queryParams,
        ...val,
      };
      this.getList();
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
    getList() {
      this.loading = true;
      listFollowUp(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;

        this.loading = false;
      });
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //商机下拉框改变
    opportunityChange(obj) {
      this.$set(this.form, "customerId", obj.customerId);
      this.$set(this.form, "companyName", obj.companyName);
    },
    /** 查询订单记录列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
        this.total = response.total;

        this.loading = false;

        setTimeout(() => {
          if (this.setShowDate == true) {
            this.orderList.map((t) => {
              if (t.id == this.enterpriseData.dataId) {
                this.handleFollowUp(t);
                this.setShowDate = false;
                this.$store.commit("TRANSMIT_Id", "");
              }
            });
          }
        }, 1000);
      });
    },
    getOrderListCount() {
      this.StatisticsLoading = true;
      orderListCount(this.queryParams).then((res) => {
        this.statisticData = res.data || {};
        this.StatisticsLoading = false;
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
        userId: undefined,
        title: undefined,
        price: undefined,
        signTime: undefined,
        beginTime: undefined,
        endTime: undefined,
        dataSource: 0,
        customerSigner: undefined,
        ourSigner: undefined,
        paymentMethod: undefined,
        status: 0,
        lastFollowUpTime: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        searchDesign: false,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      setTimeout(() => {
        this.getList();
        this.getOrderListCount();
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateMonth = [];
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
      this.$router.push({ name: "Order/add", query: { type: 0 } });
      // this.reset();
      // this.open = true;
      // this.title = "添加订单记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      this.$router.push({ name: "Order/add", query: { type: 1, id } });
      // this.loading = true;
      // this.reset();
      // const id = row.id || this.ids;
      // getOrder(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改订单记录";
      // });
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
            updateOrder(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addOrder(this.form)
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
        .confirm('是否确认删除订单记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delOrder(ids);
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
        "system/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
    getOpportunityList() {
      getOpportunityList().then((response) => {
        this.opportunityList = response;
      });
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "订单导入";
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
        link.download = new Date().getTime() + "订单导入模板";
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
    // 协同下单
    synergyOrdering(row) {
      this.$router.push({ name: "SynergyConfig", query: { id: row.id } });
    },
    // 项目变更
    increaseOrDecreaseOrder(row) {
      this.rowId = row.id;
      this.rowItem = row;
      // let sendParams = {
      //   orderId:row.id
      // }
      xtOrderProjectChangeAuditGetItemModifiedInfo(row.id).then((res) => {
        this.increaseOrDecreaseOrderDrawer = true;
        this.$nextTick(() => {
          this.$set(
            this.increaseOrDecreaseOrderForm,
            "zwOrderProjectVoList",
            res.data.zwOrderProjectVoList
          );
          this.$set(
            this.increaseOrDecreaseOrderForm,
            "xtOrderProjectChangeAuditList",
            res.data.xtOrderProjectChangeAuditList
          );
        });
      });
    },
    handleCancel() {
      this.rowId = "";
      this.rowItem = null;
      this.increaseOrDecreaseOrderForm = {
        auditRemark: "",
        auditUserIds: [
          {
            id: "",
          },
        ],
        toUserIds: [],
      };
      this.increaseOrDecreaseOrderDrawer = false;
    },
    handleSubmit({ model, form }) {
      form.validate((valid) => {
        if (valid) {
          let auditUserIds = model.auditUserIds.map((item) => item.id);
          const { xtOrderProjectChangeAuditList, remark, toUserIds } = model;

          let sendData = {
            auditRemark: remark,
            toUserIds: toUserIds,
            xtOrderProjectChangeAuditList: xtOrderProjectChangeAuditList,
            auditUserIds,
            orderId: this.rowId,
          };

          xtProjectChangeAuditAuditSubmit(sendData).then((res) => {
            if (res.code === 200) {
              this.handleCancel();
              this.$message.success("已成功提交");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请填写必填信息");
        }
      });
    },

    // 删除订单
    handleOrderDel(row) {
      zwOrderDel(row.id).then((res) => {
        if (res.code === 200) {
          this.getList();
          this.$message.error("已删除");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRefName = this.$refs.myTable;
    });
    this.getOrderListCount();
  },
};
</script>
<style scoped>
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
