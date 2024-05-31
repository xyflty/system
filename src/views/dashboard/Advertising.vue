<template>
  <!-- 浮层 -->
  <div>
    <!-- <canvas id="canvans"></canvas> -->
    <div
      ref="picture"
      class="ad-box"
      v-show="show"
      @mousewheel.prevent="() => false"
    >
      <div v-if="type == 1" class="ad-box-div">
        <div v-if="showNowDeptid == false" class="box1 ranking_box">
          <div class="ranking_box__content">
            <div class="dept_ranking">
              <div class="card_type">
                <span class="card_header--line"></span>
                <span class="card_header--title">部门排名</span>
              </div>
              <div class="card-box">
                <div class="card_table--header member-grid">
                  <span>排名</span>
                  <span>部门</span>
                  <span>月份</span>
                  <span>完成率</span>
                </div>
                <template v-for="(child, index) in nDeptList.fixedDept">
                  <div class="member-box" :key="index">
                    <div class="card_table--content member-grid">
                      <span>{{ index + 1 }}</span>
                      <span>{{ child.deptName }}</span>
                      <span>{{ mouthStr }}</span>
                      <span class="completion">
                        {{ child.dealPriceCompletionRate }} %</span
                      >
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <div class="team_ranking">
              <div class="card_type">
                <span class="card_header--line"></span>
                <span class="card_header--title">队伍排名</span>
              </div>
              <div class="card-box">
                <div class="card_table--header member-grid">
                  <span>排名</span>
                  <span>部门</span>
                  <span>月份</span>
                  <span>完成率</span>
                </div>
                <template v-for="(child, index) in nDeptList.fixedTeam">
                  <div class="member-box" :key="index">
                    <div class="card_table--content member-grid">
                      <span>{{ index + 1 }}</span>
                      <span>{{ child.deptName }}</span>
                      <span>{{ mouthStr }}</span>
                      <span class="completion">
                        {{ child.dealPriceCompletionRate }} %</span
                      >
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="box3">
          <div class="scrollbar">
            <el-scrollbar ref="scrollbar">
              <div
                class="record"
                v-for="(item, index) in detail.wallOfHonor"
                :key="index"
              >
                <div class="record_l">{{ item.teamName }}</div>
                <div class="record_r">
                  {{ item.salesman }} {{ item.date }} {{ item.copyWriting }}
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>

        <div v-if="showNowDeptid == true" class="box12">
          <el-carousel height="200px" direction="vertical" autoplay>
            <el-carousel-item
              v-for="(key, i) in expectedToAdvanceList"
              :key="i"
            >
              <div class="name-user">{{ key }}</div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-if="showNowDeptid == true" class="box2">
          <div class="team">
            {{
              detail.excellentTeamName != undefined
                ? detail.excellentTeamName
                : ""
            }}
          </div>
        </div>

        <div v-if="showNowDeptid == false" class="box4">
          <div class="box4_l">
            {{ detail.redListStaff != undefined ? detail.redListStaff : "" }}
          </div>
          <div class="box4_m">
            {{
              detail.evergreenAwardListStaff != undefined
                ? detail.evergreenAwardListStaff
                : ""
            }}
          </div>
          <div class="box4_r">
            {{
              detail.blackListStaff != undefined ? detail.blackListStaff : ""
            }}
          </div>
        </div>

        <div v-if="showNowDeptid == true" class="box42">
          <div class="box4_l">
            {{ detail.redListStaff != undefined ? detail.redListStaff : "" }}
          </div>
          <div class="box4_m">
            {{
              detail.evergreenAwardListStaff != undefined
                ? detail.evergreenAwardListStaff
                : ""
            }}
          </div>
          <div class="box4_r">
            {{
              detail.blackListStaff != undefined ? detail.blackListStaff : ""
            }}
          </div>
        </div>
        <img
          class="ad-box-close-icon2"
          @click="close"
          src="https://zhongweijob.oss-cn-hangzhou.aliyuncs.com/static/index_close_icon.png"
        />

        <!-- <i
        @click="type = type == 1 ? 2 : 1"
        class="el-icon-refresh ad-box-close-icon3"
      ></i> -->

        <img
          class="ad-box-ad_right"
          @click="type = type == 1 ? 2 : 1"
          src="@/assets/images/ad_right.png"
        />
      </div>

      <div v-if="type == 2" class="ad-box-div">
        <div class="box1 box6" style="padding: 88px 20px">
          <el-carousel height="200px" direction="vertical" autoplay>
            <el-carousel-item
              v-for="(item, index) in targetUndoneList"
              :key="index"
              style="padding-right: 10px"
            >
              <div
                style="margin-bottom: 10px"
                v-for="(val, index) in item"
                :key="index"
              >
                <span class="span_3">{{ val.userName }}</span>
                <span class="span_4">{{ val.text }}</span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <img
          class="ad-box-close-icon2 po_2"
          @click="close"
          src="https://zhongweijob.oss-cn-hangzhou.aliyuncs.com/static/index_close_icon.png"
        />

        <!-- <i
        @click="type = type == 1 ? 2 : 1"
        class="el-icon-refresh ad-box-close-icon3 po_3"
      ></i> -->
        <img
          class="ad-box-ad_left"
          @click="type = type == 1 ? 2 : 1"
          src="@/assets/images/ad_left.png"
        />
      </div>

      <img
        v-if="type == 1"
        class="ad-box-footer"
        src="@/assets/images/adv/bg5.png"
      />
    </div>
    <!-- <img :src="dataURL" alt=""   crossOrigin="anonymous" /> -->
    <el-dialog
      custom-class="tilte-announcement"
      title="系统公告"
      top="0vh"
      :visible.sync="dialogVisible"
      width="50%"
      center
      :show-close="false"
      v-dialogDragWidth
      v-dialogDragHeight
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <!-- <template slot="title">
        <div class="title">
          <div>系统公告</div>
          <div @click="fullscreen = !fullscreen">放大</div>
        </div>
      </template> -->

      <h1 class="noticeTitle">{{ adInfo ? adInfo.noticeTitle : "" }}</h1>
      <div v-html="adInfo ? adInfo.noticeContent : ''"></div>

      <div
        class="attach"
        v-if="adInfo && adInfo.ossList && adInfo.ossList.length"
      >
        <el-divider>附件列表</el-divider>
        <div
          class="attach_item"
          v-for="(item, index) in adInfo.ossList"
          :key="index"
          @click="handleDownload(item)"
        >
          <div class="name">{{ item.originalName }}</div>
          <div class="btn">下载</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >我已知晓！</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAdvertising, noticeDetails } from "@/api/ad/index";
