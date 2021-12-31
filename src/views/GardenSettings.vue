<template>
    <el-container>
        <el-header>
            <el-row type="flex" align="middle" justify="space-between">
                <el-page-header @back="goBack" content="系统设置"></el-page-header>
                <el-button type="primary" @click="submitForm">保存设置</el-button>
            </el-row>
        </el-header>
        <el-main class="settings_main">
            <el-row type="flex">
                <el-col :offset="2" :span="9">
                    <div class="settings_gap_l">
                        <el-upload
                                action="/api/file/upload"
                                :show-file-list="false"
                                :on-error="handleAvatarFail"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :on-progress="handleUploading">
                            <el-button type="primary">上传背景图</el-button>
                            <span slot="tip" class="el-upload__tip">只能上传宽高比为 2:1 的 jpeg/jpg/png 文件，且不超过 20MB</span>
                        </el-upload>
                        <div id="garden-box">
                            <i class="el-icon-location-outline point" :class="{'active':point.active}"
                               :key="ix" v-for="(point,ix) in ruleForm.positionList"
                               :style="{left:point.x,top:point.y}"
                               @mousedown="toMove(point,ix,$event)"></i>
                            <div class="garden-box_bg">
                                <img :src="'http://122.112.165.72:8010/api/file/upload/'+ruleForm.bgUrl" alt=""
                                     v-if="ruleForm.bgUrl">
                                <span v-else>暂无图片</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="9" class="settings_main_r">
                    <div class="settings_gap_r">
                        <el-row>
                            <el-button type="primary" :disabled="!ruleForm.bgUrl" @click="addAnchorPoint">添加定位点</el-button>
                            <el-button type="primary" :disabled="!activePoint.active" @click="deleteAnchorPoint">删除定位点</el-button>
                        </el-row>
                        <el-row class="position_msg">
                            <el-form :model="activePoint" :rules="rules" ref="pointForm"
                                     label-width="120px" :disabled="!activePoint.active">
                                <el-form-item label="点位名称" prop="name">
                                    <el-input v-model="activePoint.name"></el-input>
                                </el-form-item>
                                <el-form-item label="绑定设备" prop="device">
                                    <el-select v-model="activePoint.device" placeholder="请选择设备"
                                               style="width: 100%;">
                                        <el-option :label="device.nickName" :value="device.facility"
                                                   v-for="(device,ix) in deviceList" :key="ix"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="点位颜色" prop="color">
                                    <el-color-picker v-model="activePoint.color"></el-color-picker>
                                </el-form-item>
                                <el-form-item label="面积" prop="area">
                                    <el-input v-model="activePoint.area"></el-input>
                                </el-form-item>
                                <el-form-item label="湿度区间" required>
                                    <el-row>
                                        <el-col :span="11">
                                            <el-form-item prop="humidityMin">
                                                <el-input v-model="activePoint.humidityMin"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2" class="cc">-</el-col>
                                        <el-col :span="11">
                                            <el-form-item prop="humidityMax">
                                                <el-input v-model="activePoint.humidityMax"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="局部环境图片" prop="partImg">
                                    <el-upload
                                            class="avatar-uploader"
                                            action="/api/file/upload"
                                            :show-file-list="false"
                                            :on-error="handleAvatarFailPart"
                                            :on-success="handleAvatarSuccessPart"
                                            :before-upload="beforeAvatarUploadPart"
                                            :on-progress="handleUploading">
                                        <div class="avatar" v-if="activePoint.partImg">
                                            <img :src="'http://122.112.165.72:8010/api/file/upload/'+activePoint.partImg">
                                        </div>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        <div slot="tip" class="el-upload__tip">只能上传宽高比为 3:1 的 jpeg/jpg/png 文件，且不超过 20MB</div>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {validateNumberOne} from '@/assets/js/validate.js'
  export default {
    name: "GardenVisualization",
    data() {
      return {
        userInfo: null,
        deviceList: [],
        draggingBtn: false,
        activePoint:{
          name:'',
          partImg:'',
          device:'',
          area:'',
          color:'',
          humidityMin:'',
          humidityMax:'',
          active:false,
          x:'',
          y:''
        },
        activeIdx:-1,
        loadingUpload: false,
        ruleForm: {
          id:'',
          bgUrl: "",
          positionList: [],
          userId: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入点位名称', trigger: 'blur'},
          ],
          area: [
            {required: true, message: '请输入面积', trigger: 'blur'},
          ],
          color: [
            {required: true, message: '请选择点位的颜色', trigger: 'change'},
          ],
          humidityMin: [
            {required: true, message: '请输入最小值', trigger: 'blur'},
          ],
          humidityMax: [
            {required: true, message: '请输入最大值', trigger: 'blur'},
          ],
          device: [
            {required: true, message: '请选择绑定的设备', trigger: 'change'}
          ],
          partImg: [
            {required: true, message: '请选择局部图片', trigger: 'change'}
          ]
        }
      }
    },
    created: function () {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      this.ruleForm.userId=this.userInfo.id;
      this.loadData();
      this.loadDevice();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      addAnchorPoint() {
        for(let obj of this.ruleForm.positionList.values()){
          if(!obj.name||!obj.partImg||!obj.device||!obj.area||!obj.color||!obj.humidityMin||!obj. humidityMax){
            this.$message.warning('有定位点的相关信息未设置，请检查!');
            return false
          }
          if(!validateNumberOne(obj.area)||!validateNumberOne(obj.humidityMin)||!validateNumberOne(obj.humidityMax)){
            this.$message.warning('面积、湿度区间只能输入数字，且最多两位小数，请检查!');
            return false
          }
          if(Number(obj.humidityMin)>=Number(obj.humidityMax)){
            this.$message.warning('湿度区间最大值必须大于最小值，请检查!');
            return false
          }
        }
        this.ruleForm.positionList.push({
          name:'',
          partImg:'',
          active:false,
          device:'',
          area:'',
          color:'',
          humidityMin:'',
          humidityMax:'',
          x: '40%',
          y: '50%'
        });
        this.chooseAdr(this.ruleForm.positionList.length-1);
      },
      deleteAnchorPoint(){
        this.ruleForm.positionList.splice(this.activeIdx,1);
        this.activePoint={
          name:'',
          partImg:'',
          device:'',
          active:false,
          area:'',
          color:'',
          humidityMin:'',
          humidityMax:'',
          x:'',
          y:''
        };
        this.activeIdx=-1;
      },
      chooseAdr(ix){
        if(this.activeIdx===ix){
          return false
        }
        for(let obj of this.ruleForm.positionList.values()){
          obj.active=false;
        }
        this.activeIdx=ix;
        this.ruleForm.positionList[ix].active=true;
        this.activePoint=this.ruleForm.positionList[ix];
      },
      toMove(data,ix, e) {
        let odiv = e.target;
        let wBox = document.getElementById('garden-box').getBoundingClientRect();
        let wBoxL = wBox.left;
        let wBoxT = wBox.top;
        let wBoxW = wBox.width;
        let wBoxH = wBox.height;
        let iX = e.clientX - wBoxL - odiv.offsetLeft;
        let iY = e.clientY - wBoxT - odiv.offsetTop;
        let boxW = wBoxW - odiv.offsetWidth;
        let boxH = wBoxH - odiv.offsetHeight;
        this.draggingBtn = true;
        this.chooseAdr(ix);
        document.onmousemove = (e) => {       //鼠标按下并移动的事件
          if (this.draggingBtn) {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let oX = e.clientX - wBoxL - iX;
            let oY = e.clientY - wBoxT - iY;
            if (oX <= 0) {
              oX = 0;
            }
            if (oX >= boxW) {
              oX = boxW;
            }
            if (oY <= 0) {
              oY = 0;
            }
            if (oY >= boxH) {
              oY = boxH;
            }
            //绑定元素位置到positionX和positionY上面
            data.x = Math.floor(oX / wBoxW * 100) + '%';
            data.y = Math.floor(oY / wBoxH * 100) + '%';
            return false;
          }
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
          this.draggingBtn = false;
          e.stopPropagation();
        };
      },
      handleAvatarFail() {
        this.loadingUpload.close();
        this.$message.error('上传失败!');
      },
      handleAvatarSuccess(res) {
        this.loadingUpload.close();
        if (res.code == 40000) {
          this.$message.success('上传成功!');
          this.ruleForm.bgUrl = res.data;
        } else {
          this.$message.error(res.message);
        }
      },
      beforeAvatarUpload(file) {
        let fAry = ['image/jpeg', 'image/jpg', 'image/png'];
        const isJPG = fAry.includes(file.type);
        const isLt20M = file.size / 1024 / 1024 <= 20;
        if (!isJPG) {
          this.$message.warning('上传背景图片只能是 jpeg/jpg/png 格式!');
          return false
        }
        if (!isLt20M) {
          this.$message.warning('上传背景图片大小不能超过 20MB!');
          return false
        }
        const isSize=new Promise(function(resolve, reject){
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function(){
            let valid = img.width /img.height === 2;
            valid ? resolve() : reject();
          };
          img.src = _URL.createObjectURL(file);
        }).then(()=>{
          return file;
        }, ()=>{
          this.$message({
            message:'请上传宽高比为2:1的图片，请重新选择!',
            type: 'warning'
          });
          return Promise.reject();
        });
        return isSize
      },
      handleUploading(){
          this.loadingUpload = this.$loading({
            lock: true,
            text: '请稍后...'
          });
      },
      handleAvatarFailPart() {
        this.loadingUpload.close();
        this.$message.error('上传失败!');
      },
      handleAvatarSuccessPart(res) {
        this.loadingUpload.close();
        if (res.code == 40000) {
          this.$message.success('上传成功!');
          this.activePoint.partImg = res.data;
        } else {
          this.$message.error(res.message);
        }
      },
      beforeAvatarUploadPart(file) {
        let fAry = ['image/jpeg', 'image/jpg', 'image/png'];
        const isJPG = fAry.includes(file.type);
        const isLt20M = file.size / 1024 / 1024 <= 20;
        if (!isJPG) {
          this.$message.warning('上传局部图片只能是 jpeg/jpg/png 格式!');
          return false
        }
        if (!isLt20M) {
          this.$message.warning('上传局部图片大小不能超过 20MB!');
          return false
        }
        const isSizes=new Promise(function(resolve, reject){
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function(){
            let valid = img.width === img.height*3;
            valid ? resolve() : reject();
          };
          img.src = _URL.createObjectURL(file);
        }).then(()=>{
          return file;
        }, ()=>{
          this.$message({
            message:'请上传宽高比为3:1的图片，请重新选择!',
            type: 'warning'
          });
          return Promise.reject();
        });
        return isSizes
      },
      submitForm() {
        if(!this.ruleForm.bgUrl){
          this.$message.warning('请设置背景图片!');
          return false
        }
        if(!this.ruleForm.positionList.length){
          this.$message.warning('请添加定位点!');
          return false
        }
        for(let obj of this.ruleForm.positionList.values()){
          if(!obj.name||!obj.partImg||!obj.device||!obj.area||!obj.color||!obj.humidityMin||!obj. humidityMax){
            this.$message.warning('有定位点的相关信息未设置，请检查!');
            return false
          }
          if(!validateNumberOne(obj.area)||!validateNumberOne(obj.humidityMin)||!validateNumberOne(obj.humidityMax)){
            this.$message.warning('面积、湿度区间只能输入数字，且最多两位小数，请检查!');
            return false
          }
          if(Number(obj.humidityMin)>=Number(obj.humidityMax)){
            this.$message.warning('湿度区间最大值必须大于最小值，请检查!');
            return false
          }
        }
        this.ajaxPost({
          url: '/api/facility/pointPosition/addPointPosition',
          headers: {
            Access_User_Token: this.userInfo.token
          },
          data: this.ruleForm,
          success: function () {
            this.$message.success('设置成功!');
          }
        })
      },
      loadData() {
        this.ajaxPost({
          url: '/api/facility/pointPosition/findPointPositionList',
          headers: {
            Access_User_Token: this.userInfo.token
          },
          data: {
            userId: this.userInfo.id
          },
          success: function (res) {
            if (res.data) {
              this.ruleForm = res.data;
              for(let obj of this.ruleForm.positionList.values()){
                obj.active=false;
              }
            }
          }
        })
      },
      loadDevice() {
        this.ajaxPost({
          url: '/api/facility/facility/findFacilityList',
          headers: {
            Access_User_Token: this.userInfo.token
          },
          data: {
            userId: this.userInfo.id,
            nowPage: 1,
            pageSize: 50
          },
          success: function (res) {
            this.deviceList = res.data.records;
          }
        })
      }
    }
  }
