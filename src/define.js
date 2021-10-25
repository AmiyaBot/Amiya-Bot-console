export const functions = {
    normal: '普通互动',
    userInfo: '查看个人信息',
    checkOperator: '干员资料',
    checkEnemy: '敌方单位资料',
    checkMaterial: '物品资料',
    recruit: '公招查询',
    gacha: '模拟抽卡',
    jadeCalculator: '合成玉计算',
    intellectAlarm: '理智恢复提醒',
    functionQuery: '查看菜单',
    weibo: '微博',
    replaceText: '词语替换'
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
