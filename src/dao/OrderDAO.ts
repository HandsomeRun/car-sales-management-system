/**
 * 订单数据访问对象
 * @author 季博达 (后端开发)
 * @date 2025-10-18
 */

import { Order, CreateOrderDTO, UpdateOrderDTO } from '../types/Order';
import { MemoryDB } from './MemoryDB';
import { randomUUID } from 'crypto';

export class OrderDAO {
  private db: MemoryDB;
  private orderIndex: Map<string, number>; // ID -> 数组索引的映射

  constructor() {
    this.db = MemoryDB.getInstance();
    this.orderIndex = new Map();
    this.rebuildIndex();
  }

  /**
   * 重建索引
   */
  private rebuildIndex(): void {
    const orders = this.db.getOrders();
    this.orderIndex.clear();
    orders.forEach((order, index) => {
      this.orderIndex.set(order.id, index);
    });
  }

  /**
   * 查询所有订单
   */
  public findAll(): Order[] {
    return this.db.getOrders();
  }

  /**
   * 根据 ID 查询订单
   */
  public findById(id: string): Order | null {
    const index = this.orderIndex.get(id);
    if (index === undefined) return null;
    return this.db.getOrders()[index] || null;
  }

  /**
   * 根据汽车 ID 查询订单
   */
  public findByCarId(carId: string): Order[] {
    return this.db.getOrders().filter(order => order.carId === carId);
  }

  /**
   * 根据状态查询订单
   */
  public findByStatus(status: string): Order[] {
    return this.db.getOrders().filter(order => order.status === status);
  }

  /**
   * 创建订单
   */
  public create(dto: CreateOrderDTO, totalPrice: number): Order {
    const newOrder: Order = {
      id: randomUUID(),
      ...dto,
      totalPrice,
      status: 'pending',
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.db.addOrder(newOrder);
    this.orderIndex.set(newOrder.id, this.db.getOrders().length - 1);

    return newOrder;
  }

  /**
   * 更新订单
   */
  public update(id: string, dto: UpdateOrderDTO): Order | null {
    const index = this.orderIndex.get(id);
    if (index === undefined) return null;

    const orders = this.db.getOrders();
    const existingOrder = orders[index];
    if (!existingOrder) return null;

    const updatedOrder: Order = {
      ...existingOrder,
      ...dto,
      updatedAt: new Date(),
    };

    this.db.updateOrder(index, updatedOrder);
    return updatedOrder;
  }

  /**
   * 删除订单
   */
  public delete(id: string): boolean {
    const index = this.orderIndex.get(id);
    if (index === undefined) return false;

    this.db.deleteOrder(index);
    this.rebuildIndex();

    return true;
  }
}

