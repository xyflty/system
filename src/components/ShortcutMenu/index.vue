<template>
  <div class="main">
    <div class="menu-item" @click="showDialog">
      <i class="el-icon-setting"></i>
      <span>快捷菜单</span>
    </div>
    <el-dialog
      title="快捷菜单设置"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
    >
      <div class="menu_title-tip">
        <span>已选菜单</span>
        <span>按住菜单标签可以对菜单进行排序，最多可以设置10个快捷菜单</span>
      </div>
      <div class="menus-tag">
        <drag-wrap class="wrap" @watchData="watchData">
          <div class="default">
            <el-tag type="info" class="tag-item"> 系统首页 </el-tag>
          </div>
          <drag-item
            class="item"
            v-for="(item, index) in checkedList"
            :key="index"
          >
            <el-tag
              type="info"
              closable
              @close="closeTag(item)"
              class="tag-item"
              effect="plain"
            >
              {{ item.meta.title }}
            </el-tag>
          </drag-item>
        </drag-wrap>
      </div>
      <el-checkbox-group v-model="checkedList" :min="0" :max="10">
        <div class="grid">
          <div v-for="(item, index) in routers" :key="index">
            <div class="grid-title">{{ item.meta.title }}</div>
            <el-checkbox
              v-model="val.checked"
              v-for="val in item.children"
              :label="val"
              :key="val.name"
              @change="tabChange"
              >{{ val.meta.title }}</el-checkbox
            >
          </div>
        </div>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      checkedList: [],
      dialogVisible: false,
      routers: [],
    };
  },
  computed: {
    ...mapGetters(["topbarRouters"]),
  },
  mounted() {
    let routers = this.topbarRouters.filter((item) => item.hidden == false);
    routers.forEach((item) => {
      item.children.forEach((item) => {
        item.checked = false;
      });
    });
    this.routers = routers;
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
    // 关闭标签
    closeTag(val) {
      let index = this.checkedList.findIndex((item) => item.name === val.name);
      this.checkedList.splice(index, 1);
    },

    watchData(newList) {
      // console.log("newList", newList);
    },
    tabChange(e) {
      console.log(this.checkedList);
    },

    // 取消
    cancel() {
      this.dialogVisible = false;
    },

    // 提交
    submit() {},
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";
.main ::v-deep .el-dialog__body {
  padding: 0 20px;
}
.menu-item {
  margin: 0 12px;
  position: relative;
  cursor: pointer;
  span {
    margin-left: 5px;
  }
  .tag {
    position: absolute;
    width: 20px;
    height: 20px;
    background: red;
    display: inline-block;
    line-height: 20px;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    text-align: center;
    top: 7px;
    right: -10px;
  }
}
.menu_title-tip span:first-child {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-right: 15px;
}
.menu_title-tip span:last-child {
  color: #999;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
}
.item {
  display: inline-block;
  line-height: 40px;
}
.default {
  line-height: 40px;
}
.menus-tag {
  display: flex;
  margin-top: 10px;
}
.tag-item {
  margin-right: 10px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  margin-top: 15px;
  .grid-title {
    margin: 10px 0 7px 0;
    font-weight: 600;
    color: #000;
    font-size: 15px;
  }
}
</style>
