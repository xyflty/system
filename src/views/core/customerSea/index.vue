<template>
  <div class="container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="资源名称\联系人\联系方式"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="" prop="dataSource">
          <el-select
            v-model="queryParams.dataSource"
            :clearable="true"
            placeholder="资源来源"
          >
            <el-option
              v-for="dataSource in commonData.dataSourceList"
              :key="dataSource.value"
              :label="dataSource.label"
              :value="dataSource.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" prop="province">
          <el-cascader
            :options="areaSelectData"
            @change="handleQueryChange"
            class="full-width"
            v-model="selectedOptions"
            placeholder="所在地区"
          />
        </el-form-item> -->
        <!-- <el-form-item label="" prop="dateMonth">
          <el-date-picker
            clearable
            v-model="dateMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="" prop="lastFollowUpTime">
          <el-date-picker
            clearable
            v-model="queryParams.lastFollowUpTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="最后跟进时间"
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
        </el-form-item>
      </el-form>
    </div>

    <div class="content mt_20">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="queryParams.isReceive == 0">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['core:customerSea:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="queryParams.isReceive == 0">
          <el-button
            type="info"
            plain
            icon="el-icon-upload2"
            @click="handleImport"
            v-hasPermi="['core:customerSea:import']"
            >导入</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['core:customerSea:edit']"
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
          v-hasPermi="['core:customerSea:remove']"
          >删除</el-button
        >
      </el-col>
        <el-col :span="1.5" v-if="queryParams.isReceive == 0">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            @click="handleExport"
            v-hasPermi="['core:customerSea:export']"
            >导出</el-button
          >
        </el-col> -->

        <div v-show="queryParams.isReceive == 0">
          <el-col :span="1.5">
            <el-button
              plain
              @click="handleReceive"
              v-hasPermi="['core:customerSea:take']"
              >领取资源</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              plain
              @click="showDialog = true"
              v-hasPermi="['core:customerSea:allotResource']"
              >分配资源</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(0, 1)"
              >我已领取过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(0, 0)"
              >我未领取过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(1, '')"
              >我领取的资源</el-button
            >
          </el-col>
        </div>

        <div v-show="queryParams.isReceive == 1">
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(1, '')"
              >我领取的资源</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(1, 1)"
              >之前领取过的资源</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(1, 0)"
              >之前未领取的资源</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleChanegType(0, '')"
              >去客户公海</el-button
            >
          </el-col>
        </div>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
        ></right-toolbar>
      </el-row>

      <el-table
        v-loading="loading"
        :data="customerSeaList"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="资源名称"
          align="center"
          prop="companyName"
          sortable="custom"
          v-if="columns[0].visible"
          :width="columns[0].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="联系人"
          align="center"
          prop="contactName"
          sortable="custom"
          v-if="columns[1].visible"
          :width="columns[1].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="联系方式"
          align="center"
          prop="cellphone"
          sortable="custom"
          v-if="columns[2].visible"
          :width="columns[2].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="资源来源"
          align="center"
          prop="dataSource"
          sortable="custom"
          v-if="columns[3].visible"
          :width="columns[3].width"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <span>{{
              getLabel(commonData.dataSourceList, row.dataSource)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="跟进最后状态"
          align="center"
          prop="cellphone"
          sortable="custom"
          v-if="columns[4].visible"
          :width="columns[4].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="成立时间"
          align="center"
          prop="setUpTime"
          sortable="custom"
          v-if="columns[9].visible"
          :width="columns[9].width"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
          label="所在地区"
          align="center"
          prop="area"
          sortable="custom"
          v-if="columns[5].visible"
          :width="columns[5].width"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <div v-if="row.province">{{ row.city }} - {{ row.area }}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          label="首次成交人"
          align="center"
          prop="firstReceivePerson"
          sortable="custom"
          v-if="columns[5].visible"
          :width="columns[5].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="最后成交人"
          align="center"
          prop="lastReceivePerson"
          sortable="custom"
          v-if="columns[6].visible"
          :width="columns[6].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="最后跟进时间"
          align="center"
          prop="lastFollowUpTime"
          sortable="custom"
          v-if="columns[7].visible"
          :width="columns[7].width"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.lastFollowUpTime, "{y}-{m}-{d}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="未跟进天数"
          align="center"
          prop="unFollowUpDays"
          sortable="custom"
          v-if="columns[8].visible"
          :width="columns[8].width"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="queryParams.isReceive == 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-refresh"
                @click="handleAction(scope.row, 1)"
                v-hasPermi="['core:customerSea:convert']"
                >转入线索</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleAction(scope.row, 2)"
                v-hasPermi="['core:customerSea:edit']"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-refresh-left"
                @click="handleAction(scope.row, 3)"
                v-hasPermi="['core:customerSea:putBackSea']"
                >放回公海</el-button
              >
            </div>
            <!--   <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['core:clueSea:remove']"
            >删除</el-button
          > -->
            <div v-else>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleReceive(scope.row)"
                v-hasPermi="['core:customerSea:take']"
                >领取</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-d-arrow-right"
                @click="
                  $router.push({
                    name: 'SeaDetail',
                    query: { id: scope.row.id, type: 'customerSea' },
                  })
                "
                v-hasPermi="['core:customerSea:query']"
                >详细</el-button
              >
            </div>
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

      <!-- 添加或修改客户公海对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="资源名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入资源名称" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="form.contactName" placeholder="请输入联系人" />
          </el-form-item>

          <el-form-item label="联系方式" prop="cellphone">
            <el-input
              v-model="form.cellphone"
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              placeholder="请输入联系方式"
            />
          </el-form-item>
          <el-form-item label="资源来源" prop="dataSource">
            <el-select v-model="form.dataSource" placeholder="请输入资源来源">
              <el-option
                v-for="dataSource in commonData.dataSourceList"
                :key="dataSource.value"
                :label="dataSource.label"
                :value="dataSource.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="企业成立时间" prop="setUpTime">
            <el-date-picker
              v-model="form.setUpTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="所在区域" prop="province">
            <el-cascader
              :options="areaSelectData"
              @change="handleChange"
              class="full-width"
              size="large"
              v-model="form.selectedOptions"
              placeholder="请选择您所在的城市"
            />
          </el-form-item> -->

          <!-- <el-form-item label="首次领取人" prop="firstReceivePerson">
            <el-select
              style="width: 100%"
              v-model="form.firstReceivePerson"
              filterable
              placeholder="请输入首次领取人"
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
          <el-form-item label="最后领取人" prop="lastReceivePerson">
            <el-select
              style="width: 100%"
              v-model="form.lastReceivePerson"
              filterable
              placeholder="请输入最后领取人"
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
              v-model="form.lastFollowUpTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择最后跟进时间"
            >
            </el-date-picker>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 客户公海导入对话框 -->
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

      <!-- 分配资源 -->
      <el-dialog
        title="分配资源"
        :visible="showDialog"
        width="800px"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-form ref="assignForm" :model="assignForm" label-width="120px">
          <el-form-item label="分配对象" prop="userId">
            <el-select
              style="width: 100%"
              v-model="assignForm.userId"
              filterable
              placeholder="请输入关键字搜索用户"
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAssign">确 定</el-button>
          <el-button @click="cancelAssign">取 消</el-button>
        </div>
      </el-dialog>

      <div class="info-box" :style="dialogPosition">
        <el-timeline>
          <el-timeline-item
            placement="top"
            color="#0079fe"
            v-for="(item, index) in followUpVoList"
            :key="index"
            :timestamp="
              item.createTime ? item.createTime + ' ' + item.userName : '-'
            "
          >
            <h4 style="margin-bottom: 20px" class="conte">
              <span>{{ item.title }}</span>

              <!-- <span>{{ item.status }}</span>
              <span>{{ item.userName }}</span>
              <span>{{ item.followUpMethod }}</span>  
             <span>{{ item.content }}</span>
              <span>{{ item.createTime }}</span> -->
            </h4>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listCustomerSea,
  getCustomerSea,
  delCustomerSea,
  addCustomerSea,
  updateCustomerSea,
  importTemplate,
  receive,
  getPopup,
  convertClue,
  putBack,
  allotResource,
} from "@/api/core/customerSea";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import { listUser } from "@/api/system/user";
import { debounce } from "@/utils/ruoyi.js";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
const regionDataArr = regionData.filter((item) => item.label == "广东省");
regionDataArr[0].children.forEach((item) => {
  item.children.forEach((val, index, array) => {
    if (val.label == "市辖区") {
      array.splice(0, 1);
    }
  });
});

export default {
  name: "CustomerSea",
  data() {
    return {
      archiveId: "",
      followUpVoList: [],
      assignForm: {},
      assignbuttonLoading: false,
      assignFormRule: {
        userId: [
          { required: true, message: "分配对象不能为空", trigger: "blur" },
        ],
      },
      showDialog: false,
      selectedOptions: [],
      dialogPosition: {
        display: "none",
        top: 0,
        left: 0,
        position: "fixed",
        zIndex: 999,
      },
      dateMonth: [],
      userList: [],
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
      // 总条数
      total: 0,
      // 客户公海表格数据
      customerSeaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        province: undefined,
        city: undefined,
        dataSource: undefined,
        area: undefined,
        lastFollowUpTime: undefined,
        isConvert: 0,
        isReceive: 0,
        isReceiveBefore: "",
      },

      // 列信息
      columns: [
        { key: 0, label: `资源名称`, visible: true, width: "250" },
        { key: 1, label: `联系人`, visible: true, width: "120" },
        { key: 2, label: `联系方式`, visible: true, width: "150" },
        { key: 3, label: `资源来源`, visible: true, width: "140" },
        { key: 4, label: `跟进最后状态`, visible: true, width: "140" },
        // { key: 5, label: `所在地区`, visible: true, width: "250" },
        { key: 6, label: `首次领取人`, visible: true, width: "180" },
        { key: 7, label: `最后领取人`, visible: true, width: "140" },
        { key: 8, label: `最后跟进时间`, visible: true, width: "140" },
        { key: 9, label: `未跟进天数`, visible: true, width: "140" },
        { key: 10, label: `成立时间`, visible: true, width: "180" },
      ],

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyName: [
          { required: true, message: "资源名称不能为空", trigger: "blur" },
        ],
        contactName: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        cellphone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
        dataSource: [
          { required: true, message: "资源来源不能为空", trigger: "blur" },
        ],
        province: [
          { required: true, message: "所在地区不能为空", trigger: "blur" },
        ],
        firstReceivePerson: [
          { required: true, message: "首次领取人不能为空", trigger: "change" },
        ],
        lastReceivePerson: [
          { required: true, message: "最后领取人不能为空", trigger: "change" },
        ],
        lastFollowUpTime: [
          { required: true, message: "最后跟进时间不能为空", trigger: "blur" },
        ],
      },
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
        url: process.env.VUE_APP_BASE_API + "/zw/customerSea/importData",
      },
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    dateMonth: {
      handler(n) {
        console.log(n);
        this.queryParams.beginTime = n != null ? n[0] : "";
        this.queryParams.endTime = n != null ? n[1] : "";
      },
    },
  },
  created() {
    this.getList();

    this.cellMouseEnter = debounce(this.cellMEnter, 1000);
    this.cellMouseLeave = debounce(this.cellMLeave, 1000);
  },
  methods: {
    handleAction(row, type) {
      if (type == 1 || type == 3) {
        let str =
          type == 1
            ? "是否确认将所选择的资源转为线索"
            : "是否确认将所选择的资源放回公海？";
        this.$modal
          .confirm(str)
          .then(() => {
            this.loading = true;
            return type == 1
              ? convertClue({ archiveId: row.archiveId, id: row.id })
              : putBack({ id: row.id });
          })
          .then(() => {
            this.loading = false;
            this.getList();
            this.$modal.msgSuccess("操作成功");
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$router.push({
          name: "SeaDetail",
          query: { id: row.id, type: "customerSea", val: 1 },
        });
      }
    },
    handleChanegType(isReceive, isReceiveBefore) {
      this.queryParams.isReceive = isReceive;
      this.queryParams.isReceiveBefore = isReceiveBefore;

      this.getList();
    },
    allotResource() {
      if (this.ids.length == 0 || this.ids[0] == undefined) {
        this.$message.warning("请至少选择一项");
        return;
      }
      this.showDialog = true;
    },
    submitAssign() {
      this.$refs["assignForm"].validate((valid) => {
        if (valid) {
          this.assignbuttonLoading = true;
          let params = JSON.parse(JSON.stringify(this.assignForm));
          params.seaIds = this.ids;
          allotResource(params)
            .then((response) => {
              this.$modal.msgSuccess("分配成功");
              this.getList();
              this.assignForm = {};
              this.showDialog = false;
            })
            .finally(() => {
              this.assignbuttonLoading = false;
            });
        }
      });
    },
    cancelAssign() {
      this.assignForm = {};
      this.showDialog = false;
    },
    cellMEnter(row, column, cell, event) {
      this.dialogPosition.top = undefined;
      this.dialogPosition.bottom = undefined;
      if (column.label == undefined || column.label == "操作") {
        return;
      }
      const { clientX, clientY } = event;

      this.dialogPosition.display = "block";
      if (document.body.clientHeight / 2 < clientY) {
        this.dialogPosition.bottom =
          document.body.clientHeight - clientY + "px";
      } else {
        this.dialogPosition.top = clientY + "px";
      }
      this.dialogPosition.left = clientX + 50 + "px";
      if (this.archiveId == row.archiveId) {
        return;
      }
      this.archiveId = row.archiveId;
      getPopup(this.archiveId).then((res) => {
        this.followUpVoList = res.rows;
      });
    },
    cellMLeave() {
      this.dialogPosition.display = "none";
    },
    handleReceive(row) {
      const ids = row.id ? [row.id] : this.ids;
      if (ids.length == 0 || ids[0] == undefined) {
        this.$message.warning("请至少选择一项");
        return;
      }
      this.$modal
        .confirm("是否确认领取所选的公共资源数据项？")
        .then(() => {
          this.loading = true;
          return receive({ seaIds: ids });
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("领取成功");
        })
        .finally(() => {
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

    handleQueryChange(value) {
      console.log(value);
      //value为省市区code数组
      if (value) {
        var provinceCode = CodeToText[value[0]]; //code转为省
        var cityCode = CodeToText[value[1]]; //市
        var orgion = CodeToText[value[2]]; //区
        this.queryParams.province = provinceCode;
        this.queryParams.city = cityCode;
        this.queryParams.area = orgion;
      }
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

    // 排序改变
    sortChange({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    /** 查询客户公海列表 */
    getList() {
      this.loading = true;
      listCustomerSea(this.queryParams).then((response) => {
        this.customerSeaList = response.rows;
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
        archiveId: undefined,
        companyName: undefined,
        contactName: undefined,
        cellphone: undefined,
        dataSource: undefined,
        area: undefined,
        firstDealPerson: undefined,
        lastDealPerson: undefined,
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
      this.dateMonth = null;
      this.selectedOptions = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        isConvert: 0,
        isReceive: 0,
        isReceiveBefore: "",
      };
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
      this.title = "添加客户公海";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      // getCustomerSea(id).then((response) => {
      this.loading = false;
      this.form = row;
      this.open = true;
      this.title = "修改客户公海";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCustomerSea(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addCustomerSea(this.form)
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
        .confirm('是否确认删除客户公海编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delCustomerSea(ids);
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
        "core/customerSea/export",
        {
          ...this.queryParams,
        },
        `customerSea_${new Date().getTime()}.xlsx`
      );
    },

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "客户公海导入";
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
        link.download = new Date().getTime() + "客户公海导入模板";
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

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.container {
  background-color: rgb(240, 242, 245);
  padding: 20px 100px;
  min-height: 100vh;
  .header,
  .content {
    background: #fff;
    padding: 30px;
    overflow: hidden;
    .mt_30 {
      margin-top: 30px;
    }
    .clue-box {
      margin-top: 40px;
    }
  }
}
.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}

.info-box {
  width: 300px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: scroll;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
}
/* 取消input的上下箭头 */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  line-height: 1;
  -moz-appearance: textfield !important;
}
</style>
