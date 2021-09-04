export const poolType = {
    0: '普通卡池',
    1: '限定卡池',
    2: '联合寻访'
}

export const operatorType = {
    0: '可抽取-限定干员',
    1: '可抽取-联动干员',
    2: '不可抽取-非常规途径',
    3: '不可抽取-销售',
    4: '不可抽取-公开招募',
    5: '不可抽取-活动奖励',
    6: '不可抽取-联动奖励',
    7: '不可抽取-危机合约奖励',
    8: '不可抽取-roguelike限定'
}

export const poolTableFields = [
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
            data: poolType,
            checked: true
        }
    }
]

export const poolFormFields = [
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
            data: poolType,
            default: 0
        }
    }
]

export const configTableFields = [
    {
        title: '非常规获得的干员',
        field: 'operator_name',
        search: {
            type: 1,
            checked: true
        }
    },
    {
        title: '属性',
        field: 'operator_type',
        custom: true,
        search: {
            type: 3,
            data: operatorType,
            checked: true
        }
    }
]

export const configFormFields = [
    {
        title: 'ID',
        field: 'conf_id',
        config: {
            type: 1,
            disabled: true
        }
    },
    {
        title: '非常规获得的干员',
        field: 'operator_name',
        config: {
            type: 1
        }
    },
    {
        title: '属性',
        field: 'operator_type',
        config: {
            type: 3,
            data: operatorType,
            default: 0
        }
    }
]
