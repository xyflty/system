<template>
  <div class="page-container">
    <SettlementCom type="普通订单" isMergeCells isDealTable />
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
