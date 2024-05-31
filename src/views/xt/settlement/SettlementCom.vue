// 财务列表页面公共代码
<template>
  <div class="page-container">
    <MultiTable
      ref="tableRef"
      v-if="parmas"
      :api="apiFn"
      :parmas="parmas"
      :Options="tableOption"
      isSearchForm
      :isSelection="isSelection"
      isPagination
      border
      align="center"
      :searchOptions="searchOptions"
      @setupEvents="setupEvents"
      :getSpanData="getSpanData"
      :span-method="handleObjectSpanMethod"
      @SelectionChange="SelectionChange"
    >
      <template #operation="{ scope }">
        <el-button
          v-if="isCancel"
          type="text"
          @click="setupEvents({ type: 'cancel', row: scope.row })"
          >核销</el-button
        >
        <!-- v-show="scope.row.financialCheckButtonFlag" -->
      </template>
    </MultiTable>

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
        :data="collectionData"
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
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
// 财务结算中心公共方法
import { settlement } from "@/mixins/settlement";

export default {
  name: "SettlementCom",
  props: {
    // 页面类型
    type: {
      type: String,
      required: true,
    },
    // 是否有核销
    isCancel: {
      type: Boolean,
      default: false,
    },
    // 是否允许多选
    isSelection: Boolean,
    // 是否处理表格数据
    isDealTable: Boolean,
    // 是否合并单元格
    isMergeCells: Boolean,
  },
  components: {
    MultiTable,
  },
  mixins: [settlement],
  data() {
    return {
      pagesType: this.type,
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
.page-container {
  padding: 20px;
}

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