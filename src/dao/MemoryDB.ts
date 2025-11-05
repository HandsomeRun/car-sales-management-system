/**
 * 内存数据库 - 使用数组模拟数据存储
 * @author 白凝冰 (后端开发)
 * @date 2025-10-17
 */

import { Car } from '../types/Car';
import { Order } from '../types/Order';

export class MemoryDB {
  private static instance: MemoryDB;

  // 数据存储
  private cars: Car[] = [];
  private orders: Order[] = [];

  // 单例模式
  private constructor() {
    this.initSampleData();
  }

  public static getInstance(): MemoryDB {
    if (!MemoryDB.instance) {
      MemoryDB.instance = new MemoryDB();
    }
    return MemoryDB.instance;
  }

  /**
   * 初始化示例数据
   */
  private initSampleData(): void {
    // 添加示例汽车数据
    const sampleCars: Car[] = [
      {
        id: 'car-001',
        brand: '奔驰',
        model: 'E300L',
        year: 2024,
        price: 520000,
        color: '曜岩黑',
        stock: 5,
        status: 'available',
        description: '豪华商务轿车，配置全面',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
      {
        id: 'car-002',
        brand: '宝马',
        model: '530Li',
        year: 2024,
        price: 485000,
        color: '矿石白',
        stock: 3,
        status: 'available',
        description: '运动豪华轿车',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
      {
        id: 'car-003',
        brand: '奥迪',
        model: 'A6L',
        year: 2024,
        price: 425000,
        color: '曼哈顿灰',
        stock: 8,
        status: 'available',
        description: '科技感十足的行政轿车',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
      {
        id: 'car-004',
        brand: '特斯拉',
        model: 'Model 3',
        year: 2024,
        price: 299000,
        color: '珍珠白',
        stock: 12,
        status: 'available',
        description: '智能电动轿车',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
      {
        id: 'car-005',
        brand: '比亚迪',
        model: '汉 EV',
        year: 2024,
        price: 269800,
        color: '赤帝红',
        stock: 15,
        status: 'available',
        description: '旗舰电动轿车',
        createdAt: new Date('2025-10-15'),
        updatedAt: new Date('2025-10-15'),
      },
    ];

    this.cars.push(...sampleCars);
  }

  // ========== Car 数据操作 ==========
  
  public getCars(): Car[] {
    return this.cars;
  }

  public addCar(car: Car): void {
    this.cars.push(car);
  }

  public updateCar(index: number, car: Car): void {
    this.cars[index] = car;
  }

  public deleteCar(index: number): void {
    this.cars.splice(index, 1);
  }

  // ========== Order 数据操作 ==========
  
  public getOrders(): Order[] {
    return this.orders;
  }

  public addOrder(order: Order): void {
    this.orders.push(order);
  }

  public updateOrder(index: number, order: Order): void {
    this.orders[index] = order;
  }

  public deleteOrder(index: number): void {
    this.orders.splice(index, 1);
  }

  // ========== 统计信息 ==========
  
  public getStats() {
    return {
      totalCars: this.cars.length,
      availableCars: this.cars.filter(c => c.status === 'available').length,
      totalOrders: this.orders.length,
      pendingOrders: this.orders.filter(o => o.status === 'pending').length,
    };
  }
}

