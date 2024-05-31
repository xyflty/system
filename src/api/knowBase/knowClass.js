import request from "@/utils/request";

// 查询测试单表列表
export function baseCategoryList(query) {
  return request({
    url: "/system/baseCategory/list",
    method: "get",
    params: query,
  });
}

// 新增知识库分类
export function baseCategoryAdd(data) {
  return request({
    url: "/system/baseCategory",
    method: "post",
    data,
  });
}

// 修改知识库分类
export function baseCategoryEdit(data) {
  return request({
    url: "/system/baseCategory",
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
