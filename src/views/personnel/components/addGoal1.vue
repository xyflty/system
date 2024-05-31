<template>
  <!-- 添加跟进记录对话框 -->
  <el-dialog
    title="设置业绩目标"
    :visible="show"
    width="900px"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="选择成员" prop="userIdList">
        <el-select
          style="width: 100%"
          v-model="form.userIdList"
          filterable
          multiple
          clearable
          placeholder="请输入关键字搜索用户"
          remote
          :remote-method="getUserList"
          @focus="getUserList($event, true)"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="目标财年" prop="year">
            <el-date-picker
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" v-if="!form.userId">
          <el-form-item label="每日目标设置" prop="targetDayValue">
            <el-input
              v-model="form.targetDayValue"
              type="number"
              placeholder="请输入每日目标设置 金额（元） 数量（个）"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <h2 v-if="form.userId" class="goal-box-step">目标分解</h2>
      <el-row v-if="form.userId" :gutter="20">
        <el-col :span="6" v-for="(item, index) in form.goal_months" :key="index"
          ><div class="grid-content bg-purple">
            <div class="flex flex-acenter flex-between box1">
              <span
                >第{{
                  index == 0
                    ? "一"
                    : index == 1
                    ? "二"
                    : index == 2
                    ? "三"
                    : "四"
                }}季度</span
              >
              <el-input
                :value="totalArr[index]"
                class="inp"
                readonly
                type="number"
                placeholder=""
                size="mini"
              ></el-input>
            </div>
            <div class="flex flex-acenter flex-between box2">
              <span
                >{{ form.year }}-{{
                  index == 0
                    ? "01"
                    : index == 1
                    ? "04"
                    : index == 2
                    ? "07"
                    : "10"
                }}</span
              >
              <el-input
                v-model.number="item[0]"
                class="inp"
                type="number"
                placeholder=""
                size="mini"
                @focus="setDayGoal(0, index)"
              ></el-input>
            </div>
            <div class="flex flex-acenter flex-between box2">
              <span
                >{{ form.year }}-{{
                  index == 0
                    ? "02"
                    : index == 1
                    ? "05"
                    : index == 2
                    ? "08"
                    : "11"
                }}</span
              >
              <el-input
                v-model.number="item[1]"
                class="inp"
                type="number"
                placeholder=""
                size="mini"
                @focus="setDayGoal(1, index)"
              ></el-input>
            </div>
            <div class="flex flex-acenter flex-between box2">
              <span
                >{{ form.year }}-{{
                  index == 0
                    ? "03"
                    : index == 1
                    ? "06"
                    : index == 2
                    ? "09"
                    : "12"
                }}</span
              >
              <el-input
                v-model.number="item[2]"
                class="inp"
                type="number"
                placeholder=""
                size="mini"
                @focus="setDayGoal(2, index)"
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!form.userId">
      <el-button type="primary" @click="submit" :loading="buttonLoading"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div style="margin: 0 0 20px 0">
        <el-input
          style="width: 300px; margin-right: 20px"
          v-model="goalValue"
          type="number"
          placeholder="请输入每日目标设置 金额（元） 数量（个）"
        />

        <el-button type="primary" @click="set">设置</el-button>
      </div>

      <el-table :data="goalList" border style="width: 100%" stripe>
        <el-table-column label="日期" align="center" prop="targetDay" />
        <el-table-column
          label="目标"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-input
              type="number"
              v-model="row.targetDayValue"
              placeholder="请输入"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGoalSet">确 定</el-button>
        <el-button @click="cancelSet">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";

import { listWeChat, add, update, editTarget } from "@/api/personnel/target";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

