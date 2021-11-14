import React, {Component} from 'react'

import {
    Card,
    Table,
    Button,
    message,
    Modal,
} from "antd"

import {
    PlusOutlined,
    ArrowRightOutlined
 } from '@ant-design/icons'
import LinkButton from "../../components/link-button"
import {reqCategorys, reqUpdateCategory, reqAddCategory} from "../../api"
import AddForm from "./add-form"
import UpdateForm from "./update-form"
import {PAGE_SIZE} from "../../utils/constants";
/*
商品分类路由
*/


export default class Category extends Component {
    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一級分類列表
        subCategorys: [], //二级分类列表
        parentId: '0', //当前需要显示的分类列表的parentId
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示，0：都不显示；1：显示添加确认框；2：显示修改确认框
    }

    /*
    初始化Table所有列數組
    */
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name', //显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( //返回需要显示的界面标签
                    <div>
                        <LinkButton onClick = {() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数：先定义一个匿名函数，在函数 调用处理的函数并传入数据*/}
                        {this.state.parentId === '0' ? <LinkButton onClick = { () => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}
                        {/*不能这样写：onClick = {this.showSubCategorys(category)，这样写会导致一渲染就调用，而不是onClick后*/}
                    </div>
                ),
            },
        ]
    }

    /*
    异步获取一級/二级分类列表
    */
    getCategorys = async () => {
        //再发送请求前，显示loading
        this.setState({loading: true})
        const {parentId} = this.state

        //發異步ajax請求，獲取數據
        const result = await reqCategorys(parentId)

        //在请求完成后，隐藏loading
        this.setState({loading: false})
        if (result.status === 0) {
            //取出分类数组（可能是一级的也可能是二级的）
            const categorys =result.data

            if (parentId === '0') {
                //更新一级分类状态
                this.setState({
                        categorys
                    })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('獲取分類列表失敗')
        }
    }

    /*
   显示指定一级分类对象的二级列表
    */
    showSubCategorys = (category) => {
        //先更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {//在状态更新且重新render()后执行
            //获取二级分类列表显示
            this.getCategorys()
        })
        //setstate()不能立即获取最新的状态，因为setstate()是异步更新状态
    }

    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }

    /*
    响应点击取消：隐藏确认框
    */
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()

        //隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    /*
    显示添加的确认框
    */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /*
    添加分类
    */
    addCategory = async () => {
        this.form.validateFields().then(async (values) => {
            //隐藏确认框
            this.setState({
                showStatus: 0
            })

            //收集数据，把那个提交添加分类的要求
            const {parentId, categoryName} = values

           /* //清除数据
            this.form.resetFields()*/

            const result = await reqAddCategory(categoryName, parentId)
            if (result.status === 0){
                //重新获取分类列表显示
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                } else if (parentId === '0') {
                    // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示
                    this.getCategorys("0")
                }
            }
        })
        .catch((err) => {
            message.info("请输入分类名称");
        })


    }

    /*
    显示更新的确认框
    */
    showUpdate = (category) => {
        debugger
        //保存分类对象
        this.category = category

        this.setState({
            showStatus: 2
        })
    }

    /*
    更新分类
    */
    updateCategory = async () => {
        this.form.validateFields().then(async (values) => {
            //1.隐藏确认框
            this.setState({
                showStatus: 0
            })

            //准备数据
            const categoryId = this.category._id
            const {categoryName} = values

           /* //清除输入数据
            this.form.resetFields()*/

            //2.发送请求更新分类
            const result = await reqUpdateCategory({categoryId, categoryName})
            if (result.status === 0) {
                //3.重新显示列表
                this.getCategorys()
            }
        })
        .catch((err) => {
            message.info('请输入分类名称')
        })
    }


    /*
    為第一次render()準備數據
    */
    componentWillMount() {
        this.initColumns()
    }

    /*
    執行異步任務：發送異步ajax請求
    */
    componentDidMount() {
        //获取一级分类列表
        this.getCategorys()
    }

    render() {
        //读取状态数据
        const {categorys, parentId, parentName, subCategorys, loading, showStatus} = this.state

        //读取指定的分类
        const category = this.category || {} //如果没有指定一个空对象

        //card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick = {this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style = {{marginRight: 5}}/>
                <span>{parentName}</span>
            </span>
        )

        //card的右侧
        const extra = (
            <Button type = 'primary' onClick = {this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table
                    rowKey = '_id'
                    bordered
                    loading = {loading}
                    dataSource = {parentId === '0' ? categorys : subCategorys}
                    columns = {this.columns}
                    pagination = {{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                />{/*bordered相当于bordered = {true}*/}
                <Modal title="添加分类" visible={showStatus === 1} destroyOnClose={true} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm
                        categorys = {categorys}
                        parentId = {parentId}
                        setForm = {(form) => {this.form = form}}
                    />
                </Modal>

                <Modal title="更新分类" visible={showStatus === 2} destroyOnClose={true} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm categoryName = {category.name} setForm = {(form) => {this.form = form}}/>
                    {/*setFrom = {(form) => {this.form = form}}相当于子向父传递form参数*/}
                </Modal>
            </Card>
        )
    }
}


//form中修改分类存在问题

