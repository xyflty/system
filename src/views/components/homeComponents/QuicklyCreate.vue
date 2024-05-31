<template>
  <div
    class="quickly-aside"
    ref="asideRef"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
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
      <div class="icon-box">
        <i
          :class="asideIcon ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        ></i>
      </div>
    </div>

    <followUpDialog
      ref="followUpRef"
      :formType="formType"
      :config="{ attrs: { 'append-to-body': true } }"
      @success="handleSuccess"
    />
    <addDaily :show.sync="show" />
    <addGoal :show.sync="show2" />
  </div>
</template>

<script>
import followUpDialog from "@/views/core/components/followUp.vue";
import addDaily from "@/views/core/components/addDaily.vue";
import addGoal from "@/views/personnel/components/addGoal.vue";

import { followUpMinixs } from "@/mixins/followUp.js";
import { mapState } from "vuex";
export default {
  name: "QuicklyCreate",
  components: { followUpDialog, addDaily, addGoal },
  mixins: [followUpMinixs],
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

        {
          name: "写新跟进",
          key: "followUp",
        },
        {
          name: "新建客户",
          key: "",
          path: "Customer/add",
        },

        {
          name: "客户查询",
          path: "CustomerQuery",
        },
        {
          name: "项目管理",
          path: "Project",
        },
      ],
      asideIcon: false,
    };
  },
  methods: {
    handleClick(item) {
      if (item.key == "followUp") {
        let form = {
          userName: this.user.name,
          isHeavyPoint: 0,
          id: null,
          followUpCategory: 1,
        };
        this.formType = "add";

        this.$refs.followUpRef.show(form);
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

    handleSuccess(type, msg, hide) {
      this.$modal.msgSuccess(msg);

      hide();
    },

    handleMouseenter() {
      this.asideIcon = true;
      this.$refs.asideRef.style.right = 0;
    },
    handleMouseleave() {
      this.asideIcon = false;
      this.$refs.asideRef.style.right = "-70px";
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  cursor: pointer;
  font-size: 12px;
}
.item:hover {
  background-color: #f9f9f9;
}
.item img {
  width: 18px;
  height: 18px;
}
.item div {
  margin-top: 10px;
}
.menu-box {
  position: relative;
  background: #fff;
  .icon-box {
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: #fff;
    box-shadow: -2px 2px 20px rgba(0, 0, 0, 0.3);
    clip-path: polygon(0 8px, 100% 0, 100% 100%, 0 72px);
    cursor: pointer;
    > i {
      font-size: 12px;
      color: #999;
    }
  }
}

.quickly-aside {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: -70px;
  z-index: 999;
  box-shadow: -2px 2px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  transition: all 0.3s;
}
</style>
