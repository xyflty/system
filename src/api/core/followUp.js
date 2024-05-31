import request from "@/utils/request";

// 查询跟进记录列表
export function listFollowUp(query) {
  return request({
    url: "/zw/followUp/list",
    method: "get",
    params: query,
  });
}

// 查询跟进记录列表(线索详情跟进记录)
export function followUpDetailList(query) {
  return request({
    url: "/zw/followUp/detailList",
    method: "get",
    params: query,
  });
}

// 查询跟进记录详细
export function getFollowUp(id) {
  return request({
    url: "/zw/followUp/" + id,
    method: "get",
  });
}

// 查询跟进记录详细
export function getInfo(query) {
  return request({
    url: "/zw/followUp/getDetail",
    method: "get",
    params: query,
  });
}

// 新增跟进记录
export function addFollowUp(data) {
  return request({
    url: "/zw/followUp",
    method: "post",
    data: data,
  });
}

// 修改跟进记录
export function updateFollowUp(data) {
  return request({
    url: "/zw/followUp",
    method: "put",
    data: data,
  });
}

// 删除跟进记录
export function delFollowUp(id) {
  return request({
    url: "/zw/followUp/" + id,
    method: "delete",
  });
}

// 查询跟进评论详细
export function getCommentList(query) {
  return request({
    url: "/zw/followUpComment/queryParentChildComment",
    method: "get",
    params: query,
  });
}

// 提交评论
export function addComment(data) {
  return request({
    url: "/zw/followUpComment",
    method: "post",
    data: data,
  });
}
