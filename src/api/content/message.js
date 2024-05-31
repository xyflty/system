import request from "@/utils/request";

// 查询消息列表
export function list(query) {
  return request({
    url: "/zw/message/list",
    method: "get",
    params: query,
  });
}

// 查询消息详情
export function getInfo(id) {
  return request({
    url: "/zw/message/" + id,
    method: "get",
  });
}
