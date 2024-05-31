<template>
  <div class="page-container">
    <SettlementCom type="特殊订单" :isCancel="true" isSelection />
  </div>
</template>

<script>
import SettlementCom from "./SettlementCom.vue";

export default {
  components: {
    SettlementCom,
  },

  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style lang='scss' scoped>
</style>
