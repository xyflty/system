<template>
  <div class="container">
    <div class="header">
      <h3 class="fw_600 fs_18">{{ detail.companyName || "-" }}</h3>
      <div class="mt_20 flex">
        <div class="color_999 fs_14">
          <span>跟进人：</span
          ><span class="color_333">{{ detail.userName || "-" }}</span>
        </div>
        <div class="ml_20 color_999 fs_14">
          <span>联系人姓名：</span
          ><span class="color_333">{{
            detail.channelContactInfoVoList.length > 0
              ? detail.channelContactInfoVoList[0].contactName
              : "-"
          }}</span>
        </div>
        <div class="ml_20 color_999 fs_14">
          <span>下次跟进：</span
          ><span class="color_333">{{
            detail.lastNextFollowUpTime || "-"
          }}</span>
        </div>
      </div>
      <div class="mt_20 flex">
        <el-select
          v-model="detail.opportunityStatus"
          disabled
          placeholder="请选择"
        >
          <el-option
            v-for="opportunityStatus in commonData.opportunityStatusList"
            :key="opportunityStatus.value"
            :label="opportunityStatus.label"
            :value="opportunityStatus.value"
          />
        </el-select>
        <el-button
          v-hasPermi="['channel:channelOpportunity:conversionToOrder']"
          plain
          style="margin-left: 10px"
          icon="el-icon-refresh"
          :disabled="detail.isLoss == 1"
          @click="
            $router.push({
              name: 'Opportunity/ConvertOrder',
              query: { id },
            })
          "
          >转为订单</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit-outline"
          :disabled="detail.isLoss == 1"
          @click="dialogSH(5)"
          v-hasPermi="['channel:channelOpportunity:followUp']"
          >写新跟进</el-button
        >
        <el-button
          plain
          style="margin-left: 10px"
          icon="el-icon-edit"
          :disabled="detail.isLoss == 1"
          @click="
            $router.push({
              name: 'Opportunity/AddEdit',
              query: { id },
            })
          "
          >编辑商机</el-button
        >
      </div>
    </div>
    <div class="content mt_20">
      <el-tabs v-model="active" @tab-click="handleClickTab">
        <el-tab-pane label="概况信息" name="0">
          <div class="" v-for="(item, index) in FormData" :key="item.key">
            <template v-if="index == 0">
              <h3 class="fs_16 mt_30">{{ item.name }}</h3>

              <el-descriptions
                class="mt_10"
                :column="2"
                border
                :contentStyle="CS"
                :label-style="LS"
              >
                <el-descriptions-item
                  v-for="(item, index) in item.children"
                  :key="index"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </div>

          <h3 class="fs_16 mt_30">联系人</h3>
          <el-table
            :data="detail.channelContactInfoVoList"
            class="mt_20"
            border
          >
            <el-table-column
              label="联系人姓名"
              align="center"
              prop="contactName"
            />
            <el-table-column label="性别" align="center" prop="gender">
              <template slot-scope="{ row }">
                {{ row.gender == 1 ? "先生" : "女士" }}
              </template>
            </el-table-column>
            <el-table-column label="手机号码" align="center" prop="cellphone" />
            <el-table-column label="微信账号" align="center" prop="tencentWx" />
            <el-table-column label="角色" align="center" prop="role">
              <template slot-scope="{ row }">
                {{ getLabel(commonData[`roleList`], row.role) }}
              </template>
            </el-table-column>
            <el-table-column label="部门职务" align="center" prop="position" />
            <el-table-column label="喜恶" align="center" prop="hobby" />
          </el-table>

          <div class="" v-for="(item, index) in FormData" :key="index">
            <template v-if="index == 1">
              <h3 class="fs_16 mt_30">{{ item.name }}</h3>

              <el-descriptions
                class="mt_10"
                :column="2"
                border
                :contentStyle="CS"
                :label-style="LS"
              >
                <el-descriptions-item
                  v-for="item in item.children"
                  :key="item.key"
                >
                  <template slot="label">
                    {{ item.name }}<span v-show="item.name">：</span>
                  </template>
                  {{ item.value }}
                </el-descriptions-item>
              </el-descriptions>
            </template>
          </div>
          <!-- 商机动态 -->
          <div class="opportunity-box">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16 mt_20">商机动态</h3>
              <div>
                <el-checkbox v-model="checked">只看跟进</el-checkbox>
                <el-button
                  plain
                  style="margin-left: 10px"
                  icon="el-icon-edit-outline"
                  @click="dialogSH(5)"
                  v-hasPermi="['channel:channelOpportunity:followUp']"
                  >写跟进</el-button
                >
              </div>
            </div>

            <timeline
              :userList="userList"
              :typeL="5"
              :list.sync="list"
              @refresh="getchannelFollowUplist"
            />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getchannelFollowUplist"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户优势项目与主营项目" name="1">
          <el-table :data="addItemList" stripe style="width: 100%" border>
            <el-table-column prop="city" label="客户可公关地区" />
            <el-table-column prop="advantageEvent" label="客户优势项目" />
            <el-table-column prop="mainProject" label="客户主营项目" />
          </el-table>
          <pagination
            v-show="addItemTotal > 0"
            :total="addItemTotal"
            :page.sync="addItemListQueryParams.pageNum"
            :limit.sync="addItemListQueryParams.pageSize"
            @pagination="getChannelDomainProjectList"
          />
        </el-tab-pane>

        <el-tab-pane label="商机关联项目" name="2">
          <div style="margin-bottom: 10px" class="OpportunitySH-top">
            <div>关联项目总数量：</div>
            <div style="margin-right: 10px" class="color">
              {{ this.Associatedpri.totalRow }}个
            </div>
            <div>预估总金额：</div>
            <div class="color">¥ {{ this.Associatedpri.totalPrice }}</div>
          </div>
          <el-table
            :data="Associatedlist"
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
          <pagination
            v-show="Associatedtotal > 0"
            :total="Associatedtotal"
            :page.sync="AssociatedParams.pageNum"
            :limit.sync="AssociatedParams.pageSize"
            @pagination="getChannelRelevanceProjectList"
          />
        </el-tab-pane>
        <el-tab-pane label="关联子公司" name="3">
          <el-table
            :data="subsidiaryList"
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
            <el-table-column
              prop="city"
              align="center"
              label="子公司可公关地区"
            >
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
          <pagination
            v-show="subsidiaryTotal > 0"
            :total="subsidiaryTotal"
            :page.sync="subsidiaryParams.pageNum"
            :limit.sync="subsidiaryParams.pageSize"
          />
          <!-- @pagination="getList" -->
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="4">
          <div class="mt_30">
            <div class="flex flex-between flex-acenter">
              <h3 class="fs_16">跟进记录</h3>
              <div class="flex flex-acenter">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="dateMonth"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-input
                  placeholder="请输入内容"
                  v-model="queryParams.keyword"
                  class="input-with-select"
                  style="margin-left: 20px"
                >
                  <el-button
                    @click="getchannelFollowUplist"
                    slot="append"
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  style="margin-left: 20px"
                  >导出</el-button
                >
              </div>
            </div>
            <timeline
              :userList="userList"
              :typeL="5"
              :list.sync="list"
              @refresh="getchannelFollowUplist"
            />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getchannelFollowUplist"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <opportunity-dialog
      :OpportunitySH.sync="opportunityDialog.OpportunitySH"
      :title="opportunityDialog.title"
      :type.sync="opportunityDialog.type"
      :row="opportunityDialog.row"
      @getchannelFollowUplist="getchannelFollowUplist"
      :userList="userList"
    ></opportunity-dialog>
  </div>
