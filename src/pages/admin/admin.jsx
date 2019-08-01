import React, { Component } from 'react'
import {Redirect,Switch,Route} from 'react-router-dom'
// 引入antD的布局组件
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
//引入头部组件和左侧导航组件
import AdminHeader from "../../components/header"
import LeftNav from "../../components/left-nav"
//引入admin的二级路由组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'



// 获取antD布局组件中的响应用于布局的组件标签
const { Footer, Sider, Content } = Layout;


/* 
    后台管理的一级路由组件
*/
export default class Admin extends Component {

    render() {
        //如果当前没有登录（内存中的user没有数据），跳转到登录界面
        const user = memoryUtils.user
        if(!user._id){
            return <Redirect to='/login'/>
        }

        return (
            <Layout style={{height:'100%'}}>
                <Sider>
                    {/* 使用左侧导航组件 */}
                    <LeftNav/>
                </Sider>
                <Layout>
                    
                    {/* 使用自定义的头部组件代替antd中的Head */}
                    <AdminHeader/>
                    

                    <Content style={{backgroundColor:"#fff",margin:"30px"}}>
                        {/* admin中二级路由组件就在这里进行展示 */}
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>

                    <Footer style={{textAlign:"center",color:"#aaa"}}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>

                </Layout>
            </Layout>
        )
    }
}