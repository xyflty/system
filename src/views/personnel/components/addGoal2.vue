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
      <el-form-item label="类型" prop="targetType">
        <el-radio-group v-model="form.targetType">
          <el-radio :label="1">成员目标</el-radio>
          <el-radio :label="2">部门目标</el-radio>
          <el-radio :label="3">公司目标</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择部门" v-if="form.targetType == 2" prop="deptId">
        <treeselect
          v-model="form.deptId"
          :multiple="true"
          :options="deptOptions"
          value-consists-of="LEAF_PRIORITY"
          :show-count="true"
          placeholder="请选择归属部门"
        />
      </el-form-item>

      <el-form-item label="选择成员" v-if="form.targetType == 1" prop="userId">
        <el-select
          style="width: 100%"
          v-model="form.userId"
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
          <el-form-item label="目标财年" prop="targetYear">
            <el-date-picker
              v-model="form.targetYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成交金额" prop="priceTarget">
            <el-input
              v-model.number="form.priceTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
            <!-- <el-select v-model="form.type" :clearable="true">
              <el-option
                v-for="item in commonData.targetCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="新增线索数" prop="clueTarget">
            <el-input
              v-model.number="form.clueTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="年度目标" prop="yearTarget">
            <el-input
              v-model="form.yearTarget"
              type="number"
              placeholder="请输入年度目标 金额（元） 数量（个）"
            />
          </el-form-item> -->
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="目标单位" prop="unit">
            <el-select v-model="form.unit">
              <el-option label="万" value="1" />
              <el-option label="亿" value="2" />
              <el-option label="次" value="3" />
              <el-option label="个" value="4" />
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>

      <h2 class="goal-box-step">目标分解</h2>
      <!-- <el-row :gutter="20">
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
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row> -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderCategory" label="订单类型">
          <template slot-scope="scope">
            {{
              scope.row.orderCategory == 1
                ? "综合订单"
                : scope.row.orderCategory == 2
                ? "普通订单"
                : "特殊订单"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="qualificationTarget" label="资质项目数量目标">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.qualificationTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="safetyTarget" label="安证项目数量目标">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.safetyTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="serviceTarget" label="劳务项目数量目标">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.serviceTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="projectTarget" label="成交项目数量目标">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.projectTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :loading="buttonLoading"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";
import { getInfo, add, update, NewAdd } from "@/api/personnel/goal";

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
  name: "AddGoal",
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

          if (this._form != undefined && this._form.id) {
            this._form.type == 1 ? this.getUserList() : this.getTreeselect();
            this.form = JSON.parse(JSON.stringify(this._form));
            this.form.userList = [this._form.userId];
            this.form.deptList = [this._form.deptId];

            let arr = [];
            docMonth.forEach((item, index) => {
              if (this._form.hasOwnProperty(item)) {
                arr.push(this._form[item]);
              }
            });

            let newArr = [];
            // this.form.goal_months = [];
            // this.$set(this.form, "goal_months", []);

            arr.forEach((item, index) => {
              if ((index + 1) % 3 == 0) {
                newArr.push(item);
                // this.form.goal_months.push(newArr);
                newArr = [];
              } else {
                newArr.push(item);
              }
            });
          } else {
            this.form = {
              targetType: 1,
              year: "2022",
              // goal_months: [
              //   [0, 0, 0],
              //   [0, 0, 0],
              //   [0, 0, 0],
              //   [0, 0, 0],
              // ],
            };
          }
        }
        this.getUserList(1, 1);
      },
      deep: true,
    },
    // "form.goal_months": {
    //   handler(n) {
    //     n.forEach((item, index) => {
    //       this.totalArr[index] = eval(item.join("+"));
    //       this.$set(this.form, "yearTarget", eval(this.totalArr.join("+")));
    //     });
    //   },
    //   deep: true,
    // },
  },
  data() {
    return {
      tableData: [
        {
          orderCategory: "1",
          qualificationTarget: "0",
          safetyTarget: "0",
          serviceTarget: "0",
          projectTarget: "0",
        },
        {
          orderCategory: "2",
          qualificationTarget: "0",
          safetyTarget: "0",
          serviceTarget: "0",
          projectTarget: "0",
        },
        {
          orderCategory: "3",
          qualificationTarget: "0",
          safetyTarget: "0",
          serviceTarget: "0",
          projectTarget: "0",
        },
      ],
      userList: [],
      deptOptions: [],
      form: {
        targetType: 1,
        year: "2022",
        // goal_months: [
        //   [0, 0, 0],
        //   [0, 0, 0],
        //   [0, 0, 0],
        //   [0, 0, 0],
        // ],
      },
      totalArr: [],
      buttonLoading: false,

      // 跟进表单校验
      rules: {
        targetType: [{ required: true, message: "不能为空", trigger: "blur" }],
        priceTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
        clueTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
        userId: [{ required: true, message: "不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "不能为空", trigger: "blur" }],
        year: [{ required: true, message: "不能为空", trigger: "blur" }],
        // yearTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
        unit: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getTreeselect();
  },
  methods: {
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
        // goal_months: [
        //   [0, 0, 0],
        //   [0, 0, 0],
        //   [0, 0, 0],
        //   [0, 0, 0],
        // ],
      };
    },
    /** 提交按钮 */
    submit() {
      // docMonth.forEach((val, index) => {
      //   this.form[val] = this.form.goal_months.flat(1)[index];
      // });
      docQuarter.forEach((val, index) => {
        this.form[val] = this.totalArr[index];
      });

      console.log(this.form);
      // return;

      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      //     this.buttonLoading = true;
      //     if (this.form.id != null) {
      //       update(this.form)
      //         .then((response) => {
      //           this.$modal.msgSuccess("修改成功");
      //           this.$emit("update:show", false);
      //           this.$emit("submit");
      //           this.reset();
      //         })
      //         .finally(() => {
      //           this.buttonLoading = false;
      //         });
      //     } else {
      //       NewAdd(this.form)
      //         .then((response) => {
      //           this.$modal.msgSuccess("新增成功");
      //           this.$emit("update:show", false);
      //           this.$emit("submit");
      //           this.reset();
      //         })
      //         .finally(() => {
      //           this.buttonLoading = false;
      //         });
      //     }
      //   }
      // });
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
