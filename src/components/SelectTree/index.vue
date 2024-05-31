<template>
  <el-select
    ref="selectRef"
    :value="valueId"
    :clearable="clearable"
    class="select-tree"
    @clear="clearHandle"
    :popper-append-to-body="true"
  >
    <el-input
      v-if="search"
      class="selectInput"
      :placeholder="placeholder"
      v-model="filterText"
    >
    </el-input>

    <el-option :value="valueId" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        class="tree-options"
        :accordion="accordion"
        :data="data"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        :check-strictly="checkStrictly"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "SelectTree",
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: "id", // ID字段名
          label: "label", // 显示名称
          children: "children", // 子级字段名
        };
      },
    },
    /* 选项列表数据(树形结构的对象数组) */
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /* 初始值 */
    modelValue: {
      type: Number | String,
      default: () => {
        return null;
      },
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "检索关键字";
      },
    },
    checkStrictly: Boolean,
    search: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      filterText: "",
      valueId: this.modelValue, // 初始值
      valueTitle: "",
      defaultExpandedKey: [],
    };
  },
  mounted() {
    this.initHandle();
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.$nextTick(() => {
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[
            this.props.label
          ]; // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
          this.defaultExpandedKey = [this.valueId]; // 设置默认展开
        });
      }
      this.initScroll();
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        let scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach((ele) => (ele.style.width = 0));
      });
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label];
      this.valueId = node[this.props.value];

      this.defaultExpandedKey = [];
      this.$emit("update:modelValue", this.valueId);
      this.$emit("change", node);

      if (this.checkStrictly) {
        if (node.children && node.children.length) return;
        this.$refs.selectRef.blur();
      } else {
        this.$refs.selectRef.blur();
      }
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = "";
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("update:modelValue", null);
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach((element) => element.classList.remove("is-current"));
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
  },
  watch: {
    modelValue() {
      this.valueId = this.modelValue;
      this.initHandle();
    },
    filterText(val) {
      this.$refs.selectTree.filter(val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
::v-deep .el-select-dropdown__wrap.el-scrollbar__wrap {
  max-height: 350px;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
</style>

