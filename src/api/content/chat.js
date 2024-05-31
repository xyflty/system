import request from "@/utils/request";

// ai问答
export function chatAi(data) {
  return request({
    url: "/chatAi/chat",
    method: "POST",
    data: data,
  });
}

// 保存ai历史问答
export function aiHistoryAdd(data) {
  return request({
    url: "/zw/aiHistory",
    method: "POST",
    data: data,
  });
}

// 保存ai历史问答
export function aiHistoryList(query) {
  return request({
    url: "/zw/aiHistory/list",
    method: "get",
    params: query,
  });
}

// 删除成功案例
export function delAiHistory(ids) {
  return request({
    url: `/zw/aiHistory/${ids}`,
    method: "delete",
  });
}

// 修改ai历史问答
export function aiHistoryEdit(data) {
  return request({
    url: `/zw/aiHistory`,
    method: "put",
    data: data,
  });
}

// 批量取消收藏
export function aiHistoryEditBatch(data) {
  return request({
    url: `/zw/aiHistory/editBatch`,
    method: "put",
    data: data,
  });
}
