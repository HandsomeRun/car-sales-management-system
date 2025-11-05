# 汽车销售管理系统 - API 接口文档

**文档版本**: v1.0  
**编写人**: 常润（项目经理）  
**编写日期**: 2025-10-19  
**PingCode工作项**: [PING-021]

---

## 1. 接口概述

本文档详细说明汽车销售管理系统的所有 RESTful API 接口。

### 1.1 基础信息

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json; charset=utf-8`
- **响应格式**: JSON

### 1.2 统一响应格式

**成功响应**：

```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1635408000000
}
```

**错误响应**：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  },
  "timestamp": 1635408000000
}
```

---

## 2. 汽车管理 API

### 2.1 获取所有汽车

**接口**: `GET /api/cars`

**说明**: 获取系统中所有汽车列表

**请求参数**: 无

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "id": "car-001",
      "brand": "奔驰",
      "model": "E300L",
      "year": 2024,
      "price": 520000,
      "color": "曜岩黑",
      "stock": 5,
      "status": "available",
      "description": "豪华商务轿车，配置全面",
      "createdAt": "2025-10-15T00:00:00.000Z",
      "updatedAt": "2025-10-15T00:00:00.000Z"
    }
  ],
  "timestamp": 1635408000000
}
```

---

### 2.2 根据 ID 获取汽车

**接口**: `GET /api/cars/:id`

**说明**: 根据汽车 ID 获取详细信息

**路径参数**:

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 汽车ID |

**响应示例**：

```json
{
  "success": true,
  "data": {
    "id": "car-001",
    "brand": "奔驰",
    "model": "E300L",
    "year": 2024,
    "price": 520000,
    "color": "曜岩黑",
    "stock": 5,
    "status": "available",
    "description": "豪华商务轿车，配置全面",
    "createdAt": "2025-10-15T00:00:00.000Z",
    "updatedAt": "2025-10-15T00:00:00.000Z"
  },
  "timestamp": 1635408000000
}
```

**错误响应**：

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Car not found"
  },
  "timestamp": 1635408000000
}
```

---

### 2.3 创建汽车

**接口**: `POST /api/cars`

**说明**: 创建新汽车

**请求体**：

```json
{
  "brand": "宝马",
  "model": "530Li",
  "year": 2024,
  "price": 485000,
  "color": "矿石白",
  "stock": 3,
  "description": "运动豪华轿车"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| brand | string | 是 | 品牌 |
| model | string | 是 | 型号 |
| year | number | 是 | 年份 (1900-2100) |
| price | number | 是 | 价格（元，>0） |
| color | string | 是 | 颜色 |
| stock | number | 是 | 库存（≥0） |
| description | string | 否 | 描述 |

**成功响应**：

```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "brand": "宝马",
    "model": "530Li",
    "year": 2024,
    "price": 485000,
    "color": "矿石白",
    "stock": 3,
    "status": "available",
    "description": "运动豪华轿车",
    "createdAt": "2025-10-19T08:00:00.000Z",
    "updatedAt": "2025-10-19T08:00:00.000Z"
  },
  "timestamp": 1635408000000
}
```

**验证错误响应**：

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "品牌不能为空, 价格必须大于 0"
  },
  "timestamp": 1635408000000
}
```

---

### 2.4 更新汽车

**接口**: `PUT /api/cars/:id`

**说明**: 更新汽车信息

**路径参数**：

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 汽车ID |

**请求体**（所有字段都是可选的）：

```json
{
  "price": 490000,
  "stock": 5,
  "status": "available"
}
```

**字段说明**：

| 字段 | 类型 | 说明 |
|-----|------|------|
| brand | string | 品牌 |
| model | string | 型号 |
| year | number | 年份 |
| price | number | 价格 |
| color | string | 颜色 |
| stock | number | 库存 |
| status | string | 状态 (available/sold/reserved) |
| description | string | 描述 |

**成功响应**：

```json
{
  "success": true,
  "data": {
    "id": "car-002",
    "brand": "宝马",
    "model": "530Li",
    "year": 2024,
    "price": 490000,
    "color": "矿石白",
    "stock": 5,
    "status": "available",
    "description": "运动豪华轿车",
    "createdAt": "2025-10-19T08:00:00.000Z",
    "updatedAt": "2025-10-19T09:00:00.000Z"
  },
  "timestamp": 1635408000000
}
```

---

### 2.5 删除汽车

**接口**: `DELETE /api/cars/:id`

**说明**: 删除汽车

**路径参数**：

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 汽车ID |

**成功响应**：

```json
{
  "success": true,
  "data": {
    "message": "删除成功"
  },
  "timestamp": 1635408000000
}
```

---

## 3. 订单管理 API

### 3.1 获取所有订单

**接口**: `GET /api/orders`

**说明**: 获取系统中所有订单列表

**响应示例**：

```json
{
  "success": true,
  "data": [
    {
      "id": "order-001",
      "carId": "car-001",
      "customerName": "张三",
      "customerPhone": "13800138000",
      "customerEmail": "zhangsan@example.com",
      "quantity": 1,
      "totalPrice": 520000,
      "status": "pending",
      "orderDate": "2025-10-19T10:00:00.000Z",
      "notes": "尽快交车",
      "createdAt": "2025-10-19T10:00:00.000Z",
      "updatedAt": "2025-10-19T10:00:00.000Z"
    }
  ],
  "timestamp": 1635408000000
}
```

---

