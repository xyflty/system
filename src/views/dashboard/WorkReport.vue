<template>
  <el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-box">
        <span>工作报告</span>
        <div class="work-box">
          <el-select v-model="value" placeholder="请选择">
            <el-option label="提交给我的" :value="0"> </el-option>
            <el-option label="我提交的" :value="1"> </el-option>
            <el-option label="下属提交的" :value="2"> </el-option>
          </el-select>
          <el-button plain style="margin-left: 10px" @click="show = true"
            >写新报告</el-button
          >
          <el-button
            plain
            style="margin-left: 10px"
            @click="$router.push({ name: 'Daily' })"
            >查看更多</el-button
          >
        </div>
      </div>
      <div class="menu-box" v-for="(item, index) in list" :key="index">
        <span class="long-text"
          >{{ item.dailyTime.split(" ")[0] }} {{ item.title || "-" }}</span
        >
        <span>{{ item.userName || "-" }}</span>
        <span>{{ item.isRead == 0 ? "未查看" : "已查看" }}</span>
        <span
          class="detail"
          @click="detail(item)"
          v-hasPermi="['core:daily:query']"
          >详情</span
        >
      </div>

      <div v-show="total == 0" class="empty">
        <el-empty :image-size="150"></el-empty></div
    ></el-card>
    <addDaily :show.sync="show" @syncList="getList" />
  </el-row>
</template>

<script>
import {
  list,
  updateIsRead,
  update,
  getHadDailyByDate,
} from "@/api/content/daily";
import addDaily from "@/views/core/components/addDaily.vue";
export default {
  components: { addDaily },
  data() {
    return {
      show: false,
      total: 0,
      value: 0,

      // 总条数
      total: 0,
      // 消息记录表格数据
      list: [],
      loading: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        param: 2,
        commitDeptId: undefined,
        commitUserId: undefined,
      },
    };
  },
  watch: {
    value: {
      handler(n) {
        let arr = [2, 3, 1];
        this.queryParams.param = arr[n];
        this.getList();
      },
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取数据
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    detail(row) {
      const { id, isRead } = row;
      if (isRead == 0 && this.current != 1) {
        this.current == 0 ? updateIsRead({ dailyId: id }) : update({ id });
      }
      this.$router.push({ name: "Daily/detail", query: { id } });
    },

    handleClick(index) {
      this.current = index;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  background: #f9f9f9;
}
::v-deep .el-card__body {
  max-height: 700px;
  height: 700px;
  overflow: hidden;
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
.detail {
  color: #0079fe;
  cursor: pointer;
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
.work-box {
  display: flex;
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
}
.menu-box span {
  flex: 1;
  text-align: center;
}

.menu-box span:first-child {
  flex: 1;
  text-align: left;
  min-width: 300px;
}
.long-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; // 从上到下垂直排列子元素
  -webkit-line-clamp: 1; //显示的行数
}
.empty {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
