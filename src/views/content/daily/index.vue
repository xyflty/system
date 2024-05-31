<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="我的工作报告" name="1"></el-tab-pane>
      <el-tab-pane
        label="团队的工作报告"
        name="2"
        v-if="!!(user.treeList && user.treeList.length)"
      ></el-tab-pane>
      <el-tab-pane label="抄送给我的工作报告" name="3"></el-tab-pane>
      <el-tab-pane label="报告统计" name="4"></el-tab-pane>

      <TabsTable
        v-if="['1', '2', '3'].includes(activeName)"
        :active="activeName"
      ></TabsTable>

      <ReportStatistics v-if="activeName === '4'" />
    </el-tabs>
  </div>
</template>

<script>
import TabsTable from "./components/TabsTable.vue";
import ReportStatistics from "./components/ReportStatistics.vue";
import { mapState } from "vuex";
export default {
  components: {
    TabsTable,
    ReportStatistics,
  },
  data() {
    return {
      activeName: "1",
    };
  },
  methods: {},
  mounted() {
    this.activeName = this.$route.query.type || "1";
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang='scss' scoped>
</style>