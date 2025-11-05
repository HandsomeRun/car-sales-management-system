/**
 * HTTP 服务器主入口
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import * as http from 'http';
import { Router } from './router/index';
import { ResponseUtil } from './utils/response';

const PORT = process.env.PORT || 3000;

// 创建主路由器
const router = new Router();

// 基础路由
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(ResponseUtil.success({
    message: '欢迎使用汽车销售管理系统',
    version: '1.0.0',
    endpoints: {
      cars: '/api/cars',
      orders: '/api/orders',
    },
  })));
});

// 健康检查
router.get('/health', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(ResponseUtil.success({
    status: 'healthy',
    timestamp: Date.now(),
  })));
});

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || '/';
  const method = req.method || 'GET';

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  // 路由匹配
  const route = router.match(method, url.split('?')[0]);

  if (route) {
    try {
      await route.handler(req, res, route.params);
    } catch (error: any) {
      console.error('Route handler error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ResponseUtil.notFound('Route')));
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 汽车销售管理系统启动成功！');
  console.log('='.repeat(50));
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📍 API 文档: http://localhost:${PORT}/api/docs`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('开发团队：常润、柳如烟、白凝冰、季博达、秦彻、虾仁、张起灵、吴邪');
  console.log('='.repeat(50));
});

export { router };

