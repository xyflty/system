//待办跟进事项/客户
<template>
  <div :class="['backlog', { show_style: showCard }]">
    <el-card title="待办跟进事项/客户">
      <div slot="header" class="clearfix">
        <div class="header-container flex flex-between flex-acenter">
          <div>
            <span class="header-card--title">待办跟进事项/客户</span>
            <el-button
              style="margin-left: 15px"
              plain
              type="primary"
              v-hasPermi="['core:clue:followUp']"
              size="small"
              @click="addWait"
            >
              新增待办
            </el-button>
          </div>

          <div class="actions">
            <el-button
              style="margin-left: 15px"
              plain
              type="primary"
              size="small"
              @click="showCard = !showCard"
            >
              {{ `${showCard ? "关闭" : "展开"}重点跟进` }}
              <i class="el-icon-arrow-right"></i>
            </el-button>
            <span class="icon-style"></span>
          </div>
        </div>
      </div>
      <div class="card-content">
        <!-- 日历 -->
        <div class="calendar-box">
          <div class="calendar">
            <vc-calendar
              ref="calendar"
              :attributes="attrs"
              is-expanded
              class="calendar"
              :masks="{ title: 'YYYY-MM' }"
              :value="new Date()"
            >
              <template #header-title="{ title }">
                <h3>{{ customTitle(title) }}</h3>
              </template>
              <template #day-content="{ day }">
                <span
                  tabindex="-1"
                  :aria-label="day.ariaLabel"
                  :aria-disabled="day.isDisabled"
                  role="button"
                  :class="[
                    'vc-day-content',
                    { 'clicked-date': isClicked(day.id) },
                  ]"
                  @click="onDayClick(day)"
                  >{{ day.day }}</span
                >
                <span
                  class="v-custom-dot"
                  v-if="
                    day.attributes &&
                    day.attributes.length > 0 &&
                    day.attributes[0].customData
                  "
                  >{{ day.attributes[0].customData }}</span
                >
              </template>
            </vc-calendar>
          </div>
          <!-- 待办区域 -->
          <div class="calendar-wait">
            <div
              :class="[
                'calendar-wait-box',
                { activeWait: activeWait === user.userId },
              ]"
              @click="clickUser(user.userId)"
            >
              <span>我的待办</span>
            </div>
            <div v-if="!isUserRole">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title">
                    <div class="calendar-wait-box">
                      <span>团体待办</span>
                    </div>
                  </template>
                  <div class="tree_box">
                    <el-tree
                      :data="deptOptions"
                      @node-click="handleNodeClick"
                    ></el-tree>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="2">
                  <template slot="title">
                    <div class="calendar-wait-box">
                      <span>成员待办</span>
                    </div>
                  </template>
                  <el-scrollbar style="height: 210px" ref="scrollbar">
                    <div class="flex flex-column">
                      <template v-for="item in userMap">
                        <span
                          :key="item[userProp.value]"
                          style="padding-left: 30px"
                          :class="[
                            'calendar-wait-box',
                            { activeWait: activeWait === item[userProp.value] },
                          ]"
                          @click="clickUser(item[userProp.value])"
                          >{{ item[userProp.label] }}</span
                        >
                      </template>
                    </div>
                  </el-scrollbar>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
        <!-- 待办表格数据 -->
        <div class="waitWork">
          <avue-crud
            :key="showCard"
            ref="curdRef"
            :data="waitData"
            :option="option"
            :page.sync="pager"
            :table-loading="loading"
            @size-change="sizeChange"
            @current-change="currentChange"
          >
            <template slot="menuLeft">
              <div class="fonts-color">
                <span
                  >今日您有
                  <span>{{ waitTotal }}</span> 条待办跟进事项/客户</span
                >
              </div>
            </template>
            <template slot="menuRight">
              <slot name="menuRight"></slot>
            </template>

            <template slot="companyName" slot-scope="scope">
              <span>{{ scope.row.companyName }}</span>
              <el-tag
                v-if="scope.row.type"
                size="mini"
                style="margin-left: 8px"
                type="danger"
                >{{
                  formatterFn(commonData.businessTypeList, scope.row.type)
                }}</el-tag
              >
            </template>
            <template slot="nextFollowUpTime" slot-scope="scope">
              <span v-if="scope.row.isFollowUp == 0">{{
                scope.row.nextFollowUpTime
              }}</span>
              <el-tag v-else>已跟进</el-tag>
            </template>

            <template #menu="{ type, size, row, index }">
              <el-button
                :size="size"
                :type="type"
                @click="handleOperate('follow', row, index)"
                >跟进</el-button
              >
              <el-button
                :size="size"
                :type="type"
                @click="handleOperate('marker', row, index)"
                >标记重点</el-button
              >
              <el-button
                v-if="!row.type || [1, 3, 5].includes(row.type)"
                :size="size"
                :type="type"
                @click="handleOperate('transfer', row, index)"
                >{{
                  !row.type
                    ? "转为线索"
                    : row.type === 3
                    ? "转为订单"
                    : "转为商机"
                }}</el-button
              >
            </template>
          </avue-crud>
        </div>
      </div>
    </el-card>
    <transition name="el-zoom-in-right">
      <el-card class="dealCard-body" v-if="showCard">
        <div slot="header" class="clearfix">
          <div class="header-container flex flex-acenter">
            <span class="header-card--title"> 重点跟进事项/客户</span>
          </div>
        </div>
        <CarouselCard
          :data="followWithEmphasis"
          autoplay
          :num="6"
          @operate="carouselOperate"
        />
      </el-card>
    </transition>

    <!-- 新增待办 -->

    <followUpDialog
      ref="followUpRef"
      :followUpType="followUpType"
      :formType="waitFormType"
      :isShowType="true"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import vCalendar from "v-calendar"; // 引入日历插件
