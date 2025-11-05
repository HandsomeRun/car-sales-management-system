/**
 * 汽车管理路由
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { IncomingMessage } from 'http';
import { Router } from './index';
import { CarService } from '../service/CarService';
import { ResponseUtil } from '../utils/response';
import { CreateCarDTO, UpdateCarDTO } from '../types/Car';

const carService = new CarService();

export function registerCarRoutes(router: Router): void {
  /**
   * 获取所有汽车
   * GET /api/cars
   */
  router.get('/api/cars', async (_req, res) => {
    try {
      const cars = await carService.getAllCars();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(cars)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 根据 ID 获取汽车
   * GET /api/cars/:id
   */
  router.get('/api/cars/:id', async (_req, res, params) => {
    try {
      const car = await carService.getCarById(params!.id);
      if (!car) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.notFound('Car')));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.success(car)));
    } catch (error: any) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(ResponseUtil.internalError(error.message)));
    }
  });

  /**
   * 创建汽车
   * POST /api/cars
   */
  router.post('/api/cars', async (req, res) => {
    try {
      const body = await parseBody(req);
      const dto: CreateCarDTO = JSON.parse(body);

      const result = await carService.createCar(dto);
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
   * 更新汽车
   * PUT /api/cars/:id
   */
  router.put('/api/cars/:id', async (req, res, params) => {
    try {
      const body = await parseBody(req);
      const dto: UpdateCarDTO = JSON.parse(body);

      const result = await carService.updateCar(params!.id, dto);
      if (!result.success) {
        const statusCode = result.error === '汽车不存在' ? 404 : 400;
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
   * 删除汽车
   * DELETE /api/cars/:id
   */
  router.delete('/api/cars/:id', async (_req, res, params) => {
    try {
      const result = await carService.deleteCar(params!.id);
      if (!result.success) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(ResponseUtil.notFound('Car')));
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

