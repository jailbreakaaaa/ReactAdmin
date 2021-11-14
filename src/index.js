import React from 'react'
import ReactDom from 'react-dom'

import App from './App'
import storageUtils from "./utils/storageUtils";
import mUtils from './utils/mUtils'
/*
入口js
*/

//读取local中保存user，保存到内存中
const user = storageUtils.getUser();
mUtils.user = user;

//将App组件标签渲染到index页面的div上
ReactDom.render(<App/>, document.getElementById('root'))
