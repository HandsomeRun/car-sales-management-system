/**
 * HTTP 服务器主入口
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 * @updated 2025-11-05 - 集成静态文件服务器和API路由
 */

import * as http from 'http';
import * as path from 'path';
import { Router } from './router/index';
import { registerCarRoutes } from './router/carRouter';
import { registerOrderRoutes } from './router/orderRouter';
import { ResponseUtil } from './utils/response';
import { RateLimiter } from './middleware/RateLimiter';
import { CorsHandler } from './middleware/CorsHandler';
import { StaticFileServer } from './middleware/StaticFileServer';
import { MemoryDB } from './dao/MemoryDB';

const PORT = process.env.PORT || 3000;

// 创建中间件实例
const rateLimiter = new RateLimiter(1000, 1000);
const corsHandler = new CorsHandler();
const staticFileServer = new StaticFileServer(path.join(__dirname, '../public'));

// 创建主路由器
const router = new Router();

// 注册业务路由
registerCarRoutes(router);
registerOrderRoutes(router);

// API 基础路由
router.get('/api', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(ResponseUtil.success({
    message: '欢迎使用汽车销售管理系统 API',
    version: '1.0.0',
    endpoints: {
      cars: '/api/cars',
      orders: '/api/orders',
      stats: '/api/stats',
      health: '/health',
    },
  })));
});

// 统计信息
router.get('/api/stats', (_req, res) => {
  const db = MemoryDB.getInstance();
  const stats = db.getStats();
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(ResponseUtil.success(stats)));
});

// 健康检查
router.get('/health', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(ResponseUtil.success({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
  })));
});

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const method = req.method || 'GET';
  const clientIp = RateLimiter.getClientIp(req);

  // 设置 CORS 头
  corsHandler.setCorsHeaders(req, res);

  // 处理 OPTIONS 预检请求
  if (corsHandler.handlePreflight(req, res)) {
    return;
  }

  // 限流检查（仅对 API 请求）
  if (url.startsWith('/api/')) {
    if (!rateLimiter.checkLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.rateLimitExceeded()));
      console.log(`[${new Date().toISOString()}] 限流: ${clientIp} - ${method} ${url}`);
      return;
    }
  }

  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${clientIp}`);

  // 路由匹配
  const route = router.match(method, url.split('?')[0]);

  if (route) {
    try {
      await route.handler(req, res, route.params);
    } catch (error: any) {
      console.error('Route handler error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  } else {
    // 尝试提供静态文件
    const handled = await staticFileServer.handle(req, res);
    if (!handled) {
      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.notFound('Resource')));
    }
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 汽车销售管理系统启动成功！');
  console.log('='.repeat(60));
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📍 系统首页: http://localhost:${PORT}/index.html`);
  console.log(`📍 汽车管理: http://localhost:${PORT}/pages/car-management.html`);
  console.log(`📍 订单管理: http://localhost:${PORT}/pages/order-management.html`);
  console.log(`📍 API 接口: http://localhost:${PORT}/api`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
  console.log('💻 技术栈: Node.js HTTP + TypeScript (零框架)');
  console.log('📊 并发设计: 滑动时间窗口限流算法 (1000 req/s)');
  console.log('='.repeat(60));
  console.log('👥 开发团队:');
  console.log('   常润 (项目经理/架构师), 柳如烟 (后端Lead), 白凝冰 (后端)');
  console.log('   季博达 (后端/并发), 秦彻 (前端Lead), 虾仁 (前端)');
  console.log('   张起灵 (测试), 吴邪 (DevOps)');
  console.log('='.repeat(60));
});

export { router };

