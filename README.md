# Amiya-Bot-console

> [Amiya-Bot](https://github.com/vivien8261/Amiya-Bot) 项目的系统控制台

> 尚处于开发阶段，敬请期待...

### 准备

- 安装 [nodeJs](https://nodejs.org/zh-cn/) 环境
- 开发需要熟悉 [Vue](https://cn.vuejs.org/) 框架以及 ES6 的 JavaScript 语法，以及了解 node 基础

### 部署

- 下载 Amiya-Bot-console 一键包
- 解压后在文件夹控制台执行 `npm install` 下载依赖
- 在 `start.js` 配置你的 Amiya-Bot 的数据库配置

```js
const openServer = require('./server/server')
openServer(
    // 数据库配置
    {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '*******',
        database: 'amiya'
    }
)
```

- 完成后执行 `node start.js` 启动服务
- 访问 `http://127.0.0.1:8000`

### 常见问题

#### Mysql 报错 `Cannot enqueue Query after fatal error`

原因是 Mysql 5+ 的密码规则引起的，在 Mysql 控制台根据实际情况执行以下语句，再重启 Mysql 服务即可解决

```shell
use mysql;
alter user 'root'@'localhost' identified with mysql_native_password by '********';
flush privileges;
```
