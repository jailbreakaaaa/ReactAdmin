import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/*
添加分类的form组件
*/

export default class AddForm extends Component {
    //最新的react废弃了this.refs，ref引用的写法有了改变。
    // 使用React.createRef()后，通过ref的current属性将能得到dom节点或组件的实例
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        categorys: PropTypes.array.isRequired, //一级分类数组
        parentId: PropTypes.string.isRequired //父类id
    }

    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }

    render() {

        const{categorys, parentId} = this.props

        return(
            <Form ref={this.formRef}>
                <Item name="parentId" initialValue={parentId}>
                    <Select>
                        <Option value = '0'>一级分类</Option>
                        {
                            categorys.map(c => <Option key = {c._id} value = {c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>

                <Item name = 'categoryName' rules={[{ required: true, message: "请输入分类名称" }]}>
                    <Input placeholder = '请输入分类名称'></Input>
                </Item>
            </Form>
        )
    }
}