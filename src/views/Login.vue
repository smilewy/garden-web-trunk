<template>
    <el-row class="login_conent">
        <el-row class="login_box">
            <el-row class="title">登录</el-row>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width=".5rem"
                     @keydown.enter.native="submitForm">
                <el-form-item label="用户名" prop="account">
                    <el-input v-model="ruleForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="页面类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择页面类型" style="width: 100%;">
                        <el-option label="园林" value="0"></el-option>
                        <el-option label="冷库" value="1"></el-option>
                        <el-option label="大棚种植" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="center">
                <el-button type="primary" @click="submitForm">登录</el-button>
            </el-row>
        </el-row>
        <el-row class="bh">
            <span><a href="https://beian.miit.gov.cn" target="_blank">蜀ICP备20020280号</a> &copy;博视广达科技</span>
        </el-row>
    </el-row>
</template>

<script>
  import {isvalidPhone} from '@/assets/js/validate.js'
  export default {
    name: "Login",
    data() {
      let checkField = (rule, value, callback) => {
        if (!value&&!isvalidPhone(value)) {
          callback(new Error('请输入手机号码'));
        }else{
          callback();
        }
      };
      return {
        ruleForm: {
          account: '',
          password: '',
          type: '0'
        },
        rules: {
          account: [{required: true, validator: checkField, trigger: 'blur'}],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let tiaozhuanUrl='';
            if(this.ruleForm.type==='0'){
              tiaozhuanUrl='/home';
            }else if(this.ruleForm.type==='1'){
              tiaozhuanUrl='/freezerVisualization';
            }else {
              return false
            }
            this.ajaxPost({
              url: '/api/user/user/userLogin?account='+this.ruleForm.account+'&password='+this.ruleForm.password,
              success: function (res) {
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                this.$router.push(tiaozhuanUrl);
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
    .login_conent{
        width: 100%;
        height: 100%;
        background-image: url("./../assets/img/login_bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }
    .login_conent::before{
        content: '';
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.4);
    }
    .login_box {
        position: absolute;
        width: 550px;
        top: 50%;
        left: 50%;
        background-color: #fff;
        transform: translate(-50%, -50%);
        border: 1px solid #d2d2d2;
        border-radius: 5px;
        padding: 40px;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        -webkit-box-shadow: 0 10px 20px 20px rgba(0,0,0,.2);
        -moz-box-shadow: 0 10px 20px 20px rgba(0,0,0,.2);
        box-shadow: 0 10px 20px 20px rgba(0,0,0,.2);
    }

    .title {
        font-size: 30px;
        text-align: center;
        margin-bottom: 30px;
    }
    .bh{
        position: absolute;
        bottom: 20px;
        left: 50%;
        color: #ffffff;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }
    .bh a{
        color: #ffffff;
        text-decoration: none;
    }
    .bh a:hover{
        color: #409eff;
    }
</style>