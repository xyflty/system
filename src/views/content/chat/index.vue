<template>
  <div class="app-container chat-container">
    <div class="chat-box">
      <el-scrollbar class="chat-scrollbar" ref="scrollbarRef">
        <ul class="list" ref="lists">
          <li
            v-for="(n, index) in record"
            :key="index"
            :class="n.role === 'user' ? 'meSay' : 'aSay'"
          >
            <div class="nei">
              <el-avatar
                class="avatar"
                :size="35"
                :src="n.role === 'user' ? user.avatar : assistantAvator"
              ></el-avatar>

              <div class="content">
                <div v-if="n.loading" class="content-loading">
                  <i class="el-icon-loading"></i>
                </div>
                <div v-else v-html="n.content" class="markdown-body"></div>
              </div>
            </div>
            <div
              class="chat-btn"
              v-if="n.role === 'assistant' && index !== 0 && n.content"
            >
              <div class="reset-text">
                <span
                  v-if="index === record.length - 1"
                  @click="resetSend(index)"
                  >重新生成</span
                >
              </div>
              <div class="icons">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="复制"
                  placement="bottom"
                >
                  <i
                    class="collect-icon el-icon-copy-document"
                    @click="copyText(n, index)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="n.collect ? '取消收藏' : '收藏'"
                  placement="bottom"
                >
                  <i
                    class="collect-icon"
                    :class="n.collect ? 'el-icon-star-on' : 'el-icon-star-off'"
                    @click="toggleCollect(n)"
                  ></i>
                </el-tooltip>
              </div>
            </div>

            <!-- <div class="dateTime">{{ n.dateTime }}</div> -->
          </li>
        </ul>
      </el-scrollbar>

      <div class="bottom">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="message"
          resize="none"
          @keyup.enter.native="send"
        >
        </el-input>
        <div class="btns">
          <button class="btn send-btn" @click="send">
            <i class="el-icon-position"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="history-list">
      <el-tabs
        class="histoty-tabs"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="历史问答记录" name="history">
          <ListCom
            ref="historyRef"
            type="history"
            @historyClick="historyClick"
            @close="handleHide"
          />
        </el-tab-pane>
        <el-tab-pane label="收藏问答" name="collect">
          <ListCom
            ref="collectRef"
            type="collect"
            @historyClick="historyClick"
            @cancel="cancelCollect"
            @close="handleHide"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="show_historyList" v-if="hideFlag" @click="handleShow">
      <div class="icon">
        <i class="el-icon-sort"></i>
        <span>展开</span>
      </div>
    </div>

    <!-- 复制兼容 -->
    <textarea ref="copyInput" id="copyInput" value="" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import ListCom from "./ListCom.vue";

import { chatAi, aiHistoryEdit } from "@/api/content/chat";
import { marked } from "marked";
import "github-markdown-css";