import html2canvas from "html2canvas";
import { mapState } from "vuex";

export default {
  data() {
    return {
      firstShow: true,
      show: false,
      detail: "",
      nDeptList: [],
      targetUndoneList: [],
      expectedToAdvanceList: [],
      type: 1,

      adInfo: "",
      dialogVisible: false,
      fullscreen: false,
      nowDeptid: "", // 用于判断进来是哪个部门
      showNowDeptid: false, // 判断 为true是第一集团军 为false是第二集团军和其他
      dataURL: "", // 保持截屏操作后的base64数据地址

      top: 0,
    };
  },
  mounted() {
    this.firstShow = this.$store.state.app.firstShow;
    this.getAdInfo();
    this.noticeDetails();

    this.nowDeptid = this.user.deptId;

    if (this.nowDeptid == 1580402169644216321) {
      this.showNowDeptid = true;
    } else {
      this.showNowDeptid = false;
    }
    this.$bus.$on("brotherEvent", (res) => {
      this.dialogVisible = true;
    });
    this.getImg();

    this.removeElScrollbarListener();
    this.addElScrollbarListener();
  },
  computed: {
    ...mapState("commonData", {
      targetCategoryList: (state) => state.commonData.targetCategoryList,
    }),
    ...mapState(["user"]),

    mouthStr() {
      let nowDate = new Date();
      let arr = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ];

      return arr[nowDate.getMonth()];
    },
  },

  methods: {
    getImg() {},
    handleDownload(val) {
      this.getBlob(val.url).then((blob) => {
        this.saveAs(blob, val.originalName);
      });
    },
    getBlob(url) {
      return new Promise((resolve) => {
        const XML = new XMLHttpRequest();
        XML.open("GET", url, true);
        XML.responseType = "blob";
        XML.onload = () => {
          if (XML.status === 200) {
            resolve(XML.response);
          }
        };
        XML.send();
      });
    },
    //下载文件
    saveAs(blob, filename) {
      const elelink = document.createElement("a");
      elelink.style.display = "none";
      elelink.download = filename;
      elelink.href = window.URL.createObjectURL(blob);
      document.body.appendChild(elelink);
      elelink.click();
      document.body.removeChild(elelink);
    },

    noticeDetails() {
      noticeDetails().then((res) => {
        this.adInfo = res.data;
      });
    },
    close() {
      this.show = false;
      this.dialogVisible = true;
    },
    getTextStr(item) {
      let strArr = [
        "monthOne",
        "monthTwo",
        "monthThree",
        "monthFour",
        "monthFive",
        "monthSix",
        "monthSeven",
        "monthEight",
        "monthNine",
        "monthTen",
        "monthEleven",
        "monthTwelve",
      ];
      let month = 0;
      let value = 0;
      strArr.some((val, index) => {
        if (item[val]) {
          month = index;
          value = item[val];
          return true;
        }
      });

      return {
        month,
        value,
      };
    },
    getNewArray(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    // 获取信息
    getAdInfo() {
      getAdvertising().then((res) => {
        this.detail = res.data;
        this.initnDeptList();
        this.inittargetUndoneList();
        res.data != null && this.firstShow && (this.show = true);
        this.$store.dispatch("app/changefirstShowAd", false);

        if (this.showNowDeptid == true) {
          this.expectedToAdvanceList = this.detail.expectedToAdvanceList;
        }
      });
    },

    inittargetUndoneList() {
      this.targetUndoneList = [];
      let newArray = [];
      this.detail.targetUndoneList.forEach((item, index) => {
        newArray.push({
          ...item,
          text:
            item.continuousDayUndoneCount == 1
              ? `昨日未完成新增线索数量${item.targetUndoneCount}条`
              : `连续${item.continuousDayUndoneCount}日未完成新增线索数量${item.targetUndoneCount}条`,
        });

        this.targetUndoneList = this.getNewArray(newArray, 3);
      });
    },
    initnDeptList() {
      this.nDeptList =
        (this.detail.teamRankList && this.detail.teamRankList) || {};

      // this.detail.departmentPerformance.forEach((item, index) => {
      //   let fdIndex = this.nDeptList.findIndex(
      //     (val) => val.deptName == item.deptName
      //   );

      //   if (fdIndex != -1) {
      //     this.nDeptList.push({
      //       deptName: item.deptName,
      //       month: item.timeTypeValue,
      //       clueTarget: item.clueTarget,
      //       priceTarget: item.priceTarget,
      //     });
      //   } else {
      //     this.nDeptList.push({
      //       deptName: item.deptName,
      //       month: item.timeTypeValue,
      //       clueTarget: item.clueTarget,
      //       priceTarget: item.priceTarget,
      //     });
      //   }
      // });
    },

    // 添加监听
    addElScrollbarListener() {
      this.$refs["scrollbar"].wrap.addEventListener(
        "mouseenter",
        this.handlerScrollEnter
      );
      this.$refs["scrollbar"].wrap.addEventListener(
        "mouseleave",
        this.handlerScrollLeave
      );
    },
    // 移除监听
    removeElScrollbarListener() {
      this.$refs["scrollbar"].wrap.removeEventListener(
        "mouseenter",
        this.handlerScrollEnter
      );
      this.$refs["scrollbar"].wrap.removeEventListener(
        "mouseleave",
        this.handlerScrollLeave
      );
    },
    // 处理滚动
    handlerScroller(e) {
      if (e.wheelDelta > 0) {
        if (top < 0) {
          return;
        } else {
          this.top -= 10;
          this.$refs["scrollbar"].wrap.scrollTop = this.top;
        }
      } else {
        this.top += 10;
        this.$refs["scrollbar"].wrap.scrollTop = this.top;
      }
    },
    // 处理添加滚动函数
    handlerScrollEnter() {
      this.$refs["scrollbar"].wrap.addEventListener(
        "mousewheel",
        this.handlerScroller
      );
    },
    //
    handlerScrollLeave() {
      this.top = 0;
      // 移除滚轮事件
      this.$refs["scrollbar"].wrap.removeEventListener(
        "mousewheel",
        this.handlerScroller
      );
    },
  },
};
</script>

