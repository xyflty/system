<template>
  <div class="carousel_card" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <div
      class="carousel-container"
      ref="carouselRef"
      :style="`width:${400 * indicatorNum}px`"
    >
      <div
        v-for="(carousel, index) in carouselData"
        :key="index"
        class="card-box"
      >
        <div v-for="(item, i) in carousel" :key="i">
          <div class="card-content">
            <div class="type">
              {{ formatterFn(commonData.businessTypeList, item.type) }}
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="company">{{ item.companyName }}</div>
            <div class="desc">{{ item.content || "--" }}</div>
            <div class="time">最近跟进：{{ item.followUpTime || "--" }}</div>
            <div class="time">
              下次跟进：{{ item.nextFollowUpTime || "--" }}
            </div>

            <div class="btn">
              <slot v-if="$slots.menu" name="menu" :row="item"></slot>
              <template v-else>
                <el-button type="text" @click="handleClick('follow', item, 0)"
                  >跟进</el-button
                >
                <el-button type="text" @click="handleClick('remove', item, 1)"
                  >移除</el-button
                >
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="indicator" v-if="indicatorNum > 1">
      <ul>
        <li
          :class="{ active: carouselIndex == index }"
          v-for="(item, index) in indicatorNum"
          :key="index"
          @click="carouselIndex = index"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatterCallback } from "@/utils/common";

import { mapState } from "vuex";
export default {
  name: "CarouselCard",
  props: {
    data: Array,
    num: {
      type: Number,
      default: 6,
    },
    autoplay: Boolean,
    interval: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      // 轮播图数量
      carouselData: [],
      carouselIndex: 0,
      // 指示器数量
      indicatorNum: 0,
      timer: null,
    };
  },
  methods: {
    formatterFn(arr, val) {
      return formatterCallback(arr, val);
    },
    setCarouselData() {
      this.indicatorNum = Math.ceil(this.data.length / this.num);

      let arr = [];
      for (let i = 0; i < this.indicatorNum; i++) {
        arr.push(this.data.slice(this.num * i, this.num * (i + 1)));
      }
      console.log(arr, "arr");
      this.carouselData = arr;
    },

    // 自动轮播
    autoPlay() {
      if (this.autoplay) {
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(() => {
          if (this.carouselIndex >= this.indicatorNum - 1) {
            this.carouselIndex = 0;
          } else {
            this.carouselIndex++;
          }
        }, this.interval);
      }
    },
    // 鼠标进入
    mouseEnter() {
      this.timer && clearInterval(this.timer);
    },
    // 鼠标离开
    mouseLeave() {
      this.autoPlay();
    },

    handleClick(type, row, index) {
      this.$emit("operate", type, row, index);
    },
  },
  mounted() {
    this.autoPlay();
  },

  watch: {
    data: {
      handler() {
        this.setCarouselData();
      },
      immediate: true,
      deep: true,
    },

    carouselIndex(index) {
      const dom = document.querySelector(".carousel-container");
      dom.style.transform = `translateX(${-400 * index}px)`;
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
.carousel_card {
  width: 100%;
  padding-bottom: 25px;
  position: relative;

  .carousel-container {
    padding: 20px 0 0;
    overflow: hidden;
    transition: all 0.3s;
  }
  .indicator {
    position: absolute;
    left: 50%;
    bottom: 8px;

    transform: translateX(-50%);

    ul {
      display: flex;
      li {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 2px solid #aaa;
        margin: 0 8px;
        cursor: pointer;
      }
      .active {
        background: #aaa;
      }
    }
  }
}
.card-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  row-gap: 15px;

  width: 400px;
  float: left;
  > div {
    width: 180px;
  }
  .card-content {
    display: flex;
    width: 100%;
    height: 250px;
    flex-direction: column;
    border: 1px solid #ddd;
    background-color: #f4faff;
    padding: 20px 5px 0 5px;
    border-radius: 8px;
    font-size: 12px;
    color: #999;
    position: relative;

    .type {
      position: absolute;
      left: 5px;
      top: -10px;

      padding: 5px 8px;
      background: red;
      color: #fff;
      border-radius: 5px;
    }
    .title {
      font-size: 12px;
      text-align: left;
      font-weight: 700;
      color: rgb(42, 111, 246);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .company {
      font-weight: 700;
      color: #333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .desc {
      height: 35px;
      line-height: 1.2;

      color: #555;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn {
      position: absolute;
      right: 10px;
      bottom: 0;

      margin: 0;
      > button {
        font-size: 12px;
      }
    }
    > div {
      margin-bottom: 15px;
    }
  }
}
</style>