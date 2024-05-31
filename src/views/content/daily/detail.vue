<template>
  <div class="container" v-loading="!pageLoading">
    <div class="header">
      <div>
        <h3 class="fw_600 fs_18 flex flex-acenter">
          <div>{{ detail.title || "-" }}</div>
          <div
            class="status"
            :class="detail.isRead === 1 ? 'cricle-color' : ''"
          >
            {{ ["未批阅", "已批阅"][detail.isRead] || "-" }}
          </div>
        </h3>
        <div class="mt_20 flex">
          <div class="color_999 fs_14">
            <span>批阅人员：</span
            ><span class="color_333">{{
              (detail.auditUserNames && detail.auditUserNames.join(",")) || "-"
            }}</span>
          </div>
          <div class="ml_20 color_999 fs_14">
            <span>抄送人员：</span
            ><span class="color_333">{{
              detail.ccPersonUserNames || "-"
            }}</span>
          </div>
        </div>
      </div>
      <div
        class="header-btns"
        v-if="
          pageType === '1' &&
          detail.isRead === 0 &&
          isToday(detail.dailyTime) &&
          user.userId == detail.userId
        "
      >
        <el-button type="primary" size="small" @click="handleEdit"
          >编辑报告</el-button
        >
        <el-button type="danger" size="small" @click="handleRemove"
          >删除报告</el-button
        >
      </div>
    </div>

    <div class="content mt_20">
      <div>
        <h3 class="fs_16 mt_20">数据统计</h3>
        <div class="grid">
          <div
            class="flex flex-acenter flex-jcenter is-click"
            @click="handleDetail('customer', 5)"
          >
            <span class="color_999">新增客户</span>
            <span class="main_color">{{ detail.createCustomerCount }}</span>
          </div>
          <div
            class="flex flex-acenter flex-jcenter is-click"
            @click="handleDetail('clue', 1)"
          >
            <span class="color_999">新增线索</span>
            <span class="main_color">{{ detail.createClueCount }}</span>
          </div>
          <!-- <div class="flex flex-acenter flex-jcenter">
            <span class="color_999">新增挖需</span>
            <span class="main_color">{{ detail.createDemandCount }}</span>
          </div> -->
          <div
            class="flex flex-acenter flex-jcenter is-click"
            @click="handleDetail('opportunity', 3)"
          >
            <span class="color_999">新增商机</span>
            <span class="main_color">{{ detail.createOpportunityCount }}</span>
          </div>
          <div
            class="flex flex-acenter flex-jcenter is-click"
            @click="handleDetail('order', 4)"
          >
            <span class="color_999">新增订单</span>
            <span class="main_color">{{ detail.createOrderCount }}</span>
          </div>
          <div class="flex flex-acenter flex-jcenter">
            <span class="color_999">成交金额</span>
            <span class="main_color">{{ detail.createOrderPriceCount }}</span>
          </div>
          <div class="flex flex-acenter flex-jcenter">
            <span class="color_999">跟进次数</span>
            <span class="main_color">{{ detail.followUpCount }}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 class="fs_16 mt_20">工作总结</h3>

        <div class="content_1">
          <EditorRemark height="auto" :remark.sync="detail.workSummary" />
        </div>
      </div>
      <div>
        <h3 class="fs_16 mt_20">工作计划</h3>
        <!-- <div class="content_2" v-html="detail.workPlan"></div> -->
        <div class="content_1">
          <EditorRemark height="auto" :remark.sync="detail.workPlan" />
        </div>
      </div>
      <div v-if="pageLoading">
        <h3 class="fs_16 mt_20">跟进记录</h3>
        <div class="tabs">
          <div class="tabs-item">
            <span
              :class="followType === item.value ? 'active' : ''"
              v-for="item in followTabs"
              :key="item.value"
              @click="toggleTab(item.value)"
            >
              {{ item.label }}<i class="tabs-total">( {{ item.total }} )</i>
            </span>
          </div>
          <div class="tabs-content">
            <timeline :list.sync="list" @refresh="getList" />
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 class="fs_16 mt_20">相关附件</h3>
        <div class="content_1">
          <multi-table
            :Options="accessoryOptions"
            :isSearchForm="false"
            border
            align="center"
            :data="detail.dailyAnnexList"
            @setupEvents="setupEvents"
          >
          </multi-table>
        </div>
      </div>
      <div>
        <h3 class="fs_16 mt_20">相关图片</h3>
        <div class="content_1" v-if="imagesList && imagesList.length">
          <el-image
            class="image"
            style="width: 150px; height: 150px"
            v-for="url in imagesList"
            :key="url"
            :src="url"
            :preview-src-list="[url]"
          ></el-image>
        </div>
        <!-- <el-empty v-else :image-size="100" description="暂无图片"></el-empty> -->
      </div>
      <div>
        <h3 class="fs_16 mt_20">批阅记录</h3>
        <div class="content_1">
          <div
            v-if="detail.dailyCommentVoList && detail.dailyCommentVoList.length"
          >
            <div
              class="content_2"
              v-for="(item, index) in detail.dailyCommentVoList"
              :key="index"
            >
              <p style="display: flex; align-items: center">
                <el-avatar
                  size="small"
                  :src="
                    item.avatar
                      ? item.avatar
                      : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                  "
                ></el-avatar>
                <span class="dailyName">{{ item.createBy }}</span>
                <span class="dailyTime">{{ item.createTime }}</span>
              </p>
              <span class="dailyContent"> {{ item.content }}</span>
            </div>
          </div>
          <el-empty
            v-else
            :image-size="100"
            description="暂无批阅记录"
          ></el-empty>
          <el-input
            v-if="isReview"
            class="reviewInput"
            placeholder="请输入批阅内容"
            v-model="reviewRecord"
            @keyup.enter.native="handleSend"
          >
            <template slot="append"
              ><el-button type="primary" @click="handleSend"
                >发布</el-button
              ></template
            >
          </el-input>
        </div>
      </div>
    </div>

    <!-- 新增编辑操作 -->
    <ReportModel
      :visible.sync="visible"
      :form="form"
      :type="formType"
      @submit="handleSubmit"
    />

    <el-dialog
      title="文件预览"
      class="previewDialog"
      :visible.sync="previewDialog"
      width="1240px"
    >
      <files-view :url="previewUrl"></files-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false">取 消</el-button>
        <el-button type="primary" @click="previewDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="statisticsTitle"
      class="previewDialog"
      :visible.sync="statisticsVisible"
      :lock-scroll="false"
      width="60%"
    >
      <MultiTable :data="statisticsData" :Options="statisticsOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="statisticsVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import timeline from "@/views/core/components/timeline";
