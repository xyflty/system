<template>
  <el-dialog
    title="提示"
    width="1200px"
    :visible.sync="destroyDialog"
    @close="cancel"
  >
    <multi-table
      :Options="collectionOptions"
      :isSearchForm="false"
      border
      align="center"
      :data="data"
    >
      <template #editRowOperation="{ scope }">
        <el-button
          :disabled="!isCompile"
          type="text"
          @click="handleCollectRow('del', scope)"
          >删除</el-button
        >
      </template>
    </multi-table>
    <div v-if="isCompile" class="card-footer" style="justify-content: center">
      <p style="cursor: pointer" @click="handleCollectRow('add')">
        <i class="el-icon-plus"></i>新增
      </p>
    </div>
    <div class="tableFooter" v-else>
      <p>
        应收款金额:<span>{{ totalObj.receivableTotal }}</span>
      </p>
      <p>
        已收款金额: <span>{{ totalObj.receivedTotal }}</span>
      </p>
      <p>
        未收款金额: <span>{{ totalObj.uncollected }}</span>
      </p>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// 表格组件
import MultiTable from "@/components/MultiTable";
export default {
  name: "DestroyModel",
  components: { MultiTable },
  props: {
    visible: Boolean,
    isCompile: Boolean,
    data: {
      type: Array,
    },
  },
  data() {
    return {
      // 核销
      destroyDialog: this.visible,
      collectionOptions: [
        {
          editType: "select",
          label: "计划收款期次",
          prop: "moneyTag",
          editOptions: [
            { label: "首款", value: "首款" },
            { label: "二期款", value: "二期款" },
            { label: "三期款", value: "三期款" },
            { label: "四期款", value: "四期款" },
            { label: "五期款", value: "五期款" },
            { label: "尾款", value: "尾款" },
            { label: "全款", value: "全款" },
          ],
          attrs: {
            placeholder: "请选择计划收款期次",
          },
        },
        {
          editType: "input",
          label: "已收款金额(元)",
          prop: "actualPrice",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款主体",
          prop: "subjectName",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "select",
          label: "收款方式",
          prop: "payment",
          editOptions: [
            { label: "公户收款", value: "公户收款" },
            { label: "扫码收款", value: "扫码收款" },
          ],
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款提起人",
          prop: "launchPerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "input",
          label: "收款经手人",
          prop: "handlePerson",
          attrs: {
            placeholder: "请输入",
          },
        },
        {
          editType: "date-picker",
          label: "收款时间",
          prop: "receiveDate",
          width: "250px",
          attrs: {
            type: "datetime",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
        },
        {
          label: "操作",
          action: true,
        },
      ],
    };
  },
  methods: {
    // 核销表格新增和删除操作
    handleCollectRow(type, scope) {
      if (type === "add") {
        this.data.push({
          rowEdit: true,
        });
      } else if (type === "del") {
        let index = scope.$index;
        this.data.splice(index, 1);
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("submit");
    },
  },
  mounted() {},
  watch: {
    visible(newVal) {
      this.destroyDialog = newVal;
    },
    destroyDialog(newVal) {
      this.$emit("update:visible", newVal);
    },
  },
  computed: {
    totalObj() {
      // 应收
      let receivableTotal = this.data.reduce((prev, item) => {
        return (prev += +item.planPrice);
      }, 0);
      // 已收
      let receivedTotal = this.data.reduce((prev, item) => {
        return (prev += +item.actualPrice);
      }, 0);

      let uncollected = receivableTotal - receivedTotal;
      return { receivableTotal, receivedTotal, uncollected };
    },
  },
};
</script>

<style lang='scss' scoped>
.card-footer {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  background: #f8f8f9;
  span {
    color: red;
    font-size: 16px;
    font-weight: 500;
  }
}
.tableFooter {
  display: flex;
  justify-content: flex-end;
  background: #f8f8f9;
  color: #333;
  font-size: 14px;
  padding: 20px 10px;
  p {
    span {
      padding: 0 8px;
      font-size: 18px;
      font-weight: 500;
      color: #f56c6c;
    }
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>