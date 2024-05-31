<template>
  <div>
    <div class="select_box" @click="getRole">
      <span class="placeholder" v-if="ids.length === 0">{{ placeholder }}</span>
      <div class="select_items" v-else>
        <!-- <div class="select_item" v-for="(item, index) in names" :key="index">
          <el-tag
            closable
            type="info"
            size="small"
            @close="handleClose(item, index)"
          >
            {{ item[props["label"]] }}
          </el-tag>
        </div> -->
        <el-badge :value="names.length">
          <el-tag type="info" size="small">
            {{ names[0] && names[0][props["label"]] }}
          </el-tag>
        </el-badge>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleReset"
    >
      <div class="user_roles">
        <!-- 已配置 -->
        <div class="configured">
          <el-card class="box-card">
            <h3>用户已配置</h3>
            <!-- <el-checkbox-group
              v-model="checkIds"
              size="small"
              @change="removeChecked"
            >
              <template v-for="item in names">
                <el-checkbox
                  :label="item[props['value']]"
                  border
                  :key="item[props['value']]"
                  >{{ item[props["label"]] }}</el-checkbox
                >
              </template>
            </el-checkbox-group> -->
            <div class="tag_name">
              <template v-for="item in names">
                <el-tag :key="item[props['value']]">{{
                  item[props["label"]]
                }}</el-tag>
              </template>
            </div>
          </el-card>
        </div>
        <!-- 未配置 -->
        <div class="not_configured">
          <el-card class="box-card">
            <h3>未配置</h3>
            <el-checkbox-group v-model="checkIds" size="small">
              <template v-for="item in options">
                <el-checkbox
                  :label="item[props['value']]"
                  border
                  :key="item[props['value']]"
                  >{{ item[props["label"]] }}</el-checkbox
                >
              </template>
            </el-checkbox-group>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset">取 消</el-button>
        <el-button type="primary" @click="submit">配置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
        };
      },
    },
    dialogTitle: {
      type: String,
      default: "用户配置",
    },
  },
  data() {
    return {
      dialogVisible: false,
      names: [],
      checkIds: this.ids, //已选中的id
    };
  },
  methods: {
    // 格式化数据
    formatter() {
      this.names = this.options.filter((item) =>
        this.ids.includes(item[this.props.value])
      );
    },
    // 关闭
    handleClose(row, index) {
      let id = row[this.props.value];
      let newIds = this.ids.filter((item) => item !== id);
      this.$emit("update:ids", newIds);
    },
    // 显示配置的弹出框
    getRole() {
      this.dialogVisible = true;
    },

    // 取消
    handleReset() {
      this.checkIds = this.ids;
      this.dialogVisible = false;
    },
    // 确定
    submit() {
      this.dialogVisible = false;
      this.$emit("update:ids", this.checkIds);
    },
  },
  mounted() {
    this.formatter();
  },
  watch: {
    ids: {
      handler() {
        this.checkIds = this.ids;
        this.formatter();
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.select_box {
  box-sizing: border-box;
  color: #606266;

  padding: 0 15px;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  > .placeholder {
    color: #ccc;
  }
}

.box-card {
  margin-bottom: 15px;
  h3 {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .el-checkbox {
    margin: 0 0 15px 0;
  }
  .tag_name {
    > span {
      margin-bottom: 15px;
      &:not(:last-child) {
        margin-right: 15px;
      }
    }
  }
}
</style>