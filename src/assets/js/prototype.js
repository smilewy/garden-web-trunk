import axios from 'axios';

const Prototype = function () {
};

Prototype.install = (Vue) => {
    /**
     * axios 原生方法
     */
    Vue.prototype.axios = axios;

    /**
     * GET请求
     * @param {*} options
     */
    Vue.prototype.ajaxGet = function (options) {
        options.method = 'get';
        return this.ajax(options);
    }

    /**
     * POST请求
     * @param {*} options
     */
    Vue.prototype.ajaxPost = function (options) {
        options.method = 'post';
        return this.ajax(options);
    }

    /**
     * axios扩展，增加响应的通用处理，默认处理不满足需求时，可使用axios原生方法
     * options.success 响应状态200且code为0时调用，针对code非0的情况，对部分情况作了处理（如:登录超时、无权限）
     * 其他没有处理的情况会调用 options.error 回调处理，请求无论成功还是失败都会执行options.complete回调
     * @param {*} options 同axios config,增加3个回调：success、error、complete
     */
    Vue.prototype.ajax = function (options) {
        options.timeout = 20000;
        const loading = this.$loading({
            lock: true,
            text: '请求中，请稍后...',
            spinner:'el-icon-loading',
            background:'rgba(0, 0, 0, 0.5)'
        });
        axios(options).then(res => {
            let data = res.data;
            switch (data.code) {
                case 40000:
                    if (typeof options.success === 'function') {
                        options.success.call(this, data);
                    }
                    break;
                default:
                    if (typeof options.error === 'function') {
                        options.error.call(this, data);
                    } else if(data.message){
                        this.$message.error(data.message);
                    }else{
                        this.$message.error('系统异常（' + data.code + '）');
                    }
                    break;
            }
            if (typeof options.complete === 'function') {
                options.complete.call(this, res);
            }
            loading.close();
        }).catch(event => {
            if (axios.isCancel(event)) {
                console.log('Request canceled', event.message);
            } else {
                if (event.response) {
                    this.$message.error('网络错误（' + event.response.status + '）');
                } else if (event.request) {
                     if(event.message.indexOf('timeout')!==-1){
                        this.$message.error('请求超时，请重新请求');
                    }else{
                         this.$message.error('网络错误');
                     }
                } else {
                    this.$message.error('系统异常');
                }
            }
            if (typeof options.complete === 'function') {
                options.complete.call(this, event);
            }
            loading.close();
        });
    }
    Vue.prototype.dateFormatMine = (da, fmt) => {
        if (da) {
            let date = new Date(da);
            let o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt
        }else{
            return ''
        }
    }
    Vue.prototype.computeYmd = function (n) {
        // JS获取当前年月，获取N个月前/后年月
        let date = new Date();
        date.setMonth(date.getMonth() + n);
        let y = date.getFullYear();
        let m = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        let d = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
        let formatwdate = new Date(y + '/' + m + '/' + d);
        return formatwdate;
    }
};
export default Prototype
