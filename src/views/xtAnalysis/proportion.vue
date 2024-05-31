// 占比
<template>
  <div class="app-container">
    <div class="actions">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-back"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <div class="drilling-title">
      {{ itemRow.caption }}
    </div>
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="name" :label="itemRow.tableName">
      </el-table-column>
      <el-table-column prop="value" label="工单数量"> </el-table-column>
      <el-table-column prop="percentage" label="占比"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >钻取</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemRow: {},
      // 表格数据
      data: [],
      // 筛选条件
      queryForm: {},
    };
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    handleClick(row) {
      this.rowItem = row;
      const { userId, deptIds, projectCategory } = this.queryForm;
      this.$router.push({
        name: "XtDrill",
        query: { id: row.id, userId, deptIds, projectCategory, name: row.name },
      });
    },
  },
  mounted() {
    // 获取本地存储的数据
    const { data, queryForm, row } = JSON.parse(
      sessionStorage.getItem("XTANALYSIS_KEY")
    );

    this.itemRow = row;
    this.data = data;
    this.queryForm = queryForm;
  },
};
</script>

<style lang='scss' scoped>
.drilling-title {
  background-color: #e8eef0;
  padding: 15px 10px;
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
  color: #333;
}
.actions {
  padding: 15px 0;
  display: flex;
  justify-content: flex-end;
}
</style>