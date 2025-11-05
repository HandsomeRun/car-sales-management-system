/**
 * 数据验证工具
 * @author 柳如烟 (后端开发 Lead)
 * @date 2025-10-17
 */

import { CreateCarDTO, UpdateCarDTO } from '../types/Car';
import { CreateOrderDTO } from '../types/Order';

export class Validator {
  /**
   * 验证汽车创建数据
   */
  static validateCreateCar(dto: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.brand || typeof dto.brand !== 'string' || dto.brand.trim() === '') {
      errors.push('品牌不能为空');
    }

    if (!dto.model || typeof dto.model !== 'string' || dto.model.trim() === '') {
      errors.push('型号不能为空');
    }

    if (!dto.year || typeof dto.year !== 'number' || dto.year < 1900 || dto.year > 2100) {
      errors.push('年份必须是 1900-2100 之间的数字');
    }

    if (!dto.price || typeof dto.price !== 'number' || dto.price <= 0) {
      errors.push('价格必须大于 0');
    }

    if (!dto.color || typeof dto.color !== 'string' || dto.color.trim() === '') {
      errors.push('颜色不能为空');
    }

    if (dto.stock === undefined || typeof dto.stock !== 'number' || dto.stock < 0) {
      errors.push('库存必须是非负数');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证汽车更新数据
   */
  static validateUpdateCar(dto: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (dto.brand !== undefined && (typeof dto.brand !== 'string' || dto.brand.trim() === '')) {
      errors.push('品牌不能为空');
    }

    if (dto.model !== undefined && (typeof dto.model !== 'string' || dto.model.trim() === '')) {
      errors.push('型号不能为空');
    }

    if (dto.year !== undefined && (typeof dto.year !== 'number' || dto.year < 1900 || dto.year > 2100)) {
      errors.push('年份必须是 1900-2100 之间的数字');
    }

    if (dto.price !== undefined && (typeof dto.price !== 'number' || dto.price <= 0)) {
      errors.push('价格必须大于 0');
    }

    if (dto.stock !== undefined && (typeof dto.stock !== 'number' || dto.stock < 0)) {
      errors.push('库存必须是非负数');
    }

    if (dto.status !== undefined && !['available', 'sold', 'reserved'].includes(dto.status)) {
      errors.push('状态必须是 available、sold 或 reserved');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证订单创建数据
   */
  static validateCreateOrder(dto: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dto.carId || typeof dto.carId !== 'string' || dto.carId.trim() === '') {
      errors.push('汽车ID不能为空');
    }

    if (!dto.customerName || typeof dto.customerName !== 'string' || dto.customerName.trim() === '') {
      errors.push('客户姓名不能为空');
    }

    if (!dto.customerPhone || typeof dto.customerPhone !== 'string' || !this.isValidPhone(dto.customerPhone)) {
      errors.push('客户电话格式不正确');
    }

    if (!dto.customerEmail || typeof dto.customerEmail !== 'string' || !this.isValidEmail(dto.customerEmail)) {
      errors.push('客户邮箱格式不正确');
    }

    if (!dto.quantity || typeof dto.quantity !== 'number' || dto.quantity <= 0) {
      errors.push('购买数量必须大于 0');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 验证电话号码
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 验证邮箱
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

