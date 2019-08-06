import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

class AddForm extends Component {

    static propTypes = {
        setForm : PropTypes.func.isRequired,
        categorys : PropTypes.array.isRequired,
        parentId : PropTypes.string.isRequired
    }

    //将form对象传递给父组件
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {getFieldDecorator} = this.props.form
        const { Option } = Select;
        //获取传递过来的一级列表数组
        const {categorys,parentId} = this.props

        return (
                <Form>

                    <Form.Item>
                        {
                            getFieldDecorator('parentId',{
                                initialValue:parentId,
                                rules:[
                                    {required:true,message:'分类名称必须指定'}
                                ]
                            })(
                                <Select>
                                    <Option value='0'>一级分类列表</Option>
                                    {
                                        /* 动态显示一级列表 */
                                        categorys.map((cItem,index)=>{return <Option key={index} value={cItem._id}>{cItem.name}</Option>})
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>

                    <Form.Item>
                        {
                            getFieldDecorator('categoryName',{
                                initialValue:'',
                                rules:[
                                    {required:true,message:'分类名称必须指定'}
                                ]
                            })(
                                <Input placeholder="请输入分类名称"/>
                            )
                        }
                    </Form.Item>
                </Form>
        )
    }
}

export default Form.create()(AddForm)
