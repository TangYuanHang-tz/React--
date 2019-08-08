import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
// 引入antD中的Menu菜单组件
import { Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
//引入menulist用于动态生成item，submenu组件来构成菜单
import menuList from '../../config/menuConfig'
import  memoryUtils from '../../utils/memoryUtils'

//SubMenu是二级菜单，Item是菜单中的每一项
const { SubMenu,Item } = Menu;

/* 
Admin的左侧导航组件
*/
class LeftNav extends Component {

    /* 
        -----判断当前用户是否有指定item的权限
    */
   hasAuth = (item) => {
    //获取当前用户
    const user = memoryUtils.user
    // 1.如果当前用户是admin，直接返回true
    // 2.如果当前item被标注为公开，那么也返回true
    // 3.判断当前的item在不在当前用户对应的角色的的item权限列表中
    if(user.username === 'admin' || item.isPublic || user.role.menus.indexOf(item.key) !== -1){
        return true
    }else if(item.children){
        //4.如果我拥有某个item的子节点的权限例如：/charts/bar（柱形图），那么权限列表中显示的就只有/charts/bar而不会再有单独的上级key：/charts
        //那么我们进行判断的时候没有/charts直接返回false，里面的子节点也全部没有。所以我们还需要判断，如果我们有某个子节点的权限，那么他的父节点
        //权限我们也得有
         const cItem = item.children.find(cItem => user.role.menus.indexOf(cItem.key) !== -1)
         if(cItem){
            return true
         }
    }
    
    return false
    
   }
   

    //根据menuList生成item，sunmenu组件标签，用于构建菜单
    //第一种实现：关键在于array的map方法以及递归执行
    getMenuNodes = (menuList) => {
        return menuList.map((item)=>{

            //返回<Item></Item>
            if(!item.children){
                return(
                    <Item key={item.key}>  
                        <Link to={item.key}>
                            <Icon type={item.icon} />  
                            <span>{item.title}</span>
                        </Link>
                    </Item>
                )
            }else{
                return (
                    <SubMenu
                    key={item.key}
                    title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                    }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }
    //根据menuList生成item，sunmenu组件标签，用于构建菜单
    //第二种实现：关键在于array的reduce方法以及递归执行
    getMenuNodes2 = (menuList) =>{
        //得到当前请求的路径
        const path = this.props.location.pathname

        return menuList.reduce((pre,item)=>{
            
            // ----------------------------------只有当前的用户拥有此item对应的权限的时候，才显现这个item
            if(this.hasAuth(item)){
                 //添加Item标签
                if(!item.children){
                    pre.push(
                        <Item key={item.key}>  
                            <Link to={item.key}>
                                <Icon type={item.icon} />  
                                <span>{item.title}</span>
                            </Link>
                        </Item>
                    )
                }else{
                    //如果当前请求的是当前item的children中某个item对应的path。当前item的key就是openKey
                    // const cItem = item.children.find((cItem,index)=>cItem.key===path)
                    const cItem = item.children.find((cItem,index)=>path.indexOf(cItem.key)===0)//----------product商品详情路径不匹配问题
                    if(cItem){
                        this.openKey = item.key
                    }
                    pre.push(
                        <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                        >
                            {
                                this.getMenuNodes2(item.children)
                            }
                        </SubMenu>
                    )
                }
            }
            return pre
        },[])
    } 

    //在第一次render（）之前(刷新时！！默认展开当前请求path所对应的Submenu)
    componentWillMount(){
        this.menuNodes = this.getMenuNodes2(menuList)
    }
    render() {
        //获取标签列表
        // const menuNodes = this.getMenuNodes2(menuList)
        //将请求的路由组件路径作为选中的key
        // const selectedKey = this.props.location.pathname
        //---------------------product商品详情路径不匹配问题
        let selectedKey = this.props.location.pathname
        if(selectedKey.indexOf('/product')===0){
            selectedKey = '/product'
        }

        //得到要展开Submenu的key值
        const openKey = this.openKey

        return (
            <div className="left-nav">
                {/* 头部logo部分 */}
                <Link to="/home" className="left-nav-header" >
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                mode="inline" //展开的模式
                theme="dark" //主题
                selectedKeys={[selectedKey]} /* 设置被选中的Item */
                defaultOpenKeys={[openKey]}     /* 设置被展开的SubMenu */
                >

                    {
                        this.menuNodes
                    }

                {/* <Item key="/home">  
                    <Link to="/home">
                        <Icon type="home" />  
                        <span>首页</span>
                    </Link>
                </Item>
                
                <SubMenu
                    key="/products"
                    title={
                    <span>
                        <Icon type="appstore" />
                        <span>商品</span>
                    </span>
                    }
                >
                   <Item key="/category">  
                        <Link to="/category">
                            <Icon type="bars" />
                            <span>品类管理</span>
                        </Link>
                    </Item>
                    <Item key="/product">  
                        <Link to="/product">
                            <Icon type="shop" />
                            <span>商品管理</span>
                        </Link>
                    </Item>
                </SubMenu> */}
                
                </Menu>
            </div>
        )
    }
}

/* 
    我们虽然一开始就默认显示home组件，但是我们左侧的home的Item并没有被选中，并且我们需要实现，当我们跳转到哪一个路由组件的时候，左侧相对应的Item就
    会被选中，并且如果这个路由组件是3级路由，那么他的上一次路由在左侧对应的submenu菜单也会被展开
    所以这就要求我们获取当前的路由path，可以通过this.props.location.pathname获取，但是LeftNav组件不是一个路由组件，没有location属性
    所以React提供了一个高阶组件-------withRouter
    所以现在我们暴露的不再是LeftNav而是通过withRouter包装LeftNav产生的新组件
    这个新组件会向非路由组件传递3个属性：history/location/match =》这样我这个非路由组件也可以使用路由相关的语法
*/
export default withRouter(LeftNav)