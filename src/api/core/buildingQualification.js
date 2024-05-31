import request from "@/utils/request";

// 查询建筑资质列表
export function listBuildingQualification(query) {
  return request({
    url: "/core/buildingQualification/list",
    method: "get",
    params: query,
  });
}

// 查询建筑资质详细
export function getBuildingQualification(id) {
  return request({
    url: "/core/buildingQualification/" + id,
    method: "get",
  });
}

// 新增建筑资质
export function addBuildingQualification(data) {
  return request({
    url: "/core/buildingQualification",
    method: "post",
    data: data,
  });
}

// 修改建筑资质
export function updateBuildingQualification(data) {
  return request({
    url: "/core/buildingQualification",
    method: "put",
    data: data,
  });
}

// 删除建筑资质
export function delBuildingQualification(id) {
  return request({
    url: "/core/buildingQualification/" + id,
    method: "delete",
  });
}

// 查询建筑资质列表
export function getProjectCategoryNameList(query) {
  return request({
    url: "/core/projectCategory/getProjectCategoryNameList",
    method: "get",
    params: query,
  });
}
