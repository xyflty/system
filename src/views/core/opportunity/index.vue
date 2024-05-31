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
      <el-form-item label="商机状态" prop="opportunityStatus">
        <el-select
          v-model="queryParams.opportunityStatus"
          :clearable="true"
          placeholder="商机状态"
        >
          <el-option
            v-for="opportunityStatus in commonData.opportunityStatusList"
            :key="opportunityStatus.value"
            :label="opportunityStatus.label"
            :value="opportunityStatus.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商机是否流失" prop="isLoss">
        <el-select
          v-model="queryParams.isLoss"
          :clearable="true"
          placeholder="商机是否流失"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" :clearable="true">
          <el-option
            v-for="projectType in commonData.projectTypeList"
            :key="projectType.value"
            :label="projectType.label"
            :value="projectType.value"
          />
        </el-select>
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
      <el-form-item label="最后跟进时间" prop="FollowUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.FollowUpTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下次跟进时间" prop="NextFollowUpTime">
        <el-date-picker
          clearable
          v-model="queryParams.NextFollowUpTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="转为商机时间" prop="ConvertTime">
        <el-date-picker
          clearable
          v-model="queryParams.ConvertTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
        <PowerSearch :type="3" @submit="setSearch" />
      </el-form-item>
    </el-form>

    <div class="table_actions">
      <PresentationStatistics
        :comparison="statisticContrast"
        :data="statisticData"
      />
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['core:opportunity:add']"
          >新增</el-button
        >
      </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="handleSelect"
            v-hasPermi="['core:opportunity:distinctCompanyList']"
            >商机查重</el-button
          >
        </el-col>

        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="opportunity"
        ></right-toolbar_2>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="opportunityList"
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
                $router.push({
                  name: 'Opportunity/detail',
                  query: { id: row.id },
                })
              "
              >{{ row.title }}</span
            >
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
                  'opportunityStatus',
                  'role',
                  'projectType',
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
            <span v-else>{{ row[item.prop] }} </span>
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
            :disabled="scope.row.isLoss == 1"
            @click="handleFollowUp(scope.row)"
            v-hasPermi="['core:opportunity:followUp']"
            >跟进</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :disabled="scope.row.isLoss == 1"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:opportunity:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            :disabled="scope.row.isLoss == 1"
            @click="handleSetTop(scope.row)"
            v-hasPermi="['core:opportunity:setTop']"
            >{{ scope.row.isTop ? "取消置顶" : "置顶" }}</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-bell"
            :disabled="scope.row.isLoss == 1"
            @click="handleQuotedPrice(scope.row)"
            v-hasPermi="['core:auditReferPrice:add']"
            >报价</el-button
          >

          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="text"
            :disabled="scope.row.isLoss == 1"
            @click="handleConvert(scope.row)"
            v-hasPermi="['core:opportunity:convert']"
            >转为订单</el-button
          >

          <el-button
            icon="el-icon-bottom"
            size="mini"
            type="text"
            :disabled="scope.row.isLoss == 1"
            @click="setLoss(scope.row)"
            v-hasPermi="['core:opportunity:setLoss']"
            >流失</el-button
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
            icon="el-icon-view"
            size="mini"
            type="text"
            @click="handleContactInfoList(scope.row)"
            v-hasPermi="['core:contactInfo:getContactInfoList']"
            >查看联系人</el-button
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
      title="商机查重"
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

    <!-- 联系人查看 -->
    <AptitudeModel
      type="Contact"
      :visible.sync="showDialog1"
      :archiveId.sync="archiveId"
    />

    <!-- 资质查看 -->
    <AptitudeModel :visible.sync="showDialog" :archiveId.sync="archiveId" />

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="3"
      @success="handleSuccess"
    />

    <quotedPrice
      :show.sync="showQuotedPrice"
      :quotedPriceForm="quotedPriceForm"
    />

    <!-- 转移 -->
    <TransferModel
      :visible.sync="transferVisible"
      :ids="transferIds"
      :rowId="rowId"
      type="opportunity"
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
  listOpportunity,
  getOpportunity,
  delOpportunity,
  addOpportunity,
  updateOpportunity,
  setTop,
  followUp,
  getDistinctCompanyList,
  setLoss,
} from "@/api/core/opportunity";

