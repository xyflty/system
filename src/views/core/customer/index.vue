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
          placeholder="关键字"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="客户状态" prop="customerStatus">
        <el-select v-model="queryParams.customerStatus" :clearable="true">
          <el-option
            v-for="customerStatus in commonData.customerStatusList"
            :key="customerStatus.value"
            :label="customerStatus.label"
            :value="customerStatus.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="客户类型" prop="customerType">
        <el-select
          v-model="queryParams.customerType"
          :clearable="true"
          placeholder="客户类型"
        >
          <el-option
            v-for="customerType in commonData.customerTypeList"
            :key="customerType.value"
            :label="customerType.label"
            :value="customerType.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="客户等级" prop="customerGrade">
        <el-select
          v-model="queryParams.customerGrade"
          :clearable="true"
          placeholder="客户等级"
        >
          <el-option
            v-for="customerGrade in commonData.customerGradeList"
            :key="customerGrade.value"
            :label="customerGrade.label"
            :value="customerGrade.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="客户是否成交" prop="isCustomer">
        <el-select
          v-model="queryParams.isCustomer"
          :clearable="true"
          placeholder="客户是否成交"
        >
          <el-option label="成交客户" :value="1" />
          <el-option label="潜在客户" :value="0" />
        </el-select>
      </el-form-item> -->

      <el-form-item label="资质查询" prop="certName">
        <el-input
          v-model="queryParams.certName"
          placeholder="资质查询"
          clearable
        />
      </el-form-item>

      <el-form-item label="所在地区" prop="province">
        <ProvinceSelect
          ref="province"
          size="small"
          placeholder="所在地区"
          :checkStrictly="true"
          :selectedOptions="selectedOptions"
          @change="(e) => (queryParams = { ...queryParams, ...e })"
        />
      </el-form-item>

      <el-form-item label="归属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          appendToBody
          style="margin-left: 10px; max-width: 200px"
          :options="deptOptions"
          value-consists-of="LEAF_PRIORITY"
          :show-count="true"
          size="mini"
          placeholder="归属部门"
        />
      </el-form-item>

      <el-form-item label="数据来源" prop="dataSource">
        <el-select
          v-model="queryParams.dataSource"
          :clearable="true"
          placeholder="数据来源"
        >
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

      <el-form-item label="最后跟进时间" prop="lastFollowUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.lastFollowUpTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="最后跟进时间"
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
      <!-- <el-form-item label="是否复购" prop="repurchaseEnable"> </el-form-item> -->

      <el-form-item label="转客户日期" prop="turnCustomerTime">
        <el-switch
          class="enable"
          v-model="queryParams.repurchaseEnable"
          active-text="非复购"
          inactive-text="含复购"
        >
        </el-switch>
        <el-date-picker
          clearable
          v-model="dateMonth3"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="筛选不完整数据" prop="notOrIsEmptyData">
        <el-select
          v-model="queryParams.notOrIsEmptyData"
          :clearable="true"
          placeholder="筛选不完整数据"
        >
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
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
          v-hasPermi="['core:customer:query']"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
        <PowerSearch :type="5" @submit="setSearch" />
      </el-form-item>
    </el-form>

    <div class="table_actions">
      <PresentationStatistics
        :comparison="statisticContrast"
        :data="statisticData"
        :loading="StatisticsLoading"
      />
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['core:customer:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['core:customer:import']"
          >导入</el-button
        >
      </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleSelect"
            v-hasPermi="['core:opportunity:distinctCompanyList']"
            >客户查重</el-button
          >
        </el-col>
        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="customer"
        ></right-toolbar_2>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="customerList"
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
              v-if="item.prop == 'companyName'"
              @click="
                $router.push({ name: 'Customer/detail', query: { id: row.id } })
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
                  'customerStatus',
                  'customerGrade',
                  'role',
                  'dataSource',
                ].includes(item.prop)
              "
            >
              {{ getLabel(commonData[`${item.prop}List`], row[item.prop]) }}
            </span>
            <span v-else-if="item.prop == 'gender'">
              {{ row.gender == 1 ? "先生" : "女士" }}
            </span>
            <span v-else-if="item.prop == 'isCustomer'">
              {{ row.gender == 1 ? "成交客户" : "潜在客户" }}
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
        width="400"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-chat-dot-round"
            size="mini"
            type="text"
            @click="handleFollowUp(scope.row)"
            v-hasPermi="['core:customer:followUp']"
            >跟进</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:customer:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            @click="handleSetTop(scope.row)"
            v-hasPermi="['core:customer:setTop']"
            >{{ scope.row.isTop ? "取消置顶" : "置顶" }}</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="text"
            @click="handleConvert(scope.row)"
            v-hasPermi="['core:demand:convert']"
            >转为商机</el-button
          >
          <el-button
            icon="el-icon-view"
            size="mini"
            type="text"
            @click="handleQualification(scope.row)"
            v-hasPermi="['core:buildingQualification:getQualification']"
            >资质查看</el-button
          >
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleSea(scope.row)"
            v-hasPermi="['core:customerSea:putInSea']"
            >放入公海</el-button
          >
          <!-- <el-button
            icon="el-icon-sort"
            size="mini"
            type="text"
            @click="handleTransfer(scope.row)"
            >转移</el-button
          > -->
          <el-button
            v-if="scope.row.userId == user.userId"
            icon="el-icon-share"
            size="mini"
            type="text"
            v-hasPermi="['core:customer:share']"
            @click="handleShare(scope.row)"
            >共享</el-button
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

    <el-dialog
      title="客户查重"
      :visible="show"
      width="50%"
      append-to-body
      :close-on-click-modal="true"
      @close="show = false"
    >
      <el-table
        v-loading="reLoading"
        :data="reList"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          label="公司名称"
          align="center"
          prop="companyName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="重复客户数量"
          align="center"
          prop="num"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-d-arrow-right"
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
              v-hasPermi="['core:opportunity:list']"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="reTotal > 0"
        :total="reTotal"
        :page.sync="reQuery.pageNum"
        :limit.sync="reQuery.pageSize"
        @pagination="getDistinctCompanyList"
      />
    </el-dialog>

    <!-- 资质查看 -->
    <AptitudeModel :visible.sync="showDialog" :archiveId.sync="archiveId" />

    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="followUpType"
      @success="handleSuccess"
    />

    <!-- 转移 -->
    <TransferModel
      :visible.sync="transferVisible"
      :ids="transferIds"
      :rowId="rowId"
      type="customer"
      :tableApi="getList"
      :tableRef="tableRefName"
    ></TransferModel>

    <!-- 分享弹出框 -->
    <ShareModel
      :visible.sync="shareVisible"
      :form="shareForm"
      @share="shareSubmit"
      @reset="shareReset"
    ></ShareModel>
  </div>
