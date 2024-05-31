<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button
          v-if="isSearch"
          size="mini"
          circle
          icon="el-icon-search"
          @click="toggleSearch()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button
          size="mini"
          circle
          icon="el-icon-refresh"
          @click="refresh()"
        />
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="显隐列"
        placement="top"
        v-if="columns"
      >
        <el-button
          size="mini"
          circle
          icon="el-icon-menu"
          @click="showColumn()"
        />
      </el-tooltip>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      @close="handleClose"
    >
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
        @left-check-change="leftCheckChange"
      >
        <div slot="left-footer" class="left-footer">
          <el-button
            class="transer-footer ml10"
            size="mini"
            :disabled="leftChecked.length != 1"
            @click="handleMoveSort('top')"
            >置顶</el-button
          >
          <el-button
            class="transer-footer ml10"
            size="mini"
            :disabled="leftChecked.length != 1"
            @click="handleMoveSort('up')"
            >上移</el-button
          >
          <el-button
            class="transer-footer"
            size="mini"
            :disabled="leftChecked.length != 1"
            @click="handleMoveSort('down')"
            >下移</el-button
          >
          <el-button
            class="transer-footer ml10"
            size="mini"
            :disabled="leftChecked.length != 1"
            @click="handleMoveSort('bottom')"
            >置底</el-button
          >
        </div>
      </el-transfer>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="open = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import { set } from "@/api/common.js";

export default {
  name: "RightToolbar2",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "显示/隐藏",
      // 是否显示弹出层
      open: false,
      leftChecked: [], // 显示的key
      checkedArr: [],
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
    pageName: {
      type: String,
      default: "",
    },
    isSearch: {
      type: Boolean,
      type: true,
    },
  },
  mounted() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item.key));
      }
    }
  },

  watch: {
    columns: {
      handler(n) {
        this.value = [];
        for (let item in this.columns) {
          if (this.columns[item].visible === false) {
            this.value.push(parseInt(this.columns[item].key));
          }
        }

        this.checkedArr = n.filter((item) => item.visible);
      },
      immediate: true,
      deep: true,
    },

    open: {
      handler(n) {
        if (!n) {
          let params = this.columns.map((item) => ({
            pageName: this.pageName,
            tableColumnKey: item.key,
            label: item.label,
            prop: item.prop,
            width: item.width,
            visible: item.visible,
            showOverFlow: item.showOverflow,
            sortable: item.sortable,
          }));
          console.log(params);
          set(params).then((res) => {
            this.$message.success("设置成功！");
          });
        }
      },
    },
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (let item in this.columns) {
        const key = this.columns[item].key;
        this.columns[item].visible = !data.includes(key);
      }
      this.columns = this.columns.sort((a, b) => b.visible - a.visible);
    },

    leftCheckChange(data) {
      console.log(data);
      this.leftChecked = data;
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true;
    },

    handleMoveSort(key) {
      const index = this.leftChecked[0];
      const value = this.columns.find((item) => item.key == index);
      const idx = this.columns.findIndex((item) => item.key == index);

      if (["up", "top"].includes(key) && index == this.checkedArr[0].key) {
        this.$message("没有上移的空间了");
        return;
      }

      if (
        ["down", "bottom"].includes(key) &&
        index == this.checkedArr[this.checkedArr.length - 1].key
      ) {
        this.$message("没有下移的空间了");
        return;
      }

      this.columns.splice(idx, 1);

      switch (key) {
        case "top":
          this.columns.unshift(value);
          break;
        case "up":
          this.columns.splice(idx - 1, 0, value);
          break;
        case "down":
          this.columns.splice(idx + 1, 0, value);
          break;
        case "bottom":
          this.columns.push(value);
          break;
      }
    },

    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
// ::v-deep .el-transfer__button {
//   border-radius: 50%;
//   padding: 12px;
//   display: block;
//   margin-left: 0px;
// }
// ::v-deep .el-transfer__button:first-child {
//   margin-bottom: 10px;
// }

::v-deep .el-transfer-panel {
  width: 270px;
}

::v-deep .el-transfer {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-transfer-panel__body {
  box-sizing: content-box;
}
.left-footer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
