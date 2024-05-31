<template>
  <el-row>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-box">
        <span style="padding: 10px 0">快速新建</span>
        <!-- <el-alert
          show-icon
          title="恭喜，XXX在本次考核展现优秀的实力，已晋级，晋级为：XXX级别"
          type="warning"
          class="tip"
        >
        </el-alert> -->
      </div>
      <div class="menu-box">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          class="text item"
          @click="handleClick(item)"
        >
          <img
            :src="require(`@/assets/home/index_icon${index + 1}.png`)"
            alt=""
          />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </el-card>

    <followUpDialog
      :followUpForm.sync="followUpForm"
      :followUpOpen.sync="followUpOpen"
    />
    <addDaily :show.sync="show" />
    <addGoal :show.sync="show2" />
  </el-row>
</template>

<script>
import followUpDialog from "@/views/core/components/followUp.vue";
import addDaily from "@/views/core/components/addDaily.vue";
import addGoal from "@/views/personnel/components/addGoal.vue";

export default {
  name: "QuicklyCreate",
  components: { followUpDialog, addDaily, addGoal },
  data() {
    return {
      show: false,
      show2: false,
      followUpOpen: false,
      followUpForm: {},

      menuList: [
        {
          name: "新建线索",
          key: "",
          path: "Clue/add",
        },
        // {
        //   name: "新建挖需",
        //   key: "",
        //   path: "Demand/add",
        // },
        // {
        //   name: "新建商机",
        //   key: "",
        //   path: "Opportunity/add",
        // },
        {
          name: "新建客户",
          key: "",
          path: "Customer/add",
        },
        // {
        //   name: "新建订单",
        //   key: "",
        //   path: "Order/add",
        // },
        {
          name: "写新跟进",
          key: "followUp",
        },
        {
          name: "新建日报",
          key: "addDaily",
        },
        {
          name: "新建目标",
          key: "addGoal",
        },
        {
          name: "项目管理",
          path: "Project",
        },
        {
          name: "客户查询",
          path: "CustomerQuery",
        },
      ],
    };
  },
  methods: {
    handleClick(item) {
      if (item.key == "followUp") {
        this.followUpOpen = true;
        return;
      }
      if (item.key == "addDaily") {
        this.show = true;
        return;
      }
      if (item.key == "addGoal") {
        this.show2 = true;
        return;
      }
      if (!item.path) {
        return this.$message.warning("还在制作中...");
      }
      this.$router.push({ name: item.path, query: { type: 0 } });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  background: #f9f9f9;
}
.text {
  font-size: 14px;
}
.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tip {
  width: fit-content;
  min-width: 50%;
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
.menu-box {
  display: flex;
  flex-wrap: wrap;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
</style>