<style scoped lang="scss">
/* 设置背景遮罩层样式 */
// @import "@/assets/styles/dialog.scss";

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  // left: 50%;
  transform: translate(0, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.ad-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
  overflow: auto;
}

.ad-box-div {
  display: flex;
  align-items: flex-end;
  position: relative;
  width: 90%;
  height: 450px;
  margin-top: 120px;

  .box1,
  .box12,
  .box2,
  .box3,
  .box4,
  .box42 {
    flex: 1;
    max-width: 260px;
    min-width: 240px;
    height: 100%;
    background: #fff;
    border-radius: 20px;
    position: relative;
    margin: 0 10px;
  }

  .box1 {
    max-width: 260px;
    min-width: 240px;
    background: url("~@/assets/images/adv/bg1.png") no-repeat;
    background-size: 100% 100%;
    padding: 88px 24px 20px;

    .goad {
      margin-top: 10px;
    }
  }

  .box12 {
    flex: 1;
    max-width: 300px;
    min-width: 240px;
    background: url("~@/assets/images/adv/bg1.2.png") no-repeat;
    background-size: 100% 100%;
    padding: 88px 36px;

    // color: rgb(139, 139, 139);
    .name-user {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      word-break: keep-all;
      font-size: 18px;
      line-height: 22px;

      // font-weight: 600;
    }

    .goad {
      margin-top: 10px;
    }
  }

  .box2 {
    flex: 1;
    max-width: 300px;
    min-width: 240px;
    background: url("~@/assets/images/adv/bg2.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .team {
      font-size: 40px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #fd9704;
      line-height: 47px;
    }
  }

  .box3 {
    flex: 1;
    max-width: 300px;
    height: 560px;
    min-width: 240px;
    background: url("~@/assets/images/adv/bg3.png") no-repeat;
    background-size: 100% 100%;
    padding: 88px 24px;
    padding-top: 170px;
    // overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .record {
      color: #fff;
      margin-top: 15px;

      .record_l {
        font-size: 18px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        line-height: 21px;
      }

      .record_r {
        font-size: 16px;
        margin-top: 5px;
      }
    }
  }

  .box4 {
    flex: 3;
    min-width: 630px;
    max-width: 830px;
    height: 100%;
    background: url("~@/assets/images/adv/bg4.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;

    .box4_l,
    .box4_m,
    .box4_r {
      // flex: 1;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      word-break: keep-all;
      width: 180px;
      height: 350px;
      min-width: 160px;
      min-height: 400px;
      text-align: center;
      font-size: 42px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      line-height: 49px;
    }
  }

  .box42 {
    flex: 3;
    max-width: 830px;
    height: 100%;
    min-width: 630px;
    background: url("~@/assets/images/adv/bg4.2.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;

    .box4_l,
    .box4_m,
    .box4_r {
      // flex: 1;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      letter-spacing: 1px;
      word-break: keep-all;
      width: 180px;
      height: 350px;
      text-align: center;
      font-size: 42px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      line-height: 49px;
    }
  }

  .box6 {
    min-width: 200px;
    background: url("~@/assets/images/adv/bg6.png") no-repeat;
    background-size: 100% 100%;
  }
}

.ad-box-footer {
  width: 786px;
  height: 136px;
  margin-top: 30px;
}

.ad-box-close-icon2 {
  position: absolute;
  top: -70px;
  left: 52rem;
  width: 28px;
  height: 28px;
  margin-top: 15px;
  cursor: pointer;
}

.ad-box-ad_right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -80px;
  width: 80px;
  // height: 28px;
  margin-top: 40px;
  cursor: pointer;
}

