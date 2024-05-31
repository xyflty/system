<template>
  <div>
    <el-popover
      class="content-box"
      v-model="visible"
      placement="bottom-start"
      width="322"
      trigger="click"
    >
      <div>
        <div class="title-box">
          <i class="el-icon-d-arrow-left" @click="preYear"></i>
          <p class="title">{{ year }}年</p>
          <i class="el-icon-d-arrow-right" @click="nextYear"></i>
        </div>

        <div class="select-box">
          <span
            class="select-month"
            :class="{ active: selectData == i }"
            v-for="(key, i) in getNumOfWeekData"
            :key="i"
            @click="selectMonth(key, i)"
            >第{{ i + 1 }}周
          </span>
        </div>
      </div>

      <el-button slot="reference" class="select-button">
        <i class="el-icon-date"></i> {{ content }}</el-button
      >
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 今年是第几年
      year: 2023,
      // 今年一共多少周
      getNumOfWeekData: 0,
      // 今年星期一是一月几号
      Monday: 0,
      // 选中第几周
      circumference: 1,
      // 选中周的星期一与星期天是几年几月几号
      timeValueBegin: "",
      timeValueEnd: "",
      selectData: 0,
      visible: false, // 控制周卡片的显示隐藏
      content: "第一周",
    };
  },
  created() {
    // 获取当前年
    const date = new Date();
    this.year = date.getFullYear();
    // 获取一共多少周
    this.getNumOfWeekData = this.getNumOfWeek(this.year);
    // // 获取选中周的第一天
    this.timeValueBegin = this.myformatter(
      this.getXDate(this.year, this.circumference, 1)
    );
    // // 获取选中周的最后一天
    this.timeValueEnd = this.myformatter(
      this.getXDate(this.year, this.circumference + 1, 0)
    );
    this.$emit("sallBusiness", [this.timeValueBegin, this.timeValueEnd]);
  },
  methods: {
    selectMonth(k, i) {
      // console.log(k, i);
      this.selectData = i;
      this.content = `第${k}周`;
      this.timeValueBegin = this.myformatter(this.getXDate(this.year, k, 1));
      // // 获取选中周的最后一天
      this.timeValueEnd = this.myformatter(this.getXDate(this.year, k + 1, 0));
      this.$emit("sallBusiness", [this.timeValueBegin, this.timeValueEnd]);
    },
    getMont(date) {
      console.log(date);
      // console.log('时间',date);
      var now = new Date(date);
      this.year = now.getFullYear();
      var days = now.getDate();
      var month = now.getMonth();
      var num = 0;
      this.getNumOfWeekData = this.getNumOfWeek(this.year);
      for (let index = 0; index < month; index++) {
        num += this.getMonthDays(this.year, index);
      }
      num = num + days - this.Monday + 1;
      var selectData = 0;
      if (num % 7) {
        selectData = Number((num / 7).toFixed(0)) + 1;
      } else {
        selectData = num % 7;
      }
      this.selectMonth(selectData, selectData - 1);
    },

    //计算一年总共多少周
    getNumOfWeek(year) {
      var firstDay = new Date(year + "/01/01").getDay(); //本年第一天是星期几 星期天是0
      this.Monday = firstDay == 0 ? 2 : firstDay == 1 ? 1 : 9 - firstDay;
      var variate = firstDay === 1 ? 0 : 1; //判断当前年第一天是否是周一
      var nowTotalDays =
        (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? 366 : 365;
      var totalWeek = Math.ceil(nowTotalDays / 7.0);
      if (variate === 1) {
        //本年第一天不是星期一，示例2019年1月1号为周二，周二至周日（6号）归于2018年最后一周，本年计算周次时间需减去周二至周日共计6天，计算 = 8 - 2（1号周几）；
        totalWeek = Math.ceil(
          (nowTotalDays -
            (firstDay == 0 ? 1 : firstDay == 1 ? 0 : 8 - firstDay)) /
            7.0
        );
      }
      return totalWeek;
    },

    /**
     * 判断年份是否为润年
     *
     * @param {Number} year
     */
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    },

    /**
     * 获取某一年份的某一月份的天数
     *
     * @param {Number} year
     * @param {Number} month
     */

    getMonthDays(year, month) {
      return (
        [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ||
        (this.isLeapYear(year) ? 29 : 28)
      );
    },

    /**
     * 获取某年的某天是第几周
     * @param {Number} y
     * @param {Number} m
     * @param {Number} d
     * @returns {Number}
     */
    theWeek(date) {
      var now = new Date(date),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
      //计算当天所在年份的第多少天
      var nowTotalDays = 0;
      for (var i = 0; i < month; i++) {
        nowTotalDays += this.getMonthDays(year, i);
      }
      nowTotalDays += days; //今年第一天到当天的总天数
      var firstDay = new Date(year + "/01/01").getDay(); //console.log("本年第一天是星期：",firstDay);
      var variate = firstDay === 1 ? 0 : 1; //判断当前年第一天是否是周一
      var nowWeek = Math.ceil(nowTotalDays / 7.0);
      if (variate === 1) {
        //本年第一天不是星期一
        nowWeek =
          Math.ceil((nowTotalDays - (8 - firstDay)) / 7.0) <= 0
            ? this.getNumOfWeek(year - 1)
            : Math.ceil((nowTotalDays - (8 - firstDay)) / 7.0);
      }
      return nowWeek;
    },

    //获取当前周周一的日期
    theWeekMonday(date) {
      if (typeof date == "string") {
        date = date.replace(/-/g, "/");
      }
      var now = new Date(date);
      var day = now.getDay();
      day = day == 0 ? 6 : day - 1;
      var monday = now.getTime() - day * 24 * 3600 * 1000;
      now = new Date(monday);
      return this.myformatter(now);
    },
    //日期格式
    myformatter(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    },
    //获取某天日期后N天的日期
    theWeekDay(date, day) {
      if (typeof date == "string") {
        date = date.replace(/-/g, "/");
      }
      var now = new Date(date);
      var monday = now.getTime() + day * 24 * 3600 * 1000;
      now = new Date(monday);
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    },
    //这个方法将取得某年(year)第几周(weeks)的星期几(weekDay)的日期
    getXDate(year, weeks, weekDay) {
      var date = new Date(year, 0, 1);
      if (date.getDay() == 1) {
        weeks = weeks - 1;
      }
      var time = date.getTime();
      time += weeks * 7 * 24 * 3600000;
      date.setTime(time);
      return this.getNextDate(date, weekDay);
    },
    //这个方法将取得 某日期(nowDate) 所在周的星期几(weekDay)的日期
    getNextDate(date, day) {
      //0是星期日,1是星期一,...
      if (typeof date == "string") {
        date = date.replace(/-/g, "/");
      }
      var now = new Date(date);
      var wday = now.getDay();
      wday = wday == 0 ? 7 : wday;
      var time = now.getTime();
      var sub = day - wday;
      time += sub * 24 * 3600000;
      now.setTime(time);
      return now;
    },
    // 切换上一年
    preYear() {
      this.year = this.year - 1;
      this.getNumOfWeek();
    },
    // 切换下一年
    nextYear() {
      this.year = this.year + 1;
      this.getNumOfWeek();
    },
  },
};
</script>

<style>
.content-box {
  height: 262px;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.select-box {
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 250px;
  overflow: auto;
}

.select-box::-webkit-scrollbar {
  width: 0 !important;
}

.select-month {
  margin: 20px 5px;
  width: 50px;
  text-align: center;
  letter-spacing: 1px;
}

.active {
  color: rgb(38, 151, 255);
}

.select-button {
  width: 220px;
  text-align: left;
}
</style>