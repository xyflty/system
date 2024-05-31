<template>
  <ul accordion class="timeline-wrapper">
    <li
      class="timeline-item"
      :class="{ 'timeline-item__active': t.finishTime }"
      v-for="(t, i) in timeData"
      :key="t.id"
    >
      <div class="long-line" :style="`border-style:${lineType};`"></div>
      <div class="timeline-content">
        <div class="timeline-content__container" v-if="placement === 'top'">
          <div
            :class="
              titleMode === 'normal' ? 'out-circle__normal' : 'out-circle'
            "
          ></div>
          <div
            class="timeline-title"
            v-if="titleMode === 'special'"
            :class="{
              isBorder: isBorderBottom && timeData.length - 1 !== i,
            }"
          >
            <div class="title-container">
              <span>{{ t.name }}</span>
              <span v-if="t.moneyTag" class="moneyTag"
                >( {{ t.moneyTag }} )</span
              >
              <span v-if="mode === 'edit'" class="title-time">{{
                formatDateFun(t.finishTime)
              }}</span>
            </div>
            <div class="timeline-title__time">
              <span v-if="mode === 'show'">{{
                formatDateFun(t.finishTime)
              }}</span>
              <div class="btns" v-if="t.showButtonFlag && mode === 'edit'">
                <el-button
                  v-if="disabledBtns.confirmMoneyButton"
                  @click="handleClick('receipt', t)"
                  >收款确认</el-button
                >
                <template v-else>
                  <el-button
                    v-if="disabledBtns.startButton"
                    @click="handleClick('start', t)"
                    >开始节点作业</el-button
                  >
                  <el-button
                    v-if="disabledBtns.fillInfoButton"
                    @click="handleClick('job', t)"
                    >填入作业信息</el-button
                  >

                  <el-button
                    v-if="disabledBtns.launchMoneyButton"
                    @click="handleClick('money', t)"
                    >发起收款确认</el-button
                  >
                  <el-button
                    v-if="disabledBtns.orderJobInfoButton"
                    @click="handleClick('replenish', t)"
                    >工单信息补充</el-button
                  >
                  <el-button
                    v-if="disabledBtns.finishButton"
                    @click="handleClick('end', t)"
                    >节点作业完成</el-button
                  >
                </template>
              </div>
            </div>
          </div>
          <div v-if="titleMode === 'normal'" class="timeline-title__normal">
            <span>{{ t.name }}</span>
            <span>{{ formatDateFun(t.finishTime) }}</span>
          </div>
        </div>
        <el-collapse-transition>
          <div
            class="timeline-desc"
            v-show="activeNames.includes(t.name) || titleMode !== 'special'"
            :aria-hidden="
              !activeNames.includes(t.name) && titleMode === 'special'
            "
          >
            <div v-if="t.secondNodeList && t.secondNodeList.length">
              <TimeLine
                :timelineList="t.secondNodeList"
                lineType="dashed"
                :isBorderBottom="false"
                titleMode="normal"
                placement="top"
                reverse
                @preview="handlePreview"
              >
              </TimeLine>
            </div>
            <div v-else>
              <slot v-if="$scopedSlots['default']" :row="t"></slot>
              <div v-else class="content-card">
                <div v-if="t.cardFlag">
                  <div v-if="t.nodeCardVo.manualFlag">
                    <p class="name">
                      <span>作业信息：</span>{{ t.nodeCardVo.content }}
                    </p>
                    <p v-if="t.nodeCardVo.imgUrl">
                      <span>图片：</span>
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="t.nodeCardVo.imgUrl"
                        fit="fit"
                        :preview-src-list="[t.nodeCardVo.imgUrl]"
                      ></el-image>
                    </p>

                    <p class="certificate" v-if="t.nodeCardVo.fileUrl">
                      <span> 附件：</span
                      ><i
                        class="certificate-name"
                        @click="handleCertificate(t.nodeCardVo)"
                        >{{ t.nodeCardVo.fileName || "--" }}</i
                      >
                    </p>
                  </div>
                  <div v-else>
                    <p
                      v-for="(ele, cIndex) in t.nodeCardVo.content.split('\n')"
                      :key="cIndex"
                      class="name"
                    >
                      {{ ele }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>

        <div
          v-if="placement === 'bottom'"
          class="timeline-content__container"
          :aria-expanded="activeNames.includes(t.name)"
        >
          <div
            :class="
              titleMode === 'normal' ? 'out-circle__normal' : 'out-circle'
            "
          ></div>
          <div
            :class="{
              isBorder: isBorderBottom && timeData.length - 1 !== i,
            }"
          ></div>
          <div
            class="timeline-title"
            v-if="titleMode === 'special'"
            @click="handleShow(t)"
          >
            <div class="title-container">
              <span>{{ t.name }}</span>
              <span v-if="t.moneyTag" class="moneyTag"
                >( {{ t.moneyTag }} )</span
              >
              <span v-if="mode === 'edit'" class="title-time">{{
                formatDateFun(t.finishTime)
              }}</span>
            </div>
            <div class="timeline-title__time">
              <div style="display: flex; align-items: center">
                <span v-if="mode === 'show'">{{
                  formatDateFun(t.finishTime)
                }}</span>
                <div class="btns" v-if="t.showButtonFlag && mode === 'edit'">
                  <el-button
                    v-if="disabledBtns.confirmMoneyButton"
                    @click.stop="handleClick('receipt', t)"
                    >收款确认</el-button
                  >
                  <template v-else>
                    <el-button
                      v-if="disabledBtns.startButton"
                      @click.stop="handleClick('start', t)"
                      >开始节点作业</el-button
                    >
                    <el-button
                      v-if="disabledBtns.fillInfoButton"
                      @click.stop="handleClick('job', t)"
                      >填入作业信息</el-button
                    >
                    <el-button
                      v-if="disabledBtns.launchMoneyButton"
                      @click.stop="handleClick('money', t)"
                      >发起收款确认</el-button
                    >
                    <el-button
                      v-if="disabledBtns.orderJobInfoButton"
                      @click.stop="handleClick('replenish', t)"
                      >工单信息补充</el-button
                    >
                    <el-button
                      v-if="disabledBtns.finishButton"
                      @click.stop="handleClick('end', t)"
                      >节点作业完成</el-button
                    >
                  </template>
                </div>
                <div style="padding: 0 10px">
                  <i
                    class="el-icon-arrow-down"
                    v-if="!activeNames.includes(t.name)"
                  ></i>
                  <i
                    class="el-icon-arrow-up"
                    v-if="activeNames.includes(t.name)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div v-if="titleMode === 'normal'" class="timeline-title__normal">
            <span>{{ t.name }}</span>
            <span>{{ formatDateFun(t.finishTime) }}</span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { formatDate } from "@/utils";
