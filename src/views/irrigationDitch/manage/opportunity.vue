<template>
  <div class="app-container">
    <el-card v-show="showSearch" style="margin-bottom: 20px">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键字"
            clearable
          />
        </el-form-item>
        <el-form-item prop="opportunityStatus">
          <el-select
            placeholder="商机状态"
            v-model="queryParams.opportunityStatus"
            :clearable="true"
          >
            <el-option
              v-for="opportunityStatus in commonData.opportunityStatusList"
              :key="opportunityStatus.value"
              :label="opportunityStatus.label"
              :value="opportunityStatus.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ProvinceSelect
            ref="province"
            size="small"
            placeholder="客户所在地"
            :checkStrictly="true"
            @change="(e) => (queryParams = { ...queryParams, ...e })"
          />
        </el-form-item>
        <el-form-item prop="publicArea">
          <!-- <el-input
            placeholder="客户可公关地区"
            v-model="queryParams.publicArea"
            autocomplete="off"
          /> -->

          <ProvinceSelect
            ref="province"
            size="small"
            placeholder="客户可公关地区"
            :showAllLevels="false"
            :checkStrictly="false"
            :dialogVisible="true"
            @change="
              (e) => {
                queryParams.publicArea = e.city;
              }
            "
          />
        </el-form-item>
        <el-form-item prop="marketingUserId">
          <el-select
            style="width: 100%"
            v-model="queryParams.marketingUserId"
            filterable
            placeholder="请输入关键字搜索市场人员"
            remote
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="dataSource">
          <el-select
            placeholder="数据来源"
            v-model="queryParams.dataSource"
            :clearable="true"
          >
            <el-option
              v-for="dataSource in commonData.dataSourceList"
              :key="dataSource.value"
              :label="dataSource.label"
              :value="dataSource.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="customerType">
          <el-select
            placeholder="客户类型"
            v-model="queryParams.customerType"
            :clearable="true"
          >
            <el-option label="企业客户" value="1" />
            <el-option label="个人客户" value="2" />
            <el-option label="渠道客户" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId">
          <!-- <el-select
            placeholder="数据归属"
            v-model="queryParams.dataAttribution"
            :clearable="true"
          >
            <el-option
              v-for="item in dataAttributionArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <treeselect
            v-model="queryParams.deptId"
            appendToBody
            style="margin-left: 10px; max-width: 200px"
            :options="deptOptions"
            value-consists-of="LEAF_PRIORITY"
            :show-count="true"
            placeholder="数据归属"
          />
        </el-form-item>
        <el-form-item prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            type="date"
            placeholder="选择数据录入时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
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
          <el-button @click="resetQuery" icon="el-icon-refresh" size="mini"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(1, undefined)"
            v-hasPermi="['channel:channelOpportunity:add']"
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
            v-hasPermi="['channel:channelOpportunity:import']"
            >导入</el-button
          >
        </el-col>
        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="irrigationDitchOpportunity"
        ></right-toolbar_2>
      </el-row>
      <el-table
        :key="isRandom"
        v-loading="loading"
        :data="list"
        @sort-change="sortChange"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
      >
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="item.visible"
            :key="index"
            :label="item.label"
            align="center"
            :sortable="item.sortable"
            :prop="item.prop"
            :min-width="item.width || 140"
            :show-overflow-tooltip="item.showOverflow"
          >
            <template slot-scope="{ row }">
              <span
                v-if="item.prop == 'title'"
                @click="handleAdd(3, row)"
                class="ableClick"
                >{{ row.title || "-" }}</span
              >
              <span v-if="item.prop == 'customerType'">{{
                customerTypeObj[row.customerType] || "-"
              }}</span>
              <span
                v-if="item.prop == 'companyName'"
                @click="handleAdd(4, row)"
                class="ableClick"
                >{{ row.companyName || "-" }}</span
              >
              <span v-if="item.prop == 'opportunityStatus'">{{
                getLabel(
                  commonData[`opportunityStatusList`],
                  row.opportunityStatus
                ) || "-"
              }}</span>
              <span
                v-if="item.prop == 'projectNum'"
                @click="dialogSH(1, row)"
                class="ableClick"
                >{{
                  row.projectNum
                    ? row.projectNum > 1
                      ? row.projectNum
                      : row.projectName
                    : "-"
                }}</span
              >
              <span
                v-hasPermi="['channel:channelSubsidiary:list']"
                v-if="item.prop == 'childCompanyNum'"
                @click="dialogSH(2, row)"
                class="ableClick"
                >{{
                  row.childCompanyNum > 1
                    ? row.childCompanyNum
                    : row.subsidiaryName
                    ? row.subsidiaryName
                    : "-"
                }}</span
              >
              <span v-if="item.prop == 'province'">{{
                row.province + row.city + row.area
              }}</span>
              <span
                v-if="item.prop == 'city'"
                @click="dialogSH(3, row)"
                class="ableClick"
                >{{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].city
                    : "-"
                }}</span
              >
              <span
                v-if="item.prop == 'advantageEvent'"
                @click="dialogSH(3, row)"
                class="ableClick"
                >{{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].advantageEvent
                    : "-"
                }}</span
              >
              <span
                v-if="item.prop == 'mainProject'"
                @click="dialogSH(3, row)"
                class="ableClick"
                >{{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].mainProject
                    : "-"
                }}</span
              >
              <span v-if="item.prop == 'userName'">{{ row.userName }}</span>
              <span v-if="item.prop == 'createTime'">{{ row.createTime }}</span>
              <span v-if="item.prop == 'dataSourceList'">{{
                getLabel(commonData.dataSourceList, row.dataSource) || "-"
              }}</span>
              <span v-if="item.prop == 'deptName'">{{
                row.deptName || "-"
              }}</span>
              <span v-if="item.prop == 'unFollowUpDays'">{{
                row.unFollowUpDays || "-"
              }}</span>
            </template>
          </el-table-column>
        </template>

        <el-table-column align="center" label="操作" width="350" fixed="right">
          <template slot-scope="{ row }">
            <div>
              <el-button
                v-hasPermi="['channel:channelOpportunity:followUp']"
                @click="dialogSH(5, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                >跟进</el-button
              >
              <el-button
                @click="handleAdd(1, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelOpportunity:edit']"
                >修改</el-button
              >
              <el-button
                @click="Topping(row.id)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelOpportunity:topStatus']"
              >
                {{ row.isTop == 1 ? "取消置顶" : "置顶" }}</el-button
              >
              <el-button
                :disabled="row.isConvert == 1 ? true : false"
                @click="handleAdd(2, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelOpportunity:conversionToOrder']"
                >转为订单</el-button
              >
            </div>
            <div>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-bell"
                :disabled="row.isLoss == 1"
                @click="handleQuotedPrice(row)"
                v-hasPermi="['channel:channelAuditReferPrice:add']"
                >报价</el-button
              >
              <el-button
                @click="dialogSH(4, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelContactInfo:list']"
                >联系人</el-button
              >
              <el-button
                @click="dialogSH(1, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelRelevanceProject:list']"
                >关联项目</el-button
              >
              <el-button
                @click="dialogSH(2, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                >关联子公司</el-button
              >
            </div>
            <div>
              <el-button
                @click="dialogSH(3, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelDomainProject:list']"
                >客户优势主营项目</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-card>

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
        :action="upload.url"
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
            @click="importTemplate(1)"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <opportunity-dialog
      :OpportunitySH.sync="dialog.OpportunitySH"
      :title="dialog.title"
      :type.sync="dialog.type"
      :row.sync="dialog.row"
      :userList="userList"
    ></opportunity-dialog>

    <quotedPrice
      :show.sync="showQuotedPrice"
      :quotedPriceForm="quotedPriceForm"
    />
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import mixin from "./mixin";
import opportunityDialog from "./components/opportunity_dialog.vue";
import {
  getList,
  getchannelOpportunitytopStatus,
} from "../../../api/irrigationDitch/opportunity";
import { list } from "@/api/common.js";

