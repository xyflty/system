import request from "@/utils/request";

// 查询延迟队列消息列表
export function listDelayedQueue(query) {
  return request({
    url: "/zw/delayedQueue/list",
    method: "get",
    params: query,
  });
}

// 查询延迟队列消息详细
export function getDelayedQueue(id) {
  return request({
    url: "/zw/delayedQueue/" + id,
    method: "get",
  });
}

// 新增延迟队列消息
export function addDelayedQueue(data) {
  return request({
    url: "/zw/delayedQueue",
    method: "post",
    data: data,
  });
}

// 修改延迟队列消息
export function updateDelayedQueue(data) {
  return request({
    url: "/zw/delayedQueue",
    method: "put",
    data: data,
  });
}

// 删除延迟队列消息
export function delDelayedQueue(id) {
  return request({
    url: "/zw/delayedQueue/" + id,
    method: "delete",
  });
}
