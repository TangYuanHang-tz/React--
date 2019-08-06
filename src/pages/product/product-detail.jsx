import React, { Component } from 'react'
import {Card,List,Icon} from 'antd'

import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constents'
//获取根据分类id获取分类名称的请求
import {reqCategory} from '../../api'
/* 
    商品详情界面
*/
export default class ProductDetail extends Component {

    state = {
        cName1: '',     //一级分类名
        cName2: ''      //二级分类名
    }
    //在组件完成挂载之后获取分类
    async componentDidMount(){
        const product = this.props.location.state
        const {categoryId,pCategoryId} = product
        //如果是一级分类
        if(pCategoryId === '0'){
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({
                cName1
            })
        }else{
            /* const result1 = await reqCategory(categoryId)
            const result2 = await reqCategory(pCategoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            如果这种情况，第二个请求只有在第一个请求，请求结束之后才会发送请求，但是第二个请求根本不需要第一个请求的结果作为参数
            所以使用promise.all的方法将所有请求一起发出，该方法只有所有异步操作都成功才会返回保存异步成功结果的数组对象
            */
            const result = await Promise.all(reqCategory(categoryId),reqCategory(pCategoryId))
            const cName1 = result[0].data.name
            const cName2 = result[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }


    render() {
        //获取home组件传递过来的商品数据
        const product = this.props.location.state
        const {name,desc,price,imgs,detail} = product
        //从状态中获取分类信息
        const { cName1,cName2 } = this.state

        const title = (
            <span>
                {/* 点击回退 */}
                <LinkButton onClick={()=> this.props.history.goBack()}>
                    <Icon type="arrow-left" style={{fontSize: 20}}/>
                </LinkButton>
                &nbsp;&nbsp;商品详情
            </span>
        )
        return (
            <Card title={title} className='detail'>
                <List>
                    <List.Item>
                        <span className='detail-left'>商品名称：</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='detail-left'>商品详情：</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='detail-left'>商品价格：</span>
                        <span>{price}元</span>
                    </List.Item>
                    <List.Item>
                        <span className='detail-left'>所属分类:</span>
                        <span> {cName1} {cName2 !== ''?"-->":''} {cName2}</span>
                    </List.Item>
                    <List.Item>
                        <span className='detail-left'>商品图片：</span>
                        <span>
                            {/* 因为获取的imgs是一个图片数组，并且没有基础路劲，之后图片名，所以添加基础路径 */}
                            {
                                imgs.map((img)=>{ return <img key={img} src={BASE_IMG_URL + img} alt='tupian'></img> })
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='detail-left'>商品详情：</span>
                        {/* ------我们获取的detail是一个带有标签的文本，所以我们需要解析，在以前是用innerHtml
                        在React中需要使用dangerouslySetInnerHTML属性来实现，里面传递一个对象，且属性为__html */}
                        {/* <div dangerouslySetInnerHTML={{ __html: detail }}></div> */}
                        <div dangerouslySetInnerHTML={{__html: detail}}></div>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
