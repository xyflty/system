import request from "@/utils/request";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  return request({
    url: "/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 注册方法
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: "/getInfo",
    method: "get",
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/captchaImage",
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20000,
  });
}

// 获取当前登录人的

export function getDeptId() {
  return request({
    url: "/system/dept/getSubjectDeptId",
    method: "get",
  });
}

// 获取当前登录人的部门id
export function getSubjectDeptId() {
  return request({
    url: "/system/dept/getDeptId",
    method: "get",
  });
}

// 根据当前登录人获取数据分析相关业务的默认选中部门id
export function getDataAnalysisDefaultDeptId() {
  return request({
    url: "/system/dept/getDataAnalysisDefaultDeptId",
    method: "get",
  });
}

// 获取二维码
export function getLoginQrCodeUrl() {
  return request({
    url: "/qrLogin/getLoginQrCodeUrl",
    method: "get",
  });
}

// 二维码登录
export function qrLoginCheckLogin(query) {
  return request({
    url: "/qrLogin/checkLogin",
    method: "get",
    params: query,
  });
}
