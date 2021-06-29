export const tableFields = [
    {
        title: '卡池名称',
        field: 'pool_name',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '6星UP干员',
        field: 'pickup_6',
        custom: true,
        search: {
            type: 1
        }
    },
    {
        title: '5星UP干员',
        field: 'pickup_5',
        custom: true,
        search: {
            type: 1
        }
    },
    {
        title: '4星UP干员',
        field: 'pickup_4',
        custom: true,
        search: {
            type: 1
        }
    },
    {
        title: '权值',
        field: 'pickup_s',
        custom: true,
        search: {
            type: 1
        }
    },
    {
        title: '卡池属性',
        field: 'limit_pool',
        custom: true,
        search: {
            type: 3,
            data: {
                0: '普通卡池',
                1: '限定卡池',
                2: '联合寻访'
            },
            checked: true
        }
    }
]

export const formFields = [
    {
        title: '卡池名称',
        field: 'pool_name',
        config: {
            type: 1
        }
    },
    {
        title: '6星UP干员',
        field: 'pickup_6',
        config: {
            type: 3,
            multiple: true,
            create: true,
            checked: true
        }
    },
    {
        title: '5星UP干员',
        field: 'pickup_5',
        config: {
            type: 3,
            multiple: true,
            create: true,
            checked: true
        }
    },
    {
        title: '4星UP干员',
        field: 'pickup_4',
        config: {
            type: 3,
            multiple: true,
            create: true,
            checked: true
        }
    },
    {
        title: '权值',
        field: 'pickup_s',
        config: {
            type: 1
        }
    },
    {
        title: '卡池属性',
        field: 'limit_pool',
        config: {
            type: 3,
            data: {
                0: '普通卡池',
                1: '限定卡池',
                2: '联合寻访'
            }
        }
    }
]
