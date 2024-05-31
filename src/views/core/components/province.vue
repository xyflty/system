<template>
  <el-cascader
    :options="areaSelectData"
    @change="handleChange"
    :props="{ checkStrictly }"
    class="full-width"
    :size="size"
    v-model="value"
    :placeholder="placeholder"
    :show-all-levels="showAllLevels"
  />
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import { getProvince } from "@/api/province";
import { debounce } from "@/utils/ruoyi";

CodeToText["440405"] = "横琴新区";
Object.defineProperty(TextToCode["广东省"]["珠海市"], "横琴新区", {
  value: {
    code: "440405",
  },
  writable: true,
  enumerable: true,
  configurable: true,
});

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    showAllLevels: {
      type: Boolean,
      default: true,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    selectedOptions: {
      type: Array,
      default: () => [],
    },
    address: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "lagre",
    },
    placeholder: {
      type: String,
      default: "请选择您所在的城市",
    },
  },

  watch: {
    dialogVisible: {
      handler(val) {
        this.value = [];
        this.areaSelectData = JSON.parse(JSON.stringify(regionData));
        this.areaSelectData = this.areaSelectData.filter(
          (item) => item.label == "广东省"
        );
        this.areaSelectData[0].children.forEach((item) => {
          if (val) {
            item.children = undefined;
          } else {
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
          }
        });
      },
      deep: true,
      immediate: true,
    },
    address: {
      handler(val) {
        if (
          val != null &&
          val.length &&
          !(this.value.length || this.selectedOptions.length)
        )
          this.getProvince(val);
      },
    },
    selectedOptions: {
      handler(val) {
        if (val.length) this.value = this.changeProvince(val);
      },
    },
  },
  data() {
    return {
      value: [],
      areaSelectData: [], //省市区三级联动数据
    };
  },
  mounted() {
    this.getProvince = debounce(this.getProvinceName, 600);
  },
  methods: {
    handleChange(value) {
      if (value && value.length) {
        const [province, city, area] = [
          CodeToText[value[0]],
          CodeToText[value[1]],
          CodeToText[value[2]],
        ];
        this.$emit("update:province", province);
        this.$emit("change", { province, city, area });
      }
    },

    getProvinceName(address) {
      getProvince({ address: address || "" }).then((res) => {
        if (res.data.province) {
          const { province, city, district } = res.data;
          this.value = this.changeProvince([province, city, district]);
          this.$emit("change", { province, city, area: district });
        }
      });
    },

    changeProvince(val) {
      const [province, city, district] = val;
      return [
        province && TextToCode[province].code,
        city && TextToCode[province][city].code,
        district && TextToCode[province][city][district].code,
      ].filter(Boolean);
    },
  },
};
</script>