import { copyToClipboard } from "@/utils";
export default {
  components: { ListCom },
  data() {
    return {
      ws: null, // ws 实例 预留变量
      scrollbarRef: null,
      assistantAvator: require("../../../assets/logo/logo.png"),
      message: "",
      record: [
        {
          role: "assistant",
          content:
            "您好，请问有什么需要帮助的吗？<br/><br/>提出具体的问题有助于获得更好的答案，如： <br/><br/> 建筑工程施工总承包二级是什么？请详细解释总承包二级资质的定义、特点、基本条件、关键职责和能力要求，以及该资质在建筑市场中的作用和优势。",
        },
      ],

      activeName: "history",

      hideFlag: false,

      scollDom: null,
    };
  },
  methods: {
    // 滚动到最新位置
    scrollFn() {
      this.$nextTick(() => {
        let scrollTop = this.scrollbarRef.wrap.scrollHeight;

        this.scrollbarRef.wrap.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      });
    },
    //调用ai接口
    getChatAi(list = null) {
      let sendData = {
        messages: list || this.record.slice(1),
      };
      this.record.push({
        role: "assistant",
        content: "",
        collect: false,
        loading: true,
      });
      let index = this.record.length - 1;
      console.log(index);
      chatAi(sendData)
        .then((res) => {
          if (res.code === 200) {
            //   const listDom = document.querySelector(".list");
            let row = this.record[index];
            row.id = res.data.historyContentId;
            row.loading = false;
            var html = marked(res.data.content);

            this.typeMessage(html, index);

            if (this.activeName === "history") {
              this.$refs[`historyRef`].getData();
            }
          } else {
            let row = this.record[this.record.length - 1];
            row.content = "网络超时了！请刷新页面";
            row.loading = false;
          }
        })
        .catch((err) => {
          let row = this.record[this.record.length - 1];
          row.content = "网络超时了！请刷新页面";
          row.loading = false;
        });
    },

    // 发送后调用接口
    send() {
      if (!this.message.trim().length) {
        return alert("请输入内容");
      }

      this.record.push({
        role: "user",
        content: this.message,
      });

      // 清空
      this.message = "";
      this.getChatAi();
    },

    typeMessage(message, index) {
      const messageArray = message.split("");
      let currentIndex = 0;
      let that = this;
      let row = this.record[index];
      let oldScrollTop = 0;
      function typeNextCharacter() {
        if (currentIndex < messageArray.length) {
          row.content += messageArray[currentIndex];
          currentIndex++;
          setTimeout(typeNextCharacter, 10); // 打字速度，单位为毫秒
          // that.scrollFn();
          let scrollTop = that.scrollbarRef.wrap.scrollHeight;

          if (scrollTop !== oldScrollTop) {
            that.scrollbarRef.wrap.scrollTop = scrollTop;
          }
          oldScrollTop = scrollTop;
        } else {
        }
      }
      typeNextCharacter();
    },

    // 切换收藏
    async toggleCollect(row) {
      row.collect = !row.collect;
      let sendData = {
        id: row.id,
        stars: row.collect ? 1 : 0,
      };

      const res = await aiHistoryEdit(sendData);
      this.$refs[`${this.activeName}Ref`].getData();

      let msg = row.collect ? "已收藏" : "已取消收藏";
      if (res.code === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    // 复制
    copyText(row, index) {
      // 复制功能

      const dom = document.querySelectorAll(".markdown-body");
      let text = dom[index].innerText;

      // navigator.clipboard.writeText(text);
      // let text = row.content.replace(/<[^>]*>/g, "");
      console.log(text);

      const msg = copyToClipboard(text);

      this.$message.success(msg);
    },

    // 点击列表数据
    historyClick(row) {
      this.record.push(
        {
          role: "user",
          content: row.title,
        },
        {
          id: row.id,
          role: "assistant",
          collect: row.collect,
          content: marked(row.content),
        }
      );
    },

    // 重新发送
    resetSend(index) {
      let list = this.record.slice(1, index);
      console.log(list);
      this.getChatAi(list);
    },
    handleClick() {
      this.$refs[`${this.activeName}Ref`].getData();
    },

    //隐藏
    handleHide() {
      const historyDom = document.querySelector(".history-list");
      historyDom.style.width = 0;
      historyDom.style.marginLeft = 80 + "px";
      this.hideFlag = true;
    },
    // 显示
    handleShow() {
      const historyDom = document.querySelector(".history-list");
      historyDom.style.width = 350 + "px";
      historyDom.style.marginLeft = 15 + "px";
      this.hideFlag = false;
    },
    cancelCollect(list) {
      this.record.map((item) => {
        if (list.includes(item.id)) {
          item.collect = false;
        }
      });
    },
  },

  mounted() {
    this.scollDom = document.querySelector(".chat-scrollbar");
    this.scrollbarRef = this.$refs.scrollbarRef;
    this.scrollFn();

    // this.ws = new WebSocket("ws://localhost:9100");
    // // open 连接上ws服务器端了 发送欢迎消息
    // this.ws.addEventListener("open", () => {
    //   this.ws.send(
    //     JSON.stringify({
    //       user: this.user.name,
    //       avatar: this.user.avatar,
    //       dateTime: Date.now(),
    //       message: "欢迎 " + this.user.name + " 来到聊天室",
    //     })
    //   );
    // });
    // // message 接收到服务器返回来的数据
    // this.ws.addEventListener("message", (e) => {
    //   const data = JSON.parse(e.data);
    //   this.record.push(data);
    // });
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    record: {
      handler() {
        this.scrollFn();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$me-primary: rgba(255, 255, 255, 1);
$border-primary: rgba(255, 220, 185, 0.7);
$a-content-bg: rgba(253, 151, 4, 0.6);

.chat-container {
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: calc(100vh - 86px);
  line-height: 1.5;
  background: #f5f5f5;

  .chat-box {
    flex: 1;
    height: 100%;
    position: relative;

    .chat-scrollbar {
      height: calc(100% - 150px);
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border: none;
      background: #fff;
    }
    .list {
      li {
        margin: 15px 0;
        color: #333;

        .nei {
          display: flex;

          .avatar {
            flex: 0 0 35px;
            background: #fff;
          }
          ::v-deep .content {
            position: relative;

            margin: 0 10px;
            box-shadow: 0 0 10px rgba(255, 187, 119, 0.6);
            color: #333;
            display: flex;
            align-items: center;

            .content-loading {
              width: 100%;
              text-align: center;
            }
            .markdown-body {
              padding: 10px;
              border-radius: 5px;
              background-color: rgba(253, 151, 4, 0.6);
              overflow: hidden;
            }
            &::before {
              content: "";
              position: absolute;
              top: 12.5px;
              height: 8px;
              width: 8px;

              border-right: 1px solid transparent;
              border-bottom: 1px solid transparent;
            }
            ol,
            ul {
              padding-left: 40px;
            }
            ol li {
              list-style-type: decimal;
              list-style-position: inside;
              padding: 5px 0;
            }
            ul li {
              list-style-type: disc;
              list-style-position: inside;
              padding: 5px 0;
            }
            p {
              margin: 16px 0;
            }
          }
        }
        .dateTime {
          font-size: 12px;
          color: #999;
          margin: 10px 45px 0;
        }
        .collect-icon {
          font-size: 20px;
          padding: 0 10px;

          color: rgb(253, 151, 4);
          &:not(:last-child) {
            border-right: 1px solid #eee;
          }
        }
      }
      .aSay {
        display: flex;
        flex-direction: column;
        .nei {
          .content {
            border: 1px solid $border-primary;
            min-width: 50px;
            width: fit-content;

            &::before {
              left: -4px;
              background: $a-content-bg;

              border-top: 1px solid $border-primary;
              border-left: 1px solid $border-primary;
              transform: rotate(315deg);
            }
          }
        }
        .chat-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;

          .reset-text {
            padding-left: 30px;
            color: rgb(253, 151, 4);
            font-size: 14px;
            cursor: pointer;
            &:hover {
              color: rgba(253, 151, 4, 0.5);
            }
          }
          .icons {
            cursor: pointer;
          }
        }
      }
      .meSay {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .avatar {
          order: 1;
        }
        .nei {
          .content {
            .markdown-body {
              border: 1px solid $border-primary;
              background: $me-primary;
            }

            &::before {
              right: -4px;
              background: $me-primary;
              border-top: 1px solid $border-primary;
              border-left: 1px solid $border-primary;
              transform: rotate(135deg);
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      background: #fff;
      border-radius: 5px;
      .btns {
        position: absolute;
        bottom: 15px;
        right: 20px;
        .btn {
          width: 60px;
          height: 35px;
          font-size: 20px;
          border-radius: 20px;
          box-sizing: border-box;
          outline: none;
          text-align: center;
          line-height: 35px;
          border: none;

          color: #333;
          cursor: pointer;
          transition: all 0.4s;

          background: linear-gradient(
            to right,
            rgb(255, 176, 65),
            rgb(253, 151, 4)
          );
          color: #fff;
          &:hover {
            scale: 1.15;
          }
        }
      }

      ::v-deep .el-textarea__inner:focus {
        border: 1px solid rgb(253, 151, 4);
        box-shadow: 0 0 20px rgba(253, 151, 4, 0.1);
      }

      ::v-deep .el-textarea__inner {
        border: 1px solid transparent;
      }
    }
  }

  .history-list {
    width: 350px;
    height: 100%;
    margin-left: 15px;
    overflow: hidden;
    transition: all 0.5s;

    ::v-deep .histoty-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(100% - 55px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .show_historyList {
    position: fixed;
    right: 0;
    bottom: 20px;
    padding: 5px 0;
    width: 70px;
    text-align: center;
    background: rgba(253, 151, 4, 0.8);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    border: 1px solid rgb(253, 151, 4);

    font-size: 14px;
    color: #333;
    cursor: pointer;
    i {
      transform: rotate(90deg);
      margin-right: 5px;
    }
  }

  ::v-deep .el-scrollbar__bar {
    display: none;
  }
}
</style>
