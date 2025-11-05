/**
 * 汽车类型定义
 * @author 白凝冰 (后端开发)
 * @date 2025-10-17
 */

export interface Car {
  id: string;                                      // 汽车ID（UUID）
  brand: string;                                   // 品牌
  model: string;                                   // 型号
  year: number;                                    // 年份
  price: number;                                   // 价格（元）
  color: string;                                   // 颜色
  stock: number;                                   // 库存数量
  status: 'available' | 'sold' | 'reserved';       // 状态
  description?: string;                            // 描述（可选）
  createdAt: Date;                                 // 创建时间
  updatedAt: Date;                                 // 更新时间
}

export type CarStatus = 'available' | 'sold' | 'reserved';

export interface CreateCarDTO {
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  stock: number;
  description?: string;
}

export interface UpdateCarDTO {
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  color?: string;
  stock?: number;
  status?: CarStatus;
  description?: string;
}

