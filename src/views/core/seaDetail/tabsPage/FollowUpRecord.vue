<template>
  <div class="followUp-record" v-loading="loading">
    <div class="flex flex-between flex-acenter">
      <h3 class="fs_16">跟进记录</h3>
      <div class="flex flex-acenter">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-input
          placeholder="请输入内容"
          v-model="searchValue"
          class="input-with-select"
          style="margin-left: 20px"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <timeline :list.sync="list" @refresh="getList" />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import timeline from "@/views/core/components/timeline";
import { followUpDetailList } from "@/api/core/followUp";
export default {
  name: "FollowUpRecord",
  components: { timeline },

  data() {
    return {
      searchValue: "",
      date: "",
      list: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // type: 1,
      },
      total: 0,
      archiveId: "",
      loading: false,
    };
  },
  methods: {
    getList() {
      console.log("FollowUpRecord");
      this.loading = true;
      followUpDetailList({
        ...this.queryParams,

        archiveId: this.archiveId,
      })
        .then((response) => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.archiveId = this.$route.query.archiveId;

    this.getList();
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/flex.scss";

.followUp-record {
  margin-top: 10px;
}
</style>