import CarouselCard from "@/views/components/homeComponents/CarouselCard";

import followUpDialog from "@/views/core/components/followUp.vue";

import {
  calendarFollowUpData,
  homePageList,
  importantFollowUp,
  followUpGetInfo,
  followUpAnnex,
} from "@/api/index";
import { updateFollowUp } from "@/api/core/followUp";

import { followUpMinixs } from "@/mixins/followUp.js";

import { formatterCallback } from "@/utils/common";
import { formatDate_1 } from "@/utils";

import { mapState } from "vuex";

export default {
  name: "Backlog",
  components: {
    vCalendar,
    CarouselCard,

    followUpDialog,
  },
  mixins: [followUpMinixs],
  props: {
    isUserRole: Boolean,
    userMap: Array,
    userProp: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
        };
      },
    },
    // 选中人员的代办id
    activeWait: String | Number,
    deptOptions: Array,
    waitDeptId: String | Number,
  },
  data() {
    return {
      loading: false,
      // 日历数据
      attrs: [
        {
          key: "today",
          dates: new Date(),
          highlight: {
            color: "#2a6ef68e",
            fillMode: "outline",

            style: {
              color: "#2a6ef68e",
              borderRadius: "8px",
            },
          },
        },
      ],

      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menuWidth: 180,

        height: 531,

        maxHeight: 650, //表格最大高度
        stripe: true,

        headerAlign: "center",
        align: "center",
        column: [
          { label: "事项事由", prop: "title" },
          { label: "关联业务", prop: "companyName", slot: true },
          { label: "跟进人", prop: "userName", width: 90, align: "center" },
          { label: "跟进情况", prop: "content" },
          { label: "跟进结果", prop: "result" },
          { label: "待跟进时间", prop: "nextFollowUpTime", width: 90 },
        ],
      },
      pager: {
        total: 8,
        currentPage: 1,
        pagerCount: 5,
        pageSize: 10,
      },
      waitData: [],

      // 当前选中日期的代办
      activeNames: "",

      // 重点跟进
      followWithEmphasis: [],
      showCard: false,

      // 表单操作类型
      waitFormType: "add",

      queryParams: {},
      nowDateStr: "",

      // 上传
      // 上传文件信息存储
      uploadObj: {},

      // 代办条数
      waitTotal: 0,
      // 团体代表部门id
      deptId: this.waitDeptId,

      followedId: "",
      followUpType: null,

      clickedDate: null,
    };
  },
  methods: {
    // 移动日历
    moveCalendar(val, flag = false) {
      this.$nextTick(async () => {
        if (flag) {
          // 根据正负移动月份
          await this.$refs.calendar.moveBy(val);
        } else {
          // 根据 { month: 1, year: 1983 } 或者 date
          await this.$refs.calendar.move(val);
        }
      });
    },

    customTitle(title) {
      this.nowDateStr = title;
      return title.replace("-", "年") + "月";
    },
    isClicked(date) {
      return this.clickedDate === date; // 判断是否为点击的日期
    },
    // 点击日历
    onDayClick(day) {
      this.clickedDate = day.id;
      this.waitTotal =
        day.attributes && day.attributes.length && day.attributes[0].customData;
      this.queryParams.nextFollowUpTime = formatDate_1(new Date(day.date));
      this.pager.currentPage = 1;

      this.getHomePageList();
    },

    formatterFn(arr, val) {
      return formatterCallback(arr, val);
    },

    // 点击代办人员
    clickUser(userId) {
      if (this.activeWait !== userId) {
        // 替换人员

        this.$emit("update:activeWait", userId);
      }
    },

    // 团体代表
    handleNodeClick(node) {
      this.deptId = node.id;
      this.$emit("update:activeWait", "");
      this.$emit("dept", node.id);

      this.$nextTick(() => {
        this.getHomePageList();
        this.getImportantFollowUp();
        this.getCalendarFollowUpData();
      });
    },

    // 新增待办
    addWait() {
      // 新增清空上传
      this.followUpType = null;
      let form = {
        type: "",
        userName: this.user.name,
        isHeavyPoint: 0,
        id: null,
        status: null,
        followUpCategory: 1,
        isEndFollowUp: 0,
      };

      this.waitFormType = "add";

      this.$nextTick(() => {
        this.$refs.followUpRef.show(form);
      });
    },

    // 成功回调
    handleSuccess(type, msg, hide) {
      this.$modal.msgSuccess(msg);
      this.getHomePageList();
      this.getImportantFollowUp();
      this.getCalendarFollowUpData();
      hide();
    },

    // 获取跟进详情
    getFollowUpInfo(id) {
      followUpGetInfo(id).then((res) => {
        if (res.code == 200) {
          this.followUpType = res.data.type;

          let form = {
            ...res.data,
            followUpMethod: +res.data.followUpMethod,
            followUpCategory: 1,
          };
          console.log(form, "form");

          this.$nextTick(() => {
            this.$refs.followUpRef.show(form);
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 标记重点接口调用
    updateImportStatus(row, isHeavyPoint) {
      let msg = "已标记为重点";
      if (isHeavyPoint == 1) {
        msg = "已标记";
      } else {
        msg = "已取消标记";
      }
      let sendData = {
        id: row.id,
        isHeavyPoint: isHeavyPoint,
      };
      updateFollowUp(sendData).then((res) => {
        if (res.code === 200) {
          this.getImportantFollowUp();
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 表格操作
    handleOperate(type, row, index) {
      if (type === "follow") {
        // 跟进
        this.waitFormType = "add";
        this.getFollowUpInfo(row.id);
      } else if (type === "marker") {
        // 标记

        this.updateImportStatus(row, 1);
      } else if (type === "transfer") {
        // 转换
        if (!row.type) {
          // 转为线索
          this.$router.push({
            name: "Clue/add",
            query: { type: 0, followUpId: row.id },
          });
        } else {
          let type = 2;
          let name = "Opportunity/add";
          let query = {
            companyName: row.companyName,
            userId: row.userId,
            id: row.followedId,
          };
          if (row.type == 5) {
            // 客户转线索
            name = "Opportunity/add";
            type = 0;
          } else if (row.type == 1) {
            // 线索转商机
            type = 2;
            name = "Opportunity/add";
            query.archiveId = row.archiveId;
          } else if (row.type == 3) {
            // 商机转订单
            name = "Order/add";

            type = 2;
          }

          this.$router.push({
            name: name,
            query: { type, form: JSON.stringify(query) },
          });
        }
      }
    },
    // 轮播卡片按钮操作
    carouselOperate(type, row, index) {
      if (type === "follow") {
        // 跟进
        this.waitFormType = "edit";
        this.getFollowUpInfo(row.id);
      } else if (type === "remove") {
        // 移除,取消标记

        this.updateImportStatus(row, 0);
      }
    },

    // 获取日历数据
    getCalendarFollowUpData() {
      this.attrs = [
        {
          key: "today",
          dates: new Date(),
          highlight: {
            color: "#2a6ef68e",
            fillMode: "outline",

            style: {
              color: "#3182ce",
              borderRadius: "8px",
            },
          },
        },
      ];
      let sendParams = {
        yearMonth: this.nowDateStr,
        userId: this.activeWait,
        deptId: this.deptId,
      };

      calendarFollowUpData(sendParams).then((res) => {
        let nowDate = formatDate_1(new Date());

        let row = this.attrs.find((item) => item.key === "today");
        row.customData = 0;
        for (const key in res.data) {
          if (key == nowDate) {
            // 今天

            row.customData = res.data[key];
            this.waitTotal = res.data[key];
          } else {
            let obj = {
              key: key,
              dates: new Date(key),
              customData: res.data[key],
            };
            if (key == this.queryParams.nextFollowUpTime) {
              this.clickedDate = key;
            }
            this.attrs.push(obj);
          }
        }
        console.log(this.attrs);
      });
    },
    sizeChange(val) {
      this.pager.currentPage = 1;
      this.pager.pageSize = val;
      this.getHomePageList();
    },
    currentChange(val) {
      this.pager.currentPage = val;
      this.getHomePageList();
    },

    // 获取首页跟进事项
    getHomePageList() {
      const { currentPage, pageSize } = this.pager;

      this.loading = true;
      let sendParams = {
        userId: this.activeWait,
        deptId: this.deptId,
        nextFollowUpTime: this.queryParams.nextFollowUpTime,
        pageNum: currentPage,
        pageSize,
      };

      homePageList(sendParams)
        .then((res) => {
          this.waitData = res.rows;
          this.pager.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 重点跟进
    getImportantFollowUp() {
      let sendParams = {
        userId: this.activeWait,
        deptId: this.deptId,
      };
      importantFollowUp(sendParams).then((res) => {
        this.followWithEmphasis = res.rows;
      });
    },

    // 改变窗口大小
    // onResize() {
    //   let timer;

    //   window.addEventListener("resize", () => {
    //     timer && clearTimeout(timer);
    //     timer = setTimeout(() => {
    //       this.showCard = window.innerWidth > 1600;
    //     }, 500);
    //   });
    // },
  },

  mounted() {
    // this.showCard = window.innerWidth > 1600 ? true : false;
    this.queryParams.nextFollowUpTime = formatDate_1(new Date());
    // this.onResize();

    // this.getHomePageList();
    // this.getImportantFollowUp();
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    showCard() {
      this.$refs.curdRef.refreshTable();
    },
    nowDateStr() {
      this.getCalendarFollowUpData();
    },

    activeWait: {
      handler(newVal) {
        if (!newVal) return;
        this.$nextTick(() => {
          this.getImportantFollowUp();
          this.getCalendarFollowUpData();
          this.getHomePageList();
        });
      },
      immediate: true,
    },
    waitDeptId(newVal) {
      console.log({ newVal });
      this.deptId = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/flex.scss";
.backlog {
  font-size: 16px; //0.0625
  display: grid;

  column-gap: 15px;
  margin-top: 15px;
}
.show_style {
  grid-template-columns: 1fr 25em;
  .waitWork {
    width: 500px !important;
  }
}
.header-container {
  .header-card--title {
    font-size: 16px;
    font-weight: 700;
    color: #2a6ff6;
  }
}

.card-content {
  display: flex;
  justify-content: space-between;
  .waitWork {
    flex: 1;
    width: calc(100vw - 542px);
    margin-left: 10px;
  }
}

.fonts-color {
  font-size: 12px;
  color: rgb(42, 111, 246);
}

::v-deep .avue-crud__header {
  padding: 0 15px;
  align-items: center;
}

.vc-day {
  position: relative;
  .vc-day-content {
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .v-custom-dot {
    position: absolute;
    top: -3px;
    right: 0;
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 50%;
    background: red;
    color: #fff;
    font-size: 12px;
    text-align: center;
  }
  .clicked-date {
    border-radius: 10px;

    background: #3182ce;
    color: #fff;
  }
}

.calendar-wait {
  margin-top: 15px;
  .calendar-wait-box {
    height: 50px;
    line-height: 48px;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
  }

  .activeWait {
    border-right: 3px solid #409eff;
    color: #333;
    background: #f5f5f5;
  }
}

.dealCard-body {
  width: 400px;
  ::v-deep .el-card__body {
    padding: 0;
  }
}

.icon-style {
  font-size: 16px;
  vertical-align: middle;
  display: inline-block;
  padding-left: 15px;
  cursor: pointer;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0;
}
</style>
