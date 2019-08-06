import React, { Component } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'

//引入在本页面注册并且分别展示的3个路由组件
import ProductHome from './product-home'
import ProductDetail from './product-detail'
import ProductAddUpdate from './product-add-update'

// 引入样式文件，3个路由界面都可以看见这个样式
import './product.less'
/* 
admin的二级路由组件--商品管理路由组件
*/
export default class Product extends Component {
    render() {
        return (
            // 根据访问路径或者在页面中的动作确定展示哪一个组件（注册组件）
            <Switch>
                {/* 需要注意：路由的匹配默认情况下并不是完全匹配，如果需要完全匹配需要加上exact属性为true
                ，如果还需要匹配一部分路径，但是后面的路径不匹配也能访问某个路由，则需要配合Redirect使用 */}
                <Route exact path="/product" component={ProductHome}/>
                <Route exact path="/product/detail" component={ProductDetail}/>
                <Route exact path="/product/addupdate" component={ProductAddUpdate}/>
                <Redirect to="/product"/>
            </Switch>
        )
    }
}