import followUpDialog from "../components/followUp.vue";
import { followUpMinixs } from "@/mixins/followUp.js";

import { listUser } from "@/api/system/user";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import quotedPrice from "@/views/core/demand/components/quotedPrice";

import { mapState } from "vuex";

import PowerSearch from "@/views/core/opportunity/search";
import { list } from "@/api/common.js";
import { formatterCallback } from "@/utils/common.js";
import TransferModel from "@/views/components/TransferModel.vue";

import AptitudeModel from "@/views/core/components/model/AptitudeModel.vue";
import ShareModel from "../components/shareModel.vue";
import { share } from "../minixs/share";

export default {
  name: "Opportunity",
  components: {
    followUpDialog,
    Treeselect,
    PowerSearch,
    quotedPrice,
    TransferModel,
    ShareModel,
    AptitudeModel,
  },
  mixins: [share, followUpMinixs],
  data() {
    return {
      showDialog1: false,

      showDialog: false,
      // 当前选中的数据
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
      showQuotedPrice: false,
      quotedPriceForm: {},

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
          label: `商机标题`,
          width: "250",
          prop: "title",
          visible: true,
          showOverflow: true,
          sortable: "custom",
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
          label: `商机状态`,
          width: "140",
          prop: "opportunityStatus",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 3,
          label: `跟进记录`,
          width: "100",
          prop: "followUpCount",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        // {
        //   key: 4,
        //   label: `项目类型`,
        //   visible: true,
        //   width: "140",
        //   prop: "projectType",
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          key: 5,
          label: `最后跟进时间`,
          width: "180",
          prop: "lastFollowUpTime",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 6,
          label: `未跟进天数`,
          width: "140",
          prop: "unFollowUpDays",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },

        {
          key: 7,
          label: `角色`,
          width: "140",
          prop: "role",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 8,
          label: `数据来源`,
          width: "140",
          prop: "dataSource",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 9,
          label: `性别`,
          width: "100",
          prop: "gender",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 10,
          label: `法人`,
          width: "140",
          prop: "legalPerson",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 11,
          label: `喜恶`,
          width: "140",
          prop: "hobby",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 12,
          label: `职位`,
          width: "140",
          prop: "position",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 13,
          label: `微信`,
          width: "150",
          prop: "tencentWx",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 14,
          label: `安证有效期`,
          width: "150",
          prop: "safetyPermitsTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 15,
          label: `下次跟进时间`,
          width: "180",
          prop: "lastNextFollowUpTime",
          visible: false,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 16,
          label: `跟进人`,
          width: "180",
          prop: "userName",
          visible: true,
          showOverflow: true,
          sortable: false,
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
        {
          key: 18,
          label: `客户类型`,
          width: "140",
          prop: "customerType",
          visible: true,
          showOverflow: true,
        },
      ],

      // 总条数
      total: 0,
      // 商机记录表格数据
      opportunityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        customerId: undefined,
        userId: undefined,
        title: undefined,
        opportunityStatus: undefined,
        projectType: undefined,
        consultTimee: undefined,
        FollowUpTime: null,
        safetyPermitsTimeEndTime: undefined,
        expireDateEndTime: undefined,
        isConvert: 0,
        isLoss: "",
        NextFollowUpTime: null,
        ConvertTime: null,
        searchDesign: false,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "商机标题不能为空", trigger: "blur" },
        ],
        opportunityStatus: [
          {
            required: true,
            message: "商机状态不能为空",
            trigger: "blur",
          },
        ],
        projectType: [
          {
            required: true,
            message: "项目类型不能为空",
            trigger: "change",
          },
        ],
        companyName: [
          {
            required: true,
            message: "企业名称不能为空",
            trigger: "blur",
          },
        ],
      },

      userList: [],
      setShowDate: false, // 根据条件判断是否从首页点击过来

      transferIds: [],
      transferVisible: false,
      tableRefName: null,
      rowId: "",

      // 统计对照表
      statisticContrast: [
        {
          label: "商机数量:",
          value: "opportunityCount",
        },
        {
          label: "商机关联项目数量:",
          value: "opportunityProjectCount",
        },
        // {
        //   label: "跟进人员数量:",
        //   value: "opportunityFollowUpCount",
        // },
        {
          label: "企业客户数量:",
          value: "company",
        },
        {
          label: "个人客户数量:",
          value: "personal",
        },
        {
          label: "渠道客户数量:",
          value: "channel",
        },
        {
          label: "未知客户类型数量:",
          value: "other",
        },
      ],
      statisticData: {},
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
  },

  beforeRouteEnter(to, from, next) {
    if (from.name == "Index") {
      next((vm) => {
        console.log(vm.enterpriseData, "增加监听");
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
    formatter(data, val) {
      return formatterCallback(data, val);
    },
    handleContactInfoList(row) {
      this.showDialog1 = true;
      this.archiveId = row.archiveId;
    },

    handleQualification(row) {
      this.showDialog = true;
      this.archiveId = row.archiveId;
    },

    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.columns));
      list({ pageName: "opportunity" }).then((res) => {
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
          console.log(res.rows, "接口返回数据");
          console.log(data, "data");
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

    setLoss(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认将商机为"' + row.title + '"的数据项转为流失？')
        .then(() => {
          this.loading = true;
          return setLoss({ id: ids, isLoss: 1 });
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("流失成功");
        })
        .finally(() => {
          this.loading = false;
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

    /** 查询商机记录列表 */
    getList() {
      this.loading = true;

      const { FollowUpTime, NextFollowUpTime, ConvertTime } = this.queryParams;
      console.log(FollowUpTime, NextFollowUpTime, ConvertTime);
      let sendData = {
        ...this.queryParams,
        beginLastFollowUpTime: FollowUpTime != null ? FollowUpTime[0] : "",
        endLastFollowUpTime: FollowUpTime != null ? FollowUpTime[1] : "",
        beginLastNextFollowUpTime:
          NextFollowUpTime != null ? NextFollowUpTime[0] : "",
        endLastNextFollowUpTime:
          NextFollowUpTime != null ? NextFollowUpTime[1] : "",
        beginConvertTime: ConvertTime != null ? ConvertTime[0] : "",
        endConvertTime: ConvertTime != null ? ConvertTime[1] : "",
      };

      delete sendData.FollowUpTime;
      delete sendData.NextFollowUpTime;
      delete sendData.ConvertTime;

      listOpportunity(sendData).then((response) => {
        this.opportunityList = response.rows;
        this.total = response.total;
        this.statisticData = response.param || {};
        this.loading = false;

        console.log(this.opportunityList);

        setTimeout(() => {
          if (this.setShowDate == true) {
            this.opportunityList.map((t) => {
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
        opportunityStatus: undefined,
        projectType: undefined,
        consultTimee: undefined,
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
      setTimeout(() => this.getList());
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
      this.$router.push({ name: "Opportunity/add", query: { type: 0 } });
      // this.reset();
      // this.open = true;
      // this.title = "添加商机记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids;
      this.$router.push({ name: "Opportunity/add", query: { type: 1, id } });
      // this.loading = true;
      // this.reset();
      // const id = row.id || this.ids;
      // getOpportunity(id).then((response) => {
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
      //   this.title = "修改商机记录";
      // });
    },
    handleConvert(form) {
      // this.$router.push({ name: "Demand/add", query: { type: 0 } });
      this.$router.push({
        name: "Order/add",
        query: { type: 2, form: JSON.stringify(form) },
      });
    },
    //置顶按钮
    handleSetTop(row) {
      this.reset();
      const id = row.id || this.ids;
      setTop({ id }).then((response) => {
        this.$modal.msgSuccess(`${row.isTop ? "取消" : ""}置顶成功`);
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateOpportunity(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addOpportunity(this.form)
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
        .confirm('是否确认删除商机记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delOpportunity(ids);
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
        "system/opportunity/export",
        {
          ...this.queryParams,
        },
        `opportunity_${new Date().getTime()}.xlsx`
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRefName = this.$refs.myTable;
    });
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
