/**
 * 汽车业务逻辑层
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { Car, CreateCarDTO, UpdateCarDTO } from '../types/Car';
import { CarDAO } from '../dao/CarDAO';
import { Validator } from '../utils/validator';

export class CarService {
  private carDAO: CarDAO;

  constructor() {
    this.carDAO = new CarDAO();
  }

  /**
   * 获取所有汽车
   */
  public async getAllCars(): Promise<Car[]> {
    return this.carDAO.findAll();
  }

  /**
   * 根据 ID 获取汽车
   */
  public async getCarById(id: string): Promise<Car | null> {
    return this.carDAO.findById(id);
  }

  /**
   * 根据品牌查询汽车
   */
  public async getCarsByBrand(brand: string): Promise<Car[]> {
    return this.carDAO.findByCondition({ brand });
  }

  /**
   * 根据状态查询汽车
   */
  public async getCarsByStatus(status: 'available' | 'sold' | 'reserved'): Promise<Car[]> {
    return this.carDAO.findByCondition({ status });
  }

  /**
   * 创建汽车
   */
  public async createCar(dto: CreateCarDTO): Promise<{ success: boolean; data?: Car; error?: string }> {
    // 数据验证
    const validation = Validator.validateCreateCar(dto);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    try {
      const car = this.carDAO.create(dto);
      return { success: true, data: car };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 更新汽车
   */
  public async updateCar(id: string, dto: UpdateCarDTO): Promise<{ success: boolean; data?: Car; error?: string }> {
    // 数据验证
    const validation = Validator.validateUpdateCar(dto);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    try {
      const car = this.carDAO.update(id, dto);
      if (!car) {
        return { success: false, error: '汽车不存在' };
      }
      return { success: true, data: car };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 删除汽车
   */
  public async deleteCar(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = this.carDAO.delete(id);
      if (!result) {
        return { success: false, error: '汽车不存在' };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 检查库存
   */
  public async checkStock(carId: string, quantity: number): Promise<boolean> {
    const car = this.carDAO.findById(carId);
    if (!car) return false;
    return car.stock >= quantity && car.status === 'available';
  }

  /**
   * 减少库存
   */
  public async decreaseStock(carId: string, quantity: number): Promise<boolean> {
    return this.carDAO.decreaseStock(carId, quantity);
  }

  /**
   * 增加库存
   */
  public async increaseStock(carId: string, quantity: number): Promise<boolean> {
    return this.carDAO.increaseStock(carId, quantity);
  }
}

