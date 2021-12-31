<template>
    <el-row class="export-content">
        <el-form ref="exportForm" :inline="true" :model="formData" :rules="rules">
            <el-form-item label="选择设备" prop="clientId">
                <el-select v-model="formData.clientId" placeholder="设备">
                    <el-option :label="device.nickName" :value="device.facility"
                               v-for="(device,ix) in deviceList" :key="ix"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围" prop="daterange">
                <el-date-picker
                        class="exportTime"
                        v-model="formData.daterange"
                        :picker-options="pickerOption"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="导出类型" class="extype">
                <el-select v-model="formData.group" placeholder="类型">
                    <el-option label="月" value="1"></el-option>
                    <el-option label="年" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="toExport">导出<i class="el-icon-download el-icon--right"></i>
                </el-button>
            </el-form-item>
        </el-form>
    </el-row>
</template>

<script>
  export default {
    name: "export",
    data() {
      return {
        userInfo: null,
        formData: {
          daterange: '',
          clientId: '',
          group: '1',
          startTime: '',
          endTime: ''
        },
        deviceList: [],
        rules: {
          clientId: [
            {required: true, message: '请选择设备', trigger: 'change'}
          ],
          daterange: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        pickerOption:{
          disabledDate: time => {
            return time.getTime() > new Date().getTime();
          }
        }
      }
    },
    watch: {
      'formData.daterange': function (val) {
        if (val) {
          this.formData.startTime = val[0]+' 00:00:00';
          this.formData.endTime = val[1]+' 23:59:59';
        } else {
          this.formData.startTime = '';
          this.formData.endTime = '';
        }
      }
    },
    created() {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      this.loadDevice();
    },
    methods: {
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
      },
      toExport() {
        this.$refs["exportForm"].validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '请稍后...'
            });
            this.ajaxDocumentFlow({
              method: 'get',
              url: `/api/equipment/mqtt/export?clientId=${this.formData.clientId}&group=${this.formData.group}&startTime=${this.formData.startTime}&endTime=${this.formData.endTime}`
            }, function (res) {
              this.exportDocumentFlow(res);
            }, function () {
              loading.close();
            });
          } else {
            return false;
          }
        });
      },
      ajaxDocumentFlow(options, success, complete) {
        options.timeout = 60000;
        options.responseType = 'arraybuffer';
        this.axios(options).then(response => {
          if (response.headers['content-type'].indexOf('application/json') > -1) {
            let reD = JSON.parse(Buffer.from(response.data).toString('utf8'));
            this.$message({
              type: 'error',
              message: reD.message,
              showClose: true
            });
          } else {
            if (typeof success === 'function') {
              success.call(this, response);
            }
          }
          if (typeof complete === 'function') {
            complete.call(this, response);
          }
        }).catch((error) => {
          this.$message({
            type: 'error',
            message: error,
            showClose: true
          });
          if (typeof complete === 'function') {
            complete.call(this, error);
          }
        });
      },
      exportDocumentFlow(result) {   //传入文档流进行下载
        const contentDisposition = result.headers['content-disposition'];
        const filename = decodeURI(contentDisposition.split('fileName=')[1] || contentDisposition.split('filename=')[1]);
        const blob = new Blob([result.data]);
        const url = window.URL.createObjectURL(blob);
        if (window.navigator.msSaveBlob) {
          try {
            window.navigator.msSaveBlob(blob, filename);
          } catch (e) {
            console.log(e);
          }
        } else {
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
        }
      }
    }
  }
</script>

<style scoped>
    .export-content {
        padding: 20px;
    }

    .export-content /deep/ .el-date-editor--datetimerange.el-input, .export-content /deep/ .el-date-editor--datetimerange.el-input__inner {
        width: 500px;
    }

    .export-content /deep/ .el-range-editor.el-input__inner {
        padding-right: 10px;
    }
    .extype /deep/ .el-select{
        width: 100px;
    }
</style>