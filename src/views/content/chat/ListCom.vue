<template>
  <div class="ListCom">
    <el-input
      v-model="searchVal"
      placeholder="请搜索"
      clearable
      prefix-icon="el-icon-search"
      @input="getAiHistory"
    ></el-input>
    <el-scrollbar ref="scrollbarRef" class="scrollbar-list">
      <ul class="list" v-if="historyList.length" v-loading="loading">
        <li v-for="(item, i) in historyList" :key="i">
          <div class="history_content">
            <div>
              <el-checkbox
                v-if="controlKey"
                v-model="item.checked"
              ></el-checkbox>
              <i
                v-else
                class="el-icon-chat-dot-square"
                style="margin-right: 10px"
              ></i>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.title"
              placement="bottom-start"
            >
              <div
                class="item_content"
                v-html="item.title"
                @click="getHistory(i)"
              ></div>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-scrollbar>

    <div class="history-btns">
      <div v-if="controlKey" class="history_operation">
        <div>
          <el-checkbox v-model="allChecked" @change="toggleAllSelect"
            >全选</el-checkbox
          >
        </div>
        <div>
          <el-button
            v-if="type === 'history'"
            type="text"
            icon="el-icon-delete"
            size="mini"
            round
            :disabled="!btnDisabled"
            @click="allDelHistory"
            >删除</el-button
          >
          <el-button
            v-if="type === 'collect'"
            type="text"
            icon="el-icon-delete"
            size="mini"
            round
            :disabled="!btnDisabled"
            @click="collectDel"
            >取消收藏</el-button
          >
        </div>
      </div>
      <div v-else class="control_btn">
        <el-button
          type="text"
          icon="el-icon-check"
          @click="controlKey = !controlKey"
          >{{ type === "collect" ? "批量取消收藏" : "批量删除" }}</el-button
        >
      </div>

      <div class="icon-control">
        <i
          v-if="controlKey"
          class="el-icon-close"
          @click="controlKey = !controlKey"
        ></i>
        <i v-else class="el-icon-sort" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {
  aiHistoryList,
  delAiHistory,
  aiHistoryEditBatch,
} from "@/api/content/chat";
export default {
  name: "ListCom",
  props: {
    type: String,
  },
  data() {
    return {
      searchVal: "",
      historyList: [],
      loading: false,
      //批量操作控制(是否显示勾选框)
      controlKey: false,
    };
  },
  methods: {
    // 获取历史记录数据
    async getAiHistory() {
      this.loading = true;
      let sendParams = {
        title: this.searchVal,
        stars: 0,
      };
      if (this.type === "collect") {
        // 收藏
        sendParams.stars = 1;
      }
      const res = await aiHistoryList(sendParams);

      this.historyList = res.rows.map((item) => {
        return {
          ...item,
          checked: false,
          collect: item.stars,
        };
      });
      this.loading = false;

      this.$refs.scrollbarRef.wrap.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // 点击历史记录
    getHistory(index) {
      let row = this.historyList[index];

      this.$emit("historyClick", row);
    },

    toggleAllSelect() {},
    // 删除回调
    removeCallback(ids) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delAiHistory(ids);
          if (res.code === 200) {
            this.getAiHistory();
            this.$message.success("已删除");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 批量删除
    allDelHistory() {
      let selectData = this.historyList
        .filter((item) => item.checked)
        .map((item) => item.id);

      if (selectData.length) {
        let ids = selectData.join(",");
        this.removeCallback(ids);
      } else {
        this.$message.error("请选择要删除的数据");
      }
    },
    // 取消收藏
    async collectDel() {
      let selectData = this.historyList
        .filter((item) => item.checked)
        .map((item) => item.id);

      if (selectData.length) {
        let sendData = {
          ids: selectData,
          stars: 0,
        };
        const res = await aiHistoryEditBatch(sendData);
        if (res.code === 200) {
          this.getAiHistory();
          this.$emit("cancel", selectData);
          this.$message.success("已取消收藏");
        } else {
          this.$message.error(res.msg);
        }
      } else {
        this.$message.error("请选择要删除的数据");
      }
    },

    close() {
      this.$emit("close");
    },
  },
  mounted() {
    this.getAiHistory();

    this.getData = this.getAiHistory;
  },

  computed: {
    allChecked: {
      get() {
        if (this.historyList.length) {
          return this.historyList.every((item) => item.checked);
        }

        return false;
      },
      set(newVal) {
        this.historyList.map((item) => (item.checked = newVal));
      },
    },
    //  按钮是否可以点击
    btnDisabled() {
      return this.historyList.some((item) => item.checked);
    },
  },
};
</script>

<style lang='scss' scoped>
.ListCom {
  height: 100%;
  position: relative;
  ::v-deep .el-input--medium {
    margin-bottom: 15px;
  }
  .scrollbar-list {
    height: calc(100% - 100px);
    // background-image: -webkit-cross-fade(
    //   url("../../../assets/images/profile.jpg"),
    //   url("../../../assets/images/login-background.jpg"),
    //   50%
    // );
    // background-image: cross-fade(
    //   url("../../../assets/images/profile.jpg"),
    //   url("../../../assets/images/login-background.jpg"),
    //   50%
    // );
    // background-position: center center;
    // background-repeat: no-repeat;
    // background-size: cover;
    border-radius: 5px;
  }
  .list {
    width: 100%;
    // height: calc(100% - 100px);
    height: 100%;
    margin-top: 15px;
    color: #333;

    li {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      cursor: pointer;
      &:hover {
        background: #eee;
        border-radius: 15px;
        color: rgb(253, 151, 4);
      }
      &:not(:last-child) {
        border-bottom: 1px solid rgba(253, 151, 4, 0.2);
      }
    }
  }
  .history_content {
    width: 100%;
    display: flex;
    align-items: center;
    .item_content {
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      text-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    }
  }

  .history-btns {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid rgba(253, 151, 4, 0.6);
    padding: 8px 0 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 20px rgba(253, 151, 4, 0.2);
    .history_operation {
      display: flex;
      align-items: center;
      flex: 1;
      > div {
        flex: 1;
        &:first-child {
          border-right: 1px solid #eee;
        }
      }
    }
    .icon-control {
      padding-left: 8px;
      border-left: 1px solid #eee;
      cursor: pointer;
      i {
        &:last-child {
          transform: rotate(90deg);
        }
      }
    }
  }
  ::v-deep .el-checkbox__inner {
    border-radius: 50%;
  }
}
</style>