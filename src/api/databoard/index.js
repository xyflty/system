import request from "@/utils/request";

// 左侧上方-累计订单销售
export function getOrderSalesCount() {
  return request({
    url: "/zw/dataBoard/getOrderSalesCount",
    method: "get",
  });
}
export function setOrderSalesCount(data) {
  return request({
    url: "/zw/dataBoard/setOrderSalesCount",
    method: "post",
    data: data,
  });
}

// 左侧中下-各类型业务数量
export function getBusinessCount() {
  return request({
    url: "/zw/dataBoard/getBusinessCount",
    method: "get",
  });
}
export function setBusinessCount(data) {
  return request({
    url: "/zw/dataBoard/setBusinessCount",
    method: "post",
    data: data,
  });
}

// 中部上方地图-获取城市销售数据
export function getCitySales() {
  return request({
    url: "/zw/dataBoard/getCitySales",
    method: "get",
  });
}
export function setCitySales(data) {
  return request({
    url: "/zw/dataBoard/setCitySales",
    method: "post",
    data: data,
  });
}

// 中部下方-获取客户成交动态
export function getCustomerDeal() {
  return request({
    url: "/zw/dataBoard/getCustomerDeal",
    method: "get",
  });
}
export function setCustomerDeal(data) {
  return request({
    url: "/zw/dataBoard/setCustomerDeal",
    method: "post",
    data,
  });
}

// 右侧上方-获取每月销售额
export function getMonthSales() {
  return request({
    url: "/zw/dataBoard/getMonthSales",
    method: "get",
  });
}
export function setMonthSales(data) {
  return request({
    url: "/zw/dataBoard/setMonthSales",
    method: "post",
    data,
  });
}
// 右侧中部-获取年各月同比数据
export function getYearMonthContrast() {
  return request({
    url: "/zw/dataBoard/getYearMonthContrast",
    method: "get",
  });
}
export function setYearMonthContrast(data) {
  return request({
    url: "/zw/dataBoard/setYearMonthContrast",
    method: "post",
    data,
  });
}

// 右侧下方-获取部门销售额
export function getDeptSales() {
  return request({
    url: "/zw/dataBoard/getDeptSales",
    method: "get",
  });
}
export function setDeptSales(data) {
  return request({
    url: "/zw/dataBoard/setDeptSales",
    method: "post",
    data,
  });
}
