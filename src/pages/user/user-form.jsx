import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/*
添加/修改用户的form组件
*/

export default class UserForm  extends PureComponent{
    //最新的react废弃了this.refs，ref引用的写法有了改变。
    // 使用React.createRef()后，通过ref的current属性将能得到dom节点或组件的实例
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {
        const {roles, user} = this.props

        const formItemLayout = {
            labelCol: {span: 8}, //左侧label宽度
            wrapperCol: {span: 12}, //右侧包裹的宽度
        }

        return(
            <Form {...formItemLayout} ref={this.formRef}>
                <Item label = '用户名' name = 'username' initialValue={user.username}>
                    <Input placeholder = '请输入用户名'/>
                </Item>
                {
                    user._id ? null : (
                    <Item label = '密码' name = 'password' initialValue={user.password}>
                        <Input type = 'password'  placeholder = '请输入用户密码'/>
                    </Item>
                    )
                }
                <Item label = '手机号' name = 'phone' initialValue={user.phone}>
                    <Input placeholder = '请输入手机号'/>
                </Item>
                <Item label = '邮箱' name = 'email' initialValue={user.email}>
                    <Input placeholder = '请输入邮箱'/>
                </Item>
                <Item label = '角色' name = 'role_id' initialValue={user.role_id}>
                    <Select>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}