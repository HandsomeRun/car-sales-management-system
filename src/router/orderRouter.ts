/**
 * 订单管理路由
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-18
 */

import { IncomingMessage } from 'http';
import { Router } from './index';
import { OrderService } from '../service/OrderService';
import { ResponseUtil } from '../utils/response';
import { CreateOrderDTO } from '../types/Order';

const orderService = new OrderService();

export function registerOrderRoutes(router: Router): void {
  /**
   * 获取所有订单
   * GET /api/orders
   */
  router.get('/api/orders', async (_req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(orders)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 根据 ID 获取订单
   * GET /api/orders/:id
   */
  router.get('/api/orders/:id', async (_req, res, params) => {
    try {
      const order = await orderService.getOrderById(params!.id);
      if (!order) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.notFound('Order')));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(order)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 创建订单
   * POST /api/orders
   */
  router.post('/api/orders', async (req, res) => {
    try {
      const body = await parseBody(req);
      const dto: CreateOrderDTO = JSON.parse(body);

      const result = await orderService.createOrder(dto);
      if (!result.success) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.badRequest(result.error || 'Invalid data')));
        return;
      }

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(result.data)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 更新订单状态
   * PUT /api/orders/:id/status
   */
  router.put('/api/orders/:id/status', async (req, res, params) => {
    try {
      const body = await parseBody(req);
      const { status } = JSON.parse(body);

      const result = await orderService.updateOrderStatus(params!.id, status);
      if (!result.success) {
        const statusCode = result.error === '订单不存在' ? 404 : 400;
        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.badRequest(result.error || 'Update failed')));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(result.data)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 删除订单
   * DELETE /api/orders/:id
   */
  router.delete('/api/orders/:id', async (_req, res, params) => {
    try {
      const result = await orderService.deleteOrder(params!.id);
      if (!result.success) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.notFound('Order')));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success({ message: '删除成功' })));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });
}

/**
 * 解析请求体
 */
function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

