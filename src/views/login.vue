<template>
  <div class="login">
    <div class="card">
      <div class="card__side card__side--front">
        <div
          v-if="isUserLogin"
          class="code-box code-box--front"
          @click="handleHover"
        ></div>
        <div class="code-box--hiddle" @click="handleHover"></div>
        <div class="login-form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <h3 class="color--red QRCode__wx">易为CRM协同平台</h3>

            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="账号"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="user"
                  class="el-input__icon input-icon"
                />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="password"
                  class="el-input__icon input-icon"
                />
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="validCode"
                  class="el-input__icon input-icon"
                />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>
            <el-checkbox
              v-model="loginForm.rememberMe"
              style="margin: 0px 0px 25px 0px"
              >记住密码</el-checkbox
            >
            <el-form-item style="width: 100%">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width: 100%"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <div style="float: right" v-if="register">
                <router-link class="link-type" :to="'/register'"
                  >立即注册</router-link
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="card__side card__side--back">
        <div
          v-if="isUserLogin"
          class="code-box code-box--back"
          @click="handleHover"
        ></div>
        <div class="code-box--hiddle" @click="handleHover"></div>

        <div class="QRCode__box">
          <span class="color--red QRCode__wx">使用微信扫一扫</span>
          <div
            class="QRCode__img"
            v-loading="QRcodeLoading"
            element-loading-background="rgba(255, 255, 255, 1)"
          >
            <canvas id="QRCode__img"></canvas>
          </div>
          <span class="QRCode__btn color--red" @click="getQRCode"
            >刷新二维码</span
          >
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, getLoginQrCodeUrl } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

