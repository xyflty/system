<template>
  <div class="app-container">
    <Backlog
      class="schedule-box"
      :deptOptions="deptOptions"
      :waitDeptId="deptId"
      :userMap="userMap"
      :activeWait.sync="activeWait"
      :userProp="{ value: 'userId', label: 'userName' }"
      @dept="changeDept"
    />
  </div>
</template>

<script>
import Backlog from "@/views/components/homeComponents/Backlog";

// 混入
import { userAndDept } from "@/views/newreport/customer/mixins/userAnddept.js";

import { systemUserListForSelect } from "@/api/system/user";
import { mapState } from "vuex";
export default {
  components: {
    Backlog,
  },
  mixins: [userAndDept],
  data() {
    return {
      userMap: [],
      activeWait: "",
      deptId: "",
    };
  },
  created() {
    const { type, activeWait, deptId } = this.$route.query;

    this.activeWait = type == 1 ? activeWait : this.user.userId;
    this.deptId = deptId || this.user.defaultDeptId;
    console.log(this.deptId, "????");

    this.getDeptsUser(this.deptId);
  },
  methods: {
    // 获取部门下的用户信息
    getDeptsUser(deptId) {
      systemUserListForSelect({
        deptIdsString: deptId,
      }).then((res) => {
        let arr = res.rows.filter((item) => item.userId !== this.user.userId);
        this.userMap = arr;
      });
    },
    changeDept(deptId) {
      this.getDeptsUser(deptId);
    },
  },
  mounted() {},
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang='scss' scoped>
.schedule-box {
  margin: 0;
  min-height: 795px;
}
</style>