import quotedPrice from "./components/quotedPrice.vue";
export default {
  components: {
    "opportunity-dialog": opportunityDialog,
    Treeselect,
    quotedPrice,
  },
  mixins: [mixin],
  data() {
    return {
      // 传送数据
      columns: [
        {
          key: 0,
          label: `商机标题`,
          visible: true,
          prop: "title",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 1,
          label: `企业名称`,
          visible: true,
          prop: "companyName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 15,
          label: `客户类型`,
          visible: true,
          prop: "customerType",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 2,
          label: `商机状态`,
          visible: true,
          prop: "opportunityStatus",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 3,
          label: `商机关联项目`,
          visible: true,
          prop: "projectNum",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 4,
          label: `关联子公司`,
          visible: true,
          prop: "childCompanyNum",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 5,
          label: `客户所在地区`,
          visible: true,
          prop: "province",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 6,
          label: `客户可公关地区`,
          visible: true,
          prop: "city",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 7,
          label: `客户优势项目`,
          visible: true,
          prop: "advantageEvent",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 8,
          label: `客户主营项目`,
          visible: true,
          prop: "mainProject",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 9,
          label: `市场人员`,
          visible: true,
          prop: "userName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 10,
          label: `数据来源`,
          visible: true,
          prop: "dataSourceList",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 11,
          label: `数据归属`,
          visible: true,
          prop: "deptName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 12,
          label: `未跟进天数`,
          visible: true,
          prop: "unFollowUpDays",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 13,
          label: `数据录入时间`,
          visible: true,
          prop: "createTime",
          showOverflow: true,
          sortable: "custom",
        },
      ],
      // opportunityDialog: {},
      // 搜索显示隐藏
      showSearch: true,
      // 列表数据
      list: [],
      // 列表加载
      loading: false,
      // 部门
      deptOptions: [],

      // 报价参数
      showQuotedPrice: false,
      quotedPriceForm: {},
    };
  },
  created() {
    this.getUserList();
    this.getList();
    this.getTreeselect();
    this.getCloumns();
    this.$store.dispatch("commonData/getUserList");
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 置顶
    Topping(id) {
      getchannelOpportunitytopStatus({ id }).then(() => {
        this.handleQuery();
      });
    },
    /** 新增按钮操作 */
    handleAdd(row, rew) {
      if (row == 1) {
        this.$router.push({
          name: "Opportunity/AddEdit",
          query: { id: rew ? rew.id : undefined },
        });
      }
      if (row == 3) {
        this.$router.push({
          name: "Opportunity/DetailsPage",
          query: { id: rew.id },
        });
      }
      if (row == 2) {
        this.$router.push({
          name: "Opportunity/ConvertOrder",
          query: { id: rew.id },
        });
      }
      if (row == 4) {
        this.$router.push({
          name: "Customer/DetailsPage",
          query: { id: rew.customerId },
        });
      }
    },
    // 获取列表
    getList() {
      this.loading = true;
      console.log(this.queryParams, "??");
      getList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        }
      });
    },
    // 排序
    sortChange({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.columns));
      list({ pageName: "irrigationDitchOpportunity" }).then((res) => {
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

    // 添加报价
    handleQuotedPrice(row) {
      this.showQuotedPrice = true;
      this.quotedPriceForm = row;
    },
  },
};
</script>

<style>
a {
  overflow: hidden;
}
</style>