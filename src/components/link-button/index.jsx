import React from 'react'
import './index.less'

/* 
通用的button组件，用来代替其他组件中的a标签（有颜色，鼠标移入显示小手）
props:包含所有标签属性的对象
一个组件会接收到一个特别的属性：children，值为标签体（如果没有标签体，也就没有该属性）
1).字符串  2).标签对象  3).标签对象数组
*/

export default function LinkButton(props){

    return <button className="link-button" {...props}></button>
}