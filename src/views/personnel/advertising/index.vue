<template>
  <el-card class="box-card">
    <el-descriptions
      class="margin-top"
      title=""
      :column="2"
      size="large"
      border
    >
      <template slot="extra">
        <el-button type="primary" size="small" @click="dialogVisible = true"
          >编辑</el-button
        >
      </template>

      <el-descriptions-item>
        <div slot="label" class="title-moji">优秀团队</div>
        <p>
          {{
            detail.excellentTeamName != undefined
              ? detail.excellentTeamName
              : ""
          }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item>
        <div v-if="showNowDeptid == false" slot="label" class="title-moji">
          茁壮奖
        </div>
        <div v-if="showNowDeptid == true" slot="label" class="title-moji">
          月度营收前三
        </div>
        <p>
          {{ detail.redListStaff != undefined ? detail.redListStaff : "" }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item>
        <div v-if="showNowDeptid == false" slot="label" class="title-moji">
          常青奖
        </div>
        <div v-if="showNowDeptid == true" slot="label" class="title-moji">
          月度晋级
        </div>
        <p>
          {{
            detail.evergreenAwardListStaff != undefined
              ? detail.evergreenAwardListStaff
              : ""
          }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item>
        <div slot="label" class="title-moji">加油榜</div>
        <p>
          {{ detail.blackListStaff != undefined ? detail.blackListStaff : "" }}
        </p>
      </el-descriptions-item>
    </el-descriptions>

    <h2 style="margin: 40px 0 20px">荣誉墙-最佳记录保持者</h2>
    <el-table :data="detail.wallOfHonor" stripe style="width: 100%" border>
      <el-table-column prop="teamName" label="队伍名称" width="180">
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" width="180">
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="copyWriting" label="破记录详情"> </el-table-column>
    </el-table>
    <h2 v-if="showNowDeptid == false" style="margin: 40px 0 20px">团队目标</h2>
    <h2 v-if="showNowDeptid == true" style="margin: 40px 0 20px">有望晋级</h2>

    <!-- <el-descriptions v-if="showNowDeptid == true" class="text-person" title="" size="large" border>
      <el-descriptions-item>
        <div slot="label" class="title-personnel">队伍/人员名称 </div>
        <div class="personnel-all" v-for="(key, i) in form.expectedToAdvanceList" :key="i">
          <p class="title-one" >{{ key }} ;</p>
        </div>
      </el-descriptions-item>
    </el-descriptions> -->

    <el-table
      v-if="showNowDeptid == true"
      :data="form.expectedToAdvanceList"
      stripe
      border
    >
      <el-table-column prop="" label="队伍名称/人员" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="showNowDeptid == false"
      :data="detail.departmentPerformance"
      stripe
      border
    >
      <el-table-column
        prop="deptName"
        label="队伍名称"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="" label="线索数量" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.clueTarget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交金额" align="center" prop="type" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.priceTarget }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="设置弹窗信息" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="优秀团队名称">
          <el-input v-model="form.teamName"></el-input>
        </el-form-item>
        <el-form-item v-if="showNowDeptid == false" label="茁壮奖">
          <el-input v-model="form.redListStaff"></el-input>
        </el-form-item>
        <el-form-item v-if="showNowDeptid == false" label="常青奖">
          <el-input v-model="form.evergreenAward"></el-input>
        </el-form-item>
        <el-form-item v-if="showNowDeptid == true" label="月度营收前三">
          <el-input v-model="form.redListStaff"></el-input>
        </el-form-item>
        <el-form-item v-if="showNowDeptid == true" label="月度晋级">
          <el-input v-model="form.evergreenAward"></el-input>
        </el-form-item>
        <el-form-item label="加油榜">
          <el-input v-model="form.blackListStaff"></el-input>
        </el-form-item>
        <el-form-item label="荣誉墙">
          <el-row
            v-for="(item, index) in form.wallOfFameBoList"
            :key="index"
            style="margin-bottom: 15px"
          >
            <el-col :span="4" style="margin-right: 10px">
              <el-input
                v-model="item.teamName"
                placeholder="队伍名称"
              ></el-input
            ></el-col>
            <el-col :span="4" style="margin-right: 10px">
              <el-input v-model="item.salesman" placeholder="业务员"></el-input
            ></el-col>
            <el-col :span="4" style="margin-right: 10px">
              <el-input v-model="item.date" placeholder="日期"></el-input
            ></el-col>
            <el-col :span="6" style="margin-right: 10px">
              <!-- <el-input
                v-model="item.copyWriting"
                placeholder="破记录详情"
              ></el-input> -->

              <el-input
                v-if="showNowDeptid == false"
                placeholder="数量"
                v-model="item.count"
                class="input-with-select"
              >
                <el-select
                  v-model="item.type"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 150px"
                >
                  <el-option label="当日线索有效添加量" :value="1"></el-option>
                  <el-option
                    label="成交安证订单（含劳务资质）单量"
                    :value="2"
                  ></el-option>
                  <el-option label="成交单量" :value="3"></el-option>
                  <el-option label="当月线索有效添加量" :value="4"></el-option>
                  <el-option label="当月资质延期成交量" :value="6"></el-option>
                </el-select>
              </el-input>

              <template v-if="showNowDeptid == true">
                <div v-if="item.type == 5" class="select-box">
                  <el-select
                    class="select-options"
                    v-model="item.type"
                    placeholder="请选择"
                    style="width: 150px"
                  >
                    <el-option
                      label="当日线索有效添加量"
                      :value="1"
                    ></el-option>
                    <el-option
                      label="成交安证订单（含劳务资质）单量"
                      :value="2"
                    ></el-option>
                    <el-option label="成交单量" :value="3"></el-option>
                    <el-option
                      label="当月线索有效添加量"
                      :value="4"
                    ></el-option>
                    <el-option
                      label="营收排名持续保持前五"
                      :value="5"
                    ></el-option>
                    <el-option
                      label="当月资质延期成交量"
                      :value="6"
                    ></el-option>
                  </el-select>
                  <el-input
                    :disabled="true"
                    placeholder="数量"
                    class="input-with-select2"
                  >
                  </el-input>
                </div>

                <template v-if="item.type !== 5">
                  <el-input
                    :disabled="false"
                    placeholder="数量"
                    v-model="item.count"
                    class="input-with-select"
                  >
                    <el-select
                      v-model="item.type"
                      slot="prepend"
                      placeholder="请选择"
                      style="width: 150px"
                    >
                      <el-option
                        label="当日线索有效添加量"
                        :value="1"
                      ></el-option>
                      <el-option
                        label="成交安证订单（含劳务资质）单量"
                        :value="2"
                      ></el-option>
                      <el-option label="成交单量" :value="3"></el-option>
                      <el-option
                        label="当月线索有效添加量"
                        :value="4"
                      ></el-option>
                      <el-option
                        label="营收排名持续保持前五"
                        :value="5"
                      ></el-option>
                      <el-option
                        label="当月资质延期成交量"
                        :value="6"
                      ></el-option>
                    </el-select>
                  </el-input>
                </template>
              </template>
            </el-col>
            <el-col :span="4" style="margin-right: 10px">
              <el-button
                type="danger"
                @click.prevent="form.wallOfFameBoList.splice(index, 1)"
                >删除</el-button
              >
            </el-col>
          </el-row>
          <el-button type="primary" @click="form.wallOfFameBoList.push({})"
            >增加</el-button
          >
        </el-form-item>

        <el-form-item label="有望晋级" v-if="showNowDeptid == true">
          <el-row
            v-for="(item, index) in form.expectedToAdvanceList"
            :key="index"
            style="margin-bottom: 15px"
          >
            <el-col :span="7" style="margin-right: 10px">
              <el-input
                v-model="form.expectedToAdvanceList[index]"
                placeholder="请输入队伍和人员名称"
              ></el-input>
            </el-col>
            <el-col :span="7" style="margin-right: 10px">
              <el-button
                type="danger"
                @click.prevent="form.expectedToAdvanceList.splice(index, 1)"
                >删除</el-button
              >
            </el-col>
          </el-row>

          <el-button type="primary" @click="addExpectedToAdvanceList"
            >增加</el-button
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAdvertising, setAdvertising } from "@/api/ad";

import { mapState } from "vuex";

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        teamName: "",
        redListStaff: "",
        evergreenAward: "",
        blackListStaff: "",

        expectedToAdvanceList: [],
        wallOfFameBoList: [],
      },
      detail: "",
      nowDeptid: "",
      showNowDeptid: false,
    };
  },
  mounted() {
    this.getAdvertising();
    this.nowDeptid = this.user.deptId;
    if (this.nowDeptid == 1580402169644216321) {
      this.showNowDeptid = true;
    } else {
      this.showNowDeptid = false;
    }
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
    ...mapState(["user"]),
  },

  methods: {
    getGoalTextStr(item) {
      let strArr = [
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
      let month = 0;
      let value = 0;
      strArr.some((val, index) => {
        if (item[val]) {
          month = index;
          value = item[val];
          return true;
        }
      });

      return {
        month,
        value,
      };
    },
    getAdvertising() {
      getAdvertising().then((res) => {
        this.detail = res.data;
        const {
          wallOfHonor,
          redListStaff,
          evergreenAwardListStaff,
          blackListStaff,
          excellentTeamName,
          expectedToAdvanceList,
        } = JSON.parse(JSON.stringify(res.data));

        if (wallOfHonor == null) {
          this.form.wallOfFameBoList = [];
        } else {
          this.form.wallOfFameBoList = wallOfHonor;
        }
        if (expectedToAdvanceList == null) {
          this.form.expectedToAdvanceList = [];
        } else {
          this.form.expectedToAdvanceList = expectedToAdvanceList;
        }

        this.form.teamName = excellentTeamName;
        this.form.redListStaff = redListStaff;
        this.form.evergreenAward = evergreenAwardListStaff;
        this.form.blackListStaff = blackListStaff;

        this.form.wallOfFameBoList.forEach((item) => {
          let { type, count } = this.getTextStr(item.copyWriting);
          this.$set(item, "type", type);
          this.$set(item, "count", count);
        });
      });
    },
    addExpectedToAdvanceList() {
      this.$set(
        this.form.expectedToAdvanceList,
        this.form.expectedToAdvanceList.length,
        ""
      );
    },
    getTextStr(str) {
      let type =
        str.indexOf("当日线索有效添加量添加") != -1
          ? 1
          : str.indexOf("成交安证订单") != -1
          ? 2
          : str.indexOf("成交单量") != -1
          ? 3
          : str.indexOf("当月线索有效添加量") != -1
          ? 4
          : str.indexOf("当月资质延期成交量") != -1
          ? 6
          : 5;
      return {
        type,
        count: str.replace(/[^0-9]/gi, ""),
      };
    },
    setTextStr(type, count) {
      count = count == undefined ? 0 : count;
      return [
        `当日线索有效添加量添加${count}个`,
        `成交安证订单（含劳务资质）单量${count}单`,
        `成交单量${count}单`,
        `当月线索有效添加量${count}个`,
        `营收排名持续保持前五`,
        `当月资质延期成交量${count}个`,
      ][type - 1];
    },
    onSubmit() {
      if (this.form.wallOfFameBoList) {
        let NotAllow = this.form.wallOfFameBoList.some(
          (item) => item.type == undefined
        );
        if (NotAllow) {
          this.$message.error("请先选择对应文案规则");
          return;
        }
        this.form.wallOfFameBoList.forEach((item) => {
          item.copyWriting = this.setTextStr(item.type, item.count);
        });
      }

      setAdvertising(this.form).then((res) => {
        this.dialogVisible = false;
        this.$message.success("修改成功");
        this.getAdvertising();
      });
    },

    setInput(type) {
      if (type == 5) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title-moji {
  color: black;
  letter-spacing: 1px;
}

.select-box {
  display: flex;
  flex-wrap: nowrap;
}

.input-with-select2 {
  width: 97px;
}

.input-with-select2 ::v-deep .el-input__inner {
  // width: 94.3px;
  border-radius: 0 4px 4px 0;
}

.select-options ::v-deep .el-input__inner {
  background-color: rgb(245, 247, 250);
  color: rgb(158, 161, 166);
  border-radius: 4px 0 0 4px;
  // width: 200px;
}

.text-person {
  margin-bottom: 20px;
  font-size: 15px;
  width: 400px;
  text-align: center;
}

.title-personnel {
  margin: 0;
  margin-left: 10px;
  width: 145px;
  height: 22.5px;
  text-align: center;
  color: black;
}

.personnel-all {
  width: 1000px;
  min-width: 500px;
  margin-right: 10px;
}

.title-one {
  display: inline-block;
}
</style>
