<template>
  <el-card style="margin-top: 20px">
    <div slot="header" class="header-box">
      <div class="msg-box2">
        <span> 城市分配占比 </span>
      </div>
      <!-- <el-button plain>导出数据</el-button> -->
    </div>

    <el-table
      :data="cityData"
      stripe
      style="width: 100%"
      border
      v-loading="loading"
    >
      <!-- <el-table-column prop="x" label="时间" align="center" /> -->

      <el-table-column
        prop="deptName"
        label="主体\部门"
        align="center"
        min-width="80"
      />
      <template v-if="type === 'detail'">
        <el-table-column
          prop="userName"
          label="姓名"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="postName"
          label="职务"
          align="center"
          min-width="120"
        />
      </template>
      <template v-for="(title, index) in allCityName">
        <el-table-column
          align="center"
          :key="index"
          :label="title.cityName"
          sortable
        >
          <template slot-scope="scope">
            <span
              class="click--active"
              @click="handleClick(scope.row, title.cityName)"
              >{{ scope.row.cityDistributeList[index].cityCount }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          :label="`${title.cityName}占比`"
          :key="title.cityName"
          align="center"
          min-width="100px"
          sortable
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.cityDistributeList[index].cityPercentage }}%</span
            >
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="type === 'drill'"
        align="center"
        prop=""
        width="180"
        fixed="right"
        label="详细分析"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handlePieClick(row, 'viewUser')"
            >钻取用户</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="handlePieClick(row, 'drill')"
            >钻取</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="getCityData"
      :autoScroll="false"
    />
  </el-card>
</template>

<script>
import { regionData } from "element-china-area-data";

const regionDataArr = regionData.filter((item) => item.label == "广东省");
regionDataArr[0].children.forEach((item) => {
  if (item.label == "珠海市") {
    item.children.push({
      label: "横琴新区",
      value: "440405",
    });
  }
  item.children.forEach((val, index, array) => {
    if (val.label == "市辖区") {
      array.splice(0, 1);
    }
  });
});

let cityNameList = regionDataArr[0].children.map((v) => {
  return {
    cityCount: 0,
    cityName: v.label,
    cityPercentage: "0.00",
  };
});

export default {
  props: {
    parmas: {
      type: Object,
      required: true,
    },
    api: Function,
    type: {
      type: String,
      default: "drill", // detail 和drill
    },
  },

  data() {
    return {
      cityData: [],
      loading: false,
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
      },
      allCityName: cityNameList,
    };
  },
  methods: {
    getCityData() {
      this.loading = true;
      this.api({
        ...this.query,
        ...this.parmas,
      }).then((res) => {
        this.total = res.total;
        this.cityData = res.rows;
        this.cityData.forEach((item) => {
          item.cityDistributeList = cityNameList.map((city) => {
            item.cityDistributeList.forEach((ele) => {
              if (city.cityName == ele.cityName) {
                city = ele;
              }
            });
            return city;
          });
        });

        this.loading = false;
      });
    },

    // 点击数字跳转到
    handleClick(row, cityName) {
      const { name } = this.$route;
      let storageData = {};
      if (sessionStorage.getItem("STORAGE_KEY")) {
        storageData = JSON.parse(sessionStorage.getItem("STORAGE_KEY"));
      }

      storageData[name] = this.parmas;

      sessionStorage.setItem("STORAGE_KEY", JSON.stringify(storageData));

      const query = {
        type: "cityDistribute",
        deptIds: [row.deptId].join(","),
        userId: row.userId ? row.userId : this.parmas.userId,
        dateType: this.parmas.dateType,
        endTime: this.parmas.endTime,
        beginTime: this.parmas.beginTime,
        dataSourceType: cityName,
      };

      // 最底层数据展示
      this.$router.push({
        name: "Pielist",
        query: query,
      });
    },
    handlePieClick(row, type) {
      this.$emit("pieClick", { type: type, row });
    },
  },
  mounted() {
    this.getCityData();
  },
  watch: {
    parmas: {
      handler(newval) {
        this.getCityData();
      },
    },
    deep: true,
  },
};
</script>

<style lang='scss' scoped>
.click--active {
  color: #409eff;
  cursor: pointer;
}
</style>