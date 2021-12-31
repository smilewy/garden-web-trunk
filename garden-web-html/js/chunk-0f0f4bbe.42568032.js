(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-0f0f4bbe"],{"290b":function(t,e,i){"use strict";i.r(e);var a=i("b85c"),s=(i("ac1f"),i("1276"),i("d3b7"),i("ddb0"),i("024c")),n=i.n(s),r=(i("a342"),i("313e")),o={name:"GardenVisualization",data:function(){return{curDate:{h:"",year:"",month:"",day:"",lunar:""},enviroment:{aqi:{city:{}},pop:"",uv:{},weather:{cond:{},wind:{}}},userInfo:null,pointCircleL:!0,activePoint:{name:"",partImg:"",device:"",area:"",color:"",humidityMin:"",humidityMax:"",active:!1,x:"",y:""},settingList:{id:"",bgUrl:"",monitoringH:"",positionList:[],userId:""},activePointOther:{co2:"",created:"",humi:"",humidityState:"",humidityQujian:"",light:"",sn:"",ethylene:"",oxygen:"",temp:"",topic:""},lineChartActive:"temp",lineChartTime:"day",lineChartData:[],lineChartFields:[{label:"温度",value:"temp"},{label:"乙烯",value:"ethylene"},{label:"湿度",value:"humi"},{label:"含氧量",value:"oxygen"},{label:"二氧化碳",value:"co2"}],activePointIndex:0,pointListLength:0,timmer1:null,timmer2:null,radarChart:null,lineChart:null,timmer3:null}},mounted:function(){var t=this;this.userInfo=JSON.parse(sessionStorage.getItem("userInfo")),this.curDate.h=this.dateFormatMine(new Date,"hh:mm:ss"),this.curDate.year=(new Date).getFullYear(),this.curDate.month=(new Date).getMonth()+1,this.curDate.day=(new Date).getDate(),this.countCurTime(),this.loadData(),this.drawRadar(),this.drawLineChart(),this.getCurCity(),setTimeout((function(){window.onresize=function(){t.radarChart.resize(),t.lineChart.resize()}}),200)},beforeDestroy:function(){clearInterval(this.timmer1),clearInterval(this.timmer2),clearInterval(this.timmer3),window.onresize=null},methods:{goExport:function(){this.$router.push("/gardenExport")},goSettings:function(){this.$router.push("/gardenSettings")},countCurTime:function(){var t=this;this.timmer3=setInterval((function(){t.curDate.h=t.dateFormatMine(new Date,"hh:mm:ss"),t.curDate.year=(new Date).getFullYear(),t.curDate.month=(new Date).getMonth()+1,t.curDate.day=(new Date).getDate()}),1e3)},loginOut:function(){sessionStorage.setItem("userInfo",""),this.$router.push("/")},getPointData:function(t){clearInterval(this.timmer1),this.activePointIndex=t,this.changeData(),this.startTimmer1()},changeData:function(){var t,e=Object(a.a)(this.settingList.positionList.values());try{for(e.s();!(t=e.n()).done;){t.value.active=!1}}catch(t){e.e(t)}finally{e.f()}this.activePoint=this.settingList.positionList[this.activePointIndex],this.activePoint.active=!0,this.activePoint.x.split("%")[0]<=50?this.pointCircleL=!1:this.pointCircleL=!0,this.loadPointOtherMsg(this.activePoint.device),this.loadPointLineChart()},startTimmer1:function(){var t=this;t.pointListLength>1&&(t.timmer1=setInterval((function(){t.activePointIndex++,t.activePointIndex===t.pointListLength&&(t.activePointIndex=0),t.changeData()}),1e4))},countTime:function(t){var e=new Date-new Date(t),i=e%36e5,a=i%6e4;return Math.floor(e/36e5)+"小时"+Math.floor(i/6e4)+"分钟"+Math.round(a/1e3)+"秒"},loadData:function(){this.ajaxPost({url:"/api/facility/pointPosition/findPointPositionList",headers:{Access_User_Token:this.userInfo.token},data:{userId:this.userInfo.id},success:function(t){t.data&&(this.settingList=t.data,this.activePointIndex=0,this.pointListLength=this.settingList.positionList.length,this.settingList.createdTime&&(this.settingList.monitoringH=this.countTime(this.settingList.createdTime)),this.changeData(),this.startTimmer1())}})},loadWeather:function(t){this.ajaxGet({url:"/api/facility/getWeather?city="+t.city,headers:{Access_User_Token:this.userInfo.token},success:function(t){this.enviroment=t.data}})},loadPointOtherMsg:function(t){this.ajaxGet({url:"/api/equipment/mqtt/getFreezerAllNowByClientId?clientId="+t,headers:{Access_User_Token:this.userInfo.token},success:function(t){if(this.activePointOther=Object.assign({},t.data),this.activePointOther.created){var e=new Date-new Date(this.activePointOther.created)<=6e4;this.activePointOther.humidityState=e?"正常":"异常"}(this.activePointOther.humi||0===this.activePointOther.humi)&&(this.activePointOther.humi<this.activePoint.humidityMin?this.activePointOther.humidityQujian="偏低":this.activePointOther.humi>this.activePoint.humidityMax?this.activePointOther.humidityQujian="偏高":this.activePointOther.humidityQujian="饱和"),this.$nextTick((function(){this.drawLine()})),this.radarChart.setOption({series:[{data:[{value:[this.activePointOther.temp,this.activePointOther.soilTemp,this.activePointOther.humi,this.activePointOther.ethylene,this.activePointOther.oxygen,this.activePointOther.light]}]}]})}})},loadPointLineChart:function(){var t="",e="",i="";"day"===this.lineChartTime?(t=this.dateFormatMine(new Date((new Date).getTime()-2592e6),"yyyy-MM-dd hh:mm:ss"),e=this.dateFormatMine(new Date,"yyyy-MM-dd hh:mm:ss"),i="1d"):(t=this.dateFormatMine(new Date((new Date).getTime()-864e5),"yyyy-MM-dd hh:mm:ss"),e=this.dateFormatMine(new Date,"yyyy-MM-dd hh:mm:ss"),i="1h"),this.ajaxGet({url:"/api/equipment/mqtt/getFreezerAllByClientIdWeb?clientId="+this.activePoint.device+"&group="+i+"&startTime="+t+"&endTime="+e,headers:{Access_User_Token:this.userInfo.token},success:function(t){this.lineChartData=t.data,this.reSetLineChart()}})},drawRadar:function(){this.radarChart=r.init(document.getElementById("radar_chart"));this.radarChart.setOption({radar:[{axisLine:{show:!0,lineStyle:{color:"rgb(108,255,205)",width:2}},name:{color:"rgb(108,255,205)",fontSize:16},splitArea:{show:!0,areaStyle:{color:["rgb(53,102,102)"]}},splitLine:{show:!1,lineStyle:{width:1,color:"#286fbb"}},indicator:[{text:"乙烯",max:100},{text:"湿度",max:60},{text:"含氧量",max:100},{text:"温度",max:100},{text:"二氧化碳",max:1e4}],center:["50%","50%"],radius:"62%"}],series:[{type:"radar",tooltip:{trigger:"item"},symbol:"none",lineStyle:{color:"rgb(58,154,252)"},areaStyle:{color:"rgb(58,154,252)",opacity:.9},data:[{value:[]}]}]})},reSetLineChartDy:function(t){this.lineChartTime=t,this.loadPointLineChart()},reSetLineChart:function(t){var e=[],i=[];if(t&&(this.lineChartActive=t),this.lineChartData[0])if("day"===this.lineChartTime){var s,n=Object(a.a)(this.lineChartData.values());try{for(n.s();!(s=n.n()).done;){var r=s.value;e.push(this.dateFormatMine(r.created,"yyyy-MM-dd")),i.push(r[this.lineChartActive])}}catch(t){n.e(t)}finally{n.f()}}else{var o,c=Object(a.a)(this.lineChartData.values());try{for(c.s();!(o=c.n()).done;){var l=o.value;e.push(this.dateFormatMine(l.created,"hh:mm:ss")),i.push(l[this.lineChartActive])}}catch(t){c.e(t)}finally{c.f()}}this.lineChart.setOption({xAxis:{data:e},series:[{data:i}]})},drawLineChart:function(){this.lineChart=r.init(document.getElementById("line_chart"));this.lineChart.setOption({grid:{show:!1,left:"5%",bottom:10,top:10,right:0},xAxis:{type:"category",boundaryGap:!1,splitLine:{show:!0,lineStyle:{color:"rgb(53,102,102)",width:2}},axisLabel:{show:!1},axisTick:{show:!1},axisLine:{show:!1},data:[]},yAxis:{type:"value",splitLine:{show:!1},axisTick:{show:!1},axisLabel:{show:!0,color:"rgb(254, 203, 41)"}},series:[{data:[],type:"line",symbol:"none",lineStyle:{width:0},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:"rgb(254,203,41)"},{offset:1,color:"rgb(2,50,50)"}],global:!1}}}]})},drawLine:function(){var t=document.getElementById("position_canvas"),e=document.getElementsByClassName("activeAdr")[0],i=document.getElementsByClassName("garden_img")[0],a=document.getElementsByClassName("line_box")[0],s=document.getElementById("canvas"),n=t.getBoundingClientRect(),r=s.getContext("2d"),o="";o=this.pointCircleL?a.offsetLeft+a.offsetWidth-1:a.offsetLeft+1,s.width=n.width,s.height=n.height,r.beginPath(),r.moveTo(o,a.offsetTop+1),r.lineTo(e.offsetLeft+i.offsetLeft+e.offsetWidth/2,e.offsetTop+i.offsetTop+2),r.closePath(),r.lineWidth=1,r.strokeStyle="rgb(108,255,205)",r.stroke()},getCurCity:function(){var t=this,e=t.$loading({lock:!0,text:"请求中，请稍后...",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.5)"}),i=new n.a.Map("iCenter");i.plugin("AMap.CitySearch",(function(){var a=new n.a.CitySearch;i.addControl(a),a.getLocalCity(),n.a.event.addListener(a,"complete",(function(i){e.close(),t.loadWeather(i),t.timmer2=setInterval((function(){t.loadWeather(i)}),3e4)})),n.a.event.addListener(a,"error",(function(i){e.close(),t.$message.error(i.info)}))}))}}},c=(i("bae6"),i("2877")),l=Object(c.a)(o,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",{attrs:{id:"gardenVisualization"}},[a("div",{attrs:{id:"iCenter"}}),a("el-header",{staticClass:"garden_header"},[a("el-row",{attrs:{type:"flex",align:"middle",justify:"space-between"}},[a("div",{staticClass:"title"},[t._v("冷库系统展示屏")]),a("div",{staticClass:"login_msg"},[a("el-row",{attrs:{type:"flex",align:"middle"}},[a("div",{staticClass:"time_box"},[a("p",{staticClass:"time"},[t._v(t._s(t.curDate.h))]),a("p",{staticClass:"other_msg"},[t._v(t._s(t.curDate.year)+"年"+t._s(t.curDate.month)+"月"+t._s(t.curDate.day)+"日")])]),a("div",[a("div",{staticClass:"state"},[a("span",[t._v("网络状态：已连接")]),a("span",[t._v("版本：Beta2021.1.2")])]),a("div",{staticClass:"other_msg"},[a("span",{on:{click:t.goExport}},[a("i",{staticClass:"el-icon-download"}),t._v("导出 ")]),a("span",{on:{click:t.goSettings}},[a("i",{staticClass:"iconfont icon-tubiao-shezhi"}),t._v("系统设置 ")]),a("span",{on:{click:t.loginOut}},[a("i",{staticClass:"iconfont icon-tuichu"}),t._v("屏幕重启 ")])])])])],1)])],1),a("el-main",[a("el-row",{staticClass:"garden_vh",attrs:{type:"flex"}},[a("el-col",{staticClass:"visualizationBox_l garden_vh"},[a("el-row",{staticClass:"position_img",attrs:{type:"flex",align:"bottom",justify:"center"}},[a("div",{attrs:{id:"position_canvas"}},[a("div",{staticClass:"position_img_text"},[a("canvas",{attrs:{id:"canvas"}}),a("div",{staticClass:"line_box"},[a("span",{staticClass:"line_box_circle",class:{line_box_circle_l:t.pointCircleL,line_box_circle_r:!t.pointCircleL}})]),a("el-row",{staticClass:"position_img_name",attrs:{type:"flex",align:"bottom"}},[a("div",[a("div",{staticClass:"curAdrName"},[t._v(t._s(t.activePoint.name))]),a("div",{staticClass:"adrList"},t._l(t.settingList.positionList,(function(e,i){return a("span",{key:i,style:{backgroundColor:e.color}},[t._v(t._s(e.name))])})),0)]),a("div",[a("p",{staticClass:"details"},[t._v("库房面积："+t._s(t.activePoint.area)),a("span",{staticClass:"unit_m"},[t._v("m")])]),a("p",{staticClass:"details"},[t._v(" 状态："+t._s(t.activePointOther.humidityState)+"/湿度"+t._s(t.activePointOther.humidityQujian))]),a("p",{staticClass:"details"},[t._v(" 氧气二氧化碳："+t._s(t.activePointOther.oxygen)+"%，"+t._s(t.activePointOther.co2)+"%")]),a("p",{staticClass:"details"},[t._v(" 监测时长："+t._s(t.settingList.monitoringH))])])])],1),a("div",{staticClass:"garden_img"},[t._l(t.settingList.positionList,(function(e,s){return a("div",{key:s,staticClass:"point",class:{activeAdr:e.active},style:{left:e.x,top:e.y},on:{click:function(e){return t.getPointData(s)}}},[a("img",{directives:[{name:"show",rawName:"v-show",value:e.active,expression:"point.active"}],attrs:{src:i("29f3"),alt:""}}),a("img",{directives:[{name:"show",rawName:"v-show",value:!e.active,expression:"!point.active"}],attrs:{src:i("bb5e"),alt:""}})])})),a("img",{attrs:{src:"https://www.caikeai.com/api/file/upload/"+t.settingList.bgUrl,alt:""}})],2)])]),a("div",{attrs:{id:"radar_chart"}})],1),a("el-col",{staticClass:"visualizationBox_c garden_vh"},[a("el-row",{staticClass:"part_img",attrs:{type:"flex",align:"bottom",justify:"center"}},[a("div",{staticClass:"part_img_box"},[a("img",{attrs:{src:"https://www.caikeai.com/api/file/upload/"+t.activePoint.partImg,alt:""}})])]),a("div",{staticClass:"part_chart1"},[a("el-row",{staticClass:"garden_vh",attrs:{type:"flex"}},[a("el-row",{staticClass:"circle_chart garden_vh",attrs:{type:"flex",align:"middle",justify:"center"}},[a("div",{staticClass:"circle_chart_box circle_chart_box1"},[a("div",[a("img",{attrs:{src:i("d76d"),alt:""}}),a("span",[a("span",[t._v(t._s(t.activePointOther.oxygen))]),a("span",{staticClass:"unit"},[t._v("%")])])]),a("p",[t._v("氧气含量")])])]),a("el-row",{staticClass:"circle_chart garden_vh",attrs:{type:"flex",align:"middle",justify:"center"}},[a("div",{staticClass:"circle_chart_box circle_chart_box2"},[a("div",[a("img",{attrs:{src:i("6dbb"),alt:""}}),a("span",[t._v(t._s(t.activePointOther.humi))])]),a("p",[t._v("湿度")])])]),a("el-row",{staticClass:"circle_chart garden_vh",attrs:{type:"flex",align:"middle",justify:"center"}},[a("div",{staticClass:"circle_chart_box circle_chart_box3"},[a("div",[a("img",{attrs:{src:i("b016"),alt:""}}),a("span",[t._v(t._s(t.activePointOther.temp))])]),a("p",[t._v("温度")])])]),a("el-row",{staticClass:"circle_chart garden_vh",attrs:{type:"flex",align:"middle",justify:"center"}},[a("div",{staticClass:"circle_chart_box circle_chart_box4"},[a("div",[a("img",{attrs:{src:i("e671"),alt:""}}),a("span",[a("span",[t._v(t._s(t.activePointOther.co2))]),a("span",{staticClass:"unit"},[t._v("%")])])]),a("p",[t._v("二氧化碳含量")])])]),a("el-row",{staticClass:"circle_chart garden_vh",attrs:{type:"flex",align:"middle",justify:"center"}},[a("div",{staticClass:"circle_chart_box circle_chart_box5"},[a("div",[a("img",{attrs:{src:i("39a7"),alt:""}}),a("span",[a("span",[t._v(t._s(t.activePointOther.temp))]),a("span",{staticClass:"unit"},[t._v("℃")])])]),a("p",[t._v("温度")])])])],1)],1),a("div",{staticClass:"part_chart2"},[a("el-row",{staticClass:"line_chart_title",attrs:{type:"flex",justify:"space-between",align:"middle"}},[a("span",[a("i",{staticClass:"el-icon-caret-right"}),a("span",[t._v("数据趋势（30Days）")])]),a("div",{staticClass:"lineChart_type"},[a("span",{directives:[{name:"show",rawName:"v-show",value:"hour"===t.lineChartTime,expression:"lineChartTime==='hour'"}],staticClass:"activeLine",on:{click:function(e){return t.reSetLineChartDy("day")}}},[t._v("小时")]),a("span",{directives:[{name:"show",rawName:"v-show",value:"day"===t.lineChartTime,expression:"lineChartTime==='day'"}],staticClass:"activeLine",on:{click:function(e){return t.reSetLineChartDy("hour")}}},[t._v("天")]),t._l(t.lineChartFields,(function(e,i){return a("span",{key:i,class:{activeLine:e.value===t.lineChartActive},on:{click:function(i){return t.reSetLineChart(e.value)}}},[t._v(t._s(e.label))])}))],2)]),a("div",{attrs:{id:"line_chart"}})],1)],1),a("el-col",{staticClass:"visualizationBox_r garden_vh"},[a("el-row",{staticClass:"garden_item",attrs:{type:"flex",justify:"center",align:"middle"}},[a("div",[a("p",[t._v("天气数据")]),a("p",[t._v("（"+t._s(t.enviroment.weather.cond.txt)+" "+t._s(t.enviroment.weather.wind.dir)+" "+t._s(t.enviroment.weather.tmp)+"℃）")])])]),a("el-row",{staticClass:"garden_item",attrs:{type:"flex",justify:"center",align:"middle"}},[a("div",[a("p",[t._v("空气质量指数")]),a("p",[t._v("（PM2.5:"+t._s(t.enviroment.aqi.city.pm25)+" "+t._s(t.enviroment.aqi.city.qlty)+"）")])])]),a("el-row",{staticClass:"garden_item",attrs:{type:"flex",justify:"center",align:"middle"}},[a("div",[a("p",[t._v("空气湿度")]),a("p",[t._v("（"+t._s(t.enviroment.weather.hum)+"）")])])]),a("el-row",{staticClass:"garden_item",attrs:{type:"flex",justify:"center",align:"middle"}},[a("div",[a("p",[t._v("紫外线指数")]),a("p",[t._v("（"+t._s(t.enviroment.uv.brf)+"）")])])]),a("el-row",{staticClass:"garden_item",attrs:{type:"flex",justify:"center",align:"middle"}},[a("div",[a("p",[t._v("降水概率")]),a("p",[t._v("（"+t._s(t.enviroment.pop)+"%）")])])])],1)],1)],1)],1)}),[],!1,null,"357cb546",null);e.default=l.exports},bae6:function(t,e,i){"use strict";i("ee53")},ee53:function(t,e,i){}}]);