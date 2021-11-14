import React, {Component} from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    Form,
    message
} from 'antd'

import {
    PlusOutlined
} from '@ant-design/icons'
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

/*
Product的默认子路由组件
*/
const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        total: 0, //商品的总数量
        products: [], //商品的数组
        loading: false, //是否正在加载中
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }

    /*
    初始化table的列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: 100,
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                     return '￥' + price //当前指定了对应的属性，传入的是对应的属性值
                }
            },
            {
                width: 100,
                title: '状态',
                //dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button
                                type = 'primary'
                                onClick = {() => {this.updateStatus(_id, status === 1 ? 2 : 1)}}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick = {() => {this.props.history.push('/product/detail', {product})}}>详情</LinkButton>
                            <LinkButton onClick = {() => {this.props.history.push('./product/addupdate', product)}}>修改</LinkButton>
                        </span>
                    )
            }
            },
        ];
    }

    /*
    获取指定页码的列表数据显示
    */
    getProducts = async (pageNum) => {

        this.pageNum = pageNum //保存pageNum，让其他方法可以看到

        this.setState({loading: true}) //发送请求之前 显示loading界面

        const {searchType, searchName} = this.state


        let result  //结果是统一处理的，所以要放在外面
        if (searchName) { //如果搜索关键字有值，说明我们要做搜索分页
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType}) //放在对象中输入没有先后顺序
        } else { //一般分页请求
            result = await reqProducts(pageNum, 3)
        }

        this.setState({loading: false}) //发送请求之后 隐藏loading界面
        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                product: list
            })
        }
    }

    /*
    更新指定商品的状态
    */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        //取出商品的数据
        const {products, total, loading, searchType, searchName} = this.state

        const title = (
            <span>
                <Select value ={searchType}
                        style={{width: 150}}
                        onChange={value => this.setState({searchType: value})}
                >
                    <Option value = 'productName'>按名称搜索</Option>
                    <Option value = 'productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder = '关键字'
                       style = {{width: 150, margin:'0 15px'}}
                       value = {searchName}
                       onChange={event => this.setState({searchName: event.target.value})}
                />
                <Button type = 'primary' onClick = {() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type = 'primary' onClick = {() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title = {title} extra = {extra}>
                <Table
                    loading={loading}
                    bordered
                    rowKey = '_id'
                    dataSource = {products}
                    columns = {this.columns}
                    pagination = {{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts //之所以不写成(pageNum) => {this.getProducts(pageNum)}，是因为它传的实参就是我们要接收的参数
                    }}
                />
            </Card>
        )
    }
}

/*
1)纯前台分页：
    请求获取数据：一次获取所有数据，翻页时不需要再发请求
    请求接口：
            不需要指定：页码（pageNum）和每页数量（pageSize）
            响应数据：所有数据的数组
2）基于后台的分页：
    请求获取数据：每次只获取当前页的数据，翻页时要发请求
    请求接口：
            需要指定：页码（pageNum）和每页数量（pageSize）
            响应数据：当前页数据的数组 + 总记录数（total）（最重要的是total）
3）如何选择？
    基本根据数据多少来选择

*/
