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

        <el-form-item prop="customerGrade">
          <el-select
            placeholder="客户等级"
            v-model="queryParams.customerGrade"
            :clearable="true"
          >
            <el-option
              v-for="customerGrade in commonData.customerGradeList"
              :key="customerGrade.value"
              :label="customerGrade.label"
              :value="customerGrade.value"
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
            placeholder="数据来源"
            v-model="queryParams.customerType"
            :clearable="true"
          >
            <el-option label="企业客户" value="1" />
            <el-option label="个人客户" value="2" />
            <el-option label="渠道客户" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId">
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
            v-hasPermi="['channel:channelCustomer:add']"
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
            v-hasPermi="['channel:channelCustomer:import']"
            >导入</el-button
          >
        </el-col>
        <right-toolbar_2
          :showSearch.sync="showSearch"
          @queryTable="getList"
          :columns="columns"
          pageName="irrigationDitchcustomer"
        ></right-toolbar_2>
      </el-row>
      <el-table
        :key="isRandom"
        v-loading="loading"
        :data="list"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        @sort-change="sortChange"
      >
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="item.visible"
            :key="index"
            :label="item.label"
            align="center"
            :sortable="item.sortable"
            :prop="item.prop"
            :min-width="item.width || 150"
            :show-overflow-tooltip="item.showOverflow"
          >
            <template slot-scope="{ row }">
              <span
                v-if="item.prop == 'companyName'"
                @click="handleAdd(3, row)"
                class="ableClick"
              >
                {{ row.companyName || "无" }}
              </span>
              <span v-if="item.prop == 'customerType'">{{
                customerTypeObj[row.customerType] || "-"
              }}</span>
              <span
                v-if="item.prop == 'subsidiaryName'"
                @click="handleAdd(2, row)"
                class="ableClick"
              >
                {{
                  row.childCompanyNum > 1
                    ? row.childCompanyNum
                    : row.subsidiaryName
                }}
              </span>
              <span v-if="item.prop == 'customerGrade'">
                {{
                  getLabel(commonData.customerGradeList, row.customerGrade) ||
                  "-"
                }}
              </span>
              <span v-if="item.prop == 'province'">
                {{ row.province + row.city + row.area }}
              </span>
              <span
                v-if="item.prop == 'city'"
                @click="dialogSH(3, row)"
                class="ableClick"
              >
                {{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].city
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'advantageEvent'"
                @click="dialogSH(3, row)"
                class="ableClick"
              >
                {{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].advantageEvent
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'mainProject'"
                @click="dialogSH(3, row)"
                class="ableClick"
              >
                {{
                  row.channelDomainProjectVoList.length
                    ? row.mainProjectAndAreaNum > 1
                      ? row.mainProjectAndAreaNum
                      : row.channelDomainProjectVoList[0].mainProject
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'projectName'"
                @click="dialogSH(8, row, 1)"
                class="ableClick"
              >
                {{
                  row.certificateProjectList &&
                  row.certificateProjectList.length
                    ? row.certificateProjectList.length > 1
                      ? row.certificateProjectList.length
                      : row.certificateProjectList[0].projectName
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'securityCertificateProjectListprojectName'"
                @click="dialogSH(8, row, 2)"
                class="ableClick"
              >
                {{
                  row.securityCertificateProjectList &&
                  row.securityCertificateProjectList.length
                    ? row.securityCertificateProjectList.length > 1
                      ? row.securityCertificateProjectList.length
                      : row.securityCertificateProjectList[0].projectName
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'certificationProjectListprojectName'"
                @click="dialogSH(8, row, 3)"
                class="ableClick"
              >
                {{
                  row.certificationProjectList &&
                  row.certificationProjectList.length
                    ? row.certificationProjectList.length > 1
                      ? row.certificationProjectList.length
                      : row.certificationProjectList[0].projectName
                    : "-"
                }}
              </span>
              <span
                v-if="item.prop == 'talentsProjectListprojectName'"
                @click="dialogSH(8, row, 4)"
                class="ableClick"
              >
                {{
                  row.talentsProjectList && row.talentsProjectList.length
                    ? row.talentsProjectList.length > 1
                      ? row.talentsProjectList.length
                      : row.talentsProjectList[0].projectName
                    : "-"
                }}
              </span>
              <span v-if="item.prop == 'userName'">
                {{ row.userName ? row.userName : "--" }}
              </span>
              <span v-if="item.prop == 'createTime'">{{ row.createTime }}</span>
              <span v-if="item.prop == 'opportunityEnlighten'">
                {{ row.opportunityEnlighten || "-" }}
              </span>
              <span v-if="item.prop == 'dataSource'">
                {{ getLabel(commonData.dataSourceList, row.dataSource) || "-" }}
              </span>
              <span v-if="item.prop == 'deptName'">
                {{ row.deptName || "-" }}
              </span>
              <span v-if="item.prop == 'unFollowUpDays'">
                {{ row.unFollowUpDays || "-" }}
              </span>
            </template>
          </el-table-column>
        </template>

        <el-table-column align="center" label="操作" width="350" fixed="right">
          <template slot-scope="{ row }">
            <div>
              <el-button
                @click="dialogSH(555, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelCustomer:followUp']"
                >跟进</el-button
              >
              <el-button
                @click="handleAdd(1, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelCustomer:edit']"
                >修改</el-button
              >
              <el-button
                @click="Topping(row.id)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelCustomer:topStatus']"
                >{{ row.isTop == 1 ? "取消置顶" : "置顶" }}</el-button
              >
            </div>
            <div>
              <el-button
                @click="dialogSH(4, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelContactInfo:list']"
                >联系人</el-button
              >
              <el-button
                @click="dialogSH(7, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelOrderProject:list']"
                >关联合作项目</el-button
              >
              <el-button
                @click="dialogSH(2, row)"
                size="mini"
                type="text"
                icon="el-icon-chat-dot-round"
                v-hasPermi="['channel:channelSubsidiary:list']"
                >关联子公司</el-button
              >
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
        :action="upload.url2"
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
            @click="importTemplate(3)"
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
      :userList="userList"
      :OpportunitySH.sync="dialog.OpportunitySH"
      :title.sync="dialog.title"
      :type.sync="dialog.type"
      :row.sync="dialog.row"
    ></opportunity-dialog>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getchannelCustomerlist,
  getchannelCustomertopStatus,
} from "../../../api/irrigationDitch/customer";
import mixin from "./mixin";
import opportunityDialog from "./components/opportunity_dialog.vue";
import { list } from "@/api/common.js";
export default {
  components: {
    "opportunity-dialog": opportunityDialog,
    Treeselect,
  },
  mixins: [mixin],
  data() {
    return {
      // 搜索显示隐藏
      showSearch: true,
      // 列表数据
      list: [],
      // 列表加载
      loading: false,
      // 部门列表
      deptOptions: [],
      // 传送数据
      columns: [
        {
          key: 1,
          label: `企业名称`,
          visible: true,
          prop: "companyName",
          showOverflow: true,
          sortable: "custom",
        },

        {
          key: 2,
          label: `关联子公司`,
          visible: true,
          prop: "subsidiaryName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 3,
          label: `客户等级`,
          visible: true,
          prop: "customerGrade",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 4,
          label: `客户所在地`,
          visible: true,
          prop: "province",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 5,
          label: `客户可选公关地区`,
          visible: true,
          prop: "city",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 6,
          label: `客户优势项目`,
          visible: true,
          prop: "advantageEvent",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 7,
          label: `客户主营项目`,
          visible: true,
          prop: "mainProject",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 8,
          label: `合作证书项目`,
          visible: true,
          prop: "projectName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 9,
          label: `合作安证项目`,
          visible: true,
          prop: "securityCertificateProjectListprojectName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 10,
          label: `合作资质项目`,
          visible: true,
          prop: "certificationProjectListprojectName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 11,
          label: `合作人才项目`,
          visible: true,
          prop: "talentsProjectListprojectName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 12,
          label: `市场人员`,
          visible: true,
          prop: "userName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 13,
          label: `商机启发`,
          visible: true,
          prop: "opportunityEnlighten",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 14,
          label: `数据来源`,
          visible: true,
          prop: "dataSource",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 15,
          label: `数据归属`,
          visible: true,
          prop: "deptName",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 16,
          label: `未跟进天数`,
          visible: true,
          prop: "unFollowUpDays",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 17,
          label: `数据录入时间`,
          visible: true,
          prop: "createTime",
          showOverflow: true,
          sortable: "custom",
        },
        {
          key: 20,
          label: `客户类型`,
          visible: true,
          prop: "customerType",
          showOverflow: true,
          sortable: "custom",
        },
      ],
    };
  },
  created() {
    this.getUserList();
    this.getList();
    this.getTreeselect();
    this.getCloumns();
  },
  methods: {
    // 排序
    sortChange({ column, prop, order }) {
      this.queryParams.orderBy = prop;
      this.queryParams.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    // 置顶
    Topping(id) {
      getchannelCustomertopStatus({ id }).then(() => {
        this.handleQuery();
      });
    },
    // 获取客户列表数据
    getList() {
      this.loading = true;
      getchannelCustomerlist(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        }
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 新增按钮操作 */
    handleAdd(row, rew) {
      if (row == 1) {
        this.$router.push({
          name: "Customer/AddEdit",
          query: { id: rew ? rew.id : undefined },
        });
      }
      if (row == 3) {
        this.$router.push({
          name: "Customer/DetailsPage",
          query: { id: rew.id },
        });
      }
    },
    getCloumns() {
      let columns = JSON.parse(JSON.stringify(this.columns));
      list({ pageName: "irrigationDitchcustomer" }).then((res) => {
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
  },
};
</script>

<style></style>