</template>

<script>
import opportunityDialog from "../components/opportunity_dialog.vue";
import data from "./data";
import timeline from "../components/timeline";
import { listUser } from "@/api/system/user";
import { mapState } from "vuex";
import {
  getchannelOpportunityInfo,
  getchannelFollowUplist,
  getChannelDomainProjectList,
  getChannelRelevanceProjectList,
  getChannelSubsidiaryList,
} from "../../../../api/irrigationDitch/opportunity";
export default {
  components: { timeline, "opportunity-dialog": opportunityDialog },
  name: "opportunityDetail",
  watch: {
    dateMonth: {
      handler(n) {
        this.queryParams.startDate = n != null ? n[0] : "";
        this.queryParams.endDate = n != null ? n[1] : "";
      },
      deep: true,
    },
  },
  data() {
    return {
      // 商机动态跟进的时间
      dateMonth: [],
      // 跟进内容
      opportunityDialog: {
        title: "新增跟进",
        OpportunitySH: false,
        type: undefined,
        row: undefined,
      },
      // 客户优势项目与主营项目 数据
      addItemList: [],
      // 客户优势项目与主营项目 请求数据
      addItemListQueryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
      },
      // 客户优势项目与主营项目 total
      addItemTotal: 0,
      // 商机总数
      Associatedpri: {},
      // 商机关联项目 数据
      Associatedlist: [],
      // 商机关联项目 total
      Associatedtotal: 0,
      // 商机关联项目 请求数据
      AssociatedParams: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
      },
      // 关联子项目 数据
      subsidiaryList: [],
      // 关联子项目 total
      subsidiaryTotal: 0,
      // 关联子项目 请求数据
      subsidiaryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
      },
      id: "",
      // tab切换
      active: "0",
      ...data,
      // 只看跟进 （不懂）
      checked: false,
      // 商机动态接口total
      total: 0,
      // 商机动态接口内容
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 3,
      },
      // 商机动态返回内容
      list: [],
      // 跟进记录 输入框
      searchValue: "",
      // 查询用户列表 数据
      userList: [],
      // 全局数据
      detail: {
        channelContactInfoVoList: [],
      },

      shareOpportunityFormRules: {
        shareUserId: [{ required: true, message: "不能为空", trigger: "blur" }],
      },

      // 描述列表样式
      CS: {
        "text-align": "center", //文本居中
        "min-width": "250px", //最小宽度
        "word-break": "break-all", //过长时自动换行
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "100px",
        "word-break": "keep-all",
      },
    };
  },

  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  created() {
    this.id = this.$route.query.id;
    this.getUserList();
    // 概括信息
    this.getList(this.id);
    // 跟进列表
    this.queryParams.followedId = this.id;
    this.getchannelFollowUplist(this.id);
  },
  methods: {
    // 获取商机动态信息
    getList(id) {
      getchannelOpportunityInfo({ id }).then((res) => {
        this.detail = res.data;
        this.FormData.forEach((item, index) => {
          item.children.forEach((item) => {
            item.value = this.detail[item.key];
            if (item.key == "opportunityStatus") {
              item.value = this.getLabel(
                this.commonData[`opportunityStatusList`],
                this.detail[item.key]
              );
            }
          });
        });
      });
    },
    // 跟进列表
    getchannelFollowUplist(id) {
      getchannelFollowUplist(this.queryParams).then((res) => {
        this.list = res.rows;
        this.total = res.total;
      });
    },
    // 客户优势项目与主营项目
    getChannelDomainProjectList() {
      getChannelDomainProjectList(this.addItemListQueryParams).then((res) => {
        this.addItemList = res.rows;
        this.addItemTotal = res.total;
      });
    },
    // 商机关联项目
    getChannelRelevanceProjectList() {
      getChannelRelevanceProjectList(this.AssociatedParams).then((res) => {
        this.Associatedpri = res.param;
        this.Associatedlist = res.rows;
        this.Associatedtotal = res.total;
      });
    },
    // 子公司
    getChannelSubsidiaryList() {
      getChannelSubsidiaryList(this.subsidiaryParams).then((res) => {
        this.subsidiaryList = res.rows;
        this.subsidiaryTotal = res.total;
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

    handleClickTab(tab, event) {
      if (tab.index == 1) {
        this.addItemListQueryParams.customerId = this.detail.customerId;
        this.getChannelDomainProjectList();
      }
      if (tab.index == 2) {
        this.AssociatedParams.customerId = this.detail.customerId;
        this.getChannelRelevanceProjectList();
      }
      if (tab.index == 3) {
        this.subsidiaryParams.customerId = this.detail.customerId;
        this.getChannelSubsidiaryList();
      }
    },
    dialogSH(row) {
      this.opportunityDialog.OpportunitySH = true;
      this.opportunityDialog.type = row;
      this.opportunityDialog.row = { ...this.detail, dialogType: row };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.OpportunitySH-top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .color {
    color: #1890ff;
  }
}
.container {
  background-color: rgb(240, 242, 245);
  padding: 20px 100px;
  .header,
  .content {
    background: #fff;
    padding: 30px;
    overflow: hidden;
    .mt_30 {
      margin-top: 30px;
    }
    .opportunity-box {
      margin-top: 40px;
    }
  }
}
::v-deep .pagination-container {
  height: 60px;
}
</style>
