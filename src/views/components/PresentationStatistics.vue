<template>
  <div
    class="table_statistics"
    v-loading="loading"
    element-loading-text="数据正在计算中..."
  >
    <dl v-for="(item, index) in comparison" :key="index">
      <dt>{{ item.label }}</dt>
      <dd>{{ data[item.value] || 0 }}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "PresentationStatistics",
  props: {
    // 对照表
    comparison: {
      type: Array,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    loading: Boolean,
  },
  data() {
    return {};
  },

  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
.table_statistics {
  width: 75%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, auto));
  grid-gap: 10px;
  padding: 10px 0;
  dl {
    display: flex;
    font-size: 14px;
  }
  dt {
    width: fit-content;
  }
  dd {
    font-size: 16px;
    font-weight: 600;
    color: #0079fe;
    padding-left: 5px;
  }
}
::v-deep .el-loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .circular {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}

@media (max-width: 1600px) {
  .table_statistics {
    grid-template-columns: repeat(auto-fill, minmax(140px, auto));
  }
}

@media (max-width: 1200px) {
  .table_statistics {
    grid-template-columns: repeat(auto-fill, minmax(140px, auto));
  }
}
</style>