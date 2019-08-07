import React, { Component } from 'react'
import {Card,Select,Input,Button,Table,Icon,message} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts,reqSearchProducts, reqUpdateStatus } from '../../api'
//分页显示，每页显示的条数
import { PAGE_SIZE } from '../../utils/constents'

/* 
    商品列表界面
*/
export default class ProductHome extends Component {
    /* 
        ---实现搜索功能就要求我们能够获取选择的搜索方式，以及搜索的关键字，以前我们是通过form组件来实现获取参数数据。这种方式
        中的form组件是受控组件，也就是参数是同步更新到状态中的。而非受控组件则是输入框的参数不会维护到状态中，而是当我们点击搜索
        的时候通过refs获取。而在此处我们没有使用form组件，但是我们需要动态获取最新的参数，所以我们需要将其设置为受控组件，也就是
        说，我们需要的参数productName和productDesc将要维护到状态中。
    */

    state = {
        loading : false,    //是否显示商品加载过程中的loading界面
        products : [] ,      //列表中具体展示的商品数据数组 ,  
        total : 0,          //总页数    
        searchType : 'productName',   //搜索方式
        searchName : ''         //关键字
    }

    /* 
        ---------------初始化列信息的数组
    */
   initColumns = ()=>{
       this.columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        }, 
        {
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render:(price)=>"￥" + price  //会将这一列的数据传递给render中的回调函数，然后我们用形参price接收，目的是我们展示数据的时候不是
                                         //直接展示price而是￥37473这种形式，所以我们需要对我们接收到的值price做出一定处理后再展示 
            //-------------------如果每一列不指定dataIndex接收什么数据，那么我们在render中接受的就是表格一行所对应的数据，在这里就是一个商品对象
        },
        {
            title: '状态', 
            // dataIndex: 'status',------------切记如果需要当前行对象，一定要去掉dataIndex，不然只能拿到dataIndex指定的参数
            render : (product)=> {
                /* 从每一行返回的对应商品对象中获取商品状态和商品id */
                const {status, _id} = product
                const btnText = status === 1 ? '下架' : '上架'
                const text = status === 1 ? '在售' : '已下架'
                return (
                    <span>
                        <Button type="primary" onClick={() => this.updateStatus( _id,status === 1 ? 2 : 1)}>{btnText}</Button><br/>
                        <span>{text}</span>
                    </span>
                )
            }
        },
        {
            title: '操作',
            render : (product)=> (
                <span>
                    <LinkButton onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
                    <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                </span>
            )
        },
       ]
   }

   /* 
    --------------------获取指定页码的商品列表数据
   */
  getProducts = async (pageNum) => {
    //将当前展示的页数保存，以便于updateStatus方法使用
    this.pageNum = pageNum

    this.setState({loading: true})
    const { searchType,searchName } = this.state
    //----判断关键字中有没有值，如果有值，则发送搜索请求，没有则发送商品列表请求
    let result
    if(!searchName){
        // 发送请求
        result = await reqProducts({pageNum,pageSize: PAGE_SIZE})
    }else{
       result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
    }
    
    this.setState({loading: false})
    if(result.status === 0){
        //从响应数据中获取总页数一级分页数据数组
        const {total,list} = result.data
        //更新状态
        this.setState({
            total,
            products : list
        })
    }
  }

  /* 
  ------------------对商品执行上架或者下架的功能
  */
    updateStatus = async (productId,status) => {

        //发送请求
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0){
            message.success("更新状态成功")
            //发送请求，重新显示当前页，以被修改商品的最新状态
            this.getProducts(this.pageNum)
        }
    }

    //-------------------生命周期函数
    componentWillMount(){
        //在组件将要挂载前准备好表格列信息的数组
        this.initColumns()
    }

    componentDidMount(){
        //在组件刚完成第一次挂载之后发送请求，获取维护在状态中，需要展示的分页数据
        this.getProducts(1)
    }

    render() {
        //从状态中获取数据
        const {loading , products,total,searchType,searchName} = this.state

        const title = (
            <span>
                <Select 
                value={searchType} 
                style={{width:'150px'}}
                //当搜索方式改变的时候，获取最新的方式并维护到状态中
                onChange={(value) => this.setState({searchType: value})}
                >
                    <Select.Option value="productName">按名称搜索</Select.Option>
                    <Select.Option value="productDesc">按描述搜索</Select.Option>
                </Select>

                <Input 
                placeholder="关键字" 
                style={{margin:'0 15px',width:'150px'}}
                value={searchName}
                //当搜索关键字改变的时候，获取最新的关键字并维护到状态中
                onChange={(event)=> this.setState({searchName: event.target.value})}
                ></Input>
                {/* 点击搜索的时候，发送搜索请求，同样调用getProducts方法 */}
                <Button type="primary" onClick={()=> this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type="plus"></Icon>
                添加商品
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                 <Table
                    bordered        //表格有边框
                    rowKey="_id"        //指定表格中每一项的唯一key就是每一项的_id的值
                    loading={loading}       //表格加载过程中是否出现loading图片
                    columns={this.columns}
                    dataSource={products}  //具体显示的数据
                    pagination={{
                        defaultPageSize:PAGE_SIZE,  //默认每页显示条数
                        showQuickJumper:true,       //是否可以快速跳转到某页
                        total:total,                 //分页的总页数
                        // onChange: (pageNum)=> this.getProducts(pageNum)     //页数改变的时候调用回调函数，将把最新页数传递到回调函数中
                        //-----直接用getProducts接收，外层不包裹多余的回调函数。
                        //-----getProducts同样在页数改变的时候执行，并且getProducts同样可以接收传递的pageNum（）
                        onChange: this.getProducts  
                    }} 
                />
            </Card>
        )
    }
}
