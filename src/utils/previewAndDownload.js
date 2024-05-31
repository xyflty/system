import axios from "axios";
import { getToken } from "@/utils/auth";

// 根据文件名后缀区分 文件类型
export const getType = (filename) => {
  // 后缀获取
  let suffix = "";
  // 获取类型结果
  let result = "";
  try {
    let fileArr = filename.split(".");
    suffix = fileArr[fileArr.length - 1];
  } catch (error) {
    suffix = "";
  }

  // 判断是否有后缀，没有返回false
  if (!suffix) {
    result = false;
    return result;
  }

  // 图片格式
  const imglist = ["png", "jpg", "jpeg", "bmp", "gif"];
  // 进行图片匹配
  result = imglist.some((item) => {
    return item == suffix;
  });

  console.log({ result });

  if (result) {
    result = suffix;
    return result;
  }

  // 匹配txt
  const txtlist = ["txt"];
  result = txtlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "txt";
    return result;
  }
  // 匹配 excel
  const excelist = ["xls", "xlsx"];
  result = excelist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "excel";
    return result;
  }
  // 匹配 word
  const wordlist = ["doc", "docx"];
  result = wordlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "word";
    return result;
  }
  // 匹配 pdf
  const pdflist = ["pdf"];
  result = pdflist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "pdf";
    return result;
  }
  // 匹配 ppt
  const pptlist = ["ppt"];
  result = pptlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "ppt";
    return result;
  }
  // 匹配 视频
  const videolist = ["mp4", "m2v", "mkv"];
  result = videolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "video";
    return result;
  }
  // 匹配 音频
  const radiolist = ["mp3", "wav", "wmv"];
  result = radiolist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "radio";
    return result;
  }
  // 匹配 zip
  const ziplist = ["zip"];
  result = ziplist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "zip";
    return result;
  }
  // 匹配 zip
  const rarlist = ["rar"];
  result = rarlist.some(function (item) {
    return item == suffix;
  });
  if (result) {
    result = "rar";
    return result;
  }
  // 其他 文件类型
  result = "other";
  return result;
};

// 查看或下载文件,type有值并且只有文件类型是pdf的时候能在浏览器预览
export const downFile = (link, name, type = "", isflag = false) => {
  return new Promise((resolve, reject) => {
    let url = link;
    let fileType = "";
    if (type === "pdf" || getType(url) == "pdf") {
      fileType = "application/pdf";
    }
    axios
      .get(url, {
        responseType: "blob",
        headers: { Authorization: "Bearer " + getToken() },
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: fileType });
        // 注: mime类型必须整正确, 否则下载的文件会损坏
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // 兼容IE
          window.navigator.msSaveOrOpenBlob(blob, element.original_name);
        } else {
          if (isflag) {
            // 预览
            let showFile = window.URL.createObjectURL(blob);
            resolve(showFile);
          } else {
            let downloadNode = document.createElement("a");
            downloadNode.href = window.URL.createObjectURL(blob);
            downloadNode.download = name;
            downloadNode.click();
            window.URL.revokeObjectURL(blob); // 释放 DOMString  ,解除内存占用
            resolve();
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
