# amburger

项目代号 amburger
是为了快速开发业务而准备的基本项目模板，其中名字来源是[法语里 H 不发音](https://www.bilibili.com/video/BV1ma4y1a7iF)。

## Checklist

- [x] 用户角色 ROLE
- [x] 账号密码登录
- [x] 邮箱登录
- [ ] 微信扫码登录
- [ ] 微信小程序登录
- [x] 发送短信
- [x] 短信注册/登录
- [x] OSS/S3 接入
- [ ] 微信支付
- [ ] 支付宝支付

## 开发环境

### REPL

可以用以下命令启动一个 REPL 控制台，在其中手动运行调试项目代码。使用 `get(IpsService)` 可以获得特定 service 或者 module
的实例。

参考: https://docs.nestjs.com/recipes/repl

```
npm run repl
```

### 部署说明

启动前需先配置环境变量，或参考 `.env.defaults` 设置环境变量到 `.env` 。

test/development 环境下会使用自动生成的 sqlite 数据库，生产环境下请在环境变量里配置数据库连接信息。

(见 `.env` 以及 `src/lib/data-source.ts`)

如要使用 typeorm 的 cli，请参考下方用 npm 调用，或自行调用时指定 DataSource 到 `lib/data-source.ts`，如：

```bash
$ npx typeorm -d dist/lib/data-source.js
#or
$ npx typeorm-ts-node-commonjs src/lib/data-source.ts
```

参数传递请参考[官方文档](https://orkhan.gitbook.io/typeorm/docs/using-cli#if-entities-files-are-in-typescript)
中的 `If entities files are in typescript` 章节

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

