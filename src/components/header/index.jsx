import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'
import {connect} from "react-redux"

import {formateDate} from "../../utils/dateUtils";//加{}分别暴露
import {reqWeather} from "../../api";
// 不加{}默认暴露
import LinkButton from "../link-button";
import './index.less'
import menuList from "../../config/menuConfig";
import {logout} from '../../redux/actions'
/*
左侧导航的组件
*/

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), //现在的时间
        weather: ''//天气的文本
    }

    getTime = () => {
        //每隔1s获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        const weather = await reqWeather('330100')
        this.setState({weather})
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title

        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                //在所有子Item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果有值说明有匹配的
                if(cItem) {
                    //取出它的title
                    title = cItem.title
                }

            }
        })

        return title
    }

    /*
    退出登录
    */
    logout = () => {
        Modal.confirm({
            content: '确认退出吗？',
            onOk: () => {
                this.props.logout()
            }
            }
        )
    }


    /*
    在第一次render()之后执行
     一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount() {
        //获取当前的时间
        this.getTime()
        //获取当前天气显示
        this.getWeather()
    }

    /*
    不能这么做：不会更新显示
    componentWillMount() {
        this.title = this.getTitle()
    }
    */

    /*
    当前组件卸载之前调用
    */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime, weather} = this.state
        const username = this.props.user.username

        //const title = this.getTitle()
        const title = this.props.headTitle
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton >
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="" alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))