</template>

<script>
import {
  listCustomer,
  customerArchiveListCount,
  getCustomer,
  delCustomer,
  followUp,
  importTemplate,
  getDistinctCompanyList,
  putInSea,
} from "@/api/core/customer";
import {
  addCustomerArchive,
  updateCustomerArchive,
  setTop,
} from "@/api/core/customerArchive";

import { listCustomerArchive } from "@/api/core/customerArchive";

import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import { getToken } from "@/utils/auth";

import { listUser } from "@/api/system/user";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapState } from "vuex";
import PowerSearch from "@/views/core/customer/search";
import { list } from "@/api/common.js";

import TransferModel from "@/views/components/TransferModel.vue";

import AptitudeModel from "@/views/core/components/model/AptitudeModel.vue";

import ShareModel from "../components/shareModel.vue";
import { formatterCallback } from "@/utils/common";
import { share } from "../minixs/share";

export default {
  name: "Customer",
  components: {
    followUpDialog,
    Treeselect,
    PowerSearch,
    TransferModel,
    ShareModel,
    AptitudeModel,
  },
  mixins: [share, followUpMinixs],
  data() {
    return {
      selectedOptions: [],

      showDialog: false,

      archiveId: "",
      show: false,
      reLoading: false,
      reList: [],
      reQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      reTotal: 0,

      dateMonth1: [],
      dateMonth2: [],
      dateMonth3: [],

      deptOptions: [],
      // 跟进弹出框标题
      followUpFormTitle: "",

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
          label: `企业名称`,
          width: "250",
          prop: "companyName",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        // {
        //   key: 1,
        //   label: `客户状态`,
        //   width: "140",
        //   prop: "customerStatus",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          key: 2,
          label: `客户等级`,
          width: "140",
          prop: "customerGrade",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        // {
        //   key: 3,
        //   label: `联系人`,
        //   width: "140",
        //   prop: "contactName",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        // {
        //   key: 4,
        //   label: `手机号码`,
        //   width: "150",
        //   prop: "cellphone",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          key: 5,
          label: `跟进人`,
          width: "180",
          prop: "userName",
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
          sortable: "custom",
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
          prop: "position",
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
        // {
        //   key: 18,
        //   label: `是否成交`,
        //   width: "140",
        //   prop: "isCustomer",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 19,
          label: `距离最近成交天数`,
          width: "250",
          prop: "recentlyDealTimeDays",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
      ],
      // 总条数
      total: 0,
      // 客户记录表格数据
      customerList: [],
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
        url: process.env.VUE_APP_BASE_API + "/zw/customer/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        notOrIsEmptyData: undefined,
        userId: undefined,
        companyName: undefined,
        contactName: undefined,
        gender: undefined,
        role: undefined,
        position: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        safetyPermitsTimeEndTime: undefined,
        turnCustomerTime: undefined,

        dataSource: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        email: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        tencentQq: undefined,
        tencentWx: undefined,
        hobby: undefined,
        isCustomer: 1,
        searchDesign: false,
        repurchaseEnable: false,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        // customerStatus: [
        //   { required: true, message: "客户状态不能为空", trigger: "blur" },
        // ],
      },

      userList: [],
      setShowDate: false, // 根据条件判断是否从首页点击过来

      transferIds: [],
      transferVisible: false,
      tableRefName: null,
      rowId: "", //当前行id

      shareType: "customer",

      // 统计对照表
      statisticContrast: [
        {
          label: "客户数量:",
          value: "customerCount",
        },
        // {
        //   label: "跟进人员数量:",
        //   value: "clueFollowUpCount",
        // },
        {
          label: "订单数量:",
          value: "orderCount",
        },
        {
          label: "VIP数量:",
          value: "gradeCountVip",
        },
        {
          label: "A类数量:",
          value: "gradeCountA",
        },
        {
          label: "B类数量:",
          value: "gradeCountB",
        },
        {
          label: "C数量:",
          value: "gradeCountC",
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
        {
          label: "未知客户数量:",
          value: "unknownCustomerCount",
        },
      ],
      statisticData: {},
      StatisticsLoading: false,

      followUpType: 5,
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState(["enterpriseData"]),
    ...mapState(["user"]),
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
    dateMonth3: {
      handler(n) {
        this.queryParams.beginTurnCustomerTime = n != null ? n[0] : "";
        this.queryParams.endTurnCustomerTime = n != null ? n[1] : "";
      },
    },
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
    handleSea(row) {
      this.$modal
        .confirm('是否确认将客户记录编号为"' + row.id + '"的数据项放入公海？')
        .then(() => {
          return putInSea({ archiveId: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("放入公海成功！");
        });
    },

    handleQualification(row) {
      this.showDialog = true;
      this.archiveId = row.id;
    },

    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.columns));
      list({ pageName: "customer" }).then((res) => {
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
    handleDetail(row) {
      this.queryParams.keyword = row.companyName;
      this.getList();
      this.show = false;
    },
    handleSelect() {
      this.show = true;
      this.getDistinctCompanyList();
    },
    getDistinctCompanyList() {
      this.reLoading = true;
      getDistinctCompanyList(this.reQuery).then((res) => {
        this.reList = res.rows;
        this.reTotal = res.total;
        this.reLoading = false;
      });
    },
    handleQuotedPrice(row) {
      this.showQuotedPrice = true;
      this.quotedPriceForm = row;
    },

    // 排序改变
    sortChange({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },

    // 高级搜索
    setSearch(val) {
      this.getUserList();

      const {
        province,
        city,
        area,
        safetyPermitsTimeBeginTime,
        safetyPermitsTimeEndTime,
        expireDateBeginTime,
        expireDateEndTime,
        beginTurnCustomerTime,
        endTurnCustomerTime,
      } = val;
      province && (this.selectedOptions = [province, city, area]);

      safetyPermitsTimeBeginTime &&
        (this.dateMonth1 = [
          safetyPermitsTimeBeginTime,
          safetyPermitsTimeEndTime,
        ]);
      expireDateBeginTime &&
        (this.dateMonth2 = [expireDateBeginTime, expireDateEndTime]);
      beginTurnCustomerTime &&
        (this.dateMonth3 = [beginTurnCustomerTime, endTurnCustomerTime]);

      this.queryParams = {
        ...this.queryParams,
        ...val,
      };
      this.getList();
    },

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

    // 选中省市区
    handleChange(value) {
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
    /** 查询客户记录列表 */
    getList() {
      this.loading = true;
      listCustomerArchive(this.queryParams).then((response) => {
        this.customerList = response.rows;
        this.total = response.total;

        this.loading = false;

        setTimeout(() => {
          if (this.setShowDate == true) {
            this.customerList.map((t) => {
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
    getCustomerArchiveListCount() {
      this.StatisticsLoading = true;
      customerArchiveListCount(this.queryParams).then((res) => {
        this.statisticData = res.data || {};
        this.StatisticsLoading = false;
      });
    },

    handleConvert(form) {
      // form.archiveId = form.id;
      // form.id = undefined;
      // this.$router.push({ name: "Demand/add", query: { type: 0 } });
      this.$router.push({
        name: "Opportunity/add",
        query: { type: 0, form: JSON.stringify(form) },
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
        userId: undefined,
        companyName: undefined,
        contactName: undefined,
        gender: undefined,
        role: undefined,
        position: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        dataSource: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        email: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        tencentQq: undefined,
        tencentWx: undefined,
        hobby: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        searchDesign: false,
        repurchaseEnable: false,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      setTimeout(() => {
        this.getList();
        this.getCustomerArchiveListCount();
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateMonth1 = [];
      this.dateMonth2 = [];
      this.dateMonth3 = [];
      this.$refs.province.value = [];
      this.queryParams.city = undefined;
      this.queryParams.area = undefined;
      this.queryParams.repurchaseEnable = false;
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
      // this.title = "添加客户记录";
      this.$router.push({ name: "Customer/add", query: { type: 0 } });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Customer/add", query: { type: 1, id } });
      // getCustomer(id).then((response) => {
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
      //   this.title = "修改客户记录";
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
            updateCustomerArchive(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addCustomerArchive(this.form)
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
        .confirm('是否确认删除客户记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delCustomer(ids);
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
        "system/customer/export",
        {
          ...this.queryParams,
        },
        `customer_${new Date().getTime()}.xlsx`
      );
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "客户导入";
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
        link.download = new Date().getTime() + "客户导入模板";
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

    // 格式化
    formatterFn(row, column) {
      return formatterCallback(
        this.commonData.threeKuEnum,
        row.warningStatusCode
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRefName = this.$refs.myTable;
    });
    this.getCustomerArchiveListCount();
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}

.enable {
  margin-right: 15px;
}
</style>
