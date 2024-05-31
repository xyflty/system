<template>
  <div class="base-info">
    <div class="" v-for="(item, index) in FormData" :key="`0-${index}`">
      <h3 class="desc-title">{{ item.name }}</h3>

      <!-- 描述列表 -->
      <el-descriptions
        v-if="['desc'].includes(item.type)"
        :column="2"
        border
        :contentStyle="CS"
        :label-style="LS"
      >
        <el-descriptions-item
          v-for="(ele, index) in item.children"
          :key="index"
        >
          <template slot="label">
            {{ ele.name }}<span v-show="ele.name">：</span>
          </template>
          <span v-if="ele.formatter">{{
            item.dataType
              ? ele.formatter(data[item.dataType][ele.key])
              : ele.formatter(data[ele.key])
          }}</span>
          <span v-else>{{
            item.dataType
              ? data[item.dataType]
                ? data[item.dataType][ele.key]
                : "--"
              : data[ele.key] || "--"
          }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <avue-crud
        v-if="['table'].includes(item.type)"
        :option="{ ...baseTable, column: item.column }"
        :data="data[item.dataType]"
      ></avue-crud>
    </div>
  </div>
</template>

<script>
import options from "./Options";
export default {
  name: "BaseInfo",
  props: {
    data: Object,
  },
  data() {
    return {
      FormData: options.FormData,

      // 描述列表样式
      CS: {
        "text-align": "center", //文本居中
        "min-width": "250px", //最小宽度
        "word-break": "break-all", //过长时自动换行
      },
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "100px",
        "word-break": "keep-all",
      },

      baseTable: {
        menu: false,
        refreshBtn: false, //去掉table表格上的刷新按钮
        columnBtn: false,
        addBtn: false, //去掉table表格上的新增按钮
        border: true,
        stripe: true,
        align: "center",
        headerAlign: "center",
      },
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.desc-title {
  margin: 30px 0 10px;
}
::v-deep .avue-crud__header {
  display: none;
}
</style>