</script>

<style scoped>
    .el-main.settings_main {
        padding: 30px 60px;
    }

    #garden-box {
        margin-top: 30px;
        position: relative;
    }

    .garden-box_bg {
        border: 1px solid #d2d2d2;
        font-size: 0;
    }

    .garden-box_bg img {
        width: 100%;
        height: auto;
    }

    .garden-box_bg span {
        line-height: 50px;
        margin-left: 20px;
        font-size: 14px;
    }

    .point {
        position: absolute;
        font-size: 32px;
    }

    .point.active {
        color: #409eff;
    }

    .el-page-header {
        line-height: 60px;
    }

    .el-header {
        height: auto !important;
        padding: 0 40px;
        border-bottom: 1px solid #d2d2d2;
    }

    .position_msg {
        margin-top: 30px;
    }

    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 360px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 360px;
        height: 120px;
        display: block;
        overflow: hidden;
    }

    .avatar img {
        width: 100%;
    }

    .el-upload__tip {
        margin-left: 10px;
        color: red;
    }

    .settings_main_r {
        border-left: 1px solid #d2d2d2;
    }

    .settings_gap_l {
        padding-right: 80px;
    }

    .settings_gap_r {
        padding-left: 80px;
    }
    .cc{
        text-align: center;
    }
</style>