<template>
  <el-dialog v-bind="$attrs" :visible.sync="dialogVisible">
    <div class="xt-container">
      <div class="xt-actions">
        <el-button type="primary" @click="addJobRules"
          >添加工单派发规则</el-button
        >
        <el-button type="primary" @click="saveRules">保存</el-button>
      </div>
      <el-scrollbar style="height: 600px">
        <div class="rules-list">
          <template v-for="(item, index) in xtRulesData">
            <div class="rules-items" :key="item.key">
              <div class="rules-header">
                <span class="rules-title">工单派发规则 {{ index + 1 }}</span>
                <!-- <el-switch
                  v-model="item.enable"
                  @change="(val) => switchChange(val, item)"
                ></el-switch> -->
                <div class="rules-actions">
                  <el-button type="text" @click="delJobRules(item)"
                    >删除工单派发规则</el-button
                  >
                </div>
              </div>
              <el-form
                ref="fromProjectRef"
                class="rulesForm"
                :rules="fomrRules"
                label-width="120px"
                :model="item"
              >
                <el-form-item prop="triggerOrderProjectId" label="触发项目">
                  <el-select
                    v-model="item.triggerOrderProjectId"
                    style="width: 50%"
                    @change="
                      (val) => selectChange(val, 'triggerOrderProject', item)
                    "
                  >
                    <template v-for="option in projectOptions">
                      <el-option
                        :label="option.label"
                        :value="option.value"
                        :key="option.value"
                        :disabled="setDisabled(option, item)"
                      ></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item prop="relateOrderProjectId" label="关联项目">
                  <el-select
                    v-model="item.relateOrderProjectId"
                    style="width: 50%"
                    @change="
                      (val) => selectChange(val, 'relateOrderProject', item)
                    "
                  >
                    <template v-for="option in projectOptions">
                      <el-option
                        :label="option.label"
                        :value="option.value"
                        :key="option.value"
                        :disabled="setDisabled(option, item)"
                      ></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="工单派发规则"
                  v-if="item.relateOrderProjectId && item.triggerOrderProjectId"
                >
                  <RulesSelect
                    :item="item"
                    :relateProject="item.relateOrderProjectOptions"
                    :triggerProject="item.triggerOrderProjectOptions"
                    @delRules="(row) => delRules(item, row)"
                  ></RulesSelect>
                </el-form-item>
                <el-form-item
                  v-if="item.relateOrderProjectId && item.triggerOrderProjectId"
                >
                  <el-button
                    class="rules-add"
                    type="primary"
                    @click="addRules(item)"
                    >新增工单派发规则</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>

