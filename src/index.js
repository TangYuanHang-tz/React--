import React from 'react'
import ReactDom from 'react-dom'

import App from './App'
import memoryUtils from './utils/memoryUtils'
//引入操作localStorage存取user的工具组件
import {getUser} from './utils/localStorageUtils'

// 读取localStorage中保存的user，缓存到内存中
// const user = JSON.parse(localStorage.getItem('USER-KEY') || '{}')
const user = getUser()
memoryUtils.user = user

ReactDom.render(<App/>,document.getElementById('root'))