import React, { Component } from 'react'
//引入antD表单
import { Form, Icon, Input, Button, message } from 'antd';
import {Redirect} from 'react-router-dom'

//引入login样式
import './login.less'
//引入logo图片
import logo from '../../assets/images/logo.png'
//引入发送登陆请求】
import {reqLogin} from '../../api'
//引入保存user对象的组件
import memoryUtils from '../../utils/memoryUtils'
//引入操作localStorage存取user的工具组件
import {saveUser} from '../../utils/localStorageUtils'

/* 
    登陆的一级路由组件 
*/

const Item = Form.Item

class Login extends Component {

    //阻止表单提交这个默认行为
    handleSubmit = (event)=>{
        event.preventDefault()
        //收集form表单提交的数据
        /* const username = this.props.form.getFieldValue('username') //取出指定字段的值
        const password = this.props.form.getFieldValue('password')
        const values = this.props.form.getFieldsValue()//取出所有字段的值
        console.log(username,password,values) //tangyuanhang 123123 {username: "tangyuanhang", password: "123123"}*/
        //---------------设置表单点击提交按钮时统一验证
        this.props.form.validateFields(async (err,values)=>{  //该方法用于验证所有字段，传入回调函数
            //err是验证不通过的错误信息，values是表单所有字段的值
            if (!err) {
                console.log('发送登录Ajax请求', values);//{username: "dsdsd", password: "dddddd"}
                //发送登录请求
                const {username,password} = values
                const result = await reqLogin(username,password)//获取的result是一个json对象，{status：0，data：user对象}，{status：1，msg：错误信息}
                if(result.status === 0){
                    // 成功登录
                    //保存用户信息
                    const user = result.data
                    //将用户信息保存到localStrorage，这样页面进行刷新用户信息还能够存在，不会直接销毁掉
                    // localStorage.setItem('USER-KEY',JSON.stringify(user))
                    saveUser(user)
                    memoryUtils.user = user
                    //跳转到admin界面
                    this.props.history.replace('/')

                }else{
                    //登录失败,使用antD的message函数组件，展示错误信息
                    message.error(result.msg)
                }
            }

        })
    }


    /*
    对密码进行自定义验证
    用户名/密码的的合法性要求
     1). 必须输入
     2). 必须大于等于4位
     3). 必须小于等于12位
     4). 必须是英文、数字或下划线组成
     方法参数是API限定的rule, value, callback
     value是界面输入的值
     callback('xxxx') // 验证失败, 并指定提示的文本
    */
   validataPwd = (rule, value, callback)=>{
    // console.log('validatePwd()', rule, value)
    if(!value) {
        callback('密码必须输入')
      } else if (value.length<4) {
        callback('密码长度不能小于4位')
      } else if (value.length>12) {
        callback('密码长度不能大于12位')
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback('密码必须是英文、数字或下划线组成')
      } else {
        callback() // 验证通过，不管情况最终都需要调用callback（），不传任何参数，表示验证通过
      }
   }

    render() {
        const { getFieldDecorator } = this.props.form;

        //判断用户是否已近登录，也就是内存中的user是否有数据，如果有则不访问login页面，而是跳转到admin界面
        if(memoryUtils.user._id){
            return <Redirect to='/'/>
        }

        return (
            <div className="login">
                <header className="login-header">
                    {/* 图片引入不能直接src路径指定，需要将图片import后使用对象指定 */}
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                {/* antD表单部分 */}
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username',{
                                    //在这里通过配置对象（options）来配置校验规则，配置对象就是有特定属性名称的对象
                                    //声明式校验：使用已有的验证规则进行校验
                                    rules: [
                                        { required: true, message: '请输入用户名!' },
                                        { min: 4, message: '用户名不能小于4位!' },
                                        { max: 12, message: '用户名不能大于12位!' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文数字，下划线组成!' }, 
                                        { whitespace: true, message: '用户名不能包含空格！' },
                                         
                                    ]
                                })(
                                    /* 渲染input这个组件标签就会产生input实例，组件标签就是组件的实例 */
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                            
                        </Item>
                        <Form.Item>
                            {   
                                /* 对密码进行校验，通过自定义校验规则实现 */
                                getFieldDecorator('password',{
                                    initialValue : '',  //设置子节点的默认值
                                    rules:[
                                        {validator:this.validataPwd}
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                            
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登  录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/* 
Form.create()函数包装一个组件，生成一个新的组件 
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
*/
const WrapperLogin = Form.create()(Login)
export default WrapperLogin
/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数  bind()
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数

3.大概实现
    function higherOrderComponent(Componet){
        const form = {
            test1(){...}
            test2(){...}
        }
        return class WrapperComponnet etends React.Componnet{
            render(){
                //包装组件内部返回被包装组件的标签
                //负责向被包装组件传递特定的标签属性，来扩展它的功能
                return <Component form={form}></Component>
            }
        }
    }
 */