// 跟进公共方法
import { mapState } from "vuex";
const followUp = {
  data() {
    return {
      formType: "add",
    };
  },
  methods: {
    /** 跟进按钮  */
    handleFollowUp(row) {
      let form = {
        userName: row.userName || this.user.name,
        userId: row.userId || this.user.userId,
        followedId: row.id,
        archiveId:
          this.followUpType && this.followUpType === 5 ? row.id : row.archiveId,
        isHeavyPoint: 0,
        type: this.followUpType, //线索
        followUpCategory: 2,
        isEndFollowUp: 0,
      };

      this.formType = "add";

      this.$refs.followUpRef.show(form);
    },
    handleEdit(row) {
      let form = {
        ...row,
        isFollowUp: 1,
        followUpCategory: 2,
      };
      this.formType = "edit";

      this.$refs.followUpRef.show(form);
    },

    // 跟进回调
    handleSuccess(type, msg, hide) {
      this.$modal.msgSuccess(msg);
      this.getList();
      hide();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
const followUpMinixs = followUp;
export { followUp, followUpMinixs };
