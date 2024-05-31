// CRM简报
<template>
  <el-card class="CRM-card">
    <div slot="header" class="clearfix">
      <div class="header-container flex flex-acenter">
        <span class="header-card--title">CRM数据简报</span>
        <div class="type-select">
          <template v-for="item in tabsArr">
            <span
              v-if="!item.hide"
              :key="item.value"
              :class="selectType === item.value && 'active'"
              @click="changeType(item)"
              >{{ item.label }}</span
            >
          </template>
        </div>
        <div class="help-icon">
          <el-popover
            placement="top-start"
            title=""
            width="600"
            trigger="hover"
          >
            <div>
              <pre>
部门的排名按照不同层级的部门之间比较

层级一：第一集团军，第二集团军
层级二：合众部、勇者部、顺为咨询、客户部、精英队、阳光队、知行队、政企服务部
层级三：合众本部、齐心队、超越队、追梦队、勇拓队、勇拼队、顺为企业部

如：
第二集团军 的各项数据排名，是以层级一中的其他部门对比得出
合众部 的各项数据排名，是以层级二中的其他部门对比得出
齐心队 的各项数据排名，是以层级三中的其他部门对比得出

个人排名是全集团维度进行排名
              </pre>
            </div>
            <div slot="reference">
              <span class="help-title">说明</span>
              <i class="el-icon-question"></i>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="card-body">
      <!-- 用户信息和筛选 -->
      <div class="user-info--query flex">
        <!-- 个人简报显示 -->
        <div :class="['user-info', { teamBorder: !isUserRole }]">
          <div class="personage flex flex-acenter" v-if="isUserRole">
            <!-- 个人 -->
            <div class="user-avatar">
              <el-avatar size="medium" :src="this.user.avatar"></el-avatar>
            </div>
            <div class="user-name">{{ this.user.name }}</div>
            <div class="user-postName">{{ this.user.user.postName }}</div>
          </div>

          <div class="team" v-else>
            <!-- 团体 -->
            <dl class="flex flex-acenter" v-if="deptOptionsTree.length">
              <dt>团体：</dt>
              <!-- 占位，后面要改 -->
              <dd>
                <SelectTree
                  :search="false"
                  :data="deptOptionsTree"
                  :modelValue.sync="teamId"
                  class="bg-color"
                  @change="handleChange"
                />
              </dd>
            </dl>
          </div>
        </div>

        <!-- 筛选 -->
        <div class="query-container flex flex-acenter">
          <dl class="flex flex-acenter">
            <dt>时间：</dt>
            <template v-for="time in timeArr">
              <dd
                :class="timeActive === time.value && 'timeActive'"
                :key="time.value"
                @click="changeTime(time.value)"
              >
                {{ time.labal }}
              </dd>
            </template>
          </dl>
          <!-- <el-date-picker
            v-model="dateValue"
            type="date"
            placeholder="选择日期范围"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker> -->
        </div>
      </div>

      <!-- 卡片内容 -->
      <div class="card-content" v-loading="loading">
        <template v-for="item in cardBodyArr">
          <div
            v-if="item.list.length === 1"
            class="card-box card_single"
            :style="{ background: item.bgcolor, height: 'auto' }"
            :key="item.key"
          >
            <template v-for="(child, index) in item.list">
              <div :key="index" class="flex flex-between">
                <div class="type">{{ item.type }}</div>
                <dl class="card-dl">
                  <dt>{{ item.key === "dealPriceData" ? "金额" : "数量" }}</dt>
                  <dd class="fontSize16">{{ child.number }}</dd>
                </dl>
                <dl class="card-dl">
                  <dt>排名</dt>
                  <dd>{{ child.rank || "--" }}</dd>
                </dl>
                <dl class="card-dl">
                  <dt>
                    {{ item.key === "opportunityData" ? "转化率" : "完成率" }}
                  </dt>
                  <dd>{{ child.completionRate || 0 }} %</dd>
                </dl>
                <dl
                  class="add-btn"
                  v-if="
                    !['1580402169644216321', 100, 200].includes(loginDeptId)
                  "
                >
                  <span>
                    距离上一名差 {{ child.gapNumber || 0 }}
                    {{ item.key === "dealPriceData" ? "元" : "个" }}
                  </span>
                </dl>
              </div>
            </template>
          </div>

          <div v-else :key="item.key" :style="{ color: item.bgcolor }">
            <div class="card_type">
              <span
                class="card_header--line"
                :style="{ background: item.bgcolor }"
              ></span>
              <span class="card_header--title">{{ item.type }}</span>
            </div>
            <div
              :class="['card-box', { 'show-height': showAllUser }]"
              :style="{ background: item.bgcolor }"
            >
              <div class="card_table--header member-grid">
                <span>名称</span>
                <span>{{
                  item.key === "dealPriceData" ? "金额" : "数量"
                }}</span>
                <span>排名</span>
                <span>
                  {{ item.key === "opportunityData" ? "转化率" : "完成率" }}
                </span>
              </div>
              <template v-for="(child, index) in item.list">
                <div class="member-box" :key="index">
                  <div class="card_table--content member-grid">
                    <span>{{ child.name }}</span>
                    <span>{{ child.number || 0 }}</span>
                    <span>{{ child.rank || "--" }}</span>
                    <span>{{ child.completionRate || 0 }} %</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>

      <div
        class="card-btn"
        v-if="cardBodyArr[0].list.length > 1"
        @click="showAllUser = !showAllUser"
      >
        {{ `${showAllUser ? "隐藏" : "展开"}全部成员` }}
      </div>
    </div>
  </el-card>
