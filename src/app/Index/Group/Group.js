export const tableFields = [
    {
        title: '群号',
        field: 'group_id',
        sortable: true,
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '群名称',
        field: 'group_name',
        sortable: true,
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
        title: '活跃度',
        field: 'message_num',
        search: false
    },
    {
        title: '启用状态',
        field: 'active',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '否',
                1: '是'
            },
            checked: true
        }
    },
    {
        title: '允许推送公告',
        field: 'send_notice',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '否',
                1: '是'
            },
            checked: true
        }
    },
    {
        title: '允许推送微博',
        field: 'send_weibo',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '否',
                1: '是'
            },
            checked: true
        }
    }
]

export const noticeTableFields = [
    {
        title: '公告ID',
        field: 'notice_id',
        search: false
    },
    {
        title: '公告内容',
        field: 'content',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '推送人',
        field: 'send_user',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '推送时间',
        field: 'send_time',
        search: false
    }
]
