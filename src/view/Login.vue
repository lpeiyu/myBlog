<template>
  <div class="login-body">
    <div class="panal">
      <div class="title">用户登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="formData.account"
            size="large"
          >
            <template #prefix>
                <i class="iconfont icon-user-line"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
            size="large"
          >
            <template #prefix>
              <i class="iconfont icon-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <div class="check-code-panel">
          <el-form-item prop="checkCode">
            <el-input
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              class="input-panel"
              size="large"
              @keydown.enter="login"
            />
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-checkbox :true-label="1" v-model="formData.rememberMe"
            >记住我</el-checkbox
          >
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
import md5 from "js-md5"
import VueCookies from 'vue-cookies'
import { useRouter } from "vue-router";
const {proxy} = getCurrentInstance()
const formDataRef=ref(null)
const formData = reactive({});
const router=useRouter()
//验证码接口和点击更新
const checkCodeUrl = ref("api/checkCode");
const changeCheckCode = () => {
  checkCodeUrl.value = "api/checkCode?" + new Date().getTime();
};
const rules={
    account:[{
        required:true,
        message:"请输入用户名"
    }],
    password:[{
        required:true,
        message:"请输入密码"
    }],
    checkCode:[{
        required:true,
        message:"请输入验证码"
    }]
}
//自动填入账号密码
const init=()=>{
    const loginInfo=VueCookies.get('loginInfo')
    if(!loginInfo){
        return
    }
    //将loginInfo的值复制到formData
    Object.assign(formData,loginInfo)
}
init()
const login=()=>{
    formDataRef.value.validate(async (valid)=>{
        if(!valid){
            return
        }
        let cookieLoginInfo = VueCookies.get("loginInfo")
        let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
        if(formData.password!==cookiePassword){
            formData.password=md5(formData.password)
        }
        let params={
                account:formData.account,
                password: formData.password,
                checkCode:formData.checkCode
        }
        let result=await proxy.Request({
            url:'/login',
            params:params,
            errorCallback:()=>{
                changeCheckCode()
            }
        })
        
        if(!result){
            return
        }
        proxy.message.success("登陆成功")
        setTimeout(()=>{
            router.push("/")
        },1500)
        const loginInfo={
            account:params.account,
            password:params.password,
            rememberMe:formData.rememberMe
        }
        //存储用户信息
        VueCookies.set('userInfo',result.data,0)
        if(formData.rememberMe==1){
            // 记住账号密码7天
            VueCookies.set("loginInfo",loginInfo,"7d")
        }
    })
}
</script>

<style lang="less">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-image: url("../assets/login.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .panal {
    width: 350px;
    margin-top: 100px;
    float: right;
    padding: 20px;
    margin-right: 100px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
    .title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 10px;
    }
    .check-code-panel {
      display: flex;
      .input-panel {
        flex: 1;
        margin-right: 5px;
      }
      .check-code {
        cursor: pointer;
      }
    }
  }
}
</style>