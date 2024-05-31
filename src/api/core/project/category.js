import request from "@/utils/request";

// 查询产品分类列表
export function list(query) {
  return request({
    url: "/core/projectCategory/list",
    method: "get",
    params: query,
  });
}

// 新增分类
export function add(data) {
  return request({
    url: "/core/projectCategory",
    method: "post",
    data: data,
  });
}

// 修改分类
export function update(data) {
  return request({
    url: "/core/projectCategory",
    method: "put",
    data: data,
  });
}

// 删除产品分类
export function del(id) {
  return request({
    url: "/core/projectCategory/" + id,
    method: "delete",
  });
}

// 查询产品分类列表（排除节点）
export function listDeptExcludeChild(id) {
  return request({
    url: "/core/projectCategory/list/exclude/" + id,
    method: "get",
  });
}

// 查询产品分类详细
export function getCategory(id) {
  return request({
    url: "/core/projectCategory/" + id,
    method: "get",
  });
}

// 查询产品分类下拉树结构
export function treeselect() {
  return request({
    url: "/core/projectCategory/tree",
    method: "get",
  });
}

// 根据角色ID查询产品分类树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: "/system/projectCategory/roleDeptTreeselect/" + roleId,
    method: "get",
  });
}

// 查询所有二级分类
export function twoTree() {
  return request({
    url: "/core/projectCategory/twoTree",
    method: "get",
  });
}
// 根据项目大类的ID进行查询
export function projectTypeList(query) {
  return request({
    url: "/core/project/projectTypeList",
    method: "get",
    params: query,
  });
}