export default {
  name: "TimeLine",
  props: {
    timelineList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    disabledBtns: {
      type: Object,
    },
    lineType: {
      type: String,
      default: "solid",
    },
    isBorderBottom: {
      type: Boolean,
      default: true,
    },
    titleMode: {
      type: String,
      default: "special", //special || normal
    },
    // 展示模式
    mode: {
      type: "edit" | "show",
      default: "show",
    },
    placement: {
      type: String,
      default: "bottom",
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeNames: [].concat(this.value),
    };
  },
  mounted() {},
  methods: {
    formatDateFun(val) {
      return formatDate(val);
    },
    handleClick(type, row) {
      this.$emit("click", { type: type, row: row });
    },
    setActiveNames(activeNames) {
      activeNames = [].concat(activeNames);
      // let value = this.accordion ? activeNames[0] : activeNames;
      this.activeNames = activeNames;
    },
    handleShow(item) {
      let activeNames = this.activeNames.slice(0);
      let index = activeNames.indexOf(item.name);
      if (index > -1) {
        activeNames.splice(index, 1);
      } else {
        activeNames.push(item.name);
      }
      this.setActiveNames(activeNames);
    },
    handleCertificate(row) {
      this.$emit("preview", row);
    },
    handlePreview(row) {
      this.$emit("preview", row);
    },
  },
  computed: {
    timeData() {
      if (this.reverse) {
        return this.timelineList.reverse();
      } else {
        return this.timelineList;
      }
    },

    isActive() {
      return this.activeNames.includes();
    },
  },
  watch: {
    value(value) {
      this.activeNames = [].concat(value);
    },
  },
};
</script>