.ad-box-ad_left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -100px;
  width: 80px;
  cursor: pointer;
}

.ad-box-close-icon3 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 60px;
  width: 28px;
  height: 28px;
  margin-top: 10px;
  color: #fde0b0;
  font-size: 38px;
  cursor: pointer;
}

.po_2 {
  top: -80px;
  right: 45%;
}

.po_3 {
  top: -80px;
  right: -30px;
}

.el-carousel__item h2 {
  font-size: 20px;
  line-height: 50px;
  margin: 0;

  .span_1 {
    margin-right: 10px;
    color: #333;
    font-weight: 600;
    display: inline-block;
    min-width: 50px;
  }

  .span_2 {
    font-size: 16px;
  }
}

.span_3 {
  color: #333;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  display: inline-block;
  min-width: 50px;
}

.span_4 {
  font-size: 16px;
  margin-left: 5px;
}

.el-carousel__item {
  background-color: #fffaf2;
  min-width: 100px;
  padding-left: 10px;
  padding-top: 15px;
}

::v-deep .el-carousel__button {
  background: #e6b066;
}

.option {
  line-height: 28px;
}

.tilte-announcement {
  top: 50%;
  transform: translateY(-50%);
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.noticeTitle {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.attach {
  margin: 20px auto;
}

.attach_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  background: #f5f7fa;
  border-radius: 5px;
  padding: 10px;
}

.attach_item .btn {
  color: #1890ff;
  cursor: pointer;
}

.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

@media screen and (max-width: 1750px) {
  .ad-box-div {
    margin-right: 80px;

    .ad-box-ad_right {
      margin-top: -5px;
      margin-right: -30px;
    }

    .box1 {
      flex: 1;
      width: 200px;
      font-size: 13px;

      .el-carousel--vertical {
        .el-carousel__indicators--vertical {
          background-color: #1890ff;
        }
      }

      h2 {
        margin-top: -20px;
        height: 70px;

        .span_1 {
          display: block;
          font-size: 18px;
          height: 30px;
        }

        .span_2 {
          display: block;
          margin: 0 0 0 2px;
          height: 10px;
        }
      }
    }

    .box12 {
      flex: 1;
      width: 200px;
      font-size: 13px;

      .name-user {
        font-size: 15px;

        // font-weight: 600;
      }

      h2 {
        margin-top: -20px;
        height: 70px;

        .span_1 {
          display: block;
          font-size: 18px;
          height: 30px;
        }

        .span_2 {
          display: block;
          margin: 0 0 0 2px;
          height: 10px;
        }
      }
    }

    .box2 {
      flex: 1;
      width: 200px;

      .team {
        margin-top: -80px;
        font-size: 32px;
      }
    }

    .box3 {
      flex: 1;
      margin-left: 20px;
      padding-top: 200px;
      padding-bottom: 0px;
      width: 200px;
      height: 580px;
      background-size: 100% 100%;
      background-position-y: 18px;

      .record {
        margin-top: 3px;

        .record_l {
          font-size: 16px;
        }

        .record_r {
          margin-top: 0;
          font-size: 14px;
          transform: scale(95%);
        }
      }
    }

    .box4 {
      flex: 3;
      width: 630px;
      font-size: 12px;

      .box4_l,
      .box4_m,
      .box4_r {
        margin-top: -80px;
        width: 140px;
        height: 400px;
        font-size: 32px;
        word-break: keep-all;
      }
    }

    .box42 {
      flex: 3;
      width: 630px;
      font-size: 12px;

      .box4_l,
      .box4_m,
      .box4_r {
        margin-top: -80px;
        width: 140px;
        height: 400px;
        font-size: 32px;
        word-break: keep-all;
      }
    }

    .box6 {
      // margin-top: 50px;
      margin-left: 110px;
      // width: 200px;
      background-size: 100% 100%;
      font-size: 13px;
      // background-color: #1890ff;
    }

    .ad-box-ad_left {
      margin-top: -50px;
      margin-left: 110px;
    }
  }
}
.scrollbar {
  height: 20rem;
}
::v-deep .el-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.ad-box-div .box1.ranking_box {
  text-align: center;

  min-width: 450px;
  max-width: 550px;
  height: 450px;

  padding: 0 15px;
  background: #fd9704;

  box-sizing: border-box;
  .ranking_box__content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 450px;
  }
}

