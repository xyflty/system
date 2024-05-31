<template>
  <div class="calendar-box">
    <div class="calendar__select-box">
      <el-select
        v-model="ownerType"
        placeholder="请选择"
        @change="handleTypechange"
      >
        <el-option label="全部日程" :value="0"> </el-option>
        <el-option label="我的日程" :value="1"> </el-option>
        <el-option label="下属日程" :value="2"> </el-option>
      </el-select>

      <el-button
        type="primary"
        style="margin-left: 10px"
        icon="el-icon-plus"
        @click="add"
        v-hasPermi="['core:schedule:add']"
        >新建日程</el-button
      >
    </div>
    <FullCalendar
      :options="calendarOptions"
      class="eventDeal-wrap"
      ref="fullCalendar"
    >
      <template v-slot:eventContent="arg">
        <!-- {{ arg.event }} -->
        <b>{{ arg.timeText }} </b>
        <span>{{ arg.event.title }}</span>
      </template>
    </FullCalendar>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="日程标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入日程标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="followUpTime">
          <el-date-picker
            v-model="form.followUpTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关联业务">
          <el-col :span="11">
            <el-select v-model="form.relateType" placeholder="请选择业务类型">
              <el-option label="线索" :value="1"></el-option>
              <!-- <el-option label="挖需" :value="2"></el-option> -->
              <el-option label="商机" :value="3"></el-option>
              <el-option label="订单" :value="4"></el-option>
              <el-option label="客户" :value="5"></el-option>
            </el-select>
          </el-col>
          <el-col :span="11">
            <el-select
              style="width: 100%"
              v-model="form.relateId"
              filterable
              placeholder="请输入关键字搜索"
              remote
              :remote-method="getCompanyList"
              @focus="getCompanyList($event, true)"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="日程描述">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="4"
            placeholder="请输入描述信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="日程状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">未开始</el-radio>
            <el-radio :label="1">执行中</el-radio>
            <el-radio :label="2">已结束</el-radio>
            <el-radio :label="3">已取消</el-radio>
          </el-radio-group>
          <el-checkbox style="margin-left: 10px" v-model="form.isAutoCancel"
            >过期自动结束</el-checkbox
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 日程列表 -->
    <el-dialog title="日程列表" :visible.sync="dialogVisibleList" width="60%">
      <el-table :data="list" border style="width: 100%" stripe>
        <el-table-column prop="title" align="center" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="followUpTime"
          align="center"
          label="跟进时间"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="{ row }">
            <span>{{ statusStr(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" align="center" label="关联业务">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-arrow-right"
              @click="handleDetail(row)"
              v-hasPermi="['core:schedule:query']"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(row)"
              v-hasPermi="['core:schedule:edit']"
              >编辑</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDel(row)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-dialog>

    <el-dialog
      title="日程详情"
      :visible.sync="dialogVisibleDetail"
      width="30%"
      append-to-body
    >
      <el-descriptions
        class="margin-top"
        title=""
        :label-style="LS"
        :column="1"
        border
      >
        <el-descriptions-item>
          <template slot="label"> 日程标题： </template>
          {{ detail.title || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 跟进时间： </template>
          {{ detail.followUpTime || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 关联业务： </template>
          {{ detail.companyName || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 日程描述： </template>
          {{ detail.content || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 日程状态： </template>
          {{ statusStr(detail.status) || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 负责人员： </template>
          {{ detail.userName || "-" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 创建时间： </template>
          {{ detail.createTime || "-" }}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">取 消</el-button>
        <el-button
          :loading="buttonLoading"
          type="primary"
          @click="handleEdit(detail)"
          v-hasPermi="['core:schedule:edit']"
          >编辑日程</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
import zhCnLocale from "@fullcalendar/core/locales/zh-cn";

import calenderFormate from "@/utils/calendar"; //农历计算方法
import { formatDate_1 } from "@/utils/index"; //农历计算方法
import Festival from "@/utils/festival_chn";

import {
  listSchedule,
  getScheduleCount,
  getSchedule,
  addSchedule,
  updateSchedule,
  delSchedule,
  getBaseInfoList,
  getListByDateRange,
} from "@/api/content/schedule";

const festival = new Festival();

export default {
  name: "Calendar",
  components: {
    FullCalendar,
  },
  watch: {
    // dateType: {
    //   handler(n) {
    //     this.getListByDateRange();
    //   },
    // },

    date: {
      handler(n) {
        console.log(n);
        this.getListByDateRange();
      },
    },

    title(n) {
      console.log("title", n);
      // console.log("视图变化", this.calendarApi.view.type);

      const viewType = this.calendarApi.view.type;
      this.dateType =
        viewType == "dayGridMonth" ? 1 : viewType == "timeGridWeek" ? 2 : 3;
      if (viewType == "dayGridMonth") {
        let date = n.replace(/[年月]/g, "-") + "1";
        this.date = new Date(Date.parse(date.replace(/-/g, "/")));
      } else if (viewType == "timeGridWeek") {
        let date = n.split(" – ")[0].replace(/[年月]/g, "-");
        date = date.replace(/日/g, "");
        this.date = new Date(Date.parse(date.replace(/-/g, "/")));
      } else if (viewType == "timeGridDay") {
        let date = n.replace(/[年月]/g, "-");
        date = date.replace(/日/g, "");
        this.date = new Date(Date.parse(date.replace(/-/g, "/")));
      }
    },
  },
  data() {
    return {
      calendarOptions: {
        // 引入的插件
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        // 日历头部按钮位置
        headerToolbar: {
          left: "",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay today prev,next",
        },
        // 日历头部按钮中文转换
        // buttonText: {
        //   today: "今天",
        //   month: "月",
        //   week: "周",
        //   day: "天",
        // },
        initialView: "dayGridMonth", // 指定默认显示视图
        views: {
          //对应月视图
          dayGridMonth: {
            displayEventTime: false, //是否显示时间
            dayCellContent(item) {
              // let _date = [2022, 10, 1];

              let _date = formatDate_1(item.date).split(" ")[0].split("-");
              let _dateF = calenderFormate.solar2lunar(
                _date[0],
                _date[1],
                _date[2]
              );
              _dateF.cDay = _dateF.cDay < 10 ? "0" + _dateF.cDay : _dateF.cDay;
              _dateF.cMonth =
                _dateF.cMonth < 10 ? "0" + _dateF.cMonth : _dateF.cMonth;

              let festivalData = festival.day(
                Number(`${_dateF.cYear}${_dateF.cMonth}${_dateF.cDay}`)
              );

              let html = ``;
              if (_dateF.lunarFestival || _dateF.festival) {
                html = `<div style="margin: 10px;"><label>${
                  _dateF.cDay
                }</label><span style="margin-left: 10px;">${
                  _dateF.lunarFestival || _dateF.festival
                }</span></div>`;
              } else {
                html = `<div style="margin: 10px;" ><label>${_dateF.cDay}</label><span style="margin-left: 10px;">${_dateF.IDayCn}</span></div>`;
              }

              if (festivalData.isHoliday) {
                html += `<div style="margin: 10px; padding:0 10px;color: rgb(249, 94, 90);border:1px solid rgb(249, 94, 90); ">放假</div>`;
              } else if (festivalData.isSwap) {
                html += `<div style="margin: 10px;padding:0 10px;color: #b3b3b3;border:1px solid #b3b3b3;">上班</div>`;
              }

              return {
                html,
              };
            },
          },
        },

        handleWindowResize: false,
        // locale: "zh-ch", // 切换语言，当前为中文
        locale: zhCnLocale,
        firstDay: "1", // 设置一周中显示的第一天是周几，周日是0，周一是1，以此类推
        weekNumberCalculation: "ISO", // 与firstDay配套使用
        eventCOlor: "#3d8eec", // 全部日历日程背景色
        timeGridEventMinHeight: "20", // 设置事件的最小高度
        aspectRatio: "1.5", // 设置日历单元格宽高比
        displayEventTime: true, // 是否显示事件时间
        allDaySlot: false, // 周、日视图时，all-day不显示
        eventLimit: false, // 设置月日程，与all-day slot 的最大显示数量，超过的通过弹窗展示
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        },
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false, // 设置时间为24小时制
        },
        events: [
          {
            id: 0,
            title: "All-day event",
            start: "2022-07-11",
          },
        ], // 日程数组
        calendarApi: null,

        // 事件
        editable: false, // 是否可以进行（拖动、缩放）修改
        eventStartEditable: false, // Event日程开始时间可以改变，默认为true，若为false,则表示开始结束时间范围不能拉伸，只能拖拽
        eventDurationEditable: false, // Event日程的开始结束时间距离是否可以改变，默认为true,若为false，则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        weekends: true,
        navLinks: true, // 天链接
        selectHelper: false,
        selectEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认为true，允许
        dayMaxEvents: true,
        dateClick: this.handleDateClick, // 日期点击
        eventsSet: this.handleEvents, // 事件点击
        eventClick: this.handleEventClick, // 日程点击信息展示
        eventDrop: this.handleEventDrop, // 日程拖动事件
        eventResize: this.eventResize, // 日程缩放事件
      },

      // 日程相关数据
      dialogTitle: "新建日程",
      LS: {
        color: "#000",
        "text-align": "center",
        "font-weight": "600",
        height: "40px",
        "min-width": "60px",
        "word-break": "keep-all",
      },
      value: 0,
      date: new Date(),
      dialogVisible: false,
      form: {},
      rules: {
        title: [{ required: true, message: "请输入日程标题", trigger: "blur" }],
        followUpTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
      },
      dialogVisibleDetail: false,
      detail: "",
      dialogVisibleList: false,

      workDayList: [],

      day: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      companyList: [],
      buttonLoading: false,

      dateType: 1,
      ownerType: 0,
      title: "",
      calendarApi: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.calendarApi = this.$refs.fullCalendar.getApi();
      this.title = this.calendarApi.view?.title;
    });
  },
  created() {},
  methods: {
    handleTypechange(e) {
      this.getListByDateRange();
    },
    statusStr(index) {
      return ["未开始", "执行中", "已结束", "已取消"][index];
    },

    // 获取初始化数据
    getListByDateRange() {
      getListByDateRange({
        followUpTime: formatDate_1(this.date) + " 00:00:00",
        dateType: this.dateType,
        pageSize: 4,
        ownerType: this.ownerType,
      }).then((res) => {
        console.log(res);

        let data = res.data;
        this.calendarOptions.events = [];

        const classArr = [
          "className_status0",
          "className_status1",
          "className_status2",
        ];

        data.forEach((item) => {
          item.entityList.forEach((val, index) => {
            let obj = {
              id: val.id,
              start: val.followUpTime,
              title: val.title,
              allDay: false,
              className: [
                "className_status",
                classArr[val.status == 3 ? 2 : val.status],
              ],
            };
            this.calendarOptions.events.push(obj);

            if (index == 3 && this.dateType == 1) {
              let more = {
                id: this.uniqueId(),
                start: val.followUpTime.split(" ")[0] + " 23:00:00",
                title: "查看全部",
                className: ["className_more"],
              };
              this.calendarOptions.events.push(more);
            }
          });
        });
      });
    },
    // 获取日程标记
    getScheduleCount() {
      getScheduleCount({ followUpTime: this.date + " 00:00:00" }).then(
        (res) => {
          console.log(res);
          this.workDayList = [];
          res.data.forEach((item) => {
            item.followUpTime = item.followUpTime.split(" ")[0];
            this.workDayList.push(item.followUpTime);
          });
        }
      );
    },

    add() {
      this.form = {};
      this.dialogVisible = true;
      this.dialogTitle = "新建日程";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            this.form.isAutoCancel = this.form.isAutoCancel ? 1 : 0;
            this.form.customerId = this.companyList.length
              ? this.companyList.find((item) => item.id == this.form.relateId)[
                  "customerId"
                ]
              : this.form.customerId;
            console.log(this.form);

            updateSchedule(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getListByDateRange();
                this.form = {};
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            this.form.isAutoCancel = this.form.isAutoCancel ? 1 : 0;
            this.form.customerId = this.companyList.length
              ? this.companyList.find((item) => item.id == this.form.relateId)[
                  "customerId"
                ]
              : "";
            console.log(this.form);

            // return;
            addSchedule(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.dialogVisible = false;
                this.form = {};
                this.getListByDateRange();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },

    /** 查询关联列表 */
    getCompanyList(e, isFocus) {
      let typeStr = ["clue", "demand", "opportunity", "order", "customer"];
      if (this.form.relateType == null || this.form.relateType == undefined) {
        this.$message.error("请先选择关联业务类型");
        return;
      }
      getBaseInfoList(
        {
          pageNum: 1,
          pageSize: 10,
          searchValue: isFocus ? "" : e,
        },
        typeStr[this.form.relateType - 1]
      ).then((response) => {
        this.companyList = response.rows;
      });
    },

    // 获取列表
    getList() {
      listSchedule({
        followUpTime: this.day + " 00:00:00",
        ...this.queryParams,
      }).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.dialogVisibleList = true;
      });
    },

    handleClick(day) {
      if (!this.workDayList.includes(day)) {
        return;
      }
      this.day = day;
      this.getList();
    },

    // 唯一id
    uniqueId() {
      let date = new Date().valueOf(); //获取时间戳
      let txt = "1234567890"; //生成的随机机器码
      let len = 13; //机器码有多少位
      let pwd = ""; //定义空变量用来接收机器码
      for (let i = 0; i < len; i++) {
        pwd += txt.charAt(Math.floor(Math.random() * txt.length)); //循环机器码位数随机填充
      }
      return date + pwd;
    },

    // 详情
    handleDetail(row) {
      getSchedule({ id: row.id }).then((res) => {
        console.log(res);
        this.dialogVisibleDetail = true;
        this.detail = res.data;
      });
    },

    // 编辑
    handleEdit(row) {
      getSchedule({ id: row.id }).then((res) => {
        console.log(res);
        this.dialogVisible = true;
        this.form = res.data;
        this.dialogTitle = "编辑日程";
        this.form.isAutoCancel = this.form.isAutoCancel ? true : false;
        this.getCompanyList(this.form.companyName);
      });
    },

    // 日程保存
    saveEvent(val) {
      let eventsArr = this.calendarOptions.events;
      try {
        if (eventsArr.length === 0) {
          eventsArr.push(val);
        } else {
          eventsArr.forEach((item, index, eventsArr) => {
            // 若为修改日程
            if (item.eventID === val.eventID) {
              throw new Error(index);
            }
          });
          // 若为新增日程
          eventsArr.push(val);
        }
      } catch (e) {
        // 若为修改日程
        eventsArr.splice(e.message, 1, val);
      }
    },
    // 日程删除
    deleteEvent(val) {
      let eventsArr = this.calendarOptions.events;
      try {
        eventsArr.forEach((item, index, eventsArr) => {
          if (item.eventID === val) {
            throw new Error(index);
          }
        });
      } catch (e) {
        // 删除指定日程
        eventsArr.splice(parseInt(e.message), 1);
      }
    },
    // 日程事件点击
    handleEvents(info) {
      console.log(info);
      this.$nextTick(() => {
        this.calendarApi = this.$refs.fullCalendar.getApi();
        this.title = this.calendarApi.view?.title;
      });
    },
    handleWeekendsToggle() {
      console.log("handleWeekendsToggle");
      this.calendarOptions.weekends = !this.calendarOptions.weekends;
    },
    // 日期点击
    handleDateClick(selectInfo) {
      console.log(selectInfo);
      this.form = {};
      this.dialogTitle = "新建日程";
      this.dialogVisible = true;
      // if (
      //   confirm("您是否要在【" + selectInfo.dateStr + "】添加一个新的事件？")
      // ) {
      // 父组件直接调用子组件方法
      // this.$refs["eventDialogue"].openDialog("add");
      // 父组件直接修改子组件变量
      // this.$refs['eventDialogue'].dialogVisible = true
      // }
    },
    // 日程点击信息展示
    handleEventClick(info) {
      console.log("handleEventClick.info:", info.event._def.publicId);
      console.log(info.event);
      const id = info.event._def.publicId;
      const title = info.event._def.title;
      if (title == "查看全部") {
        this.dialogVisibleList = true;

        this.day = this.calendarOptions.events
          .find((item) => item.id == id)
          ["start"].split(" ")[0];
        this.getList();
        return;
      }
      this.handleDetail({ id: info.event._def.publicId });
      // info.el.style.borderColor = "red";
      // this.$refs["eventDialogue"].openDialog("view", info);
    },
    // 日程事件触发
    eventClick(info) {
      console.log("eventClick.info:", info);
      info.el.style.borderColor = "red";
    },
    // 日程拖动事件
    handleEventDrop(info) {
      this.$refs["eventDialogue"].eventFormModel.start = info.event.start;
      this.$refs["eventDialogue"].eventFormModel.end = info.event.end;
    },
    // 日程缩放事件
    eventResize(info) {
      this.$refs["eventDialogue"].eventFormModel.start = info.event.start;
      this.$refs["eventDialogue"].eventFormModel.end = info.event.end;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/dialog.scss";

.calendar-box {
  margin: 40px;
  position: relative;
  .calendar__select-box {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
  }
}

::v-deep .fc-daygrid-day-top {
  flex-direction: row;
  justify-content: space-between;
}

::v-deep .fc-daygrid-day-number {
  display: none;
}
// .fc ::v-deep .fc-button {
//   background: #fff !important;
//   color: rgb(153, 153, 153);
//   border: 1px solid rgb(153, 153, 153);
// }
// .fc ::v-deep .fc-button-active {
//   background: #fff !important;
//   color: #333 !important;
//   border: 1px solid #333;
// }
// .fc ::v-deep .fc-daygrid-day-frame {
//   position: relative;
// }
// .fc ::v-deep .fc-daygrid-day-frame::after {
//   position: absolute;
//   content: "查看全部";
//   bottom: 0;
//   color: red;
// }
.fc ::v-deep .className_more {
  margin-top: 10px;
  color: #58a3f7;
  font-size: 14px;
  padding-left: 5px;
  width: fit-content;
  // position: absolute;
  // bottom: -130px;
}

.fc ::v-deep .className_more:hover {
  background: #fff;
}

.fc ::v-deep .className_status {
  i {
    font-style: normal;
  }

  background-color: #fec03d;
  color: #fff;
  font-weight: bold;
  // width: 100%;
  padding-left: 10px;
}
.fc ::v-deep .className_status0 {
  background-color: #fec03d;
}
.fc ::v-deep .className_status1 {
  background-color: #58a3f7;
}
.fc ::v-deep .className_status2 {
  background-color: #e4e4e4;
}
</style>
