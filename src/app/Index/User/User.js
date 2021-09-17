export const tableFields = [
    {
        title: '用户ID',
        field: 'user_id',
        sortable: true,
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '好感度',
        field: 'user_feeling',
        sortable: true,
        search: false
    },
    {
        title: '心情值',
        field: 'user_mood',
        sortable: true,
        search: false
    },
    {
        title: '累计对话数量',
        field: 'message_num',
        sortable: true,
        search: false
    },
    {
        title: '凭证数量',
        field: 'coupon',
        sortable: true,
        search: false
    },
    {
        title: '签到状态',
        field: 'sign_in',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '未签到',
                1: '已签到'
            },
            checked: true
        }
    },
    {
        title: '累计签到次数',
        field: 'sign_times',
        sortable: true,
        search: false
    },
    {
        title: '黑名单状态',
        field: 'black',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '正常',
                1: '黑名单'
            },
            checked: true
        }
    }
]
