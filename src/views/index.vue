<template>
  <div class="app-container">
    <!-- crm简报 -->
    <CRMBulletin @change="handleChange" />
    <!-- 代办区域 -->
    <Backlog
      :isUserRole="isUserRole"
      :deptOptions="deptOptions"
      :userMap="userMap"
      :activeWait.sync="activeWait"
      :userProp="{ value: 'userId', label: 'userName' }"
      @dept="changeDept"
    >
      <template slot="menuRight">
        <el-link class="fonts-color" type="primary" @click="goMore"
          >查看更多<i class="el-icon-arrow-right el-icon--right"></i
        ></el-link>
      </template>
    </Backlog>

    <div :class="['messageAndreport', user.deptId === 200 ? 'reportShow' : '']">
      <div class="message">
        <Message />
      </div>
      <div class="workReport" v-if="user.deptId !== 200">
        <WorkReport size="default"></WorkReport>
      </div>
    </div>

    <!-- 侧边栏 -->

    <QuicklyCreate />
    <!-- 客服ai -->
    <div class="ai" @click="$router.push({ name: 'Chat' })">
      <img src="../assets/images/kefu.png" alt="" />
      <span>AI问答</span>
    </div>
    <!-- 广告栏 -->
    <Ad />
  </div>
</template>

<script>
// CRM简报
import CRMBulletin from "@/views/components/homeComponents/CRMBulletin";
import Backlog from "@/views/components/homeComponents/Backlog";

// 消息
import Message from "./dashboard/Message";
import WorkReport from "@/views/components/homeComponents/WorkReport";
//侧边栏新增线索操作
import QuicklyCreate from "@/views/components/homeComponents/QuicklyCreate";

// 广告弹出框
import Ad from "./dashboard/Advertising";

// 混入
import { userAndDept } from "@/views/newreport/customer/mixins/userAnddept.js";

import { systemUserListForSelect } from "@/api/system/user";

import { mapState } from "vuex";

export default {
  components: {
    CRMBulletin,
    Backlog,
    Message,
    WorkReport,
    QuicklyCreate,
    Ad,
  },
  mixins: [userAndDept],
  data() {
    return {
      // 选中的类型

      // timeActive: 6, //默认当月时间，7为上个月
      userMap: [],

      activeWait: "",
      deptId: "",

      // 待办团体Id
      waitDeptId: null,
    };
  },
  created() {
    this.selectType = 1;
    // this.deptId = this.user.subjectDeptId;
    this.activeWait = this.user.userId;
  },
  methods: {
    handleChange(node) {
      this.deptId = node.id;
      // this.getDeptsUser(node.id);
    },
    // 点击团体部门获取当前部门用户
    changeDept(deptId) {
      this.waitDeptId = deptId;
      this.getDeptsUser(deptId);
    },

    // 获取部门下的用户信息
    getDeptsUser(deptId) {
      systemUserListForSelect({
        deptIdsString: deptId,
      }).then((res) => {
        let arr = res.rows.filter((item) => item.userId !== this.user.userId);
        this.userMap = arr;
        console.log(this.userMap, 555);
      });
    },

    // 查看更多
    goMore() {
      let query = {
        type: 1,
        activeWait: this.activeWait,
        deptId: this.waitDeptId,
      };
      this.$router.push({ name: "Schedule", query: query });
    },
  },
  mounted() {
    this.getDeptsUser(this.user.subjectDeptId);
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
.messageAndreport {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
  margin-top: 15px;
}
.ai {
  position: fixed;
  right: 0;
  bottom: 25px;
  width: 68px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 10px;
  background: #fff;

  cursor: pointer;
  font-size: 12px;

  border-radius: 8px;
  box-shadow: -2px 2px 20px rgba(0, 0, 0, 0.3);
  z-index: 999;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    margin-top: 10px;
    letter-spacing: 0.5px;
  }
}
.reportShow {
  grid-template-columns: 1fr;
}
</style>
