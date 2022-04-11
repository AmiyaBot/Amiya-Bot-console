<template>
    <div class="AdminRoleList">
        <e-table :fields="table.fields" ref="table"
                 :data="table.data"
                 :total-page="table.total"
                 :list-loader="loadRole">

            <template v-slot:top>
                <el-button type="success" @click="editRole()">新增角色</el-button>
            </template>

            <template v-slot:custom="{ field, value }">
                <div v-if="field.field === 'active'">
                    <span class="tag" v-if="value">已启用</span>
                    <span v-else>未启用</span>
                </div>
            </template>

            <template v-slot:row="{ item }">
                <template v-if="item.id !== 1">
                    <el-button type="text" @click="editRole(item)">编辑</el-button>
                    <el-button type="text" v-if="item.active === 1" @click="setActive(item,0)">禁用</el-button>
                    <el-button type="text" v-if="item.active === 0" @click="setActive(item,1)">启用</el-button>
                    <el-button type="text" @click="delRole(item)">删除</el-button>
                </template>
            </template>

        </e-table>

        <e-window title="配置角色权限" ref="roleEdit" width="80%">
            <el-form size="small" label-width="80px" label-position="left">
                <el-form-item label="角色名称">
                    <el-input v-model="form.role_name" style="width: 300px"></el-input>
                    <el-button type="success" @click="saveRole">提交</el-button>
                </el-form-item>
                <el-form-item label="API权限" class="accessPath">
                    <el-checkbox-group v-model="form.access_path">
                        <template v-for="(items, name) in roles">
                            <div class="groupName" :key="name">{{ name }}</div>
                            <el-checkbox name="access_path" v-for="(item, index) in items"
                                         :label="item"
                                         :key="name + index">
                                {{ item.replace(`/${name}/`, '') }}
                            </el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </e-window>
    </div>
</template>

<script>
import eForm from '@/components/eForm/comp/eForm'
import eTable from '@/components/eTable/comp/eTable'
import eWindow from '@/components/eWindow/comp/eWindow'

export default {
    name: 'RoleList',
    components: {
        eWindow,
        eTable,
        eForm
    },
    methods: {
        loadRole: function (page = 1, pageSize = 10, search = {}) {
            this.lib.requests.post({
                url: '/role/getRolesByPages',
                data: {
                    page,
                    pageSize,
                    search
                },
                success: res => {
                    const rolesGroups = {}

                    for (let item of res.data[0]['access_path'].split(',')) {
                        const name = item.split('/')[1]
                        if (name in rolesGroups) {
                            rolesGroups[name].push(item)
                        } else {
                            rolesGroups[name] = [item]
                        }
                    }

                    this.$set(this, 'roles', rolesGroups)

                    this.$set(this.table, 'data', res.data)
                    this.$set(this.table, 'total', res.count)
                }
            })
        },
        editRole: function (item) {
            this.$refs.roleEdit.show()
            this.$nextTick(() => {
                if (item) {
                    const data = this.lib.common.deepCopy(item)
                    data.access_path = data.access_path.split(',')
                    this.$set(this, 'form', data)
                } else {
                    this.$set(this, 'form', {
                        role_name: '',
                        access_path: []
                    })
                }
            })
        },
        saveRole: function () {
            const data = this.lib.common.deepCopy(this.form)

            data['access_path'] = data['access_path'].join(',')

            this.lib.requests.post({
                url: '/role/saveRole',
                data: data,
                successMessage: true,
                success: res => {
                    this.$refs.roleEdit.hide()
                    this.$refs.table.loadList()
                }
            })
        },
        setActive: function (item, status) {
            this.lib.requests.post({
                url: '/role/setActive',
                data: {
                    role_id: item.id,
                    active: status
                },
                successMessage: true,
                success: res => {
                    this.$refs.table.loadList()
                }
            })
        },
        delRole: function (item) {
            this.lib.message.confirm(`确定删除角色【${item.role_name}】吗？此角色下的管理员将会失去权限。`, '请确认', () => {
                this.lib.requests.post({
                    url: '/role/delRole',
                    data: item,
                    successMessage: true,
                    success: res => {
                        this.$refs.table.loadList()
                    }
                })
            })
        }
    },
    data () {
        return {
            table: {
                fields: [
                    {
                        title: '角色名',
                        field: 'role_name',
                        search: {
                            type: 1,
                            checked: true
                        }
                    },
                    {
                        title: '接口权限拥有数量',
                        field: 'access_path',
                        custom: value => value.split(',').length,
                        search: false
                    },
                    {
                        title: '是否启用',
                        field: 'active',
                        custom: true,
                        search: {
                            type: 3,
                            data: {
                                0: '启用',
                                1: '禁用'
                            },
                            checked: true
                        }
                    }
                ],
                data: [],
                total: 0
            },
            form: {
                role_name: '',
                access_path: []
            },
            roles: []
        }
    },
    mounted () {
        this.loadRole()
    }
}
</script>

<style scoped>
.tag {
    font-size: 13px;
    color: #fff;
    background: #3cb300;
    padding: 0 5px;
    border-radius: 4px;
}

.groupName {
    font-size: 16px;
    font-weight: bold;
}
</style>
<style>
.accessPath .el-checkbox__label {
    width: 200px;
}
</style>
