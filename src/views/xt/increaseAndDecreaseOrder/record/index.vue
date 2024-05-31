<template>
  <div class="increaseAndDecreaseOrder">
    <MultiTable
      ref="tableRef"
      border
      align="center"
      isPagination
      isSearchForm
      :searchOptions="recordConfig.searchOptions"
      :api="apiFn"
        :span-method="handleObjectSpanMethod"
      :getSpanData="getSpanData"
      :Options="recordConfig.tableOption"
    >
      <template #originalTotle="{ scope }">
        <span>{{ scope.originalUnitPrice * scope.originalQuantity }}</span>
      </template>
      <template #changeTotle="{ scope }">
        <span>{{ scope.changeUnitPrice * scope.changeQuantity }}</span>
      </template>
    </MultiTable>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";

import { xtOrderProjectChangeRecordList } from "@/api/xt";

import { recordOptions } from "../Options";

export default {
  components: {
    MultiTable,
  },
  data() {
    return {
      recordConfig: recordOptions, //页面的配置信息（表格和筛选表单）
      apiFn: xtOrderProjectChangeRecordList,
      spanData: [],
      pos: 0,
    };
  },
  methods: {
    // 根据订单id判断需要合并的行
    getSpanId(arr) {
      for (let index = 0; index < arr.length; index++) {
        if (index === 0) {
          this.spanData.push(1);
          this.pos = 0;
        } else {
          if (arr[index].orderId === arr[index - 1].orderId) {
            // 判断上一行的订单id跟当前行是否一样
            this.spanData[this.pos] += 1;
            this.spanData.push(0);
          } else {
            this.spanData.push(1);
            this.pos = index;
          }
        }
      }
    },
       // 合并单元格
    handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
   
      let obj = ["订单编号",'客户名称',];
      if (obj.includes(column.label)) {
        let row = this.spanData[rowIndex];
        let col = row > 0 ? 1 : 0;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    // 获取表格数据，生成合并的span数组
    getSpanData(arr) {
      this.spanData = [];
      this.pos = 0;
      this.getSpanId(arr);
      return arr;
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.increaseAndDecreaseOrder {
  padding: 20px;
}
</style>