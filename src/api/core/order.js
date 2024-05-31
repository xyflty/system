import request from "@/utils/request";

// 查询订单记录列表
export function listOrder(query) {
  return request({
    url: "/zw/order/list",
    method: "get",
    params: query,
  });
}

// 查询订单列表统计字段
export function orderListCount(query) {
  return request({
    url: "/zw/order/listCount",
    method: "get",
    params: query,
  });
}

// 查询订单记录详细
export function getOrder(id) {
  return request({
    url: "/zw/order/" + id,
    method: "get",
  });
}

// 新增订单记录
export function addOrder(data) {
  return request({
    url: "/zw/order",
    method: "post",
    data: data,
  });
}

// 修改订单记录
export function updateOrder(data) {
  return request({
    url: "/zw/order",
    method: "put",
    data: data,
  });
}

// 删除订单记录
export function delOrder(id) {
  return request({
    url: "/zw/order/" + id,
    method: "delete",
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/order/setTop",
    method: "put",
    data: data,
  });
}

// 跟进
export function followUp(data) {
  return request({
    url: "/zw/order/followUp",
    method: "post",
    data: data,
  });
}

// 删除订单项目
export function delOrderProject(id) {
  return request({
    url: `/core/orderProject/${id}`,
    method: "DELETE",
  });
}

// 查询客户详情 订单记录列表
export function customerListOrder(query) {
  return request({
    url: "/zw/order/getOrderListByCompanyName",
    method: "get",
    params: query,
  });
}

// 删除客户投标加分项
export function delCustomerTender(id) {
  return request({
    url: "/core/customerTender/" + id,
    method: "delete",
  });
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/zw/order/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 获取订单记录详细信息
export function synergyOrder(id) {
  return request({
    url: `/xt/synergyOrder/${id}`,
    method: "get",
  });
}
// 二次配置
export function zwOrderGetOrderManageList(query) {
  return request({
    url: "/zw/order/getOrderManageList",
    method: "get",
    params: query,
  });
}
// 修改客户帐号信息
export function coreCustomerAccount(data) {
  return request({
    url: "/core/customerAccount",
    method: "put",
    data,
  });
}

// 按 id 级联删除订单记录
export function zwOrderDel(id) {
  return request({
    url: `/zw/order/${id}`,
    method: "DELETE",
  });
}

export function associateOrderData(query) {
  return request({
    url: `/zw/order/associateData`,
    method: "get",
    params: query,
  });
}
