// 三库详情页面
<template>
  <div class="app-container">
    <h2>{{ detail["companyName"] }}详情</h2>

    <el-card class="box-card">
      <div class="descriptions">
        <el-descriptions
          title="基础信息"
          direction="vertical"
          :column="5"
          border
        >
          <el-descriptions-item label="统一社会信用代码">{{
            detail["usci"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="注册资金（万）">{{
            detail["registCapital"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="注册类型">{{
            detail["registType"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="法定代表人">{{
            detail["lar"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="所在地">{{
            detail["city"] || "--"
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="box-card">
      <div class="descriptions">
        <el-descriptions
          title="安全生产许可证"
          direction="vertical"
          :column="5"
          border
        >
          <el-descriptions-item label="证书编号">{{
            detail["certNum"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="发证机关">{{
            detail["issueOrg"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="有效期">{{
            detail["expireDate"] || "--"
          }}</el-descriptions-item>
          <el-descriptions-item label="证书状态">{{
            detail["status"] || "--"
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="box-card">
      <div class="descriptions">
        <h3>资质证书</h3>
        <el-table
          :data="detail['list']"
          style="width: 100%"
          max-height="250"
          border
          stripe
        >
          <el-table-column
            v-for="item in options"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            v-bind="item"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { companyMonitorDetail } from "@/api/newreport/threeKu";
export default {
  data() {
    return {
      detailId: null,
      detail: {},

      options: [
        {
          label: "证书编号",
          prop: "aptCertNum",
          align: "center",

          width: 120,
        },
        {
          label: "证书类别",
          prop: "certType",
          align: "center",
          width: 100,
        },
        {
          label: "资质（备案）等级",
          prop: "quaLevel",
          align: "center",
        },
        {
          label: "发证机关",
          prop: "aptIssueOrg",
          align: "center",
          width: 180,
        },
        {
          label: "发证日期",
          prop: "aptIssueDate",
          align: "center",
          width: 180,
        },
        {
          label: "证书有效期",
          prop: "aptExpireDate",
          align: "center",
          width: 180,
        },
        {
          label: "证书状态",
          prop: "aptStatus",
          align: "center",
          width: 120,
        },
      ],
    };
  },
  methods: {
    // 获取详情数据
    async getDetail() {
      try {
        const res = await companyMonitorDetail(this.detailId);
        if (res.code === 200) {
          this.detail = res.data;
        }
      } catch (error) {}
    },
  },
  mounted() {
    this.detailId = this.$route.query.id;
    this.getDetail();
  },
};
</script>

<style lang="scss" scoped>
h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
.box-card {
  margin-bottom: 15px;
}
</style>
