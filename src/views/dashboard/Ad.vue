<template>
  <!-- 浮层 -->
  <div class="ad-box" v-if="show" @mousewheel.prevent="() => false">
    12312312312312312
    <div class="ad-box-div">
      <div class="ad-box-title">破纪录!</div>
      <div class="ad-box-time">{{ detail.time || "-" }}</div>
      <div class="ad-box-name">{{ detail.name || "-" }}</div>
      <div class="ad-box-content">{{ 0 || "突破销售额高峰" }}</div>
      <div class="ad-box-btn">
        {{ moneyInfo.num || "999" }}
        <div class="text-yuan">{{ moneyInfo.unit || "元" }}</div>
      </div>
    </div>
    <img
      class="ad-box-close-icon2"
      @click="show = false"
      src="https://zhongweijob.oss-cn-hangzhou.aliyuncs.com/static/index_close_icon.png"
    />
  </div>
</template>

<script>
import { getAd } from "@/api/ad/index";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      firstShow: true,
      show: false,
      detail: "",
      moneyInfo: {},
    };
  },
  mounted() {
    this.firstShow = this.$store.state.app.firstShow;
    this.getAdInfo();
  },
  methods: {
    // 获取信息
    getAdInfo() {
      getAd().then((res) => {
        this.detail = res.data;
        res.data != null && this.firstShow && (this.show = true);
        this.$store.dispatch("app/changefirstShowAd", false);
        this.moneyInfo = this.changeMoney(res.data.money);
      });
    },

    changeMoney(num) {
      if (Number(num) <= 1)
        return {
          num,
          unit: "元",
        };
      var moneyUnits = ["元", "万元", "亿元", "万亿"];
      var dividend = 10000;
      var curentNum = num;
      //转换数字
      var curentUnit = moneyUnits[0];
      //转换单位
      for (var i = 0; i < 4; i++) {
        curentUnit = moneyUnits[i];
        if (this.strNumSize(curentNum) < 5) {
          break;
        }
        curentNum = curentNum / dividend;
      }
      var m = {
        num: 0,
        unit: "",
      };
      m.num = Number(curentNum).toFixed(2);
      m.unit = curentUnit;
      return m;
    },

    strNumSize(tempNum) {
      var stringNum = tempNum.toString();
      var index = stringNum.indexOf(".");
      var newNum = stringNum;
      if (index != -1) {
        newNum = stringNum.substring(0, index);
      }
      return newNum.length;
    },
  },
};
</script>

<style scoped lang="scss">
/* 设置背景遮罩层样式 */
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
}
.ad-box-div {
  width: 311px;
  height: 405px;
  background: url("~@/assets/home/ad_record_bg.png") no-repeat;
  background-size: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ad-box-title {
  margin-top: 100px;
  color: #e62900;
  font-size: 56px;
  width: fit-content;
  font-weight: 600;
}
.ad-box-time {
  color: #e62900;
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
}
.ad-box-name {
  color: #6b0b00;
  font-size: 30px;
  font-weight: 600;
  margin-top: 15px;
}
.ad-box-content {
  color: #e62900;
  font-size: 27px;
  font-weight: 600;
  margin-top: 15px;
}
.ad-box-btn {
  width: 190px;
  color: #fff;
  font-size: 40px;
  font-weight: 600;
  padding: 5px 8px;
  background: linear-gradient(180deg, #ff2d00 0%, #ff9474 100%);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}
.text-yuan {
  font-size: 22px;
}
.ad-box-close-icon {
  position: absolute;
  top: 18%;
  right: 73px;
  width: 40px;
  height: 40px;
}

.ad-box-close-icon2 {
  width: 28px;
  height: 28px;
  margin-top: 15px;
  cursor: pointer;
}
</style>
