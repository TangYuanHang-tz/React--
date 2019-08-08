import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

//引入menu以便于动态生成树结构
import menuList from '../../config/menuConfig.js'

const Item = Form.Item
const { TreeNode }  = Tree

/*
添加分类的form组件
 */
export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys: [],    //受控的被选中的树节点
  }

  /* 
    -----------根据menuList动态初始化树结构
  */ 
  initTreeNodes = (menuList)=>{
    // 使用reduce或者map配合递归，生成相应数据
    return menuList.reduce((pre,item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {/* 判断是否有子节点，如果有则递归 */}
          {item.children ? this.initTreeNodes(item.children) : null}
        </TreeNode>
      )

      return pre
    },[])
  }

  /* 
  -----------点击复选框触发的函数，将点击的复选框的key，设置到状态中，重新渲染，展示最新的权限状态
  */
 onCheck = (checkedKeys)=>{
  //自动获取最新的所有的选中的复选框的key
  this.setState({
    checkedKeys
  })
 }

 /* 
 --------------取当前角色对象的menus值，以便于显示初始化的权限勾选状态
 */
  initRolrDefaultChecked = ()=>{
    const menus = this.props.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  /* 
 --------------返回最新的checkedKeys数据，以便于父组件将其设置到对应角色的menus中
 */
  getMenus = ()=>{
    return this.state.checkedKeys
  }

// -----------------------------------------------------------------------------------------
  
  componentWillMount(){
    // 在组件初始化渲染之前，需要知道整个树的结构，以便于渲染
    this.treeNoeds = this.initTreeNodes(menuList)
    // 获取当前角色对象的menus值，以便于显示初始化的权限勾选状态
    this.initRolrDefaultChecked()
  }

  componentWillReceiveProps(newProps){
    //组件初次渲染的时候能够获取到最新的checkedKeys并渲染，但是当我们点击另一个角色权限的时候，获取的是新的角色，他也有自己的
    //menus，但是我们却没有将最新的menus维护到状态中的checkedKeys去渲染
    const menus = newProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }


// -----------------------------------------------------------------------------------------
  render() {
    const { role } = this.props
    //取出状态中，选中的的树节点
    const { checkedKeys } = this.state


    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>

        <Tree
        checkable
        defaultExpandAll    //默认展开所有树节点
        checkedKeys={checkedKeys}   //(受控的)选中复选框的树节点
        onCheck={this.onCheck}    //点击复选框触发

        // onExpand={this.onExpand}
        // expandedKeys={this.state.expandedKeys}
        // autoExpandParent={this.state.autoExpandParent}
        // onCheck={this.onCheck}
        // checkedKeys={this.state.checkedKeys}
        // onSelect={this.onSelect}
        // selectedKeys={this.state.selectedKeys}

        >

          {/* 定义树的结构 */}
          <TreeNode title="平台权限" key='all'>
            {this.treeNoeds}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}