import React, {Component} from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
/*
添加分类的form组件
*/

export default class UpdateForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        //将Form对象通过setForm()传递父组件
       this.props.setForm(this.formRef.current)
    }

    render() {
        const {categoryName} = this.props

        return(
            <Form ref={this.formRef}>
                <Item
                    name = 'categoryName'
                    initialValue = {categoryName}
                >
                    <Input placeholder = '请输入分类名称' />
                </Item>
            </Form>
        )
    }
}