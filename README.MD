# 校猫日记 前端
校猫日记是一个基于 Vue 和 uni-app 开发的校园猫咪管理平台。本项目旨在帮助校园内的猫咪志愿者更好地管理和关爱流浪猫。

### 主要功能
- 猫咪档案管理：记录校园内猫咪的基本信息、健康状况等
- 位置标记：在地图上标记猫咪经常出没的位置
- 喂食记录：记录志愿者的投喂情况
- 社区互动：志愿者之间可以分享猫咪动态、交流心得

### 技术栈
- Vue.js
- uni-app 跨端开发框架
- uView UI 组件库
- 高德地图 API
- JWT 用户认证

### 运行环境
- Node.js
- npm/yarn 包管理器

### 开发命令
```bash
npm run dev
```

## 项目结构
PawPrint Diaries/
├── src/                      # 源代码目录
│   ├── api/                  # API 接口定义
│   │   ├── user.js          # 用户相关接口
│   │   ├── post.js          # 帖子相关接口
│   │   └── ...
│   ├── components/          # 全局通用组件
│   │   ├── common/         # 基础组件
│   │   │   ├── NavBar.vue  # 导航栏组件
│   │   │   └── ...
│   │   └── business/       # 业务组件
│   ├── composables/        # 组合式函数
│   │   ├── useUser.js      # 用户相关逻辑
│   │   └── ...
│   ├── config/             # 配置文件
│   │   ├── env.js          # 环境配置
│   │   └── constants.js    # 常量配置
│   ├── pages/              # 页面文件
│   │   ├── index/         # 首页
│   │   ├── user/          # 用户相关页面
│   │   └── ...
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   │   ├── modules/       # 模块化的状态
│   │   └── index.js
│   ├── styles/             # 全局样式
│   │   ├── variables.scss  # 变量
│   │   ├── mixins.scss    # 混入
│   │   └── global.scss    # 全局样式
│   ├── utils/              # 工具函数
│   │   ├── request.js     # 请求封装
│   │   ├── storage.js     # 存储工具
│   │   └── ...
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── static/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── icons/             # 图标资源
│   └── fonts/             # 字体资源
├── uni_modules/           # uni-app 插件
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── manifest.json          # uni-app 配置
├── pages.json            # 页面配置
├── vite.config.js        # Vite 配置
└── package.json          # 项目配置
    
