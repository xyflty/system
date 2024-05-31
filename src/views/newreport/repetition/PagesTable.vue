<template>
  <div class="pages_table">
    <div class="header">
      <h3 :class="{ borderLeft: titleBorder }">{{ title }}</h3>

      <div :class="['btns', `just-${btnsPosition}`]">
        <slot name="btns"></slot>
      </div>
    </div>
    <MultiTable
      align="center"
      size="mini"
      border
      :Options="tableOptions"
      :data="data"
      :api="api"
      :parmas="parmas"
      :paginationAttrs="paginationAttrs"
      :isPagination="isPagination"
      :getSpanData="getSpanData"
      @setupEvents="setupEvents"
    />
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
export default {
  components: { MultiTable },
  props: {
    btnsPosition: {
      type: "left" | "center" | "right",
      default: "left",
    },
    title: String,
    titleBorder: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
    },
    // 如果有传api,data不生效
    api: {
      type: Function,
    },
    parmas: {
      type: Object,
      default: () => {},
    },
    // 是否开启分页
    isPagination: {
      type: Boolean,
      default: false,
    },
    paginationAttrs: {
      type: Object,
      default: null,
    },
    isAction: Boolean,
    // 添加是否表格列
    addColumns: Boolean,
    // 处理表格数据
    dealData: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      tableOptions: this.options,
    };
  },
  methods: {
    setupEvents({ row, type }) {
      this.$emit("operate", { row, type });
    },
    getSpanData(data, res) {
      let newData = data;
      if (this.addColumns) {
        let nameProps = res.param.map((item) => {
          return {
            label: item.userName,
            prop: item.userId,
          };
        });
        this.tableOptions = this.options.concat(nameProps);
      }

      if (this.dealData) {
        newData = this.dealData(data, res.param);
      }
      return newData;
    },
  },
  mounted() {},
  watch: {
    isAction: {
      handler(newFlag) {
        this.tableOptions.forEach((item) => {
          if (item.hasOwnProperty("action")) {
            item.action = newFlag;
          }
        });
      },
      immediate: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  align-items: center;
  h3 {
    margin: 20px 20px 20px 0;
    font-size: 16px;
    font-weight: bold;
    color: rgb(96, 149, 255);
    display: flex;
    align-items: center;
  }
  .btns {
    flex: 1;
    display: flex;
  }
}
.just-center {
  justify-content: center;
}
.just-left {
  justify-content: flex-start;
}
.just-right {
  justify-content: flex-end;
}
.borderLeft {
  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 20px;
    background: rgb(96, 149, 255);
    border-radius: 5px;
    margin-right: 8px;
  }
}
</style>