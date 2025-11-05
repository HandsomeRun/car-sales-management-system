/**
 * 订单业务逻辑层
 * @author 白凝冰 (后端开发)
 * @date 2025-10-18
 */

import { Order, CreateOrderDTO, UpdateOrderDTO } from '../types/Order';
import { OrderDAO } from '../dao/OrderDAO';
import { CarService } from './CarService';
import { Validator } from '../utils/validator';

export class OrderService {
  private orderDAO: OrderDAO;
  private carService: CarService;

  constructor() {
    this.orderDAO = new OrderDAO();
    this.carService = new CarService();
  }

  public async getAllOrders(): Promise<Order[]> {
    return this.orderDAO.findAll();
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return this.orderDAO.findById(id);
  }

  public async getOrdersByStatus(status: string): Promise<Order[]> {
    return this.orderDAO.findByStatus(status);
  }

  public async createOrder(dto: CreateOrderDTO): Promise<{ success: boolean; data?: Order; error?: string }> {
    const validation = Validator.validateCreateOrder(dto);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    const car = await this.carService.getCarById(dto.carId);
    if (!car) {
      return { success: false, error: '汽车不存在' };
    }

    const hasStock = await this.carService.checkStock(dto.carId, dto.quantity);
    if (!hasStock) {
      return { success: false, error: '库存不足或汽车不可用' };
    }

    try {
      const totalPrice = car.price * dto.quantity;
      const order = this.orderDAO.create(dto, totalPrice);
      await this.carService.decreaseStock(dto.carId, dto.quantity);

      return { success: true, data: order };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async updateOrderStatus(id: string, status: string): Promise<{ success: boolean; data?: Order; error?: string }> {
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return { success: false, error: '无效的订单状态' };
    }

    try {
      if (status === 'cancelled') {
        const order = this.orderDAO.findById(id);
        if (order && order.status !== 'cancelled') {
          await this.carService.increaseStock(order.carId, order.quantity);
        }
      }

      const order = this.orderDAO.update(id, { status: status as any });
      if (!order) {
        return { success: false, error: '订单不存在' };
      }

      return { success: true, data: order };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public async deleteOrder(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const order = this.orderDAO.findById(id);
      if (order && order.status !== 'cancelled' && order.status !== 'completed') {
        await this.carService.increaseStock(order.carId, order.quantity);
      }

      const result = this.orderDAO.delete(id);
      if (!result) {
        return { success: false, error: '订单不存在' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

