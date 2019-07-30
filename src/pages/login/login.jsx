import React, { Component } from 'react'
//引入antD表单
import { Form, Icon, Input, Button } from 'antd';
//引入login样式
import './login.less'
//引入logo图片
import logo from './images/logo.png'
/* 
    登陆的一级路由组件 
*/

const Item = Form.Item

export default class Login extends Component {

    //阻止表单提交这个默认行为
    handleSubmit = (event)=>{
        event.preventDefault()
        alert('提交')
    }

    render() {
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
                            <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                            />
                        </Item>
                        <Form.Item>
                            <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            />
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