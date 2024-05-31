<template>
  <el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-box">
        <div class="msg-box">
          <div
            v-for="(item, index) in tab"
            :key="index"
            @click="handleClick(index)"
            :class="{ select_title: index === current, msg_title: true }"
          >
            <el-badge v-if="item.label !== '公告信息'" :value="item.total">{{
              item.label
            }}</el-badge>
            <span v-else>{{ item.label }}</span>
          </div>
        </div>
        <el-button size="small" plain @click="$router.push({ name: 'Message' })"
          >查看更多</el-button
        >
      </div>
      <div
        class="menu-box"
        v-for="(item, index) in list"
        :key="index"
        @click="handleMessage(item)"
      >
        <span class="long-text"
          >[{{
            ["任务消息", "业务消息", "审核消息", "协同通知"][
              item.messageType - 1
            ]
          }}]

          <span :class="{ ableClick: item.isRead === 0 }">{{
            item.content
          }}</span>
          <el-link type="primary"></el-link>
        </span>
        <span class="receiveTime">{{ item.receiveTime }}</span>
      </div>
      <el-empty v-show="total == 0" :image-size="100"></el-empty>
      <MessageInfo
        :row="row"
        :show.sync="show"
        @loadCount="getMessageCount"
        @on-load="getList"
      />
    </el-card>
  </el-row>
</template>

<script>
import { listMessage, messageCount } from "@/api/index/index";
import MessageInfo from "@/views/core/components/messageInfo";

import { dailyRead, updateIsRead } from "@/api/content/daily.js";
import { getInfo } from "@/api/content/message";
export default {
  components: { MessageInfo },
  data() {
    return {
      // 总条数
      total: 0,
      // 消息记录表格数据
      list: [],
      row: {},
      show: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 6,
        isRead: undefined,
        messageType: undefined,
      },
      tab: [
        {
          label: "全部消息",
          total: 0,
        },
        {
          label: "任务消息",
          total: 0,
        },
        {
          label: "业务消息",
          total: 0,
        },
        {
          label: "审核消息",
          total: 0,
        },
        {
          label: "协同通知",
          total: 0,
        },
        {
          label: "公告信息",
          total: 0,
        },
      ],
      current: 0,
    };
  },
  watch: {
    current: {
      handler(n) {
        if (n != 5) {
          this.queryParams.messageType = n == 0 ? "" : n;
          this.getList();
        }
      },
    },
  },
  mounted() {
    this.getList();
    this.getMessageCount();
  },
  methods: {
    // 获取数据
    getList() {
      listMessage(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
      });
    },
    // 获取公共信息数据
    getMessageCount() {
      messageCount().then((res) => {
        for (const key in res.data) {
          this.tab.forEach((item) => {
            if (item.label === key) {
              item.total = res.data[key];
            }
          });
        }
      });
    },

    handleClick(index) {
      this.current = index;
      if (index == 5) {
        this.$bus.$emit("brotherEvent", true);
      }
    },

    handleMessage(row) {
      if (row.relateType === 7) {
        let fn = null;
        if (row.dailyParam === 3) {
          fn = updateIsRead;
        } else {
          fn = dailyRead;
        }
        // 部门主管点击详情，更新已预览
        fn({ dailyId: row.relateId }).then((res) => {
          if (res.code === 200) {
            getInfo(row.id).then(() => {
              this.$router.push({
                name: "Daily/detail",
                query: { id: row.relateId, type: row.dailyParam === 3 ? 3 : 2 },
              });
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.row = row;
        this.show = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  background: #f9f9f9;
  padding: 0 20px;
}

::v-deep .el-card__body {
  height: 310px;
}

.text {
  font-size: 14px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  cursor: pointer;
}

.item:hover {
  background-color: #f9f9f9;
}

.item img {
  width: 48px;
  height: 48px;
}

.item div {
  margin-top: 10px;
}

.header-box {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn_more {
  box-sizing: border-box;
  width: 90px;
  height: 36px;
  font-size: 12px;
  color: #999999;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(228, 228, 228, 1);
  text-align: center;
  line-height: 36px;
  background: #fff;
  border-radius: 5px;
  font-family: "微软雅黑 Regular", 微软雅黑;
  font-weight: 400;
}

.msg_title {
  position: relative;
  padding: 0 20px;
  cursor: pointer;
}

.msg_title::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  background: #d7d7d7;
  width: 2px;
  height: 100%;
}
.msg-box {
  display: flex;
  align-items: center;
}

.msg-box .msg_title:first-child {
  padding-left: 0;
}

.msg-box .msg_title:last-child::after {
  width: 0;
}

.select_title {
  font-weight: 600;
  color: #333;
}

.box-card {
  width: 100%;
}

.menu-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}

.long-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素
  -webkit-line-clamp: 1; //显示的行数
}

.receiveTime {
  min-width: 155px;
  text-align: right;
}

.ableClick {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
