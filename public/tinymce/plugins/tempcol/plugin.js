/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.7.1 (2021-03-17)
 */
(function () {
  "use strict";
  var global = tinymce.util.Tools.resolve("tinymce.PluginManager");

  // 随机数
  const getRandom = function (col) {
    return Math.floor(Math.random() * col);
  };

  const comTemplate = function (data) {
    console.log(data);
    const col = data.col && data.col > 1 ? data.col : 2;

    let colors = ["transparent", "#C2E0F4", "#FBEEB8", "#BFEDD2", "#F2F6FC"];

    if (data.color && data.color1) {
      colors = [data.color, data.color1];
    } else if ((!data.color && data.color1) || (data.color && !data.color1)) {
      colors = ["transparent", data.color, data.color1];
    }

    let borderColor = "#409EFF";

    let html = "";

    if (col === 2) {
      html +=
        '<div contentEditable=false dar style="width:90%;margin:0 auto;display:grid;grid-template-columns: 1fr 1fr;grid-column-gap:15px;grid-row-gap:15px">';
    } else {
      html +=
        '<div contentEditable=false style="margin:0 auto;column-count:2;column-gap:15px">';
    }
    let colText = "";

    for (let index = 0; index < col; index++) {
      let color = "";

      if (col === 2) {
        color = colors[index];
      } else {
        let random = getRandom(colors.length);
        color = colors[random];
      }
      borderColor = color !== "transparent" ? color : borderColor;

      colText += `<div contentEditable=true  style="width:100%;margin-bottom:15px;display:inline-block;border-radius: 5px;padding:20px;box-sizing: border-box;background: ${color};border:1px solid ${borderColor};line-height:2"><h4>❗&nbsp;&nbsp; 我是标题</h4><ul><li>列表1</li><li>模板测试😫🤯😔😀</li><li>模板测试3</li></ul></div>`;
    }

    html += `${colText}</div>`;

    console.log({ html });

    return html;
  };

  let html = comTemplate({ color: "", color1: "", col: "" });

  var openDialog = function (editor) {
    return editor.windowManager.open({
      title: "排版布局",
      body: {
        type: "panel",
        items: [
          {
            type: "colorinput",
            name: "color",
            label: "背景颜色1",
          },
          {
            type: "colorinput",
            name: "color1",
            label: "背景颜2",
          },
          {
            type: "input", // component type
            name: "col", // identifier
            inputMode: "text",
            label: "列数", // text for the label
            placeholder: "默认2列", // placeholder text for the input
          },
        ],
      },
      buttons: [
        {
          type: "cancel",
          text: "Close",
        },
        {
          type: "submit",
          text: "Save",
          primary: true,
        },
      ],
      onSubmit: function (api) {
        var data = api.getData();

        html = comTemplate(data);

        console.log(api, "在心里");

        // Insert content when the window form is submitted
        editor.execCommand("templateContent");
        api.close();
      },
    });
  };

  var register1 = function (editor) {
    console.log({ editor });
    editor.addCommand("templateContent", function () {
      editor.execCommand("mceInsertContent", true, html);
    });
  };

  const register = (editor) => {
    editor.ui.registry.addButton("tempcol", {
      icon: "temp-col", //图标
      tooltip: "插入控件", //提示
      onAction: function () {
        // Open window
        openDialog(editor);
      }, //执行的方法
    });
  };

  function Plugin() {
    global.add("tempcol", function (editor) {
      register1(editor);
      register(editor);
    });
  }

  Plugin();
})();
