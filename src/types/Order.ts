/**
 * 订单类型定义
 * @author 季博达 (后端开发)
 * @date 2025-10-18
 */

export interface Order {
  id: string;                                      // 订单ID
  carId: string;                                   // 汽车ID
  customerName: string;                            // 客户姓名
  customerPhone: string;                           // 客户电话
  customerEmail: string;                           // 客户邮箱
  quantity: number;                                // 购买数量
  totalPrice: number;                              // 总价
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';  // 订单状态
  orderDate: Date;                                 // 下单时间
  notes?: string;                                  // 备注（可选）
  createdAt: Date;                                 // 创建时间
  updatedAt: Date;                                 // 更新时间
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateOrderDTO {
  carId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  quantity: number;
  notes?: string;
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  notes?: string;
}

