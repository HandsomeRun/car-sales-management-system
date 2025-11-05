/**
 * OrderService 单元测试
 * @author 张起灵 (测试工程师)
 * @date 2025-10-19
 */

import assert from 'assert';
import { test } from 'node:test';
import { OrderService } from '../../src/service/OrderService';
import { CarService } from '../../src/service/CarService';

const orderService = new OrderService();
const carService = new CarService();

test('OrderService - 创建订单', async () => {
  // 先创建一个测试汽车
  const carResult = await carService.createCar({
    brand: '订单测试',
    model: '型号A',
    year: 2024,
    price: 200000,
    color: '黑色',
    stock: 5,
  });

  assert.strictEqual(carResult.success, true);
  const carId = carResult.data!.id;

  // 创建订单
  const orderData = {
    carId,
    customerName: '张三',
    customerPhone: '13800138000',
    customerEmail: 'zhangsan@example.com',
    quantity: 2,
    notes: '测试订单',
  };

  const result = await orderService.createOrder(orderData);
  
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data?.customerName, orderData.customerName);
  assert.strictEqual(result.data?.quantity, orderData.quantity);
  assert.strictEqual(result.data?.totalPrice, 200000 * 2);
  assert.strictEqual(result.data?.status, 'pending');
});

test('OrderService - 创建订单（库存不足）', async () => {
  // 创建一个库存为1的汽车
  const carResult = await carService.createCar({
    brand: '库存测试',
    model: '型号B',
    year: 2024,
    price: 150000,
    color: '白色',
    stock: 1,
  });

  const carId = carResult.data!.id;

  // 尝试购买2个（库存不足）
  const orderData = {
    carId,
    customerName: '李四',
    customerPhone: '13900139000',
    customerEmail: 'lisi@example.com',
    quantity: 2,
  };

  const result = await orderService.createOrder(orderData);
  
  assert.strictEqual(result.success, false);
  assert.ok(result.error?.includes('库存'));
});

test('OrderService - 获取所有订单', async () => {
  const orders = await orderService.getAllOrders();
  
  assert.ok(Array.isArray(orders));
});

console.log('OrderService 单元测试完成！');

