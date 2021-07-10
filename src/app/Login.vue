<template>
    <div class="login">
        <div class="rabbit"></div>
        <div class="login-form">
            <div class="github" @click="toConsoleGitHub"></div>
            <div class="face" :class="status[currStatus]"></div>
            <div class="logo">
                <div class="text">Login</div>
                <div class="text bot" @click="toBotGitHub">Amiya-Bot</div>
                <div class="text">Console</div>
            </div>
            <div class="form">
                <div class="form-title">UserID</div>
                <div>
                    <el-input size="small" v-model="form.userId"
                              @focus="currStatus = 2"
                              @blur="currStatus = 1"
                              placeholder="请输入用户ID"
                              prefix-icon="el-icon-user"></el-input>
                </div>
                <div class="form-title">Password</div>
                <div>
                    <el-input size="small" type="password" v-model="form.password"
                              @focus="currStatus = 3"
                              @blur="currStatus = 1"
                              placeholder="请输入密码"
                              prefix-icon="el-icon-key"></el-input>
                </div>
                <div class="form-button">
                    <el-button type="primary" @click="login">Link Start !</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    methods: {
        login: function () {
            this.lib.requests.post({
                url: '/login',
                data: this.form,
                successMessage: true,
                success: res => {
                    if (res.type === 0) {
                        this.$router.push('/index')
                    } else {
                        this.currStatus = 4
                    }
                }
            })
        },
        toBotGitHub: function () {
            window.open('https://github.com/vivien8261/Amiya-Bot')
        },
        toConsoleGitHub: function () {
            window.open('https://github.com/vivien8261/Amiya-Bot-console')
        }
    },
    data () {
        return {
            form: {
                userId: '',
                password: ''
            },
            status: {
                1: 'normal',
                2: 'account',
                3: 'password',
                4: 'error'
            },
            currStatus: 1
        }
    }
}
</script>

<style scoped src="./Login.css"></style>
