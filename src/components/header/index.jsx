import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

// 引入完整的菜单数组
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
// 日期时间处理的工具函数模块
import {formateDate} from '../../utils/dateUtils'
import './index.less'
//引入我们写好的发送jsonp请求获取天气信息的组件
import {reqWeather} from '../../api'
//引入antD中的对话框组件Modal实现退出登录的对话框
import {Modal} from 'antd'
import {removeUser} from '../../utils/localStorageUtils.js'
//引入自定义的button组件用来代替a标签
import LinkButton from '../../components/link-button/'

/* 
    Admin的头部组件
*/
class Header extends Component {

    // 初始化状态
    state = {
        currentTime:formateDate(Date.now()),     //当前时间字符串(格式化之后的)
        dayPictureUrl:'',           //天气图片的url
        weather:''                  //天气的文本
    }

    //每隔一秒更新状态中的时间
    showCurrentTime = ()=>{
       this.intervalId =  setInterval(() => {
            const currentTime = formateDate(Date.now())
            //更新状态
            this.setState({
                currentTime:currentTime
            })
        }, 1000);
    }

    //得到当前请求路径对应的title
    getTitle = ()=>{
        //获取当前的请求路径，但是header是一个非路由组件，所以使用高阶组件withRouter将其包装
        const path = this.props.location.pathname
        let title = ''
        //对菜单数组遍历，获取匹配的路径对应的title名
        menuList.forEach((item,index)=>{
            if(item.key===path){
                title = item.title
            }else if(item.children){
                // const cItem = item.children.find(item => item.key===path)-------------解决product的title不显示问题
                const cItem = item.children.find(item => path.indexOf(item.key)===0 )
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    // 更新天气信息的方法
    getWeather = async (location)=>{
        const {dayPictureUrl,weather} = await reqWeather(location)
        //更新状态
        this.setState({
            dayPictureUrl,weather
        })
    }

    // 用户退出单击事件
    logout = ()=>{
        //调用modal中的confire方法，实现对话框
        Modal.confirm({
            title: '是否确定退出？',
            // content: 'Some descriptions',
            onOk : ()=> {
                // 清除内存中，以及本地localStorage中的登陆数据
                memoryUtils.user = {}
                removeUser()
                //跳转到登录界面-------点击确定将会报错，说this是undefined，问题在于onOK（）是一个自定义方法，所以React底层开启了
                //严格模式，不允许自定义函数指向window，而是undefined，所以我们需要手动的指定this是当前的组件对象
                // 处理方式，1.将onOK（）方法改为箭头函数的方式，找外部的this，能够得到组件对象。2.使用]bind（）绑定组件对象
                this.props.history.replace("/login")
            },
            onCancel() {
            console.log('Cancel');
            }
        })
    }

    //-------组件完成挂载后
    componentDidMount(){
        //调用更新当前时间的方法
        this.showCurrentTime()
        //调用更新天气信息的方法
        this.getWeather('北京')
    }
    //--------组件即将销毁时触发
    //一般用来做一些收尾的工作：清除定时器
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }

    render() {

        //从内存中获取当前登录的用户名
        const {user} = memoryUtils
        //从状态中获取显示数据
        const {currentTime,dayPictureUrl,weather} = this.state
        //得到当前请求路径对应的title
        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{user.username}</span>
                    {/* 绑定单击事件，实现用户退出 */}
                    {/* <a href="javascript:;" onClick={this.logout}>退出</a> */}
                    <LinkButton onClick={this.logout} >退出</LinkButton>
                </div>
                <div className="header-bottom">

                    <div className="header-bottom-left">{title}</div>

                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {/* 当天气图片不存在的时候，将会显示‘错误图片’，我们不想这样显示，所以对天气图图片进行判断
                        如果存在显示，不存在，全部不显示 */}
                        {dayPictureUrl ?<img src={dayPictureUrl} alt="weather"/> : null }
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

//包装Header使其拥有history/location/match属性
export default withRouter(Header)