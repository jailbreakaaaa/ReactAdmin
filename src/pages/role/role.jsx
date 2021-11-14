 import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal, message
} from 'antd'

import {reqRoles, reqAddRole, reqUpdateRole} from "../../api"
import {PAGE_SIZE} from "../../utils/constants"
import AddForm from "../role/add-form"
import AuthForm from "./auth-form"
import mUtils from "../../utils/mUtils"
import {formateDate} from "../../utils/dateUtils";
 import storageUtils from "../../utils/storageUtils";
/*
角色路由
*/


export default class Role extends Component {
    state = {
        roles: [], //所有角色的列表
        role: {},//选中的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false //是否显示权限界面
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: create_time => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    /*
    添加角色
    */
    addRole = () => {
        //进行表单验证，只有通过了才向下处理
        this.form.validateFields().then(
            async (values) => {

                //隐藏确认框
                this.setState({
                    isShowAdd: false
                })


                //收集输入数据
                const {roleName} = values
                //请求添加
                const result = await reqAddRole(roleName)
                if (result.status === 0) { //根据结果提示/更新列表显示
                    message.success('添加角色成功')
                    //this.getRoles()
                    //新产生的角色
                    const role = result.data

                    /*//更新roles状态
                    const roles = this.state.roles 尽量不要直接更新状态数据
                    roles.push(role)
                    this.setState({
                        roles
                    })*/

                    //更新roles状态：基于原来的数据进行更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                        })
                    )
                } else {
                    message.error('添加角色失败')
                }

        })


    }

    /*
    更新角色
    */
    updateRole = async () => {

        //隐藏确认框
        this.setState({
            isShowAuth: false
        })

        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()

        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = mUtils.user.username


        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            message.success('设置角色权限成功')

            //如果当前更新的是自己角色的权限，强制退出
            if (role._id = mUtils.user.role._id) {
                mUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，重新登陆')
            }
            this.setState({
                roles: [...this.state.roles]
            })
        }



    }

    onRow = (role) => {
        return {
            onClick: event => { //点击行
                this.setState({
                    role
                })
            }
        }
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }


    render() {

        const {roles, role, isShowAdd, isShowAuth} = this.state

        const title = (
            <span>
                <Button type = 'primary' onClick = {() => {this.setState({isShowAdd: true})}}>创建角色</Button> &nbsp;&nbsp;
                <Button type = 'primary' disabled = {!role._id}  onClick = {() => {this.setState({isShowAuth: true})}}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    rowKey = '_id'
                    bordered
                    dataSource = {roles}
                    columns = {this.columns}
                    pagination = {{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                    rowSelection = {{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        OnSelection: (role) => { //选择某个radio时回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow = {this.onRow}
                />{/*bordered相当于bordered = {true}*/}
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    destroyOnClose={true}
                    onOk={this.addRole}
                    onCancel={() => {
                    this.setState({
                        isShowAdd: false
                    })}}
                >
                    <AddForm
                        setForm = {(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    destroyOnClose={true}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })}}
                >
                    <AuthForm role = {role} ref = {this.auth}/>
                </Modal>
            </Card>
        )
    }
}