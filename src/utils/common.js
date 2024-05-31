import store from "@/store/index.js";
let commonData = store.state.commonData.commonData;

export const formatterCallback = (arr, prop) => {
  let info = arr.find((item) => item.value === prop);

  return info ? info.label : "--";
};

export const htmlCallback = (value) => {
  if (value.includes("\n")) {
    const [str, time] = value.split("\n");
    // return ``;
    return `<div style="color:#F56C6C">${str}<br />${time}</div>`;
  } else {
    return value;
  }
};

export const getOrderJobColor = (arr, prop) => {
  let info = arr.find((item) => item.value === prop);

  return info ? info.color : "#909399";
};
// 处理数据生成label和value格式
export const dealTabs = (data, label = "categoryName", id = "id") => {
  if (data && data.length) {
    return data.map((item) => {
      return {
        label: item[label],
        value: item[id],
      };
    });
  } else {
    return [];
  }
};

// 通过label获取对应的value
export const passLabelGetValue = (
  data,
  label,
  labelProp = "label",
  valueProp = "value"
) => {
  const row = data.find((item) => item[labelProp] === label);
  return row ? row[valueProp] : "";
};

// 获取页面当前项目分类
export const getPagesCategoryType = (val) => {
  return commonData.projectCategoryType.find((item) => item.value == val).type;
};
// 获取页面当前项目分类id
export const getPagesCategoryId = (val) => {
  let row = commonData.projectCategoryType.find((item) => item.label == val);
  return row ? row.value : "";
};
// 获取页面当前项目分类类型
export const getPagesCategorylabelType = (val) => {
  let row = commonData.projectCategoryType.find((item) => item.label == val);
  return row ? row.type : "";
};

const dealTabsType = (key) => {
  switch (key) {
    case "基础信息":
      return "base";
    case "安证项目":
      return "safety";
    case "资质项目":
      return "certification";
    case "人才项目":
      return "talents";
    case "证书项目":
      return "certificate";
    case "工商项目":
      return "ICBC";
    case "知识产权项目":
      return "property";
    case "资料附件":
      return "attachment";
  }
};

// 获取所有数据
export const getAllData = (data) => {
  let obj = {};
  data.forEach((item) => {
    obj[dealTabsType(item.label)] = {};
  });
  return obj;
};

// 获取当前年
export const getNowYear = (form, start, end, isLast = false) => {
  let date = new Date();
  const year = date.getFullYear().toString();

  if (isLast) {
    form[start] = year - 1 + "";
  } else {
    form[start] = year;
  }

  form[end] = year;
};

// 获取当前部门的子部门
/**
 *
 * @param {树形数据} tree
 * @param {当前登录部门id} deptId
 * @param {是否包含父级} isparent
 * @returns
 */
export const filterDepts = (tree, deptId) => {
  if (!tree) return { children: [], deptIds: "", isflag: false };
  let children = [];
  let deptIds = [];

  // 判断是否是最小部门
  let isflag = false;
  // console.log(tree, deptId, "children");
  const row = tree.find((item) => item.id == deptId);

  if (row) {
    if (row.children) {
      children = row.children;
    } else {
      children = tree;
      isflag = true;
    }
  } else {
    children = tree;
    isflag = true;
  }

  if (children && children.length) {
    // deptIds = children.map((item) => item.id);
    let arr = children.map((item) => item.id);

    if (!isflag) {
      // 不是最后一个部门，把父节点存储进去
      deptIds.push(deptId);
    }

    deptIds = deptIds.concat(arr);
  }

  // 需要放出最大部门
  children = tree;

  return { children, deptIds, isflag };
};