import QRCode from "qrcode";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
      form: "", // 存储路由里其他的参数

      qrCodeId: "", //二维码的codeId
      timer: null,
      isUserLogin: true, //是否允许账号密码登录
      isWXLogin: true, //是否微信登录
      QRcodeLoading: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        // 路由的路径地址
        this.redirect = route.query && route.query.redirect;
        // 路由里地址后的其他参数

        let data = route.query;

        data.redirect = undefined;
        // 对里面数据进行处理
        for (let key in data) {
          if (data[key] !== undefined) {
            if (data[key] == null) {
              this.form += "&" + key;
            } else {
              this.form += "&" + key + "=" + data[key];
            }
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getQRCode();
    this.getCode();
    this.getCookie();
  },
  mounted() {
    // this.dragListener();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              // 进行判定当前路由的其他参数是否存在，如果存在就拼接跳转，不存在就不拼接，直接拿到路由初始地址就可以
              if (this.form == undefined) {
                this.$router
                  .push({ path: this.redirect || "/" })
                  .catch(() => {});
              } else {
                this.$router
                  .push({ path: this.redirect + this.form || "/" })
                  .catch(() => {});
              }
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
    handleHover() {
      // 如果返回的验证码是false,则不能切换账号密码登录

      let front = document.querySelector(`.card__side--front`);
      let back = document.querySelector(`.card__side--back`);

      this.isWXLogin = !this.isWXLogin;
      console.log(this.isWXLogin);

      if (this.isWXLogin) {
        this.getQRCode(); //。目的是在切换登录后，定时器没清除，切换微信扫描时需要开启，可以默认一直开启定时器，改为在页面销毁前去除定时器
        front.style.transform = "rotateY(180deg)";

        back.style.transform = "rotateY(0)";
        // front.style.visibility = "hidden";
        // back.style.visibility = "visible";
      } else {
        this.timer && clearInterval(this.timer);
        front.style.transform = "rotateY(0)";

        back.style.transform = "rotateY(180deg)";
        // front.style.visibility = "visible";
        // back.style.visibility = "hidden";
      }
    },
    // 获取登录二维码
    async getQRCode() {
      this.QRcodeLoading = true;

      try {
        const res = await getLoginQrCodeUrl();

        if (res.code === 200) {
          this.qrCodeId = res.data.qrCodeId;
          this.isUserLogin =
            res.data.loginWayOnOff == undefined ? true : res.data.loginWayOnOff;
          let opts = {
            errorCorrectionLevel: "H", //容错级别
            type: "image/png", //生成的二维码类型
            quality: 0.3, //二维码质量
            margin: 3, //二维码留白边距
            width: 200, //宽
            height: 200, //高
            text: "crm登录", //二维码内容
            color: {
              dark: "#333333", //前景色
              light: "#fff", //背景色
            },
          };

          let canvasDom = document.querySelector("#QRCode__img");
          QRCode.toCanvas(
            canvasDom,
            res.data.qrCodeUrl,
            opts,
            function (error) {
              if (error) {
                console.log("二维码加载失败", error);
                this.$message.error("二维码加载失败");
              }
            }
          );
          this.QRcodeLoading = false;
          this.qrLogin();
        } else {
          this.QRcodeLoading = false;
        }
      } catch (error) {
        this.QRcodeLoading = false;
      }
    },

    // 二维码登录
    qrLogin() {
      // 如果定时器存在，先清除定时器
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.$store
          .dispatch("qrCheckLogin", this.qrCodeId)
          .then((res) => {
            // 清除定时器
            clearInterval(this.timer);
            console.log(res, "进来了");

            if (res.code === 200) {
              this.$message.success("登录成功");
              // 进行判定当前路由的其他参数是否存在，如果存在就拼接跳转，不存在就不拼接，直接拿到路由初始地址就可以
              if (this.form == undefined) {
                this.$router
                  .push({ path: this.redirect || "/" })
                  .catch(() => {});
              } else {
                this.$router
                  .push({ path: this.redirect + this.form || "/" })
                  .catch(() => {});
              }
            } else {
              // this.getQRCode();
              // this.$message.error(res.msg + "请重新扫描");
            }
          })
          .catch((error) => {
            console.log("失败");
            clearInterval(this.timer);
            this.getQRCode();
          });
      }, 2000);
    },

    dragListener() {
      let card = document.querySelector(".card");

      var isMouseDown;

      let width = card.offsetWidth;
      let height = card.offsetHeight;
      console.log(width);

      let moveFn = function (e) {
        if (isMouseDown) {
          let x = e.clientX - width / 2;
          let y = e.clientY;
          console.log(y);
          if (e.clientX <= width / 2) {
            x = 0;
          }

          if (e.clientX >= window.innerWidth - width / 2) {
            x = window.innerWidth - width;
          }
          if (e.clientY <= 0) {
            y = 0;
          }
          if (e.clientY >= window.innerHeight - height) {
            y = window.innerHeight - height;
          }
          console.log(e.clientX);
          card.style.left = x + "px";
          card.style.top = y + "px";
        }
      };

      card.addEventListener("mousedown", function () {
        isMouseDown = true;
        document.addEventListener("mousemove", moveFn);
      });
      card.addEventListener("mouseup", function () {
        isMouseDown = false;
        document.removeEventListener("mousemove", moveFn);
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  // display: flex;
  // justify-content: center;
  // align-items: center;

  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  // background-size: cover;
  background-size: 100% 100%;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #333;
  font-weight: bold;
}

.login-form {
  border-radius: 6px;

  padding: 25px 25px 5px 25px;

  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    flex: 1;
  }

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

.card {
  perspective: 150rem;
  // position: relative;
  width: 350px;
  height: 350px;

  position: fixed;
  left: 50%;
  top: 30%;
  transform: translate(-50%, 0);
  animation: fadeIn 2s;

  &__side {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;

    transition: all 1s ease;
    // background-color: rgba(255, 255, 255, 0.1);

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &::before {
      content: "";
      position: absolute;
      left: -5px;
      right: -5px;
      top: -5px;
      bottom: -5px;
      background-color: rgba(255, 255, 255, 0);
      // filter: blur(10px);
      z-index: -1;
    }
    border-radius: 5px;

    box-shadow: 0 15px 20px rgba(#000, 0.1), 8px 8px 15px rgba(#fff, 0.8) inset;

    &--front {
      transform: rotateY(180deg);
    }
    &--back {
      transform: rotateY(0);
    }
  }

  // &:hover &__side--front {
  //   transform: rotateY(-180deg);
  // }
  // &:hover &__side--back {
  //   transform: rotateY(0);
  // }

  .code-box {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background-image: linear-gradient(
        to left bottom,
        rgba(121, 193, 252, 0.2),
        rgba(159, 229, 241, 0.7)
      ),
      url("../assets/images/code.gif");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: right top;
    clip-path: polygon(0 0, 100% 0, 100% 100%);

    cursor: pointer;
    z-index: 2;
    &--front {
      background-image: linear-gradient(
          to left bottom,
          rgba(121, 193, 252, 0.2),
          rgba(159, 229, 241, 0.7)
        ),
        url("../assets/images/code.gif");
    }
    &--back {
      background-image: linear-gradient(
          to left bottom,
          rgba(121, 193, 252, 0.2),
          rgba(159, 229, 241, 0.7)
        ),
        url("../assets/images/user-login.jpg");
    }
    &--hiddle {
      position: absolute;
      left: 0;
      top: 0;
      width: 5px;
      height: 5px;
    }
  }
  .QRCode__box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .QRCode__img {
      width: 200px;
      height: 200px;
      overflow: hidden;
    }
    .QRCode__btn {
      font-size: 14px;
      margin: 8px 0;
      transition: all 0.3s;
      padding: 8px 20px;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15),
          2px 2px 6px rgba(255, 255, 255, 0.9) inset;
      }
      &:active {
        transform: translateY(0px);
        box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15),
          1px 1px 8px rgba(255, 255, 255, 0.9) inset;
      }
    }

    .QRCode__desc {
      width: 70%;
      line-height: 1.5;
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      letter-spacing: 1px;
      > strong {
        font-weight: bold;
        padding: 0 8px;
      }
      &::before {
        content: "*";
        color: #f56c6c;
        padding-right: 8px;
      }
    }
  }
}
.color--red {
  color: #f56c6c;
}
.QRCode__wx {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.el-form-item__content {
  input {
    background: rgba(255, 255, 255, 0.3);
    border-color: #999;
  }
}

/* 定义动画 */
// @keyframes fadeIn {
//   0% {
//     top: -100%;
//     opacity: 0;
//     transform: rotate(0deg);
//   }

//   50% {
//     top: calc(60% - 170px);
//   }
//   80% {
//     top: calc(50% - 170px);
//   }

//   100% {
//     opacity: 1;
//   }
// }
</style>
