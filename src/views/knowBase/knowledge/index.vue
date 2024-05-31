<template>
  <div class="app-container">
    <el-container class="knowledge-box" id="knowledge-box">
      <el-aside class="knowledge-aside" width="250px">
        <avue-tree
          ref="tree"
          :option="treeOptions"
          :data="treeData"
          v-model="treeForm"
          @node-click="nodeClick"
        >
        </avue-tree>
      </el-aside>

      <el-container direction="vertical">
        <el-header class="knowledge-header">
          <transition name="el-zoom-in-top">
            <avue-form
              v-if="searchShow"
              :option="searchOptions"
              v-model="searchForm"
            >
              <template slot-scope="{ size }" slot="menuForm">
                <template v-if="isLastAry">
                  <el-button
                    :size="size"
                    v-if="readonly"
                    @click="readonly = !readonly"
                    >编辑模式</el-button
                  >
                  <el-button :size="size" v-else @click="saveContent"
                    >保存分布</el-button
                  >
                </template>
                <el-button :size="size" @click="copyRouter">复制内链</el-button>
              </template>
            </avue-form>
          </transition>
        </el-header>

        <div class="content-btn">
          <i class="el-icon-search" @click="searchShow = !searchShow"></i>
          <i class="el-icon-full-screen" @click="handleFullScreen"></i>
        </div>

        <el-main>
          <!-- <div v-if="readonly" v-html="editorData"></div> -->
          <TheTinymce :isReadonly="readonly" v-model="editorData"></TheTinymce>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  baseCantentList,
  baseCantentAdd,
  baseCantentEdit,
} from "@/api/knowBase/knowledge";
import { baseCategoryList } from "@/api/knowBase/knowClass";

import TheTinymce from "@/components/TheTinymce";
export default {
  components: {
    TheTinymce,
  },
  data() {
    return {
      treeForm: {},
      treeData: [],
      treeOptions: {
        defaultExpandAll: true,
        addBtn: false,
        nodeKey: "id",

        props: {
          label: "categoryName",
          value: "id",
          children: "children",
        },
      },
      // 筛选
      searchOptions: {
        menuSpan: 8,
        submitText: "搜索",
        emptyText: "重置",
        column: [
          {
            label: "关键字",
            prop: "searchValue",
            span: 6,
          },
        ],
      },
      searchForm: {},
      isLastAry: false, //是否是最后一层
      categoryId: undefined, //当前点击的内层id
      readonly: true, //编辑器是否可编辑

      editorData: "",
      detailId: undefined, //获取最后一级的数据ID，用于编辑操作

      // 是否显示筛选
      searchShow: true,
    };
  },
  methods: {
    nodeClick(data) {
      console.log(data);
      if (data.id === 0) {
        // 如果是顶级，则获取当前子数据的第一个
        this.categoryId = data.children[0].id;
        this.$refs.tree.setCurrentKey(this.categoryId);
      } else {
        // 不是顶级
        this.categoryId = data.id;
        if (data.children && data.children.length) {
          // 判断是否是最后一级
          this.isLastAry = false;
        } else {
          this.isLastAry = true;
        }

        console.log(this.isLastAry);
      }
      this.getList();
    },
    // 保存
    async saveContent() {
      console.log(this.editorData);
      let fn = null;

      let sendData = {
        baseCategoryId: this.categoryId,
        content: this.editorData,
        status: 0,
      };

      if (this.detailId) {
        // 编辑操作，修改原有数据
        sendData.id = this.detailId;
        fn = baseCantentEdit;
      } else {
        // 新增操作
        fn = baseCantentAdd;
      }
      const res = await fn(sendData);

      if (res.code === 200) {
        this.$message.success("保存成功");

        this.getList();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 复制内链
    copyRouter() {
      let href = window.location.origin + window.location.pathname;

      let path = `${href}?id=${this.categoryId}`;

      // 复制功能
      navigator.clipboard.writeText(path);
    },

    // 获取数据
    async getList() {
      let sendParams = {
        baseCategoryId: this.categoryId,
      };
      const res = await baseCantentList(sendParams);

      if (res.code === 200) {
        if (res.rows.length) {
          this.editorData = res.rows.map((item) => item.content).join("<br />");

          if (this.isLastAry) {
            // 最后一级，获取当前的数据id
            this.detailId = res.rows[0].id;
          }
        } else {
          this.editorData = "";
          this.detailId = undefined;
        }
      }
      this.readonly = true;
    },

    // 获取树形数据
    async getDeptOptions() {
      const { query } = this.$route;
      console.log(query, "query");

      const res = await baseCategoryList(this.queryForm);
      if (res.code === 200) {
        const menu = {
          id: 0,
          parentId: 0,
          categoryName: "项目销售指引公告",
          children: [],
        };
        menu.children = this.handleTree(res.data);
        this.treeData.push(menu);

        if (query.id) {
          // 判断参数是否有值，
          this.categoryId = query.id;
        } else {
          // 默认选中顶级子数据的第一个
          this.categoryId = menu.children[0].id;
        }

        console.log(this.$refs.tree);
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.categoryId);
        });
        this.getList();
      }
    },

    fullscreen(dom) {
      if (dom.requestFullscreen) {
        dom.requestFullscreen();
      } else if (dom.mozRequestFullScreen) {
        // Firefox
        dom.mozRequestFullScreen();
      } else if (dom.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        dom.webkitRequestFullscreen();
      } else if (dom.msRequestFullscreen) {
        // Internet Explorer and Edge
        dom.msRequestFullscreen();
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // Internet Explorer and Edge
        document.msExitFullscreen();
      }
    },
    // 全屏
    handleFullScreen() {
      const knowledgeDom = document.querySelector("#knowledge-box");

      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      if (fullscreenElement) {
        // 退出全屏
        this.exitFullscreen(knowledgeDom);
      } else {
        // 进入全屏
        this.fullscreen(knowledgeDom);
      }
    },
  },
  mounted() {
    this.getDeptOptions();
  },
};
</script>

<style lang='scss' scoped>
.knowledge-box {
  position: relative;
  min-height: calc(100vh - 84px);
  .knowledge-aside {
    border-right: 2px solid #eee;
    background: #fff;
  }
  .knowledge-header {
    position: relative;
    height: 30px !important;
  }

  .content-btn {
    position: absolute;
    right: 40px;
    top: 15px;
    cursor: pointer;
    i {
      font-size: 20px;
      margin: 0 8px;
      display: inline-block;
    }
  }
}

:-webkit-full-screen {
  padding: 20px;
  background: #ffffff;
}

:-moz-full-screen {
  padding: 20px;
  background: #ffffff;
}
</style>