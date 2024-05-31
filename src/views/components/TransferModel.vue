<template>
  <el-dialog
    title="一键转换"
    :visible.sync="visibleDialog"
    width="30%"
    v-bind="$attrs"
    @close="transferCancel"
  >
    <el-form
      labelWidth="120px"
      ref="transferRef"
      :model="transferForm"
      :rules="rules"
    >
      <el-form-item prop="shiftUserId" label="转入的人员">
        <el-select
          v-model="transferForm.shiftUserId"
          filterable
          placeholder="请选择转入人员"
        >
          <el-option
            v-for="option in commonData.userList"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="transferCancel">取 消</el-button>
      <el-button type="primary" @click="transferSubmit" :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { zwOneKeyConvert, xtOrderJobOneKeyConvert } from "@/api/xt";
import { mapState } from "vuex";
export default {
  name: "TransferModel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
    },
    tableRef: {
      type: Object,
    },
    type: {
      type: String,
    },
    tableApi: Function,
    rowId: [String, Number],
  },
  data() {
    return {
      visibleDialog: this.visible,
      transferForm: {
        shiftUserId: "",
      },
      rules: {
        shiftUserId: [
          { required: true, message: "转入人员不能为空", trigger: "blur" },
        ],
      },
      loading: false,

      refName: null,
    };
  },
  methods: {
    transferCancel() {
      this.$refs.transferRef.resetFields();
      this.visibleDialog = false;
    },
    getPromises() {
      let promises = [];
      let sendData = {
        originalUserIds: this.ids,
        shiftUserId: this.transferForm.shiftUserId,
        type: this.type,
      };
      switch (this.type) {
        case "all":
          promises = [
            zwOneKeyConvert(sendData),
            xtOrderJobOneKeyConvert(sendData),
          ];
          return promises;

        case "order":
          promises = [
            zwOneKeyConvert({ ...sendData, id: this.rowId }),
            xtOrderJobOneKeyConvert({ ...sendData, orderId: this.rowId }),
          ];
          return promises;
        case "clue":
        case "opportunity":
        case "customer":
          sendData.id = this.rowId;
          promises = [zwOneKeyConvert(sendData)];
          return promises;
      }
    },
    transferSubmit() {
      this.$refs.transferRef.validate(async (valid) => {
        if (valid) {
          this.loading = true;

          let promises = this.getPromises();
          console.log(promises);

          Promise.all(promises)
            .then((res) => {
              if (
                ["clue", "opportunity", "order", "customer"].includes(this.type)
              ) {
                this.tableApi();
              }
              this.refName.clearSelection();
              this.transferCancel();
              this.$message.success("已转移成功");
            })
            .finally((err) => {
              this.loading = false;
            });
        } else {
          this.$message.error("请选择必填信息");
        }
      });
    },
  },
  mounted() {},

  watch: {
    visibleDialog(newVal) {
      this.$emit("update:visible", newVal);
    },
    visible(newVal) {
      this.visibleDialog = newVal;
    },
    tableRef(newVal) {
      this.refName = newVal;
    },
  },
  computed: {
    // 获取state仓库存储的数据
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
</style>