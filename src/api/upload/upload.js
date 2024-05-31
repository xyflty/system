import request from "@/utils/request";

/**
 * 自定义上传
 * @param {*} fileobj
 */
export function fileUpload(fileobj) {
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append("file", fileobj.file);

  return request({
    method: "post",
    // 上传地址
    url: "/system/oss/upload",
    // 定义上传头
    headers: { "Content-Type": "multipart/form-data" },
    data: param,
  });
}

/**
 * 自定义上传
 * @param {*} fileobj
 */
export function fileFwbUpload(fileobj) {
  console.log(fileobj);
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append("file", fileobj);
  return request({
    method: "post",
    // 上传地址
    url: "/system/oss/upload",
    // 定义上传头
    headers: { "Content-Type": "multipart/form-data" },
    data: param,
  });
}

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64Upload(obj) {
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append("image", obj);
  return request({
    method: "post",
    // 上传地址
    url: "/system/oss/imgUpload",
    data: param,
  });
}

export function del(ossIds) {
  return request({
    method: "delete",
    // 上传地址
    url: "/system/oss/" + ossIds,
  });
}
