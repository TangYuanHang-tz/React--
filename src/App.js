//引入antD中的button，这样引入虽然我们之需要Button的样式与js代码，但是我们会将整个antD所有的样式以及JS代码都引入
//所以我们需要实现按照需要引入样式以及JS代码
// import Button from 'antd/es/button';
// import 'antd/dist/antd.css';
//import { Button } from 'antd'; //这样antd 组件的Button的js和css代码都会按需加载

import React, { Component } from 'react'
//引入路由组件
import {Route,Switch,BrowserRouter} from 'react-router-dom'
// 引入Login以及Admin一级路由组件
import Login from './pages/login/login' 
import Admin from './pages/admin/admin' 

export default class App extends Component {
    
    render() {
        return (
            /* 引入需要选择显示的Login和Admin */
            <BrowserRouter>
                {/* 在需要展示不同界面组件的地方注册组件 */}
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </BrowserRouter>
        )
    }
}