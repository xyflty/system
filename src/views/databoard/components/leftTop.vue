<template>
  <div class="app-container">
    <!-- <h3>累计订单销售</h3> -->
    <div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="open = true"
            >新增</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="list" border stripe>
        <el-table-column
          label="已签订单"
          align="center"
          prop="signOrderCount"
        />
        <el-table-column
          label="已完成订单"
          align="center"
          prop="finishOrderCount"
        />
        <el-table-column
          label="在途订单"
          align="center"
          prop="onWayOrderCount"
        />
      </el-table>
    </div>

    <el-dialog
      title="订单销售"
      :visible="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="160px">
        <el-form-item label="已签订单" prop="signOrderCount">
          <el-input v-model="form.signOrderCount" placeholder="已签订单" />
        </el-form-item>
        <el-form-item label="已完成订单" prop="finishOrderCount">
          <el-input v-model="form.finishOrderCount" placeholder="已完成订单" />
        </el-form-item>
        <el-form-item label="在途订单" prop="onWayOrderCount">
          <el-input v-model="form.onWayOrderCount" placeholder="在途订单" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderSalesCount, setOrderSalesCount } from "@/api/databoard/index";

export default {
  name: "leftTop",
  data() {
    return {
      list: [],
      open: false,
      form: {},
    };
  },
  watch: {},
  created() {
    this.getOrderSalesCount();
  },
  methods: {
    // 左上列表
    getOrderSalesCount() {
      getOrderSalesCount().then((response) => {
        this.list = [response.data];
      });
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          setOrderSalesCount(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.form = {};
            this.getOrderSalesCount();
          });
        }
      });
    },
    cancel() {
      this.open = false;
      this.form = {};
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
</style>
