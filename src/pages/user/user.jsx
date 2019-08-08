import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'

/*
用户路由
 */
export default class User extends Component {

  state = {
    users: [], // 所有用户列表
    roles: [], // 所有角色列表
    isShow: false, // 是否显示确认框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        //renser: (role_id) => this.state.roles.find(r => r._id == role_id)
        render: (role_id) => this.roleObj[role_id].name
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }



/* 
  --------------获取用户列表的方法
*/
 getUsers = async () => {
   //发送请求获取用户列表，此请求除了返回用户列表，还会返回所有的rule列表
  const result = await reqUsers()
  if (result.status===0) {
    const {users, roles} = result.data
    //调用将角色列表转换成对象的方法
    this.initRoleObj(roles)
    this.setState({
      users,
      roles
    })
  }
}

  /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)，以便于初始化数据列表时，不用根据每一个角色id
  遍历角色列表，找到对应的角色名称，从而显示
   */
  initRoleObj = (roles) => {
    const roleObj = roles.reduce((pre, role) => {
      pre[role._id] = role
      return pre
    }, {})
    // 保存
    this.roleObj = roleObj
  }

  /*
  显示添加界面
   */
  showAdd = () => {
    this.user = null // 去除前面保存的user
    this.setState({isShow: true})
  }

  /*
  显示修改界面
   */
  showUpdate = (user) => {
    this.user = user // 保存user
    this.setState({
      isShow: true
    })
  }

  /*
  删除指定用户
   */
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUsers()
        }
      }
    })
  }

  /*
  添加/更新用户
   */
  addOrUpdateUser = async () => {

    this.setState({isShow: false})

    // 1. 收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }

    // 2. 提交添加的请求
    const result = await reqAddOrUpdateUser(user)
    // 3. 更新列表显示
    if(result.status===0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }
  }



// --------------------------------------------------------------
  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    //调用获取用户列表的方法
    this.getUsers()
  }


  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 2}}
        />

        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}