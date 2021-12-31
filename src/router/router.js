import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

import {Loading} from 'element-ui';

const withLoading = (promise) => {
    const loading = Loading.service({
        fullscreen: true,
        text: '页面加载中，请稍后......'
    });
    return promise.then(ctx => {
        loading.close();
        return ctx;
    })
}

Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/',
        component: () => withLoading(import('@/views/Login.vue')),
        meta: {name: '登录',auth:'none'}
    },
    {
        path: '/login',
        component: () => withLoading(import('@/views/Login.vue')),
        meta: {name: '登录',auth:'none'}
    },
    {
        path: '/home',
        component: () => withLoading(import('@/views/GardenVisualization')),
        meta: {name: '首页'}
    },
    {
        path: '/freezerVisualization',
        component: () => withLoading(import('@/views/FreezerVisualization')),
        meta: {name: '冷库系统'}
    },
    {
        path: '/gardenSettings',
        component: () => withLoading(import('@/views/GardenSettings')),
        meta: {name: '设置'}
    },
    {
        path: '/gardenExport',
        component: () => withLoading(import('@/views/export')),
        meta: {name: '导出'}
    },
    {
        path: "/*",
        component: () => withLoading(import('@/views/Error.vue')),
        meta: {name: '出错啦！'}
    }

]

let router = new Router({
    routes: constantRouterMap,
    scrollBehavior() {
        return {x: 0, y: 0}
    }
})

/**
 * auth none 不检查登录
 */
window._axiosPromiseArr = [];
axios.interceptors.request.use(config => {

    config.cancelToken = new axios.CancelToken(cancel => {

        window._axiosPromiseArr.push({cancel})

    });

    return config

}, error => {

    return Promise.reject(error)

});

router.beforeEach((to, from, next) => {
    window._axiosPromiseArr.forEach((ele, index) => {
        ele.cancel(); // 路由跳转之前，清空（终止）上一个页面正在请求的内容
        // 清空请求的参数 清空请求的参数
        delete window._axiosPromiseArr[index]
    });
    if (to.meta.auth === 'none') {
        next();
        return;
    }
    let userInfo=sessionStorage.getItem('userInfo');
    if(!userInfo){
        next('/');
        return
    }else{
        next();
    }
});

export default router