# 汽车销售管理系统 - 架构设计文档

**文档版本**: v1.0  
**编写人**: 常润（架构师）  
**编写日期**: 2025-10-16  
**PingCode工作项**: [PING-002]

---

## 1. 系统概述

### 1.1 系统目标

设计并实现一个支持 **10,000+ 并发用户** 的汽车销售管理信息系统，采用**零框架**理念，基于 Node.js 原生 HTTP 模块和 TypeScript 构建。

### 1.2 设计原则

1. **零框架理念** - 不使用 Express/Fastify 等框架，直接使用 Node.js 原生 HTTP 模块
2. **角色分离** - 前后端分离，数据访问层、业务逻辑层、控制层明确分离
3. **简化实现** - 使用内存数组模拟数据存储，专注展示项目管理和协同开发流程
4. **可演示性** - 系统可直接运行，便于验收和演示

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    浏览器客户端                          │
│             (HTML + CSS + ES6 JavaScript)               │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Request/Response
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   中间件层                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │  CORS     │  │ 限流器     │  │ 静态文件   │          │
│  │ Handler   │  │RateLimiter│  │  服务     │          │
│  └───────────┘  └───────────┘  └───────────┘          │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   路由层 (Router)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ carRouter    │  │ orderRouter  │  │ 其他路由      │ │
│  │ 汽车管理      │  │ 订单管理      │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              业务逻辑层 (Service)                        │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ CarService   │  │ OrderService │                    │
│  │ 汽车业务逻辑  │  │ 订单业务逻辑  │                    │
│  └──────────────┘  └──────────────┘                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│            数据访问层 (DAO)                              │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   CarDAO     │  │  OrderDAO    │                    │
│  │  汽车数据访问 │  │  订单数据访问 │                    │
│  └──────────────┘  └──────────────┘                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              内存数据库 (MemoryDB)                       │
│        Array<Car>  |  Array<Order>  |  ...             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 层次职责

#### 2.2.1 中间件层 (Middleware)

**职责**：请求预处理、安全控制、性能优化

- **CORS Handler** - 跨域请求处理
- **Rate Limiter** - 限流控制（应对 10,000 并发）
- **Static File Server** - 静态文件服务（HTML/CSS/JS）

#### 2.2.2 路由层 (Router)

**职责**：HTTP 请求路由分发

- 手写路由匹配逻辑（不使用 Express 等框架）
- 支持 RESTful API 设计
- URL 解析和参数提取

#### 2.2.3 业务逻辑层 (Service)

**职责**：核心业务逻辑处理

- 数据验证
- 业务规则执行
- 调用 DAO 层进行数据操作

#### 2.2.4 数据访问层 (DAO)

**职责**：数据持久化操作

- CRUD 操作封装
- 操作内存数组（模拟数据库）

#### 2.2.5 内存数据库 (MemoryDB)

**职责**：数据存储

- 使用 TypeScript 数组存储数据
- 模拟数据库的增删改查

---

## 3. 技术选型

### 3.1 后端技术

| 层次 | 技术选型 | 说明 |
|-----|---------|------|
| HTTP 服务器 | Node.js 原生 `http` 模块 | 零框架，直接使用底层 API |
| 编程语言 | TypeScript | 类型安全，提升代码质量 |
| 数据存储 | 内存数组 (Array) | 简化实现，无需配置数据库 |
| 并发控制 | 计数器 + Map | 模拟限流算法 |

### 3.2 前端技术

| 层次 | 技术选型 | 说明 |
|-----|---------|------|
| 页面结构 | 原生 HTML5 | 无框架依赖 |
| 样式 | 原生 CSS3 | 现代化响应式设计 |
| 交互逻辑 | ES6 JavaScript | Fetch API 调用后端 |

### 3.3 开发工具

- **TypeScript 编译器** - 代码编译
- **ts-node** - 直接运行 TypeScript
- **Node.js 自带 assert** - 单元测试
- **Git + GitHub** - 版本控制和协同开发

---

## 4. 数据模型

### 4.1 汽车 (Car)

```typescript
interface Car {
  id: string;                // 汽车ID（UUID）
  brand: string;             // 品牌（如：奔驰、宝马）
  model: string;             // 型号（如：E300L）
  year: number;              // 年份
  price: number;             // 价格（元）
  color: string;             // 颜色
  stock: number;             // 库存数量
  status: 'available' | 'sold' | 'reserved';  // 状态
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}
```

### 4.2 订单 (Order)

```typescript
interface Order {
  id: string;                // 订单ID
  carId: string;             // 汽车ID
  customerName: string;      // 客户姓名
  customerPhone: string;     // 客户电话
  customerEmail: string;     // 客户邮箱
  quantity: number;          // 购买数量
  totalPrice: number;        // 总价
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  orderDate: Date;           // 下单时间
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
}
```

