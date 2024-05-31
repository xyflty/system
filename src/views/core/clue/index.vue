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
      <!-- <el-form-item label="线索状态" prop="clueStatus">
        <el-select v-model="queryParams.clueStatus" :clearable="true">
          <el-option
            v-for="clueStatus in commonData.clueStatusList"
            :key="clueStatus.value"
            :label="clueStatus.label"
            :value="clueStatus.value"
          />
        </el-select>
      </el-form-item> -->
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
        <el-select v-model="queryParams.role" :clearable="true">
          <el-option
            v-for="item in commonData.roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资质查询" prop="certName">
        <el-input
          v-model="queryParams.certName"
          placeholder="资质查询"
          clearable
        />
      </el-form-item>

      <el-form-item label="客户类型" prop="customerType">
        <el-select v-model="queryParams.customerType" placeholder="请选择">
          <el-option
            v-for="item in commonData.customerTypeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </el-option>
        </el-select>
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
          placeholder="归属部门"
        />
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
      <el-form-item label="线索创建时间" prop="CreateTime">
        <el-date-picker
          clearable
          v-model="queryParams.CreateTime"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
        <PowerSearch :type="1" @submit="setSearch" />
      </el-form-item>
    </el-form>

    <div class="table_actions">
      <PresentationStatistics
        :comparison="statisticContrast"
        :data="statisticData"
      />

      <el-row :gutter="10" class="mb8 action_btns">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['core:clue:add']"
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
            v-hasPermi="['core:clue:import']"
            >导入</el-button
          >
        </el-col>

        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="clue"
        ></right-toolbar_2>
      </el-row>
    </div>

    <el-table
      v-loading="loading"
      :data="clueList"
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
                $router.push({ name: 'Clue/detail', query: { id: row.id } })
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
                ['clueStatus', 'role', 'dataSource', 'clueSourceType'].includes(
                  item.prop
                )
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
            <span v-else-if="item.prop == 'customerType' && row.customerType">
              {{
                handleFormatter(commonData.customerTypeList, row.customerType)
              }}
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>

      <el-table-column align="center" label="操作" width="350" fixed="right">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-chat-dot-round"
            size="mini"
            type="text"
            @click="handleFollowUp(scope.row)"
            v-hasPermi="['core:clue:followUp']"
            >跟进
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['core:clue:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            @click="handleSetTop(scope.row)"
            v-hasPermi="['core:clue:setTop']"
            >{{ scope.row.isTop ? "取消置顶" : "置顶" }}</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            type="text"
            @click="handleConvert(scope.row)"
            v-hasPermi="['core:clue:convert']"
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

    <!-- 线索导入对话框 -->
    <ImportModel
      title="线索导入"
      :visible.sync="uploadOpen"
      action="/zw/clue/importData"
      :templateFn="importTemplate"
      @success="handleFileSuccess"
    />

    <!-- 资质查看 -->
    <AptitudeModel :visible.sync="showDialog" :archiveId.sync="archiveId" />

    <!-- 联系人查看 -->

    <AptitudeModel
      type="Contact"
      :visible.sync="showDialog1"
      :archiveId.sync="archiveId"
    />
    <!-- 添加跟进记录对话框 -->

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :followUpType="1"
      @success="handleSuccess"
    />

    <!-- 转移 -->
    <TransferModel
      :visible.sync="transferVisible"
      :ids="transferIds"
      :rowId="rowId"
      type="clue"
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
  listClue,
  getClue,
  delClue,
  addClue,
  updateClue,
  setTop,
  followUp,
  importTemplate,
} from "@/api/core/clue";
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import followUpDialog from "../components/followUp.vue";

import { followUpMinixs } from "@/mixins/followUp.js";

import { mapState } from "vuex";

import PowerSearch from "@/views/core/clue/search";
import { list } from "@/api/common.js";
import TransferModel from "@/views/components/TransferModel.vue";

import { formatterCallback } from "@/utils/common";

import ShareModel from "../components/shareModel.vue";
import { share } from "../minixs/share";

import AptitudeModel from "@/views/core/components/model/AptitudeModel.vue";

import ImportModel from "@/views/components/ImportModel.vue";

