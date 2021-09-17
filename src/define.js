export const functions = {
    normal: '普通互动',
    userInfo: '查看个人信息',
    checkOperator: '干员模块',
    checkEnemy: '敌方单位模块',
    checkMaterial: '物品模块',
    recruit: '公招查询',
    gacha: '模拟抽卡',
    jadeCalculator: '合成玉计算',
    intellectAlarm: '理智恢复提醒',
    functionQuery: '菜单',
    weibo: '微博'
}

export const functionsSetting = {
    globalState: (
        () => {
            const globalState = {}
            for (let id in functions) {
                globalState[id] = true
            }
            return globalState
        }
    )(),
    weiboSetting: {
        weiboSendGIF: true,
        weiboAutoPush: true,
        checkRate: 30
    },
    jadeSetting: {
        signIn: 0,
        dailyTasks: 0,
        weeklyTasks: 0,
        weeklyBattle: 0
    }
}
