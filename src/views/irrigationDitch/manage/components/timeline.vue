<template>
  <div class="mt_30" style="padding: 4px; box-sizing: content-box">
    <el-timeline>
      <el-timeline-item
        placement="top"
        v-for="(item, index) in dataList"
        :key="index"
        :timestamp="item.followUpTime || '-'"
        color="#0079fe"
      >
        <div class="clue-box-item">
          <div class="flex flex-between">
            <div class="flex flex-acenter">
              <img
                :src="
                  item.avatar ||
                  require('@/assets/images/user_default_avatar.png')
                "
                alt=""
                class="avatar"
              />
              <span class="ml_10">{{ item.userName || "-" }}</span>
              <span class="ml_10"
                >{{ typeStr_1(item.type) }}跟进({{
                  typeStr_2(item.followUpMethod) || "-"
                }})</span
              >
            </div>
            <div class="flex flex-acenter color_999">
              <!-- <span class="mr_10">X</span> -->
              <span> {{ item.createTime || "-" }}</span>
            </div>
          </div>
          <div class="mt_10 color_999">
            <span class="color_666">跟进事由：</span>
            <span>{{ item.title || "-" }}</span>
            <br /><br />
            <span class="color_666">工作总结：</span>
            <span>{{ item.content || "-" }}</span>
          </div>
          <div class="flex flex-between mt_20 color_999 flex-acenter">
            <div
              @click="$emit('showCustomerInfo', item.customerId)"
              style="cursor: pointer"
            >
              <span class="color_666">来自客户：</span>
              <span>{{ item.companyName || "-" }}</span>
            </div>
            <div v-if="!hiddenbtn">
              <el-button
                plain
                style="margin-left: 10px"
                icon="el-icon-d-arrow-right"
                @click="handleDetail(item)"
                >详情</el-button
              >
              <el-dropdown
                size="mini"
                @command="(command) => handleCommand(command, item)"
              >
                <span class="el-dropdown-link">
                  <el-button
                    plain
                    style="margin-left: 10px"
                    icon="el-icon-chat-dot-round"
                    >评论
                    <span>({{ item.countFollowComment }})</span></el-button
                  >
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-hsaPermi="['channel:channelFollowUpComment:add']"
                    command="handleCommentInput"
                    >输入评论</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-hsaPermi="['channel:channelFollowUpComment:list']"
                    command="handleCommentShow"
                    >查看</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <!-- 子评论 -->
          <!-- <div class="child-box" v-if="index == 2">
            <div class="flex flex-between">
              <div class="flex flex-acenter">
                <img
                  src="@/assets/images/user_default_avatar.png"
                  alt=""
                  class="avatar"
                />
                <span class="ml_10">张翠花</span>
                <span class="ml_10">跟进(到访)</span>
                <span class="ml_10 color_999"> 2021-07-23 22:31</span>
              </div>
              <div class="flex flex-acenter color_999">
                <!~~ <span class="mr_10">X</span> ~~>
              </div>
            </div>
            <div class="mt_10 color_999">
              上门拜访了客户，客户对产品意向很高，但是希望价格能有优惠。
            </div>
          </div>  -->
          <!-- 评论 -->
          <div class="common-box mt_20" v-show="item.commentStatus">
            <el-input
              placeholder="请输入内容"
              v-model="item.comment"
              class="input-with-select"
            >
              <el-button slot="append" type="success" @click="handleAdd(item)"
                >评论</el-button
              >
            </el-input>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>

    <el-dialog
      title="跟进详情"
      :visible.sync="dialogVisibleDetail"
      width="40%"
      append-to-body
    >
      <el-descriptions
        class="margin-top"
        title=""
        :label-style="LS"
        :column="1"
        border
      >
        <el-descriptions-item>
          <template slot="label"> 跟进类型： </template>
          {{ typeStr_1(detail.type) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进方式： </template>
          {{ typeStr_2(detail.followUpMethod) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进时间： </template>
          {{ detail.followUpTime || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进事由： </template>
          {{ detail.title || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 工作总结： </template>
          {{ detail.content || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 当前状态： </template>
          {{ statusStr(detail.status) || "-" }}
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template slot="label"> 联系人： </template>
          {{ detail.contactPerson || "-" }}
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label"> 相关附件： </template>
          <img
            :src="detail.attachment"
            class="attach-icon"
            @click="
              $viewerApi({
                images: detail.attachment,
              })
            "
            alt=""
          />
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 评论数量： </template>
          {{ detail.countFollowComment }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进人员： </template>
          {{ detail.createBy || "-" }}
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template slot="label"> 提醒谁看： </template>
          {{ detail.userList || "-" }}
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template slot="label"> 创建时间： </template>
          {{ detail.createTime || "-" }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">取 消</el-button>
        <el-button
          v-hasPermi="[
            'channel:channelOpportunity:editFollowUp',
            'channel:channelOrder:editFollowUp',
            'channel:channelCustomer:editFollowUp',
          ]"
          type="primary"
          @click="handleEdit(detail)"
          >编辑跟进</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="查看评论"
      :visible.sync="dialogVisibleComment"
      width="40%"
      append-to-body
    >
      <div class="child-box" v-for="(item, index) in commentList" :key="index">
        <div class="flex flex-between">
          <div class="flex flex-acenter">
            <img
              :src="
                item.avatar ||
                require('@/assets/images/user_default_avatar.png')
              "
              alt=""
              class="avatar"
            />
            <span class="ml_10">{{ item.userName || "-" }}</span>
            <!-- <span class="ml_10"
              >跟进({{ typeStr(item.followUpMethod) || "-" }})</span
            > -->
            <span class="ml_10 color_999"> {{ item.createTime || "-" }}</span>
          </div>
          <div class="flex flex-acenter color_999">
            <!-- <span class="mr_10">X</span> -->
          </div>
        </div>
        <div class="mt_10 color_999 content">
          {{ item.content || "-" }}
        </div>
      </div>
      <pagination
        v-show="total"
        :total="total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="getCommentList"
      />
    </el-dialog>
    <el-dialog
      title="编辑跟进"
      :visible.sync="followUpOpen"
      width="60%"
      append-to-body
    >
      <el-form
        :rules="rules"
        ref="form5"
        :model="followUpForm"
        label-width="120px"
      >
        <el-form-item label="跟进方式" prop="followUpMethod">
          <el-select v-model="followUpForm.followUpMethod">
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
            v-model="followUpForm.followUpTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="跟进时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="跟进事由" prop="title">
          <el-input
            v-model="followUpForm.title"
            placeholder="跟进事由"
            clearable
          />
        </el-form-item>
        <el-form-item label="工作总结" prop="content">
          <el-input
            v-model="followUpForm.content"
            placeholder="工作总结"
            clearable
          />
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
            :file-list="fileList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="typeL == 5" label="商机状态" prop="status">
          <el-select v-model="followUpForm.status" :clearable="true">
            <el-option
              v-for="opportunityStatus in commonData.opportunityStatusList"
              :key="opportunityStatus.value"
              :label="opportunityStatus.label"
              :value="opportunityStatus.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeL == 55" label="订单状态" prop="status">
          <el-select v-model="followUpForm.status" :clearable="true">
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
            v-model="followUpForm.companyName"
            placeholder="请输入企业名称"
          />
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextFollowUpTime">
          <el-date-picker
            v-model="followUpForm.nextFollowUpTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跟进人员" prop="userId">
          <el-select
            style="width: 100%"
            v-model="followUpForm.userId"
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
          v-if="typeL == 555"
          label="商机启发"
          prop="opportunityEnlighten"
        >
          <el-input
            type="textarea"
            v-model="followUpForm.opportunityEnlighten"
            placeholder="请输入商机启发"
          />
        </el-form-item>
        <el-form-item prop="note">
          <div style="float: right; overflow: hidden">
            <el-button @click="submitAdd" type="primary">确 定</el-button>
            <el-button @click="followUpOpen = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fileFwbUpload } from "@/api/upload/upload";
import {
  getchannelFollowUpId,
  channelOpportunityeditFollowUp,
  getchannelFollowUpComment,
  getchannelFollowUpCommentlist,
} from "../../../../api/irrigationDitch/opportunity";
import { getchannelOrdereditFollowUp } from "../../../../api/irrigationDitch/goods";
import { getchannelCustomereditFollowUp } from "../../../../api/irrigationDitch/customer";
import followUpDialog from "@/views/core/components/followUp.vue";
import mixin from "./mixin";
import { mapState } from "vuex";
export default {
  mixins: [mixin],
  props: {
    typeL: {
      type: Number,
      default: 5,
    },
    list: {
      type: Array,
      default: () => [],
    },
    hiddenbtn: {
      type: Boolean,
      default: false,
    },
    userList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),

    attachmentArr() {
      return (
        this.detail.attachment != undefined &&
        this.detail.attachment.length &&
        this.detail.attachment.split(",")
      );
    },
    type() {
      return this.detail.type != undefined ? Number(this.detail.type) : 0;
    },
  },
  watch: {
    list: {
      handler(n) {
        this.list.forEach((item) => {
          item.commentStatus = false;
          item.comment = "";
        });
        this.dataList = JSON.parse(JSON.stringify(this.list));
      },
      immediate: true,
    },
  },
  components: { followUpDialog },
  data() {
    return {
      detail: "",
      dialogVisibleDetail: false,
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "60px",
        "max-width": "60px",
        "word-break": "keep-all",
      },
      followUpForm: {},
      followUpOpen: false,
      dataList: [],
      dialogVisibleComment: false,
      commentList: [],

      query: {
        pageNum: 1,
        pageSize: 10,
        followUpId: "",
      },
      total: 0,
      // userList: [],
      fileList: [],
    };
  },
  methods: {
    submitAdd() {
      var follow =
        this.typeL == 5
          ? channelOpportunityeditFollowUp
          : this.typeL == 55
          ? getchannelOrdereditFollowUp
          : getchannelCustomereditFollowUp;

      if (this.fileList.length && this.fileList[0].size) {
        fileFwbUpload(this.fileList[0].raw).then((res) => {
          this.followUpForm.attachment = res.data.url;
          this.$refs["form5"].validate((valid) => {
            if (valid) {
              follow(this.followUpForm).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.followUpOpen = false;
                this.$emit("refresh");
              });
            }
          });
        });
      } else {
        this.$refs["form5"].validate((valid) => {
          if (valid) {
            follow(this.followUpForm).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.followUpOpen = false;
              this.$emit("refresh");
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

    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleCommentInput":
          this.handleSubmitComment(row);
          break;
        case "handleCommentShow":
          this.getCommentList(row);
          break;
        default:
          break;
      }
    },

    typeStr_2(index) {
      return this.getLabel(this.commonData.followMethodList, index);
    },

    typeStr_1(index) {
      return this.getLabel(this.commonData.businessTypeList, index);
    },

    statusStr(index) {
      if (index == null || index == undefined) {
        return;
      }
      const currentTypeEn = `${
        this.commonData.typeEn[this.detail.type - 1]
      }StatusList`;
      const statuslist = this.commonData[currentTypeEn];
      return this.getLabel(statuslist, index);
    },

    handleDetail(row) {
      getchannelFollowUpId(row.id).then((res) => {
        this.detail = res.data;
        this.detail.followUpMethod = Number(res.data.followUpMethod);
        if (res.data.attachment) {
          let file = res.data.attachment.substring(
            res.data.attachment.lastIndexOf("/") + 1,
            res.data.attachment.lastIndexOf(".")
          );
          this.fileList[0] = { url: res.data.attachment, name: file };
        }
        this.dialogVisibleDetail = true;
      });
    },

    handleEdit(val) {
      this.followUpOpen = true;
      this.followUpForm = val;
    },

    // 获取评论列表
    getCommentList(item) {
      this.query.followUpId = item.id;
      getchannelFollowUpCommentlist(this.query).then((res) => {
        this.commentList = res.rows;
        this.total = res.total;
        if (res.total) {
          this.dialogVisibleComment = true;
        } else {
          this.$message.warning("暂无评论数据查看");
        }
      });
    },

    // 输入评论
    handleSubmitComment(item) {
      this.dataList.forEach(
        (val) => item.id == val.id && (val.commentStatus = true)
      );
    },

    // 提交
    handleAdd(item) {
      if (item.comment.trim().length == 0) {
        this.$message.error("请输入评价内容");
        return;
      }
      getchannelFollowUpComment({
        followUpId: item.id,
        content: item.comment,
        parentId: 0,
        topId: 0,
      }).then((res) => {
        this.dataList.forEach(
          (val) => item.id == val.id && (val.commentStatus = false)
        );
        this.$message.success("评论成功！");
        this.$emit("refresh");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

.attach-icon {
  width: 50px;
  height: 50px;
  // border-radius: 50%;
  margin-right: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.clue-box-item {
  padding: 10px 20px;
  background: #f7fbfe;
  border: 1px solid rgba(215, 232, 244, 1);

  .child-box {
    margin-top: 20px;
    padding: 10px 20px;
    background: #fff;
    border: 1px solid rgba(215, 232, 244, 1);
  }
}
.content {
  padding: 0 20px 30px 40px;
}
</style>
