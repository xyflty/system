<template>
  <div>
    <el-dialog
      :title="title"
      :before-close="OpportunityMet"
      :visible.sync="OpportunitySH"
      width="60%"
      append-to-body
    >
      <!-- 查看商机关联项目 -->
      <div v-if="type == 1">
        <div style="margin-bottom: 10px" class="OpportunitySH-top">
          <div>关联项目总数量：</div>
          <div style="margin-right: 10px" class="color">
            {{ param.totalRow }}个
          </div>
          <div>预估总金额：</div>
          <div class="color">¥ {{ param.totalPrice }}</div>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border
          highlight-current-row
          ref="myTable"
          style="width: 100%"
        >
          <el-table-column prop="projectName" align="center" label="项目名称">
            <template slot-scope="{ row }">
              <span>{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectType"
            align="center"
            label="项目二级分类"
          >
            <template slot-scope="{ row }">
              <span>{{ row.projectType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectType" align="center" label="项目类型">
            <template slot-scope="{ row }">
              <span>{{ row.projectType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectId" align="center" label="项目编号">
            <template slot-scope="{ row }">
              <span>{{ row.projectId }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelFloorPrice"
            align="center"
            label="渠道最低限价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelFloorPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelGuidePrice"
            align="center"
            label="渠道指导价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelGuidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="opportunityPrice"
            align="center"
            label="商机报价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.opportunityPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="center" label="数量">
            <template slot-scope="{ row }">
              <span>{{ row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" align="center" label="预估总价">
            <template slot-scope="{ row }">
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看关联子公司 -->
      <el-table
        v-if="type == 2"
        v-loading="loading"
        :data="list"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column
          prop="subsidiaryName"
          align="center"
          label="子公司名称"
        >
          <template slot-scope="{ row }">
            <span>{{ row.subsidiaryName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" align="center" label="子公司可公关地区">
          <template slot-scope="{ row }">
            <span>{{ row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="advantageEvent"
          align="center"
          label="子公司优势项目"
        >
          <template slot-scope="{ row }">
            <span>{{ row.advantageEvent }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mainProject"
          align="center"
          label="子公司主营项目"
        >
          <template slot-scope="{ row }">
            <span>{{ row.mainProject }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看客户优势项目与主营项目 -->
      <el-table
        v-if="type == 3"
        v-loading="loading"
        :data="list"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="city" align="center" label="客户可公关地区">
          <template slot-scope="{ row }">
            <span>{{ row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="advantageEvent"
          align="center"
          label="客户优势项目"
        >
          <template slot-scope="{ row }">
            <span>{{ row.advantageEvent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mainProject" align="center" label="客户主营项目">
          <template slot-scope="{ row }">
            <span>{{ row.mainProject }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看联系人 -->
      <el-table
        v-if="type == 4"
        v-loading="loading"
        :data="list"
        border
        highlight-current-row
        ref="myTable"
        style="width: 100%"
      >
        <el-table-column label="联系人姓名" prop="contactName" align="center">
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="性别">
          <template slot-scope="{ row }">
            <span>{{
              row.projectName == 1 ? "男" : row.projectName == 2 ? "女" : "其他"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="role" align="center" label="角色">
          <template slot-scope="{ row }">
            <span>
              {{ getLabel(commonData[`roleList`], row.role) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="position" align="center" label="职位">
          <template slot-scope="{ row }">
            <span>{{ row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cellphone" align="center" label="手机号码">
          <template slot-scope="{ row }">
            <span>{{ row.cellphone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tencentWx" align="center" label="微信">
          <template slot-scope="{ row }">
            <span>{{ row.tencentWx }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hobby" align="center" label="喜恶">
          <template slot-scope="{ row }">
            <span>{{ row.hobby }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增跟进 -->
      <el-form
        v-if="type == 5 || type == 55 || type == 555"
        ref="form5"
        :rules="rules"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="跟进方式" prop="followUpMethod">
          <el-select v-model="form.followUpMethod">
            <el-option
              v-for="(item, index) in commonData.followMethodList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进时间" prop="followUpTime">
          <el-date-picker
            clearable
            v-model="form.followUpTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="跟进时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="跟进事由" prop="title">
          <el-input v-model="form.title" placeholder="跟进事由" clearable />
        </el-form-item>
        <el-form-item label="工作总结" prop="content">
          <el-input v-model="form.content" placeholder="工作总结" clearable />
        </el-form-item>
        <el-form-item label="上传附件" prop="attachment">
          <el-upload
            drag
            action=""
            :limit="1"
            :http-request="() => {}"
            :show-file-list="true"
            :auto-upload="true"
            :on-remove="changeUpload"
            :on-change="changeUpload"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="type == 5" label="商机状态" prop="status">
          <el-select v-model="form.status" :clearable="true">
            <el-option
              v-for="opportunityStatus in commonData.opportunityStatusList"
              :key="opportunityStatus.value"
              :label="opportunityStatus.label"
              :value="opportunityStatus.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 55" label="订单状态" prop="status">
          <el-select v-model="form.status" :clearable="true">
            <el-option
              v-for="opportunityStatus in commonData.orderStatusList"
              :key="opportunityStatus.value"
              :label="opportunityStatus.label"
              :value="opportunityStatus.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input
            disabled
            v-model="form.companyName"
            placeholder="请输入企业名称"
          />
        </el-form-item>

        <el-form-item label="提醒谁看" prop="remindUserId">
          <el-select
            style="width: 100%"
            v-model="form.remindUserId"
            filterable
            placeholder="提醒谁看"
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
        <el-form-item label="下次跟进时间" prop="nextFollowUpTime">
          <el-date-picker
            v-model="form.nextFollowUpTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跟进人员" prop="userId">
          <el-select
            style="width: 100%"
            v-model="form.userId"
            filterable
            remote
            disabled
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="type == 555"
          label="商机启发"
          prop="opportunityEnlighten"
        >
          <el-input
            type="textarea"
            v-model="form.opportunityEnlighten"
            placeholder="请输入商机启发"
          />
        </el-form-item>

        <el-form-item>
          <div style="float: right; overflow: hidden">
            <el-button @click="submitAdd" type="primary">确 定</el-button>
            <el-button @click="$emit('update:OpportunitySH', false)"
              >取 消</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <!-- 查看成交项目 -->
      <div v-if="type == 6">
        <div style="margin-bottom: 10px" class="OpportunitySH-top">
          <div>关联项目总数量：</div>
          <div style="margin-right: 10px" class="color">
            {{ param.totalRow }}个
          </div>
          <div>预估总金额：</div>
          <div class="color">¥ {{ param.totalPrice }}</div>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border
          highlight-current-row
          ref="myTable"
          style="width: 100%"
        >
          <el-table-column prop="projectName" align="center" label="项目名称">
            <template slot-scope="{ row }">
              <span>{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            align="center"
            label="项目二级分类"
          >
            <template slot-scope="{ row }">
              <span>{{ row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectType" align="center" label="项目类型">
            <template slot-scope="{ row }">
              <span>{{ row.projectType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectId" align="center" label="项目编号">
            <template slot-scope="{ row }">
              <span>{{ row.projectId }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelFloorPrice"
            align="center"
            label="渠道最低限价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelFloorPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelGuidePrice"
            align="center"
            label="渠道指导价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelGuidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bargainPrice" align="center" label="成交单价">
            <template slot-scope="{ row }">
              <span>{{ row.bargainPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="center" label="数量">
            <template slot-scope="{ row }">
              <span>{{ row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" align="center" label="总价">
            <template slot-scope="{ row }">
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看成交项目 -->
      <div v-if="type == 7">
        <div style="margin-bottom: 10px" class="OpportunitySH-top">
          <div>关联项目总数量：</div>
          <div style="margin-right: 10px" class="color">
            {{ param.totalRow }}个
          </div>
          <div>预估总金额：</div>
          <div class="color">¥ {{ param.totalPrice }}</div>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border
          highlight-current-row
          ref="myTable"
          style="width: 100%"
        >
          <el-table-column prop="projectName" align="center" label="项目名称">
            <template slot-scope="{ row }">
              <span>{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            align="center"
            label="项目二级分类"
          >
            <template slot-scope="{ row }">
              <span>{{ row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectType" align="center" label="项目类型">
            <template slot-scope="{ row }">
              <span>{{ row.projectType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectNumber" align="center" label="项目编号">
            <template slot-scope="{ row }">
              <span>{{ row.projectNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelFloorPrice"
            align="center"
            label="渠道最低限价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelFloorPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelGuidePrice"
            align="center"
            label="渠道指导价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelGuidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bargainPrice" align="center" label="成交单价">
            <template slot-scope="{ row }">
              <span>{{ row.bargainPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="center" label="数量">
            <template slot-scope="{ row }">
              <span>{{ row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" align="center" label="成交总价">
            <template slot-scope="{ row }">
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" align="center" label="成交时间">
            <template slot-scope="{ row }">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="type == 8">
        <div style="margin-bottom: 10px" class="OpportunitySH-top">
          <div>关联项目总数量：</div>
          <div style="margin-right: 10px" class="color">
            {{ param.totalRow }}个
          </div>
          <div>预估总金额：</div>
          <div class="color">¥ {{ param.totalPrice }}</div>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border
          highlight-current-row
          ref="myTable"
          style="width: 100%"
        >
          <el-table-column prop="projectName" align="center" label="项目名称">
            <template slot-scope="{ row }">
              <span>{{ row.projectName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            align="center"
            label="项目二级分类"
          >
            <template slot-scope="{ row }">
              <span>{{ row.categoryName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectType" align="center" label="项目类型">
            <template slot-scope="{ row }">
              <span>{{ row.projectType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectNumber" align="center" label="项目编号">
            <template slot-scope="{ row }">
              <span>{{ row.projectNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelFloorPrice"
            align="center"
            label="渠道最低限价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelFloorPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelGuidePrice"
            align="center"
            label="渠道指导价"
          >
            <template slot-scope="{ row }">
              <span>{{ row.channelGuidePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bargainPrice" align="center" label="成交单价">
            <template slot-scope="{ row }">
              <span>{{ row.bargainPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="center" label="数量">
            <template slot-scope="{ row }">
              <span>{{ row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" align="center" label="成交总价">
            <template slot-scope="{ row }">
              <span>{{ row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" align="center" label="成交时间">
            <template slot-scope="{ row }">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        :autoScroll="false"
      />
    </el-dialog>
  </div>
</template>

<script>
import { fileFwbUpload } from "@/api/upload/upload";
import { mapState } from "vuex";
import mixin from "./mixin";
import {
  getChannelRelevanceProjectList,
  getChannelSubsidiaryList,
  getChannelDomainProjectList,
  getchannelContactInfolist,
  getChannelOpportunityFollowUp,
  getchannelOrderProjectlist,
} from "../../../../api/irrigationDitch/opportunity";
import { getchannelOrderfollowUp } from "../../../../api/irrigationDitch/goods";
import { getchannelCustomertopfollowUp } from "../../../../api/irrigationDitch/customer";
export default {
  mixins: [mixin],
  props: {
    type: {
      type: [Number, String],
      default: 0,
    },
    row: {
      type: [Object],
      default: () => {
        return {};
      },
    },
    OpportunitySH: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    userList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      fileList: [],
      form: {
        type: 1,
      },
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      param: {},
      total: 0,
      // 提醒谁看
      // userList: [],
    };
  },
  watch: {
    row: {
      handler(val) {
        this.getList(val);
      },
      deep: true,
    },
    OpportunitySH: {
      handler(val) {
        if (!val) {
          this.$emit("update:type", 0);
          this.queryParams = {
            pageNum: 1,
            pageSize: 10,
          };
          this.total = 0;
          this.list = [];
          this.param = {};
          this.form = {};
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  methods: {
    getList(val) {
      this.loading = true;
      if (val.dialogType == 1) {
        this.queryParams.customerId = val.customerId;
        getChannelRelevanceProjectList(this.queryParams).then((res) => {
          this.list = res.rows;
          this.param = res.param;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 2) {
        if (val.customerId) {
          this.queryParams.customerId = val.customerId;
        } else {
          this.queryParams.customerId = val.id;
        }
        getChannelSubsidiaryList(this.queryParams).then((res) => {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 3) {
        if (val.customerId) {
          this.queryParams.customerId = val.customerId;
        } else {
          this.queryParams.customerId = val.id;
        }
        getChannelDomainProjectList(this.queryParams).then((res) => {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 4) {
        if (val.customerId) {
          this.queryParams.customerId = val.customerId;
        } else {
          this.queryParams.customerId = val.id;
        }
        getchannelContactInfolist(this.queryParams).then((res) => {
          this.list = res.rows;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 5) {
        this.form.customerId = val.customerId;
        this.form.followedId = val.id;
        this.form.userId = val.userId;
        this.form.companyName = val.companyName;
        this.form.type = 3;
      }
      if (val.dialogType == 55) {
        this.form.customerId = val.customerId;
        this.form.followedId = val.id;
        this.form.userId = val.userId;
        this.form.companyName = val.companyName;
        this.form.type = 4;
      }
      if (val.dialogType == 555) {
        this.form.customerId = val.id;
        this.form.followedId = val.id;
        this.form.userId = val.userId;
        this.form.companyName = val.companyName;
        this.form.type = 5;
      }
      if (val.dialogType == 6) {
        this.queryParams.orderId = val.id;
        this.queryParams.customerId = val.customerId;
        getchannelOrderProjectlist(this.queryParams).then((res) => {
          this.list = res.rows;
          this.param = res.param;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 7) {
        this.queryParams.customerId = val.id;
        getchannelOrderProjectlist(this.queryParams).then((res) => {
          this.list = res.rows;
          this.param = res.param;
          this.total = res.total;
          this.loading = false;
        });
      }
      if (val.dialogType == 8) {
        var title = [
          "查看合作证书项目",
          "查看合作安证项目",
          "查看合作资质项目",
          "查看人才项目",
        ];
        this.$emit("update:title", title[val.cooper - 1]);
        // this.title = title[val.cooper - 1];
        this.queryParams.customerId = val.id;
        this.queryParams.cooperationType = val.cooper;
        getchannelOrderProjectlist(this.queryParams).then((res) => {
          this.list = res.rows;
          this.param = res.param;
          this.total = res.total;
          this.loading = false;
        });
      }
    },
    submitAdd() {
      var follow =
        this.type == 5
          ? getChannelOpportunityFollowUp
          : this.type == 55
          ? getchannelOrderfollowUp
          : getchannelCustomertopfollowUp;
      if (this.fileList.length) {
        fileFwbUpload(this.fileList[0].raw).then((res) => {
          this.form.attachment = res.data.url;
          this.$refs["form5"].validate((valid) => {
            if (valid) {
              follow(this.form).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.$emit("update:OpportunitySH", false);
                this.$emit("getchannelFollowUplist");
              });
            }
          });
        });
      } else {
        this.$refs["form5"].validate((valid) => {
          if (valid) {
            follow(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.$emit("update:OpportunitySH", false);
              this.$emit("getchannelFollowUplist");
            });
          }
        });
      }
    },
    changeUpload(file, fileList) {
      this.fileList[0] = file;
    },
    OpportunityMet() {
      this.$emit("update:OpportunitySH", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.OpportunitySH-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .color {
    color: #1890ff;
  }
}
</style>