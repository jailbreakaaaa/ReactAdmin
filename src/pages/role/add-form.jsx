import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item
/*
添加分类的form组件
*/

export default class AddForm extends Component {
    //最新的react废弃了this.refs，ref引用的写法有了改变。
    // 使用React.createRef()后，通过ref的current属性将能得到dom节点或组件的实例
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
    }

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {

        const formItemLayout = {
            labelCol: {span: 8}, //左侧label宽度
            wrapperCol: {span: 12}, //右侧包裹的宽度
        }

        return(
            <Form ref={this.formRef}>
                <Item label = '角色名称' name = 'roleName' {...formItemLayout} rules={[{ required: true, message: "请输入角色名称" }] }>
                    <Input placeholder = '请输入角色名称'></Input>
                </Item>
            </Form>
        )
    }
}