<script>
import RulesSelect from "./RulesSelect.vue";
import {
  synergyOrderJobSplitRuleList,
  synergyOrderJobSplitRuleDelete,
  coreOrderProjectGetOrderProjectListByOrderId,
  synergyOrderJobSplitRuleDeleteRuleSub,
  synergyOrderJobSplitRuleUpdateEnable,
  synergyNodeGetProcessNodeByOrderProject,
  synergyOrderJobSplitRuleAdd,
} from "@/api/xt/jobManagement";
export default {
  name: "XtRules",
  components: {
    RulesSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderId: this.id,
      dialogVisible: this.visible,

      rulesOn: true,
      rulesForm: {},
      projectOptions: [], //项目数组

      xtRulesData: [],
      fomrRules: {
        relateOrderProjectId: {
          required: true,
          message: "请选择项目",
          trigger: "change",
        },
        triggerOrderProjectId: {
          required: true,
          message: "请选择关联项目",
          trigger: "change",
        },
      },
    };
  },

  methods: {
    // 项目选中的数据
    selectChange(val, type, row) {
      let rowLabel = this.projectOptions.find(
        (item) => item.value == val
      ).label;
      if (type === "triggerOrderProject") {
        row.triggerOrderProjectName = rowLabel;
        // 关联项目
      } else if (type === "relateOrderProject") {
        //
        row.relateOrderProjectName = rowLabel;
      }
      this.getProcessNodeByOrderProject(val, type, row);
    },
    // 添加工单派发规则
    addRules(row) {
      row.ruleSubList.push({
        key: Date.now(),
        relateProjectNode: "",
        triggerProjectNode: "",
      });
    },
    // 删除工单派发规则
    delRules(row, childrenRow) {
      if (childrenRow.id) {
        let sendData = {
          ruleSubId: childrenRow.id,
        };
        synergyOrderJobSplitRuleDeleteRuleSub(sendData).then((res) => {
          if (res.code === 200) {
            this.getOrderJobSplitRuleList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        row.ruleSubList = row.ruleSubList.filter(
          (item) => item.key !== childrenRow.key
        );
      }
    },
    // 添加工单规则
    addJobRules() {
      this.xtRulesData.push({
        key: Date.now(),
        enable: 0,
        relateOrderProjectId: "",
        relateOrderProjectName: "",
        triggerOrderProjectId: "",
        triggerOrderProjectName: "",
        ruleSubList: [
          {
            relateProjectNode: "",
            triggerProjectNode: "",
          },
        ],
      });
    },
    // 删除方法回调
    delCallBack(row) {
      this.$confirm("此操作将永久删除该规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row.id) {
            let sendData = {
              ruleId: row.id,
            };
            synergyOrderJobSplitRuleDelete(sendData).then((res) => {
              if (res.code === 200) {
                this.getOrderJobSplitRuleList();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            this.xtRulesData = this.xtRulesData.filter(
              (item) => item.key !== row.key
            );
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除工单规则
    delJobRules(row) {
      this.delCallBack(row);
    },
    // 保存规则信息
    saveRules() {
      let flag = true;

      this.$refs.fromProjectRef.forEach((item) => {
        item.validate((valid) => {
          if (valid) {
          } else {
            flag = false;
            return false;
          }
        });
      });
      if (flag) {
        // 判断节点是否为空
        let isEmpty = this.xtRulesData.every((item) => {
          return item.ruleSubList.every(
            (ele) => ele.relateProjectNode && ele.triggerProjectNode
          );
        });
        if (!isEmpty) return this.$message.error("请选择工单派发规则节点");
        // 校验通过，调用接口
        let sendData = this.xtRulesData.map((item) => {
          return {
            ...item,
            orderId: this.orderId,
          };
        });

        synergyOrderJobSplitRuleAdd(sendData).then((res) => {
          if (res.code === 200) {
            this.getOrderJobSplitRuleList();
            this.$message.success("添加成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 校验不通过
      }
    },
    // 是否开启规则回调
    switchChange(val, row) {
      if (row.id) {
        let sendData = {
          id: row.id,
        };

        synergyOrderJobSplitRuleUpdateEnable(sendData).then((res) => {
          if (res.code === 200) {
            // this.getOrderJobSplitRuleList();
            this.$message.success("更新成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 根据项目id获取对应的节点数据
    getProcessNodeByOrderProject(orderProjectId, type, row) {
      let senddata = {
        orderProjectId: orderProjectId,
      };
      synergyNodeGetProcessNodeByOrderProject(senddata).then((res) => {
        if (res.code == 200) {
          let arr = [];
          res.data.forEach((item) => {
            arr.push({
              label: item,
              value: item,
              disabled: false,
            });
          });

          // row[`${type}Options`] = arr;
          this.$set(row, `${type}Options`, arr);
        }
      });
    },
    // 根据订单id获取项目列表
    getOrderProjectListByOrderId() {
      coreOrderProjectGetOrderProjectListByOrderId(this.orderId).then((res) => {
        if (res.code === 200) {
          res.data.forEach((item) => {
            this.projectOptions.push({
              label: item.projectNameWithPrice,
              value: item.id,
              disabled: false,
            });
          });
        }
      });
    },
    async getPromisses(orderProjectId, type, row) {
      let senddata = {
        orderProjectId: orderProjectId,
      };
      const res = await synergyNodeGetProcessNodeByOrderProject(senddata);
      if (res.code == 200) {
        let arr = [];
        res.data.forEach((item) => {
          arr.push({
            label: item,
            value: item,
            disabled: false,
          });
        });

        // row[`${type}Options`] = arr;
        this.$set(row, `${type}Options`, arr);
      }
    },
    // 获取工单拆单规则列表
    getOrderJobSplitRuleList() {
      let sendParmas = {
        orderId: this.orderId,
      };
      synergyOrderJobSplitRuleList(sendParmas).then((res) => {
        if (res.code === 200) {
          if (res.data.length) {
            this.xtRulesData = res.data;
            console.log(this.xtRulesData);
            //

            this.xtRulesData.forEach((item) => {
              if (item.triggerOrderProjectId) {
                this.getPromisses(
                  item.triggerOrderProjectId,
                  "triggerOrderProject",
                  item
                );
              }
              if (item.relateOrderProjectId) {
                this.getPromisses(
                  item.relateOrderProjectId,
                  "relateOrderProject",
                  item
                );
              }
            });
          } else {
            this.xtRulesData = [
              {
                key: Date.now(),
                enable: 0,
                relateOrderProjectId: "",
                relateOrderProjectName: "",
                triggerOrderProjectId: "",
                triggerOrderProjectName: "",
                ruleSubList: [
                  {
                    relateProjectNode: "",
                    triggerProjectNode: "",
                  },
                ],
              },
            ];
          }
        }
      });
    },
  },
  mounted() {
    this.orderId = this.$route.query.id;
    this.$refs.getList = this.getOrderJobSplitRuleList;
    this.getOrderProjectListByOrderId();
  },

  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal) {
      this.$emit("update:visible", newVal);
    },
  },
  computed: {
    setDisabled() {
      return (row, data) => {
        if (!this.xtRulesData.length) return;
        let arr = []; //存储当前选中的关联项目的id
        if (data.triggerOrderProjectId) {
          arr.push(data.triggerOrderProjectId);
        }
        // this.xtRulesData.forEach((item) => {
        //   if (item.relateOrderProjectId) {
        //     arr.push(item.relateOrderProjectId);
        //   }
        // });
        return arr.includes(row.value);
      };
    },
  },
};
</script>

<style lang='scss' scoped>
.xt-container {
  .xt-actions {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.rules-list {
  // height: 600px;
  // overflow-y:auto ;
  .rules-items {
    .rules-header {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      .rules-title {
        color: #333;
        font-weight: 600;
        margin-right: 20px;
      }
      .rules-actions {
        color: #1890ff;
        margin-left: 10px;
        > span {
          padding: 0 10px;
          cursor: pointer;
          &:not(:last-child) {
            border-right: 1px solid #ddd;
          }
        }
      }
    }
    .rulesForm {
      .job-rules {
        display: flex;
        margin-bottom: 15px;
        > span {
          flex: 0 0 340px;
          text-align: center;
        }
      }
      .rules-select {
        .rules-select__item {
          display: flex;
          margin-bottom: 15px;
          > span {
            display: inline-block;
            letter-spacing: 2px;
            margin: 0 8px;
          }
          .rules-select__del {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 25px;
  height: 17px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 12px;
}
</style>