import MultiTable from "@/components/MultiTable";
import ReportModel from "@/views/components/ReportModel";
import FilesView from "@/components/FilesView";

import {
  getInfo,
  listByDate,
  dailyComment,
  dailyEdit,
  dailyAnnex,
  dailyRemove,
  getDailyInfoStage,
} from "@/api/content/daily";

import { systemResourceAnnexDel } from "@/api/workOrderProcessing/qualification";

import { accessory } from "./config";

import { downFile } from "@/utils/previewAndDownload";

import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";

import EditorRemark from "@/views/components/EditorRemark";

import { formatterCallback } from "@/utils/common";

export default {
  name: "dailyDetail",
  components: { timeline, MultiTable, ReportModel, FilesView, EditorRemark },
  data() {
    return {
      // 页面加载
      pageLoading: false,
      loading: false,
      // 页面类型，（从那个页面类型进入到详情页）
      pageType: "",
      id: "",
      value: 0,
      date: "",
      active: "0",
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],

      detail: "",

      accessoryOptions: [],
      // 批阅记录
      reviewRecord: "",

      // 图片列表
      imagesList: [],

      // 编辑报告
      visible: false,
      form: {},
      // 表单操作类型
      formType: "edit",

      previewDialog: false, //文件预览
      previewUrl: "", //预览文件路径

      // 跟进类型
      followType: 1,

      followTabs: [
        {
          key: "clue",
          label: "线索",
          value: 1,
          total: 0,
        },
        { key: "opportunity", label: "商机", value: 3, total: 0 },
        { key: "order", label: "订单", value: 4, total: 0 },
        { key: "customer", label: "客户", value: 5, total: 0 },
      ],

      // 批阅人员id
      auditUserIds: [],

      toolbarConfig: {
        excludeKeys: [],
      },

      // 统计弹出框
      statisticsVisible: false,

      statisticsTitle: "新增客户",
      statisticsSource: {
        clue: {
          cloumn: [
            {
              label: "企业名称",
              prop: "companyName",
            },
            {
              label: "数据来源",
              prop: "dataSource",
              formatter: (row, column, value) => {
                return formatterCallback(this.commonData.dataSourceList, value);
              },
            },
            {
              label: "线索来源",
              prop: "clueSourceType",
              formatter: (row, column, value) => {
                return formatterCallback(
                  this.commonData.clueSourceTypeList,
                  value
                );
              },
            },
            {
              label: "客户类型",
              prop: "customerType",
              formatter: (row, column, value) => {
                return formatterCallback(
                  this.commonData.customerTypeList,
                  value
                );
              },
            },
            {
              label: "线索创建时间",
              prop: "createTime",
            },
            {
              label: "下次跟进时间",
              prop: "lastNextFollowUpTime",
            },
          ],
        },
        opportunity: {
          cloumn: [
            {
              label: "商机标题",
              prop: "title",
            },
            {
              label: "企业名称",
              prop: "companyName",
            },
            {
              label: "数据来源",
              prop: "dataSource",
              formatter: (row, column, value) => {
                return formatterCallback(this.commonData.dataSourceList, value);
              },
            },
            {
              label: "客户类型",
              prop: "customerType",
              formatter: (row, column, value) => {
                return formatterCallback(
                  this.commonData.customerTypeList,
                  value
                );
              },
            },
            {
              label: "商机状态",
              prop: "opportunityStatus",
              formatter: (row, column, value) => {
                return formatterCallback(
                  this.commonData.opportunityStatusEnum,
                  value
                );
              },
            },
            {
              label: "下次跟进时间",
              prop: "lastNextFollowUpTime",
            },
          ],
        },
        order: {
          cloumn: [
            {
              label: "订单标题",
              prop: "title",
            },
            {
              label: "关联客户",
              prop: "companyName",
            },
            {
              label: "订单金额",
              prop: "price",
            },
            {
              label: "签单日期",
              prop: "signTime",
            },
            {
              label: "客户类型",
              prop: "customerType",
              formatter: (row, column, value) => {
                return formatterCallback(
                  this.commonData.customerTypeList,
                  value
                );
              },
            },
            {
              label: "数据来源",
              prop: "dataSource",
              formatter: (row, column, value) => {
                return formatterCallback(this.commonData.dataSourceList, value);
              },
            },
          ],
        },
        customer: {
          cloumn: [
            {
              label: "企业名称",
              prop: "companyName",
            },
            {
              label: "客户等级",
              prop: "customerGradeName",
            },
            {
              label: "数据来源",
              prop: "dataSource",
              formatter: (row, column, value) => {
                return formatterCallback(this.commonData.dataSourceList, value);
              },
            },
          ],
        },
      },
      statisticsOptions: [],

      statisticsData: [],
    };
  },

  mounted() {
    this.id = this.$route.query.id;
    this.pageType = this.$route.query.type;
    this.setOption();
    this.getInfo();
  },
  methods: {
    // 判断是否是当前时间
    isToday(date) {
      // 获取当前时间1
      const now = new Date();

      // 将要比较的时间转换成Date对象
      const targetTime = new Date(date);

      return (
        now.getDate() == targetTime.getDate() &&
        now.getMonth() == targetTime.getMonth() &&
        now.getFullYear() == targetTime.getFullYear()
      );
    },
    setOption() {
      if (this.pageType === "1") {
        // 个人才能删除附件信息
        this.accessoryOptions = accessory;
      } else {
        const newOptions = cloneDeep(accessory);
        const actionColumn = newOptions[newOptions.length - 1];

        actionColumn.btns.splice(2, 1);
        this.accessoryOptions = newOptions;
      }
    },
    getList() {
      this.loading = true;
      listByDate({
        ...this.queryParams,
        type: this.followType,
        userId: this.detail.userId,
        followUpTime: this.detail.dailyTime.split(" ")[0],
      }).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    getInfo() {
      let sendParams = {
        id: this.id,
        param: this.pageType,
      };
      getInfo(sendParams)
        .then((res) => {
          this.detail = res.data;
          this.imagesList = this.detail.dailyAnnexList
            .filter((item) =>
              ["jpg", "png", "JPG", "PNG"].includes(item.fileSuffix)
            )
            .map((item) => item.url);

          const { auditUserIds } = this.detail;
          this.auditUserIds = (auditUserIds && auditUserIds.split(",")) || [];
          let infoFollowUpCount = this.detail.infoFollowUpCount;
          this.followTabs.forEach((item) => {
            for (const key in infoFollowUpCount) {
              if (key === item.key) {
                item.total = infoFollowUpCount[key];
              }
            }
          });
          this.pageLoading = true;

          this.getList();
        })
        .catch((error) => {
          this.pageLoading = true;
        });
    },

    // 发布
    handleSend() {
      let sendData = {
        content: this.reviewRecord,
        dailyId: this.id,
        parentId: 0,
        topId: 0,
        userId: this.user.userId,
      };
      dailyComment(sendData).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.getInfo();
          this.$message.success("发布成功");
          this.reviewRecord = "";
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 附件文件表格操作
    setupEvents({ type, row }) {
      if (type === "preview") {
        // 预览
        console.log(row.url);
        this.previewDialog = true;
        this.$nextTick(() => {
          this.previewUrl = row.url;
        });
      } else if (type === "down") {
        // 下载
        downFile(row.url, row.fileName);
      } else if (type === "remove") {
        // 删除

        this.$confirm("此操作将删除该附件文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            systemResourceAnnexDel(row.id).then((res) => {
              if (res.code === 200) {
                this.getInfo();
                this.$message.success("删除成功!");
              } else {
                this.$message.error(res.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 编辑报告
    handleEdit() {
      const {
        auditUserIds,
        workPlan,
        workSummary,
        dailyTime,
        dailyType,
        id,
        dailyAnnexList,
        ccPersonUserList,
      } = this.detail;
      this.form = {
        auditUserIds: auditUserIds && auditUserIds.split(","),
        workPlan,
        workSummary,
        dailyTime,
        dailyType,
        id,
        dailyAnnexList,
        ccPersonUserIds:
          ccPersonUserList && ccPersonUserList.map((item) => item.userId),
      };
      console.log(this.form, "this.form");
      this.visible = true;
    },
    // 报告修改保存
    handleSubmit(form, done) {
      console.log(form);
      const { fileUpload, auditUserIds, ccPersonUserIds } = form;
      let sendData = {
        ...form,
        auditUserIds: auditUserIds.join(","),
        ccPersonUserIds: ccPersonUserIds.join(","),
      };
      delete sendData.fileUpload;
      console.log(fileUpload);

      dailyEdit(sendData)
        .then(async (res) => {
          const result = await dailyAnnex(fileUpload);
          if (result.code !== 200) {
            done();
          }
          if (res.code === 200) {
            this.getInfo();
            done();
            this.visible = false;
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.msg);
            done();
          }
        })
        .catch((err) => {
          done();
        });
      done();
    },

    // 删除报告
    handleRemove() {
      this.$confirm("此操作将删除该工作报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dailyRemove(this.id).then((res) => {
            if (res.code === 200) {
              this.$message.success("删除成功!");
              this.$router.push({ path: "content/daily" });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 切换跟进记录
    toggleTab(index) {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 10;
      this.followType = index;
      this.getList();
    },

    // 展示数据统计弹出框
    handleDetail(type, num) {
      let title = {
        clue: "新增线索",
        customer: "新增客户",
        opportunity: "新增商机",
        order: "新增订单",
      };
      this.statisticsTitle = title[type];
      let sendParams = {
        commitUserId: this.detail.userId,
        dailyTime: this.detail.dailyTime.split(" ")[0],
        followUpType: num,
      };
      getDailyInfoStage(sendParams).then((res) => {
        console.log(res);
        this.statisticsOptions = this.statisticsSource[type].cloumn;
        if (["opportunity", "clue", "order"].includes(type)) {
          res.data.forEach((item) => {
            let customerArchiveVo = item.customerArchiveVo;
            item.companyName = customerArchiveVo.companyName;
            item.dataSource = customerArchiveVo.dataSource;
            item.customerType = customerArchiveVo.customerType;
          });
        }
        this.statisticsData = res.data;
        this.statisticsVisible = true;
      });

      //
    },
  },

  computed: {
    ...mapState(["user"]),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    // 是否显示批阅发布
    isReview() {
      return this.auditUserIds.includes(this.user.userId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.container {
  background-color: rgb(240, 242, 245);
  padding: 20px 100px;
  .header {
    display: flex;
    justify-content: space-between;
    .status {
      &::before {
        content: "";
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #f56c6c;
      }
    }
    .cricle-color {
      &::before {
        background: #67c23a;
      }
    }
  }
  .header,
  .content {
    position: relative;
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

::v-deep .pagination-container {
  height: 60px;
}
.edit_btn {
  position: absolute;
  top: 20px;
  right: 30px;
}
.status {
  margin-left: 20px;
  font-weight: 400;
  // color: #999;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
  div {
    width: 80%;
    height: 60px;
    margin-top: 20px;
    border-radius: 40px;
    border: 1px solid #eeeeee;
    span:last-child {
      margin-left: 10px;
    }
  }
}
.content_2 {
  margin-top: 20px;
  border: 1px solid #e9e9e9;
  padding: 20px;
  background: #fcfcfc;

  ::v-deep p {
    color: #666;
    line-height: 28px;
  }
  ::v-deep p:last-child {
    margin-bottom: 10px;
  }
}

.content_1 {
  margin-top: 20px;
}
.image {
  &:not(:last-child) {
    margin-right: 15px;
  }
}
.reviewInput {
  margin-top: 15px;
}
.dailyName {
  margin: 0 10px;
  font-size: 16px;
  color: #666;
}
.dailyTime {
  font-size: 14px;
  color: #999;
}
.dailyContent {
  color: #999;
  display: inline-block;
  margin-top: 15px;
}

.tabs {
  .tabs-item {
    width: 50%;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .active {
      color: #409eff;
      font-weight: bold;
    }
  }
}

::v-deep .wangeditor-toolbar {
  display: none;
}

.is-click {
  cursor: pointer;
}

.tabs-total {
  font-style: normal;
  font-weight: 500;
  padding-left: 5px;
}
</style>
