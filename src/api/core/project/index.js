import request from "@/utils/request";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询项目列表
export function list(query) {
  return request({
    url: "/core/project/list",
    method: "get",
    params: query,
  });
}

// 新增项目
export function add(data) {
  return request({
    url: "/core/project",
    method: "post",
    data: data,
  });
}

// 修改项目
export function update(data) {
  return request({
    url: "/core/project",
    method: "put",
    data: data,
  });
}

// 删除项目
export function del(projectId) {
  return request({
    url: "/core/project/" + projectId,
    method: "delete",
  });
}
// 查询项目详细
export function getProject(projectId) {
  return request({
    url: "/core/project/" + parseStrEmpty(projectId),
    method: "get",
  });
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: "/core/project/importTemplate",
    method: "get",
    responseType: "blob",
  });
}

// 获取当前用户对于项目字段的权限
export function getProjectpermission(projectId) {
  return request({
    url: "/core/project/permission",
    method: "get",
  });
}


// 查询项目列表数据2
export function listDate(query) {
  return request({
    url: "/core/project/list",
    method: "get",
    params: query,
  });
}