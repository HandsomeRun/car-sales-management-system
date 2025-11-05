/**
 * 汽车数据访问对象
 * @author 白凝冰 (后端开发)
 * @date 2025-10-17
 */

import { Car, CreateCarDTO, UpdateCarDTO } from '../types/Car';
import { MemoryDB } from './MemoryDB';
import { randomUUID } from 'crypto';

export class CarDAO {
  private db: MemoryDB;
  private carIndex: Map<string, number>; // ID -> 数组索引的映射

  constructor() {
    this.db = MemoryDB.getInstance();
    this.carIndex = new Map();
    this.rebuildIndex();
  }

  /**
   * 重建索引
   */
  private rebuildIndex(): void {
    const cars = this.db.getCars();
    this.carIndex.clear();
    cars.forEach((car, index) => {
      this.carIndex.set(car.id, index);
    });
  }

  /**
   * 查询所有汽车
   */
  public findAll(): Car[] {
    return this.db.getCars();
  }

  /**
   * 根据 ID 查询汽车（O(1) 查询）
   */
  public findById(id: string): Car | null {
    const index = this.carIndex.get(id);
    if (index === undefined) return null;
    return this.db.getCars()[index] || null;
  }

  /**
   * 根据条件查询
   */
  public findByCondition(condition: Partial<Car>): Car[] {
    const cars = this.db.getCars();
    return cars.filter(car => {
      return Object.keys(condition).every(key => {
        const conditionKey = key as keyof Car;
        return car[conditionKey] === condition[conditionKey];
      });
    });
  }

  /**
   * 创建汽车
   */
  public create(dto: CreateCarDTO): Car {
    const newCar: Car = {
      id: randomUUID(),
      ...dto,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addCar(newCar);
    this.carIndex.set(newCar.id, this.db.getCars().length - 1);

    return newCar;
  }

  /**
   * 更新汽车
   */
  public update(id: string, dto: UpdateCarDTO): Car | null {
    const index = this.carIndex.get(id);
    if (index === undefined) return null;

    const cars = this.db.getCars();
    const existingCar = cars[index];
    if (!existingCar) return null;

    const updatedCar: Car = {
      ...existingCar,
      ...dto,
      updatedAt: new Date(),
    };

    this.db.updateCar(index, updatedCar);
    return updatedCar;
  }

  /**
   * 删除汽车
   */
  public delete(id: string): boolean {
    const index = this.carIndex.get(id);
    if (index === undefined) return false;

    this.db.deleteCar(index);
    this.rebuildIndex(); // 重建索引

    return true;
  }

  /**
   * 减少库存
   */
  public decreaseStock(id: string, quantity: number): boolean {
    const index = this.carIndex.get(id);
    if (index === undefined) return false;

    const cars = this.db.getCars();
    const car = cars[index];
    if (!car || car.stock < quantity) return false;

    car.stock -= quantity;
    car.updatedAt = new Date();
    
    if (car.stock === 0) {
      car.status = 'sold';
    }

    this.db.updateCar(index, car);
    return true;
  }

  /**
   * 增加库存
   */
  public increaseStock(id: string, quantity: number): boolean {
    const index = this.carIndex.get(id);
    if (index === undefined) return false;

    const cars = this.db.getCars();
    const car = cars[index];
    if (!car) return false;

    car.stock += quantity;
    car.updatedAt = new Date();
    
    if (car.stock > 0 && car.status === 'sold') {
      car.status = 'available';
    }

    this.db.updateCar(index, car);
    return true;
  }
}

