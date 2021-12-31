<template>
    <el-container id="gardenVisualization">
        <div id="iCenter"></div>
        <el-header class="garden_header">
            <el-row type="flex" align="middle" justify="space-between">
                <div class="title">户外景观养护控制系统展示屏</div>
                <div class="login_msg">
                    <el-row type="flex" align="middle">
                        <div class="time_box">
                            <p class="time">{{curDate.h}}</p>
                            <p class="other_msg">{{curDate.year}}年{{curDate.month}}月{{curDate.day}}日</p>
                        </div>
                        <div>
                            <div class="state">
                                <span>网络状态：已连接</span>
                                <span>版本：Beta2021.1.2</span>
                            </div>
                            <div class="other_msg">
								<span @click="goExport">
									<i class="el-icon-download"></i>导出
								</span>
                                <span @click="goSettings">
									<i class="iconfont icon-tubiao-shezhi"></i>系统设置
								</span>
                                <span @click="loginOut">
									<i class="iconfont icon-tuichu"></i>屏幕重启
								</span>
                            </div>
                        </div>
                    </el-row>
                </div>
            </el-row>
        </el-header>
        <el-main>
            <el-row class="garden_vh" type="flex">
                <el-col class="visualizationBox_l garden_vh">
                    <el-row type="flex" align="bottom" justify="center" class="position_img">
                        <div id="position_canvas">
                            <div class="position_img_text">
                                <canvas id="canvas"></canvas>
                                <div class="line_box">
                                    <span class="line_box_circle"
                                          :class="{'line_box_circle_l':pointCircleL,'line_box_circle_r':!pointCircleL}"></span>
                                </div>
                                <el-row type="flex" align="bottom" class="position_img_name">
                                    <div>
                                        <div class="curAdrName">{{activePoint.name}}</div>
                                        <div class="adrList">
                                            <span :key="ix" :style="{'backgroundColor':setting.color}"
                                                  v-for="(setting,ix) in settingList.positionList">{{setting.name}}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="details">绿地面积：{{activePoint.area}}<span class="unit_m">m</span></p>
                                        <p class="details">
                                            状态：{{activePointOther.humidityState}}/湿度{{activePointOther.humidityQujian}}</p>
                                        <p class="details">
                                            土壤温度：{{activePointOther.soilTemp}}℃，{{activePointOther.soilHumidity}}%</p>
                                        <p class="details">
                                            监测时长：{{settingList.monitoringH}}</p>
                                    </div>
                                </el-row>
                            </div>
                            <div class="garden_img">
                                <div class="point" :class="{'activeAdr':point.active}" :key="ix"
                                     v-for="(point,ix) in settingList.positionList" :style="{left:point.x,top:point.y}"
                                     @click="getPointData(ix)">
                                    <img src="../assets/img/adr_active.png" alt="" v-show="point.active">
                                    <img src="../assets/img/adr.png" alt="" v-show="!point.active">
                                </div>
                                <img :src="'http://122.112.165.72:8010/api/file/upload/'+settingList.bgUrl" alt="">
                            </div>
                        </div>
                    </el-row>
                    <div id="radar_chart"></div>
                </el-col>
                <el-col class="visualizationBox_c garden_vh">
                    <el-row type="flex" align="bottom" justify="center" class="part_img">
                        <div class="part_img_box">
                            <img :src="'http://122.112.165.72:8010/api/file/upload/'+activePoint.partImg" alt="">
                        </div>
                    </el-row>
                    <div class="part_chart1">
                        <el-row type="flex" class="garden_vh">
                            <el-row type="flex" align="middle" justify="center" class="circle_chart garden_vh">
                                <div class="circle_chart_box circle_chart_box1">
                                    <div>
                                        <img src="../assets/img/circle_01.png" alt="">
                                        <span>{{activePointOther.light}}</span>
                                    </div>
                                    <p>光照</p>
                                </div>
                            </el-row>
                            <el-row type="flex" align="middle" justify="center" class="circle_chart garden_vh">
                                <div class="circle_chart_box circle_chart_box2">
                                    <div>
                                        <img src="../assets/img/circle_02.png" alt="">
                                        <span>{{activePointOther.soilEC}}</span>
                                    </div>
                                    <p>EC</p>
                                </div>
                            </el-row>
                            <el-row type="flex" align="middle" justify="center" class="circle_chart garden_vh">
                                <div class="circle_chart_box circle_chart_box3">
                                    <div>
                                        <img src="../assets/img/circle_03.png" alt="">
                                        <span>{{activePointOther.soilPh}}</span>
                                    </div>
                                    <p>酸碱度</p>
                                </div>
                            </el-row>
                            <el-row type="flex" align="middle" justify="center" class="circle_chart garden_vh">
                                <div class="circle_chart_box circle_chart_box4">
                                    <div>
                                        <img src="../assets/img/circle_04.png" alt="">
                                        <span>
                                            <span>{{activePointOther.soilHumidity}}</span>
                                            <span class="unit">%</span>
                                        </span>
                                    </div>
                                    <p>土壤湿度</p>
                                </div>
                            </el-row>
                            <el-row type="flex" align="middle" justify="center" class="circle_chart garden_vh">
                                <div class="circle_chart_box circle_chart_box5">
                                    <div>
                                        <img src="../assets/img/circle_05.png" alt="">
                                        <span>
                                            <span>{{activePointOther.soilTemp}}</span>
                                            <span class="unit">℃</span>
                                        </span>
                                    </div>
                                    <p>土壤温度</p>
                                </div>
                            </el-row>
                        </el-row>
                    </div>
                    <div class="part_chart2">
                        <el-row type="flex" justify="space-between" align="middle" class="line_chart_title">
                            <span>
                            <i class="el-icon-caret-right"></i>
                            <span>数据趋势（30Days）</span>
                            </span>
                            <div class="lineChart_type">
                                <span class="activeLine" v-show="lineChartTime==='hour'" @click="reSetLineChartDy('day')">小时</span>
                                <span class="activeLine" v-show="lineChartTime==='day'" @click="reSetLineChartDy('hour')">天</span>
                                <span :key="ix" @click="reSetLineChart(item.value)"
                                      :class="{'activeLine':item.value===lineChartActive}"
                                      v-for="(item,ix) in lineChartFields">{{item.label}}</span>
                            </div>
                        </el-row>
                        <div id="line_chart"></div>
                    </div>
                </el-col>
                <el-col class="visualizationBox_r garden_vh">
                    <el-row type="flex" justify="center"
                            align="middle" class="garden_item">
                        <div>
                            <p>天气数据</p>
                            <p>（{{enviroment.weather.cond.txt}} {{enviroment.weather.wind.dir}}
                                {{enviroment.weather.tmp}}℃）</p>
                        </div>
                    </el-row>
                    <el-row type="flex" justify="center"
                            align="middle" class="garden_item">
                        <div>
                            <p>空气质量指数</p>
                            <p>（PM2.5:{{enviroment.aqi.city.pm25}} {{enviroment.aqi.city.qlty}}）</p>
                        </div>
                    </el-row>
                    <el-row type="flex" justify="center"
                            align="middle" class="garden_item">
                        <div>
                            <p>空气湿度</p>
                            <p>（{{enviroment.weather.hum}}）</p>
                        </div>
                    </el-row>
                    <el-row type="flex" justify="center"
                            align="middle" class="garden_item">
                        <div>
                            <p>紫外线指数</p>
                            <p>（{{enviroment.uv.brf}}）</p>
                        </div>
                    </el-row>
                    <el-row type="flex" justify="center"
                            align="middle" class="garden_item">
                        <div>
                            <p>降水概率</p>
                            <p>（{{enviroment.pop}}%）</p>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
  import AMap from 'AMap'
  import '@/assets/font/iconfont.css'
  import * as echarts from 'echarts';

  export default {
    name: "GardenVisualization",
    data() {
      return {
        curDate: {
          h: '',
          year: '',
          month: '',
          day: '',
          lunar: ''
        },
        enviroment: {
          aqi: {
            city: {}
          },
          pop: '',
          uv: {},
          weather: {
            cond: {},
            wind: {}
          }
        },
        userInfo: null,
        pointCircleL:true,
        activePoint: {
          name: '',
          partImg: '',
          device: '',
          area: '',
          color: '',
          humidityMin: '',
          humidityMax: '',
          active: false,
          x: '',
          y: ''
        },
        settingList: {
          id: '',
          bgUrl: "",
          monitoringH:'',
          positionList: [],
          userId: ''
        },
        activePointOther: {
          co2: '',
          created: '',
          humidity: '',
          humidityState: '',
          humidityQujian: '',
          light: '',
          sn: '',
          soilEC: '',
          soilHumidity: '',
          soilPh: '',
          soilTemp: '',
          temp: '',
          topic: ''
        },
        lineChartActive: 'temp',
        lineChartTime: 'day',
        lineChartData: [],
        lineChartFields: [{
          label: '温度',
          value: 'temp'
        }, {
          label: '土壤温度',
          value: 'soilTemp'
        }, {
          label: '湿度',
          value: 'humidity'
        }, {
          label: '土壤湿度',
          value: 'soilHumidity'
        }, {
          label: '含氧量',
          value: 'co2'
        }, {
          label: '光照',
          value: 'light'
        }, {
          label: '酸碱度',
          value: 'soilPh'
        }, {
          label: 'EC',
          value: 'soilEC'
        }],
        activePointIndex: 0,
        pointListLength: 0,
        timmer1: null,
        timmer2: null,
        radarChart: null,
        lineChart: null,
        timmer3:null
      }
    },
    mounted() {
      let that=this;
      // 基于准备好的dom，初始化echarts实例
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      this.curDate.h = this.dateFormatMine(new Date(), 'hh:mm:ss');
      this.curDate.year = new Date().getFullYear();
      this.curDate.month = new Date().getMonth() + 1;
      this.curDate.day = new Date().getDate();
      this.countCurTime();
      this.loadData();
      this.drawRadar();
      this.drawLineChart();
      this.getCurCity();
      setTimeout(function (){
        window.onresize = function () {
          that.radarChart.resize();
          that.lineChart.resize();
        }
      },200);
    },
    beforeDestroy() {
      clearInterval(this.timmer1);
      clearInterval(this.timmer2);
      clearInterval(this.timmer3);
      window.onresize=null;
    },
    methods: {
      goExport() {
        this.$router.push('/gardenExport');
      },
      goSettings() {
        this.$router.push('/gardenSettings');
      },
      countCurTime(){
        let that=this;
        this.timmer3=setInterval(function () {
          that.curDate.h = that.dateFormatMine(new Date(), 'hh:mm:ss');
          that.curDate.year = new Date().getFullYear();
          that.curDate.month = new Date().getMonth() + 1;
          that.curDate.day = new Date().getDate();
        },1000);
      },
      loginOut(){
        sessionStorage.setItem('userInfo','');
        this.$router.push('/');
      },
      getPointData(ix) {
        clearInterval(this.timmer1);
        this.activePointIndex = ix;
        this.changeData();
        this.startTimmer1();
      },
      changeData() {
        for (let obj of this.settingList.positionList.values()) {
          obj.active = false;
        }
        this.activePoint = this.settingList.positionList[this.activePointIndex];
        this.activePoint.active = true;
        if(this.activePoint.x.split('%')[0]<=50){
          this.pointCircleL = false;
        }else{
          this.pointCircleL = true;
        }
        this.loadPointOtherMsg(this.activePoint.device);
        this.loadPointLineChart();
      },
      startTimmer1() {
        let that = this;
        if (that.pointListLength > 1) {
          that.timmer1 = setInterval(function () {
            that.activePointIndex++;
            if (that.activePointIndex === that.pointListLength) {
              that.activePointIndex = 0;
            }
            that.changeData();
          }, 10000);
        }
      },
      countTime(dateBegin){
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        let dateEnd = new Date();//获取当前时间
        let dateStart=new Date(dateBegin);
        let dateDiff = dateEnd - dateStart;//时间差的毫秒数
        let hours=Math.floor(dateDiff/(3600*1000)); //计算出小时数
        //计算相差分钟数
        let leave2=dateDiff%(3600*1000);    //计算小时数后剩余的毫秒数
        let minutes=Math.floor(leave2/(60*1000)); //计算相差分钟数
        //计算相差秒数
        let leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
        let seconds=Math.round(leave3/1000);

        let timeFn = hours+"小时"+minutes+"分钟"+seconds+"秒";
        return timeFn;
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
              this.settingList = res.data;
              this.activePointIndex = 0;
              this.pointListLength = this.settingList.positionList.length;
              if(this.settingList.createdTime){
                this.settingList.monitoringH = this.countTime(this.settingList.createdTime);
              }
              this.changeData();
              this.startTimmer1();
            }
          }
        })
      },
      loadWeather(data) {
        this.ajaxGet({
          url: '/api/facility/getWeather?city=' + data.city,
          headers: {
            Access_User_Token: this.userInfo.token
          },
          success: function (res) {
            this.enviroment = res.data;
          }
        })
      },
      loadPointOtherMsg(sn) {
        this.ajaxGet({
          url: '/api/equipment/mqtt/getParkAllNowByClientId?clientId=' + sn,
          headers: {
            Access_User_Token: this.userInfo.token
          },
          success: function (res) {
            this.activePointOther = Object.assign({}, res.data);
            if (this.activePointOther.created) {
              let hs = new Date() - new Date(this.activePointOther.created);
              let d = hs <= 60 * 1000;
              this.activePointOther.humidityState = d ? '正常' : '异常';
            }
            if (this.activePointOther.humidity || this.activePointOther.humidity === 0) {
              if (this.activePointOther.humidity < this.activePoint.humidityMin) {
                this.activePointOther.humidityQujian = '偏低';
              } else if (this.activePointOther.humidity > this.activePoint.humidityMax) {
                this.activePointOther.humidityQujian = '偏高';
              } else {
                this.activePointOther.humidityQujian = '饱和';
              }
            }
            this.$nextTick(function () {
              this.drawLine();
            });
            this.radarChart.setOption({
              series: [{
                data: [
                  {
                    value: [this.activePointOther.temp, this.activePointOther.soilTemp, this.activePointOther.humidity,
                      this.activePointOther.soilHumidity, this.activePointOther.soilEC, this.activePointOther.soilPh]
                  }
                ]
              }]
            });
          }
        })
      },
      loadPointLineChart() {
        let sTime='',eTime='',group='';
        if(this.lineChartTime==='day'){
          sTime = this.dateFormatMine(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss');
          eTime = this.dateFormatMine(new Date(), 'yyyy-MM-dd hh:mm:ss');
          group='1d';
        }else{
          sTime = this.dateFormatMine(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:mm:ss');
          eTime = this.dateFormatMine(new Date(), 'yyyy-MM-dd hh:mm:ss');
          group='1h';
        }
        this.ajaxGet({
          url: '/api/equipment/mqtt/getParkAllByClientId?clientId=' + this.activePoint.device
            + '&group='+group+'&startTime=' + sTime + '&endTime=' + eTime,
          headers: {
            Access_User_Token: this.userInfo.token
          },
          success: function (res) {
            this.lineChartData = res.data;
            this.reSetLineChart();
          }
        })
      },
      drawRadar() {
        this.radarChart = echarts.init(document.getElementById('radar_chart'));
        // 指定图表的配置项和数据
        let radarOption = {
          radar: [
            {
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgb(108,255,205)',
                  width: 2
                }
              },
              name: {
                color: 'rgb(108,255,205)',
                fontSize: 16
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ["rgb(53,102,102)"]  // 图表背景网格的颜色
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  width: 1,
                  color: '#286fbb' // 图表背景网格线的颜色
                }
              },
              indicator: [
                {text: '温度', max: 60},
                {text: '土壤温度', max: 60},
                {text: ' 湿度', max: 100},
                {text: '土壤湿度', max: 100},
                {text: 'EC', max: 1000},
                {text: '酸碱度', max: 14}
              ],
              center: ['50%', '50%'],
              radius: '62%'
            }
          ],
          series: [
            {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              symbol: 'none',
              lineStyle: {
                color:'rgb(58,154,252)'
              },
              areaStyle: {
                color: 'rgb(58,154,252)',
                opacity: 0.9
              },
              data: [
                {
                  value: []
                }
              ]
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.radarChart.setOption(radarOption);
      },
      reSetLineChartDy(h){
        this.lineChartTime=h;
        this.loadPointLineChart();
      },
      reSetLineChart(field) {
        let dateAry = [];
        let dataAry = [];
        if (field) {
          this.lineChartActive = field;
        }
        if (this.lineChartData[0]) {
          if(this.lineChartTime==='day'){
            for (let obj of this.lineChartData.values()) {
              dateAry.push(this.dateFormatMine(obj.created, 'yyyy-MM-dd'));
              dataAry.push(obj[this.lineChartActive]);
            }
          }else{
            for (let obj of this.lineChartData.values()) {
              dateAry.push(this.dateFormatMine(obj.created, 'hh:mm:ss'));
              dataAry.push(obj[this.lineChartActive]);
            }
          }
        }
        this.lineChart.setOption({
          xAxis: {
            data: dateAry
          },
          series: [{
            data: dataAry
          }]
        });
      },
      drawLineChart() {
        this.lineChart = echarts.init(document.getElementById('line_chart'));
        // 指定图表的配置项和数据
        let option = {
          grid: {
            show: false,
            left:'5%',
            bottom: 10,
            top: 10,
            right: 0
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgb(53,102,102)',
                width: 2
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: []
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              color:'rgb(254, 203, 41)'
            }
          },
          series: [{
            data: [],
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 0
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgb(254,203,41)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgb(2,50,50)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.lineChart.setOption(option);
      },
      drawLine() {
        let canvasBox = document.getElementById('position_canvas');
        let targetBox = document.getElementsByClassName('activeAdr')[0];
        let targetBoxParent = document.getElementsByClassName('garden_img')[0];
        let startBox = document.getElementsByClassName('line_box')[0];
        let canvas = document.getElementById("canvas");//获取到canvas元素
        let boxDom = canvasBox.getBoundingClientRect();
        let context = canvas.getContext("2d");//获取上下文的环境
        let moveToL='';
        if(this.pointCircleL){
          moveToL=startBox.offsetLeft + startBox.offsetWidth - 1;
        }else{
          moveToL=startBox.offsetLeft + 1;
        }
        //canvas 是基于状态的绘制，而不是对象
        //设置宽高
        canvas.width = boxDom.width;
        canvas.height = boxDom.height;
        context.beginPath();
        context.moveTo(moveToL, startBox.offsetTop + 1);
        context.lineTo(targetBox.offsetLeft + targetBoxParent.offsetLeft + targetBox.offsetWidth / 2, targetBox.offsetTop + targetBoxParent.offsetTop + 2);
        context.closePath();
        context.lineWidth = 1;//线条的宽度
        context.strokeStyle = "rgb(108,255,205)";//线条的颜色
        context.stroke();//绘制
      },
      getCurCity() {
        let that = this;
        const toast = that.$loading({
          lock: true,
          text: '请求中，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        });
        let mapObj = new AMap.Map('iCenter');
        mapObj.plugin('AMap.CitySearch', function () {
          let geolocation = new AMap.CitySearch();
          mapObj.addControl(geolocation);
          geolocation.getLocalCity();
          AMap.event.addListener(geolocation, 'complete', function (res) {
            toast.close();
            that.loadWeather(res);
            that.timmer2 = setInterval(function () {
              that.loadWeather(res);
            }, 30000);
          });//返回定位信息
          AMap.event.addListener(geolocation, 'error', function (res) {
            toast.close();
            that.$message.error(res.info)
          }); //返回定位出错信息
        });
      }
    }
  }
</script>

<style scoped>
    #gardenVisualization {
        width: 100%;
        height: 100%;
        padding: 20px;
        background-color: rgb(2, 50, 50);
    }

    .garden_header {
        height: 80px !important;
        overflow: hidden;
    }

    .title {
        color: rgb(108, 255, 205);
        font-size: 40px;
    }

    .login_msg {
        text-align: right;
        color: rgb(103, 153, 152);
    }

    .time_box {
        margin-right: 30px;
    }

    .time {
        font-size: 32px;
    }

    .state {
        font-size: 12px;
    }

    .other_msg {
        font-size: 18px;
    }

    .state + .other_msg {
        margin-top: 16px;
    }

    .other_msg i {
        font-size: 30px;
        vertical-align: middle;
        margin-right: 10px;
    }

    .other_msg > span {
        cursor: pointer;
    }

    .state > span + span, .other_msg > span + span {
        margin-left: 20px;
    }

    .garden_vh {
        height: 100%;
    }

    .visualizationBox_l {
        width: 29%;
        margin-right: 3%;
    }

    .visualizationBox_c {
        width: 53%;
    }

    .visualizationBox_r {
        margin-left: 3%;
        width: 12%;
    }

    .garden_item {
        border: 2px solid rgb(53, 102, 102);
        color: rgb(108, 255, 205);
        width: 100%;
        height: calc((100% - 40px) / 5);
        font-size: 20px;
        text-align: center;
    }

    .garden_item + .garden_item {
        margin-top: 10px;
    }

    .part_img {
        height: 46%;
    }
    .part_img_box{
        width: 966px;
        height: 322px;
    }
    .part_img_box img {
        width: 100%;
        height: auto;
    }

    .position_img {
        height: 46%;
    }

    #position_canvas {
        position: relative;
    }

    .garden_img {
        margin: auto;
        width: 460px;
        height: 230px;
        position: relative;
    }

    .position_img_text {
        color: rgb(108, 255, 205);
        position: relative;
        margin-bottom: 35px;
    }

    #canvas {
        position: absolute;
        z-index: 6;
        pointer-events: none;
    }

    .line_box {
        position: absolute;
        width: 35%;
        height: 1px;
        background: rgb(108, 255, 205);
        left: 40%;
        bottom: 0;
    }

    .line_box_circle {
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background: rgb(108, 255, 205);
        top: -2px;
        position: absolute;
    }
    .line_box_circle.line_box_circle_r{
        right: 0;
    }
    .line_box_circle.line_box_circle_l{
        left: 0;
    }

    .position_img_name > div:first-child {
        width: 35%;
    }

    .position_img_name > div:last-child {
        width: 60%;
        margin-left: 5%;
    }

    .curAdrName {
        border: 2px solid rgb(53, 102, 102);
        text-align: center;
        padding: 14px 0;
        font-size: 24px;
        margin-bottom: 6px;
    }
    .adrList{
        font-size: 0;
    }
    .adrList > span {
        display: inline-block;
        background-color: rgb(103,103,202);
        margin-right: 10px;
        font-size: 16px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        overflow: hidden;
        margin-top: 5px;
        color:  rgb(2, 50, 50);
    }

    .ellipsisTxt {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .adrList > span:last-child {
        margin-right: 0;
    }

    .garden_img .point {
        position: absolute;
        line-height: 1;
        font-size: 0;
    }

    .garden_img .point img {
        width: 14px;
        height: auto;
    }

    .garden_img img {
        width: 100%;
        height: auto;
    }

    .part_chart1 {
        height: 30%;
    }

    .part_chart2 {
        height: 24%;
        color: rgb(254, 203, 41);
        border: 2px solid rgb(53, 102, 102);
    }

    .circle_chart {
        width: 16%;
    }

    .circle_chart + .circle_chart {
        margin-left: 5%;
    }

    #radar_chart {
        width: 100%;
        height: 54%;
    }

    .circle_chart_box {
        text-align: center;
    }

    .circle_chart_box > div {
        width: 150px;
        height: 150px;
        line-height: 150px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        font-size: 50px;
        position: relative;
    }
    .circle_chart_box > div img{
        width: 100%;
        height: 100%;
        -webkit-animation: toRound 5s linear 0s infinite normal;
        -o-animation:toRound 5s linear 0s infinite normal;
        animation:toRound 5s linear 0s infinite normal;
    }
    .circle_chart_box > div>span{
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    @keyframes toRound {
        from {
            -webkit-transform: rotate(0);
            -moz-transform: rotate(0);
            -ms-transform: rotate(0);
            -o-transform: rotate(0);
            transform: rotate(0);
        }
        to {
            -webkit-transform: rotate(-360deg);
            -moz-transform: rotate(-360deg);
            -ms-transform: rotate(-360deg);
            -o-transform: rotate(-360deg);
            transform: rotate(-360deg);
        }
    }

    .circle_chart_box > p {
        margin-top: 10px;
        font-size: 18px;
    }

    .circle_chart_box1 > p {
        color: rgb(153, 152, 58);
    }

    .circle_chart_box2 > p {
        color: rgb(154, 204, 203);
    }

    .circle_chart_box3 > p {
        color: rgb(14, 18, 252);
    }

    .circle_chart_box4 > p {
        color: rgb(202, 101, 56);
    }

    .circle_chart_box5 > p {
        color: rgb(152, 2, 151);
    }

    .circle_chart_box1 > div {
        color: rgb(204, 255, 110);
    }

    .circle_chart_box2 > div {
        color: rgb(108, 255, 205);
    }

    .circle_chart_box3 > div {
        color: rgb(32, 205, 253);
    }

    .circle_chart_box4 > div {
        color: rgb(253, 100, 28);
    }

    .circle_chart_box5 > div {
        color: rgb(254, 153, 253);
    }

    #line_chart {
        width: 100%;
        height: calc(100% - 40px);
    }

    .line_chart_title {
        border-bottom: 2px solid rgb(53, 102, 102);
        height: 40px;
        font-size: 18px;
    }

    .line_chart_title i {
        font-size: 36px;
        margin-right: 10px;
        vertical-align: middle;
    }

    .details {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 10px;
    }

    .unit {
        font-size: 18px;
        margin-left: 2px;
    }

    .lineChart_type span {
        border: 2px solid rgb(53, 102, 102);
        padding: 2px 5px;
        cursor: pointer;
        font-size: 12px;
        border-radius: 5px;
        margin-right: 6px;
    }

    .activeLine {
        border-color: rgb(108, 255, 205);
        color: rgb(108, 255, 205);
    }
    .unit_m{
        position: relative;
    }
    .unit_m::before{
        content: '2';
        position: absolute;
        font-size: 12px;
        right: -8px;
        top: -2px;
    }
</style>