<template>
  <div id="login">
      <div class="user-login">
        <div class="title">
          <img class="logo" src="../../assets/image/logo.png" alt="" >
        <div>AI+YEI</div>
      </div>
      <div class="user-text">账号密码登录</div>
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item required prop="username">
          <a-input
            v-model="model.username"
            size="large"
            placeholder="请输入帐户名 "
          >
            <a-icon
              slot="prefix"
              type="user"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item required prop="password">
          <a-input
            v-model="model.password"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="请输入密码 "
          >
            <a-icon
              slot="prefix"
              type="lock"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input>
        </a-form-model-item>
      </a-form-model>
      <a-button class="user-btn" type="primary" block @click="submint">确定</a-button>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getCookieDomain } from "@/utils/web";
import { login } from "./service";

export default {
  name: "Login",
  data() {
    return {
      model: {
        username: 'admin',
        password: '123456',
      },
      validatorRules: {
        username: [{ required: true, message: "请输入用户名!" }],
        password: [
          {
            required: true,
            message: "请输入密码!",
            validator: "click",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    //登录
    async submint() {
      const res = await login(this.model);
      // const res = { token: 'aaa' }
      this.$message.success("登录成功!");
      Cookies.set("AI_YEI_TOKEN", res.token, {
        path: "/",
        domain: getCookieDomain(),
      });
      this.$router.push("/");
    },
    // 判断登录类型
    handleUsernameOrEmail(rule, value, callback) {
      const regex =
        /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        this.loginType = 0;
      } else {
        this.loginType = 1;
      }
      callback();
    },
    /**
     * 验证字段
     * @param arr
     * @param callback
     */
    validateFields(arr, callback) {
      let promiseArray = [];
      for (let item of arr) {
        let p = new Promise((resolve, reject) => {
          this.$refs["form"].validateField(item, (err) => {
            if (!err) {
              resolve();
            } else {
              reject(err);
            }
          });
        });
        promiseArray.push(p);
      }
      Promise.all(promiseArray)
        .then(() => {
          callback();
        })
        .catch((err) => {
          callback(err);
        });
    },
    acceptUsername(username) {
      this.model["username"] = username;
    },
    //账号密码登录
    handleLogin() {
      this.validateFields(["username", "password"], (err) => {
        if (!err) {
          let loginParams = {
            username: this.model.username,
            password: this.model.password,
          };
          this.Login(loginParams)
            .then((res) => {
              this.$emit("success", res.result);
            })
            .catch((err) => {
              this.$emit("fail", err);
            });
        } else {
          this.$emit("validateFail");
        }
      });
    },
  },
};
</script>

<style lang="less">
#login {
    height: 100%;
    position: relative;
    
    background:  url('../../assets/image/login.png') no-repeat 50%;
  // &:after{
  //   content: '';
  //   display: block;
  //   background: rgba(255, 255, 255, 0.6);
  //   width: 360px;
  //   height: 440px;
  //   border-radius: 8px;
  //   position: absolute;
  //   z-index: 1;
  //   left: 10px;
  //   top: -10px;
  // }
  // &:before{
  //   content: '';
  //   display: block;
  //   background: rgba(255, 255, 255, 0.6);
  //   width: 360px;
  //   height: 440px;
  //   border-radius: 8px;
  //   position: absolute;
  //   z-index: 1;
  //   left: 10px;
  //   top: -10px;
  // }
  .user-login {
    position: absolute;
    width: 380px;
    height: 440px;
    padding: 40px;
    top: 50%;
    left: 50%;
    background: #FFF;
    border-radius: 8px;
    transform: translate(-50%, -60%);
    // width: 368px;
    text-align: center;
    .user-text {
      color: #1890ff;
      font-size: 14px;
      margin: 20px;
    }
    .title{
      text-align: center;
      .logo{
        width: 60px;
        margin: 10px;
      }
      div{
        color: #666;
        font-size: 24px;
        line-height: 40px;
      }
    }
    .ant-form {
      // min-width: 368px;
      // width: 368px;
      margin: 0 auto;
    }
    .user-btn {
      height: 40px;
      border-color: #1890ff;
      color: #fff;
      cursor: pointer;
      border-radius: 40px;
      margin-top: 48px;
      box-shadow: 0 2px 5px rgb(56 158 236 / 50%);
      background: linear-gradient(-45deg, #38d0ec, #389eec);
    }
    // .ant-col {
    //   height: 48px;
    //   min-height: 48px;
    // }
  }
}
</style>