<style scoped lang="scss">
.timeline-wrapper {
  list-style: none;
  margin: 0;
  padding: 0;
  padding: 15px 30px;
  background: #fff;

  .timeline-item.timeline-item__active {
    > .long-line {
      border-color: #0079fe;
    }
    > .timeline-content {
      .timeline-title {
        border-color: #0079fe;
        .title-container {
          span {
            &:first-child {
              background: #0079fe;
              &::before {
                border-right-color: #0079fe;
              }
            }
          }
        }
      }
      > .timeline-content__container {
        > .out-circle {
          background: #0079fe;
        }
        .isBorder {
          border-color: #0079fe;
        }
        > .out-circle__normal {
          background: #0079fe;
        }
        > .timeline-title__normal {
          span {
            &:first-child {
              color: #0079fe;
            }
          }
        }
      }
    }
  }
}

/* 时间线 */
.timeline-item {
  position: relative;
  display: flex;
  .timeline-content__container {
    position: relative;
    .out-circle {
      position: absolute;
      left: -7px;
      top: 29px;
      // transform: translateX(-50%);
      width: 14px;
      height: 14px;
      background: #d7d7d7;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      /*opacity: 0.1;*/
      border-radius: 50%;
      z-index: 2;
    }
    .out-circle__normal {
      position: absolute;
      left: -7px;
      top: 9px;
      // transform: translateX(-50%);
      width: 14px;
      height: 14px;
      background: #d7d7d7;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      /*opacity: 0.1;*/
      border-radius: 50%;
      z-index: 2;
      &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 7px;
        height: 7px;
        background: #fff;
        /*opacity: 0.1;*/
        border-radius: 50%;
        z-index: 3;
      }
    }
  }

  .timeline-box {
    text-align: center;
    position: absolute;
    height: 100%;
  }

  .timeline-content {
    flex: 1;
    box-sizing: border-box;

    .timeline-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 20px 30px;
      font-size: 16px;
      .title-container {
        display: flex;
        align-items: center;
        span {
          position: relative;
          &:first-child {
            padding: 0 10px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            color: #fff;
            background: #d7d7d7;
            &::before {
              content: "";
              position: absolute;
              left: -32px;
              top: 0;
              border-right: 16px solid #d7d7d7;
              border-top: 16px solid transparent;
              border-bottom: 16px solid transparent;
              border-left: 16px solid transparent;
            }
          }
        }
        .title-time {
          color: #999;
          font-size: 14px;
          margin-left: 10px;
        }
        .moneyTag {
          color: #d9001b;
          padding: 0 15px;
          font-size: 14px;
        }
      }
      .timeline-title__time {
        span {
          color: #999;
        }
      }
    }
    .timeline-title__normal {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 30px;
      color: #999;
      span {
        height: 32px;
        line-height: 32px;
        &:first-child {
          color: #999;
          margin-right: 10px;
          font-weight: 600;
        }
      }
    }
    .isBorder {
      border-bottom: 2px dashed #d7d7d7;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
    .timeline-desc {
      padding-left: 30px;
      .content-card {
        background: rgba(247, 251, 254, 1);
        border-color: rgba(215, 232, 244, 1);
        font-size: 13px;
        color: #999;
        margin: 10px 0;
        > div {
          p {
            display: flex;
            align-items: center;

            padding: 15px 20px;
            span {
              flex: 0 0 80px;
              font-size: 14px;
              font-weight: 600;
              color: #666;
              text-align: right;
              padding-right: 10px;
            }
          }
        }
        .name {
          font-size: 14px;
          color: #666;
        }
        .certificate-name {
          font-style: normal;
          cursor: pointer;
        }
      }
    }
  }
  .long-line {
    height: 100%;
    border-left: 2px solid #d7d7d7;
    position: absolute;
    left: -1px;
    top: 9px;
    // transform: translateX(-50%);
    z-index: 1;
  }
  .timeline-wrapper {
    .timeline-item:last-child {
      .long-line {
        display: none;
      }
    }
  }
}

.timeline-item:last-of-type .timeline-content {
  margin-bottom: 0;
}
</style>
