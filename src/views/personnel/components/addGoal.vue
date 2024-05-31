<template>
  <!-- 添加跟进记录对话框 -->
  <el-dialog
    :title="addGoalID ? '修改' : '新增'"
    :visible="show"
    width="900px"
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item v-if="!targetType" label="目标类型" prop="targetType">
        <el-radio-group v-model="form.targetType">
          <el-radio v-show="!addGoalID || form.targetType == 1" :label="1"
            >成员目标</el-radio
          >
          <el-radio v-show="!addGoalID || form.targetType == 2" :label="2"
            >部门目标</el-radio
          >
          <el-radio v-show="!addGoalID || form.targetType == 3" :label="3"
            >公司目标</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item
            label="选择部门"
            v-if="form.targetType == 2"
            prop="deptId"
          >
            <!-- <el-cascader
              v-model="form.deptId"
              :options="deptOptions"
              :show-all-levels="false"
              :props="{ checkStrictly: true, value: 'id' }"
              clearable
            ></el-cascader> -->
            <treeselect
              v-model="form.deptId"
              :multiple="false"
              :options="deptOptions"
              value-consists-of="LEAF_PRIORITY"
              :show-count="true"
              placeholder="请选择归属部门"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="选择成员"
            v-if="form.targetType == 1"
            prop="userId"
          >
            <el-select
              v-model="form.userId"
              filterable
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
        </el-col>

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
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="时间类型" prop="timeType">
            <el-radio-group @input="radiogroup" v-model="form.timeType">
              <el-radio :label="1">年份</el-radio>
              <el-radio :label="2">季度</el-radio>
              <el-radio :label="3">月份</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间值" prop="timeTypeValue">
            <!-- <el-input
              v-model.number="form.timeTypeValue"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input> -->
            <el-date-picker
              v-if="form.timeType == 1"
              v-model="form.timeTypeValue"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
            >
            </el-date-picker>
            <el-select
              v-if="form.timeType == 2"
              clearable
              v-model="form.timeTypeValue"
              placeholder="请选择季度"
            >
              <el-option
                v-for="item in quarterArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="form.timeType == 3"
              filterable
              clearable
              remote
              v-model="form.timeTypeValue"
              placeholder="请选择月份"
            >
              <el-option
                v-for="item in weekArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新增线索数" prop="clueTarget">
            <el-input
              @change="handleInput2"
              v-model.number="form.clueTarget"
              class="inp"
              type="number"
              placeholder=""
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <h2 class="goal-box-step">目标分解</h2> -->
      <el-table :data="form.targetSubList" border style="width: 100%">
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
import {
  NewGetInfo,
  NewUpdate,
  NewAdd,
  NewInsertBatchMemberGoals,
} from "@/api/personnel/goal";

import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

export default {
  name: "AddGoal",
  components: { Treeselect },
  props: {
    targetType: {
      type: [Number, Boolean],
    },
    weekArr: {
      type: Array,
    },
    quarterArr: {
      type: Array,
    },
    show: {
      type: Boolean,
      default: false,
    },
    addGoalID: {
      type: [Number, String, Boolean],
    },
  },
  watch: {
    show: {
      handler(n) {
        if (n) {
          if (this.addGoalID) {
            NewGetInfo(this.addGoalID).then((res) => {
              if (!res.data.targetSubList.length) {
                res.data.targetSubList = [
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
                ];
              }

              res.data.targetYear = String(res.data.targetYear);
              res.data.timeTypeValue = String(res.data.timeTypeValue);
              this.form = res.data;
            });
          } else {
            this.reset();
          }
        }
        this.getUserList(1, 1);
      },
      deep: true,
    },
  },
  data() {
    return {
      userList: [],
      deptOptions: [],
      form: {
        timeTypeValue: undefined,
        timeType: 1,
        targetType: 1,
        targetSubList: [
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
      },
      buttonLoading: false,
      // 跟进表单校验
      rules: {
        targetType: [{ required: true, message: "不能为空", trigger: "blur" }],
        priceTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
        clueTarget: [{ required: true, message: "不能为空", trigger: "blur" }],
        userId: [{ required: true, message: "不能为空", trigger: "blur" }],
        deptId: [{ required: true, message: "不能为空", trigger: "blur" }],
        timeTypeValue: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        timeType: [{ required: true, message: "不能为空", trigger: "blur" }],
        targetYear: [{ required: true, message: "不能为空", trigger: "blur" }],
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
        timeTypeValue: undefined,
        timeType: 1,
        targetType: this.targetType ? this.targetType : 1,
        targetSubList: [
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
      };
    },
    /** 提交按钮 */
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.targetType) {
            // console.log(123123);
            // var from = this.form.map((res) => {
            //   console.log(res);
            // });

            let arr = [];
            let obj = {};
            arr = Object.keys(this.form).filter((key) => {
              if (key != "targetType") {
                return key;
              }
            });
            console.log(arr);
            arr.forEach((key) => {
              obj[key] = this.form[key];
            });

            NewInsertBatchMemberGoals(obj)
              .then((response) => {
                this.$modal.msgSuccess("批量新增成功");
                this.$emit("update:show", false);
                this.$emit("submit");
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            if (this.addGoalID) {
              NewUpdate(this.form)
                .then((response) => {
                  this.$modal.msgSuccess("修改成功");
                  this.$emit("update:show", false);
                  this.$emit("submit");
                })
                .finally(() => {
                  this.buttonLoading = false;
                });
            } else {
              NewAdd(this.form)
                .then((response) => {
                  this.$modal.msgSuccess("新增成功");
                  this.$emit("update:show", false);
                  this.$emit("submit");
                })
                .finally(() => {
                  this.buttonLoading = false;
                });
            }
          }
        }
      });
    },
    cancel() {
      this.$emit("update:show", false);
    },
    radiogroup() {
      this.form.timeTypeValue = undefined;
    },
    handleInput2(e) {
      var reg = new RegExp("^(?!00)(?:[0-9]{1,9})$");
      if (!reg.test(e)) {
        this.$modal.msgWarning("输入的值不能大于999999999");
        this.form.clueTarget = undefined;
      }
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