const docMonth = [
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
const docQuarter = ["quarterOne", "quarterTwo", "quarterThree", "quarterFour"];

export default {
  name: "AddGoal1",
  components: { Treeselect },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    _form: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },

  watch: {
    show: {
      handler(n) {
        if (n) {
          console.log(this._form);

          if (this._form != undefined && this._form.userId) {
            this.getUserList();
            this.form = JSON.parse(JSON.stringify(this._form));
            this.form.userIdList = [this._form.userId];

            let arr = [];

            docMonth.forEach((item, index) => {
              if (this._form.hasOwnProperty(item)) {
                arr.push(this._form[item]);
              }
            });

            // docMonth.forEach((item, index) => {
            //   if (this._form.hasOwnProperty(item)) {
            //     arr.push(
            //       this._form.monthTargetSumList[index]["sumTargetDayValue"]
            //     );
            //   }
            // });

            let newArr = [];
            // this.form.goal_months = [];
            this.$set(this.form, "goal_months", []);

            arr.forEach((item, index) => {
              if ((index + 1) % 3 == 0) {
                newArr.push(item);
                this.form.goal_months.push(newArr);
                newArr = [];
              } else {
                newArr.push(item);
              }
            });
          } else {
            this.form = {
              year: "2022",
              goal_months: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
              ],
            };
          }
        }

        this.getUserList(1, 1);
      },
      deep: true,
    },
    "form.goal_months": {
      handler(n) {
        console.log("变化", n);
        n.forEach((item, index) => {
          this.totalArr[index] = eval(item.join("+"));
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      title: "",
      dialogVisible: false,
      goalList: [],
      goalValue: 0,

      userList: [],
      deptOptions: [],
      form: {
        year: "2022",
        goal_months: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      totalArr: [],
      buttonLoading: false,

      // 跟进表单校验
      rules: {
        userIdList: [{ required: true, message: "不能为空", trigger: "blur" }],

        year: [{ required: true, message: "不能为空", trigger: "blur" }],
        // yearTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
      },

      monthIdx: "",
    };
  },
  mounted() {
    this.getTreeselect();
  },
  methods: {
    listWeChat(params) {
      listWeChat(params).then((res) => {
        console.log(res);

        this.goalList = res.rows;
        this.goalValue = res.rows[0].targetDayValue;
      });
    },
    submitGoalSet() {
      let total = 0;
      let goal_months = JSON.parse(JSON.stringify(this.form.goal_months));
      let targetDayIdList = this.goalList.map((item) => item.id);
      let targetDayValueList = this.goalList.map((item) => {
        total += Number(item.targetDayValue);
        return item.targetDayValue;
      });

      editTarget({
        targetDayIdList,
        targetDayValueList,
      }).then((res) => {
        this.dialogVisible = false;
        goal_months[this.monthIdx[0]][this.monthIdx[1]] = total;

        this.$set(this.form, "goal_months", goal_months);
        this.$message.success("设置成功！");
        this.$emit("submit");
      });
    },
    cancelSet() {
      this.goalList = [];
      this.goalValue = "";
      this.dialogVisible = false;
    },
    set() {
      this.goalList.forEach((item) => (item.targetDayValue = this.goalValue));
    },
    setDayGoal(val, index) {
      let arr = [
        ["1", "4", "7", "10"],
        ["2", "5", "8", "11"],
        ["3", "6", "9", "12"],
      ];

      let arr2 = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["10", "11", "12"],
      ];

      const month = arr[val][index];
      arr2.forEach((item, index) => {
        item.forEach((val, idx) => {
          if (val == month) {
            this.monthIdx = `${index}${idx}`;
          }
        });
      });
      this.title = `设置${arr[val][index]}月每日目标`;
      this.goalList = [];
      const check = (val) => (val < 10 ? "0" + val : val);

      // let totalDay = moment(
      //   `${this.form.year}-${check(arr[val][index])}`,
      //   "YYYY-MM"
      // ).daysInMonth();

      // for (let i = 0; i < totalDay; i++) {
      //   this.goalList.push({
      //     month: `${this.form.year}-${check(arr[val][index])}-${check(i + 1)}`,
      //     value: this.goalValue,
      //   });
      // }

      this.listWeChat({
        userId: this.form.userId,
        yearMonth: `${this.form.year}-${check(arr[val][index])}`,
      });
      this.dialogVisible = true;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询用户列表 */
    getUserList(e, isFocus) {
      listUser({
        pageNum: 1,
        pageSize: 10,
        userName: isFocus ? "" : e,
      }).then((response) => {
        this.userList = response.rows;
      });
    },
    reset() {
      this.form = {
        year: "2022",
        goal_months: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      };
    },
    /** 提交按钮 */
    submit() {
      docMonth.forEach((val, index) => {
        this.form[val] = this.form.goal_months.flat(1)[index];
      });
      docQuarter.forEach((val, index) => {
        this.form[val] = this.totalArr[index];
      });

      console.log(this.form);
      // return;

      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            update(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.$emit("update:show", false);
                this.$emit("submit");
                this.reset();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            const { targetDayValue, userIdList, year } = this.form;
            add({ targetDayValue, userIdList, year })
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.$emit("update:show", false);
                this.$emit("submit");
                this.reset();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    cancel() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/upload.scss";
@import "@/assets/styles/flex.scss";
@import "@/assets/styles/dialog.scss";

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
.goal-box-step {
  // padding: 20px 0 10px 20px;
  padding: 20px 0;
  font-weight: 600;
  font-size: 16px;
}
.grid-content {
  border: 1px solid #d7d7d7;
  border-radius: 3px;
  padding: 2px;
}
.box1 {
  background: #f9f9f9;
  padding: 5px 10px;
}
.box1 span {
  min-width: fit-content;
}
.inp {
  width: 100px;
}
.box2 {
  background: #fff;
  padding: 5px 10px;
}
</style>