</template>

<script>
import SelectTree from "@/components/SelectTree"; // 引入日历插件

import {
  getUserBusinessDataRank,
  getGroupBusinessData,
  getSubjectBusinessData,
  getDeptBusinessData,
  getMemberBusinessData,
  getTeamBusinessData,
  getDeptTreeListForHomePage,
} from "@/api/index";

// 混入
import { userAndDept } from "@/views/newreport/customer/mixins/userAnddept.js";

import { mapState } from "vuex";
export default {
  components: {
    SelectTree,
  },
  mixins: [userAndDept],
  props: {
    // 默认选中第一个
    // timeActive: {
    //   type: Number,
    //   default: 6,
    // },
  },
  data() {
    return {
      loading: false,
      // 筛选时间
      timeArr: [
        {
          labal: "默认当月时间",
          value: 6,
        },

        {
          labal: "上个月",
          value: 7,
        },
      ],
      //

      cardBodyArr: [
        {
          type: "线索数据",
          key: "clueData",

          bgcolor: "#5962FD",
          list: [],
        },
        {
          type: "订单数据",
          key: "orderData",

          bgcolor: "#A24FF1",
          list: [],
        },
        {
          type: "业绩数据",
          key: "dealPriceData",

          bgcolor: "#409EFF",
          list: [],
        },
        {
          type: "咨询订单",
          key: "consultOrderData",

          bgcolor: "#2FCBBD",
          list: [],
        },
        {
          type: "商机数据",
          key: "opportunityData",

          bgcolor: "#FF9600",
          list: [],
        },
      ],

      // 团体id
      teamId: this.id,

      showAllUser: false,

      tabsArr: [
        {
          label: "个人简报",
          value: 1,
          hide: false,
        },
        {
          label: "集团简报",
          value: 2,
          hide: false,
        },
        {
          label: "主体简报",
          value: 3,
          hide: false,
        },
        {
          label: "部门简报",
          value: 4,
          hide: false,
        },
        {
          label: "团队简报",
          value: 5,
          hide: false,
        },
        {
          label: "成员简报",
          value: 6,

          hide: false,
        },
      ],

      selectType: 1,

      deptOptionsTree: [],
      // 当前登录人部门id
      loginDeptId: "",
      timeActive: 6, //默认当月时间，7为上个月
      id: "",
    };
  },
  methods: {
    // 切换页面类型
    changeType(row) {
      this.selectType = row.value;
      this.resetData();
    },
    // 切换筛选时间
    changeTime(value) {
      this.timeActive = value;
      this.getBulletinData();
      // this.$emit("update:timeActive", value);
    },
    resetData() {
      this.teamId = this.id;
      this.timeActive = 6;
      // this.$emit("update:timeActive", 6);
    },

    handleChange(node) {
      this.teamId = node.id;
      this.getBulletinData();
      // this.$emit("change", node);
    },

    dealData(obj) {
      this.cardBodyArr.forEach((item) => {
        item.list = obj[item.key];
      });
    },

    // 获取简报数据
    getBulletinData() {
      this.loading = true;
      let sendParams = {
        timeType: this.timeActive,
      };
      let fn = getUserBusinessDataRank;

      if (this.selectType == 1) {
        // 个人
        fn = getUserBusinessDataRank;
      } else if (this.selectType == 2) {
        // 集团

        fn = getGroupBusinessData;
      } else if (this.selectType == 3) {
        // 主体
        sendParams.deptId = this.teamId;
        fn = getSubjectBusinessData;
      } else if (this.selectType == 4) {
        // 部门
        sendParams.deptId = this.teamId;
        fn = getDeptBusinessData;
      } else if (this.selectType == 5) {
        // 团体
        sendParams.deptId = this.teamId;
        fn = getTeamBusinessData;
      } else if (this.selectType == 6) {
        // 成员
        sendParams.deptId = this.teamId;
        fn = getMemberBusinessData;
      }

      //
      fn(sendParams)
        .then((res) => {
          console.log(res.data);
          this.dealData(res.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    getLimits() {
      console.log(this.user, "user");

      if (this.isUserRole) {
        // 个人
        this.tabsArr[1].hide = true;
        this.tabsArr[2].hide = true;
        this.tabsArr[4].hide = true;
        this.tabsArr[5].hide = true;

        this.selectType = 1;
      } else if (this.miniDepts) {
        // 最小部门
        this.tabsArr[0].hide = true;
        this.tabsArr[1].hide = true;
        this.tabsArr[2].hide = true;
        this.tabsArr[3].hide = true;
        this.selectType = 5;
      } else if (["1580402169644216321", 200].includes(this.loginDeptId)) {
        // 集团
        this.tabsArr[0].hide = true;
        this.tabsArr[1].hide = true;
        this.selectType = 3;
      } else if (this.loginDeptId === 100) {
        // 集团

        this.tabsArr[0].hide = true;
        this.selectType = 2;
      } else {
        // 部门
        this.tabsArr[0].hide = true;
        this.tabsArr[1].hide = true;
        this.tabsArr[2].hide = true;
        this.selectType = 4;
      }
    },

    // 首页获取部门树
    getDeptTree() {
      getDeptTreeListForHomePage().then((res) => {
        this.deptOptionsTree = res.data.treeList;
        this.loginDeptId = res.data.deptId;
        console.log(this.deptOptionsTree, "????????");
        this.teamId = this.deptOptionsTree.length
          ? this.deptOptionsTree[0].id
          : this.user.user.deptId;
        this.id = this.teamId;
        this.getLimits();
        this.getBulletinData();
      });
    },
  },
  mounted() {
    this.getDeptTree();
  },
  watch: {
    // id(newVal) {
    //   this.teamId = newVal;
    //   this.getBulletinData();
    // },
    selectType(newVal) {
      this.getBulletinData();
    },
    // timeActive(newVal) {
    //   this.getBulletinData();
    // },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.header-container {
  .header-card--title {
    font-size: 16px;
    font-weight: 700;
    color: rgb(42, 111, 246);
  }
  .type-select {
    padding-left: 20px;
    font-size: 13px;
    color: #333;
    > span {
      display: inline-block;
      padding: 0 8px;
      font-weight: 700;
      cursor: pointer;
      &:not(:last-child) {
        border-right: 1px solid #333;
      }
    }
    .active {
      color: rgb(42, 111, 246);
    }
  }

  .help-icon {
    font-size: 12px;
    .help-title {
      font-weight: 600;
      margin-right: 3px;
    }
    margin-left: 15px;
  }
}

.card-body {
  .user-info--query {
    height: 60px;
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #333;
    .user-info {
      display: flex;
      align-items: center;
      .personage {
        vertical-align: middle;
        > div {
          padding-right: 15px;
        }
      }
    }
    .teamBorder {
      padding-right: 40px;
      border-right: 1px solid #ddd;
    }
    .query-container {
      margin-left: 40px;
      dd {
        padding: 5px 8px;
        margin-right: 15px;
        cursor: pointer;
        transition: all 0.5s;
        &:not(.timeActive):hover {
          color: #2a6ff6;
          font-weight: 500;
        }
      }
      .timeActive {
        color: #fff;
        background: rgb(42, 111, 246);
        border-radius: 5px;
      }
    }
  }
  .card-btn {
    display: flex;
    justify-content: center;
    padding: 15px;
    font-size: 12px;
  }
}

.card-content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 10px;
  padding: 20px 15px;

  overflow: hidden;

  transition: all 0.5s;
  .card-box {
    position: relative;
    height: fit-content;
    max-height: 140px;
    padding: 20px 8px 10px;
    color: #fff;
    border-radius: 10px;
    margin: 0;
    transition: all 0.5s;
    overflow: hidden;
    box-sizing: border-box;

    .type {
      width: 36px;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .card-dl {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      dt {
        font-size: 14px;
        margin-bottom: 15px;
      }
      dd {
        font-size: 20px;
        font-weight: 700;
      }
    }
    .today-add {
      position: absolute;
      right: 10px;
      bottom: 10px;
      font-size: 12px;
    }
  }
  .card_single {
    position: relative;
    padding: 20px 15px 40px;
    .add-btn {
      position: absolute;
      right: 15px;
      bottom: 10px;
      font-size: 12px;
    }
    .fontSize16 {
      font-size: 16px !important;
    }
  }
  .show-height {
    height: auto;
    max-height: fit-content;
    transition: all 0.5s;
  }

  .card_type {
    font-size: 18px;
    height: 30px;

    font-weight: 700;
    margin-bottom: 15px;

    display: flex;
    align-items: center;

    .card_header--line {
      display: inline-block;
      width: 4px;
      height: 100%;
      border-radius: 5px;
      margin-right: 12px;
    }
  }
  .member-box {
    font-size: 13px;

    color: #fff;
  }
  .member-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 35px 61px;
    text-align: center;
    > span {
      &:first-child {
        text-align: left;
      }
      &:nth-child(2) {
        text-align: left;
      }
      &:nth-child(4) {
        text-align: right;
      }
    }
  }
  .card_table--header {
    font-size: 12px;
    margin-bottom: 12px;
    font-weight: 700;
  }
  .card_table--content {
    padding: 5px 0;
    font-weight: 700;
  }
}

.CRM-card {
  ::v-deep .el-card__body {
    padding: 0;
  }
}

.bg-color {
  ::v-deep .el-input__inner {
    background: #2a6ff6;
    color: #fff;
    width: 150px;
    border-radius: 10px;
    text-align: center;
  }
}
</style>