.dept_ranking {
  .card_header--line {
    background: url("~@/assets/images/dept.png") no-repeat top center;
  }
  // .card_header--title {
  //   text-shadow: 0 0 3px #fff, 0 0 4px #fff, 0 0 5px #fff;
  // }
}

.team_ranking {
  .card_header--line {
    background: url("~@/assets/images/team.png") no-repeat top center;
  }
  // .card_header--title {
  //   text-shadow: 0 0 3px #fff, 0 0 4px #fff, 0 0 5px #fff;
  // }
}

.card_type {
  font-size: 30px;
  height: 30px;

  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  .card_header--line {
    display: inline-block;
    width: 25px;
    height: 25px;

    margin-right: 12px;

    background-size: 100% 100%;
  }
  .card_header--title {
    font-weight: 700;
  }
}

.card-box {
  position: relative;
  height: fit-content;
  padding: 15px 15px 5px;
  color: #fff;
  border-radius: 10px;
  margin: 0;
  transition: all 0.5s;
  overflow: hidden;
  box-sizing: content-box;

  .member-box {
    font-size: 14px;

    color: #fff;
    .card_table--content {
      padding-bottom: 10px;
      font-weight: 700;
    }
  }
  .card_table--header {
    font-size: 16px;
    margin-bottom: 15px;

    > span {
      font-weight: 700;
    }
  }
  .member-grid {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    text-align: center;
    > span {
      font-weight: 700;
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
}
</style>
