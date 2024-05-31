<template>
    <div>
        <el-popover class="content-box" v-model="visible" placement="bottom-start" width="322" trigger="click">
            <div>
                <div class="title-box">
                    <i class="el-icon-d-arrow-left" @click="preYear"></i>
                    <p class="title">{{ year }}年</p>
                    <i class="el-icon-d-arrow-right" @click="nextYear"></i>
                </div>

                <div class="select-box">
                    <span class="select-month" :class="{ active: selectData == i }" v-for="(key, i) in date" :key="i"
                        @click="selectMonth(key, i)">第{{ i + 1 }}周 </span>
                </div>
            </div>

            <el-button slot="reference" class="select-button"> <i class="el-icon-date"></i> {{ content }}</el-button>
        </el-popover>


    </div>
</template>
  
<script>
import { mapState } from "vuex";
export default {
    
    props: {
        passRank: Object,
       
    },
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
            beginTime: "",
            endTime: "",
            date: [],
            selectData: 0,
            i:1,
            content: '选择周',
            visible: false, // 控制周卡片的显示隐藏
            // queryParams: {
            //     searchDeptId: undefined,
            //     searchDateType: 1,
            //     searchDate: "2023-第1周",
            //     selectId: [100], // 多选的id
            //     dateType: 1,
            //     timeType: 1
            // },
            queryParams:{}
        };
    },
    created() {
                console.log(this.passRank);
            this.content=this.passRank.content || '选择周'
            this.selectData=this.passRank.selectData || 0
        this.acceptData()

        // 获取当前年
        const date = new Date();
        this.year = date.getFullYear();
        // 获取一共多少周
        this.getNumOfWeekData = this.getNumOfWeek(this.year);
        // 获取选中周的第一天
        // this.beginTime = this.myformatter(this.getXDate(this.year, this.circumference, 1));
        // 获取选中周的最后一天
        // this.endTime = this.myformatter(this.getXDate(this.year, this.circumference + 1, 0));
        this.getWeek()
       
    },
    watch: {
    content: {
      handler(n) {
        console.log('1231231313213',this.statistics.dataType.content);
       if( this.content=='选择周'||this.content==undefined){
        this.content=this.passRank.content || '选择周'
        console.log(  this.content);
     
       }
       
      },
    },

   
  },
    computed: {
    ...mapState(["statistics"]),
    
  },
    methods: {
        acceptData() {
            if (this.passRank) {
                console.log(this.passRank);
                this.queryParams =this.passRank
            } 

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
                (isLeapYear(year) ? 29 : 28)
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
                nowTotalDays += getMonthDays(year, i);
            }
            nowTotalDays += days; //今年第一天到当天的总天数
            var firstDay = new Date(year + "/01/01").getDay(); //console.log("本年第一天是星期：",firstDay);
            var variate = firstDay === 1 ? 0 : 1; //判断当前年第一天是否是周一
            var nowWeek = Math.ceil(nowTotalDays / 7.0);
            if (variate === 1) {
                //本年第一天不是星期一
                nowWeek =
                    Math.ceil((nowTotalDays - (8 - firstDay)) / 7.0) <= 0
                        ? getNumOfWeek(year - 1)
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
        formatNumber(n) {
            return n.toString().length > 1 ? n : '0' + n
        },

        getWeek() {

            const getData = {
                run: (year) => {
                    // 获取到所有天数
                    let days = getData.getDate(year || new Date().getFullYear())

                    let weeks = {};
                    for (let i = 0; i < days.length; i++) {
                        let weeksKeyLen = Object.keys(weeks).length;
                        let daySplit = days[i].split('_');

                        if (weeks[weeksKeyLen] === undefined) {
                            weeks[weeksKeyLen + 1] = [daySplit[0]]
                        } else {
                            if (daySplit[1] == '1') {
                                weeks[weeksKeyLen + 1] = [daySplit[0]]
                            } else {
                                weeks[weeksKeyLen].push(daySplit[0])
                            }

                        }

                    }
                    return weeks;

                },

                getDate: (year) => {
                    let dates = [];
                    for (let i = 1; i <= 12; i++) {
                        for (let j = 1; j <= new Date(year, i, 0).getDate(); j++) {
                            dates.push(year + '-' + this.formatNumber(i) + '-' + this.formatNumber(j) + '_' + new Date([year, i, j].join('-')).getDay())
                        }
                    }
                    return dates;
                }
            }

            let arr = getData.run(this.year)
            let dats = []
            for (let key in arr) {
                dats.push(arr[key])
                var newArr = dats.slice(0);
                newArr.splice(0, 1);
                this.date = newArr

             

            }



        },
        // 选择周的具体时间
        selectMonth(key, index) {
            // 对元素进行删除拿到开始和结束的日期
            key.splice(1, 5);
         
            this.key=['2023-01-09', '2023-01-15']
            this.selectData = index
            // 选择周后更改内容
            index = index + 1
       this.content=  this.year + '-' + '第' + index + '周'
      
            this.visible = false
            // 进入销售排名分析
            if (this.queryParams.searchDateType) {
                // searchEndDate searchStartDate
                this.queryParams.timeValueBegin = undefined
                this.queryParams.timeValueEnd = undefined
                this.queryParams.searchStartDate = key[0]
                this.queryParams.searchEndDate  = key[1]
                this.queryParams.content=this.content
                this.queryParams.selectData= index-1
                this.queryParams.searchDate= undefined
                this.queryParams.searchDateType = 3

                this.$emit('acceptRank', this.queryParams)
                this.$store.commit("ADD_TIME_STATUS", this.queryParams);
                console.log('选择xxx的订单 ',this.queryParams);
            }
            this.content=  this.year + '-' + '第' + index + '周'
            // 传入客户分析罗盘界面
            if(this.queryParams.dateType){
                this.queryParams.beginTime=key[0]
                this.queryParams.endTime= key[1]
                this.queryParams.dateType = 4
                this.queryParams.content=  this.content
                this.queryParams.selectData= index-1
                this.$emit('clientData', this.queryParams)
                this.$store.commit("ADD_TIME_STATUS", this.queryParams);
                console.log('选择州的订单 ',this.queryParams);
             
            }
        

            // 传入销售业务分析页面
    
            if (this.queryParams.timeType) {
                this.queryParams.searchStartDate = undefined
                this.queryParams.searchEndDate  =undefined
                this.queryParams.timeType = 3
                this.queryParams.searchDate=undefined
                this.queryParams.timeValueBegin = key[0]

                this.queryParams.timeValueEnd = key[1]

                this.queryParams.content= this.content
                this.queryParams.selectData= index-1
                this.$emit('sallBusiness', this.queryParams)
                this.$store.commit("ADD_TIME_STATUS", this.queryParams);
            }


           
            


           



        },
        // 切换上一年
        preYear() {
            this.year = this.year - 1
            this.getWeek()
        },
        // 切换下一年
        nextYear() {
            this.year = this.year + 1
            this.getWeek()
        }

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
    width: 0 !important
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
