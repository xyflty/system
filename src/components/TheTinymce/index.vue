<template>
  <div :class="{ 'hide-toolbar': isReadonly }">
    <Editor id="editorRef" v-model="content" :init="init" />
  </div>
</template>
<script>
// 引入组件
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/icons/default/icons.js";

// 引入富文本编辑器主题的js和css

export default {
  name: "TinymceEditor",
  components: { Editor },
  props: {
    isReadonly: Boolean,
    value: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      init: {
        // 配置文件
        base_url: "/tinymce",
        menubar: false,
        external_plugins: {
          //引入需要的插件
          anchor: "/tinymce/plugins/anchor/plugin.min.js",
          code: "/tinymce/plugins/code/plugin.min.js",
          print: "/tinymce/plugins/print/plugin.min.js",
          preview: "/tinymce/plugins/preview/plugin.min.js",
          searchreplace: "/tinymce/plugins/searchreplace/plugin.min.js",
          autolink: "/tinymce/plugins/autolink/plugin.min.js",
          directionality: "/tinymce/plugins/directionality/plugin.min.js",
          visualblocks: "/tinymce/plugins/visualblocks/plugin.min.js",
          visualchars: "/tinymce/plugins/visualchars/plugin.min.js",
          fullscreen: "/tinymce/plugins/fullscreen/plugin.min.js",
          image: "/tinymce/plugins/image/plugin.min.js",
          link: "/tinymce/plugins/link/plugin.min.js",
          media: "/tinymce/plugins/media/plugin.min.js",
          template: "/tinymce/plugins/template/plugin.min.js",
          codesample: "/tinymce/plugins/codesample/plugin.min.js",
          table: "/tinymce/plugins/table/plugin.js",

          charmap: "/tinymce/plugins/charmap/plugin.min.js",
          pagebreak: "/tinymce/plugins/pagebreak/plugin.min.js",
          nonbreaking: "/tinymce/plugins/nonbreaking/plugin.min.js",
          insertdatetime: "/tinymce/plugins/insertdatetime/plugin.min.js",
          advlist: "/tinymce/plugins/advlist/plugin.min.js",
          lists: "/tinymce/plugins/lists/plugin.min.js",
          wordcount: "/tinymce/plugins/wordcount/plugin.min.js",
          imagetools: "/tinymce/plugins/imagetools/plugin.min.js",
          textpattern: "/tinymce/plugins/textpattern/plugin.min.js",
          help: "/tinymce/plugins/help/plugin.min.js",
          emoticons: "/tinymce/plugins/emoticons/plugin.min.js",
          autosave: "/tinymce/plugins/autosave/plugin.min.js",
          // iframe: '/tinymce/plugins/iframe/plugin.min.js',
          hr: "/tinymce/plugins/hr/plugin.min.js",
          tempcol: "/tinymce/plugins/tempcol/plugin.js",

          // formatpainter: "/tinymce/plugins/formatpainter/plugin.min.js",
        },

        language_url: "/tinymce/langs/zh-Hans.js", //语言文件
        language: "zh-Hans",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        plugins: [
          "link lists image code table wordcount media preview fullscreen help ",
        ],
        toolbar: [
          "template code undo redo restoredraft cut copy paste pastetext forecolor backcolor bold italic underline strikethrough link unlink anchor alignleft aligncenter alignright alignjustify outdent indent formatselect fontselect fontsizeselect bullist numlist blockquote subscript superscript removeformat table image media charmap emoticons pagebreak insertdatetime print preview fullscreen formatpainter iframe hr tempcol",
        ],
        readonly: false,
        // content_css : ['/layui/css/layui.css','/css/public.css?v=1'],
        content_css: ["/tinymce/layui/css/layui.css"],
        height: 800, //编辑器高度
        min_height: 200,

        branding: false,
        paste_data_images: true, // 允许粘贴图像
        file_picker_types: "file image media",
        images_upload_handler: (blobInfo, success) => {
          var xhr, formData;
          var file = blobInfo.blob(); //转化为易于理解的file对象
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open("POST", `${process.env.VUE_APP_API_URL}/file/upload`); //上传文件的地址，需要替换成自己的
          xhr.setRequestHeader(
            "Authorization",
            window.localStorage.escourse_token
          );
          xhr.onload = function () {
            var json;
            json = JSON.parse(xhr.responseText);
          };
          formData = new FormData();
          formData.append("file", file, file.name);
          formData.append("module", "post");
          formData.append("file_source", "1");
          // formData.append("token",window.localStorage.escourse_token)
          xhr.send(formData);
          xhr.onload = function () {
            let json = JSON.parse(xhr.responseText);
            if (json.code == 200) {
              success(process.env.VUE_APP_API_URL + json.data.file.path);
              return;
            }
          };
        },
        media_url_resolver: function (data, resolve) {
          try {
            let videoUri = encodeURI(data.url);
            let embedHtml = `<p>
                            <span
                                class="mce-object mce-object-video"
                                data-mce-selected="1"
                                data-mce-object="video"
                                data-mce-p-width="100%"
                                data-mce-p-height="auto"
                                data-mce-p-controls="controls"
                                data-mce-p-controlslist="nodownload"
                                data-mce-p-allowfullscreen="true"
                                data-mce-p-src=${videoUri} >
                                <video src=${data.url} width="100%" height="auto" controls="controls" controlslist="nodownload">
                                </video>
                            </span>
                            </p>
                            <p style="text-align: left;"></p>`;
            resolve({ html: embedHtml });
          } catch (e) {
            resolve({ html: "" });
          }
        },
        file_picker_callback(cb, value, meta) {
          //当点击meidia图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
          console.log("meta", meta);

          //创建一个隐藏的type=file的文件选择input
          let input = document.createElement("input");
          input.setAttribute("type", "file");
          input.onchange = function () {
            var xhr, formData;
            let file = this.files[0]; //只选取第一个文件。如果要选取全部，后面注意做修改
            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open("POST", `${process.env.VUE_APP_API_URL}/file/upload`); //上传文件的地址，需要替换成自己的
            xhr.setRequestHeader(
              "Authorization",
              window.localStorage.escourse_token
            );
            xhr.onload = function () {
              var json;
              json = JSON.parse(xhr.responseText);
            };
            formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("module", "post");
            formData.append("file_source", "1");
            // formData.append("token",window.localStorage.escourse_token)
            xhr.send(formData);

            xhr.upload.onprogress = function () {
              // 进度(e.loaded / e.total * 100)
              // progress(e.loaded / e.total * 100);
            };
            // xhr.onerror = function () {
            //   //根据自己的需要添加代码
            //   console.log(xhr.status);
            //   return;
            // };
            xhr.onload = function () {
              let json = JSON.parse(xhr.responseText);
              if (json.code == 200) {
                // if (meta.filetype == "media") {
                cb(process.env.VUE_APP_API_URL + json.data.file.path, {
                  text: json.data.file.name,
                });
                // }
                // if (meta.filetype == "file") {
                // 	cb(json.data.url, { text: json.data.name })
                // }
                return;
              }
            };
          };
          //触发点击
          input.click();
        },
      },

      content: this.value,
    };
  },

  mounted() {
    tinymce.init({});
    this.dealReadonly();
  },

  watch: {
    value(newValue) {
      this.content = newValue;
    },
    content(newValue) {
      this.$emit("input", newValue);
    },
    isReadonly(newVal) {
      this.dealReadonly();
    },
  },
  methods: {
    // 处理是否可编辑
    dealReadonly() {
      if (this.isReadonly) {
        tinymce.editors["editorRef"].mode.set("readonly");
      } else {
        tinymce.editors["editorRef"].mode.set("design");
      }
    },
  },
};
</script>
<style lang="scss">
.hide-toolbar {
  .tox-editor-header {
    display: none !important;
  }
}
</style>
