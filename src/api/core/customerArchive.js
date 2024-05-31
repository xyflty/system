import request from "@/utils/request";

// 查询客户记录列表
export function listCustomerArchive(query) {
  return request({
    url: "/zw/customerArchive/list",
    method: "get",
    params: query,
  });
}

// 查询客户记录详细
export function getCustomerArchive(id) {
  return request({
    url: "/zw/customerArchive/" + id,
    method: "get",
  });
}

export function updateCustomerArchive(data) {
  return request({
    url: "/zw/customerArchive",
    method: "put",
    data: data,
  });
}

// 新增客户记录
export function addCustomerArchive(data) {
  return request({
    url: "/zw/customerArchive",
    method: "post",
    data: data,
  });
}

//客户转介绍
export function getCustomerReferralList(query) {
  return request({
    url: "/zw/customerArchive/getCustomerReferralList",
    method: "get",
    params: query,
  });
}

// 置顶或取消置顶
export function setTop(data) {
  return request({
    url: "/zw/customerArchive/setTop",
    method: "put",
    data: data,
  });
}
