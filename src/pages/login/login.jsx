import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import { Form, Input, Button } from 'antd';
import {message} from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from "react-redux"

import './login.less'
import logo from '../../assets/imgs/logo.png'
import {login} from "../../redux/actions"

/*
登陆的路由组件
*/

class Login extends Component {

    onFinish = (async (value) => {
        const {username, password} = value

        //调用分发异步action的函数 => 发登录的异步请求，有了结果后更新状态
        this.props.login(username, password)

    })

    onFinishFailed = (value) => {
        console.log(value);
    }




    validatePwd = (rule, value, callback) => {
        if(!value) {
            callback('密码必须输入')
        }else if (value.length < 4) {
            callback('密码长度不能小于4位')
        }else if (value.length > 12) {
            callback('密码长度不能大于12位')
        }else {
            callback() //验证通过
        }

        //callback(xxx) 验证失败,并指定提示的文本
    }

    render() {
        //如果用户已经登陆，自动跳转到管理界面
        const user = this.props.user
        //如果内存没有存储user ==》 当前没有登陆
        if (user && user._id) {
            //自动跳转到登录界面（在render（）中）
            return <Redirect to = '/home'/>
        }

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div className={user.errorMsg ? 'error-msg show' :
                        'error-msg'}>{user.errorMsg}</div>
                    <h2>
                        用户登录
                    </h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            //配置对象:属性名是一些特定的名称
                            name="username"
                            //声明式验证:直接使用别人定义好的验证规则进行验证
                            rules={[
                                {
                                    required: true,
                                    message: '用户名必须输入!',
                                },
                                {
                                    min: 4,
                                    message: '用户名至少4位',
                                },
                                {
                                    max:12,
                                    message: '用户名最多12位',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名必须是英文,数字或下划线组成',
                                }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            //自定义验证
                            rules={[
                                {
                                    validator: this.validatePwd
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}


export default connect(
    state => ({user: state.user}),
    {login}
)(Login)

/*
1.高阶函数
    1)一类特别的函数
        a.接受函数类型的参数
        b.返回值是函数
    2)常见
        a.setTimeout()/setInterval()
        b.Promise(() => {}).then(value => {}, reason => {})
        c.数组遍历相关的方法:forEach()/filter()/map()/reduce()/find()/findIndex()
        d.函数对象的bind()
     3)高阶函数更新动态,更加具有扩展性

2.高阶组件
    const WrapLogin = Form.create()(Login) Login是被包装组件,WrapLogin是包装组件
    1)本质就是一个函数
    2)接受一个组件(被包装组件),返回一个新的组件(包装组件),包装组件会向被包装一个组件传入特定属性
    3)作用:扩展组件的功能
    4)高阶组件也是高阶函数:接受一个组件函数,返回一个新的组件函数

*/

/*
1.前台表单验证
2.收集表单输入数据
*/

/*
组件一个类型,标签是组件的一个实例
*/

/*
* async和await
*1.作用？
*   简化了promise对象的使用：不用再使用then()来指定成功/失败的回调函数
*   以同步编码（没有回调函数了）方式实现异步流程
*2.哪里使用await？
*   在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
*3.哪里写async？
*   await所在函数（最近的）定义的左侧写async
*
* */



//登录用户名或密码错误没有显示，待解决！！！！
