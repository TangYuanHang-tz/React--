/* 
通用的能发送任何ajax请求的函数模块
封装axios库

GET请求参数的两种方式
1.路由的path：/user，请求的参数：/user？id=3    query参数
2.路由的path：/user/：id，请求的路径：/user/3   params参数

优化：1.统一处理请求异常
      2.异步请求成功的数据不再是response，而是response.data的值
*/

//引入axios，用于发送请求
import axios from 'axios'

//暴露一个方法
export default function ajax(url,data = {},method){

    return new Promise((resolve,reject)=>{
        let promise
        //1.执行异步ajax请求（使用axios）
        if(method==='GET'){ //发送GET请求
            promise = axios.get(url,{
                params:data  //指定query参数，采用配置对象的方式，最终的方式也是/user？id=3
            })
        }else{  //发送POST请求
            promise = axios.post(url,data)
        }
        //直接在这里对请求返回的promise做出处理避免外部还需要.then或者try，cathch
        //如果我们resolve(response)其实是将new的promise置为成功状态，并且将数据置为ajax请求后返回来的响应数据对象response，那么我们
        //在外部获取时需要const response = await ajax（...），respnse是响应数据对象而不是直接的响应数据，我们还需要respose.data获取，所以
        //直接就在这里response.data将响应数据置为成功的数据
        promise.then(
            //2.如果成功，调用resolve（），并指定成功的数据
            response =>{
                resolve(response.data)
            },
            //3.如果失败，不调用reject（），因为如果绑定错误的数据（错误对象），则在外部还需要分别处理请求异常
            error =>{
                alert('请求出错：' + error.message)
            }
        )
        
    })

    
}