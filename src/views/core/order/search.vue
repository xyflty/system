<template>
  <div class="container_box">
    <img
      @click="show = true"
      src="@/assets/images/screen_icon.png"
      class="icon"
      alt=""
    />
    <span @click="show = true">高级搜索</span>

    <el-dialog
      title="高级搜索"
      :visible="show"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="form" :model="form" label-width="0">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="title">
              <el-input v-model="form.keyword" placeholder="关键字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="ourSigner">
              <el-input
                v-model="form.ourSigner"
                placeholder="我方签约人"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="orderStatus">
              <el-select
                style="width: 100%"
                v-model="form.orderStatus"
                :clearable="true"
                placeholder="订单状态"
              >
                <el-option
                  v-for="orderStatus in commonData.orderStatusList"
                  :key="orderStatus.value"
                  :label="orderStatus.label"
                  :value="orderStatus.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="role">
              <el-select
                style="width: 100%"
                v-model="form.role"
                :clearable="true"
                placeholder="角色"
              >
                <el-option
                  v-for="item in commonData.roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="signTime">
              <el-date-picker
                style="width: 100%"
                v-model="dateMonth"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="签单开始日期"
                end-placeholder="签单结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="deptId">
              <treeselect
                v-model="form.deptId"
                style="width: 100%"
                :options="deptOptions"
                value-consists-of="LEAF_PRIORITY"
                :show-count="true"
                placeholder="归属部门"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="followUpPersonIds">
              <el-select
                style="width: 100%"
                v-model="form.followUpPersonIds"
                filterable
                clearable
                placeholder="跟进人员"
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
            <el-form-item label="" prop="paymentMethod">
              <el-select
                style="width: 100%"
                v-model="form.paymentMethod"
                :clearable="true"
                placeholder="付款方式"
              >
                <el-option
                  v-for="paymentMethod in commonData.paymentMethodList"
                  :key="paymentMethod.value"
                  :label="paymentMethod.label"
                  :value="paymentMethod.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="safetyPermitsTimeEndTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="dateMonth1"
                type="monthrange"
                value-format="yyyy-MM"
                range-separator="至"
                start-placeholder="安证开始月份"
                end-placeholder="安证结束月份"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="endBeforeSignTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="form.endBeforeSignTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="前两个月签单"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="expireDateEndTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="dateMonth2"
                type="monthrange"
                value-format="yyyy-MM"
                range-separator="至"
                start-placeholder="资质开始月份"
                end-placeholder="资质结束月份"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
      </el-form>

      <h3>场景管理</h3>
      <div class="box">
        <div
          :class="{ 'box-item': true, 'box-item-choose': index === current }"
          v-for="(item, index) in searchSceneList"
          :key="index"
          @click="currentSelect(index, item)"
        >
          {{ item.name }}
          <img
            @click.stop="delSearch(index, item)"
            src="@/assets/images/remove.png"
            class="remove"
            alt=""
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="showAdd = true"
          >添加场景</el-button
        >
        <div>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">搜索</el-button>
        </div>
      </div>

      <el-dialog
        title="新建快速搜索"
        :visible="showAdd"
        width="600px"
        append-to-body
        :close-on-click-modal="false"
        @close="cancelAdd"
      >
        <el-form-item label="设置名称" prop="title">
          <el-input v-model="name" placeholder="名称" />
        </el-form-item>

        <div slot="footer">
          <el-button @click="cancelAdd">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { listUser } from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapState } from "vuex";

export default {
  name: "PowerSearch",
  watch: {
    type: {
      handler(n) {
        console.log(n);
        let searchScenes = JSON.parse(
          localStorage.getItem("zw_power_search_scenes")
        );
        console.log(searchScenes);
        if (searchScenes != null && searchScenes[n] != undefined) {
          this.searchSceneList = searchScenes[n];
        }
      },
      immediate: true,
    },

    dateMonth: {
      handler(n) {
        console.log(n);
        this.form.beginSignTime = n != null ? n[0] : "";
        this.form.endSignTime = n != null ? n[1] : "";
      },
    },
    dateMonth1: {
      handler(n) {
        this.form.safetyPermitsTimeBeginTime = n != null ? n[0] : "";
        this.form.safetyPermitsTimeEndTime = n != null ? n[1] : "";
      },
    },
    dateMonth2: {
      handler(n) {
        this.form.expireDateBeginTime = n != null ? n[0] : "";
        this.form.expireDateEndTime = n != null ? n[1] : "";
      },
    },
  },
  props: {
    type: {
      Type: Number,
      default: 0,
    },
  },
  components: { Treeselect },
  data() {
    return {
      userList: [],
      deptOptions: [],
      searchSceneList: [],
      current: "",
      form: {},
      show: false,
      showAdd: false,
      name: "",

      dateMonth: [],
      dateMonth1: [],
      dateMonth2: [],
    };
  },
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
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

    currentSelect(index, item) {
      this.current = index;
      this.getUserList();
      this.form = item;
    },
    submit() {
      this.$emit("submit", this.form);
      this.show = false;
      this.reset();
    },
    reset() {
      this.form = {};
      this.dateMonth = [];
      this.dateMonth1 = [];
      this.dateMonth2 = [];
      this.current = "";
    },
    cancel() {
      this.show = false;
      this.form = {};
    },
    add() {
      if (this.name.trim() == "") {
        this.$message.error("设置名称不能为空！");
        return;
      }
      let searchScenes = JSON.parse(
        localStorage.getItem("zw_power_search_scenes")
      );
      if (searchScenes == null) {
        searchScenes = {};
      }

      if (searchScenes[this.type] != undefined) {
        searchScenes[this.type].push({
          name: this.name,
          ...this.form,
        });
      } else {
        searchScenes[this.type] = [
          {
            name: this.name,
            ...this.form,
          },
        ];
      }

      this.searchSceneList = searchScenes[this.type];
      localStorage.setItem(
        "zw_power_search_scenes",
        JSON.stringify(searchScenes)
      );

      this.name = "";
      this.showAdd = false;
    },

    delSearch(index, item) {
      let that = this;
      this.$modal
        .confirm('是否确认删除场景名称为"' + item.name + '"的数据项？')
        .then(function () {
          that.searchSceneList.splice(index, 1);
          let searchScenes = JSON.parse(
            localStorage.getItem("zw_power_search_scenes")
          );
          searchScenes[that.type] = that.searchSceneList;
          localStorage.setItem(
            "zw_power_search_scenes",
            JSON.stringify(searchScenes)
          );
          that.reset();
        })
        .then(() => {
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    cancelAdd() {
      this.showAdd = false;
      this.name = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/dialog.scss";

.container_box {
  display: inline-block;
  margin-left: 20px;
  .icon {
    width: 23px;
    height: 23px;
    vertical-align: middle;
  }
  span {
    color: #1890ff;
    margin-left: 7px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
}

.box {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  .box-item {
    position: relative;
    padding: 10px 20px;
    border-radius: 5px;
    margin: 0 15px 15px 0;
    border: 1px solid #cccccc;
    color: #999;
    &:hover {
      color: #3595fe;
      border: 1px solid #3595fe;
      cursor: pointer;
      .remove {
        display: block;
      }
    }
    .remove {
      display: none;
      position: absolute;
      top: -5px;
      right: -5px;
      width: 13px;
      height: 13px;
    }
  }

  .box-item-choose {
    color: #3595fe;
    border: 1px solid #3595fe;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