export default {
  name: "Clue",
  components: {
    followUpDialog,
    Treeselect,
    PowerSearch,
    TransferModel,
    ShareModel,
    AptitudeModel,
    ImportModel,
  },
  mixins: [share, followUpMinixs],
  data() {
    return {
      showDialog1: false,

      selectedOptions: [],
      showDialog: false,

      // 选中的表格数据
      archiveId: "",

      dateMonth1: [],
      dateMonth2: [],
      deptOptions: [],
      // 跟进弹出框标题
      followUpFormTitle: "",

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
        //   label: `联系人姓名`,
        //   width: "120",
        //   prop: "contactName",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        // {
        //   key: 2,
        //   label: `手机号码`,
        //   visible: true,
        //   width: "150",
        //   prop: "cellphone",
        //   showOverflow: true,
        //   sortable: "custom",
        // },
        {
          key: 3,
          label: `跟进人员`,
          visible: true,
          width: "140",
          prop: "userName",
          showOverflow: true,
          sortable: "custom",
        },
        // {
        //   key: 4,
        //   label: `线索状态`,
        //   width: "140",
        //   prop: "clueStatus",
        //   visible: true,
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
        // {
        //   key: 7,
        //   label: `角色`,
        //   width: "140",
        //   prop: "role",
        //   visible: true,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 8,
          label: `数据来源`,
          width: "140",
          prop: "dataSource",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        // {
        //   key: 9,
        //   label: `性别`,
        //   width: "100",
        //   prop: "gender",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 10,
          label: `法人`,
          width: "140",
          prop: "legalPerson",
          visible: false,
          showOverflow: true,
          sortable: false,
        },
        // {
        //   key: 11,
        //   label: `喜恶`,
        //   width: "140",
        //   prop: "hobby",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 12,
        //   label: `职位`,
        //   width: "140",
        //   prop: "position",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: false,
        // },
        // {
        //   key: 13,
        //   label: `微信`,
        //   width: "150",
        //   prop: "tencentWx",
        //   visible: false,
        //   showOverflow: true,
        //   sortable: false,
        // },
        {
          key: 14,
          label: `安证有效期`,
          width: "180",
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
          label: `所在地区`,
          width: "250",
          prop: "province",
          visible: true,
          showOverflow: true,
          sortable: false,
        },
        {
          key: 17,
          label: `线索创建时间`,
          width: "250",
          prop: "clueCreateTime",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 18,
          label: `客户类型`,
          width: "250",
          prop: "customerType",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 19,
          label: `线索来源`,
          width: "250",
          prop: "clueSourceType",
          visible: true,
          showOverflow: true,
          sortable: "custom",
        },
      ],

      // 总条数
      total: 0,
      // 线索记录表格数据
      clueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 项目导入参数
      uploadOpen: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        clueStatus: undefined,
        dataSource: undefined,
        followUpPersonIds: undefined,
        deptId: undefined,
        FollowUpTime: null,
        safetyPermitsTimeEndTime: undefined,
        expireDateEndTime: undefined,
        CreateTime: null,
        NextFollowUpTime: null,
        searchDesign: false,
        // isConvert: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // clueStatus: [
        //   { required: true, message: "线索状态不能为空", trigger: "blur" },
        // ],
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
      rowId: "", //当前行id

      // 统计对照表
      statisticContrast: [
        {
          label: "线索数量:",
          value: "clueCount",
        },
        // {
        //   label: "跟进人员数量:",
        //   value: "clueFollowUpCount",
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

      formType: "add",
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
      vm.getList();
      vm.getCloumns();
    });
  },

  activated() {
    this.$nextTick(() => {
      // myTable是表格的ref属性值
      if (this.$refs.myTable && this.$refs.myTable.doLayout) {
        this.$refs.myTable.doLayout();
      }
    });
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
    handleFormatter(arr, val) {
      return formatterCallback(arr, val);
    },
    handleTransfer(row) {
      this.transferVisible = true;
      this.transferIds = [row.userId];
      this.rowId = row.id;
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
      list({ pageName: "clue" }).then((res) => {
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

          console.log(this.columns);
        }
      });
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
      } = val;
      province && (this.selectedOptions = [province, city, area]);

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

    /** 查询线索记录列表 */
    getList() {
      this.loading = true;
      const { FollowUpTime, NextFollowUpTime, CreateTime } = this.queryParams;
      let sendData = {
        ...this.queryParams,
        beginLastFollowUpTime: FollowUpTime != null ? FollowUpTime[0] : "",
        endLastFollowUpTime: FollowUpTime != null ? FollowUpTime[1] : "",
        beginLastNextFollowUpTime:
          NextFollowUpTime != null ? NextFollowUpTime[0] : "",
        endLastNextFollowUpTime:
          NextFollowUpTime != null ? NextFollowUpTime[1] : "",
        beginCreateTime: CreateTime != null ? CreateTime[0] : "",
        endCreateTime: CreateTime != null ? CreateTime[1] : "",
      };

      delete sendData.FollowUpTime;
      delete sendData.NextFollowUpTime;
      delete sendData.CreateTime;

      listClue(sendData).then((response) => {
        this.clueList = response.rows;
        this.total = response.total;
        this.statisticData = response.param || {};
        this.loading = false;

        setTimeout(() => {
          if (this.setShowDate == true) {
            this.clueList.map((t) => {
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
        clueStatus: 0,
        companyName: undefined,
        legalPerson: undefined,
        safetyPermitsTime: undefined,
        dataSource: 0,
        contaceName: undefined,
        gender: 0,
        role: 0,
        position: undefined,
        cellphone: undefined,
        telephone: undefined,
        fax: undefined,
        email: undefined,
        tencentWx: undefined,
        tencentQq: undefined,
        hobby: undefined,
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
      this.$refs.province.value = [];
      this.queryParams.city = undefined;
      this.queryParams.area = undefined;
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
      // this.title = "添加销售线索";
      this.$router.push({
        name: "Clue/add",
        query: { type: 0, followUpCategory: 2 },
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.loading = true;
      // this.reset();
      const id = row.id || this.ids;
      this.$router.push({ name: "Clue/add", query: { type: 1, id } });
      // getClue(id).then((response) => {
      //   this.loading = false;
      //   this.form = response.data;
      //   this.$set(this.form, "selectedOptions", [
      //     TextToCode[this.form.province].code,
      //     TextToCode[this.form.province][this.form.city].code,
      //     TextToCode[this.form.province][this.form.city][this.form.area].code,
      //   ]);
      //   this.open = true;
      //   this.title = "修改线索记录";
      // });
    },
    handleConvert(form) {
      // this.$router.push({
      //   path: "demand/add",
      //   query: { type: 2, form: JSON.stringify(form) },
      // });

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
            updateClue(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addClue(this.form)
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
        .confirm('是否确认删除线索记录编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delClue(ids);
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
        "system/clue/export",
        {
          ...this.queryParams,
        },
        `clue_${new Date().getTime()}.xlsx`
      );
    },

    /** 导入按钮操作 */
    handleImport() {
      this.uploadOpen = true;
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
        link.download = new Date().getTime() + "线索导入模板";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.getList();
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
