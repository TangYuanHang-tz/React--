import React, { Component } from 'react'
//引入antD的卡片组件
import { Card, Button,Icon,Table,Modal, message } from 'antd';

import LinkButton from '../../components/link-button'
//引入用来获取分类信息的组件
import {reqCategorys} from '../../api/index'
//引入更新组件
import UpdateForm from './update-form'
//引入发送更新请求
import {reqUpdateCategory} from '../../api'

/* 
admin的二级路由组件--品类管理路由组件
*/


  


export default class Category extends Component {

    state = {
        categorys:[],       //一级分类数组
        loading:false,       //是否显示加载
        subCategorys:[],     //二级分类列表数组
        parentId:"0",        //显示一级列表还是二级列表最大的区别在于parentId
        parentName:'',       //父分类名称，供显示
        showStatus:0,   //0：表示全部不显示，1：表示修改 2：表示添加
    }

    // 获取一级分类列表信息的方法---以及获取二级分类列表信息的方法
    getCategorys = async ()=>{
        //发送请求之前需要加载图片的出现
        this.setState({loading:true})

        //---具体获取哪一个分类列表取决于状态中的parentId
        const {parentId} = this.state
        const result = await reqCategorys(parentId)

        //发送请求之后将其置为false
        this.setState({loading:false})

        if(result.status === 0){
            const categorys = result.data   //取出来的值可能是一级列表也可能是二级列表
            //更新状态
            if(parentId === '0'){
                //一级列表
                this.setState({
                    categorys
                })
            }else{
                // 二级列表
                this.setState({
                    subCategorys : categorys
                })
            }
            
        }
    }

    /* 
        显示指定一级分类下的二级分类信息
    */
   showSubCategorys = (category)=>{
    //修改state中的parentId，以确保调用获取分类信息方法时，该方法能够获取正确的分类信息
    this.setState({
        parentId:category._id,   
        parentName:category.name
    },()=>{
        this.getCategorys()
    })
    /* -----------------//调用获取一级分类列表信息的方法---以及获取二级分类列表信息的方法
    --------------------this.getCategorys() 
    此时调用将会发现无法显示二级分类，因为我们在调用getCategorys方法中，获取去的parentId依旧是0而不是当前一级分类的Id
    因为我们设置状态的方法是异步的！！！而在setstate（）方法中，可以传递一个回调函数，该回调函数会在状态被改变后才执行，所以将getCategorys放入其中调用*/
   }

    // 数据的初始化
    initColumns = ()=>{
        // 表格列的数组
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
            },
            {
              title: '操作',
              width:300,
              render: (category)=>{  //组件在显示每一行的时候都会调用render方法，并且会传入一个数据，这个数据就是当前行的数据，在此时就当前行所对应的分类数据
                                    //当我们点击按钮执行显示二级分类信息的方法时，我们需要知道显示哪一个一级分类下的二级分类，也就是说要把category对象传递过去
                                    //所以我们在onclick中用匿名函数包裹传参函数，这样渲染时匿名函数不会被调用，只有点击的时候匿名函数被调用，返回的show方法因为有()
                                    // 也会被调用，同时还把参数传递过去了。
                  return (
                      <span>
                        <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                        <LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>
                      </span>
                  )
              }
            }
          ];
    }

    // 回退到一级分类列表的方法
    showCategorys = ()=>{
        this.setState({
            parentId : '0',
            parentName : '',
            subCategorys :[]
        })
    }

    // 显示更新界面（也就是那个对话框）
    showUpdate = (category)=>{
        //点击的时候，需要将当前的category的名字传递给UpdateForm组件
        this.category = category
        //更新状态显示更新界面
        this.setState({
            showStatus : 1
        })
    }
    // 更新分类方法
    updateCategory = ()=>{
        //进行表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //得到输入分类的名称
                const categoryName = this.form.getFieldValue('categoryName')
                //重置输入控件的值
                this.form.resetFields()
                // 得到分类的id
                const categoryId = this.category._id
                //发送数据更新请求
                const result = await reqUpdateCategory({categoryId,categoryName})
                if(result.status === 0){
                    message.success('更新分类成功！')
                    //显示最新数据
                    this.getCategorys()
                }
                //关闭整个修改框
                this.setState({
                    showStatus : 0
                })
            }
        })
        

    }

    // ----------------组件挂载前的生命周期方法
    //为了数据的初始化，以及能够在按钮上绑定监听事件
    componentWillMount(){
        this.initColumns()
    }


    //在组件完成挂载之后获取分类
    componentDidMount(){
        this.getCategorys()
    }

    render() {

             //读取状态中的数据
            const {categorys,loading,parentId,subCategorys,parentName,showStatus} = this.state
            //取出点击修改分类是保存的要修改的分类对象,第一次render的时候是没有值的
            const category = this.category || {}


            // 定义Card的左侧内容---更具一级分类或者二级分类显示不同内容
            const title = parentId === '0' ? '一级分类列表' : (
                <span>
                    <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                    <Icon type="arrow-right"></Icon>
                    <span>{parentName}</span>
                </span>
            )
            //定义Card的右侧内容
            const extra = (
                <Button type="primary">
                    <Icon type="plus"/>
                    添加
                </Button>
            )


        return (
            <Card title={title} extra={extra}>
             <Table
                loading={loading}       //表格加载过程中是否出现loading图片
                pagination={{defaultPageSize:3,showQuickJumper:true}}   //defaultPageSize默认每页显示条数，showQuickJumper是否可以快速跳转到某页
                rowKey="_id"        //指定表格中每一项的唯一key就是每一项的_id的值
                columns={this.columns}
                dataSource={parentId === '0' ? categorys:subCategorys}  //判断后确定，显示的是一级列表还是二级列表
                bordered
            />

                <Modal
                title="更新分类"
                visible={showStatus === 1}
                onOk={this.updateCategory}
                onCancel={()=>{
                    this.form.resetFields()
                    this.setState({showStatus : 0})
                }}
                >
                
                    <UpdateForm categoryName={category.name} setForm={(form)=>this.form = form}/>
                </Modal>
            </Card>

            
        )
    }
}
