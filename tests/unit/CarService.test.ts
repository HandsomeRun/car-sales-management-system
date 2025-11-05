/**
 * CarService 单元测试
 * @author 张起灵 (测试工程师)
 * @date 2025-10-19
 */

import assert from 'assert';
import { test } from 'node:test';
import { CarService } from '../../src/service/CarService';

const carService = new CarService();

test('CarService - 创建汽车', async () => {
  const carData = {
    brand: '测试品牌',
    model: '测试型号',
    year: 2024,
    price: 100000,
    color: '测试颜色',
    stock: 10,
    description: '测试描述',
  };

  const result = await carService.createCar(carData);
  
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data?.brand, carData.brand);
  assert.strictEqual(result.data?.model, carData.model);
  assert.strictEqual(result.data?.stock, carData.stock);
});

test('CarService - 创建汽车（验证失败）', async () => {
  const invalidData = {
    brand: '',  // 空品牌应该失败
    model: '测试型号',
    year: 2024,
    price: 100000,
    color: '测试颜色',
    stock: 10,
  };

  const result = await carService.createCar(invalidData);
  
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

test('CarService - 获取所有汽车', async () => {
  const cars = await carService.getAllCars();
  
  assert.ok(Array.isArray(cars));
  assert.ok(cars.length >= 0);
});

test('CarService - 检查库存', async () => {
  // 创建测试汽车
  const carData = {
    brand: '库存测试',
    model: '型号',
    year: 2024,
    price: 50000,
    color: '白色',
    stock: 5,
  };

  const createResult = await carService.createCar(carData);
  assert.strictEqual(createResult.success, true);

  const carId = createResult.data!.id;

  // 测试库存充足
  const hasStock = await carService.checkStock(carId, 3);
  assert.strictEqual(hasStock, true);

  // 测试库存不足
  const hasNoStock = await carService.checkStock(carId, 10);
  assert.strictEqual(hasNoStock, false);
});

console.log('CarService 单元测试完成！');

