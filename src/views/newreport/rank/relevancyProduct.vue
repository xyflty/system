<template>
  <div class="app-container">
    <div class="table-action">
      <el-button
        size="mini"
        icon="el-icon-back"
        type="primary"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <el-table :data="tableList" stripe style="width: 100%" border>
      <!-- <el-table-column prop="x" label="时间" align="center" /> -->
      <!-- <el-table-column
          prop="topCategoryName"
          label="项目大类"
          align="center"
          min-width="80"
        /> -->
      <el-table-column
        label="项目分类"
        align="center"
        key="categoryName"
        prop="categoryName"
      />
      <el-table-column
        label="项目名称"
        align="center"
        key="projectName"
        prop="projectName"
      />
      <el-table-column
        label="最低限价"
        align="center"
        key="lowestQuotation"
        prop="lowestQuotation"
      />
      <el-table-column
        label="指导单价"
        align="center"
        key="guidancePrice"
        prop="guidancePrice"
      />

      <el-table-column
        label="单价"
        align="center"
        prop="unitPrice"
        class-name="small-padding fixed-width"
      >
      </el-table-column>
      <el-table-column
        label="数量"
        align="center"
        prop="quantity"
        class-name="small-padding fixed-width"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [],
    };
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.tableList = JSON.parse(sessionStorage.getItem("orderProjectList"));
  },
};
</script>

<style lang='scss' scoped>
.table-action {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>