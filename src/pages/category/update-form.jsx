import React, { Component } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

class UpdateForm extends Component {

    static propTypes = {
        categoryName:PropTypes.string.isRequired, 
        setForm : PropTypes.func.isRequired
    }

    //将form对象传递给父组件
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        return (
                <Form>
                    <Form.Item>
                        {
                            getFieldDecorator('categoryName',{
                                initialValue:this.props.categoryName,
                                rules:[
                                    {required:true,message:'分类名称必须指定'}
                                ]
                            })(
                                <Input placeholder="请输入名称"/>
                            )
                        }
                    </Form.Item>
                </Form>
        )
    }
}

export default Form.create()(UpdateForm)
