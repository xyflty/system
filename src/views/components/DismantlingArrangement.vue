// 拆掉配置
<template>
  <div class="dismantling-arrangement">
    <div class="tableCard-container">
      <div class="card-header">
        <div class="card-title">
          <h3>项目拆账配置</h3>
          <!-- <el-switch class="switch" v-model="formData.value1"> </el-switch> -->
          <span
            >项目拆账后 请调整收款节点的金额，
            否则将影响工单作业和财务对账的准确性</span
          >
        </div>
        <div class="card-actions">
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </div>
      <div class="card-content">
        <multi-table
          v-if="projectOptions"
          :Options="projectOptions"
          :isSearchForm="false"
          border
          align="center"
          stripe
          isIndex
          indexLabel="序号"
          :show-summary="true"
          :summary-method="projectSummary"
          :data="formData.orderProjects"
        >
          <template #dismantlePrice="{ scope }">
            <el-input-number
              style="width: 180px"
              :min="0"
              v-model="scope.dismantlePrice"
              :disabled="scope.changeType === 4 || scope.isGift === 1"
            ></el-input-number>
          </template>
          <template #total="{ scope }">
            <div>
              {{
                scope.changeType === 4
                  ? "0.00"
                  : (scope.unitPrice * scope.quantity).toFixed(2)
              }}
            </div>
          </template>
        </multi-table>
      </div>
    </div>
    <div class="tableCard-container">
      <EditorRemark
        title="项目拆账备注"
        :remark.sync="formData.itemDismantleRemark"
        :editorConfig="editorConfig"
      ></EditorRemark>
    </div>
  </div>
</template>

<script>
import MultiTable from "@/components/MultiTable";
import EditorRemark from "@/views/components/EditorRemark";
// 配置信息
import { configData } from "@/mixins/configData/configOptions";

import { xtSynergyOrderSaveItemDismantle } from "@/api/workOrderProcessing/qualification";
import cloneDeep from "lodash/cloneDeep";
export default {
  components: {
    MultiTable,
    EditorRemark,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      projectOptions: null,
      formData: {
        orderProjects: [],
        itemDismantleRemark: "",
      },
      editorConfig: {},
    };
  },
  methods: {
    initOptions() {
      let obj = {
        label: "拆账金额",
        slotName: "dismantlePrice",
        width: 280,
      };
      this.projectOptions = cloneDeep(configData.projectOptions);
      this.projectOptions.pop();
      this.projectOptions.push(obj);
    },
    // 项目数据总计
    projectSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        } else if (index === 7 || index === 9) {
          sums[index] = data.reduce((prev, item) => {
            const value =
              index === 9
                ? Number(item["dismantlePrice"])
                : Number(item[column.property]);
            if (!isNaN(value)) {
              return prev + value;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = index === 9 ? sums[index].toFixed(2) : sums[index];
        } else if (index === 8) {
          sums[index] = data
            .reduce((prev, item) => {
              return (prev +=
                item.changeType !== 4 && item.quantity * item.unitPrice);
            }, 0)
            .toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },

    // 判断拆单总价是否相等
    totalIsEquality() {
      let total = 0;
      let borrowMoneyTotal = 0;
      // 过滤掉停单金额计算总价
      this.formData.orderProjects
        .filter((item) => item.changeType !== 4)
        .forEach((item) => {
          total += item.unitPrice * item.quantity;
          borrowMoneyTotal += item.dismantlePrice ?? 0;
        });

      return total === borrowMoneyTotal;
    },
    // 弹出保存弹出框
    saveCallback() {
      const h = this.$createElement;
      this.$msgbox({
        title: "项目拆账确认",
        message: h("div", null, [
          h(
            "p",
            { style: "color: #333", fontWeight: 600 },
            "请确认是否对项目拆账无误? ，如已的认无误，请点击“提交”! "
          ),
          h(
            "p",
            { style: "color: red" },
            "项目拆账后，请调整收款节点的金额，否则将影响工单作业和财务对账的准确性"
          ),
        ]),
        showCancelButton: true,
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "messageSave",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "保存中...";
            let isFlag = this.totalIsEquality();
            if (isFlag) {
              let sendData = {
                orderId: this.$route.query.id,
                ...this.formData,
              };

              xtSynergyOrderSaveItemDismantle(sendData)
                .then((res) => {
                  if (res.code === 200) {
                    this.$message.success("已提交");
                  } else {
                    this.$message({
                      type: "error",
                      message: res.msg,
                    });
                  }
                  done();
                  instance.confirmButtonLoading = false;
                })
                .catch((err) => {
                  done();
                  instance.confirmButtonLoading = false;
                });
            } else {
              this.$message({
                type: "error",
                message: `拆账金额与实际总价无法对应，请确认`,
              });
              instance.confirmButtonLoading = false;
              done();
            }
          } else {
            this.$message({
              type: "info",
              message: "取消操作",
            });
            done();
          }
        },
      });
    },

    // 保存
    handleSave() {
      this.saveCallback();
    },
  },
  mounted() {
    this.initOptions();

    // 合并合计列
    this.$nextTick(() => {
      let tds = document.querySelectorAll(
        ".el-table .el-table__footer-wrapper tr>td"
      );
      tds.forEach((item, index) => {
        if (index === 0) {
          item.colSpan = 7;
          item.style.textAlign = "center";
        } else if (index == 7 || index == 8 || index == 9) {
        } else {
          item.style.display = "none";
        }
      });
    });
  },
  watch: {
    data: {
      handler() {
        this.formData = {
          orderProjects: this.data.projectData.map((item) => {
            return {
              ...item,
              dismantlePrice: item.dismantlePrice || 0,
            };
          }),
          itemDismantleRemark: this.data.descData.itemDismantleRemark,
        };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang='scss'>
.dismantling-arrangement {
  .tableCard-container {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      display: flex;
      align-items: center;
      h3 {
        color: #333;
        font-weight: 600;
        padding-right: 20px;
      }

      span {
        color: red;
        font-size: 14px;
      }
    }
  }
}
.messageSave {
  width: 700px !important;
}
</style>