# 🔧 常见问题解决方案

## ✅ 已解决：TypeScript 编译错误（未使用的参数）

### 问题描述
```
TSError: ⨯ Unable to compile TypeScript:
src/server.ts:17:18 - error TS6133: 'req' is declared but its value is never read.
src/server.ts:30:24 - error TS6133: 'req' is declared but its value is never read.
```

### 原因
TypeScript 的严格模式检测到参数 `req` 被声明但从未使用。

### 解决方案
将未使用的参数名改为 `_req`（下划线前缀表示有意不使用）。

**修改前：**
```typescript
router.get('/', (req, res) => { ... });
```

**修改后：**
```typescript
router.get('/', (_req, res) => { ... });
```

### 状态
✅ **已修复** - 可以正常运行 `npm start`

---

## 其他可能的问题

### 问题 1: 端口 3000 被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**
```powershell
# 方案 A: 更换端口
$env:PORT=3001
npm start

# 方案 B: 关闭占用端口的进程（Windows）
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F
```

---

### 问题 2: 模块找不到

**错误信息：**
```
Cannot find module './middleware/RateLimiter'
```

**解决方案：**
```powershell
# 检查文件是否存在
ls src/middleware/RateLimiter.ts

# 如果不存在，查看 GIT_FIX_BY_ROLES.txt 补充缺失文件
```

---

### 问题 3: npm install 失败

**解决方案：**
```powershell
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -r node_modules
rm package-lock.json

# 重新安装
npm install
```

---

### 问题 4: Git pull 冲突

**解决方案：**
```powershell
# 使用一键解决脚本
.\fix-git-conflict.ps1

# 或手动执行
git add .
git stash
git pull
git stash pop
```

---

## 🚀 启动检查清单

运行 `npm start` 前，确保：

- [x] ✅ 已安装 Node.js (v14+)
- [x] ✅ 已执行 `npm install`
- [x] ✅ 所有必需文件已存在
- [x] ✅ 端口 3000 未被占用
- [x] ✅ 没有 TypeScript 编译错误

---

## 📝 成功启动的标志

看到以下输出说明启动成功：

```
==================================================
🚀 汽车销售管理系统启动成功！
==================================================
📍 服务地址: http://localhost:3000
📍 系统首页: http://localhost:3000/index.html
📍 汽车管理: http://localhost:3000/pages/car-management.html
📍 订单管理: http://localhost:3000/pages/order-management.html
==================================================
```

---

## 🔍 调试技巧

### 查看详细错误信息
```powershell
# 查看完整的错误堆栈
npm start 2>&1 | Tee-Object -FilePath error.log
```

### 检查端口占用
```powershell
# Windows
netstat -ano | findstr :3000

# 查看进程详情
tasklist | findstr <PID>
```

### 验证 TypeScript 配置
```powershell
# 编译检查（不运行）
npx tsc --noEmit
```

---

## 💡 获取帮助

如果遇到其他问题：

1. 查看完整错误信息
2. 检查文件是否完整
3. 确认 Git 状态
4. 查看 Node.js 版本

---

**最后更新**: 2025-11-05

