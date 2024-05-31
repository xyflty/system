import { customerArchiveShare } from "@/api/core/share";

export const share = {
  data() {
    return {
      shareVisible: false,
      shareForm: {
        shareUserId: "",
      },
      archiveId: "",
    };
  },
  methods: {
    // 表格点击分享操作
    handleShare(row) {
      if (row.userId != this.user.userId)
        return this.$message.error("请共享属于自己的数据");
      if (this.shareType === "customer") {
        this.archiveId = row.id;
      } else {
        this.archiveId = row.archiveId;
      }

      this.shareVisible = true;
      this.$nextTick(() => {
        this.shareForm.shareUserId = row.shareUserId;
      });
    },
    // 分享
    shareSubmit({ model }) {
      console.log(model);
      let msg = "已分享";
      this.shareCallBack(model.shareUserId, msg);
    },
    // 取消分享
    shareReset({ type }) {
      if (type === "close") {
        this.resetFn();
        return;
      }
      let msg = "已取消分享";
      this.shareCallBack(null, msg);
    },
    // 重置数据
    resetFn() {
      this.shareVisible = false;
      this.shareForm.shareUserId = "";
    },
    /**
     * 调用分享接口
     * @param {传递的参数} shareUserId
     * @param {成功的信息} msg
     */
    async shareCallBack(shareUserId, msg) {
      let sendData = {
        archiveId: this.archiveId,
        shareUserId: shareUserId,
      };
      const res = await customerArchiveShare(sendData);
      if (res.code === 200) {
        this.$message.success(msg);
        this.getList();
        this.resetFn();
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
