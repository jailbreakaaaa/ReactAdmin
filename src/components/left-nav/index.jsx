import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd'

import logo from '../../assets/imgs/logo.png'
import menuList from "../../config/menuConfig";
import './index.less'
import mUtils from "../../utils/mUtils";


const { SubMenu } = Menu


/*
左侧导航的组件
*/

class LeftNav extends Component {

    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    /*
    判断当前登录用户对item是否有权限
    */
    hasAuth = (item) => {
        const {key, isPublic} = item

        const menus = mUtils.user.role.menus
        const username  = mUtils.user.username
        /*
        1.如果当前用户是admin
        2.如果当前item是公开的
        3.当前用户有此item的权限，key有没有在item中
        */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            //4.当前用户有此item的某个子item的权限
             return !!item.children.find(child => menus.indexOf(child.key) !== -1) //加上！！算取bool值
        }
        return false
    }

    /*
    根据menu的数据数组生成对应的标签数组
    使用map() + 递归调用
    */
    /*getMenuNodes = (menuList) => {
        return menuList.map(item => {
            /!*
            {
                title:'首页'，//菜单标题名称
                key:'/home' //对应的patch
                icon：'home' //图标名称
                children:[] //可能有，也可能没有
            }
            <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to = '/home'>
                            首页
                        </Link>
            </Menu.Item>
            *!/

            /!*
            <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                <Menu.Item key="/category" icon={<MailOutlined />}>品类管理</Menu.Item>
                <Menu.Item key="/product" icon={<MailOutlined />}>商品管理</Menu.Item>
            </SubMenu>
            *!/
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to = {item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            } else {
                return(
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }*/

    /*
    根据menu的数据数组生成对应的标签数组
    使用map() + 递归调用
    */
    getMenuNodes = (menuList) => {

        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) { //当前请求的是商品或者其子路由界面
            path = '/product'

        }

        return menuList.reduce( (pre, item) => {

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if(!item.children) {
                    //向pre中添加<Menu.Item>
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to = {item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    ))
                }else {

                    //查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    //如果存在，说明当前Item的子列表需要展开
                    if (cItem) {
                        this.openKey = item.key
                    }

                    //向pre中添加<SubMenu>
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    /*
        在第一次render()之前执行一次
        为第一个render()准备数据
     */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        //得到当前请求的路由路径
        const path = this.props.location.pathname

        const openKey = this.openKey

        return (
            <div className='left-nav'>
                <Link to = '/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    {
                        this.menuNodes
                    }
                </Menu>

            </div>
        )
    }
};


/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递三个属性：history、location、match
 */
export default withRouter(LeftNav)
//icon组件的引用不会！！！！！！！！
//debugger加断点