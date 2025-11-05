# 汽车销售管理信息系统

## 项目简介

这是一个基于 **Node.js 原生 HTTP 模块 + TypeScript** 的零框架汽车销售管理系统，用于软件项目管理课程设计的协同开发实验。

### 技术栈

- **后端**: Node.js 原生 HTTP 模块 + TypeScript（零框架）
- **前端**: 原生 HTML + CSS + ES6 JavaScript
- **数据存储**: 内存数组模拟
- **并发控制**: 计数器限流算法
- **测试**: Node.js 自带 assert 模块

### 项目特点

- ✅ 零框架实现，展示对底层技术的深度理解
- ✅ 角色分离，每个团队成员负责不同模块
- ✅ 完整的 Git 协同开发流程
- ✅ 支持 10,000+ 并发用户的设计架构

## 团队成员

- **常润** - 项目经理 / 架构师
- **柳如烟** - 后端开发 Lead
- **白凝冰** - 后端开发
- **季博达** - 后端开发 / 并发控制
- **秦彻** - 前端开发 Lead
- **虾仁** - 前端开发
- **张起灵** - 测试工程师
- **吴邪** - DevOps 工程师

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
```

### 访问系统

浏览器打开：http://localhost:3000

## 功能模块

- 🚗 **汽车信息管理** - 汽车的增删改查
- 📋 **销售订单管理** - 订单创建、查询、状态更新
- 👥 **客户信息管理** - 客户资料管理
- 📊 **统计分析** - 销售数据统计

## 项目结构

```
car-sales-management-system/
├── src/                    # 后端源代码
│   ├── server.ts          # 主服务入口
│   ├── router/            # 路由层
│   ├── dao/               # 数据访问层
│   ├── service/           # 业务逻辑层
│   ├── middleware/        # 中间件
│   ├── utils/             # 工具类
│   └── types/             # TypeScript 类型定义
├── public/                # 前端静态资源
│   ├── pages/            # HTML 页面
│   ├── css/              # 样式文件
│   └── js/               # JavaScript 脚本
├── tests/                # 测试代码
├── docs/                 # 项目文档
└── scripts/              # 脚本工具
```

## 开发规范

### Git 工作流

1. 从 `develop` 分支创建功能分支
2. 开发并提交代码（至少 3 次有意义的提交）
3. 创建 Pull Request
4. 代码审查
5. 合并到 `develop` 分支

### 提交信息规范

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：`feat(backend): 实现汽车管理路由 [柳如烟] [PING-005]`

## 文档

- [架构设计文档](docs/architecture.md)
- [并发设计文档](docs/concurrency-design.md)
- [API 接口文档](docs/api-specification.md)

## 许可证

MIT License
