

import ajax from "./ajax"

// const BASE = "http://localhost:5000",因为请求的是5000端口，但是浏览器是在3000端口发请求，ajax存在跨域
//所以在package.json中配置代理服务器"proxy": "http://localhost:5000"
const BASE = ''
//因为是空串，所以在ajax方法中，BASE其实就是当前浏览器的地址，所以请求的发送方和接收请求的服务器在同一域中
//但是代理服务器会将我么发送的请求转发到5000端口，但是这是服务器跨域，是不会被阻止的，只有浏览器ajax请求跨域，才会被浏览器阻止

//1.登录
/* export function reqLogin(username,password){
    return ajax(BASE+'/login',{username:username,password:password},'POST')
} */

export const reqLogin = (username,password) => ajax(BASE+'/login',{username:username,password:password},'POST')

//2.添加用户,要求传递过来的参数user必须是一个符合接口规则的user对象
export const reqAddUser = (user) => ajax(BASE+"/manage/user/add",user,'POS')

/*测试 
reqLogin('admin','admin').then((result)=>{
    console.log('result',result);
}) */