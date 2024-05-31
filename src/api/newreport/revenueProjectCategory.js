import request from "@/utils/request";

// 查询营收项目分类列表
export function listRevenueProjectCategory(query) {
  return request({
    url: "/zw/revenueProjectCategory/list",
    method: "get",
    params: query,
  });
}

// 查询营收项目分类详细
export function getRevenueProjectCategory(id) {
  return request({
    url: "/zw/revenueProjectCategory/" + id,
    method: "get",
  });
}

// 新增营收项目分类
export function addRevenueProjectCategory(data) {
  return request({
    url: "/zw/revenueProjectCategory",
    method: "post",
    data: data,
  });
}

// 修改营收项目分类
export function updateRevenueProjectCategory(data) {
  return request({
    url: "/zw/revenueProjectCategory",
    method: "put",
    data: data,
  });
}

// 删除营收项目分类
export function delRevenueProjectCategory(id) {
  return request({
    url: "/zw/revenueProjectCategory/" + id,
    method: "delete",
  });
}

export function twoTree() {
  return request({
    url: "/zw/revenueProjectCategory/getMappingProjectCategoryTree",
    method: "get",
  });
}
