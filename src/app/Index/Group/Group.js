export const tableFields = [
    {
        title: '群号',
        field: 'group_id',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '群名称',
        field: 'group_name',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: 'BOT群内权限',
        field: 'permission',
        search: {
            type: 3,
            data: {
                'MEMBER': '成员',
                'ADMINISTRATOR': '管理员'
            },
            checked: true
        }
    },
    {
        title: '30天内使用数量',
        field: 'message_num',
        search: false
    },
    {
        title: '启用状态',
        field: 'active',
        custom: true,
        search: false
    },
    {
        title: '允许推送公告',
        field: 'send_notice',
        custom: true,
        search: false
    },
    {
        title: '允许推送微博',
        field: 'send_weibo',
        custom: true,
        search: false
    }
]
