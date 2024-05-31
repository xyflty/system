import request from "@/utils/request";

// 查询客户记录列表
export function listCustomer(query) {
  return request({
    url: "/zw/customer/list",
    method: "get",
    params: query,
  });
}
// 查询客户列表统计字段
export function customerArchiveListCount(query) {
  return request({
    url: "/zw/customerArchive/listCount",
    method: "get",
    params: query,
  });
}

export function queryCustomer(query) {
  return request({
    url: "/zw/customerArchive/queryCustomer",
    method: "get",
    params: query,
  });
}

//客户转介绍
export function getCustomerReferralList(query) {
  return request({
    url: "/zw/customer/getCustomerReferralList",
    method: "get",
    params: query,
  });
}

//客户转介绍-趋势查询
export function getTrend(query) {
  return request({
    url: "/zw/customerReferralStatistical/getCustomerReferralTrend",
    method: "get",
    params: query,
  });
}

// 查询客户记录详细
export function getCustomerArchive(id) {
  return request({
    url: "/zw/customer/" + id,
    method: "get",
  });
}

// 新增客户记录
export function addCustomer(data) {
  return request({
    url: "/zw/customer",
    method: "post",
    data: data,
  });
}

// 修改客户记录
export function updateCustomer(data) {
  return request({
    url: "/zw/customer",
    method: "put",
    data: data,
  });
}

// 删除客户记录
export function delCustomer(id) {
  return request({
    url: "/zw/customer/" + id,
    method: "delete",
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/customer/setTop",
    method: "put",
    data: data,
  });
}

// 跟进
export function followUp(data) {
  return request({
    url: "/zw/customer/followUp",
    method: "post",
    data: data,
  });
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/zw/customer/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 查询重复客户
export function getDistinctCompanyList(query) {
  return request({
    url: "/zw/customer/distinctCompanyList",
    method: "get",
    params: query,
  });
}

// 资质列表查询
export function getQualification(query) {
  return request({
    url: "/core/buildingQualification/getQualification",
    method: "get",
    params: query,
  });
}

// 通过公司名获取商机项目
export function getByCompanyName(query) {
  return request({
    url: "/zw/opportunityProject/getByCompanyName",
    method: "get",
    params: query,
  });
}

// 放入公海
export function putInSea(data) {
  return request({
    url: "/zw/customerSea/putInSea",
    method: "post",
    data: data,
  });
}

export function associateCustomerData(query) {
  return request({
    url: `/zw/customerArchive/associateData`,
    method: "get",
    params: query,
  });
}
