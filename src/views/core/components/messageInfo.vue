<template>
  <el-dialog
    title="消息详情"
    :visible="show"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="close"
  >
    <h3 class="fw_600 fs_18">{{ detail.title || "-" }}</h3>
    <div class="mt_20 flex detail-box">
      <div class="color_999 fs_14">
        <span>消息类型：</span
        ><span class="color_333">{{
          ["任务类", "业务类", "审核类", "协同通知"][detail.messageType - 1] ||
          "-"
        }}</span>
      </div>
      <div class="ml_20 color_999 fs_14">
        <span>发布时间：</span
        ><span class="color_333">{{ detail.receiveTime || "-" }}</span>
      </div>
      <div class="ml_20 color_999 fs_14">
        <span>接收人员：</span
        ><span class="color_333">{{ detail.toUserName || "-" }}</span>
      </div>
    </div>
    <div class="mt_20">
      <p @click="showContent(detail)">{{ detail.content || "-" }}</p>
    </div>
  </el-dialog>
</template>

<script>
import { getInfo } from "@/api/content/message";

export default {
  name: "MessageInfo",
  props: {
    row: {
      Type: Object,
      default: () => {},
    },
    show: {
      Type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detail: "",
      showDialog: false,
      companyName: "", // 将公司名称传入vuex 在另一页面进行操作
    };
  },
  watch: {
    row: {
      handler(n) {
        this.getInfo(n);
      },
    },
  },
  methods: {
    // 点击高亮跳转至指定页面
    showContent(item) {
      console.log(item);

      if (item.messageType == 1) {
        this.companyName = item.relateId;
        this.$store.commit("TRANSMIT_Id", this.companyName);
        this.$router.push({
          path: item.path,
        });
      } else if (item.messageType == 2) {
        if (item.path !== null) {
          this.$router.push({
            path: item.path + item.relateId,
          });
        }
      } else {
        this.$router.push({
          path: item.path,
        });
      }
    },
    // 详情
    getInfo(row) {
      getInfo(row.id).then((res) => {
        this.detail = res.data;
        this.showDialog = true;
      });
    },
    close() {
      this.$emit("loadCount");
      this.$emit("on-load");
      this.$emit("update:show", false);
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

::v-deep .el-dialog__body {
  min-height: 400px;
}

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}

.detail-box {
  border: 1px solid #e4e4e4;
  padding: 10px 5px;

  background: #f9f9f9;
}

.mt_20 {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
