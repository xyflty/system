<template>
  <editor
    class="editor"
    ref="mceEditor"
    :id="id"
    v-model="dataValue"
    v-bind="$attrs"
    :init="showInit"
    :plugins="showPlugins"
    :toolbar="showToolbar"
    tinymce-script-src="https://www.72crm.com/npm/tinymce/tinymce.min.js"
    v-on="$listeners"
  />
</template>

<script>
    import Editor from "@tinymce/tinymce-vue";
    import plugins from "./plugins";
    import toolbar from "./toolbar";
    import {fileUpload} from "@/api/upload/upload";

    let unique = 0;

    export default {
        name: "Tinymce",
        components: {
            Editor,
        },
        inheritAttrs: false,
        props: {
            /**
             *  apiKey: String,
             cloudChannel: String,
             id: String,
             init: Object,
             initialValue: String,
             inline: Boolean,
             modelEvents: [String, Array],
             plugins: [String, Array],
             tagName: String,
             toolbar: [String, Array],
             value: String,
             disabled: Boolean,
             tinymceScriptSrc: String,
             outputFormat: {
          type: String,
          validator: (prop: string) => prop === 'html' || prop === 'text'
        }
             */
            value: String,
            init: Object,
            height: [String, Number],
            plugins: [String, Array],
            toolbar: [String, Array],
            menubar: [String, Array],
        },
        data() {
            return {
                id: this.uuid(),
                dataValue: "",
                languageTypeList: {
                    en: "en",
                    zh: "zh_CN",
                    es: "es_MX",
                    ja: "ja",
                },
                showInit: {},
                img_data: "",
            };
        },
        computed: {
            editor() {
                return window.tinymce.get(this.id);
            },

            showToolbar() {
                return this.toolbar != undefined ? this.toolbar : toolbar;
            },

            showPlugins() {
                return this.plugins != undefined ? this.plugins : plugins;
            },
        },
        watch: {
            value: {
                handler(val) {
                    if (val != this.dataValue) {
                        this.dataValue = val;
                        // console.log(this.dataValue,'dataValue')
                    }
                },
                immediate: true,
                deep: true,
            },
            dataValue() {
                this.$emit("input", this.dataValue);
            },
            init: {
                handler() {
                    this.initTinymce();
                },
                selector: '#tinydemo',
                plugins: "code lineheight",
                toolbar: "code lineheight",
                immediate: true,
                deep: true,
            },
        },
        mounted() {
        },
        methods: {
            initTinymce() {
                const initDefault = {
                    skin: "wukong",
                    resize: false,
                    branding: false,
                    lineheight_val: "0 0.2 0.3 0.5 0.6 0.7 0.8 0.9 1 1.5 1.6 1.75 1.8 2 3 4 5",//设置行高值
                    language: this.languageTypeList["zh"],
                    menubar: this.menubar ? this.menubar : false,
                    body_class: "panel-body",
                    image_advtab: true,
                    end_container_on_empty_block: true,
                    powerpaste_word_import: "clean",
                    content_css: ["./static/tinymce/css/tiny-wukong.css"],
                    fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
                    font_formats:
                        "Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif",
                    code_dialog_height: 450,
                    paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图像
                    code_dialog_width: 1000,
                    advlist_bullet_styles: "square",
                    advlist_number_styles: "default",
                    imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
                    default_link_target: "_blank",
                    link_assume_external_targets: true,
                    link_title: false,
                    target_list: false,
                    quickbars_insert_toolbar: false,
                    nonbreaking_force_tab: true,
                    convert_urls: false,
                    toolbar_mode: "sliding",
                    images_upload_handler: function (blobInfo, success, failure, progress) {
                        console.log(blobInfo.blob(),'blobInfo')
                        let fileobj = {file:blobInfo.blob()}
                        progress(0);
                        fileUpload(fileobj).then(res => {
                            success(res.data.url);
                            progress(100);
                        }).catch(() => {
                            failure("出现未知问题，刷新页面，或者联系管理员");
                        });
                        // let params = new FormData();
                        // params.append("file", blobInfo.blob());
                        // fileUploadImg(params).then((res) => {
                        //     success(res.url);
                        //     progress(100);
                        //   }).catch(() => {
                        //     failure("出现未知问题，刷新页面，或者联系管理员");
                        //   });
                    },
                    ...this.init,
                };
                /**
                 * statusbar 隐藏底部状态栏
                 */
                if (this.height != undefined) {
                    initDefault.height = this.height;
                }
                this.showInit = initDefault;
            },
            uuid() {
                const time = Date.now();
                const random = Math.floor(Math.random() * 1000000000);
                unique++;
                return "wukong_" + random + unique + String(time);
            },
            imageSuccessCBK(arr) {
                arr.forEach((v) => {
                    this.editor.insertContent(`<img class="wscnph" src="${v.url}" >`);
                });
            },
        },
    };
</script>

<style lang="scss">
  .editor {
    // height: 192px;
    height: 300px;
  }

  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container > > > .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .tox-tinymce-aux {
    z-index: 10001 !important;
  }
</style>