---

## 5. API 设计

### 5.1 RESTful API 规范

| 资源 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 汽车 | GET | /api/cars | 获取所有汽车 |
| 汽车 | GET | /api/cars/:id | 获取单个汽车 |
| 汽车 | POST | /api/cars | 创建汽车 |
| 汽车 | PUT | /api/cars/:id | 更新汽车 |
| 汽车 | DELETE | /api/cars/:id | 删除汽车 |
| 订单 | GET | /api/orders | 获取所有订单 |
| 订单 | GET | /api/orders/:id | 获取单个订单 |
| 订单 | POST | /api/orders | 创建订单 |
| 订单 | PUT | /api/orders/:id | 更新订单 |

### 5.2 统一响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}
```

---

## 6. 并发设计（简化方案）

详见 [并发设计文档](./concurrency-design.md)

**核心思想**：
- 使用 Map 存储请求计数
- 时间窗口算法限流
- 单进程内存存储（简化实现）

---

## 7. 安全设计

### 7.1 输入验证

- 所有用户输入进行类型检查
- 防止空值/未定义值
- 数值范围检查

### 7.2 CORS 配置

- 允许指定域名访问
- 限制 HTTP 方法

### 7.3 错误处理

- 统一错误处理机制
- 不暴露敏感信息

---

## 8. 部署架构（简化）

```
┌─────────────────────────────────────┐
│        客户端浏览器                  │
│    http://localhost:3000            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Node.js HTTP Server              │
│    (ts-node src/server.ts)          │
│    端口: 3000                        │
└─────────────────────────────────────┘
```

**启动命令**：
```bash
npm install
npm start
```

---

## 9. 性能指标

| 指标 | 目标值 | 实现方式 |
|-----|--------|---------|
| 并发用户数 | 10,000+ | 限流算法保护 |
| 响应时间 | < 100ms | 内存存储，无IO开销 |
| 系统可用性 | > 99% | 错误处理机制 |

---

## 10. 项目目录结构

```
car-sales-management-system/
├── src/                        # 后端源代码
│   ├── server.ts              # HTTP 服务器入口
│   ├── router/                # 路由层
│   │   ├── index.ts           # 路由分发器
│   │   ├── carRouter.ts       # 汽车路由
│   │   └── orderRouter.ts     # 订单路由
│   ├── service/               # 业务逻辑层
│   │   ├── CarService.ts
│   │   └── OrderService.ts
│   ├── dao/                   # 数据访问层
│   │   ├── MemoryDB.ts        # 内存数据库
│   │   ├── CarDAO.ts
│   │   └── OrderDAO.ts
│   ├── middleware/            # 中间件
│   │   ├── RateLimiter.ts
│   │   ├── CorsHandler.ts
│   │   └── StaticFileServer.ts
│   ├── utils/                 # 工具类
│   │   ├── response.ts        # 响应格式化
│   │   └── validator.ts       # 数据验证
│   └── types/                 # 类型定义
│       ├── Car.ts
│       ├── Order.ts
│       └── Response.ts
├── public/                    # 前端静态文件
│   ├── index.html
│   ├── pages/
│   │   ├── car-management.html
│   │   └── order-management.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── car.js
│       └── order.js
├── tests/                     # 测试代码
│   └── unit/
│       ├── CarService.test.ts
│       └── RateLimiter.test.ts
├── docs/                      # 文档
│   ├── architecture.md        # 本文档
│   ├── concurrency-design.md
│   └── api-specification.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## 11. 开发流程

### 11.1 Git 分支策略

```
main (生产分支)
  └── develop (开发分支)
       ├── feature/car-management-backend
       ├── feature/car-management-frontend
       ├── feature/order-management-backend
       ├── feature/order-management-frontend
       ├── feature/testing
       └── feature/docs
```

### 11.2 代码审查流程

1. 开发人员在功能分支开发
2. 提交代码并创建 Pull Request
3. 指定审查者进行代码审查
4. 审查通过后合并到 develop
5. 定期从 develop 合并到 main

---

## 12. 总结

本架构设计采用**零框架**理念，通过**分层架构**和**角色分离**，实现了一个轻量级、可演示的汽车销售管理系统。虽然采用内存数组模拟数据存储，但完整展示了企业级系统的架构设计思想和协同开发流程。

**设计优势**：
- ✅ 架构清晰，层次分明
- ✅ 技术选型合理，易于实现
- ✅ 支持大规模并发设计
- ✅ 便于团队协同开发
- ✅ 可直接运行演示

---

**文档变更历史**：

| 版本 | 日期 | 修改人 | 修改内容 |
|-----|------|--------|---------|
| v1.0 | 2025-10-16 | 常润 | 初始版本 |