### 3.2 根据 ID 获取订单

**接口**: `GET /api/orders/:id`

**说明**: 根据订单 ID 获取详细信息

**路径参数**：

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 订单ID |

**响应示例**：参见 3.1

---

### 3.3 创建订单

**接口**: `POST /api/orders`

**说明**: 创建新订单（自动减少库存）

**请求体**：

```json
{
  "carId": "car-001",
  "customerName": "李四",
  "customerPhone": "13900139000",
  "customerEmail": "lisi@example.com",
  "quantity": 1,
  "notes": "周末提车"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| carId | string | 是 | 汽车ID |
| customerName | string | 是 | 客户姓名 |
| customerPhone | string | 是 | 客户电话（11位手机号） |
| customerEmail | string | 是 | 客户邮箱 |
| quantity | number | 是 | 购买数量（>0） |
| notes | string | 否 | 备注 |

**成功响应**：

```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "carId": "car-001",
    "customerName": "李四",
    "customerPhone": "13900139000",
    "customerEmail": "lisi@example.com",
    "quantity": 1,
    "totalPrice": 520000,
    "status": "pending",
    "orderDate": "2025-10-19T10:30:00.000Z",
    "notes": "周末提车",
    "createdAt": "2025-10-19T10:30:00.000Z",
    "updatedAt": "2025-10-19T10:30:00.000Z"
  },
  "timestamp": 1635408000000
}
```

**错误响应（库存不足）**：

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "库存不足或汽车不可用"
  },
  "timestamp": 1635408000000
}
```

---

### 3.4 更新订单状态

**接口**: `PUT /api/orders/:id/status`

**说明**: 更新订单状态（取消订单会恢复库存）

**路径参数**：

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 订单ID |

**请求体**：

```json
{
  "status": "confirmed"
}
```

**状态值**：

| 状态 | 说明 |
|-----|------|
| pending | 待处理 |
| confirmed | 已确认 |
| completed | 已完成 |
| cancelled | 已取消（会恢复库存） |

**成功响应**：参见 3.3

---

### 3.5 删除订单

**接口**: `DELETE /api/orders/:id`

**说明**: 删除订单（会恢复库存）

**路径参数**：

| 参数 | 类型 | 说明 |
|-----|------|------|
| id | string | 订单ID |

**成功响应**：

```json
{
  "success": true,
  "data": {
    "message": "删除成功"
  },
  "timestamp": 1635408000000
}
```

---

## 4. 统计信息 API

### 4.1 获取统计信息

**接口**: `GET /api/stats`

**说明**: 获取系统统计数据

**响应示例**：

```json
{
  "success": true,
  "data": {
    "totalCars": 5,
    "availableCars": 3,
    "totalOrders": 2,
    "pendingOrders": 1
  },
  "timestamp": 1635408000000
}
```

---

## 5. 系统 API

### 5.1 健康检查

**接口**: `GET /health`

**说明**: 检查系统健康状态

**响应示例**：

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": 1635408000000,
    "uptime": 3600
  },
  "timestamp": 1635408000000
}
```

---

### 5.2 API 信息

**接口**: `GET /api`

**说明**: 获取 API 基本信息

**响应示例**：

```json
{
  "success": true,
  "data": {
    "message": "欢迎使用汽车销售管理系统 API",
    "version": "1.0.0",
    "endpoints": {
      "cars": "/api/cars",
      "orders": "/api/orders",
      "stats": "/api/stats",
      "health": "/health"
    }
  },
  "timestamp": 1635408000000
}
```

---

## 6. 错误码说明

| 错误码 | HTTP 状态码 | 说明 |
|-------|-----------|------|
| INTERNAL_SERVER_ERROR | 500 | 服务器内部错误 |
| BAD_REQUEST | 400 | 请求参数错误 |
| NOT_FOUND | 404 | 资源不存在 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| CAR_NOT_FOUND | 404 | 汽车不存在 |
| CAR_OUT_OF_STOCK | 400 | 汽车库存不足 |
| ORDER_NOT_FOUND | 404 | 订单不存在 |
| INVALID_ORDER_STATUS | 400 | 无效的订单状态 |
| VALIDATION_ERROR | 400 | 数据验证错误 |

---

## 7. 限流说明

系统实现了滑动时间窗口限流算法，限制如下：

- **限制**: 1000 请求/秒/IP
- **超限响应**: HTTP 429 + RATE_LIMIT_EXCEEDED 错误
- **建议**: 客户端应实现请求重试机制（指数退避）

---

## 8. 使用示例

### 8.1 JavaScript (Fetch API)

```javascript
// 获取所有汽车
const cars = await fetch('http://localhost:3000/api/cars')
  .then(res => res.json());

// 创建汽车
const newCar = await fetch('http://localhost:3000/api/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    brand: '特斯拉',
    model: 'Model 3',
    year: 2024,
    price: 299000,
    color: '珍珠白',
    stock: 10
  })
}).then(res => res.json());
```

### 8.2 cURL

```bash
# 获取所有汽车
curl http://localhost:3000/api/cars

# 创建订单
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "car-001",
    "customerName": "王五",
    "customerPhone": "13700137000",
    "customerEmail": "wangwu@example.com",
    "quantity": 1
  }'
```

---

**文档变更历史**：

| 版本 | 日期 | 修改人 | 修改内容 |
|-----|------|--------|---------|
| v1.0 | 2025-10-19 | 常润 | 初始版本 |

