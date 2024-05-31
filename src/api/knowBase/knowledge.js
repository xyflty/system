import request from "@/utils/request";

// 查询知识库内容管理列表
export function baseCantentList(query) {
  return request({
    url: "/system/baseCantent/list",
    method: "get",
    params: query,
  });
}

// 新增知识库内容管理
export function baseCantentAdd(data) {
  return request({
    url: "/system/baseCantent",
    method: "post",
    data,
  });
}

// 修改知识库内容管理
export function baseCantentEdit(data) {
  return request({
    url: "/system/baseCantent",
    method: "put",
    data,
  });
}

// 删除知识库分类
export function baseCategoryDel(ids) {
  return request({
    url: `/system/baseCategory/${ids}`,
    method: "delete",
  });
}
