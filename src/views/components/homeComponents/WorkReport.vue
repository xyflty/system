// 工作报告
<template>
  <div>
    <el-card :class="`box-card font-${size}`">
      <div slot="header" class="card-header">
        <span class="card_header--title">工作报告</span>
        <div>
          <el-select
            size="mini"
            v-model="dailyType"
            placeholder="请选择"
            style="margin-right: 10px; max-width: 200px"
          >
            <template v-for="option in reportType">
              <el-option
                v-if="!option.hide"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
              </el-option>
            </template>
          </el-select>
          <el-button
            :loading="visible"
            size="mini"
            :disabled="dailyType !== 1"
            @click="handleAdd"
            >写新报告</el-button
          >
          <el-button size="mini" @click="handleMore">查看更多</el-button>
        </div>
      </div>

      <div class="card-content">
        <dv-scroll-board
          v-if="config.data && config.data.length"
          ref="scrollBoard"
          :config="config"
          style="width: 100%; height: 275px"
          @click="handleClick"
        />
        <el-empty v-else description="描述文字"></el-empty>
      </div>
    </el-card>
    <!-- 新增编辑操作 -->
    <ReportModel
      :visible.sync="visible"
      :form="form"
      :type="formType"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { list, add, dailyRead, updateIsRead } from "@/api/content/daily.js";
import { systemResourceAnnex } from "@/api/workOrderProcessing/qualification";

import { formatterCallback } from "@/utils/common";

import ReportModel from "@/views/components/ReportModel";
import { mapState } from "vuex";
export default {
  name: "WorkReport",
  components: {
    ReportModel,
  },
  props: {
    size: {
      type: String,
      default: "mini",
    },
  },
  data() {
    return {
      // 报告类型
      reportType: [
        {
          label: "我的工作报告",
          value: 1,
          hide: false,
        },
        {
          label: "团队的工作报告",
          value: 2,
          hide: true,
        },
        {
          label: "抄送抄送给我的工作报告",
          value: 3,
          hide: false,
        },
      ],
      config: {
        data: [],
        oddRowBGC: "#fafafa",
        evenRowBGC: "#fff",
        columnWidth: [300],
        align: ["center", "center", "center", "center", "center"],
        rowNum: 6,
      },

      dailyType: 1,

      reportData: [],

      visible: false,
      form: {},
      formType: "add",
    };
  },
  methods: {
    // 查看详情
    handleClick({ row, ceil, rowIndex, columnIndex }) {
      let id = this.reportData[rowIndex].id;

      if (columnIndex === 4) {
        if ([2, 3].includes(this.dailyType)) {
          let fn = null;
          if (this.dailyType === 2) {
            fn = dailyRead;
          } else if (this.dailyType === 3) {
            fn = updateIsRead;
          }
          // 部门主管点击详情，更新已预览
          fn({ dailyId: id }).then((res) => {
            if (res.code === 200) {
              this.$router.push({
                name: "Daily/detail",
                query: { id, type: this.dailyType },
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$router.push({
            name: "Daily/detail",
            query: { id, type: this.dailyType },
          });
        }
      }
    },
    getList() {
      let sendParams = {
        param: this.dailyType,
        pageNum: 1,
        pageSize: 10,
      };
      list(sendParams).then((res) => {
        this.reportData = res.rows;
        let newData = [];
        res.rows.forEach((item) => {
          newData.push([
            `<span>${item.title}</span>`,
            `<span>${formatterCallback(
              this.commonData.reportTypeEnum,
              item.dailyType
            )}</span>`,
            `<span>${item.userName}</span>`,
            `<span class='cricle ${item.isRead === 1 && "cricle-color"}''>${
              ["未批阅", "已批阅"][item.isRead]
            }</span>`,
            `<span class='is--click'>详情</span>`,
          ]);
        });

        this.config = {
          ...this.config,
          data: newData,
        };
      });
    },

    // 是否显示部门工作报告
    showDept() {
      const { treeList } = this.user;
      if (treeList && treeList.length) {
        this.reportType[1].hide = false;
      } else {
        this.reportType[1].hide = true;
      }
    },

    // 新增
    handleAdd() {
      this.formType = "add";
      this.visible = true;
    },

    handleSubmit(form, done) {
      const {
        fileUpload,
        auditUserIds,
        ccPersonUserIds,
        dailyType,
        dailyTime,
        workSummary,
        workPlan,
      } = form;
      let sendData = {
        dailyType,
        dailyTime,
        workSummary,
        workPlan,
        deptId: this.user.user.deptId,
        userId: this.user.user.userId,
        auditUserIds: auditUserIds.join(","),
        ccPersonUserIds: ccPersonUserIds.join(","),
      };

      add(sendData)
        .then(async (res) => {
          if (res.code === 200) {
            if (fileUpload && fileUpload.length) {
              fileUpload.forEach((item) => (item.uploadedId = res.data));

              await systemResourceAnnex(fileUpload);
            }
            this.getList();
            done();
            this.visible = false;
            this.$message.success("新增成功");
            sessionStorage.removeItem("DRAFT_KEY");
          } else {
            this.$message.error(res.msg);
            done();
          }
        })
        .catch((err) => {
          done();
        });
    },

    // 查看更多
    handleMore() {
      this.$router.push({
        name: "Daily",
        query: { type: this.dailyType + "" },
      });
    },
  },
  mounted() {
    this.getList();
    this.showDept();
  },

  watch: {
    dailyType(newVal) {
      this.getList();
    },
  },

  computed: {
    ...mapState(["user"]),
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-card__header {
  height: 58px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.card_header--title {
  flex: 0 0 140px;
  font-weight: 600;
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);
}

.font-mini {
  font-size: 14px;
}

.font-default {
  font-size: 16px;
}
.card-content {
  height: 275px;
}
::v-deep .dv-scroll-board {
  width: 100%;
  .rows .ceil {
    color: #333 !important;
    .is--click {
      cursor: pointer;
      color: #409eff;
    }
    .cricle {
      display: flex;
      align-items: center;
      &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #f56c6c;
        border: none;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .cricle-color {
      &::before {
        background: #67c23a;
      }
    }
  }
}
</style>
<style lang="scss">
</style>