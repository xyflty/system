
import renderSheet from "../vendors/xlsx";
import renderText from "../vendors/text";
import renderWord from "../vendors/word";
import renderPptx from "../vendors/pptx";
import renderPdf from "../vendors/pdf";
import renderImage from "../vendors/images";
import renderMp4 from "../vendors/video";

const handlers = [
  // 使用docxjs支持，目前效果最好的渲染器
  {
    accepts: ["docx", "word", "doc"],
    handler: async (obj) => {
      const { buffer, target } = obj;
      await renderWord(buffer, target);
    },
  },
  // 使用pptx2html，已通过默认值更替
  {
    accepts: ["pptx"],
    handler: async (obj) => {
      const { buffer, target } = obj;
      await renderPptx(buffer, target, null);
    },
  },
  // 使用sheetjs + handsontable，无样式
  {
    accepts: ["xlsx", "excel"],
    handler: async (obj) => {
      const { buffer, target } = obj;
      return renderSheet(buffer, target);
    },
  },
  // 使用pdfjs，渲染pdf，效果最好
  {
    accepts: ["pdf"],
    handler: async (obj) => {
      const { buffer, target } = obj;

      return renderPdf(buffer, target);
    },
  },
  // 图片过滤器
  {
    accepts: ["gif", "jpg", "jpeg", "bmp", "tiff", "tif", "png", "svg"],
    handler: async (obj) => {
      const { buffer, target } = obj;
      return renderImage(buffer, target);
    },
  },
  // 纯文本预览
  {
    accepts: [
      "txt",
      "json",
      "js",
      "css",
      "java",
      "py",
      "html",
      "jsx",
      "ts",
      "tsx",
      "xml",
      "md",
      "log",
    ],
    handler: async (obj) => {
      const { buffer, target } = obj;
      return renderText(buffer, target);
    },
  },
  // 视频预览，仅支持MP4
  {
    accepts: ["mp4"],
    handler: async (obj) => {
      const { buffer, target } = obj;
      renderMp4(buffer, target);
    },
  },
  // 错误处理
  {
    accepts: ["error"],
    handler: async (obj) => {
      const { buffer, type } = obj;

      return `<div style="text-align: center; margin-top: 80px">不支持.${type}格式的在线预览，请下载后预览或转换为支持的格式</div>
  <div style="text-align: center">支持docx, xlsx, pptx, pdf, 以及纯文本格式和各种图片格式的在线预览</div>`;
    },
  },
];

const renders = (() => {
  let result = {};
  handlers.forEach((item) => {
    item.accepts.forEach((type) => (result[type] = item.handler));
  });
  return result;
})();

// 渲染的
const render = async (buffer, type, target) => {
  const handler = renders[type];

  if (handler) {
    return handler({ buffer, target });
  }
  return renders.error(buffer, type);
};
export default render;
