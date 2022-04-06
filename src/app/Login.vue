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
                              @change="login"
                              placeholder="请输入用户ID"
                              prefix-icon="el-icon-user"></el-input>
                </div>
                <div class="form-title">Password</div>
                <div>
                    <el-input size="small" type="password" v-model="form.password"
                              @focus="currStatus = 3"
                              @blur="currStatus = 1"
                              @change="login"
                              placeholder="请输入密码"
                              prefix-icon="el-icon-key"></el-input>
                </div>
                <div class="form-button">
                    <el-button type="primary" @click="login">Link Start !</el-button>
                </div>
            </div>
        </div>
        <div class="icp">
            <a href="https://beian.miit.gov.cn" target="_blank">{{ icp }}</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    methods: {
        login: function () {
            if (this.form.userId && this.form.password) {
                this.lib.requests.post({
                    url: '/login',
                    data: this.form,
                    noToken: true,
                    successMessage: true,
                    success: res => {
                        this.$router.push('/index')
                    },
                    error: () => {
                        this.currStatus = 4
                    }
                })
            }
        },
        toBotGitHub: function () {
            window.open('https://github.com/AmiyaBot/Amiya-Bot')
        },
        toConsoleGitHub: function () {
            window.open('https://github.com/AmiyaBot/Amiya-Bot-console')
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
            currStatus: 1,
            icp: window.icp
        }
    }
}
</script>

<style scoped src="./Login.css"></style>
