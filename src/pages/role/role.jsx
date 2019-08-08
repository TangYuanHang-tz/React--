import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
} from 'antd'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from "../../utils/constents"
import { reqRoles,reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils' 

/*
角色路由
 */
export default class Role extends Component {

  state = {
    roles: [], // 所有角色的列表
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  constructor(props){
    super(props)
    //创建ref容器
    this.authRef = React.createRef()
  }

  /* 
  初始化table列数组
  */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: create_time => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: auth_time => formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={() => this.showAuth(role)}>设置权限</LinkButton> 
      },
    ]
  }



  /* 
  异步获取角色列表显示
  */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  /*
  -------------添加角色
   */
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        
        //清除输入
        this.form.resetFields()
        //发送请求，添加角色
        const result = await reqAddRole(values.roleName)
        if(result.status === 0){
          message.success('角色添加成功！')
          //显示更新后的界面，可以通过重新发送请求实现，也可以通过直接修改状态实现（不能显示最新的数据，如果有人同时进行修改）
          const role = result.data
          const roles = this.state.roles
          roles.push(role)
          this.setState({
            roles: [...roles]
          })
        }

        //添加成功后，关闭添加界面
        this.setState({
          isShowAdd: false
        })
      }
    }) 
  }


  /* 
  -------------显示权限设置界面
  */
 showAuth = (role) => {
  this.role = role //将点击设置权限的哪一行的角色对象，绑定到组件的role属性上，并将修改页面打开
  this.setState({
    isShowAuth: true
  })
}

  /*
  ----------- 给指定的角色授予权限（权限授予界面点击ok的时候触发）
   */
  updateRole = async () => {
    //我们在权限界面中点击的每一个树节点，都将相应的key自动维护到状态中的checkedKeys中。但是并没有将最新的checkedKeys设置到
    //当前的角色的menus中。也就说我们要获取权限组件中最新的checkedKeys数据，通过获取权限组件对象，调用相应方法实现获取。

    const role = this.role
    // 更新role的menus
    role.menus = this.authRef.current.getMenus()
    role.auth_time = formateDate(Date.now())
    role.auth_name = memoryUtils.user.username
    // 发送请求
    const result = await reqUpdateRole(role)
    if(result.status === 0){
      message.success("授权成功")
      this.getRoles()
    }

    this.setState({
      isShowAuth: false
    })
  }

  // -----------------------------------------------------------------------
  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

    // -----------------------------------------------------------------------
  render() {
    const { roles, isShowAdd, isShowAuth } = this.state
    const role = this.role || {}

    const title = (
      <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>
        创建角色
      </Button>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm ref={this.authRef} role={role} />{/* 将当前的角色对象传递到组件中了 */}
        </Modal>
      </Card>
    )
  }
}
